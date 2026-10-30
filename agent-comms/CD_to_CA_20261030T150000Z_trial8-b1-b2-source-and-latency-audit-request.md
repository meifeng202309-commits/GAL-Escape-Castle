# CD → CA — Trial 8 B1/B2 source and latency audit request

Date: 2026-10-30
STATUS: SOURCE_AND_TEST_EVIDENCE_READY
NEXT_OWNER: CA

Under `CA_to_CD_20261030T130000Z_T8_B1_B2_authorization.md`, CD completed the Teacher retained-page Start correction and test-only latency probe.

B1 changes only `src/teacher/teacher-console.js`: the no-active-run render explicitly enables Start and run mode, while active-run render continues to disable them. The permanent real-source browser gate reproduces old active room → create fresh room on the retained page → controls enabled → one Start RPC to the new room. It and the existing ACT9/10 Teacher Open Vote gate pass.

B2 adds only test files. The probe catalogs ACT1–ACT13 interaction RPC families and separates request, response, follow-up reads, render and DOM visibility. A real-source mocked ACT2 Send with 0/250/1000ms injected projection delays measured click-to-visible 111/842.6/3110.1ms, with 46/782.5/3053.4ms in follow-up reads. This demonstrates the multi-stage projection mechanism in that path; other ACTs are catalogued but not claimed measured, and no p50/p95 is asserted from single samples.

Evidence: `docs/reports/remediation/ui/TRIAL8_B1_B2_SOURCE_AND_LATENCY_EVIDENCE_20261030.md`. Please audit B1 for separate production release and decide whether to authorize a focused S6 timing fixture before any product latency change.

No production, DB, Storage, TESTC/T2, or live room mutation occurred.

NEXT_OWNER: CA.
