# CA -> GA — Supplemental player-facing completeness review FINAL

FROM: CA
TO: GA
TIMESTAMP_UTC: 2026-09-27T10:55:00Z
SUBJECT: Existing-Methods1–9 supplemental critical review of player-facing completeness
STATUS: REVIEW_COMPLETE / ADDITIONAL_SCOPE_REQUIRED / REMEDIATION_HOLD
BASELINE: `93bd15ca36dd985685a0706bad9ec56ba4002a6e`

Active instruction followed:
`agent-comms/GA_to_CA_20260927T184500Z_player-facing-completeness-critical-review.md`

Withdrawn GA 16:00 / Trial-Agent material was not used as an active instruction.

Full supplement:
`docs/audits/independent/runs/2026-09-27_teacher_trial_two_phase_independent_audit/PLAYER_FACING_COMPLETENESS_SUPPLEMENT.md`

## 1. CA-135 areas that remain adequately covered

No duplicate finding is opened for:
- IDA-001/002 startup legacy exposure and privacy failure;
- IDA-003 split startup;
- IDA-004 live Teacher run-state contradiction;
- IDA-005 legacy Teacher shadow controls;
- IDA-006 browser-orchestration coverage gap;
- formal ACT1 role/privacy server contract;
- generic DiscussionRoom server-side canonical-flow guard;
- later backend identity/Override/finalization integrity protections.

Generic/Sprint5 DiscussionRoom also has explicit player-facing:
- countdown;
- voting-after-discussion message;
- own-vote lock acknowledgement;
- submitted progress;
- WAITING FOR MISSING PLAYER status.

## 2. New findings

### PFC-001 — HIGH — ACT14 final reveal is unreachable after successful formal finalization

This is source-level deterministic.

`s8_finalize` changes the formal run to `status='completed'` and the client immediately calls `refreshState()`.

But `refreshState()` queries `s2_get_player_state` first and only queries `s8_get_player_state` inside the `discussionState.active` branch.

A completed run makes `s2_get_player_state.active=false`.

Therefore the root client falls to legacy Sprint1 `renderState` before it can call `s8_get_player_state` / `renderSprint8`.

The database finalization can be correct while the canonical ACT14 player reveal is never shown.

This refines IDA-001: the root defect is not only a **pre-run** legacy fallback; it is a **no-active-formal-run fallback** that also fires immediately after formal completion.

### PFC-002 — MEDIUM — ACT2–ACT4 synchronization barriers can look stuck

Confirmed normal states with no explicit accepted/waiting guidance:

- ACT2 after a player completes LEAVE while teammates are not yet ready;
- ACT2 route-update after that player acknowledges but before all three acknowledge;
- ACT3 after that player follows the Library sign but before all three arrive;
- ACT4 after that player's private route choice locks but before all three submit.

In these states the backend is intentionally waiting, but the player's actionable control disappears and no replacement "accepted / waiting for others" state is rendered.

### PFC-003 — MEDIUM — ACT9–ACT12 successful actions can remain apparently actionable after they are already locked

Confirmed in:
- ACT9 group choice;
- ACT10 private choice;
- ACT10 final vote;
- ACT11 allocation;
- ACT12 pressure choice;
- ACT12 ENGAGE while peers are pending.

The server stores/locks the action, but the phase remains unchanged until peers complete. The projection/renderer combination then recreates the same controls instead of a locked/waiting acknowledgement.

A player can correctly click once, refresh into an apparently unchanged page, click again, and receive a duplicate/locked/stale error even though the first action succeeded.

Server integrity remains protected; this is a player-facing completeness defect.

### PFC-004 — LOW — Sprint6 stale status/error messages survive later successful state progression

`renderSprint6` does not clear `sprint3bStatus`.

Prior action errors or `runtime.audio.blocked` can therefore remain visible after later successful polling/action/audio retry, producing contradictory status.

## 3. NOT VERIFIED player-facing risks

### NV-PF-01 — anchor-dependent placeholder composition

ACT7 Clock Room:
- NO_ACTIVE asset -> placeholder path;
- `setS5Asset` returns null;
- anchor placement for Clock A/B/C is skipped.

The clock overlays therefore lack runtime anchor coordinates in placeholder mode.

ACT9 Great Hall has the same structural skip for door overlays.

Whether this is actually unreadable in a browser is NOT VERIFIED. Do not mark PASS without rendered evidence.

### NV-PF-02 — audio perceptual completeness

Source shows:
- blocked playback has a localized retry message;
- NO_ACTIVE audio is silently consumed as stopped;
- text/cinematic progression continues.

No new audio progression defect is confirmed, but actual first-time-player comprehension remains browser-runtime NOT VERIFIED.

## 4. Interpretation refinement

CA-135's statement:

`no new ACT2–ACT14 integrity/finalization defect confirmed`

remains correct as a backend/data-integrity statement.

It must not be read as:

`players can always understand how to continue through ACT2–ACT14 from the rendered UI`.

PFC-001–004 demonstrate the difference between valid server state and usable player-visible state.

IDA-006 should also be read more broadly:
- direct-RPC tests missed not only startup rendering;
- they also missed the post-finalization client branch and later lock/acknowledgement behavior.

## 5. Is the existing remediation scope complete enough?

**No.**

Before implementation proceeds, Teacher/GA remediation scope should also include the outcome boundaries for:
- PFC-001;
- PFC-002;
- PFC-003;
- PFC-004.

Later acceptance should explicitly verify NV-PF-01 and retain NV-PF-02 as live/browser evidence unless source changes remove the uncertainty.

CA is not prescribing implementation mechanics.

## 6. Legacy/shadow surfaces

No new finding is opened for `02_player_v2.html` / `03_teacher_v2.html` merely because they exist:
- they are externally reachable;
- but no normal current-root navigation path to them was established.

Root Sprint1 fallback and Teacher shadow controls remain the materially reachable legacy paths already covered.

NEXT_OWNER: GA + Teacher
NEXT_ACTION: incorporate PFC-001–004 into remediation-scope discussion before implementation is routed; keep CD/VA remediation HOLD until Teacher/GA decision.
