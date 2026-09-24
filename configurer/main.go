// AI Zamin's self-contained configuration writer. No host language runtime.
package main

import (
	"encoding/binary"
	"encoding/json"
	"errors"
	"fmt"
	"net/url"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/tailscale/hujson"
)

const footer = "AIZAMIN_CONFIG_V1"
const endpoint = "https://aizamin.ir/v1"

type Payload struct {
	Version  int               `json:"version"`
	App      string            `json:"app"`
	Key      string            `json:"key"`
	Model    string            `json:"model"`
	Provider map[string]any    `json:"provider,omitempty"`
	Catalog  map[string]any    `json:"catalog,omitempty"`
	Tool     string            `json:"tool,omitempty"`
	Plugin   map[string]string `json:"plugin,omitempty"`
}

func readPayload(b []byte) (Payload, error) {
	var p Payload
	end := len(b) - len(footer) - 8
	if end < 0 || string(b[len(b)-len(footer):]) != footer {
		return p, errors.New("missing configuration payload; download a fresh configurer from AI Zamin")
	}
	n := binary.LittleEndian.Uint64(b[end : end+8])
	if n == 0 || n > 4*1024*1024 || n > uint64(end) {
		return p, errors.New("invalid configuration payload length")
	}
	if err := json.Unmarshal(b[end-int(n):end], &p); err != nil {
		return p, errors.New("invalid configuration payload")
	}
	if p.Version != 1 || (p.App != "codex" && p.App != "opencode" && p.App != "hermes") || strings.TrimSpace(p.Key) == "" || strings.ContainsAny(p.Key, "\r\n\x00") || p.Model == "" || strings.ContainsAny(p.Model, "\r\n\x00") {
		return p, errors.New("invalid configuration settings")
	}
	return p, nil
}
func main() {
	if len(os.Args) == 2 && os.Args[1] == "--mcp" {
		serveMCP(os.Stdin, os.Stdout)
		return
	}
	err := run()
	if err != nil {
		fmt.Fprintln(os.Stderr, "AI Zamin:", err)
	} else {
		fmt.Println("AI Zamin configured. Restart the app and start a new session. Keep this downloaded file private: it contains your API key.")
	}
	// Double-clicked Windows console stays readable; CLI automation uses --no-pause.
	if shouldPause() {
		fmt.Print("Press Enter to close...")
		fmt.Scanln()
	}
	if err != nil {
		os.Exit(1)
	}
}
func run() error {
	exe, err := os.Executable()
	if err != nil {
		return err
	}
	b, err := os.ReadFile(exe)
	if err != nil {
		return err
	}
	// macOS wrapper keeps the Mach-O signature intact and supplies a private
	// payload file. Windows/Linux can read an appended executable overlay.
	if len(os.Args) >= 3 && os.Args[1] == "--payload" {
		config, e := os.ReadFile(os.Args[2])
		if e != nil {
			return e
		}
		length := make([]byte, 8)
		binary.LittleEndian.PutUint64(length, uint64(len(config)))
		b = append(append(config, length...), []byte(footer)...)
	}
	p, err := readPayload(b)
	if err != nil {
		return err
	}
	switch p.App {
	case "opencode":
		return configureOpenCode(p)
	case "codex":
		return configureCodex(p)
	case "hermes":
		return configureHermes(p)
	}
	return errors.New("unsupported app")
}
func homePath(env string, parts ...string) (string, error) {
	if v := os.Getenv(env); v != "" {
		return v, nil
	}
	h, e := os.UserHomeDir()
	return filepath.Join(append([]string{h}, parts...)...), e
}
func backup(path string) error {
	b, err := os.ReadFile(path)
	if os.IsNotExist(err) {
		return nil
	}
	if err != nil {
		return err
	}
	return os.WriteFile(path+".aizamin.backup."+time.Now().UTC().Format("20060102T150405.000000000"), b, 0600)
}
func writePrivate(path string, b []byte, mode os.FileMode) error {
	if err := os.MkdirAll(filepath.Dir(path), 0700); err != nil {
		return err
	}
	if err := backup(path); err != nil {
		return err
	}
	f, err := os.CreateTemp(filepath.Dir(path), ".aizamin-*")
	if err != nil {
		return err
	}
	temp := f.Name()
	defer os.Remove(temp)
	if err = f.Chmod(mode); err == nil {
		_, err = f.Write(b)
	}
	closeErr := f.Close()
	if err != nil {
		return err
	}
	if closeErr != nil {
		return closeErr
	}
	return os.Rename(temp, path)
}
func jsonBytes(v any) []byte { b, _ := json.MarshalIndent(v, "", "  "); return append(b, '\n') }
func object(parent map[string]any, key string) (map[string]any, error) {
	if v, ok := parent[key]; ok {
		m, ok := v.(map[string]any)
		if !ok {
			return nil, fmt.Errorf("existing %s must be an object", key)
		}
		return m, nil
	}
	m := map[string]any{}
	parent[key] = m
	return m, nil
}
func configureOpenCode(p Payload) error {
	home, err := homePath("XDG_CONFIG_HOME", ".config")
	if err != nil {
		return err
	}
	dir := filepath.Join(home, "opencode")
	path := filepath.Join(dir, "opencode.jsonc")
	if _, e := os.Stat(path); os.IsNotExist(e) {
		if _, e = os.Stat(filepath.Join(dir, "opencode.json")); e == nil {
			path = filepath.Join(dir, "opencode.json")
		}
	}
	config := map[string]any{}
	b, err := os.ReadFile(path)
	if err == nil {
		clean, e := hujson.Standardize(b)
		if e != nil {
			return errors.New("existing OpenCode configuration is invalid JSONC; nothing changed")
		}
		if e = json.Unmarshal(clean, &config); e != nil || config == nil {
			return errors.New("existing OpenCode configuration must be an object")
		}
	} else if !os.IsNotExist(err) {
		return err
	}
	providers, err := object(config, "provider")
	if err != nil {
		return err
	}
	// Keep the OpenAI adapter/provider ID for transport compatibility, but
	// display the managed gateway under its own brand in the model picker.
	p.Provider["name"] = "aizamin"
	providers["openai"] = p.Provider
	agents, err := object(config, "agent")
	if err != nil {
		return err
	}
	for _, name := range []string{"build", "plan"} {
		a, e := object(agents, name)
		if e != nil {
			return e
		}
		opts, e := object(a, "options")
		if e != nil {
			return e
		}
		opts["store"] = false
	}
	pluginPath := filepath.ToSlash(filepath.Join(dir, "plugins", "aizamin.mjs"))
	if !strings.HasPrefix(pluginPath, "/") {
		pluginPath = "/" + pluginPath
	}
	pluginURL := (&url.URL{Scheme: "file", Path: pluginPath}).String()
	plugins := []any{}
	if old, exists := config["plugin"]; exists {
		var ok bool
		plugins, ok = old.([]any)
		if !ok {
			return errors.New("existing OpenCode plugin must be an array")
		}
	}
	found := false
	for _, plugin := range plugins {
		if plugin == pluginURL {
			found = true
		}
	}
	if !found {
		plugins = append(plugins, pluginURL)
	}
	config["plugin"] = plugins
	config["$schema"] = "https://opencode.ai/config.json"
	if err = writePrivate(path, jsonBytes(config), 0600); err != nil {
		return err
	}
	// App-native plugin: selectable in the existing Desktop agent picker.
	if err = writePrivate(filepath.Join(dir, "plugins", "aizamin.mjs"), []byte(openCodePluginSource), 0600); err != nil {
		return err
	}
	if err = writePrivate(filepath.Join(dir, "aizamin-image.json"), jsonBytes(map[string]string{"apiKey": p.Key}), 0600); err != nil {
		return err
	}
	return writePrivate(filepath.Join(dir, "tools", "aizamin_image.ts"), []byte(p.Tool), 0600)
}
