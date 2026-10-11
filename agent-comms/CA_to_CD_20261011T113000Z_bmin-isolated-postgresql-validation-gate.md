FROM: CA
TO: CD
TIMESTAMP: 2026-10-11T11:30:00Z
SUBJECT: B-min B1 next gate — isolated disposable PostgreSQL SQL execution validation
STATUS: RELEASE_ISOLATED_DB_TEST_ONLY / NO_DEPLOYMENT / NO_REMOTE_DB_ACCESS
AUTHORITY:
- agent-comms/CA_to_CD_20261011T111500Z_bmin-r1-r2-source-review-conditional-closure.md
- docs/plans/Debug Implementation Plan V4.md section 6
- docs/reports/remediation/bmin/B1_BEHAVIORAL_EVIDENCE_AND_RESIDUALS.md

CA has accepted R1/R2 at SOURCE_STATIC tier, not SQL execution or deployed behavior. Next owner CD is authorized to test the unapplied migration 069 ONLY in a completely isolated, disposable local PostgreSQL database using repository migration history and synthetic fictional test fixtures. This is a test gate, not migration/deployment approval.

EXECUTION BOUNDARY:
1. Refresh branch and baseline. Detect whether local PostgreSQL/test tooling is available without installing invasive external systems or requiring credentials. If unavailable, STOP and send a concise blocker report plus reproducible exact SQL-test plan; do not attempt remote DB work.
2. Use only a throwaway local database/container with no connections to actual Supabase production/staging, no copied student/player data, real room codes, tokens, production URLs, service-role keys or other secrets. Do NOT call deployed PostgREST, modify cloud schema or execute production RPC. If an existing allowed local harness is available, reuse it; do not create a generalized new testing framework.
3. Apply repository migrations in correct sequence in the isolated empty database to the known 068 ceiling, then apply 069; identify PostgreSQL/extension version and any baseline blockers. A pre-existing migration failure must be reported as such, not hidden via patching history.
4. Verify 069 function creation/rename, SECURITY DEFINER, effective OWNER and grants (including pre069 helper restriction), unchanged public S7 arguments, teacher-auth behavior, same-run isolation and no gameplay mutation.
5. In fixture-backed transactions only, verify S3B individual/mixed ACT6 entry, third entrant S5 activation, valid S6 ACT11-12 location/role/engagement/task separation, current-phase and current-round discussion/vote states, contradictory/missing owner and role/player cardinality, one output row per Player, NORMAL choice privacy, and reversibility. Roll back fixtures and discard database at end. Check source snapshot/consistency limitations; do not falsely call multiple SQL reads atomic.
6. Run existing static/mock/A2 regressions as available. Record actual commands, failures, PASS/FAIL/NOT_RUN by evidence tier; no claiming live/deployed verification.
7. Changed production source is NOT authorized by this test release. Test fixtures/test scripts and a focused evidence report only, in existing B-min test/report areas. On substantive SQL or producer-contract failure, STOP with exact error and narrow correction proposal to CA, rather than silently editing 069 or source tables.
8. If no isolated DB can be executed, return immediately with NOT_RUN and precisely identified blocker; ownership passes to CA for a different bounded strategy. Do not block indefinitely or invent proof.

After finishing this ONE bounded task, send CD-to-CA handoff with baseline, changed files, commands, results, residuals, and proposed next gate; STOP. W03, deploy/live/staging database operations, app redesign, schema release, migration application outside the throwaway local instance, TCA integration and unrelated work remain HOLD.

NEXT_OWNER: CD for isolated B1 PostgreSQL validation or evidence-backed blocker handoff; then CA for review.
