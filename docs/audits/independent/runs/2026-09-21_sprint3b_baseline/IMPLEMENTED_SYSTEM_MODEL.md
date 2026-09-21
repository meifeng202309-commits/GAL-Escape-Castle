# Implemented System Model — Initial Reverse Audit

Baseline: 3be0e6ad8395f05bbab13ca41e6b91dac57eb4fe
Status: INITIAL MODEL — Methods 1–2 continuing

## 1. Actual state layers found

### Layer A — Sprint 1 room/prototype state

Primary objects:
- s1_rooms
- s1_room_players
- s1_room_state
- s1_player_decisions
- s1_game_events

The player client still fetches s1_get_player_state first and renderState() renders this layer on every refresh.

Teacher Console still exposes:
- s1_advance_scene
- s1_reset_room
- s1_release_player_session

V2.3 explicitly preserves legacy Sprint 1 semantics and says s1_reset_room must not reset a formal Castle Escape run.

### Layer B — formal run identity / reusable DiscussionRoom

Primary objects:
- game_runs
- discussion_sessions
- dialogue_messages
- runtime_player_decisions
- runtime_events

game_runs is the formal run identity authority for:
- run_id
- run_mode
- behavior_dataset_eligible
- active/completed status

Important implementation fact:
game_runs.scene_id / phase_key / step_key are initialized to:
- generic-discussion
- discussion
- generic-vote

The inspected Sprint 3B scene transition function does not synchronize these fields.

### Layer C — Sprint 3 scene / knowledge foundation

Primary scene authority for the implemented ACT 1–5 flow:
- s3_runtime_scene_state

Pocket/knowledge authority:
- s3_player_items
- s3_player_item_view_state
- s3_player_observations
- s3_player_knowledge
- s3_shared_photos
- s3_group_items

### Layer D — Sprint 3B flow state

Primary objects:
- s3b_run_state
- s3b_player_progress
- s3b_player_facts
- s3b_library_attempts

The implemented ACT 1–5 game-track scene is determined primarily by s3_runtime_scene_state plus the Sprint 3B flow/progress rows.

## 2. Actual client refresh composition

src/game/app.js refreshState() performs sequential requests:

1. s1_get_player_state → renderState()
2. s2_get_player_state → renderDiscussion()
3. s3b_get_player_state → renderSprint3b()

These three reads are not one atomic server snapshot.

When Sprint 3B is active, renderSprint3b() hides the Sprint 1 choice/reveal areas, but Sprint 1 rendering has already occurred.

## 3. Actual DiscussionRoom → Game Track bridge

The implemented bridge is two separate transactions:

    player calls s2_submit_vote
    → DiscussionRoom becomes resolved
    → that same browser receives result.status = resolved
    → browser calls s3b_get_player_state
    → browser decides which apply RPC to call
    → s3b_apply_meeting_resolution OR s3b_apply_act5_resolution
    → Sprint 3B state advances

The server-side vote transaction does not itself guarantee the Sprint 3B progression transaction.

This is the basis of IDA-001.

## 4. Actual DiscussionRoom creation paths

There are at least two independent creation paths:

A. s2_open_discussion
- teacher-authenticated reusable generic path;
- rejects creation if ANY current discussion/vote is open.

B. Sprint 3B direct INSERT paths
- ACT 2 meeting discussion is inserted directly by s3b_leave_start_room implementation;
- ACT 5 route discussion is inserted directly by s3b_submit_act4_choice implementation;
- these paths do not enforce the same global “only one open discussion” predicate used by s2_open_discussion.

Therefore the “one open discussion per run” rule is currently an RPC-level convention, not a database invariant.

This is the basis of IDA-002.

## 5. Current legacy/formal coexistence

The current application intentionally preserves Sprint 1 regression behavior, but the same player and Teacher pages expose both legacy and formal-run surfaces.

The formal Sprint 3B scene does not replace s1_room_state.

The resulting architecture is:

    legacy S1 state
    +
    formal run identity / DiscussionRoom
    +
    S3 runtime scene
    +
    S3B flow state

rather than one unified scene authority.

This is not automatically a defect; the audit must test all boundaries where one layer can become visible or callable while another layer is authoritative.

## 6. Next reverse-audit work

Still to complete:
- full mutation registry;
- effective final DB privilege reconstruction;
- all hard-invariant protection mapping;
- reconnect and stale-session paths;
- audit-only RPC exposure;
- dynamic reproduction where tooling permits.
