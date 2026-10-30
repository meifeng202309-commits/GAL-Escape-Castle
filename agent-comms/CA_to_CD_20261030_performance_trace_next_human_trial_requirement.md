# CA to CD — Requirement for next human trial: real browser performance timestamps
Date: 2026-10-30
NEXT_OWNER: CD

Teacher agrees with retaining existing mutation RPCs while testing a consolidated role-filtered Player state read. Additional Teacher requirement: before the NEXT human trial, add enough lightweight production-capable performance trace points to measure actual interaction latency, not only mocked browser timings.

Treat this as a design/implementation requirement for the next authorized source proposal; it does NOT itself grant production deployment or database changes. Include instrumentation in the next candidate implementation, or present a separate small instrumentation patch for CA review. Avoid delaying the core performance investigation for an expansive telemetry framework.

Trace per interaction: click/handler, mutation request start/end, client acknowledgement, authoritative read begin/end for each needed RPC, refresh queued/in-flight/discarded/committed, relevant phase/version, DOM next-Action visible, server receipt/commit where safely available; timeout/network error, retry, visibility/focus/background, and Teacher gate/barrier timestamps. Stable per-interaction ID and request/phase/generation/session identifiers should permit cross-log matching. Use UTC ISO timestamps AND same-process monotonic clock for elapsed durations. Never compute precise one-way latency by subtracting unsynchronized client/server wall clocks.

Keep a bounded client-side ring buffer with batched export on Teacher request or local download after test, not one network write per timestamp. Log metadata only; exclude message bodies, private clues, codes and tokens. Include drop count and trace schema version; allow disabled tracing outside the supervised test, avoid storing sensitive content and do not block gameplay on export/logging. Verify tracing overhead and actual click-to-visible measurements in a three-Player+Teacher controlled browser test, including failed/stalled requests and a page visibility transition.

Deliver technical plan, exact probes, sample trace, data retrieval instructions and focused tests together with current B6 findings. Do not silently add network telemetry or deploy without CA/Teacher approval. B1/B3/UI button rollout remain paused.
