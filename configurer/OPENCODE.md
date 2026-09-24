# OpenCode Lite runtime integration

Install the updated personalized native configurer once, restart OpenCode Desktop,
and start a new session. Select **AI Zamin Lite** in the agent picker. The agent
binds its default to the first authorized Lite model; other Lite models remain
selectable. Build/Plan keep the Standard provider and image tool. No customer
Node/Python/npm installation or CLI launch wrapper is required.

Remove any old `OPENCODE_CONFIG=.../opencode-lite.json` launcher override. That
retired file is not used by the new integration (and is not deleted automatically).

The embedded `opencode-plugin.mjs` is explicitly registered by file URL. Its awaited
config hook fetches both authenticated `/hermes-standard/v1/models` and
`/hermes-lite/v1/models` catalogs on app startup. Inference stays on `/v1`.
Catalog failures fail closed; restart for catalog changes. No model-name family
heuristics classify Lite. The managed agent replaces inherited permissions with
default deny plus approval-required bash/read. Standard instructions and known
vision capability definitions remain intact. The Lite system transform excludes
inherited instructions; the fetch boundary strips other tool schemas and enforces
6500 UTF-8 bytes on the complete serialized request. It rejects attachments,
unsupported endpoints, oversized prompts, history and tool results explicitly.
It does not delete history or the latest user message. Use short reads/output or
start a new session/use Standard when the cap is reached.

**Not a tokenizer or rate-limit guarantee:** the byte cap is deliberately
conservative; provider tokenizer accounting and concurrent TPM consumption differ.
The model context metadata is not the admission gate. Other installed plugins are
trusted local code and can alter application behavior; this is not a sandbox for
hostile plugins. Standard catalog/definition preservation is tested; no paid live
image inference was run by this change.

## Developer checks

- `python -m unittest tests.test_frontend.AdminDashboardTests.test_setup_generator_creates_reviewable_non_admin_scripts_for_each_app_and_os`
- `node tests/opencode-plugin.test.cjs`
- Windows installed Desktop backend acceptance:
  `ELECTRON_RUN_AS_NODE=1 ".../OpenCode.exe" tests/opencode-runtime.test.cjs ".../resources/app.asar/out/main/chunks/node-Cc1MVJxA.js"`
  Set `AIZAMIN_TEST_SCRATCH` to an existing scratch directory when needed.

Acceptance uses the real installed 1.18.31 backend and synthetic loopback HTTP,
not a live model. It verifies catalog loading, schema parsing, inherited unsafe
agent/global settings replaced, instruction exclusion, actual approval/read/bash
execution, tool-result follow-up and pre-transport oversize rejection. Captured
request JSON is synthetic and retained under the printed scratch directory.
Measured whole-request JSON tokenizer counts (cl100k_base/o200k_base) for initial,
read follow-up and bash follow-up: 259/267, 416/426, 482/492; bytes 1128,1667,1948.
These are local measurements, not upstream-reported usage.

The native fixture executes the assembled Windows installer twice with stripped
PATH and checks exact embedded plugin bytes/one registered URL; browser packaging
covers all 18 app/OS/architecture combinations. macOS/Linux native runtime
acceptance is not claimed. Parent release work must rebuild six native binaries,
sync the public configurer source (including the plugin and these tests/docs), and
deploy/cache-verify `native-opencode-lite-v7` / `20260924-opencode-lite-v7`.
