\set ON_ERROR_STOP on
begin;

do $$
declare
  suffix text:=substr(replace(gen_random_uuid()::text,'-',''),1,8);
  room text:='G147'||upper(substr(suffix,1,4));
  teacher text:='teacher-'||suffix;
  gitte_join text:='g-'||suffix;
  anna_join text:='a-'||suffix;
  linda_join text:='l-'||suffix;
  gitte text;
  anna text;
  linda text;
  fixture_run_id uuid;
  anna_id uuid;
  projection jsonb;
  ack jsonb;
begin
  perform public.s1_create_room(room,teacher,gitte_join,anna_join,linda_join);
  gitte:=public.s1_join_player(room,gitte_join)->>'session_token';
  anna:=public.s1_join_player(room,anna_join)->>'session_token';
  linda:=public.s1_join_player(room,linda_join)->>'session_token';
  perform public.s9_start_formal_game(room,teacher,'normal');
  projection:=public.s3b_initialize_flow(room,teacher);
  fixture_run_id:=(projection->>'run_id')::uuid;

  if (select castle_voice_heard_at is null from public.s3b_player_progress p join public.s1_room_players rp using(player_id) where p.run_id=fixture_run_id and rp.role_slot='GAL-A') then
    raise exception 'Gitte must already have heard the Castle Voice in ACT 1.';
  end if;
  if exists(select 1 from public.s3b_player_progress p join public.s1_room_players rp using(player_id) where p.run_id=fixture_run_id and rp.role_slot in('GAL-B','GAL-C') and p.castle_voice_heard_at is not null) then
    raise exception 'Anna and Linda must remain unheard before ACT 6.';
  end if;

  select player_id into anna_id from public.s1_room_players where room_code=room and role_slot='GAL-B';
  update public.s3b_player_progress set act1_stage='action',act1_choice_id=null,act1_locked_at=null where run_id=fixture_run_id and player_id=anna_id;
  perform public.s3b_submit_act1_choice(room,anna,'check_phone');
  if (select act1_text_keys from public.s3b_player_progress where run_id=fixture_run_id and player_id=anna_id) <> '["act01-a.014","act01-g.005","act01-a.014b"]'::jsonb then
    raise exception 'Anna check-phone canonical order is incorrect.';
  end if;

  insert into public.s5_run_state(run_id) values(fixture_run_id);
  projection:=public.s5_get_player_state(room,anna);
  if projection->>'castle_voice_intro_key'<>'runtime.castle_voice.first_audible' or (projection->>'castle_voice_intro_acknowledged')::boolean then
    raise exception 'Anna ACT 6 first-audible projection is incorrect: %',projection;
  end if;
  ack:=public.s10_ack_castle_voice_intro(room,anna,fixture_run_id);
  if ack->>'intro_key'<>'runtime.castle_voice.first_audible' then raise exception 'First acknowledgement returned the wrong key.';end if;
  ack:=public.s10_ack_castle_voice_intro(room,anna,fixture_run_id);
  if ack->>'intro_key'<>'runtime.castle_voice.returning' then raise exception 'Reconnect acknowledgement did not use returning copy.';end if;
  projection:=public.s5_get_player_state(room,anna);
  if not (projection->>'castle_voice_intro_acknowledged')::boolean then raise exception 'Acknowledgement was not durable.';end if;

  begin
    perform public.s10_ack_castle_voice_intro(room,linda,gen_random_uuid());
    raise exception 'Stale run identity was accepted.';
  exception when others then
    if sqlerrm='Stale run identity was accepted.' then raise;end if;
  end;
end$$;

rollback;
