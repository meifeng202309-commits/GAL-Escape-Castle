# Sprint6 ACT 9–13 — Level 1 CA Audit

Baseline: `605c2fc277bfa9933cc8124b3eacafc6887b2020`  
Scope: Sprint6 canonical ACT 9–13 only  
Audit level: Level 1 — Regular CA Audit  
Decision: **FAIL / BLOCKED — SIX FINDINGS**

## 1. Inputs and independence

CA froze the handoff commit containing:

`agent-comms/CD_to_CA_20260924T081112Z_sprint6-ready-for-level1-audit.md`

and independently reconstructed Sprint6 from:

- `database/033_sprint6_act9_13_runtime.sql`;
- `database/034_sprint6_contract_hardening.sql`;
- `src/game/app.js`;
- `src/teacher/teacher-console.js`;
- `tests/sprint6-static-check.js`;
- the Sprint6 continuation in `tests/sprint5-live-e2e.js`;
- current V4.0 ACT9–13 canonical sections;
- current Codex V2.3 Sprint6, logging and testing contracts;
- verified Sprint1–5 runtime boundaries.

Migrations 033 and 034 are reported deployed and are therefore immutable history.

CD-reported production Supabase TAKE/LEAVE E2E results are supporting evidence, not a substitute for independent canonical/state/authority review.

## 2. Decision summary

Confirmed blockers:

- **S6-CA-001 HIGH** — canonical Sprint6 DiscussionRoom behavior is missing; ACT9/10/11 bypass required silent-texting discussion and the client remains coupled to Sprint5 discussion state.
- **S6-CA-002 HIGH** — Great Hall console presentation/soft-failure semantics are incomplete and several server feedback keys are factually wrong for the step that failed.
- **S6-CA-003 HIGH** — ACT11/12 station work is reduced to direct role allocation + ENGAGE; canonical station-specific tasks, timing and allocation discussion behavior are omitted.
- **S6-CA-004 HIGH** — ACT12 horror cinematic/audio and ACT13 visual transition are not implemented as runtime; the browser path also has no canonical mechanism to complete the ACT13 → ACT14 boundary.
- **S6-RC-001 HIGH** — Sprint6 actions lack source-step/round identity and permit stale-request retargeting / split scene state.
- **S6-RC-002 MEDIUM** — behavior evidence and request-identity durability are incomplete for allocation/private-choice paths.

Sprint6 must remain blocked until these findings are closed.

## 3. S6-CA-001 HIGH — canonical DiscussionRoom behavior is missing

### Canonical requirement

Sprint6 relies on real silent-texting DiscussionRoom phases:

- ACT9: DiscussionRoom OPEN, silent texting, free text, no SHARE PHOTO, approximately 3 minutes;
- ACT9 1:1:1: no action, same step remains open, DiscussionRoom remains available before re-vote;
- ACT9 soft failure: 60-second discussion before retry/reset;
- ACT10: first choices reveal, then 300-second silent-texting DiscussionRoom before final TAKE/LEAVE vote;
- ACT11 allocation: silent-texting allocation discussion, 90 seconds on LEAVE branch or 45 seconds on TAKE/alarm branch.

These discussions are core behavior evidence for information sharing, question asking, information integration, group role, social initiative and disagreement handling.

### Submitted implementation

Sprint6 creates no Sprint6 `discussion_sessions`, no Sprint6 exact-session message API, and no canonical timing gate for these phases.

`s6_initialize(...)` enters `act9_discussion`, but the player receives only a generic Continue button that calls `s6_open_act9_console(...)`. Any authenticated player can immediately move the run to the console; no three-minute discussion is required.

ACT10 moves directly:

`act10_private → act10_final_vote`

as soon as all three private choices exist. There is no five-minute discussion phase between reveal and final vote.

ACT11 renders role buttons immediately; there is no 90/45-second allocation DiscussionRoom.

The player refresh path is also not Sprint6-aware for discussion authority:

`renderDiscussion(sprint5State.active ? s5_get_discussion_state(...) : discussionState)`

Because a verified Sprint5 row still exists, Sprint6 does not obtain an authoritative Sprint6 discussion state. The message sender likewise chooses `s5_send_message` whenever `currentSprint5State?.active` remains true.

### Impact

The implemented runtime removes a major observable behavior surface from ACT9–11 and can expose stale/irrelevant earlier discussion state instead of the current Sprint6 interaction.

This is a canonical omission, not a timer cosmetic issue.

### Closure condition

ACT9, ACT10 and ACT11 must expose their canonical DiscussionRoom behavior with authoritative current-session identity, timing, transcripts and reconnect/retry semantics. Re-vote/soft-failure discussion must attach to the correct unresolved Great Hall step. Sprint6 messaging must not route through stale Sprint5 discussion authority.

CA is not prescribing schema or whether Sprint6 reuses/extents the existing DiscussionRoom implementation.

## 4. S6-CA-002 HIGH — Great Hall console feedback and failure semantics are incorrect/invisible

### A. Player UI discards authoritative feedback

`s6_submit_group_choice(...)` can return `feedback_text_key`, but `runSprint6Action(...)` discards the RPC result and immediately refreshes.

`renderSprint6(...)` does not render the current runtime scene/presentation key for:

- `NO CONSENSUS. NO ACTION.`;
- step-specific wrong-action feedback;
- RED activated / BLUE available transitions;
- soft-failure cinematic text.

Therefore a Great Hall state transition may occur without the player ever seeing the required canonical feedback.

### B. Several hardening feedback keys are wrong

Migration 034 maps wrong-step feedback as:

- wrong STEP1 → `act09.012`, whose catalog text is **BLUE**;
- wrong STEP2 → `act09.017`, whose text is **A dull blue indicator flickers on.** — this is the success transition after DO NOT ENTER;
- wrong STEP3 → `act09.019`, whose text is **BLUE DOOR ACTIVATED.** — also success text.

Canonical failure feedback is different:

- wrong STEP1: **RED OPENS FIRST.**;
- wrong STEP2 ENTER RED: snake shadow + Red Door slams shut + **THE FIRST DOOR IS NOT SAFE.**;
- wrong STEP3: **BLUE OPENS ONLY AFTER RED.**

The required 60-second post-failure discussion is also absent.

### C. Required scene/audio behavior is not wired

The Sprint6 client contains no use of:

- `shared.great_hall`;
- `audio.snake_hiss_short`.

Formal art may be unavailable and therefore use a governed fallback, but the runtime still needs to request the canonical scene/audio identity and preserve the presentation sequence. Current Sprint6 code does neither.

### Impact

The server's current step can reset correctly while the GAL sees no correct reason for the reset, or the stored feedback identity can describe the opposite/success state.

### Closure condition

Great Hall no-consensus and soft-failure outcomes must produce the canonical player-visible feedback for the actual step/action, preserve correct step/reset state, reopen the required discussion window, and use canonical scene/audio identity or governed fallback.

## 5. S6-CA-003 HIGH — ACT11/ACT12 station work is omitted

### Canonical ACT11

The Main Gate scene requires:

- `shared.main_gate`;
- TIME 23:58;
- visible Station A/B/C labels;
- branch-specific role set;
- allocation discussion;
- Linda physical ownership constraint for Station C on LEAVE.

### Canonical ACT12 ENGAGE gate

Each assigned role has an actual pre-ENGAGE task:

- Station A: enter **1897**, then ENGAGE;
- Station B: HOLD LEVER until center, then ENGAGE;
- Station C: INSERT ★ SILVER KEY, then ENGAGE;
- WATCHER: WATCH CORRIDOR.

Failure may be selected only after all required role tasks have reached ENGAGED.

### Submitted implementation

ACT11 presents role buttons but no canonical allocation DiscussionRoom or Main Gate station presentation.

ACT12 reduces all mechanism roles A/B/C to essentially the same direct:

`[ENGAGE]`

button.

There is no Station A 1897 input/validation, no Station B hold/indicator state, and no Station C Silver Key insertion action/ownership check at ENGAGE time.

The server `s6_engage(...)` verifies only that the player has the submitted allocation role; it does not verify the role-specific task precondition.

### Impact

The ENGAGE gate is technically three-role gated, but the canonical tasks whose completion should make those roles “engaged” do not exist.

This changes the gameplay and removes the intended station/mechanism interaction.

### Closure condition

ACT11/12 must preserve the branch-specific allocation workflow and role-specific station task preconditions before each `role_engaged` becomes true. Station C must remain consistent with actual Silver Key physical ownership; WATCHER must remain non-mechanism.

CA is not prescribing the UI implementation of the wheel/lever/indicator.

## 6. S6-CA-004 HIGH — ACT12 cinematic/audio and ACT13 transition are not implemented

### Canonical scope

Codex V2.3 explicitly includes in Sprint6:

- audio triggers;
- escape cinematic.

V4.0 ACT12 requires the ordered sequence:

- neutral unified pressure text;
- `audio.wet_scraping`;
- corridor text;
- TAKE branch Watcher warning where applicable;
- `audio.snakes_approaching`;
- fade to black;
- wet-breath text;
- 5→1 countdown;
- full black screen for 2 seconds;
- stop approaching audio;
- system-owned `cinematic_auto_resolution`;
- `audio.mechanism_clang`;
- `audio.gate_opening`;
- **ESCAPE SUCCESSFUL**.

ACT13 then requires:

- Main Gate escape text;
- `ending.castle_exterior`;
- TIME — 00:00;
- SIGNAL RESTORED;
- pause before ACT14 boundary.

### Submitted implementation

After the third pressure choice, the database immediately sets:

- `failure_resolution='cinematic_auto_resolution'`;
- `mechanism_failure_active=false`;
- `escape_success=true`;
- `act_no=13`.

The client then concatenates only:

- `act12.027` ESCAPE SUCCESSFUL;
- `act13.001`;
- `act13.002`;
- `act13.003`.

There is no timed ACT12 sequence, no countdown, no black-screen state, no TAKE-branch Watcher payoff, and no Sprint6 client reference to the six required audio assets.

The Sprint6 client also contains no `ending.castle_exterior` reference.

### Browser completion defect

The server has a separate `s6_advance(...)` transition that sets `act14_boundary_reached=true` from `act12_cinematic`.

However `renderSprint6(...)` supplies no ACT12-cinematic/ACT13 button or automatic transition that calls this RPC.

The production E2E reaches the boundary only because the test directly invokes `s6_advance` through RPC after pressure resolution.

Therefore the test can pass while the actual player UI has no canonical route to complete the Sprint6 boundary.

### Closure condition

The ACT12–13 runtime must execute the canonical ordered cinematic/audio/text state sequence, use canonical assets or governed fallback, and reach the ACT14 boundary through the real browser/runtime flow rather than a test-only direct RPC.

Sprint6 must still stop before ACT14 finalization/export.

## 7. S6-RC-001 HIGH — stale requests can retarget later state

### A. ACT9 console open can corrupt later scene state

`s6_open_act9_console(...)` performs:

`update s6_run_state ... where phase_key='act9_discussion'`

but does not require that this update succeeded.

It then unconditionally calls:

`s6_set_scene(... 'act9_console' ...)`

and returns success.

A delayed/replayed ACT9 Continue after the run has moved to ACT10/11/12 can therefore leave `s6_run_state` on the later phase while rewriting shared runtime scene state back to ACT9.

### B. Group choices have no expected phase/step/round identity

`s6_submit_group_choice(...)` receives:

- room;
- session;
- request id;
- choice id.

It does **not** receive the phase/step/round that the player actually saw.

STEP1 and STEP3 both accept `red/blue/black`.

A network-delayed STEP1 choice can therefore arrive after the run has advanced to STEP3 and be inserted as a legitimate STEP3 choice.

No stale-request rejection is possible because the request carries no expected interaction identity.

### C. Generic advance is source-ambiguous

`s6_advance(...)` is reused for more than one transition and likewise carries no expected source phase/request identity. This creates an adjacent retargeting surface for sufficiently delayed requests.

### Impact

Current state can be mutated by an action generated against an older screen. This is a distributed-state correctness defect, not merely a double-click issue.

### Closure condition

State-changing Sprint6 actions must be bound to the authoritative interaction identity the player actually observed, and stale requests must fail without mutating current state or shared scene projection. Idempotent replay of a committed identical request must remain distinguishable from a stale new action.

CA is not prescribing the request schema.

## 8. S6-RC-002 MEDIUM — behavior evidence / request identity is not durable enough

### A. Invalid allocation history is erased

`s6_allocations` stores only current role assignment per player.

During invalid allocation, the function:

`delete from public.s6_allocations where run_id=...`

then records only a generic `allocation_rework` penalty event.

The actual submitted role set — who chose which role — is lost.

Before all three submit, a player can also overwrite their row with a new role through `ON CONFLICT(run_id,player_id) DO UPDATE`.

ACT11 is explicitly a Group role / Social initiative evidence scene. Current-state cleanup must not erase the real pre-rework evidence.

### B. Private-choice request identity does not reject conflicting replay

`s6_submit_private_choice(...)` uses:

`ON CONFLICT(run_id,player_id,client_request_id) DO NOTHING`

but does not first compare the persisted choice content.

Reusing the same request identity with different content can return success/count semantics while preserving the first stored choice, leaving caller perception and durable evidence inconsistent.

### C. Group penalty actor provenance is misleading

Great Hall wrong-action `escape_penalty_event` records `p.player_id`, where `p` is simply the player whose submission happened to complete the three-vote set.

The wrong action is a group-majority Game Track result, not an action authored solely by the third network submitter.

Although `behavior_scoring=false`, actor provenance should not falsely attribute group execution to one player.

### Closure condition

Sprint6 must preserve real submitted allocation/role evidence across rework, enforce request-identity/content consistency for private choices, and use provenance that distinguishes group/system resolution from an individual network submitter.

## 9. Additional canonical/presentation issue

The Golden Key is inserted into `s3_item_catalog` and `s3_group_items` with:

`name_text_key / label_text_key = 'act10.006'`

but `act10.006` is the localization entry **TAKE**, not a Golden Key item label.

If rendered through the existing Group Items mechanism, the acquired item is therefore labeled as “TAKE” rather than Golden Key.

This is directly adjacent to S6-CA-002/003 and must be corrected as part of canonical presentation closure. It does not require a separate finding ID.

## 10. What passed / materially works

The audit confirms meaningful correct work in the submitted baseline:

- Sprint6 initialization is teacher-authorized and requires Sprint5 completion.
- New Sprint6 runtime tables have RLS enabled.
- ACT9 private clues are player-specific in `s6_private_clues`.
- Private clue delivery records knowledge provenance with `source='private_system_message'`.
- Migration 034 validates Great Hall option sets by current step.
- 1:1:1 increments the round without directly mutating door state.
- STEP4 STAY is not treated as a penalty.
- Golden Key TAKE/LEAVE core booleans are updated together.
- Branch-specific role allowlists are enforced.
- LEAVE allocation requires role C to belong to GAL-C.
- mechanism failure starts only after three engagement rows exist.
- WATCHER is excluded from mechanism-failure selection.
- pressure choices record response latency and role context.
- pressure choices do not select the success outcome; resolution source is system/cinematic.
- player state explicitly reports `game_completed=false` and `export_ready=false`.
- no ACT14 finalization/export implementation was found in Sprint6 migrations.

These positives do not close the blockers above.

## 11. Test / verification review

CD reports:

- Sprint6 static PASS;
- player/teacher syntax PASS;
- production TAKE live E2E PASS;
- production LEAVE live E2E PASS.

The production E2E demonstrates that the direct RPC state path can reach the intended branch endpoints.

However:

- the E2E directly calls Sprint6 RPCs and therefore bypasses browser interaction gaps;
- it directly invokes `s6_advance` to reach `act14_boundary_reached`, hiding the missing UI/automatic transition;
- it does not exercise canonical DiscussionRoom timing/transcripts in ACT9/10/11 because they do not exist;
- it does not test network-delayed stale STEP1→STEP3 requests;
- it does not test delayed/replayed `s6_open_act9_console`;
- it does not test invalid-allocation evidence durability;
- it does not test same-request conflicting private-choice content;
- `tests/sprint6-static-check.js` reads migration 033 but does **not** read/assert migration 034, despite 034 being the active hardening layer.

The static suite is therefore insufficient to falsify several of the current defects.

Physical three-device Sprint6 behavior is **NOT VERIFIED** by CA.

Audio playback / browser autoplay handling is **NOT VERIFIED** because the required Sprint6 audio integration is absent from the client.

## 12. Mandatory recurring-error pattern scan

| Pattern | Result | Sprint6 result |
|---|---|---|
| A — local correctness / cross-module handoff | **FINDING** | Sprint6 state machine exists, but DiscussionRoom still points to Sprint5 authority; server feedback is not connected to player presentation; E2E reaches a boundary the browser cannot. |
| B — happy path / distributed system | **FINDING** | no expected step/round identity allows stale requests to retarget current state. |
| C — UI rule mistaken for server rule | **FINDING** | required station-task preconditions are absent server-side; direct ENGAGE is accepted without canonical task completion. |
| D — current state preserved / history lost | **FINDING** | invalid allocation deletes the submitted role set; rework history is not durably preserved. |
| E — authority accretion across sprints | **FINDING** | Sprint6 client remains coupled to Sprint5 discussion authority instead of a current Sprint6 interaction identity. |
| F — self-confirming tests | **FINDING** | direct RPC E2E bypasses browser completion and missing discussions; static test does not inspect migration 034. |

## 13. Gate disposition

**Sprint6 remains BLOCKED.**

Open findings:

- S6-CA-001 HIGH — canonical DiscussionRoom behavior missing / stale prior authority;
- S6-CA-002 HIGH — Great Hall feedback/soft-failure presentation incorrect or absent;
- S6-CA-003 HIGH — ACT11/12 station/allocation task semantics omitted;
- S6-CA-004 HIGH — ACT12–13 cinematic/audio/visual/browser boundary incomplete;
- S6-RC-001 HIGH — stale request/phase/round retargeting;
- S6-RC-002 MEDIUM — behavior evidence and request/provenance durability gaps.

No Sprint7 implementation is authorized.

Migrations `033` and `034` are deployed history and must remain immutable. Any DB correction begins at **035+**.

Next owner: **CD**.

CD should correct only these Sprint6 findings plus directly adjacent regression coverage, preserve verified Sprint1–5 behavior and deployed migrations 001–034, run the relevant static/live/browser regressions, and submit the exact correction baseline/deployment evidence for focused Level 1 re-audit.
