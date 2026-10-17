# 071 production maintenance — read-only stale-run and admission-control triage (2026-10-17)

Status: READ_ONLY_COMPLETED / DEPLOYMENT_HOLD. Teacher authorized **investigation only**, not changes to game records, gate criteria, production schema or Pages.

## Verified from live Supabase project qdcbdcjobzytzhnhfwyn

- game_runs active=577, completed=23.
- ACTIVE by run_mode: audit=369, normal=208. Earliest active start 2026-09-18T12:43:01Z; latest 2026-10-04T14:52:37Z; active games newly started last 7 days=0.
- Join to s1_room_players by room_code: active rooms with a player last_seen_at within last 15 minutes=0, last 24 hours=0. Latest player last_seen_at across these rooms 2026-10-04T15:50:50Z.
- This is strong evidence of dormant historical test activity, but last_seen_at is not proven to be a live heartbeat for every Player session. It does NOT independently prove all 577 active rows are permanently abandoned.
- Current production function catalog contains s1_create_room, s1_join_player and s9_start_formal_game. Inspection of their function definitions for maintenance/admission/disabled/pause gating yielded no such mechanism. This was a targeted function-body keyword check, NOT a formal proof of all possible admission controls.
- No stale records closed, altered, reclassified or deleted; no SQL change, no production deployment, no gameplay RPC call.

## Proportionate recommendation

DO NOT bulk-update status='completed' (that would fake game completion and distort evidence), and do not require 577 historical rows to be deleted solely to test 071.

Instead, propose a one-time maintenance-gate exception **only after a concrete admission freeze is demonstrably enabled**. A smallest viable path is temporary, reversible suspension of the public-facing creation/join/formal-start entry points with exact pre/post ACL capture, plus a test that calls are rejected while frozen, followed by ACL restoration after the Pages/071 compatibility interval. Exact permissions and authorized synthetic negative probes must be independently validated first; simply hiding a web button is not access control. Prevent possible existing-session writes or establish that no participating players are active through a bounded recent-activity check. Existing dormant rows remain untouched. Do not assume these safeguards currently exist.

The alternative is leaving zero-active hard gate in force and HOLD; no upgrade of prior approval to this modified gate may be inferred. Must secure explicit Teacher approval to use a revised no-currently-playing + admission-freeze condition, and separately approve any temporary privilege mutation or server control necessary to enforce it.

## Decision gate

CA should design and independently review exact freeze/unfreeze operations and recovery semantics before a production change. The previous authorized 071 maintenance operation does not grant authority to alter the zero-active requirement or revoke unrelated room-entry RPC permissions.

Next owner: Teacher for explicit authorization to evaluate/approve the proposed modified deployment admission gate; until then 071 remains HOLD.
