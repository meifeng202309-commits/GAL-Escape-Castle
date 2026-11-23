# CD → CA — CA-347 / GA-152 Page-ID Runtime integration complete

FROM: CD
TO: CA
TIMESTAMP: 2026-11-23T14:32:00Z
STATUS: IMPLEMENTATION COMPLETE / CONSOLIDATED AUDIT REQUIRED
NEXT_OWNER: CA

CANDIDATE: `e17c243a77fa2364e8dc9e41e7bfa98d587de4a3`

## Exact implementation baseline

CD consumed GA's owner-delivered `GAL_APPROVED_RUNTIME_PAGE_TEXT_V1.csv` through the generated `runtime-page-text.generated.js` resolver. `src/game/app.js` now selects declared role-specific Page IDs only from existing authoritative caller facts:

- ACT1 role and selected investigation outcome; ACT2 meeting destination; ACT5 route outcome;
- ACT7 vote attempt; ACT8 resolved route;
- ACT9 private-clue phase and exact server-projected feedback-key outcome signature;
- ACT11 discussion phase; ACT12 cinematic stage/route result; ACT13 escape phase.

This covers GA-152's 92 Page-ID appearances without adding a Page-ID state machine, gameplay state, or hard-coded manuscript text. Existing line-break presentation is reused.

## Preserved boundaries

Action labels and controls, Pocket descriptions, artwork text, `act02.043/044/045`, ACT6 first/returning Voice behavior, locked `act09.022`, ACT14, and GA-147 Anna phone behavior remain on their existing consumers. In particular the ACT9 `STAY` Action still uses `act09.021`; Page-ID copy is Runtime narrative only. No canonical GA source, asset pixels, registry, database, Storage/ACTIVE, Pages, or production state was changed.

## Evidence

PASS:

- `node --check src/game/app.js`
- `node tests/ga147-canonical-copy-integration-static-check.js` (extended existing suite: exact 92 aliases, caller selectors, protected STAY)
- `node tests/v4-player-integration-static-check.js`
- `node tests/ca338-main-gate-v3-static-check.js`
- `node tests/act9-asset-variant-static-check.js`
- `git diff --check`
- GitHub Actions `45195309862` — CA338 completed replay real-browser — PASS
- GitHub Actions `45195310039` — CA328 ACT9 real-browser — PASS

The local workspace had no Playwright module, so CD reused the two existing push-triggered browser workflows rather than creating a new suite. Both ran against the exact candidate above and passed.

## Ownership

NEXT_OWNER: **CA** for the one consolidated CA-338 audit and authorized release route under ACTIVE Lean Development V0.2. Return to CD only for a concrete caller/render regression. Production remains separately gated.
