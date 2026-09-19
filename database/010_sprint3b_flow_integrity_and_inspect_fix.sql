-- Sprint 3B audit corrections: authoritative phase guards, idempotent fold-back,
-- and Inspect First as an intermediate Game Track state.
-- Apply after 009_sprint3b_act1_consequence_integrity.sql.

alter table public.s3b_run_state
  add column if not exists pending_post_inspection_route boolean not null default false;

create or replace function public.s3b_guard_player_progress_phase()
returns trigger language plpgsql security definer set search_path=public as $$
declare v_scene public.s3_runtime_scene_state%rowtype;
begin
  select * into strict v_scene from public.s3_runtime_scene_state where run_id=new.run_id;
  if old.act1_choice_id is null and new.act1_choice_id is not null and not (v_scene.scene_id='act1_wake_up' and v_scene.phase_key='private_first_action') then raise exception 'ACT 1 choice is out of phase.'; end if;
  if old.first_meeting_choice is null and new.first_meeting_choice is not null and not (v_scene.scene_id='act2_first_contact' and v_scene.phase_key='private_first_meeting') then raise exception 'ACT 2 first meeting choice is out of phase.'; end if;
  if not old.grab_complete and new.grab_complete and not (v_scene.scene_id='act2_first_contact' and v_scene.phase_key='private_first_meeting') then raise exception 'GRAB is out of phase.'; end if;
  if not old.left_start_room and new.left_start_room and not (v_scene.scene_id='act2_first_contact' and v_scene.phase_key='private_first_meeting') then raise exception 'Leaving the start room is out of phase.'; end if;
  if old.player_location is distinct from new.player_location and new.player_location='library' and not (v_scene.scene_id='act3_library' and v_scene.phase_key='wayfinding') then raise exception 'FOLLOW SIGN is out of phase.'; end if;
  if old.act4_choice_id is null and new.act4_choice_id is not null and not (v_scene.scene_id='act4_known_unknown' and v_scene.phase_key='private_route_choice') then raise exception 'ACT 4 choice is out of phase.'; end if;
  return new;
end; $$;
drop trigger if exists s3b_player_progress_phase_guard on public.s3b_player_progress;
create trigger s3b_player_progress_phase_guard before update on public.s3b_player_progress
for each row execute function public.s3b_guard_player_progress_phase();

create or replace function public.s3b_guard_run_state_phase()
returns trigger language plpgsql security definer set search_path=public as $$
declare v_scene public.s3_runtime_scene_state%rowtype;
begin
  select * into strict v_scene from public.s3_runtime_scene_state where run_id=new.run_id;
  if old.final_meeting_result is null and new.final_meeting_result is not null and not (v_scene.scene_id='act2_first_contact' and v_scene.phase_key='meeting_discussion') then raise exception 'Meeting resolution is out of phase.'; end if;
  if not old.party_physically_reunited and new.party_physically_reunited and not (v_scene.scene_id='act3_library' and v_scene.phase_key='wayfinding') then raise exception 'Party reunion is out of phase.'; end if;
  if (old.puzzle_attempt_number is distinct from new.puzzle_attempt_number or old.puzzle_hint_stage is distinct from new.puzzle_hint_stage or old.puzzle_resolved_at is distinct from new.puzzle_resolved_at)
    and not (v_scene.scene_id='act3_library' and v_scene.phase_key='library_box') then raise exception 'Library Box mutation is out of phase.'; end if;
  if old.group_route is distinct from new.group_route and new.group_route is not null
    and v_scene.scene_id not in ('act4_known_unknown','act5_route_discussion','act5_inspect_first') then raise exception 'Group route mutation is out of phase.'; end if;
  return new;
end; $$;
drop trigger if exists s3b_run_state_phase_guard on public.s3b_run_state;
create trigger s3b_run_state_phase_guard before update on public.s3b_run_state
for each row execute function public.s3b_guard_run_state_phase();

create or replace function public.s3b_guard_library_attempt_phase()
returns trigger language plpgsql security definer set search_path=public as $$
begin
  if not exists(select 1 from public.s3_runtime_scene_state where run_id=new.run_id and scene_id='act3_library' and phase_key='library_box') then raise exception 'Library Box attempt is out of phase.'; end if;
  return new;
end; $$;
drop trigger if exists s3b_library_attempt_phase_guard on public.s3b_library_attempts;
create trigger s3b_library_attempt_phase_guard before insert on public.s3b_library_attempts
for each row execute function public.s3b_guard_library_attempt_phase();

create or replace function public.s3b_apply_act5_resolution(p_room_code text,p_session_token text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare v_room text:=upper(trim(p_room_code)); v_player public.s1_room_players%rowtype; v_run public.game_runs%rowtype; v_out jsonb; v_route text; v_scene public.s3_runtime_scene_state%rowtype;
begin
  v_player:=public.s1_get_player_by_session(v_room,p_session_token); v_run:=public.s2_get_active_run(v_room);
  select * into strict v_scene from public.s3_runtime_scene_state where run_id=v_run.run_id for update;
  if not (v_scene.scene_id='act5_route_discussion' and v_scene.phase_key='discussion') then raise exception 'ACT 5 resolution is out of phase.'; end if;
  select outcome into v_out from public.discussion_sessions where run_id=v_run.run_id and scene_id='act5_route_discussion' and status='resolved' order by vote_round desc limit 1;
  if v_out is null then raise exception 'ACT 5 route vote is not resolved.'; end if;
  v_route:=coalesce(v_out->>'choice_id',v_out->>'resolution_id');
  if v_route='inspect_first' then
    update public.s3b_run_state set unknown_passage_inspected=true,pending_post_inspection_route=true,group_route=null,terminal_state=null,updated_at=now() where run_id=v_run.run_id;
    perform public.s3b_set_scene(v_run.run_id,'act5_inspect_first','post_inspection_route','inspect_sequence','CRITICAL_INFO','act04-05.015');
    return jsonb_build_object('ok',true,'intermediate','inspect_first','terminal_state',null);
  end if;
  if v_route not in ('known','unknown') then raise exception 'Invalid ACT 5 resolution.'; end if;
  update public.s3b_run_state set group_route=v_route,pending_post_inspection_route=false,terminal_state='SPRINT3B_COMPLETE',updated_at=now() where run_id=v_run.run_id;
  perform public.s3b_set_scene(v_run.run_id,'act5_route_resolved','terminal',v_route,'CINEMATIC_MESSAGE',case v_route when 'known' then 'act04-05.019' else 'act04-05.024' end);
  return jsonb_build_object('ok',true,'group_route',v_route,'terminal_state','SPRINT3B_COMPLETE');
end; $$;

create or replace function public.s3b_choose_post_inspection_route(p_room_code text,p_session_token text,p_route text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare v_room text:=upper(trim(p_room_code)); v_player public.s1_room_players%rowtype; v_run public.game_runs%rowtype; v_scene public.s3_runtime_scene_state%rowtype;
begin
  if p_route not in ('known','unknown') then raise exception 'Post-inspection route must be known or unknown.'; end if;
  v_player:=public.s1_get_player_by_session(v_room,p_session_token); v_run:=public.s2_get_active_run(v_room);
  select * into strict v_scene from public.s3_runtime_scene_state where run_id=v_run.run_id for update;
  if not (v_scene.scene_id='act5_inspect_first' and v_scene.phase_key='post_inspection_route') then raise exception 'Post-inspection route is out of phase.'; end if;
  update public.s3b_run_state set group_route=p_route,pending_post_inspection_route=false,terminal_state='SPRINT3B_COMPLETE',updated_at=now()
    where run_id=v_run.run_id and pending_post_inspection_route and group_route is null;
  if not found then raise exception 'Post-inspection route is already resolved.'; end if;
  perform public.s2_log_event(v_run.run_id,v_room,null,'post_inspection_group_route',null,jsonb_build_object('route',p_route,'behavior_scoring',false,'submitted_by',v_player.player_id));
  perform public.s3b_set_scene(v_run.run_id,'act5_route_resolved','terminal',p_route,'CINEMATIC_MESSAGE',case p_route when 'known' then 'act04-05.019' else 'act04-05.024' end);
  return jsonb_build_object('ok',true,'group_route',p_route,'terminal_state','SPRINT3B_COMPLETE');
end; $$;

create or replace function public.s3b_complete_foldback(p_room_code text,p_session_token text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare v_room text:=upper(trim(p_room_code)); v_player public.s1_room_players%rowtype; v_run public.game_runs%rowtype; v_result text; v_scene public.s3_runtime_scene_state%rowtype;
begin
  v_player:=public.s1_get_player_by_session(v_room,p_session_token); v_run:=public.s2_get_active_run(v_room);
  select * into strict v_scene from public.s3_runtime_scene_state where run_id=v_run.run_id for update;
  if not (v_scene.scene_id='act2_rendezvous' and v_scene.phase_key='route_consequence') then raise exception 'Fold-back is out of phase or already complete.'; end if;
  select final_meeting_result into v_result from public.s3b_run_state where run_id=v_run.run_id for update;
  if v_result is null then raise exception 'Meeting route is unresolved.'; end if;
  if v_result<>'library' then
    update public.s3b_run_state set failed_rendezvous_completed=true,updated_at=now() where run_id=v_run.run_id and not failed_rendezvous_completed;
    if found then perform public.s2_log_event(v_run.run_id,v_room,null,'failed_rendezvous',null,jsonb_build_object('route',v_result,'behavior_scoring',false)); end if;
  end if;
  update public.s3_runtime_scene_state set current_route_target='library',wayfinding_target='library',updated_at=now() where run_id=v_run.run_id;
  perform public.s3b_set_scene(v_run.run_id,'act3_library','wayfinding','follow_sign','ACTION_SCREEN','act03.001');
  return jsonb_build_object('ok',true,'final_meeting_result',v_result,'current_route_target','library');
end; $$;

revoke execute on function public.s3b_guard_player_progress_phase(),public.s3b_guard_run_state_phase(),public.s3b_guard_library_attempt_phase() from public,anon,authenticated;
grant execute on function public.s3b_choose_post_inspection_route(text,text,text) to anon,authenticated;
