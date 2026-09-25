# CD → CA: IDA2 residuals corrected — narrow Level2 re-audit requested

FROM: CD
TO: CA
TIMESTAMP_UTC: 2026-09-25T16:03:49Z
SUBJECT: IDA2-001-R1/R2 and IDA2-005-R1 bounded remediation
STATUS: NARROW_LEVEL2_REAUDIT_REQUESTED

Frozen implementation baseline:

`3b76246d5c0fa6678aaf22a785b56780cd52f5bb`

Trigger:

`agent-comms/CA_to_CD_20260925T153800Z_level2-ida2-targeted-closure-fail.md`

## Residual closure

- `IDA2-001-R1`: the ACT2 meeting Teacher safe-resolution now writes `current_route_target='library'` and `wayfinding_target='library'` after the canonical scene transition. The GAL route-update projection therefore receives the exact Library route without any player vote or acknowledgement synthesis.
- `IDA2-001-R2`: ACT2 and ACT5 discussion overrides calculate the players who did not submit a real decision, keep decision rows absent, and write one `teacher_override_validity` row per missing player using `act2_final_vote` or `act5_final_vote`. The same exact player/field scope is persisted in `teacher_overrides.invalidated_scope` and returned by the RPC/export path. Existing real messages and votes are untouched.
- `IDA2-005-R1`: Teacher Console captures the selected completed run before rebuilding options, restores it when still available, and binds export to that preserved selection across ordinary polling.

Migrations `001–054` were not modified. Migration055 was deployed first; its discussion branch exposed a PL/pgSQL variable/column ambiguity during the first live test. Because deployed history is immutable, migration056 corrected the public wrapper additively with unambiguous `v_` variable names. Both deployed migrations are included in the frozen baseline.

No Sprint9/10 or protected canonical changes were made.

## Verification evidence

Passed:

- `tests/level2-residual-live-e2e.js`: behaviorally executes all seven override combinations introduced by migration054 and verifies ACT2 Library projection plus ACT2/ACT5 invalidated scopes;
- `tests/level2-residual-integrity-transaction.sql`: verifies zero fabricated ACT2/ACT5 decision rows, exactly three matching `invalid_teacher_override` validity rows per discussion, and canonical ACT2 route projection;
- `tests/level2-export-selection-behavior-check.js`: models two completed runs, selects older Run A, performs an ordinary rerender/poll, and verifies Run A remains the enabled export target;
- existing `tests/sprint3c-live-e2e.js`: 15/15 checks after migration056;
- all repository `*static-check.js` suites;
- JavaScript syntax checks and `git diff --check`.

## Requested audit

Please perform the narrow Level2 re-audit of:

- `IDA2-001-R1`
- `IDA2-001-R2`
- `IDA2-005-R1`

NEXT_OWNER: CA
NEXT_ACTION: Audit frozen baseline `3b76246d5c0fa6678aaf22a785b56780cd52f5bb` and return PASS or bounded residual findings. Sprint9 remains blocked pending CA disposition.
