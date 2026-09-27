const {rpc,assert,id,auth,fixture}=require("./sprint5-live-e2e");

async function expectReject(action,fragment){
  try{await action();throw new Error("Expected rejection");}
  catch(error){assert(error.message.toLowerCase().includes(fragment.toLowerCase()),`Unexpected rejection: ${error.message}`);}
}

async function main(){
  const authorityRoom=id("A60"),authorityTeacher=id("T"),authorityJoins=[id("G"),id("A"),id("L")];
  await rpc("s1_create_room",{p_room_code:authorityRoom,p_teacher_token:authorityTeacher,p_gitte_join_code:authorityJoins[0],p_anna_join_code:authorityJoins[1],p_linda_join_code:authorityJoins[2]});
  await Promise.all(authorityJoins.map(p_join_code=>rpc("s1_join_player",{p_room_code:authorityRoom,p_join_code})));
  await expectReject(
    ()=>rpc("s2_start_run",{p_room_code:authorityRoom,p_teacher_token:authorityTeacher,p_run_mode:"audit"}),
    "permission denied",
  );
  const atomic=await rpc("s9_start_formal_game",{p_room_code:authorityRoom,p_teacher_token:authorityTeacher,p_run_mode:"audit"});
  assert(atomic.canonical_flow_initialized&&atomic.run_id,"Atomic formal-start authority did not create ACT1.");

  const f=await fixture("audit");
  const initial=await Promise.all([0,1,2].map(i=>rpc("s3b_get_player_state",auth(f,i))));
  assert(initial.every(state=>state.flow.terminal_state==="SPRINT3B_COMPLETE"),"ACT5 terminal state is missing.");
  assert(initial.every(state=>!state.me.act6_entered_at&&state.me.player_location==="library"),"Players skipped the new per-player ACT5 handoff.");

  await expectReject(
    ()=>rpc("s9_enter_act6",{...auth(f,0),p_expected_run_id:initial[0].run_id}),
    "observe the act 5 route consequence",
  );
  await rpc("s9_observe_act5_handoff",{...auth(f,0),p_expected_run_id:initial[0].run_id});
  await rpc("s9_enter_act6",{...auth(f,0),p_expected_run_id:initial[0].run_id});

  const separated=await Promise.all([0,1,2].map(i=>rpc("s3b_get_player_state",auth(f,i))));
  assert(separated[0].me.act6_entered_at&&separated[0].me.player_location==="portrait_hall","Entering player did not reach Portrait Hall.");
  assert(!separated[1].me.act6_entered_at&&separated[1].me.player_location==="library","A waiting player was globally advanced by another player.");
  assert(!separated[2].me.act6_entered_at&&separated[2].me.player_location==="library","Second waiting player was globally advanced.");

  for(const i of [1,2]){
    await rpc("s9_observe_act5_handoff",{...auth(f,i),p_expected_run_id:initial[i].run_id});
    await rpc("s9_enter_act6",{...auth(f,i),p_expected_run_id:initial[i].run_id});
  }
  const entered=await Promise.all([0,1,2].map(i=>rpc("s3b_get_player_state",auth(f,i))));
  assert(entered.every(state=>state.me.act6_entered_at&&state.me.player_location==="portrait_hall"),"All players did not complete the per-player entry boundary.");
  console.log("Package A CA-A bounded corrections live E2E passed.");
}

main().catch(error=>{console.error(error.stack||error);process.exitCode=1;});
