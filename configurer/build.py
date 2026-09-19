"""Build-only release tool; customers need no Python, Go or Node runtime."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import subprocess

ROOT = Path(__file__).resolve().parent
VERSION = '2.0.0'

def main():
    p = argparse.ArgumentParser()
    p.add_argument('--go', default=os.environ.get('AIZAMIN_GO', 'go'))
    p.add_argument('--out', default=str(ROOT / 'dist' / VERSION))
    p.add_argument('--windows-only', action='store_true')
    args = p.parse_args()
    out = Path(args.out).resolve(); out.mkdir(parents=True, exist_ok=True)
    subprocess.run(['node', str(ROOT / 'embed.cjs')], check=True)
    subprocess.run([args.go,'run','github.com/tc-hib/go-winres@v0.3.3','simply','--arch','amd64,arm64',
        '--icon','embedded/favicon.ico','--product-version',VERSION,'--file-version',VERSION,
        '--product-name','AI Zamin Configurer','--file-description','AI Zamin application configuration helper',
        '--original-filename','aizamin-configurer.exe','--out','rsrc'],cwd=ROOT,check=True)
    artifacts=[]
    for target in (['windows'] if args.windows_only else ['windows','darwin','linux']):
        for arch in ['amd64','arm64']:
            label='macos' if target=='darwin' else target
            name=f'aizamin-configurer-{label}-{arch}'+('.exe' if target=='windows' else '.run')
            env={**os.environ,'GOOS':target,'GOARCH':arch,'CGO_ENABLED':'0','GOMAXPROCS':'1'}
            subprocess.run([args.go,'build','-p','1','-trimpath','-ldflags=-s -w','-o',str(out/name),'.'],cwd=ROOT,env=env,check=True)
            b=(out/name).read_bytes()
            artifacts.append({'file':name,'bytes':len(b),'sha256':hashlib.sha256(b).hexdigest()})
    (out/'manifest.json').write_text(json.dumps({'version':VERSION,'signed':False,'source':'https://github.com/amfad33/ai-zamin-configurer','artifacts':artifacts},indent=2)+'\n')
    (out/'SHA256SUMS').write_text(''.join(f"{a['sha256']}  {a['file']}\n" for a in artifacts))
    print(json.dumps({'version':VERSION,'output':str(out),'artifacts':len(artifacts),'signed':False}))

if __name__=='__main__':main()
