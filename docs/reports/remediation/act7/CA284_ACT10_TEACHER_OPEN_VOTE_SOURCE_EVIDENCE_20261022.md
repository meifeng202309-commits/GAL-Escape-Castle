# CA-284 ACT10 Teacher Open Vote source evidence

Date: 2026-10-22  
Authorization: `agent-comms/CA_to_CD_20261022T121000Z_ca284-act10-source-only-implementation.md`  
Status: source candidate only; migration not applied and Pages not deployed

## Implemented contract

The candidate migration `database/072_ca284_act10_teacher_open_vote.sql` makes only NORMAL ACT10 Teacher-paced:

- The third accepted private Take/Leave choice still creates `act10_discussion`, but its NORMAL deadline is null.
- `s6_refresh_owned_discussion` does not auto-advance a NORMAL `act10_discussion`. AUDIT and ACT9/ACT11 retain their existing deadline behavior.
- Discussion messaging accepts a null deadline while the exact session remains open.
- The player close-discussion endpoint explicitly rejects NORMAL ACT10 with `Teacher must open the ACT10 final vote.`
- The player projection marks that discussion `teacher_open_required`; the existing Continue control remains disabled. Direct final-vote submission remains rejected by the unchanged group-choice guard until the authoritative phase is `act10_final_vote`.
- New `s6_get_teacher_discussion_state` authenticates the Teacher and projects the exact active S6 run/phase/step/round/discussion identity.
- New `s6_teacher_open_vote` accepts only NORMAL `act10_discussion`, locks and verifies every rendered identity, resolves exactly that discussion, atomically advances to `act10_final_vote`, and records both runtime and ACT6–13 ledger evidence. Stale and repeated calls fail before mutation.

The existing private choices, discussion messages, final-vote rows, Take/Leave resolver, Golden Key flags, and export/integrity paths are unchanged.

## Frontend boundary

`src/teacher/teacher-console.js` now prefers the S6 projection whenever S6 is active, preventing fallback to stale Sprint5/Sprint2 controls. It enables Open Vote only for a NORMAL open `act10_discussion` and sends the exact run/phase/step/round/session identity to `s6_teacher_open_vote`. Existing Sprint2/Sprint5 routing remains unchanged. S6 Add Time is not exposed.

`src/game/app.js` only changes the Sprint6 Continue readiness predicate so a `teacher_open_required` discussion cannot be closed by the player.

## Tests

PASS:

- `tests/ca284-act10-teacher-open-vote-static-check.js` — migration, ACL, exact identity, event, Teacher routing, and player gate markers.
- `tests/ca284-act10-teacher-open-vote-policy.test.js` — no premature vote, no NORMAL auto-advance, no player close, stale/repeat rejection, one Teacher transition, and unchanged 2:1 Take result/history.
- `tests/ca284-act10-teacher-open-vote-browser.mjs` — ACT10 private disables Teacher Open Vote; ACT10 discussion enables it; real Teacher handler calls only the S6 RPC with exact identities.
- `tests/a1-player-polling-browser.mjs` — accepted Task A regression plus disabled NORMAL ACT10 player Continue.
- `tests/act7-v4-normal-timeout-browser.mjs` — existing Sprint5 Teacher Open Vote and Teacher transcript behavior.
- A1 polling, ACT7 V4 timeout, Sprint6, and CA284 static suites; source/test syntax; `git diff --check`.

No database connection, migration application, live state mutation, or deployment occurred.

## Release/audit boundary

Before any release, independently audit PostgreSQL function replacement/rename/ACL behavior and recovery, then validate the migration in an isolated database fixture. A live migration or existing-session reconciliation requires a distinct Teacher-authorized release instruction.
