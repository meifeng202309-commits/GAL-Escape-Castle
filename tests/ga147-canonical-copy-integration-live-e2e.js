const ENDPOINT=process.env.GAL_NONPROD_SUPABASE_URL;
const KEY=process.env.GAL_NONPROD_SUPABASE_ANON_KEY;
if(!ENDPOINT||!KEY)throw new Error("Set GAL_NONPROD_SUPABASE_URL and GAL_NONPROD_SUPABASE_ANON_KEY for an authorized disposable nonproduction target.");
if(new URL(ENDPOINT).hostname==="qdcbdcjobzytzhnhfwyn.supabase.co")throw new Error("Refusing to run GA147 fixtures against the known production project.");
const REST_BASE=process.env.GAL_NONPROD_POSTGREST_DIRECT==="1"?ENDPOINT:`${ENDPOINT}/rest/v1`;
const assert=(value,message)=>{if(!value)throw new Error(message)};
const id=prefix=>`${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2,6)}`.toUpperCase().slice(0,14);
async function rpc(name,body){const response=await fetch(`${REST_BASE}/rpc/${name}`,{method:"POST",headers:{apikey:KEY,Authorization:`Bearer ${KEY}`,"Content-Type":"application/json"},body:JSON.stringify(body)});const text=await response.text();let json=null;try{json=text?JSON.parse(text):null}catch{}if(!response.ok)throw new Error(`${name} HTTP ${response.status}: ${json?.message||text||response.statusText}`);return json}
const auth=(fixture,index)=>({p_room_code:fixture.room,p_session_token:fixture.players[index].session_token});
async function expectReject(work,pattern){let message="";try{await work()}catch(error){message=error.message}assert(pattern.test(message),`Expected rejection ${pattern}, got: ${message||"success"}`)}

async function fixture(){
  const room=id("G147"),teacher=id("T"),joins=[id("G"),id("A"),id("L")];
  await rpc("s1_create_room",{p_room_code:room,p_teacher_token:teacher,p_gitte_join_code:joins[0],p_anna_join_code:joins[1],p_linda_join_code:joins[2]});
  const players=await Promise.all(joins.map(p_join_code=>rpc("s1_join_player",{p_room_code:room,p_join_code})));
  const f={room,teacher,players};
  const started=await rpc("s9_start_formal_game",{p_room_code:room,p_teacher_token:teacher,p_run_mode:"audit"});
  await Promise.all([0,1,2].map(i=>rpc("s3b_ack_act1_opening",auth(f,i))));
  for(const [i,p_choice_id]of [[0,"study_map"],[1,"check_phone"],[2,"study_watch"]])await rpc("s3b_submit_act1_choice",{...auth(f,i),p_choice_id});
  await Promise.all([0,1,2].map(i=>rpc("s3b_complete_act1",auth(f,i))));
  await Promise.all([0,1,2].map(i=>rpc("s3b_submit_first_meeting",{...auth(f,i),p_choice_id:"library"})));
  await Promise.all([0,1,2].map(i=>rpc("s3b_grab_and_leave",{...auth(f,i),p_client_request_id:crypto.randomUUID(),p_expected_run_id:started.run_id})));
  const legacy=await rpc("s2_get_teacher_state",{p_room_code:room,p_teacher_token:teacher});
  await rpc("s2_open_vote",{p_room_code:room,p_teacher_token:teacher});
  for(let i=0;i<3;i++)await rpc("s2_submit_vote",{...auth(f,i),p_expected_discussion_session_id:legacy.discussion.discussion_session_id,p_expected_vote_round:legacy.discussion.vote_round,p_choice_id:"library"});
  await Promise.all([0,1,2].map(i=>rpc("s3b_ack_route_update",auth(f,i))));
  await rpc("s3b_complete_foldback",auth(f,0));
  await Promise.all([0,1,2].map(i=>rpc("s3b_follow_sign",auth(f,i))));
  await rpc("s3b_submit_library_code",{...auth(f,0),p_client_request_id:crypto.randomUUID(),p_code:"41739"});
  await Promise.all([0,1,2].map(i=>rpc("s3b_ack_library_discovery",{...auth(f,i),p_expected_run_id:started.run_id})));
  await Promise.all([0,1,2].map(i=>rpc("s3b_submit_act4_choice",{...auth(f,i),p_choice_id:"known"})));
  const completed=await Promise.all([0,1,2].map(i=>rpc("s3b_get_player_state",auth(f,i))));
  assert(completed.every(state=>state.flow.terminal_state==="SPRINT3B_COMPLETE"),"ACT5 did not reach its authoritative terminal state.");
  for(let i=0;i<3;i++){
    await rpc("s9_observe_act5_handoff",{...auth(f,i),p_expected_run_id:started.run_id});
    const entered=await rpc("s9_enter_act6",{...auth(f,i),p_expected_run_id:started.run_id});
    assert(entered.entered_players===i+1,`ACT6 entry barrier count did not reach ${i+1}.`);
  }
  return{...f,runId:started.run_id};
}

async function main(){
  const f=await fixture();
  let states=await Promise.all([0,1,2].map(i=>rpc("s5_get_player_state",auth(f,i))));
  assert(states.every(state=>state.state.phase_key==="act6_vote"),"Fixture did not enter genuine ACT6 through the server lifecycle.");
  assert(states[0].castle_voice_intro_key==="runtime.castle_voice.returning","Gitte must hear returning Voice at ACT6.");
  assert(states[1].castle_voice_intro_key==="runtime.castle_voice.first_audible"&&states[2].castle_voice_intro_key==="runtime.castle_voice.first_audible","Anna and Linda must hear their first audible Voice at ACT6.");
  const teacher=await rpc("s5_get_teacher_discussion_state",{p_room_code:f.room,p_teacher_token:f.teacher});
  const discussion=teacher.discussion;
  assert(discussion?.status==="discussion","ACT6 did not expose the canonical pre-vote discussion.");
  const opened=await rpc("s5_teacher_open_vote",{p_room_code:f.room,p_teacher_token:f.teacher,p_expected_run_id:f.runId,p_expected_phase:"act6_vote",p_expected_vote_round:discussion.vote_round,p_expected_discussion_session_id:discussion.discussion_session_id});
  await expectReject(()=>rpc("s5_submit_vote",{...auth(f,0),p_expected_discussion_session_id:discussion.discussion_session_id,p_expected_vote_round:discussion.vote_round,p_client_request_id:crypto.randomUUID(),p_choice_id:"escape"}),/must be acknowledged/);
  await expectReject(()=>rpc("s10_ack_castle_voice_intro",{...auth(f,0),p_expected_run_id:crypto.randomUUID()}),/Stale or invalid/);
  for(let i=0;i<3;i++){
    const first=await rpc("s10_ack_castle_voice_intro",{...auth(f,i),p_expected_run_id:f.runId});
    const retry=await rpc("s10_ack_castle_voice_intro",{...auth(f,i),p_expected_run_id:f.runId});
    assert(first.acknowledged&&retry.acknowledged,"Voice acknowledgement retry was not idempotent.");
  }
  states=await Promise.all([0,1,2].map(i=>rpc("s5_get_player_state",auth(f,i))));
  assert(states.every(state=>state.castle_voice_intro_acknowledged),"Reconnect projection lost an ACT6 acknowledgement.");
  assert(opened.discussion_session_id===discussion.discussion_session_id&&opened.vote_round===discussion.vote_round,"Teacher opened a different ACT6 ballot.");
  for(let i=0;i<3;i++)await rpc("s5_submit_vote",{...auth(f,i),p_expected_discussion_session_id:opened.discussion_session_id,p_expected_vote_round:opened.vote_round,p_client_request_id:crypto.randomUUID(),p_choice_id:"escape"});
  const resolved=await rpc("s5_get_player_state",auth(f,0));
  assert(resolved.state.phase_key==="act6_answer","Three acknowledged players did not reach the ACT6 answer.");
  console.log("GA147 genuine three-player ACT6 lifecycle E2E passed.");
}
main().catch(error=>{console.error(error.stack||error);process.exitCode=1});
