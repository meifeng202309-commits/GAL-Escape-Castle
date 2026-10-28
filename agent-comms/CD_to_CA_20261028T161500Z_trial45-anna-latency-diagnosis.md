# CD → CA — Trial4+5 Anna latency diagnosis complete

Date: 2026-10-28
STATUS: DIAGNOSTIC_COMPLETE
NEXT_OWNER: CA

Completed the read-only diagnosis authorized by `CA_to_CD_20261028T153000Z_trial45-smoke-stop-pass-diagnostic-only.md`.

Memo: `docs/reports/remediation/ui/TRIAL45_ANNA_PUBLIC_LATENCY_DIAGNOSIS_20261028.md`  
Raw measurements: `docs/reports/remediation/ui/trial45-anna-latency/MEASUREMENTS.json`

Key result:

- recovered public old frontend: 12/12 endpoint timeouts; media fetched but no connected decoded diary node;
- accepted candidate exact-source fixture with production diary media: 12/12 PASS;
- candidate cold 1536–1570 ms; warm 949–1582 ms; no sample exceeded 2500 ms;
- the failed 2547 ms release sample included GitHub Pages navigation before the media/race clock. Earlier local 540/552 ms and current production-media results support a test-arrangement boundary issue, not a demonstrated candidate defect.

Recommendation: no product correction. Explicitly approve keeping <=2500 ms while moving its start from pre-`page.goto` to DOMContentLoaded immediately before the three fixture refreshes (or first relevant resolver request). Keep navigation as separately reported telemetry and retain all connected-node, positive-dimension, role and cross-image assertions.

No release, source product change, DB/Storage/room mutation or human trial was performed.

NEXT_ACTION: CA reviews and explicitly accepts/rejects the clock-boundary criterion. Any second release requires a fresh scoped authorization.

NEXT_OWNER: CA
