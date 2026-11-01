\set ON_ERROR_STOP on
begin;

create or replace function pg_temp.expect_error(command text,expected text)returns void language plpgsql as $$
begin execute command;raise exception'Expected error containing %, but command succeeded',expected;
exception when others then if sqlerrm like'Expected error containing %'then raise;end if;if position(expected in sqlerrm)=0 then raise exception'Expected %, got %',expected,sqlerrm;end if;end$$;

select public.s1_create_room('OPT74B','teacher-b','join-a','join-b','join-c');

do $$
declare
  ja jsonb;jb jsonb;jc jsonb;run_a uuid;run_b uuid;player_a uuid;discussion uuid;generation_a uuid;generation_b uuid;state jsonb;
begin
  ja:=public.s1_join_player('OPT74B','join-a');jb:=public.s1_join_player('OPT74B','join-b');jc:=public.s1_join_player('OPT74B','join-c');
  select session_generation into generation_a from public.s1_rooms where room_code='OPT74B';
  if ja->>'session_generation'<>generation_a::text then raise exception'Run A join generation mismatch';end if;
  run_a:=(public.s9_start_formal_game('OPT74B','teacher-b','normal')->>'run_id')::uuid;
  player_a:=(ja->>'player_id')::uuid;

  insert into public.s3_item_catalog(item_key,name_text_key)values('opt74_test_item','opt74.test.item')on conflict do nothing;
  insert into public.s3_player_items(run_id,item_key,physical_owner_id,acquired_at)
    values(run_a,'opt74_test_item',player_a,clock_timestamp());
  insert into public.discussion_sessions(run_id,scene_id,phase_key,step_key,round_no,vote_round,topic,status,discussion_time_limit_sec,vote_time_limit_sec)
    values(run_a,'option_b_test','discussion','vote',1,1,'Run A evidence','voting',60,60)returning discussion_session_id into discussion;
  insert into public.dialogue_messages(run_id,discussion_session_id,scene_id,phase_key,step_key,player_id,message_text)
    values(run_a,discussion,'option_b_test','discussion','vote',player_a,'Run A chat');
  insert into public.runtime_player_decisions(run_id,discussion_session_id,scene_id,phase_key,step_key,vote_round,player_id,decision_type,choice_id,choice_label)
    values(run_a,discussion,'option_b_test','discussion','vote',1,player_a,'group_vote','a','Run A vote');

  perform public.s10_prepare_room_for_next_run('OPT74B','teacher-b',run_a);
  select session_generation into generation_b from public.s1_rooms where room_code='OPT74B';
  if generation_b=generation_a then raise exception'Session generation did not rotate';end if;
  if(select status from public.game_runs where run_id=run_a)<>'interrupted'then raise exception'Run A not interrupted';end if;
  if not exists(select 1 from public.s3_player_items where run_id=run_a and item_key='opt74_test_item')then raise exception'Run A Pocket row deleted';end if;
  if not exists(select 1 from public.dialogue_messages where run_id=run_a and message_text='Run A chat')then raise exception'Run A chat deleted';end if;
  if not exists(select 1 from public.runtime_player_decisions where run_id=run_a and choice_id='a')then raise exception'Run A vote deleted';end if;
  perform pg_temp.expect_error(format('select public.s1_get_player_by_session(%L,%L)','OPT74B',ja->>'session_token'),'Invalid or expired player session');
  perform pg_temp.expect_error(format('select public.s10_prepare_room_for_next_run(%L,%L,%L::uuid)','OPT74B','teacher-b',run_a),'Stale or invalid active run identity');

  ja:=public.s1_join_player('OPT74B','join-a');jb:=public.s1_join_player('OPT74B','join-b');jc:=public.s1_join_player('OPT74B','join-c');
  if ja->>'session_generation'<>generation_b::text then raise exception'Run B join generation mismatch';end if;
  run_b:=(public.s9_start_formal_game('OPT74B','teacher-b','normal')->>'run_id')::uuid;
  if run_b=run_a then raise exception'Run identity was reused';end if;
  if(select count(*) from public.game_runs where room_code='OPT74B'and status='active')<>1 then raise exception'Active run uniqueness failed';end if;
  state:=public.s3b_get_player_state('OPT74B',ja->>'session_token');
  if(state->>'run_id')::uuid<>run_b then raise exception'Player projection did not select Run B';end if;
  if exists(select 1 from public.s3_player_items where run_id=run_b and item_key='opt74_test_item')then raise exception'Run A Pocket leaked into Run B';end if;
  if exists(select 1 from public.dialogue_messages where run_id=run_b and message_text='Run A chat')then raise exception'Run A chat leaked into Run B';end if;
  if exists(select 1 from public.runtime_player_decisions where run_id=run_b and choice_id='a')then raise exception'Run A vote leaked into Run B';end if;
end$$;

select 'TEACHER_V5_OPTION_B_POSTGRESQL_PASS' result;
rollback;
