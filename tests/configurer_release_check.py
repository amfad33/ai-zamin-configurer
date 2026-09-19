"""Actual reusable release EXE local UI smoke, no website traffic or real profile."""
import hashlib
import json
import os
from pathlib import Path
import subprocess
import tempfile
import urllib.request


def check(binary):
    binary=Path(binary).resolve()
    before=hashlib.sha256(binary.read_bytes()).hexdigest()
    with tempfile.TemporaryDirectory() as tmp:
        # Empty PATH prevents even launching a browser: exercise HTTP without runtimes.
        env={**os.environ,'PATH':tmp,'USERPROFILE':tmp,'HOME':tmp,'CODEX_HOME':tmp,'XDG_CONFIG_HOME':tmp}
        proc=subprocess.Popen([str(binary)],env=env,stdout=subprocess.PIPE,stderr=subprocess.PIPE,text=True)
        try:
            assert proc.stdout.readline().strip()=='AI Zamin Configurer 2.0.0'
            proc.stdout.readline()
            address=proc.stdout.readline().strip()
            base,capability=address.split('/#')
            with urllib.request.urlopen(base) as r:
                assert b'AI Zamin Configurer' in r.read()
                assert r.headers['Cache-Control']=='no-store'
            req=urllib.request.Request(base+'/status',data=b'{}',headers={'Origin':base,'X-AIZamin-Capability':capability,'Content-Type':'application/json'})
            with urllib.request.urlopen(req) as r:assert json.load(r)['ready'] is False
            with urllib.request.urlopen(base+'/favicon.ico') as r:assert r.read(4)==b'\x00\x00\x01\x00'
        finally:
            proc.terminate();proc.wait(timeout=10)
    assert hashlib.sha256(binary.read_bytes()).hexdigest()==before
    print('Actual reusable Windows EXE: version, branded loopback UI, keyless locked state, icon, stripped PATH, unchanged SHA256 passed.')

if __name__=='__main__':
    import sys
    check(sys.argv[1])
