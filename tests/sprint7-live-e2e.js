const URL="https://qdcbdcjobzytzhnhfwyn.supabase.co",KEY="sb_publishable_h5mCF6rkaYWw12ssP4-1NA_KzzPJOwY";
const assert=(v,m)=>{if(!v)throw new Error(m)},unique=p=>`${p}${Date.now().toString(36)}${Math.random().toString(36).slice(2,6)}`.toUpperCase().slice(0,14);
async function rpc(name,body){const r=await fetch(`${URL}/rest/v1/rpc/${name}`,{method:"POST",headers:{apikey:KEY,Authorization:`Bearer ${KEY}`,"Content-Type":"application/json"},body:JSON.stringify(body)}),t=await r.text(),j=t?JSON.parse(t):null;if(!r.ok)throw new Error(j?.message||j?.details||t);return j}
async function fixture(mode){const room=unique("S7"),teacher=unique("T"),joins=[unique("G"),unique("A"),unique("L")];await rpc("s1_create_room",{p_room_code:room,p_teacher_token:teacher,p_gitte_join_code:joins[0],p_anna_join_code:joins[1],p_linda_join_code:joins[2]});const players=await Promise.all(joins.map(p_join_code=>rpc("s1_join_player",{p_room_code:room,p_join_code})));await rpc("s2_start_run",{p_room_code:room,p_teacher_token:teacher,p_run_mode:mode});await rpc("s3b_initialize_flow",{p_room_code:room,p_teacher_token:teacher});return{room,teacher,players}}
const teacher=f=>({p_room_code:f.room,p_teacher_token:f.teacher}),auth=(f,i)=>({p_room_code:f.room,p_session_token:f.players[i].session_token});
async function main(){
  const audit=await fixture("audit");await rpc("s3b_ack_act1_opening",auth(audit,0));await rpc("s3b_submit_act1_choice",{...auth(audit,0),p_choice_id:"study_map"});
  let state=await rpc("s7_get_teacher_console",teacher(audit));
  assert(state.active&&state.current.act_no===1&&state.players.length===3,"authoritative current/player projection missing");
  const locked=state.players.find(p=>p.role_slot==="GAL-A"),waiting=state.players.find(p=>p.role_slot==="GAL-B");
  assert(locked.submitted&&locked.locked_choice_value==="study_map"&&locked.locked_choice_state==="LOCKED / NOT YET REVEALED TO PLAYERS","structured locked-choice projection missing");
  assert(!waiting.submitted&&waiting.locked_choice_value===null&&waiting.locked_choice_state==="WAITING","unsubmitted choice did not remain waiting/null");
  assert(state.export.enabled===false&&state.export.export_ready===false,"Sprint 7 crossed the Sprint 8 export boundary");
  await rpc("s7_set_audit_private_debug",{...teacher(audit),p_enabled:true});state=await rpc("s7_get_teacher_console",teacher(audit));
  assert(state.players.find(p=>p.role_slot==="GAL-A").audit_debug.act1_choice==="study_map","explicit AUDIT debug did not reveal additional context");
  assert(state.events.some(e=>e.event_type==="teacher_audit_private_debug_changed"&&e.details.enabled===true),"AUDIT debug activation was not logged");
  await rpc("s7_set_audit_private_debug",{...teacher(audit),p_enabled:false});
  await rpc("s3b_audit_set_private_debug_view",{...teacher(audit),p_enabled:true});state=await rpc("s7_get_teacher_console",teacher(audit));assert(state.teacher_interventions.filter(e=>e.event_type==="teacher_audit_private_debug_changed").length>=3,"legacy debug writer did not use durable logged authority");
  assert(state.phase_behavior_validity.some(x=>x.scene_id==="act1_wake_up"&&x.phase_key==="private_first_action"),"phase-identifiable validity missing");
  assert(/^\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}_[0-9a-f-]+_audit\.json$/.test(state.export.filename_preview),"AUDIT filename is noncanonical");
  const normal=await fixture("normal");let rejected=false;try{await rpc("s7_set_audit_private_debug",{...teacher(normal),p_enabled:true})}catch(e){rejected=e.message.includes("AUDIT mode")}
  assert(rejected,"NORMAL mode accepted private debug");state=await rpc("s7_get_teacher_console",teacher(normal));assert(!state.export.filename_preview.includes("_audit.json")&&/^\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}_[0-9a-f-]+\.json$/.test(state.export.filename_preview),"NORMAL filename is noncanonical");
  console.log("Sprint 7 focused live E2E passed: all five correction contracts verified.");
}
main().catch(e=>{console.error(`FAIL ${e.stack||e.message}`);process.exitCode=1});
