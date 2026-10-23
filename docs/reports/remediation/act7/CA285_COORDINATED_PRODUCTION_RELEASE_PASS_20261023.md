# CA285 coordinated production release — PASS

Date: 2026-10-23  
Owner: CD  
Authorization: `agent-comms/CA_to_CD_20261023T021000Z_ca285-release-authorization.md`

## Result

The Teacher-authorized bounded production release passed. Migration 072 is active on the intended GAL production project, the audited Batch A and ACT10 client integration is live on GitHub Pages, guarded browser regressions passed, and the synthetic three-player plus Teacher production path reached the canonical Golden Key result. No rollback was required.

## Production preflight and entry gate

- Supabase project: `qdcbdcjobzytzhnhfwyn` (`GAL's Castle Escape`), PostgreSQL 17.6, `ACTIVE_HEALTHY`.
- Migration 072 was absent before the release.
- Authoritative activity checks found no runtime event in the preceding ten minutes, no player heartbeat in the preceding ten minutes, and no active run with recent events. Historical rows whose status remained `active` were not treated as proof of current use.
- Before DDL, CD captured the five affected function definitions/hashes and ACLs and retained the already-tested exact recovery script. This includes restoration of the legacy `PUBLIC` grants on `s6_send_message_v2` and `s6_close_discussion`, and `anon`/`authenticated` grants on the player projection.
- New entry was closed by temporarily revoking `anon` and `authenticated` execution on `s1_create_room`, `s1_join_player`, and `s9_start_formal_game`. Readback showed all six privileges absent, and the activity check remained quiet.

## Database release

- Applied source: `database/072_ca284_act10_teacher_open_vote.sql`.
- Supabase migration identity: `20261023023426 ca284_act10_teacher_open_vote`.
- Post-DDL ACL readback confirmed:
  - `s6_get_player_state_pre072(text,text)`: `postgres`, `service_role` only;
  - replacement player projection: `anon`, `authenticated`, `postgres`, `service_role`;
  - Teacher state and Teacher Open Vote endpoints: `anon`, `authenticated`, `postgres`, `service_role`.
- Entry grants for create/join/start were restored and read back exactly after migration.
- Security and performance advisors were run after DDL. They reported the repository's known broad RLS-without-policy, mutable-search-path, public SECURITY DEFINER, and unindexed-FK advisory sets. These are the same pre-existing application-architecture categories already recorded in the CA278 production report; migration 072 introduced no new table or mutable-search-path function and no release-blocking migration-specific finding was identified. No out-of-scope general security or indexing rewrite was attempted.

## Pages release

- Rollback source retained: `deploy/ca282-station-a-20261022` at `0a5dd20ed90cee44f7bab9be4d4a2f822b4b5297`, `/(root)`.
- Candidate source: `deploy/ca285-batch-a-act10-20261023` at `d09f7c7be27fd521bb10328de434aca1bc676a2e`, `/(root)`.
- Candidate was built from the exact prior-live rollback commit with only audited `src/game/app.js` and `src/teacher/teacher-console.js` taken from the accepted implementation baseline.
- GitHub Pages workflow run `39891251349`: success.
- Served-content normalized-LF SHA-256 matched the candidate exactly:
  - `src/game/app.js`: `35a8014c07c456b63b0dccbb554d9115d3ef61f293b0b554332b1d13fd3d2d90`
  - `src/teacher/teacher-console.js`: `724e10a47f66fb9fb22027592cd1fa5a8533897f1299ad7285ebe479c910cbda`

## Guarded validation

Browser regressions against the released client passed:

- `tests/a1-player-polling-browser.mjs`: Library/discussion draft retention and Station A input/viewport behavior.
- `tests/act7-v4-normal-timeout-browser.mjs`: unchanged NORMAL timeout behavior and Teacher transcript scroll intent; AUDIT Add Time remains available.
- `tests/ca284-act10-teacher-open-vote-browser.mjs`: ACT10 Teacher routing and exact identity payload.

Production synthetic smoke used room `C2856ADACC2E`, run `c2856ada-cc2e-4000-8000-000000000001`, discussion `a45e0f6c-b041-45ca-b33c-8efe1a931ffe`, three players, and one Teacher. It proved:

- NORMAL ACT10 returned `teacher_open_required=true` with no automatic deadline;
- one player message appeared in the Teacher transcript;
- an incorrect Teacher token was rejected;
- exact-identity Teacher Open Vote advanced to `act10_final_vote`;
- three private `take` choices resolved to `act10_result`;
- `gold_key`, `alarm_active`, `station_c_bypassed`, and `danger_arrives_sooner` are all true;
- `teacher_intervention_s6_vote_opened` runtime event count = 1;
- `teacher_open_vote` ledger event count = 1;
- dialogue message count = 1 and final choice count = 3.

The synthetic evidence rows are retained for auditability. The accepted isolated PostgreSQL gate already proved unchanged AUDIT, ACT9/11, stale/duplicate rejection, ACL behavior, and exact recovery; production testing did not mutate unrelated real rooms.

## Recovery readiness and disposition

Pages can be restored to `deploy/ca282-station-a-20261022` at `/(root)`. Database recovery can drop the two 072 Teacher endpoints and replacement wrapper, restore `s6_get_player_state_pre072`, restore the captured four legacy bodies, and restore the original PUBLIC/anon/authenticated ACL envelope; that procedure passed the isolated PG16 test before authorization. All gates passed, so recovery was not invoked.

Disposition: **PASS; handoff to CA for independent release closure.**
