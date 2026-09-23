package main

import (
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"sort"
	"strconv"
	"strings"
)

type hermesProfilePlan struct {
	Name    string
	Payload Payload
}

// Exact public Sub2API route aliases observed in the gateway catalog. The local
// setup.js and server/catalog.py do not contain upstream routing metadata.
// Do not generalize these to model-family substrings or provider-qualified IDs.
func isHermesLiteModel(id string) bool {
	switch id {
	case "qwen3.8-27b", "gpt-oss-120b", "gpt-oss-20b", "groq-compound":
		return true
	}
	return strings.HasPrefix(id, "groq/") || strings.HasSuffix(id, ":free")
}

// Installed Hermes supports_tools metadata is descriptive, not a runtime tool
// gate. Keep known chat-only models in a separate no-tools profile so /model
// cannot accidentally send terminal schemas to Compound. Unknown capabilities
// remain selectable; they are not silently treated as unsupported.
func hermesChatOnlyModel(id string, metadata any) bool {
	switch id {
	case "groq-compound", "groq/compound", "groq/compound-mini", "groq/groq/compound", "groq/groq/compound-mini":
		return true
	}
	if m, ok := metadata.(map[string]any); ok {
		if supported, ok := m["supports_tools"].(bool); ok && !supported {
			return true
		}
	}
	return false
}

func hermesProfilePlans(p Payload) ([]hermesProfilePlan, error) {
	lite, standard, chat := map[string]any{}, map[string]any{}, map[string]any{}
	for id, metadata := range p.Catalog {
		if hermesChatOnlyModel(id, metadata) {
			chat[id] = metadata
		} else if isHermesLiteModel(id) {
			lite[id] = metadata
		} else {
			standard[id] = metadata
		}
	}
	if len(p.Catalog) == 0 {
		return nil, errors.New("missing Hermes model catalog")
	}
	plans := []hermesProfilePlan{}
	for _, entry := range []struct {
		name    string
		catalog map[string]any
	}{{"aizamin-lite", lite}, {"aizamin-standard", standard}, {"aizamin-chat", chat}} {
		if len(entry.catalog) == 0 {
			continue // Never emit an empty default: Hermes can fall back to a vendor model.
		}
		selected := p.Model
		if _, ok := entry.catalog[selected]; !ok {
			ids := make([]string, 0, len(entry.catalog))
			for id := range entry.catalog {
				ids = append(ids, id)
			}
			sort.Strings(ids)
			selected = ""
			if len(ids) > 0 {
				selected = ids[0]
			}
		}
		next := p
		next.Catalog = entry.catalog
		next.Model = selected
		plans = append(plans, hermesProfilePlan{entry.name, next})
	}
	return plans, nil
}

func hermesProfileCommand(name string, args ...string) (string, error) {
	return hermesCommand(append([]string{"-p", name}, args...)...)
}

func hermesVersionSupported(text string) bool {
	m := regexp.MustCompile(`Hermes Agent v(\d+)\.(\d+)\.(\d+)`).FindStringSubmatch(text)
	if len(m) != 4 {
		return false
	}
	major, _ := strconv.Atoi(m[1])
	minor, _ := strconv.Atoi(m[2])
	patch, _ := strconv.Atoi(m[3])
	return major > 0 || minor > 21 || (minor == 21 && patch >= 3)
}

func configureHermes(p Payload) error {
	version, e := hermesCommand("--version")
	if e != nil {
		return e
	}
	if !hermesVersionSupported(version) {
		return errors.New("update Hermes to v0.21.3 or newer before configuring managed profiles; nothing changed")
	}
	plans, err := hermesProfilePlans(p)
	if err != nil {
		return err
	}
	// All compatibility/payload checks precede writes. Older CLIs must not partly
	// install a profile and then silently run with their default enormous toolset.
	help, err := hermesCommand("profile", "create", "--help")
	if err != nil {
		return err
	}
	if !strings.Contains(help, "--no-skills") || !strings.Contains(help, "--no-alias") {
		return errors.New("update Hermes: managed profiles require profile create --no-skills --no-alias")
	}
	for _, name := range []string{"plugin.yaml", "__init__.py"} {
		if p.Plugin[name] == "" {
			return errors.New("missing Hermes image backend")
		}
	}
	rootConfig, err := hermesProfileCommand("default", "config", "path")
	if err != nil {
		return err
	}
	if !filepath.IsAbs(rootConfig) || strings.ContainsAny(rootConfig, "\r\n") {
		return errors.New("Hermes returned an invalid root configuration path")
	}
	root := filepath.Dir(rootConfig)
	// Refuse a catalog shrink that would leave a stale managed profile usable.
	// Never overwrite it with an empty model (Hermes may select a vendor default).
	for _, name := range []string{"aizamin-lite", "aizamin-standard", "aizamin-chat"} {
		present := false
		for _, plan := range plans {
			present = present || plan.Name == name
		}
		if !present {
			if _, e := os.Stat(filepath.Join(root, "profiles", name)); e == nil {
				return fmt.Errorf("catalog has no models for existing profile %s; nothing changed; retire that profile explicitly before retrying", name)
			} else if !os.IsNotExist(e) {
				return e
			}
		}
	}
	// Never take over a similarly named user profile. Mark ownership on creation.
	for _, plan := range plans {
		dir := filepath.Join(root, "profiles", plan.Name)
		if _, e := os.Stat(dir); e == nil {
			marker, e := os.ReadFile(filepath.Join(dir, ".aizamin-managed"))
			if e != nil || string(marker) != "1\n" {
				return fmt.Errorf("profile %s already exists but is not managed by AI Zamin; nothing changed", plan.Name)
			}
		} else if !os.IsNotExist(e) {
			return e
		}
	}
	for _, plan := range plans {
		if err = configureManagedHermesProfile(root, plan); err != nil {
			return fmt.Errorf("%s setup failed; managed profiles may be partially updated; timestamped backups are retained: %w", plan.Name, err)
		}
	}
	fmt.Println("Default/active profile unchanged. Start a NEW session with hermes -p aizamin-lite (minimal terminal agent), aizamin-standard (full tools/image), or aizamin-chat (Compound/explicitly unsupported tool models, chat-only). Only nonempty profiles are created. /model does not change profiles. STT is available in all. Unknown model tool support and long-context/rate-limit compatibility are not guaranteed.")
	return nil
}

func configureManagedHermesProfile(root string, plan hermesProfilePlan) error {
	dir := filepath.Join(root, "profiles", plan.Name)
	if _, err := os.Stat(dir); os.IsNotExist(err) {
		args := []string{"profile", "create", plan.Name, "--no-alias"}
		if plan.Name != "aizamin-standard" {
			args = append(args, "--no-skills")
		}
		if _, err = hermesCommand(args...); err != nil {
			return err
		}
		if err = writePrivate(filepath.Join(dir, ".aizamin-managed"), []byte("1\n"), 0600); err != nil {
			return err
		}
	}
	return configureHermesProfile(plan.Payload, plan.Name)
}
