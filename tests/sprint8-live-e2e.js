const {rpc,assert,auth,fixture,sprint6,vote,state}=require('./sprint5-live-e2e');
async function completeSprint5(f){
 await vote(f,['escape','1897','trapped']);await vote(f,['escape','1897','trapped']);await rpc('s5_advance',auth(f,0));
 await rpc('s3_set_item_view',{...auth(f,2),p_item_key:'linda_stopped_watch',p_target_view:'back'});
 await vote(f,['clock_a','clock_a','clock_c']);await vote(f,['clock_c','clock_c','clock_b']);await rpc('s5_advance',auth(f,0));
 for(const [i,p_choice_id]of [[0,'main_gate'],[1,'west_tower'],[2,'compare']])await rpc('s5_submit_private_choice',{...auth(f,i),p_client_request_id:crypto.randomUUID(),p_choice_id});
 await rpc('s3_share_photo',{...auth(f,2),p_recipient_role:'GAL-B',p_source_item_key:'linda_closure_order',p_source_view:'front'});
 await vote(f,['west_tower','west_tower','main_gate']);await rpc('s5_advance',auth(f,0));
 const s=await state(f);assert(s.state.phase_key==='complete','Sprint5 setup did not complete');
}
async function main(){
 const mode=process.env.S8_MODE||'audit',f=await fixture(mode);await completeSprint5(f);await sprint6(f,'take');
 const request=crypto.randomUUID(),body={...auth(f,0),p_client_request_id:request};
 const finalized=await rpc('s8_finalize',body);assert(finalized.session_integrity_verified&&finalized.game_completed&&finalized.export_ready,'final flags missing');
 const replay=await rpc('s8_finalize',body);assert(replay.idempotent_replay,'duplicate finalization was not idempotent');
 const player=await rpc('s8_get_player_state',auth(f,1));assert(player.active&&player.phase_key==='act14_complete'&&player.text_keys.join(',')==='act14.001,act14.002,act14.003,act14.004,act14.005','ACT14 reconnect state failed');
 const result=await rpc('s8_export_session',{p_room_code:f.room,p_teacher_token:f.teacher});
 const suffix=mode==='audit'?'_audit':'';assert(result.json_filename.endsWith(`${finalized.run_id}${suffix}.json`)&&result.csv_filename.endsWith(`${finalized.run_id}${suffix}.csv`),`${mode} filenames invalid`);
 assert(result.json.header.export_schema_version==='1.0'&&result.json.header.session_integrity_verified,'canonical header invalid');
 for(const key of ['knowledge_provenance','discussion_transcript','votes','pressure_choices','teacher_overrides','behavior_validity'])assert(Array.isArray(result.json[key]),`missing ${key}`);
 const serialized=JSON.stringify(result.json);for(const secret of ['teacher_token','join_code','session_token','service_role','supabase_key'])assert(!serialized.toLowerCase().includes(secret),'secret-like export field found');
 assert(result.csv.split('\n')[0]==='timestamp,event_type,run_id,scene_id,phase_key,step_key,actor_id,payload_json,validity','CSV columns invalid');
 assert(player.integrity_report.station_c.validity==='not_applicable','legitimate branch absence was not accepted');
 assert(result.json.header.run_mode===mode&&result.json.header.behavior_dataset_eligible===(mode==='normal'),'run mode metadata invalid');
 console.log(`Sprint 8 ${mode.toUpperCase()} live E2E passed.`);
}
main().catch(e=>{console.error(e.stack||e);process.exitCode=1});
