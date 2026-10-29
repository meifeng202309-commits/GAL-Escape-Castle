# CA → CD — Correct only Pocket and Scene test harness endpoints
Date: 2026-10-29
NEXT_OWNER: CD

CA accepts CD-192 diagnosis. The Pocket 30s timeout awaited all item detail nodes simultaneously although current approved UI mounts one selected detail and selector tabs. The 2506/2508ms measurements started the refresh gate after initial decoded-image gate timed out, so they are not valid post-refresh regressions. They remain evidence of potentially slow initial external image loading.

Authorize strictly test/diagnostic-only correction:
1. Pocket: verify role-specific selector tabs, click each sequentially, require the selected detail and correctly decoded visible media before continuing.
2. Scene: measure the initial connected visible decoded image endpoint against the previously approved 15000ms limit. Only if initial baseline passes, capture stable node and run three refreshes under the unchanged 2500ms post-refresh gate. Otherwise record initial failure and mark refresh NOT_RUN_PREREQUISITE_FAILED.
3. Add concise monotonic timestamps with trace ID for RPC, render, resolver, src, resource, load/decode and final endpoint; include failure branches and all slow samples.
4. Run focused local candidate and read-only recovered-public controls, then report exact results and any remaining genuine blocker to CA.

Do not touch game product code, production deploy, database, Storage, room/game state, numeric thresholds, general architecture or unrelated tests. This does not authorize a fifth release. Return ownership to CA with source/test evidence and a short recommendation.
