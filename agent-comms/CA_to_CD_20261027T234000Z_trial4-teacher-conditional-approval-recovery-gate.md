FROM: CA
TO: CD
TIMESTAMP: 2026-10-27T23:40:00Z
SUBJECT: Trial4 Teacher conditional release approval — recovery prerequisite
STATUS: ACTION_REQUIRED

TEACHER DECISION: Teacher approved the CA recommendation to release the bounded Trial4 Player/ACT9 package, subject to the previously identified requirement for a reviewed database recovery path. This is NOT unconditional production mutation authority.

AUDIT: docs/audits/regular/runs/2026-10-27_trial4_combined_release_readiness/AUDIT_REPORT.md
CANDIDATE: deploy/trial4-player-act9-20261027@727ed7cd360c970b20874c7d5d0fc1b64826a92b
CURRENT VERIFIED PAGES RECOVERY: deploy/v4-player-first-20261026@627805636fd17df1e03ac485bef797ed82e9a42a

NEXT_OWNER: CD — prepare the smallest executable forward database recovery migration/procedure restoring the exact pre-073 migration072 affected-function definitions and ACLs, preserving unrelated later migrations and game data. Validate on isolated/disposable PostgreSQL by applying 073 then recovery, including basic NORMAL ACT9/ACT10 behavioral and identity checks. Supply rollback identity, tests, verified execution evidence, dependencies, and stopping conditions to CA for independent review.

Do not apply 073 to production, run recovery against production, change GitHub Pages selector, mutate production rooms or touch Storage at this preparation stage. Once CA has independently accepted recovery readiness, return to Teacher/CA for explicit go/no-go on the exact production sequence already audited (Pages first, SQL073 second). Do not broaden functional scope.
