# CD feasibility review — display mechanism reuse governance draft

Date: 2026-10-28  
Request: `CA_to_CD_20261028T110500Z_display_mechanism_reuse_feasibility_review.md`  
Disposition: draft direction is sound, but it overstates current common routing and should not authorize a blanket presentation-contract refactor. P7 closure was completed first.

## Effective caller inventory

There is one Player document and CSS grid: `index.html` owns the stable Scene, Runtime, Action, Discussion and Pocket mounts. Role differences do not select another HTML/CSS shell. Effective display variants are JavaScript branches:

- lifecycle/pre-run/start barriers: `renderLifecycleNotice`, `renderAct5Handoff`, `renderAct6EntryBarrier`;
- ACT1–5: `renderSprint3b`, including role-specific ACT1 choices/consequence Scene mapping, ACT3 form, ACT4 comparison and post-inspection vote;
- ACT6–8: `renderSprint5`, `hydrateS5Assets`, portrait overlay, clock anchors, route/evidence variants and Sprint5 canonical discussion;
- ACT9–13: `renderSprint6`, `hydrateSprint6`, Great Hall doors, main-gate stations, discussion relocation, private/final vote and cinematic variants;
- ACT14: `renderSprint8` full-screen ending sequence;
- shared DiscussionRoom: `renderDiscussion`, `renderVote`, `renderVoteHistory`;
- shared Pocket: `pocketEvidencePanel`, `renderPocket`, `hydratePocketAssets`.

`routeFormalPresentation` remains a compatibility bridge: it relocates known visual selectors from Runtime to Scene, moves narrative/warnings from Action to Runtime, and moves Sprint6 discussion/audio controls. It is covered by current browser tests, but it is not a genuine centralized routing decision and should be named as transitional in the draft.

## Mechanism/caller/coverage matrix

| Mechanism | Shared primitive | Actual callers / exceptions | Current evidence | Recommended next step |
|---|---|---|---|---|
| Shell/regions | `index.html`, `.v4-runtime-grid` | all Player renderers; ACT14 intentionally full-screen | three roles/two viewports; ownership/action tests | keep; no new shell API |
| Scene image lifecycle | `setS5Asset`, `applyResolvedAsset`, resolver cache/state | ACT1–5 IDs, ACT4 pair, Sprint5 overlays/anchors, Sprint6 doors/stations, ACT14 exterior | delayed resolver + poll for ACT1 map/note/diary/key; existing ACT3/ACT9 gates | low-risk: add a small `hydrateCurrentImage({id,key})` naming/telemetry wrapper only when another caller changes; do not migrate overlays now |
| Scene semantic selection | inline choice/phase maps in `renderSprint3b`; phase branches in Sprint5/6 | semantics are legitimately ACT-specific | number note/map/diary/key browser cases; Sprint5/6 existing suites | document per-renderer builders; do not force one global phase map |
| Pocket | `pocketEvidencePanel`, `renderPocket`, `hydratePocketAssets`, `applyResolvedAsset` | item→asset switch and flip/share are Pocket-specific | role counts, every item decode, reconnect/flip | medium future cleanup: data table for item→asset/text/flip metadata; 1 source file + focused Pocket tests |
| Bilingual text | canonical CSV, generator, `localizedHtml`, `localizedTemplateHtml`, 11pt CSS | direct string concatenation remains in lifecycle/waiting and Teacher diagnostics; dynamic triggers remain caller-owned | exact tie/order/poll/reconnect; all-role computed 11pt | minimal: prohibit new player-facing literals and add a static inventory test; no routing API required for bulk same-key edits |
| Action controls | `actionButtons`, `s5Buttons`, generic Discussion vote renderer | three binder conventions (`data-s3b`, `data-s5`, `data-s6`) encode different RPC identity contracts; forms and Teacher actions are real exceptions | ACT3 form, Pocket actions, ACT9/10 controls, Teacher Open Vote | do not unify binders now; shared button markup helper could accidentally erase request identity/authority distinctions |
| Poll/state preservation | `setStableHtml`, draft and viewport capture/restore | Sprint3b uses stable HTML; Sprint5/6 still rebuild branch-specific trees; IME has explicit deferral | IME, discussion and Runtime scroll tests | extend stable keyed render only when a concrete Sprint5/6 remount bug is reproduced |
| Audio | Sprint6 preload/play/volume/outbox/consumption functions | no second Player audio lifecycle found; Teacher asset preview is not gameplay playback | Sprint6 policy/static/live suites, blocked-play recovery source | draft's “duplication” premise is false today; no general audio abstraction |
| Teacher | `teacher.html`, `teacher-console.js` | deliberately separate shell and authority; asset manager/dialog exception | approved-vs-source geometry, default collapse, controls | keep separate; never fit Teacher into Player presentation contract |

## Smallest safe policy for future text work

No new central routing API is needed for ordinary bulk wording edits. The lowest-risk path is:

1. edit canonical CSV rows under existing authority;
2. regenerate the catalog;
3. run a static “no new Player-facing literal” inventory plus targeted browser smoke for changed keys;
4. when a change alters region/timing, require the task record to name its renderer and target mount, then test that exact branch.

A new presentation object spanning every ACT would be high effort and high regression risk because it would mix display mechanics with distinct RPC identities, overlays, cinematics and server-authoritative phases. If later authorized, prototype only an internal `{sceneHtml,runtimeHtml,actionHtml}` adapter for one renderer, not the whole game.

## Effort/risk estimates

- Documentation/checklist and literal-inventory static test: low, 1–2 files, 1 test.
- Pocket metadata table replacing the item switch: medium, `src/game/app.js` plus 2 browser/static tests; worthwhile only with another Pocket feature.
- Removal of `routeFormalPresentation`: medium-high, `index.html`, `app.js`, CSS and at least ACT1/3/4/6/7/8/9/10/12/14 browser fixtures. Not justified immediately after P7.
- Unified action binder: high and not recommended; would touch all RPC families and request-identity tests.
- General audio abstraction: no benefit because only one gameplay implementation exists.
- Teacher/Player shell unification: prohibited in substance and high risk.

## Precise draft corrections

1. Correct “four-region” to **five-region**: Scene, Runtime, Action, Discussion and Pocket. Discussion is a first-class communication/state region and must not be folded into Action.
2. Change “Common presentation contract” to a documentation vocabulary first; code schema requires separate authorization and a measured pilot.
3. Mark `routeFormalPresentation` explicitly as a transitional selector bridge, not common core.
4. State that Scene lifecycle is shared but semantic asset selection remains ACT-specific.
5. Replace “Action widgets shared role/action semantics” with “shared markup fragments; binder and RPC identity semantics remain family-specific.”
6. Record that Sprint6 is the only gameplay audio path currently found; do not imply existing duplicate audio mechanisms.
7. Add lifecycle/barrier and ACT14 full-screen exceptions to the Registry.
8. Define catalog-only wording edits as no-JS work, but retain canonical text authority gates.
9. Make the eight-point checklist risk-based for shared/cross-region/protected changes rather than mandatory bureaucracy for ordinary approved wording or local CSS edits.
10. Require mechanism coverage to name actual renderer branches rather than “one representative per ACT group” when overlays/cinematics differ materially.

Recommendation: adopt the corrected governance/checklist after CA/GA reconciliation, but authorize no immediate refactor. Preserve the P7-tested source. The first useful implementation should be the low-cost literal inventory/static guard; defer bridge removal or binder consolidation until a separately scoped need supplies branch-complete tests.
