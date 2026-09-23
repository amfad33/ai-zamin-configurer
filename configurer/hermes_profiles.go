package main

import (
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strconv"
	"strings"
	"time"
)

type hermesProfilePlan struct {
	Name    string
	Payload Payload
}

// Catalog membership is resolved by the installed native runtime plugin, never
// partitioned from the installer's snapshot or a hard-coded public alias list.
func hermesProfilePlans(p Payload) ([]hermesProfilePlan, error) {
	p.Catalog = nil
	return []hermesProfilePlan{{"aizamin-lite", p}, {"aizamin-standard", p}}, nil
}

func retireManagedHermesChat(root string) error {
	dir := filepath.Join(root, "profiles", "aizamin-chat")
	marker, err := os.ReadFile(filepath.Join(dir, ".aizamin-managed"))
	if os.IsNotExist(err) {
		return nil
	}
	if err != nil {
		return err
	}
	if string(marker) != "1\n" {
		return nil
	}
	info, err := os.Lstat(dir)
	if err != nil {
		return err
	}
	if info.Mode()&os.ModeSymlink != 0 {
		return errors.New("refusing symlinked retired profile")
	}
	archive := filepath.Join(root, "aizamin-archives", "aizamin-chat-"+time.Now().UTC().Format("20060102T150405.000000000"))
	if err = os.MkdirAll(filepath.Dir(archive), 0700); err != nil {
		return err
	}
	if err = os.Rename(dir, archive); err != nil {
		return err
	}
	fmt.Println("Archived retired managed chat profile (conversations preserved): " + archive)
	return nil
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
	if err = retireManagedHermesChat(root); err != nil {
		return err
	}
	for _, plan := range plans {
		if err = configureManagedHermesProfile(root, plan); err != nil {
			return fmt.Errorf("%s setup failed; managed profiles may be partially updated; timestamped backups are retained: %w", plan.Name, err)
		}
	}
	fmt.Println("Default/active profile unchanged. Start hermes -p aizamin-lite (minimal terminal) or hermes -p aizamin-standard (full tools/image/vision). Both retain STT. Catalogs refresh on Hermes startup; existing customers need this one-time migration, not recurring setup. /model does not switch profiles.")
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
