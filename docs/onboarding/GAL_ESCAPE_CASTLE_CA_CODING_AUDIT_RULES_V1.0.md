# GAL Escape Castle — CA Coding Audit Rules V1.0

Project: GAL Escape Castle  
Owner: CA — Coding Audit Agent  
Status: ACTIVE  
Purpose: mandatory rules for normal CD→CA coding audits and supplemental rules for independent audits.

---

# 1. Core principle

CA must not audit only whether each changed function works locally.

GAL Escape Castle is a distributed, stateful, evidence-producing system. A change is acceptable only when its local logic, cross-layer integration, authority boundaries, failure behavior and persisted evidence remain coherent together.

The recurring Codex/CD failure pattern observed in the Sprint3B independent audit is:

> local correctness is often stronger than system-level correctness.

Therefore every CA audit must explicitly scan the structural error patterns in this document.

---

# 2. Mandatory Codex recurring-error pattern scan

These checks are mandatory in every substantive CD coding audit.  
They are not optional “extra ideas”; they are a required audit lens.

## Pattern A — Local correctness, cross-module failure

Typical risk:
- function A is correct;
- function B is correct;
- the handoff A→B is not atomic, recoverable or owned by one authority.

CA must ask:
- What exact component owns the transition between the changed module and the next module?
- Can A commit while B never happens?
- If the client/browser dies between them, what state remains?
- On reconnect, is the handoff repaired idempotently?
- Is there a single server-authoritative completion condition?

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
- Is retry idempotent?
- Does the request carry the interaction identity it was created for?
- Can a stale request be reinterpreted as a valid action in a newer state?
- Are simultaneous final submissions serialized?

High-value targets:
- messages;
- votes;
- puzzle attempts;
- group transitions;
- Teacher controls;
- any request that remains valid after a failed/uncertain response.

## Pattern C — UI rule mistaken for server rule

Typical risk:
- UI hides/disables an action;
- direct RPC can still perform it.

CA must ask:
- Is the rule enforced server-side?
- Is scene/phase/mode/role permission revalidated in the RPC?
- Can a stale or malicious client call the RPC directly?
- Is the permission represented as a server-owned invariant rather than a rendering convention?

Particular GAL examples:
- private phase;
- DiscussionRoom lock;
- SHARE PHOTO permission;
- Teacher safe controls;
- hidden legacy controls.

## Pattern D — Current state preserved, historical evidence lost

Typical risk:
- current_scene/current_choice/current_route is correct;
- the system later cannot reconstruct when/how/why it became correct.

CA must ask:
- What evidence must later behavior analysis/export reconstruct?
- Is the start timestamp as well as submission timestamp persisted?
- Are material scene/Game Track transitions append-only logged?
- Can actor/system/Teacher provenance be distinguished?
- After current-state rows are overwritten, can the prior chronology still be reconstructed without guessing?

CA must distinguish:
- current-state authority;
- historical evidence ledger.

Both may be necessary.

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
- If the critical guard/handoff were removed, which test must fail?
- Does the test execute the real browser orchestration or only direct RPCs?
- Are response loss, stale tab, delayed request and reconnect gaps tested?
- Is a static source-string test being mistaken for behavioral verification?

Every HIGH/CRITICAL invariant should have:
- a behavioral test, or
- an explicit coverage gap / NOT VERIFIED statement.

---

# 3. Required audit output section

Every substantive CA audit report to CD must contain a section:

## Codex Recurring-Error Pattern Scan

It must address Patterns A–F.

Allowed result per pattern:
- PASS — relevant and checked, no defect;
- FINDING — issue opened;
- NOT APPLICABLE — explain why the pattern does not apply to this scope;
- NOT VERIFIED — relevant but evidence/tooling is insufficient.

Do not write a generic “checked” statement.  
Tie each applicable pattern to actual changed files/functions/state boundaries.

---

# 4. Conditional Pre-Approval Gate

This gate runs **only when CA is otherwise ready to approve the current CD scope**.

It is mandatory before:
- PASS;
- READY_FOR_NEXT_SCOPE;
- READY_FOR_IMPLEMENTATION;
- equivalent approval allowing CD to proceed.

It has two required steps.

## 4.1 Step A — Next-Scope Failure Forecast

CA must identify the next authorized CD work from:
- current Sprint plan;
- canonical spec;
- CURRENT STATUS;
- latest GA/CD/CA handoff.

Then forecast likely mistakes using:
1. the six recurring Codex patterns in §2;
2. the current baseline architecture;
3. interfaces the next scope must touch;
4. unresolved NOT VERIFIED boundaries;
5. lessons from defects already found in adjacent code.

The forecast must be specific to the next task.

Bad:
> Be careful with concurrency.

Good:
> Sprint3C Teacher Override will mutate the same formal scene/run state that player RPCs and timers use. Re-check stale player RPC quiescence after override, row-lock ordering, exactly-once override event creation, and reconnect from the overridden phase.

The forecast should normally contain 3–8 concrete risks.

If the next authorized scope is genuinely unknown:
- state `NEXT SCOPE NOT YET CANONICALIZED`;
- do not invent future work;
- include only known interface risks;
- current-scope PASS need not be blocked solely for this reason.

## 4.2 Step B — Next-Scope Prevention Guidance to CD

The audit handoff to CD must include a section:

## Next-Scope Risk Forecast and Required Precautions

For each forecast risk include:

| Risk ID | Next-scope operation | Why Codex is likely to fail here | Required precaution / design rule | Required test/evidence |
|---|---|---|---|---|

Guidance must be actionable before coding starts.

Examples of acceptable precautions:
- keep one authoritative server transition;
- add request interaction identity;
- add idempotency key;
- persist decision start timestamp;
- append event before/with mutable state change;
- reject direct RPC outside scene permission;
- explicitly isolate legacy/generic control;
- add fault-injection or stale-request test.

---

# 5. Can the forecast change the current approval?

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
- the risk becomes explicit next-scope guidance, not a retroactive blocker.

This prevents both under-auditing and speculative process inflation.

---

# 6. Required normal audit report structure

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
10. If approving: Next-Scope Risk Forecast and Required Precautions
11. Exact next owner / next action / acceptance condition

For FAIL/BLOCKED reports:
- sections 9–10 are normally not required;
- focus first on exact current blockers.

---

# 7. Relationship to Independent Audit

Independent audits may use broader protocols and additional methods.

However:
- Patterns A–F remain mandatory lenses;
- before an independent audit issues an approval gate, the same two-step pre-approval forecast is mandatory.

The independent-audit protocol may add stricter rundown/checkpoint mechanics but cannot omit these rules.

---

# 8. Evidence discipline

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

---

# 9. Compact pre-PASS checklist

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
- [ ] CD received concrete precautions/tests for the next scope.
- [ ] Forecast did not reveal an unresolved defect in the current baseline.

Only then may CA issue PASS / READY.
