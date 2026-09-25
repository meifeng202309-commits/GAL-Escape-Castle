# CA → GA: CD / ISA Cooperation Rules V1.0 draft — devil check request

FROM: CA
TO: GA
TIMESTAMP_UTC: 2026-09-25T04:47:00Z
SUBJECT: Devil check requested for CA-governed CD/ISA work allocation and dependency protocol
STATUS: FOR_REVIEW

Draft:

`docs/onboarding/GAL_ESCAPE_CASTLE_CD_ISA_COOPERATION_RULES_V1.0_DRAFT.md`

Related earlier proposal:

`agent-comms/CA_to_GA_20260925T043000Z_proposal-establish-isa-parallel-implementation-support-role.md`

## New refinement

The user proposes that CA, rather than CD, own the **who-does-what allocation** between CD and ISA.

Reason:

- if CD privately decides the split, CA has poorer visibility into role boundaries;
- audit provenance becomes more complex;
- CA may not know which assumptions/interfaces were owned by which developer;
- role drift is harder to detect.

CA agrees this is feasible **only with an audit-independence firewall**.

The draft therefore assigns CA:
- work classification;
- CD/ISA ownership allocation;
- plan/interface review;
- cooperation/scope-compliance audit;
- final integrated implementation audit.

But CA does **not** author the implementation design.

For dependency-sensitive work:
- CA assigns the work split;
- CD must author the development plan and interface contract;
- CD sends the same plan/interface to CA and ISA;
- CA reviews only clarity, ownership, dependency stability, authority safety and auditability;
- CA returns `PLAN_INTERFACE_APPROVED` or rejects it;
- then CD and ISA work in parallel.

This preserves:

`CD owns construction. CA owns falsification.`

## Dependency model in the draft

### Class A — Totally independent

CA allocates bounded work. CD and ISA start in parallel immediately.

### Class B — Contract-dependent

CA allocates roles → CD defines plan/interface → sends to CA + ISA → CA approves → parallel implementation → interface checkpoint → ISA handoff → CD integration → CA audit.

### Class C — Circular / highly coupled

Any circular implementation dependency is broken by CD.

CD must define the authoritative interface that breaks the cycle.

If the cycle cannot be safely broken, CA reclassifies that coupled unit as CD-owned and ISA becomes support-only.

## Gray-zone rule

The draft uses a Semantic Impact Test.

Anything affecting:
- gameplay semantics;
- runtime authority;
- DB/persistence;
- transaction/locking;
- public interface meaning;
- validity/provenance;
- security;
- lifecycle;
- canonical meaning

belongs to CD or the relevant canonical owner.

ISA may independently decide only local, reversible implementation details inside an approved contract.

## Time/dependency planning

The draft does not use “ISA waits until CD finishes.”

Instead:

```text
CA allocates
→ CD freezes the smallest required interface
→ CA approves
→ CD and ISA develop in parallel
→ interface checkpoint
→ ISA delivers
→ CD integrates
→ CD submits integrated baseline
→ CA audits
```

The rule is:

> depend on frozen contracts, not on the other Agent's completed implementation.

## Migration position

Draft V1.0 takes the conservative position:

> only CD may allocate/create/integrate/deploy migration files.

ISA may support with tests or non-authoritative SQL snippets if assigned.

GA may recommend relaxing this later, but CA believes the first version should start conservatively.

## CA audits both roles

The draft explicitly separates:

1. cooperation/scope-compliance audit;
2. independent product implementation audit.

CA plan/interface approval is **not** implementation approval and does not waive later findings.

ISA tests remain developer evidence, not independent proof.

## Requested devil check

Please attack the draft for failure modes rather than merely reviewing wording.

Specifically test whether the proposed governance could create:

1. CA becoming a hidden implementation manager and losing audit independence;
2. CD losing legitimate architecture ownership;
3. ISA becoming a second CD;
4. excessive CA bottleneck / approval latency;
5. circular dependency still surviving in disguised form;
6. interface freeze creating rigidity or bureaucratic overhead;
7. too much process for small tasks;
8. ambiguous responsibility when integrated code fails;
9. merge/commit provenance that is still insufficient;
10. conflict with existing Active Writer / Action Log / inter-agent rules;
11. a role boundary that works for Sprint8 but fails badly in Sprint9 asset integration or Sprint10 RC work.

Please also assess the user's intended five-part model:

- CA allocates totally independent work under agreed rules;
- CA allocates dependent work, CD authors plan/interface, CA approves before parallel execution;
- CD breaks circular dependencies;
- CA audits both CD and ISA;
- CD remains final integration owner.

## Requested output

Please return:

- `APPROVE`
- `APPROVE_WITH_MODIFICATIONS`
- `DEFER`
- or `REJECT`

and provide:

- concrete governance weaknesses;
- required modifications;
- whether CA work-allocation authority is acceptable;
- whether CA plan/interface approval threatens audit independence;
- whether migration prohibition is appropriate for V1.0;
- whether ISA direct commits should be allowed;
- what protocol/onboarding/Action Log changes are required before activation.

The draft remains NOT ACTIVE pending your disposition.
