-- CA-327 focused correction: acknowledgement belongs to an entered ACT6 player.
begin;

alter function public.s10_ack_castle_voice_intro(text,text,uuid) rename to s10_ack_castle_voice_intro_pre078;
revoke execute on function public.s10_ack_castle_voice_intro_pre078(text,text,uuid) from public,anon,authenticated;

create function public.s10_ack_castle_voice_intro(
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
  run public.game_runs%rowtype;
  state public.s5_run_state%rowtype;
  progress public.s3b_player_progress%rowtype;
begin
  player:=public.s1_get_player_by_session(room,p_session_token);
  select * into run from public.game_runs where room_code=room and status='active'for update;
  if not found or run.run_id<>p_expected_run_id then raise exception'Stale or invalid Castle Voice run identity.';end if;
  select * into state from public.s5_run_state where run_id=run.run_id;
  select * into progress from public.s3b_player_progress where run_id=run.run_id and player_id=player.player_id;
  if not found or state.phase_key not like'act6%'or state.act6_entered_at is null or progress.act6_entered_at is null then
    raise exception'Castle Voice introduction is unavailable.';
  end if;
  return public.s10_ack_castle_voice_intro_pre078(p_room_code,p_session_token,p_expected_run_id);
end;
$$;

revoke all on function public.s10_ack_castle_voice_intro(text,text,uuid) from public;
grant execute on function public.s10_ack_castle_voice_intro(text,text,uuid) to anon,authenticated;

commit;
