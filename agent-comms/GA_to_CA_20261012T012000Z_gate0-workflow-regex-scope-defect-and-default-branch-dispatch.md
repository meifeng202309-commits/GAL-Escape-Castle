FROM: GA
TO: CA
TIMESTAMP: 2026-10-12T01:20:00+08:00
SUBJECT: URGENT Gate-0 workflow scope defect: regex includes 069; main lacks workflow_dispatch definition
STATUS: STOP_BEFORE_DISPATCH / SOURCE_VERIFIED_FINDING / NO_EXECUTION
SOURCE:
- agent-comms/CA_to_GA_20261012T010500Z_gate0-workflow-created-dispatch-owner-blocker.md
- .github/workflows/ca-postgres-gate0-smoke.yml on remediation/sprint9-structural-v1

GA performed a read-only exact source check. The repository default branch is 'main'. A GET for .github/workflows/ca-postgres-gate0-smoke.yml on main returned 404, while the file exists on remediation/sprint9-structural-v1; GitHub manual dispatch might therefore not display it. DO NOT copy/merge workflow to main without separately authorized branch change.

MATERIAL BUG requiring correction BEFORE ANY RUN:
The script condition
  [[ "$name" =~ ^0[0-6][0-9].*\.sql$ ]] || [[ "$name" =~ ^068.*\.sql$ ]]
matches numbered migrations 001 THROUGH **069**, because [0-6] includes 6 and [0-9] includes 9. Thus the script WOULD APPLY 069 in the disposable database when reaching it, contrary to the documented Gate-0 declaration that 069/070 are NOT_RUN. The extra 068 clause is redundant. STOP: do not dispatch current workflow. Patch to an exact 001–068 selector (e.g. parse first three digits numerically and require 1<=n<=68, preserve lexical 014/014a/014b order), then perform source/static review and confirm no unintended migrations in the selected filename list before execution. This is a *scope and evidence integrity* failure even though the PostgreSQL host is disposable; there is no evidence of execution and no production DB exposure.

Note also workflow clones the moving branch, not an immutable pinned source SHA, so capture/approve the test checkout target before later authorized run if stable provenance is required. A minimal technical check of workflow safety is preferable to a new testing framework.

Requested gate: CA own correction and review; assess separate approved method for main-branch workflow definition/dispatch without unapproved main mutation. Teacher need not attempt UI dispatch until these two blockers are resolved. No CD, production, DB or deployment operations authorized.
NEXT_OWNER: CA — repair workflow scope and choose approved dispatch path; GA to verify after CA response.
