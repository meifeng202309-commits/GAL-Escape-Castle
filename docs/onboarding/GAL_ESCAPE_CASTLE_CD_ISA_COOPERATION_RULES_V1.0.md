# GAL Escape Castle — CD / ISA Cooperation Rules V1.0

Project: GAL Escape Castle  
Governance owner: GA; operational allocation/audit owner: CA — Coding Audit Agent  
Status: **ACTIVE**  
Supersedes for operational use: `GAL_ESCAPE_CASTLE_CD_ISA_COOPERATION_RULES_V1.0_DRAFT.md` and `GAL_ESCAPE_CASTLE_CD_ISA_COOPERATION_RULES_V1.0_DRAFT_R2.md`

This active version incorporates GA's 2026-09-25 devil-check disposition, CA's second critical review, and GA's final `READY_FOR_ACTIVATION_GOVERNANCE` disposition.

> ISA is an active project role under this cooperation contract, Inter-Agent Talk Protocol V2, the current onboarding guide, and Agent Action Log Rules V1.1.

---

# 1. Governing model

> **CA allocates ownership envelopes and audits adherence.**  
> **CD owns architecture, runtime authority, database semantics and final integration.**  
> **ISA owns bounded mechanical/support implementation inside an approved semantic contract.**  
> **CA remains independently adversarial and does not design the internal implementation.**

ISA authorship may explain provenance, but it never splits final product implementation accountability:

> **CD remains accountable for every ISA artifact integrated into the audit baseline.**

---

# 2. CA allocates ownership envelopes, not implementation design

CA may decide:

- dependency class;
- CD / ISA ownership envelope;
- allowed file/surface envelope;
- authority boundary;
- expected artifact class;
- integration owner;
- closure/handoff shape.

CA must not decide for CD/ISA:

- algorithm;
- schema shape;
- helper decomposition;
- SQL layout;
- transaction mechanism;
- locking mechanism;
- implementation sequence;
- internal code structure.

CA may identify invariants and failure classes, but must not prescribe the internal solution.

---

# 3. CD architecture ownership and ALLOCATION_CONFLICT

CD retains final technical ownership of architecture and runtime authority.

If CA's proposed split is technically unsafe or inseparable, CD may return:

`ALLOCATION_CONFLICT`

It must state a concrete reason involving, for example:

- split mutation authority;
- circular dependency;
- shared transaction boundary;
- inseparable persistence semantics;
- shared central runtime writer;
- security/lifecycle coupling.

Preference or convenience alone is insufficient.

CA may then:
- keep the allocation if the conflict is unsupported;
- narrow it;
- or reclassify it.

## 3.1 Safety-biased dispute rule

If a technically substantive CA/CD disagreement about separability remains after one documented exchange:

> **the coupled implementation defaults to CD-owned and ISA becomes support-only for that unit.**

CA must not force technical parallelism across an unresolved authority boundary merely to preserve schedule.

This rule protects CD architecture ownership while preserving CA visibility.

---

# 4. ISA Semantic Impact Test

ISA may make a local implementation decision without escalation only if it is:

- reversible;
- local;
- inside a frozen contract;
- non-authoritative;
- and does not change semantic meaning.

Any decision affecting the following belongs to CD or the relevant canonical owner:

1. gameplay/behavior semantics;
2. server-authoritative state;
3. mutation writer/RPC authority;
4. database schema/persistence meaning;
5. transaction/locking/idempotency semantics;
6. validity/provenance meaning;
7. security/auth boundary;
8. public input/output meaning;
9. run/session lifecycle;
10. canonical content/visual/localization meaning;
11. which fields are export-safe, behavior evidence, sensitive, required or not-applicable.

Therefore apparently “mechanical” work is ISA-safe only after semantics are frozen.

Examples:

- DTO mapping: ISA may implement only after CD/canonical contract fixes the field set and meaning.
- CSV allowlist: ISA may implement only after the allowed semantic field set is frozen.
- UI: ISA may own presentation only when reveal timing, mutation behavior, authority and interaction semantics are already fixed.
- validators: ISA may implement checks but may not invent the canonical condition they validate.

---

# 5. Dependency classes

CA classifies each shared unit into exactly one class.

## Class A — independent

No unfinished output from the other developer is required.

Workflow:

```text
CA compact allocation
→ CD / ISA start in parallel
→ deliver artifacts
→ CD integrates if needed
→ CD submits integrated baseline
→ CA audits
```

No separate plan/interface approval is required.

## Class B — contract-dependent parallel work

The lanes can proceed in parallel after a stable contract exists.

Workflow:

```text
CA allocates ownership envelopes
→ CD authors black-box development plan + interface contract
→ same plan/interface sent to CA and ISA
→ CA governance review
→ PLAN_INTERFACE_APPROVED
→ parallel CD / ISA work
→ material interface checkpoint if needed
→ ISA handoff
→ CD integration
→ CD integrated handoff
→ CA audit
```

## Class C — circular/highly coupled

CD must break the cycle by defining an authoritative interface/ownership boundary.

If the same Class C unit returns to circular dependency after **one controlled interface revision**:

> CA should normally reclassify the coupled implementation as CD-owned.

ISA then becomes support-only for that unit unless genuinely new evidence shows a stable separable contract.

---

# 6. Minimum-necessary plan disclosure to CA

To preserve audit independence, the development plan sent to CA must be a **black-box governance/dependency plan**, not an internal solution narrative.

It should contain:

- work packages;
- owner/consumer;
- dependency graph;
- critical path;
- interface contracts;
- authority owner;
- integration point;
- fallback/reallocation path.

It should **not** include internal implementation reasoning that is unnecessary to establish the interface, such as:

- exact lock sequence;
- exact SQL strategy;
- internal helper layout;
- detailed algorithm choice;
- CA-targeted adversarial defense recipe.

The same plan/interface is sent to CA and ISA.

ISA should not need CD's private internal implementation reasoning; it needs only the frozen contract required by its lane.

This reduces correlated CA/CD blind spots.

---

# 7. CA plan/interface review is governance-only

CA may review only:

- ownership clarity;
- authority separation;
- dependency stability;
- canonical compliance;
- auditability;
- obvious lifecycle/security/provenance conflict;
- whether consumer assumptions are explicit.

CA may not reject a plan merely because it prefers another:

- algorithm;
- schema;
- helper structure;
- transaction implementation;
- internal decomposition

when the proposed plan satisfies the governing invariants.

`PLAN_INTERFACE_APPROVED` means only:

- parallel work is governable;
- ownership is clear;
- the interface is sufficiently stable;
- no obvious governance/canonical conflict blocks execution.

It is **not** a technical design endorsement and does not waive later audit findings.

---

# 8. Interface contract

For Class B/C the CD-owned contract must define, where relevant:

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
idempotency_expectation
allowed_extension_points
forbidden_changes
integration_test_shape
```

After CA governance approval:

`interface_state = FROZEN_FOR_PARALLEL_IMPLEMENTATION`

Only a **material** change requires renewed CA review.

Material means change to:

- authority;
- public input/output;
- semantic meaning;
- persistence;
- security;
- provenance/validity;
- consumer assumptions.

No renewed CA approval is required for:

- internal refactor preserving contract;
- helper decomposition;
- local naming;
- test organization;
- implementation inside pre-approved extension points;
- non-breaking details already allowed by the contract.

---

# 9. Standing ownership envelopes — anti-bottleneck rule

For repetitive low-authority work, CA should allocate a **standing ownership envelope** rather than approving every micro-task.

Example:

```text
Sprint9 ISA envelope:
- isolated asset path/hash validators;
- anchor verification tooling;
- loading/fallback regression harnesses;
- non-runtime screenshot/log tooling.
```

Within a standing envelope:

- CD may instantiate concrete ISA sub-tasks without a new CA allocation round;
- CD records the sub-task and boundary in the normal handoff/log;
- ISA may execute immediately;
- any task crossing the envelope requires CA reallocation.

This preserves CA's who-does-what authority without turning CA into a daily dispatcher.

---

# 10. Dependency planning

Planning is milestone/contract based, not wall-clock based.

Preferred sequence:

```text
T0 CA allocates envelope
T1 CD publishes dependency plan/interface
T2 CA governance approval
T3 CD + ISA parallel implementation
T4 material interface checkpoint only if necessary
T5 ISA artifact ready
T6 CD integration
T7 integrated developer regression
T8 CD audit handoff
T9 CA independent audit
```

Core rule:

> Depend on the smallest frozen contract required, not on the other Agent's completed implementation.

No duplicate user/Teacher approval is required for procedural steps already authorized by this workflow.

---

# 11. Partial blocking

When ISA needs one unresolved CD decision, ISA sends:

`BLOCKED_NEEDS_CD_DECISION`

with:

```text
context
what_is_fixed
decision_needed
affected_work_package
impact_if_wrong
work_that_can_continue
```

Only the dependent subpart pauses.

Unaffected ISA work continues.

---

# 12. Circular dependency and deadlock

If CD waits for ISA while ISA waits for CD:

1. identify the exact missing dependency;
2. report the cycle;
3. CD defines the authoritative interface/decision;
4. CA reviews only the new boundary;
5. work resumes.

After one failed controlled interface revision, default to CD-owned coupled implementation unless new evidence justifies separation.

---

# 13. Migration rule — V1.0 hard boundary

Only CD may:

- allocate migration numbers;
- create deployable migration files;
- integrate migrations;
- deploy migrations;
- define new persistence semantics.

ISA may produce only explicitly assigned non-authoritative:

- tests;
- fixtures;
- SQL sketches/snippets;
- migration-adjacent validators.

ISA may never reserve or deploy a migration in V1.0.

---

# 14. File/write ownership and direct commits

## 14.1 Direct-to-main permitted only for isolated low-authority artifacts

ISA may commit directly only when CA/CD allocation explicitly identifies the files as ISA-owned and they are not production-runtime-authoritative.

Examples:

- isolated tests;
- fixtures;
- non-runtime validators/tooling;
- documentation;
- screenshot/log/reproduction artifacts.

A test file is **not automatically low-authority** if:
- it is shared/high-conflict;
- it changes CI/release gating semantics;
- CD is simultaneously editing it;
- it imports/executes production mutation behavior in a way that changes runtime artifacts.

## 14.2 Runtime-affecting ISA work

Preferred:
- ISA branch / isolated commit stream for CD review; or
- clearly non-active helper/module later wired by CD.

If branches are unavailable, the ISA artifact must remain non-active until a distinct CD integration change makes it runtime-active.

ISA must not directly activate on main:

- migrations;
- central runtime authority writers;
- mutation RPCs;
- canonical sources;
- deployment/release changes;
- asset activation/publishing authority.

## 14.3 Single-writer surface

For every shared/high-conflict file or surface, only one developer role may be Active Writer for the current Work Package.

Normally central runtime/database integration files are CD-owned.

---

# 15. Commit and baseline provenance

Preferred sequence:

```text
ISA isolated/support commit
→ ISA_to_CD handoff
→ CD review/integration
→ CD integrated audit-baseline commit
→ CD_to_CA handoff
```

CD must identify:

- ISA commits/artifacts consumed;
- CD integration changes;
- deviations from allocation;
- final frozen audit baseline.

CA audits the frozen integrated baseline SHA.

Later writes do not alter that frozen audit baseline.

---

# 16. Accountability

## 16.1 Product defect after integration

If CA finds an integrated product defect:

> **CD is the implementation remediation owner.**

CD may fix it directly or request CA to allocate a support sub-task to ISA.

The finding is not bounced between CD and ISA.

## 16.2 ISA process/authority violation

If ISA independently crosses a prohibited boundary before integration, CA may record a separate process/governance violation against the ISA work stream.

If CD later integrates that unauthorized change, CD additionally owns the product/integration remediation.

Thus:

> ISA provenance explains who crossed the boundary; CD remains accountable for what enters the integrated product baseline.

---

# 17. CA audits both roles — two layers

## 17.1 Cooperation/scope compliance

CA checks:

- allocation adherence;
- interface/version adherence;
- authority boundaries;
- canonical ownership;
- migration boundary;
- file/single-writer boundary;
- provenance of ISA artifacts integrated by CD.

## 17.2 Independent product audit

CA then independently reconstructs and audits the integrated baseline.

Developer tests from CD or ISA are supporting evidence only.

CA still applies:
- Patterns A–F;
- Canonical Ownership Check;
- concurrency/reconnect/security/history challenge;
- independent falsification.

---

# 18. CA governance self-review

CA's own prior allocation/interface approval has **zero evidentiary weight** in the later product audit.

If a later defect appears to arise from the ownership/interface boundary that CA previously approved, CA must not suppress or downgrade it.

CA must record:

`GOVERNANCE_SELF_REVIEW_REQUIRED`

and:

- describe the defect normally;
- identify the prior CA-approved boundary involved;
- route any required cooperation-rule correction to GA;
- avoid assigning blame to CD/ISA for following a defective governance boundary unless they independently violated known invariants.

This is the conflict-of-interest safeguard for CA's dual allocator/auditor role.

---

# 19. ISA handoff status vocabulary

Allowed ISA statuses:

- `ASSIGNED`
- `IN_PROGRESS`
- `BLOCKED_NEEDS_CD_DECISION`
- `IMPLEMENTATION_READY_FOR_CD_REVIEW`
- `INTEGRATED_BY_CD`

ISA must not claim:

- `PASS`
- `AUDIT_PASS`
- `CANONICAL_APPROVED`
- `SPRINT_COMPLETE`
- `RELEASED`

---

# 20. Required CD integrated handoff

CD remains the sole implementation handoff owner to CA.

CD reports:

```text
approved_work_package_set / ownership envelope
plan/interface version
CD changes
ISA changes consumed
integration changes
allocation deviations
tests/evidence
migration state
canonical ownership state
audit baseline SHA
```

Minor reshuffling inside the approved envelope does not require CA reapproval.

Material ownership/authority changes do.

---

# 21. Sprint9/10 role-specific limits

## Sprint9 ISA-safe families

Only inside approved envelopes:

- asset path/hash/checksum validation;
- anchor verification tooling;
- loading/fallback tests;
- non-authoritative wiring helpers;
- visual regression tooling;
- performance/log instrumentation.

ISA may not independently:

- change canonical asset identity;
- change/publish `active_version`;
- reinterpret Castle Visual;
- publish/deploy runtime assets;
- create a competing asset lifecycle.

## Sprint10 ISA-safe families

- E2E harnesses;
- reconnect/concurrency tooling;
- reproduction automation;
- performance/log collection;
- regression matrix execution.

ISA may not:

- decide release readiness;
- close findings;
- redefine acceptance criteria;
- change security/runtime authority merely to make tests pass.

---

# 22. First-task safety rule

First ISA assignment should be:

- bounded;
- low-authority;
- non-migration;
- file-separable;
- independently testable.

Preferred:
- ACT14 presentation layer; or
- isolated test/validator package.

Avoid first-task ownership of:
- session-integrity semantics;
- lifecycle;
- locking;
- migration authority.

---

# 23. Required governance updates before activation

Before first ISA assignment:

1. create `agent-comms/inter_agent_talk_protocol V2.md`;
2. add ISA alias/responsibility and ISA to ALL;
3. update `START_HERE.md`;
4. update New Member Guide;
5. issue next Action Log Rules version including ISA;
6. create `docs/logs/ISA_ACTION_LOG.csv`;
7. add ISA checkpoint/status to CURRENT STATUS only on activation.

Current V1 inter-agent protocol cannot carry ISA safely.

---

# 24. Activation / ongoing authority rule

Activation prerequisites have been completed through the project governance update that introduced:
- Inter-Agent Talk Protocol V2;
- ISA onboarding/minimum reading;
- Agent Action Log Rules V1.1;
- `docs/logs/ISA_ACTION_LOG.csv`;
- CURRENT STATUS ISA tracking.

Current operational state:

`ISA_STATUS = ACTIVE`

User approval is required only if a future change introduces a genuinely new unresolved product/governance choice not already delegated to project roles.

Procedural steps already authorized by this cooperation model do not require duplicate user/Teacher approval.

