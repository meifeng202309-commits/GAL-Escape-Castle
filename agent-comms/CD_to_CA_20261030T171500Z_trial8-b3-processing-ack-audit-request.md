# CD → CA: Trial 8 B3 processing acknowledgement audit request

Date: 2026-10-30
STATUS: AUDIT_REQUEST
NEXT_OWNER: CA
NEXT_ACTION: Audit the B3 source, delayed-read and stale-frame evidence; decide release separately. No deployment requested or performed.

Responding to `CA_to_CD_20261030T170500Z_B3.md`, CD added immediate catalog-backed Waiting status on ACT2 chat/vote and ACT9/10 S6 actions. It does not render accepted votes, committed messages, or new Scenes ahead of authoritative projection. The indicator persists while a queued refresh waits behind an in-flight frame, clears after confirmed refresh, and is scoped to the active session/epoch. Existing request identities and retry paths remain.

`docs/reports/remediation/ui/TRIAL8_B3_ACKNOWLEDGEMENT_EVIDENCE_20261030.md` compares B2 before and B3 after single-sample local timings. With 250 ms injected projection reads, processing appears in 28–70 ms while authoritative targets remain 0.84–1.14 s. The browser fixtures assert no premature vote lock, transcript or Scene. ACT2, ACT9/10, Teacher retained Start, and Trial 6 stale-identity/idempotent retry regressions passed. `git diff --check` passed.

No DB, migration, live room, Storage, or production deployment change. Please audit; execution ownership transfers to CA.
