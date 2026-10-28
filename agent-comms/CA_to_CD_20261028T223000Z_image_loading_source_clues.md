# CA → CD — Recurrent slow images: code-path investigation
Date: 2026-10-28
STATUS: INVESTIGATION_ONLY
NEXT_OWNER: CD

Teacher reports images are frequently slow during real manual gameplay, not a rare one-off. CA inspected the P7 accepted source at 8594f2e. Treat this as a broader actual UX problem; previous one-off 2515/29600ms evidence is not sufficient to define it.

Verified source locations:
- src/game/app.js lines 631 and 690: renderSprint5/renderSprint6 replace sprint3bText.innerHTML on refresh, including image markup. Check whether images are repeatedly torn down and recreated during the 1200ms poll (lines 313-365), how browser cache/decode behaves, and whether routeFormalPresentation (479-492) moves image nodes correctly. Contrast renderSprint3b's setStableHtml and renderPocket's setStableHtml.
- app.js 537 and 639: ACT1 scene setS5Asset asynchronous RPC resolution races changing DOM generations. Guards prevent stale application but may cause repeated resolution/mount delays.
- src/game/asset-runtime.js: createAssetResolver caches asset_resolve RPC for 30000ms only, no in-flight promise coalescing. Concurrent same-key calls may cause duplicate RPCs; failed/null resolutions cached for 30 seconds, potentially prolonging placeholders. Distinguish resolver timing from media GET/decode with traces.
- app.js 614: hydratePocketAssets awaits individual resolutions sequentially; compare multiple selected/detail media and repeated polls. app.js 513-514 and 640 chain ACT4/Sprint5 asset hydration serially. Check whether any broad latency is due to serial remote RPC.
- app.js 638: applyResolvedAsset sets loading, onload and onerror; cache is key->URL, not decoded images. Rerendered elements may repeatedly pass through loading even with URL cache. Identify effective browser resource cache, correct loading states and possible retries.
- src/supabase/client.js: rpc uses network fetch for asset_resolve and every game-state RPC; measure latency/overlap; do not presume fetch automatically fast.

Please inspect these paths in detail with source call graph and **representative realistic manual-play timeline** per role/ACT, focusing on repeated slow loads. Provide at most 3-5 ranked confirmed root causes or bounded hypotheses with line evidence, experiment that discriminates each, and one minimal corrective strategy minimizing code bloat. Determine if stable DOM preserving image nodes across polls is the primary high-value change. Check ACT1, ACT4, ACT6-13, Pocket; do not rewrite ACT-specific semantics.

No source product patch, migration, Pages deployment, Storage changes, threshold relaxation, new security audit or Teacher trial is authorized by this letter. Submit one concise investigation report to CA for further review and decision. Prior proposals to expand the cold-loading ceiling to 8000ms are NOT adopted and must not substitute for investigation.

NEXT_OWNER: CD.
