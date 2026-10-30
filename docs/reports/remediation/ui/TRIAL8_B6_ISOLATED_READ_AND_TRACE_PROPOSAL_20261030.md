# Trial 8 B6 isolated reads and cross-client trace proposal

Governance: `CA_to_CD_20261030T230000Z_T8_B6_consolidated_read_experiment.md`, `CA_to_CD_20261030_performance_trace_next_human_trial_requirement.md`, and `CA_to_CD_20261030T240000Z_cross_client_clock_trace_design.md`. No product source, database, migration, live room or deployment changed.

## Executed evidence and limits

`tests/trial8-b6-isolated-read-trace.mjs` ran 108 four-page synthetic fixtures: ACT9, ACT10, ACT2 and ACT6 × full/target/consolidated × 0/100/400 ms read delay × three repetitions. Each fixture used three Player pages, a Teacher page, one mock authority, a versioned Teacher gate plus three-vote barrier, and role-filtered projections. It recorded 2,927 UTC and monotonic event rows in `trial8-b6/B6_TIMELINE.jsonl`; per-case request bytes, counts and illustrative mock work are in `B6_SUMMARY.json`. All 108 plus five fault cases and one poll-gap case passed. This is a **projection model**, not a real-client or SQL workload measurement. B5's actual current-client mocked-RPC timings remain the applicable product-path baseline.

ACT9 median of three, source click to **safe committed DOM** (ms):

| Mode | 0 ms | 100 ms | 400 ms | Requests / four pages | Bytes / four pages | Mock work units |
|---|---:|---:|---:|---:|---:|---:|
| Sequential full | 578 | 1294 | 3722 | 11 | 21,114 | 11 |
| Narrow target | 450 | 519 | 835 | 4 | 318 | 4 |
| Consolidated | 444 | 540 | 805 | 4 | 378 | 32 |

ACT10 400 ms medians were full 3670, target 833, consolidated 850 ms. ACT2/ACT6 used the same timing skeleton; their presence verifies representative phase identities, not production ACT behavior. Sequential full ACT9 first validated data at 876 ms at 400 ms injection but safe DOM at 3722 ms. The model deliberately waits for its eighth Player read before committing. The count includes that Player's reads and one read on each other page; privacy assertions are local and excluded. A consolidated call counts eight illustrative internal work units, so fewer network requests **do not** establish lower database cost. Bytes here reflect fixture payloads, especially an artificial 5 KB irrelevant field, not real transfer sizes.

Every projection asserted that a role receives only its own private marker, including the Teacher. A target result was not committed with stale generation/session; closed gate and incomplete barrier could not reveal the phase. Separate stalled 300 ms, HTTP 503, stale generation, session switch and closed gate cases retained waiting DOM. These are isolated guard checks, not proof of production RLS or all phase semantics. A simulated no-timeout poll coordinator made only one outgoing request over 400 ms while the read was unresolved, then resumed queued work when resolved. This reproduces a browser-side request-generation gap mechanism; it does not establish that T2's actual gap had that cause. A genuine hidden/background tab, network disruption and actual current coordinator timeout remain untested.

## Trace candidate and exact proposed probes

`tests/helpers/trial8-cross-client-trace-candidate.mjs` is a **review-only** bounded local ring buffer, disabled by default, with schema version, dropped count, UTC ISO plus per-process monotonic time, metadata allowlist and no network or storage export. Ten thousand isolated `record` calls took 18.6 ms on this machine; this is a Node microbenchmark, not gameplay frame overhead. The test verified capacity three drops 9,997 rows and excludes message body/session token fields. Before source integration, CA/Teacher must approve the opt-in test switch, local download UX and exact retention policy.

Proposed source probes, all with interaction ID, request ID, role, session epoch, generation, authoritative version and phase identity where known:

1. Input capture and handler entry; mutation request start, headers/body completion or timeout/error; client acknowledgement.
2. Each authoritative read start/end; refresh queued, in-flight, discarded by generation/session/phase, and frame committed.
3. MutationObserver or equivalent actual next-Action DOM-visible mark after commit, with visibility/focus/background transitions.
4. Teacher gate open and participant barrier start/end on authority side, plus server receive/commit **only where an existing safe server trace can expose them**. Do not invent server receipt from browser timestamps.
5. Retry and local export start/end, with drop count. Export in one local download or Teacher-supervised batch after the test. Logging/export must not block gameplay.

Sample schema row (metadata only): `{"schema_version":1,"event":"read_end","role":"GAL-A","session_id":"opaque-local-test-id","utc":"2026-10-30T10:00:00.000Z","monotonic_ms":1234.5,"interaction_id":"i-7","request_id":"r-9","phase":"act9_console","state_version":42,"generation":3,"session_epoch":1,"rpc":"s6_get_player_state","http_status":200}`. A real implementation should hash or omit session identifiers; never log credentials, private clues, vote choices, codes or chat text. In the candidate, `session_id` must therefore be supplied as an opaque test label, not a token or raw authentication key.

Cross-client causal trace: each of Teacher, GAL-A/B/C and server exports its own UTC/monotonic stream. Match interaction/request ID and authoritative version; a private vote change is logged for another recipient only once that recipient is entitled to status/outcome. Calibrate each browser/server clock with repeated t0 client-send, t1 server-receive, t2 server-send, t3 client-receive samples. Estimate server-minus-client offset as `((t1-t0)+(t2-t3))/2`; uncertainty is at least `(t3-t0-(t2-t1))/2` plus timestamp precision and routing asymmetry. Take multiple samples and repeat during long runs. Twenty deterministic calibration samples across four roles passed their known synthetic offsets within the computed bounds; this is an algebra/check fixture, not measured device skew. Never subtract unrelated monotonic clocks or claim precise one-way latency. Report a propagation interval with calibration uncertainty; separate Teacher gate wait, participant barrier wait and human reading time from transport/refresh.

## Next source proposal and retrieval

Preserve mutation RPCs and server authority. If CA approves source integration, first place the candidate recorder behind a supervised opt-in flag, add the exact probes above to the current Player/Teacher refresh coordinators, and expose a local JSON download per browser. The server may add a safe metadata-only trace identifier/version at existing RPC boundaries after separate schema/privacy review. Test with three Players plus Teacher, stalled/failed requests and actual page hide/show; compare tracing enabled/disabled click-to-visible latency and frame cost. Do not ship a consolidated read until role-private projection, Teacher gate, barrier, session epoch and generation guards plus real DB query plans are measured. Current B6 artifacts are retrieved directly from `docs/reports/remediation/ui/trial8-b6/`; no network telemetry was enabled.
