"""One real native install, real Hermes discovery, changing authenticated mock API.

Run with Hermes' Python, its checkout on PYTHONPATH and AIZAMIN_PROFILE_BINARY
pointing at a freshly built configurer. No paid inference or operator config.
"""
import json
import os
import pathlib
import subprocess
import sys
import tempfile
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import yaml

ROOT = pathlib.Path(__file__).resolve().parents[2]
KEY = 'synthetic-catalog-key'


class Handler(BaseHTTPRequestHandler):
    catalogs = {'lite': ['lite-first', 'lite-removed'], 'standard': ['main-first', 'main-removed']}
    requests = []
    def log_message(self, *args):
        pass
    def do_GET(self):
        if self.headers.get('Authorization') != 'Bearer ' + KEY:
            self.send_response(401)
            self.end_headers()
            return
        scope = self.path.split('/')[1]
        self.requests.append(scope)
        self.send_response(200)
        self.end_headers()
        self.wfile.write(json.dumps({'data': [{'id': x} for x in self.catalogs[scope]]}).encode())


PROBE = """
import json, socket
original_connect = socket.socket.connect
def loopback_only(sock, address):
    if isinstance(address, tuple) and address[0] not in {'127.0.0.1', '::1', 'localhost'}:
        raise OSError('external network blocked by fixture')
    return original_connect(sock, address)
socket.socket.connect = loopback_only
from hermes_cli.env_loader import load_hermes_dotenv
load_hermes_dotenv()
from providers import get_provider_profile, list_providers
p = get_provider_profile('aizamin')
assert p is not None
from hermes_cli.config import load_config
from hermes_cli.models import provider_model_ids
from hermes_cli.model_switch_providers import list_authenticated_providers
c = load_config()
ids = provider_model_ids('aizamin')
rows = list_authenticated_providers(current_provider='aizamin', current_model=c['model']['default'],
    max_models=None, refresh=True, excluded_providers=[p.name for p in list_providers() if p.name != 'aizamin'])
row = next((r for r in rows if r.get('slug') == 'aizamin'), None)
if ids:
    assert row and set(row['models']) == set(ids), row
print('RESULT:' + json.dumps({'models': ids, 'selected': c['model']['default']}))
"""


def main():
    server = ThreadingHTTPServer(('127.0.0.1', 0), Handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    try:
        with tempfile.TemporaryDirectory(prefix='aizamin-live-artifact-') as tmp:
            home = pathlib.Path(tmp)
            env = {k: v for k, v in os.environ.items() if not any(s in k for s in ('API_KEY', 'TOKEN', 'SECRET'))}
            env.update(HERMES_HOME=tmp, HERMES_PROFILE='default', HERMES_SKIP_UPDATE_CHECK='1')
            (home/'config.yaml').write_text('model:\n  default: untouched-fixture\n')
            retired = home/'profiles/aizamin-chat'
            retired.mkdir(parents=True)
            (retired/'.aizamin-managed').write_bytes(b'1\n')
            (retired/'state.db').write_bytes(b'preserved conversation')
            artifact = home/'setup.exe'
            js = """
const fs=require('node:fs'),s=require(process.argv[1]);
const p=s.buildInstaller('hermes','windows','synthetic-catalog-key','snapshot-retired',['snapshot-retired']);
fs.writeFileSync(process.argv[3],s.assembleInstaller(fs.readFileSync(process.argv[2]),p));
"""
            subprocess.run(['node', '-e', js, str(ROOT/'setup.js'), os.environ['AIZAMIN_PROFILE_BINARY'], str(artifact)], check=True)
            result = subprocess.run([str(artifact), '--no-pause'], env=env, text=True, capture_output=True, timeout=240)
            if result.returncode:
                raise AssertionError(result.stdout + result.stderr)
            assert {x.name for x in (home/'profiles').iterdir() if x.is_dir()} == {'aizamin-lite', 'aizamin-standard'}
            assert list((home/'aizamin-archives').glob('*/state.db'))[0].read_bytes() == b'preserved conversation'
            assert (home/'config.yaml').read_text() == 'model:\n  default: untouched-fixture\n'
            for scope in ('lite', 'standard'):
                p = home/'profiles'/('aizamin-'+scope)
                assert (p/'plugins/model-providers/aizamin/__init__.py').read_bytes() == (ROOT/'configurer/hermes-models/__init__.py').read_bytes()
                # Only the fixture endpoint changes, via the actual supported CLI.
                subprocess.run(['hermes', '-p', 'aizamin-'+scope, 'config', 'set', 'aizamin_catalog.url',
                                f'http://127.0.0.1:{server.server_port}/{scope}/models'], env=env, check=True, capture_output=True)

            def startup(scope):
                profile = home/'profiles'/('aizamin-'+scope)
                local_env = {**env, 'HERMES_HOME': str(profile), 'HERMES_PROFILE': 'aizamin-'+scope}
                out = subprocess.check_output([sys.executable, '-c', PROBE], env=local_env, text=True, timeout=60)
                result = json.loads(next(x[7:] for x in out.splitlines() if x.startswith('RESULT:')))
                expected = set(Handler.catalogs[scope])
                assert set(result['models']) == expected, result
                assert result['selected'] in expected if expected else result['selected'] == 'aizamin-catalog-unavailable'
                config = yaml.safe_load((profile/'config.yaml').read_text(encoding='utf-8'))
                assert 'models' not in config.get('providers', {}).get('aizamin', {})
                return set(result['models'])

            for catalog in (
                {'lite': ['lite-first', 'lite-removed'], 'standard': ['main-first', 'main-removed']},
                {'lite': ['lite-added'], 'standard': ['main-added']},
                {'lite': [], 'standard': []},
                {'lite': ['lite-restored'], 'standard': ['main-restored']},
            ):
                Handler.catalogs = catalog
                lite, standard = startup('lite'), startup('standard')
                assert not lite & standard
                assert lite | standard == set(catalog['lite'] + catalog['standard'])
                assert 'snapshot-retired' not in lite | standard
            assert set(Handler.requests) == {'lite', 'standard'}
            print('PASS: one assembled Windows install; two real Hermes profiles; changing authenticated catalogs; exact disjoint union; removed defaults/cache/snapshot absent; empty/recovery; chat archived; default untouched')
    finally:
        server.shutdown()


if __name__ == '__main__':
    main()
