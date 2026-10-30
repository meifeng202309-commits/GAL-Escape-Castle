# CA → CD — Controlled timestamped latency experiments (T8-B4)
Date (UTC): 2026-10-30T19:30:00Z
STATUS: TEST_ONLY_EXPERIMENT_AUTHORIZED
NEXT_OWNER: CD

## Rationale
Teacher explicitly warns that human T2 event spacing is unreliable as a latency metric: Teacher runs multiple processes and writes bug reports while playing. Do not infer code delay from inter-human-action time. CD-207 historical observations are clues, not measured click-to-visible latency. Priority is reproducible controlled experiments with full timestamp evidence, independent of human pacing.

## Scope
Implement and EXECUTE a test-only, reproducible real-client browser harness for representative distinct ACT1–ACT13 interaction families, starting with ACT2 chat/vote, ACT9 RED, ACT10 LEAVE/Continue, ACT11 station, and Teacher start/vote. Expand to remaining ACT families by their distinct handler/RPC/transition pattern; clearly mark any path not yet exercised. Use actual production JS in isolated browser, mocked or disposable isolated backend only as appropriate; no live user rooms/production mutation.

## Required timestamped event trace
For every test case produce machine-readable per-event rows with: test_id, ACT, role, action, attempt, event_name, UTC ISO-8601 timestamp with milliseconds, monotonic_ms from test start, request_id/generation/phase identity where applicable, request method/RPC, HTTP status/error category, and elapsed_ms. Record at least:
  1. test setup and visible initial authoritative state;
  2. pointer/click/Send/Vote event dispatched and handler entered;
  3. outbound mutation RPC start, response headers/end, success/error body category;
  4. server authoritative transition timestamp when controlled backend exposes it (else explicitly N/A);
  5. each following authority/projection request start/end/status including serial/parallel ordering;
  6. refresh queued, discarded, committed, recovered, timed out;
  7. DOM target visible, disabled/enabled changes, and phase/scene identity;
  8. Teacher Open Vote and player/Teacher barrier start/end independently;
  9. browser visibilitychange/focus/blur, network simulated delay/offline and retry.
Use both wall clock UTC and monotonic time to avoid clock skew. An event without observable timestamp must be marked unobserved, never inferred from the next player click.

## Factorial fault-injection design
Hold all unrelated conditions constant and compare repeated trials:
 A baseline 0ms, 100/250/1000ms per read; serial vs parallel projections;
 B one stalled projection (bounded timeout), failed HTTP 400, 500, network error, missed response, recovery;
 C in-flight old poll immediately before click; queued refresh and stale generation; session switch;
 D foreground vs background / deliberate page visibility change;
 E concurrent Teacher/three Player operation, delayed Teacher gate vs zero human think-time.
Run at least 5 repetitions for representative scenarios, deterministic PRNG seed and recorded fixture version, reporting median, p95 only with sufficient repetitions (otherwise worst/individual samples). Focus first on which mechanisms can generate multi-second or minute-long stalls. Compare full-frame to narrow-target scheduler **only in isolated test**, without rewriting production code or bypassing identity guards.

## Acceptance and results
Deliver (a) standalone test runner and fixture manifest, (b) CSV/JSONL timeline per test with UTC + monotonic ms, (c) summary by ACT/interaction and failure regime: click→mutation, mutation→authoritative, authoritative→visible, total click→visible, missing request intervals, timeout/recovery, (d) diagnosis explicitly separating measured evidence from hypotheses, and (e) a narrowly scoped source-fix proposal ONLY for a proven cause. Include a concise sample trace in the report so CA can verify timestamps are actually captured. A single sample or fake server timing is not an ACT1–13 performance conclusion.

Execute the tests now and return the evidence to CA, not just a plan. Keep the previous B1 and B3 code unshipped; do not integrate the common pressed-button module, modify Teacher UI, deploy Pages, mutate TESTC/T2 or other real rooms, DB/Storage/schema, or initiate broad architecture rewrites. Report blockers and partial coverage precisely, but do not silently stop at a test plan.

NEXT_OWNER: CD.
