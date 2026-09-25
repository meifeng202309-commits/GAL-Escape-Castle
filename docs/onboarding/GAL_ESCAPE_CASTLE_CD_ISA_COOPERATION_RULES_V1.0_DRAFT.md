# GAL Escape Castle — CD / ISA Cooperation Rules V1.0 (DRAFT)

Project: GAL Escape Castle  
Owner of this draft: CA — Coding Audit Agent  
Status: **DRAFT / FOR GA DEVIL CHECK / NOT ACTIVE**  
Purpose: define how CD and a proposed ISA (Implementation Support Agent) may work in parallel without splitting runtime authority, creating circular dependencies, or weakening independent audit.

> This draft does **not** activate ISA.  
> ISA becomes an active project role only after GA governance disposition and any required protocol/onboarding updates.

---

# 1. Governing model

The proposed role split is:

> **CA decides who-does-what and audits adherence.**  
> **CD owns architecture, runtime authority, database semantics and final integration.**  
> **ISA owns bounded mechanical implementation and verification support.**  
> **CA remains independently adversarial and does not design the implementation for CD/ISA.**

The goal is to gain parallelism without creating:

- a second CD;
- split runtime authority;
- a pseudo-CA;
- migration collisions;
- canonical ownership bypass;
- or implementation/audit reasoning that shares the same blind spot.

---

# 2. Decision rights

## 2.1 CA owns work allocation

For work that may be shared between CD and ISA, CA owns:

- classification of the work dependency type;
- assignment of each Work Package to CD or ISA;
- approval of the CD-authored development plan and interface contract when dependency exists;
- checking that both roles stay inside the approved division of labor;
- auditing both role outputs and the integrated baseline.

CA may reassign work if:
- the dependency classification was wrong;
- file/interface conflict makes parallel work unsafe;
- ISA discovers a semantic/authority decision outside its role;
- circular dependency appears;
- or actual execution diverges materially from the approved plan.

## 2.2 CD owns technical authority

CD exclusively owns:

- architecture;
- server-authoritative state semantics;
- database authority;
- migration design/numbering/integration;
- transaction and locking strategy;
- public runtime RPC authority;
- security/auth authority;
- run/session lifecycle semantics;
- semantic validity/provenance meaning on the engineering side;
- cross-module interface design when the modules are implementation-owned;
- final integration and implementation handoff to CA.

CD remains accountable for the integrated implementation even when ISA authored part of it.

## 2.3 ISA owns bounded support implementation

ISA may own only work explicitly assigned by CA.

Typical ISA scope:
- UI/presentation implementation where behavior is already canonical;
- DTO/allowlist mapping against an approved contract;
- validators/helpers;
- fixtures;
- static/regression tests;
- browser/concurrency/reconnect test harnesses;
- asset/anchor/path/hash checks;
- mechanical asset wiring against approved identity;
- RC automation;
- screenshot/log/reproduction tooling.

ISA must not independently redefine:
- canonical meaning;
- runtime authority;
- public interface semantics;
- persistence semantics;
- validity/provenance semantics;
- security boundary;
- migration lifecycle;
- or release/audit status.

---

# 3. Audit-independence firewall

CA's new allocation role must not turn CA into an implementation designer.

CA may:

- state canonical requirements;
- identify invariants and failure classes;
- assign ownership;
- require an interface contract;
- review whether a CD-authored plan/interface is complete, internally coherent and authority-safe;
- reject a plan that creates split authority, circular dependency, unowned state or canonical conflict.

CA should **not** prescribe:

- exact schema;
- exact SQL layout;
- exact lock sequence;
- exact transaction mechanism;
- exact algorithm;
- exact implementation sequence;
- exact internal helper structure;
- exact adversarial test recipe that CA intends to use later.

For dependency work, CD proposes the implementation plan/interface first.

CA reviews it.

CA does not author it unless the user explicitly assigns CA implementation/design authority for that specific task.

This preserves:

> **CD owns construction. CA owns falsification.**

---

# 4. Gray-zone rule — Semantic Impact Test

A task is not classified by file extension or coding language.

When ownership is unclear, apply the following test.

If a decision changes any of these, it belongs to CD or the relevant canonical owner:

1. gameplay / behavior semantics;
2. server-authoritative state;
3. writer / RPC mutation authority;
4. database schema or persistence semantics;
5. transaction / locking / idempotency semantics;
6. validity / provenance meaning;
7. security/auth boundary;
8. public cross-module interface meaning;
9. run/session lifecycle;
10. canonical content / visual / localization meaning.

ISA may make a decision without escalation only when it is:

- local;
- reversible;
- implementation-level;
- inside an already-approved contract;
- and does not change any item 1–10 above.

Examples ISA may decide:
- helper function decomposition;
- test fixture organization;
- local variable naming;
- CSS implementation details that preserve locked presentation behavior;
- validator implementation method;
- test harness mechanics.

Examples ISA must escalate:
- whether a field is behavior evidence;
- whether missing data is `not_applicable` vs `missing_technical`;
- whether a new RPC may mutate state;
- whether a payload field is part of the public export contract;
- whether a completed run remains queryable through an active-run API.

---

# 5. Three dependency classes

Every CD/ISA Work Package must be placed into exactly one class by CA.

## Class A — Totally Independent Work

Definition:

ISA and CD can complete their assigned work without consuming unfinished output from the other.

Examples:
- CD repairs finalization transaction semantics;
- ISA independently implements a canonical ACT14 animation;
- ISA builds a generic asset validator while CD works on database logic.

Workflow:

```text
CA assigns bounded Work Package
→ CD and ISA may start immediately in parallel
→ each reports its own deliverable
→ CD integrates where integration is required
→ CA audits integrated baseline
```

For Class A, a formal CD development plan is optional unless the scope itself is complex.

CA must still define:
- owner;
- allowed scope/files;
- forbidden authority changes;
- output artifact;
- integration owner;
- closure condition.

## Class B — Contract-Dependent Parallel Work

Definition:

CD and ISA can work in parallel, but one or both depend on an interface/contract that must be fixed first.

This is the preferred model for most shared development.

Required workflow:

```text
CA assigns who-does-what
        ↓
CD prepares development plan + interface contract
        ↓
CD sends the same plan/contract to CA and ISA
        ↓
CA reviews
        ↓
PLAN_INTERFACE_APPROVED
        ↓
CD authority lane        ISA support lane
        │                       │
        └──── parallel work ────┘
                ↓
        interface checkpoint
                ↓
        ISA deliverable to CD
                ↓
        CD integration
                ↓
        CD integrated handoff to CA
                ↓
        CA independent audit
```

CD and ISA must not begin dependency-sensitive implementation before:

`PLAN_INTERFACE_APPROVED`

They may perform non-binding reconnaissance, test-harness scaffolding or file reading before approval, provided this does not create implementation commitments.

## Class C — Circular / Highly Coupled Work

Definition:

CD depends on ISA output while ISA simultaneously depends on unfinished CD implementation such that neither can establish a stable start contract.

Rule:

> **Any circular implementation dependency is broken by CD.**

CD must:

1. identify the cycle;
2. define the authoritative interface/semantic boundary needed to break it;
3. publish the revised plan/interface to CA + ISA;
4. wait for CA plan/interface review;
5. then restart parallel work where possible.

If the cycle cannot be broken without both agents editing the same authority surface or continuously redesigning each other's work:

> CA reclassifies the coupled unit as **CD-owned**.

ISA may then support only with:
- tests;
- fixtures;
- validators;
- reproduction tooling;
- documentation;
- or other non-authoritative artifacts.

Parallelism must not be preserved at the cost of authority ambiguity.

---

# 6. Work Package contract

Every CA-assigned shared task must have a Work Package ID.

Recommended format:

`WP-S<SPRINT>-<NN>`

Each Work Package must define:

```text
work_package_id
dependency_class
owner
consumer
purpose
frozen_baseline
input_contract
output_artifact
allowed_files_or_surfaces
forbidden_authority_changes
dependencies
integration_owner
acceptance_shape
closure_condition
```

For Class B/C also include:

```text
interface_version
interface_owner = CD
interface_freeze_state
interface_checkpoint
change_control
```

---

# 7. Required CD development plan for Class B/C

For dependency-sensitive shared work, CD must author the plan.

Minimum plan:

## 7.1 Goal

What integrated behavior is being built/fixed.

## 7.2 Work breakdown

Which Work Packages belong to:
- CD;
- ISA.

## 7.3 Dependency graph

For each package:

```text
starts_after
needs_contract_from
produces_for
blocks
does_not_block
```

Avoid wall-clock promises unless the user explicitly requests them.

The project does not run autonomous background agents; therefore dependency milestones are more authoritative than estimated hours.

## 7.4 Critical path

CD identifies which packages actually block the integrated handoff.

This allows ISA to continue useful non-critical work without holding the whole Sprint.

## 7.5 Integration point

CD states when/how ISA output will be consumed.

## 7.6 Rollback/fallback

If ISA output is late, incompatible or rejected, CD states whether:
- integration can proceed without it;
- the package returns to CD;
- or the gate remains blocked.

---

# 8. Interface Contract required for Class B/C

The interface is authored by CD and sent unchanged to both CA and ISA.

Minimum interface fields:

```text
interface_id
version
provider
consumer
purpose
inputs
outputs
error_or_absence_semantics
side_effects
authority_owner
persistence_effect
security_boundary
idempotency_expectation_if_relevant
allowed_extension_points
forbidden_changes
integration_test_shape
```

The interface should define what the other lane needs to know, but should not unnecessarily expose internal implementation.

## 8.1 Contract freeze

After CA approval:

`interface_state = FROZEN_FOR_PARALLEL_IMPLEMENTATION`

This does not make the interface eternally immutable.

It means both lanes may rely on it until a controlled change occurs.

## 8.2 Interface change

A change that affects:
- inputs/outputs;
- semantic meaning;
- authority;
- side effects;
- persistence;
- security;
- validity/provenance;
- or consumer assumptions

requires:

`INTERFACE_CHANGE_REQUEST`

from CD to CA + ISA.

CA reviews the changed contract before dependency-sensitive work continues.

Purely internal implementation changes that preserve the frozen contract do not require CA approval.

---

# 9. Time/dependency planning rule

Parallel planning is based on **contract milestones**, not “wait until the other Agent finishes.”

Preferred execution:

```text
T0  CA allocates Work Packages
T1  CD publishes plan + interfaces
T2  CA approves plan/interface
T3  CD + ISA work in parallel
T4  interface checkpoint
T5  ISA support artifact ready
T6  CD integrates
T7  CD developer regression
T8  CD submits integrated baseline
T9  CA audits
```

The key optimization rule is:

> Depend on the smallest frozen contract needed, not on the other Agent's completed implementation.

Example:

Bad:

```text
ISA waits for CD to finish the entire export implementation.
```

Preferred:

```text
CD freezes the export DTO/interface.
ISA builds mapper/tests while CD builds authority/query logic.
```

---

# 10. Partial blocking rule

When ISA needs one unresolved CD decision:

ISA must not mark the whole assignment blocked unless necessary.

ISA sends:

`BLOCKED_NEEDS_CD_DECISION`

with:

```text
context
what_is_already_fixed
decision_needed
affected_work_package
impact_if_wrong
work_that_can_continue_without_answer
```

Only the dependent subpart pauses.

ISA continues all unaffected work.

This rule prevents communication latency from destroying parallelism.

---

# 11. Deadlock rule

If CD waits for ISA and ISA waits for CD:

1. both must identify the exact missing dependency;
2. the cycle is reported to CA;
3. CD defines the authoritative interface/decision that breaks the cycle;
4. CA reviews that boundary;
5. work resumes.

If CD cannot define a stable interface without first consuming ISA's implementation:

CA may reclassify the coupled implementation as CD-owned.

ISA then becomes support-only for that unit.

No unresolved circular dependency may persist as an informal working arrangement.

---

# 12. File and write-conflict rule

Parallel Agents should not simultaneously edit the same high-conflict authority file.

Preferred pattern:

```text
CD-owned authority file
ISA-owned helper/test/artifact
→ CD integration
```

If both tasks require the same file:
- CA identifies one Active Writer for that file/work package;
- normally CD owns central runtime/database integration files;
- ISA supplies a separate helper, patch artifact, test or bounded commit for CD review.

## 12.1 Migration rule

Default V1.0 rule:

> **Only CD may allocate, create, integrate or deploy migration numbers/files.**

ISA may:
- propose SQL snippets as a non-authoritative artifact if explicitly assigned;
- build tests against an approved interface.

ISA may not:
- claim the next migration number;
- deploy a migration;
- independently create a new runtime mutation authority.

GA may relax this in a later rule version if experience shows it is safe.

---

# 13. Commit provenance

Recommended provenance:

```text
ISA support commit
→ ISA_to_CD handoff
→ CD review/integration commit
→ CD_to_CA integrated audit handoff
```

Where practical, ISA and CD changes should remain distinguishable by commit.

CD must identify in the final handoff:
- ISA-authored commits/artifacts consumed;
- CD-owned integration changes;
- deviations from the approved Work Package plan.

CA audits the integrated baseline, not merely the isolated ISA artifact.

---

# 14. Required ISA handoff to CD

ISA reports:

```text
work_package_id
frozen_baseline
interface_version
changed_files
implementation_summary
tests_run
test_results
assumptions
unresolved_questions
authority_or_canonical_changes = NONE / list
status = IMPLEMENTATION_READY_FOR_CD_REVIEW
```

ISA must not use:
- PASS;
- AUDIT_PASS;
- SPRINT_COMPLETE;
- CANONICAL_APPROVED;
- RELEASED.

---

# 15. Required CD integrated handoff to CA

CD remains the sole implementation handoff owner.

CD must report:

```text
approved_work_package_set
plan/interface version
CD changes
ISA changes consumed
integration changes
deviations from approved allocation
tests/evidence
migration state
canonical ownership state
audit baseline commit
```

If CD silently reassigns or absorbs ISA scope without informing CA, CA may open a process finding when the deviation materially affects auditability, authority, or changed-file expectations.

Minor implementation reshuffling that does not alter owner boundaries or authority does not require a finding.

---

# 16. CA audits both roles

CA performs two distinct checks.

## 16.1 Cooperation / scope compliance

CA checks:

- Did CD and ISA follow the approved who-does-what allocation?
- Did ISA cross into architecture/runtime authority/canonical ownership?
- Did CD bypass the approved interface plan in a way that changes dependency assumptions?
- Did both roles stay within file/write boundaries?
- Did migration authority remain with CD?
- Are commit/handoff records sufficient to reconstruct provenance?

This is governance/process evidence.

## 16.2 Independent implementation audit

CA then audits the integrated product baseline independently.

ISA tests and CD tests are treated as **developer evidence**, not independent proof.

CA must still:
- reconstruct actual implementation;
- apply Patterns A–F;
- perform Canonical Ownership Check;
- challenge authority/concurrency/reconnect/security/history boundaries;
- derive its own falsification paths.

CA must not assume correctness merely because:
- the work package followed process;
- the interface was approved;
- ISA tests are green;
- CD integration tests are green.

---

# 17. CA plan/interface approval meaning

`PLAN_INTERFACE_APPROVED` means only:

- ownership is clear;
- dependencies are explicit;
- interface is sufficiently stable for parallel implementation;
- no obvious authority/canonical conflict exists;
- the plan is auditable.

It does **not** mean:
- the implementation will be correct;
- CA endorses the chosen internal mechanism;
- future audit findings are waived;
- the interface itself cannot contain a defect that later audit exposes.

This distinction is mandatory for audit independence.

---

# 18. Canonical ownership

The existing owner-first canonical rule applies unchanged to ISA.

ISA may not modify a protected canonical source merely because an implementation task requires new content.

Required pattern remains:

```text
canonical owner changes/approves
→ owner commit
→ handoff
→ implementation consumes
```

CA plan approval cannot substitute for GA/VA/Teacher canonical ownership.

---

# 19. Suggested statuses

## CA allocation / plan

- `WORK_ALLOCATED`
- `PLAN_INTERFACE_REVIEW_REQUIRED`
- `PLAN_INTERFACE_APPROVED`
- `PLAN_INTERFACE_REJECTED`
- `WORK_REALLOCATED`

## ISA

- `ASSIGNED`
- `IN_PROGRESS`
- `BLOCKED_NEEDS_CD_DECISION`
- `IMPLEMENTATION_READY_FOR_CD_REVIEW`
- `INTEGRATED_BY_CD`

## CD

- `PLAN_READY_FOR_CA_REVIEW`
- `INTERFACE_CHANGE_REQUEST`
- `INTEGRATION_IN_PROGRESS`
- `READY_FOR_CA_AUDIT`

These statuses do not replace CA audit dispositions.

---

# 20. First-task safety rule

If GA activates ISA, the first ISA assignment should preferably be:

- bounded;
- non-migration;
- low authority;
- easy to separate by file;
- independently testable.

A suitable first-task family would be:
- ACT14 staged presentation/UI regression; or
- a test/validator package.

Do not use the first ISA task to test the role on:
- session integrity semantics;
- run lifecycle;
- transaction locking;
- migration authority.

---

# 21. Governance failure modes

CA must watch specifically for:

1. ISA becoming a second CD;
2. CD informally delegating architecture decisions to ISA;
3. CA drifting into implementation design;
4. ISA tests becoming the only proof used by CA;
5. migration number collisions;
6. both roles editing one authority surface concurrently;
7. interface freeze being ignored;
8. interface changes occurring without notification;
9. circular dependency being hidden as “collaboration”;
10. canonical owner bypass;
11. CD final handoff omitting ISA-derived changes;
12. ISA declaring a finding/Sprint closed.

---

# 22. Relationship to existing rules

This draft supplements, and does not supersede:

- `GAL_ESCAPE_CASTLE_CA_CODING_AUDIT_RULES_V1.4.md`;
- highest ACTIVE inter-agent protocol;
- owner-first canonical governance;
- Action Log rules;
- START_HERE / Active Writer rules.

If activated, the inter-agent protocol and onboarding material must be updated to recognize ISA formally.

Until then, ISA is not an active canonical Agent alias.

---

# 23. Activation condition

This V1.0 draft becomes active only after:

1. GA devil check;
2. user acceptance of any material governance change, when needed;
3. protocol/onboarding updates required by GA;
4. explicit activation status change.

Until activation:

`ISA_STATUS = NOT_ACTIVE`

