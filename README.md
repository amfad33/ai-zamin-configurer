# AI Zamin Configurer — 2.0.0

Open-source helpers for configuring Codex, Hermes and OpenCode with AI Zamin, including supported models and image tools.

تنظیم‌گر متن‌باز AI زمین برای تنظیم آسان Codex، Hermes و OpenCode و بارگذاری درست مدل‌های پشتیبانی‌شده.

**2.0.0 is reusable and unsigned.** Each platform executable is unchanged between users and contains no customer key. Launch it to open its embedded branded UI on an ephemeral IPv4 loopback port. Sign in on the AI Zamin website, explicitly approve your own API key, then select an application in the local UI. Passwords stay on the website; the key is not returned to the local browser UI. Windows/macOS reputation warnings may occur: icons, version metadata and source availability are not code signing or notarization.

This repository contains configurer source, generated application tools, public brand assets and focused tests only. The website, device-grant backend, account/payment services, customer credentials, deployment configuration and private Git history are not included.

## What it changes

- **Codex:** merges `config.toml`, writes API-key authentication to `auth.json`, and installs a self-contained image MCP executable under the Codex configuration directory. Selects AI Zamin's endpoint and GPT-5.5.
- **OpenCode:** merges global JSON/JSONC configuration, adds model capabilities, and installs an image tool and separate credential file. Preserves unrelated providers and the selected default model.
- **Hermes:** uses the installed `hermes` CLI and its active profile, adds a named AI Zamin provider, and enables vision, image generation and STT through installed plugins. STT defaults to `whisper-large-v3-turbo`; `whisper-large-v3` is also supported. Speech models stay out of the coding catalog. Existing chat selection is preserved.
- Creates timestamped backups before replacing configuration files. JSONC/TOML formatting and comments may be normalized; backups retain originals.

Customers need the target application, a browser and the OS URL-opening facilities, not a separate Node.js, Python or Go installation. Hermes must expose its CLI on PATH and support the `TranscriptionProvider` plugin API; its plugins use Hermes's own dependencies. OpenCode uses its own runtime. No administrator access is required. On macOS/Linux, make the `.run` executable (`chmod +x`) before launching it. Close the console to quit; local sessions expire after ten minutes.

Keys remain in native session memory until written into the selected application's credential/configuration channels. Treat those local files and their backups as secrets. Image/chat/transcription requests use `https://aizamin.ir/v1` and consume purchased credit. Hermes may fetch user-supplied reference-image URLs; model discovery may contact AI Zamin during configuration. Configuration does not grant free API credit.

## Inspect the source

| File | Purpose |
| --- | --- |
| `configurer/main.go`, `apps.go` | Configuration writing, backups, compatibility payload reading |
| `configurer/mcp.go` | Self-contained Codex image generation/editing MCP |
| `configurer/ui.go`, `ui.html` | Loopback UI, native device-grant client and application selection |
| `configurer/embedded/` | Key-placeholder payload templates and brand assets embedded in Go |
| `configurer/embed.cjs`, `build.py` | Template regeneration, Windows resources, cross-platform unsigned builds/checksums |
| `setup.js` | Extracted model catalog, generated tools and compatibility payload assembler |
| `assets/hermes-image-provider.js`, `configurer/hermes-stt/` | Installed Hermes image/STT plugins |
| `tests/`, `configurer/*_test.go` | Standalone payload/native tests and local-UI release smoke |

Shared files are copied byte-for-byte from the production source. `setup.js` retains the generator through its CommonJS exports, stops immediately before `  if (typeof document ===`, and appends `})();\n`. Website account handlers are deliberately excluded. `tests/native_setup_check.py` is the standalone variant: it omits the private server handoff test import/call and otherwise retains the native fixture. Public brand inputs are limited to the logo and favicon used by `embed.cjs`.

The shared [native implementation notes](configurer/README.md) also describe private website/Docker integration. Their website unittest/browser fixture commands require the private repository and are **not standalone commands**. Use the commands below in this repository instead.

## Build and test (developers only)

Use the Go version declared in `configurer/go.mod`, Node.js and Python 3.11+. These are build/test dependencies only. The release builder fetches pinned `github.com/tc-hib/go-winres@v0.3.3` for Windows resources; Go module downloads require network access on a cold cache.

From the repository root:

```sh
# Rebuild embedded payload templates and copy public brand inputs.
node configurer/embed.cjs

# Focused standalone check: JS payload matrix, Go tests, native configuration/MCP.
python tests/native_setup_check.py

# All six unsigned Windows/macOS/Linux amd64/arm64 binaries.
python configurer/build.py

# Narrower build: both Windows architectures only.
python configurer/build.py --windows-only

# Smoke the actual built Windows amd64 executable without customer runtimes.
python tests/configurer_release_check.py configurer/dist/2.0.0/aizamin-configurer-windows-amd64.exe
```

Set `AIZAMIN_GO` to an absolute Go executable path when Go is not on PATH; `build.py` also accepts `--go`. Builds generate ignored `configurer/rsrc_windows_*.syso` resources and `configurer/dist/2.0.0/` artifacts, `manifest.json` (`signed: false`) and `SHA256SUMS`. Never commit binaries, generated resource objects, credentials or personalized compatibility payloads. Checked-in templates contain the literal `__AIZAMIN_KEY__` placeholder, so a direct `go build` from `configurer/` needs no Node runtime; use `build.py` for release branding/resources.

The tests use synthetic keys, a fake Hermes CLI, mocked image HTTP responses and temporary homes. The legacy assembly matrix checks 18 app/OS/architecture payloads; this is compatibility coverage, **not** the new reusable website download path. The native executable and installed MCP check runs with stripped PATH. The release smoke checks version, loopback UI, locked/keyless state, icon and unchanged executable bytes; it does not perform website login or write a real user's configuration. Cross-compilation is not native execution on other OSes, and these checks do not establish live paid API or real-client compatibility.

Optional STT ABI check, using an installed Hermes Python and Hermes source on `PYTHONPATH` (SDK/config/secrets are mocked):

```sh
python configurer/testdata/check-hermes-stt.py
```

## Website authorization protocol

The production website backend remains private; only its native client is published here. The fixed HTTPS origin is `https://aizamin.ir`:

1. Native `POST /api/configurer/start` receives JSON `id` and `token`. The public grant ID enters `/setup/?device=<id>`; the independent polling capability remains native.
2. The owner signs in on the website, accepts required agreements and explicitly approves an owned eligible key. Do not approve grant links supplied by other people.
3. Native form-encoded `POST /api/configurer/poll` supplies `id` and `token`; HTTP 202 means pending, HTTP 200 supplies JSON `key`. Redemption must be atomic and single-use. Requests reject redirects.

The server contract includes strict Origin checks on owner approval, ownership/eligibility validation, ten-minute expiry, rate limiting and bounded grant storage. The current private implementation uses in-memory grants; multi-worker deployments require shared transactional storage. These server properties cannot be independently exercised by this standalone checkout. The native loopback writer independently checks exact Host, exact Origin, POST and a random per-session capability; it does not accept arbitrary credential callback URLs.

## Release boundary and trust

Version 2.0.0 source is public; source synchronization is not website deployment. Rebuild and publish the matching binaries through the authorized website release process. Signing is unavailable for this release: do not claim a verified publisher, notarization or warning-free OS acceptance. Future signing must occur on final artifacts before calculating published hashes, with accurate manifest signature metadata; do not personalize signed binaries afterward.

Legacy `--payload` and appended-payload support remain for automation/testing only. Unlike reusable downloads, those payload files contain keys: **never share them publicly or attach them to issues**.

## License

MIT; see [LICENSE](LICENSE). Third-party dependencies retain their own licenses.
