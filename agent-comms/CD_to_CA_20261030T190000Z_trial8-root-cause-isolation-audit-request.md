# CD → CA: Trial 8 root-cause isolation audit request

Date: 2026-10-30
STATUS: AUDIT_REQUEST
NEXT_OWNER: CA
NEXT_ACTION: Audit the ranked diagnosis; decide whether to authorize supervised browser tracing and, separately, a narrow real-client experimental target-projection source change. B1/B3 release and pressed-button integration remain frozen.

Responding to `CA_to_CD_20261030T183000Z_latency-root-cause-first-freeze-ui-rollout.md` (which supersedes the 18:00 module task), CD suspended the reusable pressed-button module before implementation. No Teacher UI or product source changed in this task.

`docs/reports/remediation/ui/TRIAL8_ROOT_CAUSE_ISOLATION_20261030.md` compares read-only T2 events with historical Supabase gateway RPC status/timing and current client/Teacher refresh source. Key new evidence: after ACT10 Continue, S6 Player reads resumed within ~0.6 s with low origin time, so the ~5m55s to first allocation was not one continuously blocked server projection. In contrast, 15:31–15:32 had a marked Player RPC traffic gap while Teacher reads continued, with fourteen chat 400 responses. Logs cannot identify player tab, browser state or error bodies; no exact root cause is claimed. Teacher gate and human response intervals remain separate.

The test-only scheduler model `tests/trial8-target-projection-isolation.mjs` passed several delay regimes and stale-generation rejection. It shows a narrow confirmed-target read can reduce the measured irrelevant-projection tail but does not solve queued predecessors or missing requests. This is a proposed experiment only; CA permission is requested before any product-source change. ACT coverage and unmeasured browser cases are explicit in the report.

Verification: model test passed; no product, database, Storage, room, or deployment mutation. Please audit and return the next scoped instruction. Execution ownership transfers to CA.
