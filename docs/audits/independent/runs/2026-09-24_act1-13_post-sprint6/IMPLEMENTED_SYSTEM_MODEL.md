# IMPLEMENTED_SYSTEM_MODEL — ACT1–13 post-Sprint6

Baseline: `2acfe324d05c8bea2fb96d7132ba29f894270b38`

## B1. State authority inventory

### Access / identity layer

- Room authority: `s1_rooms`.
- Player identity / role / join/session state: `s1_room_players`.
- Legacy Sprint1 prototype scene state: `s1_room_state`.
- Formal gameplay identity: `game_runs.run_id`.
- One active formal run per room is enforced by the partial unique index on `game_runs(room_code) where status='active'`.
- `run_id`, room, start time, mode and behavior-dataset eligibility are protected against mutation by `s2_protect_run_identity`.

Room and Run are therefore distinct in the formal runtime.

### Canonical scene projection

`s3_runtime_scene_state` is the cross-Sprint canonical scene projection for the formal run:

- scene_id
- phase_key
- step_key
- display_mode
- text_key
- current_route_target
- wayfinding_target
- allow_share_photo

Sprint-specific state machines mutate their own state and project the current scene here.

### ACT1–5 authority

Current Game Track / behavior progress is split across:

- `s3b_run_state` — group route, puzzle, terminal/fold-back state;
- `s3b_player_progress` — per-player locked ACT1/ACT2/ACT4 choices, location and timing;
- `s3b_player_facts`;
- `s3b_post_inspection_route_votes`;
- `s3b_library_attempts`;
- `runtime_events` — append-only formal chronology/provenance after remediation.

Pocket / knowledge / evidence authority is separate:

- physical ownership: `s3_player_items`;
- personal current item view: `s3_player_item_view_state`;
- observations: `s3_player_observations`;
- knowledge acquisitions: `s3_player_knowledge`;
- shared photo copies: `s3_shared_photos`;
- group items: `s3_group_items`.

### Shared DiscussionRoom authority

Shared durable discussion data lives in:

- `discussion_sessions`;
- `dialogue_messages`;
- `runtime_player_decisions`;
- `runtime_events`.

There are three distinct ownership layers using the same underlying `discussion_sessions` table:

1. generic Sprint2 discussion APIs;
2. Sprint5 discussion ownership through `s5_rounds`;
3. Sprint6 discussion ownership through `s6_run_state` + exact session identity.

This shared-table / multiple-owner arrangement is a major cross-layer audit boundary.

### ACT6–8 authority

- `s5_run_state` — current ACT6–8 phase/round/route.
- `s5_rounds` — binding from Sprint5 phase/round to exact `discussion_session_id`.
- `s5_votes` — per-player vote evidence.
- `s5_act8_private_choices` — locked ACT8 first choices.

Reconnect uses `s5_get_player_state` and `s5_get_discussion_state`, keyed to the current `s5_run_state` phase/round.

### ACT9–13 authority

- `s6_run_state` — current act, phase, Great Hall step/round, branch, mechanism/cinematic state, escape and ACT14 boundary.
- `s6_private_clues` — private ACT9/10 clue delivery.
- `s6_choices` — group/private choice evidence.
- `s6_allocations` — current role allocation.
- `s6_allocation_attempts` — append-only allocation attempts.
- `s6_station_tasks` / `s6_station_b_progress` — role-task completion.
- `s6_engagements` — engaged active roles.
- `s6_action_receipts` — durable idempotent request results.

Sprint6 uses `discussion_sessions` for its timed silent-text phases, but canonical phase progression is owned by `s6_close_discussion_v2` / `s6_run_state`, not by generic Sprint2 discussion resolution.

### Teacher override authority

- `teacher_overrides`;
- `teacher_override_validity`;
- `game_runs.active_override_id`.

Current override implementation is intentionally bounded to the ACT1–5 canonical allowlist. Sprint6 does not gain arbitrary Teacher skip authority.

### Asset authority

- repository `assets/asset-registry.json` = canonical machine registry;
- DB `asset_registry_projection` = synchronized runtime projection;
- `asset_candidates` = candidate lifecycle;
- `asset_events` = lifecycle event ledger;
- `asset_manager_reviewers` = reviewer authority.

Runtime resolves only governed active asset state; missing ACTIVE versions produce fallback/unavailable behavior.

## B2. RPC / ownership call graph

### Player-facing layers

- Sprint1: join/state/private-choice.
- Sprint2 generic: player state plus exact-id message/vote functions retained for ACT1–5 canonical DiscussionRooms.
- Sprint3B: ACT1–5 action RPCs mutate `s3b_*`, Pocket/Knowledge state and scene projection.
- Sprint5: Sprint5-specific vote/message/private-choice/advance RPCs own ACT6–8.
- Sprint6: only v2 mutation endpoints are browser-authorized; they bind expected phase/step/round + request identity, then delegate to guarded internal implementations.

Historical Sprint6 unguarded/guarded endpoints are revoked from anon/authenticated.

### Teacher-facing layers

Teacher console currently exposes:
- Sprint1 room/session prototype controls;
- formal run start;
- generic Sprint2 discussion controls;
- ACT1–5 initialize + bounded Teacher Override;
- Sprint5 initialize + teacher discussion controls;
- Sprint6 initialize;
- Asset Manager review/anchor surfaces.

Sprint7 expansion has not yet been implemented.

## B3. Implemented transition graph

### Formal start → ACT1–5

Teacher starts a formal `game_runs` row only after three assigned players have active sessions. ACT1–5 initialization creates canonical scene/runtime state.

ACT1:
private first choice is per-player locked, timed and evidence-producing.

ACT2:
private first-meeting choices are locked; DiscussionRoom group resolution drives route. The exact resolved discussion is applied into Game Track through `s3b_apply_resolved_discussion_internal`.

ACT3:
fold-back / Library puzzle maintains real attempts and soft-failure progression.

ACT4:
private route-strategy choice remains behavior evidence.

ACT5:
group discussion resolves known / unknown / inspect-first; post-inspection route is a separate three-player Game-only Step Vote.

### Sprint5 ACT6–8

Sprint5 initializes only after ACT1–5 terminal conditions. It owns exact phase/round state through `s5_run_state` and `s5_rounds`.

ACT6:
discussion/vote with one re-vote then fixed fallback.

ACT7:
Clock Room repeated vote until majority.

ACT8:
private first choices → final route vote if needed → local route payoff/failure → Great Hall fold-back → Sprint5 phase `complete`.

### Sprint6 ACT9–13

Sprint6 initializes only if Sprint5 phase is `complete`.

ACT9:
`s6_open_discussion` opens a 180-second `discussion_sessions` row with `require_final_vote=false`. Canonical continuation requires `s6_close_discussion_v2`, which advances:
`act9_discussion → act9_console`.

ACT9 console step choices use exact phase/step/round and request identity. Tie opens a new Sprint6 discussion; wrong actions create the soft-failure discussion/reset.

ACT10:
private choice → 300-second Sprint6 discussion → canonical close → final TAKE/LEAVE vote → branch state.

ACT11:
branch-specific timed allocation discussion → canonical close → allocation.

ACT12:
station task → ENGAGE → random active mechanism failure → pressure choices → staged cinematic.

ACT13:
escape exterior + TIME/SIGNAL restoration pause → guarded advance to ACT14 boundary only.

No Sprint8 finalization flags are set.

## B4. Reconnect model

### Client-local state

- player room/session token survives in localStorage.
- selected Sprint6 audio mode survives in localStorage.
- pending mutation request identities use sessionStorage to enable same-request retry in the same browser session.

### Server reconstruction

Every normal refresh obtains server state. Player runtime currently calls in this order:

1. `s1_get_player_state`;
2. `s2_get_player_state`;
3. `s3b_get_player_state`;
4. `s5_get_player_state`;
5. `s6_get_player_state`;
6. appropriate evidence/discussion sub-state.

Current later-Sprint renderer precedence is Sprint6 > Sprint5 > Sprint3B.

Most formal action truth is server-restored; no essential behavior choice is reconstructed from local browser state.

### Critical cross-layer conflict

Generic `s2_get_player_state` is not read-only: it invokes `s2_refresh_discussion`, which may mutate `discussion_sessions` at deadline.

Sprint6 also owns deadline completion of its no-vote discussions through `s6_close_discussion_v2`.

This creates two resolution authorities over the same Sprint6 discussion row and produces IDA-001.

## B5. Canonical comparison

The broad ACT1–13 architecture matches the intended separation of Room/Run, Game/Behavior evidence, Pocket/Knowledge, branch state, Teacher provenance, Asset Manager and ACT14 boundary.

The following current-baseline divergence is confirmed:

### IDA-001 — Sprint2 generic deadline refresh can deadlock Sprint6 discussions

Sprint6 deliberately creates ACT9/10/11 timed discussion rows with:

- `status='discussion'`;
- `require_final_vote=false`;
- a deadline.

Canonical Sprint6 progression requires the exact `s6_close_discussion_v2` transition to both resolve the discussion and advance `s6_run_state.phase_key`.

However every player `refreshState()` calls `s2_get_player_state` first. At or after the deadline, generic `s2_refresh_discussion` sees `require_final_vote=false` and resolves the row by itself.

After that:
- `s6_run_state.phase_key` is still `act9_discussion`, `act10_discussion`, or `act11_discussion`;
- `s6_get_player_state` returns no current discussion because it selects only `status='discussion'`;
- the browser has no Sprint6 close action to advance;
- a direct `s6_close_discussion_v2` retry fails because the exact discussion is no longer `status='discussion'`.

This is a deterministic cross-module deadlock affecting all three canonical Sprint6 timed discussions in NORMAL play.

See `FINDINGS.md#IDA-001`.
