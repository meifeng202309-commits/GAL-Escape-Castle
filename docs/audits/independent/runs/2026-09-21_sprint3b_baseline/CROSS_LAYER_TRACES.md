# Cross-Layer Contract Audit

Audit run: `2026-09-21_sprint3b_baseline`  
Frozen product baseline: `3be0e6ad8395f05bbab13ca41e6b91dac57eb4fe`

Each journey is traced through:

UI → client JS → RPC → SQL/DB → response → polling/reconnect → other clients/Teacher.

# F1 — Room creation / join

## Success path

Teacher:
1. Teacher UI collects room code, Teacher token and three role join codes.
2. `teacher-console.js` calls `s1_create_room`.
3. server normalizes room code, hashes credentials and inserts room / three assigned players / legacy room state.
4. response returns room state.
5. Teacher polling can reopen the same room using the original Teacher token.

Player:
1. player enters room code + assigned join code.
2. `app.js joinRoom()` calls `s1_join_player`.
3. server validates the hashed join code and requires that role slot not already have a session.
4. server creates bearer session token and returns canonical `player_id / display_name / role_slot / session_token`.
5. browser persists exactly those returned identity fields in localStorage.
6. subsequent calls authenticate by room + session token.

Authority handoff:
- client chooses room/join code only;
- server chooses player identity/role and session token.

## Failure behavior

Pre-request/network-before-commit:
- no server identity is created; retry is safe.

Post-commit/pre-response loss on join:
- role is server-claimed but browser never receives the generated token;
- immediate retry with join code rejects because the slot is already claimed;
- Teacher `s1_release_player_session` is the intended recovery, preserving the same player_id and formal evidence.

This is operationally recoverable and was part of the verified Sprint1 recovery model; no new finding.

# F2 — First behavior choice

The formal Sprint3B ACT1 path is:

1. Player state polling returns `act1_stage='opening'`.
2. client renders canonical private opening.
3. player clicks Continue → `s3b_ack_act1_opening`.
4. server checks exact ACT1/private phase and opening stage, then moves player to `action`.
5. polling/render shows role-specific action buttons.
6. player clicks one → generic `runSprint3bAction()` sends `s3b_submit_act1_choice`.
7. server authenticates player, derives run, rechecks scene/phase, validates role-specific choice, writes locked choice + server timestamp + consequence stage.
8. trigger writes canonical consequence facts/observations.
9. reconnect reads the locked state from server.

## Failure behavior

If choice commit succeeds but HTTP response is lost:
- client can temporarily show an error and re-enable buttons;
- replay is rejected because `act1_choice_id` is already locked;
- periodic refresh reconstructs consequence stage and the genuine committed choice.

Thus choice multiplicity is safe.

Evidence-quality defect:
- the start of the actionable interval is not persisted when opening→action occurs;
- canonical ACT1 response latency cannot be reconstructed: IDA-006.

# F3 — Discussion final vote → Game Track progression

## Current path

1. DiscussionRoom reaches voting.
2. player client calls `s2_submit_vote`.
3. server writes vote and may atomically resolve `discussion_sessions.outcome`.
4. HTTP response returns `status='resolved'` to the final submitting browser.
5. **client JavaScript then performs a second RPC**:
   - ACT2 → `s3b_apply_meeting_resolution`;
   - ACT5 → `s3b_apply_act5_resolution`.
6. second RPC reads resolved server outcome and writes Game Track state / scene.
7. all clients observe new formal scene on polling.

## Broken failure window

If step 3 commits but execution stops before step 5:
- DiscussionRoom is authoritatively resolved;
- player votes/evidence are complete;
- Game Track remains at discussion;
- reconnect only restores this split state;
- no server/read-side repair automatically applies the resolved outcome.

This is IDA-001 HIGH.

Authority handoff itself is conceptually correct:
- player votes → DiscussionRoom authority;
- server-resolved outcome → Game Track result.

The defect is that the handoff is client-dependent and non-atomic/non-recovering.

# F4 — Route update

After ACT2 resolution apply:

1. server writes `final_meeting_result`.
2. wrapper sets formal runtime scene to `act2_route_update / route_update`.
3. all player polls receive route-update text.
4. each unacknowledged player gets one Continue button.
5. `s3b_ack_route_update` authenticates player and locks formal run.
6. server writes only that player's `route_update_ack_at`.
7. first and second ACK leave scene unchanged.
8. third ACK changes scene to `act2_rendezvous / route_consequence`.
9. reconnect reconstructs which players have already acknowledged.

Failure semantics:
- pre-commit failure → ACK remains absent; retry valid.
- post-commit/pre-response loss → retry rejects as duplicate, but polling reconstructs ACK/advanced scene.
- simultaneous ACKs serialize on `game_runs`.

No new finding.

# F5 — Library puzzle attempt / timeout

## Normal attempt

1. player poll retrieves server `puzzle_locked_prefix`.
2. UI renders locked prefix + only remaining editable digits.
3. form submits full code to `s3b_submit_library_code`.
4. public wrapper checks library_box/unresolved state and prefix.
5. delegated body refreshes timeout state and locks `s3b_run_state`.
6. server increments attempt ledger and resolves or advances hint state.
7. successful code creates group items and advances to ACT4.
8. reconnect state getter refreshes overdue timeout stages and restores authoritative puzzle state.

Known cross-layer failures:
- IDA-004: client-visible/server-stored prefix can become stale between wrapper validation and delegated refresh; one request can be recorded after the server newly locks a wheel.
- IDA-011: wrong-attempt post-commit response loss followed by retry produces another attempt/hint advance.

## Timeout-only path

State reads invoke `s3b_refresh_puzzle`.
The helper:
- locks run-state row;
- computes elapsed server time;
- fills missing stages monotonically;
- emits each newly crossed stage;
- at final stage server-resolves without inventing a player attempt;
- idempotently creates group items.

This path is reconnect-safe under normal concurrency.

# F6 — Later group-route resolution

## ACT4 direct route

1. each player submits one locked private ACT4 choice.
2. per-run trigger serializes updates.
3. third submission observes all three choices.
4. if all three are the same direct Known/Unknown choice:
   - server writes `group_route`;
   - server terminally advances the current Sprint3B placeholder scope.
5. otherwise server creates ACT5 DiscussionRoom and reveals the three locked stances.

Private choices remain separate from final group result.

## ACT5 discussion route

1. final votes resolve in DiscussionRoom.
2. client-dependent `s3b_apply_act5_resolution` applies server outcome.
3. Known/Unknown becomes group route.
4. Inspect First becomes an intermediate nonterminal Game Track state.

This inherits IDA-001 at the DiscussionRoom→Game Track handoff.

## Post-inspection Known/Unknown

1. all clients currently render Known/Unknown buttons.
2. any valid player can call `s3b_choose_post_inspection_route(p_route)`.
3. first successful request locks runtime scene and writes shared group route.
4. later requests reject.

Database exactly-once behavior is sound.

Canonical actor authority is unresolved: IDA-007 remains NOT_VERIFIED pending GA clarification.

# F7 — Reconnect

Client local state:
- room_code
- player_id
- display_name
- role_slot
- session_token

Authoritative gameplay state is server-side.

On reconnect:
1. local session is loaded.
2. `s1_get_player_state` validates token/legacy state.
3. `s2_get_player_state` reconstructs DiscussionRoom.
4. `s3b_get_player_state` reconstructs formal scene/player/run state and can refresh puzzle timeout.
5. rendering derives available action from returned server state.

Persisted recovery includes:
- locked private choices;
- DiscussionRoom transcript/votes/outcome;
- route ACK;
- player location/reunion;
- puzzle timing/prefix/attempts;
- ACT4 choice;
- ACT5 state;
- group/route terminal state;
- Pocket/shared-photo state through Sprint3A getter.

Known failures:
- IDA-001: reconnect does not self-heal a resolved DiscussionRoom whose Game Track apply RPC never happened.
- IDA-003: if Sprint1 read succeeds but formal Sprint3B read fails, UI can fail open to legacy controls.
- stale released token fails closed server-side; manual Switch Session / Teacher release-rejoin is recovery.

# F8 — Teacher observation / control

## Observation

Legacy:
- `s1_get_teacher_state` shows room/player connectivity and hides unrevealed legacy choice content.

DiscussionRoom:
- `s2_get_teacher_state` shows active run, discussion, transcript, vote submission markers and reveals vote choices only after resolution.

Pocket foundation:
- `s3_get_teacher_state` can return formal scene metadata and aggregate counts without private clue/knowledge content.

Current Teacher UI actually calls:
- Sprint1 teacher state;
- Sprint2 teacher state.

It does not yet integrate a full Sprint3B formal-scene dashboard. Expanded Teacher Console is a later sprint; this baseline is not failed for lacking Sprint7 scope.

## Control

Current Teacher UI exposes:
- legacy Advance Scene;
- legacy Reset Sprint1;
- player session release;
- start formal run;
- initialize Sprint3B;
- generic open DiscussionRoom;
- open vote;
- Add Time.

Authorization uses Teacher token.

Material cross-layer defect:
- generic Open Discussion is not bound to current Sprint3B scene, so authenticated Teacher control can create noncanonical formal discussion during private phases: IDA-005.
- once such a generic session exists, Sprint3B's direct canonical discussion creation path can create conflicting open state: IDA-002.

Privacy remains protected before reveal; no Teacher private-choice leak was found.

# Method 5 failure-question summary

| Journey | Server commit / response lost | Next RPC never sent | Stale response/request | Partial-layer failure |
|---|---|---|---|---|
| Room/join | join may require Teacher release recovery | N/A | old token fails after release | recoverable via release/rejoin |
| ACT1 choice | commit survives; replay rejects; poll recovers | N/A after choice | old-phase choice rejects | response-latency evidence still missing (IDA-006) |
| Discussion→Game | vote survives | **can stall Game Track (IDA-001)** | stale discussion action can retarget (IDA-009) | split resolved-discussion/unapplied-Game-Track |
| Route update | ACK survives; poll recovers | later players continue independently | old ACK rejects | server barrier persists |
| Puzzle | wrong attempt retry can duplicate (IDA-011) | timeout/reconnect can progress | prefix TOCTOU (IDA-004) | server time restores |
| Later route | group result survives | ACT5 apply can be omitted (IDA-001) | first post-inspection commit rejects later calls | actor authority IDA-007 |
| Reconnect | N/A | polling retries | released token fails closed | formal getter failure can expose legacy UI (IDA-003) |
| Teacher control | Teacher mutations persist | N/A | generic control can be semantically stale | IDA-005/002 |

# Method 5 conclusion

All eight mandatory cross-layer journeys have been traced.

No additional issue ID was required:
- existing IDA-001/002/003/004/005/006/007/009/011 already capture the observed boundary failures;
- IDA-008 is a related Pocket/scene authorization boundary established in Method 2/4.

Method 8 will later attempt high-value failure/race verification where tooling permits.
