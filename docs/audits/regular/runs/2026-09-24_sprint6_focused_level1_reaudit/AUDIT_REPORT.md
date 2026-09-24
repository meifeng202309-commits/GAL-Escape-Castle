# Sprint6 ACT 9–13 — Focused Level 1 Re-audit

Baseline: `dd63b55c78909b4970c02245e97f2de94a4edd52`  
Scope: closure of `S6-CA-001` through `S6-RC-002`, adjacent Golden Key identity correction, and directly adjacent regression risk  
Audit level: Level 1 — Focused re-audit  
Decision: **FAIL / BLOCKED — 2 FINDINGS CLOSED, 4 REMAIN PARTIALLY OPEN**

## 1. Closure matrix

| Finding | Re-audit status | Result |
|---|---|---|
| S6-CA-001 HIGH | **FIXED_VERIFIED** | Sprint6 now owns exact-session silent-texting DiscussionRooms for ACT9/10/11 with canonical timing and guarded message/close semantics. |
| S6-CA-002 HIGH | **PARTIALLY_FIXED / OPEN** | Step-specific Great Hall feedback is corrected and visible, but required Great Hall visual-state presentation and ACT10 Golden Key scene asset remain incomplete. |
| S6-CA-003 HIGH | **PARTIALLY_FIXED / OPEN** | Allocation discussion and role-specific station gates now exist, but branch-specific Main Gate presentation and Station B task semantics remain incomplete. |
| S6-CA-004 HIGH | **PARTIALLY_FIXED / OPEN** | Cinematic staging/assets/audio identities and real ACT13 browser advance now exist, but the ACT12 sequence is still canonically wrong and ACT13 presentation remains incomplete. |
| S6-RC-001 HIGH | **PARTIALLY_FIXED / OPEN** | Expected phase/step/round and old-RPC revocation are fixed, but browser request identities are not durable across lost responses and discussion close has no replay identity. |
| S6-RC-002 MEDIUM | **FIXED_VERIFIED** | Allocation attempts are preserved, conflicting private-choice request reuse is rejected, and Great Hall group resolution no longer falsely attributes the group result to the third submitter. |

Adjacent Golden Key **item label identity is FIXED_VERIFIED**: `item.golden_key` is now used instead of `act10.006`.

## 2. S6-CA-001 HIGH — FIXED_VERIFIED

Migration 035 adds a real Sprint6 DiscussionRoom boundary.

Verified:

- ACT9 initialization opens an exact-session silent-texting discussion for 180 seconds;
- 1:1:1 Great Hall no-consensus opens a fresh step-bound discussion without executing a door action;
- Great Hall soft failure opens a 60-second retry discussion;
- ACT10 reveal opens a 300-second discussion before final vote;
- ACT11 opens a branch-specific 90-second LEAVE / 45-second TAKE allocation discussion;
- messages bind to an explicit `discussion_session_id`;
- discussion close checks expected phase/step/round plus exact session identity;
- player state exposes the current Sprint6 discussion directly;
- Sprint6 browser rendering uses that Sprint6 discussion object and `s6_send_message_guarded`.

The old Sprint5 row still exists and the generic refresh path still performs a legacy Sprint5 discussion lookup, but at verified Sprint5 `phase_key='complete'` the Sprint5 discussion resolver returns no current discussion. The active Sprint6 discussion displayed to the player is the Sprint6-owned exact session. No current blocker was established from this redundant legacy read.

## 3. S6-CA-002 HIGH — PARTIALLY_FIXED / OPEN

### What is fixed

Migration 035 corrects the prior Great Hall semantic defects:

- wrong STEP1 → `act09.022` **RED OPENS FIRST.**;
- wrong STEP2 → `act09.023`, `act09.024`, `act09.006`;
- wrong STEP3 → `act09.007`;
- no-consensus → `act09.009`;
- success transitions use the correct canonical keys;
- group penalty provenance uses `actor_player_id=null` and `resolution_source='group_majority'`;
- `audio.snake_hiss_short` is requested through Asset Manager with governed unavailable fallback;
- `shared.great_hall` is requested through Asset Manager.

The client now renders `feedback_text_keys`, so authoritative feedback is no longer discarded.

### What remains open

#### A. Great Hall door-state visual contract is still missing

V4.0 requires:

- RED / BLUE / BLACK HTML overlays;
- stable Great Hall door anchors;
- RED activated/open visual state after STEP1;
- BLUE AVAILABLE transition after STEP2;
- Blue activated/open state during STEP4.

The corrected client only renders the base `shared.great_hall` image plus ordinary text. It contains no use of:

- `great_hall_red_door`;
- `great_hall_blue_door`;
- `great_hall_black_door`;

and no CSS/overlay door-state transition bound to those anchors.

This leaves the server state and the canonical visual console only partially connected.

#### B. ACT10 Golden Key scene asset is still absent

V4.0 ACT10 requires:

`show asset = prop.golden_key`.

Current `s6_get_player_state(...)` returns:

- ACT9 → `shared.great_hall`;
- ACT11/12 → `shared.main_gate`;
- ACT13 → `ending.castle_exterior`;

but returns no scene asset for ACT10.

The client asset allowlist likewise excludes `prop.golden_key`.

The Golden Key group-item **label** is fixed, but the actual canonical Golden Key scene presentation is still missing.

### Closure condition

Great Hall dynamic door presentation must be tied to the approved Great Hall asset/anchor contract, and ACT10 must request/render `prop.golden_key` or its governed typed fallback.

CA is not prescribing DOM/CSS implementation details.

## 4. S6-CA-003 HIGH — PARTIALLY_FIXED / OPEN

### What is fixed

The major omitted station authority is now present:

- ACT11 uses an exact timed allocation DiscussionRoom;
- branch-specific role allowlists remain authoritative;
- invalid allocations preserve attempts in `s6_allocation_attempts`;
- Station A requires `1897`;
- Station C requires GAL-C plus physical ownership of `linda_star_key`;
- WATCHER requires the corridor action;
- station task completion is persisted before ENGAGE;
- ENGAGE is rejected without the corresponding station task;
- failure still waits for all three required roles;
- WATCHER remains excluded from failure selection.

### What remains open

#### A. TAKE branch presentation omits the canonical bypass payoff

For `gold_key=true`, V4.0 requires:

> **The Golden Key releases the third lock.**

and then active roles A + B + WATCHER.

The corrected ACT11 transition always renders:

- TIME 23:58;
- Station A label;
- Station B label;
- Station C label.

It never renders `act11.011`, and the client contains no reference to that key.

Thus the TAKE branch correctly changes role authority but does not explain the Station C bypass to the players.

#### B. Station B task is still collapsed to a trust assertion

Canonical Station B requires:

- HOLD LEVER;
- indicator reaches center;
- then ENGAGE.

Current browser behavior is one button that directly submits:

`p_task_value='lever_center'`.

The server verifies only that literal value. There is no lever-hold/indicator state or transition demonstrating that the center was actually reached.

This is materially better than the prior direct-ENGAGE implementation, but the canonical station task is still reduced to a client assertion.

### Closure condition

TAKE branch must visibly present the Golden Key bypass before role work, and Station B must have an actual authoritative task transition between HOLD LEVER and ENGAGE rather than a one-click assertion of the terminal condition.

CA is not prescribing timing/animation mechanics.

## 5. S6-CA-004 HIGH — PARTIALLY_FIXED / OPEN

### What is fixed

The correction introduces:

- staged cinematic state;
- stage timestamps;
- Asset Manager audio identities;
- `ending.castle_exterior`;
- server-owned pending → final `cinematic_auto_resolution`;
- browser polling that advances cinematic state;
- a real ACT13 Continue action using guarded server transition;
- ACT14 boundary remains non-final:
  - `game_completed=false`;
  - `export_ready=false`.

These are substantial improvements.

### What remains open

The ACT12 canonical sequence is still not represented correctly.

#### A. Countdown 2 and 1 are merged

Current `s6_tick_cinematic(...)` stages are:

- stage 5 → 5;
- stage 6 → 4;
- stage 7 → 3;
- stage 8 → **2 and 1 together**.

V4.0 requires distinct sequential:

5 → 4 → 3 → 2 → 1.

#### B. There is no two-second fully blank blackout

The client enters `.blackout` when `cinematic_stage >= 8`, but the blackout stage still renders `feedback_text_keys`.

At stage 8 the screen therefore displays **2 and 1** in white on black for two seconds.

Canonical requirement is:

- after 1, all text disappears;
- complete black screen for 2 seconds;
- then the payoff begins.

No text-free two-second state exists.

#### C. ESCAPE SUCCESSFUL appears before gate-opening audio

At stage 9, current server state already displays `act12.027` (**ESCAPE SUCCESSFUL**) and requests `audio.mechanism_clang`.

Only at stage 10 does it request `audio.gate_opening`.

Canonical order is:

- mechanism clang;
- gate opening;
- then **ESCAPE SUCCESSFUL**.

Current ordering reverses the success title and gate-opening cue.

#### D. approaching audio cannot be stopped as required

The client creates anonymous one-shot `new Audio(...).play()` objects and stores no playback handle.

Therefore it has no mechanism to perform the canonical:

> all approaching audio suddenly stops

at the end of the countdown/blackout.

The client also requests `audio.wet_scraping` in both cinematic stage 1 and stage 2, so the same cue can be started twice because playback identity includes cinematic stage.

#### E. ACT13 presentation is incomplete

V4.0 ACT13 requires:

- TIME — 00:00;
- SIGNAL RESTORED;
- a 2–3 second pause before ACT14.

Current localization/rendering contains TIME — 00:00 but no `SIGNAL RESTORED` runtime key or display.

The ACT13 Continue button is available immediately; no 2–3 second boundary pause is enforced.

### Closure condition

ACT12 must preserve the exact ordered countdown/blackout/payoff sequence and controllable audio lifecycle, and ACT13 must include the complete signal-restored presentation plus the required pause before exposing the ACT14 boundary action.

Formal production audio playback remains **NOT VERIFIED** while those assets have no ACTIVE approved versions.

## 6. S6-RC-001 HIGH — PARTIALLY_FIXED / OPEN

### What is fixed

Migration 035 substantially improves server authority:

- state-changing guarded RPCs carry expected phase/step/round;
- discussion transitions additionally bind exact session identity;
- old unguarded Sprint6 write RPCs are revoked from `anon` / `authenticated`;
- action receipts distinguish same-request replay from conflicting content for:
  - group choice;
  - private choice;
  - advance;
  - allocation;
  - station task;
  - ENGAGE;
  - message send;
- stale STEP1 → STEP3 retargeting is rejected by server identity checks.

The original stale-action authority defect is therefore materially corrected.

### What remains open

#### A. Browser does not preserve request identity across uncertain response

The project already has a `requestIdentity(...)` / sessionStorage mechanism used by earlier runtime paths.

Sprint6 does not use it.

`runSprint6Action(...)` creates a fresh:

`crypto.randomUUID()`

for every click.

`sendSprint6Message(...)` also creates a fresh UUID for every submit.

Failure sequence:

1. guarded request commits;
2. network response is lost;
3. browser reports an error and re-enables/retries the action;
4. retry creates a different request ID;
5. server cannot classify it as the committed request's idempotent replay.

Depending on the action, the user receives a locked/stale/unique error instead of a replay response.

The durable server receipt exists, but the browser does not carry the identity needed to use it after an uncertain response.

#### B. discussion close has no request identity at all

`s6_close_discussion_guarded(...)` has no `client_request_id` and no action receipt.

If discussion close commits but the response is lost, retry is seen only as a stale phase/session action after the state already advanced.

This fails the prior closure condition that committed identical retries remain distinguishable from stale new actions.

#### C. concurrent identical requests are not rechecked after serialization

Several guarded functions read `s6_action_receipts` before locking `s6_run_state`.

Two simultaneous copies of the same request can both observe no prior receipt before one waits on the state lock.

After the first commits, the second does not re-read the receipt and can fail on state/unique constraints rather than return idempotent replay.

This is an adjacent retry-availability defect; consistency is generally preserved, but the intended replay contract is incomplete.

### Closure condition

Browser actions must preserve a stable request identity across uncertain-response retry, discussion close must have equivalent replay identity semantics, and serialized duplicate requests must recognize an already-committed identical receipt rather than falling through as a new/stale mutation.

CA is not prescribing the receipt schema or client-storage mechanism.

## 7. S6-RC-002 MEDIUM — FIXED_VERIFIED

Verified:

- every submitted allocation is appended to `s6_allocation_attempts` before current allocation state can be cleared;
- one player cannot overwrite the same allocation round silently;
- invalid rework can clear current `s6_allocations` without erasing the attempt ledger;
- private-choice same-request reuse with different content is explicitly rejected;
- Great Hall group-majority penalty events use null actor provenance and identify group resolution.

The current implementation uses event type `allocation_rework` for allocation rework instead of the older `escape_penalty_event` wrapper form. That naming should remain consistent with the eventual export schema, but no evidence-loss blocker remains under S6-RC-002 itself.

## 8. Golden Key adjacent identity

**FIXED_VERIFIED** for item identity.

Migration 035 changes:

- `s3_item_catalog.name_text_key`;
- existing Golden Key group-item labels;

to:

`item.golden_key`.

The localization catalog now contains a dedicated bilingual Golden Key label.

This prevents the prior “TAKE” action label from being rendered as the item name.

The still-missing `prop.golden_key` scene image is treated under S6-CA-002, not as an item-identity failure.

## 9. Test/evidence review

CD reports:

- TAKE production live E2E PASS;
- LEAVE production live E2E PASS;
- stale Great Hall rejection PASS;
- conflicting private-choice replay rejection PASS;
- station task gates PASS;
- all-role ENGAGE gate PASS;
- WATCHER exclusion PASS;
- eventual cinematic completion PASS;
- browser ACT9 DiscussionRoom smoke PASS;
- browser ACT13 boundary PASS;
- static suites PASS.

These results support the closures above.

They do not currently prove:

- Great Hall anchor/door-state overlays;
- ACT10 `prop.golden_key` presentation;
- TAKE-branch `act11.011` bypass text;
- a real Station B hold/indicator transition;
- distinct 2 → 1 countdown stages;
- a text-free two-second blackout;
- gate-opening before ESCAPE SUCCESSFUL;
- stoppable approaching audio;
- SIGNAL RESTORED;
- 2–3 second ACT13 pause;
- browser lost-response retry with stable request identity;
- idempotent discussion-close replay;
- concurrent same-request replay after lock serialization.

The live E2E only waits until eventual ACT13 state and therefore does not falsify the incorrect internal cinematic ordering.

## 10. Mandatory recurring-error pattern scan

| Pattern | Result | Focused result |
|---|---|---|
| A — local correctness / cross-module handoff | **FINDING** | server state improvements are not fully reflected in Great Hall/Golden Key/Main Gate presentation and cinematic order. |
| B — happy path / distributed boundary | **FINDING** | guarded server receipts exist, but browser retry identity is not durable and close-discussion replay is absent. |
| C — UI rule vs server rule | **FINDING** | Station B client asserts terminal `lever_center` without an authoritative intermediate task state. |
| D — current state vs historical evidence | PASS | allocation rework history is now preserved in a durable attempt ledger. |
| E — authority accretion / legacy reachability | PASS | unsafe legacy Sprint6 write RPCs are revoked from student roles; Sprint6 owns its discussion sessions. |
| F — self-confirming tests | **FINDING** | E2E proves eventual endpoint state, but not exact cinematic sequence, asset-state overlays, browser lost-response recovery or audio stop semantics. |

## 11. Gate disposition

**Sprint6 remains BLOCKED.**

Closed:

- `S6-CA-001 HIGH → FIXED_VERIFIED`;
- `S6-RC-002 MEDIUM → FIXED_VERIFIED`;
- Golden Key item-label identity → **FIXED_VERIFIED**.

Still open:

- `S6-CA-002 HIGH → PARTIALLY_FIXED / OPEN`;
- `S6-CA-003 HIGH → PARTIALLY_FIXED / OPEN`;
- `S6-CA-004 HIGH → PARTIALLY_FIXED / OPEN`;
- `S6-RC-001 HIGH → PARTIALLY_FIXED / OPEN`.

No Sprint7 implementation is authorized.

Migrations `033–035` are deployed history and must remain immutable. Any DB correction begins at **036+**.

Next owner: **CD**.

CD should correct only the four remaining Sprint6 closure gaps plus directly adjacent regression coverage, preserve verified Sprint1–5 behavior and deployed migrations 001–035, run relevant static/live/browser regressions, and submit another focused Level 1 re-audit request.
