# IMPLEMENTED SYSTEM MODEL

Baseline: `93bd15ca36dd985685a0706bad9ec56ba4002a6e`

## 1. State-authority inventory

| Domain | Authoritative server state | Primary writers | Reconnect/read source | Audit result |
|---|---|---|---|---|
| Room / role claim | `s1_rooms`, `s1_room_players` | `s1_create_room`, `s1_join_player`, Teacher release | `s1_get_player_state`, Teacher room state | coherent |
| Legacy Sprint1 prototype | `s1_room_state`, `s1_player_decisions` | `s1_submit_private_choice`, `s1_advance_scene`, `s1_reset_room` | `s1_get_player_state` | **dangerously reachable from root player pre-run** |
| Formal run identity | `game_runs` | `s2_start_run`, later finalization | `s2_get_active_run` | coherent, but startup handoff is split |
| Discussion | `discussion_sessions`, `dialogue_messages`, `runtime_player_decisions` | exact-identity discussion RPCs + scene-specific helpers | `s2_get_player_state` and scene projections | guarded |
| ACT1–5 | `s3_runtime_scene_state`, `s3b_run_state`, `s3b_player_progress`, puzzle/vote evidence | `s3b_*` + governed Teacher Override | `s3b_get_player_state` | canonical role/privacy model present |
| Pocket/knowledge | `s3_player_items`, observations, knowledge, shared photos, group items | scene helpers + player share/view actions | `s3_get_player_state` | authority separated |
| ACT6–8 | `s5_run_state`, `s5_rounds`, `s5_votes`, `s5_act8_private_choices` | `s5_*` | `s5_get_player_state` | canonical flow |
| ACT9–13 | `s6_run_state`, choices, allocations, engagements, station tasks, audio occurrence/consumption | v2 guarded `s6_*` | `s6_get_player_state` | guarded exact identity |
| ACT14 | `s8_finalizations` + `game_runs` completion flags | `s8_finalize` | `s8_get_player_state`, finalization state | run-bound / integrity gated |
| Asset runtime | Asset Manager DB projection/candidates + storage path; repo registry is canonical identity source | service-role publication/activation, Teacher review | `asset_resolve` | candidate source coherent; live ACTIVE state not independently queried |

## 2. Root client orchestration

The root player does **not** have a dedicated pre-run waiting model.

Current refresh order:

```text
s1_get_player_state
→ s2_get_player_state
→ if formal run active:
     s3b/s5/s6/s8 projections
  else:
     renderState(sprint1State)
```

Therefore the formal product intentionally falls back to the old Sprint1 gameplay renderer whenever no formal run is active. This is the deterministic source of IDA-001 and IDA-002.

## 3. Formal startup graph

```text
room created
→ three role sessions claimed
→ Teacher: s2_start_run
→ active game_runs row exists
→ Teacher separately: s3b_initialize_flow
→ s3 canonical scene/run/player state exists
→ ACT1 canonical gameplay
```

The boundary between `s2_start_run` and `s3b_initialize_flow` is neither one transaction nor one server-owned completion operation.

During the interval after start-run success but before flow initialization, the player client sees formal run active and requires Sprint3B state. If unavailable, it throws `Formal game state is unavailable`.

This is IDA-003.

## 4. ACT transition model

### ACT1–5

- ACT1 opening → role-specific private first action → local consequence → global completion barrier.
- ACT2 private meeting choices → GRAB/leave → DiscussionRoom → route update barrier → local consequence/fold-back.
- ACT3 wayfinding → Library puzzle → ACT4.
- ACT4 role-private route stance; unanimity/direct path or ACT5 discussion.
- ACT5 discussion / inspect-first / post-inspection route → `SPRINT3B_COMPLETE`.

Resolved ACT2/ACT5 discussion is applied server-side in the same vote transaction, with reconnect reconciliation for already-resolved discussions.

### ACT6–8

Cross-sprint server automation creates/ensures Sprint5 state. ACT6/7 canonical discussion/vote rounds then ACT8 private choices/final route and route consequence.

### ACT9–13

Sprint6 v2 guarded actions bind expected phase/step/round + stable request identity where needed. ACT12 uses allocation → task completion → engage → pressure → cinematic. ACT13 reaches a finalization boundary.

### ACT14

Player finalization sends explicit expected `run_id`. Server verifies session integrity, writes one durable finalization, marks run completed/export-ready, and later Teacher export can target a specific completed run.

## 5. Reconnect model

Player browser persists only room/role/session-token identity in localStorage. Formal state is reconstructed from server projections on polling.

Additional client retry state:
- request identities: sessionStorage for selected exact-once-ish actions;
- Sprint6 audio consumption outbox: localStorage.

Server-side exact-state guards and request receipts cover the later runtime. Earlier ACT1–5 actions often converge by state guard + polling rather than replay-success semantics.

## 6. Canonical comparison

PASS:
- formal ACT1 role-specific choices exist and are server validated;
- formal ACT1 opening media binding exists;
- canonical private first-action data is not returned player-to-player before its reveal boundary;
- Room and Run are distinct server objects;
- formal reset does not use `s1_reset_room`;
- ACT14 is terminal and export is integrity gated.

FAIL:
- root pre-run surface executes legacy Sprint1 gameplay instead of a waiting state;
- legacy Sprint1 reveals first choices player-to-player;
- formal startup exposes a non-atomic intermediate state.

NOT VERIFIED:
- why the Teacher's deployed environment returned "Run started" and then "No active run"; static model cannot produce that sequence under one consistent effective database.
