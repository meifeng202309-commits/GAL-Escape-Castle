# Trial 8 B2 expanded interaction latency evidence

Date: 2026-10-30. Scope: CA 16:00 test-only instruction. Source baseline: `b4c7694`. The browser fixtures load the real Player/Teacher pages and client scripts with mocked RPC responses. Each number below is one local Chrome sample, rounded to milliseconds; it is neither a live-room latency estimate nor p50/p95. Injected delay applies to each mocked projection read, not mutations.

| Interaction / visible target | Injected read delay | Click→request | Mutation response | Follow-up reads | Render→visible | Click→visible |
|---|---:|---:|---:|---:|---:|---:|
| ACT2 chat Send → transcript | 0 / 250 / 1000 ms | 31 / 34 / 35 | 12 / 13 / 13 | 12 / 778 / 3045 | 10 / 9 / 9 | 65 / 834 / 3103 |
| ACT2 final vote → locked acknowledgement | 0 / 250 / 1000 ms | 17 / 24 / 21 | 15 / 14 / 14 | 40 / 785 / 3036 | 2 / 2 / 2 | 74 / 824 / 3072 |
| ACT9 RED choice → DO NOT ENTER | 0 / 250 ms | 35 / 36 | 12 / 13 | 18 / 1032 | 1 / 1 | 66 / 1081 |
| ACT10 LEAVE → discussion field | 0 / 250 ms | 34 / 36 | 14 / 15 | 65 / 1066 | 10 / 8 | 123 / 1125 |
| ACT10 result Continue → ACT11 Station A | 0 / 250 ms | 27 / 34 | 15 / 14 | 50 / 1062 | 2 / 2 | 93 / 1112 |
| Teacher retained-page Start → request acknowledgement | 0 ms | 31 | 14 | 0 | 1 | 46 |

The browser observer records RPC request/response and target-specific DOM mutation timestamps. The ACT9/10 fixture uses a post-action visible target and can fall back to the observed visible-state time if a MutationObserver marker is absent. It asserts Station controls are absent during ACT10 discussion. The Teacher fixture measures the request acknowledgement, not the later Player ACT1 transition. Repeated runs can vary with local scheduling.

## ACT coverage

| ACT | Evidence now | Unmeasured click→DOM interaction |
|---|---|---|
| 1 | RPC family and live T2 transition in prior matrix | Opening acknowledgement, private choice, completion |
| 2 | Chat and final vote local browser timings | Meeting choice, grab/leave, route acknowledgement, photo share |
| 3 | RPC family and live T2 transition | Code submit, Pocket inspect/flip/share |
| 4 | RPC family and live T2 transition | Private choice |
| 5 | RPC family and live T2 transition | Chat, vote, advance |
| 6 | RPC family and live T2 transition | Chat, vote, advance |
| 7 | RPC family and live T2 transition | Vote, advance |
| 8 | RPC family and live T2 transition | Private choice, vote, advance |
| 9 | RED→DO NOT ENTER local browser timing; live T2 server transition | Chat, later door steps, Teacher Open Vote |
| 10 | LEAVE→discussion and result Continue→ACT11 local browser timings | Chat, final vote, Teacher Open Vote |
| 11 | Station A visible after Continue; live T2 allocation resolution | Chat and allocation click→DOM |
| 12 | RPC family and live T2 transition | Station tasks, engage, pressure choice, intentional lever timer |
| 13 | RPC family and live T2 transition | Continue/cinematic gate and click→DOM |

Teacher Start is measured separately. Other Teacher gate actions remain unmeasured. The RPC family inventory is in `tests/helpers/trial8-latency-observer.mjs`; the full actor/handler/RPC/visible/gate inventory and T2 authoritative timestamps remain in `TRIAL8_ACT1_ACT13_INTERACTION_LATENCY_MATRIX_20261030.md`. That matrix's suggested p50/p95 protocol is future work; this report makes no percentile claim.

## Causal separation and ranked narrow candidates

1. **Projection fanout after Player mutations:** all five measured Player interactions wait for the confirmed frame's serial authority reads and additional projections. Injected delay dominates the local click→visible change while mutation response stays roughly 12–15 ms in the ACT9/10 samples. Candidate for CA review: keep authoritative identity checks, then make only the target acknowledgement visible from the mutation response or a narrow target projection, subject to a separate source authorization and stale-generation test. Do not rewrite global polling from these samples.
2. **Teacher-paced gate:** live T2 ACT10 third LEAVE created discussion immediately at 15:28:24.288Z; Teacher Open Vote at 15:29:13.811Z is ~49.5 s later. The local fixture deliberately keeps Station unavailable until the result/Continue transition. Candidate: clearer waiting copy or Teacher cue, only after canonical text/UX approval; no automatic vote opening.
3. **Unpartitioned ACT10→ACT11 live interval:** T2 Continue at 15:29:43.937Z, first allocation at 15:35:39.285Z. The ~5m55s includes possible participant reading/Teacher operation; logs cannot attribute it to client latency. Candidate: collect consented browser timing on the next supervised trial before a product fix.

No product source, migration, RPC, live room, deployment, or Storage change was made for this B2 extension.
