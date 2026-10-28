# GAL Escape Castle — Display Mechanism Reuse Governance V1.1
Date: 2026-10-28
Status: **CA reconciled proposal after GA-137 and CD-176; no blanket refactor authorized**
Purpose: Preserve a unified Player shell and repair common display problems once, while protecting legitimate ACT semantics and low-cost text editing.

## A. Five-region Player shell
One `index.html`, `src/styles/app.css`, `src/game/app.js` shared by all Player roles. Five first-class regions:
1. Scene: current visuals/props/clues, upper-left.
2. Runtime: narrative/instructions, below Scene left.
3. Action: executable choices, inputs, votes, continue controls, upper-right.
4. Discussion: communication/transcript and discussion state, separate from Action.
5. Pocket: server-authorized role-owned item selection, inspection, flipping, media.
Teacher V4 remains a separate single-runtime UI. ACT14 full-screen and genuine cinematic overlays remain documented exceptions, not separate Player templates.
No per-role HTML copies. Shared shell fixes apply to all roles, but distinct role/state data and visual results still need regression.

## B. Mechanism registry (source-backed initial inventory)
| Mechanism | Shared core | Specific paths/exception | Policy |
|---|---|---|---|
| Shell + region ownership | shared Player HTML/CSS and mounts | lifecycle barriers, ACT1–5 renderSprint3b; ACT6–8 renderSprint5; ACT9–13 renderSprint6; ACT14 renderSprint8 | Keep one shell; document each active renderer and its five-region routing |
| Scene image lifecycle | trialAssetResolver.resolve, setS5Asset, applyResolvedAsset | ACT1 semantic choice, ACT4 comparison, Sprint5 overlays/anchors, Sprint6 stations, ACT14 visual | Reuse decode/connected-key checks; do not force identical ACT asset selection logic |
| Pocket image lifecycle | same resolver and applyResolvedAsset | pocketEvidencePanel, renderPocket, hydratePocketAssets, item/front-back metadata | Common image loading, specialized role ownership and inspection |
| NL/ZH text | canonical catalog, generator, localizedHtml/template helpers, 11pt CSS | separate ACT render branches; Teacher diagnostics | Keep catalog as wording authority, not a global gameplay-rule schema |
| Actions and Discussion | shared markup/form conventions | actionButtons/s5Buttons/Sprint6 RPC identity and special votes; ACT3 prefix, ACT7 retry, ACT9 NORMAL/AUDIT, ACT10 Open Vote/IME | Do not collapse RPC identities or merge Discussion into Action |
| Poll/refresh | setStableHtml and state draft/scroll preservation | Sprint5/6 specialized rerenders; existing routeFormalPresentation moving DOM | Treat DOM mover as tested transitional bridge; remove only on separately scoped branch-complete case |
| Gameplay audio | Sprint6 arm/play/volume/outbox/consumption | current only identified gameplay audio path; Teacher preview separate | Do not build unused global audio abstraction |
| Teacher console | teacher.html, teacher-console.js | approved V4 host/live/discussion/recovery/maintenance layout | Remains separate from Player shell |

Registry reflects checked effective call paths; update as functionality changes. Similar function names alone are not evidence of duplicative code.

## C. Impact-based change classification — Teacher directive
**LOCAL:** approved wording change to existing key with unchanged meaning of phase/role/trigger/region/order, or truly localized CSS with no shared effect. Use existing protected-text approval if applicable, normal work log and a targeted smoke test. **Do not invoke eight-item checklist.**

**SHARED / CROSS-CUTTING:** modifies a mechanism used across players, ACTs, regions, or other shared callers: common renderer, image lifecycle, localized markup, five-region CSS shell, action primitive, audio subsystem, or a change to cross-region routing. **Run the full eight-item reuse checklist and proportionate real-caller regression coverage.**

**PROTECTED:** independent authority axis: text/catalog/role permissions/phase/vote/RPC changes follow existing approval rules even if local. Protected status alone is not evidence that eight reuse checks are needed; invoke them only when the change also has SHARED impact.

**UNCERTAIN:** quick owner/caller lookup, classify and record reason; do not preemptively impose full checklist.

## D. Eight-point checklist — ONLY SHARED changes
1. Owner/authority/target region;
2. Existing Registry mechanism and effective callable paths;
3. Affected roles, ACTs, phases, viewports;
4. Reuse existing parameter/config/core rather than new duplicate;
5. If specialized, justify concrete game-rule difference;
6. Impact on interfaces, assets, localization, DOM/CSS and authority;
7. Caller-based browser/static regression IDs and observed results;
8. Registry update, retained exception and removal/compatibility plan.
One compact entry in the existing work notes; no new universal approval hierarchy.

## E. Future bulk text editing
For same-key copy updates: edit canonical CSV under existing authority, regenerate, focused key/format smoke test; no Player JS routing work expected. No eight-item checklist for pure local copy.
For changed target region/phase/role/trigger/order: identify active renderer and approved target mount and existing permissions; test affected branches. If common routing is modified, invoke shared checklist.
Preserve NL/ZH separate lines, required blank spacing and 11pt style.
CD proposed a low-cost static guard against **new Player-facing hard-coded literals**. This is a future optional scoped improvement requiring separate authorization, not a reason to block P7 or force immediate architecture replacement.

## F. Regression and exceptions
When a common mechanism changes, map mechanism -> *effective* branches -> roles/ACTs/phase variants -> tests/evidence. Distinguish overlays/cinematics and RPC identity cases; one happy-path per group is insufficient when behavior materially differs.
Keep confirmed ACT3, ACT7, ACT9, ACT10, Pocket ownership, ACT14 full-screen, and Teacher UI exceptions. Avoid unnecessary audio abstraction, Teacher/Player shell unification, action binder consolidation or removal of routeFormalPresentation without demonstrated benefit and branch-complete tests.

## G. Adoption and scope
This reconciled V1.1 is a **narrow proposed operating rule** for GA to confirm canonical compatibility and CD to implement in future normal work. CA P7 source pass does not itself authorize cross-file refactors. Effective adoption should be acknowledged by GA/CD through existing agent protocol. Existing explicit approvals still govern source architecture, protected catalog, production, DB and Storage.
