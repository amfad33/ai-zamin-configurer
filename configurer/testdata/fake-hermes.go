// Deliberately fake Hermes for native installer tests; not runtime evidence.
package main

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
)

func main() {
	root := os.Getenv("HERMES_HOME")
	h := root
	a := os.Args[1:]
	if len(a) == 1 && a[0] == "--version" {
		fmt.Println("Hermes Agent v0.21.3")
		return
	}
	if len(a) > 2 && a[0] == "-p" {
		if a[1] != "default" {
			h = filepath.Join(root, "profiles", a[1])
		}
		a = a[2:]
	}
	if len(a) == 3 && a[0] == "profile" && a[1] == "create" && a[2] == "--help" {
		fmt.Println("--no-skills --no-alias")
		return
	}
	if len(a) >= 3 && a[0] == "profile" && a[1] == "create" {
		d := filepath.Join(root, "profiles", a[2])
		os.MkdirAll(d, 0700)
		os.WriteFile(filepath.Join(d, "config.yaml"), []byte("model: {}\n"), 0600)
		return
	}
	if len(a) == 2 && a[0] == "config" {
		if a[1] == "path" {
			fmt.Println(filepath.Join(h, "config.yaml"))
			return
		}
		if a[1] == "env-path" {
			fmt.Println(filepath.Join(h, ".env"))
			return
		}
	}
	if len(a) == 4 && a[0] == "config" && a[1] == "set" && a[2] == "HERMES_CUSTOM_AIZAMIN_API_KEY" {
		os.WriteFile(filepath.Join(h, ".env"), []byte(a[2]+"="+a[3]+"\n"), 0600)
	}
	f, e := os.OpenFile(filepath.Join(h, "fake-cli-calls.jsonl"), os.O_CREATE|os.O_APPEND|os.O_WRONLY, 0600)
	if e != nil {
		panic(e)
	}
	defer f.Close()
	json.NewEncoder(f).Encode(a)
}
