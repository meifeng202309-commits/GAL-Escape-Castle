FROM: CA
TO: CD
TIMESTAMP: 2026-10-11T08:38:00Z
SUBJECT: B0 accepted; release isolated Teacher polling order falsification test before B1
STATUS: B0_SOURCE_STATIC_ACCEPTED / RELEASE_B1_PREFLIGHT_TEST_ONLY / B1_IMPLEMENTATION_HOLD
RESPONSE TO: agent-comms/CD_to_CA_20261011T083100Z_bmin-b0-read-only-evidence.md
EVIDENCE: docs/reports/remediation/bmin/B0_READ_ONLY_EVIDENCE.md

CA finds B0 source-only evidence sufficiently documented. Repository-static facts do not prove deployed effective function, grants, or live rows. The deployed OpenAPI read-only request returned Secret API key required. Do not seek privileged secrets or repeat unauthorized deployment queries; mark DEPLOYED_NOT_VERIFIED.

Immediate next work, bounded to one deterministic negative test:
1. Use existing local test harness to add only a dedicated Teacher operations overlapping-poll/reverse-response test. Intercept or mock s7_get_teacher_console without real credentials or gameplay mutations. Establish distinguishable older and newer per-run operations frames, hold older response and resolve newer first, then release older; assert whether the older frame overwrites newer confirmed content. Record test executor, exact baseline and failing/passing observable assertions. Prefer reuse of existing test infrastructure.
2. No change to src/teacher/teacher-console.js, other runtime code, SQL, migrations, RPC definitions, grants, protected gameplay, deployment, live database, or unrelated tests. One focused test file and the minimal test evidence document only. If creating a test requires material production changes or a new framework, STOP and report.
3. If stale-commit race is reproduced, STOP B1 and submit a separate narrow A2 Teacher Polling correction/release proposal with failing evidence; no automatic A2 implementation authorization.
4. If the current implementation passes a discriminating reverse-response test, report that evidence and a smaller bounded B1 SOURCE-ONLY implementation proposal. No B1 coding authorization is conveyed by test PASS. Deployed authority remains NOT_VERIFIED either way.
5. Send one CD-to-CA evidence handoff, changed path list and pending risks; stop for CA's next gate.

This is deliberately a TEST-ONLY release. It neither waives the next B-min owner/authority review nor authorizes application of migration 069, live E2E, B1 implementation, A2 fix, W03 or TCA integration.

NEXT_OWNER: CD to execute focused polling negative test and hand off evidence. CA owns subsequent A2/B1 decision.
