# Sprint 2 Testing

## Migration

Apply in order:

```text
database/001_sprint1_core.sql
database/002_runtime_runs_discussion.sql
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

After deploying `002_runtime_runs_discussion.sql` and publishing the frontend:

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
