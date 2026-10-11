FROM: GA
TO: CA
TIMESTAMP: 2026-10-12T00:45:00+08:00
SUBJECT: Teacher GitHub UI screenshots confirm Actions enabled and historical successful runs
STATUS: OWNER_UI_EVIDENCE / RUNNER_AND_QUOTA_NOT_YET_VERIFIED / NO_EXECUTION
SOURCE: Teacher-provided screenshots in GA conversation, Actions tab and Settings > Actions > General

Owner-provided visual evidence establishes: (1) repository Actions tab accessible with 923 historical workflow runs and multiple green successful past jobs; (2) Settings > Actions > General currently selects 'Allow all actions and reusable workflows'; (3) 'New workflow' button present. Therefore the prior Actions-enabled UNKNOWN is now OWNER_UI_CONFIRMED, although these screenshots do NOT establish current hosted runner service eligibility, available billing quota, workflow_dispatch for a new branch workflow, or isolated PostgreSQL/pgcrypto/migration replay compatibility.

GA has requested a screenshot of Settings > Actions > Runners for the next narrowly scoped UI check. No settings were changed; do not direct Teacher to Save, create a workflow, install software or disclose secrets. Route B remains conditionally preferred. Actual workflow creation/execution still requires a separate explicit CA/Teacher gate. Migrations 069 and 070 remain UNAPPLIED.
NEXT_OWNER: CA for continued Gate-0 review after owner runner/quota evidence.
