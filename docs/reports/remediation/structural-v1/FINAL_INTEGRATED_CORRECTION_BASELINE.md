# Final integrated correction baseline

## Frozen identity

- Branch: `remediation/sprint9-structural-v1`
- Integrated correction baseline: `891feffe558a4683ac3da67e1e6b15e902c7e592`
- E1-tested implementation parent: `97f5ed362c58defb45edf19c18319417cb70b93f`
- E1 evidence: `docs/reports/remediation/structural-v1/E1_EVIDENCE.md`
- Frozen plan: `docs/plans/CD_STRUCTURAL_REMEDIATION_EXECUTION_PLAN_V0.1.md`

The baseline commit adds only the E1 harness and evidence on top of the exact tested implementation; it does not change runtime source or database authority after the E1-tested parent.

## Package checkpoints

- Package A final browser closure: `dec6bd6f624b6fffafef8b9a5b40148d821d21b3`
- Packages B/C shared checkpoint: `e692dfa7de8130caefb2cae5a9534cf06a7a7471`
- Package C corrected checkpoint: `949ab1d4d840729f0969e36b0f9dfef15f275a2f`
- Package D implementation: `394238f61850e45cbdb8a1c4896cf64f965acd00`
- Package D evidence checkpoint / E1-tested implementation: `97f5ed362c58defb45edf19c18319417cb70b93f`
- E1-complete integrated baseline: `891feffe558a4683ac3da67e1e6b15e902c7e592`

## Additive migrations and deployment state

Migrations `001–058` remain unchanged. The following additive migrations were added and deployed to Supabase project `qdcbdcjobzytzhnhfwyn`:

- `059_structural_lifecycle_transition_spine.sql`
- `060_package_a_ca_a_bounded_corrections.sql`
- `061_package_a_act6_entry_timer_barrier.sql`
- `062_package_a_prepared_event_fk_fix.sql`
- `063_package_a_player_entry_column_fix.sql`
- `064_package_a_handoff_observation_column_fix.sql`
- `065_package_b_player_wait_projection.sql`
- `066_package_b_wait_projection_locked_at_fix.sql`
- `067_package_b_allocation_progress_fix.sql`
- `068_package_c_authoritative_pocket_inspection.sql`

Package D and E1 required no new migration. E1 exercised the deployed Supabase authority with the frozen branch frontend served locally from the tested implementation.

## E1 result

Canonical run `20260930035214` passed:

- Teacher create / staggered G-A-L join / pre-run / formal start;
- three role-private ACT1 surfaces;
- representative accepted and missing-player waits;
- ACT4 comparison and exact projected reveal;
- ACT5 handoff / ACT6 entry / DiscussionRoom / early Pocket;
- ACT9–12 locked waits and Main Gate placeholder legend;
- Sprint6 stale-status recovery;
- ACT14 HTTP-200 finalize / final reveal / completed-run reconnect;
- 1007 observed Supabase RPC responses, all HTTP 200;
- zero material browser errors.

## ISA artifacts consumed

The pre-existing Sprint9 Class A validator package remains consumed in this integrated branch:

- WP-S9-03A implementation: `478ca73db737e88fe3ccac90fdc076da9942c2a5`
- focused validator tests: `cc0dd4048b01dfdab9574be1cd045e80131d37a2`
- ISA action-log evidence: `8d44358b13f130a61e3aa0f077a77dacb0997730`
- files: `tools/sprint9-asset-readiness-validator.mjs` and `tests/sprint9-asset-readiness-validator.test.mjs`

No ISA artifact changed runtime authority, migrations, review state, publication, or ACTIVE state.

## Media readiness and remaining NOT VERIFIED items

Current repository validator result:

- integrity: PASS;
- valid approved: 24;
- placeholder: 4;
- absent / invalid / blocked: 0 / 0 / 0;
- readiness: intentionally nonzero at 24/28 because `opening.gitte_room`, `opening.anna_room`, `opening.linda_study`, and `ending.castle_exterior` remain explicit placeholders.

Known remaining items:

- CA Level2 targeted independent closure is not yet performed.
- `shared.main_gate` v002 is mechanically valid and Teacher-approved in repository staging, but the live Asset Manager has no ACTIVE Main Gate candidate; publication/ACTIVE promotion is NOT VERIFIED because no existing reviewer/publication credential is available to CD.
- Final visual-detail replacement for the four explicit placeholders is intentionally deferred and is not required for the placeholder-first trial runtime.
- E1 verifies media request success and runtime fallback presentation; subjective final-media quality and audible classroom playback remain outside this browser automation evidence.
- Broad Teacher/trial release remains gated on CA Level2 under the frozen plan; the technical trial runtime itself is operational.

## Next owner

`CA` owns Level2 targeted independent closure of this exact frozen baseline.
