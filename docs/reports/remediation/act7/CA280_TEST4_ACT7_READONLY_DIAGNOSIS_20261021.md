# CA-280 TEST4 ACT7 read-only diagnosis

Date: 2026-10-21  
Authority: `agent-comms/CA_to_CD_20261021T111500Z_act7-majority-reset-investigation.md`  
Scope: read-only production evidence plus source/canonical inspection; no production or source mutation

## Disposition

**The reported majority-resolution failure is not present.** All three TEST4 rounds committed three genuine votes, calculated the unanimous majority correctly, executed the majority-selected clock, and opened a new round because the selected clock was wrong. The observed reset is the canonical soft-failure path, not lost data or an unintended tie/re-vote.

The practical blocker was an expectation/presentation mismatch: a majority decides which clock to touch; it does not make every majority choice correct. Canonical ACT7 requires Clock C.

## Exact production evidence

Room `TEST4`, run `ecb50fb9-45d4-4dc0-83a2-a94103234f90`:

| Round | GAL-A | GAL-B | GAL-C | Third vote committed | Authoritative result |
|---|---|---|---|---|---|
| 1 | `clock_a` | `clock_a` | `clock_a` | `2026-10-21T11:03:04.133190Z` | majority A; `clock_wrong_attempt` attempt 1; round 2 created |
| 2 | `clock_a` | `clock_a` | `clock_a` | `2026-10-21T11:04:03.788520Z` | majority A; `clock_wrong_attempt` attempt 2; round 3 created |
| 3 | `clock_a` | `clock_a` | `clock_a` | `2026-10-21T11:06:27.702457Z` | majority A; `clock_wrong_attempt` attempt 3; round 4 created |

All nine rows have distinct player/round primary-key positions and distinct client request IDs. Round 3 Linda/GAL-C's reported final vote is present as `clock_a`; its `s5_vote_locked` event and the `clock_wrong_attempt` event share the same commit timestamp. The round-3 session `b02c3329-7a4b-4f19-9fc7-1d107145949e` is resolved with outcome `choice_id=clock_a`, `resolution_source=player_majority`. Current state is intentionally ACT7 round 4, `act7_wrong_attempts=3`, with a fresh discussion session.

This rules out:

- rejected or stale Linda submission;
- missing third vote;
- 1:1:1 tie classification;
- incorrect majority tally;
- statement timeout as the cause of these three transitions;
- deletion or clearing of prior votes.

The pre-existing timeout/lock signals recorded by CA are not causally involved in this event: the relevant vote rows and transition events committed atomically and remain readable.

## Canonical and source correlation

`古堡逃脱游戏脚本 V4.0.md` §16.4 says:

- 3:0 / 2:1 executes the majority-selected clock;
- Clock C is the correct answer;
- a wrong selection produces a soft failure and increasingly explicit clues, never Game Over.

The deployed owner in `database/027_sprint5_act6_8_runtime.sql` follows that contract:

- `winner='clock_c'` moves to `act7_solved`;
- another ACT7 majority increments `act7_wrong_attempts`, creates the next vote round, and logs `clock_wrong_attempt`.

The Player renderer already maps attempts 1/2/3+ to `act07.012` / `act07.013` / `act07.014`, but the automatic transition to a fresh discussion and the Teacher console presentation can make that feedback look like a silent vote reset.

## Minimum proposal

No database voting-logic correction is justified. The current TEST4 run can continue without mutation: open round 4 voting and obtain a 2:1 or 3:0 majority for Clock C; the existing path should enter `act7_solved`, after which the normal Continue action reaches ACT8.

If Teacher considers the current feedback too easy to miss, the smallest follow-up is a source-only presentation clarification, separately authorized:

1. prominently show the prior majority choice and canonical wrong-attempt text on both Teacher and Player views before/alongside the fresh round;
2. label the new round as a wrong-clock retry rather than a generic reset;
3. add focused UI/state tests for 3:0 A and 2:1 A showing wrong-attempt feedback, 3:0/2:1 C solving, and 1:1:1 opening a no-action re-vote.

Do not change the append-only vote history, majority algorithm, correct answer, or production database for this observation.

## Next owner

CA: close the suspected P0 as **NOT A FUNCTIONAL DEFECT / CANONICAL SOFT FAILURE**, give Teacher the exact Clock C continuation instruction, and decide whether the bounded presentation clarification is worth a separate low-risk source assignment.
