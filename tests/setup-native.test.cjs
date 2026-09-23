// Build-time/browser payload contract; Node is used only by developer tests.
const assert = require('node:assert/strict');
const { buildInstaller, assembleInstaller } = require('../setup.js');
assert.ok(buildInstaller('codex','windows','fake-test-key').content.includes('https://github.com/amfad33/ai-zamin-configurer'));
assert.ok(!buildInstaller('codex','windows','fake-test-key').content.includes('ai-zamin-website'));
for (const app of ['codex','hermes','opencode']) for (const os of ['windows','macos','linux']) for (const arch of ['amd64','arm64']) {
 const a=buildInstaller(app,os,'fake-test-key','gpt-5.5',['gpt-5.5','future-model'],arch);
 assert.equal(a.payload.app,app); assert.equal(a.payload.version,1);
 assert.ok(a.binaryUrl.includes(`${os}-${arch}`));
 assert.equal(a.filename.endsWith('.exe'),os==='windows');
 assert.ok(!a.content.includes('command = "node"'));
 const b=assembleInstaller(new Uint8Array([1,2,3]),a);
 if(os==='macos') {
   const script=Buffer.from(b).toString();
   assert.deepEqual(Buffer.from(script.split("<<'AIZAMIN_BINARY'\n")[1].split('\nAIZAMIN_BINARY')[0],'base64'),Buffer.from([1,2,3]));
   assert.deepEqual(JSON.parse(Buffer.from(script.split("<<'AIZAMIN_PAYLOAD'\n")[1].split('\nAIZAMIN_PAYLOAD')[0],'base64')),a.payload);
 } else {
 const magicLength = Buffer.byteLength('AIZAMIN_CONFIG_V1');
 const footer=Buffer.from(b).subarray(-magicLength).toString();assert.equal(footer,'AIZAMIN_CONFIG_V1');
 const end = b.length-magicLength-8;
 const size=Number(Buffer.from(b).readBigUInt64LE(end));
 assert.deepEqual(JSON.parse(Buffer.from(b).subarray(end-size,end)),a.payload);
 }
 if(app==='hermes'){assert.equal(a.payload.catalog,undefined);assert.ok(a.payload.plugin['__init__.py'].includes('class AIZaminImageGenProvider'))}
 if(app==='opencode'){assert.ok(a.payload.tool.includes('gpt-image-2.5-flare'));assert.equal(a.payload.provider.models['gpt-5.5'].attachment,true)}
}
assert.throws(()=>buildInstaller('codex','windows','fake\nkey'),/single line/);
assert.throws(()=>buildInstaller('hermes','windows','fake-test-key','whisper-large-v3-turbo'),/coding models/);
for (const os of ['windows','macos','linux']) {
 const catalog=buildInstaller('hermes',os,'fake-test-key','gpt-5.5',['whisper-large-v3','whisper-large-v3-turbo','groq/whisper-large-v3','gpt-5.5']).payload.catalog;
 assert.equal(catalog,undefined);
}
console.log('Native browser payload matrix: 18 artifacts verified');
