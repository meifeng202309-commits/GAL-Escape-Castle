# GAL Escape Castle — Display Mechanism Reuse Governance v1.0 DRAFT
Date: 2026-10-28
Status: **PROPOSED — GA/CD critical review pending; NOT YET architectural authorization**
Origin: Teacher request after Trial Run 4+5: avoid fixing same display bug separately in every role and ACT; minimize future cost of extensive text changes.

## 1. Objectives and non-objectives
1. A **single shared Player page shell** for Gitte/Anna/Linda, with role/phase content supplied as data or authorized rules. The source already shares `index.html`, `src/styles/app.css`, and `src/game/app.js`: do **not** create or physically copy three independent HTML templates.
2. Centralize repeated technical display infrastructure by *mechanism* (not story rule): region ownership; image resolution/decode/lifecycle; bilingual rendering; button generation and binding; audio lifecycle.
3. Preserve intentional ACT-specific semantics, server-authoritative phase/role/item/vote permissions, Teacher console's separate approved V4 shell, and existing tested behavior.
4. Prevent new ad hoc renderers for equivalent functions. Reuse existing code before adding a second implementation.
5. Do **not** launch a game-wide rebuild or a new approval layer for routine source edits. Focus on high-impact duplication in the Trial4+5 closure path and future text changes.

## 2. Player four-region contract (Teacher/GA approved)
- **Scene (upper-left)**: main current visual, maps, notes, diary, overlays and other specifically approved visual artifacts.
- **Runtime (below Scene, left)**: narration, explanatory bilingual messages and guidance.
- **Action (upper-right)**: active choices, buttons, forms, vote and confirm controls.
- **Pocket (approved right-side area)**: role-owned item selector/detail/front-back and associated media.
- One `index.html` layout/shared DOM mounts for all Player roles. Role and ACT affect **content and enabled actions**, never the basic structural layout.
- A region must not be populated indirectly by moving an arbitrary subtree from another region after render unless a documented temporary compatibility bridge is demonstrably necessary. If a bridge remains, it must be identified and covered by an end-to-end test.

## 3. Common presentation contract — design target, not compulsory code schema
For each authoritative phase and role, aim for a *single display routing decision* with logically distinct fields:
- `scene`: asset key(s), overlays, semantic action outcome and accessible state
- `runtime`: ordered localization keys with parameters (NL/ZH, paragraph/group structure)
- `action`: permitted action descriptors and server RPC parameters, disabled/waiting state
- `pocket`: server-projected owned items/current view and selection state
- `audio`: authorized cue keys, trigger/occurrence identity and playback state
Different ACT logic may produce this contract via different builders; **avoid imposing a blanket migration to a new object shape**. Prototype only if it genuinely reduces duplicate behavior and is compatible with existing interfaces.
The display contract must never infer ownership/permissions or generate server decisions from UI-only conditions.

## 4. Mechanism Registry — initial source-based inventory (to be verified by CD)
| Mechanism | Existing implementation / entry points | Common core | Duplicated/specialized paths to examine | Acceptance |
|---|---|---|---|---|
| Shared Player shell | `index.html`, `src/styles/app.css`, `src/game/app.js` | Four regions, shared CSS | `renderSprint3b`, `renderSprint5`, `renderSprint6`; `routeFormalPresentation` moves nodes | All roles same region structure and semantics under matched states |
| Scene assets | `trialAssetResolver.resolve`, `applyResolvedAsset`, `setS5Asset` | Asset resolution, live-node/asset-key check, decode state | Scene phase routing, overlays, `hydrateS5Assets` | All covered ACT visuals load decoded and visibly in Scene after polls |
| Pocket assets | `pocketEvidencePanel`, `renderPocket`, `hydratePocketAssets` | Shares resolver and `applyResolvedAsset` | Item-to-asset switch, inspection/flip, remount state | Each role-owned item/view selectable, decodes, preserves state |
| Bilingual text | `localizedHtml`, `localizedTemplateHtml`, canonical text catalog | Shared localization/escaping and 11pt layout | ACT-specific HTML concatenation; direct `innerHTML` and DOM relocation | Localized text editable through catalog; route target fixed by region |
| Action widgets | `actionButtons`, `s5Buttons`, phase-specific controls | Shared role/action semantics and common shell | Different `data-s3b-*` / `data-s5-*` binding conventions and direct handlers | Visible controls in Action and invoke existing authorized RPC |
| Audio | `armSprint6Audio`, `playSprint6Audio`, `markSprint6AudioConsumed` | Sprint6 preload/play/volume/consumption | Check for non-Sprint6 audio pathways before generalizing | Playback and failure recovery consistent for reused cues; no speculative audio rewrite |
| Teacher console | `teacher.html`, `src/teacher/teacher-console.js` | Approved V4 runtime shell | Distinct Teacher workflow; **not** a Player-template copy | Canonical V4 positions and controls, not just ID presence |

This Registry is a **starting map, not a claim of exhaustive call-site coverage**. CD must review all effective call sites before it is declared operational.

## 5. Required pre-change checklist (one short record in CD work notes per display-related task)
1. **Owner:** Which region/mechanism does this change affect? What is its authoritative data/permission source?
2. **Lookup:** Which Registry entry and existing functions/call sites implement it?
3. **Scope:** Which roles, ACTs, phases, variants and screen sizes call the same mechanism?
4. **Reuse:** Can an existing mechanism be extended through parameter/data/adapter rather than another renderer?
5. **Exception:** If a specialized implementation is required, distinguish real game-rule differences from accidental duplication and give the reason.
6. **Impact:** What interface, localization catalog, asset key, CSS or server authority contract may change?
7. **Regression:** Which existing and new tests demonstrate *all relevant callers* still work, not merely the original screenshot?
8. **Registry update:** If changing a shared contract or adding a path, update the Registry and mention exception/removal plan.
No individual CA/GA sign-off required for routine checklist completion; protected authorization gates remain unchanged.

## 6. Future bulk text editing — contract
- Treat localization catalog (and its approved regeneration tooling) as the source of displayed wording. Do not directly edit generated localization files.
- **Text-only change**, same keys, unchanged target region/phase/trigger, should ideally involve catalog change + generation + a targeted smoke test and should not require modifying layout JS.
- **Adding/moving text** or changing show/hide timing is a presentation-contract change: use the checklist, specify Runtime/Scene/Action owner and run affected ACT/role regressions.
- Different ACT logic can remain separate, but routing of bilingual text to the correct region and paragraph rendering should be shared where practicable.
- Keep NL and ZH separately on their own lines, with approved blank spacing and 11pt; preserve Text Catalog authority/protected review requirements.

## 7. Evidence-based reuse and test gates
For **each shared mechanism changed**, test a representative caller in each distinct rendering branch/ACT group and role-sensitive state, plus an existing known-good path. Expand when call graph shows nonrepresentative variants.
- Shell/ownership: all three roles at same phase + representative ACT-specific layout variants.
- Image: both Scene and Pocket, real delayed resolver/decoded/connected image and multiple polls, plus overlay/multi-item where relevant.
- Text: keys/parameters and NL/ZH structure at 11pt, Runtime vs Action separation across render branches.
- Action: at least one representative choice/form/continue/vote per distinct binder, asserting correct server RPC and no duplicated dispatch after rerender.
- Audio: all actual distinct playback paths identified by inventory; prove once for common lifecycle and per unique ACT behavior; no assumption Sprint6 covers all.
- Teacher: compare V4 approved visual geometry/control ordering + interactive safety with no Player template coupling.
Require a **coverage map** of mechanism -> real callers -> test IDs -> evidence; do not infer universal coverage from one mock PASS.

## 8. Scope, ownership, and decision rules
- First CD inventories and estimates real overlap. GA challenges authority/ACT-specific semantics and Teacher UX contract; CA independently checks test adequacy and scope boundaries.
- Only refactor where there is confirmed duplicate technical behavior, demonstrated recurrent bug risk, a clear lower-risk consolidation, and bounded cross-ACT tests. Keep stable code as-is otherwise.
- P7 Trial4+5 evidence closure remains the immediate blocker. This design review may run in parallel; do not defer required note/diary/Teacher proof or request human rerun prematurely.
- Any new interface/cross-file refactor/new dependency/architecture change still follows existing project authorization requirements; this proposal itself is not implementation approval.
- Produce critical feedback in **one GA memo + one CD feasibility/coverage memo**, followed by a single reconciled revision; avoid endless micro-review cycles.

## 9. Review questions
GA: Does the four-region content ownership match approved gameplay, including contextual narrative surrounding controls, ACT9 discussion and Teacher shell? Are any display exceptions mandatory? Does a unified text routing contract risk obscuring active discussion or role-specific permissions? Identify precise rule conflicts, not abstract concerns.
CD: Identify actual common caller graph per mechanism, practical minimal-first changes, whether existing `routeFormalPresentation` or audio needs consolidation now, cost/risk (low/medium/high, file/test counts), implementation order relative to P7, and exact tests. Challenge duplication claims where paths are legitimately different.
