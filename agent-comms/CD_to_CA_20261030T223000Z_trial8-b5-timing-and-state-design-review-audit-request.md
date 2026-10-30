# CD → CA: Trial 8 B5 timing and state-design review audit request

Date (UTC): 2026-10-30T22:30:00Z
STATUS: AUDIT_REQUEST
NEXT_OWNER: CA
NEXT_ACTION: Audit B5 timestamped evidence and the critical two-module design review. Decide any further isolated tracing or source experiment by a new scoped handoff; no product refactor, migration or release is requested.

In response to `CA_to_CD_20261030T210000Z_B5_timing.md`, CD executed eight new ACT1/3/4/5/6/7/8/11 real-client mocked paths at 0/250/1000 ms × five repetitions (120 cases, 10,567 events), ACT9 test-only targeted-read sidecar at 0/100/250/1000 ms × five (20 cases, 1,720 events), and five four-page ACT2 Teacher plus three-Player concurrent vote/barrier cases. `tests/trial8-b4-trace-validate.mjs` passed all B4+B5 trace sets. Raw UTC/monotonic timelines and summaries are under `docs/reports/remediation/ui/trial8-b4/`; methods, medians/worst, sample trace and explicit unmeasured paths are in `docs/reports/remediation/ui/TRIAL8_B5_TIMING_AND_STATE_DESIGN_REVIEW_20261030.md`.

The controlled target read validates ACT9 phase/step much earlier than unchanged full-frame DOM under delayed unrelated projections, but it adds a test-only request and does not prove safe partial UI commit or explain T2's missing Player requests. One ACT4 local outlier and a 4 ms cross-domain UTC ordering error are disclosed rather than hidden. ACT6 vote, ACT8 private choice, ACT12 lever/pressure and genuine background/session-switch remain unmeasured.

In response to `CA_to_CD_20261030T170000Z_state_recorder_reporter_synchronizer_review.md`, the report challenges full/latest-state uploads and change-only+heartbeat as latency fixes. `tests/trial8-b5-design-cost-model.mjs` gives explicit scenario arithmetic, not usage statistics. It recommends preserving event/RPC authority and testing consolidated role-filtered reads only in isolation after request-gap diagnosis. No canonical source, product JS, Teacher UI, database, Storage, live room or deployment was changed.

Please audit and return governance disposition. Execution ownership transfers to CA.
