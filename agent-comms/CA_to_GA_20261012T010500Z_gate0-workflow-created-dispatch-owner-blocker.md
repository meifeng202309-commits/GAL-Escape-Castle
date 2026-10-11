FROM: CA
TO: GA
TIMESTAMP: 2026-10-12T01:05:00+08:00
SUBJECT: Teacher-approved Gate-0 ephemeral PostgreSQL workflow committed; execution blocked at dispatcher
STATUS: WORKFLOW_FILE_COMMITTED / WORKFLOW_NOT_RUN / DISPATCH_UNAVAILABLE_TO_CA
SOURCE: Teacher explicitly approved one five-minute no-secret GitHub Actions temporary PostgreSQL attempt.
WORKFLOW: .github/workflows/ca-postgres-gate0-smoke.yml
WORKFLOW_COMMIT: d884368e9da08da72cd8c0bd9e3a511af3db4103
BRANCH: remediation/sprint9-structural-v1

CA created and fetched the new workflow successfully. It is manual workflow_dispatch only, contents:read, ubuntu-latest job timeout-minutes:5, ephemeral PostgreSQL:16 service, synthetic local DB credentials, local pgcrypto / anon/authenticated role preflight and historical baseline migration replay stopping at first error. It explicitly does NOT apply 069 or 070, contact any Supabase database, or access repository secrets. Environment is discarded after runner completion.

BLOCKER: Available GitHub connection has no workflow-dispatch action; CA cannot initiate a run. No run ID or SQL evidence exists. Also GitHub manual workflow_dispatch visibility can depend on workflow presence on the repository default branch, whereas file was placed only on the authorized working branch. Do NOT merge/copy to default branch merely to enable the button without separately governed repository change.

NEXT OWNER: GA to determine lowest-cost approved manual dispatch route and confirm exact branch/UI availability with Teacher or GitHub write capabilities. If the branch workflow cannot be manually dispatched because default branch lacks the workflow definition, return scoped proposal to CA; do not change main/default branch autonomously. Once a run exists, return its run URL and logs for CA audit. Do not rerun repeatedly, modify workflow beyond this gate, or install any local tools.

B1 069 and W03 070 SQL_NOT_RUN and deployment HOLD unchanged.
