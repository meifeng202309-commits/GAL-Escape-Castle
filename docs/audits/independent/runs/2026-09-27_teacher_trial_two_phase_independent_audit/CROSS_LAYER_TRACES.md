# CROSS-LAYER CONTRACT TRACES

Baseline: `93bd15ca36dd985685a0706bad9ec56ba4002a6e`

## F1. Room creation / join

```text
Teacher root UI
→ s1_create_room
→ s1_rooms + three role rows + s1_room_state(scene1/collecting)
→ student root Join
→ s1_join_player
→ browser stores room/player/role/session token
→ refreshState()
→ s1_get_player_state + s2_get_player_state
```

Failure: when no formal run exists, the root product enters legacy `renderState(sprint1State)` instead of a waiting surface. One player can therefore see and submit legacy gameplay immediately. **IDA-001**.

## F2. First behavior choice

Canonical path after initialization:

```text
formal ACT1 renderer
→ role-specific choice
→ s3b_submit_act1_choice
→ server role/phase validation
→ locked player progress + formal event
→ polling reconstructs only own private choice/consequence
```

This path is coherent.

Actual pre-run root path:

```text
legacy renderState
→ generic map/keys/door
→ s1_submit_private_choice
→ s1_player_decisions
→ after three legacy submissions room phase=revealed
→ s1_get_player_state returns all decisions
→ root renders all three
```

**IDA-001 / IDA-002**.

## F3. Discussion resolution → Game Track

Migration013 resolves ACT2/ACT5 vote and invokes `s3b_apply_resolved_discussion_internal` in the same server transaction. Reconnect also reconciles an already-resolved discussion.

PASS source-level.

## F4. Route update

Canonical ACT2 result is persisted before route-update rendering. Per-player acknowledgements form a barrier; subsequent fold-back preserves original route evidence while converging to Library.

PASS source-level.

## F5. Library puzzle

Player submission addresses current run/phase, server controls locked-prefix/fallback, and group items are idempotent. Concurrent correct solves were explicitly covered by the existing Sprint3B live test source.

PASS source-level.

## F6. Later group resolution

Sprint5 and Sprint6 use phase/round/session identity and later guarded request identities. Server-owned cross-sprint helpers bridge Sprint3B→Sprint5→Sprint6.

PASS source-level; live replay from this CA runtime NOT VERIFIED.

## F7. Reconnect

Normal canonical reconnect is server-authoritative.

Startup exception:
- after `s2_start_run` succeeds but before `s3b_initialize_flow`, formal run is active while canonical scene state is absent;
- player polling enters formal branch, then rejects missing formal scene.

The startup boundary is therefore not a valid reconnect state. **IDA-003**.

## F8. Teacher observation / control

Teacher page simultaneously exposes:
- legacy Sprint1 room/advance/reset controls;
- generic Sprint2 DiscussionRoom;
- formal start and three separate canonical initialization buttons;
- later operations/override/assets.

Generic DiscussionRoom is correctly server-blocked **after** canonical flow exists.

However between `s2_start_run` and `s3b_initialize_flow`, canonical flow does not yet exist, so generic discussion is still legally openable and then explicitly blocks canonical initialization. This amplifies the startup split in **IDA-003**.

Legacy Advance/Reset mutate only the shadow Sprint1 state and remain reachable on the same production operator page. **IDA-005**.

## Teacher live contradiction

Original PPT proves a session where:
- start returned a run id;
- Teacher surface still displayed no active run;
- initialization returned no active formal run.

This contradicts the source-level success contract of `s2_start_run → game_runs(status=active) → s2_get_active_run`.

Static code cannot select a root cause. **IDA-004** remains a confirmed live inconsistency with cause NOT VERIFIED.
