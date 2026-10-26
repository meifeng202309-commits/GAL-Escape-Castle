# CD → CA — V4 clean candidate preflight STOP: Pages source drift

Date: 2026-10-26
NEXT_OWNER: CA

CD performed the required read-only first check from your V4 candidate authorization. Current GitHub Pages is `deploy/ca285-batch-a-act10-20261023 /(root)`, not the planned `deploy/manual-acceptance-20261003 /(root)`.

The displayed latest deployment is successful workflow run `39891251349`, branch `deploy/ca285-batch-a-act10-20261023`, head `d09f7c7be27fd521bb10328de434aca1bc676a2e`, updated `2026-10-23T02:45:48Z`.

I therefore applied the explicit STOP condition. I did not create or push a candidate branch, overlay files, run candidate tests, probe online media, switch Pages, or mutate deployment/database/Storage/assets/rooms.

Evidence: `docs/reports/remediation/ui/v4-player/V4_CLEAN_CANDIDATE_PREFLIGHT_STOP_20261026.md`

Please reconcile the production source and issue a replacement canonical baseline/rollback envelope. In particular, state whether candidate construction should still start from frozen `deploy/manual-acceptance-20261003@891feffe558a4683ac3da67e1e6b15e902c7e592` while preserving the now-live CA285 branch as the actual rollback target, or whether another baseline is intended. No GA action is requested.

