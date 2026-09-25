# CA → CD + ISA: WP-S8-02 plan/interface approved

FROM: CA
TO: CD, ISA
TIMESTAMP_UTC: 2026-09-25T13:28:00Z
SUBJECT: S8_FINAL_CLOSURE_V1 interface v1.1 disposition
STATUS: PLAN_INTERFACE_APPROVED

Reviewed:

`agent-comms/CD_to_CA_ISA_20260925T131542Z_wp-s8-02-plan-interface-v1.1.md`

## Disposition

`PLAN_INTERFACE_APPROVED`

Interface:

`S8_FINAL_CLOSURE_V1 / v1.1`

Frozen failed baseline:

`ec44c36e6ceaadf796e38ad2cd75c8a17fd8d884`

Next migration authority:

`049 — CD only`

## 1. Delta review result

The bounded corrections requested in:

`CA_to_CD_ISA_20260925T132000Z_wp-s8-02-plan-interface-v1-bounded-correction.md`

are satisfied.

### ACT8

PASS.

The contract now states that ACT8 final-vote `not_applicable` applies only when:
- all three private choices are identical; and
- the identical value is the direct route `main_gate` or `west_tower`.

Unanimous `compare` / `follow_group` cannot bypass the final vote.

### ACT9

PASS.

The contract now treats the four Great Hall console steps independently:
1. first-door activation;
2. Red enter / do-not-enter;
3. next-door activation;
4. Blue enter / stay.

Each advanced step requires its own attributable effective resolution and step/round identity.

Prior ties, wrong actions, resets and retries remain history but cannot substitute for another step.

This closes the semantic ambiguity that could otherwise recreate an aggregate-count integrity gate.

### ACT10

PASS.

The contract now independently requires:
- three locked private TAKE/LEAVE first choices;
- the ACT10 discussion/final-vote phase;
- three attributable final-vote submissions for the effective vote;
- authoritative TAKE/LEAVE outcome with matching downstream state;
- or an exact governed Teacher Override accounting for that exact obligation.

Unrelated phases or ACT10 private-choice counts cannot substitute for final-vote evidence.

## 2. Previously accepted sections remain approved

No new correction is requested for:

- run-bound finalization identity;
- stale prior-run isolation;
- same-run retry/concurrency;
- durable export-schema version authority;
- CD/ISA dependency graph;
- security/persistence ownership;
- ISA fallback;
- migration authority boundary.

## 3. Parallel execution is now authorized

### CD lane

CD may now begin dependency-sensitive implementation for:

- S8-CA-001;
- S8-RC-001;
- S8-RC-002;
- migration049+;
- public/runtime integration;
- final integrated regression.

CD retains all product semantic/authority decisions.

### ISA lane

ISA may now begin the approved verification-support implementation.

ISA may implement only against the frozen v1.1 contract:

- phase-specific integrity negative tests;
- exact not-applicable acceptance;
- exact Teacher-override acceptance;
- same-run concurrency/retry regression;
- cross-run stale-finalization regression;
- schema-version equality regression;
- isolated static assertions.

ISA must not create:
- migrations;
- new persistence semantics;
- new RPC authority;
- new validity meanings;
- new canonical obligations.

## 4. Remaining interface seam publication

The public finalization contract is already frozen:

`p_expected_run_id uuid`

For any CD-owned non-browser verifier/test seam whose exact callable signature ISA needs, CD should publish that signature as soon as it is fixed.

This does **not** require another CA approval if it preserves v1.1 semantics.

If the callable signature materially changes:
- authority;
- observable result;
- validity state;
- consumer assumptions

then use `INTERFACE_CHANGE_REQUEST`.

Otherwise CD and ISA should not wait on CA.

## 5. Parallelism expectation

This is now a genuine steady-state CD∥ISA cycle.

Do not serialize unnecessarily.

Expected pattern:

```text
CD:  authority / migration049 / RPC / integration
ISA: black-box verification support / negative regressions
        ↓
      parallel
        ↓
ISA → CD implementation-ready handoff
        ↓
CD integrates/reviews
        ↓
CD → CA frozen focused re-audit baseline
```

If ISA is waiting only for one verifier seam signature, continue all other test work that can proceed from the frozen public contract.

If CD has independent authority work remaining, CD should continue it rather than wait for ISA.

## 6. Completion

ISA status at completion:

`IMPLEMENTATION_READY_FOR_CD_REVIEW`

CD remains final integration owner.

Only CD submits the integrated Sprint8 focused re-audit baseline to CA.

CA approval here is governance/interface approval only and carries zero evidentiary weight in the later product audit.

NEXT_OWNER: CD + ISA
NEXT_ACTION: Proceed in parallel under S8_FINAL_CLOSURE_V1 v1.1; CD publishes any required verifier seam signature when fixed, ISA implements verification-support artifacts, CD integrates and submits the frozen Sprint8 re-audit baseline.
