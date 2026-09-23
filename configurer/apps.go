package main

import (
	_ "embed"
	"errors"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"

	"github.com/pelletier/go-toml/v2"
)

func shouldPause() bool {
	if runtime.GOOS != "windows" {
		return false
	}
	for _, arg := range os.Args[1:] {
		if arg == "--no-pause" {
			return false
		}
	}
	s, e := os.Stdin.Stat()
	return e == nil && s.Mode()&os.ModeCharDevice != 0
}
func configureCodex(p Payload) error {
	dir, err := homePath("CODEX_HOME", ".codex")
	if err != nil {
		return err
	}
	path := filepath.Join(dir, "config.toml")
	config := map[string]any{}
	if b, e := os.ReadFile(path); e == nil {
		if e = toml.Unmarshal(b, &config); e != nil {
			return errors.New("existing Codex TOML is invalid; nothing changed")
		}
	} else if !os.IsNotExist(e) {
		return e
	}
	for k, v := range map[string]any{"model_provider": "OpenAI", "model": "gpt-5.5", "review_model": "gpt-5.5", "model_reasoning_effort": "xhigh", "disable_response_storage": true, "cli_auth_credentials_store": "file", "forced_login_method": "api"} {
		config[k] = v
	}
	providers, err := object(config, "model_providers")
	if err != nil {
		return err
	}
	providers["OpenAI"] = map[string]any{"name": "OpenAI", "base_url": endpoint, "wire_api": "responses", "requires_openai_auth": true}
	features, err := object(config, "features")
	if err != nil {
		return err
	}
	features["goals"] = true
	servers, err := object(config, "mcp_servers")
	if err != nil {
		return err
	}
	name := "aizamin-image"
	if runtime.GOOS == "windows" {
		name += ".exe"
	}
	binaryPath := filepath.Join(dir, "aizamin", name)
	servers["aizamin_image"] = map[string]any{"command": binaryPath, "args": []string{"--mcp"}, "tool_timeout_sec": 360, "env": map[string]string{"AIZAMIN_IMAGE_KEY": p.Key}}
	output, err := toml.Marshal(config)
	if err != nil {
		return err
	}
	exe, err := os.Executable()
	if err != nil {
		return err
	}
	b, err := os.ReadFile(exe)
	if err != nil {
		return err
	}
	// Copy only the base executable: installed MCP never retains the appended key.
	if _, e := readPayload(b); e == nil {
		end := len(b) - len(footer) - 8
		n := binaryLength(b, end)
		b = b[:end-n]
	}
	if err = writePrivate(binaryPath, b, 0700); err != nil {
		return err
	}
	if err = writePrivate(path, output, 0600); err != nil {
		return err
	}
	return writePrivate(filepath.Join(dir, "auth.json"), jsonBytes(map[string]string{"OPENAI_API_KEY": p.Key}), 0600)
}
func binaryLength(b []byte, end int) int {
	n := 0
	for i := 7; i >= 0; i-- {
		n = n*256 + int(b[end+i])
	}
	return n
}
func hermesCommand(args ...string) (string, error) {
	cmd := exec.Command("hermes", args...)
	cmd.Env = os.Environ()
	b, err := cmd.Output()
	if err != nil {
		label := args
		if len(label) > 0 && label[0] == "-p" {
			label = label[2:]
		}
		if len(label) > 3 {
			label = label[:3]
		}
		return "", fmt.Errorf("installed Hermes CLI command failed (%s); update Hermes and retry (values/output omitted to protect secrets)", strings.Join(label, " "))
	}
	return strings.TrimSpace(string(b)), nil
}

//go:embed hermes-stt/__init__.py
var hermesSTTSource string

func configureHermesProfile(p Payload, profile string) error {
	command := func(args ...string) (string, error) { return hermesProfileCommand(profile, args...) }
	if _, err := exec.LookPath("hermes"); err != nil {
		return errors.New("Hermes is not on PATH. Run this configurer from a terminal where the installed hermes command works")
	}
	config, err := command("config", "path")
	if err != nil {
		return err
	}
	env, err := command("config", "env-path")
	if err != nil {
		return err
	}
	// Only accept the CLI's exact absolute path, not a guessed profile location.
	if !filepath.IsAbs(config) || !filepath.IsAbs(env) || strings.ContainsAny(config+env, "\r\n") {
		return errors.New("Hermes returned an invalid configuration path")
	}
	if err = backup(config); err != nil {
		return err
	}
	if err = backup(env); err != nil {
		return err
	}
	dir := filepath.Join(filepath.Dir(config), "plugins", "image_gen", "aizamin")
	for _, name := range []string{"plugin.yaml", "__init__.py"} {
		source, ok := p.Plugin[name]
		if !ok || source == "" {
			return errors.New("missing Hermes image backend")
		}
		if err = writePrivate(filepath.Join(dir, name), []byte(source), 0600); err != nil {
			return err
		}
	}
	sttDir := filepath.Join(filepath.Dir(config), "plugins", "stt", "aizamin")
	for name, source := range map[string]string{"plugin.yaml": "name: aizamin-stt\nversion: 1.0.0\ndescription: AI Zamin Whisper speech transcription\n", "__init__.py": hermesSTTSource} {
		if err = writePrivate(filepath.Join(sttDir, name), []byte(source), 0600); err != nil {
			return err
		}
	}
	settings := [][2]string{{"stt.aizamin.base_url", endpoint}, {"stt.aizamin.model", "whisper-large-v3-turbo"}, {"HERMES_CUSTOM_AIZAMIN_API_KEY", p.Key}, {"providers.aizamin.api", endpoint}, {"providers.aizamin.key_env", "HERMES_CUSTOM_AIZAMIN_API_KEY"}, {"providers.aizamin.transport", "chat_completions"}, {"providers.aizamin.default_model", p.Model}, {"providers.aizamin.models", strings.TrimSpace(string(jsonBytes(p.Catalog)))}, {"providers.aizamin.models_discovered", "true"}, {"providers.aizamin.discover_models", "false"}, {"image_gen.provider", "aizamin"}, {"image_gen.aizamin.model", "gpt-image-2.5-flare-medium"}, {"auxiliary.vision.provider", "aizamin"}, {"auxiliary.vision.model", p.Model}}
	for _, s := range settings {
		args := []string{"config", "set", s[0], s[1]}
		if s[0] == "providers.aizamin.models" {
			args = []string{"config", "set", "--force", s[0], s[1]}
		}
		if _, err = command(args...); err != nil {
			return err
		}
	}
	// Enable the STT plugin before selecting it; never fall back to native OpenAI,
	// which rewrites these public Whisper IDs to whisper-1.
	commands := [][]string{{"plugins", "enable", "stt/aizamin", "--no-allow-tool-override"}, {"config", "set", "stt.provider", "aizamin"}, {"config", "set", "stt.enabled", "true"}, {"plugins", "enable", "image_gen/aizamin", "--no-allow-tool-override"}}
	if profile == "aizamin-standard" {
		commands = append(commands, []string{"tools", "enable", "image_gen"}, []string{"tools", "enable", "vision"})
	}
	for _, args := range commands {
		if _, err = command(args...); err != nil {
			return err
		}
	}
	profileSettings := [][2]string{{"model.provider", "custom:aizamin"}, {"model.default", p.Model}}
	if profile != "aizamin-standard" {
		toolsets := "[\"terminal\"]"
		if profile == "aizamin-chat" {
			toolsets = "[]"
			profileSettings = append(profileSettings, [2]string{"agent.tool_use_enforcement", "false"})
		}
		profileSettings = append(profileSettings, [][2]string{{"toolsets", toolsets}, {"platform_toolsets.cli", toolsets}, {"platform_toolsets.desktop", toolsets}, {"platform_toolsets.tui", toolsets}, {"platform_toolsets.api", toolsets}, {"agent.coding_context", "off"}, {"agent.environment_probe", "false"}, {"memory.memory_enabled", "false"}, {"memory.user_profile_enabled", "false"}, {"skills.project_discovery", "false"}, {"context_file_max_chars", "1024"}}...)
	}
	for _, setting := range profileSettings {
		if _, err = command("config", "set", setting[0], setting[1]); err != nil {
			return err
		}
	}
	fmt.Println("Configured managed Hermes profile: " + profile)
	return nil
}
