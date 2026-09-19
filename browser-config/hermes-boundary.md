# Hermes direct browser setup: bounded compatibility

## Implemented, not installer staging

The browser writes six files in the explicitly selected existing active profile: config.yaml, .env, and image/STT plugin manifest + Python source. It downloads or runs no executable for Hermes. Dependencies are bundled at build time, including the same image source as the native payload and the same configurer/hermes-stt/__init__.py. Per-app native downloads are unchanged.

This supports **first-time admission only**, not credential rotation, arbitrary migration or managed installations. The user must confirm the exact active config/env folder, closed Hermes/gateway, compatible installed named-provider/plugin APIs, no external process/admin policy, and consent to image/vision/STT selection and plugin activation (without tool-override permission). If uncertain about organizational policy, stop and ask the administrator. Browser permission is not proof of unmanaged status.

## Source-backed equivalence and limits

Inspected installed source: an installed Hermes source checkout, plus official configuration docs at https://hermes-agent.nousresearch.com/docs/user-guide/configuration/.

- credential_lifecycle.py:166-199 saves env, rotates mirrors only when an old credential exists and differs, and refreshes pools only for statically registered env vars. The isolated runtime probe verifies HERMES_CUSTOM_AIZAMIN_API_KEY has no registry owners. A fresh env variable therefore has no old-value mirrors or registered pool lifecycle to reconcile. Rotation is explicitly refused, not reimplemented.
- runtime_provider_custom.py:111-140 resolves keyed providers' key_env through the profile secret resolver. agent/credential_pool.py:510-547 tries durable and legacy custom pool keys. Existing AI Zamin references in config/env/auth/cache and all custom-prefixed pools are conservatively refused; auth.json and model caches are never rewritten, pruned or unsuppressed.
- plugins_discovery.py:180-225 admits user plugins through enabled/disabled metadata, not a CLI-only receipt. Explicit plugin consent enables the two source-reviewed plugins; tool override is false. Existing plugin targets are refused rather than overwritten. Native image and STT SDK dependencies are supplied by installed Hermes, not customer-installed tools introduced by this writer.
- config.py:283-303 checks HERMES_MANAGED and the profile .managed marker. managed_scope.py:46-60 additionally resolves HERMES_MANAGED_DIR or /etc/hermes outside the selected profile. The browser refuses any profile marker or managed env hint; absence of external policy is a separate, mandatory user attestation, **not automatically verified**. Browser code never disables policy.
- env_loader.py:610-630 supports external `secrets` sources that may shadow dotenv. Profiles containing that section are refused. The user also confirms no process-level override for the new key.
- Active `model` is untouched, as are prior provider credentials and image/STT-specific keys/settings. Only image/vision/STT provider selections change under explicit consent. Existing explicit platform tool allowlists are extended with image_gen and vision; implicit platform defaults are left alone. Disabled global toolsets cause refusal. This deliberately does not claim full parity with the CLI's evolving composite/default-tool resolver: if a surface still hides a tool, enable it in Hermes Tools.

YAML uses a bundled syntax-aware document parser preserving comments; duplicate keys, aliases/merges and custom tags fail closed. Existing env bytes are retained and a strictly validated new credential assignment appended. Read dependencies include policy marker, auth/cache and plugin files. All are checked again before backups/writes. Multi-file writes are not atomic; app closure is mandatory, and partial completion is reported. Browser cannot chmod or guarantee filesystem privacy; private directory/backups remain the user's responsibility.

## Verification

- Node planner tests: fresh six-file plan, unchanged active model, retained auxiliary settings/env, explicit allowlists, comments, no executable/auth output, mandatory consents, managed marker/env, external secret sources, existing credential/provider/pool/plugin, corrupt auth/YAML, duplicate keys, aliases, disabled toolsets/plugin rejection.
- Isolated headless Edge: production HTML/bundle and real OPFS directory handles; six Hermes files written/read back and original YAML backup checked. OPFS is **not an OS folder grant**. Codex/OpenCode checks remain.
- `HERMES_SOURCE=<installed-source> node tests/setup-hermes-runtime.cjs`: synthetic temporary HERMES_HOME, sanitized inherited credentials, real installed dotenv/config/provider/tool resolvers and plugin modules. Confirms named chat/image endpoint and key, STT availability/public default, explicit tool admission, unchanged active chat. No network/paid requests or actual audio/image generation. Only the installed version was exercised.

## OS approval blocker

Prior Windows Select Folder tool approval timed out and refused retry. This continuation does not invoke any picker, retry approval or bypass it. Default browser regression no longer calls even the headless picker. Actual OS directory permission and end-to-end disk writing through that grant remain pending the user's manual interaction. The legacy opt-in headed fixture must not be run without renewed user authorization.

No real user profile modified by verification; release provenance is recorded separately by Git and the deployed image revision.
