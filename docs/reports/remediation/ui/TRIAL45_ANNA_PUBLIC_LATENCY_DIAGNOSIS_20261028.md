# Trial4+5 Anna diary public latency — bounded diagnosis

Date: 2026-10-28  
Authority: `CA_to_CD_20261028T153000Z_trial45-smoke-stop-pass-diagnostic-only.md`  
Raw evidence: `docs/reports/remediation/ui/trial45-anna-latency/MEASUREMENTS.json`  
Harness: `scripts/trial45-anna-public-latency-diagnostic.mjs`

## Exact clock and original intent

The release-smoke clock began immediately before `page.goto` and ended when the current formal Scene contained a connected image with `data-asset-key="prop_anna_diary_open"`, positive `naturalWidth`/`naturalHeight`, and `data-asset-state="decoded"`. It therefore included:

1. GitHub Pages navigation and HTML/JS/CSS download;
2. DOMContentLoaded and initial Player-state rendering;
3. the deterministic 250 ms `asset_resolve` delay;
4. three concurrent `refreshState()` calls;
5. production Supabase media fetch and browser decode.

The accepted <=2500 ms threshold originated as a bounded deterministic browser-test limit for the detached-node/remount race. Earlier P7 local evidence was 540/552 ms with local page/media, a 250 ms resolver delay and three polls. It is not a canonical user-facing SLA and was not calibrated as a combined GitHub Pages + Supabase cold-network budget.

## Controlled measurements

The diagnostic used both accepted viewports, three samples per viewport and cache mode (six samples/group). RPC state was deterministic and read-only. No production room was created. The recovered public site used its actual public files and production media. Because the candidate had already been rolled back, the candidate comparison used the exact accepted source through a local no-store page server while retaining the same production Supabase diary media.

| Source / cache | n | min | median | mean | p90/max | >2500 | endpoint timeout |
|---|---:|---:|---:|---:|---:|---:|---:|
| recovered public / cold | 6 | 5397 | 5531 | 5549 | 5832 | 6 | 6 |
| recovered public / warm | 6 | 4864 | 4900 | 5075 | 5454 | 6 | 6 |
| candidate fixture + production media / cold | 6 | 1536 | 1559 | 1555 | 1570 | 0 | 0 |
| candidate fixture + production media / warm | 6 | 949 | 999 | 1165 | 1582 | 0 | 0 |

Recovered measurements are timeout-censored at four seconds plus navigation/setup. All 12 recovered samples fetched the diary resource but ended with no connected decoded diary node, reproducing the old detached-node behavior. All 12 candidate samples ended connected with positive dimensions.

Candidate cold DOMContentLoaded was 75–87 ms and total decode was 1536–1570 ms. Candidate warm total was 949–1582 ms. Cold production-media resource durations observed were approximately 1037–1095 ms. Refresh calls themselves were 33–50 ms. The 2547 ms release sample is therefore consistent with roughly one additional second of real Pages navigation added to a healthy 1.5-second candidate media path.

## Causal assessment

- **Actual candidate product defect:** not demonstrated. Candidate success was 12/12 with production media, both viewports and both cache modes; no detached node or retry failure occurred.
- **Recovered old-product defect:** reproduced 12/12. This is expected because recovery intentionally restored the older frontend; it does not invalidate the candidate fix.
- **Release STOP cause:** a nonrepresentative aggregation in the deterministic threshold. Starting before public navigation makes external Pages latency consume a gate intended to detect the post-render media race.
- **Network realism:** production media latency is real and should remain measured, but GitHub page navigation and Scene media correctness should be separate signals.
- **Uncertainty:** the candidate was no longer publicly accessible after mandatory recovery. The equivalent fixture proves exact candidate rendering against production media, but cannot supply a second candidate-on-Pages distribution without a newly authorized deployment.

## Recommended bounded next gate

No application change is justified by this evidence. CA should explicitly approve this test-criterion clarification before any second release:

1. Keep the <=2500 ms value for the deterministic Scene/media gate.
2. Start that clock at DOMContentLoaded immediately before the fixture's three `refreshState()` calls (or at the first relevant resolver request), not before `page.goto`.
3. Continue to require the current connected node, positive natural dimensions and `decoded` state; any timeout, detached replacement or wrong role asset remains a hard failure.
4. Record public navigation time separately as non-gating telemetry until a canonical SLA is approved.
5. On a separately authorized second Pages attempt, require exact-byte readback, at least three cold and three warm samples per viewport, zero endpoint failures, candidate median/p90 disclosure, full cross-role image regression, Teacher/ACT9/tie/scroll smoke, and compatible recovery readiness.

This is a clock-boundary correction, not a silent threshold increase: the numeric 2500 ms limit and structural product assertions remain unchanged. No second release, product change, DB/Storage mutation or human trial occurred. `NEXT_OWNER: CA`.
