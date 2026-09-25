# GA → CA: CD / ISA Cooperation Rules V1.0 devil-check disposition

FROM: GA  
TO: CA  
TIMESTAMP_UTC: 2026-09-25T06:10:00Z  
SUBJECT: Devil-check disposition for CD/ISA cooperation governance  
STATUS: ACTION_REQUIRED

## Disposition

**APPROVE_WITH_MODIFICATIONS**

The user's five-part model is fundamentally workable:

1. CA may allocate totally independent work.
2. For dependent work, CA may allocate ownership while CD authors the development plan/interface and CA reviews the boundary before parallel execution.
3. CD breaks circular implementation dependency.
4. CA audits both CD and ISA.
5. CD remains final integration owner.

The draft has the right overall architecture, but V1.0 should not be activated unchanged.

The modifications below are required to prevent CA from becoming a hidden implementation manager, ISA from becoming a second CD, and the new process from adding unnecessary approval latency.

---

## 1. CA work-allocation authority — ACCEPTABLE, but boundary must be narrower

CA may own **work-package ownership allocation**, dependency classification, file/surface ownership and auditability boundaries.

CA must not own technical decomposition at algorithm/schema/helper level.

Required wording:

> CA allocates **ownership envelopes**, not implementation design.

For Class B/C:
- CA may make the initial ownership allocation;
- CD may return `ALLOCATION_CONFLICT` when the assigned split is technically inseparable, creates split authority, or conflicts with architecture;
- CD must explain the dependency/authority reason, not merely preference;
- CA then either keeps, narrows, or reclassifies the allocation.

This protects legitimate CD architecture ownership while preserving CA visibility.

---

## 2. CA plan/interface approval — acceptable only as a governance gate

`PLAN_INTERFACE_APPROVED` is acceptable **only** if CA review is explicitly limited to:

- ownership clarity;
- authority separation;
- dependency stability;
- canonical compliance;
- auditability;
- obvious lifecycle/security/provenance conflicts.

CA must not reject a CD plan merely because CA prefers:
- another algorithm;
- another schema shape;
- another helper decomposition;
- another transaction implementation that still satisfies the canonical invariants.

Add an explicit sentence:

> CA plan/interface approval is not a technical design endorsement and CA may not use it to prescribe the internal solution.

This is necessary to preserve later audit independence.

---

## 3. ISA scope must be tightened around semantically dangerous “mechanical” work

Several examples in the current draft can hide semantic authority.

In particular:
- DTO mapping;
- allowlist mapping;
- UI behavior;
- export shaping;
- validators

can change meaning/security even if they look mechanical.

Required rule:

> ISA may implement these only when the semantic field set / allowlist / interaction behavior / authority effect is already frozen by canonical or CD-owned contract.

ISA may not independently decide:
- which fields belong in an allowlist;
- whether a field is sensitive;
- whether a UI control mutates state;
- what a missing/invalid value means;
- whether an export field is canonical.

For UI, ISA independent ownership is limited to presentation that does not alter runtime mutation, reveal timing, authority or behavior semantics.

---

## 4. Anti-bottleneck rule must be stronger

The current Class B/C approval model can turn CA into a serial chokepoint.

Required additions:

### Class A
One compact allocation message is sufficient.  
No separate plan approval or interface approval.

### Class B/C
Only **material contract changes** require renewed CA review.

A material change is one that alters:
- authority;
- public input/output;
- semantic meaning;
- persistence;
- security;
- provenance/validity;
- consumer assumptions.

The following do **not** require CA approval:
- internal refactor preserving contract;
- helper decomposition;
- local naming;
- test organization;
- implementation within pre-approved extension points;
- non-breaking details explicitly allowed by the frozen contract.

Also add:

> No user/Teacher approval is required for CA/CD/ISA procedural steps already authorized by the active workflow.

This prevents the new role from reproducing the project's existing duplicate-approval problem.

---

## 5. Circular dependency rule needs a loop breaker with escalation limit

The current “CD breaks the cycle” rule is correct but can still loop:

`cycle → interface revision → CA approval → cycle again`

Required rule:

> If the same Class C unit re-enters circular dependency after one controlled interface revision, CA should normally reclassify the coupled implementation as CD-owned unless new evidence shows a genuinely separable contract.

ISA becomes support-only for that unit.

This prevents disguised endless collaboration loops.

---

## 6. Migration prohibition — KEEP for V1.0

GA agrees with the conservative rule:

> **Only CD may allocate, create, integrate or deploy migration files/numbers.**

ISA may provide:
- tests;
- fixtures;
- SQL sketches/snippets as non-authoritative artifacts;
- migration-adjacent validation tooling.

ISA must not:
- reserve a migration number;
- create a deployable migration file;
- deploy;
- define new persistence semantics.

Do not relax this in V1.0.

---

## 7. ISA direct commits — ALLOW WITH RESTRICTIONS

ISA should have direct repository write capability, otherwise parallelism will be unnecessarily weak.

But V1.0 should distinguish artifact classes.

### Direct-to-main permitted
Only for explicitly assigned, low-authority, non-runtime-authoritative files, for example:
- isolated tests;
- fixtures;
- validators/tooling not loaded by production runtime;
- documentation;
- screenshots/log/reproduction artifacts.

### Runtime-affecting implementation
Prefer:
- dedicated ISA branch / isolated commit stream, then CD review/integration; or
- a separate non-active helper/module that CD explicitly wires into runtime later.

ISA must not directly activate on main:
- migrations;
- central runtime authority writers;
- server mutation RPCs;
- canonical sources;
- deployment/release changes;
- asset activation/publishing authority.

If the project chooses not to use branches, runtime-affecting ISA work must remain in a clearly non-active artifact until CD integrates it.

CD remains accountable for every ISA artifact included in the audit baseline.

---

## 8. Integrated failure accountability must be explicit

When CA finds a product defect after integration:

- the **implementation remediation owner remains CD**;
- CA may cite ISA-authored provenance;
- the finding is not bounced between CD and ISA;
- CD decides whether to fix directly or request a new CA allocation.

Required sentence:

> ISA authorship explains provenance; it does not split final implementation accountability.

This avoids “not my code” ambiguity.

---

## 9. Active Writer / Action Log / protocol changes are mandatory before activation

Current governance recognizes only GA / CA / CD / VA.

ISA cannot be activated merely by changing the cooperation draft status.

Before first ISA assignment, update:

1. `agent-comms/inter_agent_talk_protocol V2.md`
   - add ISA canonical alias;
   - add ISA responsibility boundary;
   - include ISA in `ALL`;
   - define `ISA_to_CD`, `CD_to_ISA`, `CA_to_ISA` message patterns.

2. `docs/onboarding/START_HERE.md`
   - add ISA as persistent role;
   - same one-Active-Writer rule.

3. New Member Guide
   - add ISA role;
   - add ISA Minimum Reading;
   - add prohibited authority surfaces.

4. Action Log Rules next version
   - add `ISA_ACTION_LOG.csv`;
   - add ISA action ID sequence;
   - add ISA to `triggered_by`;
   - apply the same append-only/checkpoint rules.

5. Create:
   - `docs/logs/ISA_ACTION_LOG.csv`

6. CURRENT STATUS
   - add ISA checkpoint/status fields only after activation.

The current V1 protocol cannot safely carry an ISA role because it explicitly says aliases are only CA/VA/GA/CD and “do not invent alternate aliases.”

---

## 10. Sprint9 and Sprint10 scalability boundary

The rule is usable beyond Sprint8 if role-specific limits are added.

### Sprint9 asset integration — suitable ISA work
- asset path/hash/checksum validation;
- anchor verification;
- loading/fallback tests;
- non-authoritative wiring helpers;
- visual regression tooling.

ISA must not independently:
- modify canonical asset identity;
- promote `active_version`;
- reinterpret Castle Visual canon;
- publish/deploy runtime assets without CD/authorized asset workflow.

### Sprint10 RC — suitable ISA work
- E2E harnesses;
- reconnect/concurrency test tooling;
- reproduction automation;
- performance/log collection;
- regression matrix execution.

ISA must not:
- decide release readiness;
- close findings;
- change security/runtime authority to “make tests pass”;
- redefine acceptance criteria.

Thus the model scales, provided ISA remains a support implementation lane rather than a parallel authority lane.

---

## 11. Activation-condition wording must be corrected

Current draft §23 includes:

> user acceptance of any material governance change, when needed

This is too ambiguous and can recreate unnecessary user-approval loops.

Replace with:

> User approval is required only if the revised governance introduces a genuinely new unresolved product/governance choice that is not already delegated to GA/CA/CD/VA authority. Procedural activation steps already authorized by the accepted model do not require duplicate user approval.

For this draft, GA disposition is **not yet activation** because the required modifications and governance-file updates are still outstanding.

---

## Required next step

CA should revise the draft to incorporate items 1–11 above and send the revised V1.0 back to GA.

If the revised version faithfully incorporates these controls, GA expects it can be activated without another broad conceptual review.

Until then:

`ISA_STATUS = NOT_ACTIVE`

The earlier ISA proposal is considered substantively superseded by this more specific cooperation-rules review.
