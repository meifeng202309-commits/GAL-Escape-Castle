-- Sprint 3B third narrow correction. Apply after migration 011.

-- Renaming a function preserves its privileges. These deployed implementations
-- are internal wrapper targets and must never remain callable through PostgREST.
revoke execute on function public.s3b_initialize_flow_pre011(text,text) from public,anon,authenticated;
revoke execute on function public.s3b_submit_first_meeting_pre011(text,text,text) from public,anon,authenticated;
revoke execute on function public.s3b_grab_pre011(text,text) from public,anon,authenticated;
revoke execute on function public.s3b_leave_start_room_pre011(text,text) from public,anon,authenticated;
revoke execute on function public.s3b_apply_meeting_resolution_pre011(text,text) from public,anon,authenticated;
revoke execute on function public.s3b_complete_foldback_pre011(text,text) from public,anon,authenticated;
revoke execute on function public.s3b_follow_sign_pre011(text,text) from public,anon,authenticated;
revoke execute on function public.s3b_submit_library_code_pre011(text,text,text) from public,anon,authenticated;
revoke execute on function public.s3b_submit_act4_choice_pre011(text,text,text) from public,anon,authenticated;
revoke execute on function public.s3b_apply_act5_resolution_pre011(text,text) from public,anon,authenticated;
revoke execute on function public.s3b_choose_post_inspection_route_pre011(text,text,text) from public,anon,authenticated;
revoke execute on function public.s3b_get_player_state_pre011(text,text) from public,anon,authenticated;

alter table public.s3b_player_progress
  add column if not exists route_update_ack_at timestamptz;

create or replace function public.s3b_ack_route_update(p_room_code text,p_session_token text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare
  v_room text:=upper(trim(p_room_code));
  v_player public.s1_room_players%rowtype;
  v_run public.game_runs%rowtype;
  v_route text;
  v_text_key text;
  v_ack_count integer;
begin
  v_player:=public.s1_get_player_by_session(v_room,p_session_token);
  v_run:=public.s2_get_active_run(v_room);
  perform 1 from public.game_runs where run_id=v_run.run_id for update;

  if not exists(
    select 1 from public.s3_runtime_scene_state
    where run_id=v_run.run_id and scene_id='act2_route_update' and phase_key='route_update'
  ) then
    raise exception 'Route-update transition is unavailable.';
  end if;

  update public.s3b_player_progress
  set route_update_ack_at=now()
  where run_id=v_run.run_id and player_id=v_player.player_id and route_update_ack_at is null;
  if not found then
    raise exception 'Route update is already acknowledged for this player.';
  end if;

  select count(*) into v_ack_count
  from public.s3b_player_progress
  where run_id=v_run.run_id and route_update_ack_at is not null;

  select final_meeting_result into v_route
  from public.s3b_run_state where run_id=v_run.run_id;

  if v_ack_count=3 then
    v_text_key:=case v_route
      when 'library' then 'act03.001'
      when 'great_hall' then 'act02.038'
      when 'main_gate' then 'act02.043'
      when 'west_tower' then 'act02.046'
      else 'act02.049'
    end;
    perform public.s3b_set_scene(v_run.run_id,'act2_rendezvous','route_consequence',v_route,'CINEMATIC_MESSAGE',v_text_key);
  end if;

  return jsonb_build_object(
    'ok',true,
    'route',v_route,
    'ack_count',v_ack_count,
    'all_acknowledged',v_ack_count=3
  );
end; $$;

grant execute on function public.s3b_ack_route_update(text,text) to anon,authenticated;
