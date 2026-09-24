// Real installed Desktop backend acceptance; synthetic upstream only.
// ELECTRON_RUN_AS_NODE=1 OpenCode.exe tests/opencode-runtime.test.cjs BACKEND_CHUNK
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict'),{pathToFileURL}=require('node:url');
const root=fs.mkdtempSync(path.join(process.env.AIZAMIN_TEST_SCRATCH||path.join(os.homedir(),'AppData/Local/hermes/cache/scratch'),'aizamin-opencode-'));
const dir=path.join(root,'config','opencode');fs.mkdirSync(path.join(dir,'plugins'),{recursive:true});
fs.copyFileSync(path.join(__dirname,'../configurer/opencode-plugin.mjs'),path.join(dir,'plugins','aizamin.mjs'));
fs.writeFileSync(path.join(dir,'aizamin-image.json'),JSON.stringify({apiKey:'synthetic-only'}));
for(const [k,v] of Object.entries({HOME:root,USERPROFILE:root,OPENCODE_TEST_HOME:root,XDG_CONFIG_HOME:path.join(root,'config'),XDG_DATA_HOME:path.join(root,'data'),XDG_STATE_HOME:path.join(root,'state'),XDG_CACHE_HOME:path.join(root,'cache'),OPENCODE_CONFIG_DIR:dir,OPENCODE_DB:path.join(root,'probe.db'),OPENCODE_DISABLE_MODELS_FETCH:'1',OPENCODE_DISABLE_DEFAULT_PLUGINS:'1',OPENCODE_DISABLE_EXTERNAL_SKILLS:'1',OPENCODE_DISABLE_CLAUDE_CODE_SKILLS:'1'}))process.env[k]=v;
fs.writeFileSync(path.join(root,'fixture.txt'),'REAL_READ_OK');
fs.writeFileSync(path.join(root,'AGENTS.md'),'INHERITED_INSTRUCTION '.repeat(2000));
process.env.OPENCODE_CONFIG_CONTENT=JSON.stringify({snapshot:false,plugin:[pathToFileURL(path.join(dir,'plugins','aizamin.mjs')).href],permission:{'*':'allow'},provider:{openai:{options:{apiKey:'synthetic-only'},models:{'standard-a':{attachment:true,modalities:{input:['text','image'],output:['text']}}}}},agent:{'AI Zamin Lite':{permission:{'*':'allow'},prompt:'UNSAFE_INHERITED'}},mcp:{inherited:{type:'remote',url:'http://127.0.0.1:1/mcp',enabled:false}}});
process.chdir(root);
(async()=>{
const http=require('node:http'),requests=[];let calls=0;
const upstream=http.createServer(async(req,res)=>{let raw='';for await(const chunk of req)raw+=chunk;assert.equal(req.headers.authorization,'Bearer synthetic-only');
res.setHeader('Content-Type','application/json');
if(req.url.endsWith('/models')){requests.push({url:req.url});res.end(JSON.stringify({data:[{id:req.url.includes('standard')?'standard-a':'opaque-route'}]}));return;}
const body=JSON.parse(raw);requests.push({url:req.url,body});calls++;
const delta=calls===2?{role:'assistant',tool_calls:[{index:0,id:'call_bash',type:'function',function:{name:'bash',arguments:JSON.stringify({command:'printf REAL_BASH_OK',description:'Synthetic acceptance marker'})}}]}:calls===1?{role:'assistant',tool_calls:[{index:0,id:'call_read',type:'function',function:{name:'read',arguments:JSON.stringify({filePath:path.join(root,'fixture.txt'),limit:10})}}]}:{role:'assistant',content:'MOCK_OK'};
res.setHeader('Content-Type','text/event-stream');res.end('data: '+JSON.stringify({id:'mock',object:'chat.completion.chunk',created:1,model:body.model,choices:[{index:0,delta,finish_reason:null}]})+'\n\ndata: '+JSON.stringify({id:'mock',object:'chat.completion.chunk',created:1,model:body.model,choices:[{index:0,delta:{},finish_reason:calls<=2?'tool_calls':'stop'}],usage:{prompt_tokens:100,completion_tokens:2,total_tokens:102}})+'\n\ndata: [DONE]\n\n');});
await new Promise(r=>upstream.listen(0,'127.0.0.1',r));const original=globalThis.fetch;globalThis.fetch=(url,init)=>original(String(url).replace('https://aizamin.ir',`http://127.0.0.1:${upstream.address().port}`),init);
const m=await import(pathToFileURL(process.argv[2]).href);const server=await m.Server.listen({hostname:'127.0.0.1',port:0});
const api=async(p,data)=>{const r=await fetch(new URL(p,server.url),data?{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)}:{});const text=await r.text();if(!r.ok)throw Error(p+' '+r.status+' '+text);return JSON.parse(text);};
const providers=await api('/provider');assert.deepEqual(Object.keys(providers.all.find(p=>p.id==='aizamin-lite').models),['opaque-route']);
const agents=await api('/agent');console.log('LITE_AGENT',JSON.stringify(agents.find(a=>a.name==='AI Zamin Lite')));
const session=await api('/session',{});let approved=new Set();
const timer=setInterval(async()=>{try{for(const permission of await api('/permission')){approved.add(permission.permission);await api('/permission/'+permission.id+'/reply',{reply:'once'});}}catch(e){console.error('approval',e.message)}},100);
const answer=await api('/session/'+session.id+'/message',{model:{providerID:'aizamin-lite',modelID:'opaque-route'},agent:'AI Zamin Lite',parts:[{type:'text',text:'Read fixture.txt and say MOCK_OK'}]});clearInterval(timer);
assert.ok(JSON.stringify(answer).includes('MOCK_OK'),JSON.stringify(answer));assert.deepEqual([...approved].sort(),['bash','read']);assert.ok(requests.some(r=>r.body?.messages.some(m=>m.role==='tool'&&JSON.stringify(m).includes('REAL_READ_OK'))));
assert.ok(requests.some(r=>r.body?.messages.some(m=>m.role==='tool'&&JSON.stringify(m).includes('REAL_BASH_OK'))));
for(const r of requests.filter(r=>r.body)){assert.deepEqual(r.body.tools.map(t=>t.function.name).sort(),['bash','read']);assert.ok(Buffer.byteLength(JSON.stringify(r.body))<=6500);assert.ok(!JSON.stringify(r.body).includes('INHERITED_INSTRUCTION'));}
const before=calls;const bad=await api('/session/'+session.id+'/message',{model:{providerID:'aizamin-lite',modelID:'opaque-route'},agent:'AI Zamin Lite',parts:[{type:'text',text:'x'.repeat(12000)}]});assert.equal(calls,before);assert.ok(JSON.stringify(bad).includes('safety budget'),JSON.stringify(bad));
fs.writeFileSync(path.join(root,'requests.json'),JSON.stringify(requests,null,2));console.log('PASS real Desktop runtime: catalog, schema, approval/read execution, follow-up, request cap; captures '+path.join(root,'requests.json'));await server.stop();upstream.close();process.exit(0);
})().catch(e=>{console.error(e);process.exit(1)});
