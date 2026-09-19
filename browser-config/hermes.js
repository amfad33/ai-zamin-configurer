// Fresh named-provider admission only. Never rotate credentials or edit auth pools.
const YAML=require('yaml');
const KEY='HERMES_CUSTOM_AIZAMIN_API_KEY';
const ENDPOINT='https://aizamin.ir/v1';
const STT=HERMES_STT_SOURCE;
function parseDocument(text) {
  const doc=YAML.parseDocument(text,{uniqueKeys:true});
  if(doc.errors.length||doc.warnings.length) throw Error('YAML معتبر و بدون تگ سفارشی لازم است.');
  const c=doc.toJS({maxAliasCount:0});
  if(!c||typeof c!=='object'||Array.isArray(c)) throw Error('config.yaml باید یک mapping باشد.');
  // Aliases/merge keys can mutate settings outside the declared paths.
  YAML.visit(doc,{Alias(){throw Error('YAML alias پشتیبانی نمی‌شود؛ از تنظیم‌گر استفاده کنید.');},Pair(_,pair){if(pair.key?.value==='<<')throw Error('YAML merge پشتیبانی نمی‌شود.');}});
  return {doc,c};
}
function parseYAML(text){return parseDocument(text).c;}
async function planHermes(p,read,consent={}) {
  if(!consent.profileConfirmed||!consent.unmanagedConfirmed||!consent.pluginsConfirmed) throw Error('تأیید پروفایل فعال، نبود سیاست مدیریتی و نصب افزونه‌های تصویر/صدا لازم است.');
  if(await read('.managed')!==null) throw Error('پروفایل دارای نشان مدیریت است؛ فقط مدیر سیستم می‌تواند تنظیم کند.');
  const text=await read('config.yaml');
  if(text===null) throw Error('config.yaml پیدا نشد؛ پوشهٔ پروفایل موجود و فعال را انتخاب کنید.');
  const {doc,c}=parseDocument(text);
  const env=await read('.env')??'';
  if(env.includes('HERMES_MANAGED')||c.secrets)throw Error('سیاست مدیریتی یا منبع secrets خارجی پیدا شد؛ ادامه فقط از مسیر رسمی Hermes.');
  // A retained slot-level override could send a previous vendor key to the new
  // endpoint. Refuse rather than deleting/rebinding somebody else's secret.
  const vision=c.auxiliary?.vision;
  if(vision&&Object.keys(vision).some(k=>!['provider','model'].includes(k)))throw Error('vision دارای تنظیم اختصاصی است؛ برای حفظ جداسازی اعتبار از تنظیم‌گر استفاده کنید.');
  if(env.includes(KEY)||JSON.stringify(c).toLowerCase().includes('aizamin')) throw Error('تنظیم قبلی AI Zamin پیدا شد؛ تغییر کلید یا مهاجرت فقط با تنظیم‌گر رسمی انجام می‌شود.');
  // Pool precedence can shadow a fresh env key. Refuse all pre-existing custom pools,
  // a conservative extra guard; never rewrite or unsuppress them.
  for(const path of ['auth.json','provider_models_cache.json']) {
    const raw=await read(path);
    if(raw!==null) {
      let data;try{data=JSON.parse(raw);}catch{throw Error('فایل اعتبار یا cache خراب است.');}
      if(JSON.stringify(data).toLowerCase().includes('aizamin')||JSON.stringify(data).includes(KEY)||
        (path==='auth.json'&&Object.keys(data.credential_pool||{}).some(k=>k.startsWith('custom')))) throw Error('اعتبار سفارشی قبلی پیدا شد؛ برای جلوگیری از تداخل از تنظیم‌گر استفاده کنید.');
    }
  }
  if(!/^[A-Za-z0-9._-]+$/.test(p.key)) throw Error('قالب کلید برای نوشتن امن در env پشتیبانی نمی‌شود.');
  const record=(value)=>{if(value!==undefined&&(!value||typeof value!=='object'||Array.isArray(value)))throw Error('ساختار تنظیمات ناسازگار است.');};
  for(const key of ['providers','stt','image_gen','auxiliary','plugins','platform_toolsets','agent'])record(c[key]);
  const list=v=>{if(v!==undefined&&(!Array.isArray(v)||v.some(x=>typeof x!=='string')))throw Error('فهرست تنظیمات ناسازگار است.');return v||[];};
  if(list(c.agent?.disabled_toolsets).length||list(c.plugins?.disabled).some(x=>['aizamin','aizamin-stt','stt/aizamin','image_gen/aizamin'].includes(x)))throw Error('ابزار یا افزونه غیرفعال شده است؛ ابتدا سیاست آن را در Hermes بررسی کنید.');
  const set=(path,value)=>doc.setIn(path.split('.'),value);
  set('providers.aizamin',{api:ENDPOINT,key_env:KEY,transport:'chat_completions',default_model:p.model,models:p.catalog,models_discovered:true,discover_models:false});
  for(const [path,value] of Object.entries({'stt.aizamin.base_url':ENDPOINT,'stt.aizamin.model':'whisper-large-v3-turbo','stt.provider':'aizamin','stt.enabled':true,'image_gen.provider':'aizamin','image_gen.aizamin.model':'gpt-image-2.5-flare-medium','auxiliary.vision.provider':'aizamin','auxiliary.vision.model':p.model}))set(path,value);
  set('plugins.enabled',[...new Set([...list(c.plugins?.enabled),'image_gen/aizamin','stt/aizamin'])]);
  for(const name of ['image_gen/aizamin','stt/aizamin'])doc.setIn(['plugins','entries',name,'allow_tool_override'],false);
  // Extend explicit platform allowlists only; do not replace implicit defaults or
  // expand composite toolsets (the canonical CLI owns that evolving resolver).
  for(const [platform,tools] of Object.entries(c.platform_toolsets||{}))doc.setIn(['platform_toolsets',platform],[...new Set([...list(tools),'image_gen','vision'])]);
  const files=[];
  for(const name of ['plugin.yaml','__init__.py']) {
    if(!p.plugin?.[name])throw Error('افزونهٔ تصویر موجود نیست.');
    files.push({path:'plugins/image_gen/aizamin/'+name,text:p.plugin[name]});
  }
  files.push({path:'plugins/stt/aizamin/plugin.yaml',text:'name: aizamin-stt\nversion: 1.0.0\ndescription: AI Zamin Whisper speech transcription\n'},{path:'plugins/stt/aizamin/__init__.py',text:STT});
  for(const f of files)if(await read(f.path)!==null)throw Error('افزونهٔ قبلی پیدا شد؛ جایگزینی مستقیم مجاز نیست.');
  const output=doc.toString();parseYAML(output);
  files.push({path:'.env',text:env+(env&&!env.endsWith('\n')?'\n':'')+KEY+'='+p.key+'\n'},{path:'config.yaml',text:output});
  return files;
}
module.exports={planHermes,parseYAML};
