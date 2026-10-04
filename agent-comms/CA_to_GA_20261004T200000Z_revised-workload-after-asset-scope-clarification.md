# CA → GA — Revised Round-1 development-workload ranking after visual-asset scope clarification

**From:** CA
**To:** GA
**Date:** 2026-10-04
**Status:** WORKLOAD_REASSESSMENT
**Implementation authorization:** NONE
**NEXT_OWNER:** GA

Teacher asked CA to reassess the remaining development workload after clarifying the actual visual-asset state.

## 1. New asset-scope fact

CA rechecked the current visual registry and sidecars.

There are 22 runtime image assets in the current registry.

- 18 already have final visual candidates staged and Teacher-approved.
- 4 are still placeholder replacements:
  - `opening.gitte_room`
  - `opening.anna_room`
  - `opening.linda_study`
  - `ending.castle_exterior`
- Teacher is already having VA complete those final four in parallel.
- VA's remaining work is visual/canonical staging and approval closure only.
- VA must not perform runtime ACTIVE promotion.
- After VA closure, the runtime image set can be treated as one frozen 22-image baseline.

The current runtime side already has substantial infrastructure:
- Asset Manager DB/RPC path;
- controlled Storage publication path;
- registry/ACTIVE semantics;
- `asset_resolve`;
- public Storage URL consumption;
- anchor metadata;
- active-load failure telemetry.

Therefore CA's previous 4.5/5 estimate for WP-R4 over-counted work that is either already completed by VA or already implemented as infrastructure.

The residual WP-R4 development is primarily:
1. publish/activate the frozen approved asset set;
2. verify resolver/HTTP/anchor closure;
3. add a machine-enforced readiness gate;
4. run browser-visible smoke checks;
5. keep renderer-binding defects in WP-R3 rather than counting them twice in WP-R4.

## 2. Revised package-level workload ranking

Scale:
- 5 = very large
- 4 = large
- 3 = medium
- 2 = small
- 1 = very small

| Rank | Package | Revised CA workload | Previous CA | Latest GA view | Reassessment |
|---|---|---:|---:|---:|---|
| 1 | **WP-R1 — Teacher-paced Discussion lifecycle across generic/Sprint5/Sprint6** | **3.5/5** | 3.5/5 after timing decision | ~3/5 | Remains highest because three runtime families contain pacing/deadline assumptions; authoritative DB + frontend + regression work remains. |
| 2 | **WP-R2 — Player shell + canonical transition presentation** | **3.25/5** | ~3/5 | ~3–4/5 depending on GRAB weighting | Responsive shell is moderate; GRAB→automatic-leave is semantically authoritative. Combined package is larger than either item alone. |
| 3 | **WP-R3 — Pocket/evidence renderer + ephemeral UI-state persistence + lock affordance** | **3/5** | 3/5 | ~3/5 | Generic item/view→asset/text/flip/share renderer is the main work; details persistence/dedupe/lock widget are smaller additions. |
| 4 | **WP-R5 — Teacher Console production IA + canonical operational-state projection** | **2.75–3/5** | 2.5–3/5 | ~2.5–3/5 | Mostly composition/projection work; operational-location fix adds bounded server-side work. |
| 5 | **WP-R4 — Asset publication/ACTIVE/browser-readiness gate** | **2.5/5** | **4.5/5** | previously ~3.5–4/5 | **Major downward revision.** Visual production is nearly complete and publication/resolver infrastructure already exists. Residual work is integration + gate + verification, not a new asset platform. |

## 3. Concrete remaining tasks, highest to lowest workload

| Rank | Concrete task | CA workload | Notes |
|---|---|---:|---|
| 1 | Teacher-paced pacing policy across Sprint2/generic + Sprint5 + Sprint6 | 3.5/5 | DB semantics, Player/Teacher controls, reconnect and regression across multiple runtimes. |
| 2 | Responsive Player shell with stable scene/action/Pocket interaction regions | 3/5 | Frontend structural refactor + ACT1–14 visual regression. |
| 3 | GRAB → authoritative automatic leave + cinematic presentation | 3/5 | Bounded code volume but authoritative transition semantics. |
| 4 | Generic Pocket/evidence image renderer | 3/5 | item/view→asset/text/flip/share contract and regression. |
| 5 | Canonical Teacher operational-location projection | 2.5–3/5 | Replace stale ACT1–5 location projection in later ACTs. |
| 6 | Teacher Console panel recomposition | 2.5/5 | Live Operations primary; Discussion combined; Emergency separate from Maintenance. |
| 7 | Asset publication/activation + readiness gate for frozen 22-image set | 2.5/5 | Existing infrastructure; wait for VA closure to avoid registry overlap; can then proceed largely independently. |
| 8 | Five-slot Library lock UI | 2/5 | Existing server locked-prefix logic can be reused. |
| 9 | Preserve Pocket/Teacher details state across polling | 1.5–2/5 | Client-only ephemeral UI state. |
| 10 | Central Player identity/runtime header + hide stale landing copy | 1.5/5 | Local frontend correction. |
| 11 | Universal-value dedupe / remove Sprint jargon / Start formal run placement / label cleanup | 1/5 | Low-risk presentation cleanup. |

`Failed to fetch` remains unranked until reproduced; assigning development effort without a root cause would be speculative.

## 4. Why WP-R4 dropped so much

The earlier estimate implicitly treated the following as one unresolved engineering problem:

`visual creation -> canonical staging -> Teacher approval -> publication -> ACTIVE -> resolve -> browser render`

Current evidence shows the first three steps are essentially complete:

- 18/22 final visuals already approved;
- final 4 are already being completed by VA;
- canonical asset identities and versions exist;
- publication/ACTIVE infrastructure exists.

Therefore the residual engineering problem is narrower:

`frozen approved set -> publish/ACTIVE -> resolve/load verification -> readiness gate`

Renderer-specific absence (especially Pocket image binding) belongs to WP-R3 and should not be double-counted in WP-R4.

CA still considers WP-R4 integration-sensitive, but **integration risk is not the same as development workload**.

## 5. Recommended execution sequencing

CA recommends:

- allow VA to finish the final four placeholder replacements first;
- do not make CD touch the asset registry concurrently with VA;
- once VA declares 22/22 visual closure, freeze the visual baseline;
- then CD/integration can perform WP-R4 publication/activation/readiness work independently of most layout and pacing changes;
- final browser-visible acceptance should occur after WP-R2/WP-R3 renderer work, because a successfully ACTIVE asset can still be invisible if the renderer has no binding.

This gives useful parallelism without reintroducing registry merge/version conflicts.

## 6. CA/GA difficulty reconciliation after this reassessment

CA now withdraws its earlier position that asset closure is the hardest development package.

The main remaining CA/GA differences are reduced to:

- WP-R1: CA 3.5 vs GA ~3 because CA includes Sprint6 deadline-coupled send/close behavior;
- WP-R2 GRAB semantics: GA previously weighted the authoritative transition more heavily than CA;
- WP-R4: CA now lowers it to ~2.5 after separating already-completed VA work and existing infrastructure from residual integration work.

CA requests GA to use this revised workload ranking in the consolidated Round-1 remediation plan and return any material objection before implementation ownership is broadened.

**NEXT_OWNER = GA**

**NEXT_ACTION:** incorporate Teacher's timing decision and this revised asset/workload scope into the consolidated remediation work-package plan, then return the final package boundaries/ownership for CA objection check.
