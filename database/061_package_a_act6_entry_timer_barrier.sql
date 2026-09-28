-- CA-A A-CA-002-R1: prepare ACT6 without consuming its timer, then open it at the all-player entry barrier.
begin;

create or replace function public.s5_ensure_initialized(p_run uuid) returns boolean
language plpgsql security definer set search_path=public as $$
declare room text;created_new boolean:=false;sid uuid;
begin
 perform 1 from public.game_runs where run_id=p_run for update;
 if not exists(select 1 from public.s3b_run_state where run_id=p_run and terminal_state='SPRINT3B_COMPLETE') then return false;end if;
 insert into public.s5_run_state(run_id)values(p_run)on conflict(run_id)do nothing;
 if found then
  created_new:=true;
  insert into public.s5_rounds(run_id,phase_key,vote_round,topic_text_key)
  values(p_run,'act6_vote',1,'act06.001')returning discussion_session_id into sid;
  -- Deliberately do not call s5_configure_discussion or replace the ACT5 scene.
  -- The canonical 90-second window starts only when s9_enter_act6 reaches the
  -- all-player barrier.
  update public.s3_runtime_scene_state set allow_share_photo=true where run_id=p_run;
  select room_code into room from public.game_runs where run_id=p_run;
  perform public.s2_log_event(p_run,room,sid,'s5_prepared',null,
    jsonb_build_object('event_source','automatic_transition','timer_started',false,'behavior_scoring',false));
 end if;
 return created_new;
end;
$$;

revoke execute on function public.s5_ensure_initialized(uuid) from public,anon,authenticated;

create or replace function public.s9_enter_act6(
  p_room_code text,
  p_session_token text,
  p_expected_run_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  room text:=upper(trim(p_room_code));
  player public.s1_room_players%rowtype;
  active_run public.game_runs%rowtype;
  progress public.s3b_player_progress%rowtype;
  sprint5 public.s5_run_state%rowtype;
  entered_count integer;
  sid uuid;
begin
  player:=public.s1_get_player_by_session(room,p_session_token);
  active_run:=public.s2_get_active_run(room);
  if active_run.run_id is null or active_run.run_id<>p_expected_run_id then
    raise exception 'The formal run changed. Refresh before entering ACT 6.';
  end if;
  perform 1 from public.game_runs where run_id=active_run.run_id for update;
  if not exists(select 1 from public.s3b_run_state where run_id=active_run.run_id and terminal_state='SPRINT3B_COMPLETE') then
    raise exception 'ACT 5 is not complete.';
  end if;
  select * into sprint5 from public.s5_run_state where run_id=active_run.run_id for update;
  if not found then raise exception 'ACT 6 preparation is unavailable.';end if;
  select * into progress from public.s3b_player_progress
  where run_id=active_run.run_id and player_id=player.player_id for update;
  if progress.act6_handoff_observed_at is null then
    raise exception 'Observe the ACT 5 route consequence before entering ACT 6.';
  end if;
  if progress.act6_entered_at is null then
    update public.s3b_player_progress
    set player_location='portrait_hall',act6_entered_at=now(),updated_at=now()
    where run_id=active_run.run_id and player_id=player.player_id;
    perform public.s2_log_event(active_run.run_id,room,null,'act6_entered',player.player_id,
      jsonb_build_object('event_source','player_transition','player_location','portrait_hall','behavior_scoring',false));
  end if;
  select count(*) into entered_count from public.s3b_player_progress
  where run_id=active_run.run_id and act6_entered_at is not null;
  if entered_count=3 and sprint5.act6_entered_at is null then
    select discussion_session_id into sid from public.s5_rounds
    where run_id=active_run.run_id and phase_key='act6_vote' and vote_round=1;
    if sid is null then raise exception 'ACT 6 discussion preparation is unavailable.';end if;
    perform public.s5_configure_discussion(sid,'act6_vote');
    perform public.s5_set_scene(active_run.run_id,'act6_portrait','act6_vote','round_1','ACTION_SCREEN','act06.001');
    update public.s5_run_state set act6_entered_at=now(),updated_at=now() where run_id=active_run.run_id;
    perform public.s2_log_event(active_run.run_id,room,sid,'act6_discussion_started',null,
      jsonb_build_object('event_source','all_player_entry_barrier','entered_players',entered_count,'behavior_scoring',false));
  end if;
  return jsonb_build_object('ok',true,'run_id',active_run.run_id,'act6_entered',true,
    'player_location','portrait_hall','entered_players',entered_count,'discussion_started',entered_count=3);
end;
$$;

revoke all on function public.s9_enter_act6(text,text,uuid) from public;
grant execute on function public.s9_enter_act6(text,text,uuid) to anon,authenticated;

commit;
