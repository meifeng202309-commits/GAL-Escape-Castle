# Teacher Console V5 implementation evidence

> CA review update: export-audit retention, backup-attestation language, RPC error-code propagation, and an executed raw-CDP Chrome browser gate were added after the initial CD-218 review request. See `TEACHER_CONSOLE_V5_CA_REVIEW_CORRECTION_20261031.md` for the focused evidence.

## Outcome

The Teacher-approved V5 layout and behavior are implemented in production source. The work is source-only pending CA audit: migration 074 has not been applied, no live room was changed, and no deployment was made.

## Implemented product behavior

- Live room/game state and Discussion remain the dominant upper two-column workspace.
- Export/Reset, Emergency/Recovery, and Maintenance/Developer occupy the compact lower-left column.
- Create/Watch/Reconnect and the one-use Start formal run control persist in the lower-right column.
- The pre-room surface keeps the approved fields and geometry with blank state values.
- Start is available only when the room/token are present, all three assigned Players are joined, and no formal run is active. It hides after an active run is observed.
- The primary Discussion surface contains Vote now and optional audit Add Time only. End Discussion and generic Force Advance are absent.
- Only server-projected phase-specific override actions appear under Emergency/Recovery.
- Player cards use existing joined/online and current operation data; no heartbeat or false precision was added.
- Teacher actions use Processing, Accepted, Failed-with-code, and persistent disabled/stale states. Accepted remains gray until pointer leave or focus blur.
- Desktop uses the approved V5 two-column geometry; below 1000px it becomes a whole-page single-column scroll.

## Snapshot export and guarded room reuse

`database/074_teacher_console_v5_snapshot_and_room_reuse.sql` is the only database addition. Migrations 001–073 are unchanged.

The proposed `s10_export_session_snapshot` RPC authenticates the Teacher and exports an explicit current/completed run. Its JSON includes run and legacy room state, Players without credential hashes, all discussion messages, decisions, evidence, current states, receipts, operation records, Teacher override validity, runtime events, ACT6–13 ledger, audio occurrence/consumption data, and room-level legacy events. Its CSV provides a chronological dialogue/runtime/ACT6–13 event stream. In-progress exports are explicitly marked incomplete and `restorable: false`; completed verified runs are marked final snapshots. The export response provides an audit ID and deterministic JSON/CSV filenames.

The proposed `s10_reset_room_for_next_session` RPC requires all of:

1. valid Teacher authentication;
2. the exact expected run ID;
3. the exact export ID returned to the current client;
4. explicit confirmation that the files were saved;
5. no different active run.

For an interrupted active run, it deletes all run-scoped records in FK-safe order, resets legacy room state, and releases all three Player sessions while retaining the room, Teacher token, role assignments, and join-code hashes. Completed historical formal runs remain stored. A new room-prepared audit event records the deleted active run and confirmed export ID. The export audit retains its source run UUID without a cascading run FK because interrupted runs are intentionally deleted; its room FK remains indexed. The table has RLS, no direct anon/authenticated access, and RPC-only writes.

This does not implement upload-and-resume. Snapshot files are research/recovery evidence, not trusted restorable game state.

## Verification

Passed:

- `node tests/teacher-console-v5-static-check.js`
- `node --check src/teacher/teacher-console.js`
- `node --check tests/trial45-p2p6-browser.mjs`
- Sprint 1, Sprint 2, Sprint 3C, Sprint 7, Sprint 8, ACT9 migration073, Package A, and Teacher-paced voting targeted regressions
- `git diff --check`
- read-only live PostgreSQL catalog comparison of every FK directly referencing `public.game_runs`; migration 074 reset/export coverage matches the deployed table inventory
- local Chrome 1366×768 render inspection: `docs/reports/remediation/ui/teacher-console-v5-production-1366x768.png`

The V5-aware Trial4/5 Playwright gate remains unavailable in this executor. A new dependency-free raw-CDP Chrome gate executed successfully at 1366×768 and 900×768 with mocked RPC boundaries. It verified 3/3 Start gating, Processing, service error-code display, active-run Start hiding, inactive restoration, snapshot/clear exact-export flow, Player release, backup-attestation warning, and responsive whole-page layout. No live E2E for the two new RPCs is possible before migration 074 is audited and applied.

A broad 35-test static/unit sweep initially produced 30 passes and five failures. Two were V5-invalidated legacy Teacher assertions; both were updated and then passed. The remaining three are unrelated baseline failures: migration071 operator-host pinned hash, Sprint9 ACTIVE storage telemetry, and the Package C source-string expectation. The targeted rerun is green.

## Files

- `teacher.html`
- `src/styles/app.css`
- `src/teacher/teacher-console.js`
- `database/074_teacher_console_v5_snapshot_and_room_reuse.sql`
- `tests/teacher-console-v5-static-check.js`
- `tests/sprint3c-static-check.js`
- `tests/structural-package-a-static-check.js`
- `tests/trial45-p2p6-browser.mjs`
- `tests/teacher-console-v5-browser.mjs`
- `docs/reports/remediation/ui/teacher-console-v5-production-1366x768.png`

## Audit boundary

CA must review the destructive active-run cleanup boundary, export completeness, RPC security, and deployment order before migration 074 or the dependent UI is released. Ownership transfers to CA with the accompanying audit request.
