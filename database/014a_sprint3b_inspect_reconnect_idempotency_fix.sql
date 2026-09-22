-- Sprint 3B post-deployment correction for 013/014.
-- A completed post-inspection majority route remains a valid idempotent
-- continuation of the previously applied inspect_first discussion result.

create or replace function public.s3b_apply_resolved_discussion_internal(
  p_run_id uuid,
  p_discussion_session_id uuid
) returns jsonb
language plpgsql security definer set search_path=public as $$
declare
  v_run public.game_runs%rowtype;
  v_session public.discussion_sessions%rowtype;
  v_state public.s3b_run_state%rowtype;
  v_result text;
  v_applied boolean:=false;
begin
  select * into v_run from public.game_runs where run_id=p_run_id for update;
  if not found then raise exception 'Formal run not found.'; end if;

  select * into v_session from public.discussion_sessions
  where discussion_session_id=p_discussion_session_id and run_id=p_run_id
  for update;
  if not found or v_session.status<>'resolved' then
    return jsonb_build_object('applied',false,'reason','not_resolved');
  end if;

  v_result:=coalesce(v_session.outcome->>'choice_id',v_session.outcome->>'resolution_id');
  if v_result is null then
    return jsonb_build_object('applied',false,'reason','no_resolution');
  end if;

  select * into v_state from public.s3b_run_state where run_id=p_run_id for update;
  if not found then
    return jsonb_build_object('applied',false,'reason','not_sprint3b');
  end if;

  if v_session.scene_id='act2_first_contact' then
    if v_result not in ('library','great_hall','main_gate','west_tower','chapel') then
      raise exception 'Invalid ACT 2 meeting resolution.';
    end if;
    if v_state.final_meeting_result is not null then
      if v_state.final_meeting_result<>v_result then
        raise exception 'ACT 2 meeting resolution conflicts with applied Game Track state.';
      end if;
      return jsonb_build_object('applied',false,'reason','already_applied','result',v_result);
    end if;
    update public.s3b_run_state
    set final_meeting_result=v_result,updated_at=now()
    where run_id=p_run_id and final_meeting_result is null;
    update public.s3_runtime_scene_state
    set current_route_target=v_result,
        wayfinding_target=case when v_result='library' then 'library' end,
        updated_at=now()
    where run_id=p_run_id;
    perform public.s3b_set_scene(
      p_run_id,'act2_route_update','route_update',v_result,
      'CRITICAL_INFO','act02.032'
    );
    v_applied:=true;
  elsif v_session.scene_id='act5_route_discussion' then
    if v_result not in ('known','unknown','inspect_first') then
      raise exception 'Invalid ACT 5 route resolution.';
    end if;
    if v_state.group_route is not null or v_state.pending_post_inspection_route then
      if v_result='inspect_first' and v_state.unknown_passage_inspected then
        return jsonb_build_object('applied',false,'reason','already_applied','result',v_result);
      elsif v_state.group_route=v_result then
        return jsonb_build_object('applied',false,'reason','already_applied','result',v_result);
      end if;
      raise exception 'ACT 5 resolution conflicts with applied Game Track state.';
    end if;
    if v_result='inspect_first' then
      update public.s3b_run_state
      set unknown_passage_inspected=true,pending_post_inspection_route=true,
          group_route=null,terminal_state=null,updated_at=now()
      where run_id=p_run_id;
      perform public.s3b_set_scene(
        p_run_id,'act5_inspect_first','post_inspection_route','inspect_sequence',
        'CRITICAL_INFO','act04-05.015'
      );
    else
      update public.s3b_run_state
      set group_route=v_result,pending_post_inspection_route=false,
          terminal_state='SPRINT3B_COMPLETE',updated_at=now()
      where run_id=p_run_id;
      perform public.s3b_set_scene(
        p_run_id,'act5_route_resolved','terminal',v_result,
        'CINEMATIC_MESSAGE',case v_result when 'known' then 'act04-05.019' else 'act04-05.024' end
      );
    end if;
    v_applied:=true;
  end if;

  if v_applied then
    perform public.s2_log_event(
      p_run_id,v_run.room_code,p_discussion_session_id,
      's3b_discussion_resolution_applied',null,
      jsonb_build_object(
        'scene_id',v_session.scene_id,
        'phase_key',v_session.phase_key,
        'step_key',v_session.step_key,
        'resolution_id',v_result,
        'resolution_source',coalesce(v_session.outcome->>'resolution_source','player_majority'),
        'behavior_scoring',false
      )
    );
  end if;
  return jsonb_build_object('applied',v_applied,'result',v_result);
end;
$$;

revoke execute on function public.s3b_apply_resolved_discussion_internal(uuid,uuid)
  from public,anon,authenticated;
