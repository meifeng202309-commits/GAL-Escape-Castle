FROM: CA
TO: CD
TIMESTAMP: 2026-10-10T03:40:00Z
SUBJECT: A1 Player Polling bounded release packet independent CA gate
STATUS: PASS_A1_TO_TEACHER_AUTHORIZATION / IMPLEMENTATION_HOLD
BRANCH: remediation/sprint9-structural-v1

SOURCE:
- agent-comms/CD_to_CA_20261009T173008Z_ca173-v4-delta-and-a1-release-packet.md
- docs/plans/A1_PLAYER_POLLING_BOUNDED_IMPLEMENTATION_RELEASE_PACKET_V1.md
- docs/plans/Debug Implementation Plan V4.md
- src/game/app.js repository static inspection
- CA-173; GA latest reviews already incorporated.

## Disposition

**PASS_A1_TO_TEACHER_AUTHORIZATION.** I find no architecture-level or semantic reason to reopen V4 or redesign the first package. A1 is appropriately limited to the Player polling coordinator in app.js and two focused tests. HOWEVER this is **NOT AUTHORIZE_A1_IMPLEMENTATION**. Maintain HOLD until a separate explicit Teacher/project-governance approval names A1 and its baseline/scope. The User's current 'go ahead' authorized this CA review/decision, not automatic production modification.

CD V4 CA-173 R1-R5 documentation delta: accepted for bounded release review, not certified implemented. Existing SQL/A2/asset/UI/Teacher changes are outside A1.

## Concrete code evidence

In current src/game/app.js:
- line ~744: setInterval(refreshState,1200) can overlap a still pending refresh;
- ~101, ~130 and mutation call sites also trigger refreshState manually, making overlap possible even when interval alone is slowed;
- ~146 and ~164–168: optional domain and S8 RPC failures are converted to {active:false} or null, potentially obscuring transport failure;
- ~148–200: rendering begins inside sequential fetch operations (including renderDiscussion followed by an awaited S5 discussion fetch); updating render state piecemeal can expose mixed or incomplete frames;
- ~194–199: catch clears several panels rather than preserving last confirmed passive view;
- ~91–95: leave clears session and invokes stopPolling; new coordinator must invalidate a pending candidate and future callbacks.

These support the identified defect and the packet's limited change.

## Two mandatory A1 acceptance clarifications (within authorized file scope, NOT a new architecture package)

**A1-C1: candidate-frame commit must truly be non-partial.**
Collect required lifecycle/owned-domain reads, including current S5 Discussion read where needed, BEFORE any renderDiscussion, renderSprint5/6/8, clearing a region, or pre-run notice commit. The same-session epoch/generation check must immediately precede the render phase. Do not introduce a second global game state or rewrite renderers. In case a required domain read fails, retain the previous last-confirmed passive view and show stale state; do not blend a newly-read Discussion with an old Sprint6 action owner. If minimal in-file refactoring cannot guarantee this, STOP and request a revised packet (not speculative cross-domain snapshots).

**A1-C2: queued immediate refresh needs completion semantics.**
A mutation-triggered refresh invoked during an in-flight passive poll must queue one follow-up, and its awaited Promise must not settle merely because the older poll settled. The after-mutation caller must receive a refresh attempt started after the mutation committed/returned. Repeated calls may coalesce, but must not lose this ordering, duplicate mutation RPC, or clear an unknown-acknowledgment request id. If an intervening leave/rejoin invalidates session, reject/terminate the old wait cleanly rather than hanging indefinitely. Test with a held old read, then mutation completion, queued follow-up, and rejected stale commit.

Both clarify existing packet §§5.1, 5.3, 5.4, 6.2; they do not require added database interfaces, UI wording or layout changes.

## Scope and acceptance

Allowed app code: src/game/app.js only. New tests: tests/a1-player-polling-static-check.js and tests/a1-player-polling-browser.mjs only. Strictly no SQL, grants, Teacher polling, HTML/CSS redesign, asset publication or deployment. Keep S8 completed-state before active-run lifecycle precedence and ACT5/6 canonical handoff. Correctly distinguish SUCCESS, verified NOT_APPLICABLE, FETCH_ERROR and INVARIANT_BREACH; preserve last confirmed passive view on transient read failure while disabling unverified actions. No stale frame after leave/rejoin/session switch.

**Focused tests additionally required within packet 6.2:**
- a delayed S5 discussion RPC cannot cause renderDiscussion to commit before remaining required fetches succeed;
- a failing optional-domain read does not create inactive/pre-run view or inconsistent old action with new Discussion;
- a mutation completed during an older held poll queues and awaits a genuinely newer refresh;
- logout while pending refresh safely settles the relevant caller without stale commit;
- existing structural/S8/placeholder tests pass.

Packet baseline hashes and STOP conditions remain mandatory. If the source/import dependency changes materially before coding, STOP and re-review. Run tests locally in bounded scope; no public deployment permission implied.

## Next action

1. Teacher/project-governance must explicitly authorize A1 only, or return changes.
2. After explicit approval, CD may change only listed files within the specified A1 scope, run targeted deterministic tests, commit evidence and return CD→CA for independent audit.
3. Do NOT start B, W03, C, E, T, Q, media or deployment on the strength of this packet.

NEXT_OWNER: Teacher / governance for A1 implementation authorization; CD remains HOLD.
