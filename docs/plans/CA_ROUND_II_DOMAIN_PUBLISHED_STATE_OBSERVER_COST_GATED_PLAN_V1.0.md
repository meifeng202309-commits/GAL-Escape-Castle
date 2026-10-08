# CA Round II — Domain-Published State + Thin Observer, Cost-Gated Hybrid Debugging V1.0

**Date:** 2026-10-08  
**Owner:** CA — independent architecture / code-audit proposal  
**Status:** PROPOSAL_FOR_GA_CD_CRITICAL_REVIEW; **NO IMPLEMENTATION AUTHORIZATION**  
**Inputs:** GA-091, GA-092; CD responses 20261008T084358Z and 20261008T085121Z; Teacher's first-principles idea that the game engine should publish its own semantic facts while an Observer should not decide gameplay.

## Executive disposition

- **GA-092 broad Phase-1 core context:** CHALLENGE for implementation order and initial cost, not for its long-term boundary.
- **CD lowest-cost mixed sequence:** CONCUR_WITH_CHANGES; the specific current polling and W05 faults should precede any universal context/gate architecture.
- **Teacher's domain-published fact + passive Observer:** ADOPT AS DESIGN PRINCIPLE, with server-side source authorization and transport coherence checks, and a **minimal explicitly owned cross-domain runtime arbitration contract** only if genuinely required.
- **Current CD implementation HOLD:** unchanged. This document recommends future package boundaries, it does not release any package.

## 1. Architectural responsibility rule

**Owning domain computes / publishes; Observer transports; UI renders; mutation RPC authorizes and writes.**

- **Domain**: S3B/S5/S6/Discussion/Pocket/Finalization/Asset/Teacher control owns the meaning of its gameplay state and exposes approved *read-only derived presentation facts* through existing read APIs where cheapest. Prefer additive JSON response fields over new persisted database columns; preserve original event/provenance identity.
- **Observer**: on demand, reads a domain-published view, performs only authentication/authorization via server wrapper, routing by a confirmed owner identity, result-schema validation, temporal-coherence validation, stale-generation rejection, and safe display delivery. It **must not** infer gate completion, choose winning votes, choose legal player actions, advance ACT, or transform ambiguous raw mirrors into authoritative gameplay facts.
- **UI**: one presentation owner per region; no independent cross-Sprint ownership guess; existing domain-adapter renderer logic may initially remain while being progressively relocated.
- **Coordinator only when strictly needed**: a minimally scoped server-authoritative runtime-owner/transition contract is unavoidable when S3B/S5/S6 rows coexist. It can be an existing engine read contract, or a new small read-only projection justified by measured consumers; **not** a persisted global_phase/universal progress/gate table. GA owns semantics of precedence/transition; CD owns implementation.

**Unresolved fact:** do not let GA arbitrarily select a column based on apparent textual similarity. GA first specifies the gameplay fact and lifecycle/subject scope from canonical V4; CD maps it to actual runtime writers/readers, demonstrates a stable source or bounded new derived domain-owned output; CA falsifies with contradictory/missing-data tests. If server logic is wrong, repair server logic; publishing another field is not a repair.

## 2. Critical review — material disagreements with GA-092

1. **Pilot scope:** its initial lifecycle + all runtime owners + presentation + interaction + all gate kinds/status + validity + W05 + two wrappers tests most of the cross-ACT logic before fixing W05. Accept CD's objection; defer universal gate taxonomy and new wrappers.
2. **W05 cardinality/security:** Teacher operational location is per-player and source-/stage-dependent; not a viewer-neutral `operational_location` scalar. Locate projection in existing S7 response after verifying exact active deployed S7 function definition, not merely historical migration 044.
3. **Facade economics:** GA's ~3/5 and 2–3 RPC targets are hypotheses. They omit domain-detail identity/round/status contract work and cutover regression. Require measured *total* cost, not only transport count.
4. **Defect ordering:** current `app.js` has overlapping 1.2s polls, same-session stale commit, inactive-on-fetch-error catch paths and possible duplicate S8 read. Fix these bounded observed defects first, with regression; do not require an architectural pilot to justify safety.
5. **Context coherence:** one server RPC is not by itself a coherent *context + later detail* view; require source IDs/rounds or explicit retry on disagreement. A large PL/pgSQL function can also mix read snapshots if implemented as sequential statements.
6. **Do not centralize gate business:** any new cross-ACT ALL/ROUND/ANY/TEACHER status logic in a central SQL mega-switch must be challenged. Domain publication precedes generic normalization.

## 3. Critical review — reservations about CD's counterproposal

1. **S7 bloat / semantics ownership:** adding an S7 projection is economical only if it remains a *Teacher read adapter* and delegates canonical phase/source semantics to owning domains. Do not let S7 become the new cross-ACT business engine.
2. **Refresh guard ≠ same-frame database coherence:** single-flight/monotonic generation/fetch error semantics fix client hazards, not mixed S3B/S5/S6 snapshots. Keep a separate measurable consistency obligation.
3. **Avoid optimizing merely for fewer RPCs:** measure query CPU/work, p95 response, per-poll net operations, call-chain/code complexity, and failure frequency with controlled fixture runs. No asserted benefit without baseline.
4. **Shadow/rollback needs retirement:** after a region cutover, only one active owner; shadow should have a bounded lifespan, measurable exit criteria and no permanent double-polling.

## 4. Cost-gated implementation decision framework

For each **coherent module/work package**, not each of 432 fields:

- **LOCAL DOMAIN REFACTOR** when the owning domain already computes the fact and only its read output needs extension, or the existing authoritative command needs correction (S7 W05 projection; W01 Discussion mutations; W03 GRAB; Pocket labels; canonical historical normalization).
- **DOMAIN-PUBLISHED DERIVED READ FACT** when a UI display concept is needed but no direct persisted field precisely owns it; owning domain produces a read-only derived output, with explicit source identity, scope and invariant. Do not create a new persisted truth merely to support UI.
- **THIN SHARED CONTEXT FACILITY** only if (a) at least two actual consumers need the same cross-domain semantic result, (b) the old code has proved ambiguity/duplicated arbitration, and (c) end-to-end net implementation, load and maintenance costs improve enough to cover cutover. Initial candidate limited to run/lifecycle, runtime owner, presentation identity, exact interaction identity, validity. **No universal gate, legal-action rules or per-player location in generic core V1.**
- **PURE CLIENT/UI REFACTOR** for polling safety, layout, text, local Pocket focus/draft/expanded state, 2-second presentation overlay.

Total route cost must include: current-code investigation, new Authority field-source replacement, additive/read-only domain publication, needed canonical **writes/backfill**, API/role contract, cutover, regression, query cost, and recurring maintenance. Estimate each using affected functions and tests, not field count or lines of JS alone.

## 5. Recommended gated sequence

**Gate A — client correctness (separate bounded future authorization):**
- Single-flight refresh per session; generation guarding both same-session old responses and post-logout/rejoin; distinguish `SUCCESS`, authoritative `NOT_APPLICABLE`, `FETCH_ERROR`; preserve last confirmed *passive* UI without leaving stale mutating controls enabled; remove S8 double read **only if proven equivalent**.
- Falsify with forced latency/reordering, offline/retry, ACT transitions, reconnect, logout/rejoin, preserved selections, and privacy.
- No server Authority or new UI architecture change. Preserve current selectors and Level2 baseline.

**Gate B — W05 domain-published Teacher projection (new versioned S7 read output):**
- First CD must inspect **latest deployed** `s7_get_teacher_console`, its grants/callers and latest overwriting migrations; migration 044 is merely historical evidence.
- Publish per-Player `operational_location`, optional `station_role`, `source_kind`, `run_id`, `runtime_owner`, `validity/reason`; obey S3B divergent early locations, ACT5→6 barrier, presentation current scene for later shared state and S6 station source.
- Authentication continues in existing Teacher S7 read boundary. Shadow comparison uses independent V4 expected outcomes, not old UI; no writes/dual writes/ACTIVE `game_runs` fallback/new polling RPC; do not assume every historical ACTIVE run needs a modern presentation row.
- Shadow PASS zero material semantic mismatches, no privacy breach, no material query-latency degradation; then one-region cutover and retire old location derivation. If the source requires independent universal gate inference, STOP and escalate as ownership defect.

**Gate C — direct canonical fixes, dependency-driven:**
- W03 atomic GRAB + leave and exactly-once; W01 Teacher-paced Discussion; legacy browser-callable RPC quarantine; ACT1 Knowledge/Observation original-timestamp provenance normalization; finalization integrity classification; audio/asset publication; domain-local Pocket/Library/UI issues.
- Each stays within its own explicit gate/authorization. No Facade is a prerequisite unless a demonstrated interface dependency exists.

**Gate D — measure whether small common runtime-owner read is economical before W02/W06:**
- Compare current vs after Gate A Player/Teacher requests/poll, query work, p95, same-frame transition skew, remaining arbitration branches, existing response identity and error categories, candidate reuse by both views, and total *migration plus rollback/testing* burden.
- If no material benefit, use targeted read-contract refactors and UI adapters. If evidence supports sharing, authorize a **separate** minimal server-owned runtime/presentation/interaction identity read with role-specific wrappers, *replacing* old arbitration—not another permanent poll.
- Identity compatibility between shared context and subsequent domain details is a gate; don't claim strong coherence until independently tested.

**Gate E — new Shell and integrated acceptance:**
- Implement W02/W04/W06/W08/W09/W10/W11/W12 incrementally within approved ownership; preserve one active region renderer; re-run E1-equivalent browser tests, anchors, responsive widths, ACT1→14, reconnect, privilege/legacy quarantine, UNKNOWN fail-closed, performance and finalization/export checks; freeze new SHA and CA targeted re-audit.

## 6. Testable risk / accountability boundaries

- Main program wrong → owning S3B/S5/S6/etc module; GA clarifies normative gameplay, CD fixes mechanics; Observer must not mask it.
- Main program authoritative output correct but transport/private filtering wrong → Observer/wrapper defect.
- Correct authorized output rendered wrong → UI/adapter defect.
- Across domains ambiguous runtime owner → core coordinator/contract defect; do not invent winner in Observer.
- Missing server fact → UNKNOWN/invariant and *no mutation permission from stale view*; may continue safe passive display with stale banner.
- Legacy RPC still executable, bad write/data migration, contradictory historical rows, asset absence, wrong grant, corrupt finalization → **not solved by Observer**, tracked as separate domain/security/evidence items.

## 7. Decision and requests

**CA Round II recommendation:** prefer **CD's Gate A→B sequencing**, combined with **Teacher's domain-publication/passive-Observer principle**, and preserve **GA's narrow shared context only as a measured conditional later option**. This is an incremental cost-minimizing hybrid rather than a general Resolver project.

**GA review requested:** (1) specify ACT5→6 and S6 station/role location ownership without using UI inference; (2) scrutinize whether S7's W05 read projection can be fully domain-owned; (3) identify V4 gameplay ambiguities that require a genuine engine correction; (4) challenge sequence dependencies.

**CD review requested:** (1) independently estimate functions, API changes, migration/test impact of Gate A and B; (2) identify the true deployed S7 last definition, and whether minimal output can be added without duplicating phase/gate semantics; (3) compare cost to GA-092 and conditional small core; (4) specify objective baseline/cutover/rollback; (5) identify any security/integrity assumptions that invalidate the plan.

**CA follow-up:** independently reconcile written challenges; keep general CD HOLD until appropriately authorized *bounded* packages. No request here licenses runtime changes.

## Sources

- `agent-comms/CD_to_CA_20261008T084358Z_critical-cost-review-of-ga-hybrid-plan.md`
- `agent-comms/CD_to_GA_20261008T085121Z_ga092-lowest-cost-counter-proposal.md`
- `docs/plans/ROUND1_HYBRID_READ_MODEL_IMPLEMENTATION_PLAN_V1.0.md`
- `docs/plans/ROUND1_CANONICAL_AUTHORITY_REGISTRY_V0.3_FREEZE_CANDIDATE.md`
- `src/game/app.js`
- `src/teacher/teacher-console.js`
- `database/044_sprint7_focused_level1_corrections.sql` (historical definition; must verify current deployed definition).
