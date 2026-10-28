# Trial4+5 image-loading minimal source fix evidence

Date: 2026-10-29  
Authorization: `CA_to_CD_20261028T233000Z_image-loading-minimal-fix-authorized.md`

## Result

The authorized source-only correction is complete. Unchanged Sprint5/6 render output now goes through the existing `setStableHtml` mechanism, preserving the connected decoded Scene image across the 1200 ms polling cycle. Sprint6 explicitly clears the formal Scene mount when the next state has no scene asset. The shared resolver now coalesces concurrent same-key requests and caches only successful `ok` resolutions, so transient null/failure results retry immediately.

Independent ACT4 map/library, Pocket media, and ACT8 map/photo resolutions run concurrently. ACT6 portrait overlay remains ordered after the base portrait because anchor placement depends on both assets.

## V1.1 shared-mechanism eight-item reuse review

1. Regions: Scene and Pocket only; Action, Runtime, Teacher and discussion ownership remain unchanged.
2. Producers/consumers: existing state RPC payloads and asset keys are unchanged; only render reuse and resolver scheduling changed.
3. Semantics: ACT1–13 phase, vote, role and route behavior is unchanged.
4. Authority: no database, Storage, deployment, room or gameplay-data mutation; only CA-authorized source/test files changed.
5. Localization: no canonical or protected wording changed.
6. Failure behavior: failed/null resolution is not cached; placeholder and active-load reporting behavior remains intact.
7. Identity/lifecycle: unchanged HTML preserves the connected image node; changed/no-asset output replaces or removes it; stale async completion guards remain in place.
8. Regression coverage: resolver concurrency/retry static gate, ACT9 identity browser gate, ACT1/all-role/Pocket browser gate, ACT3/9/10 integrated browser gate, plus source coverage for ACT4/6/8/9–13 shared render paths.

## Verification

- `node --check src/game/app.js` — PASS.
- `node tests/asset-runtime-image-stability.mjs` — PASS; same-key in-flight RPC count 1, successful TTL cache retained, transient null retried immediately, stable render and independent parallelization assertions passed.
- `node tests/trial45-p2p6-browser.mjs` — PASS; GAL-A/B/C at 1366×768 and 1280×720, role-specific Scene and Pocket media connected and decoded; number-note and diary paths passed.
- `node tests/v4-player-integrated-runtime-browser.mjs` — PASS; ACT3 Pocket media connected/decoded, ACT9 unchanged refresh preserved Scene identity and Runtime viewport, ACT9→ACT10 removed the old Scene image, ACT10 discussion integration passed.

ACT6/8 and ACT9–13 share the corrected `renderSprint5`/`renderSprint6` mechanisms; their phase-specific semantics and asset-key selection were not altered. ACT4 uses its existing stable renderer and now resolves its two independent images concurrently. ACT1 already used the stable renderer and remains covered by the all-role browser gate.

## Remaining limitations

This source-only fix removes avoidable node churn, duplicate in-flight RPCs and failure-cache stalls. It does not guarantee a public network latency threshold, preload all media, or conceal genuine decode/network failures. No Pages release or live public performance run was authorized.

