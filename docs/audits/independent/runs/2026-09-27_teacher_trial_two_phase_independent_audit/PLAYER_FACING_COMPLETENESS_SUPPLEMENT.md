# Supplemental Critical Review — Player-Facing Completeness

## Audit identity

- Owner: CA
- Active instruction: `agent-comms/GA_to_CA_20260927T184500Z_player-facing-completeness-critical-review.md`
- Existing audit framework only: Methods1–9
- Frozen product baseline reused: `93bd15ca36dd985685a0706bad9ec56ba4002a6e`
- Product-source delta check: no runtime/database/product source changed between the frozen baseline and current main; intervening changes are audit/governance/log material
- Remediation: HOLD
- Scope: reachable player-visible states ACT1–ACT14, acknowledgement, synchronization/waiting clarity, visible state coherence, media/audio fallback consequences, legacy confusion

This supplement does not create a new audit method and does not replace CA-135. It extends CA-135's interpretation with a narrower player-facing completeness question.

---

# 1. Dimensions already adequately covered by CA-135

## Startup and legacy root exposure

Already covered:
- IDA-001 — legacy Sprint1 root gameplay before formal start
- IDA-002 — legacy first-choice reveal
- IDA-003 — split formal startup
- IDA-004 — live Teacher active-run contradiction
- IDA-005 — legacy Teacher shadow controls
- IDA-006 — browser-orchestration coverage gap

No duplicate finding is opened for those same startup symptoms.

## Canonical formal privacy / server authority

CA-135 remains valid that:
- formal ACT1 role-specific choices exist;
- canonical player-to-player first-choice isolation exists;
- generic Sprint2 DiscussionRoom is server-blocked once canonical flow exists;
- later canonical mutation guards / run identity / Teacher Override provenance / finalization integrity protections remain source-level sound.

The current supplemental review does **not** reopen those backend integrity findings.

## DiscussionRoom waiting states

The generic/Sprint5 discussion renderer explicitly communicates:
- discussion phase and countdown;
- voting opens after discussion;
- own vote locked;
- submitted progress;
- `WAITING FOR MISSING PLAYER` plus received-vote count.

Those states are adequately player-facing at source level.

---

# 2. Newly identified player-facing findings

## PFC-001 — HIGH — ACT14 final reveal is unreachable through the normal root-client refresh path after successful finalization

### Deterministic trace

Player at `act13_boundary` receives the finalization button.

`finalizeSprint8()`:
1. calls `s8_finalize`;
2. server persists finalization and updates `game_runs.status='completed'`;
3. client immediately calls `refreshState()`.

But `refreshState()` does:

```text
s1_get_player_state
s2_get_player_state
if discussionState.active:
    ... s8_get_player_state ...
    if sprint8State.active: renderSprint8(...)
else:
    renderState(sprint1State)
```

`s2_get_player_state` derives activity only from `s2_get_active_run`, and `s2_get_active_run` selects only `game_runs.status='active'`.

Therefore, after successful finalization:
- `discussionState.active == false`;
- the branch containing `s8_get_player_state` is not entered;
- `renderSprint8` is not reached;
- the root player falls back to legacy Sprint1 state.

Meanwhile `s8_get_player_state` was explicitly designed to find the latest completed run when no active run exists, but the client orchestration prevents that RPC from being called.

### Impact

The formal database can finalize correctly while the player never sees the canonical ACT14 final reveal. The product can instead show a valid-looking legacy Sprint1 surface immediately after formal completion.

### Relation to CA-135

This is partly the same no-active-run fallback mechanism as IDA-001, but CA-135 scoped IDA-001 to **pre-run** exposure. The impact is distinct and release-significant: the same fallback also breaks the **post-run canonical ending**.

CA therefore records PFC-001 separately and recommends refining IDA-001's root-cause scope from "pre-run fallback" to "no-active-formal-run fallback used both before start and after completion."

---

## PFC-002 — MEDIUM — Multiple ACT2–ACT4 synchronization barriers become visibly non-actionable without explicit waiting guidance

The server correctly waits for peers, but the player renderer does not always explain that wait.

Confirmed states:

### ACT2 — after leaving the start room

After one player has:
- locked first-meeting choice;
- completed GRAB;
- completed LEAVE;

while fewer than three players are ready, `s3b_leave_start_room` leaves the global scene in the same ACT2 pre-discussion state.

For that player, `renderSprint3b` matches none of:
- first-meeting choice;
- GRAB;
- LEAVE;
- route/discussion/puzzle branches.

It produces `html=""`.

The page may still say `SIGNAL UNSTABLE`, but it does not say the player's action was accepted or that the player is waiting for the other participants.

### ACT2 — route-update acknowledgement barrier

`s3b_ack_route_update` is a three-player barrier.

After a player acknowledges:
- `route_update_ack_at` is set;
- scene remains `route_update` until all three acknowledge;
- the player's Continue button disappears;
- no waiting/progress message replaces it.

### ACT3 — FOLLOW SIGN reunion barrier

After one player follows the Library sign:
- that player's location becomes Library;
- scene remains `wayfinding` until all three reach Library;
- the FOLLOW SIGN button disappears for that player;
- no explicit waiting state is rendered.

### ACT4 — private-route choice barrier

After one player locks ACT4 private choice:
- scene remains ACT4 until all three submit;
- choice buttons disappear for that player;
- no lock acknowledgement or "waiting for others" message is rendered.

### Why this is a finding

These are legally reachable normal states in which the backend is intentionally waiting, but the player cannot distinguish "your action succeeded; wait for peers" from "the game stopped responding."

This is a player-facing completeness defect, not a state-integrity defect.

---

## PFC-003 — MEDIUM — ACT9–ACT12 successful player actions can remain visually selectable with no acknowledgement while peers are pending

The opposite failure pattern occurs in Sprint6: instead of controls disappearing into an unexplained blank state, successful controls can simply reappear.

Confirmed phases include:

- `act9_console` group choice;
- `act10_private`;
- `act10_final_vote`;
- `act11_allocation`;
- `act12_pressure`;
- post-task `ENGAGE` while fewer than three roles are engaged.

### Source-level reason

For ACT9/10/12 choice phases:
- successful submission stores the choice;
- global phase remains unchanged until all three submit;
- `s6_get_player_state` does not project a current-player lock acknowledgement for those current rounds;
- `renderSprint6` unconditionally recreates the choice buttons for the phase.

For ACT11 allocation:
- `s6_get_player_state` does project `allocation`;
- `renderSprint6` does not use it to replace the allocation buttons with a locked/waiting state.

For ACT12 ENGAGE:
- `engaged_roles` is projected;
- renderer still shows the ENGAGE button after that player has already engaged if the global phase has not advanced.

### Impact

A successful action can leave the page apparently unchanged after refresh.

The player may:
- believe the click failed;
- click again;
- receive a duplicate/locked/stale server error even though the first action succeeded;
- be unable to tell that the correct next action is simply to wait for teammates.

Server integrity guards prevent most duplicate corruption, so severity is MEDIUM rather than a backend HIGH.

---

## PFC-004 — LOW — Sprint6 stale status/error messages are not cleared on successful re-render

`renderSprint3b`, `renderSprint5`, and `renderSprint8` clear `sprint3bStatus`.

`renderSprint6` does not.

Therefore a prior:
- action error;
- stale/duplicate error;
- audio-blocked message;
- anchor-related status

can remain visible after later successful polling or state progression.

A concrete audio case:
- `playSprint6Audio` can display `runtime.audio.blocked`;
- a later pointer/volume action can successfully retry playback;
- successful playback does not clear that warning;
- normal Sprint6 re-render also does not clear it.

This can produce a visibly contradictory state: the game has progressed or audio has recovered while an old failure message remains.

This is classified LOW because it does not alter authority or progression, but it should be included in the player-facing remediation scope.

---

# 3. Player-facing risks that remain NOT VERIFIED

## NV-PF-01 — Anchor-dependent placeholder composition

Current placeholder-first logic proves fallback existence but not fallback usability for anchor-dependent scenes.

### ACT7 Clock Room

`renderSprint5` creates three absolutely positioned clock overlays.

`hydrateS5Assets`:
- calls `setS5Asset("s5SceneImage","shared.clock_room")`;
- if resolver returns no ACTIVE asset, `setS5Asset` applies the placeholder and returns `null`;
- `hydrateS5Assets` then returns before applying `clock_A_face / B / C` anchor positions.

Thus, in NO_ACTIVE placeholder mode, the clock overlays have no runtime anchor coordinates.

Whether the browser's default absolute-position/static-position behavior leaves all three clocks readable or causes overlap/unusable composition is **NOT VERIFIED** without rendered-browser evidence.

### ACT9 Great Hall

The same structural issue exists for door overlays:
- placeholder base can be shown;
- anchor placement is skipped when no ACTIVE scene asset is returned.

Separate action buttons still exist, so no source-level continuation blocker is asserted, but rendered comprehension is NOT VERIFIED.

## NV-PF-02 — Audio perceptual completeness

Source-level findings:
- blocked playback produces a localized retry message;
- missing/no-active audio is silently marked `stopped`;
- canonical text feedback continues;
- several cinematic audio-only stages auto-advance and require no player action.

Therefore CA does not open a new audio-progression defect.

However actual comprehension when audio is blocked/missing/delayed remains browser-runtime **NOT VERIFIED**.

PFC-004 separately covers the confirmed stale-warning problem.

## NV-PF-03 — First-time full browser completion

CA can source-prove the PFC findings above but still cannot establish that a first-time player will understand every remaining rendered transition under real timing, responsive layout, audio policy, and three asynchronous browsers.

This is an evidence limitation, not a new audit method request.

---

# 4. Refinement of CA-135 interpretation

CA-135 statement:

> no new ACT2–ACT14 integrity/finalization defect was confirmed

remains true in the narrow backend/data-integrity sense.

It must **not** be interpreted as:

> ACT2–ACT14 is player-facing complete or always understandable from the rendered UI.

The supplemental review demonstrates the distinction:

- backend state can be correct while a barrier looks stuck;
- server can lock a choice while the client keeps showing the choice controls;
- finalization can be database-correct while the final player reveal is client-unreachable.

### Refine IDA-001

IDA-001 root cause should be understood as:

> root player uses legacy Sprint1 whenever there is no active formal run

not only:

> legacy Sprint1 is exposed before formal start.

That broader mechanism explains both:
- pre-run legacy gameplay; and
- PFC-001 post-finalization fall-through.

### Refine IDA-006

The browser-orchestration test gap now has concrete later-act impact, not only startup impact:
- direct-RPC tests can verify `s8_finalize` and `s8_get_player_state` independently while missing that root client never calls the completed-run projection;
- direct-RPC Sprint6 tests can verify lock semantics while missing that the UI keeps rendering controls after successful locks.

---

# 5. Does CA consider the current remediation scope complete enough to proceed?

**No.**

The remediation discussion should include the additional player-facing items before implementation is released:

Required to include:
1. PFC-001 HIGH — completed formal run must reach canonical ACT14 player reveal instead of legacy fallback.
2. PFC-002 MEDIUM — intentional synchronization barriers must visibly acknowledge the player's completion and explain waiting.
3. PFC-003 MEDIUM — successful Sprint6 locked/submitted actions must not remain apparently unsubmitted/actionable while peers are pending.
4. PFC-004 LOW — stale Sprint6 status/error messages must not survive recovery/state progression as contradictory current status.

Evidence/acceptance follow-up:
5. NV-PF-01 — verify anchor-dependent placeholder readability, especially ACT7 Clock Room.
6. NV-PF-02 — later live/browser evidence for audio perception/retry behavior.

These are required outcome boundaries only. CA is not prescribing implementation mechanics.

---

# 6. Legacy/shadow review result

No new issue is opened merely because old V2 pages exist.

`02_player_v2.html` / `03_teacher_v2.html`:
- are externally URL-reachable;
- use a separate prototype `game_choices` surface;
- are not linked from the current root flow in the audited source.

A plausible normal current-user navigation path to those pages was not established.

Therefore they remain legacy inventory, not a new current-player finding.

By contrast, root Sprint1 fallback and Teacher shadow controls remain genuinely reachable and are already covered by IDA-001/002/005 plus the PFC-001 refinement.
