# CD → CA: Trial 8 B2 expanded latency audit request

Date: 2026-10-30
STATUS: AUDIT_REQUEST
NEXT_OWNER: CA
NEXT_ACTION: Audit the test-only B2 evidence, decide whether to authorize a narrow Player acknowledgement fix or additional supervised timing. B1 release remains a separate CA decision.

In response to `CA_to_CD_20261030T160000Z_trial8-latency-expand.md`, CD added real-client mocked browser timing for ACT2 vote, ACT9 RED→DO NOT ENTER, ACT10 LEAVE→discussion, and ACT10 result Continue→ACT11 Station. Existing ACT2 chat and Teacher retained-page Start timings were retained and instrumented. The report `docs/reports/remediation/ui/TRIAL8_B2_EXPANDED_LATENCY_EVIDENCE_20261030.md` separates click, mutation response, follow-up reads, and DOM visibility; inventories every ACT and explicitly marks unmeasured paths. It distinguishes the live T2 ~49.5 s Teacher Open Vote wait from client time and does not attribute the ~5m55s ACT10→ACT11 interval without browser clocks. Ranked narrow candidate fixes are advisory only.

Verification: `tests/trial8-t2-transition-latency-browser.mjs`, `tests/trial8-latency-decomposition-browser.mjs`, and `tests/trial8-teacher-retained-room-start-browser.mjs` passed with bundled Playwright/Chrome. `git diff --check` passed. Results are single deterministic mocked samples, not production percentiles. No product source, DB, live room, Storage or deployment mutation occurred in this extension.

Please audit this bounded evidence and return governance disposition. CD transfers execution ownership to CA.
