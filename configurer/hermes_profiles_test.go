package main

import (
	"os"
	"path/filepath"
	"testing"
)

func TestHermesPlansAreRuntimeScopes(t *testing.T) {
	plans, err := hermesProfilePlans(Payload{Model: "removed", Catalog: map[string]any{"removed": map[string]any{}}})
	if err != nil || len(plans) != 2 {
		t.Fatal(plans, err)
	}
	for _, p := range plans {
		if len(p.Payload.Catalog) != 0 {
			t.Fatal("installer snapshot must not remain authority")
		}
		if p.Name == "aizamin-chat" {
			t.Fatal("retired profile created")
		}
	}
}
func TestRetireManagedChatOnly(t *testing.T) {
	root := t.TempDir()
	chat := filepath.Join(root, "profiles", "aizamin-chat")
	os.MkdirAll(chat, 0700)
	os.WriteFile(filepath.Join(chat, "state.db"), []byte("conversation fixture"), 0600)
	if err := retireManagedHermesChat(root); err != nil {
		t.Fatal(err)
	}
	if _, err := os.Stat(chat); err != nil {
		t.Fatal("unmarked profile touched")
	}
	os.WriteFile(filepath.Join(chat, ".aizamin-managed"), []byte("1\n"), 0600)
	if err := retireManagedHermesChat(root); err != nil {
		t.Fatal(err)
	}
	if _, err := os.Stat(chat); !os.IsNotExist(err) {
		t.Fatal("still discoverable")
	}
	matches, _ := filepath.Glob(filepath.Join(root, "aizamin-archives", "aizamin-chat-*", "state.db"))
	if len(matches) != 1 {
		t.Fatal(matches)
	}
	content, _ := os.ReadFile(matches[0])
	if string(content) != "conversation fixture" {
		t.Fatal("conversation lost")
	}
	if err := retireManagedHermesChat(root); err != nil {
		t.Fatal(err)
	}
}
func TestHermesCapabilityVersion(t *testing.T) {
	if hermesVersionSupported("Hermes Agent v0.21.2") || !hermesVersionSupported("Hermes Agent v0.21.3") {
		t.Fatal("compatibility floor")
	}
}
