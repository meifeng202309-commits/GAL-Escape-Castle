const {rpc,assert,auth,fixture,sprint6}=require('./sprint5-live-e2e');
async function main(){
 const f=await fixture();await sprint6(f,'take');
 const request=crypto.randomUUID(),body={...auth(f,0),p_client_request_id:request};
 const finalized=await rpc('s8_finalize',body);assert(finalized.session_integrity_verified&&finalized.game_completed&&finalized.export_ready,'final flags missing');
 const replay=await rpc('s8_finalize',body);assert(replay.idempotent_replay,'duplicate finalization was not idempotent');
 const player=await rpc('s8_get_player_state',auth(f,1));assert(player.active&&player.phase_key==='act14_complete'&&player.text_keys.join(',')==='act14.001,act14.002,act14.003,act14.004,act14.005','ACT14 reconnect state failed');
 const result=await rpc('s8_export_session',{p_room_code:f.room,p_teacher_token:f.teacher});
 assert(result.json_filename.endsWith(`${finalized.run_id}_audit.json`)&&result.csv_filename.endsWith(`${finalized.run_id}_audit.csv`),'AUDIT filenames invalid');
 assert(result.json.header.export_schema_version==='1.0'&&result.json.header.session_integrity_verified,'canonical header invalid');
 for(const key of ['knowledge_provenance','discussion_transcript','votes','pressure_choices','teacher_overrides','behavior_validity'])assert(Array.isArray(result.json[key]),`missing ${key}`);
 const serialized=JSON.stringify(result.json);for(const secret of ['teacher_token','join_code','session_token','service_role','supabase_key'])assert(!serialized.toLowerCase().includes(secret),'secret-like export field found');
 assert(result.csv.split('\n')[0]==='timestamp,event_type,run_id,scene_id,phase_key,step_key,actor_id,payload_json,validity','CSV columns invalid');
 assert(player.integrity_report.station_c.validity==='not_applicable','legitimate branch absence was not accepted');
 console.log('Sprint 8 AUDIT live E2E passed.');
}
main().catch(e=>{console.error(e.stack||e);process.exitCode=1});
