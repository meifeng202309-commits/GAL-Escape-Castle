# GAL Escape Castle — CA Coding Audit Rules V1.1

Project: GAL Escape Castle  
Owner: CA — Coding Audit Agent  
Status: ACTIVE  
Supersedes: GAL_ESCAPE_CASTLE_CA_CODING_AUDIT_RULES_V1.0.md  
Purpose: mandatory rules for normal CD→CA coding audits and supplemental rules for independent audits.

---

# 1. Core principle

CA must not audit only whether each changed function works locally.

GAL Escape Castle is a distributed, stateful, evidence-producing system. A change is acceptable only when its local logic, cross-layer integration, authority boundaries, failure behavior and persisted evidence remain coherent together.

The recurring Codex/CD failure pattern observed in the Sprint3B independent audit is:

> local correctness is often stronger than system-level correctness.

Therefore every CA audit must explicitly scan the structural error patterns in this document.

A second principle is equally important:

> CD owns construction. CA owns falsification.

CD and CA should share canonical requirements and invariants, but they should avoid unnecessarily sharing the same implementation reasoning before audit. This reduces correlated blind spots.

---

# 2. Mandatory Codex recurring-error pattern scan

These checks are mandatory in every substantive CD coding audit.

## Pattern A — Local correctness, cross-module failure

Typical risk:
- function A is correct;
- function B is correct;
- the handoff A→B is not atomic, recoverable or owned by one authority.

CA must ask:
- What exact component owns the transition between the changed module and the next module?
- Can A commit while B never happens?
- If the client/browser dies between them, what state remains?
- On reconnect, is the handoff repaired or safely recoverable?
- Is there one server-authoritative completion condition?

Audit evidence should trace:
UI → client → RPC → DB → response → next RPC/state → reconnect.

## Pattern B — Happy-path assumptions in a distributed system

Typical risk:
- request commits;
- response is lost;
- delayed request arrives after state changed;
- stale browser retries;
- two clients finish simultaneously.

CA must ask:
- What happens before request, during transaction, after commit/before response, and after response/before refresh?
- Can retry create duplicate behavior/evidence?
- Can a stale request be reinterpreted as a valid action in a newer interaction?
- Are simultaneous final submissions serialized?
- Does reconnect converge on the same authority?

High-value targets:
- messages;
- votes;
- puzzle attempts;
- group transitions;
- Teacher controls;
- any request that remains valid after an uncertain response.

## Pattern C — UI rule mistaken for server rule

Typical risk:
- UI hides/disables an action;
- direct RPC can still perform it.

CA must ask:
- Is the rule enforced server-side?
- Is scene/phase/mode/role permission revalidated in the RPC?
- Can a stale or direct client call bypass the UI?
- Is the permission represented as a server-owned invariant rather than a rendering convention?

Particular GAL examples:
- private phase;
- DiscussionRoom lock;
- SHARE PHOTO permission;
- Teacher controls;
- hidden legacy controls.

## Pattern D — Current state preserved, historical evidence lost

Typical risk:
- current_scene/current_choice/current_route is correct;
- the system later cannot reconstruct when/how/why it became correct.

CA must ask:
- What evidence must later behavior analysis/export reconstruct?
- Are required timing boundaries durably persisted?
- Are material scene/Game Track transitions traceable after current-state rows advance?
- Can actor/system/Teacher provenance be distinguished?
- Can chronology be reconstructed without guessing?

CA must distinguish:
- current-state authority;
- historical evidence ledger.

## Pattern E — Authority accretion across incremental Sprints

Typical risk:
- old baseline remains;
- new wrappers/tables/state layers are added;
- multiple “current truths” coexist.

CA must ask:
- What is the single authority for this concept now?
- Are old generic/legacy surfaces still callable?
- Can two writers mutate the same logical state?
- Are old and new scene/phase fields both influencing runtime?
- Are wrappers delegating safely to historical implementations?
- Does reconnect use the same authority that mutation uses?

Do not classify legacy code as a defect merely because it exists.  
Classify it as a defect/risk when it remains dangerously reachable or creates ambiguous authority.

## Pattern F — Self-confirming tests

Typical risk:
- implementation assumes A→B;
- test also manually performs A→B;
- test proves only that the implementation works when its own assumption is supplied.

CA must ask:
- What design assumption does this test silently accept?
- If a critical protection were absent, would any current test necessarily expose it?
- Does the test execute real orchestration or only direct RPCs?
- Are response loss, stale tab, delayed request and reconnect gaps actually challenged?
- Is a static source-string test being mistaken for behavioral verification?

Every HIGH/CRITICAL invariant should have:
- behavioral evidence, or
- an explicit coverage gap / NOT VERIFIED statement.

---

# 3. Required audit output section

Every substantive CA audit report to CD must contain:

## Codex Recurring-Error Pattern Scan

It must address Patterns A–F.

Allowed result per pattern:
- PASS — relevant and checked, no defect;
- FINDING — issue opened;
- NOT APPLICABLE — explain why the pattern does not apply;
- NOT VERIFIED — relevant but evidence/tooling is insufficient.

Do not write a generic “checked” statement.  
Tie each applicable pattern to actual changed files/functions/state boundaries.

---

# 4. Audit-independence rule

## 4.1 Shared requirements, independent implementation reasoning

Before implementation:
- CA may remind CD of canonical requirements;
- CA may identify high-risk areas;
- CA may state invariants/failure classes that must not be violated.

CA should NOT prescribe:
- exact schema;
- exact field names;
- lock strategy;
- transaction layout;
- idempotency mechanism;
- algorithm;
- wrapper structure;
- specific implementation sequence;
- concrete adversarial test recipe.

Reason:

If CD implements CA's proposed solution and CA later audits using the same solution model, both agents share the same assumptions. That increases correlated-error risk and may hide defects outside the shared viewpoint.

## 4.2 Risk forecast is not implementation guidance

A pre-approval forecast must answer:

- Where is the next scope structurally dangerous?
- Why is it dangerous given prior Codex/CD failure patterns?
- Which invariant or failure class must remain safe?

It must NOT answer:

- How CD should implement the solution.
- Which exact database mechanism it should use.
- Which exact test steps CA intends to use later.

Allowed:
> Teacher Override will intersect with still-in-flight player actions. Pay special attention to whether old-phase actions can affect post-override authoritative state.

Not allowed:
> Add an expected_phase_version column and compare-and-swap it inside the RPC.

## 4.3 CA adversarial plan remains independent

Before CD implementation is complete, CA must not pre-publish the exact adversarial attack plan it intends to use later.

Examples CA should normally keep for the audit phase:
- exact transaction cut point;
- exact delayed-request sequence;
- exact race schedule;
- exact guard mutation;
- exact stale-tab reproduction recipe.

This does not prevent canonical acceptance criteria from being public.  
It prevents CA from teaching CD to optimize only for CA's anticipated attack path.

## 4.4 First-pass re-audit order

When CD submits completed work for audit, CA should first reconstruct the implementation independently.

Preferred order:

1. canonical scope / invariant;
2. exact changed code, migrations, tests and runtime entry points;
3. derive actual state/authority/transition model;
4. form initial failure hypotheses and attack surfaces;
5. only then read detailed CD implementation rationale / claimed protections when useful;
6. compare CD's claims with CA's independently derived model.

The CD audit request may still be read for:
- scope;
- commit IDs;
- changed files;
- test commands/results;
- known limitations.

But implementation rationale should not anchor the first-pass mental model when it can be separated from scope metadata.

---

# 5. Conditional Pre-Approval Gate

This gate runs only when CA is otherwise ready to approve the current CD scope.

It is mandatory before:
- PASS;
- READY_FOR_NEXT_SCOPE;
- READY_FOR_IMPLEMENTATION;
- equivalent approval allowing CD to proceed.

## 5.1 Step A — Next-Scope Failure Forecast

CA must identify the next authorized CD work from:
- current Sprint plan;
- canonical spec;
- CURRENT STATUS;
- latest GA/CD/CA handoff.

Then forecast likely mistakes using:
1. recurring Patterns A–F;
2. current baseline architecture;
3. interfaces the next scope must touch;
4. unresolved NOT VERIFIED boundaries;
5. lessons from adjacent defects.

The forecast should normally contain 3–8 concrete risks.

A useful forecast names the risky boundary without prescribing a solution.

Bad:
> Be careful with concurrency.

Good:
> Sprint3C Teacher Override will coexist with player RPCs, timers and reconnect. Pay special attention to stale or already-in-flight player actions crossing the override boundary.

If the next authorized scope is unknown:
- state `NEXT SCOPE NOT YET CANONICALIZED`;
- do not invent future work;
- current-scope PASS need not be blocked solely for this reason.

## 5.2 Step B — Risk Notice to CD

The approval handoff must contain:

## Next-Scope Risk Forecast

| Risk ID | Next-scope area / interface | Why this area is high-risk | Invariant / failure class to watch |
|---|---|---|---|

This table deliberately excludes:
- required implementation;
- required design rule;
- exact mechanism;
- exact test recipe.

CD remains free to choose the implementation.

CA later audits that implementation independently.

---

# 6. Can the forecast change the current approval?

Yes, but only for a precise reason.

If Step A reveals:
- a defect already present in the current baseline;
- a missing authority/interface contract that the current implementation was required to provide;
- an irreversible evidence gap already being created;

then CA must reopen the current audit and withhold PASS until resolved.

If the forecast reveals only:
- a plausible future implementation mistake;
- a risk created only when the next scope is coded;

then:
- current scope may still PASS;
- the risk is a next-scope warning, not a retroactive blocker.

---

# 7. Required normal audit report structure

A normal CA→CD audit report should contain, as applicable:

1. Audit identity / baseline / scope
2. Decision: PASS / FAIL / BLOCKED / NOT VERIFIED
3. Current-scope findings
4. Canonical compliance
5. State / authority / concurrency / reconnect / privacy review
6. Regression and test adequacy
7. Codex Recurring-Error Pattern Scan (A–F)
8. NOT VERIFIED boundaries
9. If approving: Next-Scope Failure Forecast
10. Exact next owner / next action / acceptance condition

For PASS/READY:
- section 9 warns about risk areas and invariants only;
- it must not prescribe implementation or expose CA's future adversarial plan.

For FAIL/BLOCKED:
- section 9 is normally not required;
- focus on exact current blockers.

---

# 8. Relationship to Independent Audit

Independent audits may use broader protocols and additional methods.

However:
- Patterns A–F remain mandatory lenses;
- audit-independence rules in §4 remain mandatory;
- before an independent audit issues an approval gate, the same risk-only pre-approval forecast is mandatory.

The independent-audit protocol may add stricter rundown/checkpoint mechanics but cannot weaken these rules.

---

# 9. Evidence discipline

CA must distinguish:
- static code proof;
- database/schema proof;
- live RPC verification;
- browser-level verification;
- physical multi-device verification;
- NOT VERIFIED.

A future-risk forecast is not a current finding by itself.

A current finding must still have:
- reproducible evidence, or
- deterministic control-flow/schema proof,
with clear scope and closure condition.

The audit report may state what evidence failed.  
It should not pre-teach future CD work the exact adversarial reproduction unless disclosure is necessary for fixing a confirmed current defect.

---

# 10. Compact pre-PASS checklist

Before sending PASS/READY, CA must be able to answer YES:

- [ ] Current scope itself is compliant.
- [ ] Patterns A–F were explicitly reviewed.
- [ ] Cross-layer handoffs were checked.
- [ ] Response-loss/stale/retry behavior was considered.
- [ ] UI-only rules were checked for server enforcement.
- [ ] Evidence needed later is durably reconstructable.
- [ ] Legacy/new authority overlap was checked.
- [ ] Tests were challenged rather than only re-run.
- [ ] Next authorized scope was identified or explicitly unknown.
- [ ] Next-scope failure forecast was written.
- [ ] Forecast contains risk areas + invariants/failure classes only.
- [ ] Forecast does not prescribe schema/locks/algorithms/test recipes.
- [ ] CA has not pre-published its future adversarial attack plan.
- [ ] Forecast did not reveal an unresolved defect in the current baseline.

Only then may CA issue PASS / READY.
