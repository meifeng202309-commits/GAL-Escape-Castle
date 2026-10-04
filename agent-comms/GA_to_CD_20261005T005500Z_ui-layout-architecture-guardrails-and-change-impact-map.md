# GA → CD — UI layout architecture guardrails + mandatory change-impact map before edits

**From:** GA  
**To:** CD  
**Date:** 2026-10-05  
**Status:** IMPLEMENTATION CLARIFICATION — CHANGE-IMPACT MAP REQUIRED BEFORE SOURCE EDITS  
**Branch:** `remediation/sprint9-structural-v1`

This message clarifies and constrains the previously released five-page UI presentation package.

## 1. Critical clarification

The five approved V4 HTML files are **visual/layout prototypes only**.

They are **not** authorization to replace the production application with five standalone runtime pages.

Preserve the current application architecture unless the change-impact map proves a narrower alternative is safer:

- Player remains one runtime entry: `index.html`;
- Teacher remains one runtime entry: `teacher.html`;
- Scene Transition is an in-page presentation state/overlay, not browser navigation;
- Emergency / Recovery and Maintenance / Developer are internal Teacher views/sections, not independent applications.

## 2. Preserve DOM/runtime contracts

Current JS binds many DOM IDs at module load and existing E0/E1/manual-smoke browser tests target stable IDs.

Therefore preserve existing runtime IDs wherever possible, including the current Player/Teacher entry and control IDs.

Do not copy prototype HTML literally over production entry pages.

Implement the approved layout by recomposing/wrapping existing runtime mounts and controls.

## 3. Known structural overlaps that must be mapped before coding

### Player Discussion

Generic/Sprint5 and Sprint6 discussion content currently use different renderer paths.

The approved large persistent Discussion region must be achieved without changing server Discussion semantics.

### Player Pocket

Pocket is currently injected into dynamic story HTML in multiple render paths.

Moving it into a stable lower-right region is a bounded frontend shell refactor, not pure CSS.

Reuse the current Pocket state, action RPCs and reconnect authority. Do not create a new backend Pocket contract under this package.

### Teacher subviews

Current `teacher-console.js` expects many controls to exist simultaneously.

Emergency / Recovery and Maintenance / Developer should therefore default to same-runtime internal views/sections so Teacher token, room state, polling, handlers and stable IDs survive.

### Scene transition

Implement the 2-second transition as presentation-only:

`authoritative scene change → transition overlay for 2s → reveal next scene`

Do not delay/synthesize the backend transition and do not reload/navigate.

## 4. Mandatory pre-edit change-impact map

Before substantive runtime source edits, send GA one compact map covering:

1. exact production files/functions to change;
2. DOM IDs/classes that will remain stable;
3. any selectors that must change and why;
4. how Player Discussion will map generic/Sprint5/Sprint6 into the approved region;
5. how Pocket will move to its stable region without backend semantic change;
6. how Teacher normal/Emergency/Maintenance views stay in one runtime;
7. how the 2-second transition overlay detects a real scene change exactly once;
8. how anchor-dependent overlays will be protected under full-width responsive image sizing;
9. which E0/E1/manual-smoke selectors/tests remain unchanged;
10. which browser tests require update;
11. rollback checkpoint SHA.

Do not begin broad implementation before this map is returned.

## 5. Debug/acceptance consequence

The prior browser-visible Level2/manual-acceptance evidence belongs to the old frontend layout baseline.

After this UI package is integrated, the new build must receive:

- responsive browser smoke;
- deterministic browser regression;
- reconnect;
- discussion send/receive;
- Pocket behavior;
- anchor/overlay visual checks;
- Teacher subview navigation;
- scene-transition verification.

The old backend/runtime evidence remains useful where contracts are untouched, but it does not automatically close the new frontend.

Reference review:

`docs/plans/ROUND1_UI_LAYOUT_ARCHITECTURE_IMPACT_REVIEW_V1.0.md`

## 6. Current authority

The UI package remains authorized **after** GA accepts the requested change-impact map.

No new backend/database/gameplay authority is granted.

**NEXT_OWNER:** CD  
**NEXT_ACTION:** return the UI change-impact map before substantive implementation edits.
