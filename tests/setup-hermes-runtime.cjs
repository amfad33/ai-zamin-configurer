// Installed-Hermes compatibility probe. Synthetic temporary home, no network calls.
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),cp=require('node:child_process');
const direct=require('../assets/setup-direct.js');
const {buildInstaller}=require('../setup.js');
(async()=>{
 const home=fs.mkdtempSync(path.join(os.tmpdir(),'aizamin-hermes-'));
 try {
  const initial='model:\n  provider: anthropic\n  default: retained-chat\nplatform_toolsets:\n  cli: [terminal]\n';
  const artifact=buildInstaller('hermes','windows','synthetic-fixture-key');
  const files=await direct.plan(artifact,async p=>p==='config.yaml'?initial:null,'',null,{profileConfirmed:true,unmanagedConfirmed:true,pluginsConfirmed:true});
  for(const f of files){const file=path.join(home,f.path);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,f.text);}
  const source=process.env.HERMES_SOURCE;
  if(!source)throw Error('Set HERMES_SOURCE to an installed Hermes source tree');
  const script=`import os,sys,importlib.util
from pathlib import Path
sys.path.insert(0,os.environ['HERMES_SOURCE'])
from hermes_constants import get_hermes_home
assert Path(get_hermes_home()).resolve()==Path(os.environ['HERMES_HOME']).resolve()
from hermes_cli.env_loader import load_hermes_dotenv
load_hermes_dotenv()
from hermes_cli.config import load_config
c=load_config()
assert c['model']['provider']=='anthropic' and c['model']['default']=='retained-chat'
from hermes_cli.credential_lifecycle import _providers_for_env_var
assert _providers_for_env_var('HERMES_CUSTOM_AIZAMIN_API_KEY')==[]
from hermes_cli.runtime_provider import resolve_runtime_provider
r=resolve_runtime_provider(requested='aizamin',target_model='gpt-5.5')
k=r['api_key']; k=k() if callable(k) else k
assert k=='synthetic-fixture-key' and r['base_url']=='https://aizamin.ir/v1'
from hermes_cli.tools_config import _get_platform_tools
tools=_get_platform_tools(c,'cli')
assert 'image_gen' in tools and 'vision' in tools
for category in ['image_gen','stt']:
 p=Path(os.environ['HERMES_HOME'])/'plugins'/category/'aizamin'/'__init__.py'
 spec=importlib.util.spec_from_file_location('fixture_'+category,p);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
 if category=='image_gen':
  key,url,_=m._runtime('gpt-image-2.5-flare-medium');assert key=='synthetic-fixture-key' and url=='https://aizamin.ir/v1'
 else:
  provider=m.AIZaminTranscriptionProvider();assert provider.is_available();assert provider.default_model()=='whisper-large-v3-turbo'
print('Installed Hermes: isolated named chat + image credential resolution, STT availability/model, tool admission and unchanged active chat verified; no paid requests')
`;
  const env={...process.env,HERMES_HOME:home,HERMES_MANAGED:'false',HERMES_MANAGED_DIR:path.join(home,'no-managed'),PYTHONIOENCODING:'utf-8'};
  // Do not inherit real provider credentials into this isolated probe.
  for(const key of Object.keys(env))if(/API_KEY|TOKEN|SECRET/.test(key))delete env[key];
  const out=cp.spawnSync(process.env.HERMES_PYTHON||'python',['-c',script],{env,encoding:'utf8'});
  if(out.status!==0)throw Error('Hermes compatibility probe failed: '+out.stderr);
  console.log(out.stdout.trim());
 }finally{fs.rmSync(home,{recursive:true,force:true});}
})().catch(e=>{console.error(e);process.exitCode=1;});
