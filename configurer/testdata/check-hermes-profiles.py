"""Opt-in real installed Hermes verification. Synthetic key, isolated root, no generation."""
import json, os, pathlib, subprocess, tempfile
ROOT = pathlib.Path(__file__).resolve().parents[2]
with tempfile.TemporaryDirectory(prefix='aizamin-real-profiles-') as tmp:
    home=pathlib.Path(tmp)
    env={k:v for k,v in os.environ.items() if not any(s in k for s in ('API_KEY','TOKEN','SECRET'))}
    env.update(HERMES_HOME=tmp, HERMES_PROFILE='default', HERMES_SKIP_UPDATE_CHECK='1')
    (home/'config.yaml').write_text('model:\n  default: untouched-fixture\n',encoding='utf-8')
    payload=json.loads(subprocess.check_output(['node','-e',"console.log(JSON.stringify(require(process.argv[1]).buildInstaller('hermes','windows','fake-profile-test','gpt-5.5',['gpt-5.5','qwen3.8-27b','gpt-oss-120b','gpt-oss-20b','groq-compound']).payload))",str(ROOT/'setup.js')],text=True))
    file=home/'payload.json';file.write_text(json.dumps(payload),encoding='utf-8')
    binary=os.environ['AIZAMIN_PROFILE_BINARY']
    for attempt in range(2):
        result=subprocess.run([binary,'--payload',str(file),'--no-pause'],env=env,cwd=tmp,text=True,capture_output=True)
        print(result.stdout,result.stderr)
        if result.returncode: raise SystemExit(result.returncode)
    import yaml
    for name in ('aizamin-lite','aizamin-standard','aizamin-chat'):
        config=yaml.safe_load((home/'profiles'/name/'config.yaml').read_text())
        assert config['stt']['provider']=='aizamin'
        assert config['providers']['aizamin']['key_env']=='HERMES_CUSTOM_AIZAMIN_API_KEY'
        assert list((home/'profiles'/name).glob('config.yaml.aizamin.backup.*'))
        actual=set(config['providers']['aizamin']['models'])
        assert actual==({'qwen3.8-27b','gpt-oss-120b','gpt-oss-20b'} if name.endswith('lite') else {'groq-compound'} if name.endswith('chat') else {'gpt-5.5'})
        if name.endswith('chat'):
            assert config['toolsets']==[] and str(config['agent']['tool_use_enforcement']).lower() == 'false'
        if name.endswith('lite'):
            assert config['toolsets']==['terminal']
            assert all(config['platform_toolsets'][surface]==['terminal'] for surface in ('cli','desktop','tui','api'))
        print(name,json.dumps({k:config.get(k) for k in ('model','toolsets','platform_toolsets')}))
    assert (home/'config.yaml').read_text()=='model:\n  default: untouched-fixture\n'
    probe = r'''
import json, socket, math, tiktoken
# Cache tokenizer data before blocking network; no provider request.
encodings=[tiktoken.get_encoding(name) for name in ('cl100k_base','o200k_base')]
# Deny external network: this checks generated prompt/schema, never generation.
def denied(*a, **k): raise RuntimeError('network forbidden in prompt probe')
socket.socket.connect=denied
from hermes_cli.config import load_config
from hermes_cli.tools_config import _get_platform_tools
from run_agent import AIAgent
config=load_config()
selected=sorted(_get_platform_tools(config,'cli'))
config['model']['default']=__import__('sys').argv[1]
a=AIAgent(model=config['model']['default'],provider='custom',base_url='http://127.0.0.1:9/v1',api_key='fake-profile-test',enabled_toolsets=selected,quiet_mode=True,cwd=__import__('os').getcwd())
prompt=a._build_system_prompt()
tools=a.tools
payload={'messages':[{'role':'system','content':prompt},{'role':'user','content':'Use the terminal to print hello and report the result.'}],'tools':tools}
serialized=json.dumps(payload,ensure_ascii=False)
counts={enc.name:len(enc.encode(serialized)) for enc in encodings}
budget=math.ceil(max(counts.values())*1.30)+512
print(json.dumps({'model':config['model']['default'],'toolsets':selected,'tools':[t['function']['name'] for t in tools],'system_chars':len(prompt),'schema_chars':len(json.dumps(tools)),'tokenizer_counts':counts,'conservative_budget_30pct_plus512':budget}))
if config['model']['default']=='groq-compound':
    assert selected==[] and tools==[]
else:
    assert selected == ['terminal']
    assert len(tools)==4 and any(t['function']['name']=='terminal' for t in tools)
assert budget<7000, 'Initial terminal baseline exceeds conservative budget'
print('Real tiktoken encodings with 30% + 512 margin; not exact Groq accounting.')
'''
    for name in ('aizamin-lite','aizamin-chat'):
        probe_env={**env,'HERMES_HOME':str(home/'profiles'/name)}
        for model in (('qwen3.8-27b','gpt-oss-120b','gpt-oss-20b') if name.endswith('lite') else ('groq-compound',)):
            subprocess.run([__import__('sys').executable,'-c',probe,model],env=probe_env,cwd=tmp,check=True)
    # Catalog shrink must fail before writes instead of blanking an existing default.
    previous=(home/'profiles/aizamin-lite/config.yaml').read_bytes()
    payload['catalog']={'gpt-5.5':{}}
    file.write_text(json.dumps(payload),encoding='utf-8')
    result=subprocess.run([binary,'--payload',str(file),'--no-pause'],env=env,cwd=tmp,capture_output=True,text=True)
    assert result.returncode != 0 and 'nothing changed' in result.stdout+result.stderr
    assert (home/'profiles/aizamin-lite/config.yaml').read_bytes()==previous
    print('Real CLI isolated managed profile configuration verified')
