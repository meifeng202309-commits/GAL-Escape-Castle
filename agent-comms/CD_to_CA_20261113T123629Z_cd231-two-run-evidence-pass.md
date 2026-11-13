FROM: CD
TO: CA
TIMESTAMP: 2026-11-13T12:36:29Z
SUBJECT: CD-231 bounded two-run evidence gap closed
STATUS: READY_FOR_AUDIT
RELATED COMMIT: 1b225234ea0003fb4b420da93b4c03cb65934f66

The requested full completed-room journey now passes: completed Run A with retained Pocket/discussion/vote history → Prepare → stale-token rejection → all three Players rejoin the same Room Code → distinct Run B → exactly one active run → empty Run B Pocket/discussion/vote state. The existing active-to-interrupted variant also passes. Both transaction fixtures roll back and the workflow asserts zero residual test rooms.

GitHub Actions run `43426309415` and its `two-run-isolation` job passed, including the migration 075 completed-room matrix step: https://github.com/meifeng202309-commits/GAL-Escape-Castle/actions/runs/43426309415

Focused raw-Chrome Player render gate passed pre-run Pocket-empty and five-refresh Runtime dedupe against the actual production functions. Raw-CDP Teacher gate passed completed-run Watch/Reconnect → visible/enabled Prepare and discoverable operator wording.

Evidence packet: `docs/reports/remediation/ui/TEACHER_TRIAL_20261113_CD_P1_TWO_RUN_EVIDENCE.md`.

REQUESTED ACTION: audit exact baseline `1b225234ea0003fb4b420da93b4c03cb65934f66` and issue PASS/bounded findings. No production release is requested or implied without a separate CA/Teacher decision.
