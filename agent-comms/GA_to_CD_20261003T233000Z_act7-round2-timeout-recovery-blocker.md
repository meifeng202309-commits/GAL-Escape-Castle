# GA → CD — Manual acceptance blocker: ACT7 round-2 vote cannot reopen after timeout

FROM: GA  
TO: CD  
TIMESTAMP_LOCAL: 2026-10-03T23:30:00+08:00  
SUBJECT: Narrow implementation residual found during human/manual acceptance  
STATUS: IMPLEMENTATION_RESIDUAL  
NEXT_OWNER: CD

Authority:

- `docs/plans/MANUAL_ACCEPTANCE_READINESS_PLAN_V0.2.md`
- CD prior handoff:
  `agent-comms/CD_to_GA_20261003T120000Z_manual-acceptance-deployment-smoke-pass.md`

Evidence note:

`docs/reports/manual-acceptance/20261003_ACT7_ROUND2_NO_VOTE_RECOVERY_BLOCKER.md`

## Residual

Human/manual acceptance reached ACT7 Clock Room, vote round 2.

All three Player pages showed:

- round 2;
- `waiting_for_missing_player`;
- `0/3` votes received;
- no Clock A/B/C vote controls.

The run could not continue through ordinary Player action.

## Source-level cause

The frozen build's Player renderer intentionally suppresses vote controls while the canonical DiscussionRoom status is `waiting_for_missing_player`.

Generic `s2_add_time` reopens this state by changing:

`waiting_for_missing_player → voting`

before adding a fresh deadline.

Sprint5's `s5_teacher_add_time`, used for ACT6–8, extends the deadline but does **not** reopen the status.

Thus a Sprint5 timed-out missing-player vote can receive extra time while still remaining non-votable.

`s5_teacher_open_vote` is not a recovery from this state because it only operates when status is `discussion`.

No ACT7 Emergency Override is projected, and `s5_initialize` is not valid for an already initialized runtime.

## Required correction scope

Please implement only the narrow shared Sprint5 recovery behavior needed so a valid Teacher Add Time from `waiting_for_missing_player` reopens the current canonical discussion to `voting` with a fresh deadline.

Do not redesign:

- ACT7 15s/90s policy;
- general timer semantics;
- gameplay;
- Teacher Console;
- media/placeholders;
- other recovery mechanisms.

Migrations 001–068 remain immutable. Any database correction must be additive 069+.

## Required proof

Provide focused evidence that:

1. ACT7 vote round 2 can reach `waiting_for_missing_player`;
2. Teacher Add Time restores authoritative status to `voting`;
3. a fresh deadline exists;
4. Player vote controls reappear;
5. the missing Player can vote;
6. the round resolves/continues normally;
7. shared ACT6/ACT8 Sprint5 behavior does not regress.

Also report whether the correction is database-only or whether any frontend change is actually necessary.

## Manual-run disposition

The current `TEST01` manual run is stopped at this blocker.

Do not attempt to salvage that run through ad hoc DB/RPC mutation.

After the bounded correction and focused verification, hand ownership back to GA for a fresh human/manual ACT1→ACT14 acceptance run.

No CA recipient is needed at this stage under the minimum-recipient rule; return to CA only if the correction changes architecture/authority beyond this narrow residual or triggers an audit requirement.

NEXT_OWNER = CD  
NEXT_ACTION = Implement and verify the narrow Sprint5 add-time recovery correction, then hand factual evidence back to GA.
