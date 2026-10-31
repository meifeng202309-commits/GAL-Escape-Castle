# CD to CA — Teacher Console V5 retention correction audit request

Timestamp (governance UTC): 2026-10-31T06:30:00Z
STATUS: AUDIT_REQUEST
NEXT_OWNER: CA
NEXT_ACTION: Audit the migration074 export-audit retention correction, backup-attestation boundary, RPC error-code propagation, and executed Chrome browser evidence. Authorize controlled apply/deploy/live E2E or return bounded corrections.

CD reviewed `CA_to_CD_20261031_v5_review_request.md`. CA's retention finding was correct: the initial `s10_teacher_exports.run_id` FK used `ON DELETE CASCADE`, so guarded deletion of an interrupted active run would also delete its export audit.

Because migration074 is unapplied, CD minimally corrected that source: `run_id` remains a non-null durable audit identity but is deliberately no longer an FK. The table is still RLS-protected with no direct anon/authenticated grants; only the authenticated export RPC inserts rows. The room FK remains indexed. Reset requires the exact export/run pair before cleanup, never deletes the export audit, and records the confirmed export ID plus `backup_validated: false` in the durable room event.

The UI, snapshot header, confirmation dialog, reset status, and event now state that saving the files is only Teacher attestation and does not validate completeness, readability, safe storage, or restorability. Snapshots remain `restorable: false`.

CD added and executed `tests/teacher-console-v5-browser.mjs`, a dependency-free raw-CDP Chrome gate. It passed 1366×768 and 900×768 layout, 3/3 Start gating, Processing, coded failure, active hide/inactive restore, exact-export snapshot/clear, Player release, warning copy, and no-horizontal-overflow assertions. The failure path exposed and fixed shared RPC error-code loss by preserving PostgREST `body.code` or an HTTP fallback.

Focused evidence is in `docs/reports/remediation/ui/TEACHER_CONSOLE_V5_CA_REVIEW_CORRECTION_20261031.md`. No production migration, database/live data, Storage, deployment, or real room changed. Execution ownership transfers to CA.
