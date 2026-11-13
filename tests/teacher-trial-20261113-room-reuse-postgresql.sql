\set ON_ERROR_STOP on
begin;

create or replace function pg_temp.expect_error(command text,expected text)returns void language plpgsql as $$
begin execute command;raise exception'Expected error containing %, but command succeeded',expected;
exception when others then if sqlerrm like'Expected error containing %'then raise;end if;if position(expected in sqlerrm)=0 then raise exception'Expected %, got %',expected,sqlerrm;end if;end$$;

select public.s1_create_room('P1REUSE','teacher-p1','join-a','join-b','join-c');

do $$
declare
  a jsonb;b jsonb;c jsonb;run_a uuid;run_b uuid;player_a uuid;discussion uuid;
  generation_before uuid;generation_after uuid;receipt jsonb;state jsonb;
begin
  a:=public.s1_join_player('P1REUSE','join-a');
  b:=public.s1_join_player('P1REUSE','join-b');
  c:=public.s1_join_player('P1REUSE','join-c');
  run_a:=(public.s9_start_formal_game('P1REUSE','teacher-p1','normal')->>'run_id')::uuid;
  player_a:=(a->>'player_id')::uuid;
  select session_generation into generation_before from public.s1_rooms where room_code='P1REUSE';

  insert into public.s3_item_catalog(item_key,name_text_key)values('p1reuse_test_item','p1reuse.test.item')on conflict do nothing;
  insert into public.s3_player_items(run_id,item_key,physical_owner_id,acquired_at)
    values(run_a,'p1reuse_test_item',player_a,clock_timestamp());
  insert into public.discussion_sessions(run_id,scene_id,phase_key,step_key,round_no,vote_round,topic,status,discussion_time_limit_sec,vote_time_limit_sec)
    values(run_a,'p1reuse_test','discussion','vote',1,1,'Run A evidence','voting',60,60)returning discussion_session_id into discussion;
  insert into public.dialogue_messages(run_id,discussion_session_id,scene_id,phase_key,step_key,player_id,message_text)
    values(run_a,discussion,'p1reuse_test','discussion','vote',player_a,'Run A chat');
  insert into public.runtime_player_decisions(run_id,discussion_session_id,scene_id,phase_key,step_key,vote_round,player_id,decision_type,choice_id,choice_label)
    values(run_a,discussion,'p1reuse_test','discussion','vote',1,player_a,'group_vote','a','Run A vote');
  update public.game_runs set status='completed' where game_runs.run_id=run_a;

  receipt:=public.s10_prepare_room_for_next_run('P1REUSE','teacher-p1',run_a);
  select session_generation into generation_after from public.s1_rooms where room_code='P1REUSE';
  if generation_after=generation_before then raise exception'Session generation did not rotate';end if;
  if(select status from public.game_runs where game_runs.run_id=run_a)<>'completed'then raise exception'Completed run status changed';end if;
  if receipt->>'previous_run_status'<>'completed'then raise exception'Completed reuse receipt is wrong';end if;
  if exists(select 1 from public.s1_room_players where room_code='P1REUSE'and session_token_hash is not null)then raise exception'Player sessions were not expired';end if;
  if not exists(select 1 from public.game_runs where game_runs.run_id=run_a)then raise exception'Historical run was deleted';end if;
  if not exists(select 1 from public.s3_player_items where run_id=run_a and item_key='p1reuse_test_item')then raise exception'Run A Pocket history was deleted';end if;
  if not exists(select 1 from public.dialogue_messages where run_id=run_a and message_text='Run A chat')then raise exception'Run A discussion history was deleted';end if;
  if not exists(select 1 from public.runtime_player_decisions where run_id=run_a and choice_id='a')then raise exception'Run A vote history was deleted';end if;
  perform pg_temp.expect_error(format('select public.s1_get_player_by_session(%L,%L)','P1REUSE',a->>'session_token'),'Invalid or expired player session');

  a:=public.s1_join_player('P1REUSE','join-a');
  b:=public.s1_join_player('P1REUSE','join-b');
  c:=public.s1_join_player('P1REUSE','join-c');
  if a->>'session_generation'<>generation_after::text then raise exception'Run B join generation mismatch';end if;
  run_b:=(public.s9_start_formal_game('P1REUSE','teacher-p1','normal')->>'run_id')::uuid;
  if run_b=run_a then raise exception'Run identity was reused';end if;
  if(select count(*) from public.game_runs where room_code='P1REUSE'and status='active')<>1 then raise exception'Exactly one active Run B was not created';end if;
  state:=public.s3b_get_player_state('P1REUSE',a->>'session_token');
  if(state->>'run_id')::uuid<>run_b then raise exception'Player projection did not select Run B';end if;
  if exists(select 1 from public.s3_player_items where run_id=run_b)then raise exception'Run A Pocket leaked into Run B';end if;
  if exists(select 1 from public.dialogue_messages where run_id=run_b)then raise exception'Run A discussion leaked into Run B';end if;
  if exists(select 1 from public.runtime_player_decisions where run_id=run_b)then raise exception'Run A vote leaked into Run B';end if;
end$$;

select 'TEACHER_TRIAL_20261113_COMPLETED_TWO_RUN_REUSE_PASS' result;
rollback;
