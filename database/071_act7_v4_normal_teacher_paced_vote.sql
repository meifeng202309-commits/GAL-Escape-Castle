-- V4 Package C (bounded S5 slice): keep NORMAL ACT6-8 discussions
-- Teacher-paced and bind Teacher vote-opening to the exact current round.

begin;

create or replace function public.s5_configure_discussion(p_session uuid,p_phase text)
returns void language plpgsql security definer set search_path=public as $$
declare
  discussion_secs int;
  vote_secs int;
  options jsonb;
  policy text;
  maxr int;
  fallback text;
  mode text;
begin
  select g.run_mode into mode
  from public.s5_rounds r
  join public.game_runs g on g.run_id=r.run_id
  where r.discussion_session_id=p_session;
  if not found then raise exception 'Sprint 5 round identity is missing.'; end if;

  discussion_secs:=case
    when mode='normal' then 10800
    when p_phase='act6_vote' then 90
    when p_phase='act8_final_vote' then 180
    else 15
  end;
  vote_secs:=case when mode='normal' then 10800 else 60 end;
  options:=case p_phase
    when'act6_vote'then'[{"id":"escape","label":"act06.002"},{"id":"1897","label":"act06.003"},{"id":"time_stopped","label":"act06.004"},{"id":"trapped","label":"act06.005"}]'::jsonb
    when'act7_vote'then'[{"id":"clock_a","label":"act07.008"},{"id":"clock_b","label":"act07.009"},{"id":"clock_c","label":"act07.010"}]'::jsonb
    else'[{"id":"main_gate","label":"act08.001"},{"id":"west_tower","label":"act08.002"}]'::jsonb
  end;
  policy:=case p_phase when'act6_vote'then'SINGLE_REVOTE_THEN_FALLBACK'when'act7_vote'then'REPEAT_UNTIL_MAJORITY'else'NO_TIE_POSSIBLE'end;
  maxr:=case when p_phase='act6_vote'then 1 end;
  fallback:=case when p_phase='act6_vote'then'portrait_fixed_fallback'end;

  insert into public.discussion_sessions(
    discussion_session_id,run_id,scene_id,phase_key,step_key,round_no,vote_round,
    topic,status,show_initial_choices,allow_free_text,require_final_vote,vote_options,
    tie_policy,discussion_time_limit_sec,vote_time_limit_sec,silent_texting_mode
  )
  select r.discussion_session_id,r.run_id,
    case p_phase when'act6_vote'then'act6_portrait'when'act7_vote'then'act7_clock_room'else'act8_route'end,
    p_phase,'sprint5_round',r.vote_round,r.vote_round,r.topic_text_key,'discussion',false,true,true,
    options,policy,discussion_secs,vote_secs,true
  from public.s5_rounds r where r.discussion_session_id=p_session
  on conflict(discussion_session_id)do nothing;

  update public.discussion_sessions
  set phase_key=p_phase,status='discussion',started_at=now(),
      phase_deadline=now()+make_interval(secs=>discussion_secs),ended_at=null,outcome=null,
      show_initial_choices=p_phase='act8_final_vote',allow_free_text=true,allow_pocket=true,
      allow_memories_observations=true,allow_share_photo=p_phase in('act6_vote','act8_final_vote'),
      require_final_vote=true,vote_options=options,tie_policy=policy,revote_window_sec=15,
      max_revotes=maxr,fallback_resolution=fallback,
      discussion_time_limit_sec=discussion_secs,vote_time_limit_sec=vote_secs,
      silent_texting_mode=true
  where discussion_session_id=p_session;
  if not found then raise exception 'Sprint 5 canonical discussion link is missing.'; end if;
end$$;

revoke execute on function public.s5_configure_discussion(uuid,text) from public,anon,authenticated;

-- The legacy two-argument endpoint cannot prove which rendered round the click
-- belongs to. Keep it present for catalog compatibility but make it unusable.
create or replace function public.s5_teacher_open_vote(p_room_code text,p_teacher_token text)
returns jsonb language plpgsql security definer set search_path=public as $$
begin
  perform public.s1_assert_teacher(upper(trim(p_room_code)),p_teacher_token);
  raise exception 'Expected Sprint 5 run, phase, round and discussion identity are required.';
end$$;
revoke execute on function public.s5_teacher_open_vote(text,text) from public,anon,authenticated;

create function public.s5_teacher_open_vote(
  p_room_code text,
  p_teacher_token text,
  p_expected_run_id uuid,
  p_expected_phase text,
  p_expected_vote_round integer,
  p_expected_discussion_session_id uuid
) returns jsonb language plpgsql security definer set search_path=public as $$
declare
  room text:=upper(trim(p_room_code));
  g public.game_runs%rowtype;
  s public.s5_run_state%rowtype;
  r public.s5_rounds%rowtype;
  d public.discussion_sessions%rowtype;
  vote_secs integer;
begin
  perform public.s1_assert_teacher(room,p_teacher_token);
  select * into g from public.game_runs
  where run_id=p_expected_run_id and room_code=room and status='active' for update;
  if not found then raise exception 'Stale Sprint 5 run identity.'; end if;

  select * into s from public.s5_run_state where run_id=g.run_id for update;
  if not found or s.phase_key<>p_expected_phase or s.vote_round<>p_expected_vote_round then
    raise exception 'Stale Sprint 5 phase or round identity.';
  end if;

  select * into r from public.s5_rounds
  where discussion_session_id=p_expected_discussion_session_id and run_id=g.run_id
    and phase_key=p_expected_phase and vote_round=p_expected_vote_round for update;
  if not found then raise exception 'Stale Sprint 5 discussion identity.'; end if;

  select * into d from public.discussion_sessions
  where discussion_session_id=r.discussion_session_id and run_id=g.run_id for update;
  if not found or d.phase_key<>p_expected_phase or d.vote_round<>p_expected_vote_round or d.status<>'discussion' then
    raise exception 'Current Sprint 5 discussion is not open.';
  end if;

  vote_secs:=case when g.run_mode='normal' then 10800 else d.vote_time_limit_sec end;
  update public.discussion_sessions
  set status='voting',vote_time_limit_sec=vote_secs,
      phase_deadline=now()+make_interval(secs=>vote_secs)
  where discussion_session_id=d.discussion_session_id and status='discussion';
  if not found then raise exception 'Current Sprint 5 discussion changed before vote opening.'; end if;

  insert into public.runtime_events(
    run_id,room_code,discussion_session_id,event_type,details,scene_id,phase_key,
    step_key,event_source,validity,behavior_scoring,interaction_id
  ) values(
    g.run_id,room,d.discussion_session_id,'teacher_intervention_s5_vote_opened',
    jsonb_build_object('vote_round',s.vote_round,'expected_phase',s.phase_key),
    null,s.phase_key,null,'teacher_override','valid',false,d.discussion_session_id
  );
  return jsonb_build_object('ok',true,'run_id',g.run_id,
    'discussion_session_id',d.discussion_session_id,'phase_key',s.phase_key,
    'vote_round',s.vote_round,'phase_deadline',now()+make_interval(secs=>vote_secs));
end$$;
revoke execute on function public.s5_teacher_open_vote(text,text,uuid,text,integer,uuid) from public;
grant execute on function public.s5_teacher_open_vote(text,text,uuid,text,integer,uuid) to anon,authenticated;

create or replace function public.s5_teacher_add_time(
  p_room_code text,p_teacher_token text,p_seconds integer
) returns jsonb language plpgsql security definer set search_path=public as $$
declare
  room text:=upper(trim(p_room_code));
  g public.game_runs%rowtype;
  s public.s5_run_state%rowtype;
  sid uuid;
begin
  if p_seconds<1 or p_seconds>600 then raise exception 'Invalid time extension.'; end if;
  perform public.s1_assert_teacher(room,p_teacher_token);
  g:=public.s2_get_active_run(room);
  if g.run_mode='normal' then
    return jsonb_build_object('ok',false,'applicable',false,'reason','NORMAL_TEACHER_PACED');
  end if;

  select * into s from public.s5_run_state where run_id=g.run_id;
  select discussion_session_id into sid from public.s5_rounds
  where run_id=g.run_id and phase_key=s.phase_key and vote_round=s.vote_round;
  update public.discussion_sessions
  set status=case when status='waiting_for_missing_player'then'voting'else status end,
      phase_deadline=greatest(coalesce(phase_deadline,now()),now())+make_interval(secs=>p_seconds)
  where discussion_session_id=sid and status in('discussion','voting','waiting_for_missing_player');
  if not found then raise exception 'Current Sprint 5 discussion cannot receive time.'; end if;

  insert into public.runtime_events(
    run_id,room_code,discussion_session_id,event_type,details,scene_id,phase_key,
    step_key,event_source,validity,behavior_scoring,interaction_id
  ) values(
    g.run_id,room,sid,'teacher_intervention_s5_time_added',
    jsonb_build_object('seconds',p_seconds,'vote_round',s.vote_round),
    null,s.phase_key,null,'teacher_override','valid',false,sid
  );
  return jsonb_build_object('ok',true,'applicable',true,'discussion_session_id',sid);
end$$;
revoke execute on function public.s5_teacher_add_time(text,text,integer) from public;
grant execute on function public.s5_teacher_add_time(text,text,integer) to anon,authenticated;

create or replace function public.s5_get_teacher_discussion_state(p_room_code text,p_teacher_token text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare
  room text:=upper(trim(p_room_code));g public.game_runs%rowtype;s public.s5_run_state%rowtype;
  d public.discussion_sessions%rowtype;sid uuid;msgs jsonb:='[]';votes jsonb:='[]';
begin
  perform public.s1_assert_teacher(room,p_teacher_token);g:=public.s2_get_active_run(room);
  select * into s from public.s5_run_state where run_id=g.run_id;
  if not found then return jsonb_build_object('active',true,'sprint5_active',false);end if;
  select ds.* into d from public.discussion_sessions ds join public.s5_rounds r using(discussion_session_id)
  where r.run_id=g.run_id and r.phase_key=s.phase_key and r.vote_round=s.vote_round;
  if found then
    sid:=d.discussion_session_id;perform public.s2_refresh_discussion(sid);
    select * into d from public.discussion_sessions where discussion_session_id=sid;
    select coalesce(jsonb_agg(jsonb_build_object('display_name',rp.display_name,'role_slot',rp.role_slot,'message_text',m.message_text,'created_at',m.created_at)order by m.created_at),'[]') into msgs
    from public.dialogue_messages m join public.s1_room_players rp using(player_id) where m.discussion_session_id=sid;
    select coalesce(jsonb_agg(jsonb_build_object('display_name',rp.display_name,'role_slot',rp.role_slot,'submitted',v.player_id is not null,'choice_label',case when d.status='resolved'then v.choice_id end,'locked_at',v.locked_at)order by rp.role_slot),'[]') into votes
    from public.s1_room_players rp left join public.s5_votes v on v.player_id=rp.player_id and v.run_id=g.run_id and v.phase_key=s.phase_key and v.vote_round=s.vote_round where rp.room_code=room;
  end if;
  return jsonb_build_object(
    'active',true,'sprint5_active',true,'canonical_flow_active',true,
    'run',jsonb_build_object('run_id',g.run_id,'run_mode',g.run_mode,'behavior_dataset_eligible',g.behavior_dataset_eligible),
    'discussion',case when d.discussion_session_id is null then null else jsonb_build_object(
      'discussion_session_id',d.discussion_session_id,'phase_key',s.phase_key,'topic',d.topic,
      'status',d.status,'vote_round',s.vote_round,'phase_deadline',d.phase_deadline,'outcome',d.outcome)end,
    'messages',msgs,'current_votes',votes,
    'teacher_override',jsonb_build_object('allowed_actions','[]'::jsonb,'history','[]'::jsonb));
end$$;
revoke execute on function public.s5_get_teacher_discussion_state(text,text) from public;
grant execute on function public.s5_get_teacher_discussion_state(text,text) to anon,authenticated;

commit;
