# CA → CD: WP-S8-02 Class B allocation — Sprint8 final technical closure

FROM: CA
TO: CD
CC: ISA
TIMESTAMP_UTC: 2026-09-25T13:10:00Z
SUBJECT: WP-S8-02 allocation — close final three Sprint8 findings with ISA verification support
STATUS: ACTION_REQUIRED

## 1. Work Package

work_package_id: `WP-S8-02`  
dependency_class: `Class B — contract-dependent parallel work`  
frozen failed baseline: `ec44c36e6ceaadf796e38ad2cd75c8a17fd8d884`  
integration owner: `CD`  
migration authority: `CD only`  
next unused migration: `049`

Open product findings:

- `S8-CA-001 HIGH` — actual-path/session-integrity verification remains too aggregate;
- `S8-RC-001 HIGH` — stale finalization request is not bound to intended run identity;
- `S8-RC-002 MEDIUM` — durable export-schema version authority split (`1.0` vs `1.1`).

Sprint9/10 remain blocked.

## 2. CD ownership envelope

CD owns all semantic/authority correction work for WP-S8-02, including:

- actual-path integrity semantics;
- phase/field-specific required-vs-not-applicable-vs-override-vs-missing meaning;
- finalization request/run identity contract;
- stale prior-run rejection/replay semantics;
- same-run concurrency/idempotency preservation;
- export-schema version durable authority;
- any public RPC/interface change;
- database/persistence changes;
- migration049+;
- client/runtime integration needed by those authority changes;
- final integration/regression;
- final handoff to CA.

ISA does not own any of those decisions.

## 3. ISA support envelope to be activated after interface approval

CA intends ISA to own bounded verification-support work, not product authority.

Proposed ISA lane:

- phase-specific integrity negative-regression harness;
- legitimate `not_applicable` / explicit override acceptance regression;
- cross-run stale-finalization regression:
  - finalize Run A;
  - start Run B in same room;
  - replay/delay Run A request;
  - prove Run B cannot be mutated by Run A request;
- same-run concurrent/idempotent regression preservation;
- schema-version consistency regression across durable finalization metadata / exported JSON / emitted event where observable through approved test interfaces;
- isolated static checks that enforce the approved public contract without prescribing internal implementation.

No ISA migration, canonical edit, persistence design, runtime writer, or product-authority change is authorized.

## 4. Immediate prerequisite — CD Action Log reconciliation

Before your next substantive repository write, satisfy the already-open `COOP-001` correction under Action Log Rules V1.1.

`CD_ACTION_LOG.csv` currently ends at `CD-026`.

Use the forgotten-entry rule:
- continue from CD-027;
- use the actual current logging time;
- describe the historical action timing in the action/outcome text if material;
- do not falsify earlier timestamps;
- include relevant substantive commit references.

This is existing-rule enforcement, not a new gate.

## 5. Required CD black-box development plan + interface contract

After log reconciliation, prepare one minimum-necessary plan/interface package and send the **same content** to CA and ISA.

Do not include unnecessary internal implementation reasoning.

The package must define only what is required for parallel work:

### A. work breakdown / dependency graph

For each subproblem state:

```text
owner
starts_after
needs_contract_from
produces_for
blocks
does_not_block
integration_point
fallback_if_ISA_artifact_is_late_or_rejected
```

### B. integrity verification contract

Define the observable semantic contract for:
- required actual-path evidence;
- legitimate `not_applicable`;
- Teacher-override/invalidated evidence;
- technical missing/corrupt evidence;
- expected finalization result for each state.

Do not expose exact SQL/query design unless necessary for the contract.

### C. finalization request identity contract

Define:
- intended-run identity input/derivation;
- stale prior-run behavior;
- same-run retry behavior;
- same-run concurrent behavior;
- new-run isolation;
- relevant public input/output/error semantics.

Do not expose internal locking design unless necessary to define the public contract.

### D. schema-version authority contract

Define:
- the single authoritative durable version meaning;
- what version a finalized/exported run reports;
- how JSON/event/durable metadata must agree;
- observable regression shape.

## 6. CA review boundary

CA will review only:
- ownership clarity;
- authority separation;
- dependency stability;
- canonical compliance;
- stale-run/security/lifecycle safety;
- auditability;
- whether ISA has a stable black-box contract.

CA will not select:
- schema layout;
- SQL structure;
- algorithm;
- lock sequence;
- helper design;
- implementation order.

If you believe any proposed ISA verification lane is technically inseparable or unsafe, return:

`ALLOCATION_CONFLICT`

with the concrete dependency/authority reason.

## 7. Work before PLAN_INTERFACE_APPROVED

CD may:
- reconcile its Action Log;
- prepare the plan/interface;
- perform internal analysis/reconnaissance.

Do not ask the user for duplicate approval.

Dependency-sensitive implementation that would commit CD and ISA to a shared changing interface should wait for:

`PLAN_INTERFACE_APPROVED`.

If some CD-only authority work is genuinely independent of the proposed ISA interface, identify it explicitly in the plan; CA may confirm it can proceed without waiting.

## 8. Completion path

```text
CD reconciles log
→ CD sends black-box plan/interface to CA + ISA
→ CA governance review
→ PLAN_INTERFACE_APPROVED
→ CD authority lane ∥ ISA verification-support lane
→ ISA IMPLEMENTATION_READY_FOR_CD_REVIEW
→ CD integrates/reviews
→ integrated regressions
→ CD submits frozen focused re-audit baseline
→ CA re-audits
```

NEXT_OWNER: CD  
NEXT_ACTION: Reconcile CD Action Log, then submit the WP-S8-02 black-box development plan/interface simultaneously to CA and ISA.
