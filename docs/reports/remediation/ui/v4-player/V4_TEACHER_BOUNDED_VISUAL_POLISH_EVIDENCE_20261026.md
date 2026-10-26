# V4 Teacher bounded visual polish evidence

Date: 2026-10-26  
CA authorization: `96edf6d6810175c64afea4284881c80bf804a40e`  
Rollback checkpoint: `96edf6d6810175c64afea4284881c80bf804a40e`  
Implementation baseline: `d77689f5512cdc54bfe198d578aca07f6d5deb56`

## Exact bounded change

Only `src/styles/app.css`, the existing integrated browser gate and its screenshots changed.

- Discussion messages and composer controls use `11pt`, tighter line height/padding/gaps and a 260px transcript cap on desktop.
- Pocket receives a 52vh / minimum 360px internal viewport. Canonical images use `object-fit:contain`, centered positioning and a `min(300px,36vh)` maximum height so image plus clue/control remains practically accessible through the panel's internal scroll.
- Continue placement, Action/Scene/Runtime regions, DOM mounts, renderer/RPC/session/game logic and Teacher UI remain unchanged.

## Healthy canonical media gate

The ACT3 local fixture now resolves tracked canonical WebPs without network or Storage mutation. Browser geometry reported:

- `prop_anna_diary_open`: intrinsic 2048x1282, rendered 447x259, `object-fit: contain`;
- `prop_linda_watch_back`: intrinsic 792x1024, rendered 447x259, `object-fit: contain`.

Both load with positive natural/client dimensions. At 1366x768 and 1280x720 the Pocket has internal scrolling, reaches its exact scroll bottom, and the watch media is reachable while retaining contain. Top and bottom screenshots show the complete diary and watch clues respectively. No horizontal document overflow occurs at device scale 1.

## Regression result

PASS:

- `tests/v4-player-integrated-runtime-browser.mjs`: three Players, ACT10 IME/cross-send/scroll/ack clear, Teacher Open Vote, ACT3 `41739`, Pocket inspect/flip/open/reconnect, healthy media and six screenshots;
- `tests/ca284-act10-teacher-open-vote-browser.mjs`;
- `tests/a1-player-polling-browser.mjs`;
- `tests/v4-player-integration-static-check.js`;
- `tests/a1-player-polling-static-check.js`;
- `tests/sprint5-static-check.js`;
- `tests/structural-package-d-static-check.js`;
- `git diff --check`.

One integrated run encountered a transient Teacher acknowledgement wait timeout; an immediate clean rerun passed, and both independent Teacher Open Vote and Player polling suites passed. No source failure reproduced.

Deferred exactly as CA directed: Continue relocation, Action merging and broader layout redesign. No Pages, SQL, Storage, asset, real-room or production deployment action occurred.

