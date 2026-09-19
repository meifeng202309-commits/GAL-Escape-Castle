-- Sprint 3B second re-audit corrections. Apply after migration 010.

alter table public.s3b_player_progress add column if not exists act1_stage text not null default 'opening' check(act1_stage in ('opening','action','consequence','complete'));
alter table public.s3b_player_progress add column if not exists act1_text_keys jsonb not null default '[]'::jsonb check(jsonb_typeof(act1_text_keys)='array');
alter table public.s3b_run_state add column if not exists puzzle_locked_prefix text not null default '';

-- Preserve deployed implementations behind guarded public wrappers.
alter function public.s3b_initialize_flow(text,text) rename to s3b_initialize_flow_pre011;
alter function public.s3b_submit_first_meeting(text,text,text) rename to s3b_submit_first_meeting_pre011;
alter function public.s3b_grab(text,text) rename to s3b_grab_pre011;
alter function public.s3b_leave_start_room(text,text) rename to s3b_leave_start_room_pre011;
alter function public.s3b_apply_meeting_resolution(text,text) rename to s3b_apply_meeting_resolution_pre011;
alter function public.s3b_complete_foldback(text,text) rename to s3b_complete_foldback_pre011;
alter function public.s3b_follow_sign(text,text) rename to s3b_follow_sign_pre011;
alter function public.s3b_submit_library_code(text,text,text) rename to s3b_submit_library_code_pre011;
alter function public.s3b_submit_act4_choice(text,text,text) rename to s3b_submit_act4_choice_pre011;
alter function public.s3b_apply_act5_resolution(text,text) rename to s3b_apply_act5_resolution_pre011;
alter function public.s3b_choose_post_inspection_route(text,text,text) rename to s3b_choose_post_inspection_route_pre011;

create or replace function public.s3b_initialize_flow(p_room_code text,p_teacher_token text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare v_room text:=upper(trim(p_room_code)); v_run public.game_runs%rowtype; v_result jsonb;
begin
  perform public.s1_assert_teacher(v_room,p_teacher_token); v_run:=public.s2_get_active_run(v_room);
  if exists(select 1 from public.s3b_run_state where run_id=v_run.run_id) then raise exception 'Sprint 3B flow is already initialized.'; end if;
  v_result:=public.s3b_initialize_flow_pre011(p_room_code,p_teacher_token);
  update public.s3b_player_progress p set act1_text_keys=case rp.role_slot
    when 'GAL-A' then '["act01-g.001","act01-g.002","act01-g.003","act01-g.004","act01-g.005","act01-g.007","act01-g.008","act01-g.016","act01-g.017","act01-g.018"]'
    when 'GAL-B' then '["act01-a.001","act01-g.004","act01-g.005","act01-a.003","act01-a.004","act01-a.005"]'
    else '["act01-l.001","act01-l.002","act01-g.005","act01-l.004","act01-l.005","act01-l.006","act01-l.007","act01-l.008","act01-l.009","act01-l.010","act01-l.011"]' end::jsonb
  from public.s1_room_players rp where p.run_id=v_run.run_id and rp.player_id=p.player_id;
  return v_result;
end; $$;

create or replace function public.s3b_ack_act1_opening(p_room_code text,p_session_token text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare v_room text:=upper(trim(p_room_code)); v_player public.s1_room_players%rowtype; v_run public.game_runs%rowtype;
begin
  v_player:=public.s1_get_player_by_session(v_room,p_session_token);v_run:=public.s2_get_active_run(v_room);
  if not exists(select 1 from public.s3_runtime_scene_state where run_id=v_run.run_id and scene_id='act1_wake_up' and phase_key='private_first_action') then raise exception 'ACT 1 opening is out of phase.'; end if;
  update public.s3b_player_progress set act1_stage='action',act1_text_keys=case v_player.role_slot when 'GAL-A' then '["act01-g.018"]' when 'GAL-B' then '["act01-g.018"]' else '["act01-g.018"]' end::jsonb where run_id=v_run.run_id and player_id=v_player.player_id and act1_stage='opening';
  if not found then raise exception 'ACT 1 opening is already acknowledged or unavailable.'; end if;
  return jsonb_build_object('ok',true,'act1_stage','action');
end; $$;

create or replace function public.s3b_submit_act1_choice(p_room_code text,p_session_token text,p_choice_id text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare v_room text:=upper(trim(p_room_code));v_player public.s1_room_players%rowtype;v_run public.game_runs%rowtype;v_keys jsonb;
begin
  v_player:=public.s1_get_player_by_session(v_room,p_session_token);v_run:=public.s2_get_active_run(v_room);
  if not exists(select 1 from public.s3_runtime_scene_state where run_id=v_run.run_id and scene_id='act1_wake_up' and phase_key='private_first_action') then raise exception 'ACT 1 choice is out of phase.'; end if;
  if not ((v_player.role_slot='GAL-A' and p_choice_id in ('study_map','check_sound','study_number_note','search_room')) or (v_player.role_slot='GAL-B' and p_choice_id in ('read_diary','check_door','check_phone','check_vent')) or (v_player.role_slot='GAL-C' and p_choice_id in ('read_notice','study_watch','try_star_key','check_mirror'))) then raise exception 'Invalid canonical ACT 1 choice for this role.'; end if;
  v_keys:=case p_choice_id when 'study_map' then '["act01-g.023","act01-g.024"]' when 'check_sound' then '["act01-g.025","act01-g.026","act01-g.027"]' when 'study_number_note' then '["act01-g.007","act01-g.028","act01-g.029"]' when 'search_room' then '["act01-g.030"]' when 'read_diary' then '["act01-a.010"]' when 'check_door' then '["act01-a.011","act01-a.012","act01-a.013"]' when 'check_phone' then '["act01-a.014","act01-g.005"]' when 'check_vent' then '["act01-a.015","act01-a.016"]' when 'read_notice' then '["act01-l.016"]' when 'study_watch' then '["act01-l.004","act01-g.028","act01-l.017"]' when 'try_star_key' then '["act01-l.018","act01-l.019"]' else '["act01-l.020","act01-l.021"]' end::jsonb;
  update public.s3b_player_progress set act1_choice_id=p_choice_id,act1_locked_at=now(),act1_stage='consequence',act1_text_keys=v_keys where run_id=v_run.run_id and player_id=v_player.player_id and act1_stage='action' and act1_choice_id is null;
  if not found then raise exception 'ACT 1 action is unavailable or already locked.'; end if;
  return jsonb_build_object('ok',true,'act1_stage','consequence');
end; $$;

create or replace function public.s3b_complete_act1(p_room_code text,p_session_token text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare v_room text:=upper(trim(p_room_code));v_player public.s1_room_players%rowtype;v_run public.game_runs%rowtype;v_all boolean;
begin
  v_player:=public.s1_get_player_by_session(v_room,p_session_token);v_run:=public.s2_get_active_run(v_room);
  if not exists(select 1 from public.s3_runtime_scene_state where run_id=v_run.run_id and scene_id='act1_wake_up') then raise exception 'ACT 1 completion is out of phase.'; end if;
  update public.s3b_player_progress set act1_stage='complete',act1_text_keys='["act01-g.031"]' where run_id=v_run.run_id and player_id=v_player.player_id and act1_stage='consequence';
  if not found then raise exception 'ACT 1 consequence must be delivered before completion.'; end if;
  select count(*)=3 into v_all from public.s3b_player_progress where run_id=v_run.run_id and act1_stage='complete';
  if v_all then perform public.s3b_set_scene(v_run.run_id,'act2_first_contact','private_first_meeting','signal_unstable','ACTION_SCREEN','act02.002'); end if;
  return jsonb_build_object('ok',true,'all_complete',v_all);
end; $$;

-- Explicit replay guards wrap the deployed transition implementations.
create or replace function public.s3b_submit_first_meeting(p_room_code text,p_session_token text,p_choice_id text) returns jsonb language plpgsql security definer set search_path=public as $$ declare r text:=upper(trim(p_room_code));p public.s1_room_players%rowtype;g public.game_runs%rowtype; begin p:=public.s1_get_player_by_session(r,p_session_token);g:=public.s2_get_active_run(r);if not exists(select 1 from public.s3_runtime_scene_state where run_id=g.run_id and scene_id='act2_first_contact' and phase_key='private_first_meeting') or exists(select 1 from public.s3b_player_progress where run_id=g.run_id and player_id=p.player_id and first_meeting_choice is not null) then raise exception 'ACT 2 first meeting transition is unavailable.';end if;return public.s3b_submit_first_meeting_pre011(p_room_code,p_session_token,p_choice_id);end;$$;
create or replace function public.s3b_grab(p_room_code text,p_session_token text) returns jsonb language plpgsql security definer set search_path=public as $$ declare r text:=upper(trim(p_room_code));p public.s1_room_players%rowtype;g public.game_runs%rowtype; begin p:=public.s1_get_player_by_session(r,p_session_token);g:=public.s2_get_active_run(r);if not exists(select 1 from public.s3_runtime_scene_state where run_id=g.run_id and scene_id='act2_first_contact' and phase_key='private_first_meeting') or exists(select 1 from public.s3b_player_progress where run_id=g.run_id and player_id=p.player_id and grab_complete) then raise exception 'GRAB transition is unavailable.';end if;return public.s3b_grab_pre011(p_room_code,p_session_token);end;$$;
create or replace function public.s3b_leave_start_room(p_room_code text,p_session_token text) returns jsonb language plpgsql security definer set search_path=public as $$ declare r text:=upper(trim(p_room_code));p public.s1_room_players%rowtype;g public.game_runs%rowtype; begin p:=public.s1_get_player_by_session(r,p_session_token);g:=public.s2_get_active_run(r);if not exists(select 1 from public.s3_runtime_scene_state where run_id=g.run_id and scene_id='act2_first_contact' and phase_key='private_first_meeting') or exists(select 1 from public.s3b_player_progress where run_id=g.run_id and player_id=p.player_id and left_start_room) then raise exception 'Leave-room transition is unavailable.';end if;return public.s3b_leave_start_room_pre011(p_room_code,p_session_token);end;$$;
create or replace function public.s3b_apply_meeting_resolution(p_room_code text,p_session_token text) returns jsonb language plpgsql security definer set search_path=public as $$ declare r text:=upper(trim(p_room_code));g public.game_runs%rowtype; begin perform public.s1_get_player_by_session(r,p_session_token);g:=public.s2_get_active_run(r);if not exists(select 1 from public.s3_runtime_scene_state where run_id=g.run_id and scene_id='act2_first_contact' and phase_key='meeting_discussion') or exists(select 1 from public.s3b_run_state where run_id=g.run_id and final_meeting_result is not null) then raise exception 'Meeting-resolution transition is unavailable.';end if;return public.s3b_apply_meeting_resolution_pre011(p_room_code,p_session_token);end;$$;
create or replace function public.s3b_complete_foldback(p_room_code text,p_session_token text) returns jsonb language sql security definer set search_path=public as $$select public.s3b_complete_foldback_pre011(p_room_code,p_session_token)$$;
create or replace function public.s3b_follow_sign(p_room_code text,p_session_token text) returns jsonb language plpgsql security definer set search_path=public as $$ declare r text:=upper(trim(p_room_code));p public.s1_room_players%rowtype;g public.game_runs%rowtype; begin p:=public.s1_get_player_by_session(r,p_session_token);g:=public.s2_get_active_run(r);if not exists(select 1 from public.s3_runtime_scene_state where run_id=g.run_id and scene_id='act3_library' and phase_key='wayfinding') or exists(select 1 from public.s3b_player_progress where run_id=g.run_id and player_id=p.player_id and player_location='library') then raise exception 'FOLLOW SIGN transition is unavailable.';end if;return public.s3b_follow_sign_pre011(p_room_code,p_session_token);end;$$;
create or replace function public.s3b_submit_library_code(p_room_code text,p_session_token text,p_code text) returns jsonb language plpgsql security definer set search_path=public as $$ declare r text:=upper(trim(p_room_code));g public.game_runs%rowtype;s public.s3b_run_state%rowtype; begin perform public.s1_get_player_by_session(r,p_session_token);g:=public.s2_get_active_run(r);select * into s from public.s3b_run_state where run_id=g.run_id;if not exists(select 1 from public.s3_runtime_scene_state where run_id=g.run_id and scene_id='act3_library' and phase_key='library_box') or s.puzzle_resolved_at is not null then raise exception 'Library Box transition is unavailable.';end if;if left(p_code,length(s.puzzle_locked_prefix))<>s.puzzle_locked_prefix then raise exception 'Locked puzzle wheels cannot be changed.';end if;return public.s3b_submit_library_code_pre011(p_room_code,p_session_token,p_code);end;$$;
create or replace function public.s3b_submit_act4_choice(p_room_code text,p_session_token text,p_choice_id text) returns jsonb language plpgsql security definer set search_path=public as $$ declare r text:=upper(trim(p_room_code));p public.s1_room_players%rowtype;g public.game_runs%rowtype; begin p:=public.s1_get_player_by_session(r,p_session_token);g:=public.s2_get_active_run(r);if not exists(select 1 from public.s3_runtime_scene_state where run_id=g.run_id and scene_id='act4_known_unknown' and phase_key='private_route_choice') or exists(select 1 from public.s3b_player_progress where run_id=g.run_id and player_id=p.player_id and act4_choice_id is not null) then raise exception 'ACT 4 transition is unavailable.';end if;return public.s3b_submit_act4_choice_pre011(p_room_code,p_session_token,p_choice_id);end;$$;
create or replace function public.s3b_apply_act5_resolution(p_room_code text,p_session_token text) returns jsonb language plpgsql security definer set search_path=public as $$ declare r text:=upper(trim(p_room_code));g public.game_runs%rowtype; begin perform public.s1_get_player_by_session(r,p_session_token);g:=public.s2_get_active_run(r);if not exists(select 1 from public.s3_runtime_scene_state where run_id=g.run_id and scene_id='act5_route_discussion' and phase_key='discussion') then raise exception 'ACT 5 transition is unavailable.';end if;return public.s3b_apply_act5_resolution_pre011(p_room_code,p_session_token);end;$$;
create or replace function public.s3b_choose_post_inspection_route(p_room_code text,p_session_token text,p_route text) returns jsonb language plpgsql security definer set search_path=public as $$ declare r text:=upper(trim(p_room_code));g public.game_runs%rowtype; begin perform public.s1_get_player_by_session(r,p_session_token);g:=public.s2_get_active_run(r);if not exists(select 1 from public.s3_runtime_scene_state where run_id=g.run_id and scene_id='act5_inspect_first' and phase_key='post_inspection_route') or not exists(select 1 from public.s3b_run_state where run_id=g.run_id and pending_post_inspection_route and group_route is null) then raise exception 'Post-inspection transition is unavailable.';end if;return public.s3b_choose_post_inspection_route_pre011(p_room_code,p_session_token,p_route);end;$$;

-- Replace timeout refresh with actual server-owned locked prefix.
create or replace function public.s3b_refresh_puzzle(p_run uuid) returns void language plpgsql security definer set search_path=public as $$
declare s public.s3b_run_state%rowtype;t int;n int;room text;k text;prefix text;
begin select * into s from public.s3b_run_state where run_id=p_run for update;if not found or s.puzzle_resolved_at is not null or s.puzzle_deadline is null or now()<s.puzzle_deadline then return;end if;t:=least(8,4+floor(extract(epoch from(now()-s.puzzle_deadline))/15)::int);select room_code into room from public.game_runs where run_id=p_run;for n in s.puzzle_hint_stage+1..t loop if n<4 then continue;end if;k:=case n when 4 then'act03.014'when 5 then'act03.017'when 6 then'act03.018'when 7 then'act03.019'else'act03.020'end;prefix:=left('41739',n-3);update public.s3b_run_state set puzzle_hint_stage=n,puzzle_locked_prefix=prefix,updated_at=now()where run_id=p_run;perform public.s2_log_event(p_run,room,null,'puzzle_fallback_hint',null,jsonb_build_object('hint_stage',n,'locked_prefix',prefix,'text_key',k,'resolution_source','system_fallback','behavior_scoring',false));end loop;if t=8 then update public.s3b_run_state set puzzle_resolved_at=coalesce(puzzle_resolved_at,now()),updated_at=now()where run_id=p_run;insert into public.s3_group_items(run_id,item_key,label_text_key)values(p_run,'library_photo_1897','item.photo_1897'),(p_run,'library_torn_note','item.torn_note')on conflict do nothing;perform public.s2_log_event(p_run,room,null,'puzzle_resolved_system_fallback',null,jsonb_build_object('resolution_source','system_fallback','behavior_scoring',false,'text_key','act03.015'));perform public.s3b_set_scene(p_run,'act4_known_unknown','private_route_choice','initial','ACTION_SCREEN','act03.015');end if;end;$$;

create or replace function public.s3b_audit_set_puzzle_elapsed(p_room_code text,p_teacher_token text,p_elapsed_seconds integer) returns jsonb language plpgsql security definer set search_path=public as $$
declare r text:=upper(trim(p_room_code));g public.game_runs%rowtype;begin perform public.s1_assert_teacher(r,p_teacher_token);g:=public.s2_get_active_run(r);if g.run_mode<>'audit'then raise exception'Puzzle elapsed-time probe is restricted to AUDIT runs.';end if;if p_elapsed_seconds not between 0 and 600 then raise exception'Invalid audit elapsed seconds.';end if;update public.s3b_run_state set puzzle_started_at=now()-make_interval(secs=>p_elapsed_seconds),puzzle_deadline=now()+make_interval(secs=>90-p_elapsed_seconds)where run_id=g.run_id and puzzle_resolved_at is null;perform public.s3b_refresh_puzzle(g.run_id);return(select jsonb_build_object('ok',true,'hint_stage',puzzle_hint_stage,'locked_prefix',puzzle_locked_prefix,'attempt_number',puzzle_attempt_number,'resolved',puzzle_resolved_at is not null)from public.s3b_run_state where run_id=g.run_id);end;$$;

grant execute on function public.s3b_initialize_flow(text,text),public.s3b_ack_act1_opening(text,text),public.s3b_submit_act1_choice(text,text,text),public.s3b_complete_act1(text,text),public.s3b_submit_first_meeting(text,text,text),public.s3b_grab(text,text),public.s3b_leave_start_room(text,text),public.s3b_apply_meeting_resolution(text,text),public.s3b_complete_foldback(text,text),public.s3b_follow_sign(text,text),public.s3b_submit_library_code(text,text,text),public.s3b_submit_act4_choice(text,text,text),public.s3b_apply_act5_resolution(text,text),public.s3b_choose_post_inspection_route(text,text,text) to anon,authenticated;
