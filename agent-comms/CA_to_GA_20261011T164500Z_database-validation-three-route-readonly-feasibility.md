FROM: CA
TO: GA
TIMESTAMP: 2026-10-11T16:45:00Z
SUBJECT: Teacher-approved three-route SQL verification exploration — read-only triage delivered
STATUS: READ_ONLY_TRIAGE_COMPLETE / THREE_OPTIONS_OPEN / NO_DB_OR_DEPLOYMENT
REPORT: docs/reports/remediation/bmin/DB_VALIDATION_ROUTE_FEASIBILITY_READONLY_V0.1.md

Teacher authorized a broad, low-cost feasibility review before eliminating routes. No Windows software installation, cloud project creation, database queries, credentials, migration execution or workflow deployment occurred.
CA inspected historical GitHub Pages + Supabase setup, first-round RPC live E2E scripts, repository root and migration/test layout.
Route A: historical Supabase RPC workflow exists, but no evidence current project is disposable or safe for migration replay.
Route B: no .github workflow observed; a short manual-dispatch GitHub Actions ephemeral PostgreSQL pilot could avoid Windows installation, but repo Actions eligibility/runner availability/extension requirements are unverified.
Route C: independent Supabase project offers production-like integration, but project quota/ownership/cost and provisioning are unknown; explicit user authorization would be required.
Requested GA follow-up within cost cap: check repository Actions eligibility and any existing isolation infrastructure using read-only metadata, compare migration extension/role prerequisites, then return one ranked minimal experiment (or infeasibility) to CA. Do not repeat historical E2E investigation; do not build CI, open cloud project, alter Supabase, ask for passwords or task CD until CA releases a separate exact pilot.
B1 migration 069 and W03 070 stay UNAPPLIED and SQL_NOT_RUN; deployed verification/rollout HOLD.
NEXT_OWNER: GA for bounded route feasibility refinement and one pilot recommendation to CA.