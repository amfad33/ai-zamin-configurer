"""Native installers in isolated homes, PATH contains only a labeled fake Hermes.
Developer prerequisites: Go and Node (neither is needed on customer machines).
"""
import json
import os
from pathlib import Path
import platform
import shutil
import subprocess
import tempfile
import tomllib

ROOT = Path(__file__).resolve().parents[1]


def run_native_setup_check():
    go = os.environ.get('AIZAMIN_GO') or shutil.which('go')
    if not go:
        raise AssertionError('Native setup verification requires build-time Go; set AIZAMIN_GO')
    subprocess.run(['node', str(ROOT / 'tests/setup-native.test.cjs')], check=True)
    subprocess.run([go, 'test', '-p', '1', './...'], cwd=ROOT / 'configurer', check=True)
    with tempfile.TemporaryDirectory(prefix='aizamin-native-fixture-') as tmp:
        home = Path(tmp)
        suffix = '.exe' if os.name == 'nt' else ''
        binary = home / ('configurer' + suffix)
        fixture = home / 'fake-app-bin'
        fixture.mkdir()
        subprocess.run([go, 'build', '-p', '1', '-o', str(binary), '.'], cwd=ROOT / 'configurer', check=True)
        subprocess.run([go, 'build', '-p', '1', '-o', str(fixture / ('hermes' + suffix)), './testdata/fake-hermes.go'], cwd=ROOT / 'configurer', check=True)
        env = {**os.environ, 'PATH': str(fixture), 'HOME': tmp, 'USERPROFILE': tmp,
               'CODEX_HOME': str(home / 'codex'), 'XDG_CONFIG_HOME': str(home / 'xdg'),
               'HERMES_HOME': str(home / 'hermes'), 'AIZAMIN_IMAGE_KEY': ''}
        for directory in ['codex', 'hermes', 'xdg/opencode']:
            (home / directory).mkdir(parents=True)
        (home / 'codex/config.toml').write_text('approval_policy = "on-request"\n[model_providers.other]\nname = "keep"\n', encoding='utf-8')
        (home / 'codex/auth.json').write_text('{"old":"fixture"}', encoding='utf-8')
        (home / 'xdg/opencode/opencode.jsonc').write_text('// fixture\n{"model":"other/model","provider":{"other":{"name":"keep"}},}', encoding='utf-8')
        (home / 'hermes/config.yaml').write_text('model:\n  provider: untouched-fixture\n', encoding='utf-8')
        (home / 'hermes/.env').write_text('OTHER_KEY=fake-fixture\n', encoding='utf-8')
        target = {'Windows': 'windows', 'Darwin': 'macos', 'Linux': 'linux'}[platform.system()]
        arch = 'arm64' if platform.machine().lower() in ('arm64', 'aarch64') else 'amd64'
        # Build the exact browser assembled artifacts using fake, non-secret key.
        js = """
const fs=require('node:fs');const s=require(process.argv[1]);
for(const app of ['codex','opencode','hermes']){
 const a=s.buildInstaller(app,process.argv[4],'fake-test-key','gpt-5.5',['gpt-5.5','future-model','qwen3.8-27b','gpt-oss-120b','gpt-oss-20b','groq-compound'],process.argv[5]);
 fs.writeFileSync(process.argv[3]+'/'+a.filename,s.assembleInstaller(fs.readFileSync(process.argv[2]),a),{mode:0o700});
}
"""
        subprocess.run(['node', '-e', js, str(ROOT / 'setup.js'), str(binary), tmp, target, arch], check=True)
        for app in ['codex', 'opencode', 'hermes']:
            ext = '.exe' if target == 'windows' else '.command' if target == 'macos' else '.run'
            installer = home / f'aizamin-{app}-setup-{target}-{arch}{ext}'
            cmd = ['/bin/sh', str(installer)] if target == 'macos' else [str(installer), '--no-pause']
            for _ in range(2):
                subprocess.run(cmd, env=env, check=True, capture_output=True, text=True, timeout=60)
        config = tomllib.loads((home / 'codex/config.toml').read_text())
        assert config['approval_policy'] == 'on-request'
        assert config['model_providers']['other']['name'] == 'keep'
        assert config['model_providers']['OpenAI']['base_url'] == 'https://aizamin.ir/v1'
        assert config['forced_login_method'] == 'api'
        server = config['mcp_servers']['aizamin_image']
        assert Path(server['command']).is_file() and server['args'] == ['--mcp']
        requests = [{'jsonrpc': '2.0', 'id': 1, 'method': 'initialize'},
                    {'jsonrpc': '2.0', 'method': 'notifications/initialized'},
                    {'jsonrpc': '2.0', 'id': 2, 'method': 'tools/list'},
                    {'jsonrpc': '2.0', 'id': 3, 'method': 'tools/call', 'params': {'name': 'aizamin_image', 'arguments': {'prompt': 'fixture', 'output_directory': tmp}}}]
        result = subprocess.run([server['command'], *server['args']], env=env, input='\n'.join(map(json.dumps, requests))+'\n', capture_output=True, text=True, check=True, timeout=15)
        replies = [json.loads(line) for line in result.stdout.splitlines()]
        assert len(replies) == 3 and replies[1]['result']['tools'][0]['name'] == 'aizamin_image'
        assert replies[2]['result']['isError'] is True
        oc = json.loads((home / 'xdg/opencode/opencode.jsonc').read_text())
        assert oc['model'] == 'other/model' and oc['provider']['other']['name'] == 'keep'
        assert oc['provider']['openai']['models']['gpt-5.5']['attachment'] is True
        assert (home / 'xdg/opencode/tools/aizamin_image.ts').is_file()
        assert 'untouched-fixture' in (home / 'hermes/config.yaml').read_text()
        assert (home / 'hermes/profiles/aizamin-standard/plugins/image_gen/aizamin/__init__.py').is_file()
        calls = [json.loads(line) for line in (home / 'hermes/profiles/aizamin-standard/fake-cli-calls.jsonl').read_text().splitlines()]
        assert ['config','set','image_gen.provider','aizamin'] in calls
        assert ['config','set','auxiliary.vision.provider','aizamin'] in calls
        assert ['config','set','providers.aizamin.key_env','HERMES_CUSTOM_AIZAMIN_API_KEY'] in calls
        assert ['config','set','stt.provider','aizamin'] in calls
        assert ['config','set','stt.enabled','true'] in calls
        assert ['config','set','stt.aizamin.model','whisper-large-v3-turbo'] in calls
        assert ['config','set','stt.aizamin.base_url','https://aizamin.ir/v1'] in calls
        assert ['plugins','enable','stt/aizamin','--no-allow-tool-override'] in calls
        stt_source = (home / 'hermes/profiles/aizamin-standard/plugins/stt/aizamin/__init__.py').read_text()
        assert stt_source == (ROOT / 'configurer/hermes-stt/__init__.py').read_text()
        assert not any(c[:3] == ['config','set','GROQ_API_KEY'] or c[:3] == ['config','set','VOICE_TOOLS_OPENAI_KEY'] for c in calls)
        assert (home / 'hermes/.env').read_text() == 'OTHER_KEY=fake-fixture\n'
        assert not list((home / 'hermes').glob('*.aizamin.backup.*'))
        lite_calls = [json.loads(line) for line in (home / 'hermes/profiles/aizamin-lite/fake-cli-calls.jsonl').read_text().splitlines()]
        assert ['config','set','toolsets','["terminal"]'] in lite_calls
        assert ['tools','enable','image_gen'] not in lite_calls
        for path in ['codex/config.toml','codex/auth.json','hermes/profiles/aizamin-standard/config.yaml','xdg/opencode/opencode.jsonc']:
            assert len(list((home / path).parent.glob(Path(path).name+'.aizamin.backup.*'))) >= 2, path
        print('Native configurer and installed MCP executed twice with stripped PATH; fake Hermes fixture verified.')

if __name__ == '__main__':
    run_native_setup_check()
