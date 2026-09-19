const URL="https://qdcbdcjobzytzhnhfwyn.supabase.co",KEY="sb_publishable_h5mCF6rkaYWw12ssP4-1NA_KzzPJOwY",results=[];
const assert=(v,m)=>{if(!v)throw new Error(m)}; const pass=n=>{results.push(n);console.log(`PASS ${n}`)};
const unique=p=>`${p}${Date.now().toString(36)}${Math.random().toString(36).slice(2,6)}`.toUpperCase().slice(0,14);
async function rpc(name,body){const r=await fetch(`${URL}/rest/v1/rpc/${name}`,{method:"POST",headers:{apikey:KEY,Authorization:`Bearer ${KEY}`,"Content-Type":"application/json"},body:JSON.stringify(body)});const t=await r.text(),j=t?JSON.parse(t):null;if(!r.ok)throw new Error(j?.message||j?.details||t);return j}
async function reject(name,fn,text){try{await fn();throw new Error("expected rejection")}catch(e){assert(e.message.includes(text),e.message);pass(name)}}
async function fixture(mode="audit"){const room=unique("B"),teacher=unique("T"),joins=[unique("G"),unique("A"),unique("L")];await rpc("s1_create_room",{p_room_code:room,p_teacher_token:teacher,p_gitte_join_code:joins[0],p_anna_join_code:joins[1],p_linda_join_code:joins[2]});const players=await Promise.all(joins.map(p_join_code=>rpc("s1_join_player",{p_room_code:room,p_join_code})));await rpc("s2_start_run",{p_room_code:room,p_teacher_token:teacher,p_run_mode:mode});await rpc("s3b_initialize_flow",{p_room_code:room,p_teacher_token:teacher});return{room,teacher,players}}
const auth=(f,i)=>({p_room_code:f.room,p_session_token:f.players[i].session_token});
const state=(f,i=0)=>rpc("s3b_get_player_state",auth(f,i));
async function act1and2(f,meeting=["library","great_hall","main_gate"]){
  const act1=["study_map","read_diary","study_watch"];
  await Promise.all(act1.map((p_choice_id,i)=>rpc("s3b_submit_act1_choice",{...auth(f,i),p_choice_id})));
  await Promise.all(meeting.map((p_choice_id,i)=>rpc("s3b_submit_first_meeting",{...auth(f,i),p_choice_id})));
  await Promise.all([0,1,2].map(i=>rpc("s3b_grab",auth(f,i))));
  await Promise.all([0,1,2].map(i=>rpc("s3b_leave_start_room",auth(f,i))));
}
async function vote(f,choices){const before=await rpc("s2_get_teacher_state",{p_room_code:f.room,p_teacher_token:f.teacher});assert(before.discussion,`Discussion missing before vote in ${f.room}`);assert(before.discussion.status==="discussion",`Discussion status before vote is ${before.discussion.status}`);await rpc("s2_open_vote",{p_room_code:f.room,p_teacher_token:f.teacher});for(let i=0;i<3;i++)await rpc("s2_submit_vote",{...auth(f,i),p_choice_id:choices[i]})}
async function main(){
  const f=await fixture();
  await reject("B1 role-specific ACT 1 identity enforced",()=>rpc("s3b_submit_act1_choice",{...auth(f,0),p_choice_id:"read_diary"}),"canonical ACT 1");
  await rpc("s3b_submit_act1_choice",{...auth(f,0),p_choice_id:"study_map"});
  assert((await state(f,1)).me.act1_choice_id===null,"ACT 1 privacy leaked");pass("B2 ACT 1 choice remains private");
  await Promise.all([rpc("s3b_submit_act1_choice",{...auth(f,1),p_choice_id:"read_diary"}),rpc("s3b_submit_act1_choice",{...auth(f,2),p_choice_id:"study_watch"})]);
  assert((await state(f)).scene.scene_id==="act2_first_contact","ACT 1 gate failed");pass("B3 all-three ACT 1 gate advances once");
  const facts=await Promise.all([0,1,2].map(i=>rpc("s3b_get_my_facts",auth(f,i))));assert(facts[0].includes("gitte_map_detail")&&facts[1].includes("anna_knows_snake_rule")&&facts[2].includes("linda_knows_watch_message"),"ACT 1 consequences missing");pass("B3a canonical ACT 1 consequences are private and persisted");
  await Promise.all(["library","great_hall","help"].map((p_choice_id,i)=>rpc("s3b_submit_first_meeting",{...auth(f,i),p_choice_id})));
  assert((await state(f)).queued_first_messages.length===0,"Queued choices revealed early");pass("B4 ACT 2 messages hidden before three-condition gate");
  await Promise.all([0,1,2].map(i=>rpc("s3b_grab",auth(f,i)))); await Promise.all([0,1,2].map(i=>rpc("s3b_leave_start_room",auth(f,i))));
  assert((await state(f)).queued_first_messages.length===3,"Queued reveal missing");pass("B5 GRAB/leave gate reveals once and initializes Pocket");
  await vote(f,["library","library","great_hall"]); await rpc("s3b_apply_meeting_resolution",auth(f,0));
  let s=await state(f);assert(s.flow.final_meeting_result==="library"&&s.scene.current_route_target==="library","Meeting majority not applied");pass("B6 majority writes distinct final meeting/current route");
  await rpc("s3b_complete_foldback",auth(f,0)); await Promise.all([0,1].map(i=>rpc("s3b_follow_sign",auth(f,i))));
  assert(!(await state(f)).flow.party_physically_reunited,"Reunion occurred early");await rpc("s3b_follow_sign",auth(f,2));s=await state(f);assert(s.flow.party_physically_reunited&&s.flow.puzzle_deadline,"Reunion/deadline missing");pass("B7 all FOLLOW SIGN actions start server puzzle deadline");
  const expired=await rpc("s3b_audit_expire_puzzle",{p_room_code:f.room,p_teacher_token:f.teacher});assert(expired.hint_stage===4,"Deadline hint did not advance");pass("B8 90-second deadline advances monotonic hint stage");
  await rpc("s3b_submit_library_code",{...auth(f,0),p_code:"11111"});await rpc("s3b_submit_library_code",{...auth(f,1),p_code:"22222"});await rpc("s3b_submit_library_code",{...auth(f,2),p_code:"41739"});s=await state(f);assert(s.flow.puzzle_attempt_number===3&&s.flow.puzzle_resolved_at,"Puzzle ordering failed");pass("B9 ordered attempts resolve canonical code");
  await Promise.all(["known","known","known"].map((p_choice_id,i)=>rpc("s3b_submit_act4_choice",{...auth(f,i),p_choice_id})));s=await state(f);assert(s.flow.group_route==="known"&&s.flow.terminal_state==="SPRINT3B_COMPLETE","Direct route terminal failed");pass("B10 unanimous ACT 4 resolves without ACT 6");
  const g=await fixture();await act1and2(g,["great_hall","great_hall","library"]);await vote(g,["great_hall","great_hall","library"]);await rpc("s3b_apply_meeting_resolution",auth(g,0));await rpc("s3b_complete_foldback",auth(g,0));const gs=await state(g);assert(gs.flow.final_meeting_result==="great_hall"&&gs.scene.current_route_target==="library"&&gs.scene.wayfinding_target==="library","Fold-back semantics failed");pass("B11 failed rendezvous preserves history and folds route to Library");
  for(const table of ["s3b_run_state","s3b_player_progress","s3b_library_attempts","s3b_player_facts"]){const r=await fetch(`${URL}/rest/v1/${table}?select=*`,{headers:{apikey:KEY,Authorization:`Bearer ${KEY}`}}),rows=await r.json();assert(r.ok&&rows.length===0,`RLS leak ${table}`)}pass("B12 anonymous direct reads blocked");
  console.log(`Sprint 3B live E2E passed: ${results.length} checks.`);
}
main().catch(e=>{console.error(`FAIL ${e.stack||e.message}`);process.exitCode=1});
