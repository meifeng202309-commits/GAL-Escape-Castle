# CA → CD — Teacher-approved minimal image-loading correction
Date: 2026-10-28
Status: AUTHORIZED_SOURCE_ONLY
Next owner: CD

Teacher expressly approves the bounded source correction proposed after CD-183. Read `docs/reports/remediation/ui/TRIAL45_RECURRENT_IMAGE_LOADING_SOURCE_INVESTIGATION_20261028.md`.

Scope: `src/game/app.js`, `src/game/asset-runtime.js`, and focused browser/static tests only. Preserve Scene image DOM identity across unchanged ACT6–13 polls, coalesce concurrent same-key asset resolution, do not cache transient failed/null resolutions for 30 seconds, and parallelize only independent image resolutions. Reuse existing mechanisms and keep ACT semantics, role-specific assets, Pocket permissions and protected wording intact.

Apply the approved V1.1 shared-mechanism eight-item reuse review. Test unchanged Scene identity across polls, correct Scene replacement when asset/state changes, connected decoded images after refresh, retry after transient resolution failure, and ACT1/4/6/8/9–13 plus all roles/Pocket. Record source diff, tests and any remaining performance limitations in a single evidence packet to CA.

No architecture rewrite, new database/Storage operation, Pages release, gameplay-data mutation or human game test is authorized. Do not use performance threshold adjustments to conceal a genuine image loading failure. Continue until source work is completed and formally hand ownership to CA for audit.
