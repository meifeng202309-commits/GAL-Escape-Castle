-- Allow canonically completed ACT1 players to enter ACT2 even when their
-- missing ACT1 choice was intentionally left null by a Teacher Override.

create or replace function public.s3b_submit_first_meeting(
  p_room_code text,p_session_token text,p_choice_id text
) returns jsonb language plpgsql security definer set search_path=public as $$
declare
  r text:=upper(trim(p_room_code));
  p public.s1_room_players%rowtype;
  g public.game_runs%rowtype;
  s public.s3_runtime_scene_state%rowtype;
  progress public.s3b_player_progress%rowtype;
  validity text;
  duration_ms bigint;
begin
  if p_choice_id not in ('library','great_hall','main_gate','west_tower','chapel','help') then
    raise exception 'Invalid ACT 2 first-meeting choice.';
  end if;
  p:=public.s1_get_player_by_session(r,p_session_token);
  select * into g from public.game_runs
  where room_code=r and status='active' for update;
  if not found then raise exception 'No active formal run.';end if;
  select * into s from public.s3_runtime_scene_state where run_id=g.run_id;
  if s.scene_id<>'act2_first_contact' or s.phase_key<>'private_first_meeting' then
    raise exception 'ACT 2 first meeting transition is unavailable.';
  end if;
  select * into progress from public.s3b_player_progress
  where run_id=g.run_id and player_id=p.player_id for update;
  if progress.act1_stage<>'complete' then raise exception 'ACT 1 is not complete.';end if;
  if progress.first_meeting_choice is not null then
    raise exception 'ACT 2 first meeting transition is unavailable.';
  end if;
  validity:=case when progress.first_meeting_started_at is null then 'legacy_missing_start' else 'valid' end;
  duration_ms:=case when progress.first_meeting_started_at is null then null
    else round(extract(epoch from(now()-progress.first_meeting_started_at))*1000)::bigint end;
  perform public.s3b_log_formal_event_at_context(
    g.run_id,'first_meeting_choice_locked',p.player_id,'player',
    s.scene_id,s.phase_key,s.step_key,
    jsonb_build_object('choice_id',p_choice_id,'response_duration_ms',duration_ms),
    validity,true);
  update public.s3b_player_progress
  set first_meeting_choice=p_choice_id,first_meeting_locked_at=now(),
      first_meeting_timing_validity=validity
  where run_id=g.run_id and player_id=p.player_id;
  return jsonb_build_object('ok',true);
end;
$$;

revoke execute on function public.s3b_submit_first_meeting(text,text,text) from public;
grant execute on function public.s3b_submit_first_meeting(text,text,text) to anon,authenticated;
