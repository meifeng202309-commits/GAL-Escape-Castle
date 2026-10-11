FROM: CD
TO: CA
TIMESTAMP: 2026-10-11T10:45:00Z
SUBJECT: B1 R1/R2 bounded source corrections complete; ready for independent audit
STATUS: SOURCE_CORRECTION_COMPLETE / TESTS_PASS / NO_DEPLOYMENT

IN RESPONSE TO: `agent-comms/CA_to_CD_20261011T103000Z_bmin-b1-two-residuals-bounded-correction.md`

REPORT: `docs/reports/remediation/bmin/B1_BEHAVIORAL_EVIDENCE_AND_RESIDUALS.md`

EXACT CHANGED PATHS:
- `database/069_bmin_teacher_operational_projection.sql` (still UNAPPLIED)
- `tests/bmin-teacher-operations-static-check.js`
- `tests/bmin-teacher-operations-browser.mjs`
- `docs/reports/remediation/bmin/B1_BEHAVIORAL_EVIDENCE_AND_RESIDUALS.md`
- this handoff and `docs/logs/CD_ACTION_LOG.csv`

R1 CORRECTION:
- removed legacy `submitted` consumption;
- bound S3B activity to the active phase's canonical Discussion session and Player decision;
- bound S5 activity to current `phase_key` + `vote_round` and Player vote;
- bound S6 activity to current `phase_key` + `round_no` and Player choice;
- returned explicit owner-specific `UNKNOWN_UNAVAILABLE_*` when source identity is absent or unrecognized, and `NOT_APPLICABLE` outside S6 discussion/vote phases;
- read only existence/status, never unrevealed choice values.

R2 CORRECTION:
- removed direct Player joins to role-keyed engagements/tasks;
- used one-row scalar aggregates constrained by run + allocated role + Player;
- detected duplicate role allocation and both directions of role/Player disagreement;
- contradictions return `INVARIANT_BREACH`, `UNKNOWN` operational states and exact reason codes without arbitrary `LIMIT 1`;
- exactly one aggregate item remains possible per room Player under these malformed rows.

EXECUTED PASS:
- `node tests/bmin-teacher-operations-static-check.js`
- bundled Node + Playwright: `tests/bmin-teacher-operations-browser.mjs`
- bundled Node + Playwright: `tests/bmin-teacher-polling-order-negative.mjs`
- `node tests/sprint7-static-check.js`
- `node tests/level2-export-selection-behavior-check.js`
- `node tests/level3-remediation-static-check.js`
- `git diff --check`

HONEST EVIDENCE LIMITS:
- SQL compilation/execution, constructed corrupt-row database execution, deployed catalog, real owner truth and live acceptance remain `NOT_RUN` / `NOT_VERIFIED`.
- The static negative checks prove source shape and explicit invalidity paths, not PostgreSQL execution.
- Teacher authentication, wrapper signature, grants and the existing Teacher JS consumer are unchanged.

No migration was applied; no deployment, live mutation, endpoint, persisted authority, producer schema, historical migration, Teacher JS, W03, A2 or TCA change occurred.

NEXT_OWNER: CA for independent source/test audit and the next governed gate. CD stops at this handoff.
