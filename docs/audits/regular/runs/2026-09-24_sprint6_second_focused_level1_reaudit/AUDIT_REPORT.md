# Sprint6 ACT 9–13 — Second Focused Level 1 Re-audit

Baseline: `309c26342be7d6933b62036bf0eba734ec6a9ee1`  
Implementation correction commit: `182a4afcdff7b8fe71203f8d9e4aab285a82e8cc`  
Scope: closure of `S6-CA-002`, `S6-CA-003`, `S6-CA-004`, `S6-RC-001`, plus directly adjacent regression risk  
Audit level: Level 1 — Focused re-audit  
Decision: **FAIL / BLOCKED — 1 FINDING CLOSED; 3 REMAIN PARTIALLY OPEN**

## 1. Closure matrix

| Finding | Re-audit status | Result |
|---|---|---|
| S6-CA-002 HIGH | **PARTIALLY_FIXED / OPEN** | Great Hall anchors/states and ACT10 Golden Key asset are now wired, but new Great Hall labels bypass the HARD localization contract. |
| S6-CA-003 HIGH | **PARTIALLY_FIXED / OPEN** | TAKE bypass and Station B persistent two-step state exist, but the Station B browser presentation gets ahead of authoritative state and exposes a mislabeled second action. |
| S6-CA-004 HIGH | **PARTIALLY_FIXED / OPEN** | Countdown/blackout/payoff ordering is materially improved, but canonical fade-to-black and audio runtime/accessibility requirements remain incomplete. |
| S6-RC-001 HIGH | **FIXED_VERIFIED** | Stable browser request identities, discussion-close receipts and same-request serialization now form a coherent replay boundary. |

No new state-integrity blocker was confirmed outside these three remaining canonical presentation/runtime gaps.

Migrations 033–036 are treated as deployed immutable history.

## 2. S6-CA-002 HIGH — PARTIALLY_FIXED / OPEN

### What is fixed

The prior Great Hall / Golden Key structural gaps are substantially corrected.

Verified:

- `shared.great_hall` is resolved through Asset Manager;
- Great Hall uses the approved:
  - `great_hall_red_door`;
  - `great_hall_blue_door`;
  - `great_hall_black_door`
  anchors;
- red open state follows `act9_step >= 2`;
- blue available state follows `act9_step >= 3`;
- blue open state follows `act9_step >= 4`;
- ACT10 now returns `scene_asset_key='prop.golden_key'`;
- the client allowlist now resolves `prop.golden_key` through Asset Manager;
- typed unavailable fallback remains non-mutating.

The original missing dynamic-door and Golden Key asset paths therefore exist.

### Remaining blocker — hardcoded English door labels

The new Great Hall overlay contains literal GAL-facing text:

- `RED`
- `BLUE`
- `BLACK`

inside `renderSprint6(...)`.

This bypasses Codex V2.3 §4.4 HARD Student Text / Localization Contract.

Canonical door labels already exist in the approved catalog:

- `act09.001` — RED DOOR;
- `act09.002` — BLUE DOOR;
- `act09.003` — BLACK DOOR;

with Nederlands + 中文 runtime text.

Color words are not language-independent elements under the contract. The allowed single-render language-independent examples are items such as player names, numbers, `★`, time and A/B/C.

The current overlay therefore reintroduces the same class of second text source previously rejected in Sprint5.

### Closure condition

All new Great Hall GAL-facing labels must derive from the canonical localization authority or use a genuinely language-independent visual treatment. The approved anchor/state logic should remain unchanged.

CA is not prescribing the markup structure.

## 3. S6-CA-003 HIGH — PARTIALLY_FIXED / OPEN

### What is fixed

The TAKE branch now visibly preserves the Golden Key bypass payoff through `act11.011`.

Migration 036 also introduces durable Station B intermediate state:

`s6_station_b_progress`

with:

- `lever_held`;
- `indicator_center`.

The server no longer accepts direct Station B completion without first recording `lever_held`.

This is a real improvement over the prior one-click terminal assertion.

### Remaining blocker A — UI gets ahead of authoritative Station B state

Current browser logic does this:

1. first Station B click submits `lever_hold`;
2. server persists:
   `station_b_stage='lever_held'`;
3. browser refresh sees `lever_held`;
4. browser immediately displays:
   `INDICATOR: CENTER`;
5. but server is still only in `lever_held`;
6. a second click is required to submit `lever_center`;
7. only then does server persist `indicator_center` and create the terminal station task.

Therefore the player-visible state says the indicator is at center **before** the authoritative state says it is at center.

That recreates a UI/server authority mismatch.

### Remaining blocker B — second action is mislabeled

After `lever_held`, the second button submits `lever_center`, but its visible label is still canonical `act12.002`:

**[HOLD LEVER]**

So the button's actual server meaning and player-visible meaning diverge.

Canonical ACT12 requires:

- HOLD LEVER;
- indicator reaches center;
- then ENGAGE.

The current browser effectively implements:

- HOLD LEVER;
- display “CENTER” before center is authoritative;
- click HOLD LEVER again to assert center;
- then ENGAGE.

### Remaining blocker C — new English-only status text

`INDICATOR: CENTER` is hardcoded English GAL-facing text and is not resolved from the canonical localization catalog.

This independently violates the same HARD localization contract.

### Closure condition

Station B must keep player-visible indicator state aligned with server-authoritative state. The UI must not claim “center” while the server only records `lever_held`, and an action that advances to `indicator_center` must not masquerade as another identical HOLD command.

Any player-visible textual status must obey the localization contract.

CA is not prescribing whether the center transition is timer-driven, state-driven or represented without text.

## 4. S6-CA-004 HIGH — PARTIALLY_FIXED / OPEN

### What is fixed

Migration 036 materially corrects the prior cinematic sequence.

Verified server sequence now includes:

- distinct countdown stages:
  - 5;
  - 4;
  - 3;
  - 2;
  - 1;
- a text-free stage 10;
- a two-second hold while current stage is 10;
- audio stop at stage 10 in the browser;
- mechanism clang after blackout;
- gate opening after clang;
- ESCAPE SUCCESSFUL only after those payoff audio stages;
- `SIGNAL RESTORED` in ACT13;
- a server-enforced three-second ACT13 continuation pause;
- matching client suppression of Continue until `act13_continue_at`.

The client also retains audio handles so active approaching audio can be stopped and rewound at blackout.

### Remaining blocker A — no canonical gradual fade to black

V4.0 §22.4 requires:

> screen gradually fade to black

before the wet-breath line and countdown.

Current CSS only applies `.blackout` when:

`cinematic_stage === 10`.

Stages containing:

- wet breath;
- 5;
- 4;
- 3;
- 2;
- 1

remain in the normal scene presentation.

There is no fading state/transition leading into black.

### Remaining blocker B — blackout is panel-local, not full-screen

`.s6-stage.blackout` turns only the Sprint6 stage container black.

The surrounding game shell/UI remains outside that element.

Canonical requirement is:

- all text disappears;
- complete black screen for two seconds.

The corrected stage 10 is text-free inside the stage, but it is not yet a complete-screen blackout.

### Remaining blocker C — wet scraping fade-in is not implemented

V4.0 explicitly specifies:

`audio.wet_scraping`

with:

`fade_in = 1.5 sec`.

The client creates a normal `Audio` object and calls `.play()` directly. No volume ramp/fade-in exists.

### Remaining blocker D — required audio safety/accessibility contract is absent

V4.0 §40 requires:

- mute control;
- reduced-volume control;
- preload/arming after first user interaction to reduce autoplay blocking risk;
- critical information must not depend on sound alone.

The corrected Sprint6 renderer retains playback handles, but CA found no:

- mute UI/state;
- reduced-volume UI/state;
- first-interaction preload/arming path.

Audio is started from polling-driven refresh through:

`audio.play().catch(()=>{})`.

If browser autoplay policy rejects that playback, the failure is silently swallowed.

The text accompaniment satisfies the “not sound-only” portion, but the runtime audio control/reliability contract remains incomplete.

### Closure condition

ACT12 must include the canonical fade-to-black/full blackout behavior and the required audio runtime safety/accessibility behavior, including wet-scraping fade-in and user control / browser-safe playback handling.

The already-corrected countdown, two-second text-free hold, audio stop, clang → gate sequence, SIGNAL RESTORED and ACT13 pause should be preserved.

CA is not prescribing the animation or audio architecture.

## 5. S6-RC-001 HIGH — FIXED_VERIFIED

The prior replay/identity closure gaps are materially closed.

### Server serialization

Migration 036 adds:

`s6_request_lock(run, player, request)`

using a transaction-scoped advisory lock.

All public Sprint6 v2 mutations acquire this lock before delegating into the prior guarded action.

This means two concurrent copies of the same request identity serialize before receipt recognition.

The follower enters after the first transaction has committed and can observe the durable receipt rather than racing through the pre-lock “not found” window.

### Discussion close

`s6_close_discussion_v2(...)` now has:

- client request UUID;
- durable action receipt;
- payload-content comparison;
- identical replay response;
- conflicting request reuse rejection.

The previous close-without-replay gap is closed.

### Browser request identity

Sprint6 browser mutations now use the existing sessionStorage-backed `requestIdentity(...)` mechanism.

Verified:

- action identity includes current expected phase/step/round and discussion identity where applicable;
- request UUID is reused after an uncertain response;
- request identity is cleared only after successful RPC return;
- Sprint6 messages likewise preserve request identity by exact session + text.

### Legacy authority boundary

Migration 036 revokes the prior guarded endpoints from `anon` / `authenticated` after granting the v2 endpoints.

Browser code uses the v2 functions.

### Result

The original requirements are now satisfied:

- stale current-state retargeting is rejected;
- identical committed retry is distinguishable from a stale new action;
- browser can actually reuse the server receipt identity;
- concurrent same-request copies serialize before replay evaluation.

`S6-RC-001 HIGH → FIXED_VERIFIED`.

## 6. Test / evidence review

CD reports:

- Sprint6 static PASS;
- production TAKE E2E PASS;
- production LEAVE E2E PASS;
- concurrent same-request replay PASS;
- discussion-close replay PASS;
- Station B intermediate state PASS;
- cinematic endpoint completion PASS;
- ACT13 pause PASS.

These results support S6-RC-001 closure and the state-machine portions marked fixed.

However, current tests do not falsify:

- English-only Great Hall door labels;
- English-only Station B indicator text;
- Station B UI claiming CENTER while server state is only `lever_held`;
- second Station B action being visibly labeled HOLD while semantically committing center;
- absence of gradual fade-to-black;
- panel-only rather than complete-screen blackout;
- missing wet-scraping fade-in;
- missing mute/reduced-volume/preload behavior;
- autoplay rejection being silently swallowed.

The handoff explicitly states that no new localhost visual smoke run is claimed because the in-app browser blocked localhost navigation. Therefore these browser-presentation gaps are not contradicted by submitted live evidence.

## 7. Mandatory recurring-error pattern scan

| Pattern | Result | Second focused result |
|---|---|---|
| A — local correctness / cross-module handoff | **FINDING** | server Station B intermediate state exists, but UI displays terminal center state one transition too early. |
| B — happy path / distributed boundary | PASS | v2 request serialization and stable browser request identities close the prior lost-response/concurrent replay gap. |
| C — UI rule vs server authority | **FINDING** | Station B browser state claims CENTER before authoritative server state reaches center. |
| D — current state vs historical evidence | PASS | no new evidence-loss defect found. |
| E — authority accretion / legacy reachability | PASS | browser uses v2 endpoints and prior guarded write endpoints are revoked from student roles. |
| F — self-confirming tests | **FINDING** | static/live tests prove endpoint state but do not inspect localization correctness, exact Station B visual state or cinematic/browser audio behavior. |

## 8. Gate disposition

**Sprint6 remains BLOCKED.**

Closed in this re-audit:

- `S6-RC-001 HIGH → FIXED_VERIFIED`.

Still open:

- `S6-CA-002 HIGH → PARTIALLY_FIXED / OPEN`;
- `S6-CA-003 HIGH → PARTIALLY_FIXED / OPEN`;
- `S6-CA-004 HIGH → PARTIALLY_FIXED / OPEN`.

Previously closed findings remain closed:

- `S6-CA-001 HIGH → FIXED_VERIFIED`;
- `S6-RC-002 MEDIUM → FIXED_VERIFIED`;
- Golden Key item-label identity → FIXED_VERIFIED.

No Sprint7 implementation is authorized.

Migrations `033–036` are deployed history and must remain immutable. Any DB correction begins at **037+**.

Next owner: **CD**.

CD should correct only these three remaining Sprint6 closure gaps plus directly adjacent regression coverage, preserve verified Sprint1–5 behavior and deployed migrations 001–036, run relevant static/live/browser regressions, and submit another focused Level 1 re-audit request.
