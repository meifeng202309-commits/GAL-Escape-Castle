# Migration 071 controlled synthetic-room acceptance

Run only after a separately authorized SQL application on a disposable compatible host or during an explicitly approved production maintenance/trial window. Use synthetic room/token/join codes and no student data.

## Preconditions

1. Record project identity, PostgreSQL version, exact deployed function MD5/ACL snapshot and candidate Git SHAs.
2. Assert `select count(*) from game_runs where status='active'` is zero before SQL/deploy or stop.
3. Apply migration 071 in one transaction; verify all expected signatures, owners, SECURITY DEFINER flags and ACLs.
4. Serve the minimal client candidate derived from frozen Pages `891feffe…`, not the moving remediation branch.

## Scripted scenario

1. Create one synthetic NORMAL room and join three isolated Players; start formal game and drive to ACT7 round 2.
2. Teacher Open Vote. Verify the request contains exact run/phase=`act7_vote`/round=2/discussion identity and the database deadline is approximately 10,800 seconds.
3. Submit two distinct genuine Player votes and preserve their locked rows/request identities.
4. Wait past the former 60-second boundary (61 seconds). Refresh all projections. Assert the discussion remains `voting`, the third Player still sees Clock A/B/C, and no `waiting_for_missing_player` event/status was produced.
5. Submit the third genuine vote. Assert exactly three current-round vote rows and exactly one normal resolution effect: correct majority advances, wrong majority creates exactly one next round, or three-way tie creates exactly one next round as selected by the fixture.
6. Replay the prior round's Open Vote payload after a valid next-round transition. Assert stale rejection and byte-equivalent current deadline/status plus no new Teacher intervention event.
7. Call S5 Add Time in NORMAL. Assert `{applicable:false, reason:'NORMAL_TEACHER_PACED'}`, unchanged discussion row and event count.
8. Attempt Open Vote with an invalid Teacher token. Assert authentication failure and no state/event change.
9. Create a separate synthetic AUDIT room. Verify ACT7 keeps the selected 15-second discussion/60-second vote timing and its deliberate timeout path; AUDIT Add Time retains the existing behavior.
10. Constructor adjacency: in synthetic NORMAL ACT6 and ACT8 rounds, assert both stored discussion and vote limits are 10,800 without reading private choices.

## Evidence labels

- Current repository static and Teacher request/UI automation: `SOURCE_STATIC_PASS`, `BROWSER_MOCK_PASS`.
- Until this script runs against PostgreSQL/Supabase: `SQL_NOT_RUN`, `MULTIPLAYER_NOT_RUN`.
- A pass on a disposable host is `ISOLATED_SQL_PASS`, not production acceptance.
- Production rehearsal requires a separate `PRODUCTION_SQL_APPLIED` plus controlled three-browser result and rollback readiness record.
