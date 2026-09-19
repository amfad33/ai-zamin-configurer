const fs=require('node:fs');
const path=require('node:path');
require('esbuild').buildSync({absWorkingDir:path.join(__dirname,'..'),entryPoints:[path.join(__dirname,'direct.js')],bundle:true,define:{global:'globalThis',HERMES_STT_SOURCE:JSON.stringify(fs.readFileSync(path.join(__dirname,'../configurer/hermes-stt/__init__.py'),'utf8'))},platform:'browser',format:'iife',globalName:'AIZaminDirect',outfile:path.join(__dirname,'../assets/setup-direct.js'),footer:{js:'if (typeof module !== "undefined") module.exports = AIZaminDirect;'},legalComments:'eof'});
const licenses=['jsonc-parser','@iarna/toml','yaml'].map(name=>name+'\n'+fs.readFileSync(path.join(__dirname,'node_modules',name,name==='jsonc-parser'?'LICENSE.md':'LICENSE'),'utf8')).join('\n\n');
fs.writeFileSync(path.join(__dirname,'../assets/setup-direct.LICENSE.txt'),licenses);
