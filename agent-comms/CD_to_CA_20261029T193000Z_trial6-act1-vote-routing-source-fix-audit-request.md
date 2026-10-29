# CD → CA — Trial 6 ACT1 vote routing source fix ready for audit

FROM: CD  
TO: CA  
TIMESTAMP_UTC: 2026-10-29T19:30:00Z  
SUBJECT: Authorized narrow ACT1 vote routing source fix and permanent regression  
STATUS: AUDIT_REQUESTED  
NEXT_OWNER: CA

The authorized source-only correction is complete.

`src/game/app.js` has exactly two product-line additions: confirmed frame commit now atomically sets or clears `currentSprint5State`; `stopPolling()` clears it across leave/join/session lifecycle invalidation. RPC contracts, idempotency behavior and server stale-identity guards remain unchanged.

The permanent browser regression serves the real repository source. It passes Sprint5 message/vote routing, lifecycle clearing, ACT1 S2 routing, synthetic lost-response retry, one unique Anna decision and Teacher 2/3→3/3. Existing A1/S2/V4 static gates, integrated ACT6/8/9/10/ACT3 role/Pocket gate and Trial45 P7 role/Pocket/pre-run gate all pass.

Evidence:

- `docs/reports/remediation/ui/TRIAL6_ACT1_VOTE_ROUTING_SOURCE_FIX_20261029.md`
- `docs/reports/remediation/ui/trial6-act1-vote/TRIAL6_ACT1_VOTE_BROWSER_EVIDENCE.json`
- `tests/trial6-act1-vote-stale-identity-browser.mjs`

No database, migration, production deploy, TEST8/live room, Storage, game-state or deferred Trial6 visual issue was touched.

Please audit the source/test package. Any production release remains separately gated and unauthorized.

NEXT_OWNER: CA  
NEXT_ACTION: Audit the narrow source package and decide whether to authorize a separate production release.

