FROM: GA
TO: CA
TIMESTAMP: 2026-10-10T01:25:00+08:00
SUBJECT: Addendum — consider simpler server-side 3-second guard for ACT7 next-round input
STATUS: TARGETED_REVIEW_REQUEST / NO_RUNTIME_IMPLEMENTATION

RELATED GA REVIEW:
`agent-comms/GA_to_CA_20261010T010500Z_v4-ca172-critical-semantic-release-review.md`

CURRENT PLAN:
`docs/plans/Debug Implementation Plan V4.md`

PROCESS:
Per Teacher/User direction, GA sends this only to CA. CA should make the final judgment and, if accepted, include it in the single consolidated CA→CD action source.

## Teacher/User observation

Teacher recalls the intended three-second behavior as server-controlled:

- after a wrong password / vote result, the system owns a three-second feedback/cooldown interval;
- new input should not be accepted during that interval;
- after the interval, the next input surface becomes available/reset.

Teacher asks whether this is simpler than GA's prior M-3 wording, which focused on UI suppression during the shared result occurrence.

## GA source check

### ACT3

V4 Package D already uses a server-side cooldown model:

- one accepted wrong attempt establishes a 3-second server window;
- new different input during that window is rejected;
- rejected input does not create a second attempt/result.

GA considers that architecture correct.

### ACT7 current S5 code

Current `database/027_sprint5_act6_8_runtime.sql` behavior is materially different.

For an ACT7 wrong-majority result, `s5_submit_vote` currently:

1. resolves the current round;
2. writes `resolved_at=now()`;
3. increments `vote_round`;
4. immediately inserts the next `s5_rounds` row;
5. returns.

The current next-round `s5_submit_vote` validation checks current round/session identity, but does **not** impose a 3-second post-result guard.

Therefore merely hiding/disabling next-round buttons in the browser is not the strongest or simplest invariant: a direct RPC/client/agent could still submit into the new round before the intended result window ends.

## GA revised recommendation

GA withdraws the implication that M-3 should be solved only by client-side action suppression.

Preferred low-cost contract:

> **The next round may be created immediately, but the server must not accept a new ACT7 vote until the previous resolved round's 3-second feedback interval has elapsed.**

Do **not** implement this as a blocking database sleep.

Lowest-cost implementation candidate:

- reuse the previous ACT7 round's existing `resolved_at`;
- when accepting a vote for ACT7 round N+1, check the immediately previous round N;
- if previous `resolved_at` exists and server time is still before `resolved_at + 3 seconds`, return NOT_APPLICABLE / cooldown-equivalent without inserting a vote or event;
- after the 3-second interval, the already-created round N+1 accepts votes normally.

This likely avoids:
- a new gameplay state;
- a background timer/worker;
- a new persisted cooldown column for ACT7;
- relying only on UI discipline.

Presentation remains:

- all four views show the same 3-second result occurrence;
- Player input controls are visually unavailable during that window;
- after the window, the browser renders the already-authoritative next round.

The **server guard is the correctness invariant**; UI suppression is then presentation/UX rather than the only protection.

## Why this is preferable if CA confirms feasibility

1. It matches the Teacher's intended "server controls the three seconds" model.
2. It prevents both ordinary browser and direct-RPC/agent early submissions.
3. It reuses an existing durable timestamp (`resolved_at`) rather than introducing a second timer state.
4. It leaves round creation immediate, so no blocking transaction or delayed worker is needed.
5. It is conceptually aligned with ACT3's server-owned cooldown without forcing ACT3 and ACT7 into one generic framework.

## Requested CA judgment

Please critically check:

- whether the effective repository-last/deployed S5 functions still expose a reliable previous-round `resolved_at`;
- whether a simple server-time guard in the effective ACT7 submission path is indeed cheaper/safer than adding another durable cooldown field;
- whether any tie/revote path needs the same 3-second guard, or only outcomes that intentionally display the shared 3-second result;
- whether the current shared-result presentation can derive the same interval without creating contradictory timing ownership.

If you agree, please supersede GA M-3 with this rule in the final CA→CD action source:

> **server-enforced 3-second no-new-input window; UI reflects the same window; no blocking sleep; no new gameplay engine.**

If you disagree, please explain the lowest-cost alternative and why it is safer.

No code is authorized by this addendum.

NEXT_OWNER = CA.
