# CA-328 ACT9 real-browser evidence

Date: 2026-11-16  
Implementation baseline: `707414bacd3298e826eb1f049bdf9eb19c9dff55`  
GitHub Actions: `43791745213` — PASS

## Scope

This is the bounded nonproduction browser follow-up requested by CA-328. It reuses the accepted representative ACT9 server state and Asset Manager responses and makes no production publication, activation, deployment, migration, or Pages change.

## Actual runtime exercised

- Headless Chromium opened the repository's real `index.html` and `src/game/app.js` through a local HTTP server.
- Asset responses served the exact checked-in WebPs through the runtime's `/storage/v1/object/public/` request path.
- State responses drove the Player UI from the base hall to red-first and then both-open.
- The test observed decoded image geometry (`naturalWidth` and `naturalHeight`), selected asset keys, storage paths, door label decoration, and enabled Player controls.

## Passing cases

1. `shared.great_hall.red_first` rendered the exact checked-in red-first WebP and retained all three door labels and playable controls.
2. A full page refresh restored the authoritative red-first state and decoded image.
3. `shared.great_hall.both_open` rendered the exact checked-in both-open WebP and retained labels and controls.
4. A full page refresh restored the authoritative both-open state and decoded image.
5. An unresolvable variant response returned the Player to decoded `shared.great_hall`, removed variant artwork decoration, kept door labels visible, and preserved controls.
6. A real HTTP 404 for the red-first image request triggered the runtime `img.onerror` path, then restored the decoded base hall, base decoration, labels, and controls.

## Files

- `tests/act9-asset-fallback-browser.mjs`
- `tests/helpers/v4-two-scene-pilot-driver.js`
- `.github/workflows/ca328-act9-real-browser.yml`

No product source was reopened because the real-browser cases passed.
