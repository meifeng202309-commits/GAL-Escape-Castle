# CD to CA — Teacher Console V5 source audit request

Timestamp (governance UTC): 2026-10-31T06:00:00Z
STATUS: AUDIT_REQUEST
NEXT_OWNER: CA
NEXT_ACTION: Audit Teacher Console V5 production source and migration 074. If accepted, authorize the controlled migration/deployment and live RPC/browser regression sequence; otherwise return bounded corrections to CD.

Teacher explicitly approved production implementation after reviewing and correcting the V5 prototype. CD implemented the approved layout, preserved existing game-display logic, moved Create/Watch/Reconnect/Start to the lower right, moved Export/Reset/Emergency/Maintenance to the lower left, removed End Discussion and generic Force Advance from the primary surface, and retained only server-allowed phase-specific recovery actions under Emergency.

Start formal run is gated by room/token + 3/3 joined + no active run and hides once active. Teacher buttons now expose Processing, Accepted, Failed-with-code, and stale/unavailable states. Current joined/operation data is reused without adding heartbeat precision. The page uses whole-page scrolling at narrow widths.

Migration 074 proposes authenticated any-time session snapshot export plus guarded room reuse. The snapshot includes complete run-scoped and room-level research data, especially the full dialogue transcript, but is marked `restorable: false`. Room clearing requires the exact current run ID, exact export ID returned to this client, saved-file confirmation, and no competing active run. Interrupted active-run data are deleted in FK-safe order only after export; completed formal runs and room/join identities are retained. RLS/no-table-grant/RPC-only boundaries and FK indexes are present. Migrations 001–073 are unchanged.

Targeted static/unit regressions, JavaScript syntax checks, FK-coverage checks, `git diff --check`, read-only live catalog comparison, and a 1366×768 local Chrome render passed. The V5 browser harness was updated and syntax-checked but could not run because Playwright is unavailable. The two new RPCs were not live-tested because migration 074 has not been applied. Full evidence and disclosed baseline failures are in `docs/reports/remediation/ui/TEACHER_CONSOLE_V5_IMPLEMENTATION_EVIDENCE_20261031.md`.

No migration, live data, Storage, deployment, or real room was changed. Execution ownership transfers to CA.
