-- Sprint 3B: server-authoritative ACT 1-5 placeholder flow / route / fold-back.
-- Apply after 006_sprint3a_provenance_view_integrity_fix.sql.

create table if not exists public.s3b_run_state (
  run_id uuid primary key references public.game_runs(run_id),
  final_meeting_result text check (final_meeting_result in ('library','great_hall','main_gate','west_tower','chapel')),
  failed_rendezvous_completed boolean not null default false,
  party_physically_reunited boolean not null default false,
  puzzle_started_at timestamptz,
  puzzle_deadline timestamptz,
  puzzle_attempt_number integer not null default 0,
  puzzle_hint_stage integer not null default 0 check (puzzle_hint_stage between 0 and 4),
  puzzle_resolved_at timestamptz,
  group_route text check (group_route in ('known','unknown','inspect_first')),
  unknown_passage_inspected boolean not null default false,
  terminal_state text,
  updated_at timestamptz not null default now()
);

create table if not exists public.s3b_player_progress (
  run_id uuid not null references public.game_runs(run_id),
  player_id uuid not null references public.s1_room_players(player_id),
  act1_choice_id text,
  act1_locked_at timestamptz,
  first_meeting_choice text check (first_meeting_choice in ('library','great_hall','main_gate','west_tower','chapel','help')),
  first_meeting_locked_at timestamptz,
  grab_complete boolean not null default false,
  left_start_room boolean not null default false,
  player_location text not null default 'start_room',
  act4_choice_id text check (act4_choice_id in ('known','unknown','inspect','ask')),
  act4_locked_at timestamptz,
  primary key (run_id,player_id)
);

create table if not exists public.s3b_library_attempts (
  run_id uuid not null references public.game_runs(run_id),
  attempt_number integer not null,
  submitted_by uuid not null references public.s1_room_players(player_id),
  submitted_value text not null,
  submitted_at timestamptz not null default now(),
  correct boolean not null,
  primary key (run_id,attempt_number)
);

alter table public.s3b_run_state enable row level security;
alter table public.s3b_player_progress enable row level security;
alter table public.s3b_library_attempts enable row level security;

insert into public.s3_item_catalog(item_key,name_text_key,shareable_views) values
 ('gitte_castle_map','act03.007','["map"]'),
 ('gitte_number_note','act03.010','["front","back"]'),
 ('gitte_flashlight','act04-05.004','[]'),
 ('anna_servant_diary','act01-a.008','["open"]'),
 ('linda_stopped_watch','act01-l.002','["front","back"]'),
 ('linda_star_key','act01-l.003','["front"]'),
 ('linda_closure_order','act01-l.007','["front"]'),
 ('library_photo_1897','act03.006','["front"]'),
 ('library_torn_note','act03.016','["front"]')
on conflict(item_key) do update set name_text_key=excluded.name_text_key,shareable_views=excluded.shareable_views;

create or replace function public.s3b_set_scene(p_run uuid,p_scene text,p_phase text,p_step text,p_mode text,p_text_key text)
returns void language plpgsql security definer set search_path=public as $$
begin
  if p_mode not in ('CINEMATIC_MESSAGE','CRITICAL_INFO','ACTION_SCREEN') then raise exception 'Invalid display mode.'; end if;
  insert into public.s3_runtime_scene_state(run_id,scene_id,phase_key,step_key,display_mode,text_key)
  values(p_run,p_scene,p_phase,p_step,p_mode,p_text_key)
  on conflict(run_id) do update set scene_id=excluded.scene_id,phase_key=excluded.phase_key,
    step_key=excluded.step_key,display_mode=excluded.display_mode,text_key=excluded.text_key,updated_at=now();
end; $$;

create or replace function public.s3b_initialize_flow(p_room_code text,p_teacher_token text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare v_room text:=upper(trim(p_room_code)); v_run public.game_runs%rowtype;
begin
  perform public.s1_assert_teacher(v_room,p_teacher_token); v_run:=public.s2_get_active_run(v_room);
  if v_run.run_id is null then raise exception 'No active formal run.'; end if;
  insert into public.s3b_run_state(run_id) values(v_run.run_id) on conflict do nothing;
  insert into public.s3b_player_progress(run_id,player_id)
    select v_run.run_id,player_id from public.s1_room_players where room_code=v_room on conflict do nothing;
  perform public.s3b_set_scene(v_run.run_id,'act1_wake_up','private_first_action','role_specific','ACTION_SCREEN','common.001');
  perform public.s2_log_event(v_run.run_id,v_room,null,'s3b_flow_initialized',null,jsonb_build_object('behavior_data',true));
  return jsonb_build_object('ok',true,'run_id',v_run.run_id);
end; $$;

create or replace function public.s3b_submit_act1_choice(p_room_code text,p_session_token text,p_choice_id text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare v_room text:=upper(trim(p_room_code)); v_player public.s1_room_players%rowtype; v_run public.game_runs%rowtype; v_all boolean;
begin
  v_player:=public.s1_get_player_by_session(v_room,p_session_token); v_run:=public.s2_get_active_run(v_room);
  if not ((v_player.role_slot='GAL-A' and p_choice_id in ('study_map','check_sound','study_number_note','search_room'))
    or (v_player.role_slot='GAL-B' and p_choice_id in ('read_diary','check_door','check_phone','check_vent'))
    or (v_player.role_slot='GAL-C' and p_choice_id in ('read_notice','study_watch','try_star_key','check_mirror'))) then
    raise exception 'Invalid canonical ACT 1 choice for this role.'; end if;
  update public.s3b_player_progress set act1_choice_id=p_choice_id,act1_locked_at=now()
    where run_id=v_run.run_id and player_id=v_player.player_id and act1_choice_id is null;
  if not found then raise exception 'ACT 1 first action is already locked.'; end if;
  select count(*)=3 into v_all from public.s3b_player_progress where run_id=v_run.run_id and act1_locked_at is not null;
  if v_all then perform public.s3b_set_scene(v_run.run_id,'act2_first_contact','private_first_meeting','signal_unstable','ACTION_SCREEN','act02.002'); end if;
  return jsonb_build_object('ok',true,'all_complete',v_all);
end; $$;

create or replace function public.s3b_submit_first_meeting(p_room_code text,p_session_token text,p_choice_id text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare v_room text:=upper(trim(p_room_code)); v_player public.s1_room_players%rowtype; v_run public.game_runs%rowtype;
begin
  if p_choice_id not in ('library','great_hall','main_gate','west_tower','chapel','help') then raise exception 'Invalid ACT 2 first-meeting choice.'; end if;
  v_player:=public.s1_get_player_by_session(v_room,p_session_token); v_run:=public.s2_get_active_run(v_room);
  if not exists(select 1 from public.s3b_player_progress where run_id=v_run.run_id and player_id=v_player.player_id and act1_locked_at is not null) then raise exception 'ACT 1 is not complete.'; end if;
  update public.s3b_player_progress set first_meeting_choice=p_choice_id,first_meeting_locked_at=now()
    where run_id=v_run.run_id and player_id=v_player.player_id and first_meeting_choice is null;
  if not found then raise exception 'First meeting choice is already locked.'; end if;
  return jsonb_build_object('ok',true);
end; $$;

create or replace function public.s3b_grab(p_room_code text,p_session_token text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare v_room text:=upper(trim(p_room_code)); v_player public.s1_room_players%rowtype; v_run public.game_runs%rowtype; v_item text;
begin
  v_player:=public.s1_get_player_by_session(v_room,p_session_token); v_run:=public.s2_get_active_run(v_room);
  if not exists(select 1 from public.s3b_player_progress where run_id=v_run.run_id and player_id=v_player.player_id and first_meeting_locked_at is not null) then raise exception 'First meeting choice must be locked before GRAB.'; end if;
  foreach v_item in array case v_player.role_slot when 'GAL-A' then array['gitte_castle_map','gitte_number_note'] when 'GAL-B' then array['anna_servant_diary'] else array['linda_stopped_watch','linda_star_key','linda_closure_order'] end loop
    insert into public.s3_player_items(run_id,item_key,physical_owner_id) values(v_run.run_id,v_item,v_player.player_id) on conflict do nothing;
    insert into public.s3_player_item_view_state(run_id,player_id,item_key,current_view) values(v_run.run_id,v_player.player_id,v_item,case when v_item='gitte_castle_map' then 'map' when v_item='anna_servant_diary' then 'open' else 'front' end) on conflict do nothing;
  end loop;
  update public.s3b_player_progress set grab_complete=true where run_id=v_run.run_id and player_id=v_player.player_id;
  return jsonb_build_object('ok',true);
end; $$;

create or replace function public.s3b_leave_start_room(p_room_code text,p_session_token text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare v_room text:=upper(trim(p_room_code)); v_player public.s1_room_players%rowtype; v_run public.game_runs%rowtype; v_ready boolean; v_round int;
begin
  v_player:=public.s1_get_player_by_session(v_room,p_session_token); v_run:=public.s2_get_active_run(v_room);
  update public.s3b_player_progress set left_start_room=true,player_location='corridor'
    where run_id=v_run.run_id and player_id=v_player.player_id and first_meeting_locked_at is not null and grab_complete;
  if not found then raise exception 'GRAB and first meeting choice are required before leaving.'; end if;
  select count(*)=3 into v_ready from public.s3b_player_progress where run_id=v_run.run_id and first_meeting_locked_at is not null and grab_complete and left_start_room;
  if v_ready and not exists(select 1 from public.discussion_sessions where run_id=v_run.run_id and scene_id='act2_first_contact') then
    select coalesce(max(vote_round),0)+1 into v_round from public.discussion_sessions where run_id=v_run.run_id;
    insert into public.discussion_sessions(run_id,scene_id,phase_key,step_key,round_no,vote_round,topic,phase_deadline,show_initial_choices,require_final_vote,vote_options,tie_policy,revote_window_sec,max_revotes,fallback_resolution,discussion_time_limit_sec,vote_time_limit_sec,silent_texting_mode)
    values(v_run.run_id,'act2_first_contact','meeting_discussion','final_meeting',1,v_round,'act02.026',now()+interval '150 seconds',false,true,
      '[{"id":"library","label":"act02.004"},{"id":"great_hall","label":"act02.005"},{"id":"main_gate","label":"act02.006"},{"id":"west_tower","label":"act02.007"},{"id":"chapel","label":"act02.008"}]',
      'SINGLE_REVOTE_THEN_FALLBACK',30,1,'library',150,120,false);
    perform public.s3b_set_scene(v_run.run_id,'act2_first_contact','meeting_discussion','signal_restored','CRITICAL_INFO','act02.024');
  end if;
  return jsonb_build_object('ok',true,'discussion_ready',v_ready);
end; $$;

create or replace function public.s3b_apply_meeting_resolution(p_room_code text,p_session_token text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare v_room text:=upper(trim(p_room_code)); v_player public.s1_room_players%rowtype; v_run public.game_runs%rowtype; v_out jsonb; v_result text;
begin
  v_player:=public.s1_get_player_by_session(v_room,p_session_token); v_run:=public.s2_get_active_run(v_room);
  select outcome into v_out from public.discussion_sessions where run_id=v_run.run_id and scene_id='act2_first_contact' and status='resolved' order by vote_round desc limit 1 for update;
  if v_out is null then raise exception 'ACT 2 final meeting vote is not resolved.'; end if;
  v_result:=coalesce(v_out->>'choice_id',v_out->>'resolution_id');
  if v_result not in ('library','great_hall','main_gate','west_tower','chapel') then raise exception 'Invalid meeting resolution.'; end if;
  update public.s3b_run_state set final_meeting_result=coalesce(final_meeting_result,v_result),updated_at=now() where run_id=v_run.run_id;
  update public.s3_runtime_scene_state set current_route_target=v_result,wayfinding_target=case when v_result='library' then 'library' end,updated_at=now() where run_id=v_run.run_id;
  perform public.s3b_set_scene(v_run.run_id,'act2_rendezvous','route_consequence',v_result,'CINEMATIC_MESSAGE',case v_result when 'library' then 'act03.001' when 'great_hall' then 'act02.038' when 'main_gate' then 'act02.043' when 'west_tower' then 'act02.046' else 'act02.049' end);
  return jsonb_build_object('ok',true,'final_meeting_result',v_result);
end; $$;

create or replace function public.s3b_complete_foldback(p_room_code text,p_session_token text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare v_room text:=upper(trim(p_room_code)); v_player public.s1_room_players%rowtype; v_run public.game_runs%rowtype; v_result text;
begin
  v_player:=public.s1_get_player_by_session(v_room,p_session_token); v_run:=public.s2_get_active_run(v_room);
  select final_meeting_result into v_result from public.s3b_run_state where run_id=v_run.run_id for update;
  if v_result is null then raise exception 'Meeting route is unresolved.'; end if;
  if v_result<>'library' then
    update public.s3b_run_state set failed_rendezvous_completed=true,updated_at=now() where run_id=v_run.run_id;
    perform public.s2_log_event(v_run.run_id,v_room,null,'failed_rendezvous',null,jsonb_build_object('route',v_result,'behavior_scoring',false));
  end if;
  update public.s3_runtime_scene_state set current_route_target='library',wayfinding_target='library',updated_at=now() where run_id=v_run.run_id;
  perform public.s3b_set_scene(v_run.run_id,'act3_library','wayfinding','follow_sign','ACTION_SCREEN','act03.001');
  return jsonb_build_object('ok',true,'final_meeting_result',v_result,'current_route_target','library');
end; $$;

create or replace function public.s3b_follow_sign(p_room_code text,p_session_token text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare v_room text:=upper(trim(p_room_code)); v_player public.s1_room_players%rowtype; v_run public.game_runs%rowtype; v_all boolean;
begin
  v_player:=public.s1_get_player_by_session(v_room,p_session_token); v_run:=public.s2_get_active_run(v_room);
  update public.s3b_player_progress set player_location='library' where run_id=v_run.run_id and player_id=v_player.player_id;
  select count(*)=3 into v_all from public.s3b_player_progress where run_id=v_run.run_id and player_location='library';
  if v_all then
    update public.s3b_run_state set party_physically_reunited=true,puzzle_started_at=coalesce(puzzle_started_at,now()),puzzle_deadline=coalesce(puzzle_deadline,now()+interval '90 seconds'),updated_at=now() where run_id=v_run.run_id;
    update public.game_runs set silent_texting_mode=true where run_id=v_run.run_id;
    perform public.s3b_set_scene(v_run.run_id,'act3_library','library_box','locked','ACTION_SCREEN','act03.008');
  end if;
  return jsonb_build_object('ok',true,'party_physically_reunited',v_all);
end; $$;

create or replace function public.s3b_refresh_puzzle(p_run uuid) returns void language plpgsql security definer set search_path=public as $$
begin
  update public.s3b_run_state set puzzle_hint_stage=greatest(puzzle_hint_stage,4),updated_at=now()
  where run_id=p_run and puzzle_resolved_at is null and puzzle_deadline<=now() and puzzle_hint_stage<4;
end; $$;

create or replace function public.s3b_submit_library_code(p_room_code text,p_session_token text,p_code text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare v_room text:=upper(trim(p_room_code)); v_player public.s1_room_players%rowtype; v_run public.game_runs%rowtype; v_n int; v_correct boolean:=p_code='41739'; v_hint int;
begin
  v_player:=public.s1_get_player_by_session(v_room,p_session_token); v_run:=public.s2_get_active_run(v_room); perform public.s3b_refresh_puzzle(v_run.run_id);
  perform 1 from public.s3b_run_state where run_id=v_run.run_id and party_physically_reunited and puzzle_resolved_at is null for update;
  if not found then raise exception 'Library Box is not accepting attempts.'; end if;
  update public.s3b_run_state set puzzle_attempt_number=puzzle_attempt_number+1,
    puzzle_hint_stage=case when v_correct then puzzle_hint_stage else greatest(puzzle_hint_stage,least(puzzle_attempt_number+1,3)) end,
    puzzle_resolved_at=case when v_correct then now() else null end,updated_at=now()
    where run_id=v_run.run_id returning puzzle_attempt_number,puzzle_hint_stage into v_n,v_hint;
  insert into public.s3b_library_attempts values(v_run.run_id,v_n,v_player.player_id,p_code,now(),v_correct);
  if v_correct then
    insert into public.s3_group_items(run_id,item_key,label_text_key) values(v_run.run_id,'library_photo_1897','act03.006'),(v_run.run_id,'library_torn_note','act03.016') on conflict do nothing;
    perform public.s3b_set_scene(v_run.run_id,'act4_known_unknown','private_route_choice','initial','ACTION_SCREEN','act04-05.002');
  else
    perform public.s2_log_event(v_run.run_id,v_room,null,'puzzle_hint_used',v_player.player_id,jsonb_build_object('attempt_number',v_n,'hint_stage',v_hint,'behavior_scoring',false));
  end if;
  return jsonb_build_object('ok',true,'correct',v_correct,'attempt_number',v_n,'hint_stage',v_hint);
end; $$;

create or replace function public.s3b_submit_act4_choice(p_room_code text,p_session_token text,p_choice_id text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare v_room text:=upper(trim(p_room_code)); v_player public.s1_room_players%rowtype; v_run public.game_runs%rowtype; v_count int; v_distinct int; v_route text; v_round int;
begin
  if p_choice_id not in ('known','unknown','inspect','ask') then raise exception 'Invalid ACT 4 choice.'; end if;
  v_player:=public.s1_get_player_by_session(v_room,p_session_token); v_run:=public.s2_get_active_run(v_room);
  if not exists(select 1 from public.s3b_run_state where run_id=v_run.run_id and puzzle_resolved_at is not null) then raise exception 'Library Box is unresolved.'; end if;
  update public.s3b_player_progress set act4_choice_id=p_choice_id,act4_locked_at=now() where run_id=v_run.run_id and player_id=v_player.player_id and act4_choice_id is null;
  if not found then raise exception 'ACT 4 choice is already locked.'; end if;
  select count(*),count(distinct act4_choice_id) into v_count,v_distinct from public.s3b_player_progress where run_id=v_run.run_id and act4_choice_id is not null;
  if v_count=3 and v_distinct=1 and p_choice_id in ('known','unknown') then
    update public.s3b_run_state set group_route=p_choice_id,terminal_state='SPRINT3B_COMPLETE',updated_at=now() where run_id=v_run.run_id;
    perform public.s3b_set_scene(v_run.run_id,'act5_route_resolved','terminal',p_choice_id,'CINEMATIC_MESSAGE',case p_choice_id when 'known' then 'act04-05.019' else 'act04-05.024' end);
    v_route:=p_choice_id;
  elsif v_count=3 then
    select coalesce(max(vote_round),0)+1 into v_round from public.discussion_sessions where run_id=v_run.run_id;
    insert into public.discussion_sessions(run_id,scene_id,phase_key,step_key,round_no,vote_round,topic,phase_deadline,show_initial_choices,require_final_vote,vote_options,tie_policy,revote_window_sec,max_revotes,fallback_resolution,discussion_time_limit_sec,vote_time_limit_sec,silent_texting_mode)
    values(v_run.run_id,'act5_route_discussion','route_discussion','final_route',1,v_round,'act04-05.009',now()+interval '300 seconds',false,true,
      '[{"id":"known","label":"act04-05.010"},{"id":"unknown","label":"act04-05.011"},{"id":"inspect_first","label":"act04-05.012"}]',
      'SINGLE_REVOTE_THEN_FALLBACK',30,1,'inspect_first',300,120,true)
    on conflict(run_id,scene_id,phase_key,step_key,vote_round) do nothing;
    perform public.s3b_set_scene(v_run.run_id,'act5_route_discussion','discussion','final_route','CRITICAL_INFO','act04-05.009');
  end if;
  return jsonb_build_object('ok',true,'all_submitted',v_count=3,'direct_route',v_route);
end; $$;

create or replace function public.s3b_apply_act5_resolution(p_room_code text,p_session_token text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare v_room text:=upper(trim(p_room_code)); v_player public.s1_room_players%rowtype; v_run public.game_runs%rowtype; v_out jsonb; v_route text;
begin
  v_player:=public.s1_get_player_by_session(v_room,p_session_token); v_run:=public.s2_get_active_run(v_room);
  select outcome into v_out from public.discussion_sessions
    where run_id=v_run.run_id and scene_id='act5_route_discussion' and status='resolved'
    order by vote_round desc limit 1 for update;
  if v_out is null then raise exception 'ACT 5 route vote is not resolved.'; end if;
  v_route:=coalesce(v_out->>'choice_id',v_out->>'resolution_id');
  if v_route not in ('known','unknown','inspect_first') then raise exception 'Invalid ACT 5 resolution.'; end if;
  update public.s3b_run_state set group_route=coalesce(group_route,v_route),
    unknown_passage_inspected=unknown_passage_inspected or v_route='inspect_first',
    terminal_state='SPRINT3B_COMPLETE',updated_at=now() where run_id=v_run.run_id;
  perform public.s3b_set_scene(v_run.run_id,'act5_route_resolved','terminal',v_route,'CINEMATIC_MESSAGE',
    case v_route when 'known' then 'act04-05.019' when 'unknown' then 'act04-05.024' else 'act04-05.015' end);
  return jsonb_build_object('ok',true,'group_route',v_route,'terminal_state','SPRINT3B_COMPLETE');
end; $$;

create or replace function public.s3b_get_player_state(p_room_code text,p_session_token text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare v_room text:=upper(trim(p_room_code)); v_player public.s1_room_players%rowtype; v_run public.game_runs%rowtype;
begin
  v_player:=public.s1_get_player_by_session(v_room,p_session_token); v_run:=public.s2_get_active_run(v_room); perform public.s3b_refresh_puzzle(v_run.run_id);
  return jsonb_build_object('active',v_run.run_id is not null,'run_id',v_run.run_id,
    'scene',(select to_jsonb(s) from public.s3_runtime_scene_state s where run_id=v_run.run_id),
    'flow',(select to_jsonb(f)-'run_id' from public.s3b_run_state f where run_id=v_run.run_id),
    'me',(select to_jsonb(p)-'run_id'-'player_id' from public.s3b_player_progress p where run_id=v_run.run_id and player_id=v_player.player_id),
    'queued_first_messages',case when (select count(*)=3 from public.s3b_player_progress where run_id=v_run.run_id and first_meeting_locked_at is not null and grab_complete and left_start_room)
      then (select coalesce(jsonb_agg(jsonb_build_object('role_slot',rp.role_slot,'choice_id',pp.first_meeting_choice) order by rp.role_slot),'[]') from public.s3b_player_progress pp join public.s1_room_players rp using(player_id) where pp.run_id=v_run.run_id) else '[]'::jsonb end,
    'act4_revealed',case when (select count(*)=3 from public.s3b_player_progress where run_id=v_run.run_id and act4_locked_at is not null)
      then (select coalesce(jsonb_agg(jsonb_build_object('role_slot',rp.role_slot,'choice_id',pp.act4_choice_id) order by rp.role_slot),'[]') from public.s3b_player_progress pp join public.s1_room_players rp using(player_id) where pp.run_id=v_run.run_id) else '[]'::jsonb end);
end; $$;

revoke execute on function public.s3b_set_scene(uuid,text,text,text,text,text) from public,anon,authenticated;
revoke execute on function public.s3b_refresh_puzzle(uuid) from public,anon,authenticated;
grant execute on function public.s3b_initialize_flow(text,text),public.s3b_submit_act1_choice(text,text,text),public.s3b_submit_first_meeting(text,text,text),public.s3b_grab(text,text),public.s3b_leave_start_room(text,text),public.s3b_apply_meeting_resolution(text,text),public.s3b_complete_foldback(text,text),public.s3b_follow_sign(text,text),public.s3b_submit_library_code(text,text,text),public.s3b_submit_act4_choice(text,text,text),public.s3b_apply_act5_resolution(text,text),public.s3b_get_player_state(text,text) to anon,authenticated;
