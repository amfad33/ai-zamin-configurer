package main

import (
	"fmt"
	"net"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"
	"time"
)

func TestBrowserFixture(t *testing.T) {
	if os.Getenv("AIZAMIN_BROWSER_FIXTURE") != "1" {
		t.Skip("manual isolated browser fixture")
	}
	home := t.TempDir()
	t.Setenv("CODEX_HOME", home)
	t.Setenv("XDG_CONFIG_HOME", home)
	listener, err := net.Listen("tcp4", "127.0.0.1:18770")
	if err != nil {
		t.Fatal(err)
	}
	defer listener.Close()
	s := &localSession{host: "127.0.0.1:18770", capability: "synthetic-browser-capability", expires: time.Now().Add(10 * time.Minute), site: "http://127.0.0.1:18769", client: &http.Client{Timeout: 10 * time.Second}}
	fmt.Println("Synthetic local UI: http://127.0.0.1:18770/#synthetic-browser-capability")
	server := &http.Server{Handler: s}
	time.AfterFunc(9*time.Minute, func() { server.Close() })
	server.Serve(listener)
}

func TestCodingCatalogFilter(t *testing.T) {
	if codingModel("groq/whisper-large-v3") || codingModel("whisper-large-v3-turbo") || !codingModel("future-model") {
		t.Fatal("coding catalog filter")
	}
}

func TestEmbeddedPayloadParity(t *testing.T) {
	for _, app := range []string{"codex", "opencode", "hermes"} {
		p, err := templatePayload(app, "synthetic-current-key")
		if err != nil || p.Key != "synthetic-current-key" || p.App != app {
			t.Fatal("embedded payload mismatch")
		}
		if app == "opencode" && p.Provider["options"].(map[string]any)["apiKey"] != "synthetic-current-key" {
			t.Fatal("provider credential mismatch")
		}
	}
}

func TestLocalSessionBoundary(t *testing.T) {
	s := &localSession{host: "127.0.0.1:4567", capability: "test-capability", expires: time.Now().Add(time.Minute)}
	for _, tc := range []struct {
		host, origin, token string
		want                int
	}{
		{"evil.test", "", "test-capability", 403},
		{s.host, "https://evil.test", "test-capability", 403},
		{s.host, "http://" + s.host, "wrong", 403},
		{s.host, "http://" + s.host, s.capability, 409},
	} {
		r := httptest.NewRequest(http.MethodPost, "http://"+tc.host+"/apply", strings.NewReader(`{"app":"codex"}`))
		r.Host = tc.host
		r.Header.Set("Origin", tc.origin)
		r.Header.Set("X-AIZamin-Capability", tc.token)
		w := httptest.NewRecorder()
		s.ServeHTTP(w, r)
		if w.Code != tc.want {
			t.Fatalf("boundary got %d want %d", w.Code, tc.want)
		}
	}
}
