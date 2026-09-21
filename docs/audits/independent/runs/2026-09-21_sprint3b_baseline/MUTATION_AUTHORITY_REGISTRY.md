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

# C3 — Authentication / Authorization Review

## C3.1 Authentication primitives

The frozen baseline has three practical authority mechanisms:

1. **Room creation bootstrap**
   - `s1_create_room` is intentionally not authenticated by a pre-existing account.
   - the caller supplies the initial Teacher token and role join codes when creating a new prototype room.
   - this is the existing prototype trust model, not treated as a new authorization defect in this audit.

2. **Player authority**
   - player RPCs call `s1_get_player_by_session(room_code, session_token)`.
   - the session token hash must belong to a player row in the same normalized room.
   - this binds every valid player call to one concrete `player_id` + `role_slot` + room.
   - formal-run RPCs then obtain the active `run_id` server-side from that room through `s2_get_active_run`.

3. **Teacher authority**
   - Teacher RPCs call `s1_assert_teacher(room_code, teacher_token)`.
   - this binds the Teacher capability to the specified room.
   - Teacher formal-run operations resolve the active run server-side rather than accepting client `run_id`.

No reviewed formal mutation RPC accepts an arbitrary client-supplied `run_id` or `player_id`.

## C3.2 Sprint 1 authorization

| RPC class | Credential / binding | Role/mode restriction | C3 result |
|---|---|---|---|
| room create | bootstrap room + new Teacher token | setup-only trust model | expected prototype model |
| join | room + assigned join code | claims exactly one configured role slot | bound |
| player state / legacy choice | room + player session | exact player identity from token | bound |
| advance/reset/release/Teacher state | room + Teacher token | Teacher only | bound |

The fact that legacy Teacher controls remain present during formal runtime is not an authentication failure: the Teacher is correctly authenticated. Whether those controls are valid in a formal scene is a state/phase issue handled in C4/Method7.

## C3.3 Sprint 2 authorization

| RPC | Credential | Run binding | Restrictions | Result |
|---|---|---|---|---|
| `s2_start_run` | Teacher token | creates run for authenticated room | mode must be normal/audit | bound |
| `s2_open_discussion` | Teacher token | active run resolved by room | no canonical Sprint3B phase restriction | identity bound; scene authorization defect already IDA-005 |
| `s2_open_vote`, `s2_add_time` | Teacher token | active run by room | operates latest/current DiscussionRoom | identity bound |
| `s2_send_message` | player session | active run by player's room | submitting player from token | bound |
| `s2_submit_vote` | player session | active run by player's room | vote row attributed to authenticated player | bound |
| player/Teacher state getters | matching credential | active run by room | timeout refresh uses same bound run | bound |

## C3.4 Sprint 3A authorization

### Player object operations

`s3_set_item_view`:
- authenticates player session;
- derives active run by room;
- requires the authenticated player to physically own the item;
- target view must be in server catalog.

`s3_share_photo`:
- authenticates sender session;
- derives active run by room;
- requires sender to physically own source item;
- only current server-authoritative view may be shared;
- recipient is looked up by role slot **within the same room**;
- sender cannot choose an arbitrary player UUID.

C3 result: sender/recipient/run authority is server-bound.

### AUDIT-only operations

`s3_initialize_audit_fixture` and `s3_audit_provenance_probe`:
- require Teacher token;
- derive active run by room;
- explicitly reject unless `run_mode='audit'`.

C3 result: mode authorization is present in the inspected function bodies.

## C3.5 Sprint 3B player mutations

All ordinary player-facing Sprint3B mutations authenticate via `s1_get_player_by_session` and derive the active run by the authenticated room.

Additional authority rules:

- ACT1 choice: server uses authenticated player's `role_slot` to validate the role-specific choice allowlist.
- GRAB: server uses authenticated player's role to select that player's canonical object set.
- first meeting / ACT4: submission is written only to authenticated player's progress row.
- route ACK / FOLLOW SIGN: updates only authenticated player's row.
- Library attempts: `submitted_by` comes from authenticated player, not client input.

C3 result: no ordinary player RPC accepts a client-supplied actor identity.

## C3.6 Player-callable group progression resolvers

Several Game Track resolvers can be invoked by **any valid player in the room**:

- `s3b_apply_meeting_resolution`
- `s3b_complete_foldback`
- `s3b_apply_act5_resolution`

For these functions:
- the player only supplies room + session;
- the substantive group result is read from authoritative server state;
- the caller cannot supply the meeting/vote outcome;
- the operation is operational progression rather than player-authored Behavior Track evidence.

C3 does not classify this pattern as an authorization defect by itself. Replay/state safety is handled in C4–C6.

## C3.7 Unresolved authority: post-inspection group route

`s3b_choose_post_inspection_route(room, session, p_route)` is qualitatively different:

- any valid player session in the room is accepted;
- client directly supplies `p_route = known | unknown`;
- the first successful call writes the shared `group_route` and terminal state;
- the event records `submitted_by = authenticated player_id`;
- `src/game/app.js` renders the Known/Unknown buttons to every player in `post_inspection_route`.

Canonical V4.0 states only:
> after Inspect First, perform one Game Track Known Route / Unknown Passage choice; it is not a new private behavior choice.

It does **not** specify:
- whether all three clients may race and first click wins;
- whether one designated actor submits;
- whether the choice is a shared/group UI action;
- whether consensus/acknowledgement is required.

Therefore CA cannot determine whether the implemented first-valid-player-wins authority is correct without inventing gameplay semantics.

Recorded as:
- **IDA-007 — OBSERVATION / NOT_VERIFIED**
- canonical clarification requested from GA.

## C3.8 Sprint 3B AUDIT helpers

`s3b_audit_expire_puzzle` and `s3b_audit_set_puzzle_elapsed`:
- require Teacher token;
- derive active run by room;
- reject non-AUDIT run.

C3 result: expected mode gate exists.

## C3.9 C3 conclusion

Authentication/identity binding is generally strong in the frozen baseline:
- no arbitrary client `player_id`;
- no arbitrary client `run_id`;
- player tokens are room/player bound;
- Teacher tokens are room bound;
- AUDIT mutators have explicit mode checks.

Existing authorization-related defect:
- IDA-005: Teacher is authenticated but is authorized too broadly with respect to canonical scene state.

Unresolved canonical authority:
- IDA-007: ownership of the post-inspection shared route submission.

# C4 — Phase / State Guard Review

## C4.1 Sprint 1 legacy mutations

Sprint1 functions enforce their own legacy state machine:
- `s1_submit_private_choice` checks current legacy room scene/phase and per-player uniqueness;
- `s1_advance_scene` requires legacy phase `revealed`;
- `s1_reset_room` intentionally resets only legacy Sprint1 state;
- session release is a recovery action rather than a scene transition.

They do **not** inspect formal Sprint3B scene state. This coexistence is canonical-compatible only because Sprint1 is a preserved legacy boundary. The formal UI exposure problem remains IDA-003; C4 does not create a duplicate finding.

## C4.2 Sprint 2 DiscussionRoom guards

`s2_start_run`:
- locks room;
- rejects if an active formal run already exists;
- requires exactly three claimed player sessions.

`s2_open_discussion`:
- locks active run;
- rejects if another discussion is open;
- validates discussion configuration;
- **does not validate current Sprint3B scene/phase**.

This is existing IDA-005.

`s2_open_vote`:
- locks latest DiscussionRoom;
- requires status=`discussion`;
- requires final vote configured.

`s2_add_time`:
- locks latest DiscussionRoom;
- requires status in `discussion|voting|waiting_for_missing_player`.

`s2_send_message`:
- refreshes timeout state;
- requires current latest session status=`discussion`;
- requires `allow_free_text`.

`s2_submit_vote`:
- refreshes timeout state;
- locks latest session;
- requires status=`voting`;
- validates option against server-stored vote options.

DiscussionRoom's internal phase guards are present, but they are not bound to canonical Sprint3B scene authority. IDA-005/IDA-002 capture the resulting cross-layer defects.

## C4.3 Sprint 3A object/view state guards

`s3_set_item_view`:
- active formal run required;
- authenticated player must physically own the item;
- target view must be catalog-allowed;
- current view row is locked;
- only front↔back transitions are accepted.

No canonical scene restriction is required merely to inspect an already owned physical item; V4.0 explicitly allows later real-object inspection.

`s3_share_photo`:
- active formal run required;
- authenticated sender must physically own item;
- shared view must equal current server-authoritative view;
- catalog must mark view shareable;
- recipient must be another player in same room.

However, it does **not** check:
- current canonical scene/phase;
- whether a DiscussionRoom is active;
- scene parameter `allow_share_photo`.

No `allow_share_photo` state field exists in the inspected database schema.

Canonical V4.0 requires the SHARE PHOTO action only when:
- `allow_share_photo == true`;
- current view is shareable;
- current player physically owns the source item.

It also states private phases lock DiscussionRoom and First Contact information sharing occurs during DiscussionRoom.

Therefore server-side phase permission is missing: **IDA-008**.

Reachable example:
1. ACT2 private_first_meeting;
2. Gitte locks first-meeting choice and presses GRAB;
3. Map / Number Note now exist as owned items;
4. before all players leave rooms / before First Contact Discussion opens, direct RPC `s3_share_photo` can send an item view to another player;
5. recipient receives persisted `s3_shared_photos` evidence outside an allowed sharing scene.

## C4.4 Sprint 3B formal guards

Final post-011/012 wrappers generally re-check authoritative runtime scene before mutation:

- ACT1 opening ACK: exact `act1_wake_up/private_first_action` plus stage=`opening`;
- ACT1 choice: exact ACT1/private phase plus stage=`action` and no existing choice;
- ACT1 complete: ACT1 scene plus stage=`consequence`;
- first meeting / GRAB / leave: exact ACT2/private_first_meeting plus per-player completion flag;
- meeting apply: exact ACT2/meeting_discussion plus no existing meeting result; delegated body requires resolved ACT2 DiscussionRoom;
- route ACK: exact route_update plus per-player unacknowledged;
- fold-back: delegated migration010 locks and requires exact route_consequence;
- FOLLOW SIGN: exact wayfinding plus player not already in Library;
- Library submit: exact library_box + unresolved, with IDA-004 stale-prefix ordering defect;
- ACT4 choice: exact ACT4/private_route_choice plus no existing player choice;
- ACT5 apply: exact ACT5/discussion; delegated body re-locks/rechecks and requires resolved discussion;
- post-inspection route: exact post_inspection_route + pending=true + group_route NULL; actor authority remains IDA-007 pending GA.

Trigger guards additionally restrict:
- player-progress mutation phases;
- run-state mutation phases;
- Library attempt insertion phase.

## C4.5 AUDIT helper phase behavior

AUDIT helpers require AUDIT mode but are not uniformly bound to the target scene.

Notably `s3b_audit_set_puzzle_elapsed` can write `puzzle_started_at/puzzle_deadline` while the run is outside library_box if the chosen elapsed value does not cause the refresh helper to mutate guarded puzzle fields immediately.

Because:
- this surface is Teacher-only;
- it is AUDIT-only;
- it is explicitly test instrumentation rather than NORMAL gameplay;

C4 records it as a test-harness scope weakness for later Method6/8 review, not as a production defect at this stage.

## C4.6 C4 conclusion

Server-side phase/state guards are strong across most Sprint3B transitions.

Confirmed cross-layer state authorization defects:
- IDA-005: generic DiscussionRoom can be opened outside canonical discussion scenes.
- IDA-008: SHARE PHOTO ignores canonical `allow_share_photo` scene permission.
- IDA-004 remains a state-ordering defect inside an otherwise correctly phase-gated Library submission.

No other new production finding is opened in C4.

