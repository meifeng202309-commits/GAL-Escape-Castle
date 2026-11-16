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
async function s5Vote(f,choices){const teacher=await rpc("s5_get_teacher_discussion_state",{p_room_code:f.room,p_teacher_token:f.teacher});const discussion=teacher.discussion;assert(discussion?.status==="discussion","Sprint5 discussion is not open");await rpc("s5_audit_expire_discussion",{p_room_code:f.room,p_teacher_token:f.teacher});for(let i=0;i<3;i++)await rpc("s5_submit_vote",{...auth(f,i),p_expected_discussion_session_id:discussion.discussion_session_id,p_expected_vote_round:discussion.vote_round,p_client_request_id:crypto.randomUUID(),p_choice_id:choices[i]})}
const s6Identity=state=>({p_expected_phase:state.state.phase_key,p_expected_step:state.state.act9_step,p_expected_round:state.state.round_no});
async function s6State(f,i=0){return rpc("s6_get_player_state",auth(f,i))}
async function s6Close(f){const state=await s6State(f);assert(state.discussion?.discussion_session_id,"Sprint6 discussion is not open");await rpc("s6_close_discussion_v2",{...auth(f,0),...s6Identity(state),p_expected_discussion_session_id:state.discussion.discussion_session_id,p_client_request_id:crypto.randomUUID()})}
async function s6Group(f,choices){const state=await s6State(f);let result;for(let i=0;i<3;i++)result=await rpc("s6_submit_group_choice_v2",{...auth(f,i),...s6Identity(state),p_client_request_id:crypto.randomUUID(),p_choice_id:choices[i]});return result}

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
  await expectReject(()=>rpc("s10_ack_castle_voice_intro",{...auth(f,0),p_expected_run_id:started.run_id}),/unavailable/);
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
  await expectReject(()=>rpc("s5_advance",auth(f,0)),/No (?:manual|deterministic) transition/);
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
  await rpc("s5_advance",auth(f,0));
  const advanced=await rpc("s5_get_player_state",auth(f,0));
  assert(advanced.state.phase_key==="act7_vote"&&advanced.state.act_no===7,"Supported post-ack ACT6 leave did not enter ACT7.");
  await s5Vote(f,["clock_c","clock_c","clock_b"]);
  let continued=await rpc("s5_get_player_state",auth(f,0));
  assert(continued.state.phase_key==="act7_solved","ACT7 supported solve did not complete.");
  await rpc("s5_advance",auth(f,0));
  for(const [i,p_choice_id]of [[0,"main_gate"],[1,"west_tower"],[2,"compare"]])await rpc("s5_submit_private_choice",{...auth(f,i),p_client_request_id:crypto.randomUUID(),p_choice_id});
  await s5Vote(f,["west_tower","west_tower","main_gate"]);
  await rpc("s5_advance",auth(f,0));
  continued=await rpc("s5_get_player_state",auth(f,0));
  assert(continued.state.phase_key==="complete","Supported ACT8 path did not reach the ACT9 boundary.");
  await rpc("s6_initialize",{p_room_code:f.room,p_teacher_token:f.teacher});

  await s6Close(f);
  let outcome=await s6Group(f,["red","blue","black"]),act9=await s6State(f);
  assert(outcome.no_consensus&&act9.state.act9_step===1&&!act9.state.red_activated&&!act9.state.blue_activated,"ACT9 1:1:1 changed the door state.");
  await s6Close(f);
  outcome=await s6Group(f,["blue","blue","red"]);act9=await s6State(f);
  assert(outcome.soft_failure&&outcome.feedback_text_key==="act09.022"&&act9.state.act9_step===1&&!act9.state.red_activated&&!act9.state.blue_activated,"ACT9 blue majority did not use the approved no-reaction retry.");
  await s6Close(f);
  outcome=await s6Group(f,["black","black","red"]);act9=await s6State(f);
  assert(outcome.soft_failure&&outcome.feedback_text_key==="act09.022"&&act9.state.act9_step===1&&!act9.state.red_activated&&!act9.state.blue_activated,"ACT9 black majority did not use the approved no-reaction retry.");
  await s6Close(f);
  await s6Group(f,["red","red","blue"]);act9=await s6State(f);
  assert(act9.state.act9_step===2&&act9.state.red_activated&&!act9.state.blue_activated,"ACT9 red majority did not expose the red-first authoritative state.");
  await s6Group(f,["do_not_enter","do_not_enter","do_not_enter"]);
  await s6Group(f,["blue","blue","blue"]);act9=await s6State(f);
  assert(act9.state.act9_step===4&&act9.state.red_activated&&act9.state.blue_activated,"ACT9 later blue success did not expose the both-open authoritative state.");
  const reconnect=await Promise.all([0,1,2].map(i=>s6State(f,i)));
  assert(reconnect.every(state=>state.state.red_activated&&state.state.blue_activated),"ACT9 refresh/reconnect lost the both-open state.");
  console.log("GA147 genuine three-player ACT6 lifecycle E2E passed.");
}
main().catch(error=>{console.error(error.stack||error);process.exitCode=1});
