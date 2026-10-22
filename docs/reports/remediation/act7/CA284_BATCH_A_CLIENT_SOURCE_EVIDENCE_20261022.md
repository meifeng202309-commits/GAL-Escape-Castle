# CA-284 Batch A focused client source evidence

Date: 2026-10-22  
Authorization: `agent-comms/CA_to_CD_20261022T111500Z_batch-a-source-fix-act10-teacher-gate.md`  
Scope: source only; no deployment, SQL, or production access

## Implemented boundary

- Library code value, focus, and selection survive only while run, scene, phase, unresolved state, and locked prefix remain identical. A changed prefix/phase or successful submit clears the draft.
- Sprint 6 discussion value, focus, and selection survive only while run, ACT9/10/11 discussion phase, and discussion session remain identical. A session/phase change or successful send clears the draft.
- Station A retains the existing run/phase/step/round/A-task boundary and now restores the captured viewport after the unchanged task frame is rendered. Authoritative task completion still removes the field.
- Teacher transcript records whether the operator was near the bottom before replacement. Near-bottom follows appended messages; a reader positioned earlier retains the previous scroll offset.

Changed source is limited to `src/game/app.js` and `src/teacher/teacher-console.js`. The serialized poll coordinator, RPCs, SQL, timers, voting, text, and presentation contract are unchanged.

## Regression evidence

`tests/a1-player-polling-browser.mjs` now drives the real player render and handlers through mocked RPC projections:

- Library partial `739` survives a same-authority poll, remains focused, and submits canonical `41739`; the authoritative phase change removes the field.
- ACT10 discussion draft survives a same-session poll and remains focused; a new discussion identity receives no stale draft; a real form submission clears the field and calls `s6_send_message_v2` with the current session.
- Station A preserves value, focus, and a non-top viewport across two confirmed polling commits, then submits `1897` and yields to authoritative task completion.

`tests/act7-v4-normal-timeout-browser.mjs` now also verifies Teacher transcript behavior with real rendering: near-bottom follows one appended message, while an operator at an earlier scroll offset stays anchored after another append.

Validation PASS:

- `node --check` for both changed source files and both browser tests
- `tests/a1-player-polling-static-check.js`
- `tests/act7-v4-normal-timeout-static-check.js`
- `tests/sprint6-static-check.js`
- `tests/a1-player-polling-browser.mjs`
- `tests/act7-v4-normal-timeout-browser.mjs`
- `git diff --check`

No server contract, production state, or Pages source was changed.
