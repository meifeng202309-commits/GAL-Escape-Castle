# CA → ISA: WP-S8-02 Class B verification-support allocation

FROM: CA
TO: ISA
CC: CD
TIMESTAMP_UTC: 2026-09-25T13:11:00Z
SUBJECT: WP-S8-02 — prepare for Sprint8 final-closure verification support
STATUS: ASSIGNED / CONTRACT_PENDING

## 1. Work Package

work_package_id: `WP-S8-02`  
dependency_class: `Class B — contract-dependent parallel work`  
frozen failed baseline: `ec44c36e6ceaadf796e38ad2cd75c8a17fd8d884`  
product authority/integration owner: `CD`

Open findings:
- S8-CA-001 actual-path integrity;
- S8-RC-001 stale prior-run finalization isolation;
- S8-RC-002 schema-version authority consistency.

## 2. Your intended lane

After CD publishes and CA approves the black-box interface contract, ISA is intended to own **verification-support implementation only**:

- phase-specific missing/corrupt evidence negative tests;
- legitimate not-applicable / explicit override acceptance tests;
- cross-run stale finalization test harness;
- same-run retry/concurrency regression preservation;
- schema-version consistency regression where exposed by the approved contract;
- isolated static assertions around the frozen public contract.

You are not assigned product semantic fixes.

## 3. Hard boundaries

Do not:
- create/allocate/deploy migration049+;
- change DB schema/persistence;
- change finalization RPC authority;
- decide how run identity is bound;
- decide what evidence is semantically required;
- decide validity/provenance meaning;
- decide schema-version authority;
- edit protected canonical sources;
- change Sprint9/10 code;
- declare findings closed.

## 4. What you may do now

Before `PLAN_INTERFACE_APPROVED`, you may perform non-binding reconnaissance and scaffolding only:

- inspect existing Sprint8/Sprint5/Sprint6 test harnesses;
- identify reusable fixture/test helpers;
- sketch parameterized black-box test structure that does not assume the final RPC signature;
- identify test-observability gaps to report to CD;
- prepare no-authority notes/questions.

Do **not** commit dependency-sensitive assertions that encode an interface CD has not yet frozen.

## 5. Expected next input

CD must send the same WP-S8-02 plan/interface package to CA and ISA.

When received:
- review only for implementability from the ISA lane;
- if a semantic/authority decision is missing, report `BLOCKED_NEEDS_CD_DECISION`;
- do not fill the gap yourself.

After CA returns:

`PLAN_INTERFACE_APPROVED`

you may begin the assigned verification-support implementation in parallel with CD.

## 6. Handoff after implementation

Return:

```text
work_package_id
interface_version
branch / commits
changed_files
test_harness_summary
tests_run / results
assumptions
unresolved_questions
authority_changes = NONE
canonical_changes = NONE
migration_changes = NONE
status = IMPLEMENTATION_READY_FOR_CD_REVIEW
```

CD remains responsible for review, integration and final product handoff to CA.

NEXT_OWNER: ISA  
NEXT_ACTION: Perform non-binding reconnaissance only; await the CD-authored plan/interface and CA PLAN_INTERFACE_APPROVED before dependency-sensitive implementation.
