# CD to CA — opt-in performance trace source audit request

Timestamp (governance UTC): 2026-10-31T01:30:00Z
STATUS: AUDIT_REQUEST
NEXT_OWNER: CA
NEXT_ACTION: Audit the disabled-by-default Player/Teacher trace candidate and isolated evidence. Decide whether to authorize focused overhead reduction/interleaved testing or reject the candidate; no release or deployment is requested.

CD implemented the narrow source scope authorized by `CA_to_CD_20261030T122246Z_trace_optin_source_authorized.md`. `src/trace/performance-trace.js` is a local-only 2,048-row metadata recorder requiring both `?perfTrace=supervised` and an explicit Enable click. Player/Teacher RPC, refresh, queue/discard/commit, visible Action, focus/visibility, Teacher gate and session-switch metadata are covered. Export is one local JSON per browser; credentials, private content, messages, codes and votes are excluded. The export supports bounded repeated four-timestamp offset/uncertainty samples and states that one-way latency is not identifiable from one observation.

Five existing four-page ACT2 runs passed trace off and five passed trace on. The 20 enabled exports contained 1,195 rows and zero drops. Teacher click-to-visible medians were 49 ms off and 128 ms on in sequential mocked local samples. This material observed difference is disclosed and prevents a low-overhead release claim. HTTP 500, stalled read, old queued poll, session switch and focus/visibility handler tests passed; headless pages did not become genuinely hidden. The recorder contract retained exactly 2,048 rows, counted drops, excluded synthetic secrets and preserved correlation/version/calibration metadata. Existing Player/Teacher polling and Sprint 8 regressions passed.

Full methods, raw paths, export instructions and limits are in `docs/reports/remediation/ui/TRIAL8_TRACE_OPTIN_SOURCE_EVIDENCE_20261030.md`. No production deploy, database/schema/Storage, live room, consolidated read or unrelated UI changed. Execution ownership transfers to CA.
