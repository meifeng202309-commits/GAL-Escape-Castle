# Trial4+5 recurrent slow images — source-path investigation

Date: 2026-10-28  
Authority: `CA_to_CD_20261028T223000Z_image_loading_source_clues.md`  
Scope: investigation only; no product/source/deployment mutation

## Executive finding

Stable DOM preservation is the primary high-value correction. ACT1 and Pocket already demonstrate the useful pattern: `setStableHtml` avoids replacing unchanged markup. ACT6–13 do not use it. Every committed 1200 ms poll rebuilds their Scene markup with `innerHTML`, creates a new `img`, moves that new node into the formal Scene region, removes the previous node, then starts asynchronous resolution/hydration again. Even when the URL is cached, the browser must attach a new element and may repeat image loading/decode state. This directly matches Teacher's report of repeated slow images during ongoing play rather than only cold startup.

The evidence does not justify a broad image framework or ACT rewrite. A narrow keyed Scene preservation change, resolver in-flight coalescing and parallel independent hydration are the smallest coherent strategy.

## Current call graph

`scheduleNextPlayerPoll` → every 1200 ms → `refreshState` → `loadPlayerFrame` → `commitPlayerFrame`:

- ACT1–5: `renderSprint3b` → `setStableHtml(sprint3bText,...)` → `setS5Asset`.
- ACT6–8: `renderSprint5` → unconditional `sprint3bText.innerHTML` → `routeFormalPresentation` → `hydrateS5Assets` → serial `setS5Asset`.
- ACT9–13: `renderSprint6` → unconditional `sprint3bText.innerHTML` → `routeFormalPresentation` → `hydrateSprint6` → `setS5Asset`.
- Pocket in all phases: `renderPocket` → `setStableHtml(pocketMount,...)` → `hydratePocketAssets`.
- `setS5Asset` / Pocket hydration → `trialAssetResolver.resolve` → Supabase `asset_resolve` RPC → `applyResolvedAsset` → public Storage GET/decode.

Relevant source: `src/game/app.js:240-286,315-365,477-492,513-540,614-640,690,726`; `src/game/asset-runtime.js:1-18`; `src/supabase/client.js:3-27`.

## Representative manual-play timeline

### ACT1, per role

Gitte map/note, Anna diary and Linda watch/key/closure-order render through `renderSprint3b`. The unchanged scene HTML is preserved by `setStableHtml`; the same image node survives ordinary polls. However Scene and Pocket can request the same key concurrently on first display. Because the resolver caches only after awaiting the RPC, the concurrent requests can each issue `asset_resolve`. A slow first Storage GET still affects initial readiness, as the trace-only gate observed.

Pocket also uses stable HTML while the selected item and projected data remain unchanged. Selecting/flipping/inspecting deliberately changes HTML and creates a new detail image; `hydratePocketAssets` then resolves it.

### ACT4–5

The comparison view is stable through `renderSprint3b`, but `hydrateAct4Comparison` awaits map resolution before starting library resolution. A cold manual transition therefore pays two resolver/media paths serially. Pocket can simultaneously ask for the map, creating a same-key overlap before cache fill.

### ACT6–8

Each poll calls `renderSprint5`, which replaces `sprint3bText.innerHTML` even if phase, asset and wording are unchanged. `routeFormalPresentation` moves the newly created Scene/stage node into `formalSceneMount` and removes the prior child. Hydration then restarts:

- ACT6: optional map, portrait Scene, then overlay metadata/image;
- ACT7: clock-room Scene;
- ACT8 private/final: map then photo; route: route Scene.

The rebuild is repeated approximately every 1.2 seconds. RPC result cache may make resolution fast for 30 seconds, but it does not preserve the decoded element.

### ACT9–13

`renderSprint6` similarly rebuilds the full `s6-stage` and `s6SceneImage` on every poll. The new node replaces the old formal Scene node before `hydrateSprint6` resolves and reapplies the source. Great Hall, golden key, main gate and ending transitions therefore re-enter loading on unchanged state. Text, discussion and station updates can trigger the same full Scene replacement even when only non-visual data changed.

## Ranked causes and bounded hypotheses

### 1. Confirmed — ACT6–13 Scene nodes are torn down every poll

Evidence: `app.js:631` and `app.js:690` assign `sprint3bText.innerHTML` unconditionally; `app.js:479-492` then appends the newly created Scene node and removes prior formal Scene children. Polling runs every 1200 ms at `app.js:315-320`.

Discriminating experiment: instrument node identity, connected state and decode count across ten unchanged polls in ACT6, ACT8 and ACT9. Existing code should show changing node identity; a keyed stable-render prototype should show one identity and no repeated loading transition.

Minimal correction: use stable/keyed Scene markup for Sprint5/6, preserving the current image/stage node whenever `run + phase + scene asset + structural visual state` is unchanged. Continue updating actions/text separately. Do not change ACT semantics.

### 2. Confirmed — independent multi-image hydration is serial

Evidence: `hydrateAct4Comparison` awaits map then library; `hydrateS5Assets` awaits map, photo, Scene and ACT6 overlay in order; `hydratePocketAssets` loops with `await` for each selected/detail image.

Discriminating experiment: add RPC/resource spans for ACT4 comparison, ACT6 answer and ACT8 evidence. Compare current end-to-end sum against `Promise.all` over unique independent keys while retaining per-node generation guards.

Minimal correction: resolve independent assets concurrently and apply each only after current-node/key validation. Preserve overlay-after-base ordering only where anchor computation actually depends on both results.

### 3. Confirmed — resolver has no in-flight same-key coalescing

Evidence: `createAssetResolver.resolve` checks completed cache, then awaits RPC, then writes cache. Two Scene/Pocket calls arriving before the first completion issue duplicate `asset_resolve` requests.

Discriminating experiment: count resolver RPCs when ACT1 Scene and Pocket request the same map/diary/key in one frame. Expected current count is two on a cold key; an in-flight promise map should reduce it to one.

Minimal correction: cache the in-flight promise by key and share it; on settlement store only a valid success in the normal TTL cache and clear the in-flight entry.

### 4. Confirmed risk — failed/null resolution is cached for 30 seconds

Evidence: resolver catches RPC failure as `null` and stores that value with the same 30000 ms TTL. A transient network failure therefore forces placeholders on every caller for up to 30 seconds without a new RPC.

Discriminating experiment: fail the first resolver request and make the next healthy. Current behavior should continue returning null for 30 seconds; corrected behavior should retry on the next bounded poll/backoff.

Minimal correction: do not put null/failure into the success cache. If request protection is needed, use a short bounded retry backoff distinct from the 30-second success TTL.

### 5. Confirmed contributing mechanism — URL cache is not decoded-node reuse

Evidence: `assetUrlCache` stores only key→URL. `applyResolvedAsset` sets every newly created node to `loading`; browser HTTP cache may avoid transfer, but a new element still has attach/decode lifecycle. This amplifies cause 1. Existing trace shows slow natural-dimension/decode can occur without event-loop stalls.

Discriminating experiment: on an unchanged Sprint6 state, record transfer size, node identity, `load` events and decode timestamps across polls. Zero-byte cached transfers with repeated node/load transitions confirms decode/attachment churn.

Minimal correction: fix stable node preservation first. Only if residual decode tails remain, add a small per-URL decoded `Image.decode()` promise cache; do not create a generalized asset subsystem.

## Recommended minimal package

One bounded source package, if separately authorized:

1. preserve keyed Scene/stage DOM for Sprint5 and Sprint6 when structural identity is unchanged;
2. coalesce in-flight resolver calls and avoid 30-second null caching;
3. parallelize only independent ACT4/Sprint5/Pocket resolutions;
4. retain all current stale-generation, connected-node and key guards;
5. add cross-role browser regression for ACT1, ACT4, ACT6, ACT8, ACT9–13 and Pocket, asserting stable node identity on unchanged polls, correct replacement on real asset identity changes, positive dimensions, zero wrong-role asset and bounded recovery after one resolver failure.

Priority is 1 → 3/4 → 2 → optional decoded cache. Stable DOM is the main user-visible win and avoids code bloat by extending an already used local mechanism rather than adding architecture.

No product source was modified. No deployment, DB, Storage or human-room operation occurred. `NEXT_OWNER: CA` for review and any source-only authorization.
