-- Sprint 8 final closure: actual-path integrity, run-bound finalization and
-- one durable export-schema-version authority. Migrations 001-048 are immutable.
begin;

alter table public.s6_choices add column if not exists action_step integer;

update public.s6_choices c
set action_step=(r.payload->>'step')::integer
from public.s6_action_receipts r
where c.run_id=r.run_id and c.player_id=r.player_id
  and c.client_request_id=r.request_id and c.phase_key='act9_console'
  and r.action_key='group_choice' and r.payload ? 'step'
  and c.action_step is null;

create or replace function public.s8_capture_choice_step()
returns trigger language plpgsql security definer set search_path=public as $$
begin
  if new.phase_key='act9_console' and new.action_step is null then
    select act9_step into new.action_step from public.s6_run_state where run_id=new.run_id;
  end if;
  return new;
end$$;
drop trigger if exists s8_capture_choice_step on public.s6_choices;
create trigger s8_capture_choice_step before insert on public.s6_choices
for each row execute function public.s8_capture_choice_step();
revoke all on function public.s8_capture_choice_step() from public,anon,authenticated;

alter table public.s8_finalizations
  drop constraint if exists s8_finalizations_export_schema_version_check;
alter table public.s8_finalizations
  alter column export_schema_version set default '1.1';
update public.s8_finalizations set export_schema_version='1.1'
where export_schema_version is distinct from '1.1';
alter table public.s8_finalizations
  add constraint s8_finalizations_export_schema_version_check
  check(export_schema_version='1.1');

create or replace function public.s8_integrity_obligation(
  p_present boolean,
  p_evidence_identity jsonb default null,
  p_missing_reason text default 'required_evidence_missing',
  p_not_applicable_reason text default null,
  p_override_run_id uuid default null,
  p_override_field text default null
) returns jsonb language plpgsql stable security definer set search_path=public as $$
begin
  if p_not_applicable_reason is not null then
    return jsonb_build_object('state','not_applicable','reason_code',p_not_applicable_reason);
  end if;
  if p_present then
    return jsonb_strip_nulls(jsonb_build_object('state','present','evidence_identity',p_evidence_identity));
  end if;
  if p_override_run_id is not null and p_override_field is not null and exists(
    select 1 from public.teacher_override_validity
    where run_id=p_override_run_id and semantic_field=p_override_field
      and validity='invalid_teacher_override'
  ) then
    return jsonb_build_object('state','invalid_teacher_override','reason_code','exact_governed_override','evidence_identity',p_override_field);
  end if;
  return jsonb_build_object('state','missing_technical_evidence','reason_code',p_missing_reason);
end$$;
revoke all on function public.s8_integrity_obligation(boolean,jsonb,text,text,uuid,text) from public,anon,authenticated;

create or replace function public.s8_verify_integrity(p_run_id uuid)
returns jsonb language plpgsql stable security definer set search_path=public as $$
declare
  g public.game_runs%rowtype; r public.s3b_run_state%rowtype; s5 public.s5_run_state%rowtype; s6 public.s6_run_state%rowtype;
  o jsonb:='{}'::jsonb; n integer; round_id integer; direct_route text; verified boolean;
begin
  select * into g from public.game_runs where run_id=p_run_id;
  if not found then raise exception 'Unknown finalization run.'; end if;
  select * into r from public.s3b_run_state where run_id=p_run_id;
  select * into s5 from public.s5_run_state where run_id=p_run_id;
  select * into s6 from public.s6_run_state where run_id=p_run_id;

  select count(*) into n from public.s3b_player_progress
  where run_id=p_run_id and ((act1_choice_id is not null and act1_locked_at is not null and act1_timing_validity<>'pending') or act1_timing_validity='invalid_teacher_override');
  o:=o||jsonb_build_object('act1.player_first_choices',public.s8_integrity_obligation(n=3,jsonb_build_object('count',n),'act1_player_evidence_missing',null,p_run_id,'act1_choice_id'));

  select count(*) into n from public.s3b_player_progress
  where run_id=p_run_id and ((first_meeting_choice is not null and first_meeting_locked_at is not null and first_meeting_timing_validity<>'pending') or first_meeting_timing_validity='invalid_teacher_override');
  o:=o||jsonb_build_object('act2.player_first_choices',public.s8_integrity_obligation(n=3,jsonb_build_object('count',n),'act2_player_evidence_missing',null,p_run_id,'first_meeting_choice'));
  select count(*) into n from public.discussion_sessions
  where run_id=p_run_id and phase_key like 'act2%' and status='resolved' and outcome is not null;
  o:=o||jsonb_build_object('act2.meeting_resolution',public.s8_integrity_obligation(r.final_meeting_result is not null and n>=1,jsonb_build_object('resolved_sessions',n),'act2_resolution_evidence_missing',null,p_run_id,'act2_meeting_resolution'));

  select count(*) into n from public.s3b_library_attempts where run_id=p_run_id and correct;
  o:=o||jsonb_build_object('act3.puzzle_resolution',public.s8_integrity_obligation(r.puzzle_resolved_at is not null and n>=1,jsonb_build_object('correct_attempts',n),'act3_resolution_evidence_missing',null,p_run_id,'act3_puzzle_resolution'));
  select count(*) into n from public.s3b_player_progress
  where run_id=p_run_id and ((act4_choice_id is not null and act4_locked_at is not null and act4_timing_validity<>'pending') or act4_timing_validity='invalid_teacher_override');
  o:=o||jsonb_build_object('act4.route_resolution',public.s8_integrity_obligation(n=3 and r.group_route is not null,jsonb_build_object('count',n,'route',r.group_route),'act4_route_evidence_missing',null,p_run_id,'act4_choice_id'));

  select count(*) into n from public.s3b_post_inspection_route_votes where run_id=p_run_id;
  o:=o||jsonb_build_object('act5.post_inspection_vote',public.s8_integrity_obligation(n=3,jsonb_build_object('count',n),'act5_vote_evidence_missing',case when not coalesce(r.unknown_passage_inspected,false) then 'inspect_first_path_not_taken' end,p_run_id,'act5_post_inspection_vote'));

  select max(vote_round) into round_id from public.s5_rounds where run_id=p_run_id and phase_key='act6_vote' and status='resolved';
  select count(*) into n from public.s5_votes where run_id=p_run_id and phase_key='act6_vote' and vote_round=round_id;
  o:=o||jsonb_build_object('act6.effective_vote',public.s8_integrity_obligation(s5.act6_resolution is not null and n=3,jsonb_build_object('vote_round',round_id,'count',n),'act6_effective_vote_missing',null,p_run_id,'act6_effective_vote'));
  select vote_round into round_id from public.s5_votes where run_id=p_run_id and phase_key='act7_vote'
  group by vote_round having count(*) filter(where choice_id='clock_c')>=2 order by vote_round desc limit 1;
  select count(*) into n from public.s5_votes where run_id=p_run_id and phase_key='act7_vote' and vote_round=round_id;
  o:=o||jsonb_build_object('act7.clock_c_resolution',public.s8_integrity_obligation(n=3,jsonb_build_object('vote_round',round_id,'count',n),'act7_successful_round_missing',null,p_run_id,'act7_effective_vote'));

  select min(choice_id) into direct_route from public.s5_act8_private_choices where run_id=p_run_id
  having count(*)=3 and count(distinct choice_id)=1 and min(choice_id) in('main_gate','west_tower');
  select count(*) into n from public.s5_act8_private_choices where run_id=p_run_id;
  o:=o||jsonb_build_object('act8.private_choices',public.s8_integrity_obligation(n=3,jsonb_build_object('count',n),'act8_private_choices_missing',null,p_run_id,'act8_private_choices'));
  select max(vote_round) into round_id from public.s5_votes where run_id=p_run_id and phase_key='act8_final_vote';
  select count(*) into n from public.s5_votes where run_id=p_run_id and phase_key='act8_final_vote' and vote_round=round_id;
  o:=o||jsonb_build_object('act8.final_vote',public.s8_integrity_obligation(n=3,jsonb_build_object('vote_round',round_id,'count',n),'act8_final_vote_missing',case when direct_route is not null then 'unanimous_direct_route' end,p_run_id,'act8_final_vote'));

  for round_id in 1..4 loop
    select count(*) into n from public.s6_choices c
    where c.run_id=p_run_id and c.phase_key='act9_console' and c.action_step=round_id
      and c.round_no=(select x.round_no from public.s6_choices x where x.run_id=p_run_id and x.phase_key='act9_console' and x.action_step=round_id
        group by x.round_no having count(*) filter(where x.choice_id=case round_id when 1 then 'red' when 2 then 'do_not_enter' when 3 then 'blue' else 'enter_blue' end)>=2 order by x.round_no desc limit 1);
    o:=o||jsonb_build_object('act9.step_'||round_id,public.s8_integrity_obligation(n=3,jsonb_build_object('step',round_id,'submission_count',n),'act9_step_'||round_id||'_effective_evidence_missing',null,p_run_id,'act9_step_'||round_id));
  end loop;
  o:=o||jsonb_build_object('act9.progression',public.s8_integrity_obligation(s6.act_no>=10 and s6.red_activated and s6.blue_activated,jsonb_build_object('act_no',s6.act_no),'act9_progression_state_missing',null,p_run_id,'act9_progression'));

  select count(*) into n from public.s6_choices where run_id=p_run_id and phase_key='act10_private';
  o:=o||jsonb_build_object('act10.private_choices',public.s8_integrity_obligation(n=3,jsonb_build_object('count',n),'act10_private_choices_missing',null,p_run_id,'act10_private_choices'));
  select max(round_no) into round_id from public.s6_choices where run_id=p_run_id and phase_key='act10_final_vote';
  select count(*) into n from public.s6_choices where run_id=p_run_id and phase_key='act10_final_vote' and round_no=round_id;
  o:=o||jsonb_build_object('act10.final_vote',public.s8_integrity_obligation(n=3 and s6.gold_key is not null and ((s6.gold_key and s6.alarm_active and s6.station_c_bypassed) or (not s6.gold_key and not s6.alarm_active and not s6.station_c_bypassed)),jsonb_build_object('round_no',round_id,'count',n,'outcome',case when s6.gold_key then 'take' else 'leave' end),'act10_final_vote_or_branch_missing',null,p_run_id,'act10_final_vote'));
  select count(*) into n from public.discussion_sessions where run_id=p_run_id and phase_key='act10_discussion' and status='resolved';
  o:=o||jsonb_build_object('act10.discussion',public.s8_integrity_obligation(n>=1,jsonb_build_object('count',n),'act10_discussion_missing',null,p_run_id,'act10_discussion'));

  select count(*) into n from public.s6_allocations where run_id=p_run_id;
  o:=o||jsonb_build_object('act11.allocations',public.s8_integrity_obligation(n=3,jsonb_build_object('count',n),'act11_allocations_missing',null,p_run_id,'act11_allocations'));
  select count(*) into n from public.s6_station_tasks where run_id=p_run_id;
  o:=o||jsonb_build_object('act12.station_tasks',public.s8_integrity_obligation(n=3,jsonb_build_object('count',n),'act12_station_tasks_missing',case when s6.station_c_bypassed and n=2 then 'golden_key_watcher_path' end,p_run_id,'act12_station_tasks'));
  select count(*) into n from public.s6_engagements where run_id=p_run_id;
  o:=o||jsonb_build_object('act12.engagements',public.s8_integrity_obligation(n=3,jsonb_build_object('count',n),'act12_engagements_missing',null,p_run_id,'act12_engagements'));
  select count(*) into n from public.s6_choices where run_id=p_run_id and phase_key='act12_pressure';
  o:=o||jsonb_build_object('act12.pressure_choices',public.s8_integrity_obligation(n=3,jsonb_build_object('count',n),'act12_pressure_choices_missing',null,p_run_id,'act12_pressure_choices'));
  o:=o||jsonb_build_object('act13.act14_boundary',public.s8_integrity_obligation(s6.escape_success and s6.act14_boundary_reached and not s6.mechanism_failure_active,jsonb_build_object('phase',s6.phase_key),'act14_boundary_missing',null,p_run_id,'act13_boundary'));
  select count(*) into n from public.discussion_sessions where run_id=p_run_id and status in('discussion','voting','waiting_for_missing_player');
  o:=o||jsonb_build_object('run.open_discussions',public.s8_integrity_obligation(n=0,jsonb_build_object('count',n),'open_discussion_remains'));
  select count(*) into n from public.s6_audio_occurrences a where run_id=p_run_id and not exists(select 1 from public.s6_audio_consumptions c where c.occurrence_id=a.occurrence_id);
  o:=o||jsonb_build_object('run.audio_consumption',case when n=0 then jsonb_build_object('state','present','evidence_identity',jsonb_build_object('unconsumed',0)) else jsonb_build_object('state','present','reason_code','playback_not_observed','analytical_status','partial','evidence_identity',jsonb_build_object('unconsumed',n)) end);

  select not exists(select 1 from jsonb_each(o) e where e.value->>'state'='missing_technical_evidence') into verified;
  return jsonb_build_object('verified',verified,'run_id',p_run_id,'obligations',o);
end$$;
revoke all on function public.s8_verify_integrity(uuid) from public,anon,authenticated;

drop function if exists public.s8_finalize(text,text,uuid);
create function public.s8_finalize(p_room_code text,p_session_token text,p_client_request_id uuid,p_expected_run_id uuid)
returns jsonb language plpgsql security definer set search_path=public as $$
declare room text:=upper(trim(p_room_code)); p public.s1_room_players%rowtype; g public.game_runs%rowtype;
  f public.s8_finalizations%rowtype; report jsonb; schema_version text:='1.1';
begin
  if p_expected_run_id is null then raise exception 'EXPECTED_RUN_ID_REQUIRED'; end if;
  p:=public.s1_get_player_by_session(room,p_session_token);
  select * into g from public.game_runs where run_id=p_expected_run_id and room_code=room for update;
  if not found then raise exception 'FINALIZATION_RUN_ROOM_MISMATCH'; end if;
  select * into f from public.s8_finalizations where run_id=p_expected_run_id;
  if found then return jsonb_build_object('ok',true,'idempotent_replay',true,'run_id',p_expected_run_id,'export_schema_version',f.export_schema_version); end if;
  if g.status<>'active' or not exists(select 1 from public.game_runs where room_code=room and run_id=p_expected_run_id and status='active') then
    raise exception 'STALE_FINALIZATION_RUN';
  end if;
  perform public.s6_refresh_owned_discussion(p_expected_run_id); perform public.s6_tick_cinematic(p_expected_run_id);
  report:=public.s8_verify_integrity(p_expected_run_id);
  if not coalesce((report->>'verified')::boolean,false) then raise exception 'Session integrity verification failed.' using detail=report::text; end if;
  insert into public.s8_finalizations(run_id,finalized_by,client_request_id,integrity_report,export_schema_version)
  values(p_expected_run_id,p.player_id,p_client_request_id,report,schema_version) returning * into f;
  update public.s6_run_state set act_no=14,phase_key='act14_complete',updated_at=now() where run_id=p_expected_run_id;
  update public.game_runs set status='completed',scene_id='act14_final_reveal',phase_key='act14_complete',step_key='ending',session_integrity_verified=true,game_completed=true,export_ready=true,completed_at=now() where run_id=p_expected_run_id;
  insert into public.runtime_events(run_id,room_code,event_type,actor_player_id,details,scene_id,phase_key,step_key,event_source,validity,behavior_scoring,client_request_id)
  values(p_expected_run_id,room,'session_finalized',p.player_id,jsonb_build_object('integrity_report',report,'export_schema_version',f.export_schema_version),'act14_final_reveal','act14_complete','ending','player','valid',false,p_client_request_id);
  return jsonb_build_object('ok',true,'run_id',p_expected_run_id,'session_integrity_verified',true,'game_completed',true,'export_ready',true,'export_schema_version',f.export_schema_version);
end$$;

create or replace function public.s8_get_finalization_state(p_room_code text,p_teacher_token text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare room text:=upper(trim(p_room_code));g public.game_runs%rowtype;f public.s8_finalizations%rowtype;stamp text;suffix text;
begin
 perform public.s1_assert_teacher(room,p_teacher_token);g:=public.s2_get_active_run(room);if g.run_id is null then g:=public.s8_latest_completed_run(room);end if;
 if g.run_id is null then return jsonb_build_object('active',false);end if;select*into f from public.s8_finalizations where run_id=g.run_id;
 stamp:=to_char(g.run_started_at at time zone'UTC','YYYY-MM-DD_HH24-MI-SS');suffix:=case when g.run_mode='audit'then'_audit'else''end;
 return jsonb_build_object('run_id',g.run_id,'session_integrity_verified',g.session_integrity_verified,'game_completed',g.game_completed,'export_ready',g.export_ready,'export_schema_version',f.export_schema_version,'json_filename',stamp||'_'||g.run_id||suffix||'.json','csv_filename',stamp||'_'||g.run_id||suffix||'.csv');
end$$;

alter function public.s8_export_session(text,text) rename to s8_export_session_v048;
revoke all on function public.s8_export_session_v048(text,text) from public,anon,authenticated;
create function public.s8_export_session(p_room_code text,p_teacher_token text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare result jsonb; run_id uuid; version text;
begin
  result:=public.s8_export_session_v048(p_room_code,p_teacher_token);
  run_id:=(result#>>'{json,header,run_id}')::uuid;
  select export_schema_version into strict version from public.s8_finalizations where s8_finalizations.run_id=run_id;
  return jsonb_set(result,'{json,header,export_schema_version}',to_jsonb(version),false);
end$$;

revoke all on function public.s8_finalize(text,text,uuid,uuid),public.s8_get_finalization_state(text,text),public.s8_export_session(text,text) from public;
grant execute on function public.s8_finalize(text,text,uuid,uuid),public.s8_get_finalization_state(text,text),public.s8_export_session(text,text) to anon,authenticated;
commit;
