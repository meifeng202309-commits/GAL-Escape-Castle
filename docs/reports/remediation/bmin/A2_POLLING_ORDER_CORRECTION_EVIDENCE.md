# A2 Teacher Polling Order Correction Evidence

Timestamp: 2026-10-11T08:51:00Z  
Authorized baseline: `5378c8360606ec108aa504cdd2ce331b0824a54d`  
Authorization: `agent-comms/CA_to_CD_20261011T085000Z_a2-teacher-polling-bounded-correction-release.md`

## Changed files

- `src/teacher/teacher-console.js`
- `tests/bmin-teacher-polling-order-negative.mjs`
- this evidence report

No SQL, migration, RPC, grant, polling cadence, endpoint, B1 projection, deployment, or live database state changed.

## Implementation

`loadOperationsState` now increments a local operations-load generation for each started request. Success and failure paths compare their captured generation with the latest generation before committing Teacher operations DOM, badge, or status. A late stale success or failure returns without changing the newer result.

The guard does not compare `run_id`; it protects overlapping refreshes within the same run. Existing RPCs, the 1.2-second polling interval, manual refresh, and export selection remain unchanged.

## Focused browser regression

Executor: bundled Node.js + Playwright, local HTTP server, fully mocked RPC routes, no real credentials or production access.

Covered cases:

1. same-run older success resolves after newer success: newer location/status remain;
2. stale failure resolves after newer success: newer DOM/badge/status remain;
3. latest failure: `Unavailable`, error text, and `Operations refresh failed.` remain visible.

Result:

```text
PASS: Teacher operations generation guard rejects stale same-run success and failure while preserving latest failure.
```

## Regression commands and results

```text
node tests/bmin-teacher-polling-order-negative.mjs
PASS

node tests/sprint7-static-check.js
PASS — Sprint 7 static contract checks passed.

node tests/level2-export-selection-behavior-check.js
PASS — Level2 Teacher export-selection polling behavior passed.

node tests/level3-remediation-static-check.js
PASS — Level3 remediation static checks passed.

node --check src/teacher/teacher-console.js
PASS

node --check tests/bmin-teacher-polling-order-negative.mjs
PASS

git diff --check
PASS (line-ending conversion warnings only)
```

Deployed/live A2 behavior remains `NOT_VERIFIED`; deployment and live E2E were not authorized.

## Rollback and residual boundaries

Pre-deployment rollback is a Git revert of the A2 implementation commit. There is no database rollback.

B1/W05, W03, TCA integration, deployed-catalog verification, and any generalized polling lifecycle remain outside this correction.

