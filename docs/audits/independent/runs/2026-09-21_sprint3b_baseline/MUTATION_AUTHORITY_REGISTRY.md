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

# C2 — Internal / Helper Exposure Inventory

This is the code-derived effective exposure after migration 012.  
Actual deployed PostgreSQL ACL introspection remains a Method 4 task.

## C2.1 Internal helpers explicitly removed from browser roles

### Sprint 1
- `s1_hash_token(text)`
- `s1_touch_room(text)`
- `s1_assert_teacher(text,text)`
- `s1_get_player_by_session(text,text)`

Migration 001 explicitly revokes EXECUTE from PUBLIC / anon / authenticated.

### Sprint 2
- `s2_protect_run_identity()`
- `s2_get_active_run(text)`
- `s2_log_event(uuid,text,uuid,text,uuid,jsonb)`
- `s2_refresh_discussion(uuid)`

Migration 002 explicitly revokes browser-role execution.

### Sprint 3A
- `s3_record_observation(uuid,uuid,text,text)`
- `s3_record_knowledge(uuid,uuid,text,text,text,uuid,text)`

Migration 005 explicitly revokes browser-role execution. Migration 006 replaces `s3_record_knowledge` without recreating a new function identity, so the existing ACL should be retained.

### Sprint 3B core helpers / trigger functions
- `s3b_set_scene(uuid,text,text,text,text,text)`
- `s3b_refresh_puzzle(uuid)`
- `s3b_lock_run_for_player_progress()`
- `s3b_apply_act1_consequence()`
- `s3b_add_optional_grab_item()`
- `s3b_canonicalize_group_item_label()`
- `s3b_guard_player_progress_phase()`
- `s3b_guard_run_state_phase()`
- `s3b_guard_library_attempt_phase()`

Each has an explicit revoke in its introducing migration. Later CREATE OR REPLACE operations on `s3b_refresh_puzzle` preserve the same function identity/ACL.

## C2.2 Migration-011 historical implementation layer

Migration 011 renames these then-public implementations to historical helpers:

- `s3b_initialize_flow_pre011(text,text)`
- `s3b_submit_first_meeting_pre011(text,text,text)`
- `s3b_grab_pre011(text,text)`
- `s3b_leave_start_room_pre011(text,text)`
- `s3b_apply_meeting_resolution_pre011(text,text)`
- `s3b_complete_foldback_pre011(text,text)`
- `s3b_follow_sign_pre011(text,text)`
- `s3b_submit_library_code_pre011(text,text,text)`
- `s3b_submit_act4_choice_pre011(text,text,text)`
- `s3b_apply_act5_resolution_pre011(text,text)`
- `s3b_choose_post_inspection_route_pre011(text,text,text)`
- `s3b_get_player_state_pre011(text,text)`

A PostgreSQL function rename retains the existing ACL; therefore these renamed functions would have retained their former public/anon/authenticated executability immediately after migration 011.

Migration 012 explicitly revokes EXECUTE on **all twelve** from:
- PUBLIC
- anon
- authenticated

The final source-level baseline therefore closes the direct browser bypass to the unguarded historical bodies.

Important audit note:
- the transient state between deploying migration 011 and migration 012 is not part of the frozen final baseline;
- whether the production database actually has the expected final ACL must be checked by Method 4 rather than inferred only from SQL source.

## C2.3 Intentionally browser-executable AUDIT helpers

These are not internal-only; they are test surfaces protected in their function bodies:

- `s3_initialize_audit_fixture(text,text)`
- `s3_audit_provenance_probe(text,text,text)`
- `s3b_audit_expire_puzzle(text,text)`
- `s3b_audit_set_puzzle_elapsed(text,text,integer)`

Each requires Teacher authentication; the inspected body also requires `run_mode='audit'`.

Their authorization correctness is reviewed in C3; direct privilege state is rechecked in Method 4.

## C2.4 Trigger-only helpers

The following are invoked through triggers and are not intended as direct client APIs:
- run identity protection;
- Sprint3B per-run serialization;
- ACT1 consequence generation;
- optional-item grant;
- phase guards;
- group-item label canonicalization.

The SQL source contains explicit EXECUTE revokes where required. Trigger invocation remains valid because PostgreSQL executes the trigger function as part of the table operation rather than requiring the browser role to call the helper directly.

## C2.5 C2 conclusion

Code-derived post-012 exposure shows:
- guarded public wrappers remain browser-facing;
- historical `*_pre011` implementations are explicitly locked down;
- internal authority helpers are explicitly revoked;
- AUDIT helpers remain intentionally callable but are expected to self-authorize.

No new source-level helper-exposure defect is opened in C2.

Deployment-effective ACL is **NOT VERIFIED here by design** and will be independently reconstructed/queried in Method 4.

