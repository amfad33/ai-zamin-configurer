# Direct browser setup

Build-only dependencies: `npm ci --ignore-scripts` then `npm run build` in this directory. Commit `assets/setup-direct.js` and its LICENSE alongside the source/lockfile. Docker already copies the complete `assets/` directory, including these two new assets; no CDN or customer-installed runtime is used.

Dependency selection: Microsoft's jsonc-parser 3.3.1 (MIT) supplies syntax-aware JSONC edits preserving comments; @iarna/toml 2.2.5 (ISC, no runtime dependency) supplies parsing/serialization, rejecting unsupported syntax rather than attempting regex repair. TOML is reformatted, with original bytes in mandatory backups. yaml 2.9.1 (ISC) supplies syntax-aware YAML document edits and is bundled locally. esbuild and Playwright are developer-only. Import JSONC's ESM entry explicitly (its UMD dynamic require is not browser-bundle safe), and TOML's synchronous entry to avoid Node streams.

## Supported boundary

- Codex and OpenCode: HTTPS desktop browsers exposing showDirectoryPicker. All canonical generated chat/image settings are retained. Codex's native MCP binary uses the unchanged native binary URL; its absolute command path is supplied and explicitly confirmed by the customer, never inferred from a directory handle.
- Hermes: real six-file first-admission writer for an explicitly selected existing active, personal unmanaged profile. Writes YAML/env plus image/STT plugins directly, not an installer. Requires separate profile/policy/plugin confirmations. Existing AI Zamin credentials/config/plugins or custom auth pools, managed hints, external secrets, unsupported YAML or disabled tools fail closed. Active chat and prior credentials stay unchanged; image/vision/STT selection changes with consent. No auth/cache mutation. See [source-backed equivalence and precise limits](hermes-boundary.md).
- Linux/macOS: browser cannot chmod the installed Codex MCP or enforce private modes. UI reports setup pending and supplies a quoted explicit chmod command. OpenCode warns about private folder/file/backup permissions. No claim of actual client/paid API execution.
- Picker starts from remembered app directory handle or Documents (allowed browser well-known directory); actual app location is explained, including overrides. IndexedDB stores handles only, never keys/config contents. Selection grants access only to chosen folder. Local contents never go to a server.

Preflight parses existing configs and reads all overwrite targets, and fetches the necessary binary, before confirmation/writes. Changed source files invalidate approval. All existing targets get unique backups before any configuration overwrite. Every completed write is read back. On failure, partial completion/backups are displayed, not falsely called successful or rolled back. Browser filesystem writes across several files are not atomic; close the destination app first.

## Verification

`node tests/setup-direct.test.cjs` from repository root: direct merge/parse/corruption/absolute-path/capability tests. The private website also includes these in its native payload matrix.

Private website integration check (not included in the standalone public repository), `node tests/setup-direct-browser.cjs`: isolated headless Edge, production setup HTML/bundle, synthetic account/key/model responses; real OPFS write/readback/backups/stale/corrupt checks, Hermes six-file direct profile fixture writes/backups, desktop/mobile RTL geometry. Picker calls are skipped after prior denied OS approval. Synthetic binary bytes are not execution evidence. No real profiles, credentials or paid requests used.

Opt-in `AIZAMIN_HEADED_PICKER=1 node tests/setup-direct-browser.cjs` opens isolated headed Edge and creates a temporary OS folder. The genuine Windows dialog was reached, but Select Folder tool approval timed out (no consent); no bypass/retry attempted. The fixture timed out and closed its browser/server. OS picker acceptance remains unverified, not passed. See hermes-boundary.md for details.

`HERMES_SOURCE=<installed-source> node tests/setup-hermes-runtime.cjs`: real installed Hermes resolvers/plugins in a synthetic temporary home, no network; verifies named chat/image credential resolution, STT availability and explicit tool admission. Not paid inference or multi-version compatibility.

Release provenance is recorded by the repository commit; native source and per-app download packaging remain unchanged.
