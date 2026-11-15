begin;

alter table public.s3b_player_progress
  add column if not exists castle_voice_heard_at timestamptz,
  add column if not exists act6_voice_intro_ack_at timestamptz;

alter function public.s3b_initialize_flow(text,text) rename to s3b_initialize_flow_pre077;
revoke execute on function public.s3b_initialize_flow_pre077(text,text) from public,anon,authenticated;
create function public.s3b_initialize_flow(p_room_code text,p_teacher_token text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare result jsonb;active_run_id uuid;
begin
  result:=public.s3b_initialize_flow_pre077(p_room_code,p_teacher_token);
  active_run_id:=(result->>'run_id')::uuid;
  update public.s3b_player_progress progress set castle_voice_heard_at=coalesce(progress.castle_voice_heard_at,clock_timestamp())
  from public.s1_room_players player
  where progress.run_id=active_run_id and player.player_id=progress.player_id and player.role_slot='GAL-A';
  return result;
end$$;

create or replace function public.s3b_submit_act1_choice(p_room_code text,p_session_token text,p_choice_id text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare room text:=upper(trim(p_room_code));player public.s1_room_players%rowtype;run public.game_runs%rowtype;keys jsonb;
begin
  player:=public.s1_get_player_by_session(room,p_session_token);run:=public.s2_get_active_run(room);
  if not exists(select 1 from public.s3_runtime_scene_state where run_id=run.run_id and scene_id='act1_wake_up'and phase_key='private_first_action')then raise exception'ACT 1 choice is out of phase.';end if;
  if not((player.role_slot='GAL-A'and p_choice_id in('study_map','check_sound','study_number_note','search_room'))or(player.role_slot='GAL-B'and p_choice_id in('read_diary','check_door','check_phone','check_vent'))or(player.role_slot='GAL-C'and p_choice_id in('read_notice','study_watch','try_star_key','check_mirror')))then raise exception'Invalid canonical ACT 1 choice for this role.';end if;
  keys:=case p_choice_id when'study_map'then'["act01-g.023","act01-g.024"]'when'check_sound'then'["act01-g.025","act01-g.026","act01-g.027"]'when'study_number_note'then'["act01-g.007","act01-g.028","act01-g.029"]'when'search_room'then'["act01-g.030"]'when'read_diary'then'["act01-a.010"]'when'check_door'then'["act01-a.011","act01-a.012","act01-a.013"]'when'check_phone'then'["act01-a.014","act01-g.005","act01-a.014b"]'when'check_vent'then'["act01-a.015","act01-a.016"]'when'read_notice'then'["act01-l.016"]'when'study_watch'then'["act01-l.004","act01-g.028","act01-l.017"]'when'try_star_key'then'["act01-l.018","act01-l.019"]'else'["act01-l.020","act01-l.021"]'end::jsonb;
  update public.s3b_player_progress set act1_choice_id=p_choice_id,act1_locked_at=now(),act1_stage='consequence',act1_text_keys=keys where run_id=run.run_id and player_id=player.player_id and act1_stage='action'and act1_choice_id is null;
  if not found then raise exception'ACT 1 action is unavailable or already locked.';end if;
  return jsonb_build_object('ok',true,'act1_stage','consequence');
end$$;

alter function public.s5_get_player_state(text,text) rename to s5_get_player_state_pre077;
revoke execute on function public.s5_get_player_state_pre077(text,text) from public,anon,authenticated;
create function public.s5_get_player_state(p_room_code text,p_session_token text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare room text:=upper(trim(p_room_code));player public.s1_room_players%rowtype;run public.game_runs%rowtype;progress public.s3b_player_progress%rowtype;base jsonb;phase text;intro text;
begin
  player:=public.s1_get_player_by_session(room,p_session_token);run:=public.s2_get_active_run(room);base:=public.s5_get_player_state_pre077(p_room_code,p_session_token);
  if run.run_id is null or not coalesce((base->>'active')::boolean,false)then return base;end if;
  select * into progress from public.s3b_player_progress where run_id=run.run_id and player_id=player.player_id;
  if not found then raise exception'Castle Voice player progress is unavailable.';end if;
  phase:=base#>>'{state,phase_key}';
  if phase like'act6%'then intro:=case when progress.castle_voice_heard_at is null then'runtime.castle_voice.first_audible'else'runtime.castle_voice.returning'end;end if;
  return base||jsonb_build_object('castle_voice_intro_key',intro,'castle_voice_intro_acknowledged',progress.act6_voice_intro_ack_at is not null);
end$$;

create function public.s10_ack_castle_voice_intro(p_room_code text,p_session_token text,p_expected_run_id uuid)
returns jsonb language plpgsql security definer set search_path=public as $$
declare room text:=upper(trim(p_room_code));player public.s1_room_players%rowtype;run public.game_runs%rowtype;s public.s5_run_state%rowtype;intro text;
begin
  player:=public.s1_get_player_by_session(room,p_session_token);
  select * into run from public.game_runs where room_code=room and status='active'for update;
  if not found or run.run_id<>p_expected_run_id then raise exception'Stale or invalid Castle Voice run identity.';end if;
  select * into s from public.s5_run_state where run_id=run.run_id;
  if not found or s.phase_key not like'act6%'then raise exception'Castle Voice introduction is unavailable.';end if;
  select case when castle_voice_heard_at is null then'runtime.castle_voice.first_audible'else'runtime.castle_voice.returning'end into intro from public.s3b_player_progress where run_id=run.run_id and player_id=player.player_id for update;
  if not found then raise exception'Castle Voice player progress is unavailable.';end if;
  update public.s3b_player_progress set castle_voice_heard_at=coalesce(castle_voice_heard_at,clock_timestamp()),act6_voice_intro_ack_at=coalesce(act6_voice_intro_ack_at,clock_timestamp()) where run_id=run.run_id and player_id=player.player_id;
  return jsonb_build_object('ok',true,'run_id',run.run_id,'intro_key',intro,'acknowledged',true);
end$$;

alter function public.s5_submit_vote(text,text,uuid,integer,uuid,text) rename to s5_submit_vote_pre077;
revoke execute on function public.s5_submit_vote_pre077(text,text,uuid,integer,uuid,text) from public,anon,authenticated;
create function public.s5_submit_vote(p_room_code text,p_session_token text,p_expected_discussion_session_id uuid,p_expected_vote_round int,p_client_request_id uuid,p_choice_id text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare room text:=upper(trim(p_room_code));player public.s1_room_players%rowtype;run public.game_runs%rowtype;state public.s5_run_state%rowtype;
begin
  player:=public.s1_get_player_by_session(room,p_session_token);run:=public.s2_get_active_run(room);
  select * into state from public.s5_run_state where run_id=run.run_id;
  if state.phase_key='act6_vote'and not exists(select 1 from public.s3b_player_progress where run_id=run.run_id and player_id=player.player_id and act6_voice_intro_ack_at is not null)then raise exception'Castle Voice introduction must be acknowledged before ACT 6 voting.';end if;
  return public.s5_submit_vote_pre077(p_room_code,p_session_token,p_expected_discussion_session_id,p_expected_vote_round,p_client_request_id,p_choice_id);
end$$;

alter function public.s5_advance(text,text) rename to s5_advance_pre077;
revoke execute on function public.s5_advance_pre077(text,text) from public,anon,authenticated;
create function public.s5_advance(p_room_code text,p_session_token text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare room text:=upper(trim(p_room_code));player public.s1_room_players%rowtype;run public.game_runs%rowtype;state public.s5_run_state%rowtype;
begin
  player:=public.s1_get_player_by_session(room,p_session_token);run:=public.s2_get_active_run(room);
  select * into state from public.s5_run_state where run_id=run.run_id;
  if state.phase_key='act6_answer'and exists(select 1 from public.s3b_player_progress where run_id=run.run_id and act6_voice_intro_ack_at is null)then raise exception'All players must acknowledge the Castle Voice introduction before leaving ACT 6.';end if;
  return public.s5_advance_pre077(p_room_code,p_session_token);
end$$;

revoke all on function public.s10_ack_castle_voice_intro(text,text,uuid) from public;
grant execute on function public.s3b_initialize_flow(text,text),public.s5_get_player_state(text,text),public.s10_ack_castle_voice_intro(text,text,uuid),public.s5_submit_vote(text,text,uuid,integer,uuid,text),public.s5_advance(text,text) to anon,authenticated;

commit;
