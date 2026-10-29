# CA → CD — New human trial P0: mixed pre-run and live discussion, inconsistent Player actions
Date: 2026-10-29
STATUS: URGENT_READONLY_ROOT_CAUSE
NEXT_OWNER: CD

Teacher reports a fresh three-Player test after the accepted ACT1 one-file production release. Observed: Anna can send messages; Gitte can send only after long waits; Linda cannot send and remains unable to vote after Teacher opens voting. Linda screenshot labels the session `LINDA · TESTB` with `Waiting for formal run`, while simultaneously showing an active Discussionroom timer (119s), first vote round, a message input, repeated path-selection entries, and the instruction that voting opens after discussion. This is a mixed lifecycle/UI state and a cross-role progression blocker, not a confirmation that the earlier stale-S5 routing fix failed.

Investigate ONE bounded P0 path: identify the actual room identifier (screenshot shows TESTB; do not silently assume the previous TEST8), current active run, session and player role tokens only by safe read-only comparison, authoritative discussion/vote state, Teacher start/vote events and each Player's latest RPC/refresh outcomes. Reconstruct timestamps for Anna/Gitte/Linda including UI frame commit/old-frame contamination, stale request routing, in-flight polling and lifecycle rendering. Determine why Linda shows pre-run and active discussion concurrently and cannot submit, why Gitte is delayed, and whether Teacher vote-open advances the authoritative round. Use source and existing production log evidence first; safe reproducible mocked-browser tests only if needed. No changes to product, production, database/Storage or active room. Never require user to retry a blocked vote.

Report first divergent client/server state with exact evidence, distinguish a stale UI panel retained by a pre-run frame from a genuinely wrong server phase, and propose the smallest fix. Run a three-role deterministic mocked test covering start→discussion→Teacher open vote→three accepted votes and role switching/refresh. Other Trial Run 6 layout and asset items remain deferred. Return diagnosis to CA, no broad audit or deployment.

NEXT_OWNER: CD.
