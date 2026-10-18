# Migration 071 controlled synthetic-room acceptance

Run only after a separately authorized SQL application on a disposable compatible host or during an explicitly approved production maintenance/trial window. Use synthetic room/token/join codes and no student data.

## Preconditions

1. Record project identity, PostgreSQL version, exact deployed function MD5/ACL snapshot and candidate Git SHAs.
2. Capture and preserve all 579 ACTIVE rows (577 historical plus the two retained 2026-10-18 synthetic prepared-state runs). Require the separately approved fresh no-current-play observation and six-function admission freeze; any new activity/admission or identity drift is STOP. Do not clean rows to produce zero.
3. Apply migration 071 in one transaction; verify all expected signatures, owners, SECURITY DEFINER flags and ACLs.
4. Serve the minimal client candidate derived from frozen Pages `891feffe…`, not the moving remediation branch.
5. Use `tests/act7-071-controlled-acceptance.js` only with a new explicit production authorization and use `071_ACCEPTANCE_READONLY_INVARIANTS.sql` at its labelled boundaries.
6. Set both `ACT7_071_PRODUCTION_AUTHORIZED=YES` and `ACT7_071_EVIDENCE_PAUSE=YES`. The fixture emits one JSON `ACT7_071_EVIDENCE_BOUNDARY` record and blocks on stdin at every boundary. The operator must substitute the emitted exact run/discussion identity, execute and save the required SELECT snapshot, then press Enter. Absence of either gate is a hard failure; never background or auto-acknowledge the prompts.

## SQL evidence boundary map

- NORMAL Q1: `ROUND2_OPEN`, `TWO_VOTES`, `AFTER_61S`, `THIRD_VOTE_RESOLVED`, `BEFORE_STALE`, `AFTER_STALE`, `BEFORE_NORMAL_ADD`, `AFTER_NORMAL_ADD`, `BEFORE_INVALID_TOKEN`, `AFTER_INVALID_TOKEN`.
- NORMAL Q2 and Q3: save both at `THIRD_VOTE_RESOLVED`, using the emitted original round-2 discussion identity.
- AUDIT Q4: `AUDIT_VOTING`, `AUDIT_AFTER_61S`, `AUDIT_AFTER_ADD`.
- Q0: save immediately before maintenance and again before unfreeze/closure; the two retained fixture identities and all historical ACTIVE identities must remain preserved.
- Each evidence file must retain the boundary label, UTC capture time, exact query text/parameters, complete result, candidate Git SHA and deployed function fingerprint set. A missing, auto-advanced or identity-mismatched boundary is NOT VERIFIED, not an inferred pass.

## Scripted scenario

1. Create one synthetic NORMAL room and join three isolated Players; finish ACT1–5, then execute each Player's ACT5 handoff observation and ACT6 entry. Assert no canonical discussion for 0/1/2 entrants and one stable ACT6 discussion identity/deadline at entrant 3; then drive to ACT7 round 2.
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
