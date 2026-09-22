# Independent Audit Findings

Baseline: 3be0e6ad8395f05bbab13ca41e6b91dac57eb4fe  
Audit run: 2026-09-21_sprint3b_baseline  
Protocol: Independent_Development_Snapshot_Audit_Protocol_v1.1.md  
Status: FINAL — CORE DEVELOPMENT BLOCKED PENDING REMEDIATION

# 1. Master Findings List

| Issue ID | Severity | Status | Problem description | Evidence / reproduction | Code file(s) | Symbol / function / line range | Baseline SHA | Violated invariant / risk | Recommended fix | Audit method | Owner | Fix commit | Re-test result |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| IDA-001 | HIGH | CONFIRMED | DiscussionRoom vote resolution and Sprint 3B Game Track progression are separate transactions; progression depends on the final voter's browser issuing a second RPC. | Commit final vote, then lose/stop client execution before s3b_apply_*; discussion is resolved while Sprint 3B scene remains at discussion. Static control-flow proof complete; live failure injection pending. | src/game/app.js; database/004_sprint2_fallback_resolution_semantics.sql; database/011_sprint3b_transition_and_act1_delivery_integrity.sql | app.js submitVote() lines 309–323; s2_submit_vote(...); s3b_apply_meeting_resolution(...); s3b_apply_act5_resolution(...) | 3be0e6ad8395f05bbab13ca41e6b91dac57eb4fe | Cross-module authority handoff is not server-atomic/recoverable; valid run may stall after committed behavior resolution. | Make authoritative resolved discussion server-recoverable/idempotently applicable without depending on one browser's next JS line. | Methods 1, 2, 3, 4, 5, 6, 8, 9 | CD | — | NOT YET RETESTED |
| IDA-002 | MEDIUM | CONFIRMED | Sprint 3B direct DiscussionRoom inserts can bypass the generic single-open-discussion guard and create more than one open session in one run. | Open generic Teacher discussion first, then reach Sprint 3B ACT 2/ACT 5 discussion creation path; generic guard is not reused by direct inserts. Live reproduction pending. | database/003_sprint2_discussionroom_audit_fix.sql; database/007_sprint3b_act1_5_placeholder_flow.sql | s2_open_discussion(...); s3b_leave_start_room(...) lines 129–147; s3b_submit_act4_choice(...) lines 233–256 | 3be0e6ad8395f05bbab13ca41e6b91dac57eb4fe | Active-discussion uniqueness is an RPC convention, not a shared DB/server invariant; zombie sessions and ambiguous authority possible. | Centralize discussion creation or enforce one shared server/database invariant across all creation paths. | Methods 1, 2, 4, 5, 7, 8 | CD | — | NOT YET RETESTED |
| IDA-003 | MEDIUM | CONFIRMED | Formal player UI can fail open to legacy Sprint 1 controls if Sprint 1 state loads but Sprint 3B state retrieval fails. | During formal run, allow s1_get_player_state to succeed and make s3b_get_player_state fail; renderState() has already rendered legacy controls and refreshSprint3b() only hides Sprint3B panel. | src/game/app.js; src/content/scenes.js; database/001_sprint1_core.sql | refreshState() lines 96–105; refreshSprint3b() lines 111–118; renderState() lines 340–374; s1_submit_private_choice(...) | 3be0e6ad8395f05bbab13ca41e6b91dac57eb4fe | Formal UI failure path can expose a non-authoritative legacy interaction and create misleading legacy evidence. | Once formal flow is active, fail closed to reconnect/error state; do not expose legacy interactive controls because a higher-layer fetch failed. | Methods 1, 2, 3, 4, 5, 6, 7, 8 | CD | — | NOT YET RETESTED |
| IDA-004 | MEDIUM | CONFIRMED | Library Box locked-prefix enforcement has a TOCTOU window: wrapper validates against a stale prefix before delegated timeout refresh can lock additional wheels. | Let puzzle deadline elapse while persisted prefix is still stale; submit code incompatible with the prefix that refresh should lock. Wrapper validates old prefix, delegated body refreshes prefix, then records attempt without revalidation. Static control-flow proof complete; live timing reproduction pending. | database/011_sprint3b_transition_and_act1_delivery_integrity.sql; database/007_sprint3b_act1_5_placeholder_flow.sql | s3b_submit_library_code(...) migration011 line 92; delegated pre011 body migration007 lines 212–230; s3b_refresh_puzzle(...) migration011 lines 98–100 | 3be0e6ad8395f05bbab13ca41e6b91dac57eb4fe | Locked Game Track state can advance between validation and write, allowing an attempt inconsistent with newly locked wheels and producing internally inconsistent puzzle evidence. | Refresh/lock authoritative puzzle state before prefix validation, then validate and record attempt under the same locked transaction. | Methods 1, 2, 4, 5, 6, 8 | CD | — | NOT YET RETESTED |
| IDA-005 | HIGH | CONFIRMED | Teacher can open a generic DiscussionRoom during canonical private Sprint3B phases because s2_open_discussion is not bound to s3_runtime_scene_state. | During an active NORMAL Sprint3B run, invoke Teacher “Open discussion” while ACT1/private_first_action is active. s2_open_discussion accepts active run + teacher auth and creates a real discussion; player polling renders it. V4.0 §38 requires DiscussionRoom locked in private phase. | teacher.html; src/teacher/teacher-console.js; database/003_sprint2_discussionroom_audit_fix.sql; src/game/app.js | Teacher openDiscussion(); s2_open_discussion(...); app.js refreshDiscussion()/renderDiscussion() | 3be0e6ad8395f05bbab13ca41e6b91dac57eb4fe | Breaks independent/private measurement conditions and can persist noncanonical messages/votes in a NORMAL behavior-eligible run; also enables IDA-002 multi-open-session state later. | Bind generic DiscussionRoom opening to explicit allowed scene config / AUDIT-only test mode, or remove/disable generic Teacher control during formal canonical gameplay. | Methods 1, 2, 3, 4, 5, 6, 7, 8 | CD | — | NOT YET RETESTED |
| IDA-006 | HIGH | CONFIRMED | Canonical response-latency evidence for implemented private behavior choices is not durably reconstructable: ACT1 lacks a per-player actionable-start timestamp; ACT2 first-meeting likewise stores only submission time, and ACT4 has no durable choice-start timestamp despite canonical latency semantics. | ACT1 opening→action is per-player via s3b_ack_act1_opening but persists no start time; ACT2 first-meeting stores first_meeting_locked_at only; ACT4 stores act4_locked_at only. Later scene transitions overwrite s3_runtime_scene_state.updated_at, so post-game latency cannot be reconstructed reliably. | database/011_sprint3b_transition_and_act1_delivery_integrity.sql; database/007_sprint3b_act1_5_placeholder_flow.sql; docs/specs/current/古堡逃脱游戏脚本 V4.0.md | s3b_ack_act1_opening / s3b_submit_act1_choice migration011 lines 37–57; s3b_player_progress + s3b_submit_first_meeting / s3b_submit_act4_choice migration007 lines 20–32, 102–112, 233–256; V4 §9 behavior evidence, §10.9 and §5.5 | 3be0e6ad8395f05bbab13ca41e6b91dac57eb4fe | Silent loss of response-latency evidence used by post-game behavior analysis; later export cannot recover a valid duration from submission timestamps alone. | Persist server-owned decision/action-start timestamps (or explicit latency) for each canonical latency-bearing interaction and preserve them through reconnect/export. | Methods 1, 3, 5, 6, 9 | CD | — | NOT YET RETESTED |
| IDA-007 | MEDIUM | CONFIRMED | ACT5 post-inspection route is canonically a three-player Game-only Step Vote, but current implementation lets the first valid player request directly commit the shared group_route. | GA clarification and V4.0 §14.4 now require all three GAL players to submit one locked known/unknown vote and the server to resolve only after all three real votes exist; current s3b_choose_post_inspection_route(...) writes group_route from one caller's p_route on the first successful request. Canonical clarification commit: 12d20f65ec02a8c60b777c66760bdccb7f31f945. | src/game/app.js; database/010_sprint3b_flow_integrity_and_inspect_fix.sql; database/011_sprint3b_transition_and_act1_delivery_integrity.sql; docs/specs/current/古堡逃脱游戏脚本 V4.0.md | app.js renderSprint3b() lines 149–177; migration010 s3b_choose_post_inspection_route(...) lines 136–150; migration011 wrapper line 95; V4 §14.4 lines ~3239–3261 | 3be0e6ad8395f05bbab13ca41e6b91dac57eb4fe | One player can unilaterally determine a shared route that canonically belongs to a three-player majority vote; first/second submissions can prematurely terminate the step and discard the other players' Game-only votes/provenance. | Conform to the canonical Game-only Step Vote contract: preserve one locked vote per real player, do not commit group_route from 1–2 votes, and derive the shared result only after all three votes are present; Teacher safe resolution remains separate from player votes. | Methods 2, 5, 8, 9 + GA canonical clarification 2026-09-22 | CD | — | NOT YET RETESTED |
| IDA-008 | HIGH | CONFIRMED | SHARE PHOTO lacks the canonical server-side scene permission: s3_share_photo can persist shared photos whenever the caller owns a shareable item view, even when allow_share_photo should be false or DiscussionRoom is locked. | In ACT2 private_first_meeting, after Gitte GRABs Map/Number Note but before the meeting discussion opens, call s3_share_photo directly. Function checks ownership/current view/recipient only and inserts s3_shared_photos; database has no allow_share_photo state to enforce V4.0's scene flag. | database/006_sprint3a_provenance_view_integrity_fix.sql; database/005_sprint3a_scene_pocket_knowledge_foundation.sql; docs/specs/current/古堡逃脱游戏脚本 V4.0.md | s3_share_photo(...) migration006 lines 79–98; V4 SHARE PHOTO rule lines ~2073–2092; V4 Multiplayer Execution Rules lines ~5856–5869 | 3be0e6ad8395f05bbab13ca41e6b91dac57eb4fe | Players can share private information outside canonically allowed discussion scenes, altering information-sharing timing/provenance and contaminating behavior evidence in NORMAL runs. | Persist scene-level allow_share_photo (or equivalent server-derived permission) and reject SHARE PHOTO unless current authoritative scene permits it; UI gating alone is insufficient. | Methods 2, 3, 4, 5, 6, 8, 9 | CD | — | NOT YET RETESTED |
| IDA-009 | HIGH | CONFIRMED | DiscussionRoom player mutations do not carry expected discussion identity; stale message/vote requests are applied to the server's newest discussion/round instead of being rejected. | Keep an old DiscussionRoom request in flight, create a higher vote_round, then deliver the old request. s2_send_message/s2_submit_vote select latest discussion by vote_round. In a re-vote with same options, a stale old-round vote can lock as the new-round vote. | database/002_runtime_runs_discussion.sql; database/004_sprint2_fallback_resolution_semantics.sql; src/game/app.js | s2_send_message(...) lines 546–604; final s2_submit_vote(...) migration004 lines 6–60; app.js sendMessage()/submitVote() lines 290–327 | 3be0e6ad8395f05bbab13ca41e6b91dac57eb4fe | Real player behavior can be attributed to the wrong discussion_session_id/vote_round/scene, violating stale-phase rejection and evidence identity. | Include expected discussion_session_id/vote_round (or opaque interaction identity) in mutating requests and reject if it is not the current authoritative interaction. | Methods 2, 3, 4, 5, 6, 8, 9 | CD | — | NOT YET RETESTED |
| IDA-010 | HIGH | CONFIRMED | Dialogue message submission has no idempotency identity; if server commit succeeds but response is lost, retry creates a second apparently genuine player message/event. | Let s2_send_message insert/commit, drop the response, then retry identical UI submission. dialogue_messages has only generated message_id and no request key; client clears text only after success, so retry inserts again. | database/002_runtime_runs_discussion.sql; src/game/app.js | dialogue_messages schema lines 55–68; s2_send_message(...) lines 546–604; app.js sendMessage() lines 290–306 | 3be0e6ad8395f05bbab13ca41e6b91dac57eb4fe | One real behavior can become two persisted messages, corrupting message count, initiative, timing and information-sharing evidence. | Add client-generated submission/request identity with per-run/session/player uniqueness; retry must return the original committed result rather than insert again. | Methods 2, 4, 6, 8, 9 | CD | — | NOT YET RETESTED |
| IDA-011 | MEDIUM | CONFIRMED | Wrong Library puzzle attempts are not idempotent; response-loss retry records the same real attempt again and may advance hint stage. | Submit an incorrect code, allow transaction to commit, drop response, then retry before scene changes. Each call increments puzzle_attempt_number and inserts a new (run_id, attempt_number) row. | database/007_sprint3b_act1_5_placeholder_flow.sql; database/011_sprint3b_transition_and_act1_delivery_integrity.sql; src/game/app.js | s3b_library_attempts schema lines 35–43; delegated s3b_submit_library_code(...) lines 212–230; final wrapper migration011 line 92; app.js submitLibraryCode() lines 188–192 | 3be0e6ad8395f05bbab13ca41e6b91dac57eb4fe | Game Track attempt history can overcount a real action and reveal hints prematurely. | Add per-submission idempotency identity or server retry token so an uncertain retry returns/reuses the prior attempt instead of incrementing. | Methods 2, 4, 5, 6, 8, 9 | CD | — | NOT YET RETESTED |
| IDA-012 | HIGH | CONFIRMED | Sprint3B formal gameplay lacks an append-only event trace for many player actions and scene/Game Track transitions; mutable current-state rows overwrite chronology, so the complete run cannot be reconstructed after progression. | s3b_set_scene only upserts s3_runtime_scene_state; ACT1 completion, GRAB/leave, FOLLOW SIGN, meeting apply, route-update transition, ACT4 direct resolution and ACT5 apply generally mutate current state without a corresponding runtime_events row. V2.3 requires gameplay state to be event-log traceable and AUDIT to record player actions, route and scene transition. | database/007_sprint3b_act1_5_placeholder_flow.sql; database/011_sprint3b_transition_and_act1_delivery_integrity.sql; database/012_sprint3b_internal_wrapper_lockdown_and_route_delivery.sql; docs/specs/current/Codex程序开发说明书 V2.3.md | s3b_set_scene migration007 lines 61–69; ACT1/meeting/route/follow/apply wrappers migration011 lines 60–100; route ACK migration012 lines 21–73; V2.3 §5.1/§5.2 lines ~575–580 and ~647–670 | 3be0e6ad8395f05bbab13ca41e6b91dac57eb4fe | Later current-state values prove where the run ended but not the full timestamped actor/transition sequence; Teacher debug and future session export must guess or infer context, and cross-layer gaps such as IDA-001 cannot be forensically timed after later progression. | Add append-only formal events for every material player/Game Track action and scene transition with run_id, scene/phase/step, actor/source, timestamp, payload and validity; state tables remain current-state authority but not historical ledger. | Methods 4, 5, 8, 9 | CD | — | NOT YET RETESTED |
# 2. Detailed Findings

## IDA-001 — Non-atomic DiscussionRoom → Sprint 3B progression

Severity: HIGH  
Status: CONFIRMED by static control-flow proof; live failure-injection reproduction pending.

### Problem

Resolving the final group vote and applying the result to the Sprint 3B Game Track are separate RPC transactions. The second transaction is initiated only by the browser that receives `result.status === "resolved"`.

### Risk

A successful final vote may be permanently committed while the Game Track remains in the previous discussion phase if the response or browser execution is lost before the follow-up apply RPC.

### Closure condition

Inject failure after `s2_submit_vote` commits but before any `s3b_apply_*` request. On reconnect, the server must deterministically reach the correct post-resolution Game Track state exactly once without fabricating player behavior.

---

## IDA-002 — Single-open-Discussion invariant can be bypassed

Severity: MEDIUM  
Status: CONFIRMED by static control-flow proof; live reproduction pending.

### Problem

`s2_open_discussion` checks for any existing open discussion, but Sprint 3B ACT 2 and ACT 5 creation paths directly insert into `discussion_sessions` without enforcing the same global invariant.

### Risk

Two open discussion sessions may coexist; reads use the latest round while the older one becomes a hidden/zombie open session.

### Closure condition

Attempt generic-open-discussion + Sprint3B discussion creation. The server must never persist two simultaneously open sessions for the same run.

---

## IDA-003 — Formal player UI can fail open to legacy Sprint 1 controls

Severity: MEDIUM  
Status: CONFIRMED by client control-flow proof; live UI reproduction pending.

### Problem

The player refresh renders Sprint 1 first, then fetches Sprint 3B. If the Sprint 3B fetch fails, the error path hides only the Sprint 3B panel and leaves the just-rendered legacy interaction available.

### Risk

Students can see/call non-authoritative Sprint 1 interactions during a formal run, creating misleading legacy state/events and user confusion.

### Closure condition

Force `s3b_get_player_state` failure while Sprint 1 state remains healthy during a formal run. No legacy interactive controls may become actionable; the UI must fail closed to an explicit recover/reconnect state.

# 3. Closed / Retested Findings

None yet.


## IDA-004 — Library Box locked-prefix TOCTOU

Severity: MEDIUM  
Status: CONFIRMED by static control-flow proof; live timing reproduction pending.

### Problem

The public Library Box submission wrapper validates `p_code` against a snapshot of `puzzle_locked_prefix` before the delegated implementation invokes timeout refresh.

If the timeout becomes due (or is already due but unrefreshed), `s3b_refresh_puzzle` can advance the authoritative prefix after that validation. The delegated submission body does not validate the same code again.

### Evidence sequence

1. `puzzle_locked_prefix` is still empty or shorter than the timeout-derived authoritative prefix.
2. Deadline is elapsed.
3. Player request enters final `s3b_submit_library_code` wrapper.
4. Wrapper reads stale prefix and accepts the submitted code.
5. Delegated pre011 implementation calls final `s3b_refresh_puzzle`.
6. Refresh locks the row and advances the prefix.
7. Submission continues and records the attempt without checking the new prefix.

### Existing test gap

The current B8/B8a live test explicitly expires/refreshes the puzzle first, reads prefix `4`, then submits `51111` and verifies rejection. It does not exercise a request in which refresh occurs between prefix check and attempt recording.

### Risk

The server can persist an attempt that changes a wheel which became server-locked earlier in the same request. This is a Game Track integrity and evidence-consistency defect, though it does not by itself let an incorrect code resolve the canonical puzzle.

### Recommended fix

Acquire/refresh the authoritative puzzle row first, then perform locked-prefix validation and attempt insertion under the same serialization boundary. Avoid validating against an unlocked pre-refresh snapshot.

### Closure condition

Create a test where the deadline is elapsed but the stored prefix has not yet been refreshed; submit a code incompatible with the newly due prefix. The request must reject without inserting an attempt or mutating player evidence.


## IDA-005 — Generic DiscussionRoom can bypass canonical private-phase lock

Severity: HIGH  
Status: CONFIRMED by implementation/spec comparison; live browser reproduction pending.

### Problem

V4.0's multiplayer execution rule requires DiscussionRoom to be locked during private phases. The current Teacher generic DiscussionRoom path is not coupled to Sprint3B scene/phase.

`s2_open_discussion` authenticates the Teacher and active run, then checks only whether another discussion is already open. It does not check `s3_runtime_scene_state`.

The Teacher Console exposes the generic control while the formal run is active, and player polling renders any returned DiscussionRoom.

### Consequence

A Teacher can open a real, behavior-persisting generic discussion before ACT1 independent first choices are complete. Students can communicate before the intended private measurement, and messages/votes are attached to the behavior-eligible run.

It also creates the precondition for IDA-002 when a canonical ACT2/ACT5 discussion later opens by a separate creation path.

### Recommended fix

Formal canonical gameplay should use a server-side scene allowlist for discussion creation. Generic Sprint2 test controls should be unavailable in NORMAL canonical flow (or explicitly restricted to an isolated AUDIT/test context).

### Closure condition

During every canonical private phase, both UI and direct RPC attempts to open a generic discussion must be rejected without creating a session/event. Canonical scene-triggered discussions must continue to work.


## IDA-006 — Canonical response-latency evidence is not durably reconstructable

Severity: HIGH  
Status: CONFIRMED by schema/flow/spec comparison.

### Problem

The canonical behavior model treats response latency as an evidence feature. In the implemented ACT1–5 baseline, the private-choice tables persist **submission timestamps** but do not durably persist the corresponding **actionable-start timestamps** needed to compute response time later.

Confirmed examples:

- **ACT1**: `s3b_ack_act1_opening` moves each player independently from `opening` → `action`, but stores no timestamp. `s3b_submit_act1_choice` stores only `act1_locked_at`.
- **ACT2 first meeting**: V4.0 §10.9 explicitly requires `first meeting choice + response time`. The implementation stores `first_meeting_locked_at`, but no durable first-meeting actionable-start timestamp.
- **ACT4 private route choice**: the Sprint3C canonical safe-resolution contract explicitly treats ACT4 private choice `timestamp / latency` as behavior fields. The implementation stores `act4_locked_at`, but no durable choice-start timestamp.

### Why current scene timestamps are insufficient

`s3_runtime_scene_state.updated_at` is a single mutable current-scene timestamp:
- ACT1 is especially invalid because each player individually acknowledges the opening at a different time;
- later scene transitions overwrite the row, so even a global ACT2/ACT4 scene-start timestamp is not durably retained for post-game reconstruction;
- client polling/render timing is not a server-persisted behavioral start boundary.

Therefore a future Sprint8 export cannot reliably derive canonical latency from the persisted submission timestamps alone.

### Risk

This is silent loss of a core evidence feature used by post-game analysis. Once the run advances, the missing start boundary cannot be reconstructed without guessing.

### Recommended fix

Persist a server-owned start timestamp (or explicit latency) for every canonical latency-bearing interaction, for example:
- `act1_action_started_at`;
- `first_meeting_started_at`;
- `act4_choice_started_at`.

The exact schema may differ, but the start boundary must be server-authoritative, durable, reconnect-safe and exportable.

### Closure condition

Run three players through the relevant interactions with intentionally different exposure/acknowledgement times. Export/reconstruct each response latency solely from persisted server data and verify:
- no global/current-scene timestamp guess is required;
- reconnect does not change the computed latency;
- missing/override cases preserve explicit null + validity semantics rather than fabricated timing.


## IDA-007 — ACT5 post-inspection route uses non-canonical first-player authority

Severity: MEDIUM  
Status: CONFIRMED after GA canonical clarification on 2026-09-22.

### Post-audit canonical clarification

GA resolved the original ambiguity in:

`agent-comms/GA_to_CA_20260922T003700Z_post-inspection-route-authority-response.md`

and canonicalized V4.0 §14.4 in commit:

`12d20f65ec02a8c60b777c66760bdccb7f31f945`

Canonical meaning:

- `act5_inspect_first / post_inspection_route` is a **Game-only Step Vote**;
- `behavior_scoring = false`;
- all three GAL players may each submit exactly one locked `known | unknown` vote;
- one player's vote must not directly set `group_route`;
- the server waits for all three real votes;
- 3:0 or 2:1 majority resolves the shared route;
- with only 1–2 votes, no majority/group route is committed;
- the final group result has no single player decision owner;
- Teacher Override `safe_resolution = known` remains a separate Teacher/system resolution, not a fabricated player vote.

### Current implementation

The current baseline implementation still does:

1. any valid player calls `s3b_choose_post_inspection_route(..., p_route)`;
2. the function locks the scene;
3. the first successful request writes:
   `group_route = p_route`,
   `pending_post_inspection_route = false`,
   `terminal_state = SPRINT3B_COMPLETE`;
4. later requests are rejected because the route is already resolved.

Therefore the first valid player request effectively chooses the team's route.

### Why this is a defect

The implementation violates the clarified canonical authority model:

- first/second individual votes can prematurely become the team result;
- the other two players' votes are never collected;
- a 2:1 majority can be replaced by whichever player clicks first;
- `submitted_by` is attached to the shared route event even though canonical group resolution has no single player owner.

Because this is Game Track-only and `behavior_scoring=false`, CA classifies it as **MEDIUM**, not HIGH. It remains a deterministic, reachable gameplay-authority defect.

### Closure condition

Re-test must demonstrate:

- first player vote alone leaves `group_route` unresolved;
- second player vote alone still leaves `group_route` unresolved;
- each player's first valid vote is locked and cannot be changed;
- the third real vote triggers exactly one server-derived 3:0 or 2:1 result;
- stale/later submissions cannot alter the resolved route;
- the final group result is not attributed as a single player's decision;
- Teacher Override resolution remains separately attributable and does not fabricate missing player votes.


## IDA-008 — SHARE PHOTO is not server-gated by scene permission

Severity: HIGH  
Status: CONFIRMED by source/spec comparison; live RPC reproduction pending.

### Problem

V4.0 defines `allow_share_photo` as a scene/runtime permission and explicitly gates the sender-side action on it.

The final `s3_share_photo` implementation validates:
- authenticated sender;
- active run;
- physical ownership;
- current server view;
- shareable view;
- recipient in same room.

It never verifies that the current scene permits photo sharing. The database model contains no inspected `allow_share_photo` state to enforce the canonical rule.

### Reachable violation

During ACT2 private_first_meeting:
1. a player can complete first-meeting choice and GRAB;
2. progression-critical items now exist in Pocket;
3. DiscussionRoom has not yet opened and private-phase information separation still applies;
4. direct RPC `s3_share_photo` can persist a copy to another player.

The recipient can therefore receive private object information before the canonical sharing phase.

### Risk

This changes the timing and availability of information that later behavior analysis is supposed to attribute to active sharing during DiscussionRoom. In a NORMAL run, the persisted evidence can no longer be assumed to obey the scene's information-sharing conditions.

### Recommended fix

Make share permission server-authoritative. The RPC must derive the current scene/discussion configuration and reject unless sharing is allowed. Do not rely solely on whether the UI happens to show a SHARE PHOTO button.

### Closure condition

For every scene with `allow_share_photo=false` or private-phase DiscussionRoom lock, direct RPC attempts must fail without creating a shared-photo row or sharing event. Canonically allowed discussion scenes must continue to share the current server-authoritative view.


## IDA-009 — Stale DiscussionRoom request can be written into a newer interaction

Severity: HIGH  
Status: CONFIRMED by server request-routing proof; live delayed-request reproduction pending.

### Problem

DiscussionRoom message/vote mutations do not carry the interaction identity visible when the user acted. The server chooses the latest discussion at processing time.

This turns some stale requests into valid new-round actions rather than rejecting them.

### Highest-risk reproduction

Use a 1:1:1 vote to create a re-vote with the same options. Hold a vote request from the old round until the new round is voting, then deliver it. The server can treat that old intent as the player's vote in the new round.

### Closure condition

Every behavior mutation must address an expected interaction identity. A request created for an earlier discussion/round must be rejected after the server advances, even when the same choice ID remains valid.

---

## IDA-010 — Response-loss retry can duplicate dialogue behavior

Severity: HIGH  
Status: CONFIRMED by schema/client/server control-flow proof; network fault injection pending.

### Problem

There is no request idempotency key for messages. Server-generated `message_id` cannot tell whether two identical inserts are two real messages or one retry.

### Closure condition

Drop the response after a committed message, retry the same logical submission, and verify exactly one dialogue row/event exists and the retry receives the original committed result.

---

## IDA-011 — Response-loss retry can double-count wrong Library attempts

Severity: MEDIUM  
Status: CONFIRMED by control-flow proof; network fault injection pending.

### Problem

A wrong puzzle attempt leaves the same action screen active. If its successful server response is lost, retry is indistinguishable from a new attempt and advances attempt/hint counters again.

### Closure condition

Commit a wrong attempt while dropping its response, retry the same logical submission, and verify attempt_number, hint stage and attempt ledger advance exactly once.


## IDA-012 — Sprint3B formal history is not append-only reconstructable

Severity: HIGH  
Status: CONFIRMED by deterministic schema/control-flow comparison.

### Problem

V2.3 states that once a state enters gameplay it must be server-authoritative, reconnect-restorable **and event-log traceable**. It also requires AUDIT to fully record player actions, route, reconnect and scene transition using the same runtime event writer/schema as NORMAL.

Sprint3B persists authoritative current state, but many formal actions and transitions are not appended to `runtime_events`.

Examples:

- `s3b_set_scene` only UPSERTs the single `s3_runtime_scene_state` row. The previous scene/phase/step and its transition timestamp disappear from current state.
- ACT1 opening acknowledgement/completion mutate `s3b_player_progress` but have no append-only action event.
- GRAB / leave / FOLLOW SIGN are represented mainly by booleans or current location; no durable action timestamp/event is written.
- ACT2 DiscussionRoom resolution is evented inside DiscussionRoom, but the later `s3b_apply_meeting_resolution` Game Track apply/route-update transition has no dedicated event.
- route-update ACK has a per-player timestamp, but the resulting third-ACK scene transition has no transition event.
- ACT4 unanimous direct route and ACT5 Game Track apply update current run/scene state without a complete transition event.
- some exceptional paths **are** evented (`failed_rendezvous`, puzzle fallback hints, post-inspection group route), showing that the event infrastructure exists but coverage is incomplete.

### Why final state is insufficient

A final row can answer “what is true now,” but not reliably:
- when each prior scene started/ended;
- when a Game Track apply occurred after a resolved discussion;
- which player action triggered a transition where no per-action timestamp exists;
- how long the run remained in an intermediate state;
- whether a historical split-state window such as IDA-001 occurred once later state has overwritten it.

This prevents deterministic chronological reconstruction from persisted evidence alone.

### Risk

The gap is irreversible after the current-state row advances. Sprint8 export cannot manufacture historical timestamps/events later without guessing.

It weakens:
- post-game scene context;
- Teacher/debug forensics;
- AUDIT completeness;
- session-integrity verification;
- attribution of later behavior to the correct preceding Game Track context.

### Recommended fix

Keep current state tables as state authority, but append a formal event for every material:
- player Game Track action;
- group/system application;
- route/fold-back transition;
- scene/phase/step transition.

Minimum event semantics should support the future flat ledger contract:
- timestamp;
- event_type;
- run_id;
- scene_id;
- phase_key;
- step_key;
- actor/source;
- payload;
- validity / behavior_scoring where relevant.

Do not synthesize historical events retroactively for old runs.

### Closure condition

Execute a representative ACT1→ACT5 run, then reconstruct the full chronological sequence **using persisted data only**, after the run has already advanced to terminal:
- all material scene transitions have timestamps;
- actor/system attribution is explicit;
- route/fold-back/puzzle context can be ordered without using mutable final-row timestamps as proxies;
- NORMAL and AUDIT use the same event writer;
- reconnect does not change or duplicate the ledger.

