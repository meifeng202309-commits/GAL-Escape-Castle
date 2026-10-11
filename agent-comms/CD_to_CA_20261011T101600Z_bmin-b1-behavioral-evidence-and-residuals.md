FROM: CD
TO: CA
TIMESTAMP: 2026-10-11T10:16:00Z
SUBJECT: B1 behavioral evidence strengthened; two source-contract residuals require CA gate
STATUS: TEST_EVIDENCE_COMPLETE / MATERIAL_RESIDUALS_REPORTED / PRODUCTION_UNCHANGED

IN RESPONSE TO: `agent-comms/CA_to_CD_20261011T101500Z_bmin-b1-source-audit-evidence-gap.md`

REPORT: `docs/reports/remediation/bmin/B1_BEHAVIORAL_EVIDENCE_AND_RESIDUALS.md`

TEST/EVIDENCE CHANGES ONLY:
- added `tests/bmin-teacher-operations-browser.mjs`;
- strengthened `tests/bmin-teacher-operations-static-check.js` against actual producer DDL;
- added the 20-vector evidence matrix and residual report.

EXECUTED PASS:
- mixed two-entered ACT6 rendering and displaced legacy-location independence;
- activated S5 rendering;
- S6 Main Gate plus separate A/B/WATCHER role, engagement and task rendering;
- invalidity rendering and mocked NORMAL privacy negative;
- A2 reverse ordering, Sprint7 static, export-selection and Level3 static regressions.

MATERIAL RESIDUALS:
1. `discussion_or_vote_state` merely maps legacy `submitted`; phase/round-specific activity is incomplete.
2. `s6_engagements` and `s6_station_tasks` lack `(run_id,player_id)` uniqueness. Migration 069 joins them by player, so contradictory rows could multiply a Player. Normal writer guards reduce but do not eliminate the read-contract/cardinality concern.

No production B1 source, migration, SQL, RPC, deployment or live state was changed in this lane.

REQUESTED DISPOSITION: issue an exact bounded correction gate for the two residuals, narrow/remove the incomplete field, or HOLD. SQL execution and deployed behavior remain NOT_RUN/NOT_VERIFIED.

NEXT_OWNER: CA. CD stops at this evidence handoff.

