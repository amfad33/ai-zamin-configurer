// Bundled locally: no customer runtime, CDN, or config upload.
const jsonc = require('jsonc-parser/lib/esm/main.js');
const toml = {parse:require('@iarna/toml/parse-string'), stringify:require('@iarna/toml/stringify')};
const {planHermes,parseYAML}=require('./hermes');
const enc = new TextEncoder();
function object(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('ساختار فایل تنظیمات معتبر نیست؛ هیچ فایلی تغییر نکرد.');
  return value;
}
function parseJSON(text) {
  const errors=[];
  const value=jsonc.parse(text,errors,{allowTrailingComma:true});
  if(errors.length) throw new Error('فایل JSON/JSONC خراب است؛ ابتدا آن را اصلاح کنید.');
  return object(value);
}
function parseTOML(text) { try { return toml.parse(text); } catch { throw new Error('فایل TOML خراب است؛ ابتدا آن را اصلاح کنید.'); } }
function section(parent,key) {
  if(Object.hasOwn(parent,key)) return object(parent[key]);
  return parent[key]={};
}
function capability(app, env=globalThis) {
  if (!env.isSecureContext || typeof env.showDirectoryPicker !== 'function') return {ok:false,reason:'این مرورگر دسترسی نوشتن پوشه ندارد. از Chrome یا Edge دسکتاپ روی HTTPS، یا تنظیم‌گر دانلودی استفاده کنید.'};
  if(app==='hermes') return {ok:true,reason:'Hermes: افزودن اولیه به پروفایل شخصی و غیرمدیریتی؛ تغییر کلید یا مهاجرت تنظیم قبلی فقط با تنظیم‌گر.'};
  return {ok:true,reason:''};
}
function absolutePath(path,os) {
  path=path.trim().replaceAll('\\','/').replace(/\/+$/,'');
  if (/[\x00-\x1f\x7f]/.test(path) || path.split('/').some(s=>s==='.'||s==='..') || (os==='windows' ? !/^[A-Za-z]:\//.test(path) : !path.startsWith('/'))) throw new Error('مسیر مطلق پوشه را دقیقاً از نوار نشانی فایل‌منیجر وارد کنید؛ مسیر نسبی یا ~ پذیرفته نیست.');
  return path;
}
async function plan(artifact,read,absolute='',binary=null,consent={}) {
  const p=artifact.payload;
  const output=[];
  const add=(path,text)=>output.push({path,text});
  if(p.app==='hermes') {
    output.push(...await planHermes(p,read,consent));
  } else if(p.app==='opencode') {
    let path='opencode.jsonc', text=await read(path);
    if(text===null) {path='opencode.json';text=await read(path);}
    if(text===null) {path='opencode.jsonc';text='{}\n';}
    const data=parseJSON(text);
    section(data,'provider');
    const agents=section(data,'agent');
    for(const name of ['build','plan']) section(section(agents,name),'options');
    const edits=[ [['provider','openai'],p.provider], [['agent','build','options','store'],false], [['agent','plan','options','store'],false], [['$schema'],'https://opencode.ai/config.json'] ];
    for(const [path,value] of edits) text=jsonc.applyEdits(text,jsonc.modify(text,path,value,{formattingOptions:{insertSpaces:true,tabSize:2,eol:'\n'}}));
    parseJSON(text);
    add(path,text);add('aizamin-image.json',JSON.stringify({apiKey:p.key},null,2)+'\n');add('tools/aizamin_image.ts',p.tool);
  } else if(p.app==='codex') {
    absolute=absolutePath(absolute,artifact.os);
    if(!binary || binary.length<2) throw new Error('فایل ابزار تصویر دریافت نشده است.');
    const c=parseTOML(await read('config.toml') ?? '');
    Object.assign(c,{model_provider:'OpenAI',model:'gpt-5.5',review_model:'gpt-5.5',model_reasoning_effort:'xhigh',disable_response_storage:true,cli_auth_credentials_store:'file',forced_login_method:'api'});
    section(c,'model_providers').OpenAI={name:'OpenAI',base_url:'https://aizamin.ir/v1',wire_api:'responses',requires_openai_auth:true};
    section(c,'features').goals=true;
    const name='aizamin/aizamin-image'+(artifact.os==='windows'?'.exe':'');
    section(c,'mcp_servers').aizamin_image={command:absolute+'/'+name,args:['--mcp'],tool_timeout_sec:360,env:{AIZAMIN_IMAGE_KEY:p.key}};
    const auth=await read('auth.json');
    // Canonical Codex login replaces auth; preserve prior login in mandatory backup.
    if(auth!==null) parseJSON(auth);
    output.push({path:name,bytes:binary});
    const result=toml.stringify(c);parseTOML(result);
    add('config.toml',result);add('auth.json',JSON.stringify({OPENAI_API_KEY:p.key},null,2)+'\n');
  } else throw new Error(capability(p.app).reason);
  return output;
}
async function fileHandle(root,path,create=false) {
  let dir=root;const parts=path.split('/');
  for(const part of parts.slice(0,-1)) dir=await dir.getDirectoryHandle(part,{create});
  return dir.getFileHandle(parts.at(-1),{create});
}
async function bytes(root,path) {
  try {const file=await (await fileHandle(root,path)).getFile(); if(file.size>32*1024*1024) throw new Error('فایل بزرگ‌تر از حد مجاز است.');return new Uint8Array(await file.arrayBuffer());}
  catch(e) {if(e.name==='NotFoundError') return null;throw e;}
}
function equal(a,b) {return a===null || b===null ? a===b : a.length===b.length && a.every((v,i)=>v===b[i]);}
async function write(root,path,data) {
  const stream=await (await fileHandle(root,path,true)).createWritable();
  try {await stream.write(data);await stream.close();} catch(e) {try {await stream.abort();}catch{}throw e;}
  if(!equal(await bytes(root,path),data)) throw new Error('بازخوانی فایل با نتیجهٔ مورد انتظار یکسان نیست.');
}
async function preflight(root,artifact,absolute,binary,consent={}) {
  const snapshots=new Map();
  async function read(path) {const b=await bytes(root,path);snapshots.set(path,b);return b===null?null:new TextDecoder('utf-8',{fatal:true}).decode(b);}
  const files=await plan(artifact,read,absolute,binary,consent);
  for(const f of files) {if(!snapshots.has(f.path)) snapshots.set(f.path,await bytes(root,f.path));f.bytes=f.bytes || enc.encode(f.text);delete f.text;}
  return {files,snapshots};
}
async function apply(root,prepared,onProgress=()=>{}) {
  // Check every read dependency before backups or writes; user must close the app.
  for(const [path,before] of prepared.snapshots) if(!equal(await bytes(root,path),before)) throw new Error('فایل‌ها پس از بررسی تغییر کرده‌اند؛ دوباره بررسی کنید. هیچ تنظیمی نوشته نشد.');
  const suffix='.aizamin.backup.'+new Date().toISOString().replace(/[:.]/g,'-')+'-'+crypto.randomUUID();
  const backups=[],written=[];
  try {
    for(const f of prepared.files) {const old=prepared.snapshots.get(f.path);if(old!==null) {const backup=f.path+suffix;if(await bytes(root,backup)!==null) throw new Error('Backup collision');await write(root,backup,old);backups.push(backup);onProgress({backups:[...backups],written:[...written]});}}
    for(const f of prepared.files) {await write(root,f.path,f.bytes);written.push(f.path);onProgress({backups:[...backups],written:[...written]});}
    return {backups,written};
  } catch {
    const error=new Error('عملیات کامل نشد. ممکن است بعضی فایل‌ها نوشته شده باشند؛ برنامه را اجرا نکنید. فهرست فایل‌های تأییدشده و پشتیبان‌ها را بررسی کنید.');
    error.result={backups,written};throw error;
  }
}
async function savedHandle(app,value) {
  const db=await new Promise((resolve,reject)=>{const req=indexedDB.open('aizamin-setup-folders',1);req.onupgradeneeded=()=>req.result.createObjectStore('handles');req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});
  try {return await new Promise((resolve,reject)=>{const tx=db.transaction('handles',value?'readwrite':'readonly');const req=value?tx.objectStore('handles').put(value,app):tx.objectStore('handles').get(app);let result;req.onsuccess=()=>{result=req.result;};tx.oncomplete=()=>resolve(result);tx.onerror=()=>reject(tx.error);});}finally{db.close();}
}
function mount(getArtifact) {
  const dialog=document.querySelector('[data-direct-dialog]');
  const status=dialog.querySelector('[data-direct-status]');
  const details=dialog.querySelector('[data-direct-files]');
  const picker=dialog.querySelector('[data-direct-pick]');
  const check=dialog.querySelector('[data-direct-check]');
  const commit=dialog.querySelector('[data-direct-write]');
  const close=dialog.querySelector('[data-direct-close]');
  const pathInput=dialog.querySelector('[data-direct-path]');
  const consent=dialog.querySelector('[data-direct-confirm]');
  const hermesChecks=[...dialog.querySelectorAll('[data-hermes-consent]')];
  hermesChecks.forEach(el=>el.addEventListener('change',()=>{pending();}));
  let artifact,root,remembered,prepared,busy=false;
  const message=text=>{status.textContent=text;};
  const pending=()=>{prepared=null;consent.checked=false;commit.disabled=true;details.textContent='';};
  const lock=value=>{busy=value;picker.disabled=value;check.disabled=value||!root;close.disabled=value;commit.disabled=true;pathInput.disabled=value;consent.disabled=value;hermesChecks.forEach(el=>{el.disabled=value;});};
  dialog.addEventListener('cancel',e=>{if(busy)e.preventDefault();});
  close.addEventListener('click',()=>{if(!busy){pending();artifact=null;root=null;dialog.close();}});
  pathInput.addEventListener('input',pending);
  consent.addEventListener('change',()=>{commit.disabled=busy||!prepared||!consent.checked;});
  document.querySelectorAll('[data-direct]').forEach(button=>{
    const support=capability(button.dataset.direct);button.disabled=!support.ok;
    const reason=document.createElement('small');reason.textContent=support.reason;button.parentElement.after(reason);
    button.addEventListener('click',()=>{
      artifact=getArtifact(button.dataset.direct);if(!artifact)return;
      pending();root=null;remembered=null;pathInput.value='';consent.checked=false;lock(false);
      const codex=artifact.payload.app==='codex';
      dialog.querySelector('[data-hermes-options]').hidden=artifact.payload.app!=='hermes';
      hermesChecks.forEach(el=>{el.checked=false;});
      dialog.querySelector('[data-direct-path-label]').hidden=!codex;
      dialog.querySelector('[data-direct-title]').textContent='تنظیم مستقیم '+artifact.payload.app;
      dialog.querySelector('[data-direct-guide]').textContent=artifact.payload.app==='hermes'
        ? '۱. در Hermes مسیر پروفایل فعال را با hermes config path و hermes config env-path مشخص کنید؛ سپس همهٔ پنجره‌ها و gateway آن را ببندید و دقیقاً همان پوشهٔ دارای config.yaml و .env را انتخاب کنید. مسیر پیش‌فرض در macOS/Linux برابر ~/.hermes و در Windows برابر %LOCALAPPDATA%\\hermes است؛ پروفایل یا HERMES_HOME ممکن است متفاوت باشد. مرورگر پروفایل فعال و سیاست بیرون پوشه را تشخیص نمی‌دهد. فقط افزودن اولیه به نصب شخصی پشتیبانی می‌شود؛ تنظیم یا کلید قبلی AI Zamin جایگزین نمی‌شود.'
        : codex
        ? '۱. Codex را ببندید. پوشهٔ CODEX_HOME یا پوشهٔ پیش‌فرض .codex در خانهٔ کاربر را انتخاب کنید (Windows: %USERPROFILE%\\.codex؛ macOS/Linux: ~/.codex). اگر نیست، خودتان در فایل‌منیجر بسازید. مسیر کامل همان پوشه را وارد و تأیید کنید؛ مرورگر مسیر واقعی را نمی‌داند. ابزار تصویر بومی هم دریافت و در همین پوشه نوشته می‌شود.'
        : '۱. OpenCode را ببندید. فقط پوشهٔ opencode داخل XDG_CONFIG_HOME یا پوشهٔ پیش‌فرض ~/.config/opencode را انتخاب کنید (Windows: %USERPROFILE%\\.config\\opencode). اگر نیست، در فایل‌منیجر بسازید. تنظیم پیش‌فرض و providerهای دیگر حفظ می‌شوند؛ provider openai با تنظیمات AI Zamin جایگزین می‌شود.';
      message('مرورگر فقط به پوشه‌ای که تأیید می‌کنید دسترسی می‌گیرد. فایل‌ها به سرور ارسال نمی‌شوند. شروع از پوشهٔ قبلی یا Documents درخواست می‌شود؛ رفتن خودکار به مسیر دلخواه ممکن نیست.');
      dialog.showModal();
      savedHandle(artifact.payload.app).then(h=>{remembered=h;}).catch(()=>{});
    });
  });
  picker.addEventListener('click',async()=>{
    pending();root=null;lock(true);
    try {
      const h=await showDirectoryPicker({id:'aizamin-'+artifact.payload.app,mode:'readwrite',startIn:remembered||'documents'});
      if(artifact.payload.app==='opencode' && h.name!=='opencode') throw new Error('فقط پوشهٔ opencode را انتخاب کنید.');
      if(await h.queryPermission({mode:'readwrite'})!=='granted') throw new Error('مجوز نوشتن پوشه داده نشده است.');
      root=h;remembered=h;await savedHandle(artifact.payload.app,h).catch(()=>{});
      message('۲. پوشهٔ انتخاب‌شده: '+h.name+' — اکنون بررسی فایل‌ها را بزنید. قبل از نوشتن، فهرست تغییرات نمایش داده می‌شود.');
    }catch(e){message(e.name==='AbortError'?'انتخاب لغو شد؛ هیچ فایلی تغییر نکرد.':e.name==='NotAllowedError'?'دسترسی رد شد؛ تنظیم‌گر دانلودی همچنان در دسترس است.':e.message);}
    finally{lock(false);}
  });
  check.addEventListener('click',async()=>{
    pending();lock(true);message('در حال بررسی فایل‌ها و دریافت ابزار لازم؛ هنوز چیزی نوشته نمی‌شود…');
    try {
      let binary=null,absolute='';
      if(artifact.payload.app==='codex') {
        absolute=absolutePath(pathInput.value,artifact.os);
        if(absolute.split('/').at(-1)!==root.name) throw new Error('نام انتهای مسیر با پوشهٔ انتخاب‌شده یکی نیست.');
      }
      if(artifact.payload.app==='codex') {
        const response=await fetch(artifact.binaryUrl,{credentials:'same-origin',redirect:'error'});
        if(!response.ok) throw new Error('دریافت ابزار تصویر انجام نشد؛ هیچ فایلی تغییر نکرد.');
        binary=new Uint8Array(await response.arrayBuffer());
        const magic=artifact.os==='windows'?[77,90]:artifact.os==='linux'?[127,69,76,70]:[207,250,237,254];
        if(binary.length<1024||!magic.every((v,i)=>binary[i]===v)) throw new Error('فایل ابزار تصویر معتبر نیست.');
      }
      prepared=await preflight(root,artifact,absolute,binary,Object.fromEntries(hermesChecks.map(el=>[el.dataset.hermesConsent,el.checked])));
      details.textContent=prepared.files.map(f=>(prepared.snapshots.get(f.path)===null?'ایجاد: ':'پشتیبان و جایگزینی: ')+f.path).join('\n');
      message(artifact.payload.app==='hermes' ? '۳. افزودن provider جداگانه، کلید پروفایلی و افزونه‌های تصویر/صدا را تأیید کنید. مدل چت فعال، auth.json و کلیدهای قبلی تغییر نمی‌کنند. انتخاب تصویر، vision و STT به AI Zamin تغییر می‌کند؛ تنظیمات قبلی آن‌ها باقی می‌ماند. پشتیبان‌ها حاوی اطلاعات خصوصی هستند؛ مرورگر نمی‌تواند مجوزهای Unix را محدود کند.' : '۳. فهرست را بررسی و تأیید کنید. ابتدا از تمام فایل‌های موجود نسخهٔ پشتیبان در همان پوشه ساخته می‌شود. قالب TOML ممکن است بازنویسی شود؛ اصل فایل در پشتیبان می‌ماند. فایل‌های کلید و پشتیبان را خصوصی نگه دارید؛ مرورگر نمی‌تواند مجوزهای Unix را محدود کند.');
    }catch(e){message(artifact.payload.app==='hermes' ? 'بررسی متوقف شد: '+e.message : 'بررسی ناموفق بود؛ مسیر، مجوز و سلامت فایل‌های JSON/TOML یا دانلود ابزار را بررسی کنید. هیچ تنظیمی نوشته نشد.');}
    finally{lock(false);commit.disabled=!prepared||!consent.checked;}
  });
  commit.addEventListener('click',async()=>{
    if(!prepared||!consent.checked)return;
    lock(true);
    const report=result=>{details.textContent='فایل‌های بازخوانی و تأییدشده:\n'+result.written.join('\n')+'\nپشتیبان‌ها:\n'+result.backups.join('\n');};
    try {
      const result=await apply(root,prepared,report);report(result);
      if(artifact.payload.app==='hermes') {
        message('فایل‌های Hermes مستقیماً نوشته و بازخوانی شدند؛ فایل اجرایی لازم نیست. دسترسی پوشه و پشتیبان‌ها را خصوصی نگه دارید و Hermes را دوباره باز کنید. مدل چت فعال حفظ شد. سازگاری نسخه و اجرای واقعی چت/تصویر/صدا در مرورگر آزمایش نمی‌شود؛ اگر ابزارها در Hermes غیرفعال‌اند، از بخش Tools خود برنامه فعال کنید.');
        details.textContent+='\n\nانتخاب اختیاری مدل در Hermes: /model custom:aizamin:'+artifact.payload.model;
      } else if(artifact.os!=='windows') {
        message(artifact.payload.app==='codex'?'فایل‌ها نوشته و بازخوانی شدند، اما راه‌اندازی هنوز کامل نیست. مرورگر نمی‌تواند chmod یا ابزار تصویر را اجرا کند. در ترمینال، پس از بررسی کد، دستور زیر را خودتان اجرا کنید؛ سپس Codex را باز کنید.':'فایل‌ها نوشته و بازخوانی شدند. مرورگر نمی‌تواند محرمانگی مجوز فایل‌ها را تضمین کند؛ دسترسی پوشه و پشتیبان‌ها را به کاربر خود محدود کنید، سپس OpenCode را باز کنید.');
        if(artifact.payload.app==='codex') {const abs=absolutePath(pathInput.value,artifact.os);const quote=s=>"'"+s.replaceAll("'","'\\''")+"'";details.textContent+='\n\nchmod 700 '+quote(abs+'/aizamin/aizamin-image')+'\nchmod 600 '+quote(abs+'/config.toml')+' '+quote(abs+'/auth.json')+'\nپشتیبان‌ها نیز حاوی اطلاعات خصوصی هستند؛ دسترسی آن‌ها را محدود کنید.';}
      } else message('فایل‌ها نوشته و بازخوانی شدند. برنامه را دوباره باز کنید؛ اجرای واقعی چت یا تصویر از وبسایت آزمایش نشده است. Defender ممکن است ابزار بومی تصویر را همچنان ناشناس تشخیص دهد؛ آنتی‌ویروس را خاموش نکنید.');
    }catch(e){if(e.result)report(e.result);message(e.message);}
    finally{prepared=null;lock(false);}
  });
}
module.exports={plan,parseJSON,parseTOML,parseYAML,capability,preflight,apply,mount};
