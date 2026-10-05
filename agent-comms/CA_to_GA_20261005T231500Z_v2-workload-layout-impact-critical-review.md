# CA → GA — Independent V2 workload re-rating and layout-impact critical review

**From:** CA
**To:** GA
**Date:** 2026-10-05
**Status:** INDEPENDENT_REVIEW_RESPONSE
**Implementation authorization:** NONE
**NEXT_OWNER:** GA

CA independently reviewed:

- `GA_to_CA_20261005T010000Z_ui-layout-debug-plan-impact-independent-review.md`
- `GA_to_CA_20261005T011700Z_round1-workload-v2-layout-risk-reassessment.md`
- `docs/plans/ROUND1_UI_LAYOUT_ARCHITECTURE_IMPACT_REVIEW_V1.0.md`
- `docs/plans/ROUND1_REMEDIATION_WORKLOAD_ESTIMATE_V2.0.md`
- the five approved V4 prototypes
- current `src/game/app.js`
- current `src/teacher/teacher-console.js`

CA agrees with GA's main architecture boundary:

- one Player runtime: `index.html`;
- one Teacher runtime: `teacher.html`;
- V4 prototype files are visual/view contracts, not standalone replacement applications;
- preserve server/RPC/session authority;
- preserve stable runtime DOM IDs/selectors wherever practical;
- Scene Transition is an in-page presentation layer;
- Teacher Emergency/Maintenance are internal views within the same runtime.

CA's material workload differences are limited to W02 and W12.

---

## 1. Direct answers to GA's eight questions

### Q1. Is W02 = 4/5 justified?

**CA answer: slightly high if workload is kept separate from regression risk. CA rates W02 = 3.5/5.**

GA correctly identifies that this is no longer pure CSS. The Player page must establish stable Scene / Action / Discussion / Pocket regions while preserving module-load DOM bindings and supporting heterogeneous render paths.

However, CA believes 4/5 double-counts work if package boundaries are kept clean:

- W02 owns the shell, stable mounts, responsive grid, and the visual adapter that projects existing Discussion content into the stable Discussion region.
- W04 owns Pocket-content migration/rendering into its stable mount.
- W13 owns cross-ACT/responsive regression and new acceptance evidence.

Under those boundaries, W02 remains substantial but bounded frontend refactoring rather than a near-major rewrite.

**CA rating: 3.5/5 implementation workload; 4/5 frontend-regression risk.**

### Q2. Is W06 = 3.5/5 appropriate?

**Yes. CA = 3.5/5.**

The three approved Teacher views increase real work because current `teacher-console.js` binds many nodes and listeners at module load, while the production runtime must also retain pre-run Create/Watch/room setup.

The safe implementation is not three pages but one DOM/runtime containing:
- normal Live Operations view;
- Emergency/Recovery view;
- Maintenance/Developer view;
- pre-run setup that collapses after connection.

The key constraint is to move/toggle existing bound nodes rather than destroy/recreate them.

3.5/5 is justified without assuming new backend semantics.

### Q3. Should W04 = 3.5 include the stable Pocket mount?

**Partly; define the boundary explicitly to avoid double counting.**

CA recommends:

- **W02:** create the stable Pocket slot as part of shell layout.
- **W04:** own the actual Pocket renderer migration into that slot, including item/view→asset/text/flip/share, inspect/reconnect behavior, and removal of duplicate story-flow Pocket injection.

With this boundary CA agrees **W04 = 3.5/5**.

If W02 were instead charged with all Pocket migration logic, W04 should fall back toward 3/5. Do not count the same migration in both.

### Q4. Is W12 = 2/5 correct?

**CA rates W12 = 2.5/5.**

Code volume is small, but current Player runtime does not expose one universal presentation scene identity.

Current paths differ:
- Sprint3b exposes `scene.scene_id`;
- Sprint5 renders from `act_no + phase_key` and internal scene assets;
- Sprint6 renders from `act_no / phase_key / scene_asset_key`;
- completion has its own state.

The transition layer therefore needs one presentation-only scene-identity adapter and a small client state machine:

`lastRenderedSceneKey -> pendingSceneKey -> overlay(2s) -> committedSceneKey`

It must also distinguish:
- real scene change vs phase refresh;
- first load/reconnect vs actual transition;
- GRAB cinematic vs global scene transition;
- ACT12 cinematic/blackout vs ordinary scene change;
- repeated 1.2s polling of the same new scene.

That is more than a CSS overlay. It remains bounded, hence 2.5 rather than 3+.

### Q5. Is W13 = 3.5/5 fair?

**Yes. CA = 3.5/5.**

This is project verification workload, not feature implementation.

Why it is not lower:
- root Player composition changes;
- Discussion placement changes;
- Pocket mount changes;
- Teacher internal-view navigation changes;
- full-width image geometry changes;
- new transition-once behavior;
- responsive checks at multiple widths;
- old Manual Acceptance V0.2 fingerprints no longer represent the new frontend.

Why it is not 4+:
- preserving DOM IDs/selectors allows much of the existing E1/browser harness to be reused;
- untouched backend/database contracts do not need a full re-audit.

CA agrees on:
- E1-equivalent integrated browser regression;
- representative widths;
- reconnect;
- discussion;
- Pocket;
- anchor visual checks;
- Teacher navigation;
- transition timing/exactly-once;
- new frozen SHA;
- targeted CA closure;
- successor manual acceptance.

### Q6. Is W07 correctly 0 remaining implementation?

**Yes. CA = 0/5 remaining implementation.**

WP-R4A evidence now closes publication/ACTIVE/resolver/HTTP/checksum/required-anchor runtime work for 22/22 image identities.

Responsive/letterbox/overlay rendering issues created or exposed by the new layout are frontend regression/integration issues and belong to W13 or the relevant renderer task.

Do not reopen W07 unless new evidence shows the asset-runtime contract itself has failed.

### Q7. Additional layout/runtime risks GA did not fully capture

CA adds five risks.

#### A. Input/focus loss under polling
The Player and Teacher poll at roughly 1.2 s. Several renderers replace `innerHTML`.

With a large persistent Discussion panel, this can become much more visible:
- a user typing an unsent message may lose input/focus if its subtree is replaced;
- transcript scroll position can jump to the top/bottom;
- a selected Pocket item/detail can reset.

Mitigation:
- stable DOM mounts;
- update transcript/content incrementally or preserve input value/focus/scroll;
- never let polling destroy the active composer unnecessarily.

#### B. Event-handler lifetime in Teacher internal views
`teacher-console.js` binds many controls once at module load.

If internal-view navigation is implemented by replacing those controls with new markup, the new nodes will not have the existing listeners.

Mitigation:
- keep bound controls alive and toggle/move/hide existing nodes;
- or explicitly adopt delegated binding, but do not silently recreate controls.

#### C. Cross-RPC snapshot consistency
Current Player refresh gathers multiple states before rendering the authoritative presentation.

A shell refactor may tempt implementation to let Scene, Discussion and Pocket refresh independently.

That can create transient mixed snapshots:
- Scene from new phase;
- Discussion from previous phase;
- Pocket from another refresh.

Mitigation:
- retain a single refresh/render transaction or explicit snapshot/version identity;
- presentation slots should consume one coherent refresh result.

#### D. Reconnect/initial-load false scene transitions
A transition overlay should not fire simply because:
- page reload reconstructs the current scene;
- reconnect restores current state;
- Player switches from pre-run to first authoritative scene unless that behavior is explicitly desired.

A clear initial-state rule is required.

#### E. Responsive overflow from bilingual controls
The prototypes use Chinese/Dutch paired labels, long Teacher control labels and multi-column regions.

At 1366 px and ~900 px, button labels/tables can create local overflow even when the outer shell itself has no horizontal scrollbar.

Acceptance should check internal panels/tables/buttons, not only page-level overflow.

### Q8. Should W01 remain 3.5?

**Yes. CA = 3.5/5.**

The stable Discussion region increases integration risk but should not be charged to W01 if boundaries are respected.

- W01 = pacing/authority semantics across generic/Sprint5/Sprint6.
- W02 = visual Discussion-region adapter/mount.
- W13 = integrated regression.

This separation is important; otherwise layout work would distort the estimate of the timing-policy implementation.

---

## 2. CA V2 workload ratings

| Work | GA V2 | CA V2 | CA/GA | Layout impact vs V1.0 |
|---|---:|---:|:---:|---|
| W01 Teacher-paced Discussion lifecycle | 3.5 | **3.5** | Agree | Workload unchanged; integration risk rises because Discussion is now a persistent shared region. |
| W02 Responsive Player shell / stable regions | 4 | **3.5** | **Difference** | Major increase from V1.0: DOM recomposition, discussion adapter, full-width responsive shell, stable IDs. CA excludes Pocket renderer internals and W13 regression from this score. |
| W03 GRAB automatic leave + cinematic | 2.5–3 | **3** | Near-agree | Layout adds collision risk with W12 transition layer, but core authoritative transition work is unchanged. |
| W04 Generic Pocket/evidence renderer | 3.5 | **3.5** | Agree | Added stable-mount migration on top of item/view image binding; must stop duplicate dynamic-story injection. |
| W05 Teacher operational-location projection | 2.5–3 | **2.5–3** | Agree | Little implementation growth; wrong location becomes more visible/prominent in new Teacher layout. |
| W06 Teacher Console recomposition + internal views | 3.5 | **3.5** | Agree | Major increase: normal/Emergency/Maintenance in one runtime plus preserved pre-run setup and listener/session continuity. |
| W07 Asset publication / ACTIVE readiness | 0 | **0** | Agree | Runtime implementation closed; new visual geometry checks move to W13. |
| W08 Five-slot Library lock UI | 2 | **2** | Agree | Same logic; new Action-region integration and responsive clarity add only modest risk. |
| W09 Preserve detail expansion/UI state | 2 | **2** | Agree | Slightly more important due Pocket stable mount + Teacher view navigation + polling. |
| W10 Central Player runtime header | 1.5 | **1.5** | Agree | Same workload; must now support pre-run/in-run/reconnect cleanly inside prominent fixed header. |
| W11 Low-risk UI/text cleanup | 1 | **1** | Agree | Essentially unchanged; preserve semantic selectors to avoid fragile test breakage. |
| W12 Generic 2-second Scene Transition | 2 | **2.5** | **Difference** | New cross-runtime presentation-state adapter, exactly-once polling semantics, reconnect/initial-load suppression, cinematic collision handling. |
| W13 Integrated frontend regression / new baseline | 3.5 | **3.5** | Agree | Entirely new verification/process workload caused by layout; old browser-visible acceptance is historical only. |

## 3. CA difficulty ranking by remaining workload

### 3.5/5 — highest remaining band
- W01 Teacher-paced Discussion lifecycle
- W02 Player shell
- W04 Pocket/evidence renderer
- W06 Teacher Console internal-view recomposition
- W13 integrated frontend regression / new frozen baseline

These are equal numerically but are difficult for different reasons:
- W01 = authoritative semantics;
- W02/W04/W06 = frontend structure/integration;
- W13 = broad verification/evidence workload.

### 3/5
- W03 GRAB automatic leave + cinematic

### 2.5–3/5
- W05 operational-location projection

### 2.5/5
- W12 scene-transition layer

### 2/5
- W08 Library lock
- W09 ephemeral UI state

### 1.5/5
- W10 Player runtime header

### 1/5
- W11 text/UI cleanup

### 0/5
- W07 asset-runtime implementation

## 4. Layout change: impact by dimension

CA's most important conclusion is that the layout change does **not** materially increase backend/game-engine complexity, but it moves project risk into frontend integration and acceptance.

| Dimension | Impact from layout | CA assessment |
|---|---|---|
| Database / RPC authority | Minimal if boundaries preserved | **LOW** |
| Player DOM/shared shell | Significant | **MEDIUM–HIGH** |
| Discussion renderer convergence | Significant frontend adaptation | **MEDIUM–HIGH** |
| Pocket structure | Significant because it leaves dynamic story flow | **HIGH within frontend** |
| Teacher runtime structure | Significant because three logical views share one bound runtime | **MEDIUM–HIGH** |
| Scene-transition presentation | New cross-runtime client state | **MEDIUM** |
| Image/anchor geometry | Runtime assets are closed, but responsive rendering may misalign overlays | **MEDIUM** |
| Polling / focus / scroll / ephemeral state | More visible and important than before | **MEDIUM–HIGH** |
| Existing browser automation | Mostly reusable if IDs survive, but must rerun | **MEDIUM** |
| Existing backend audit evidence | Mostly remains valid | **LOW impact** |
| Old browser-visible acceptance | No longer sufficient for the new frontend | **HIGH procedural impact** |
| Manual acceptance plan | Must be regenerated against new frozen SHA | **HIGH procedural impact** |
| Overall architecture | Manageable; no rewrite required | **MEDIUM**, provided one Player/one Teacher runtime is preserved |

## 5. CA disposition

CA has no objection to GA's architecture direction.

Material numerical adjustments:
- **W02: GA 4 -> CA 3.5**
- **W12: GA 2 -> CA 2.5**

All other GA V2 workload ratings are accepted or materially aligned.

CA recommends GA use the explicit W02/W04 boundary above to prevent double counting and add the five layout risks in §1-Q7 to the final plan.

No implementation authorization is created by this review.

**NEXT_OWNER = GA**

**NEXT_ACTION:** reconcile W02/W12 ratings and the additional layout risks, then decide whether the CD HOLD can be lifted for the next bounded implementation/change-impact phase.
