begin;

alter table public.s3b_player_progress
  add column if not exists library_discovery_ack_at timestamptz;

create or replace function public.s10_enter_library_discovery(p_run uuid)
returns void language plpgsql security definer set search_path=public as $$
begin
  insert into public.s3_group_items(run_id,item_key,label_text_key)
  values(p_run,'library_photo_1897','item.photo_1897'),
        (p_run,'library_torn_note','item.torn_note')
  on conflict do nothing;
  perform public.s3b_set_scene(
    p_run,'act3_library','library_discovery','box_opened',
    'CINEMATIC_MESSAGE','act03.015'
  );
end;
$$;

revoke all on function public.s10_enter_library_discovery(uuid) from public,anon,authenticated;

create or replace function public.s3b_refresh_puzzle(p_run uuid)
returns void language plpgsql security definer set search_path=public as $$
declare s public.s3b_run_state%rowtype;t int;n int;room text;k text;prefix text;
begin
  select * into s from public.s3b_run_state where run_id=p_run for update;
  if not found or s.puzzle_resolved_at is not null or s.puzzle_deadline is null or now()<s.puzzle_deadline then return;end if;
  t:=least(8,4+floor(extract(epoch from(now()-s.puzzle_deadline))/15)::int);
  select room_code into room from public.game_runs where run_id=p_run;
  for n in s.puzzle_hint_stage+1..t loop
    if n<4 then continue;end if;
    k:=case n when 4 then'act03.014'when 5 then'act03.017'when 6 then'act03.018'when 7 then'act03.019'else'act03.020'end;
    prefix:=left('41739',n-3);
    update public.s3b_run_state set puzzle_hint_stage=n,puzzle_locked_prefix=prefix,updated_at=now()where run_id=p_run;
    perform public.s2_log_event(p_run,room,null,'puzzle_fallback_hint',null,jsonb_build_object(
      'hint_stage',n,'locked_prefix',prefix,'text_key',k,'resolution_source','system_fallback','behavior_scoring',false));
  end loop;
  if t=8 then
    update public.s3b_run_state set puzzle_resolved_at=coalesce(puzzle_resolved_at,now()),updated_at=now()where run_id=p_run;
    perform public.s2_log_event(p_run,room,null,'puzzle_resolved_system_fallback',null,jsonb_build_object(
      'resolution_source','system_fallback','behavior_scoring',false,'text_key','act03.015'));
    perform public.s10_enter_library_discovery(p_run);
  end if;
end;
$$;

create or replace function public.s3b_submit_library_code(
  p_room_code text,p_session_token text,p_client_request_id uuid,p_code text
) returns jsonb language plpgsql security definer set search_path=public as $$
declare
  v_room text:=upper(trim(p_room_code));
  v_player public.s1_room_players%rowtype;
  v_run public.game_runs%rowtype;
  v_state public.s3b_run_state%rowtype;
  v_existing public.s3b_library_attempts%rowtype;
  v_n integer;v_hint integer;v_correct boolean;
begin
  if p_client_request_id is null then raise exception 'Puzzle request identity is required.';end if;
  if p_code is null or p_code !~ '^[0-9]{5}$' then raise exception 'Library code must contain exactly five digits.';end if;
  v_player:=public.s1_get_player_by_session(v_room,p_session_token);
  select * into v_run from public.game_runs where room_code=v_room and status='active' for update;
  if not found then raise exception 'No active formal run.';end if;
  select * into v_existing from public.s3b_library_attempts
  where run_id=v_run.run_id and submitted_by=v_player.player_id and client_request_id=p_client_request_id;
  if found then
    if v_existing.submitted_value<>p_code then raise exception 'Puzzle request identity was reused with a different code.';end if;
    return jsonb_build_object('ok',true,'correct',v_existing.correct,'attempt_number',v_existing.attempt_number,
      'client_request_id',p_client_request_id,'idempotent_replay',true);
  end if;
  if not exists(select 1 from public.s3_runtime_scene_state
    where run_id=v_run.run_id and scene_id='act3_library' and phase_key='library_box') then
    raise exception 'Library Box transition is unavailable.';
  end if;
  perform public.s3b_refresh_puzzle(v_run.run_id);
  select * into v_state from public.s3b_run_state where run_id=v_run.run_id for update;
  if not found or not v_state.party_physically_reunited or v_state.puzzle_resolved_at is not null then
    raise exception 'Library Box is not accepting attempts.';
  end if;
  if left(p_code,length(v_state.puzzle_locked_prefix))<>v_state.puzzle_locked_prefix then
    raise exception 'Locked puzzle wheels cannot be changed.';
  end if;
  v_correct:=p_code='41739';
  update public.s3b_run_state set puzzle_attempt_number=puzzle_attempt_number+1,
    puzzle_hint_stage=case when v_correct then puzzle_hint_stage else greatest(puzzle_hint_stage,least(puzzle_attempt_number+1,3)) end,
    puzzle_resolved_at=case when v_correct then now() else null end,updated_at=now()
  where run_id=v_run.run_id returning puzzle_attempt_number,puzzle_hint_stage into v_n,v_hint;
  insert into public.s3b_library_attempts(run_id,attempt_number,submitted_by,submitted_value,submitted_at,correct,client_request_id)
  values(v_run.run_id,v_n,v_player.player_id,p_code,now(),v_correct,p_client_request_id);
  perform public.s3b_log_formal_event(v_run.run_id,'library_code_submitted',v_player.player_id,'player',
    jsonb_build_object('attempt_number',v_n,'correct',v_correct,'hint_stage',v_hint),'valid',false,null,p_client_request_id);
  if v_correct then
    perform public.s10_enter_library_discovery(v_run.run_id);
  else
    perform public.s2_log_event(v_run.run_id,v_room,null,'puzzle_hint_used',v_player.player_id,
      jsonb_build_object('attempt_number',v_n,'hint_stage',v_hint,'behavior_scoring',false,'client_request_id',p_client_request_id));
  end if;
  return jsonb_build_object('ok',true,'correct',v_correct,'attempt_number',v_n,'hint_stage',v_hint,
    'client_request_id',p_client_request_id,'idempotent_replay',false);
end;
$$;

create or replace function public.s3b_ack_library_discovery(
  p_room_code text,p_session_token text,p_expected_run_id uuid
) returns jsonb language plpgsql security definer set search_path=public as $$
declare
  room text:=upper(trim(p_room_code));p public.s1_room_players%rowtype;
  g public.game_runs%rowtype;acks int;advanced boolean:=false;
begin
  p:=public.s1_get_player_by_session(room,p_session_token);
  select * into g from public.game_runs where room_code=room and status='active' for update;
  if not found or g.run_id<>p_expected_run_id then raise exception 'Stale or invalid discovery run identity.';end if;
  if not exists(select 1 from public.s3_runtime_scene_state where run_id=g.run_id
    and scene_id='act3_library' and phase_key='library_discovery' and step_key='box_opened') then
    raise exception 'Library discovery acknowledgement is unavailable.';
  end if;
  if (select count(*) from public.s3_group_items where run_id=g.run_id
      and item_key in('library_photo_1897','library_torn_note'))<>2 then
    raise exception 'Library discoveries are incomplete.';
  end if;
  update public.s3b_player_progress set library_discovery_ack_at=coalesce(library_discovery_ack_at,now())
  where run_id=g.run_id and player_id=p.player_id;
  select count(*) into acks from public.s3b_player_progress
  where run_id=g.run_id and library_discovery_ack_at is not null;
  if acks=3 then
    perform public.s3b_set_scene(g.run_id,'act4_known_unknown','private_route_choice','initial','ACTION_SCREEN','act04-05.002');
    advanced:=true;
  end if;
  return jsonb_build_object('ok',true,'run_id',g.run_id,'acknowledged_players',acks,'advanced_to_act4',advanced);
end;
$$;

revoke all on function public.s3b_ack_library_discovery(text,text,uuid) from public;
grant execute on function public.s3b_ack_library_discovery(text,text,uuid) to anon,authenticated;

commit;
