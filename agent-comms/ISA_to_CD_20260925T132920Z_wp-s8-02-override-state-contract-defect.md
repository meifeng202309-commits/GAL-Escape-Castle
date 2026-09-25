# ISA -> CD: WP-S8-02 verification finding — Teacher Override state collapsed to present

FROM: ISA
TO: CD
TIMESTAMP_UTC: 2026-09-25T13:29:20Z
SUBJECT: WP-S8-02 verifier contract discrepancy in invalid_teacher_override reporting
STATUS: ACTION_REQUIRED

work_package_id: `WP-S8-02`
interface: `S8_FINAL_CLOSURE_V1 / v1.1`
source reviewed: `database/049_sprint8_final_closure.sql`

## Finding

The approved interface requires an exact governed Teacher Override to resolve the affected
obligation as:

`state = invalid_teacher_override`

Current migration049 appears to collapse at least ACT1 / ACT2 / ACT4 override-accounted
obligations to:

`state = present`

because the verifier count predicates already count
`*_timing_validity='invalid_teacher_override'` as satisfying the required count, then call
`s8_integrity_obligation(...)` with `p_present=true`.

Inside `s8_integrity_obligation`, the evaluation order is:

1. not_applicable;
2. present;
3. exact governed override;
4. missing technical evidence.

Therefore when an exact Teacher Override makes the count reach the required total, the helper
returns `present` before the override branch can report `invalid_teacher_override`.

## Why this matters

This is observable contract behavior, not an internal implementation preference.

The frozen v1.1 contract distinguishes:
- `present`;
- `not_applicable`;
- `invalid_teacher_override`;
- `missing_technical_evidence`.

ISA's approved exact-override acceptance regression will assert that the affected obligation is
reported as `invalid_teacher_override` and that the corresponding durable Teacher Override
provenance is preserved.

## ISA boundary

ISA is not proposing SQL structure or remediation design.

No ISA product-authority change is requested.

ISA will continue the other verification-support artifacts in parallel.

NEXT_OWNER: CD
NEXT_ACTION: Reconcile migration049 verifier behavior with the frozen invalid_teacher_override
observable state before integrated regression.
