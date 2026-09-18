# Sprint 2 Testing

## Migration

Apply in order:

```text
database/001_sprint1_core.sql
database/002_runtime_runs_discussion.sql
database/003_sprint2_discussionroom_audit_fix.sql
```

Do not edit or replace the deployed Sprint 1 migration.

## Static Checks

```text
node tests/sprint1-static-check.js
node tests/sprint2-static-check.js
node --check src/game/app.js
node --check src/teacher/teacher-console.js
node --check tests/sprint2-live-e2e.js
```

## Live E2E

After deploying migrations through `003_sprint2_discussionroom_audit_fix.sql`:

```text
node tests/sprint1-live-e2e.js
node tests/sprint2-live-e2e.js
```

The Sprint 2 live suite creates fresh random rooms and verifies:

- server-generated run identity;
- NORMAL and AUDIT metadata;
- run-mode replacement rejection;
- three-player chat and authoritative timestamps;
- transcript persistence and ordering;
- reconnect restore;
- configured initial-choice reveal;
- silent-texting flag persistence;
- teacher observation;
- pre-reveal vote privacy;
- duplicate vote rejection;
- 3:0 and 2:1 majority;
- 1:1:1 no-action handling;
- new discussion and vote identity for re-vote;
- repeated re-vote resolution;
- slow/missing player behavior;
- server deadline transition to `WAITING_FOR_MISSING_PLAYER`;
- teacher Add 30 seconds;
- direct anonymous reads blocked by RLS.
- ACT2- and ACT5-style option fallback after exactly one re-vote;
- ACT6 non-option `portrait_fixed_fallback` after exactly one re-vote;
- local `round_no = 1` for a second independent discussion in one run;
- current transcript isolation by `discussion_session_id`;
- preservation of earlier messages in teacher-only `message_history`;
- invalid `choice_id` rejection;
- direct anonymous write rejection.

## Manual Browser Matrix

Use three independent browser sessions plus the Teacher Console.

1. Join Gitte, Anna, and Linda with their assigned join codes.
2. Complete one Sprint 1 private-choice reveal.
3. Start a NORMAL or AUDIT formal run from the Teacher Console.
4. Open the generic discussion.
5. Send one message from each browser and compare transcript order.
6. Open voting and confirm that a submitted choice remains private until all three submit.
7. Exercise 3:0, 2:1, and 1:1:1 using fresh rooms.
8. Refresh one student browser and confirm session, transcript, deadline, and vote round restore.
9. Allow a vote deadline to expire with one missing player and confirm no result is synthesized.
10. Add 30 seconds from the Teacher Console and complete the missing vote.

## Final Export Boundary

Sprint 2 stores metadata required by the future Sprint 8 export. It does not create JSON/CSV export files.

## Deployment Acceptance Result — 2026-09-18

- Supabase migration: **VERIFIED**, SQL Editor returned `Success. No rows returned`.
- Sprint 1 live regression: **VERIFIED**, 40/40 checks passed.
- Sprint 2 live E2E: **VERIFIED**, 17/17 checks passed.
- GitHub Pages frontend smoke: **VERIFIED**, student and teacher pages loaded with no console errors/warnings.
- Three separate physical student devices: **NOT VERIFIED**.

## Audit-Fix Deployment Acceptance Result — 2026-09-19

- Correction commit: `a74a5b25d5cf9081cdd0f7320c0c724b47ae08b6`.
- Additive migration: `database/003_sprint2_discussionroom_audit_fix.sql`.
- Supabase migration: **VERIFIED BY USER**, SQL Editor returned `Success. No rows returned`.
- Sprint 1 live regression after deployment: **VERIFIED**, 40/40 checks passed.
- Expanded Sprint 2 live E2E after deployment: **VERIFIED**, 23/23 checks passed.
- Physical three-student-device plus teacher-device walkthrough: **NOT VERIFIED**.
