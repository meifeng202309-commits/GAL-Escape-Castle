const {rpc,assert,id,auth,oldVote,vote,state,sprint6,s6state}=require("./sprint5-live-e2e");

const teacher=f=>({p_room_code:f.room,p_teacher_token:f.teacher});

function parseCsv(text){
  const rows=[];let row=[],field="",quoted=false;
  for(let i=0;i<text.length;i++){
    const ch=text[i];
    if(quoted){
      if(ch==='"'&&text[i+1]==='"'){field+='"';i++;}
      else if(ch==='"')quoted=false;
      else field+=ch;
    }else if(ch==='"')quoted=true;
    else if(ch===','){row.push(field);field="";}
    else if(ch==='\n'){row.push(field);rows.push(row);row=[];field="";}
    else if(ch!=='\r')field+=ch;
  }
  if(field.length||row.length){row.push(field);rows.push(row);}
  return rows;
}

async function fixtureWithExactAct1Override(){
  const room=id("S8V"),teacherToken=id("T"),joins=[id("G"),id("A"),id("L")];
  await rpc("s1_create_room",{p_room_code:room,p_teacher_token:teacherToken,p_gitte_join_code:joins[0],p_anna_join_code:joins[1],p_linda_join_code:joins[2]});
  const players=await Promise.all(joins.map(p_join_code=>rpc("s1_join_player",{p_room_code:room,p_join_code})));
  const f={room,teacher:teacherToken,players,joins};
  await rpc("s2_start_run",{p_room_code:room,p_teacher_token:teacherToken,p_run_mode:"audit"});
  await rpc("s3b_initialize_flow",{p_room_code:room,p_teacher_token:teacherToken});

  await Promise.all([0,1,2].map(i=>rpc("s3b_ack_act1_opening",auth(f,i))));
  await rpc("s3b_submit_act1_choice",{...auth(f,0),p_choice_id:"study_map"});
  await rpc("s3b_submit_act1_choice",{...auth(f,1),p_choice_id:"read_diary"});
  await rpc("s3b_complete_act1",auth(f,0));
  await rpc("s3b_complete_act1",auth(f,1));

  const override=await rpc("teacher_apply_override",{...teacher(f),p_override_action:"SKIP_CURRENT_INTERACTION",p_reason:"WP-S8-02 exact ACT1 missing-choice acceptance regression"});
  assert(override.override_action==="SKIP_CURRENT_INTERACTION"&&override.source_phase==="private_first_action","ACT1 governed Teacher Override was not applied at the intended obligation");

  await Promise.all([0,1,2].map(i=>rpc("s3b_submit_first_meeting",{...auth(f,i),p_choice_id:"library"})));
  await Promise.all([0,1,2].map(i=>rpc("s3b_grab",auth(f,i))));
  await Promise.all([0,1,2].map(i=>rpc("s3b_leave_start_room",auth(f,i))));
  await oldVote(f,["library","library","library"]);
  await Promise.all([0,1,2].map(i=>rpc("s3b_ack_route_update",auth(f,i))));
  await rpc("s3b_complete_foldback",auth(f,0));
  await Promise.all([0,1,2].map(i=>rpc("s3b_follow_sign",auth(f,i))));
  if(process.env.S8_ACT3_OVERRIDE==="1"){
    const act3Override=await rpc("teacher_apply_override",{...teacher(f),p_override_action:"RESOLVE_AND_CONTINUE",p_reason:"IDA2-002 ACT3 override through finalization regression"});
    assert(act3Override.source_scene==="act3_library"&&act3Override.applied_resolution==="41739","ACT3 canonical override was not applied");
  }else await rpc("s3b_submit_library_code",{...auth(f,0),p_client_request_id:crypto.randomUUID(),p_code:"41739"});
  await Promise.all([0,1,2].map(i=>rpc("s3b_submit_act4_choice",{...auth(f,i),p_choice_id:"known"})));
  await rpc("s5_initialize",{p_room_code:room,p_teacher_token:teacherToken});
  return{...f,override};
}

async function completeSprint5WithDirectAct8(f){
  await vote(f,["escape","1897","trapped"]);
  await vote(f,["escape","1897","trapped"]);
  await rpc("s5_advance",auth(f,0));

  await rpc("s3_set_item_view",{...auth(f,2),p_item_key:"linda_stopped_watch",p_target_view:"back"});
  await vote(f,["clock_a","clock_a","clock_c"]);
  await vote(f,["clock_c","clock_c","clock_b"]);
  await rpc("s5_advance",auth(f,0));

  for(let i=0;i<3;i++)await rpc("s5_submit_private_choice",{...auth(f,i),p_client_request_id:crypto.randomUUID(),p_choice_id:"west_tower"});
  let s=await state(f);
  assert(s.state.phase_key==="act8_route"&&s.state.route_taken_act8==="west_tower","Unanimous direct ACT8 route did not bypass final vote canonically");
  await rpc("s5_advance",auth(f,0));
  s=await state(f);
  assert(s.state.phase_key==="complete","Sprint5 direct-route setup did not complete");
}

function obligationValues(report){
  assert(report&&report.verified===true&&report.obligations&&typeof report.obligations==="object","Structured verified integrity report missing");
  return Object.values(report.obligations);
}

async function expectFinalizeRejected(body,label){
  let rejected=false;
  try{await rpc("s8_finalize",body);}catch{rejected=true;}
  assert(rejected,label);
}

async function main(){
  const f=await fixtureWithExactAct1Override();
  await completeSprint5WithDirectAct8(f);
  await sprint6(f,"take");

  const boundary=await s6state(f);
  const runA=boundary.state?.run_id;
  assert(runA&&boundary.state.act14_boundary_reached,"Authoritative ACT13 boundary run identity missing");

  const requests=[0,1,2].map(i=>({...auth(f,i),p_expected_run_id:runA,p_client_request_id:crypto.randomUUID()}));
  const finals=await Promise.all(requests.map(body=>rpc("s8_finalize",body)));
  assert(finals.every(x=>x.ok&&x.run_id===runA),"Same-run concurrent finalizers did not converge on the expected run");

  const replay=await rpc("s8_finalize",requests[0]);
  assert(replay.ok&&replay.idempotent_replay&&replay.run_id===runA,"Same-run lost-response retry did not replay the expected run");

  await expectFinalizeRejected({...auth(f,0),p_client_request_id:crypto.randomUUID()},"Omitted p_expected_run_id fell back to room-active/completed state");
  await expectFinalizeRejected({...auth(f,0),p_expected_run_id:null,p_client_request_id:crypto.randomUUID()},"Null p_expected_run_id was accepted");

  const player=await rpc("s8_get_player_state",auth(f,1));
  assert(player.active&&player.run_id===runA&&player.session_integrity_verified,"Finalized player projection missing");
  const obligations=obligationValues(player.integrity_report);
  for(const reason of ["inspect_first_path_not_taken","unanimous_direct_route","golden_key_watcher_path"]){
    assert(obligations.some(x=>x&&x.state==="not_applicable"&&x.reason_code===reason),`Missing exact not_applicable acceptance: ${reason}`);
  }
  assert(obligations.some(x=>x&&x.state==="invalid_teacher_override"),"Exact governed Teacher Override was not accepted as invalid_teacher_override");

  const exported=await rpc("s8_export_session",teacher(f));
  assert(new Date(exported.json.header.exported_at).getTime()>Date.now()-30000,"exported_at is not export-generation time");
  const overrideAccepted=exported.json.teacher_overrides.some(o=>
    o.override_id===f.override.override_id&&Array.isArray(o.field_validity)&&o.field_validity.some(v=>
      v.player_id===f.players[2].player_id&&v.semantic_field==="act1_choice_id"&&v.validity==="invalid_teacher_override"));
  assert(overrideAccepted,"Export lost the exact ACT1 Teacher Override validity provenance");

  const finalState=await rpc("s8_get_finalization_state",teacher(f));
  const durableVersion=finalState.export_schema_version;
  const jsonVersion=exported.json.header.export_schema_version;
  assert(durableVersion==="1.1"&&jsonVersion===durableVersion,"Durable finalization-state and JSON schema versions disagree");

  const rows=parseCsv(exported.csv),header=rows[0];
  const eventTypeIndex=header.indexOf("event_type"),payloadIndex=header.indexOf("payload_json"),runIndex=header.indexOf("run_id");
  assert(eventTypeIndex>=0&&payloadIndex>=0&&runIndex>=0,"CSV contract columns unavailable for schema-version regression");
  const finalizedRow=rows.slice(1).find(row=>row[eventTypeIndex]==="session_finalized"&&row[runIndex]===runA);
  assert(finalizedRow,"session_finalized event missing from exported ledger");
  const eventPayload=JSON.parse(finalizedRow[payloadIndex]||"{}");
  assert(eventPayload.export_schema_version===durableVersion,"session_finalized event schema version disagrees with durable authority");

  const runB=await rpc("s2_start_run",{p_room_code:f.room,p_teacher_token:f.teacher,p_run_mode:"audit"});
  assert(runB.run_id&&runB.run_id!==runA,"Run B did not start independently after Run A completion");

  const delayedA=await rpc("s8_finalize",{...auth(f,2),p_expected_run_id:runA,p_client_request_id:crypto.randomUUID()});
  assert(delayedA.ok&&delayedA.idempotent_replay&&delayedA.run_id===runA,"Delayed Run A request did not remain bound to finalized Run A");

  const activeB=await rpc("s2_get_teacher_state",teacher(f));
  assert(activeB.active&&activeB.run.run_id===runB.run_id,"Delayed Run A request changed the room's active Run B");

  const bFinalState=await rpc("s8_get_finalization_state",teacher(f));
  assert(bFinalState.run_id===runB.run_id&&!bFinalState.game_completed&&!bFinalState.export_ready&&!bFinalState.session_integrity_verified,"Delayed Run A request mutated Run B finalization flags");

  console.log("Sprint 8 final-closure live E2E passed.");
}

main().catch(e=>{console.error(e.stack||e);process.exitCode=1});
