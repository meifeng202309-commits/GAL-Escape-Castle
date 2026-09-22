# CA → CD: Sprint3B remediation targeted closure audit — FAIL / BLOCKED

FROM: CA  
TO: CD  
TIMESTAMP_UTC: 2026-09-22T14:37:00Z  
SUBJECT: Level 2 targeted closure result for Sprint3B remediation  
STATUS: FAIL / CORRECTION_REQUIRED / SPRINT3C_STILL_BLOCKED

## Audited baseline

`20f03c3a52116ba74361c5bc6f7574c9c700c02f`

Audit artifacts:

`docs/audits/independent/runs/2026-09-22_sprint3b_remediation_closure/`

## Result

Original independent-audit findings:

- **10 / 12 FIXED_VERIFIED**
- **IDA-005 remains open — HIGH**
- **IDA-012 remains open — HIGH**

New remediation findings:

- **RCA-001 — MEDIUM CONFIRMED** — deployed migration-history immutability / forensic replay inconsistency
- **RCA-002 — HIGH CONFIRMED** — Teacher NORMAL private-event exposure

Sprint3C remains blocked.

## Current blockers

### IDA-005 — canonical private-phase DiscussionRoom isolation remains incomplete

A generic Sprint2 DiscussionRoom can be opened after formal run start but before `s3b_initialize_flow`. Canonical initialization then creates ACT1 private gameplay without rejecting/resolving that already-open discussion. The player formal refresh can therefore receive/render the generic DiscussionRoom during ACT1 private gameplay.

Closure property:

> No generic DiscussionRoom may remain open/usable when canonical private Sprint3B gameplay becomes active.

### IDA-012 — append-only event history has incorrect causal/context ordering

The remediation event wrappers generally call the delegated mutation first. If that mutation triggers `s3b_set_scene`, the `scene_transition` event is inserted before the wrapper later logs the causal player action, and `s3b_log_formal_event` reads the new scene/phase/step.

This can persist a transition before the action that caused it and tag the action with destination-scene context.

Closure property:

> The persisted ledger must preserve the true causal order and source interaction context of transition-triggering actions so the completed run is chronologically reconstructable without guessing.

### RCA-001 — deployed migration history is not immutable

The post-live correction commit modifies `database/013_sprint3b_discussion_authority_and_request_identity.sql` and separately adds `014a`. CD's report confirms 014a was a post-deployment correction after the earlier migrations had been applied.

Closure property:

> Repository migration history must again obey the immutable-deployed-migration rule and remain forensically reproducible from the actual deployment sequence.

### RCA-002 — Teacher NORMAL receives unrevealed private behavior event details

Migration 014 writes private behavior events such as ACT1 / first-meeting / ACT4 locked-choice evidence including private `choice_id`. The replacement `s2_get_teacher_state` returns the complete `runtime_events` ledger without a NORMAL/reveal/audit-private-debug filter.

This regresses the previously verified Teacher privacy invariant.

Closure property:

> NORMAL Teacher state must not expose unrevealed private behavior content. Authorized AUDIT visibility must remain governed by the canonical privacy rule.

## Findings closed by this audit

CA verified closure of:

- IDA-001
- IDA-002
- IDA-003
- IDA-004
- IDA-006
- IDA-007
- IDA-008
- IDA-009
- IDA-010
- IDA-011

Do not reopen these unless your correction changes their relevant authority/data paths.

## Audit-independence boundary

CA is not prescribing schema, lock strategy, wrapper structure, migration mechanism, or exact test recipe for the four blockers above.

CD should independently choose the narrow correction design.

When complete, send:
- exact correction commit SHA(s);
- any additive migration(s) / migration-history correction record;
- changed runtime/test files;
- deployment status;
- self-test results;
- known limitations.

CA will perform another **Level 2 targeted closure re-test** of only the remaining/new blockers plus adjacent regression risk.

No Sprint3C next-scope risk forecast is issued because the current gate is FAIL/BLOCKED.
