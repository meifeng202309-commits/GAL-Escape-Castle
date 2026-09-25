const {rpc,assert,auth,fixture,sprint6,vote,state}=require('./sprint5-live-e2e');
async function completeSprint5(f){
 await sprint8Vote(f,['escape','1897','trapped']);await sprint8Vote(f,['escape','1897','trapped']);await rpc('s5_advance',auth(f,0));
 await rpc('s3_set_item_view',{...auth(f,2),p_item_key:'linda_stopped_watch',p_target_view:'back'});
 await sprint8Vote(f,['clock_a','clock_a','clock_c']);await sprint8Vote(f,['clock_c','clock_c','clock_b']);await rpc('s5_advance',auth(f,0));
 for(const [i,p_choice_id]of [[0,'main_gate'],[1,'west_tower'],[2,'compare']])await rpc('s5_submit_private_choice',{...auth(f,i),p_client_request_id:crypto.randomUUID(),p_choice_id});
 await rpc('s3_share_photo',{...auth(f,2),p_recipient_role:'GAL-B',p_source_item_key:'linda_closure_order',p_source_view:'front'});
 await sprint8Vote(f,['west_tower','west_tower','main_gate']);await rpc('s5_advance',auth(f,0));
 const s=await state(f);assert(s.state.phase_key==='complete','Sprint5 setup did not complete');
}
async function sprint8Vote(f,choices){
 if((process.env.S8_MODE||'audit')==='audit')return vote(f,choices);
 const before=await rpc('s5_get_discussion_state',auth(f,0));
 await rpc('s5_teacher_open_vote',{p_room_code:f.room,p_teacher_token:f.teacher});
 const voting=await rpc('s5_get_discussion_state',auth(f,0));assert(voting.discussion.status==='voting','Teacher-governed NORMAL vote did not open');
 for(let i=0;i<3;i++)await rpc('s5_submit_vote',{...auth(f,i),p_expected_discussion_session_id:before.discussion.discussion_session_id,p_expected_vote_round:before.discussion.vote_round,p_client_request_id:crypto.randomUUID(),p_choice_id:choices[i]});
}
async function main(){
 const mode=process.env.S8_MODE||'audit',f=await fixture(mode);await completeSprint5(f);await sprint6(f,'take');
 const requests=[0,1,2].map(i=>({...auth(f,i),p_client_request_id:crypto.randomUUID()}));
 const finals=await Promise.all(requests.map(body=>rpc('s8_finalize',body)));const finalized=finals.find(x=>x.session_integrity_verified)||finals[0];
 assert(finalized.session_integrity_verified&&finalized.game_completed&&finalized.export_ready,'final flags missing');
 assert(finals.every(x=>x.ok),'concurrent finalizers did not converge successfully');
 const body=requests[0];
 const replay=await rpc('s8_finalize',body);assert(replay.idempotent_replay,'duplicate finalization was not idempotent');
 const player=await rpc('s8_get_player_state',auth(f,1));assert(player.active&&player.phase_key==='act14_complete'&&player.text_keys.join(',')==='act14.001,act14.002,act14.003,act14.004,act14.005','ACT14 reconnect state failed');
 const result=await rpc('s8_export_session',{p_room_code:f.room,p_teacher_token:f.teacher});
 const suffix=mode==='audit'?'_audit':'';assert(result.json_filename.endsWith(`${finalized.run_id}${suffix}.json`)&&result.csv_filename.endsWith(`${finalized.run_id}${suffix}.csv`),`${mode} filenames invalid`);
 assert(result.json.header.export_schema_version==='1.1'&&result.json.header.session_integrity_verified,'canonical header invalid');
 for(const key of ['early_choices','knowledge_provenance','discussion_transcript','votes','pressure_choices','teacher_overrides','behavior_validity'])assert(Array.isArray(result.json[key]),`missing ${key}`);
 assert(result.json.early_choices.length===3&&result.json.early_choices.every(x=>x.act1.locked_at&&x.act2_first_meeting.locked_at&&x.act4.locked_at),'early behavior evidence incomplete');
 const serialized=JSON.stringify(result.json);for(const secret of ['teacher_token','join_code','session_token','service_role','supabase_key'])assert(!serialized.toLowerCase().includes(secret),'secret-like export field found');
 assert(result.csv.split('\n')[0]==='timestamp,event_type,run_id,scene_id,phase_key,step_key,actor_id,payload_json,validity','CSV columns invalid');
 assert(player.integrity_report.station_c.validity==='not_applicable','legitimate branch absence was not accepted');
 assert(result.json.header.run_mode===mode&&result.json.header.behavior_dataset_eligible===(mode==='normal'),'run mode metadata invalid');
 const next=await rpc('s2_start_run',{p_room_code:f.room,p_teacher_token:f.teacher,p_run_mode:mode});assert(next.run_id!==finalized.run_id,'completed run still blocks a new run');
 const prior=await rpc('s8_export_session',{p_room_code:f.room,p_teacher_token:f.teacher});assert(prior.json.header.run_id===finalized.run_id,'completed export was lost after next run start');
 console.log(`Sprint 8 ${mode.toUpperCase()} live E2E passed.`);
}
main().catch(e=>{console.error(e.stack||e);process.exitCode=1});
