# FAILURE / CONCURRENCY SNAPSHOT

Baseline: `93bd15ca36dd985685a0706bad9ec56ba4002a6e`

| Mutation / boundary | Failure window | Effective behavior | Result |
|---|---|---|---|
| role join | simultaneous claim | row lock / existing session claim rejects second | PASS |
| `s2_start_run` | duplicate concurrent start | room lock + active-run check | PASS |
| start-run → initialize-flow | after run commit, before init request | formal run active, no canonical state; player formal branch cannot render | **FAIL IDA-003** |
| start-run response lost | post-commit/pre-response | retry rejects already-active; Teacher polling should rediscover run | recoverable source-level, live not tested here |
| init-flow response lost | post-commit/pre-response | retry reports already initialized; polling can reconstruct canonical state | recoverable |
| ACT1 action response lost | post-commit/pre-response | retry may reject as already locked/unavailable; 1.2s polling converges | acceptable but not replay-success |
| ACT2/5 final vote | simultaneous final submissions | session/run locks + unique decisions + apply resolution in transaction | PASS |
| Library correct solve | simultaneous correct submissions | guarded/idempotent group resolution | PASS source/test evidence |
| Sprint5/Sprint6 behavior actions | stale tab / duplicate request | expected identities + request receipts/unique state | PASS source-level |
| Teacher Override duplicate | concurrent/replay | room/run locks + interaction uniqueness/recent duplicate protection | PASS source-level |
| audio playback unavailable | browser/audio failure | occurrence marked stopped / outbox retries consumption | PASS source-level |
| ACTIVE asset object fails | load error | exact active metadata telemetry + bounded dedup + placeholder | PASS source-level |
| finalization delayed from old run | new run active | explicit expected run id + idempotent finalized old run | PASS existing live-test source |
| export old completed run | multiple completed runs | run-specific overload + Teacher selection | PASS source-level |

## Startup failure amplification

The split startup has an additional race-free failure mode:

```text
Start formal run succeeds
→ canonical_flow_active is still false
→ generic Sprint2 "Open discussion" remains available
→ Teacher can open generic discussion
→ s3b_initialize_flow intentionally refuses initialization until it is resolved
```

No race is required. The product exposes two mutually interfering legal operations in the same startup window.

This strengthens **IDA-003**.

## Live contradiction

Teacher evidence is stronger than a hypothetical race: the deployed session returned a run id then behaved as though no active run existed. The source has no legitimate transition from a just-created active run to absent active run at this point.

Root cause remains **NOT VERIFIED** because current CA cannot query deployed database/runtime directly. **IDA-004**.
