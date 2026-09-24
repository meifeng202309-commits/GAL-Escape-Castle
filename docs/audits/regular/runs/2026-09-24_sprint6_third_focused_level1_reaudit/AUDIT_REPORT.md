# Sprint6 ACT 9–13 — Third Focused Level 1 Re-audit

Baseline: `7d217fed9da2d36255eff0ca08b694d4f0f90e1d`  
Implementation correction: `6889e2af95aeb968d9ee055429661225da576d11`  
Scope: closure of `S6-CA-002`, `S6-CA-003`, `S6-CA-004`, plus directly adjacent regression / authority risk  
Decision: **FAIL / BLOCKED — TWO FINDINGS CLOSED; ONE REMAINS OPEN**

## 1. Closure matrix

| Finding | Re-audit status | Result |
|---|---|---|
| S6-CA-002 HIGH | **FIXED_VERIFIED** | Great Hall door overlays now use approved anchors/states and canonical localization keys; ACT10 Golden Key asset path remains intact. |
| S6-CA-003 HIGH | **FIXED_VERIFIED** | Station B no longer exposes premature CENTER text or a misleading second HOLD button; browser shows a text-free lever transition and commits authoritative `indicator_center` through the guarded v2 RPC before ENGAGE becomes available. |
| S6-CA-004 HIGH | **PARTIALLY_FIXED / OPEN** | Fade/full blackout, countdown/payoff order, wet-scraping fade-in, pending-audio recovery and volume controls are materially corrected, but the controls/preload do not cover all Sprint6 audio cues and the four new student-facing audio-control strings were written directly into the GA-owned canonical catalog without GA/Teacher approval. |

Previously closed Sprint6 findings remain closed:

- S6-CA-001 HIGH — FIXED_VERIFIED
- S6-RC-001 HIGH — FIXED_VERIFIED
- S6-RC-002 MEDIUM — FIXED_VERIFIED
- Golden Key item identity — FIXED_VERIFIED

## 2. S6-CA-002 HIGH — FIXED_VERIFIED

The previous localization defect is closed.

Great Hall overlays now resolve:

- `act09.001` — RED DOOR;
- `act09.002` — BLUE DOOR;
- `act09.003` — BLACK DOOR;

through `localizedHtml(...)`.

The literal `RED / BLUE / BLACK` text sources are removed.

The previously verified anchor/state logic remains present:

- approved red/blue/black door anchors;
- red open state;
- blue available state;
- blue open state;
- governed missing-anchor fallback.

ACT10 continues to resolve `prop.golden_key` through Asset Manager.

No adjacent regression was found in this closure.

## 3. S6-CA-003 HIGH — FIXED_VERIFIED

The previous Station B UI/server mismatch is materially closed.

Current browser flow:

1. player executes the canonical HOLD LEVER action;
2. server persists only `lever_held`;
3. while `lever_held`, the browser shows a text-free moving indicator;
4. there is no second visible HOLD button;
5. after the visual transition, the browser submits `lever_center` through `s6_complete_station_v2` using durable request identity;
6. only after server state reaches terminal `indicator_center` / station task does ENGAGE become available.

The prior hardcoded `INDICATOR: CENTER` string is removed.

The 1.2-second visual duration is implementation detail, not a new behavior choice. The important invariant is preserved: player-visible terminal completion no longer precedes authoritative station state.

Reconnect from `lever_held` re-schedules the visual transition rather than inventing `indicator_center`.

No new blocker was confirmed.

## 4. S6-CA-004 HIGH — PARTIALLY_FIXED / OPEN

### What is fixed

The correction closes most of the prior cinematic/runtime presentation gaps.

Verified in source:

- stages 4–9 progressively reduce full game-shell opacity against a black body;
- stage 10 hides the complete shell, producing a full-screen blackout rather than a panel-only blackout;
- the server stage 10 remains text-free and holds for two seconds;
- wet scraping starts at volume zero and ramps over 1500 ms;
- active Sprint6 audio objects are retained in a handle map;
- approaching audio is paused/rewound at blackout;
- playback rejection is no longer silently swallowed;
- rejected playback becomes pending and exposes a visible localized recovery path;
- subsequent pointer/control interaction retries pending playback;
- full / reduced / mute modes persist locally and update active audio volume;
- previously verified 5→4→3→2→1, blackout, clang → gate-opening → success, SIGNAL RESTORED and ACT13 pause remain intact.

These are substantial and valid fixes.

### Remaining blocker A — audio safety controls do not cover all Sprint6 audio cues

V4.0 defines at least six formal Sprint6 audio assets:

- `audio.wet_scraping`;
- `audio.snakes_approaching`;
- `audio.old_alarm_bell`;
- `audio.snake_hiss_short`;
- `audio.mechanism_clang`;
- `audio.gate_opening`.

Current preload/arming list contains only four:

- wet scraping;
- snakes approaching;
- mechanism clang;
- gate opening.

The omitted cues are:

- ACT9 Great Hall soft-failure `audio.snake_hiss_short`;
- ACT10 TAKE-branch `audio.old_alarm_bell`.

More importantly, the volume controls are rendered only when:

`act_no >= 12`.

Therefore a player reaching the ACT9 snake hiss or ACT10 alarm for the first time has no in-game mute/reduced-volume control available before those sounds play.

The V4.0 audio safety rule is project-wide for formal runtime audio, not ACT12-only.

### Closure condition A

The selected audio mode must govern all formal Sprint6 audio cues, including ACT9 and ACT10, and the user must have a usable mute/reduced-volume path before those cues can first play.

All formal Sprint6 audio identities should participate in the browser-safe preload/arming/recovery model or an equivalent governed mechanism.

CA is not prescribing control placement or preload implementation.

### Remaining blocker B — canonical localization authority was bypassed

The correction directly modifies:

`docs/specs/current/localization/GAL_Castle_Escape_Text_Catalog_V1.0.csv`

by adding:

- `runtime.audio.full`
- `runtime.audio.reduced`
- `runtime.audio.mute`
- `runtime.audio.blocked`

The proposed texts are technically coherent and the generated runtime representation matches them.

However Codex V2.3 §4.4 states that the canonical catalog:

- is maintained by GA;
- is Teacher-reviewed and approved;
- is the single approved runtime localization authority.

Inter-Agent Talk Protocol V1 also states that CD owns implementation and must report canonical conflicts rather than silently redesign canonical sources.

CA has no authority to ratify new canonical Dutch/Chinese wording.

Therefore these four keys cannot be treated as approved canonical text merely because CD inserted them into the L1 catalog.

### Closure condition B

GA must review the proposed keys/text and either:

- approve/maintain them as canonical, subject to Teacher approval; or
- provide approved replacements.

Only after canonical approval can CD's runtime references to these keys count as compliant closure.

No further CD-authored canonical wording should be assumed valid without that authority step.

## 5. Verification boundary

CD reports:

- localization generation PASS;
- JS syntax PASS;
- Sprint6 static PASS;
- production Sprint5 baseline E2E PASS;
- production Sprint6 TAKE / LEAVE E2E PASS.

These support the state-path regressions.

The current in-app browser did not permit a new localhost/file visual smoke test. Therefore exact visual timing and browser audio playback remain source/static verified rather than newly observed through a local browser session.

That limitation does not reopen S6-CA-002/003, but it remains an evidence boundary for final release testing.

## 6. Recurring-error pattern scan

| Pattern | Result | Focused result |
|---|---|---|
| A — local correctness / cross-module handoff | **FINDING** | ACT12 audio controls work locally, but ACT9/10 formal audio is outside the control/preload surface. |
| B — distributed boundary | PASS | previously verified v2 request identity/replay semantics are unchanged. |
| C — UI/server authority | PASS | Station B presentation now follows authoritative intermediate/terminal state. |
| D — current state/history | PASS | no new evidence-loss issue. |
| E — authority accretion | **FINDING** | CD directly edited a GA-owned canonical localization source. |
| F — self-confirming tests | **FINDING** | static checks assert the four ACT12 preload identities but do not assert coverage of old alarm / snake hiss or catalog ownership approval. |

## 7. Gate disposition

**Sprint6 remains BLOCKED.**

Closed in this re-audit:

- `S6-CA-002 HIGH → FIXED_VERIFIED`;
- `S6-CA-003 HIGH → FIXED_VERIFIED`.

Still open:

- `S6-CA-004 HIGH → PARTIALLY_FIXED / OPEN`.

The remaining closure has two parts:

1. technical: all formal Sprint6 audio cues must be covered by user-selectable volume/mute and browser-safe audio handling before first playback;
2. canonical authority: the four new audio-control localization keys require GA maintenance/review and Teacher approval.

No Sprint7 implementation is authorized.

Migrations `033–036` remain immutable. No migration 037 is currently required by this finding unless CD's chosen implementation genuinely needs one.

Next owners:

- **CD** — technical audio coverage only;
- **GA / Teacher** — canonical localization disposition for the four new audio-control keys.

After both parts are resolved, CD may submit the final Sprint6 focused Level 1 re-audit request.
