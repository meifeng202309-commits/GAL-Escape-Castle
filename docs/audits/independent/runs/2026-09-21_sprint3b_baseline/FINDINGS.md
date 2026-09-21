# Independent Audit Findings

Baseline: 3be0e6ad8395f05bbab13ca41e6b91dac57eb4fe
Audit run: 2026-09-21_sprint3b_baseline
Status: INITIAL FINDINGS — audit continuing

## Summary

Current confirmed initial findings:

| Issue ID | Severity | Status | Short description | Method |
|---|---|---|---|---|
| IDA-001 | HIGH | CONFIRMED | Vote resolution and game-track progression are split across two transactions and depend on the final voter's browser | Reverse / Cross-layer |
| IDA-002 | MEDIUM | CONFIRMED | Sprint 3B can create a second open DiscussionRoom while a generic Teacher DiscussionRoom is already open | Authority / DB invariant |
| IDA-003 | MEDIUM | CONFIRMED | Player UI fails open to legacy Sprint 1 interaction when Sprint 3B state retrieval fails after Sprint 1 state rendered | Cross-layer / failure |

No CRITICAL finding has been established in this initial pass.

---

## IDA-001 — Non-atomic DiscussionRoom → Sprint 3B progression

Severity: HIGH
Status: CONFIRMED by static control-flow proof; live failure-injection reproduction pending
Suggested owner: CD

### Problem

Resolving the final group vote and applying the result to the Sprint 3B Game Track are separate RPC transactions.

The second transaction is initiated only by the browser that receives result.status = resolved from s2_submit_vote.

### Evidence

Player client:
- src/game/app.js
- submitVote()
- baseline lines 309–323

Sequence:
1. line 312 calls s2_submit_vote;
2. lines 317–320 only after the response says resolved, the browser calls s3b_get_player_state and then one of the s3b_apply_* RPCs.

Server:
- database/004_sprint2_fallback_resolution_semantics.sql
- public.s2_submit_vote(...)
- resolves discussion_sessions and returns resolved, but does not atomically apply Sprint 3B Game Track progression.

Sprint 3B apply wrappers:
- database/011_sprint3b_transition_and_act1_delivery_integrity.sql
- public.s3b_apply_meeting_resolution(...)
- public.s3b_apply_act5_resolution(...)

### Deterministic failure window

A reachable sequence is:

1. third/final player sends s2_submit_vote;
2. database commits the vote and marks DiscussionRoom resolved;
3. HTTP response is lost, browser closes, network fails, or JS execution stops before the follow-up s3b_apply_* call;
4. all real votes remain correctly locked and the discussion is resolved;
5. Sprint 3B scene remains in act2_first_contact/meeting_discussion or act5_route_discussion/discussion;
6. reconnect/polling reads the resolved discussion, but current refresh code does not automatically reconcile the missing Game Track transition;
7. retrying the original vote is rejected because the vote is already locked.

Result:
the system can enter a durable “behavior resolution committed / game progression not applied” split state.

### Existing test blind spot

tests/sprint3b-live-e2e.js:
- vote() submits all three votes;
- resolveMeeting() explicitly calls s3b_apply_meeting_resolution;
- ACT 5 tests explicitly call s3b_apply_act5_resolution.

The tests prove that the second RPC works when deliberately called; they do not prove recovery if the client fails between the two transactions.

### Risk

- classroom run can stall after a valid vote;
- reconnect does not guarantee self-healing;
- server authority is incomplete at the cross-module boundary;
- response-loss retry semantics are unsafe.

### Recommended fix direction

Preferred property:

> Once the DiscussionRoom result becomes authoritative, Game Track progression must be server-recoverable without depending on one specific browser successfully executing the next line of JavaScript.

Possible implementation patterns for CD to evaluate:
- server-side transactional resolver at the game-specific boundary;
- idempotent server reconciliation callable safely by any reconnect/poll path;
- durable pending-resolution record plus idempotent apply operation.

Do not solve this by merely retrying from the final voter's UI without idempotent server reconciliation.

### Closure test

Inject failure after s2_submit_vote commits but before any s3b_apply_* request is sent.

After reconnect, the run must deterministically reach the correct post-resolution Game Track state exactly once without creating or modifying fake player behavior.

---

## IDA-002 — Single-open-Discussion invariant can be bypassed

Severity: MEDIUM
Status: CONFIRMED by static control-flow proof; live reproduction pending
Suggested owner: CD

### Problem

s2_open_discussion enforces:

> reject if the active run already has an open discussion or vote.

But Sprint 3B creates ACT 2 and ACT 5 DiscussionRoom rows through direct INSERT statements that do not enforce the same global predicate.

### Evidence

Generic path:
- database/003_sprint2_discussionroom_audit_fix.sql
- public.s2_open_discussion(...)
- checks for any discussion_sessions row with status discussion/voting/waiting_for_missing_player.

Sprint 3B ACT 2 direct insert:
- database/007_sprint3b_act1_5_placeholder_flow.sql
- public.s3b_leave_start_room(...)
- lines 137–144
- only checks whether an act2_first_contact session already exists.

Sprint 3B ACT 5 direct insert:
- same file
- public.s3b_submit_act4_choice(...)
- lines 247–254
- directly inserts a new act5_route_discussion session.

Migration 011 wraps these functions with phase guards but delegates to the earlier implementations, so the direct-insert behavior remains effective at the baseline.

### Reachable sequence

1. Teacher starts a formal run and initializes Sprint 3B.
2. During ACT 1, Teacher uses the currently exposed generic DiscussionRoom control to open a generic discussion.
3. That generic discussion remains open.
4. Players complete ACT 1/2 prerequisites and the third leave-start-room call reaches the Sprint 3B ACT 2 discussion creation path.
5. Sprint 3B inserts a second open discussion with a later vote_round.

The database schema does not prevent two open discussion_sessions for the same run.

### Consequences

- one open session becomes a hidden/zombie session when player/Teacher state selects the latest vote_round;
- later generic s2_open_discussion calls can remain blocked by the older open session;
- data-forensics sees an interaction that never reached a normal terminal state;
- “latest discussion wins” becomes an accidental authority rule.

### Recommended fix direction

Centralize discussion-session creation or enforce a server/database invariant that all creation paths share.

At minimum, game-specific Sprint 3B creation must atomically check/close/reject conflicting open discussions using the same definition as s2_open_discussion.

### Closure test

Open a generic discussion first, then drive Sprint 3B to ACT 2 discussion creation.

The system must either:
- reject the incompatible transition with a recoverable explicit rule; or
- safely close/replace the generic session under a canonical policy;

but it must never persist two simultaneously open discussions for one run.

---

## IDA-003 — Formal player UI can fail open to legacy Sprint 1 controls

Severity: MEDIUM
Status: CONFIRMED by client control-flow proof; live UI reproduction pending
Suggested owner: CD

### Problem

Every player refresh renders Sprint 1 state first.

Only after a successful s3b_get_player_state response does renderSprint3b() hide the Sprint 1 choice/reveal UI.

If Sprint 1 state succeeds but Sprint 3B state fails, refreshSprint3b() hides the Sprint 3B panel but does not hide or disable the legacy Sprint 1 controls that were just rendered.

### Evidence

src/game/app.js:

refreshState(), lines 96–105:
1. s1_get_player_state;
2. renderState(state);
3. refreshDiscussion();
4. refreshSprint3b().

renderState(), lines 340 onward:
- renders legacy Sprint 1 scene and choice buttons.

renderSprint3b(), lines 149–152:
- hides choiceArea/revealArea only when valid active Sprint 3B state is received.

refreshSprint3b(), lines 111–118:
- on error, hides sprint3bPanel;
- it does not fail closed by hiding legacy interactive controls.

Server side:
s1_submit_private_choice remains browser-executable with legacy Sprint 1 semantics during a formal run, because legacy compatibility is intentionally retained.

### Reachable effect

If s1_get_player_state succeeds while s3b_get_player_state fails:
- student can be shown legacy Sprint 1 choices during the formal run;
- clicking them can create legacy s1_player_decisions / s1_game_events;
- those records are not the authoritative Sprint 3B behavior choice.

This does not currently prove corruption of the formal run dataset, but it creates a misleading interaction path and avoidable evidence noise.

### Canonical context

V2.3 explicitly preserves s1_reset_room / Sprint 1 regression semantics and says formal runtime must not use the legacy completion model.

Therefore the fix should not destroy Sprint 1 regression compatibility; it should separate or fail-close the formal runtime UI.

### Recommended fix direction

Once a formal run/Sprint 3B flow is active:
- legacy Sprint 1 interactive controls should never reappear merely because a later-layer fetch fails;
- show a recoverable error/reconnect state instead;
- optionally keep legacy prototype pages separate from formal runtime entry points.

### Closure test

Force only s3b_get_player_state to fail while s1_get_player_state succeeds during an active formal run.

Expected:
- no Sprint 1 choice buttons become actionable;
- no legacy behavior mutation is possible through the normal formal-run UI;
- a clear reconnect/error state is shown.

---

## NOT YET VERIFIED

The initial pass has not yet established:
- effective final PostgreSQL privileges from an independently rebuilt clean database;
- browser-level timing reproduction;
- lost-response failure injection;
- all concurrency gates;
- all RLS attack paths;
- full evidence reconstruction.

These remain scheduled in later audit methods.
