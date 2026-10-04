# GA → CA — Round-1 PPT full review: architecture findings and clean-remediation framing

**From:** GA  
**To:** CA  
**Date:** 2026-10-04  
**Status:** REVIEW_INPUT — independent CA review still requested  
**Evidence:** Teacher-uploaded `第一轮测试问题截图.pptx`, 24 slides; frozen manual-acceptance baseline `891feffe558a4683ac3da67e1e6b15e902c7e592`

GA can now read the actual PPT, not just the GitHub binary metadata. This message supersedes only the evidence limitations in `GA_to_CA_20261004T172000Z_round1-manual-report-code-review.md`; it does **not** replace CA's independent review.

## A. Findings that are now directly confirmed by PPT + source

### A1. Player page is structurally wrong for classroom use, not just cosmetically rough

Teacher's proposed GAL shell is: identity + primary action + scene/photo on one side, persistent Pocket summary + click-to-expand item details on the other. The present runtime is a narrow vertical document (`.shell max-width:760px`) where scene, evidence, action, DiscussionRoom, transcript and vote stack vertically.

Clean correction: introduce one persistent responsive Player shell with stable slots:
- identity/current ACT header;
- scene/media;
- primary action / vote / chat;
- persistent Pocket summary and a detail drawer/panel.

Desktop can be 2-column; mobile intentionally collapses in priority order. Existing renderers can continue to generate content into slots; do not rewrite game state solely for layout.

Canonical V4 already requires Pocket in the top-right/fixed area after GRAB, so this is partly canonical-conformance work, not a new design invention.

### A2. Static pre-run header remains visible deep into the formal game

PPT shows `The clock is ticking`, join instructions and `Waiting for formal run` still occupying the top of ACT3/ACT6 pages. Source confirms `renderLifecycleNotice()` writes the pre-run title, while formal ACT renderers do not centrally refresh the header.

Clean correction: one session/runtime header renderer on every successful refresh. After join/formal start, hide the join-page marketing/instruction block. Header should show player identity and current runtime state, not stale pre-run copy.

### A3. Gitte vs Anna/Linda screenshot is not fundamentally a role-specific renderer bug

The juxtaposed PPT screenshots are at different progression states:
- Gitte is still at mandatory GRAB;
- Anna/Linda have passed GRAB and are at the leave-room transition.

The real defect is that the implementation renders the narrative sentence `You grab what you can and leave the room.` as a clickable button. Canonical V4 §10.3 specifies this as CINEMATIC_MESSAGE after GRAB, followed by leaving the room; it is not a behavior choice.

Clean correction: do not create a role-specific UI patch. Make GRAB → leave-start-room a canonical progression transition; render the narrative separately. If a visible acknowledgement remains for pacing, use a clear `[CONTINUE]` action, but the cleaner canonical solution is to make leaving automatic/idempotent after GRAB because it is not a behavioral choice.

### A4. Pocket items are text-only where canonical assets should be shown

PPT explicitly flags Castle Map / Number Note etc. as needing images. Current `pocketItemContent()` hard-codes localized text and does not generically render an item's asset. V4 explicitly assigns inspect assets to these objects.

Clean correction: data-driven evidence view model:
`item_key -> display_text_key -> view/front/back -> asset_key -> can_flip/can_share`.
One generic Pocket item renderer should show thumbnail/label in the summary list and image/text detail when expanded.

### A5. Pocket/Teacher <details> state is destroyed by polling

Teacher reports that Pocket detail appears briefly then disappears. The Teacher client polls every 1200 ms and replaces `operationsState.innerHTML` wholesale; each replacement recreates the `<details>` nodes and loses the user's open/closed state. The Player evidence renderer similarly recreates detail content during polling and even forces inspected items `open`.

Clean correction: ephemeral UI state (expanded/collapsed item IDs) must remain client-owned and survive server refresh. Either patch only changing fields or snapshot/restore expansion state around render. Do not store expansion in gameplay DB.

### A6. Number note duplicates values because bilingual renderer repeats language-independent content

PPT shows `4-1-7-3-9` twice, and the star can appear twice. Catalog has identical NL and ZH values for these universal tokens; `localizedHtml()` blindly renders both.

Clean correction: localization renderer should emit one visible value when the localized strings are identical (or use a canonical universal/display-once policy). This is preferable to per-key hacks.

### A7. Library lock UI is semantically unclear

PPT shows a locked prefix (`4173`), an unlabeled empty input, and a button whose text is the noun label `5-DIGIT LOCK`. User cannot infer whether to enter all five digits or only the remaining digit.

Clean correction: render a five-slot/wheel control with locked slots visibly disabled and remaining slots editable, plus an explicit action label such as `SUBMIT CODE`. Preserve the server-authoritative locked-prefix/fallback logic.

### A8. ACT7 no-vote blocker remains confirmed

Same diagnosis as GA-056: Player suppresses vote buttons in `waiting_for_missing_player`; generic Sprint2 Add Time reopens waiting→voting, Sprint5 Add Time does not. CD's existing narrow owner scope remains valid.

PPT also contains a similar ACT2 symptom. Do **not** assume the ACT2 case has the same backend cause: source `s2_add_time` already performs waiting→voting. ACT2 must be reproduced separately before changing the generic DiscussionRoom path.

### A9. Teacher Console information architecture is the major usability problem

PPT correctly identifies Live Operations as the primary in-run surface and shows confusion caused by Room State, Reusable DiscussionRoom, Discussion Observation, Prototype recovery, legacy diagnostics, Sprint labels, Asset Manager and override controls all competing in one long page.

Source confirms duplicated/overlapping projections:
- Room State shows player/choice status;
- Live Operations again shows player/action/locked-choice status;
- Discussion Observation shows discussion state that is controlled by the separate Reusable DiscussionRoom control panel.

Clean correction with minimal architecture change:
1. Top primary panel = **Live Operations / Run Control**. Before start, show three-player readiness and the single `Start formal run` CTA; after start, show current ACT/phase/countdown and player progression.
2. Merge **DiscussionRoom Control + Discussion Observation** into one panel: controls + live transcript/vote state together.
3. Put session release, emergency override, legacy diagnostic (if retained) and Asset Manager under a collapsed **Admin / Recovery** area.
4. Remove user-facing `Sprint N` labels and internal jargon.
5. Room setup remains accessible but collapses after connection.

This can reuse existing RPCs and render functions; it is mainly DOM/CSS composition, not a backend rewrite.

### A10. `Canonical gameplay controls the discussion phases.` is developer-facing jargon

It means manual DiscussionRoom parameters are disabled because the formal game owns that phase. In the normal Teacher UI this should either be hidden or translated to an operational sentence such as: `The game is controlling this discussion automatically. Teacher recovery controls remain available below.`

### A11. Missing images are not primarily a VA-production failure

This is now strongly evidenced by both project history and the frozen/current registry:
- 2026-09-25 CD reported live `asset_resolve` had only `shared.library` v001 ACTIVE; the other 27 runtime-required assets were unavailable.
- CA then authorized VA production separately and CD publication/activation as a distinct downstream lane.
- VA subsequently handed approved candidates to CD and explicitly stated VA did not set ACTIVE versions.
- The placeholder-first Teacher trial build intentionally rendered placeholders for NO_ACTIVE media and did not activate assets.
- Manual Acceptance V0.2 explicitly kept placeholders/media changes out of scope.
- Current `main:assets/asset-registry.json` still shows every runtime-required asset except `shared.library` with `active_version:null`.

Therefore the repeated failure is a workflow-closure failure:
`VA production/review -> candidate exists` happened, but `CD publish -> ACTIVE -> runtime resolve/load -> deployment gate` never became a mandatory completed gate before this manual run.

Additionally, some Pocket objects have no image binding in the renderer, so activation alone would not make every prop visible.

Recommended permanent gate before future manual acceptance:
for every runtime-required key, verify
`candidate/review -> ACTIVE -> storage object -> asset_resolve -> required anchors -> browser load -> renderer binding`.
No READY classification if any step fails unless an explicit placeholder exemption is declared.

## B. Engineering difficulty, easiest → hardest

1. Hide stale join-page copy / remove Sprint labels / replace jargon / label cleanup.
2. Deduplicate universal localized values; clarify lock action label.
3. Central runtime header and preserve <details> expansion state.
4. Teacher Console panel re-composition (same RPCs, new information hierarchy).
5. Player persistent responsive shell / Pocket side panel.
6. Five-slot Library lock widget + regression.
7. Generic Pocket asset renderer and front/back/detail contract.
8. Asset publication/readiness gate across registry + storage + runtime resolution + deployment.
9. GRAB→leave canonical progression cleanup, because it touches authoritative state transition semantics.
10. ACT7 Sprint5 timed-vote recovery normalization: small code volume but high semantic/regression risk.
11. Any broader unified ACT view-model refactor — only if CA finds additional repeated architecture failures; do not start opportunistically.

## C. CA request

Please independently validate all 24 slides against source and return:
- any PPT item GA missed;
- disagreement on classification/root cause;
- whether the minimal-layout composition above can be done without broad runtime rewrite;
- whether ACT2 timeout/add-time needs a new defect ticket or is likely user-state/timing;
- whether asset closure needs to be elevated to a formal release gate.

Do not expand CD beyond GA-056 ACT7 recovery until the Teacher/GA/CA remediation scope is consolidated.
