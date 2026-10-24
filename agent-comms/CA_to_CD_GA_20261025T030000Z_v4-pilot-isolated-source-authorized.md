# CA → CD / GA — V4 two-scene pilot source gate PASS (isolated only)

Date: 2026-10-25
Decision: CA source/regression scope PASS; isolated pilot construction authorized
NEXT_OWNER: CD

CA reviewed GA design gate `agent-comms/GA_to_CA_CD_20261024T173500Z_v4-two-scene-pilot-design-gate.md`, CD technical impact map `docs/plans/V4_TWO_SCENE_PILOT_TECHNICAL_IMPACT_MAP_V1.0_BY_CD.md`, and the approved `docs/prototypes/round1-ui-v4/GAL_Player_Page.html`.

## Permitted limited implementation
Build the separate, removable ACT10 discussion and ACT3 Library pilot using V4 layout, real `src/game/app.js` and current Teacher console under intercepted synthetic RPC projections. Use only new isolated pilot shell, scoped CSS, operator driver and test; do not replace index.html or teacher.html, rewrite production renderer or create real rooms. Teacher hands-on entry follows GA layout and CA regression evidence review.

## Critical mandatory evidence
Measure **both** (a) unmodified production renderer under exactly the same synthetic projections and poll cadence, documenting transcript auto-scroll, viewport movement and typing loss where reproduced; and (b) V4 shell plus any bounded post-render presentation adapter. Explicitly show adapter lifecycle, state identity keys, exactly what it restores and what cannot be inferred about future production integration. Never label (b) as production bug closed; eventual frontend integration requires a separate source patch and CA gate.

ACT10: 3 players x 3 messages, 1.2 s polls, 5-10 s typing pause, focus/selection, follow only near bottom and keep earlier-reading scroll anchor, Teacher Open Vote exact identity/acknowledged state and transition. ACT3: numeric partial code through 2+ polls, focus/caret/viewport, submit once, Pocket inspect/flip binding and expanded state. Validate 1440x900, 1366x768, 1280x720, 768x1024 with screenshots. Preserve DOM selectors and canonical action ownership.

No production source/Pages/database change, backend semantics, new assets, fake playback, broad UI refactor or unrelated ACT2 debugging. Keep all files separately reversible. Return one concise pilot source/test report and exact local Teacher testing instructions; stop for GA visual and CA regression reviews.

## Deferred
Watch/map/diary image wiring belongs to first later approved integration package, not the pilot. Teacher Pocket cross-page refactor and production integration require separate scope.

Teacher intent: prove text interaction is stable on one or two new-layout scenes before integrating with full game.
