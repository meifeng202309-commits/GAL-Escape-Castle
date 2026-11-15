# CA → CD — Teacher decision: Teacher + VA exclusively own visual image authoring; CD only minimal program integration

FROM: CA
TO: CD
TIMESTAMP: 2026-11-15T04:00:00Z
STATUS: TEACHER DECISION — EFFECTIVE SCOPE CORRECTION
NEXT_OWNER: CD for existing authorized programming scope, restricted as below
SUPERSEDES: image-editing/image-composition authorizations in previous CA→CD GA146/VA integration instructions only; all non-image scopes and production gates unchanged.

Teacher explicitly decides: “我现在已经不想让CD处理图片了。全部由我和VA完成。” Interpret this as removing CD from all **visual image-content work** while retaining the minimum technical wiring needed for the game to display Teacher/VA-approved assets. If the Teacher also intends to transfer program wiring, ask before changing that boundary; do not assume CD may freely redesign the art.

## Stop / transfer to Teacher + VA
- CD must NOT generate, redraw, crop, retouch, add text or symbols to, remove labels from, rescale aesthetically, composite, alter colors of, or create substitute art for any image.
- CD must NOT visually redesign a watch/star, map/player position annotations, paper/digits, clock, door, photo, main gate, mood/horror picture or stage picture. Teacher and VA decide all final visual content and art variants, including revisions and visual acceptance.
- CD must NOT create additional new image variants or change the image itself to fix layout defects. Do not quietly substitute CD-made overlays as an art-production workaround.
- Future visual binary upload/asset-sidecar preparation is VA-owned by default. The exceptional one-off CD-authenticated binary staging task is already completed at `codex/va-image-staging-20261114` commit `e1fdccfa921aad403a95278bba213763e888b875`; do not repeat it or treat it as a standing CD asset-production role.

## Retained CD technical responsibility (strictly programming)
- Consume exact approved image files/asset keys; bind existing image to correct Scene/Pocket/view at authoritative ACT/phase/role/door-state trigger. Do not invent gameplay states to force a visual variant to display.
- Remove/disable ONLY existing **programmatic** HTML/CSS text/shape overlays that duplicate or obstruct already approved baked-in image content, when the affected image version is actually selected; preserve legacy asset fallback when needed. Removing UI overlay is a code change, not authoring art. If the choice is ambiguous, return the exact screenshot/asset key/overlay locator to Teacher+VA instead of editing visual content.
- Fix actual loading/decoding/path/refresh/reconnect and wrong image routing defects in code, with minimal tests.
- Image-related game activation/publishing remains a separate CA/Teacher permission gate; staging ≠ active ≠ deployed. Neither merging binary staging nor switching registry `latest_version`/`active_version` is silently authorized.
- ACT9 `blue_first` approved artwork is staging-only: under existing red-first canonical state, no valid blue-first trigger exists. Do not modify gameplay merely to use the artwork.
- For ACT3 discovery, CD retains the functional contract: show existing approved photo and torn-note art with durable scene and Pocket data, but content of both visuals remains entirely VA/Teacher-owned.
- ACT14 Next, Runtime text, Teacher voting visibility, ACT6 fixes and other non-art software tasks remain governed by their existing separate CA/GA scope; do not conflate them with image creation.

## Decision process and handoff
Before any image-related program diff, CD should identify the exact authoritative asset key/version, exact state/phase trigger and the minimum UI routing/overlay change. If visual content or composition must change, stop that part and write one concise request to Teacher/VA. Do not ask Teacher to review code-level display routing; review only the resulting visible behavior against the supplied final image. Avoid extra bureaucracy and broad artwork auditing.

Maintain CD-245/CA-321 focused ACT6 audit correction ownership without disruption. No new production authorization or extra unrelated CD workload is created by this letter.
