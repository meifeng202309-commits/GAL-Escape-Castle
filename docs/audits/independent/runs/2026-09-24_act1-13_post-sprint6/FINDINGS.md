# FINDINGS — Level 3 ACT1–13 post-Sprint6

Baseline: `2acfe324d05c8bea2fb96d7132ba29f894270b38`

| Issue ID | Severity | Status | Problem description | Evidence / reproduction | Code file(s) | Symbol / function / line range | Baseline SHA | Violated invariant / risk | Recommended fix | Audit method | Owner | Fix commit | Re-test result |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| IDA-001 | HIGH | CONFIRMED | Generic Sprint2 deadline refresh can resolve Sprint6 no-vote DiscussionRooms without advancing Sprint6 phase, deadlocking ACT9/10/11 | Sprint6 opens `require_final_vote=false` discussion; player refresh calls `s2_get_player_state` first; at deadline `s2_refresh_discussion` sets row resolved; `s6_get_player_state` then exposes no discussion while `s6_run_state.phase_key` remains discussion; `s6_close_discussion_v2` requires that exact row still be discussion | `database/002_runtime_runs_discussion.sql`; `database/035_sprint6_focused_audit_corrections.sql`; `database/036_sprint6_four_open_findings.sql`; `src/game/app.js` | `s2_refresh_discussion`; `s2_get_player_state`; `s6_open_discussion`; `s6_close_discussion_guarded/v2`; `s6_get_player_state`; `refreshState` | `2acfe324d05c8bea2fb96d7132ba29f894270b38` | Cross-layer authority conflict; one logical transition must have one owner; NORMAL progression must not deadlock at canonical deadline | Ensure generic discussion refresh cannot independently consume a Sprint6-owned deadline; Sprint6 exact-session owner must remain able to perform the canonical phase transition exactly once | Methods 1, 2, 5, 6, 7, 8 | CD |  | NOT RETESTED |

## IDA-001 — Generic Sprint2 deadline refresh deadlocks Sprint6 timed discussions

### Severity / status

**HIGH / CONFIRMED**

### Deterministic control-flow proof

Sprint6 `s6_open_discussion(...)` creates ACT9/10/11 DiscussionRoom rows in the shared `discussion_sessions` table with:

- `status='discussion'`;
- `require_final_vote=false`;
- a finite `phase_deadline`.

The Sprint6-owned close path is `s6_close_discussion_v2 → s6_close_discussion_guarded`.

That path verifies:
- expected Sprint6 phase/step/round;
- exact `discussion_session_id`;
- current row still has `status='discussion'`;
- NORMAL deadline has elapsed;

then resolves the exact discussion and advances `s6_run_state.phase_key` to the next canonical phase.

But the normal browser polling path runs:

`refreshState → s2_get_player_state → ... → s6_get_player_state`.

Generic `s2_get_player_state` invokes `s2_refresh_discussion` on the latest discussion. At/after the deadline, `s2_refresh_discussion` sees `require_final_vote=false` and independently changes the Sprint6 discussion to:

- `status='resolved'`;
- `phase_deadline=null`;
- `outcome.type='discussion_complete'`.

It does **not** update `s6_run_state.phase_key`.

The next `s6_get_player_state` query exposes only a discussion whose status remains `discussion`. It therefore returns `discussion=null`.

The browser renderer provides the Sprint6 close control only when that discussion object exists. The run is left in the Sprint6 discussion phase without a valid advancing action.

Calling `s6_close_discussion_v2` directly afterward does not recover the run because the guarded close rejects a discussion that is no longer `status='discussion'`.

### Affected canonical phases

The same ownership conflict applies to:

- ACT9 initial / tie / soft-failure discussion;
- ACT10 reveal discussion;
- ACT11 allocation discussion.

### Why this is not just a UI defect

The database row itself is consumed by the wrong resolver. Reconnecting from another browser sees the same split authoritative state.

### Closure condition

There must be one effective owner for Sprint6 timed-discussion completion. Generic deadline refresh must not consume a Sprint6-owned discussion in a way that leaves `s6_run_state` behind. The exact Sprint6 phase transition must remain idempotent/recoverable after deadline and reconnect.

### Re-test requirement

Re-test at least one normal deadline in each Sprint6 discussion class (ACT9, ACT10, ACT11), including a poll/reconnect at or after expiry, and verify the run advances through the authoritative Sprint6 transition without losing the exact discussion identity or inventing player input.
