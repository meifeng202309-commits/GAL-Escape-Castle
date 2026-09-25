-- Post-Sprint8 Level3 integrated closure: IDA2-001..006.
-- Migrations 001-053 are deployed history and remain immutable.
begin;

alter function public.teacher_apply_override(text,text,text,text) rename to teacher_apply_override_v053;
revoke all on function public.teacher_apply_override_v053(text,text,text,text) from public,anon,authenticated;

create function public.teacher_apply_override(
  p_room_code text,p_teacher_token text,p_override_action text,p_reason text
) returns jsonb language plpgsql security definer set search_path=public as $$
declare
  room text:=upper(trim(p_room_code));g public.game_runs%rowtype;s public.s3_runtime_scene_state%rowtype;
  o uuid:=gen_random_uuid();scope jsonb:='[]'::jsonb;resolution text;d public.discussion_sessions%rowtype;
begin
  perform public.s1_assert_teacher(room,p_teacher_token);
  perform pg_advisory_xact_lock(hashtextextended(room,0));
  if exists(select 1 from public.teacher_overrides o join public.game_runs x on x.run_id=o.run_id where x.room_code=room and x.status='active' and o.override_action=p_override_action and o.created_at>clock_timestamp()-interval '2 seconds') then raise exception 'Current interaction was already overridden.';end if;
  if p_override_action not in ('SKIP_CURRENT_INTERACTION','RESOLVE_AND_CONTINUE') then raise exception 'Unknown override action.';end if;
  if p_reason is null or char_length(trim(p_reason)) not between 1 and 500 then raise exception 'Override reason must contain 1 to 500 characters.';end if;
  select * into g from public.game_runs where room_code=room and status='active' for update;
  if not found then raise exception 'No active formal run.';end if;
  select * into s from public.s3_runtime_scene_state where run_id=g.run_id for update;
  if exists(select 1 from public.teacher_overrides where run_id=g.run_id and source_scene=s.scene_id and source_phase=s.phase_key and source_step=s.step_key) then raise exception 'Current interaction was already overridden.';end if;

  if s.scene_id='act1_wake_up' and s.phase_key='private_first_action' and p_override_action='SKIP_CURRENT_INTERACTION' then
    select coalesce(jsonb_agg(jsonb_build_object('player_id',player_id,'fields',jsonb_build_array('act1_choice_id','act1_locked_at','act1_response_duration_ms'))),'[]') into scope
    from public.s3b_player_progress where run_id=g.run_id and act1_choice_id is null;
    insert into public.teacher_overrides values(o,g.run_id,s.scene_id,s.phase_key,s.step_key,p_override_action,null,'teacher_override',trim(p_reason),scope,false,now());
    insert into public.teacher_override_validity(override_id,run_id,player_id,semantic_field,value)
    select o,g.run_id,player_id,f,null from public.s3b_player_progress cross join unnest(array['act1_choice_id','act1_locked_at','act1_response_duration_ms']) f where run_id=g.run_id and act1_choice_id is null;
    update public.s3b_player_progress set act1_stage='complete',act1_text_keys='[]'::jsonb,act1_timing_validity='invalid_teacher_override' where run_id=g.run_id and act1_choice_id is null;
    update public.s3b_player_progress set act1_stage='complete' where run_id=g.run_id and act1_stage<>'complete';
    perform public.s3b_set_scene(g.run_id,'act2_first_contact','private_first_meeting','signal_unstable','ACTION_SCREEN','act02.002');
  -- Preserve the other two previously deployed combinations through the frozen implementation.
  elsif (s.scene_id,s.phase_key,p_override_action) in(
    ('act2_route_update','route_update','SKIP_CURRENT_INTERACTION'),
    ('act3_library','library_box','RESOLVE_AND_CONTINUE')) then
    return public.teacher_apply_override_v053(p_room_code,p_teacher_token,p_override_action,p_reason);
  elsif s.scene_id='act2_first_contact' and s.phase_key='private_first_meeting' and p_override_action='SKIP_CURRENT_INTERACTION' then
    select coalesce(jsonb_agg(jsonb_build_object('player_id',player_id,'fields',jsonb_build_array('first_meeting_choice','first_meeting_locked_at','first_meeting_response_duration_ms'))),'[]') into scope
    from public.s3b_player_progress where run_id=g.run_id and first_meeting_choice is null;
    insert into public.teacher_overrides values(o,g.run_id,s.scene_id,s.phase_key,s.step_key,p_override_action,null,'teacher_override',trim(p_reason),scope,false,now());
    insert into public.teacher_override_validity(override_id,run_id,player_id,semantic_field,value)
    select o,g.run_id,player_id,f,null from public.s3b_player_progress cross join unnest(array['first_meeting_choice','first_meeting_locked_at','first_meeting_response_duration_ms']) f
    where run_id=g.run_id and first_meeting_choice is null;
    update public.s3b_player_progress set first_meeting_timing_validity='invalid_teacher_override',grab_complete=true,left_start_room=true,player_location='corridor'
    where run_id=g.run_id and first_meeting_choice is null;
    update public.s3b_player_progress set grab_complete=true,left_start_room=true,player_location='corridor' where run_id=g.run_id;
    insert into public.s3_player_items(run_id,item_key,physical_owner_id)
    select g.run_id,x.item_key,p.player_id from public.s1_room_players p cross join lateral unnest(case p.role_slot when 'GAL-A' then array['gitte_castle_map','gitte_number_note'] when 'GAL-B' then array['anna_servant_diary'] else array['linda_stopped_watch','linda_star_key','linda_closure_order'] end)x(item_key)
    where p.room_code=room on conflict do nothing;
    insert into public.s3_player_item_view_state(run_id,player_id,item_key,current_view)
    select g.run_id,i.physical_owner_id,i.item_key,case when i.item_key='gitte_castle_map' then 'map' when i.item_key='anna_servant_diary' then 'open' else 'front' end
    from public.s3_player_items i where i.run_id=g.run_id on conflict do nothing;
    insert into public.discussion_sessions(run_id,scene_id,phase_key,step_key,round_no,vote_round,topic,phase_deadline,show_initial_choices,require_final_vote,vote_options,tie_policy,revote_window_sec,max_revotes,fallback_resolution,discussion_time_limit_sec,vote_time_limit_sec,silent_texting_mode)
    values(g.run_id,'act2_first_contact','meeting_discussion','final_meeting',1,1,'act02.026',now()+interval '150 seconds',false,true,'[{"id":"library"},{"id":"great_hall"},{"id":"main_gate"},{"id":"west_tower"},{"id":"chapel"}]','SINGLE_REVOTE_THEN_FALLBACK',30,1,'library',150,120,false);
    perform public.s3b_set_scene(g.run_id,'act2_first_contact','meeting_discussion','signal_restored','CRITICAL_INFO','act02.024');
  elsif s.scene_id='act2_first_contact' and s.phase_key='meeting_discussion' and p_override_action='RESOLVE_AND_CONTINUE' then
    select * into d from public.discussion_sessions where run_id=g.run_id and scene_id=s.scene_id and phase_key=s.phase_key order by started_at desc limit 1 for update;
    if d.discussion_session_id is null then raise exception 'ACT 2 discussion is unavailable.';end if;
    resolution:='library';
    insert into public.teacher_overrides values(o,g.run_id,s.scene_id,s.phase_key,s.step_key,p_override_action,resolution,'teacher_override',trim(p_reason),scope,false,now());
    update public.discussion_sessions set status='resolved',outcome=jsonb_build_object('choice_id',resolution,'resolution_source','teacher_override','override_id',o),ended_at=now() where discussion_session_id=d.discussion_session_id;
    update public.s3b_run_state set final_meeting_result=resolution,updated_at=now() where run_id=g.run_id;
    perform public.s3b_set_scene(g.run_id,'act2_route_update','route_update',resolution,'CRITICAL_INFO','act02.032');
  elsif s.scene_id='act2_rendezvous' and s.phase_key='route_consequence' and p_override_action='SKIP_CURRENT_INTERACTION' then
    select final_meeting_result into resolution from public.s3b_run_state where run_id=g.run_id for update;
    if resolution is null then raise exception 'Meeting route is unresolved.';end if;
    insert into public.teacher_overrides values(o,g.run_id,s.scene_id,s.phase_key,s.step_key,p_override_action,resolution,'teacher_override',trim(p_reason),scope,false,now());
    update public.s3b_run_state set failed_rendezvous_completed=failed_rendezvous_completed or resolution<>'library',updated_at=now() where run_id=g.run_id;
    update public.s3_runtime_scene_state set current_route_target='library',wayfinding_target='library' where run_id=g.run_id;
    perform public.s3b_set_scene(g.run_id,'act3_library','wayfinding','follow_sign','ACTION_SCREEN','act03.001');
  elsif s.scene_id='act3_library' and s.phase_key='wayfinding' and p_override_action='SKIP_CURRENT_INTERACTION' then
    insert into public.teacher_overrides values(o,g.run_id,s.scene_id,s.phase_key,s.step_key,p_override_action,null,'teacher_override',trim(p_reason),scope,false,now());
    update public.s3b_player_progress set player_location='library' where run_id=g.run_id;
    update public.s3b_run_state set party_physically_reunited=true,puzzle_started_at=coalesce(puzzle_started_at,now()),puzzle_deadline=coalesce(puzzle_deadline,now()+interval '90 seconds'),updated_at=now() where run_id=g.run_id;
    update public.game_runs set silent_texting_mode=true where run_id=g.run_id;
    perform public.s3b_set_scene(g.run_id,'act3_library','library_box','locked','ACTION_SCREEN','act03.008');
  elsif s.scene_id='act4_known_unknown' and s.phase_key='private_route_choice' and p_override_action='SKIP_CURRENT_INTERACTION' then
    select coalesce(jsonb_agg(jsonb_build_object('player_id',player_id,'fields',jsonb_build_array('act4_choice_id','act4_locked_at','act4_response_duration_ms'))),'[]') into scope from public.s3b_player_progress where run_id=g.run_id and act4_choice_id is null;
    insert into public.teacher_overrides values(o,g.run_id,s.scene_id,s.phase_key,s.step_key,p_override_action,null,'teacher_override',trim(p_reason),scope,false,now());
    insert into public.teacher_override_validity(override_id,run_id,player_id,semantic_field,value)
    select o,g.run_id,player_id,f,null from public.s3b_player_progress cross join unnest(array['act4_choice_id','act4_locked_at','act4_response_duration_ms']) f where run_id=g.run_id and act4_choice_id is null;
    update public.s3b_player_progress set act4_timing_validity='invalid_teacher_override' where run_id=g.run_id and act4_choice_id is null;
    insert into public.discussion_sessions(run_id,scene_id,phase_key,step_key,round_no,vote_round,topic,phase_deadline,show_initial_choices,require_final_vote,vote_options,tie_policy,revote_window_sec,max_revotes,fallback_resolution,discussion_time_limit_sec,vote_time_limit_sec,silent_texting_mode)
    values(g.run_id,'act5_route_discussion','discussion','route_choice',1,1,'act04-05.010',now()+interval '150 seconds',true,true,'[{"id":"known"},{"id":"unknown"},{"id":"inspect_first"}]','SINGLE_REVOTE_THEN_FALLBACK',30,1,'inspect_first',150,120,false);
    perform public.s3b_set_scene(g.run_id,'act5_route_discussion','discussion','route_choice','ACTION_SCREEN','act04-05.009');
  elsif s.scene_id='act5_route_discussion' and s.phase_key='discussion' and p_override_action='RESOLVE_AND_CONTINUE' then
    resolution:='inspect_first';
    insert into public.teacher_overrides values(o,g.run_id,s.scene_id,s.phase_key,s.step_key,p_override_action,resolution,'teacher_override',trim(p_reason),scope,false,now());
    select * into d from public.discussion_sessions where run_id=g.run_id and scene_id=s.scene_id order by started_at desc limit 1 for update;
    update public.discussion_sessions set status='resolved',outcome=jsonb_build_object('choice_id',resolution,'resolution_source','teacher_override','override_id',o),ended_at=now() where discussion_session_id=d.discussion_session_id;
    update public.s3b_run_state set unknown_passage_inspected=true,pending_post_inspection_route=true,group_route=null,terminal_state=null,updated_at=now() where run_id=g.run_id;
    perform public.s3b_set_scene(g.run_id,'act5_inspect_first','post_inspection_route','inspect_sequence','CRITICAL_INFO','act04-05.015');
  elsif s.scene_id='act5_inspect_first' and s.phase_key='post_inspection_route' and p_override_action='RESOLVE_AND_CONTINUE' then
    resolution:='known';
    insert into public.teacher_overrides values(o,g.run_id,s.scene_id,s.phase_key,s.step_key,p_override_action,resolution,'teacher_override',trim(p_reason),scope,false,now());
    update public.s3b_run_state set group_route=resolution,pending_post_inspection_route=false,terminal_state='SPRINT3B_COMPLETE',updated_at=now() where run_id=g.run_id;
    perform public.s3b_set_scene(g.run_id,'act5_route_resolved','terminal',resolution,'CINEMATIC_MESSAGE','act04-05.019');
  else raise exception 'Override action is unsupported for the current interaction.';
  end if;
  insert into public.runtime_events(run_id,room_code,event_type,details,scene_id,phase_key,step_key,event_source,validity,behavior_scoring,interaction_id)
  values(g.run_id,room,'teacher_override',jsonb_build_object('override_action',p_override_action,'applied_resolution',resolution,'reason',trim(p_reason),'invalidated_scope',scope),s.scene_id,s.phase_key,s.step_key,'teacher_override','valid',false,o);
  update public.game_runs set active_override_id=o where run_id=g.run_id;
  return jsonb_build_object('ok',true,'override_id',o,'override_action',p_override_action,'source_scene',s.scene_id,'source_phase',s.phase_key,'source_step',s.step_key,'applied_resolution',resolution,'invalidated_scope',scope,'created_at',now());
exception when unique_violation then raise exception 'Current interaction was already overridden.';
end$$;

alter function public.s2_get_teacher_state(text,text) rename to s2_get_teacher_state_v053;
revoke all on function public.s2_get_teacher_state_v053(text,text) from public,anon,authenticated;
create function public.s2_get_teacher_state(p_room_code text,p_teacher_token text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare result jsonb;s public.s3_runtime_scene_state%rowtype;g public.game_runs%rowtype;actions jsonb:='[]';
begin
 result:=public.s2_get_teacher_state_v053(p_room_code,p_teacher_token);g:=public.s2_get_active_run(upper(trim(p_room_code)));if g.run_id is null then return result;end if;
 select * into s from public.s3_runtime_scene_state where run_id=g.run_id;
 actions:=case
  when (s.scene_id,s.phase_key) in(('act1_wake_up','private_first_action'),('act2_first_contact','private_first_meeting'),('act2_route_update','route_update'),('act2_rendezvous','route_consequence'),('act3_library','wayfinding'),('act4_known_unknown','private_route_choice')) then '["SKIP_CURRENT_INTERACTION"]'::jsonb
  when (s.scene_id,s.phase_key) in(('act2_first_contact','meeting_discussion'),('act3_library','library_box'),('act5_route_discussion','discussion'),('act5_inspect_first','post_inspection_route')) then '["RESOLVE_AND_CONTINUE"]'::jsonb else '[]'::jsonb end;
 return jsonb_set(result,'{teacher_override,allowed_actions}',actions,true);
end$$;

alter function public.s8_verify_integrity(uuid) rename to s8_verify_integrity_v053;
revoke all on function public.s8_verify_integrity_v053(uuid) from public,anon,authenticated;
create function public.s8_verify_integrity(p_run_id uuid)
returns jsonb language plpgsql stable security definer set search_path=public as $$
declare report jsonb;r public.s3b_run_state%rowtype;s5 public.s5_run_state%rowtype;s6 public.s6_run_state%rowtype;e jsonb;ok boolean;winner text;direct_route text;n int;
begin
 report:=public.s8_verify_integrity_v053(p_run_id);select * into r from public.s3b_run_state where run_id=p_run_id;select * into s5 from public.s5_run_state where run_id=p_run_id;select * into s6 from public.s6_run_state where run_id=p_run_id;
 -- Canonical ACT3 game-track override is authoritative evidence, never a player attempt.
 if r.puzzle_resolved_at is not null and exists(select 1 from public.teacher_overrides where run_id=p_run_id and source_scene='act3_library' and source_phase='library_box' and override_action='RESOLVE_AND_CONTINUE' and applied_resolution='41739') then
  report:=jsonb_set(report,'{obligations,act3.puzzle_resolution}',jsonb_build_object('state','present','evidence_identity',jsonb_build_object('resolution_source','teacher_override','player_attempts',0)),true);
 end if;
 select jsonb_build_object('state','present','evidence_identity',jsonb_build_object('authoritative_result',r.final_meeting_result,'resolution_source',coalesce(d.outcome->>'resolution_source','player_majority'),'discussion_session_id',d.discussion_session_id)) into e
 from public.discussion_sessions d where d.run_id=p_run_id and d.scene_id='act2_first_contact' and d.phase_key='meeting_discussion' and d.status='resolved' and d.outcome->>'choice_id'=r.final_meeting_result order by d.ended_at desc limit 1;
 report:=jsonb_set(report,'{obligations,act2.meeting_resolution}',coalesce(e,jsonb_build_object('state','missing_technical_evidence','reason_code','act2_authoritative_outcome_mismatch')),true);
 select min(choice_id) into direct_route from public.s5_act8_private_choices where run_id=p_run_id having count(*)=3 and count(distinct choice_id)=1;
 if direct_route is not null and direct_route is distinct from s5.route_taken_act8 then
  report:=jsonb_set(report,'{obligations,act8.final_vote}',jsonb_build_object('state','missing_technical_evidence','reason_code','act8_authoritative_outcome_mismatch'),true);
 elsif s5.route_taken_act8 is not null and direct_route is null then
  select choice_id,count(*) into winner,n from public.s5_votes where run_id=p_run_id and phase_key='act8_final_vote' group by choice_id order by count(*) desc,choice_id limit 1;
  if winner is null or n<2 or winner<>s5.route_taken_act8 then report:=jsonb_set(report,'{obligations,act8.final_vote}',jsonb_build_object('state','missing_technical_evidence','reason_code','act8_authoritative_outcome_mismatch'),true);end if;
 end if;
 select choice_id,count(*) into winner,n from public.s6_choices where run_id=p_run_id and phase_key='act10_final_vote' and round_no=(select max(round_no) from public.s6_choices where run_id=p_run_id and phase_key='act10_final_vote') group by choice_id order by count(*) desc,choice_id limit 1;
 if winner is null or n<2 or (winner='take') is distinct from s6.gold_key then report:=jsonb_set(report,'{obligations,act10.final_vote}',jsonb_build_object('state','missing_technical_evidence','reason_code','act10_authoritative_outcome_mismatch'),true);end if;
 select not exists(select 1 from jsonb_each(report->'obligations')x where x.value->>'state'='missing_technical_evidence') into ok;
 return jsonb_set(report,'{verified}',to_jsonb(ok),false);
end$$;

create or replace function public.s8_latest_completed_run(p_room_code text)
returns public.game_runs language sql stable security definer set search_path=public as $$
 select r.* from public.game_runs r where r.room_code=upper(trim(p_room_code)) and r.status='completed' and r.game_completed and r.export_ready and r.session_integrity_verified
 and (nullif(current_setting('app.s8_export_run_id',true),'') is null or r.run_id=nullif(current_setting('app.s8_export_run_id',true),'')::uuid)
 order by r.completed_at desc nulls last,r.run_started_at desc limit 1
$$;

alter function public.s8_get_finalization_state(text,text) rename to s8_get_finalization_state_v053;
revoke all on function public.s8_get_finalization_state_v053(text,text) from public,anon,authenticated;
create function public.s8_get_finalization_state(p_room_code text,p_teacher_token text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare room text:=upper(trim(p_room_code));result jsonb;runs jsonb;
begin
 result:=public.s8_get_finalization_state_v053(p_room_code,p_teacher_token);
 select coalesce(jsonb_agg(jsonb_build_object('run_id',g.run_id,'run_started_at',g.run_started_at,'completed_at',g.completed_at,'run_mode',g.run_mode,'export_ready',g.export_ready,'json_filename',to_char(g.run_started_at at time zone 'UTC','YYYY-MM-DD_HH24-MI-SS')||'_'||g.run_id||case when g.run_mode='audit' then '_audit' else '' end||'.json') order by g.completed_at desc),'[]'::jsonb) into runs
 from public.game_runs g where g.room_code=room and g.status='completed' and g.game_completed and g.export_ready and g.session_integrity_verified;
 return result||jsonb_build_object('completed_runs',runs);
end$$;

alter function public.s8_export_session(text,text) rename to s8_export_session_v053;
revoke all on function public.s8_export_session_v053(text,text) from public,anon,authenticated;
create function public.s8_export_session(p_room_code text,p_teacher_token text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare result jsonb;begin result:=public.s8_export_session_v053(p_room_code,p_teacher_token);return jsonb_set(result,'{json,header,exported_at}',to_jsonb(clock_timestamp()),true);end$$;
create function public.s8_export_session(p_room_code text,p_teacher_token text,p_run_id uuid)
returns jsonb language plpgsql security definer set search_path=public as $$
begin
 perform public.s1_assert_teacher(upper(trim(p_room_code)),p_teacher_token);
 if not exists(select 1 from public.game_runs where run_id=p_run_id and room_code=upper(trim(p_room_code)) and status='completed' and export_ready and session_integrity_verified) then raise exception 'Requested session export is not ready.';end if;
 perform set_config('app.s8_export_run_id',p_run_id::text,true);
 return public.s8_export_session(p_room_code,p_teacher_token);
end$$;

revoke all on function public.teacher_apply_override(text,text,text,text),public.s2_get_teacher_state(text,text),public.s8_verify_integrity(uuid),public.s8_latest_completed_run(text),public.s8_get_finalization_state(text,text),public.s8_export_session(text,text),public.s8_export_session(text,text,uuid) from public;
grant execute on function public.teacher_apply_override(text,text,text,text),public.s2_get_teacher_state(text,text),public.s8_get_finalization_state(text,text),public.s8_export_session(text,text),public.s8_export_session(text,text,uuid) to anon,authenticated;
commit;
