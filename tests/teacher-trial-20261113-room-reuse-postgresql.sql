\set ON_ERROR_STOP on
begin;

select public.s1_create_room('P1REUSE','teacher-p1','join-a','join-b','join-c');

do $$
declare
  a jsonb;b jsonb;c jsonb;run_id uuid;generation_before uuid;generation_after uuid;receipt jsonb;
begin
  a:=public.s1_join_player('P1REUSE','join-a');
  b:=public.s1_join_player('P1REUSE','join-b');
  c:=public.s1_join_player('P1REUSE','join-c');
  run_id:=(public.s9_start_formal_game('P1REUSE','teacher-p1','normal')->>'run_id')::uuid;
  select session_generation into generation_before from public.s1_rooms where room_code='P1REUSE';
  update public.game_runs set status='completed' where game_runs.run_id=run_id;

  receipt:=public.s10_prepare_room_for_next_run('P1REUSE','teacher-p1',run_id);
  select session_generation into generation_after from public.s1_rooms where room_code='P1REUSE';
  if generation_after=generation_before then raise exception'Session generation did not rotate';end if;
  if(select status from public.game_runs where game_runs.run_id=run_id)<>'completed'then raise exception'Completed run status changed';end if;
  if receipt->>'previous_run_status'<>'completed'then raise exception'Completed reuse receipt is wrong';end if;
  if exists(select 1 from public.s1_room_players where room_code='P1REUSE'and session_token_hash is not null)then raise exception'Player sessions were not expired';end if;
  if not exists(select 1 from public.game_runs where game_runs.run_id=run_id)then raise exception'Historical run was deleted';end if;
end$$;

select 'TEACHER_TRIAL_20261113_COMPLETED_REUSE_PASS' result;
rollback;
