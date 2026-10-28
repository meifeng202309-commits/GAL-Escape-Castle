# Trial4+5 29.6-second public tail — bounded diagnosis

Date: 2026-10-28  
Authority: `CA_to_CD_20261028T181500Z_trial45-public-tail-diagnostic-only.md`  
Original outlier: `docs/reports/remediation/ui/trial45-second-release/ANNA_MEASUREMENTS.json`  
Controlled trace repeat: `docs/reports/remediation/ui/trial45-tail-diagnosis/CONTROLLED_REPEAT_WITH_TRACE.json`

## Located await and timestamps

The single second-release outlier was warm 1280×720:

- navigation, measured separately: 644 ms;
- clock started after DOMContentLoaded;
- `page.locator("#formalSceneMount #s3bSceneImage").waitFor()`: 29543 ms;
- three concurrent `refreshState()` calls: 40 ms;
- final connected, positive-dimension, decoded endpoint: 29600 ms;
- final image: correct Anna diary, 2048×1282;
- no diary resource timing entry was exposed for that warm-cache sample.

Therefore the 29.6 seconds did **not** occur in the awaited refresh coordinator and did not measure a delayed wake after the endpoint was already known. It occurred before refresh began, while Playwright was waiting for the initial formal Scene image to become visible. The previous harness named this value `sceneMountedMs`, but its wait is visibility-based and can include initial asset resolution/fetch/decode; it is not merely DOM attachment.

The original outlier run predated trace instrumentation. It has no timer-gap, transition or long-task trace. It is therefore impossible to prove retrospectively whether Chromium scheduling, public resource/cache behavior or app rendering caused the full delay. Treating it as a harmless Playwright anomaly would be speculation.

## Controlled repeat

The restored public frontend and exact local candidate were repeated at 1280×720 and 1366×768, three cold and three warm samples per viewport. The harness now records DOM state transitions, resource timing, Long Tasks and maximum 50 ms timer gap.

| Source/cache | n | range | >2500 | endpoint failure |
|---|---:|---:|---:|---:|
| restored public / cold | 6 | 4372–4471 ms censored | 6 | 6 |
| restored public / warm | 6 | 4369–4467 ms censored | 6 | 6 |
| exact candidate local page + public media / cold | 6 | 1453–2017 ms | 0 | 0 |
| exact candidate local page + public media / warm | 6 | 880–1492 ms | 0 | 0 |

The restored old frontend fetched/rendered its generic Scene shell but never produced a connected candidate diary node, consistently reproducing the known old renderer behavior. It is not a proxy for candidate-on-Pages timing.

All 12 exact-candidate controls produced the expected transition sequence: absent → attached/no source → source loading → positive natural dimensions → decoded. Maximum observed timer gap was 104 ms; refresh was 36–58 ms. No candidate control reproduced a browser event-loop stall or 29-second mount.

## Causal assessment

- **Specific operation:** initial public Scene visibility wait, not refresh/poll completion.
- **Actual user-visible blockage:** plausible and must remain failed. If the element truly remained non-visible for 29.5 seconds, the UI readiness gate correctly rejects it.
- **Harness wait/wakeup anomaly:** not demonstrated; the original trace is insufficient.
- **Candidate product race/retry defect:** not demonstrated. Exact candidate + same production media passes 12/12 with connected decoded nodes, and the broad public smoke passed every role before the tail sample.
- **External/browser/public-cache tail:** most consistent explanation, but only medium confidence because the candidate was recovered and cannot be re-traced publicly without another deployment.

No source-product correction is justified on present evidence. Optimizing code against an untraced one-off external tail would be guesswork.

## Narrowly corrected trace plan and accept criteria

The next authorized candidate test should split, not weaken, the gate:

1. **Initial readiness gate:** from DOMContentLoaded to the first correct connected positive-dimension decoded Scene image, <=2500 ms for every sample.
2. **Refresh/remount gate:** after initial readiness is established, start immediately before three concurrent fixture refreshes; require the current correct connected positive-dimension decoded image within <=2500 ms for every sample.
3. Record navigation separately; record monotonic timestamps for node attached, source assigned, resource response/end, positive dimensions, decode state, refresh start/end, timer maximum gap and Long Tasks.
4. At least three cold and three warm samples per viewport; zero timeout, zero wrong-role asset, zero detached replacement and zero sample over either 2500 ms gate.
5. Any 29-second initial blockage fails gate 1 even if gate 2 is fast. This definition cannot hide the observed failure.

Required next approval: CA must decide whether to authorize trace-only harness hardening and, separately, whether any future candidate deployment is justified. A third release, threshold change, product patch or human trial remains unauthorized. `NEXT_OWNER: CA`.
