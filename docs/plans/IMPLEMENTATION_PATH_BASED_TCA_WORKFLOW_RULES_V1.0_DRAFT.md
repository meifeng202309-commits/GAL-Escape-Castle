# GAL Escape Castle — Implementation-Path-Based TCA Workflow Rules V1.0
**Status: DRAFT_FOR_CA_TCA_REVIEW — NOT ACTIVE**  
**Owner:** GA (proposal); CA independent technical review; TCA practitioner review  
**Branch:** remediation/sprint9-structural-v1  
**Applies to:** preparatory engineering-path study and optional TCA isolated prebuilt Packs while CD is frozen.  
**Supersedes:** none. Complements, and does not override, ACTIVE role, communication, canonical authority, Action Log, CA audit rules, Debug Implementation Plan V4, or the already accepted bounded three-pass TCA pilot agreement.  
**Teacher directive:** develop candidate implementation paths around authentic CD next-work checkpoints, request CA/TCA critique, and finalize only if material disputes resolved.

## 1. Objectives and exclusions
Minimize **remaining end-to-end implementation + integration + regression + maintenance cost**, not TCA output volume. Avoid prebuilding trivial duplicate helpers, speculative interfaces, extra RPCs or new authorities. Produce only testable, individually discardable Packs that future CD can choose to reuse. This workflow **does not** resume CD, release B-min/W03, authorize production runtime edits, or change code, schema, deployment, canonical gameplay or approval rights.

## 2. Confirmed starting boundary
Before each path study, GA pins exact branch, implementation commit/blob hashes, current audit gate and CD resume checkpoint. At adoption proposal time: CD checkpoint `docs/plans/CD_RESUME_CHECKPOINT_20261010_A1_CA176.md` identifies code/test checkpoint `c4bdd2e96259d94ba543720c7d7d71c0d445b559`, A1 tests/source corrected, no deployment, CD FROZEN. The current code and docs must be refreshed prior to any later assignment. V4 package sequencing, CA releases and more recent handoffs take precedence over examples in this proposal.

## 3. Integration Checkpoints (ICs), not just headings
A V4 package A/B/C/D/E/F start/end is a **candidate**, not automatically a valid checkpoint. An IC is accepted only when the study identifies:
- entry contract: data shapes, producer/authority, preconditions, provenance, read/write permissions, existing durable state;
- exit contract: observable behavior/outputs, mutation and idempotency, concurrency/reconnect/error semantics, owner of resulting state;
- invariants: gameplay privacy, no forged player actions, run identity, server authority, canonical localization, data validity and any package-specific requirements;
- tests: positive/negative examples, executable or clearly NOT_RUN, including compatibility with preceding/following packages;
- credible stable existing consumer/callsite and an approved unmet acceptance requirement;
- unresolved dependencies with owner and STOP conditions.
Different internal routes may meet the same IC contract. Visual equivalence alone does not prove semantic equivalence.

## 4. GA source investigation and route alternatives
Start at CD's *next actually authorized or planned* V4 package boundary; do not skip dependencies or assume execution release. Use minimum relevant source neighborhood: actual callsite/consumer, direct callers/callees, current tests, effective source contracts, and applicable V4 acceptance clauses. Record **VERIFIED** (read from source/test), **INFERRED** (reasoned, falsifiable) or **PROPOSED** (decision needed); include path/blob SHA and lines/symbols. Never certify effective SQL/RPC authority without independent CA verification.
For each valid IC propose up to 2–3 materially distinct feasible routes (e.g., reuse in-place, bounded refactor, independent module) only if genuinely possible; single-route conclusion is permitted. Distinguish required invariants from optional implementation detail. Reject infeasible routes early, with evidence.
Compare: correctness/authority, dependencies, remaining CD labor (qualitative ranges), TCA prebuild ability, integration/test/rework cost, net shipped complexity/modules/RPCs, regressions/maintenance, reversibility and source-drift sensitivity. **Do not score TCA output size as a benefit.** Present preferred path, reasonable alternative, falsification evidence, conditions for switching.

## 5. Two-stage publication / approval
**Feasibility Study DRAFT:** one focused GA report per IC (or combine tightly coupled ICs), including baseline, necessary unmet behavior, interfaces, route analysis, explicit uncertainties, test plan, ownership and proposed TCA cut points. Send to CA for technical adversarial review; TCA may review feasibility of isolation and integration as practitioner, but not self-approve coding. Avoid serializing every minor observation into separate reports.
**Approved Implementation Baseline:** only after CA confirms source/authority/test correctness, GA closes any gameplay/acceptance ambiguity in its owner domain, and the authorized project governance accepts the plan. Label the accepted parts (IC interfaces, invariants, package sequencing, contract/tests); nonbinding illustrative algorithm details remain advisory. A discussion proposal is never an ACTIVE release. Store approved baseline under docs/plans with audit/handoff refs and explicit scope; affected CD must read it when the normal authorized resume occurs. No silent change to existing V4 engineering/canonical contracts; any contradiction requires the appropriate owner-first canonical change and review.

## 6. CD future adoption and deviation
After legitimate resumption, CD first inspects freshest repository, audit gate and approved Implementation Baseline. It **defaults** to the accepted route and considers ready TCA Packs but is not obliged to paste them. CD alone owns INTEGRATE/ADAPT/DISCARD, its implementation and test/fix/retest. Before materially deviating from locked IC contracts or approved package architecture, CD submits concise evidence to CA (and GA only for changed gameplay acceptance): reason, source incompatibility, remaining-cost/complexity/reliability comparison, affected contracts/tests and rollback. Material safety/security/data-authority defect requires immediate STOP irrespective of cost. Equivalent internal algorithm choice within contracts needs no new approval.
Compare **forward-looking remaining cost, risk and reusability**; sunk GA/CA/TCA hours do not justify inefficient future decisions. Previously validated Pack assets count only through **still-usable** savings versus adaptation/discard cost. CA independently assesses deviation within normal gate; ownership changes/canonical decisions require their existing approved channels.

## 7. TCA block selection *after* preferred-route review
Prioritize pieces reusable across multiple valid routes, then preferred-route-specific pieces. Select only S-grade units with:
1. approved unmet acceptance and actual proposed consumer;
2. stable entry/exit contract, target SHA, exact insertion/callsite, bounded effects, no protected authority;
3. source evidence that equivalent accepted functionality is absent or meaningful consolidation/new capability is delivered;
4. deletion/falsification: “If new code is removed, what approved test/behavior fails or demonstrated maintenance burden returns?”;
5. isolated deterministic tests incl. negatives; minimal patch; reversible integration; quick DISCARD for drift/duplication/low net value;
6. production footprint and qualitative expected future CD savings net of integration + testing.
Do not make the developer's *preferred* route a source of fabricated consumer. If only one or zero S-grade tasks exist, publish evidence and STOP; never fill quota.
TCA works on isolated branch/files only, without altering frozen CD files, protected owner docs, SQL/RPC/grants or deployment. Accepted candidate contracts are issued as coherent batches when useful (e.g., two), but each block is independently discardable.

## 8. Preserve agreed GA/TCA/CA three-pass separation
**GA Pass 1** — owns necessity, approved WHY/WHAT, breadth/difficulty, source-grounded probable benefit, route/IC proposal and S/R/X candidate decision. GA may not predetermine undocumented backend signatures.
**TCA Pass 2** — before coding reads pinned target, actual consumer, nearby reused/analogous functions and focused tests; distinguishes REUSED_NOW / ADAPTED_COPY / CONSIDERED_NOT_USED / PLANNED_NOT_INTEGRATED; STOP on absent consumer, equivalent existing capability, protected crossing, material contract mismatch or scope expansion; WARN and target-check minor drift, size or nonessential mismatch. Record in existing PACK_MANIFEST, not new bureaucracy.
**CA Pass 3** — independently falsifies contract/source claims, actual consumers/lineage, tests, auth/state safety, utility/footprint/discardability; issues **TECHNICAL_INTEGRITY** and **PRODUCTION_VALUE** separate verdicts, both PASS for STATIC_READY. Distinguish PACK_UNIT, PATCH_STATIC, CALLSITE_INTEGRATED, BROWSER_SERVER (each PASS/FAIL/NOT_RUN with executor). STATIC_READY is not integrated/live PASS.
**Future CD** — only authorized production integrator, no default requirement to accept any Pack; later CA audit.
No agent may gain another role's canonical or deployment authority from this proposal.

## 9. Minimum deliverables and cost discipline
One lightweight IC feasibility report, CA review, one approved scoped implementation-baseline record when accepted, existing Pack manifests/patches/tests, and protocol-compliant handoffs/Action Logs. No new permanent committee, repeated signoff on every coding step, global LOC cap, all-repository inventory or speculative fully detailed A–F route plans.
Use `PASS`, `FAIL`, `NOT_VERIFIED/NOT_RUN`, `BLOCKED` accurately; source-static evidence cannot become live evidence by rewording.

## 10. Pilot order and stop
**Pilot IC:** proposed B-min operational-state read/display contract near CD's next planned V4 work, subject to CA confirming actual next package and its stable interface. Investigate existing teacher read model, authoritativeness and real consumer before deciding whether B-min is a valid IC; no new RPC/second state engine. W03 may follow only after dependencies/release. Do not prematurely plan all C/D/E/F.
**Go:** CA confirms meaningful, stable contract and a route with favorable expected remaining costs.  
**Hold:** actual consumer or effective contract cannot be verified, integration/regression effort dominates, no separate S-grade unit, source drift or owner ambiguity is material.  
**Stop:** safety/authority violation, invented/mismatched server contract, duplicate functionality with no net value, unauthorized writes/release, or unresolved gameplay semantic conflict.

## 11. Review request / finalization
CA should challenge: checkpoint validity; realistic V4 and effective database/RPC contracts; whether study effort is itself economical; deviation governance vs locked authorities; test rigor; protected boundaries; and premature B-min assumptions.
TCA should challenge: practical source inspection breadth, cost and discoverability of Pack integration, actual reuse-lineage burden, source drift, representative negative tests, and whether approved ICs leave enough independent coding freedom.
GA will review both written responses and reconcile material differences in a change log. **Only when both reviews are received and no material dispute remains** may GA publish V1.0 FINAL with exact accepted scope, statuses and links; otherwise retain DRAFT and escalate only unresolved owner/Teacher decisions. Silence is not assent. No direct CD contact while frozen.

## 12. CA conditional review reconciliation (DRAFT amendment; controls conflicting phrases in §§3–10)

**Review:** `agent-comms/CA_to_GA_20261010T144500Z_implementation-path-rules-v10-critical-review.md`. This amendment is binding *within the current draft interpretation only*, not project-wide ACTIVE governance. It supersedes more restrictive or ambiguous wording earlier in this proposal pending consolidated V1.0 publication.

**§3 IC maturity is graduated, not binary.** Every proposed checkpoint has a status:
- `PROPOSED` — anticipated entry/exit/consumer; not verified.
- `SOURCE_VERIFIED` — precisely identified contracts/consumer/source behavior supported by pinned actual source, with source-static limitations; not operational verification.
- `ACCEPTED_FOR_PLANNING` — CA has reviewed the feasibility boundary and permits comparison of internal routes, even when consumer is prospective and honestly labeled.
- `IMPLEMENTATION_VERIFIED` — integrated behavior has passed scoped applicable execution verification; record whether browser/server/deployed evidence exists.
The statuses describe different questions: acceptance for planning is NOT source or runtime verification and does not by itself authorize a production TCA Pack. A future B-min consumer may support planning at PROPOSED/ACCEPTED_FOR_PLANNING, but Pack selection still requires evidence of a real stable insertion contract and actual counterfactual value.

**§§3–5 source/authority evidence tiers.** Tag each fact by `DECLARED_CANONICAL`, `SOURCE_STATIC`, `TEST_MOCK`, or `DEPLOYED_VERIFIED`; additionally explain VERIFIED as VERIFIED_WHAT, not unqualified verified. In particular A1 intercepted-RPC browser tests are TEST_MOCK, not live DB validation. For B-min inspect precise RPC signature, producer and write owner, per-run identity, relevant migration grants, client/server mutation paths and data-lineage findings. If effective deployed permission/state is not proved, label `NOT_VERIFIED`; source evidence cannot silently become `DEPLOYED_VERIFIED`. Protected-authority uncertainties STOP affected Pack/authority modifications. Each feasibility report includes a compact unresolved assumption, owner, affected decision, and evidence needed.

**§§5–6 contract binding versus advisory route.** Only entry/exit **semantics**, authority, invariants, acceptance tests and sequencing that are already governance/owner approved are mandatory. GA's favorite architecture, module or RPC count, implementation internals and algorithms are `ADVISORY` unless separately and explicitly approved by the existing canonical owner/gate. An accepted feasibility study does not generate a new approval layer or override locked engineering contracts. Future CD may choose a demonstrably better equivalent route **without additional CA permission**, provided it satisfies all binding contracts; re-review is needed only if it changes a legitimately approved contract, authority, release boundary or separately owner-approved architecture. Serious safety concerns still STOP. TCA Pack is never mandatory to integrate. Ignore sunk expenditure when comparing forward costs.

**§§4,7,10 bounded economics and pilot preconditions.** Default to ONE narrow next authorized/expected IC; compare 1–3 genuinely different routes, or report one feasible route or `NO WORTHWHILE TCA PACK`. Stop if investigation uncertainty makes comparative ranking speculative, or study + anticipated integration likely costs as much as remaining CD effort saved. Do not invent numeric hours, a universal scoring scheme, speculative ABCDEF-wide architecture, or a two-Pack quota. Source drift prompts targeted compatibility checks before discard. B-min is **only a pilot candidate**, conditional on verifying (a) current CA next-package gate, (b) effective source RPC signature and source-of-truth ownership/grants, (c) existing versus planned consumer truthfully classified, and (d) approved V4 output acceptance plus relevant lineage evidence. No speculative new RPC/read-model shadow, fallback state, SQL/schema or authority introduced by route planning.

**Finalization gate unchanged:** CA's technical review alone cannot finalize V1.0; TCA's practitioner response is still pending. No TCA coding, CD resumption, integration or deployment is authorized.

## 13. Final CA/TCA reconciliation — route approval and Pack test boundary

**Evidence:** `agent-comms/CA_to_GA_20261010T153500Z_approved-route-default-binding-final-review.md`; TCA branch `agent-comms/TCA_to_GA_20261010T143500Z_implementation-path-v10-practitioner-review.md` and `agent-comms/TCA_to_CA_20261010T150000Z_approved-route-default-binding-and-evidence-based-deviation.md`. This section resolves §12 advisory-only route wording: §§12–13 take precedence over inconsistent earlier draft material.

**Route status must be exactly one of** `PROPOSED`, `RECOMMENDED_ADVISORY`, `APPROVED_ROUTE_DEFAULT_BINDING`. A route becomes default-binding **only** after an existing explicitly authorized technical/canonical owner or gate approves its *named route-defining properties* following route comparison and independent CA review. Every approval record states approving owner, decision record, exact binding properties, scope, assumptions, reopening triggers and at least one falsification case or surviving alternative. Neither GA authoring, CA concurrence alone, multi-model consensus nor a prebuilt Pack grants such approval. Existing approved IC semantic/data/authority contracts remain binding independently of route status.

**CD deviation:** A genuinely approved route is CD's default; changes to its formally bound interface, data flow, state owner, RPC set, synchronization or dependency architecture need concrete new evidence (infeasibility/unsafe/correctness issue or substantive forward-looking net cost, risk or reliability advantage) and CA independent review through **existing** owner gates, including canonical-owner action where required. An advisory route does not confer a veto. CD may change naming, helper organization, algorithms and equivalent within-route details without a new gate. Stop only affected work immediately for serious safety/privacy/authority danger and escalate; never cite sunk GA/CA/TCA effort as grounds to persist with an inferior route.

**Semantic versus physical consumer:** An IC feasibility study may define an approved semantic consumer obligation where the physical callsite does not exist; label the latter `PROPOSED`, never `SOURCE_VERIFIED`. A TCA production Pack needs an actual source-grounded stable consuming seam **or** an explicitly owner-approved frozen adapter input contract, plus verified removal/falsification value. No guessed server/RPC payload or invented adapter approval. Route-agnostic Pack selection is allowed only if at least TWO feasible routes demonstrably consume the same source-grounded input/observable operation *and* the proposed integration diff uses its output. Otherwise prefer a bounded preferred-route-specific Pack if worthwhile, or `NO WORTHWHILE TCA PACK`.

**Pilot interpretation:** Documentation-only checkpoint reconnaissance, source/acceptance comparison, and draft route testing are allowed GA investigation. They are not TCA coding assignment, CD implementation release, live gameplay test, production integration, nor deployed verification. B-min pilot must first check the V4 package gate, effective read-side evidence level, source read consumer versus planned consumer, and current evidence limits. Any later Pack work requires distinct task-specific authorization and Pass-2/Pass-3 checks.
