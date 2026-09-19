# AI Zamin Configurer

Open-source helpers for easily configuring Codex, Hermes and OpenCode with AI Zamin, so supported models and image tools are configured correctly.

تنظیم‌گر متن‌باز AI زمین برای تنظیم آسان Codex، Hermes و OpenCode و بارگذاری درست مدل‌های پشتیبانی‌شده.

This repository contains only the configurer source, its generated image tools and focused tests. It does not contain the private website, account/payment backend, customer keys or website Git history.

## What it does

- **Codex:** merges `config.toml`, writes API-key authentication to `auth.json`, and installs a self-contained image MCP executable under the Codex configuration directory. It selects AI Zamin's endpoint and GPT-5.5.
- **OpenCode:** merges its global JSON/JSONC configuration, adds model capabilities, and installs an image tool and its separate credential file. Existing unrelated providers and the selected default model remain unchanged.
- **Hermes:** invokes the installed `hermes` CLI for the active profile, adds a named AI Zamin provider, and enables vision and the AI Zamin image backend. The active chat model is not changed.
- Creates timestamped backups before replacing existing configuration files. JSONC/TOML formatting and comments may be normalized; backups retain the originals.

Users do not need to install Node.js, Python or Go separately for the configurer. Hermes's installed CLI must be accessible on PATH; application-native tools use the application's own runtime. No administrator access is needed.

## Inspect the code

| File | Purpose |
| --- | --- |
| `configurer/main.go` | Payload reading, private-file writes/backups and OpenCode configuration |
| `configurer/apps.go` | Codex and Hermes configuration |
| `configurer/mcp.go` | Standalone Codex image generation/editing MCP server |
| `setup.js` | Model catalog, OpenCode image-tool source, payload generation and platform packaging |
| `assets/hermes-image-provider.js` | Hermes plugin manifest and Python image backend |
| `tests/` and `configurer/*_test.go` | Packaging, configuration and image API tests |

`setup.js` is the configurer-only portion of the website generator. Website account loading and UI event handlers are intentionally excluded.

The website attaches the selected user's configuration locally in the browser to a platform executable. Windows/Linux use an appended JSON payload; macOS wraps the unchanged Mach-O executable and a separate payload with built-in shell utilities to preserve its signature. The downloaded personalized file contains the user's API key: **never publish it or include it in an issue**. The public source contains no customer key.

Configuration writes are local. When used, image tools send paid requests to `https://aizamin.ir/v1`; Hermes may also retrieve user-supplied reference-image URLs. Chat requests are sent by the configured application. This helper is not a model service and does not grant free API credit.

## Build and test (developers only)

Use the Go version declared in `configurer/go.mod`. Node and Python are developer-test dependencies, not customer requirements.

```sh
cd configurer
go test -p 1 ./...
CGO_ENABLED=0 go build -trimpath -ldflags="-s -w" -o aizamin-configurer .
cd ..
node tests/setup-native.test.cjs
python tests/native_setup_check.py
```

Set `AIZAMIN_GO` to the Go executable if it is not on the development PATH. Build for Windows, macOS and Linux with `GOOS=windows|darwin|linux` and `GOARCH=amd64|arm64` (one value each). The bare executable expects a configuration payload; `setup.js` exports `buildInstaller` and `assembleInstaller` for packaging it. Do not commit personalized artifacts.

The focused tests use fake keys, a fake Hermes CLI and mocked image API responses. They do not establish real-client compatibility on every OS. Downloads are not Authenticode-signed or vendor-notarized; operating-system warnings may occur.

## License

MIT; see [LICENSE](LICENSE). Third-party dependencies retain their own licenses.
