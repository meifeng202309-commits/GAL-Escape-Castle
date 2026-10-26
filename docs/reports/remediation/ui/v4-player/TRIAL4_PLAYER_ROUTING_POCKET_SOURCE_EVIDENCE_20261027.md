# Trial 4 Player Routing and Pocket Source Evidence

Date: 2026-10-27

## Scope and identity

- Authorization: `CA_to_CD_20261027T074000Z_trial4-player-routing-pocket-source-authorized.md`
- Baseline / rollback: `80d82689352e2119d64058319bb5fe6d16d6eab3`
- Frozen implementation: `9573ea95a553f5425c47397d8b6e66fec4373ab7`
- Source scope: `index.html`, `src/game/app.js`, `src/styles/app.css`, targeted tests and screenshots only.
- No migration, database, Storage, deployment, Teacher-console, timer, vote, or narrative change.

## Implemented behavior

- Added a stable Scene mount and routed formal visual media there for ACT1-5, ACT6-8, and ACT9-13.
- Kept prose/guidance in Runtime and inputs, choices, audio controls, and commands in Action.
- Preserved the canonical full-screen ACT14 ending and clear the prior Scene at lifecycle, handoff, entry-barrier, and ending boundaries.
- Added existing ACTIVE media mappings for number-note front/back, closure order, and star key; retained map, diary, and watch mappings.
- Preserved Pocket item inspection, flip behavior, reconnect-compatible projection, and internal scrolling.

## Verification

Passed:

- `node --check src/game/app.js`
- `node tests/v4-player-integration-static-check.js`
- `node tests/v4-two-scene-pilot-static-check.js`
- `node tests/a1-player-polling-static-check.js`
- `node tests/sprint9-trial-placeholder-static-check.js`
- `node tests/v4-player-integrated-runtime-browser.mjs` with bundled Playwright runtime

The browser gate exercised three Player projections, ACT10 discussion and Teacher-opened vote, ACT3 submit/inspect/flip, Pocket later-item access, decoded canonical media, and 1366x768 plus 1280x720 layouts. All five tested Pocket images decoded with positive geometry. Six refreshed screenshots are stored in `docs/reports/remediation/ui/v4-player/screenshots/`.

ACT9 Runtime scroll was probed after authorized rerouting. Scroll position remained `77` before and after refresh with maximum `154`; the residual was not reproduced. Per CA instruction, no independent scroll correction was implemented.

## Known unrelated gate

`tests/structural-package-c-static-check.js` remains stale against the inherited CA285 polling baseline because it expects the removed literal direct `s3_get_player_state` call instead of `settlePlayerProjectionReads`. This package does not alter that polling implementation or broaden scope to repair the unrelated assertion.

## Result

The authorized Player routing and Pocket source package is ready for CA review. Production deployment remains prohibited and was not attempted.
