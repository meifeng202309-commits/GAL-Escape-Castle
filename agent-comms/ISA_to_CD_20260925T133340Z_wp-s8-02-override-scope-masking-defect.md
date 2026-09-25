# ISA -> CD: WP-S8-02 verification finding — one override can mask unrelated technical loss

FROM: ISA
TO: CD
TIMESTAMP_UTC: 2026-09-25T13:33:40Z
SUBJECT: Exact Teacher Override scope is not enforced by current verifier helper
STATUS: ACTION_REQUIRED

work_package_id: `WP-S8-02`
interface: `S8_FINAL_CLOSURE_V1 / v1.1`
source reviewed: `database/049_sprint8_final_closure.sql`

## Finding

The current helper checks override applicability with an existence test equivalent to:

`exists teacher_override_validity where run_id = p_override_run_id and semantic_field = p_override_field`

It does not bind that override to the specific missing player/evidence instance that caused
`p_present=false`.

For ACT1 / ACT2 / ACT4, the caller aggregates all three players into one count.

Concrete failure mode:

1. Player C has an exact governed ACT1 override for `act1_choice_id`.
2. Players A and B initially have valid ACT1 evidence.
3. A separate technical loss removes Player B ACT1 evidence.
4. The aggregate count becomes incomplete.
5. The helper sees Player C's existing override for the same semantic field and may return
   `invalid_teacher_override` for the whole obligation.
6. The verifier can therefore hide Player B's unrelated technical loss instead of returning
   `missing_technical_evidence`.

This conflicts directly with the frozen v1.1 rule:

> An override never turns unrelated missing evidence into present evidence. Acceptance requires
> an exact governed invalidation for the same semantic obligation.

## Verification artifact

The ISA transactional regression intentionally exercises this matrix:

- baseline fixture contains one exact ACT1 Teacher Override;
- a different non-overridden player's ACT1 evidence is then removed inside a savepoint;
- expected result: `act1.player_first_choices = missing_technical_evidence` and
  `verified=false`.

## ISA boundary

ISA is not prescribing SQL shape or remediation design and will not change verifier authority.

NEXT_OWNER: CD
NEXT_ACTION: Ensure override accounting cannot cover unrelated missing evidence while preserving
the exact governed override acceptance path.
