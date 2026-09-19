const assert = require('node:assert/strict');
const direct = require('../assets/setup-direct.js');
const {buildInstaller} = require('../setup.js');
(async () => {
 const artifact=buildInstaller('opencode','windows','synthetic-test-key');
 const files={'opencode.jsonc':'{\n // keep comment\n "provider":{"other":{"name":"keep"}}, "agent":{"build":{"options":{"other":true}}},\n}'};
 const plan=await direct.plan(artifact, async p=>files[p] ?? null);
 const config=direct.parseJSON(plan.find(f=>f.path==='opencode.jsonc').text);
 assert.equal(config.provider.other.name,'keep');
 assert.equal(config.provider.openai.options.apiKey,'synthetic-test-key');
 assert.ok(plan[0].text.includes('// keep comment'));
 assert.equal(config.agent.build.options.other,true);
 assert.ok(plan.find(f=>f.path==='tools/aizamin_image.ts').text.includes('reference_images'));
 await assert.rejects(()=>direct.plan(artifact,async p=>p==='opencode.jsonc' ? '{broken' : null));
 const codex=buildInstaller('codex','windows','synthetic-test-key');
 const cp=await direct.plan(codex,async p=>p==='config.toml'?'# retained in backup\n[other]\nvalue = 123\n':p==='auth.json'?'{}':null,'C:\\Users\\Test\\.codex',new Uint8Array([77,90]));
 const parsed=direct.parseTOML(cp.find(f=>f.path==='config.toml').text);
 assert.equal(parsed.other.value,123);
 assert.equal(parsed.mcp_servers.aizamin_image.command,'C:/Users/Test/.codex/aizamin/aizamin-image.exe');
 assert.equal(parsed.features.goals,true);
 assert.equal(parsed.model,'gpt-5.5');
 await assert.rejects(()=>direct.plan(codex,async()=>null,'.codex',new Uint8Array([77,90])));
 assert.equal(direct.capability('hermes',{isSecureContext:true,showDirectoryPicker(){}}).ok,true);
 const hermes=buildInstaller('hermes','windows','synthetic-test-key');
 const consent={profileConfirmed:true,unmanagedConfirmed:true,pluginsConfirmed:true};
 const fixture={'config.yaml':'model:\n  provider: anthropic\n  default: existing\nstt:\n  openai:\n    model: whisper-1\nimage_gen:\n  openai:\n    model: retained\n',' .env':'unused','.env':'OPENAI_API_KEY=existing-private-key\n'};
 const hp=await direct.plan(hermes,async p=>fixture[p]??null,'',null,consent);
 assert.ok(hp.some(f=>f.path==='config.yaml'));
 assert.ok(hp.some(f=>f.path==='plugins/stt/aizamin/__init__.py'));
 assert.ok(!hp.some(f=>f.path===hermes.filename||f.path==='auth.json'));
 const hc=direct.parseYAML(hp.find(f=>f.path==='config.yaml').text);
 assert.deepEqual(hc.model,{provider:'anthropic',default:'existing'});
 assert.equal(hc.stt.openai.model,'whisper-1');
 assert.equal(hc.image_gen.openai.model,'retained');
 assert.equal(hc.providers.aizamin.key_env,'HERMES_CUSTOM_AIZAMIN_API_KEY');
 assert.equal(hc.stt.provider,'aizamin');
 assert.ok(hp.find(f=>f.path==='.env').text.startsWith(fixture['.env']));
 await assert.rejects(()=>direct.plan(hermes,async p=>fixture[p]??null));
 for(const extra of [
  {'.managed':''},
  {'.env':'HERMES_MANAGED=true\n'},
  {'config.yaml':'secrets:\n  sources: [{provider: external}]\n'},
  {'.env':'HERMES_CUSTOM_AIZAMIN_API_KEY=old\n'},
  {'config.yaml':'providers:\n  aizamin:\n    api: https://old.invalid\n'},
  {'auth.json':'{"credential_pool":{"custom:other":[{"api_key":"old"}]}}'},
  {'auth.json':'{broken'},
  {'config.yaml':'a: &anchor {}\nb: *anchor\n'},
  {'config.yaml':'model: one\nmodel: two\n'},
  {'config.yaml':'plugins:\n  disabled: [aizamin-stt]\n'},
  {'config.yaml':'auxiliary:\n  vision:\n    api_key: retained-private-key\n'},
  {'config.yaml':'agent:\n  disabled_toolsets: [vision]\n'},
  {'plugins/stt/aizamin/__init__.py':'existing plugin'},
 ]) await assert.rejects(()=>direct.plan(hermes,async p=>({...fixture,...extra})[p]??null,'',null,consent));
 const explicit=await direct.plan(hermes,async p=>p==='config.yaml'?'# preserve comment\nmodel: retained\nplatform_toolsets:\n  cli: [terminal]\nplugins:\n  enabled: [other]\n':fixture[p]??null,'',null,consent);
 const explicitConfig=direct.parseYAML(explicit.find(f=>f.path==='config.yaml').text);
 assert.deepEqual(explicitConfig.platform_toolsets.cli,['terminal','image_gen','vision']);
 assert.ok(explicit.find(f=>f.path==='config.yaml').text.includes('# preserve comment'));
 assert.equal(explicitConfig.plugins.entries['stt/aizamin'].allow_tool_override,false);
 console.log('Direct browser planning: JSONC preservation, TOML merge, absolute path, corruption and capability gates verified');
})().catch(error=>{console.error(error);process.exitCode=1;});
