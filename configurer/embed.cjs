// Build-time only: embed existing reviewed generators without a customer runtime.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const {buildInstaller}=require(path.join(root,'setup.js'));
fs.mkdirSync(path.join(__dirname,'embedded'),{recursive:true});
for(const app of ['codex','opencode','hermes']) fs.writeFileSync(path.join(__dirname,'embedded',app+'.json'),JSON.stringify(buildInstaller(app,'windows','__AIZAMIN_KEY__').payload));
for(const [source,target] of [['favicon.ico','favicon.ico'],['aizamin-logo-header.png','logo.png']]) fs.copyFileSync(path.join(root,'assets/brand',source),path.join(__dirname,'embedded',target));
