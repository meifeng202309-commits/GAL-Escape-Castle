# Trial 4+5 Pocket/Scene diagnostic harness correction evidence

Date: 2026-10-29  
Scope: CA letter `CA_to_CD_20261029T113000Z_fix-diagnostic-harness-only.md`  
Product/deploy/database/storage mutations: none

## Harness corrections

- Pocket now waits for role-specific `[data-select-pocket-item]` tabs, clicks each tab sequentially, and requires the selected `[data-pocket-item]` detail plus its expected `data-asset-key` image to be connected, visible and decoded before continuing.
- Pocket records one trace ID and monotonic timestamps for navigation, RPC/resolver/media responses, tab readiness, each selection endpoint, and failure branches.
- Scene uses the approved 15000 ms initial endpoint. It captures the baseline node and performs three refreshes only after that endpoint passes; otherwise Gate B is `NOT_RUN_PREREQUISITE_FAILED`.
- Scene retains the 2500 ms refresh gate and records a trace ID plus RPC, render, resolver, src, resource, load/decode and final endpoint timestamps. `GAL_TRACE_SAMPLES` permits a bounded focused run without changing default coverage.

## Focused results

### Local candidate control

- Existing P2–P6 browser control: PASS for GAL-A/B/C at 1366x768 and 1280x720. Every role item produced the expected decoded Pocket media; scene endpoints were also decoded and visible.
- Scene candidate, one cold and one warm sample per viewport: 4/4 initial PASS and 4/4 refresh PASS.
- Initial endpoint: 1269–1276 ms cold, 1273–1290 ms warm.
- Three-refresh endpoint: 39–48 ms cold, 58–62 ms warm.
- Stable baseline node remained connected in all four samples; no genuine post-refresh blocker reproduced.

### Read-only recovered-public control

- Pocket: 0/6 PASS. All three roles at both viewports reached the explicit failure branch `SELECTOR_TABS_ENDPOINT_FAILED`; expected selector counts were GAL-A=2, GAL-B=1, GAL-C=3 and actual count was 0 in every sample. This is consistent with the intentionally recovered older public baseline.
- Scene: 0/4 initial PASS. All samples reached the 15000 ms initial limit (15009–15017 ms). Gate B was not executed in all four samples and was recorded as `NOT_RUN_PREREQUISITE_FAILED`.
- These failures are baseline capability/initial-load evidence; none is a valid post-refresh regression.

## Evidence

- `tests/trial45-p0p1-deployed-browser-investigation.mjs`
- `scripts/trial45-anna-public-latency-diagnostic.mjs`
- `docs/reports/remediation/ui/trial45-p0p1/P0P1_BROWSER_EVIDENCE.json`
- `docs/reports/remediation/ui/trial45-p2p6/P2P6_BROWSER_EVIDENCE.json`
- `docs/reports/remediation/ui/trial45-anna-latency/MEASUREMENTS.json`

## Recommendation

The corrected harness clears the candidate under both approved gates and turns recovered-public limitations into explicit prerequisite failures. CA may audit this evidence and decide any later release action separately; this work does not authorize or perform a fifth release.
