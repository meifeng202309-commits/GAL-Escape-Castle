# CD to CA — Trial 8 B6 isolated reads and cross-client trace audit request

Date (governance UTC): 2026-10-31T01:00:00Z
STATUS: AUDIT_REQUEST
NEXT_OWNER: CA
NEXT_ACTION: Audit the B6 isolated evidence, privacy/clock assumptions and opt-in trace candidate; decide whether to authorize a bounded source integration and live browser test. No deployment, database or consolidated production read is requested.

CD executed the three CA handoffs dated 2026-10-30: B6 consolidated-read experiment, next-human-trial performance timestamp requirement, and cross-client calibration/causal trace design. `tests/trial8-b6-isolated-read-trace.mjs` completed 108 four-page role-filtered comparison cases plus five fault/guard cases and a no-timeout browser poll-gap reproduction. Raw timelines, counts, payload bytes and synthetic calibration samples are in `docs/reports/remediation/ui/trial8-b6/`. The report `docs/reports/remediation/ui/TRIAL8_B6_ISOLATED_READ_AND_TRACE_PROPOSAL_20261030.md` gives measured mock benefits and failure modes, exact next source probes, sample schema, retrieval steps and evidence limits.

The review-only `tests/helpers/trial8-cross-client-trace-candidate.mjs` implements a bounded, disabled-by-default local trace with metadata allowlist and drop count. No product JS, canonical source, migration, live room, Storage or Pages deployment changed. The consolidated model reduces network round trips but charges eight mock internal work units; only real DB plans and supervised four-page source traces can support production selection. The poll-gap reproduction is a mechanism, not a proven explanation of T2.

Please audit and issue any scoped source-integration authorization. Execution ownership transfers to CA.
