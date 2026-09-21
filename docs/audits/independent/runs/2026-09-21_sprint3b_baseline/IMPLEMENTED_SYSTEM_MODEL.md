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

# 7. B2 — Complete RPC Call Graph (v1.1 rundown)

Baseline: `3be0e6ad8395f05bbab13ca41e6b91dac57eb4fe`

This section records the effective call graph after migrations 001–012.  
“Final wrapper” means the browser-facing/current public function body after all CREATE OR REPLACE / rename operations in the frozen baseline.  
Final database ACL verification is deferred to Method 4; this section records code-level call topology and grant intent only.

## 7.1 Sprint 1 public/runtime surface

| RPC | Caller in current runtime | Delegates / key helpers | Principal writes |
|---|---|---|---|
| `s1_create_room` | Teacher Console | `s1_hash_token` | `s1_rooms`, `s1_room_state`, `s1_room_players`, `s1_game_events` |
| `s1_join_player` | Player | `s1_hash_token` | `s1_room_players`, `s1_game_events` |
| `s1_get_player_state` | Player | `s1_get_player_by_session` | read-only except session helper updates last-seen metadata |
| `s1_submit_private_choice` | Player legacy UI | `s1_get_player_by_session`, `s1_touch_room` | `s1_player_decisions`, `s1_game_events`, `s1_room_state` |
| `s1_get_teacher_state` | Teacher Console | `s1_assert_teacher` | read-only |
| `s1_advance_scene` | Teacher Console | `s1_assert_teacher` | `s1_room_state`, `s1_game_events` |
| `s1_release_player_session` | Teacher Console | `s1_assert_teacher` | `s1_room_players`, `s1_game_events` |
| `s1_reset_room` | Teacher Console | `s1_assert_teacher` | deletes legacy `s1_player_decisions`; resets `s1_room_state`; logs event |

Internal Sprint 1 helpers:
- `s1_hash_token`
- `s1_touch_room`
- `s1_assert_teacher`
- `s1_get_player_by_session`

These are code-level dependencies for later Sprint RPCs and are not intended as direct browser mutation surfaces.

## 7.2 Sprint 2 formal-run / DiscussionRoom surface

| RPC | Caller | Delegates / key helpers | Principal writes |
|---|---|---|---|
| `s2_start_run` | Teacher Console | `s1_assert_teacher`, `s2_log_event` | `game_runs`, `runtime_events` |
| `s2_open_discussion` | Teacher Console | `s1_assert_teacher`, `s2_log_event` | `discussion_sessions`, `game_runs.silent_texting_mode`, events |
| `s2_open_vote` | Teacher Console | `s1_assert_teacher`, `s2_get_active_run`, `s2_log_event` | `discussion_sessions`, events |
| `s2_add_time` | Teacher Console | same authority helpers | `discussion_sessions`, events |
| `s2_send_message` | Player | session auth, active run, `s2_refresh_discussion`, `s2_log_event` | `dialogue_messages`, events |
| `s2_submit_vote` | Player | session auth, active run, `s2_refresh_discussion`, `s2_log_event` | `runtime_player_decisions`, `discussion_sessions`; may create a re-vote `discussion_sessions` row |
| `s2_get_player_state` | Player | session auth, active run, `s2_refresh_discussion` | nominal read, but refresh helper can advance discussion timeout state |
| `s2_get_teacher_state` | Teacher | teacher auth, active run, `s2_refresh_discussion` | nominal read, but refresh helper can advance timeout state |

Internal:
- `s2_get_active_run`
- `s2_log_event`
- `s2_refresh_discussion`
- `s2_protect_run_identity` trigger

Important call-graph property:
`s2_get_player_state` and `s2_get_teacher_state` are observational APIs whose helper may perform authoritative timeout transitions. They are therefore not purely read-only in system effect.

## 7.3 Sprint 3A Pocket / Knowledge surface

Browser/test-facing functions in the frozen baseline include:
- `s3_share_photo`
- `s3_set_item_view`
- `s3_get_player_state`
- `s3_get_teacher_state`
- `s3_initialize_audit_fixture`
- `s3_audit_provenance_probe`

Internal helpers:
- `s3_record_observation`
- `s3_record_knowledge`

Final implementations of `s3_share_photo`, `s3_initialize_audit_fixture`, `s3_get_player_state`, and `s3_record_knowledge` are the migration-006 versions where redefined.

Principal state:
- `s3_runtime_scene_state`
- `s3_player_items`
- `s3_player_item_view_state`
- `s3_player_observations`
- `s3_player_knowledge`
- `s3_shared_photos`
- `s3_group_items`

## 7.4 Sprint 3B wrapper topology after migration 011/012

Migration 011 renames the then-deployed implementations to `*_pre011` and installs guarded public wrappers.

Final public wrapper topology:

| Public RPC | Final definition | Delegation | Main effective mutation |
|---|---|---|---|
| `s3b_initialize_flow` | migration 011 | → `s3b_initialize_flow_pre011` | creates Sprint3B run/player state + runtime scene, then adds ACT1 delivery metadata |
| `s3b_ack_act1_opening` | migration 011 | direct | player ACT1 stage |
| `s3b_submit_act1_choice` | migration 011 | direct | locked ACT1 choice/stage; trigger adds ACT1 consequences |
| `s3b_complete_act1` | migration 011 | direct + `s3b_set_scene` | player ACT1 stage; all-three gate advances scene |
| `s3b_submit_first_meeting` | migration 011 | → `*_pre011` | locked first-meeting choice |
| `s3b_grab` | migration 011 | → `*_pre011` | player items/view state + grab progress; trigger may add optional flashlight |
| `s3b_leave_start_room` | migration 011 | → `*_pre011` | player location/progress; all-three gate directly inserts ACT2 DiscussionRoom |
| `s3b_apply_meeting_resolution` | migration 011 | → `*_pre011`, then `s3b_set_scene` | persists meeting result/route then moves to route_update |
| `s3b_ack_route_update` | migration 012 | direct + `s3b_set_scene` | per-player ACK; all-three gate moves to route_consequence |
| `s3b_complete_foldback` | migration 011 | → `*_pre011` | fold-back route/scene/event |
| `s3b_follow_sign` | migration 011 | → `*_pre011` | player location; all-three gate starts Library puzzle |
| `s3b_submit_library_code` | migration 011 | → `*_pre011` | attempt counter/history, puzzle state, group items, next scene |
| `s3b_submit_act4_choice` | migration 011 | → `*_pre011` | locked ACT4 choice; may terminally resolve or directly insert ACT5 DiscussionRoom |
| `s3b_apply_act5_resolution` | migration 011 | → migration-010 `*_pre011` implementation | applies resolved DiscussionRoom result; terminal or Inspect First |
| `s3b_choose_post_inspection_route` | migration 011 | → migration-010 `*_pre011` | Game Track Known/Unknown terminal route |
| `s3b_get_player_state` | migration 011 | → `*_pre011` then decorates queued messages | state read; pre011 also invokes puzzle refresh |
| `s3b_get_my_facts` | migration 009 | direct read | private ACT1 fact read |

Audit-only Sprint3B helpers:
- `s3b_audit_expire_puzzle` — migration 007 implementation remains present; teacher token + AUDIT mode checked in body.
- `s3b_audit_set_puzzle_elapsed` — final migration 011 implementation; teacher token + AUDIT mode checked.

Internal non-browser helpers/triggers:
- `s3b_set_scene`
- `s3b_refresh_puzzle`
- `s3b_lock_run_for_player_progress`
- `s3b_apply_act1_consequence`
- `s3b_add_optional_grab_item`
- `s3b_canonicalize_group_item_label`
- `s3b_guard_player_progress_phase`
- `s3b_guard_run_state_phase`
- `s3b_guard_library_attempt_phase`
- all `*_pre011` implementations

Migration 012 explicitly revokes browser roles from the renamed `*_pre011` functions and redefines `s3b_ack_route_update` as the final public implementation.

## 7.5 Current browser orchestration

### Player app

Direct/static RPC calls:
- Sprint1: `s1_join_player`, `s1_get_player_state`, `s1_submit_private_choice`
- Sprint2: `s2_get_player_state`, `s2_send_message`, `s2_submit_vote`
- Sprint3B: `s3b_get_player_state`, `s3b_submit_library_code`, `s3b_apply_meeting_resolution`, `s3b_apply_act5_resolution`

Dynamic Sprint3B button dispatch additionally calls:
- `s3b_ack_act1_opening`
- `s3b_submit_act1_choice`
- `s3b_complete_act1`
- `s3b_submit_first_meeting`
- `s3b_grab`
- `s3b_leave_start_room`
- `s3b_ack_route_update`
- `s3b_complete_foldback`
- `s3b_follow_sign`
- `s3b_submit_act4_choice`
- `s3b_choose_post_inspection_route`

### Teacher Console

Calls:
- Sprint1: `s1_create_room`, `s1_get_teacher_state`, `s1_advance_scene`, `s1_reset_room`, `s1_release_player_session`
- Sprint2: `s2_start_run`, `s2_open_discussion`, `s2_open_vote`, `s2_add_time`, `s2_get_teacher_state`
- Sprint3B: `s3b_initialize_flow`

## 7.6 B2 conclusions

1. The current system exposes three generations of callable runtime surface concurrently: Sprint1 legacy, Sprint2 formal DiscussionRoom, Sprint3B formal flow.
2. Sprint3B's effective implementation is intentionally layered: public guarded wrappers in 011/012 delegate to renamed historical bodies.
3. Several “get state” APIs have side effects through timeout refresh helpers, so a call graph that classifies them as read-only would be inaccurate.
4. Game-specific DiscussionRoom creation bypasses `s2_open_discussion` and occurs inside Sprint3B mutation paths; this supports existing finding IDA-002.
5. Discussion resolution and Game Track application are separate public calls; this supports existing finding IDA-001.
6. No new finding is opened solely from B2 beyond IDA-001/002/003. Authentication, final ACL exposure, stale/replay behavior and concurrency guarantees are explicitly deferred to Methods 2–4.

## 7.7 B2 completion status

B2 requirements satisfied:
- all in-scope public runtime/test RPC families enumerated;
- helper delegation mapped;
- principal writes mapped;
- player/Teacher frontend callers mapped;
- final Sprint3B wrapper layer after migration 012 identified.

# 8. B3 — Implemented ACT 1–5 Transition Graph

Baseline: `3be0e6ad8395f05bbab13ca41e6b91dac57eb4fe`

The graph below uses the effective post-migration-012 public wrappers plus the preserved `*_pre011` bodies they delegate to.

| Current state | Accepted action | Exact effective server gate | Mutation / result | Replay / stale result |
|---|---|---|---|---|
| Active formal run; no Sprint3B state | Teacher `s3b_initialize_flow` | teacher auth; active run; wrapper rejects if `s3b_run_state` already exists | creates run/player flow state; sets scene `act1_wake_up/private_first_action`; installs role text metadata | replay rejected: “flow already initialized” |
| ACT1 `opening` | player `s3b_ack_act1_opening` | authenticated player; runtime scene = ACT1/private_first_action; player's `act1_stage='opening'` | stage → `action` | duplicate rejected by stage predicate |
| ACT1 `action` | `s3b_submit_act1_choice` | exact ACT1/private_first_action scene; role-specific canonical choice; stage=`action`; choice NULL | locks choice/time; stage → `consequence`; ACT1 consequence trigger writes facts/observations | duplicate/stale rejected by stage/choice/scene guard |
| ACT1 `consequence` | `s3b_complete_act1` | scene_id=`act1_wake_up`; player's stage=`consequence` | stage → complete; when count(complete)=3, scene → ACT2/private_first_meeting | duplicate rejected; after global advance, scene guard rejects |
| ACT2 private first meeting | `s3b_submit_first_meeting` | exact ACT2/private_first_meeting; player's first_meeting choice NULL; delegated body also requires prior ACT1 choice | locks first-meeting choice | duplicate rejected |
| ACT2 private first meeting | `s3b_grab` | exact ACT2/private_first_meeting; grab=false; delegated body requires first-meeting choice | creates mandatory items/view state; grab=true; optional-item trigger may add flashlight | duplicate rejected |
| ACT2 private first meeting | `s3b_leave_start_room` | exact ACT2/private_first_meeting; left=false; delegated body requires choice+grab | location→corridor; when all 3 ready, direct INSERT ACT2 DiscussionRoom and scene→meeting_discussion | duplicate rejected; after global transition, phase guard rejects |
| ACT2 meeting discussion | Sprint2 message/vote RPCs | DiscussionRoom status/deadline/vote guards | persisted messages/votes; final result becomes authoritative in `discussion_sessions.outcome` | duplicate vote rejected by decision uniqueness |
| ACT2 meeting discussion resolved | `s3b_apply_meeting_resolution` | authenticated player; lock formal run; runtime scene still ACT2/meeting_discussion; `final_meeting_result IS NULL`; resolved ACT2 discussion required by delegated body | persists `final_meeting_result`; route metadata; wrapper finally sets scene→route_update | replay rejected once result/scene changes; missing second RPC creates IDA-001 split state |
| ACT2 route_update | `s3b_ack_route_update` | authenticated player; formal-run lock; exact route_update scene; player's `route_update_ack_at IS NULL` | records ACK; third ACK sets scene→route_consequence | duplicate ACK rejected; post-transition stale call rejected |
| ACT2 route_consequence | `s3b_complete_foldback` | delegated migration-010 body locks runtime scene and requires exact route_consequence | preserves original meeting result; failed route event at most once; target→Library; scene→ACT3/wayfinding | replay rejected after scene changes |
| ACT3 wayfinding | `s3b_follow_sign` | exact ACT3/wayfinding; player not already in Library | location→Library; serialized player-progress trigger; third arrival sets reunited, puzzle deadline and scene→library_box | duplicate/stale rejected |
| ACT3 library_box | `s3b_submit_library_code` | public wrapper authenticates, reads run state, requires exact library_box + unresolved; validates submitted code against **currently read** locked prefix; delegated body refreshes timeout, locks run state, records attempt | wrong: increments attempt/hint; correct: resolves, creates group items, scene→ACT4/private_route_choice | post-resolution replay rejected; timeout-boundary prefix TOCTOU = IDA-004 |
| ACT3 library_box timeout | `s3b_refresh_puzzle` indirectly via state reads/submission/audit helper | run-state row lock; unresolved; deadline elapsed | monotonic prefix stages; at stage 8 system-resolves, creates items, scene→ACT4 | later refresh returns because resolved |
| ACT4 private_route_choice | `s3b_submit_act4_choice` | exact ACT4/private_route_choice; player's choice NULL; puzzle already resolved in delegated body | locks private choice; serialized trigger. If all three same known/unknown: terminal route. Otherwise direct INSERT ACT5 DiscussionRoom + scene→ACT5/discussion | duplicate/stale rejected |
| ACT5 discussion | Sprint2 message/vote RPCs | DiscussionRoom rules | final vote/fallback outcome in DiscussionRoom | duplicate vote rejected |
| ACT5 discussion resolved | `s3b_apply_act5_resolution` | wrapper exact ACT5/discussion; delegated migration-010 body locks runtime scene and rechecks exact phase + resolved session | known/unknown→terminal; inspect_first→post_inspection_route, nonterminal | concurrent/replay caller sees changed scene and rejects; missing second RPC is same IDA-001 class |
| ACT5 post_inspection_route | `s3b_choose_post_inspection_route` | exact post_inspection_route; pending=true; group_route NULL; delegated body locks scene and repeats phase check; conditional update | known/unknown Game Track result; terminal `SPRINT3B_COMPLETE` | duplicate/concurrent later call rejected |
| terminal | any earlier Sprint3B mutation | scene/field guards no longer match | no intended mutation | stale calls reject |

## 8.1 Serialization mechanisms that affect the graph

- `s3b_player_progress` INSERT/UPDATE is serialized per run by `s3b_lock_run_for_player_progress()`, which locks the corresponding `s3b_run_state` row.
- migration-010 phase-guard triggers reject player-progress, run-state and puzzle-attempt mutations inconsistent with `s3_runtime_scene_state`.
- route-update ACK additionally locks the formal `game_runs` row.
- puzzle timeout/submission paths lock `s3b_run_state`.
- ACT5 apply and post-inspection route resolution lock `s3_runtime_scene_state` in their delegated migration-010 bodies.

These mechanisms make several all-three gates effectively serialized despite client concurrency.

## 8.2 Transition-graph anomaly found: puzzle locked-prefix TOCTOU

Effective public `s3b_submit_library_code` in migration 011 performs this order:

1. read `s3b_run_state` into local variable `s` without a row lock;
2. validate `p_code` against `s.puzzle_locked_prefix`;
3. delegate to `s3b_submit_library_code_pre011`;
4. delegated body first calls the **new final** `s3b_refresh_puzzle`;
5. refresh can lock the row and advance `puzzle_locked_prefix` because the deadline has just elapsed;
6. delegated body then records the attempt without re-checking the submitted code against the newly advanced prefix.

Reachable example:

- persisted prefix = empty;
- deadline is already elapsed but no refresh has run yet;
- player submits `99999`;
- wrapper checks against empty prefix and accepts;
- delegated refresh changes locked prefix to `4`;
- the same request can still record attempt `99999`.

The existing locked-wheel test first forces/reads the refreshed prefix and only then submits an incompatible code, so it does not cover this check-then-refresh window.

This is recorded as IDA-004.

## 8.3 B3 completion

B3 is complete for the frozen implementation:
- every implemented ACT1–5 gate is mapped;
- exact authoritative phase/field predicates are recorded;
- result states and next accepted actions are recorded;
- normal duplicate/stale outcomes are recorded;
- one new transition-boundary defect, IDA-004, was identified.

