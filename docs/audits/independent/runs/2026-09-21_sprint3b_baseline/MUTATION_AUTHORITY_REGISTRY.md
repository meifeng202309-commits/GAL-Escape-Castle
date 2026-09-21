# Mutation / Authority Registry

Audit run: 2026-09-21_sprint3b_baseline  
Baseline: `3be0e6ad8395f05bbab13ca41e6b91dac57eb4fe`  
Status: METHOD 2 IN PROGRESS

# C1 — External Mutation Inventory

This inventory includes browser-executable RPCs that mutate gameplay/evidence/session state directly or can cause authoritative mutation as a side effect of a nominal state read.

Final privilege verification is reserved for Method 4; “browser-executable” here means the frozen migrations explicitly grant the relevant public wrapper to `anon/authenticated` and/or the current client/test suite calls it.

## C1.1 Sprint 1

| RPC | Intended caller | Mutation class | Primary state/evidence affected |
|---|---|---|---|
| `s1_create_room` | Teacher | setup mutation | room, room state, assigned players, event |
| `s1_join_player` | Player | session mutation | session token, join/last-seen timestamps, event |
| `s1_get_player_state` | Player | read + heartbeat side effect | `last_seen_at` via session helper |
| `s1_submit_private_choice` | Player | behavior mutation | legacy decision, room reveal state, event |
| `s1_advance_scene` | Teacher | legacy Game Track mutation | legacy room scene/phase, event |
| `s1_release_player_session` | Teacher | recovery/session mutation | clears role session token/timestamps, event |
| `s1_reset_room` | Teacher | destructive legacy reset | deletes legacy choices, resets legacy room state, event |

`s1_get_teacher_state` is browser-executable but has no direct gameplay write and is excluded from the mutation list.

## C1.2 Sprint 2 / DiscussionRoom

| RPC | Intended caller | Mutation class | Primary state/evidence affected |
|---|---|---|---|
| `s2_start_run` | Teacher | formal-run creation | `game_runs`, runtime event |
| `s2_open_discussion` | Teacher | interaction creation | `discussion_sessions`, run silent-text mode, event |
| `s2_open_vote` | Teacher | phase transition | discussion status/deadline, event |
| `s2_add_time` | Teacher | deadline mutation | discussion deadline, event |
| `s2_send_message` | Player | behavior evidence | dialogue message, event |
| `s2_submit_vote` | Player | behavior + resolution | player decision, discussion outcome, possible revote session, events |
| `s2_get_player_state` | Player | read-triggered mutation | session heartbeat; `s2_refresh_discussion` can advance timeout state |
| `s2_get_teacher_state` | Teacher | read-triggered mutation | `s2_refresh_discussion` can advance timeout state |

## C1.3 Sprint 3A Pocket / Knowledge

| RPC | Intended caller | Mutation class | Primary state/evidence affected |
|---|---|---|---|
| `s3_set_item_view` | Player | Game Track/object-view mutation | current server-authoritative item view |
| `s3_share_photo` | Player | sharing/provenance mutation | shared-photo copy/provenance |
| `s3_initialize_audit_fixture` | Teacher, AUDIT | audit fixture mutation | scene, items, views, observations, knowledge, group item |
| `s3_audit_provenance_probe` | Teacher, AUDIT | negative-test mutation attempt | invokes knowledge provenance writer and is expected to trigger validation errors |

`s3_get_player_state` changes session heartbeat through shared player-session authentication but does not otherwise mutate Sprint3A gameplay state.  
`s3_get_teacher_state` is observational.

## C1.4 Sprint 3B formal flow

| RPC | Intended caller | Mutation class | Primary state/evidence affected |
|---|---|---|---|
| `s3b_initialize_flow` | Teacher | formal-flow setup | Sprint3B run/player state, runtime scene, ACT1 text metadata |
| `s3b_ack_act1_opening` | Player | per-player progression | ACT1 stage |
| `s3b_submit_act1_choice` | Player | Behavior Track | ACT1 locked choice/time; trigger creates facts/observations |
| `s3b_complete_act1` | Player | progression gate | ACT1 stage; all-three scene transition |
| `s3b_submit_first_meeting` | Player | Behavior Track | locked first-meeting choice/time |
| `s3b_grab` | Player | Game Track/object state | pocket items/views; grab progress |
| `s3b_leave_start_room` | Player | Game Track + interaction creation | location/progress; all-three creates ACT2 discussion |
| `s3b_apply_meeting_resolution` | Player-callable resolver | group Game Track resolution | meeting result, route state, runtime scene |
| `s3b_ack_route_update` | Player | Game Track barrier | per-player ACK; all-three scene transition |
| `s3b_complete_foldback` | Player-callable Game Track continuation | route/fold-back | failed-rendezvous state/event, current/wayfinding target, scene |
| `s3b_follow_sign` | Player | Game Track | player location; all-three reunion/puzzle start |
| `s3b_submit_library_code` | Player | Game Track puzzle attempt | attempt ledger, hint/resolution state, items, scene |
| `s3b_submit_act4_choice` | Player | Behavior Track | locked ACT4 stance; may resolve direct route or create ACT5 discussion |
| `s3b_apply_act5_resolution` | Player-callable resolver | group Game Track resolution | group route / Inspect First state / terminal scene |
| `s3b_choose_post_inspection_route` | Player-callable Game Track decision | non-Behavior operational resolution | group route, pending flag, terminal state/event |
| `s3b_get_player_state` | Player | read-triggered Game Track mutation | session heartbeat; puzzle timeout refresh may lock wheels/resolve puzzle |
| `s3b_audit_expire_puzzle` | Teacher, AUDIT | audit-time mutation | artificial puzzle deadline + timeout refresh |
| `s3b_audit_set_puzzle_elapsed` | Teacher, AUDIT | audit-time mutation | puzzle times + timeout refresh |

`s3b_get_my_facts` is observational apart from session heartbeat.

## C1.5 External mutation surface count

By semantic entry point:
- Sprint1: 7 mutation/side-effect RPCs
- Sprint2: 8
- Sprint3A: 4 formal/audit mutations
- Sprint3B: 18

Total inventoried external mutation/side-effect surfaces: **37**

This count is a code-surface inventory, not a safety score. Several are intentionally legacy or AUDIT-only.

## C1.6 Existing findings touched by the inventory

- IDA-003: legacy Sprint1 player mutation remains callable from the same formal player application.
- IDA-005: generic Teacher `s2_open_discussion` remains a formal-run mutation surface without Sprint3B scene binding.
- IDA-001: group resolution requires a second player-callable resolver after `s2_submit_vote`.

No additional finding is opened solely by enumeration in C1.
