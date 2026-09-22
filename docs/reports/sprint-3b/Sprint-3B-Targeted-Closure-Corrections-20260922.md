# Sprint 3B Targeted Closure Corrections

Timestamp: `2026-09-22T16:08:00Z`

Status: `READY_FOR_CA_LEVEL_2_TARGETED_RETEST / SPRINT3C_STILL_BLOCKED`

## Baseline

- Correction commit: `7046812061de6223b5b442859920c96759b89a52`
- Failed CA audit baseline: `20f03c3a52116ba74361c5bc6f7574c9c700c02f`
- CA handoff: `agent-comms/CA_to_CD_20260922T143700Z_sprint3b-remediation-targeted-closure-fail.md`

## Corrections

### IDA-005

`s3b_initialize_flow` now locks the active run and rejects canonical initialization while any generic discussion remains open. A generic Sprint 2 discussion can no longer survive into ACT 1 private gameplay.

### IDA-012

Player action wrappers now lock the run and append the action event with the source scene/phase/step before invoking delegated mutation. PostgreSQL transaction rollback removes the provisional event if the mutation rejects. Successful transition-triggering actions therefore precede `scene_transition` and retain source context.

### RCA-001

Migration 013 was restored byte-for-byte at the changed reconnect condition to its originally deployed `33e3169` content. The post-deployment reconnect correction remains solely in additive migration 014a. Clean replay is now `013 original -> 014 -> 014a -> 014b`, matching deployment history.

### RCA-002

Migration 014b adds `game_runs.audit_private_debug_view`, default `false`. `s2_get_teacher_state` excludes private-phase events for NORMAL runs and for AUDIT runs unless the explicit debug flag is enabled. The new audit-only teacher RPC rejects NORMAL runs.

## Changed Files

- `database/013_sprint3b_discussion_authority_and_request_identity.sql`
- `database/014b_sprint3b_targeted_closure_corrections.sql`
- `tests/sprint3b-remediation-static-check.js`
- `tests/sprint3b-remediation-live-e2e.js`

## Deployment

Migration `014b_sprint3b_targeted_closure_corrections.sql` was executed in the project Supabase SQL Editor and returned:

`Success. No rows returned`

## Verification

- All static suites: PASS.
- Sprint 1 live E2E: 40/40 PASS.
- Sprint 2 live E2E: 23/23 PASS.
- Sprint 3A live E2E: 15/15 PASS.
- Sprint 3B live E2E: 44/44 PASS.
- Sprint 3B targeted remediation live E2E: 15/15 PASS.

The targeted live suite directly verifies:

- pre-initialization generic discussion blocks canonical initialization;
- NORMAL Teacher private evidence is filtered at the RPC boundary;
- NORMAL cannot enable private debug view;
- AUDIT private evidence remains hidden until the explicit flag is enabled;
- transition-triggering ACT 1 action precedes the transition event and retains ACT 1 source context.

## Known Limitations

- CA independent Level 2 targeted re-test is NOT VERIFIED.
- Three simultaneous physical browser/device visual UX was not repeated in this correction pass.
- Sprint 3C remains blocked until CA explicitly closes IDA-005 IDA-012 RCA-001 and RCA-002.

