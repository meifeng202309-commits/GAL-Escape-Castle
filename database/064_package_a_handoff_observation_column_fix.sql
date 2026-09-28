-- Package A live correction: observe the handoff without writing a nonexistent
-- s3b_player_progress.updated_at column.
begin;

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
  set act6_handoff_observed_at=coalesce(act6_handoff_observed_at,now())
  where run_id=active_run.run_id and player_id=player.player_id and act6_handoff_observed_at is null;
  if not found and not exists(select 1 from public.s3b_player_progress where run_id=active_run.run_id and player_id=player.player_id) then
    raise exception 'Player progress is unavailable.';
  end if;
  return jsonb_build_object('ok',true,'run_id',active_run.run_id,'handoff_observed',true);
end;
$$;

revoke all on function public.s9_observe_act5_handoff(text,text,uuid) from public;
grant execute on function public.s9_observe_act5_handoff(text,text,uuid) to anon,authenticated;

commit;
