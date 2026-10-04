# WP-R4A Image Runtime Publication / Activation Closure

## Outcome

`PASS` — all 22 Teacher-approved runtime image identities are published, uniquely ACTIVE at their approved versions, publicly resolvable, checksum-valid over HTTP, and complete for required anchors.

This report closes only WP-R4A. It does not claim WP-R4B browser-visible renderer coverage or change any gameplay, timer, Teacher Console, Pocket/evidence, or visual-content behavior.

## Authority and baseline

- GA authorization: `agent-comms/GA_to_CD_20261004T205500Z_release-wpr4a-image-runtime-closure.md`
- Branch: `remediation/sprint9-structural-v1`
- Starting repository commit: `3074afd8215eed42c121cf990a582467369f4281`
- Frozen public frontend: `891feffe558a4683ac3da67e1e6b15e902c7e592`
- Canonical machine-readable evidence: `docs/reports/remediation/wp-r4a/WP_R4A_IMAGE_RUNTIME_CLOSURE.json`

## Closure summary

- Registry projection sync: PASS (`28` total governed assets; registry SHA-256 `7dbfe8d346126a1b6d05fea8bd3025d56e6431693f154e92a7e352e7b554e9a9`)
- Approved image candidates covered: `22/22`
- Correct unique ACTIVE image rows: `22/22`
- Public `asset_resolve()` results: `22/22` PASS
- Public HTTP object fetch plus SHA-256 verification: `22/22` PASS
- Required-anchor verification: `6/6` anchor-bearing assets PASS; `16` assets correctly marked not required
- Residual image-runtime issues: `0`
- Initial publication verification load-failure telemetry: `0`
- Normal public smoke load-failure telemetry: `0`
- Temporary reviewer rows remaining: `0`
- Secrets or plaintext reviewer tokens recorded in evidence: `0`

## Per-asset closure

| Asset key | Approved | ACTIVE | Publish | Resolver | Public HTTP | Anchors | Residual |
|---|---:|---:|---|---|---|---|---|
| `opening.gitte_room` | v002 | v002 | REUSED_VERIFIED | PASS | PASS_200_SHA256 | NOT_REQUIRED | none |
| `opening.anna_room` | v002 | v002 | REUSED_VERIFIED | PASS | PASS_200_SHA256 | NOT_REQUIRED | none |
| `opening.linda_study` | v002 | v002 | REUSED_VERIFIED | PASS | PASS_200_SHA256 | NOT_REQUIRED | none |
| `prop_gitte_castle_map` | v001 | v001 | REUSED_VERIFIED | PASS | PASS_200_SHA256 | NOT_REQUIRED | none |
| `prop_gitte_number_note_front` | v001 | v001 | REUSED_VERIFIED | PASS | PASS_200_SHA256 | NOT_REQUIRED | none |
| `prop_gitte_number_note_back` | v001 | v001 | REUSED_VERIFIED | PASS | PASS_200_SHA256 | NOT_REQUIRED | none |
| `prop_anna_diary_open` | v001 | v001 | REUSED_VERIFIED | PASS | PASS_200_SHA256 | NOT_REQUIRED | none |
| `prop_linda_watch_face` | v001 | v001 | REUSED_VERIFIED | PASS | PASS_200_SHA256 | NOT_REQUIRED | none |
| `prop_linda_watch_back` | v001 | v001 | REUSED_VERIFIED | PASS | PASS_200_SHA256 | NOT_REQUIRED | none |
| `prop_linda_closure_order` | v001 | v001 | REUSED_VERIFIED | PASS | PASS_200_SHA256 | NOT_REQUIRED | none |
| `prop_linda_star_key` | v001 | v001 | REUSED_VERIFIED | PASS | PASS_200_SHA256 | NOT_REQUIRED | none |
| `shared.library` | v002 | v002 | REUSED_VERIFIED | PASS | PASS_200_SHA256 | PASS | none |
| `prop.photo_1897` | v001 | v001 | REUSED_VERIFIED | PASS | PASS_200_SHA256 | NOT_REQUIRED | none |
| `prop.library_clock_clue_note` | v001 | v001 | REUSED_VERIFIED | PASS | PASS_200_SHA256 | NOT_REQUIRED | none |
| `shared.portrait_hall` | v001 | v001 | PUBLISHED | PASS | PASS_200_SHA256 | PASS | none |
| `overlay.portrait_eyes_open` | v001 | v001 | PUBLISHED | PASS | PASS_200_SHA256 | PASS | none |
| `shared.clock_room` | v002 | v002 | PUBLISHED | PASS | PASS_200_SHA256 | PASS | none |
| `shared.west_tower_payoff` | v001 | v001 | PUBLISHED | PASS | PASS_200_SHA256 | NOT_REQUIRED | none |
| `shared.great_hall` | v002 | v002 | PUBLISHED | PASS | PASS_200_SHA256 | PASS | none |
| `prop.golden_key` | v001 | v001 | PUBLISHED | PASS | PASS_200_SHA256 | NOT_REQUIRED | none |
| `shared.main_gate` | v002 | v002 | PUBLISHED | PASS | PASS_200_SHA256 | PASS | none |
| `ending.castle_exterior` | v002 | v002 | PUBLISHED | PASS | PASS_200_SHA256 | NOT_REQUIRED | none |

## Normal public smoke

- Public entry: <https://meifeng202309-commits.github.io/GAL-Escape-Castle/>
- Evidence: `docs/reports/remediation/wp-r4a/public-smoke/20261004145223_public-smoke.json`
- Browser topology: one isolated Teacher context and three isolated Player contexts
- Gitte / Anna / Linda staggered join and formal ACT1 start: PASS
- Distinct role-private ACT1 surfaces: PASS
- Gitte reconnect preservation: PASS
- Material browser errors: `0`
- `ACTIVE_STORAGE_OBJECT_LOAD_FAILED` events since smoke start: `0`
- Six screenshots are stored beside the smoke JSON.

The sole captured browser error is the already-classified public-root `favicon.ico` 404 and is excluded from material application errors.

## Validation

The following final regressions passed after registry activation:

- `tests/sprint4-static-check.js`
- `tests/structural-package-d-static-check.js`
- `tests/sprint9-asset-readiness-validator.test.mjs`
- `tests/sprint9-trial-placeholder-static-check.js`
- `tests/sprint9-asset-resolution-cache-behavior-check.mjs`
- syntax checks for both WP-R4A publication and post-smoke verification scripts
- `git diff --check`

## Boundary and ownership

WP-R4A is complete at the authorized infrastructure boundary:

`approved candidate → publication → unique ACTIVE → asset_resolve → public HTTP/SHA-256 → required anchors → normal-smoke telemetry`

Ownership transfers to GA. CD stops here and does not self-expand into WP-R1, WP-R2, WP-R3, WP-R4B, or WP-R5.
