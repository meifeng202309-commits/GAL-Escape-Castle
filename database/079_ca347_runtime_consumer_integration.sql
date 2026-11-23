begin;

alter function public.s3b_submit_act1_choice(text,text,text) rename to s3b_submit_act1_choice_pre079;
revoke execute on function public.s3b_submit_act1_choice_pre079(text,text,text) from public,anon,authenticated;

create function public.s3b_submit_act1_choice(p_room_code text,p_session_token text,p_choice_id text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare
  room text:=upper(trim(p_room_code));
  player public.s1_room_players%rowtype;
  run public.game_runs%rowtype;
  result jsonb;
begin
  result:=public.s3b_submit_act1_choice_pre079(p_room_code,p_session_token,p_choice_id);
  if p_choice_id='check_phone' then
    player:=public.s1_get_player_by_session(room,p_session_token);
    run:=public.s2_get_active_run(room);
    update public.s3b_player_progress
      set act1_text_keys='["act01-a.014","act01-g.005"]'::jsonb
      where run_id=run.run_id and player_id=player.player_id and act1_choice_id='check_phone';
  end if;
  return result;
end$$;

revoke all on function public.s3b_submit_act1_choice(text,text,text) from public;
grant execute on function public.s3b_submit_act1_choice(text,text,text) to anon,authenticated;

commit;
