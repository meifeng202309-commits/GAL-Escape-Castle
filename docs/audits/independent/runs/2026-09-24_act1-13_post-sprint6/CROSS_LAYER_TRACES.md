# CROSS_LAYER_TRACES — ACT1–13 post-Sprint6

Baseline: `2acfe324d05c8bea2fb96d7132ba29f894270b38`

## F1. Room creation / join

Teacher room creation → Sprint1 room/player rows → join-code validation → player session token → localStorage reconnect → server player state.

The formal run is separate and starts only after three joined player sessions.

Result: PASS within current scope.

## F2. First behavior choice

ACT1 UI → `s3b_submit_act1_choice` → authenticated player → null-only lock in per-player progress → timestamp/evidence → reconnect state.

Choice cannot be overwritten by later route/game resolution.

Result: PASS.

## F3. Discussion resolution → Game Track

### ACT2 / ACT5

Canonical discussions use exact session/round identity. Group result is durably applied to Sprint3B Game Track. Prior dialogue/votes remain evidence.

Result: PASS after Sprint3B remediation.

### Sprint5

Sprint5 binds each phase/round to an exact `discussion_session_id` through `s5_rounds`; generic deadline behavior opens voting for the `require_final_vote=true` sessions and remains compatible with Sprint5 resolution.

Result: PASS.

### Sprint6

Expected flow:
Sprint6 discussion → deadline → exact close → phase transition.

Actual browser path:
`refreshState → s2_get_player_state → s2_refresh_discussion` runs first.

At deadline generic Sprint2 resolves `require_final_vote=false` discussion without advancing Sprint6 state.

Result: **FAIL — IDA-001**.

## F4. Route update / cross-ACT handoff

ACT2 and ACT5 route/fold-back state is server-owned and reconnectable.

ACT8 local route resolves to Great Hall and Sprint5 becomes `complete`.

However:
- ACT5 completion does not start ACT6;
- ACT8 completion does not start ACT9;
- both require separate Teacher-token initialize buttons.

Result: **FAIL — IDA-004**.

## F5. Puzzle / soft-failure

Library code:
- active phase/server state gate;
- request identity protects response-loss retry;
- attempt evidence append-only;
- correct resolution yields group items and next scene.

Clock / Great Hall:
- wrong action feedback/state is server-owned;
- tie/STAY non-penalty distinctions preserved;
- reset/retry state is represented explicitly.

Result: PASS except Sprint6 discussion deadlock can interrupt the recovery discussion after its timer (IDA-001).

## F6. Later group / role resolution

ACT10:
private choice → reveal discussion → final TAKE/LEAVE → atomic branch flags.

ACT11:
branch-specific roles → allocation attempt evidence → valid assignment.

ACT12:
station task → ENGAGE gate → active mechanism failure (never Watcher) → pressure choices → system cinematic resolution.

ACT13:
escape state + pause → ACT14 boundary; no game_completed/export_ready.

Result: PASS for the state transitions themselves.

## F7. Reconnect

Representative state reconnect:
- player identity from server session token;
- first choices/votes/items/knowledge/routes from server;
- Sprint5/Sprint6 current state from server;
- pending request identity survives same-tab/sessionStorage uncertainty.

Failures:
- Sprint6 timed discussion can reconnect into a split state after generic resolver consumed its row (IDA-001).
- completed one-shot audio identity is memory-only and can replay after reload/reconnect (IDA-002).

Result: **FAIL — IDA-001 / IDA-002**.

## F8. Teacher observation / control

Current pre-Sprint7 console supports:
- run start;
- generic discussion observation/control;
- bounded ACT1–5 override;
- Sprint5 initialize/discussion controls;
- Sprint6 initialize;
- Asset Manager review.

Teacher Override preserves provenance and NORMAL/AUDIT privacy gates.

Sprint7 Teacher Console expansion is explicitly future/excluded scope, so lack of full ACT9–13 aggregate observation is not classified as a current defect.

The manual Sprint5/Sprint6 initialization buttons are nevertheless required gameplay handoffs in the current baseline and therefore are a current cross-layer defect (IDA-004), not merely a missing Sprint7 dashboard feature.

## Method 5 disposition

Supported:
- IDA-001 HIGH
- IDA-002 MEDIUM
- IDA-004 HIGH

No additional cross-layer finding opened.
