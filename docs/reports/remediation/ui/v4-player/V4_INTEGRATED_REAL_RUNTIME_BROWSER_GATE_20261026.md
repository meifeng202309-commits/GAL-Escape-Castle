# V4 integrated Player real-runtime browser gate

Date: 2026-10-26  
CA request: `801fedf7c1984526359b5318068c98c769b1bd81`  
Implementation under test: `b93e23ad31afb81c9dffd9480d0baaa6d8fd70f9`  
Integrated gate baseline: `04659922000d950dad3b400a12dd49cdc6e973b9`

## Gate and result

`tests/v4-player-integrated-runtime-browser.mjs` hosts the repository locally and opens the actual production `index.html`, which imports production `src/game/app.js`. It does not open `pilots/v4-two-scene/player.html`, intercept production traffic, or mutate a real room. RPC projections are the existing isolated local fixtures.

PASS:

- three independent Player browser contexts with the three canonical role/session identities;
- native Chinese composition retains the same `#s6MessageText` node and `ni` value across three explicit production refreshes, then commits `你好` once and displays it cross-player;
- each of the three Players sends through the production Sprint6 handler; five total gate messages are recorded (one IME message, three identity messages and one anchor message);
- fresh transcript starts at bottom; deliberate `scrollTop=40` remains within 2px after an incoming message;
- successful sends clear only after the authoritative message appears;
- the real `teacher.html` handler opens ACT10 vote exactly once and returns visible acknowledgement;
- ACT3 locked prefix `41` plus suffix `739` submits exact `41739` once;
- servant diary inspection and watch front-to-back flip each execute once; authoritative watch back view survives full Player page reload;
- an expanded Pocket item remains expanded across the flip refresh;
- 1366x768 and 1280x720 contexts use device scale factor 1, retain the desktop two-column grid and have no document horizontal overflow;
- four full-page screenshots were visually inspected.

## Asset result

The safe fixture deliberately returns `asset_resolve: {ok:false}`. Production rendering therefore exposed the existing placeholder path while retaining exact canonical keys `prop_anna_diary_open` and `prop_linda_watch_back`; no invented URL or alternate art appeared. This proves mapping/failure behavior, not deployed resolver health. Map and watch-face keys remain covered by the source/static mapping gate; deployed availability remains a later non-source gate.

## Screenshots

- `screenshots/integrated-act10-1366x768.png`
- `screenshots/integrated-act10-1280x720.png`
- `screenshots/integrated-act3-1366x768.png`
- `screenshots/integrated-act3-1280x720.png`

Visual observation for GA: both widths fit without whole-page horizontal overflow. Discussion and Pocket are bounded in the right column, with internal scrolling. The synthetic ACT3/ACT10 projections intentionally leave some Scene/Action content sparse. Placeholder diagonals are expected resolver-failure evidence, not final media pixels. Pixel/design acceptance remains GA-owned.

## E1 boundary conflict

`tests/remediation-e1-browser.mjs` is not a purely local mocked browser test: it imports `sprint5-live-e2e.js`, `structural-package-b-live-e2e.js` and `structural-package-d-live-e2e.js`, creates backend fixtures and drives RPC game state. Starting a static server alone does not isolate those mutations. CA's same instruction forbids real rooms and production gameplay actions, and no separately identified disposable local/staging Supabase target was provided. CD therefore did not run E1 and does not label it PASS. Running it requires CA to identify/authorize a non-production backend envelope or explicitly supersede the real-room prohibition.

No production source, Pages, SQL, Storage, asset or real game state changed in this gate.

