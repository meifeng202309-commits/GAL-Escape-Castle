-- Sprint 3B audit corrections: authoritative phase guards, idempotent fold-back,
-- and Inspect First as an intermediate Game Track state.
-- Apply after 009_sprint3b_act1_consequence_integrity.sql.

alter table public.s3b_run_state
  add column if not exists pending_post_inspection_route boolean not null default false;
alter table public.s3b_run_state drop constraint if exists s3b_run_state_puzzle_hint_stage_check;
alter table public.s3b_run_state add constraint s3b_run_state_puzzle_hint_stage_check check(puzzle_hint_stage between 0 and 8);

update public.s3_item_catalog set name_text_key=case item_key
  when 'gitte_castle_map' then 'item.castle_map'
  when 'gitte_number_note' then 'item.number_note'
  when 'gitte_flashlight' then 'item.flashlight'
  when 'anna_servant_diary' then 'item.servant_diary'
  when 'linda_stopped_watch' then 'item.stopped_watch'
  when 'linda_star_key' then 'item.silver_star_key'
  when 'linda_closure_order' then 'item.municipal_closure_order'
  when 'library_photo_1897' then 'item.photo_1897'
  when 'library_torn_note' then 'item.torn_note'
  else name_text_key end
where item_key in ('gitte_castle_map','gitte_number_note','gitte_flashlight','anna_servant_diary','linda_stopped_watch','linda_star_key','linda_closure_order','library_photo_1897','library_torn_note');

update public.s3_group_items set label_text_key=case item_key when 'library_photo_1897' then 'item.photo_1897' when 'library_torn_note' then 'item.torn_note' else label_text_key end
where item_key in ('library_photo_1897','library_torn_note');

create or replace function public.s3b_canonicalize_group_item_label()
returns trigger language plpgsql security definer set search_path=public as $$
begin
  if new.item_key='library_photo_1897' then new.label_text_key:='item.photo_1897';
  elsif new.item_key='library_torn_note' then new.label_text_key:='item.torn_note'; end if;
  return new;
end; $$;
drop trigger if exists s3b_group_item_label_guard on public.s3_group_items;
create trigger s3b_group_item_label_guard before insert or update on public.s3_group_items
for each row execute function public.s3b_canonicalize_group_item_label();

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

create or replace function public.s3b_refresh_puzzle(p_run uuid)
returns void language plpgsql security definer set search_path=public as $$
declare v_state public.s3b_run_state%rowtype; v_target int; v_stage int; v_room text; v_key text;
begin
  select * into v_state from public.s3b_run_state where run_id=p_run for update;
  if not found or v_state.puzzle_resolved_at is not null or v_state.puzzle_deadline is null or now()<v_state.puzzle_deadline then return; end if;
  v_target:=least(8,4+floor(extract(epoch from (now()-v_state.puzzle_deadline))/15)::int);
  select room_code into strict v_room from public.game_runs where run_id=p_run;
  for v_stage in v_state.puzzle_hint_stage+1..v_target loop
    if v_stage<4 then continue; end if;
    v_key:=case v_stage when 4 then 'act03.014' when 5 then 'act03.017' when 6 then 'act03.018' when 7 then 'act03.019' else 'act03.020' end;
    update public.s3b_run_state set puzzle_hint_stage=v_stage,updated_at=now() where run_id=p_run;
    perform public.s2_log_event(p_run,v_room,null,'puzzle_fallback_hint',null,jsonb_build_object('hint_stage',v_stage,'text_key',v_key,'resolution_source','system_fallback','escape_penalty_event','puzzle_hint_used','behavior_scoring',false));
  end loop;
  if v_target=8 then
    update public.s3b_run_state set puzzle_resolved_at=coalesce(puzzle_resolved_at,now()),updated_at=now() where run_id=p_run;
    insert into public.s3_group_items(run_id,item_key,label_text_key) values(p_run,'library_photo_1897','item.photo_1897'),(p_run,'library_torn_note','item.torn_note') on conflict do nothing;
    perform public.s2_log_event(p_run,v_room,null,'puzzle_resolved_system_fallback',null,jsonb_build_object('resolution_source','system_fallback','behavior_scoring',false,'text_key','act03.015'));
    perform public.s3b_set_scene(p_run,'act4_known_unknown','private_route_choice','initial','ACTION_SCREEN','act03.015');
  end if;
end; $$;

create or replace function public.s3b_audit_set_puzzle_elapsed(p_room_code text,p_teacher_token text,p_elapsed_seconds integer)
returns jsonb language plpgsql security definer set search_path=public as $$
declare v_room text:=upper(trim(p_room_code)); v_run public.game_runs%rowtype;
begin
  perform public.s1_assert_teacher(v_room,p_teacher_token); v_run:=public.s2_get_active_run(v_room);
  if v_run.run_mode<>'audit' then raise exception 'Puzzle elapsed-time probe is restricted to AUDIT runs.'; end if;
  if p_elapsed_seconds not between 0 and 600 then raise exception 'Invalid audit elapsed seconds.'; end if;
  update public.s3b_run_state set puzzle_started_at=now()-make_interval(secs=>p_elapsed_seconds),puzzle_deadline=now()-make_interval(secs=>greatest(0,p_elapsed_seconds-90)) where run_id=v_run.run_id and puzzle_resolved_at is null;
  perform public.s3b_refresh_puzzle(v_run.run_id);
  return (select jsonb_build_object('ok',true,'hint_stage',puzzle_hint_stage,'attempt_number',puzzle_attempt_number,'resolved',puzzle_resolved_at is not null) from public.s3b_run_state where run_id=v_run.run_id);
end; $$;

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

revoke execute on function public.s3b_guard_player_progress_phase(),public.s3b_guard_run_state_phase(),public.s3b_guard_library_attempt_phase(),public.s3b_canonicalize_group_item_label() from public,anon,authenticated;
grant execute on function public.s3b_choose_post_inspection_route(text,text,text) to anon,authenticated;
grant execute on function public.s3b_audit_set_puzzle_elapsed(text,text,integer) to anon,authenticated;
