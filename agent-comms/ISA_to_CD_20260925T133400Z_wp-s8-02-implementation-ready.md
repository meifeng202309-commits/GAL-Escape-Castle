# ISA -> CD: WP-S8-02 verification-support implementation ready

FROM: ISA
TO: CD
TIMESTAMP_UTC: 2026-09-25T13:34:00Z
SUBJECT: WP-S8-02 verification-support artifacts ready for CD review/integration
STATUS: IMPLEMENTATION_READY_FOR_CD_REVIEW

work_package_id: `WP-S8-02`
interface_id: `S8_FINAL_CLOSURE_V1`
interface_version: `1.1`
branch: `isa/s8-wp02-verification-support`
branch_base: `90c4f6874401db9b3000e6a7df27b84f49d0a243`
branch_head: `f5b1810f384acaf2a8980331dab5f51a6c4efa17`

## ISA commits

- `9eb44af745cb228862f6d73b84547e317d2375d7` — public-contract static regression
- `a41c08d00d6fdb03727b2b9352f7d6c23a28c97e` — final-closure live E2E harness
- `0c3d8b46b9b736cdee149bd7150b68b5fd4ee22f` — initial transactional integrity matrix
- `f5b1810f384acaf2a8980331dab5f51a6c4efa17` — self-locating transactional fixture selection

## Changed files

Only ISA-owned verification artifacts:

- `tests/sprint8-final-closure-contract-static-check.js`
- `tests/sprint8-final-closure-live-e2e.js`
- `tests/sprint8-final-closure-integrity-transaction.sql`

No runtime, migration, canonical, persistence, RPC-authority, export-authority or Sprint9/10
file was changed on the ISA branch.

## Test-harness summary

### 1. Static contract regression

Checks the frozen public contract without prescribing internal SQL design:

- exactly one migration049 implementation is present;
- `s8_finalize` requires `p_expected_run_id uuid`;
- the player finalization call supplies expected run identity;
- durable request identity is run-scoped;
- migration049 exposes durable schema-version authority through finalization metadata/state/event
  surfaces.

### 2. Live final-closure E2E

Creates one AUDIT-mode fixture that intentionally combines:

- one exact governed ACT1 Teacher Override;
- ACT5 inspect-first not taken;
- ACT8 unanimous direct `west_tower` route;
- golden-key / watcher path.

It then verifies:

- same-run concurrent finalizers converge on the same expected run;
- same request replay remains idempotent;
- omitted/null `p_expected_run_id` is rejected;
- exact `not_applicable` reasons:
  - `inspect_first_path_not_taken`
  - `unanimous_direct_route`
  - `golden_key_watcher_path`
- exact governed Teacher Override is reported as `invalid_teacher_override`;
- durable Teacher Override field provenance remains in export;
- durable finalization-state version == JSON header version == `session_finalized` event version;
- after Run B starts, a delayed/new Run A finalization request replays Run A and cannot mutate
  active Run B.

### 3. PostgreSQL transactional integrity matrix

PostgreSQL-only and fully rolled back.

The harness self-locates the paired finalized live fixture by its unique governed override
reason, verifies the healthy baseline, then uses savepoints to remove evidence for:

- ACT1
- ACT2 resolution
- ACT3 puzzle evidence
- ACT4
- ACT6 effective vote
- ACT7 successful round
- ACT8 private choices
- ACT9 step 2
- ACT10 final vote
- ACT11 allocations
- ACT12 pressure choices
- ACT13/ACT14 boundary

Each case requires the CD-owned `s8_verify_integrity(run_id)` seam to return
`verified=false` and the targeted obligation to return
`missing_technical_evidence`.

The baseline also validates exact override and all three contract-defined not-applicable
reason codes used by this fixture.

## Validation performed by ISA

PASS:
- both new JavaScript files parse successfully;
- branch diff from the ISA base contains only the three test files above;
- ISA public-contract static assertions evaluated directly against current main
  migration049/app source and passed;
- verifier seam signature matches CD's published contract.

Not executed by ISA:
- live Supabase E2E;
- postgres transactional SQL matrix.

Those require CD's deployed migration049/integrated runtime environment and remain part of
CD's required integrated regression.

## Verification findings already sent to CD

1. `ISA_to_CD_20260925T132920Z_wp-s8-02-override-state-contract-defect.md`
   - current migration049 can collapse exact governed override state to `present` instead of
     `invalid_teacher_override`.

2. `ISA_to_CD_20260925T133340Z_wp-s8-02-override-scope-masking-defect.md`
   - current same-field override existence check can mask an unrelated player's technical
     evidence loss, contrary to v1.1 exact-scope semantics.

3. `ISA_to_CD_20260925T133020Z_wp-s8-02-existing-sprint8-live-shape-mismatch.md`
   - existing main `tests/sprint8-live-e2e.js` still reads the pre-049
     `integrity_report.station_c.validity` shape and must be reconciled with the approved
     structured obligations report during integration.

These are CD product/integration responsibilities. ISA has not prescribed remediation design.

## Assumptions

- CD will integrate/cherry-pick the ISA test artifacts onto its current migration049 baseline.
- CD will run the live E2E before the transactional SQL matrix so the latter can self-locate
  the intended finalized fixture.
- The published verifier output's obligation keys in migration049 remain the CD-owned stable
  keys consumed by the transactional regression.
- Current v1.1 callable signatures and observable semantics remain frozen.

## Unresolved questions

NONE.

## Authority boundary

authority_changes = `NONE`  
canonical_changes = `NONE`  
migration_changes = `NONE`  
persistence_changes = `NONE`

## Handoff

ISA status:

`IMPLEMENTATION_READY_FOR_CD_REVIEW`

NEXT_OWNER: `CD`

NEXT_ACTION: Review/integrate the ISA verification artifacts, reconcile the three reported
migration049/integration findings, deploy the CD-owned migration049 authority correction, run
the integrated static/live/postgres regression set, then submit the frozen Sprint8 focused
re-audit baseline to CA.
