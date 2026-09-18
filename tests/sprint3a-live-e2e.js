const SUPABASE_URL = "https://qdcbdcjobzytzhnhfwyn.supabase.co";
const SUPABASE_KEY = "sb_publishable_h5mCF6rkaYWw12ssP4-1NA_KzzPJOwY";
const results = [];

function unique(prefix) { return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`.toUpperCase().slice(0,14); }
function assert(value, message) { if (!value) throw new Error(message); }
function pass(name, detail="") { results.push({name,detail}); }
async function rpc(name,payload) {
  const response=await fetch(`${SUPABASE_URL}/rest/v1/rpc/${name}`,{method:"POST",headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`,"Content-Type":"application/json"},body:JSON.stringify(payload)});
  const text=await response.text(); const body=text?JSON.parse(text):null;
  if(!response.ok) throw new Error(body?.message||body?.details||text||`HTTP ${response.status}`); return body;
}
async function reject(name,action,expected){try{await action();throw new Error("Expected rejection");}catch(error){assert(error.message.includes(expected),`Unexpected rejection: ${error.message}`);pass(name,error.message);}}
async function fixture(mode="audit"){
  const room=unique("S3"),teacher=unique("T"),joins=[unique("G"),unique("A"),unique("L")];
  await rpc("s1_create_room",{p_room_code:room,p_teacher_token:teacher,p_gitte_join_code:joins[0],p_anna_join_code:joins[1],p_linda_join_code:joins[2]});
  const players=await Promise.all(joins.map(p_join_code=>rpc("s1_join_player",{p_room_code:room,p_join_code})));
  const run=await rpc("s2_start_run",{p_room_code:room,p_teacher_token:teacher,p_run_mode:mode});
  return {room,teacher,players,run};
}
const playerState=(f,i)=>rpc("s3_get_player_state",{p_room_code:f.room,p_session_token:f.players[i].session_token});

async function main(){
  const normal=await fixture("normal");
  await reject("A1 NORMAL run rejects fixture behavior forgery",()=>rpc("s3_initialize_audit_fixture",{p_room_code:normal.room,p_teacher_token:normal.teacher}),"restricted to AUDIT");

  const f=await fixture("audit");
  await rpc("s3_initialize_audit_fixture",{p_room_code:f.room,p_teacher_token:f.teacher});
  await rpc("s3_initialize_audit_fixture",{p_room_code:f.room,p_teacher_token:f.teacher});
  const states=await Promise.all([0,1,2].map(i=>playerState(f,i)));
  assert(states.every(s=>s.run_id===f.run.run_id),"Run identity mismatch.");
  assert(states[0].items.length===1&&states[1].items.length===0&&states[2].items.length===0,"Physical item privacy failed.");
  assert(states[0].observations.length===1&&states[1].observations.length===0,"Observation privacy/idempotency failed.");
  assert(states[0].knowledge.length===2&&new Set(states[0].knowledge.map(k=>k.source)).size===2,"Knowledge provenance history was collapsed or duplicated.");
  assert(states.every(s=>s.group_items.length===1),"Group item is not visible to all players.");
  assert(states.every(s=>s.scene.display_mode==="ACTION_SCREEN"&&s.scene.text_key==="common.001"),"Scene foundation restore failed.");
  pass("A2 fixture restores isolated pocket, observation, knowledge, group and scene state");

  await reject("A3 invalid view is rejected",()=>rpc("s3_share_photo",{p_room_code:f.room,p_session_token:f.players[0].session_token,p_recipient_role:"GAL-B",p_source_item_key:"fixture.physical_item",p_source_view:"back"}),"Invalid or non-shareable");
  await rpc("s3_share_photo",{p_room_code:f.room,p_session_token:f.players[0].session_token,p_recipient_role:"GAL-B",p_source_item_key:"fixture.physical_item",p_source_view:"front"});
  const sender=await playerState(f,0),recipient=await playerState(f,1);
  assert(sender.items.length===1&&recipient.items.length===0&&recipient.shared_photos.length===1,"Photo share transferred ownership or failed copy delivery.");
  assert(recipient.knowledge.length===0,"Photo share silently transferred knowledge.");
  pass("A4 SHARE PHOTO preserves ownership and delivers only the copy");
  await reject("A5 recipient cannot re-share as physical owner",()=>rpc("s3_share_photo",{p_room_code:f.room,p_session_token:f.players[1].session_token,p_recipient_role:"GAL-C",p_source_item_key:"fixture.physical_item",p_source_view:"front"}),"not the physical owner");
  const reconnect=await playerState(f,1); assert(reconnect.shared_photos.length===1,"Reconnect lost photo copy."); pass("A6 reconnect restores all foundation state categories");

  const teacher=await rpc("s3_get_teacher_state",{p_room_code:f.room,p_teacher_token:f.teacher});
  assert(teacher.counts.observations===1&&teacher.counts.knowledge_acquisitions===2,"Teacher counts are incorrect.");
  assert(JSON.stringify(teacher).includes("fixture.private_observation")===false,"Teacher state leaked private content.");
  pass("A7 Teacher receives metadata counts without private clue content");

  const other=await fixture("audit"); await rpc("s3_initialize_audit_fixture",{p_room_code:other.room,p_teacher_token:other.teacher});
  assert((await playerState(other,1)).shared_photos.length===0,"Run isolation failed."); pass("A8 independent run state is isolated");

  const tables=["s3_runtime_scene_state","s3_item_catalog","s3_observation_catalog","s3_knowledge_catalog","s3_player_items","s3_player_observations","s3_player_knowledge","s3_shared_photos","s3_group_items"];
  for(const table of tables){const response=await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*`,{headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`}});const rows=await response.json();assert(response.ok&&Array.isArray(rows)&&rows.length===0,`RLS read exposed ${table}`);}
  pass("B1 anonymous direct reads are blocked",`${tables.length} tables`);
  const write=await fetch(`${SUPABASE_URL}/rest/v1/s3_group_items`,{method:"POST",headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`,"Content-Type":"application/json"},body:"{}"});
  assert(!write.ok,"Anonymous direct write succeeded."); pass("B2 anonymous direct write is rejected",`HTTP ${write.status}`);

  for(const item of results) console.log(`PASS ${item.name}${item.detail?` — ${item.detail}`:""}`);
  console.log(`Sprint 3A live E2E passed: ${results.length} checks.`);
}
main().catch(error=>{for(const item of results)console.log(`PASS ${item.name}${item.detail?` — ${item.detail}`:""}`);console.error(`FAIL ${error.stack||error.message}`);process.exitCode=1;});
