# Sprint 3B Architecture — ACT 1–5 Placeholder Flow / Route / Fold-Back

Sprint 3B binds canonical ACT 1–5 behavior to the accepted Sprint 2 DiscussionRoom and Sprint 3A Pocket/knowledge foundations. Visuals may fall back safely, but choice identities, privacy, consequences, localization keys, routes, and deadlines are server-authoritative.

## Database history

- `007_sprint3b_act1_5_placeholder_flow.sql`: flow state, player progress, route/fold-back, wayfinding, Library Box, ACT 4–5 decisions and terminal boundary.
- `008_sprint3b_gate_concurrency_fix.sql`: per-run serialization for concurrent multiplayer gate updates.
- `009_sprint3b_act1_consequence_integrity.sql`: canonical role-specific facts, personal observations, and optional flashlight GRAB integrity.
- `010_sprint3b_flow_integrity_and_inspect_fix.sql`: server phase guards, idempotent fold-back, non-terminal Inspect First, post-inspection Game Track route, complete timed puzzle fallback, and canonical item labels.

## Trust and state model

All flow state is keyed by `run_id`. Browser RPCs resolve the authenticated player from the session token and accept only phase-specific canonical choice IDs. Private choices remain private until their explicit reveal gate. Direct table access is blocked by RLS.

ACT 2 retains the private first meeting choice separately from the authoritative group meeting result. A failed rendezvous preserves that historical result while changing `current_route_target` and `wayfinding_target` to Library. Each player must independently follow the sign before physical reunion.

The Library Box owns a server timestamp and 90-second deadline. Attempts are server-ordered. At 90/105/120/135/150 seconds the server monotonically locks 4/1/7/3/9 using canonical text keys; the final stage auto-opens the box without synthesizing a player attempt. Each stage is logged as non-behavior system fallback, and the two canonical group items are created idempotently.

ACT 4 private stance remains separate from ACT 5 group resolution. Player majority uses `choice_id`; system fallback uses `resolution_id` and `resolution_source=system_fallback`. Inspect First is an intermediate sequence followed by one non-behavior Game Track Known/Unknown decision. Only a final known/unknown route reaches `SPRINT3B_COMPLETE`; ACT 6 cannot start.

## Deferred

Teacher Override / Safe Deblock, behavior validity, and downstream context provenance remain reserved for Sprint 3C. Asset Manager publishing, production visual resolution, ACT 6+, finalization/export, and physical multi-device classroom verification are outside this slice.
