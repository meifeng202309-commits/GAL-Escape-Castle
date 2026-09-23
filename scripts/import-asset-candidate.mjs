import {readFile} from 'node:fs/promises';
const [sidecarPath]=process.argv.slice(2),url=process.env.SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;if(!sidecarPath||!url||!key)throw Error('Requires sidecar, SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
const meta=JSON.parse(await readFile(sidecarPath,'utf8')),headers={apikey:key,Authorization:`Bearer ${key}`,'Content-Type':'application/json'};
async function rpc(n,b){const r=await fetch(`${url}/rest/v1/rpc/${n}`,{method:'POST',headers,body:JSON.stringify(b)}),t=await r.text();if(!r.ok)throw Error(t);return JSON.parse(t)}
const imported=await rpc('asset_manager_import_candidate',{p_asset_key:meta.asset_key,p_candidate:meta}),submitted=await rpc('asset_manager_submit_for_review',{p_asset_id:imported.asset_id});console.log(JSON.stringify({...imported,review_status:submitted.status}));
