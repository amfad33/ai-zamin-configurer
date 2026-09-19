package main

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestMCPGenerationAndEditingMockUpstream(t *testing.T) {
	// Explicit mock image API, never customer credentials or paid upstream calls.
	png, _ := base64.StdEncoding.DecodeString("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aX1cAAAAASUVORK5CYII=")
	calls := 0
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		calls++
		if r.Header.Get("Authorization") != "Bearer fake-test-key" {
			t.Error("wrong auth")
		}
		if strings.HasSuffix(r.URL.Path, "edits") {
			if e := r.ParseMultipartForm(30 << 20); e != nil {
				t.Error(e)
			}
			if r.FormValue("model") != "gpt-image-2.5-flare" || len(r.MultipartForm.File["image[]"]) != 1 {
				t.Error("edit payload")
			}
		} else {
			var p map[string]any
			json.NewDecoder(r.Body).Decode(&p)
			if p["model"] != "gpt-image-2.5-flare" {
				t.Error("wrong model")
			}
		}
		json.NewEncoder(w).Encode(map[string]any{"data": []any{map[string]string{"b64_json": base64.StdEncoding.EncodeToString(png)}}})
	}))
	defer server.Close()
	imageEndpoint = server.URL
	defer func() { imageEndpoint = endpoint }()
	t.Setenv("AIZAMIN_IMAGE_KEY", "fake-test-key")
	dir := t.TempDir()
	ref := filepath.Join(dir, "ref.png")
	os.WriteFile(ref, png, 0600)
	requests := []map[string]any{{"jsonrpc": "2.0", "id": 1, "method": "initialize"}, {"jsonrpc": "2.0", "method": "notifications/initialized"}, {"jsonrpc": "2.0", "id": 2, "method": "tools/list"}, {"jsonrpc": "2.0", "id": 3, "method": "tools/call", "params": map[string]any{"name": "aizamin_image", "arguments": map[string]any{"prompt": "mock generation", "output_directory": dir}}}, {"jsonrpc": "2.0", "id": 4, "method": "tools/call", "params": map[string]any{"name": "aizamin_image", "arguments": map[string]any{"prompt": "mock edit", "output_directory": dir, "reference_images": []string{ref}}}}}
	var input, output bytes.Buffer
	for _, r := range requests {
		json.NewEncoder(&input).Encode(r)
	}
	serveMCP(&input, &output)
	decoder := json.NewDecoder(&output)
	count := 0
	for {
		var r map[string]any
		if e := decoder.Decode(&r); e == io.EOF {
			break
		} else if e != nil {
			t.Fatal(e)
		}
		count++
		result := r["result"].(map[string]any)
		if result["isError"] == true {
			t.Fatal(result)
		}
	}
	if count != 4 || calls != 2 {
		t.Fatalf("replies=%d calls=%d", count, calls)
	}
	images, _ := filepath.Glob(filepath.Join(dir, ".aizamin/images/*.png"))
	if len(images) != 2 {
		t.Fatal("missing images")
	}
	for _, refs := range [][]string{{"https://example.org/x.png"}, {dir}, {ref, ref, ref, ref, ref}} {
		if _, e := generateImage(imageArgs{Prompt: "reject", OutputDirectory: dir, ReferenceImages: refs}, "fake-test-key"); e == nil {
			t.Fatal("bad reference accepted")
		}
	}
	if calls != 2 {
		t.Fatal("invalid references sent upstream")
	}
}
