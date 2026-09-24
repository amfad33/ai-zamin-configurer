const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{pathToFileURL}=require('node:url');
(async()=>{
const root=fs.mkdtempSync(path.join(process.env.TMPDIR||'C:/Users/Amir Hosein/AppData/Local/hermes/cache/scratch','aizamin-plugin-'));fs.mkdirSync(path.join(root,'plugins'));
fs.copyFileSync(path.join(__dirname,'../configurer/opencode-plugin.mjs'),path.join(root,'plugins/aizamin.mjs'));fs.writeFileSync(path.join(root,'aizamin-image.json'),JSON.stringify({apiKey:'synthetic-only'}));
let generation=0,fail=false,sent=[];
globalThis.fetch=async(url,init)=>{assert.equal(init.redirect,'error');if(url.endsWith('/models')){assert.equal(init.headers.Authorization,'Bearer synthetic-only');if(fail)return {ok:false};return {ok:true,json:async()=>({data:[{id:url.includes('standard')?'standard-model':`opaque-${generation}`}]})};}sent.push(JSON.parse(init.body));return {ok:true};};
const factory=(await import(pathToFileURL(path.join(root,'plugins/aizamin.mjs')).href)).default;
const hooks=await factory();const config={provider:{openai:{models:{'standard-model':{attachment:true,variants:{high:{}}},stale:{}}}},agent:{'AI Zamin Lite':{permission:{'*':'allow'}}}};
await hooks.config(config);assert.deepEqual(Object.keys(config.provider['aizamin-lite'].models),['opaque-0']);assert.equal(config.provider.openai.models['standard-model'].attachment,true);assert.equal(config.provider.openai.models.stale,undefined);assert.equal(config.agent['AI Zamin Lite'].permission.read,'ask');
generation++;await hooks.config(config);assert.deepEqual(Object.keys(config.provider['aizamin-lite'].models),['opaque-1']);assert.equal(config.agent['AI Zamin Lite'].model,'aizamin-lite/opaque-1');
const input={model:{providerID:'aizamin-lite'},agent:'build',sessionID:'s'};await assert.rejects(hooks['chat.params'](input,{}),/select the AI Zamin Lite agent/);await assert.rejects(hooks['chat.params']({...input,agent:'AI Zamin Lite',model:{providerID:'openai',id:'standard-model'}},{}),/switch to Build/);
const standard={system:['preserved']};await hooks['experimental.chat.system.transform']({model:{providerID:'openai'}},standard);assert.deepEqual(standard.system,['preserved']);
const transport=config.provider['aizamin-lite'].options.fetch;const body={model:'opaque-1',messages:[{role:'user',content:'LATEST_USER_SENTINEL'}],tools:[]};await transport('https://aizamin.ir/v1/chat/completions',{body:JSON.stringify(body)});assert.equal(sent[0].messages[0].content,'LATEST_USER_SENTINEL');
await assert.rejects(transport('https://aizamin.ir/v1/chat/completions',{body:JSON.stringify({...body,messages:[{role:'user',content:'x'.repeat(7000)}]})}),/Nothing was sent or silently dropped/);assert.equal(sent.length,1);
fail=true;await assert.rejects(hooks.config(config),/catalog unavailable/);
console.log('PASS plugin contracts: live catalog changes, standard preservation, permissions, model guards, history preserved, cap, fail closed');
})().catch(e=>{console.error(e);process.exit(1)});
