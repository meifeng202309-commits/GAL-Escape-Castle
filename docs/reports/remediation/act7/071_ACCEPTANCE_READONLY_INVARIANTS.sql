-- Migration 071 future acceptance: protected read-only evidence queries.
-- SOURCE ONLY. Do not execute without the separately approved maintenance gate.
-- Replace every angle-bracket placeholder with the exact synthetic-run identity.
-- Every statement is SELECT-only; do not add cleanup, repair, reset or mutation SQL.

-- Q0 — preservation baseline immediately before maintenance.
select
  count(*) filter (where status='active') as active_runs_total,
  count(*) filter (where status='active' and room_code not in
    ('S5MVD7U6BFWE39','S5MVD7VJRH9CIC')) as active_runs_excluding_retained_20261018_fixtures,
  count(*) filter (where status='active' and room_code in
    ('S5MVD7U6BFWE39','S5MVD7VJRH9CIC')) as retained_20261018_fixtures
from public.game_runs;

-- Q1 — reusable exact snapshot. Run and save the complete single row at each
-- labelled boundary: ROUND2_OPEN, TWO_VOTES, AFTER_61S, THIRD_VOTE_RESOLVED,
-- BEFORE_STALE, AFTER_STALE, BEFORE_NORMAL_ADD, AFTER_NORMAL_ADD,
-- BEFORE_INVALID_TOKEN, AFTER_INVALID_TOKEN.
with p as (
  select
    '<RUN_UUID>'::uuid as run_id,
    '<ROOM_CODE>'::text as room_code,
    '<DISCUSSION_UUID>'::uuid as discussion_session_id,
    '<PHASE_KEY>'::text as phase_key,
    <VOTE_ROUND>::integer as vote_round
), d as (
  select ds.* from public.discussion_sessions ds,p
  where ds.discussion_session_id=p.discussion_session_id and ds.run_id=p.run_id
), s as (
  select st.* from public.s5_run_state st,p where st.run_id=p.run_id
)
select
  clock_timestamp() as observed_at,
  p.*,
  (select count(*) from d) as discussion_row_count,
  (select status from d) as discussion_status,
  (select phase_deadline from d) as phase_deadline,
  (select discussion_time_limit_sec from d) as discussion_time_limit_sec,
  (select vote_time_limit_sec from d) as vote_time_limit_sec,
  (select md5(to_jsonb(d)::text) from d) as discussion_row_md5,
  (select md5(to_jsonb(s)::text) from s) as s5_state_md5,
  (select count(*) from public.s5_votes v
    where v.run_id=p.run_id and v.phase_key=p.phase_key and v.vote_round=p.vote_round) as current_round_vote_count,
  (select count(distinct player_id) from public.s5_votes v
    where v.run_id=p.run_id and v.phase_key=p.phase_key and v.vote_round=p.vote_round) as distinct_current_round_voters,
  (select count(*) from public.s5_rounds r
    where r.run_id=p.run_id and r.phase_key=p.phase_key and r.vote_round=p.vote_round) as current_round_row_count,
  (select count(*) from public.s5_rounds r
    where r.run_id=p.run_id and r.phase_key=p.phase_key and r.vote_round=p.vote_round+1) as next_round_row_count,
  (select count(*) from public.runtime_events e
    where e.run_id=p.run_id and e.discussion_session_id=p.discussion_session_id
      and e.event_type='vote_waiting_for_missing_player') as waiting_event_count,
  (select count(*) from public.runtime_events e
    where e.run_id=p.run_id and e.discussion_session_id=p.discussion_session_id
      and e.phase_key=p.phase_key
      and e.event_type='teacher_intervention_s5_vote_opened'
      and (e.details->>'vote_round')::integer=p.vote_round) as teacher_open_event_count,
  (select count(*) from public.runtime_events e
    where e.run_id=p.run_id and e.discussion_session_id=p.discussion_session_id
      and e.phase_key=p.phase_key
      and e.event_type='teacher_intervention_s5_time_added'
      and (e.details->>'vote_round')::integer=p.vote_round) as teacher_add_time_event_count,
  (select count(*) from public.runtime_events e
    where e.run_id=p.run_id and e.discussion_session_id=p.discussion_session_id
      and e.phase_key=p.phase_key
      and e.event_type in('s5_tie_new_round','clock_wrong_attempt')
      and coalesce((e.details->>'previous_round')::integer,p.vote_round)=p.vote_round) as act7_resolution_event_count,
  (select count(*) from public.runtime_events e where e.run_id=p.run_id) as all_run_event_count
from p;

-- Q2 — exact locked votes and request identities after the third genuine vote.
select v.run_id,v.phase_key,v.vote_round,v.player_id,rp.role_slot,
       v.choice_id,v.client_request_id,v.locked_at
from public.s5_votes v
join public.s1_room_players rp using(player_id)
where v.run_id='<RUN_UUID>'::uuid and v.phase_key='act7_vote' and v.vote_round=2
order by rp.role_slot;

-- Q3 — one-resolution-effect proof for the scripted wrong-majority round 2.
-- Expected: exactly 3 round-2 votes; exactly one round-3 row; state round=3;
-- act7_wrong_attempts=1; exactly one clock_wrong_attempt for round-2 resolution.
select
  st.phase_key,st.vote_round,st.act7_wrong_attempts,
  (select count(*) from public.s5_votes v where v.run_id=st.run_id and v.phase_key='act7_vote' and v.vote_round=2) round2_votes,
  (select count(*) from public.s5_rounds r where r.run_id=st.run_id and r.phase_key='act7_vote' and r.vote_round=3) round3_rows,
  (select count(*) from public.runtime_events e
    where e.run_id=st.run_id
      and e.discussion_session_id='<DISCUSSION_UUID>'::uuid
      and e.phase_key='act7_vote'
      and e.event_type='clock_wrong_attempt') wrong_attempt_events
from public.s5_run_state st where st.run_id='<RUN_UUID>'::uuid;

-- Q4 — AUDIT ACT7 stored timing and timeout/Add-Time evidence.
-- Run once while voting, once after the 61-second refresh, and once after Add Time.
select ds.discussion_session_id,ds.status,ds.phase_deadline,
       ds.discussion_time_limit_sec,ds.vote_time_limit_sec,
       (select count(*) from public.runtime_events e
        where e.run_id=ds.run_id and e.discussion_session_id=ds.discussion_session_id
          and e.event_type='vote_waiting_for_missing_player') waiting_events,
       (select count(*) from public.runtime_events e
        where e.run_id=ds.run_id and e.discussion_session_id=ds.discussion_session_id
          and e.event_type='teacher_intervention_s5_time_added') add_time_events
from public.discussion_sessions ds
where ds.run_id='<AUDIT_RUN_UUID>'::uuid and ds.phase_key='act7_vote' and ds.vote_round=1;

-- Comparison rules (performed outside SQL; no writes):
-- * Use phase=act7_vote/round=2/original round-2 discussion for ROUND2_OPEN
--   through THIRD_VOTE_RESOLVED. Use phase=act7_vote/round=3/current round-3
--   discussion for the stale, NORMAL Add Time and invalid-token before/after pairs.
-- * TWO_VOTES -> AFTER_61S: discussion status remains voting, vote count remains 2,
--   waiting_event_count remains 0 and Clock choices remain a browser projection check.
-- * BEFORE_STALE == AFTER_STALE for discussion_row_md5, s5_state_md5,
--   all_run_event_count and teacher_open_event_count.
-- * BEFORE_NORMAL_ADD == AFTER_NORMAL_ADD for discussion_row_md5, s5_state_md5,
--   all_run_event_count and teacher_add_time_event_count.
-- * BEFORE_INVALID_TOKEN == AFTER_INVALID_TOKEN for both hashes and all event counts.
-- * THIRD_VOTE_RESOLVED and Q3 prove three genuine rows and one next-round effect.
