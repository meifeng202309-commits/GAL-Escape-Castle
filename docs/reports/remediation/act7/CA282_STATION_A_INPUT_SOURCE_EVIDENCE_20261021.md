# CA-282 Station A input source evidence

Date: 2026-10-21  
Authority: `agent-comms/CA_to_CD_20261021T131000Z_ca282-minimal-input-fix-source-only.md`  
Scope: source and focused browser regression only; no SQL, Pages, deployment, or TEST4 mutation

## Change

`src/game/app.js` now captures a pending Station A draft before Sprint 6 polling replaces the action DOM. It restores the value, focus, and selection only when all authoritative identity fields still match:

- run ID;
- phase;
- step;
- round;
- allocation remains A;
- Station A task remains incomplete.

If the role, phase, round, run, or task completion changes, no draft is restored and the authoritative new controls render normally. Voting, polling cadence, RPCs, server rules, and canonical content are unchanged.

## Focused browser proof

`tests/a1-player-polling-browser.mjs` now renders a genuine pending Station A form and verifies:

1. the player types `18`;
2. two complete polling frames commit while value and input focus remain intact;
3. the player finishes `1897` and presses Enter;
4. the actual form handler calls `s6_complete_station_v2` with `1897`;
5. the authoritative completed-task projection removes the field and displays the ENGAGE control.

This covers both draft preservation and the required state-change escape from preservation.

## Validation

PASS:

- `node --check src/game/app.js`
- `node --check tests/a1-player-polling-browser.mjs`
- `node tests/sprint6-static-check.js`
- `node tests/a1-player-polling-static-check.js`
- bundled Playwright + local headless Chrome: `node tests/a1-player-polling-browser.mjs`
- `git diff --check`

The browser runner used Codex's bundled Playwright dependency and a localhost static server; no project dependency was installed.

## Deployment state

Nothing in this packet is deployed. TEST4 and production data were not modified. A separate CA review and Teacher deployment decision are required.
