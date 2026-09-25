-- Sprint 8: ACT 14 finalization and allowlisted JSON/CSV export.
begin;

alter table public.game_runs
  add column if not exists session_integrity_verified boolean not null default false,
  add column if not exists game_completed boolean not null default false,
  add column if not exists export_ready boolean not null default false,
  add column if not exists completed_at timestamptz;

create table public.s8_finalizations(
  run_id uuid primary key references public.game_runs(run_id),
  finalized_at timestamptz not null default now(),
  finalized_by uuid not null references public.s1_room_players(player_id),
  client_request_id uuid not null,
  integrity_report jsonb not null,
  export_schema_version text not null default '1.0' check(export_schema_version='1.0'),
  unique(run_id,client_request_id)
);
alter table public.s8_finalizations enable row level security;
revoke all on table public.s8_finalizations from public,anon,authenticated;

create or replace function public.s8_finalize(p_room_code text,p_session_token text,p_client_request_id uuid)
returns jsonb language plpgsql security definer set search_path=public as $$
declare room text:=upper(trim(p_room_code));p public.s1_room_players%rowtype;g public.game_runs%rowtype;s public.s6_run_state%rowtype;
 players_n int;allocations_n int;tasks_n int;engagements_n int;pressure_n int;open_discussions int;audio_missing int;report jsonb;fin public.s8_finalizations%rowtype;
begin
 p:=public.s1_get_player_by_session(room,p_session_token);g:=public.s2_get_active_run(room);
 select * into fin from public.s8_finalizations where run_id=g.run_id;
 if found then
  if fin.client_request_id<>p_client_request_id then return jsonb_build_object('ok',true,'idempotent_replay',true,'run_id',g.run_id);end if;
  return jsonb_build_object('ok',true,'idempotent_replay',true,'run_id',g.run_id);
 end if;
 perform public.s6_refresh_owned_discussion(g.run_id);perform public.s6_tick_cinematic(g.run_id);
 select * into s from public.s6_run_state where run_id=g.run_id for update;
 if not found or not s.act14_boundary_reached or not s.escape_success or s.mechanism_failure_active then raise exception 'ACT 14 finalization boundary is not ready.';end if;
 select count(*) into players_n from public.s1_room_players where room_code=room;
 select count(*) into allocations_n from public.s6_allocations where run_id=g.run_id;
 select count(*) into tasks_n from public.s6_station_tasks where run_id=g.run_id;
 select count(*) into engagements_n from public.s6_engagements where run_id=g.run_id;
 select count(*) into pressure_n from public.s6_choices where run_id=g.run_id and phase_key='act12_pressure';
 select count(*) into open_discussions from public.discussion_sessions where run_id=g.run_id and status in('discussion','voting','waiting_for_missing_player');
 select count(*) into audio_missing from public.s6_audio_occurrences o where o.run_id=g.run_id and not exists(select 1 from public.s6_audio_consumptions c where c.occurrence_id=o.occurrence_id);
 if players_n<>3 or allocations_n<>3 or tasks_n<>3 or engagements_n<>3 or pressure_n<>3 or open_discussions<>0 then raise exception 'Session integrity verification failed.';end if;
 report:=jsonb_build_object(
  'players',jsonb_build_object('validity','valid','count',players_n),
  'allocation',jsonb_build_object('validity','valid','count',allocations_n),
  'station_tasks',jsonb_build_object('validity','valid','count',tasks_n),
  'engagements',jsonb_build_object('validity','valid','count',engagements_n),
  'pressure_choices',jsonb_build_object('validity','valid','count',pressure_n),
  'open_discussions',jsonb_build_object('validity','valid','count',open_discussions),
  'station_c',case when s.station_c_bypassed then jsonb_build_object('validity','not_applicable','reason','golden_key_watcher_path') else jsonb_build_object('validity','valid') end,
  'audio_consumption',case when audio_missing=0 then jsonb_build_object('validity','valid') else jsonb_build_object('validity','partial','reason','playback_not_observed','missing_occurrences',audio_missing) end
 );
 insert into public.s8_finalizations(run_id,finalized_by,client_request_id,integrity_report)values(g.run_id,p.player_id,p_client_request_id,report);
 update public.s6_run_state set act_no=14,phase_key='act14_complete',updated_at=now() where run_id=g.run_id;
 update public.game_runs set scene_id='act14_final_reveal',phase_key='act14_complete',step_key='ending',session_integrity_verified=true,game_completed=true,export_ready=true,completed_at=now() where run_id=g.run_id;
 insert into public.runtime_events(run_id,room_code,event_type,actor_player_id,details,scene_id,phase_key,step_key,event_source,validity,behavior_scoring,client_request_id)
 values(g.run_id,room,'session_finalized',p.player_id,jsonb_build_object('integrity_report',report,'export_schema_version','1.0'),'act14_final_reveal','act14_complete','ending','player','valid',false,p_client_request_id);
 return jsonb_build_object('ok',true,'run_id',g.run_id,'session_integrity_verified',true,'game_completed',true,'export_ready',true);
end$$;

create or replace function public.s8_get_player_state(p_room_code text,p_session_token text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare room text:=upper(trim(p_room_code));p public.s1_room_players%rowtype;g public.game_runs%rowtype;f public.s8_finalizations%rowtype;
begin
 p:=public.s1_get_player_by_session(room,p_session_token);g:=public.s2_get_active_run(room);
 select * into f from public.s8_finalizations where run_id=g.run_id;
 return jsonb_build_object('active',found,'run_id',g.run_id,'scene_id',case when found then'act14_final_reveal'end,'phase_key',case when found then'act14_complete'end,'text_keys',case when found then jsonb_build_array('act14.001','act14.002','act14.003','act14.004','act14.005')else'[]'::jsonb end,'session_integrity_verified',g.session_integrity_verified,'game_completed',g.game_completed,'export_ready',g.export_ready,'integrity_report',case when found then f.integrity_report end);
end$$;

create or replace function public.s8_get_finalization_state(p_room_code text,p_teacher_token text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare room text:=upper(trim(p_room_code));g public.game_runs%rowtype;stamp text;suffix text;
begin
 perform public.s1_assert_teacher(room,p_teacher_token);g:=public.s2_get_active_run(room);
 stamp:=to_char(g.run_started_at at time zone 'UTC','YYYY-MM-DD_HH24-MI-SS');suffix:=case when g.run_mode='audit'then'_audit'else''end;
 return jsonb_build_object('run_id',g.run_id,'session_integrity_verified',g.session_integrity_verified,'game_completed',g.game_completed,'export_ready',g.export_ready,'json_filename',stamp||'_'||g.run_id||suffix||'.json','csv_filename',stamp||'_'||g.run_id||suffix||'.csv');
end$$;

create or replace function public.s8_export_session(p_room_code text,p_teacher_token text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare room text:=upper(trim(p_room_code));g public.game_runs%rowtype;f public.s8_finalizations%rowtype;stamp text;suffix text;doc jsonb;csv text;
begin
 perform public.s1_assert_teacher(room,p_teacher_token);g:=public.s2_get_active_run(room);select*into f from public.s8_finalizations where run_id=g.run_id;
 if not g.export_ready or not g.session_integrity_verified or not found then raise exception 'Session export is not ready.';end if;
 stamp:=to_char(g.run_started_at at time zone 'UTC','YYYY-MM-DD_HH24-MI-SS');suffix:=case when g.run_mode='audit'then'_audit'else''end;
 doc:=jsonb_build_object(
  'header',jsonb_build_object('run_id',g.run_id,'room_code',g.room_code,'run_started_at',g.run_started_at,'run_mode',g.run_mode,'behavior_dataset_eligible',g.behavior_dataset_eligible,'export_schema_version',f.export_schema_version,'exported_at',f.finalized_at,'session_integrity_verified',g.session_integrity_verified),
  'final_state',jsonb_build_object('scene_id',g.scene_id,'phase_key',g.phase_key,'step_key',g.step_key,'game_completed',g.game_completed,'export_ready',g.export_ready,'completed_at',g.completed_at,'integrity_report',f.integrity_report),
  'players',(select coalesce(jsonb_agg(jsonb_build_object('player_id',player_id,'role_slot',role_slot,'display_name',display_name)order by role_slot),'[]')from public.s1_room_players where room_code=room),
  'knowledge_provenance',(select coalesce(jsonb_agg(jsonb_build_object('player_id',player_id,'knowledge_key',knowledge_key,'source',source,'scene_id',scene_id,'source_player_id',source_player_id,'source_item_key',source_item_key,'delivered_at',delivered_at)order by delivered_at,acquisition_id),'[]')from public.s3_player_knowledge where run_id=g.run_id),
  'discussion_transcript',(select coalesce(jsonb_agg(jsonb_build_object('message_id',message_id,'discussion_session_id',discussion_session_id,'scene_id',scene_id,'phase_key',phase_key,'step_key',step_key,'player_id',player_id,'message_text',message_text,'created_at',created_at)order by created_at,message_id),'[]')from public.dialogue_messages where run_id=g.run_id),
  'votes',(select coalesce(jsonb_agg(jsonb_build_object('decision_id',decision_id,'discussion_session_id',discussion_session_id,'scene_id',scene_id,'phase_key',phase_key,'step_key',step_key,'vote_round',vote_round,'player_id',player_id,'choice_id',choice_id,'locked_at',locked_at,'validity',validity,'context_provenance',context_provenance)order by locked_at,decision_id),'[]')from public.runtime_player_decisions where run_id=g.run_id),
  'pressure_choices',(select coalesce(jsonb_agg(jsonb_build_object('player_id',player_id,'choice_id',choice_id,'role_context',role_context,'response_latency_ms',response_latency_ms,'locked_at',locked_at,'validity','valid','context_provenance',jsonb_build_object('source','player'))order by locked_at),'[]')from public.s6_choices where run_id=g.run_id and phase_key='act12_pressure'),
  'teacher_overrides',(select coalesce(jsonb_agg(jsonb_build_object('override_id',override_id,'override_action',override_action,'reason',reason,'source_scene',source_scene,'source_phase',source_phase,'created_at',created_at,'validity','invalid_teacher_override')order by created_at),'[]')from public.teacher_overrides where run_id=g.run_id),
  'behavior_validity',(select coalesce(jsonb_agg(jsonb_build_object('scene_id',scene_id,'phase_key',phase_key,'step_key',step_key,'validity',coalesce(validity,'partial'),'context_provenance',coalesce(details->'context_provenance','{}'::jsonb))order by event_id),'[]')from public.runtime_events where run_id=g.run_id)
 );
 select 'timestamp,event_type,run_id,scene_id,phase_key,step_key,actor_id,payload_json,validity'||E'\n'||coalesce(string_agg(
  '"'||replace(coalesce(created_at::text,''),'"','""')||'","'||replace(event_type,'"','""')||'","'||run_id||'","'||replace(coalesce(scene_id,''),'"','""')||'","'||replace(coalesce(phase_key,''),'"','""')||'","'||replace(coalesce(step_key,''),'"','""')||'","'||coalesce(actor_player_id::text,'')||'","'||replace(details::text,'"','""')||'","'||replace(coalesce(validity,'partial'),'"','""')||'"',E'\n' order by created_at,event_id),'') into csv from public.runtime_events where run_id=g.run_id;
 return jsonb_build_object('json_filename',stamp||'_'||g.run_id||suffix||'.json','csv_filename',stamp||'_'||g.run_id||suffix||'.csv','json',doc,'csv',csv);
end$$;

grant execute on function public.s8_finalize(text,text,uuid),public.s8_get_player_state(text,text),public.s8_get_finalization_state(text,text),public.s8_export_session(text,text) to anon,authenticated;
commit;
