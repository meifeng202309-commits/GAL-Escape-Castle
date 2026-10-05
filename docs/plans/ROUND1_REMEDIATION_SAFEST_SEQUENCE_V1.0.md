# Round-1 Remediation Safest Implementation Sequence V1.0

Date: 2026-10-05  
Owner: GA  
Status: GA critical review of CA sequencing proposal; for CA concurrence before any CD discussion.

## 1. Overall disposition

GA materially agrees with CA's governing principle:

> correct authoritative facts first while the old UI remains a known diagnostic surface; then introduce stable frontend mounts without changing behavior; then migrate renderers; add global presentation behavior late; finish with integrated regression.

GA agrees that the project should be optimized for **fault isolation**, not maximum parallel speed.

GA also confirms that no new CD response/change-impact map has arrived after the current HOLD, so no CD work has changed the assumptions below.

## 2. First three steps: W05 → W03 → W01

GA agrees with CA's order.

### Step 1 — W05 Teacher operational-location projection

Keep first.

Reason:
- bounded authoritative projection;
- mostly independent of Player shell work;
- gives the future Teacher UI correct data before redesign makes that data prominent;
- easy to regression-test independently.

### Step 2 — W03 GRAB authoritative automatic leave

Keep before W01.

W03 and W01 are not logically dependent, but W03 should precede W01 for fault isolation and reduced rework:

- W03 corrects an early ACT2 progression boundary;
- later end-to-end W01 discussion regression must traverse that early progression;
- changing ACT2 after W01 would require re-validating later discussion journeys against a newly changed entry path.

Therefore GA prefers:

`W05 → W03 → W01`

rather than `W05 → W01 → W03`.

### Step 3 — W01 Teacher-paced Discussion lifecycle

Keep before any Discussion DOM/layout migration.

This is the strongest sequencing agreement with CA:

- first make pacing/authority correct;
- then make it look like the approved large Discussion region.

Do not combine W01 and W02-B.

## 3. Player shell sequence

GA agrees with the structural no-op concept, with one important guardrail.

### Step 4 — W02-A structural no-op shell

Create stable mounts for:

- Header
- Scene
- Action
- Discussion
- Pocket
- Transition overlay

But the checkpoint must preserve:
- existing production entry page;
- existing IDs/selectors;
- existing render output/authority;
- one coherent `refreshState()` transaction.

The shell must not cause Scene, Discussion and Pocket to begin independently polling/rendering from separate snapshots.

This cross-RPC snapshot invariant is promoted to a Step-4 gate, not postponed to W13.

### Step 5 — W10 runtime header

Agree with CA.

The header should be populated only after its stable location exists.

Gate:
- pre-run;
- first formal render;
- in-run;
- reconnect;
- completed run if header remains visible.

### Step 6 — W02-B Discussion visual adapter + responsive shell

Agree with CA.

Generic/Sprint5/Sprint6 Discussion content should converge visually only after W01 semantics are stable.

Do not unify backend Discussion contracts here.

## 4. GA modification: split W09 by the mount that actually exists

GA does **not** recommend implementing all W09 before W04/W06 as one global patch.

Reason:
- selected/expanded Pocket state cannot be robustly protected until Pocket has actually migrated into its stable mount;
- Teacher internal-view state does not exist until W06 creates those views;
- solving those states against the old DOM can create throwaway code and a second migration.

Therefore split the 2/5 W09 task into three bounded checkpoints without changing its total planning rating:

### Step 7 — W09-A Discussion interaction-state preservation

Immediately after W02-B protect:
- unsent draft;
- input focus;
- transcript scroll position;
- unnecessary composer destruction under polling.

This is the state that already exists and becomes critical as soon as the large Discussion region is live.

### Step 8 — W04 Pocket renderer migration

Move Pocket into the stable Pocket mount and implement:
- real item/view asset binding;
- inspect;
- flip;
- share;
- reconnect reconstruction;
- removal of duplicate story-flow Pocket injection.

### Step 9 — W09-B Pocket interaction-state preservation

Immediately after W04 protect:
- selected item/detail;
- expanded/collapsed state;
- current front/back/open presentation;
- scroll as applicable.

This should be a narrow targeted checkpoint, not mixed into W04's asset/data migration.

### Step 10 — W08 Five-slot Library lock UI

Agree with CA: after the Action region is stable.

## 5. Teacher sequence

### Step 11 — W06 Teacher Console recomposition

Agree that W06 must occur after W05 and W01.

Implement:
- Normal Live Operations;
- Emergency / Recovery;
- Maintenance / Developer;
- pre-run room setup inside the same Teacher runtime.

Preserve existing bound control nodes where practical. Do not destroy/recreate controls merely to change view.

Gate should include:
- Teacher token survives navigation;
- room/run identity survives;
- polling continues once;
- no duplicate event listener/RPC firing;
- existing supported controls still function;
- back navigation returns to the same run.

### Step 12 — W09-C Teacher UI-state preservation

After the internal views exist, protect:
- current Teacher internal view;
- detail expansion;
- local selection state where applicable;
- focus/scroll if actively edited.

This is safer than trying to implement Teacher-view preservation before the Teacher views exist.

## 6. W11 placement

### Step 13 — W11 low-risk text/UI cleanup

Agree with CA: do this after structural work settles.

Also add explicit bilingual-overflow checks here:
- 1366px;
- ~900px;
- long paired Chinese/Dutch button labels;
- internal panel/table/button overflow.

## 7. GA modification: add a pre-W12 integrated checkpoint

GA does **not** recommend making W12 the first time the fully recomposed frontend is tested as an integrated whole.

Before adding a global transition state machine, create a named checkpoint:

### Step 14 — I0 pre-transition integrated checkpoint

Run a broad deterministic regression **without W12**.

Purpose:
- prove W05/W03/W01 + Player shell + Pocket + Library + Teacher recomposition work together;
- freeze a rollback SHA before introducing global transition presentation behavior;
- distinguish “frontend recomposition regression” from “W12 scene-identity/state-machine regression”.

This is not a new workload item; it is an early slice of W13 verification effort.

Minimum I0 coverage:
- ACT1→ACT14 deterministic journey;
- reconnect;
- discussion across generic/Sprint5/Sprint6;
- Pocket inspect/flip/share/reconnect;
- Teacher main/Emergency/Maintenance navigation;
- anchor-bearing scenes;
- browser console/network errors.

Responsive proof can be representative here; full matrix remains W13.

## 8. W12 placement

### Step 15 — W12 generic 2-second Scene Transition

GA agrees it belongs late, but only **after I0 PASS**.

Before implementation, define one presentation-only scene-key adapter covering:
- Sprint3b;
- Sprint5;
- Sprint6;
- completion.

Required client state:
`lastCommittedSceneKey → pendingSceneKey → overlay(2s) → committedSceneKey`

Explicit suppression:
- first authoritative render;
- reload/reconnect restoration;
- polling of the same scene;
- phase-only change within the same scene;
- ACT12 cinematic/blackout collision;
- GRAB-specific cinematic collision.

Gate:
- exactly one overlay for a real scene change;
- approximately 2 seconds;
- no duplicate overlay from 1.2s polling;
- no false overlay on reconnect;
- no loss of Player session/input state.

## 9. Final W13

### Step 16 — W13 final integrated regression + new frozen baseline

After W12 passes targeted tests:

- full E1-equivalent deterministic browser regression;
- responsive matrix 1920×1080 / 1366×768 / ~900px;
- page-level and local overflow checks;
- interaction-state preservation under polling;
- discussion;
- Pocket;
- Library;
- Teacher views;
- anchor/overlay geometry;
- scene transition;
- ACT14 completion/reconnect;
- new frozen integrated SHA;
- targeted CA closure;
- successor Manual Acceptance plan;
- human acceptance;
- then E2.

## 10. Parallelism decision

For the stated objective — safest debugging with maximum fault isolation — GA recommends **no concurrent runtime implementation** across the high-coupling sequence.

Safe parallel activity may be limited to:
- drafting test cases/evidence templates;
- preparing non-merged localization copy;
- reviewing existing coverage.

Do not concurrently edit:
- `src/game/app.js` from multiple packages;
- `teacher-console.js` while W01/W05 semantics are unsettled;
- shared CSS/DOM shell while Pocket migration is in progress.

## 11. Proposed final order

```text
0   Freeze known baseline / old-layout smoke

1   W05  Teacher operational-location projection
2   W03  GRAB authoritative automatic leave
3   W01  Teacher-paced Discussion lifecycle

4   W02-A Player structural no-op shell
5   W10   Player identity/runtime header
6   W02-B Discussion visual adapter + responsive shell
7   W09-A Discussion draft/focus/scroll preservation

8   W04   Pocket renderer migration
9   W09-B Pocket interaction-state preservation
10  W08   Five-slot Library lock

11  W06   Teacher Console same-runtime recomposition
12  W09-C Teacher UI-state preservation
13  W11   low-risk bilingual/text cleanup

14  I0    pre-transition integrated regression checkpoint
15  W12   2-second scene-transition presentation layer
16  W13   final integrated regression + new frozen baseline
```

## 12. First future CD authorization if CA concurs

If CA materially concurs and Teacher later authorizes resuming CD discussion, GA recommends **W05 only** as the first bounded authorization.

Stop condition:
- W05 implementation only;
- targeted operational-location tests pass;
- reconnect projection pass;
- exact checkpoint SHA/evidence returned;
- CD stops;
- no W03/W01/UI work begins without a new release.

This document itself creates no CD authorization.
