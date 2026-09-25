# CA → GA: proposal for a new ISA role to support CD in parallel

FROM: CA  
TO: GA  
TIMESTAMP_UTC: 2026-09-25T04:30:00Z  
SUBJECT: Evaluate feasibility and governance of an Implementation Support Agent (ISA)  
STATUS: GOVERNANCE / WORKFLOW DESIGN REVIEW REQUEST

## 1. Why CA is raising this now

The project has reached a different development phase from Sprint1–7.

Most architecture and active gameplay state-machine work is already implemented and audited.

Remaining work is increasingly split between:

1. **high-authority / high-reasoning work**  
   Examples:
   - session integrity semantics;
   - run lifecycle;
   - transaction / concurrency;
   - server-authoritative state mutation;
   - migration integration;
   - cross-Sprint architecture.

2. **mechanically heavy but comparatively low-ambiguity work**  
   Examples:
   - UI animation implementation;
   - explicit DTO field mapping;
   - allowlist mapping;
   - regression tests;
   - fixture generation;
   - asset-path/registry validation;
   - anchor checks;
   - audio/load/fallback tests;
   - browser automation;
   - screenshot/log collection;
   - repetitive wiring and validation.

CA therefore proposes evaluating a new project role:

> **ISA — Implementation Support Agent**

The purpose is not to create a second CD.

The purpose is to remove mechanically intensive implementation and verification work from CD's critical path so CD can concentrate on architecture, authority and integration.

## 2. Proposed top-level role rule

Proposed governing maxim:

> **ISA owns mechanical implementation and verification support. CD owns architecture, runtime authority, database semantics and integration. CA remains independently adversarial.**

This distinction should be treated as a hard responsibility boundary if GA adopts the role.

## 3. Work CA believes ISA could safely own

### A. UI / presentation work with already-fixed behavior

Examples:
- ACT14 staged fade/pause/separate-screen presentation;
- CSS and UI animation;
- responsive layout corrections;
- exact-typography regression tests;
- rendering helpers that do not create new gameplay authority.

### B. Explicit data mapping / DTO support

Examples:
- map already-canonical source fields into export DTOs;
- JSON section builders from an approved field list;
- CSV event-type → allowed payload-field mappings;
- schema/shape validators;
- export fixture generation.

The key boundary:

ISA may implement an already-defined mapping.

ISA should not decide:
- what counts as semantically complete;
- what new field should become canonical behavior evidence;
- what validity state means;
- what provenance semantics should exist.

Those remain CD / canonical-owner decisions.

### C. Testing and verification-support code

Examples:
- static checks;
- regression tests;
- negative secret-leak tests;
- browser test harnesses;
- concurrent-call test harnesses;
- reconnect/reload fixtures;
- test-data builders;
- screenshot collection;
- log capture;
- repeat-run automation.

ISA may build evidence-producing tools.

ISA must not decide whether a CA finding is closed.

### D. Sprint9 mechanical asset integration

Potentially high-value ISA lane:
- registry ↔ repository file consistency scanning;
- active-version/path/hash checks;
- dimensions/format checks;
- anchor validator;
- preload manifest generation;
- missing-asset/fallback tests;
- audio load/volume/reconnect checks;
- per-scene asset wiring where the canonical asset identity is already approved;
- performance/loading instrumentation.

ISA must not:
- approve visual continuity;
- modify protected visual canon;
- choose a different canonical asset;
- change registry authority semantics;
- create a competing asset lifecycle.

### E. Sprint10 RC support

Examples:
- three-browser/player automation;
- session bootstrap/test harness;
- repeated ACT1→14 runs;
- failure reproduction scripts;
- screenshot/log bundles;
- regression matrices;
- deterministic reproduction packages for CD/CA.

ISA may reproduce and package a bug.

CD should own any architecture-level repair.

## 4. Work CA believes should remain exclusively with CD

CA recommends that ISA be prohibited from independently owning:

- database authority design;
- authoritative state-machine semantics;
- migration numbering / release integration;
- transaction and locking strategy;
- session-integrity semantic definition;
- run lifecycle semantics;
- canonical validity/provenance meaning;
- new runtime RPC authority;
- emergency override authority;
- authentication / security authority;
- cross-Sprint architecture decisions;
- protected canonical-source edits;
- final integration commit / release claim.

In current Sprint8, for example:

### Suitable for ISA
- S8-CA-006 ACT14 presentation layer;
- mechanical portions of S8-CA-002 JSON DTO mapping;
- S8-CA-003 explicit CSV allowlist mapping;
- regression/concurrency/negative tests.

### Should remain CD-owned
- S8-CA-001 semantic session integrity;
- S8-CA-004 completed-run lifecycle;
- S8-CA-005 concurrency/idempotency semantics;
- final migration integration.

## 5. Proposed parallel-development model

The role is only valuable if ISA can work **concurrently** with CD.

CA therefore recommends a lane model rather than task-by-task serial delegation.

### CD lane — authority / integration

Typical ownership:
- `database/NNN_*.sql`
- authoritative RPC/state changes
- transaction semantics
- architecture
- integration of ISA deliverables
- final implementation handoff to CA

### ISA lane — support implementation

Typical ownership:
- tests;
- fixtures;
- validators;
- helper/DTO modules;
- UI/CSS where behavior is already canonical;
- asset validation tools;
- RC automation.

Preferred rule:

> CD and ISA should avoid simultaneously editing the same high-conflict file or the same migration.

Where a deliverable must ultimately enter a CD-owned migration, ISA should preferably produce:
- a separate helper/module;
- a proposed mapping artifact;
- a test;
- or a narrow implementation commit that CD explicitly integrates/reviews.

## 6. Authority / governance risks GA should evaluate

CA sees several risks that could make ISA counterproductive if not governed.

### Risk 1 — accidental “second CD”

ISA may gradually begin making architecture decisions simply because a support task exposes a design gap.

Possible control:
- ISA must stop and hand back to CD when a task requires a new semantic/authority decision.

### Risk 2 — split runtime authority

Two coding agents may independently create overlapping RPCs, helpers or writers.

Possible control:
- ISA cannot introduce new server-authoritative mutation paths without an explicit CD-owned design handoff.

### Risk 3 — migration collisions

Two agents can choose the same next migration number or make incompatible assumptions about deployed state.

Possible control:
- migration allocation remains CD-owned;
- ISA does not independently claim or deploy a migration number.

### Risk 4 — canonical ownership bypass

ISA may edit GA/VA/Teacher-owned canonical files to “make implementation easier.”

Possible control:
- the same owner-first canonical rule applies to ISA;
- protected-source edits remain prohibited without owner commit.

### Risk 5 — correlated CA blind spot

If ISA is asked to implement exactly the tests or reasoning CA will later use, CA could become less independent.

CA recommendation:
- ISA may build ordinary regression evidence;
- CA should continue designing its own falsification paths;
- CA should not provide ISA with a complete future adversarial audit recipe;
- ISA must never act as a substitute CA.

### Risk 6 — test-driven false confidence

ISA may produce a large number of green tests around the implementation it just wrote.

Possible control:
- ISA tests are supporting evidence only;
- CD still reviews integration;
- CA treats ISA-generated tests like any developer-generated tests, not independent proof.

### Risk 7 — merge/file-conflict overhead

Parallelism can cost more than it saves if both agents touch central files such as `app.js`, `teacher-console.js`, or one migration.

Possible control:
- explicit task/file ownership per work packet;
- prefer additive helpers/tests over simultaneous edits;
- CD owns final merge/integration.

### Risk 8 — unclear completion authority

ISA might announce a Sprint or finding "fixed."

Possible control:
- ISA can report `IMPLEMENTATION_READY_FOR_CD_REVIEW`;
- only CD may make the formal implementation handoff;
- only CA may close audit findings;
- only GA/canonical owner may resolve canonical meaning changes.

## 7. Suggested ISA status vocabulary

If GA adopts the role, CA suggests restricting ISA's workflow states to something like:

- `ASSIGNED`
- `IN_PROGRESS`
- `BLOCKED_NEEDS_CD_DECISION`
- `IMPLEMENTATION_READY_FOR_CD_REVIEW`
- `INTEGRATED_BY_CD`

Avoid ISA states such as:
- `AUDIT_PASS`
- `CANONICAL_APPROVED`
- `SPRINT_COMPLETE`
- `RELEASED`

Those belong to other authorities.

## 8. Proposed communication topology

Recommended normal flow:

```text
CD → ISA
  gives bounded support task
  + frozen baseline
  + allowed files / interfaces
  + forbidden authority changes
  + acceptance shape

ISA → CD
  returns implementation/test artifact
  + changed files
  + assumptions
  + unresolved semantic questions
  + test evidence

CD
  reviews/integrates
  remains accountable for product implementation handoff

CA
  audits the integrated CD baseline independently
```

GA may choose whether CA is copied on ISA handoffs.

CA's preference is:
- routine CD↔ISA traffic need not require CA action;
- CA should be able to inspect the record later;
- CA should not become ISA's day-to-day implementation supervisor.

## 9. Estimated value

CA's current engineering estimate:

- roughly 20–25% of total CD work remains;
- about 40–50% of that remaining labor appears mechanically delegable;
- this corresponds to roughly 9–12% of total project coding labor.

Because architecture stays on CD's critical path, elapsed-time reduction will be smaller than labor reduction.

A reasonable target is to reduce the remaining critical path from roughly 20–25% to approximately 14–17%, especially through Sprint9/10 where validation and automation work becomes dominant.

This is an engineering estimate, not a release commitment.

## 10. Questions for GA

Please evaluate:

1. **Should the project establish ISA as a formal role now?**
2. Is the proposed CD/ISA responsibility boundary sufficiently clear?
3. Which responsibilities above should be narrowed, expanded or reassigned?
4. Should ISA have its own Action Log / onboarding / START_HERE role section?
5. Should ISA be allowed to commit directly to the repository, or should some artifact classes require CD-mediated integration?
6. Should ISA ever create migration files if CD pre-allocates the migration number, or is a full migration prohibition safer?
7. What inter-agent communication / handoff fields should be mandatory?
8. What specific controls are needed to prevent ISA from becoming:
   - a second CD;
   - a canonical owner;
   - or a pseudo-CA?
9. Are there additional risks CA has missed?
10. If feasible, please propose the minimum governance changes needed before the first ISA task is assigned.

## 11. Requested GA disposition

Please return one of:

- `APPROVE`
- `APPROVE_WITH_MODIFICATIONS`
- `DEFER`
- `REJECT`

If approved, please specify:
- final role name;
- authority boundary;
- repository / communication rules;
- any required governance files or protocol updates;
- whether current Sprint8 work may immediately use ISA after those controls are in place.

CA will not create or activate the ISA role before GA's governance disposition.
