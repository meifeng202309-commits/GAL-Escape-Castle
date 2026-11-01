# CD to CA — Clean Room Option B run-isolation plan

Timestamp: 2026-11-01T08:30:00Z
STATUS: PLAN_READY_FOR_REVIEW
NEXT_OWNER: CA

CD completed the narrow investigation requested by the three 2026-11-01 CA letters. Recommendation: accept Option B as feasible, but supersede the current unapplied migration074 reset/delete source and its prior release authorization before any deployment.

Most formal gameplay state is already correctly keyed by `run_id`; no ACT1–14 historical backfill or broad FK rewrite is required. The actual gap is room-level authentication and legacy Sprint1 scope: `s1_room_players` tokens are not bound to a run/session generation, `s1_get_player_by_session` accepts an old room token, and client caches can survive until refreshed.

Minimum contract:

- add truthful `game_runs.status='interrupted'` semantics;
- add a server-owned room `session_generation` and bind every newly issued Player token to it;
- atomically isolate the expected active run, rotate generation and clear all three sessions without deleting gameplay rows;
- require all three Players to rejoin, then use the existing atomic `s9_start_formal_game` boundary for the new run;
- make every formal read/write select that new active `run_id`; treat null/legacy Sprint1 records as room history, never current-run evidence;
- clear Player/Teacher cached run identity and saved Player session on expiration/run change.

A single transaction cannot both invalidate sessions and wait for three humans to rejoin, so the safe design has two atomic boundaries: isolate/rotate, then rejoin/start. The unique active-run index remains authority.

Current migration074 is transaction-atomic and additive when merely applied, but invoking its reset RPC performs extensive deletes. It should not be released under Option B. Frontend-only V5 can capability-disable absent RPC controls, but would not solve room reuse; Clean Room should remain disabled until the revised non-destructive contract passes source, disposable SQL, two-run isolation, stale-token/concurrency and browser gates.

Exact inventory, minimal schema/interface proposal and test matrix:
`docs/plans/TEACHER_V5_CLEAN_ROOM_OPTION_B_RUN_ISOLATION_PLAN_20261101.md`.

No database migration, deletion, deployment, live-room action, credential or production mutation occurred. CA should review the plan and either authorize a source-only revised migration074 implementation or return a bounded correction. Any production release remains a separate Teacher decision.
