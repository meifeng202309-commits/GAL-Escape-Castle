const URL="https://qdcbdcjobzytzhnhfwyn.supabase.co",KEY="sb_publishable_h5mCF6rkaYWw12ssP4-1NA_KzzPJOwY",ok=[];
const rpc=async(n,b)=>{const r=await fetch(`${URL}/rest/v1/rpc/${n}`,{method:'POST',headers:{apikey:KEY,Authorization:`Bearer ${KEY}`,'Content-Type':'application/json'},body:JSON.stringify(b)}),t=await r.text(),j=t?JSON.parse(t):null;if(!r.ok)throw Error(j?.message||t);return j},assert=(v,m)=>{if(!v)throw Error(m)},pass=n=>{ok.push(n);console.log('PASS '+n)};
async function reject(n,f,s){try{await f();throw Error('expected rejection')}catch(e){assert(e.message.includes(s),`${n}: ${e.message}`);pass(n)}}
async function main(){
 const x=Date.now().toString(36).toUpperCase(),room=('S4'+x).slice(0,12),token='T'+x;
 await rpc('s1_create_room',{p_room_code:room,p_teacher_token:token,p_gitte_join_code:'G'+x,p_anna_join_code:'A'+x,p_linda_join_code:'L'+x});
 await reject('self-issued room token has no Asset Manager authority',()=>rpc('asset_manager_state',{p_teacher_token:token}),'Invalid Asset Manager reviewer authority');
 await reject('self-issued room token cannot review',()=>rpc('asset_manager_review',{p_teacher_token:token,p_asset_id:'00000000-0000-0000-0000-000000000000',p_decision:'APPROVED',p_reviewer:'test'}),'Invalid Asset Manager reviewer authority');
 const reviewer=process.env.ASSET_MANAGER_REVIEWER_TOKEN;if(!reviewer)throw Error('ASSET_MANAGER_REVIEWER_TOKEN is required');
 const state=await rpc('asset_manager_state',{p_teacher_token:reviewer});assert(state.assets.length===28,'registry projection incomplete');pass('registered reviewer reads 28 canonical registry assets');
 await reject('invalid reviewer token rejected',()=>rpc('asset_manager_state',{p_teacher_token:'bad'}),'Invalid Asset Manager reviewer authority');
 const active=await rpc('asset_resolve',{p_asset_key:'shared.library'});assert(active.ok&&active.version===1&&active.ui_anchors.some(a=>a.anchor_name==='library_unknown_door'),'ACTIVE image or anchor did not resolve');pass('ACTIVE image resolves exact version and required anchor');
 const missing=await rpc('asset_resolve',{p_asset_key:'audio.wet_scraping'});assert(!missing.ok&&missing.fallback&&missing.reason==='NO_ACTIVE_ASSET','missing asset did not fold back explicitly');pass('no ACTIVE asset returns typed explicit fallback');
 const unknown=await rpc('asset_resolve',{p_asset_key:'invented.asset'});assert(unknown.reason==='ASSET_KEY_NOT_FOUND','unknown key was inferred');pass('unknown opaque asset key is never inferred');
 for(const n of ['asset_manager_sync_registry','asset_manager_import_candidate','asset_manager_submit_for_review','asset_manager_mark_published','asset_manager_activate','asset_manager_activate_group','asset_manager_rollback_group'])await reject(`${n} is not browser executable`,()=>rpc(n,{}),'schema cache');
 for(const table of ['asset_registry_projection','asset_candidates','asset_events']){const r=await fetch(`${URL}/rest/v1/${table}?select=*`,{headers:{apikey:KEY,Authorization:`Bearer ${KEY}`}}),rows=await r.json();assert(r.ok&&rows.length===0,`RLS exposed ${table}`)}pass('asset tables deny anonymous direct reads');
 console.log(`Sprint 4 live E2E passed: ${ok.length} checks.`);
}
main().catch(e=>{console.error('FAIL '+(e.stack||e.message));process.exitCode=1});
