package main

import (
	"testing"
)

func TestHermesChatOnlyCapabilities(t *testing.T) {
	p := Payload{Model: "groq-compound", Catalog: map[string]any{"groq-compound": map[string]any{}, "qwen3.8-27b": map[string]any{}, "vendor/model:free": map[string]any{"supports_tools": false}}}
	plans, err := hermesProfilePlans(p)
	if err != nil || len(plans) != 2 {
		t.Fatal(plans, err)
	}
	if plans[0].Name != "aizamin-lite" || plans[0].Payload.Model != "qwen3.8-27b" || len(plans[0].Payload.Catalog) != 1 {
		t.Fatal("tool-incapable model in agent profile", plans)
	}
	if plans[1].Name != "aizamin-chat" || len(plans[1].Payload.Catalog) != 2 || plans[1].Payload.Model != "groq-compound" {
		t.Fatal("chat catalog lost", plans)
	}
}

func TestHermesCapabilityVersion(t *testing.T) {
	for _, v := range []string{"Hermes Agent v0.21.2", "unknown"} {
		if hermesVersionSupported(v) {
			t.Fatal(v)
		}
	}
	if !hermesVersionSupported("Hermes Agent v0.21.3 (2026.9.14)") {
		t.Fatal("installed version rejected")
	}
}

func TestHermesEmptyPartition(t *testing.T) {
	plans, err := hermesProfilePlans(Payload{Model: "gpt-5.5", Catalog: map[string]any{"gpt-5.5": map[string]any{}}})
	if err != nil || len(plans) != 1 || plans[0].Name != "aizamin-standard" || plans[0].Payload.Model != "gpt-5.5" {
		t.Fatal("empty profile must not be created with a vendor fallback")
	}
}

func TestHermesPublicAliases(t *testing.T) {
	catalog := map[string]any{}
	for _, id := range []string{"qwen3.8-27b", "gpt-oss-120b", "gpt-oss-20b", "groq-compound", "gpt-5.4-mini", "qwen-unmapped", "openai/gpt-oss-120b"} {
		catalog[id] = map[string]any{}
	}
	plans, err := hermesProfilePlans(Payload{Model: "qwen3.8-27b", Catalog: catalog})
	if err != nil || len(plans) != 3 {
		t.Fatal(plans, err)
	}
	if len(plans[0].Payload.Catalog) != 3 || len(plans[1].Payload.Catalog) != 3 || len(plans[2].Payload.Catalog) != 1 {
		t.Fatal("public route aliases must be lite; unrelated name matches must not", plans)
	}
	if plans[0].Payload.Model != "qwen3.8-27b" {
		t.Fatal("requested lite model lost")
	}
}

func TestHermesProfilePartition(t *testing.T) {
	p := Payload{Model: "gpt-5.5", Catalog: map[string]any{"gpt-5.5": map[string]any{}, "groq/qwen/qwen3.8-27b": map[string]any{}, "groq/compound": map[string]any{}, "future-model": map[string]any{}}}
	plans, err := hermesProfilePlans(p)
	if err != nil {
		t.Fatal(err)
	}
	if len(plans) != 3 || plans[0].Name != "aizamin-lite" || plans[1].Name != "aizamin-standard" {
		t.Fatal(plans)
	}
	if len(plans[0].Payload.Catalog) != 1 || len(plans[1].Payload.Catalog) != 2 || len(plans[2].Payload.Catalog) != 1 {
		t.Fatal("catalog membership lost")
	}
	if plans[1].Payload.Model != "gpt-5.5" {
		t.Fatal("default changed")
	}
	if plans[0].Payload.Catalog[plans[0].Payload.Model] == nil {
		t.Fatal("lite default absent")
	}
}
