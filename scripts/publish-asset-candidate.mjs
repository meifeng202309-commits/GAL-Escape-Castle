import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {basename,dirname,join} from 'node:path';

const [sidecarPath]=process.argv.slice(2),url=process.env.SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY,teacher=process.env.ASSET_MANAGER_TEACHER_TOKEN;
if(!sidecarPath||!url||!key||!teacher)throw Error('Usage requires sidecar path plus SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY and ASSET_MANAGER_TEACHER_TOKEN.');
const meta=JSON.parse(await readFile(sidecarPath,'utf8')),binaryPath=join(dirname(sidecarPath),meta.filename),bytes=await readFile(binaryPath);
const sha=createHash('sha256').update(bytes).digest('hex');if(sha!==meta.sha256)throw Error(`SHA-256 mismatch: expected ${meta.sha256}, got ${sha}`);
const version=`v${String(meta.version).padStart(3,'0')}`,storagePath=`${meta.asset_key}/${version}/${basename(binaryPath)}`;
const headers={apikey:key,Authorization:`Bearer ${key}`};
async function rpc(name,body){const r=await fetch(`${url}/rest/v1/rpc/${name}`,{method:'POST',headers:{...headers,'Content-Type':'application/json'},body:JSON.stringify(body)}),t=await r.text();if(!r.ok)throw Error(`${name}: ${t}`);return t?JSON.parse(t):null}
const registered=await rpc('asset_manager_register_candidate',{p_teacher_token:teacher,p_candidate:{...meta,creator:meta.creator||'VA',storage_path:null}});
const mime=meta.asset_type==='audio'?(meta.mime_type||'audio/mpeg'):(binaryPath.endsWith('.svg')?'image/svg+xml':'image/webp');
const upload=await fetch(`${url}/storage/v1/object/game-assets/${storagePath}`,{method:'POST',headers:{...headers,'Content-Type':mime,'x-upsert':'false'},body:bytes});if(!upload.ok)throw Error(`Storage upload: ${await upload.text()}`);
await rpc('asset_manager_review',{p_teacher_token:teacher,p_asset_id:registered.asset_id,p_decision:'APPROVED',p_reviewer:'Teacher-approved staging evidence'});
await rpc('asset_manager_mark_published',{p_teacher_token:teacher,p_asset_id:registered.asset_id,p_storage_path:`game-assets/${storagePath}`,p_sha256:sha});
console.log(JSON.stringify({ok:true,asset_id:registered.asset_id,asset_key:meta.asset_key,version:meta.version,storage_path:`game-assets/${storagePath}`,sha256:sha}));
