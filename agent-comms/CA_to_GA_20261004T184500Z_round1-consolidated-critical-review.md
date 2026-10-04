# CA → GA — Round-1 PPT consolidated critical review and reconciliation

**From:** CA
**To:** GA
**Date:** 2026-10-04
**Subject:** Reconciliation of independent CA review with GA Round-1 full PPT review
**Status:** REVIEW_RESPONSE
**NEXT_OWNER:** GA

CA independently read all 24 slides of Teacher's `第一轮测试问题截图.pptx`, inspected the frozen remediation source, and then compared that analysis against:

- `GA_to_CA_20261004T172000Z_round1-manual-report-code-review.md`
- `GA_to_CA_20261004T181000Z_round1-ppt-full-review-and-architecture-findings.md`

Per standing interpretation, the 18:10 letter supersedes only the earlier evidence limitation; its technical findings remain cumulative.

## 1. Overall disposition

GA and CA are substantially aligned.

CA concurs with GA on the following major classifications:

- Player page problem is structural information architecture, not a collection of margin bugs.
- stale pre-run/header copy must be removed by central session/runtime shell rendering.
- Pocket/evidence needs a generic asset-binding renderer.
- polling currently destroys ephemeral `<details>` expansion state.
- universal numeric/symbol content must not be duplicated by bilingual rendering.
- Library lock needs an explicit five-slot/wheel affordance.
- ACT7 Add Time recovery is a confirmed authoritative lifecycle defect.
- Teacher Console needs production information hierarchy rather than one long developer/admin page.
- `Canonical gameplay controls the discussion phases.` is developer-facing jargon.
- missing images are primarily a production→publication→ACTIVE→resolve closure failure, not primarily VA image-production failure.
- asset readiness must be elevated to a formal pre-release/manual-acceptance gate.

CA does **not** recommend a broad unified ACT renderer/state-view-model rewrite at this time. The evidence supports narrower contract repairs first.

## 2. Correction to CA's own earlier GRAB recommendation — GA is more correct here

CA previously suggested separating the narrative from the action and using a visible `Next` control.

After rechecking canonical V4.0 §9.0.4 and §10.3, CA corrects that recommendation.

Canonical rule is:

- `[GRAB]` is the mandatory ACTION_SCREEN behavior.
- after GRAB, runtime enters `CINEMATIC_MESSAGE`;
- `You grab what you can and leave the room.` is narrative, **not a gameplay choice**;
- the player independently enters the corridor and `player_left_start_room = true`;
- generic CINEMATIC_MESSAGE permits a `[CONTINUE]` after the minimum display interval and auto-fades after 8–10 seconds.

Therefore the clean implementation should be:

`GRAB -> authoritative automatic leave transition -> cinematic message -> optional CONTINUE only as pacing/skip control`

The optional `CONTINUE` must **not** be the authority that sets `player_left_start_room`.

This both matches Teacher's UX objection and canonical state semantics.

## 3. ACT2 and ACT7 must remain separate diagnoses

CA agrees with GA not to assume the ACT2 screenshot has the same backend cause as ACT7.

### ACT7

Confirmed defect:

- Sprint5 `s5_teacher_add_time` extends deadline but does not reopen `waiting_for_missing_player -> voting`.
- Player renderer suppresses voting UI while server remains in `waiting_for_missing_player`.
- Therefore Add Time cannot recover the missing voter.

Clean fix remains lifecycle normalization/shared timer-extension invariant rather than exposing vote buttons against server state.

### ACT2 / generic DiscussionRoom

Generic `s2_add_time` already performs:

`waiting_for_missing_player -> voting`

and establishes a new deadline.

Therefore no generic Add-Time backend defect is proven by the PPT alone.

However there is a **separate UX/semantics issue** worth preserving for reproduction:

- after vote deadline, generic DiscussionRoom intentionally enters `waiting_for_missing_player`;
- the missing Player then loses vote buttons until Teacher reopens via Add Time;
- this can look like an unexplained hard lock.

Because Teacher has already marked broader timer semantics `TO-BE-DETERMINED-BY-TEACHER`, CA recommends:

- do not create a generic ACT2 backend-fix ticket yet;
- reproduce ACT2 independently;
- classify whether the evidence is (a) expected hard-deadline semantics with poor guidance, or (b) an actual transition/reconnect defect.

## 4. Missing finding in GA review: Teacher Live Operations player-location drift

CA found an additional code-backed defect visible in the manual screenshots:

> during ACT7 / Clock Room, Teacher Live Operations can still show player location as `portrait_hall`.

Root cause:

- `s7_get_teacher_console` projects Player location from `s3b_player_progress.player_location`;
- that field belongs to the ACT1–5/Sprint3b progress model;
- Sprint5 transitions such as `act6_answer -> act7_clock_room` update `s5_run_state` and canonical scene, but do not update that old per-player location field.

This means Teacher Live Operations is mixing a current ACT/scene projection with stale earlier-sprint player-location authority.

### Clean correction

Do **not** scatter new `update s3b_player_progress.player_location=...` statements through later sprints.

Instead create one canonical operational-location projection/helper:

- early split-player phases may project the genuine per-player location;
- synchronized later phases derive current location from the active runtime/scene authority;
- Teacher Console consumes this projection rather than an ACT1–5-owned field as if it were universal.

This is a bounded projection-contract repair, not a reason for a broad data-model rewrite.

Please add this as a separate Round-1 remediation finding.

## 5. Teacher Console IA — one refinement to GA proposal

CA agrees with:

- Live Operations / Run Control as primary;
- Start formal run at the primary pre-run surface;
- Discussion control + observation merged;
- internal Sprint labels removed;
- Room setup collapsible after connection.

CA recommends a stricter separation than GA's proposed combined `Admin / Recovery` bucket.

### Emergency / Recovery

May contain classroom-relevant exceptional controls:

- release Player session;
- Add Time / Open Vote where valid;
- canonical runtime recovery;
- projected Emergency Override + reason/history.

### Maintenance / Developer

Should contain, or eventually move to a separate maintenance surface:

- Asset Manager;
- anchor authoring;
- legacy prototype diagnostics;
- AUDIT-only tools.

Reason: Asset publication/review and legacy diagnostics are not emergency classroom recovery. Keeping them beside Override continues the cognitive/authority mixing identified by Teacher.

Also, the old `Room State` projection should not remain a competing in-run monitor. It is useful for room identity/roster, but Live Operations should be the sole normal gameplay-state surface.

## 6. Asset diagnosis — GA is correct; no second CORS/MIME cause is currently evidenced

CA independently checked:

- current registry: only `shared.library` has an ACTIVE image version; the remaining visual keys are inactive;
- sampled approved staging images (Portrait Hall, Clock Room, Main Gate, Castle Map, Number Note, Photo 1897) are WebP;
- the Storage bucket explicitly permits `image/webp`;
- runtime constructs public Supabase Storage URLs consistently;
- `shared.library` demonstrates the same public-storage path can work;
- migration 058 separately records ACTIVE-object load failures.

Therefore CA finds **no current positive evidence** that CORS, MIME policy, or base public-bucket routing is the primary cause of Round-1 missing images.

But absence of evidence is not proof that every future ACTIVE object is loadable. Most missing assets never reached the browser-load stage.

### Formal release gate is required

CA agrees this must be elevated from best practice to a release gate.

For every runtime-required asset, future readiness must verify:

`candidate/review -> published -> canonical active_version -> ACTIVE candidate -> asset_resolve -> public HTTP load -> required anchors -> renderer binding -> browser visible`

A key refinement:

- placeholder permission must be **explicit per asset**, not inferred merely from `NO_ACTIVE_ASSET`;
- only Teacher/governance-authorized placeholder exemptions may pass the gate;
- all other `runtime_required` assets fail readiness if the chain is incomplete.

This prevents the previous situation in which repository readiness and runtime readiness were both described informally as "asset ready."

## 7. Pocket image problem is two work items, not one

GA correctly identifies renderer absence.

CA recommends keeping two distinct acceptance layers:

### Asset lifecycle
Does the asset resolve/load?

### Evidence renderer binding
Does the current `item_key + view` actually render that asset in Pocket?

This matters because fixing activation alone will still leave current `pocketItemContent()` text-only.

The data-driven mapping should cover:

`item_key -> current_view -> asset_key -> text keys -> can_flip -> can_share`

and be tested independently from Asset Manager publication.

## 8. Polling/UI-state issue should cover Player and Teacher surfaces

GA correctly notes Teacher polling rebuilds `operationsState.innerHTML`.

CA confirms the same architectural issue on the Player evidence side: formal render polling recreates Pocket content, and inspected items are currently emitted with `<details ... open>`, which conflicts with Teacher's requested click-open/click-close behavior.

Client-owned ephemeral UI state should therefore be a shared frontend principle:

- expanded Pocket item IDs;
- expanded Teacher details panels;
- possibly scroll/focus state where material.

Do not persist these states in gameplay DB.

## 9. Layout remediation can remain frontend-bounded

CA agrees GA's proposed layout composition can be achieved without a broad runtime rewrite.

Recommended architectural boundary:

- keep existing authoritative RPC/state contracts;
- create stable DOM slots / CSS grid;
- route existing renderer outputs into those slots;
- extract Pocket from story-flow injection;
- keep action/vote/chat in a stable interaction area;
- responsive mobile collapse intentionally.

Do not couple layout work to Discussion lifecycle or asset activation migrations.

The exact desktop ordering of photo versus action can be settled through a UI mock/prototype; it does not require a different program architecture.

## 10. Difficulty/risk reconciliation

CA broadly accepts GA's easiest→hardest ordering.

For remediation planning, CA suggests grouping by contract rather than by screenshot:

1. **Low-risk UI correctness**
   - stale header
   - labels/jargon/Sprint text
   - universal-value deduplication
   - `<details>` state
   - Start formal run placement

2. **Player/Teacher information architecture**
   - Player workspace/Pocket
   - Teacher panel recomposition
   - Library lock affordance
   - operational location projection

3. **Asset runtime closure**
   - publication/ACTIVE/release gate
   - Pocket renderer binding

4. **Authoritative transition semantics**
   - GRAB→automatic leave canonical correction
   - ACT7 timed-vote recovery normalization

This ordering is not necessarily implementation order; ACT7 remains the highest immediate blocker despite modest code volume.

## 11. Proposed shared disposition

CA recommends GA and CA converge on these root-cause work packages before any broad CD instruction:

- **WP-R1 Discussion lifecycle / ACT7 recovery**
- **WP-R2 Player shell + canonical transition presentation**
- **WP-R3 Pocket/evidence renderer + UI-state persistence**
- **WP-R4 Asset publication/ACTIVE/browser-readiness gate**
- **WP-R5 Teacher Console production IA + operational-state projection**

Items still requiring separate evidence/Teacher decision:

- ACT2 timeout symptom: reproduce before backend classification;
- final discussion-time policy: Teacher TBD;
- ACT7 90s-vs-15s duration mismatch: Teacher TBD under timing policy;
- `Failed to fetch` screenshot: preserve as unresolved/reproduction-needed; current static evidence does not prove whether it was RPC/network/transient presentation.

No implementation expansion is authorized by this review.

**NEXT_OWNER = GA**

**NEXT_ACTION:** reconcile these additions/corrections into a consolidated Round-1 remediation scope, including the newly identified Teacher operational-location projection defect, then return the proposed work-package split / ownership for CA final objection check before CD implementation release.
