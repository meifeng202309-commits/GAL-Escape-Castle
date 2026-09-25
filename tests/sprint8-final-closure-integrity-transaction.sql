-- WP-S8-02 verification support.
-- Run as postgres after migration049 against the finalized Run A emitted by
-- tests/sprint8-final-closure-live-e2e.js:
--
--   psql ... -f tests/sprint8-final-closure-integrity-transaction.sql
--
-- The harness locates the most recent finalized fixture created by the paired live E2E
-- using its unique governed Teacher Override reason. All evidence mutations are
-- transaction-scoped and rolled back.

begin;
select set_config(
  'gal.test_run_id',
  (
    select o.run_id::text
    from public.teacher_overrides o
    join public.s8_finalizations f on f.run_id=o.run_id
    where o.reason='WP-S8-02 exact ACT1 missing-choice acceptance regression'
    order by f.finalized_at desc
    limit 1
  ),
  true
);

create function pg_temp.test_run_id() returns uuid
language plpgsql stable as $$
declare value text;
begin
  value:=current_setting('gal.test_run_id',true);
  if value is null or value='' then
    raise exception 'No finalized WP-S8-02 live fixture was found. Run sprint8-final-closure-live-e2e.js first.';
  end if;
  return value::uuid;
end$$;

create function pg_temp.assert_verified() returns void
language plpgsql as $$
declare report jsonb;
begin
  report:=public.s8_verify_integrity(pg_temp.test_run_id());
  if not coalesce((report->>'verified')::boolean,false) then
    raise exception 'Baseline run is not verifier-clean: %',report;
  end if;
end$$;

create function pg_temp.assert_obligation_state(p_key text,p_state text,p_reason text default null) returns void
language plpgsql as $$
declare report jsonb; item jsonb;
begin
  report:=public.s8_verify_integrity(pg_temp.test_run_id());
  item:=report#>array['obligations',p_key];
  if item is null then raise exception 'Missing obligation key % in report %',p_key,report;end if;
  if item->>'state' is distinct from p_state then
    raise exception 'Obligation % expected state %, got %',p_key,p_state,item;
  end if;
  if p_reason is not null and item->>'reason_code' is distinct from p_reason then
    raise exception 'Obligation % expected reason %, got %',p_key,p_reason,item;
  end if;
end$$;

create function pg_temp.assert_missing(p_key text) returns void
language plpgsql as $$
declare report jsonb; item jsonb;
begin
  report:=public.s8_verify_integrity(pg_temp.test_run_id());
  item:=report#>array['obligations',p_key];
  if coalesce((report->>'verified')::boolean,true) then
    raise exception 'Verifier remained true after corrupting %: %',p_key,report;
  end if;
  if item is null or item->>'state' is distinct from 'missing_technical_evidence' then
    raise exception 'Obligation % did not report missing_technical_evidence: %',p_key,item;
  end if;
end$$;

select pg_temp.assert_verified();
select pg_temp.assert_obligation_state('act1.player_first_choices','invalid_teacher_override','exact_governed_override');
select pg_temp.assert_obligation_state('act5.post_inspection_vote','not_applicable','inspect_first_path_not_taken');
select pg_temp.assert_obligation_state('act8.final_vote','not_applicable','unanimous_direct_route');
select pg_temp.assert_obligation_state('act12.station_c','not_applicable','golden_key_watcher_path');

savepoint act1_missing;
update public.s3b_player_progress
set act1_choice_id=null,act1_locked_at=null,act1_timing_validity='pending'
where run_id=pg_temp.test_run_id()
  and player_id=(
    select player_id from public.s3b_player_progress
    where run_id=pg_temp.test_run_id()
      and act1_timing_validity<>'invalid_teacher_override'
      and act1_choice_id is not null
    order by player_id limit 1
  );
select pg_temp.assert_missing('act1.player_first_choices');
rollback to savepoint act1_missing;

savepoint act2_resolution_missing;
update public.discussion_sessions
set outcome=null
where run_id=pg_temp.test_run_id() and phase_key='meeting_discussion' and step_key='final_meeting' and status='resolved';
select pg_temp.assert_missing('act2.meeting_resolution');
rollback to savepoint act2_resolution_missing;

savepoint act3_missing;
update public.s3b_library_attempts
set correct=false
where run_id=pg_temp.test_run_id() and correct;
select pg_temp.assert_missing('act3.puzzle_resolution');
rollback to savepoint act3_missing;

savepoint act4_missing;
update public.s3b_player_progress
set act4_choice_id=null,act4_locked_at=null,act4_timing_validity='pending'
where run_id=pg_temp.test_run_id()
  and player_id=(
    select player_id from public.s3b_player_progress
    where run_id=pg_temp.test_run_id()
      and act4_timing_validity<>'invalid_teacher_override'
      and act4_choice_id is not null
    order by player_id limit 1
  );
select pg_temp.assert_missing('act4.route_resolution');
rollback to savepoint act4_missing;

do $$
declare resolution text; round1_count integer; round1_distinct integer; round2_count integer; round2_distinct integer;
begin
  select act6_resolution into resolution from public.s5_run_state where run_id=pg_temp.test_run_id();
  select count(*),count(distinct choice_id) into round1_count,round1_distinct from public.s5_votes
  where run_id=pg_temp.test_run_id() and phase_key='act6_vote' and vote_round=1;
  select count(*),count(distinct choice_id) into round2_count,round2_distinct from public.s5_votes
  where run_id=pg_temp.test_run_id() and phase_key='act6_vote' and vote_round=2;
  if resolution is distinct from 'portrait_fixed_fallback' or round1_count<>3 or round1_distinct<>3 or round2_count<>3 or round2_distinct<>3 then
    raise exception 'ACT6 regression fixture is not a legitimate two-tie fallback: resolution %, r1 %/%, r2 %/%',resolution,round1_count,round1_distinct,round2_count,round2_distinct;
  end if;
end$$;

savepoint act6_missing;
delete from public.s5_votes
where run_id=pg_temp.test_run_id()
  and phase_key='act6_vote'
  and vote_round=2;
select pg_temp.assert_missing('act6.effective_vote');
rollback to savepoint act6_missing;

savepoint act7_missing;
delete from public.s5_votes
where run_id=pg_temp.test_run_id() and phase_key='act7_vote' and choice_id='clock_c';
select pg_temp.assert_missing('act7.clock_c_resolution');
rollback to savepoint act7_missing;

savepoint act8_private_missing;
delete from public.s5_act8_private_choices
where run_id=pg_temp.test_run_id()
  and player_id=(
    select player_id from public.s5_act8_private_choices
    where run_id=pg_temp.test_run_id() order by player_id limit 1
  );
select pg_temp.assert_missing('act8.private_choices');
rollback to savepoint act8_private_missing;

savepoint act9_step_missing;
delete from public.s6_choices
where run_id=pg_temp.test_run_id() and phase_key='act9_console' and action_step=2;
select pg_temp.assert_missing('act9.step_2');
rollback to savepoint act9_step_missing;

savepoint act10_final_missing;
delete from public.s6_choices
where run_id=pg_temp.test_run_id() and phase_key='act10_final_vote';
select pg_temp.assert_missing('act10.final_vote');
rollback to savepoint act10_final_missing;

savepoint act11_missing;
delete from public.s6_allocations
where run_id=pg_temp.test_run_id()
  and player_id=(
    select player_id from public.s6_allocations
    where run_id=pg_temp.test_run_id() order by player_id limit 1
  );
select pg_temp.assert_missing('act11.allocations');
rollback to savepoint act11_missing;

savepoint act12_pressure_missing;
delete from public.s6_choices
where run_id=pg_temp.test_run_id()
  and phase_key='act12_pressure'
  and player_id=(
    select player_id from public.s6_choices
    where run_id=pg_temp.test_run_id() and phase_key='act12_pressure'
    order by player_id limit 1
  );
select pg_temp.assert_missing('act12.pressure_choices');
rollback to savepoint act12_pressure_missing;

savepoint act13_boundary_missing;
update public.s6_run_state
set act14_boundary_reached=false
where run_id=pg_temp.test_run_id();
select pg_temp.assert_missing('act13.act14_boundary');
rollback to savepoint act13_boundary_missing;

select pg_temp.assert_verified();
select 'PASS Sprint8 final-closure transactional integrity regression matrix' as result;
rollback;
