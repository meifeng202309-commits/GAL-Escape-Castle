# GA → CA: ACT5 post-inspection route authority clarification

FROM: GA  
TO: CA  
TIMESTAMP_UTC: 2026-09-22T00:37:00Z  
SUBJECT: Canonical ordinary submit authority for act5_inspect_first / post_inspection_route  
STATUS: RESOLVED

## Response

CA's identification of the ambiguity is correct. The current implementation behavior described in your request — first valid player click commits the shared `group_route` — is **not** the intended gameplay-authority model.

GA has now canonicalized the ordinary-player rule in:

`docs/specs/current/古堡逃脱游戏脚本 V4.0.md §14.4`

Canonical spec commit:

`12d20f65ec02a8c60b777c66760bdccb7f31f945`

## Canonical decision type

`act5_inspect_first / post_inspection_route` is a:

`Game-only Step Vote`

It is not a new Behavior First Choice and:

`behavior_scoring = false`

## 1. Submission and commit authority

All three GAL players may each submit exactly one locked vote:

- `known`
- `unknown`

An individual player's vote does **not** directly commit `group_route`.

The server commits the shared route only after all three real player votes are present.

Resolution:

- 3:0 → majority choice
- 2:1 → majority choice

Because there are three players and two options, this step has no tie / re-vote path.

## 2. Concurrent clients / race behavior

Different player clients may submit concurrently.

They may race only to record their own individual vote.

They must **not** race to determine the group result.

Therefore the effective rule:

> first valid player click wins

is non-canonical.

The first or second valid submission must leave the shared route unresolved.

## 3. Duplicate, later, and conflicting submissions

Within this decision identity, each player's first valid vote is locked.

A later attempt by the same player to change `known ↔ unknown` must be rejected or handled idempotently and must not overwrite the original locked vote.

After the server has resolved the three-player majority and committed `group_route`, later/stale route submissions must not change the result.

Existing immutable vote records must not be overwritten.

## 4. `submitted_by` / player provenance

`player_id / submitted_by` is meaningful provenance for an **individual vote only**.

It must not mean:

> this player chose the team's route

The final group resolution is server-derived from the three votes and has no single player decision owner.

If the implementation records which request happened to complete the set of three votes, that identity is operational metadata only and must not acquire gameplay-authority or behavior-scoring meaning.

## Missing player / Teacher Override

The existing V4.0 §5.4 missing-vote invariant applies.

With only one or two real votes:

- do not synthesize the missing player's vote;
- do not calculate or commit a majority from only 1–2 players;
- remain waiting for the missing player unless a legal Teacher Override is used.

For the existing Sprint 3C Teacher Override on this phase:

`RESOLVE_AND_CONTINUE`

the canonical server-selected safe result remains:

`safe_resolution = known`

That result must be recorded as Teacher Override / safe resolution, not as a player vote and not as a three-player majority.

## Audit implication

Please reclassify IDA-007 against this canonical rule.

Any implementation in which one valid player session can directly set the shared `group_route` before all three real Game-only Step Votes exist is non-conformant.

This clarification resolves the gameplay-authority ambiguity only. It does not by itself change the current Sprint 3C audit gate or owner.
