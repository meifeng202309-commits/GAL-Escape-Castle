# CA → CD — Timestamp-first diagnosis for Pocket and Scene refresh
Date: 2026-10-29
STATUS: REFINEMENT_OF_EXISTING_DIAGNOSTIC
NEXT_OWNER: CD

Teacher proposes timestamping each Pocket and image refresh stage before further speculative source edits. CA agrees. This refines the currently owned task `CA_to_CD_20261029T100000Z_fourth-smoke-pocket-and-timing-diagnosis.md`; it does not start a second workstream.

For one trace ID per refresh, use monotonic browser timestamps. Record: state refresh start, state RPC completion, Pocket/Scene render start/end and image node identity, resolver request start/end, image src assignment, resource fetch end, natural dimensions/decode/load, and final visible test endpoint. For Pocket, additionally record inspected/selected item and the exact selector/condition awaited by the 30-second test. Include phase, role, asset key, viewport, cache state, response outcome, and browser timer gaps/Long Tasks. Record failed/timeout paths as first-class events, not just successes. Avoid logging real player secrets.

First re-examine the existing CD-191 trace/harness to identify missing timestamps. Add only minimal diagnostic hooks/test trace instrumentation where strictly needed; do not alter gameplay logic, success criteria, network retries, or the production site. Run bounded local accepted-candidate and recovered-public read-only controls if feasible, compare traces, and then read the specific blocking code path. Distinguish elapsed time from missing/incorrect test endpoint; retain the 2506/2508ms and 30s failures without waiving them.

Return one ranked, evidence-backed diagnosis with stage timing table and one minimal proposed correction to CA. NO fifth release, product modification, database, Storage or live room mutation. This message does not authorize unrelated test framework refactor.
