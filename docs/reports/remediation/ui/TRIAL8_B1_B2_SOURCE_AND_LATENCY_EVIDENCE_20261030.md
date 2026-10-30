# Trial 8 B1/B2 source and latency evidence

Date: 2026-10-30  
Authority: `agent-comms/CA_to_CD_20261030T130000Z_T8_B1_B2_authorization.md`  
Baseline: `8e42d3d`

## B1 Teacher retained-page correction

`src/teacher/teacher-console.js` adds exactly two resets in the `!state.active` branch of `renderDiscussionState`: enable `runModeInput` and `startRunButton`. Active-run rendering still disables both. The permanent real-source browser regression uses one retained Teacher page: load an old active room, create a new room on the same page, assert both controls enabled, click Start, and assert exactly one `s9_start_formal_game` request for the new room. No server mutation occurs; every RPC is mocked.

`tests/trial8-teacher-retained-room-start-browser.mjs`: PASS. Existing `tests/ca284-act10-teacher-open-vote-browser.mjs`: PASS. `node --check src/teacher/teacher-console.js`: PASS.

## B2 test-only timing probe

`tests/helpers/trial8-latency-observer.mjs` catalogs ACT1–ACT13 and Teacher interaction RPC families and installs an opt-in browser test probe. It records request start/response, DOM mutation markers, and decomposes a selected mutation into click→request, mutation response, follow-up projection reads, render→visible, and total click→visible. It is imported only by tests; no production telemetry was added.

`tests/trial8-latency-decomposition-browser.mjs` exercises real `index.html` and `src/game/app.js` with all RPCs intercepted. One ACT2 Send is measured per deterministic injected projection delay. The transcript is visibly acknowledged once. Measurements in this local executor:

| Injected delay per projection | Click→request | Mutation response | Follow-up reads | Render→visible | Click→visible |
|---:|---:|---:|---:|---:|---:|
| 0 ms | 38.0 ms | 8.2 ms | 46.0 ms | 18.8 ms | 111.0 ms |
| 250 ms | 33.3 ms | 9.5 ms | 782.5 ms | 17.3 ms | 842.6 ms |
| 1000 ms | 34.4 ms | 12.8 ms | 3053.4 ms | 9.5 ms | 3110.1 ms |

Seven follow-up projection calls were observed after Send: the completion authority, S2 authority, five active projections (including a second S8 read). The nearly 3× injected-delay growth confirms the three serial read stages in this ACT2 path. These are single samples with injected delay, so there is no p50/p95 and no production click→DOM estimate. ACT1 and ACT3–ACT13 are catalogued for fixture extension but **not individually measured** by this gate. Teacher-paced and participant barriers remain unmodified.

## Scope and next decision

No deployment, database change, TESTC/T2 mutation, Storage action, or unrelated product change occurred. CA should review B1 for separate release authorization. For B2, the measured mechanism supports a narrow next experiment on one high-impact S6 action path before proposing a product latency correction; it does not justify a global frame/poll rewrite.
