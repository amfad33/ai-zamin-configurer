package main

import (
	"context"
	"crypto/rand"
	"embed"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net"
	"net/http"
	"net/url"
	"os/exec"
	"runtime"
	"strings"
	"sync"
	"time"
)

const version = "2.0.0"
const website = "https://aizamin.ir"

//go:embed embedded/* ui.html
var resources embed.FS

type localSession struct {
	sync.Mutex
	host, capability, key, status string
	expires                       time.Time
	busy                          bool
	client                        *http.Client
	site                          string
}

func (s *localSession) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Cache-Control", "no-store")
	w.Header().Set("Referrer-Policy", "no-referrer")
	w.Header().Set("X-Content-Type-Options", "nosniff")
	w.Header().Set("Content-Security-Policy", "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src 'self'; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'")
	if r.Host != s.host || time.Now().After(s.expires) {
		http.Error(w, "Session unavailable", 403)
		return
	}
	if r.Method == "GET" && (r.URL.Path == "/" || r.URL.Path == "/logo.png" || r.URL.Path == "/favicon.ico") {
		path := "ui.html"
		kind := "text/html; charset=utf-8"
		if r.URL.Path != "/" {
			path = "embedded" + r.URL.Path
			kind = "image/png"
			if r.URL.Path == "/favicon.ico" {
				kind = "image/x-icon"
			}
		}
		b, _ := resources.ReadFile(path)
		w.Header().Set("Content-Type", kind)
		w.Write(b)
		return
	}
	if r.Header.Get("X-AIZamin-Capability") != s.capability || r.Header.Get("Origin") != "http://"+s.host || r.Method != "POST" {
		http.Error(w, "Forbidden", 403)
		return
	}
	s.Lock()
	defer s.Unlock()
	w.Header().Set("Content-Type", "application/json")
	switch r.URL.Path {
	case "/status":
		json.NewEncoder(w).Encode(map[string]any{"ready": s.key != "", "status": s.status, "version": version})
	case "/login":
		if s.busy {
			http.Error(w, "Authorization already running", 409)
			return
		}
		var grant struct {
			ID    string `json:"id"`
			Token string `json:"token"`
		}
		if _, err := s.remote("start", url.Values{}, &grant); err != nil || grant.ID == "" || grant.Token == "" {
			http.Error(w, "Website unavailable. Retry.", 502)
			return
		}
		s.busy = true
		s.status = "Complete sign-in and select your key on AI Zamin."
		go s.poll(grant.ID, grant.Token)
		json.NewEncoder(w).Encode(map[string]string{"url": s.site + "/setup/?device=" + url.QueryEscape(grant.ID)})
	case "/apply":
		if s.key == "" {
			http.Error(w, "Sign in and select a key first", 409)
			return
		}
		var input struct {
			App string `json:"app"`
		}
		if json.NewDecoder(http.MaxBytesReader(w, r.Body, 1024)).Decode(&input) != nil {
			http.Error(w, "Invalid request", 400)
			return
		}
		if input.App != "codex" && input.App != "opencode" && input.App != "hermes" {
			http.Error(w, "Unsupported application", 400)
			return
		}
		p, err := templatePayload(input.App, s.key)
		if err == nil && input.App == "hermes" {
			refreshCatalog(&p, s.client)
		}
		if err == nil {
			err = applyPayload(p)
		}
		if err != nil {
			s.status = "Configuration failed: " + err.Error()
			http.Error(w, s.status, 500)
			return
		}
		s.status = "Configured. Restart the application and start a new session. Backups preserved."
		json.NewEncoder(w).Encode(map[string]string{"status": s.status})
	default:
		http.NotFound(w, r)
	}
}
func codingModel(id string) bool {
	name := strings.TrimPrefix(id, "groq/")
	return id != "" && !strings.ContainsAny(id, "\r\n\x00") && name != "whisper" && !strings.HasPrefix(name, "whisper-") && name != "distil-whisper" && !strings.HasPrefix(name, "distil-whisper-")
}
func refreshCatalog(p *Payload, client *http.Client) {
	// Preserve discovery from the original website generator; failures retain the bundled catalog.
	request, _ := http.NewRequest("GET", endpoint+"/models", nil)
	request.Header.Set("Authorization", "Bearer "+p.Key)
	response, err := client.Do(request)
	if err != nil {
		return
	}
	defer response.Body.Close()
	if response.StatusCode != 200 {
		return
	}
	var catalog struct {
		Data []struct {
			ID string `json:"id"`
		} `json:"data"`
	}
	if json.NewDecoder(io.LimitReader(response.Body, 4*1024*1024)).Decode(&catalog) != nil {
		return
	}
	models := map[string]any{}
	for _, item := range catalog.Data {
		if codingModel(item.ID) {
			value, ok := p.Catalog[item.ID]
			if !ok {
				value = map[string]any{}
			}
			models[item.ID] = value
		}
	}
	if len(models) > 0 {
		p.Catalog = models
		if _, ok := models[p.Model]; !ok {
			for _, item := range catalog.Data {
				if codingModel(item.ID) {
					p.Model = item.ID
					break
				}
			}
		}
	}
}
func templatePayload(app, key string) (Payload, error) {
	var p Payload
	b, err := resources.ReadFile("embedded/" + app + ".json")
	if err != nil {
		return p, err
	}
	if err = json.Unmarshal(b, &p); err != nil {
		return p, err
	}
	p.Key = key
	if app == "opencode" {
		p.Provider["options"].(map[string]any)["apiKey"] = key
	}
	return p, nil
}
func (s *localSession) remote(action string, form url.Values, out any) (int, error) {
	response, err := s.client.PostForm(s.site+"/api/configurer/"+action, form)
	if err != nil {
		return 0, errors.New("connection failed")
	}
	defer response.Body.Close()
	if response.StatusCode != 200 && response.StatusCode != 202 {
		return response.StatusCode, errors.New("authorization unavailable")
	}
	return response.StatusCode, json.NewDecoder(io.LimitReader(response.Body, 65536)).Decode(out)
}
func (s *localSession) poll(id, token string) {
	for time.Now().Before(s.expires) {
		time.Sleep(2 * time.Second)
		var result struct {
			Key string `json:"key"`
		}
		code, err := s.remote("poll", url.Values{"id": {id}, "token": {token}}, &result)
		if err != nil {
			s.Lock()
			s.busy = false
			s.status = "Authorization expired or unavailable. Try again."
			s.Unlock()
			return
		}
		if code == 200 {
			s.Lock()
			s.busy = false
			if strings.TrimSpace(result.Key) != "" && !strings.ContainsAny(result.Key, "\r\n\x00") {
				s.key = result.Key
				s.status = "Key authorized. Choose an application."
			}
			s.Unlock()
			return
		}
	}
}
func openBrowser(address string) error {
	var cmd *exec.Cmd
	switch runtime.GOOS {
	case "windows":
		cmd = exec.Command("rundll32", "url.dll,FileProtocolHandler", address)
	case "darwin":
		cmd = exec.Command("open", address)
	default:
		cmd = exec.Command("xdg-open", address)
	}
	return cmd.Start()
}
func runUI() error {
	listener, err := net.Listen("tcp4", "127.0.0.1:0")
	if err != nil {
		return err
	}
	defer listener.Close()
	token := make([]byte, 32)
	if _, err = rand.Read(token); err != nil {
		return err
	}
	s := &localSession{host: listener.Addr().String(), capability: hex.EncodeToString(token), expires: time.Now().Add(10 * time.Minute), site: website, status: "Sign in on AI Zamin to select your own API key.", client: &http.Client{Timeout: 20 * time.Second, CheckRedirect: func(*http.Request, []*http.Request) error { return http.ErrUseLastResponse }}}
	server := &http.Server{Handler: s, ReadHeaderTimeout: 5 * time.Second, ReadTimeout: 30 * time.Second, WriteTimeout: 60 * time.Second, IdleTimeout: 30 * time.Second, MaxHeaderBytes: 8192}
	address := "http://" + s.host + "/#" + s.capability
	fmt.Printf("AI Zamin Configurer %s\nOpen this private local session in your browser:\n%s\nSession closes in 10 minutes; close this window to quit.\n", version, address)
	_ = openBrowser(address)
	timer := time.AfterFunc(time.Until(s.expires), func() { server.Shutdown(context.Background()) })
	defer timer.Stop()
	err = server.Serve(listener)
	if errors.Is(err, http.ErrServerClosed) {
		return nil
	}
	return err
}
