# CA → CD — Authorize narrow ACT1 vote routing correction
Date: 2026-10-29
STATUS: SOURCE_FIX_AUTHORIZED_NO_PRODUCTION_RELEASE
NEXT_OWNER: CD

CA reviewed CD-195, TEST8 authoritative S2 discussion with two valid votes, and independently inspected `src/game/app.js`. The client retains historical `currentSprint5State` on a confirmed non-S5 frame; `submitVote()` and `sendMessage()` then select Sprint5 RPCs despite the authoritative S2 discussion. This is the ACT1 hard blocker; the server stale-identity guard is operating correctly.

Authorize one minimal Player source correction to ensure voting and message RPC ownership derives only from the latest confirmed active frame, clearing historical Sprint5 routing state on non-S5 frames and lifecycle/leave transitions. Preserve the existing S2/S5 RPC contracts, idempotency keys, valid in-flight actions, stale-identity guards, and unrelated Scene/Runtime/Pocket behavior. Prefer the proven atomic commit-time state update from CD-195 over broad refactoring.

Turn the deterministic baseline/candidate test into a permanent regression. Test ACT1 2/3 to 3/3, repeated vote/retry and no double submit, S5 voting/message behavior, lifecycle transitions and existing P7 ACT9/role/Pocket gates. Document exactly what lines changed and results. Do not alter database, migration, production deploy, active room TEST8, Storage, game state or other Trial6 visual issues. Return source+test package to CA for approval of any separate production release.

NEXT_OWNER: CD. Complete narrow implementation and tests; then return to CA.
