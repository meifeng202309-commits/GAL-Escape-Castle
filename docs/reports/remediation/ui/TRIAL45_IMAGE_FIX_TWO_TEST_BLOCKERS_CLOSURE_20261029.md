# Trial4+5 image-fix two-test blocker closure

Date: 2026-10-29  
Authority: `CA_to_CD_20261029T023000Z_image-fix-two-test-blockers-only.md`

## Result

Both authorized test blockers are closed. No product HTML, JS, CSS, localization, database, Storage, room or deployment state changed.

The cache behavior test now requires successful lookup caching, immediate retry for failed/missing lookups, explicit same-key in-flight coalescing, and confirms a missing asset is never represented as a successfully cached image.

The integrated real-runtime browser gate now includes GAL-C ACT6. It preserves the same Scene image node over three unchanged refreshes and verifies connected decoded `shared.portrait_hall` dimensions (1824×1312). It then performs a genuine ACT6→ACT8 visual-state change and verifies replacement with connected decoded `shared.west_tower_payoff` (1280×720), while checking the GAL-C Pocket watch asset. Existing ACT9 identity/change and role/Pocket gates remain active.

## Test diff

- `tests/sprint9-asset-resolution-cache-behavior-check.mjs`: corrected accepted resolver contract and added concurrent same-key assertion.
- `tests/helpers/v4-two-scene-pilot-driver.js`: deterministic ACT6/ACT8 test projections only.
- `tests/v4-player-integrated-runtime-browser.mjs`: ACT6 unchanged-poll and ACT6→ACT8 replacement gate, plus fixture media routes.

## Verification

- `node tests/sprint9-asset-resolution-cache-behavior-check.mjs` — PASS.
- `node tests/asset-runtime-image-stability.mjs` — PASS.
- `node tests/v4-player-integrated-runtime-browser.mjs` — PASS, including ACT6, ACT8, ACT9 and Pocket checks.
- `node tests/trial45-p2p6-browser.mjs` — PASS, all roles/Pocket and both viewports.
- `node tests/v4-player-integration-static-check.js` — PASS.
- `node tests/act9-073-normal-teacher-paced-static-check.js` — PASS.
- `node tests/act9-073-normal-teacher-paced-policy.test.js` — PASS.

## V1.1 shared-mechanism review

The test-only change covers Scene/Pocket regions, accepted resolver producer/consumer semantics, unchanged ACT/role authority, transient failure behavior, DOM identity lifecycle, real visual replacement, protected localization isolation and retained P7/ACT9 regression consumers. It does not alter the five-file runtime target or recovery plan recorded in CD-185.

The source+test package is ready for CA review. Production release remains separately gated and unauthorized.

