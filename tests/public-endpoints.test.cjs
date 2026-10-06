// Offline endpoint contract: browser artifacts plus native/plugin defaults.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { buildInstaller } = require('../setup.js');
const endpoint = 'https://ai.aizamin.ir/v1';
const source = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');

const payload = buildInstaller('opencode', 'windows', 'fake-test-key').payload;
assert.equal(payload.provider.options.baseURL, endpoint);
for (const action of ['edits', 'generations']) {
  assert.ok(payload.tool.includes(`${endpoint}/images/${action}`));
}
// These checks also run on development hosts without the Go/Hermes runtimes.
assert.ok(source('configurer/main.go').includes(`const endpoint = "${endpoint}"`));
assert.ok(source('configurer/hermes-stt/__init__.py').includes(`ENDPOINT = "${endpoint}"`));
const catalog = source('configurer/hermes-models/__init__.py');
assert.ok(catalog.includes(`base_url='${endpoint}'`));
assert.ok(catalog.includes('https://ai.aizamin.ir/hermes-standard/v1/models'));
assert.ok(source('configurer/apps.go').includes('https://ai.aizamin.ir/hermes-'));
for (const file of ['setup.js', 'configurer/main.go', 'configurer/apps.go',
  'configurer/hermes-stt/__init__.py', 'configurer/hermes-models/__init__.py',
  'configurer/opencode-plugin.mjs']) {
  assert.doesNotMatch(source(file), /https:\/\/aizamin\.ir(?:\/v1|\/hermes-|['"])/, file);
}
console.log('PASS public endpoint contract: browser inference/images, native default, Hermes STT/catalog');
