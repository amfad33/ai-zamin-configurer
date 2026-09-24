package main

import (
	"encoding/binary"
	"encoding/json"
	"os"
	"path/filepath"
	"testing"
)

func TestInvalidOpenCodeDoesNotOverwrite(t *testing.T) {
	home := t.TempDir()
	t.Setenv("XDG_CONFIG_HOME", home)
	dir := filepath.Join(home, "opencode")
	os.MkdirAll(dir, 0700)
	path := filepath.Join(dir, "opencode.jsonc")
	original := []byte(`{"provider": broken}`)
	os.WriteFile(path, original, 0600)
	if err := configureOpenCode(Payload{Key: "fake", Provider: map[string]any{}}); err == nil {
		t.Fatal("invalid config accepted")
	}
	after, _ := os.ReadFile(path)
	if string(after) != string(original) {
		t.Fatal("invalid config overwritten")
	}
}

func TestPayloadAndOpenCodeMerge(t *testing.T) {
	home := t.TempDir()
	t.Setenv("XDG_CONFIG_HOME", home)
	dir := filepath.Join(home, "opencode")
	os.MkdirAll(dir, 0700)
	file := filepath.Join(dir, "opencode.jsonc")
	original := []byte(`{//keep settings
 "model":"other/model", "provider":{"other":{"options":{"baseURL":"https://example.com//api"}}}, "agent":{"build":{"options":{"temperature":0.4}}},}`)
	os.WriteFile(file, original, 0600)
	p := Payload{Version: 1, App: "opencode", Key: "fake-test-key", Model: "gpt-5.5", Provider: map[string]any{"models": map[string]any{"gpt-5.5": map[string]any{"attachment": true}}}, Tool: "test native TS fixture"}
	data, _ := json.Marshal(p)
	suffix := make([]byte, 8)
	binary.LittleEndian.PutUint64(suffix, uint64(len(data)))
	artifact := append(append(append([]byte("binary fixture"), data...), suffix...), []byte(footer)...)
	parsed, err := readPayload(artifact)
	if err != nil {
		t.Fatal(err)
	}
	if err = configureOpenCode(parsed); err != nil {
		t.Fatal(err)
	}
	b, _ := os.ReadFile(file)
	var got map[string]any
	if err = json.Unmarshal(b, &got); err != nil {
		t.Fatal(err)
	}
	if got["model"] != "other/model" || got["provider"].(map[string]any)["other"] == nil {
		t.Fatal("existing config lost")
	}
	if got["provider"].(map[string]any)["openai"].(map[string]any)["name"] != "aizamin" {
		t.Fatal("managed provider display name missing")
	}
	if got["agent"].(map[string]any)["build"].(map[string]any)["options"].(map[string]any)["temperature"] != 0.4 {
		t.Fatal("agent settings lost")
	}
	backups, _ := filepath.Glob(file + ".aizamin.backup.*")
	if len(backups) != 1 {
		t.Fatal("backup missing")
	}
	saved, _ := os.ReadFile(backups[0])
	if string(saved) != string(original) {
		t.Fatal("backup changed")
	}
	if _, err = os.Stat(filepath.Join(dir, "tools", "aizamin_image.ts")); err != nil {
		t.Fatal(err)
	}
	for _, bad := range [][]byte{nil, artifact[:len(artifact)-1], append([]byte("bad"), []byte(footer)...)} {
		if _, err = readPayload(bad); err == nil {
			t.Fatal("bad payload accepted")
		}
	}
}
