# Narrow Level2 Re-audit — IDA2 residuals

## Audit identity

- **Audit owner:** CA
- **Audit level:** Narrow Level2 Targeted Independent Closure re-audit
- **Trigger:** `agent-comms/CD_to_CA_20260925T160349Z_level2-ida2-residual-narrow-reaudit-request.md`
- **Frozen implementation baseline:** `3b76246d5c0fa6678aaf22a785b56780cd52f5bb`
- **Parent audit:** `docs/audits/independent/runs/2026-09-25_ida2_001_006_level2_targeted_closure/AUDIT_REPORT.md`
- **Scope:** `IDA2-001-R1`, `IDA2-001-R2`, `IDA2-005-R1`
- **Decision:** **FAIL / BLOCKED — ONE NARROW RESIDUAL**
- **Sprint9 / Sprint10:** remain blocked

## Disposition

| Residual | Disposition | Independent result |
|---|---|---|
| IDA2-001-R1 | **FIXED / VERIFIED** | ACT2 Teacher safe-resolution now supplies canonical Library route state consumed by the GAL route-update UI. |
| IDA2-001-R2 | **PARTIALLY FIXED / OPEN** | Exact missing-player validity is now durable in `teacher_overrides` + `teacher_override_validity`, but the mandatory `teacher_override` runtime event still records an empty `invalidated_scope`. |
| IDA2-005-R1 | **FIXED / VERIFIED** | Teacher completed-run selection is preserved across ordinary polling/rerender when the selected run remains available. |

## Verified closure — IDA2-001-R1

Migration056 wraps the frozen migration054 authority path and, for:

`act2_first_contact / meeting_discussion / RESOLVE_AND_CONTINUE`

sets:

```text
current_route_target = library
wayfinding_target = library
```

after the canonical safe-resolution transition.

The actual GAL client renders the route-update destination from `scene.current_route_target`, so this closes the previous cross-layer handoff defect without synthesizing a player vote or route acknowledgement.

The added live regression also verifies `route_update + current_route_target=library`.

**Disposition: CLOSED.**

## Verified closure — IDA2-005-R1

The Teacher Console now captures the existing selected run before rebuilding the completed-run options, restores that run when it is still present, and binds `exportSessionButton.dataset.runId` to the restored selection.

Cross-layer trace:

```text
Teacher selects old completed Run A
→ polling invokes loadState/loadOperationsState
→ completed_runs is rerendered
→ prior selection is captured before innerHTML replacement
→ Run A is restored if still available
→ export RPC receives p_run_id = Run A
```

The dedicated behavior check models this exact rerender/poll sequence.

**Disposition: CLOSED.**

## Open residual — IDA2-001-R2-E1 — MEDIUM

### Canonical requirement

V4.0 §5.5.3 requires every successful Teacher Override to record a dedicated:

```text
event_type = teacher_override
...
invalidated_scope
```

The event itself is part of the required override evidence contract.

### Effective implementation

For ACT2 / ACT5 discussion safe-resolution, migration054 creates the `runtime_events` Teacher Override event while its local `scope` is still:

```text
[]
```

and serializes that empty array into:

```text
runtime_events.details.invalidated_scope
```

Migration056 subsequently reconstructs the correct missing-player scope and correctly persists it to:

- `teacher_overrides.invalidated_scope`;
- `teacher_override_validity`;
- the RPC return value.

But it does **not** reconcile the already-created `runtime_events` row.

Therefore one successful override can have two durable descriptions:

```text
teacher_overrides.invalidated_scope = [correct missing-player scope]
runtime_events.teacher_override.details.invalidated_scope = []
```

The exact player-validity evidence is now present elsewhere, so the original severe data-loss problem is substantially repaired. However the hard event-evidence contract remains internally inconsistent and the parent residual is not fully closed.

### Test blind spot

The new verification evidence does not inspect this contract:

- `level2-residual-live-e2e.js` checks returned/history `invalidated_scope`, not the `runtime_events` event;
- `level2-residual-integrity-transaction.sql` checks `teacher_override_validity`, not the event;
- `level3-remediation-static-check.js` does not inspect `runtime_events` or event `invalidated_scope`.

Thus the reported passes do not contradict this finding.

### Closure condition

For ACT2 and ACT5 Teacher-resolved discussions, the single canonical `teacher_override` event must carry the same exact missing-player invalidated scope as the authoritative override/validity evidence. Real votes/messages must remain untouched and no player decision may be synthesized.

Add a behavioral or database assertion that independently compares the event scope with the authoritative override scope for at least:

- zero submitted votes; and
- a partial real-vote case.

No implementation technique is prescribed by CA.

## Re-vote / partial-vote check

CA separately checked the apparent risk that an earlier vote round might mask a missing current final vote. The DiscussionRoom implementation creates a new `discussion_session_id` and new `vote_round` for canonical re-vote. Migration056 selects the latest discussion session, so prior-round decisions do not satisfy the latest-session missing-player check.

No additional finding is opened on this point.

## Migration chain

- migrations `001–054`: unchanged;
- migration055: deployed but exposed a PL/pgSQL variable/column ambiguity;
- migration056: additive public-wrapper correction using unambiguous variables and the frozen v054 authority implementation.

This is consistent with immutable deployed-history policy. No modification of migrations `001–055` is permitted.

Next additive database migration, if required: **057+**.

## Patterns A–F

- **Pattern A — Cross-module handoff:** PASS for R1.
- **Pattern B — stale/replay/concurrency:** no new bounded residual found.
- **Pattern C — UI/server authority:** PASS for completed-run selection.
- **Pattern D — current state vs historical evidence:** **FAIL narrowly** because the authoritative override row and required override event disagree on invalidated scope.
- **Pattern E — authority accretion:** PASS; no new client authority introduced.
- **Pattern F — self-confirming / incomplete verification:** **FAIL narrowly** because the new tests validate the corrected table/RPC scope but not the canonical runtime event carrying the same evidence.

## Canonical Ownership Check

**PASS.**

The frozen correction interval does not modify protected canonical gameplay/spec/localization sources to make implementation appear compliant.

## Gate

```text
IDA2-001-R1 = CLOSED
IDA2-005-R1 = CLOSED
IDA2-001-R2 = OPEN only for event-evidence consistency

Narrow Level2 re-audit = FAIL / BLOCKED
Sprint9 = BLOCKED
Sprint10 = BLOCKED
```

## Next owner / scope

**NEXT_OWNER = CD**

Permitted scope is now extremely narrow:

- canonical Teacher Override event evidence consistency for ACT2/ACT5 discussion safe-resolution;
- directly necessary regression evidence.

Do not reopen R1 or R5 and do not expand into Sprint9/10.

After one frozen correction baseline is submitted, CA performs one final narrow Level2 closure check of this event-evidence residual only. No duplicate Teacher approval is required.
