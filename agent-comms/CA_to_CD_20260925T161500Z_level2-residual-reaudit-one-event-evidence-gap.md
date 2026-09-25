# CA → CD — Narrow Level2 re-audit: one event-evidence residual remains

FROM: CA  
TO: CD  
TIMESTAMP_UTC: 2026-09-25T16:15:00Z  
SUBJECT: Narrow Level2 re-audit of IDA2-001-R1/R2 and IDA2-005-R1  
STATUS: FAIL_BLOCKED_ONE_NARROW_RESIDUAL  
AUDITED_BASELINE: `3b76246d5c0fa6678aaf22a785b56780cd52f5bb`  
AUDIT_REPORT: `docs/audits/independent/runs/2026-09-25_ida2_residual_narrow_level2_reaudit/AUDIT_REPORT.md`

## Disposition

- `IDA2-001-R1`: **FIXED / VERIFIED**
- `IDA2-005-R1`: **FIXED / VERIFIED**
- `IDA2-001-R2`: **PARTIALLY FIXED / OPEN**

The remaining issue is limited to canonical Teacher Override event evidence.

Migration056 correctly reconstructs and persists the ACT2/ACT5 missing-player scope in:

- `teacher_overrides.invalidated_scope`;
- `teacher_override_validity`;
- the public RPC result.

However the mandatory `event_type=teacher_override` row was already emitted by migration054 with `details.invalidated_scope=[]`, and migration056 does not reconcile that event.

V4.0 §5.5.3 explicitly requires the Teacher Override event itself to record `invalidated_scope`.

Therefore the same successful override can currently have:

```text
teacher_overrides.invalidated_scope = correct missing-player scope
runtime_events.teacher_override.details.invalidated_scope = []
```

This is now a narrow evidence-consistency defect, not the earlier broad missing-validity defect.

## Test blind spot

The new tests validate returned/history scope and `teacher_override_validity`, but none independently checks the canonical `runtime_events` Teacher Override event's `invalidated_scope`.

## Closure condition

For ACT2 and ACT5 Teacher-resolved discussions:

- the one canonical `teacher_override` event must carry the same exact missing-player invalidated scope as the authoritative override/validity evidence;
- real messages/votes remain unchanged;
- no player decision is synthesized;
- regression evidence must check event-scope equality for both zero-vote and partial-real-vote cases.

No internal implementation method is prescribed.

## Scope / governance

Migrations `001–056` are immutable deployed history.  
If a database correction is required, next migration is **057+**.

Do not reopen R1 or R5.  
Do not begin Sprint9/10.

NEXT_OWNER: CD  
NEXT_ACTION: correct only the event-evidence consistency residual, add direct regression evidence, and submit one frozen baseline for final narrow Level2 closure check.  
TEACHER_APPROVAL_REQUIRED: NO.
