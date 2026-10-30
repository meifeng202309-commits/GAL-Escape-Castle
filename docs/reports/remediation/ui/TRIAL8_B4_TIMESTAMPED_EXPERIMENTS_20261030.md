# Trial 8 B4 controlled timestamped browser experiments

Date: 2026-10-30. Authorization: `CA_to_CD_20261030T193000Z_T8_timed_controlled_experiments.md`. Runner: `tests/trial8-b4-timestamped-browser.mjs`; fixture: `tests/fixtures/trial8-b4-manifest.json`. It serves the **current production Player/Teacher JS** unchanged to local Chrome, intercepts RPCs with a deterministic in-memory fixture, and writes JSONL events plus JSON summaries under `docs/reports/remediation/ui/trial8-b4/`. No live room, DB, Storage, Pages, or product source was changed. Seed 8301930 is recorded but unused because ordering has no randomness.

## Executed scope and clock meaning

The main matrix passed 8 interactions × 4 read delays (0/100/250/1000 ms) × 5 repetitions = **160** cases, 10,759 events. Extra ACT12/13 matrix passed 2 × 3 delays (0/250/1000 ms) × 5 = **30** cases, 2,502 events. ACT9 fault matrix passed 6 fault regimes × 5 = **30** cases, 3,200 events. `tests/trial8-b4-trace-validate.mjs` checked required event identities and valid clocks for all 220 cases. These are controlled local-browser samples, not T2 production latency, and five repetitions are insufficient for a credible p95; median and worst are reported instead.

Browser rows have UTC ISO-8601 milliseconds and `performance.now()` milliseconds since navigation. Mock-server rows have UTC and Node monotonic time since case start. Monotonic values from different `clock_domain`s must **not** be subtracted. The summary uses browser monotonic time for click→request and click→DOM; cross-domain server-transition intervals use UTC from the same host and therefore have millisecond clock resolution. `server_authoritative_transition` means the deterministic fixture changed state before replying, not a real PostgreSQL commit. RPC rows include path, POST method, request ID and expected phase when supplied, HTTP status and error category; response bodies are categorized rather than logged. A 10 ms observer samples refresh coordinator generation/in-flight/queued state. It cannot directly see the private `commitPlayerFrame` decision, so `committed`/`discarded` are **unobserved** unless confirmed by the subsequent DOM and existing generation regression. There is no explicit client timeout in this path; a 2 s injected stall recovered when the read returned, not by timeout.

Sample raw trace from `ACT9_red_250_1` (browser monotonic values exclude Node row):

| Event | UTC | Monotonic ms | Identity/detail |
|---|---|---:|---|
| click dispatched | 2026-10-30T05:07:27.501Z | 1614.0 | RED |
| handler entered | 2026-10-30T05:07:27.501Z | 1614.0 | `S6_click_s6_submit_group_choice_v2` |
| mock authoritative transition | 2026-10-30T05:07:27.503Z | 1723.102 Node domain | `s6_submit_group_choice_v2` |
| DOM target visible | 2026-10-30T05:07:28.573Z | 2686.8 | DO NOT ENTER |

The complete trace for that case also includes mutation start/headers/end, two serial authority reads, parallel projections, generation 2 in-flight/settled samples, and button state changes. `TIMELINE.jsonl` is sorted by UTC; within one UTC millisecond, consult each row's clock domain/monotonic time.

## Measured click→authoritative DOM visibility

Each cell is median / worst milliseconds for five repetitions. Action dispatch is captured in the browser, after Playwright has positioned/clicked the control.

| ACT / interaction | 0 ms reads | 100 ms reads | 250 ms reads | 1000 ms reads |
|---|---:|---:|---:|---:|
| ACT2 chat → transcript | 64 / 67 | 367 / 374 | 839 / 850 | 3089 / 3214 |
| ACT2 vote → locked state | 53 / 56 | 349 / 361 | 807 / 815 | 3058 / 3217 |
| ACT9 RED → DO NOT ENTER | 50 / 56 | 461 / 473 | 1078 / 1087 | 4077 / 4253 |
| ACT10 LEAVE → discussion | 66 / 69 | 471 / 487 | 1090 / 1317 | 4096 / 4256 |
| ACT10 Continue → ACT11 Station A | 56 / 59 | 453 / 477 | 1081 / 1207 | 4070 / 4265 |
| ACT11 allocation → ACT12 Station A form | 53 / 60 | 462 / 488 | 1082 / 1247 | 4081 / 4253 |
| ACT12 Station A form → Engage | 52 / 59 | not run | 1078 / 1087 | 4072 / 4086 |
| ACT13 Continue → boundary | 50 / 70 | not run | 1077 / 1095 | 4084 / 4098 |
| Teacher Start → ready message | 20 / 21 | 20 / 22 | 21 / 26 | 20 / 22 |
| Teacher Open Vote → opened message | 7 / 18 | 19 / 23 | 22 / 55 | 20 / 34 |

For the six main Player interactions at 250 ms, median click→mutation was ~1 ms and mock mutation→authoritative transition ~3–5 ms; the remainder was overwhelmingly authoritative→visible (ACT2 ~803–835 ms, S6 ~1074–1087 ms). At 1000 ms, the same segment reached ~3.1 s for ACT2 and ~4.1 s for S6. The S6 extra conditional wait projection creates another read stage; trace order distinguishes serial S8→S2, parallel projections, then conditional S9. Teacher status is set on the mutation response, so injected *read* delay does not produce the same Teacher status tail; it does not measure when a Player sees the Teacher gate open.

## Fault and queue experiments

ACT9 RED with identical initial fixture; five repetitions each:

| Regime | Median / worst click→DOM | Observed recovery |
|---|---:|---|
| Post-mutation S6 projection HTTP 400 | 123 / 154 ms | Full-frame failure surfaced, then test explicitly requested a clean refresh; target appeared. |
| HTTP 500 | 121 / 122 ms | Same explicit recovery; no automatic retry claim. |
| Network abort | 124 / 137 ms | `rpc_error` and explicit recovery recorded. |
| Mutation applied, response lost | 111 / 116 ms | Client error then retry; fixture asserted exactly one authoritative transition. This does not prove production idempotency. |
| One S6 projection stalled 2000 ms | 2051 / 2071 ms | No client timeout observed; target appeared after read returned. |
| In-flight old poll before click, 250 ms per read | 2038 / 2055 ms | Queued generation visible in sampled coordinator state; old frame finishes before action refresh. No premature DOM transition. |

The controlled 2 s stall and old poll both produce multi-second delay without human think-time. Five-minute T2 gaps remain unexplained: historical T2 gateway logs showed a Player request-generation/delivery gap while Teacher requests continued, and this harness cannot reproduce that causal mechanism by merely delaying responses. A local 500/400 is not the same as T2 chat 400 until error bodies and browser actions are captured.

The prior isolated scheduler model `tests/trial8-target-projection-isolation.mjs` was rerun: with authority/target/unrelated delays 10/10/150 ms, full frame 226 ms vs test-only target projection 70 ms; at 50/50/250 ms, 408 vs 209 ms. Equal 10/10/10 ms delays gave no gain (54 vs 63 ms), and a 200 ms predecessor remained on the critical path (386 vs 252 ms). This is **model evidence only**, not a safe partial production commit or a repair for missing requests.

## Coverage and limits

ACT2 chat/vote, ACT9 RED, ACT10 LEAVE/Continue, ACT11 allocation, ACT12 Station A, ACT13 Continue, Teacher Start/Open Vote have browser click→DOM traces. ACT1 and ACT3–8 are covered by the existing actor/handler/RPC inventory but **have no B4 browser timing**; ACT2's other route/GRAB actions, later ACT9/10 votes, ACT11 chat, other ACT12 stations/pressure, cinematic timing and ACT13 gate are also unmeasured. The fixture's Teacher vote is ACT2, not the ACT10 Teacher gate. Three concurrent Players plus Teacher were not run; Teacher operations here are separate cases. A session-switch stale-generation browser trace was not run in B4; the prior Trial 6 identity regression and test-only model passed, but are separate evidence. The headless Chrome two-tab experiment produced five `VISIBILITY_` traces yet `document.visibilityState` remained `visible` throughout, so **background throttling was not exercised**; those traces are retained only to document the failed control. No genuine browser offline toggle or client timeout path was observed.

## Diagnosis and next narrow gate

The trace **proves in this isolated fixture** that broad Player refresh stages can add seconds to authoritative visibility and that a queued predecessor can add another full-frame wait. It does not prove either caused T2's sparse Player requests or human-observed minute waits. The highest-value next falsifying gate is a supervised real-browser network/performance trace for a disposable room, with consent and separate CA scope: capture focus/visibility, every Player/Teacher request/response/error body, coordinator generation/queue/commit, DOM visibility, and gate timestamps. In parallel, a **test-only real-client** prototype of a phase-specific confirmed-target read can test whether irrelevant projections alone account for an observed delay; retain session/epoch/generation checks and full-frame convergence. Request CA authorization before any product-source change. No source-fix release claim is made from these mocks.
