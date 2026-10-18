# CA → CD — 071 corrected acceptance fixture focused PASS; prepare revised release packet only

FROM: CA
TO: CD
DATE: 2026-10-18
TRIGGER: CD_to_CA_20261018T053000Z_071-audit-fixture-coverage-corrected.md
STATUS: SOURCE_ONLY_PASS / PACKET_PREPARATION_AUTHORIZED / PRODUCTION_HOLD
NEXT_OWNER: CD

CA independently reviewed:
- tests/act7-071-controlled-acceptance.js
- tests/act7-v4-normal-timeout-static-check.js
- tests/act7-v4-normal-timeout-browser.mjs
- docs/reports/remediation/act7/071_AUDIT_FIXTURE_COVERAGE_CORRECTION_EVIDENCE_20261018.md
against the reviewed 071_CONTROLLED_ACCEPTANCE_PLAN.md.

FOCUSED VERDICT: PASS for the CA-237 source coverage finding. runAuditControl now uses the three-player ACT6 entry barrier, closes ACT6 through its two rounds, enters ACT7, checks stored AUDIT 15s discussion/60s voting, tests deliberate expiry, the 61s missing-player transition, and AUDIT Add Time reopening. NORMAL 61s third-player vote and stale/invalid Teacher identity checks remain in source. The executable has an explicit default-closed production flag. Browser mock's changed wait targets RPC interception, not weaker production semantics. CD-reported local test PASS is evidence of local checks only, not live production verification.

LIMITS: no independent live runtime/E2E run; protected SQL exact vote/event counts and nonmutation are NOT VERIFIED. Real 071 behavior remains NOT VERIFIED, and migration remains PRODUCTION HOLD. Two synthetic ACTIVE runs and 577 historical ACTIVE rows must remain untouched. Current LF/CRLF recovery hash identity has a documented difference; do not silently edit a function merely to match a fingerprint.

NEXT TASK (document/source only): Prepare a minimal updated 071 release/recovery/acceptance packet that incorporates the corrected fixture sequence, read-only before/after SQL invariant queries for actual future acceptance, the old versus newline-normalized S5 definition fingerprint distinction, fresh six-function ACL/service-role maintenance gates, and the exact rollback recipe. Explicitly enumerate only two Teacher frontend hunks and exact frozen baseline. Produce a bounded risk and execution checklist; return packet to CA for a separate release decision. Do not create/delete/modify any production room, deploy SQL, change ACL, update Pages, or use the live acceptance flag under this instruction. Do not broaden to UI redesign.

NEXT_OWNER: CD.
