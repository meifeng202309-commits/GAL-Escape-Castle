# V4 Player-first source integration evidence

Date: 2026-10-26  
CA authorization: `aecfe160e1d107ce764f036fe483458f4fd01ef5`  
Rollback checkpoint: `aecfe160e1d107ce764f036fe483458f4fd01ef5`  
Implementation baseline: `b93e23ad31afb81c9dffd9480d0baaa6d8fd70f9`

## Implemented boundary

- Re-composed the single production `index.html` Player runtime into stable Scene, Action, Discussion, Story and Pocket regions without changing existing bound IDs.
- Added Player-only responsive layout rules. Automated browser assertions pass at 1366x768 and 1280x720 with two columns, 100% browser scale assumptions and no document horizontal overflow; below 1000px uses one-column source order.
- Preserved native composition nodes by continuing projection polling while deferring DOM commit during composition, then committing the latest frame and refreshing after `compositionend`.
- Preserved identity-bound draft, focus/selection, initial-bottom/near-bottom/scrolled-up intent and clear-only-after-authoritative-message acknowledgement for generic/Sprint5 and Sprint6 discussions.
- Moved Sprint6 Discussion and Pocket into stable mounts without changing RPC handlers. Pocket expansion is restored by `item_key`.
- Mapped only `prop_gitte_castle_map`, `prop_anna_diary_open`, `prop_linda_watch_face` and `prop_linda_watch_back` through the existing resolver and placeholder/load-failure behavior.

No Teacher source, session module, RPC payload, database/migration, Pages, Storage, canonical registry, real room or game state was changed.

## Validation

PASS:

- `node --check src/game/app.js`
- `node tests/v4-player-integration-static-check.js`
- `node tests/a1-player-polling-static-check.js`
- `node tests/sprint5-static-check.js`
- `node tests/structural-package-d-static-check.js`
- `node tests/a1-player-polling-browser.mjs` (local Playwright): Player lifecycle/poll ordering, ACT3 draft/reconnect boundary, Sprint6 draft/focus/new identity/send, native composition node retained through refresh, and 1366x768 plus 1280x720 no-overflow gates
- `node tests/ca284-act10-teacher-open-vote-browser.mjs`
- `node tests/w03-combined-action-browser.mjs`
- `node tests/act7-v4-normal-timeout-browser.mjs`
- `node tests/bmin-teacher-operations-browser.mjs`
- `git diff --check`

`tests/remediation-e1-browser.mjs` was not counted as evidence: its separately required server at `127.0.0.1:4173` was not running, so it stopped before any check and its empty generated report was removed. Existing structural anchor checks passed; no anchor key, coordinate, scene asset selection or sizing algorithm was changed.

## Remaining risks / next gate

- Pixel-level visual acceptance and a three-concurrent-Player real-runtime human pass remain CA/GA/Teacher review items; the earlier isolated three-Player pilot remains the behavior reference, while this source gate establishes production renderer preservation and viewport automation.
- Resolver availability in a deployed environment is not asserted by source tests; missing ACTIVE media continues to use the existing visible placeholder/failure path.
- No deployment or production/full-game action is authorized by this evidence.

