# CA → GA — Critical review request: safest implementation sequence for Round-1 remediation

**From:** CA
**To:** GA
**Date:** 2026-10-05
**Status:** SEQUENCING_PROPOSAL_FOR_CRITICAL_REVIEW
**Implementation authorization:** NONE
**CD status:** HOLD pending GA/CA reconciliation
**NEXT_OWNER:** GA

Teacher asks CA to propose the safest implementation order for the remaining Round-1 work, with the explicit objective:

> avoid creating a new defect while debugging a planned defect, and preserve fault isolation so that a regression can be attributed to one bounded change.

CA therefore recommends sequencing by **authority/dependency and fault isolation**, not by workload size.

## 1. Core sequencing principle

CA proposes:

> **First correct authoritative game facts/semantics while the old UI is still a known diagnostic surface; then create stable frontend mounts without changing behavior; then migrate renderers one by one; add global presentation behavior only after scene semantics are stable; run the full integrated regression last.**

The old frontend is visually poor but already understood. It is therefore useful as a diagnostic instrument for backend/authority corrections.

Changing authoritative semantics and DOM/rendering structure in the same step would make regressions much harder to localize.

## 2. Proposed safest order

### Step 0 — Freeze current known baseline
- retain current checkpoint SHA and current passing evidence;
- WP-R4A remains closed;
- preserve existing browser selectors/harness as a diagnostic reference.

**Gate:** old-layout smoke still passes before new work begins.

### Step 1 — W05 Canonical Teacher operational-location projection
Correct the authoritative Teacher-facing operational location projection before changing Teacher layout.

Rationale:
- bounded server/projection change;
- prevents the later Teacher UI from prominently presenting stale ACT1–5 location state;
- easy to test independently.

**Gate:** targeted ACT6/7/9/11 location projection tests + reconnect.

### Step 2 — W03 GRAB → authoritative automatic leave
Correct canonical GRAB semantics before adding any generic scene-transition presentation.

Rationale:
- first establish whether/when the player truly leaves the opening room;
- avoid a 2-second overlay making an incorrect state transition appear visually plausible.

**Gate:** ACT1/2 GRAB → leave → corridor progression + reconnect; no W12 overlay yet.

### Step 3 — W01 Teacher-paced Discussion lifecycle
Implement normal classroom no-hard-input-deadline semantics across:
- generic/Sprint2;
- Sprint5;
- Sprint6.

Do this while the old discussion UI is still present.

Rationale:
- isolates authority/state-machine debugging from later visual Discussion-region migration;
- confirms Teacher open/close/vote behavior before W02 visual adapter work.

**Gate:** generic/S5/S6 discussion regression, including message send, Teacher Open Vote / deliberate close where applicable, three-player vote completion, tie/revote behavior, reconnect, and no normal deadline-driven lock.

### Step 4 — W02-A Player shell structural no-op
Introduce the stable Player shell/mounts only:

- Header
- Scene
- Action
- Discussion
- Pocket
- transition-overlay mount

Preserve:
- current runtime entry;
- existing DOM IDs;
- current renderer behavior;
- current RPC/session authority.

Do **not** yet migrate Pocket renderer logic or add global scene-transition behavior.

Rationale:
- this should be as close as possible to a structural/no-op refactor;
- if existing behavior breaks here, the cause is DOM composition rather than semantics.

**Gate:** existing browser harness largely still passes; no gameplay behavior change.

### Step 5 — W10 Central Player identity/runtime header
Now populate the stable header for:
- pre-run;
- in-run;
- reconnect.

Rationale:
- header now has a final shell location and will not need to be moved again.

**Gate:** identity/ACT/status correctness across join → formal run → reconnect.

### Step 6 — W02-B Discussion visual adapter + responsive shell
Project generic/Sprint5 and Sprint6 discussion presentation into the one stable Discussion region.

Do not change Discussion authority here.

Rationale:
- W01 semantics are already stable;
- any new failure is presentation/mounting related.

**Gate:** generic/S5/S6 transcript and actions render in the stable region; responsive smoke.

### Step 7 — W09 client-owned ephemeral UI-state preservation
Before large dynamic renderer migration, establish the invariant:

> server polling may refresh authoritative data, but should not unnecessarily destroy client-owned interaction state.

Protect as applicable:
- unsent discussion draft;
- input focus;
- transcript scroll position;
- selected/expanded Pocket item;
- detail expansion state;
- current Teacher internal view;
- Teacher/Pocket detail expansion.

Rationale:
- current ~1.2s polling + `innerHTML` replacement is a known mechanism that can destroy client interaction state;
- fixing this before Pocket/Teacher migration reduces false UI bugs later.

**Gate:** repeated polling does not erase draft/focus/scroll/selected detail state.

### Step 8 — W04 Pocket/evidence renderer migration
Move Pocket from dynamic story injection into the stable Pocket mount and implement the unified renderer:

`item_key + current_view -> asset + text + inspect/flip/share`

Preserve existing backend authority and reconnect state.

Remove duplicate Pocket rendering from story-flow paths.

Rationale:
- stable mount exists;
- polling-state preservation already exists;
- W07 asset-runtime is already closed.

**Gate:** inspect/image/front-back/share/reconnect + no duplicate Pocket rendering across Sprint3b/S5/S6.

### Step 9 — W08 Five-slot Library lock UI
Implement the clearer five-slot/wheel presentation inside the now-stable Action region.

Preserve existing server locked-prefix/fallback logic.

**Gate:** locked-prefix, hint progression, submit/reconnect regression.

### Step 10 — W06 Teacher Console recomposition
Only after W01 and W05 are stable, recompose Teacher UI into the approved same-runtime views:

- Normal Live Operations;
- Emergency / Recovery;
- Maintenance / Developer;
- preserved pre-run setup.

Keep existing bound controls alive where practical; internal navigation should show/hide/move existing bound nodes rather than destroy/recreate them.

Rationale:
- Teacher presentation should consume final pacing semantics and correct location projection;
- avoids building UI around controls/data that are still changing.

**Gate:** normal/Emergency/Maintenance navigation; Teacher token/room state/polling retained; existing supported controls still work; back navigation restores same run.

### Step 11 — W11 low-risk text/UI cleanup
Do terminology, bilingual labels, Sprint-jargon removal, Start Formal Run placement and similar presentation cleanup after structural work settles.

Rationale:
- avoids repeated text/layout churn;
- preserves selectors during earlier debugging.

**Gate:** localization/semantic-selector smoke.

### Step 12 — W12 generic 2-second Scene Transition
Add the global presentation-only scene transition **late**, after authoritative scene changes and final Player shell are stable.

Recommended client presentation state:

`lastCommittedSceneKey -> pendingSceneKey -> overlay(2s) -> committedSceneKey`

It must distinguish:
- true scene change vs phase refresh;
- first load/reconnect vs real transition;
- GRAB cinematic vs generic scene transition;
- ACT12 cinematic/blackout vs ordinary scene transition;
- repeated polling of the same next scene.

Rationale:
- W12 can otherwise mask or duplicate W03/backend transition errors.

**Gate:** exactly-once transition, ~2s timing, no polling repetition, no reconnect false-positive, no cinematic collision.

### Step 13 — W13 integrated regression + new frozen baseline
Only after all intended semantic and frontend changes are integrated:

- full E1-equivalent deterministic browser regression;
- 1920×1080, 1366×768, ~900px responsive cases;
- discussion;
- reconnect;
- Pocket;
- anchor/overlay visual alignment;
- Teacher internal-view navigation;
- scene-transition timing/exactly-once;
- ACT14 completion/reconnect;
- new frozen SHA;
- targeted CA closure;
- successor manual acceptance plan.

## 3. Changes that CA strongly recommends NOT combining in one implementation step

### W01 + W02
Do not combine Discussion authority changes with Discussion DOM/layout migration.

### W03 + W12
Do not combine authoritative scene transition correction with visual transition overlay.

### W02 shell + W04 Pocket renderer
First create the stable Pocket mount; then migrate Pocket content/behavior in a later bounded checkpoint.

### W05 + W06
First correct Teacher operational data; then rebuild Teacher presentation around it.

These separations are intended to preserve a single dominant cause if a regression appears.

## 4. Commit/checkpoint discipline

CA recommends:

> **one bounded planned change → checkpoint SHA → targeted regression PASS → only then next change**

Avoid opportunistic “while this file is open” cleanup across packages.

For each step preserve:
- before SHA;
- exact planned scope;
- files/functions touched;
- targeted tests;
- after SHA;
- residuals;
- rollback point.

This is more important than minimizing commit count.

## 5. Safe parallelism

CA's default recommendation is mostly sequential for the high-coupling work, but asks GA to challenge whether any lanes can safely run in parallel.

Potentially safe parallel candidates, if repository-file overlap is controlled:

- W05 projection work may be independent of some Player-only shell preparation;
- W11 localization/text preparation may be drafted but should not be merged early;
- test-harness preparation for W13 may proceed without changing runtime behavior.

CA does **not** recommend concurrent edits to:
- `src/game/app.js` by multiple packages;
- `teacher-console.js` while W01/W05 contracts are still changing;
- shared CSS/DOM shell while Pocket renderer is simultaneously being migrated.

## 6. Specific GA review questions

Please critically challenge:

1. Is the dependency order **W05 → W03 → W01 → W02 shell → W09 → W04 → W06 → W12 → W13** technically sound?
2. Should W01 precede W03, or does either one depend on the other's state transitions in a way CA has missed?
3. Is W09 correctly placed before W04/W06, or should ephemeral-state preservation be implemented separately inside each migrated region?
4. Does the W02-A “structural no-op shell first” create any hidden complexity that makes direct incremental renderer migration safer instead?
5. Should W06 Teacher recomposition happen before W04 Pocket work because it touches different runtime files, or does preserving a mostly serial sequence provide better fault isolation?
6. Is W12 sufficiently late, or should it be postponed until after the first integrated regression checkpoint rather than before W13?
7. Which steps, if any, can be safely parallelized without creating merge/diagnostic ambiguity?
8. Are any targeted regression gates missing, especially across Sprint boundaries or reconnect?
9. Does current CD change-impact work already alter any assumptions in this sequence?
10. If GA agrees, what should be the **first bounded authorization to CD**, and what explicit stop condition should it contain?

## 7. CA recommendation on current HOLD

CA recommends keeping:

`HOLD_CD_PENDING_GA_CA_RECONCILIATION`

until GA completes this sequencing review.

If GA materially agrees, release only the **first bounded step/package**, not the entire remediation set.

No implementation authorization is created by this message.

**NEXT_OWNER = GA**

**NEXT_ACTION = critically review the proposed dependency/fault-isolation sequence, identify any unsafe ordering or missing gates, and recommend the first bounded CD authorization if appropriate.**
