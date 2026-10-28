# Trial4+5 trace-only two-gate harness closure

Date: 2026-10-28  
Authority: `CA_to_CD_20261028T200000Z_trial45-trace-only-harness-gate.md`  
Harness: `scripts/trial45-anna-public-latency-diagnostic.mjs`  
Final evidence: `docs/reports/remediation/ui/trial45-trace-harness/TWO_GATE_FINAL_RUN.json`

## Exact test-only diff

Only the diagnostic harness changed. No product HTML/JavaScript/CSS/catalog, migration, database, Storage, Pages or room data changed.

The harness now:

- records navigation separately;
- enforces Gate A, DOMContentLoaded → correct connected/visible/decoded positive-dimension Anna Scene, <=2500 ms;
- enforces Gate B, immediately before three controlled refreshes → current correct connected/visible/decoded positive-dimension Anna Scene, <=2500 ms;
- records browser-monotonic DOMContentLoaded, Gate A endpoint, refresh start/end and Gate B endpoint timestamps;
- records node state transitions (attach, src, natural dimensions, decoded), resource start/end, maximum 50 ms timer gap and Long Tasks;
- records whether the Gate A baseline node remains connected;
- exits nonzero if any exact-candidate sample fails either gate or endpoint integrity;
- runs both viewports with three cold and three warm samples each for restored public control and exact candidate fixture with production media.

## Final measured run

| Source/cache | n | Gate A range | Gate A failures | Gate B range | Gate B failures |
|---|---:|---:|---:|---:|---:|
| restored public / cold | 6 | 2502–2514 ms | 6 | 2504–2516 ms | 6 |
| restored public / warm | 6 | 2502–2513 ms | 6 | 2507–2515 ms | 6 |
| exact candidate + production media / cold | 6 | 1249–2515 ms | **1** | 19–1171 ms | 0 |
| exact candidate + production media / warm | 6 | 976–1254 ms | 0 | 20–29 ms | 0 |

The restored old public control fails because it never exposes the connected candidate diary node; this is expected and visibly distinguishes the control.

The final harness correctly exited nonzero on one exact-candidate cold 1280×720 Gate A failure:

- navigation (separate): 36 ms;
- DOMContentLoaded browser timestamp: 78 ms;
- node attached/no src: 113 ms;
- production-media src assigned/loading: 417 ms;
- Gate A timeout: 2515 ms; node remained connected but dimensions were zero;
- natural dimensions 2048×1282: 3312 ms;
- decoded: 3761 ms;
- max timer gap: 60 ms; Long Tasks: zero;
- Gate B refresh end: 22 ms; Gate B endpoint: 1171 ms, PASS;
- baseline node remained connected.

This is concrete production-media tail evidence, not a detached-node race or event-loop stall. The unchanged 2500 ms initial-readiness gate therefore rejects the run exactly as specified. The harness did not mask the failure, rerun until green or raise the threshold.

## Reproducibility and accept criteria

Run with the bundled Playwright dependency and Chrome:

`node scripts/trial45-anna-public-latency-diagnostic.mjs`

Acceptance remains:

- 12 exact-candidate samples (two viewports × cold/warm × three);
- Gate A and Gate B each <=2500 ms for every sample;
- zero wrong asset, detached current node, invisible node, zero dimensions, missing decoded state or endpoint timeout;
- navigation reported separately;
- any candidate failure produces nonzero process exit.

Current result: **HARNESS IMPLEMENTATION PASS; CANDIDATE EVIDENCE FAIL** because Gate A failed 1/12. No product defect beyond external media tail is established, and no threshold/product/release decision is authorized here.

`NEXT_OWNER: CA` to decide the narrowly defined next path. No third production release or human trial is authorized.
