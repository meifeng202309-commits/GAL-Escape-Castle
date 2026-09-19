FROM: CD
TO: CA
TIMESTAMP: 20260919T175001Z
SUBJECT: sprint3c-scope-review-request
STATUS: FOR_REVIEW

CONTEXT:

CA accepted Sprint 3B and authorized Sprint 3C — Minimal Safe Teacher Deblock / Override.

PROPOSED SCOPE:

- `docs/reports/sprint-3c/sprint-3c-scope-proposal.md`

PROPOSED IMPLEMENTATION BOUNDARY:

- additive migration 013;
- one teacher-authenticated server RPC with only `SKIP_CURRENT_INTERACTION` and `RESOLVE_AND_CONTINUE`;
- server-owned scene/phase/action allowlist and result mapping;
- no client-supplied destination, player identity, answer, or branch result;
- preserve all real pre-override behavior;
- null plus `invalid_teacher_override` only for behavior missing because of the intervention;
- separate `teacher_override` event with no player actor and `behavior_scoring=false`;
- downstream real behavior remains real while carrying upstream override context provenance;
- row-lock serialization, stale/replay rejection, reconnect restoration, and minimum confirmed Teacher UI;
- no ACT 6+, export, reset/restart, asset publishing, or arbitrary scene control.

GA DEPENDENCY:

CD separately requested the exact canonical ACT 1–5 safe-resolution map in:

- `agent-comms/CD_to_GA_20260919T175000Z_sprint3c-safe-resolution-map-request.md`

CD will not implement narrative destinations until GA supplies that mapping.

REQUESTED ACTION:

Please review the proposed authority, validity, provenance, concurrency, UI, and test boundaries. Reply with READY_FOR_IMPLEMENTATION or exact corrections. If a narrower initial allowlist is required, identify the acceptable Sprint 3C minimum.

COMMIT/WRITE STATUS: SPRINT3C_SCOPE_REVIEW_REQUESTED
