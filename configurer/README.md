# Native setup delivery

The website fetches a platform/architecture executable and personalizes it locally;
API keys are never sent with the executable asset request. Windows PE and Linux ELF
receive a JSON overlay followed by its uint64 little-endian length and
`AIZAMIN_CONFIG_V1`. macOS receives a `.command` containing base64 of the **unchanged**
Mach-O and a separate JSON payload: appending bytes can invalidate the Apple Silicon
Go linker signature. The wrapper uses only macOS `/bin/sh`, `mktemp`, `base64`, `chmod`
and `rm`, not a downloaded/runtime dependency. Execute it with `sh filename.command`.

Docker builds all six binaries, sequentially (`GOMAXPROCS=1`, `-p 1`, `CGO_ENABLED=0`),
and copies them to `/app/public/assets/configurers`. No binaries belong in Git.
Go/TOML/JSONC dependencies are build-time only. Node is used by developer tests and
the browser source generator, **not** by downloaded configurers or Codex's MCP.
OpenCode executes the existing TypeScript tool inside its own bundled runtime.
Hermes executes its installed CLI and loads the existing Python backend using its
own dependencies. Hermes must be available as `hermes` on PATH; run the configurer
from the terminal/profile where Hermes is installed. Codex/OpenCode do not require
CLI detection, which would reject desktop-only installations.

## Focused verification

Set `AIZAMIN_GO` to the Go executable if Go is not on the development PATH:

```
python -m unittest tests.test_frontend.AdminDashboardTests.test_setup_generator_creates_reviewable_non_admin_scripts_for_each_app_and_os
```

This single existing check runs the browser matrix, Go unit tests with an explicitly
mocked HTTP image API, the actual native executable and its installed MCP in temporary
homes with PATH stripped to a compiled **fake Hermes fixture**, then the existing
OpenCode generation/editing tool tests. It never reads customer secrets or contacts
the paid upstream. Other OS executables can be cross-compiled, but runtime verification
still requires those operating systems. Downloaded binaries are not vendor-notarized
or Authenticode-signed; OS reputation/quarantine warnings can occur. They require no
administrator privileges. JSONC/TOML settings merge preserves unrelated values but
normalizes formatting/comments; timestamped backups preserve the exact originals.

## Hermes voice / STT

All six native targets share `apps.go` and the embedded
`hermes-stt/__init__.py`; there are no separate shell/PowerShell STT emitters.
The installer creates/updates owned profiles using `hermes profile create`
and `hermes -p NAME config set`; the operator's default/active profile is untouched.
It backs up each managed profile's config and `.env`,
installs `plugins/stt/aizamin`, and uses `hermes config set` (not handwritten YAML)
for `stt.enabled=true`, `stt.provider=aizamin`,
`stt.aizamin.base_url=https://aizamin.ir/v1`, and
`stt.aizamin.model=whisper-large-v3-turbo`. It reuses the purchased key stored by
`hermes config set HERMES_CUSTOM_AIZAMIN_API_KEY ...` in the profile's `.env`.
The plugin resolves this key via Hermes' profile-aware `get_secret`; it does not
change `OPENAI_API_KEY`, `VOICE_TOOLS_OPENAI_KEY`, `GROQ_API_KEY`, or TTS settings.
Existing chat selection and unrelated config survive the native CLI merge.
Audio is uploaded to AI Zamin and consumes purchased credit; no API request is
made by installation itself.

Alternative (run by the customer after installation):

```
hermes -p aizamin-standard config set stt.aizamin.model whisper-large-v3
```

Only the two public, unprefixed model IDs are accepted. There is no substitution
or fallback to `whisper-1` or a direct vendor endpoint. Both models are exposed by
the plugin's STT `list_models()`, not the coding catalog. `setup.js` excludes
Whisper models from `/models` selection and emitted Hermes catalogs, and the
installer disables subsequent unfiltered named-provider discovery. Re-run the
configurer to refresh the coding catalog. The STT model remains configurable
through the command above; a dedicated Hermes STT picker is not promised.

### Compatibility evidence and verification limits

Inspected installed Hermes source revision
`17b5df02f2a729d8f46fbbf78cfc1f5a8cf0f121` and official
[Voice & TTS documentation](https://hermes-agent.nousresearch.com/docs/user-guide/features/tts#python-plugin-providers-stt).
The documented `TranscriptionProvider` / `register_transcription_provider` API
supports custom model catalogs. `tools/transcription_tools.py` dispatches
`stt.aizamin.model` unchanged to the plugin. The native OpenAI handler in
`tools/transcription_cloud.py` **autocorrects both requested Whisper IDs to its
OpenAI default**, even when a custom base is supplied. Its env-key credential
path also ignores `stt.openai.base_url` in favor of `STT_OPENAI_BASE_URL`.
Therefore merely configuring `stt.provider=openai` is not compatible here.
The dedicated plugin uses Hermes' existing OpenAI SDK directly, avoiding both
behaviors and restricting credentials to the AI Zamin endpoint.

Requires a current Hermes release exposing that STT plugin API (older releases
need an update). `configurer/testdata/check-hermes-stt.py` runs against the real
installed ABC/config/secret modules with **mocked SDK, configuration and secrets**;
it checks exact default/alternative request IDs, endpoint, credentials, and
fail-closed behavior without reading user config or sending paid audio. Run it
with the installed Hermes Python and its source directory on `PYTHONPATH`.
The focused native test above verifies the embedded plugin, CLI writes and
backups using a fake Hermes executable on Windows. Neither test proves a live
paid transcription, plugin startup in every Hermes release, or native macOS/Linux
execution. No user Hermes config is modified by these checks.

## Managed Hermes profiles

Requires Hermes v0.21.3+ and `profile create --no-skills --no-alias`.
Default/active profiles are untouched. Existing unmarked reserved names are
refused; reruns retain backups. Multi-command errors can be partial.

- `hermes -p aizamin-lite`: minimal **terminal agent** for coding, file operations
  and tests. Exact routes `qwen3.8-27b`, `gpt-oss-120b`, `gpt-oss-20b`, plus `groq/`
  and `:free` catalog IDs belong here unless known not to support tools.
  No bundled skills, memory injection, coding brief or environment probe.
  Project files capped at 1024 characters each, not a total budget.
- `hermes -p aizamin-standard`: remaining main models, normal tools/image/vision.
- `hermes -p aizamin-chat`: `groq-compound`, routed Compound aliases, and catalog
  entries explicitly declaring `supports_tools: false`. Zero tool schemas and
  tool-use enforcement disabled. STT remains available in all profiles.

Installed Hermes capability metadata is descriptive, not a runtime schema gate.
The explicit chat partition preserves these catalog members while excluding them
from tool-enabled profiles. Unknown capabilities remain selectable with no universal
compatibility guarantee. Requested defaults stay in their matching partition;
otherwise selection is deterministic. Empty partitions are skipped; an existing
profile becoming empty fails before writes instead of leaving stale defaults.
`/model` does not switch profiles: start a **new session**.

### Verified initial tokenizer budget

`configurer/testdata/check-hermes-profiles.py` executes the writer twice using
synthetic credentials and real Hermes in a temporary home, checks catalog shrink
refusal, and builds the installed AIAgent prompt with network blocked.
Terminal produces four initial schemas: `terminal`, `tool_search`, `tool_describe`,
`tool_call`. System: 10,537 characters; schemas: 6,640 characters.
Real tiktoken 0.14.0 counts for serialized system + coding request + tools:
**3,982–3,983 cl100k_base**, **3,989–3,990 o200k_base** across Qwen and both GPT-OSS models. Larger count + 30% + 512 gives
at most **5,699**, below 7,000. This is a conservative local estimate, NOT exact Groq
accounting or a live provider admission test. Deferred schemas, tool output,
history, user overrides, MCPs and multiple project files can exceed limits.

Set `AIZAMIN_PROFILE_BINARY` to the built writer and `PYTHONPATH` to installed
Hermes source plus an isolated tiktoken installation; execute the script with
Hermes Python. Do not install test dependencies into the operator runtime.
Windows execution and all six cross-builds verified; native macOS/Linux untested.

### Release boundary

Local source/build verification only. Public checkout synchronization is not
commit, push or deployment. Build the six targets with the Dockerfile Go loop;
release native binaries and generator together, updating cache tokens. Actual
Groq generation, live downloaded artifact and paid STT remain separate checks.
