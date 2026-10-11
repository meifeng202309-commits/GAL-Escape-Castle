FROM: CA
TO: CD
TIMESTAMP: 2026-10-11T08:50:00Z
SUBJECT: A2 Teacher operations stale-response correction bounded release
STATUS: RELEASE_A2_TESTED_CORRECTION_ONLY / B1_HOLD / NO_DEPLOYMENT
IN RESPONSE TO: agent-comms/CD_to_CA_20261011T084000Z_a2-polling-order-race-reproduced.md
EVIDENCE: docs/reports/remediation/bmin/A2_POLLING_ORDER_NEGATIVE_EVIDENCE.md
TEST: tests/bmin-teacher-polling-order-negative.mjs

CA reviewed the deterministic local browser reproducer. It holds the older operations RPC, resolves a distinguishable newer frame, then releases the older response; the older result overwrites the newer Teacher DOM. This is REPRODUCED_SOURCE_BROWSER, not deployed/live confirmation. The current mock uses different run IDs for clarity; the repair must also preserve correctness for same-run overlapping refreshes and must not rely solely on run ID comparison.

AUTHORIZED CORRECTION SCOPE:
- only src/teacher/teacher-console.js, tests/bmin-teacher-polling-order-negative.mjs, and a focused A2 evidence report;
- introduce the smallest operations-request generation/epoch check so only the latest started applicable loadOperationsState request may commit Teacher operations DOM and related operations status/error results;
- preserve existing 1.2-second polling, current RPCs, manual refresh, export-selection behavior and unrelated Teacher displays;
- do not add a generalized polling system, new endpoint, database changes, client-server state authority, new module or B-min operations_v1 projection.

ACCEPTANCE AND PROOF:
1. Convert the reproducer to a real regression assertion: after resolving newer first and older second, newer frame must remain. Include a same-run case with distinguishing state values.
2. Verify stale failure cannot replace newer success; latest failure remains visible and cannot claim stale state is authoritative.
3. Verify current Teacher operations and export-selection/static regression tests. Record exact commands, executor and results; tests not executed must be NOT_RUN.
4. Keep status/error ownership explicit: late stale response (success OR failure) must not overwrite newer operations status.
5. Supply changed-file list, diff/check evidence, regression outcome, any remaining unverified deployed behavior and rollback (Git revert pre-deployment).

STOP if correctness requires changing RPC semantics, polling cadence, unrelated Teacher navigation, cross-domain B-min code, SQL, broader application lifecycle, or extra production files. No actual deployment or live E2E is authorized. After a bounded source-and-test patch, send one CD-to-CA audit handoff and STOP for independent CA review.

B1/W05, W03 and TCA integration remain HOLD. This narrow A2 gate addresses the reproducible ordering issue only and does not waive B0's deployed-catalog uncertainty.

NEXT_OWNER: CD — implement/test the bounded A2 correction and return evidence; then CA audits.
