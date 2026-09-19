package main

import (
	"bufio"
	"bytes"
	"crypto/rand"
	"encoding/base64"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"net/textproto"
	"os"
	"path/filepath"
	"strings"
	"time"
)

var imageEndpoint = endpoint // overridden only by in-process mock tests; no user endpoint override.
type imageArgs struct {
	Prompt          string   `json:"prompt"`
	OutputDirectory string   `json:"output_directory"`
	ReferenceImages []string `json:"reference_images"`
}

func serveMCP(input io.Reader, output io.Writer) {
	scanner := bufio.NewScanner(input)
	scanner.Buffer(make([]byte, 4096), 1<<20)
	encoder := json.NewEncoder(output)
	for scanner.Scan() {
		var r struct {
			ID     json.RawMessage `json:"id"`
			Method string          `json:"method"`
			Params struct {
				ProtocolVersion string    `json:"protocolVersion"`
				Name            string    `json:"name"`
				Arguments       imageArgs `json:"arguments"`
			} `json:"params"`
		}
		if json.Unmarshal(scanner.Bytes(), &r) != nil {
			encoder.Encode(map[string]any{"jsonrpc": "2.0", "id": nil, "error": map[string]any{"code": -32700, "message": "Invalid JSON"}})
			continue
		}
		if len(r.ID) == 0 {
			continue
		}
		reply := map[string]any{"jsonrpc": "2.0", "id": r.ID}
		var result any
		switch r.Method {
		case "initialize":
			v := r.Params.ProtocolVersion
			if v == "" {
				v = "2024-11-05"
			}
			result = map[string]any{"protocolVersion": v, "capabilities": map[string]any{"tools": map[string]any{}}, "serverInfo": map[string]string{"name": "aizamin-image", "version": "2.0.0"}, "instructions": "Use aizamin_image for GPT Image 2.5 Flare generation or editing. Paid API calls. Report failures; never substitute SVG or claim a nonexistent image."}
		case "ping":
			result = map[string]any{}
		case "tools/list":
			result = map[string]any{"tools": []any{map[string]any{"name": "aizamin_image", "description": "Generate or edit a real PNG with AI Zamin GPT Image 2.5 Flare. Uses paid API credit. No SVG fallback.", "inputSchema": map[string]any{"type": "object", "properties": map[string]any{"prompt": map[string]any{"type": "string", "minLength": 1}, "output_directory": map[string]any{"type": "string", "description": "Absolute project directory"}, "reference_images": map[string]any{"type": "array", "maxItems": 4, "items": map[string]string{"type": "string"}, "description": "Absolute local PNG/JPEG/WebP paths; max 10 MiB each, 20 MiB total"}}, "required": []string{"prompt", "output_directory"}, "additionalProperties": false}}}}
		case "tools/call":
			text := ""
			var err error
			if r.Params.Name != "aizamin_image" {
				err = errors.New("unknown tool")
			} else {
				text, err = generateImage(r.Params.Arguments, os.Getenv("AIZAMIN_IMAGE_KEY"))
			}
			if err != nil {
				text = err.Error()
			}
			result = map[string]any{"content": []any{map[string]string{"type": "text", "text": text}}, "isError": err != nil}
		default:
			reply["error"] = map[string]any{"code": -32601, "message": "Method not found"}
		}
		if result != nil {
			reply["result"] = result
		}
		encoder.Encode(reply)
	}
}
func imageKind(b []byte) string {
	if len(b) >= 45 && bytes.Equal(b[:8], []byte{137, 80, 78, 71, 13, 10, 26, 10}) && string(b[12:16]) == "IHDR" && string(b[len(b)-8:len(b)-4]) == "IEND" {
		return "png"
	}
	if len(b) >= 12 && bytes.Equal(b[:3], []byte{255, 216, 255}) && bytes.Equal(b[len(b)-2:], []byte{255, 217}) {
		return "jpeg"
	}
	if len(b) >= 12 && string(b[:4]) == "RIFF" && string(b[8:12]) == "WEBP" {
		return "webp"
	}
	return ""
}
func generateImage(a imageArgs, key string) (string, error) {
	if strings.TrimSpace(a.Prompt) == "" {
		return "", errors.New("a non-empty image prompt is required")
	}
	if key == "" {
		return "", errors.New("re-run AI Zamin setup to configure an image API key")
	}
	if !filepath.IsAbs(a.OutputDirectory) {
		return "", errors.New("output_directory must be an absolute project path")
	}
	if len(a.ReferenceImages) > 4 {
		return "", errors.New("at most 4 reference images are allowed")
	}
	fields := map[string]any{"model": "gpt-image-2.5-flare", "prompt": a.Prompt, "n": 1, "size": "1024x1024", "quality": "medium", "output_format": "png"}
	var body bytes.Buffer
	contentType := "application/json"
	route := "/images/generations"
	if len(a.ReferenceImages) > 0 {
		route = "/images/edits"
		writer := multipart.NewWriter(&body)
		total := 0
		for k, v := range fields {
			if err := writer.WriteField(k, fmt.Sprint(v)); err != nil {
				return "", err
			}
		}
		for _, path := range a.ReferenceImages {
			if !filepath.IsAbs(path) || strings.ContainsRune(path, 0) {
				return "", errors.New("references must be absolute local image paths")
			}
			stat, err := os.Stat(path)
			if err != nil || !stat.Mode().IsRegular() || stat.Size() < 12 || stat.Size() > 10<<20 {
				return "", errors.New("reference must be a regular image, at most 10 MiB")
			}
			f, err := os.Open(path)
			if err != nil {
				return "", errors.New("cannot read reference image")
			}
			b, err := io.ReadAll(io.LimitReader(f, (10<<20)+1))
			f.Close()
			if err != nil || len(b) > 10<<20 {
				return "", errors.New("cannot read reference image")
			}
			total += len(b)
			if total > 20<<20 {
				return "", errors.New("references exceed 20 MiB total")
			}
			kind := imageKind(b)
			if kind == "" {
				return "", errors.New("reference must be PNG, JPEG or WebP, not SVG or other data")
			}
			h := make(textproto.MIMEHeader)
			h.Set("Content-Disposition", `form-data; name="image[]"; filename="reference.`+kind+`"`)
			h.Set("Content-Type", "image/"+kind)
			part, err := writer.CreatePart(h)
			if err != nil {
				return "", err
			}
			if _, err = part.Write(b); err != nil {
				return "", err
			}
		}
		if err := writer.Close(); err != nil {
			return "", err
		}
		contentType = writer.FormDataContentType()
	} else {
		if err := json.NewEncoder(&body).Encode(fields); err != nil {
			return "", err
		}
	}
	request, err := http.NewRequest("POST", imageEndpoint+route, &body)
	if err != nil {
		return "", err
	}
	request.Header.Set("Authorization", "Bearer "+key)
	request.Header.Set("Content-Type", contentType)
	client := http.Client{Timeout: 300 * time.Second, CheckRedirect: func(*http.Request, []*http.Request) error { return http.ErrUseLastResponse }}
	response, err := client.Do(request)
	if err != nil {
		return "", errors.New("AI Zamin image request failed; no image generated")
	}
	defer response.Body.Close()
	if response.StatusCode < 200 || response.StatusCode >= 300 {
		return "", fmt.Errorf("AI Zamin image generation failed (HTTP %d); check credit/model access", response.StatusCode)
	}
	var result struct {
		Data []struct {
			B64 string `json:"b64_json"`
		} `json:"data"`
	}
	if err = json.NewDecoder(io.LimitReader(response.Body, 40<<20)).Decode(&result); err != nil || len(result.Data) == 0 || result.Data[0].B64 == "" {
		return "", errors.New("AI Zamin returned no valid image data")
	}
	b, err := base64.StdEncoding.DecodeString(result.Data[0].B64)
	if err != nil || imageKind(b) != "png" {
		return "", errors.New("AI Zamin returned an invalid PNG")
	}
	dir := filepath.Join(a.OutputDirectory, ".aizamin", "images")
	if err = os.MkdirAll(dir, 0700); err != nil {
		return "", err
	}
	id := make([]byte, 16)
	if _, err = rand.Read(id); err != nil {
		return "", err
	}
	path := filepath.Join(dir, hex.EncodeToString(id)+".png")
	f, err := os.OpenFile(path, os.O_WRONLY|os.O_CREATE|os.O_EXCL, 0600)
	if err != nil {
		return "", err
	}
	_, err = f.Write(b)
	closeErr := f.Close()
	if err != nil {
		return "", err
	}
	if closeErr != nil {
		return "", closeErr
	}
	return "Image saved to " + path + ". Open with Codex view_image to inspect the actual pixels before describing it.", nil
}
