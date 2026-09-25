# ACT1–14 Post-Sprint8 Level3 Rundown

## Decision

**FAIL / BLOCKED**

Sprint8 regular/focused gate remains VERIFIED PASS as a local Sprint8 conclusion.

The integrated ACT1–14 milestone snapshot does **not** release Sprint9 because cross-layer defects exist outside the narrow Sprint8 closure scope.

## Findings

- IDA2-001 HIGH — current V4.0 ACT1–5 Teacher Override hard allowlist only partially implemented.
- IDA2-002 HIGH — canonical ACT3 Library Box override cannot pass ACT14 integrity.
- IDA2-003 HIGH — Teacher Console export button remains disabled after successful completion.
- IDA2-004 HIGH — semantic integrity can miss loss/mismatch of authoritative group outcomes.
- IDA2-005 HIGH — export target collapses sequential runs back to latest-completed-by-room.
- IDA2-006 MEDIUM — `exported_at` is actually finalization time.

## Canonical Ownership Check

**PASS.**

No evidence was found that the Sprint8 remediation interval authored protected canonical localization/game-script/visual content under CD/ISA authority.

The relevant V4.0 Teacher Override hard map predates the implementation being audited:
- canonical map commit `529f042...`;
- implementation migration015 commit `c838724...`.

Therefore IDA2-001 is implementation nonconformance to existing canon, not a request for CA to invent new canon.

## Patterns A–F

### Pattern A — local correctness / cross-module handoff
**FINDING**
- ACT3 override works locally but cannot finalize.
- finalization/export RPCs work locally but Teacher UI handoff fails.

### Pattern B — distributed stale/retry/sequential-run behavior
**FINDING**
- finalization is now properly run-bound;
- export remains room-scoped and loses old-run addressability after a later completed run.

### Pattern C — UI/server boundary
**FINDING**
- server export authorization is ready but Teacher UI state machine prevents reaching the action.
- Override incompleteness is server-side too, so it is not dismissed as a UI-only issue.

### Pattern D — current state vs historical evidence
**FINDING**
- ACT2 authority/history coherence is not fully enforced.
- exported_at misstates the lifecycle event represented.

### Pattern E — authority accretion
**FINDING**
- Run identity is first-class for finalization but not for export.
- current canonical override authority and effective runtime authority differ.

### Pattern F — self-confirming tests
**FINDING**
- override tests cover the three implemented cases rather than the full canonical map;
- direct RPC export tests bypass Teacher UI;
- sequential export test stops before two completed runs coexist;
- integrity tests primarily delete evidence rather than contradict authority vs evidence.

## Areas that passed / remained coherent

- run-bound finalization stale-request isolation;
- same-run finalization concurrency/idempotency;
- schema-version durable authority 1.1;
- ACT14 staged presentation;
- explicit export allowlist vs raw database-row serialization;
- exact per-player ACT1/2/4 override accounting added in migration052;
- ACT6 effective fallback-round integrity added in migration053;
- migrations001–053 append-only history;
- CD/ISA authority separation in WP-S8-02;
- protected canonical ownership in the audited remediation interval.

## NOT VERIFIED boundaries — not current defects

- final production visual/audio integration: Sprint9 scope;
- physical three-device full ACT1→14 release-candidate run: Sprint10 scope;
- production-class authentication redesign: explicitly outside current prototype scope unless separately authorized.

## Next gate

```text
SPRINT8 = VERIFIED PASS locally
MILESTONE LEVEL3 = FAIL
SPRINT9 = BLOCKED
SPRINT10 = BLOCKED
```

Next owner: **CD**.

Expected closure audit after remediation: **Level 2 Targeted Independent Closure**, not another full Level3 rerun.
