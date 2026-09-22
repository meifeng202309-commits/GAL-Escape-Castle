-- Sprint 3C Level 1 narrow corrections: canonical ACT1 completion and
-- upstream Teacher Override provenance across the legacy event logger.

alter function public.teacher_apply_override(text,text,text,text)
  rename to teacher_apply_override_pre016;

revoke execute on function public.teacher_apply_override_pre016(text,text,text,text)
  from public,anon,authenticated;

create function public.teacher_apply_override(
  p_room_code text,p_teacher_token text,p_override_action text,p_reason text
) returns jsonb language plpgsql security definer set search_path=public as $$
declare
  v_result jsonb;
  v_run_id uuid;
begin
  v_result:=public.teacher_apply_override_pre016(
    p_room_code,p_teacher_token,p_override_action,p_reason
  );
  if v_result->>'source_scene'='act1_wake_up'
     and v_result->>'source_phase'='private_first_action'
     and v_result->>'override_action'='SKIP_CURRENT_INTERACTION' then
    select run_id into v_run_id from public.game_runs
    where room_code=upper(trim(p_room_code)) and status='active';
    update public.s3b_player_progress set act1_stage='complete'
    where run_id=v_run_id and act1_stage<>'complete';
  end if;
  return v_result;
end;
$$;

grant execute on function public.teacher_apply_override(text,text,text,text)
  to anon,authenticated;

create or replace function public.s2_log_event(
  p_run_id uuid,p_room_code text,p_discussion_session_id uuid,p_event_type text,
  p_actor_player_id uuid,p_details jsonb default '{}'::jsonb
) returns void language plpgsql security definer set search_path=public as $$
declare
  v_scene text;
  v_phase text;
  v_step text;
  v_override public.teacher_overrides%rowtype;
  v_details jsonb:=coalesce(p_details,'{}'::jsonb);
begin
  if p_discussion_session_id is not null then
    select scene_id,phase_key,step_key into v_scene,v_phase,v_step
    from public.discussion_sessions
    where discussion_session_id=p_discussion_session_id;
  end if;
  if v_scene is null then
    select scene_id,phase_key,step_key into v_scene,v_phase,v_step
    from public.s3_runtime_scene_state where run_id=p_run_id;
  end if;
  select o.* into v_override from public.game_runs g
  join public.teacher_overrides o on o.override_id=g.active_override_id
  where g.run_id=p_run_id;
  if v_override.override_id is not null then
    v_details:=v_details||jsonb_build_object(
      'context_provenance',jsonb_build_object(
        'upstream_teacher_override',true,'override_id',v_override.override_id,
        'source_scene',v_override.source_scene,'source_phase',v_override.source_phase,
        'override_action',v_override.override_action));
  end if;
  insert into public.runtime_events(
    run_id,room_code,discussion_session_id,event_type,actor_player_id,details,
    scene_id,phase_key,step_key,event_source,validity,behavior_scoring,interaction_id,
    client_request_id
  ) values(
    p_run_id,upper(trim(p_room_code)),p_discussion_session_id,p_event_type,
    p_actor_player_id,v_details,v_scene,v_phase,v_step,
    case when p_actor_player_id is null then 'server' else 'player' end,
    coalesce(p_details->>'validity','valid'),
    case when p_details ? 'behavior_scoring' then (p_details->>'behavior_scoring')::boolean end,
    p_discussion_session_id,
    case when p_details ? 'client_request_id' then (p_details->>'client_request_id')::uuid end);
end;
$$;

revoke execute on function public.s2_log_event(uuid,text,uuid,text,uuid,jsonb)
  from public,anon,authenticated;
