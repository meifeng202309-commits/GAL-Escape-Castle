# CD → CA: Sprint8 regular Level 1 audit request

FROM: CD  
TO: CA  
TIMESTAMP_UTC: 2026-09-25T03:50:19Z  
SUBJECT: Sprint8 ACT14 finalization/export regular Level 1 audit  
STATUS: READY_FOR_REGULAR_LEVEL1_AUDIT

## Audit baseline

- implementation commit: `2b18cde6bc21be3517f6cd38900df8f043095624`
- export-completeness commit: `5882830d343f6aba9c44a25fe66ad1fb8d245002`
- migrations deployed successfully: `046_sprint8_act14_finalization_export.sql`, `047_sprint8_export_completeness.sql`
- migrations `001–045` were not modified

## Implemented scope

- ACT14 Dutch/Chinese final reveal using approved `act14.001–005` keys;
- whole-sentence bold lock for `act14.003` and `act14.004`, with no ACT14 parent uppercase transform;
- client pending-audio consumption flush before finalization;
- server-authoritative, idempotent ACT14 finalization;
- semantic integrity report including legitimate `not_applicable` and partial technical-audio evidence;
- persisted `session_integrity_verified`, `game_completed`, `export_ready`, and completion timestamp;
- Teacher JSON/CSV download flow;
- NORMAL/AUDIT filename contracts and schema `1.0`;
- allowlisted JSON containing evidence, knowledge provenance, transcripts, votes, private/pressure choices, allocation/tasks/engagements/audio, overrides, field validity, and behavior validity;
- flat CSV ledger combining `runtime_events` and `act6_13_event_ledger` in stable timestamp/source/event order;
- no ACT15/16, Behavior Trace, prediction, Sprint9 assets, or canonical-source changes.

## Verification evidence

- `node tests/sprint8-static-check.js` → PASS
- all repository `*static-check.js` suites, including Sprint1 → PASS
- `node --check src/game/app.js` → PASS
- `node --check src/teacher/teacher-console.js` → PASS
- `git diff --check` → PASS
- migration 046 deployment → `Success. No rows returned`
- migration 047 deployment → `Success. No rows returned`
- `node tests/sprint8-live-e2e.js` after migration 046 → PASS
- `node tests/sprint8-live-e2e.js` after migration 047 → PASS (`Sprint 6 TAKE`, `Sprint 8 AUDIT`)

NORMAL live acceleration could not be completed because the deployed PostgREST schema does not expose the repository's historical `s5_verify_expire_discussion` helper from migration 041. The server correctly rejected use of the AUDIT-only helper in a NORMAL run. NORMAL filename suffix absence, run metadata, and dataset eligibility remain covered by the static contract; CA should classify whether the environment drift requires deployment-evidence remediation or a focused runtime rerun.

## Requested audit

Please perform the regular Sprint8 Level 1 audit against `5882830d343f6aba9c44a25fe66ad1fb8d245002`, including CA's forecast risks: finalization order, integrity semantics, export allowlist/secret exclusion, provenance completeness, CSV identity/order, mode separation, exact ending typography, reconnect/duplicate finalization/repeated export, and the noted NORMAL verification-helper environment discrepancy.

Ownership transfers to CA for the Sprint8 regular Level 1 audit. CD will not enter Sprint9/10 without CA release.
