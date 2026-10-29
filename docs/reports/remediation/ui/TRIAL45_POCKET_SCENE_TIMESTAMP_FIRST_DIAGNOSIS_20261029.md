# Trial4+5 Pocket and Scene timestamp-first diagnosis

Date: 2026-10-29  
Authority: `CA_to_CD_20261029T100000Z_fourth-smoke-pocket-and-timing-diagnosis.md`, refined by `CA_to_CD_20261029T103000Z_pocket-scene-timestamp-first-diagnosis.md`

## Ranked diagnosis

### 1. Pocket 30-second failure — obsolete fixture endpoint (high confidence)

The failing wait is `tests/trial45-p0p1-deployed-browser-investigation.mjs:44`:

`document.querySelectorAll("#pocketMount [data-pocket-item]").length === role.items.length`

Current approved `pocketEvidencePanel` renders one selected `.pocket-item-detail[data-pocket-item]` at a time and exposes all items as selector tabs. Therefore GAL-A expects 2 simultaneous detail nodes and GAL-C expects 3, but the valid UI intentionally mounts only one. The timeout is a missing/incorrect test endpoint, not elapsed Pocket rendering. Accepted P7/CD-186 tests use `[data-select-pocket-item]`, click each item and then assert the selected detail/media. No product Pocket regression is established.

### 2. 2506/2508 “post-refresh” failures — Gate B started without a decoded baseline (high confidence)

The harness starts Gate B even when Gate A timed out. Both retained public failures had `gateATimedOut=true`, baseline width `0`, and baseline state not decoded. Three refresh RPCs completed in 20–22 ms and the same node remained connected, but the original external image request was still loading. Gate B therefore measured continuation of initial media loading, not refresh/remount regression.

| sample | navigation | node attached | src assigned | Gate A end | refresh RPCs | Gate B end | endpoint at end | timer/Long Task |
|---|---:|---:|---:|---:|---:|---:|---|---|
| cold 1280×720 #0 | 6115 ms | 6187 | 6444 | 8653 timeout | 22 ms | 11163 / 2508 ms | connected; width 0; loading; invisible | max gap 64 ms; none |
| warm 1366×768 #2 | 1292 ms | 1359 | 1610 | 3799 timeout | 20 ms | 6306 / 2506 ms | connected; width 0; loading; invisible | max gap 65 ms; none |

`baselineStillConnected=true` in both samples and no detached node occurred. The trace does not show an endpoint that appeared early but was recorded late; it shows the endpoint had not appeared. However, because the prerequisite decoded baseline was absent, these are not valid measurements of the retained `<=2500 ms` post-refresh criterion.

### 3. External media delay remains observable, but product regression is not isolated (medium confidence)

The failed traces reach node attachment and src assignment after the synthetic 250 ms resolver delay, then remain in `loading` with no completed diary resource entry before the harness stops. Timer gaps and Long Tasks do not explain the delay. This is evidence of an external resource/decode delay during initial loading, which belongs under the confirmed 15000 ms initial gate. The harness stopped after roughly 5 seconds total Gate A + invalid Gate B and therefore did not measure the 15-second initial endpoint correctly.

The local accepted-candidate records have valid post-refresh passes (20–587 ms; one 2480 ms) and no detached baseline. One 25,701,926 ms local initial outlier corresponds to execution-session suspension and is retained but cannot be attributed to product networking.

## Missing timestamps and minimal correction proposal

The existing trace has state navigation, node transition, refresh duration, resources, timer gaps and Long Tasks, but lacks explicit state-RPC, resolver request/response and image load/error/decode event IDs. Those additions are useful but are not needed to identify the two invalid endpoints above.

Proposed narrowly scoped harness correction requiring separate CA approval:

1. Pocket: assert selector-tab count by role; select each tab; then wait for exactly the selected detail and correct connected decoded role asset. Timestamp selection, render mutation, resolver request/response, src assignment, resource end, load/decode and final endpoint under one trace ID.
2. Scene: measure the initial endpoint independently up to the approved 15000 ms. Only after it passes, capture the decoded connected node identity and start the separate refresh clock; perform three refreshes and apply the existing `<=2500 ms` endpoint. If initial fails, record initial failure and mark Gate B `NOT_RUN_PREREQUISITE_FAILED`, never reinterpret it as a post-refresh failure.
3. Add monotonic events for state refresh start/end, RPC completion, Scene/Pocket render start/end, node identity, resolver request/response, src assignment, resource end, image load/error/decode, endpoint, timer gap and Long Task. Preserve every timeout/failure.
4. Re-run bounded recovered-public and accepted-candidate controls. Do not alter product source, retry behavior or either numerical threshold.

## Recommendation

Authorize only this diagnostic harness correction and bounded controls. No product fix or fifth release is justified from CD-191. The Pocket failure is an obsolete selector contract, and the two >2500 readings are invalid post-refresh samples because Gate B prerequisites were absent. External initial-media behavior still requires a correctly implemented 15000 ms measurement before any future release decision.

