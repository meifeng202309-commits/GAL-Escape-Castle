# Teacher Console V5 — Clean Room Option B run-isolation plan

Date: 2026-11-01
Owner: CD
Status: analysis / implementation plan only; no production authorization

## Recommendation

Use the same durable `s1_rooms.room_code`, preserve all past rows, and make a new formal run the only current gameplay scope. Do **not** deploy the current migration074 reset/delete function. Replace that unapplied candidate with a reviewed non-destructive run-isolation design before any release.

The database already has the right dominant shape: every formal mutable table is directly keyed by `run_id`, except `s6_audio_consumptions`, which is indirectly and unambiguously scoped through its FK to run-scoped `s6_audio_occurrences`. Stable room definitions, static content catalogs, asset registry/candidates/events and reviewer identities correctly do not need `run_id`.

The material cross-run gap is the room-level player-session and legacy Sprint1 boundary, not the ACT1–14 formal tables.

## Current path inventory

### Already run-scoped and reusable without historical backfill

- `game_runs`; all DiscussionRoom messages/votes/events;
- scene, ACT1–5 progress/attempts/facts/receipts/routes;
- Pocket items/views/knowledge/observations/photos/group items/inspection receipts;
- ACT6–8 and ACT9–14 states, votes, allocations, tasks, clues, ledgers and finalization;
- Teacher overrides/validity and `s10_teacher_exports`.

These paths resolve the unique active `game_runs` row and then filter by its `run_id`, or accept an expected run identity. Historical rows can remain untouched.

### Room-scoped surfaces requiring isolation treatment

1. `s1_room_players` owns one token per room/role but has no run/session generation. A token from the previous test remains valid until explicitly cleared.
2. `s1_get_player_by_session` authenticates only room code plus token hash. Every later formal RPC inherits this weakness before selecting the active run.
3. Player `localStorage` retains the room token; transient DOM/draft/request/audio caches can survive until the next authoritative render.
4. Teacher page retains `currentSessionRunId`, export identity and UI state in memory.
5. `s1_room_state`, `s1_player_decisions` and `s1_game_events` are legacy room-level prototype data. They must never be treated as current formal-run evidence. Current migration074 incorrectly exports the whole room history as if adjacent to one selected run.
6. The current `game_runs.status` constraint has only `active|completed`; an unfinished old run cannot be truthfully isolated without either deleting it or falsely completing it.

Static catalogs and room identity do not need a run key. Asset data is global/versioned content, not gameplay state.

## Minimal database contract

Revise the **unapplied** migration074 candidate and send the new exact source through a fresh CA audit. The prior migration074 release authorization is superseded.

1. Extend `game_runs.status` with `interrupted` (or equivalently named non-completed terminal state) and add `interrupted_at` plus a machine-readable reason. Never set `game_completed`, `export_ready` or `session_integrity_verified` merely to free the room.
2. Add a server-owned `session_generation uuid` to `s1_rooms` and the generation bound to the current token in `s1_room_players`.
3. Update `s1_join_player` to bind the new token to the room's current generation. Update `s1_get_player_by_session` to require token hash **and** equal generation. Existing null/legacy generation values are never current.
4. Replace `s10_reset_room_for_next_session` with a narrowly named prepare/isolate RPC requiring Teacher authentication and `p_expected_run_id`:
   - lock the room and expected active run;
   - atomically mark that run `interrupted`;
   - rotate `s1_rooms.session_generation`;
   - clear all three token hashes/join timestamps/last-seen values;
   - clear no run-scoped history and delete no rows;
   - return the new generation and require all Players to rejoin.
5. Human rejoin prevents one database transaction from both invalidating old sessions and starting a new run. Therefore use two safe atomic boundaries:
   - atomic old-run isolation + token-generation rotation;
   - after all three rejoin, existing `s9_start_formal_game` atomically creates and initializes the new run.
6. Optionally record the new run as the replacement of the interrupted run after start, but do not make that metadata a gameplay authority pointer. The unique active-run index remains the server authority.
7. Preserve `s1_*` tables as legacy/room-lifecycle history only. Formal Player/Teacher projections and exports must not merge null-generation or legacy room records into the current run. If room lifecycle events are retained in a snapshot, label them explicitly as room history rather than run evidence.

No run-specific table needs a primary-key/FK rewrite. No historical row requires backfill. No stable room, content catalog or asset table receives a meaningless `run_id`.

## Frontend boundaries

- Player: on `Invalid or expired player session`, cancel polling, clear the saved token and all run-derived DOM/draft/request/audio state, then show Rejoin. When an observed `run_id` changes, reset all prior-run presentation caches before rendering.
- Teacher: prepare-next-session uses the exact expected run; after success clear current run/export identities and wait for three fresh joins. A stale tab/RPC cannot start or mutate the new run.
- V5 export can remain independently run-scoped. Clean Room must not depend on a claim that an application export is a verified database backup.
- Frontend-only V5 is technically possible if every migration074-backed control is capability-disabled when its RPC is absent, but it does not solve room reuse. Given Teacher's explicit Option B, ship the layout only together with the separately audited non-destructive isolation contract or keep Clean Room disabled.

## Test and release gates

1. Disposable PostgreSQL replay through revised 074; verify no `DELETE` in the isolation RPC and transactional rollback on every injected failure.
2. Run A with Pocket, discussion, votes, receipts and cached client state; isolate A; confirm all A rows remain and status is `interrupted`.
3. Prove all three old tokens and stale expected-run mutations fail immediately after generation rotation.
4. Rejoin all roles, start Run B, and prove every Player/Teacher projection selects B only: empty new Pocket, no A chat/vote/choice/receipt/override/finalization leakage.
5. Prove null/legacy Sprint1 rows never render as current formal state or appear as Run B evidence.
6. Reconnect within Run B and verify normal continuity.
7. Concurrency: two prepare requests, stale expected run, simultaneous stale Player action and prepare, and two attempted starts yield one isolation and at most one new active run.
8. Browser regression: Teacher retained page, three Player pages, localStorage invalidation, cached DOM clearing and current-run identity changes.
9. Controlled production release still requires a new CA source/SQL/browser PASS and separate Teacher authorization. The accepted risk is loss of disposable historical trial data if an unforeseen failure occurs; the release must still protect schema/function availability and keep an additive recovery SQL path.

## Comparison with current migration074 reset/delete

Current migration074 is transaction-wrapped and its DDL is additive until the reset RPC is called. However the RPC deliberately deletes the active run and many dependent rows, clears room-level prototype history and therefore has a larger irreversible blast radius. Option B is narrower: it changes session/run lifecycle authority, preserves all rows and relies on already-existing run-scoped formal state. Its main risk is incomplete stale-session or unscoped-read coverage, which is addressable by generation-bound authentication plus the mandatory two-run regression above.

No database, Pages, Storage, room, credential or live-state mutation was performed for this plan.
