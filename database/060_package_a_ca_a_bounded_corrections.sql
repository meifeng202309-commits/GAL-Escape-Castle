-- CA-A bounded corrections: contain split-start authority and make ACT5 entry per-player.
begin;

-- The atomic wrapper remains browser-executable; the run-only primitive remains
-- callable by its owning server functions but is no longer a supported browser RPC.
revoke execute on function public.s2_start_run(text,text,text) from anon,authenticated;

alter table public.s3b_player_progress
  add column if not exists act6_handoff_observed_at timestamptz,
  add column if not exists act6_entered_at timestamptz;

-- Runs already inside Sprint5 when this correction is deployed must not be sent
-- backwards to a newly introduced player boundary.
update public.s3b_player_progress progress
set act6_handoff_observed_at=coalesce(progress.act6_handoff_observed_at,s5.act6_entered_at,s5.updated_at),
    act6_entered_at=coalesce(progress.act6_entered_at,s5.act6_entered_at,s5.updated_at)
from public.s5_run_state s5
where progress.run_id=s5.run_id;

create or replace function public.s9_observe_act5_handoff(
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
begin
  player:=public.s1_get_player_by_session(room,p_session_token);
  active_run:=public.s2_get_active_run(room);
  if active_run.run_id is null or active_run.run_id<>p_expected_run_id then
    raise exception 'The formal run changed. Refresh the ACT 5 handoff.';
  end if;
  perform 1 from public.game_runs where run_id=active_run.run_id for update;
  if not exists(select 1 from public.s3b_run_state where run_id=active_run.run_id and terminal_state='SPRINT3B_COMPLETE')
     or not exists(select 1 from public.s5_run_state where run_id=active_run.run_id) then
    raise exception 'The ACT 5 handoff is unavailable.';
  end if;
  update public.s3b_player_progress
  set act6_handoff_observed_at=coalesce(act6_handoff_observed_at,now()),updated_at=now()
  where run_id=active_run.run_id and player_id=player.player_id and act6_handoff_observed_at is null;
  if not found and not exists(select 1 from public.s3b_player_progress where run_id=active_run.run_id and player_id=player.player_id) then
    raise exception 'Player progress is unavailable.';
  end if;
  return jsonb_build_object('ok',true,'run_id',active_run.run_id,'handoff_observed',true);
end;
$$;

revoke all on function public.s9_observe_act5_handoff(text,text,uuid) from public;
grant execute on function public.s9_observe_act5_handoff(text,text,uuid) to anon,authenticated;

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
begin
  player:=public.s1_get_player_by_session(room,p_session_token);
  active_run:=public.s2_get_active_run(room);
  if active_run.run_id is null or active_run.run_id<>p_expected_run_id then
    raise exception 'The formal run changed. Refresh before entering ACT 6.';
  end if;
  perform 1 from public.game_runs where run_id=active_run.run_id for update;
  if not exists(select 1 from public.s3b_run_state where run_id=active_run.run_id and terminal_state='SPRINT3B_COMPLETE')
     or not exists(select 1 from public.s5_run_state where run_id=active_run.run_id) then
    raise exception 'ACT 6 preparation is unavailable.';
  end if;
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
  return jsonb_build_object('ok',true,'run_id',active_run.run_id,'act6_entered',true,'player_location','portrait_hall');
end;
$$;

revoke all on function public.s9_enter_act6(text,text,uuid) from public;
grant execute on function public.s9_enter_act6(text,text,uuid) to anon,authenticated;

commit;
