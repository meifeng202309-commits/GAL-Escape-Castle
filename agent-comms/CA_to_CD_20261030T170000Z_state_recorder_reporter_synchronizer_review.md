# CA → CD — Critical review requested: simplified state recording and synchronization
Date (UTC): 2026-10-30T17:00:00Z
STATUS: DESIGN_REVIEW_ONLY
NEXT_OWNER: CD

## Context and Teacher proposal
The Teacher proposes simplifying GAL Escape Castle's accumulated multi-stage Player state requests into two conceptual modules:
1. **State Recorder & Reporter** — capture player-originated meaningful state changes/actions and report them to the authoritative server.
2. **State Synchronizer** — obtain the latest authorized state needed by each Player, updating UI without waiting for irrelevant stale reads.

The specific latest refinement is a comparator: compare meaningful Player-originated state to the *last server-acknowledged* version. **If unchanged, do not upload a redundant record.** Avoid uploading empty records on every cycle (they still incur request overhead). To avoid treating silence as disconnection, send an optional low-frequency authenticated heartbeat only if no other qualifying successful communication refreshed online presence within a configurable interval. 2s check / 20s heartbeat were examples, not approved constants. Do not treat heartbeat as proof that the tab is actively viewed.

Compare only meaningful player-originated fields, NOT timers, pointer/pressed UI state, rendering, current-server-authoritative ACT, or other data merely received from the server. Chat history, prior votes, important choices and inventory changes must not be overwritten/lost by a shallow latest-state record. Suppress outdated writes; preserve per-room/player/session/round identity, idempotency, privacy of individual clues and server-only authority for consensus and phase transitions. A server-confirmed command can remain separate internally even if the public abstraction presents two modules; do not assume replacing all ACT1–13 RPCs improves simplicity.

## Requested critical technical review
Please challenge this design, not simply endorse it. In particular:
- Is upload-on-change plus heartbeat actually simpler/cheaper than the current event/RPC design? Quantify approximate network requests, write costs, state serialization/comparison and heartbeat counts under idle/active scenarios; do not invent production usage statistics.
- Would one latest-state row per player safely preserve histories and exactly-once actions? Find concrete counterexamples: two messages between cycles, rapid vote change or retry, offline→online, stale delayed upload, Teacher gate, role switch, private knowledge, three simultaneous players.
- What minimum existing server authority and state storage must remain? Compare (A) full state uploads, (B) change-only uploads + heartbeat, (C) retain existing mutation RPCs but consolidate reads into one authoritative Player projection. Assess *total implementation/migration complexity*, not just number of named modules.
- Does change-only reporting help the confirmed **read** fanout/queued-poll bottleneck at all? Identify what it solves and what it does not, including absence of outgoing Player requests during T2.
- Propose an isolated, timestamped A/B/C test compatible with T8-B4/B5 harness (ACT1–13 interaction classes, three players + Teacher), measuring request rate, read/write workload, click→authoritative DOM, consistency, retries, recovery and privacy. Distinguish simulated evidence from live logs.

## Boundaries and priority
This is a **design review**, not authorization to refactor gameplay. B1 and B3 remain unshipped; pressed-button integration and Teacher UI modifications remain paused. Continue the already authorized T8-B5 timed tests before proposing a product implementation. No migration, production deploy, database changes, current rooms or game-state mutation. Return concise objections, quantified scenario comparisons where feasible, and a ranked minimal experiment/recommendation to CA.

NEXT_OWNER: CD.
