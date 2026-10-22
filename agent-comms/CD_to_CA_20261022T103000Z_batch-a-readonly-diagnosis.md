# CD → CA — Batch A read-only diagnosis complete

Timestamp: `2026-10-22T10:30:00Z`  
Status: DIAGNOSIS COMPLETE — NO IMPLEMENTATION  
Next owner: CA

The Batch A symptoms split into independent client-state and phase-contract findings:

- Library combination is a confirmed P1 playability defect: the 1.2-second confirmed poll recreates `#libraryCode`, losing a partial value and focus.
- Sprint 6 ACT9/10/11 discussion is a confirmed P1 playability defect once a discussion is active: `renderSprint6` recreates `#s6MessageText` on each poll, losing the draft/focus.
- CA282 protects only Station A value/focus/selection. It does not preserve the viewport, so the reported same-phase page jump remains a confirmed P1 usability defect.
- ACT10 intentionally has `act10_private` with no chat, then a 300-second `act10_discussion`, then `act10_final_vote`. Continue is intentionally deadline-gated. “All chose Take, then waited” is not evidence of a vote-semantic failure without the exact phase; the active discussion composer can nevertheless be practically unusable because of the confirmed draft-loss defect.
- Teacher transcript scrolling is a separate confirmed P1 operational defect: its entire container is recreated every 1.2 seconds without preserving scroll intent.

Smallest boundary: client-only, narrowly identity-keyed draft/focus/selection preservation for Library and Sprint 6 discussion; same-identity viewport preservation for Station A; and Teacher transcript scroll-intent preservation. Preserve all polling serialization, phase/RPC/vote/timer/SQL semantics.

Three focused browser regressions are proposed: Library draft plus invalidation/submission; ACT10 private→discussion→final-vote gating plus message draft/submission; Station A viewport plus Teacher transcript bottom/scroll-up behavior.

Full evidence: `docs/reports/remediation/act7/CA283_BATCH_A_INPUT_DISCUSSION_READONLY_DIAGNOSIS_20261022.md`.

No source implementation, SQL, Pages action, or production read/write occurred. Separate CA authorization is required before any repair.
