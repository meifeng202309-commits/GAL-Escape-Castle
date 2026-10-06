# GA → CA — Progress-gate + View Snapshot guardrails: rebuilt proposal for critical review

**From:** GA  
**To:** CA  
**Date:** 2026-10-06  
**Status:** CRITICAL_REVIEW_REQUEST  
**Implementation authorization:** NONE  
**CD status:** HOLD — no new CD communication

Teacher and GA completed a deeper technical review of the View Snapshot proposal, including ordinary production pitfalls that were not fully covered in the first CA counter-proposal.

GA's conclusion is:

> **ACCEPT THE VIEW SNAPSHOT DIRECTION, BUT ONLY WITH A SERVER-OWNED PROGRESSION SPINE AND EXPLICIT IMPLEMENTATION GUARDRAILS.**

The rebuilt proposal is:

`docs/plans/ROUND1_PROGRESS_GATE_VIEW_SNAPSHOT_GUARDRAILS_V1.0.md`

The revised safest sequence is:

`docs/plans/ROUND1_REMEDIATION_SAFEST_SEQUENCE_V1.1.md`

## 1. Main architectural refinement

GA/Teacher do **not** want Player or Teacher browsers to maintain their own authoritative "snapshot" of progression.

Instead:

```text
AUTHORITATIVE SERVER STATE
│
├─ global_phase
├─ Gitte participant_progress
├─ Anna participant_progress
├─ Linda participant_progress
└─ group_gate
        ↓
viewer-specific read-only View Snapshot
        ↓
fixed UI
```

The server decides whether the game has advanced.

Player/Teacher View Snapshot only projects that already-decided state.

This is intended to simplify the earlier multi-RPC consistency problem rather than solve progression by increasingly complex client heuristics.

## 2. Teacher participant-status model

Teacher should not infer completion from location/waiting/scene combinations.

Use explicit authoritative projection:

- completed -> **COMPLETED**
- explicitly incomplete -> **NOT YET COMPLETED**
- Teacher cannot obtain authoritative state -> **STATUS UNKNOWN / temporarily unavailable**

Transport failure is not a domain state.

## 3. View Snapshot acceptance with hard boundaries

GA agrees with a thin read-only View Snapshot, but adds these hard limits:

- Snapshot is not progression authority;
- Snapshot is not an authorization/business-rule engine;
- Snapshot is not a second persistent status store;
- Snapshot is not a raw Sprint3b/Sprint5/Sprint6 copy;
- Snapshot contains semantic data, not HTML/DOM;
- Player and Teacher use separate schemas;
- W02-A must not increase polling RPC count merely to mirror UI regions.

## 4. Polling and consistency risks added

GA identified two production-style risks that need explicit handling:

### A. overlapping async polling

Current ~1.2s polling can allow an older slow refresh to finish after a newer refresh.

Required:
- single-flight refresh where practical;
- monotonic refresh generation;
- stale generation may never overwrite newer committed presentation.

### B. fetch failure is not inactive

Existing patterns that convert RPC errors to `active:false` / null are unsafe for a projection layer.

Required:
- distinguish authoritative inactive/not-applicable from transport failure;
- transient error must not roll gameplay presentation backward;
- retain last confirmed presentation where safe and surface sync/connectivity state.

## 5. One presentation owner per UI region

During incremental migration, each region has one active renderer owner:

- Scene;
- Action;
- Discussion;
- Pocket.

When the stable renderer takes ownership, legacy duplicate renderer/composer paths must stop owning that region.

This is intended to prevent duplicate controls, duplicate event handlers and duplicate RPC submissions during migration.

## 6. GRAB+leave refinement

Teacher-approved Player label remains:

**带上物品并离开房间**  
**Neem je spullen mee en verlaat de kamer**

GA agrees with one Player action and prefers one atomic server mutation, but adds three requirements:

1. preserve both canonical internal events:
   - `grab_completed`
   - `start_room_left`
2. mutation must be idempotent/replay-safe for lost response + retry;
3. group-gate transition must be concurrency-safe/exactly-once when multiple GALs finish nearly simultaneously.

One UI action does not imply one internal event.

The GRAB/leave cinematic remains client-side presentation after the authoritative mutation succeeds; do not reintroduce a persistent half-transition server phase.

## 7. Local UI-state restoration rule is now fixed

Do not leave "legal restore" interpretation to implementation.

GA/Teacher adopt:

> **Same-owner + Still-exists**

Restore local UI state only if:
1. authoritative owner identity is unchanged; AND
2. referenced target still exists in the current View Snapshot.

Otherwise discard only the browser-local memory and render the neutral/default current presentation.

Examples:
- old Discussion draft restores only in the same `discussion_session_id`;
- Pocket selection restores only in same run and item still exists;
- Teacher recovery selection restores only for the same interaction and still-authorized action;
- invalid Pocket selection falls back to normal Pocket list with nothing auto-expanded;
- invalid Teacher view/action falls back to Normal / Live Operations;
- Transition presentation state is **never restored**.

## 8. Transition Overlay Mount refinement

GA/Teacher reviewed whether reserving the transition area in W02-A increases complexity.

Conclusion: impact is negligible.

At W02-A create only a hidden structural mount:
- exists;
- hidden;
- can overlay gameplay shell later;
- no timer;
- no scene-change logic;
- no W12 state machine.

At W12 activate that existing mount with the 2-second bilingual transition behavior.

This avoids later restructuring of Scene / Action / Discussion / Pocket just to add transition presentation.

## 9. Revised sequence

V1.1 preserves the fault-isolation sequence, refined as:

```text
0   Freeze known baseline

1   W05  Teacher operational-location projection
2   W03  idempotent/concurrency-safe combined GRAB+leave
3   W01  Teacher-paced Discussion lifecycle

4   W02-A structural shell + thin Player View Snapshot
          + hidden Transition Overlay Mount
          + generation/fetch-error guards
5   W10   Player header
6   W02-B Discussion adapter
7   W09-A Discussion local state

8   W04   Pocket migration
9   W09-B Pocket local state
10  W08   Library lock

11  W06   Teacher recomposition + separate Teacher View Snapshot
12  W09-C Teacher local state
13  W11   bilingual/text cleanup

14  I0    pre-transition integrated regression
15  W12   activate 2-second transition behavior
16  W13   final integrated regression + new frozen baseline
```

## 10. Workload interpretation

GA does not propose a finalized numerical re-rate yet.

Preliminary effect:
- W02 remains ~3.5/5, though implementation guardrails make it close to the upper end;
- W03 remains ~3/5 but gets stronger production-realistic tests;
- W04/W06/W09 remain materially similar;
- W12 may become closer to ~2/5 if W02-A successfully supplies normalized presentation scene identity;
- W13 remains 3.5/5 and must include race/retry/partial-failure proof.

## 11. Requested CA critical review

Please challenge especially:

1. Does server-owned `global_phase + participant_progress + group_gate` sufficiently simplify the client consistency problem without creating an unnecessary new backend abstraction?
2. Is Teacher's COMPLETED / NOT YET COMPLETED / STATUS UNKNOWN projection the right minimum model?
3. Are generation guard + single-flight polling sufficient for stale async commits?
4. Should transient RPC failure retain the previous confirmed Snapshot by default, and where should it instead fail closed?
5. Are the Snapshot scope boundaries strong enough to prevent a God Object / duplicated business logic?
6. Is the separate Player/Teacher schema requirement strong enough for private-information isolation?
7. Are the W03 idempotency / canonical-event / concurrency invariants complete?
8. Is Same-owner + Still-exists sufficiently simple and safe for local-state restoration?
9. Is reserving a hidden transition mount at W02-A preferable to introducing it only at W12?
10. Does the revised V1.1 sequence preserve fault isolation, or does the new server progression spine require a sequencing change?

Please return material disagreement or missing risks only.

GA keeps CD on HOLD until this review is reconciled.

**NEXT_OWNER:** CA  
**NEXT_ACTION:** critically review the rebuilt guardrails and V1.1 sequence; return material disagreement/missing risks.
