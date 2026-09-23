"""Actual native writer + installed Hermes, temporary profiles and synthetic key."""
import json, os, pathlib, subprocess, tempfile
import yaml
ROOT=pathlib.Path(__file__).resolve().parents[2]
with tempfile.TemporaryDirectory(prefix='aizamin-real-profiles-') as tmp:
    home=pathlib.Path(tmp)
    env={k:v for k,v in os.environ.items() if not any(s in k for s in ('API_KEY','TOKEN','SECRET'))}
    env.update(HERMES_HOME=tmp,HERMES_PROFILE='default',HERMES_SKIP_UPDATE_CHECK='1')
    (home/'config.yaml').write_text('model:\n  default: untouched-fixture\n')
    retired=home/'profiles/aizamin-chat';retired.mkdir(parents=True)
    (retired/'.aizamin-managed').write_bytes(b'1\n')
    (retired/'state.db').write_bytes(b'conversation fixture')
    payload=json.loads(subprocess.check_output(['node','-e',"console.log(JSON.stringify(require(process.argv[1]).buildInstaller('hermes','windows','fake-profile-test','removed').payload))",str(ROOT/'setup.js')],text=True))
    file=home/'payload.json';file.write_text(json.dumps(payload))
    for attempt in range(2):
        result=subprocess.run([os.environ['AIZAMIN_PROFILE_BINARY'],'--payload',str(file),'--no-pause'],env=env,cwd=tmp,text=True,capture_output=True)
        print(result.stdout,result.stderr)
        if result.returncode: raise SystemExit(result.returncode)
    for name in ('aizamin-lite','aizamin-standard'):
        p=home/'profiles'/name
        config=yaml.safe_load((p/'config.yaml').read_text(encoding='utf-8'))
        assert config['stt']['provider']=='aizamin'
        assert config['model']['provider']=='aizamin'
        assert 'models' not in config.get('providers',{}).get('aizamin',{})
        assert config['aizamin_catalog']['url'].endswith('/hermes-'+name.split('-')[1]+'/v1/models')
        assert (p/'plugins/model-providers/aizamin/__init__.py').is_file()
        assert list(p.glob('config.yaml.aizamin.backup.*'))
        if name.endswith('lite'):
            assert config['toolsets']==['terminal']
            assert all(config['platform_toolsets'][s]==['terminal'] for s in ('cli','desktop','tui','api'))
    assert not retired.exists()
    archived=list((home/'aizamin-archives').glob('*/state.db'))
    assert len(archived)==1 and archived[0].read_bytes()==b'conversation fixture'
    assert (home/'config.yaml').read_text()=='model:\n  default: untouched-fixture\n'
    print('PASS: native writer repeat setup, both scopes, STT, archive, untouched default')
