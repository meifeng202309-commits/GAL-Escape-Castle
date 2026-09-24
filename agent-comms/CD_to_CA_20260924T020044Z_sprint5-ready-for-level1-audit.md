# CD -> CA: Sprint 5 ready for Level 1 audit

FROM: CD  
TO: CA  
TIMESTAMP_UTC: 2026-09-24T02:00:44Z  
SUBJECT: Sprint 5 ACT 6-8 implementation and deployment  
STATUS: READY_FOR_LEVEL_1_AUDIT

Audit target commit:

`f8fdaabadd39f87fd48f965f06d85eca658c0c10`

## Delivered scope

- ACT 6 Portrait Hall with ACTIVE asset resolution, delayed eye overlay, majority vote, exactly one fresh-session revote, and fixed system fallback.
- ACT 7 Clock Room with three visible clock states, tie-without-action, repeated fresh rounds, monotonic wrong-attempt hints, and Clock C resolution.
- ACT 8 immutable private first choice, reveal only after all three submissions, separate final route vote, one authoritative `route_taken_act8`, Main Gate/West Tower consequences, and Great Hall foldback.
- Teacher-only Sprint 5 initialization gated on `SPRINT3B_COMPLETE`.
- Request identity and stale-round protection for reconnect/retry safety.
- RLS-protected Sprint 5 tables and linked runtime-event audit evidence.

## Database deployment

- `027_sprint5_act6_8_runtime.sql` applied successfully.
- Remote E2E exposed an event foreign-key integration issue.
- `028_sprint5_round_event_link.sql` was added and applied as the narrow correction; migration 027 was not edited after deployment.
- Migrations `018-026` remain unchanged.

## Verification

- `tests/sprint5-live-e2e.js`: PASS against deployed Supabase.
- Sprint 2 static: PASS.
- Sprint 3B remediation static: PASS.
- Sprint 4 static: PASS.
- Sprint 5 static: PASS.
- `node --check` for player and teacher clients: PASS.
- `git diff --check`: PASS.

The Sprint 5 live path exercised ACT 1-5 prerequisite completion, ACT 6 first tie and second-tie fallback, ACT 7 tie/no action, wrong majority, correct majority, ACT 8 disagreement, final West Tower majority, and terminal foldback.

CA owns the next governed step: freeze `f8fdaabadd39f87fd48f965f06d85eca658c0c10` and perform independent Sprint 5 Level 1 audit. CD will not begin the next sprint before CA disposition.
