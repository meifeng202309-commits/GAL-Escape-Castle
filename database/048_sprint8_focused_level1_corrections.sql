-- Sprint 8 focused Level 1 corrections (S8-CA-001..006 database boundary).
-- Migrations 001-047 remain immutable.
begin;

create or replace function public.s8_latest_completed_run(p_room_code text)
returns public.game_runs language sql stable security definer set search_path=public as $$
  select r.* from public.game_runs r
  where r.room_code=upper(trim(p_room_code)) and r.status='completed'
    and r.game_completed and r.export_ready and r.session_integrity_verified
  order by r.completed_at desc nulls last,r.run_started_at desc limit 1
$$;
revoke all on function public.s8_latest_completed_run(text) from public,anon,authenticated;

create or replace function public.s8_finalize(p_room_code text,p_session_token text,p_client_request_id uuid)
returns jsonb language plpgsql security definer set search_path=public as $$
declare room text:=upper(trim(p_room_code));p public.s1_room_players%rowtype;g public.game_runs%rowtype;s public.s6_run_state%rowtype;
 players_n int;progress_n int;act1_n int;meeting_n int;act4_n int;resolved_discussions int;correct_library_n int;post_route_n int;
 s5_complete boolean;s5_vote_n int;s5_private_n int;allocations_n int;tasks_n int;engagements_n int;pressure_n int;open_discussions int;audio_missing int;
 early_ok boolean;act2_ok boolean;act3_ok boolean;act4_ok boolean;act5_ok boolean;sprint5_ok boolean;sprint6_ok boolean;report jsonb;fin public.s8_finalizations%rowtype;route public.s3b_run_state%rowtype;
begin
 p:=public.s1_get_player_by_session(room,p_session_token);
 select * into g from public.game_runs where room_code=room and status='active' order by run_started_at desc limit 1 for update;
 if not found then
  g:=public.s8_latest_completed_run(room);
  if g.run_id is null then raise exception 'No active or completed formal run.';end if;
  select * into fin from public.s8_finalizations where run_id=g.run_id;
  if found then return jsonb_build_object('ok',true,'idempotent_replay',true,'run_id',g.run_id);end if;
  raise exception 'Completed run has no finalization record.';
 end if;
 select * into fin from public.s8_finalizations where run_id=g.run_id;
 if found then return jsonb_build_object('ok',true,'idempotent_replay',true,'run_id',g.run_id);end if;
 perform public.s6_refresh_owned_discussion(g.run_id);perform public.s6_tick_cinematic(g.run_id);
 select * into s from public.s6_run_state where run_id=g.run_id for update;
 if not found or not s.act14_boundary_reached or not s.escape_success or s.mechanism_failure_active then raise exception 'ACT 14 finalization boundary is not ready.';end if;
 select * into route from public.s3b_run_state where run_id=g.run_id;
 select count(*) into players_n from public.s1_room_players where room_code=room;
 select count(*),count(*)filter(where (act1_choice_id is not null and act1_locked_at is not null and act1_timing_validity<>'pending')or act1_timing_validity='invalid_teacher_override'),count(*)filter(where (first_meeting_choice is not null and first_meeting_locked_at is not null and first_meeting_timing_validity<>'pending')or first_meeting_timing_validity='invalid_teacher_override'),count(*)filter(where (act4_choice_id is not null and act4_locked_at is not null and act4_timing_validity<>'pending')or act4_timing_validity='invalid_teacher_override')
 into progress_n,act1_n,meeting_n,act4_n from public.s3b_player_progress where run_id=g.run_id;
 select count(*) into resolved_discussions from public.discussion_sessions where run_id=g.run_id and status='resolved';
 select count(*) into correct_library_n from public.s3b_library_attempts where run_id=g.run_id and correct;
 select count(*) into post_route_n from public.s3b_post_inspection_route_votes where run_id=g.run_id;
 select exists(select 1 from public.s5_run_state where run_id=g.run_id and phase_key='complete') into s5_complete;
 select count(*) into s5_vote_n from public.s5_votes where run_id=g.run_id;
 select count(*) into s5_private_n from public.s5_act8_private_choices where run_id=g.run_id;
 select count(*) into allocations_n from public.s6_allocations where run_id=g.run_id;
 select count(*) into tasks_n from public.s6_station_tasks where run_id=g.run_id;
 select count(*) into engagements_n from public.s6_engagements where run_id=g.run_id;
 select count(*) into pressure_n from public.s6_choices where run_id=g.run_id and phase_key='act12_pressure';
 select count(*) into open_discussions from public.discussion_sessions where run_id=g.run_id and status in('discussion','voting','waiting_for_missing_player');
 select count(*) into audio_missing from public.s6_audio_occurrences o where o.run_id=g.run_id and not exists(select 1 from public.s6_audio_consumptions c where c.occurrence_id=o.occurrence_id);
 early_ok:=players_n=3 and progress_n=3 and act1_n=3;
 act2_ok:=meeting_n=3 and route.final_meeting_result is not null and resolved_discussions>=1;
 act3_ok:=route.puzzle_resolved_at is not null and correct_library_n>=1;
 act4_ok:=act4_n=3 and route.group_route is not null;
 act5_ok:=not route.unknown_passage_inspected or post_route_n=3;
 sprint5_ok:=s5_complete and s5_vote_n>=6 and s5_private_n=3;
 sprint6_ok:=allocations_n=3 and tasks_n=3 and engagements_n=3 and pressure_n=3;
 report:=jsonb_build_object(
  'act1',jsonb_build_object('validity',case when early_ok then'valid'else'invalid'end,'player_records',progress_n,'accounted_choices',act1_n),
  'act2',jsonb_build_object('validity',case when act2_ok then'valid'else'invalid'end,'accounted_choices',meeting_n,'meeting_result',route.final_meeting_result,'resolved_discussions',resolved_discussions),
  'act3',jsonb_build_object('validity',case when act3_ok then'valid'else'invalid'end,'puzzle_resolved_at',route.puzzle_resolved_at,'correct_attempts',correct_library_n),
  'act4',jsonb_build_object('validity',case when act4_ok then'valid'else'invalid'end,'accounted_choices',act4_n,'group_route',route.group_route),
  'act5_post_inspection_route',case when route.unknown_passage_inspected then jsonb_build_object('validity',case when act5_ok then'valid'else'invalid'end,'vote_count',post_route_n)else jsonb_build_object('validity','not_applicable','reason','inspect_first_path_not_taken')end,
  'acts6_8',jsonb_build_object('validity',case when sprint5_ok then'valid'else'invalid'end,'vote_count',s5_vote_n,'private_choice_count',s5_private_n),
  'acts9_13',jsonb_build_object('validity',case when sprint6_ok then'valid'else'invalid'end,'allocations',allocations_n,'station_tasks',tasks_n,'engagements',engagements_n,'pressure_choices',pressure_n),
  'open_discussions',jsonb_build_object('validity',case when open_discussions=0 then'valid'else'invalid'end,'count',open_discussions),
  'station_c',case when s.station_c_bypassed then jsonb_build_object('validity','not_applicable','reason','golden_key_watcher_path')else jsonb_build_object('validity','valid')end,
  'audio_consumption',case when audio_missing=0 then jsonb_build_object('validity','valid')else jsonb_build_object('validity','partial','reason','playback_not_observed','missing_occurrences',audio_missing)end);
 if not(early_ok and act2_ok and act3_ok and act4_ok and act5_ok and sprint5_ok and sprint6_ok and open_discussions=0)then raise exception 'Session integrity verification failed.';end if;
 insert into public.s8_finalizations(run_id,finalized_by,client_request_id,integrity_report)values(g.run_id,p.player_id,p_client_request_id,report);
 update public.s6_run_state set act_no=14,phase_key='act14_complete',updated_at=now()where run_id=g.run_id;
 update public.game_runs set status='completed',scene_id='act14_final_reveal',phase_key='act14_complete',step_key='ending',session_integrity_verified=true,game_completed=true,export_ready=true,completed_at=now()where run_id=g.run_id;
 insert into public.runtime_events(run_id,room_code,event_type,actor_player_id,details,scene_id,phase_key,step_key,event_source,validity,behavior_scoring,client_request_id)
 values(g.run_id,room,'session_finalized',p.player_id,jsonb_build_object('export_schema_version','1.1'),'act14_final_reveal','act14_complete','ending','player','valid',false,p_client_request_id);
 return jsonb_build_object('ok',true,'run_id',g.run_id,'session_integrity_verified',true,'game_completed',true,'export_ready',true);
end$$;

create or replace function public.s8_get_player_state(p_room_code text,p_session_token text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare room text:=upper(trim(p_room_code));p public.s1_room_players%rowtype;g public.game_runs%rowtype;f public.s8_finalizations%rowtype;
begin
 p:=public.s1_get_player_by_session(room,p_session_token);g:=public.s2_get_active_run(room);
 if g.run_id is null then g:=public.s8_latest_completed_run(room);end if;
 if g.run_id is null then return jsonb_build_object('active',false);end if;
 select * into f from public.s8_finalizations where run_id=g.run_id;
 return jsonb_build_object('active',found,'run_id',g.run_id,'scene_id',case when found then'act14_final_reveal'end,'phase_key',case when found then'act14_complete'end,'text_keys',case when found then jsonb_build_array('act14.001','act14.002','act14.003','act14.004','act14.005')else'[]'::jsonb end,'session_integrity_verified',g.session_integrity_verified,'game_completed',g.game_completed,'export_ready',g.export_ready,'integrity_report',case when found then f.integrity_report end);
end$$;

create or replace function public.s8_get_finalization_state(p_room_code text,p_teacher_token text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare room text:=upper(trim(p_room_code));g public.game_runs%rowtype;stamp text;suffix text;
begin
 perform public.s1_assert_teacher(room,p_teacher_token);g:=public.s2_get_active_run(room);if g.run_id is null then g:=public.s8_latest_completed_run(room);end if;
 if g.run_id is null then return jsonb_build_object('active',false);end if;
 stamp:=to_char(g.run_started_at at time zone'UTC','YYYY-MM-DD_HH24-MI-SS');suffix:=case when g.run_mode='audit'then'_audit'else''end;
 return jsonb_build_object('run_id',g.run_id,'session_integrity_verified',g.session_integrity_verified,'game_completed',g.game_completed,'export_ready',g.export_ready,'json_filename',stamp||'_'||g.run_id||suffix||'.json','csv_filename',stamp||'_'||g.run_id||suffix||'.csv');
end$$;

create or replace function public.s8_export_session(p_room_code text,p_teacher_token text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare room text:=upper(trim(p_room_code));g public.game_runs%rowtype;f public.s8_finalizations%rowtype;stamp text;suffix text;doc jsonb;csv text;
begin
 perform public.s1_assert_teacher(room,p_teacher_token);g:=public.s8_latest_completed_run(room);select*into f from public.s8_finalizations where run_id=g.run_id;
 if g.run_id is null or not g.export_ready or not g.session_integrity_verified or not found then raise exception 'Session export is not ready.';end if;
 stamp:=to_char(g.run_started_at at time zone'UTC','YYYY-MM-DD_HH24-MI-SS');suffix:=case when g.run_mode='audit'then'_audit'else''end;
 doc:=jsonb_build_object(
  'header',jsonb_build_object('run_id',g.run_id,'room_code',g.room_code,'run_started_at',g.run_started_at,'run_mode',g.run_mode,'behavior_dataset_eligible',g.behavior_dataset_eligible,'export_schema_version','1.1','exported_at',f.finalized_at,'session_integrity_verified',g.session_integrity_verified),
  'final_state',jsonb_build_object('scene_id',g.scene_id,'phase_key',g.phase_key,'step_key',g.step_key,'game_completed',g.game_completed,'export_ready',g.export_ready,'completed_at',g.completed_at,'integrity_report',f.integrity_report),
  'players',(select coalesce(jsonb_agg(jsonb_build_object('player_id',player_id,'role_slot',role_slot,'display_name',display_name)order by role_slot),'[]')from public.s1_room_players where room_code=room),
  'early_choices',(select coalesce(jsonb_agg(jsonb_build_object('player_id',player_id,'act1',jsonb_build_object('choice_id',act1_choice_id,'started_at',act1_action_started_at,'locked_at',act1_locked_at,'timing_validity',act1_timing_validity),'act2_first_meeting',jsonb_build_object('choice_id',first_meeting_choice,'started_at',first_meeting_started_at,'locked_at',first_meeting_locked_at,'timing_validity',first_meeting_timing_validity),'act4',jsonb_build_object('choice_id',act4_choice_id,'started_at',act4_choice_started_at,'locked_at',act4_locked_at,'timing_validity',act4_timing_validity))order by player_id),'[]')from public.s3b_player_progress where run_id=g.run_id),
  'early_game_evidence',jsonb_build_object('library_attempts',(select coalesce(jsonb_agg(jsonb_build_object('attempt_number',attempt_number,'submitted_by',submitted_by,'submitted_value',submitted_value,'submitted_at',submitted_at,'correct',correct)order by attempt_number),'[]')from public.s3b_library_attempts where run_id=g.run_id),'post_inspection_route_votes',(select coalesce(jsonb_agg(jsonb_build_object('player_id',player_id,'choice_id',choice_id,'decision_type',decision_type,'behavior_scoring',behavior_scoring,'validity',validity,'locked_at',locked_at)order by locked_at),'[]')from public.s3b_post_inspection_route_votes where run_id=g.run_id)),
  'evidence',jsonb_build_object('physical_items',(select coalesce(jsonb_agg(jsonb_build_object('item_key',item_key,'physical_owner_id',physical_owner_id,'acquired_at',acquired_at)order by acquired_at),'[]')from public.s3_player_items where run_id=g.run_id),'observations',(select coalesce(jsonb_agg(jsonb_build_object('player_id',player_id,'observation_key',observation_key,'display_text_key',display_text_key,'discovered_at_scene',discovered_at_scene,'discovered_at',discovered_at)order by discovered_at),'[]')from public.s3_player_observations where run_id=g.run_id),'shared_photos',(select coalesce(jsonb_agg(jsonb_build_object('received_by',received_by,'shared_by',shared_by,'source_item_key',source_item_key,'source_view',source_view,'label_text_key',label_text_key,'shared_at',shared_at)order by shared_at),'[]')from public.s3_shared_photos where run_id=g.run_id),'group_items',(select coalesce(jsonb_agg(jsonb_build_object('item_key',item_key,'label_text_key',label_text_key,'acquired_at',acquired_at)order by acquired_at),'[]')from public.s3_group_items where run_id=g.run_id)),
  'knowledge_provenance',(select coalesce(jsonb_agg(jsonb_build_object('player_id',player_id,'knowledge_key',knowledge_key,'source',source,'scene_id',scene_id,'source_player_id',source_player_id,'source_item_key',source_item_key,'delivered_at',delivered_at)order by delivered_at),'[]')from public.s3_player_knowledge where run_id=g.run_id),
  'discussion_transcript',(select coalesce(jsonb_agg(jsonb_build_object('message_id',message_id,'discussion_session_id',discussion_session_id,'scene_id',scene_id,'phase_key',phase_key,'step_key',step_key,'player_id',player_id,'message_text',message_text,'created_at',created_at)order by created_at),'[]')from public.dialogue_messages where run_id=g.run_id),
  'votes',(select coalesce(jsonb_agg(jsonb_build_object('decision_id',decision_id,'discussion_session_id',discussion_session_id,'scene_id',scene_id,'phase_key',phase_key,'step_key',step_key,'vote_round',vote_round,'player_id',player_id,'choice_id',choice_id,'locked_at',locked_at,'validity',validity,'context_provenance',context_provenance)order by locked_at),'[]')from public.runtime_player_decisions where run_id=g.run_id),
  'sprint5',jsonb_build_object('votes',(select coalesce(jsonb_agg(jsonb_build_object('phase_key',phase_key,'vote_round',vote_round,'player_id',player_id,'choice_id',choice_id,'locked_at',locked_at,'validity','valid')order by locked_at),'[]')from public.s5_votes where run_id=g.run_id),'private_choices',(select coalesce(jsonb_agg(jsonb_build_object('player_id',player_id,'choice_id',choice_id,'locked_at',locked_at,'validity','valid')order by locked_at),'[]')from public.s5_act8_private_choices where run_id=g.run_id)),
  'sprint6',jsonb_build_object('choices',(select coalesce(jsonb_agg(jsonb_build_object('phase_key',phase_key,'round_no',round_no,'player_id',player_id,'choice_id',choice_id,'response_latency_ms',response_latency_ms,'role_context',role_context,'locked_at',locked_at,'validity','valid')order by locked_at),'[]')from public.s6_choices where run_id=g.run_id),'allocations',(select coalesce(jsonb_agg(jsonb_build_object('player_id',player_id,'role_key',role_key,'locked_at',locked_at,'validity','valid')order by locked_at),'[]')from public.s6_allocations where run_id=g.run_id),'station_tasks',(select coalesce(jsonb_agg(jsonb_build_object('role_key',role_key,'player_id',player_id,'task_key',task_key,'completed_at',completed_at,'validity','valid')order by completed_at),'[]')from public.s6_station_tasks where run_id=g.run_id),'engagements',(select coalesce(jsonb_agg(jsonb_build_object('role_key',role_key,'player_id',player_id,'engaged_at',engaged_at,'validity','valid')order by engaged_at),'[]')from public.s6_engagements where run_id=g.run_id),'audio',(select coalesce(jsonb_agg(jsonb_build_object('occurrence_id',o.occurrence_id,'cue_key',o.cue_key,'phase_key',o.phase_key,'cinematic_stage',o.cinematic_stage,'triggered_at',o.triggered_at,'consumptions',(select coalesce(jsonb_agg(jsonb_build_object('player_id',c.player_id,'outcome',c.outcome,'consumed_at',c.consumed_at)order by c.consumed_at),'[]')from public.s6_audio_consumptions c where c.occurrence_id=o.occurrence_id))order by o.triggered_at),'[]')from public.s6_audio_occurrences o where o.run_id=g.run_id)),
  'pressure_choices',(select coalesce(jsonb_agg(jsonb_build_object('player_id',player_id,'choice_id',choice_id,'role_context',role_context,'response_latency_ms',response_latency_ms,'locked_at',locked_at,'validity','valid')order by locked_at),'[]')from public.s6_choices where run_id=g.run_id and phase_key='act12_pressure'),
  'teacher_overrides',(select coalesce(jsonb_agg(jsonb_build_object('override_id',o.override_id,'override_action',o.override_action,'reason',o.reason,'source_scene',o.source_scene,'source_phase',o.source_phase,'source_step',o.source_step,'invalidated_scope',o.invalidated_scope,'created_at',o.created_at,'field_validity',(select coalesce(jsonb_agg(jsonb_build_object('player_id',v.player_id,'semantic_field',v.semantic_field,'value',v.value,'validity',v.validity)),'[]')from public.teacher_override_validity v where v.override_id=o.override_id))order by o.created_at),'[]')from public.teacher_overrides o where o.run_id=g.run_id),
  'behavior_validity',(select coalesce(jsonb_agg(jsonb_build_object('scene_id',scene_id,'phase_key',phase_key,'step_key',step_key,'validity',coalesce(validity,'partial'),'context_provenance',coalesce(details->'context_provenance','{}'::jsonb))order by event_id),'[]')from public.runtime_events where run_id=g.run_id));
 with ledger as(
  select created_at ts,event_type,run_id,scene_id,phase_key,step_key,actor_player_id actor_id,coalesce(validity,'partial')validity,0 source_order,event_id,
   jsonb_strip_nulls(jsonb_build_object('choice_id',details->'choice_id','response_duration_ms',details->'response_duration_ms','resolution_source',details->'resolution_source','discussion_session_id',details->'discussion_session_id','route',details->'route','outcome',details->'outcome','cue_key',details->'cue_key','behavior_scoring',details->'behavior_scoring','context_provenance',details->'context_provenance','export_schema_version',details->'export_schema_version'))payload
  from public.runtime_events where run_id=g.run_id
  union all
  select occurred_at,event_type,run_id,case when act_no is null then null else'act'||act_no end,phase_key,null,player_id,'valid',1,event_id,
   jsonb_strip_nulls(jsonb_build_object('choice_id',details->'choice_id','round_no',details->'round_no','role_key',details->'role_key','task_key',details->'task_key','cue_key',details->'cue_key','outcome',details->'outcome','cinematic_stage',details->'cinematic_stage','resolution_source',details->'resolution_source'))
  from public.act6_13_event_ledger where run_id=g.run_id
 )select 'timestamp,event_type,run_id,scene_id,phase_key,step_key,actor_id,payload_json,validity'||E'\n'||coalesce(string_agg('"'||replace(coalesce(ts::text,''),'"','""')||'","'||replace(event_type,'"','""')||'","'||run_id||'","'||replace(coalesce(scene_id,''),'"','""')||'","'||replace(coalesce(phase_key,''),'"','""')||'","'||replace(coalesce(step_key,''),'"','""')||'","'||coalesce(actor_id::text,'')||'","'||replace(payload::text,'"','""')||'","'||replace(validity,'"','""')||'"',E'\n'order by ts,source_order,event_id),'')into csv from ledger;
 return jsonb_build_object('json_filename',stamp||'_'||g.run_id||suffix||'.json','csv_filename',stamp||'_'||g.run_id||suffix||'.csv','json',doc,'csv',csv);
end$$;

revoke all on function public.s8_finalize(text,text,uuid),public.s8_get_player_state(text,text),public.s8_get_finalization_state(text,text),public.s8_export_session(text,text) from public;
grant execute on function public.s8_finalize(text,text,uuid),public.s8_get_player_state(text,text),public.s8_get_finalization_state(text,text),public.s8_export_session(text,text) to anon,authenticated;
commit;
