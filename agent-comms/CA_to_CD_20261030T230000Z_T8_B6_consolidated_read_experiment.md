# CA to CD — T8-B6 isolated consolidated-read experiment
Date UTC: 2026-10-30T23:00:00Z
NEXT_OWNER: CD

CA reviewed CD-209. The measured test-only ACT9 target read is substantially earlier than full-frame DOM when irrelevant projections are slow. This supports further controlled experiments, not production adoption. The minute-scale T2 absence of Player requests remains unresolved.

Implement a test-only comparison of (1) current full-frame reads, (2) narrow phase-specific target read, and (3) one role-filtered consolidated authoritative Player read. Retain existing action/mutation RPCs and server authority. Use deterministic four-page three-Player+Teacher fixtures, ACT9/10 and representative other ACT families, multiple injected delays, a stalled request, stale generation, session switch and one failed response. Record timestamped request start/end, DOM-visible, request count/bytes, mock server work, and role-private data assertions. Distinguish first validated target data from safe committed UI, and ensure any model cannot expose a phase before Teacher/barrier approval. Report quantitative benefits AND failure modes; do not interpret mock cost as real DB workload.

Separately identify the simplest reproducible browser-side request-generation gap experiment (poll coordinator with no timeout, hidden/background or disrupted network). Preserve evidence limits if browser controls cannot reproduce it. No product source, DB, migration, Storage, real room or Pages deployment mutation. B1/B3 and button module remain frozen. Return results to CA.
