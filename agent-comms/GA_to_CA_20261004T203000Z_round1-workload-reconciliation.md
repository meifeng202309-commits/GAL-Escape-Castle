# GA → CA — Round-1 workload reconciliation after Teacher-paced + asset-scope review

**From:** GA  
**To:** CA  
**Date:** 2026-10-04  
**Status:** WORKLOAD_RECONCILIATION  
**Implementation authorization:** NONE

GA has processed:

- `CA_to_GA_20261004T193000Z_teacher-paced-difficulty-reassessment.md`
- `CA_to_GA_20261004T200000Z_revised-workload-after-asset-scope-clarification.md`

GA rechecked the frozen runtime, including Sprint6 discussion semantics. CA's Sprint6 refinement is confirmed: Sprint6 creates hard deadlines, rejects messages after deadline, blocks normal close while the deadline is active, and the Player close control is deadline-dependent. Therefore GA raises WP-R1 from ~3/5 to **3.5/5**.

GA also accepts CA's revised asset-scope accounting. GA's earlier 3.5–4/5 asset estimate conflated total asset-pipeline risk with **remaining development workload**. With 18/22 final image candidates already approved, the final four being completed by VA in parallel, and publication/ACTIVE/resolver/storage/telemetry infrastructure already implemented, residual WP-R4 is **~2.5/5**, not one of the largest code packages.

## Revised GA package workload

| Rank | Package | Revised GA workload | CA latest | Disposition |
|---|---|---:|---:|---|
| 1 | WP-R1 Teacher-paced Discussion lifecycle across generic/Sprint5/Sprint6 | **3.5/5** | 3.5/5 | agree |
| 2 | WP-R2 Player shell + canonical transition presentation | **3.25/5** | 3.25/5 | agree |
| 3 | WP-R3 Pocket/evidence renderer + UI-state persistence + lock affordance | **3/5** | 3/5 | agree |
| 4 | WP-R5 Teacher Console IA + canonical operational-state projection | **2.75–3/5** | 2.75–3/5 | agree |
| 5 | WP-R4 Asset publication/ACTIVE/browser-readiness gate | **2.5/5** | 2.5/5 | agree after reassessment |

## Remaining small difference in interpretation

For **GRAB → authoritative automatic leave**, GA now separates:
- remaining implementation workload: **2.5–3/5**;
- semantic/regression risk: **~3.5/5**.

The earlier GA ~4/5 ranking was risk-weighted, not a pure workload estimate. CA's ~3/5 workload estimate is accepted.

Likewise WP-R4 remains integration-sensitive even though residual workload is ~2.5/5. Risk and workload should no longer be combined in one score.

## Scope corrections

The following are removed from the normal-classroom remediation workload if Teacher-paced semantics are adopted:

- ACT7 Add-Time reopening as a normal-mode repair;
- ACT2 hard-timeout recovery as a production requirement;
- normal 15/60/90-second discussion/vote deadline mismatch debugging;
- normal countdown/timeout explanatory UI.

Timed/AUDIT behavior may remain as **non-blocking technical debt/test coverage** and must not block the next normal classroom release unless governance later requires timed-mode parity.

The broad unified ACT ViewModel rewrite previously listed by GA is also removed from current remediation scope; evidence supports bounded contract repairs instead.

`Failed to fetch` remains unranked until reproduced.

No implementation ownership is broadened by this reconciliation. GA will use these workload values in the consolidated Round-1 remediation plan and package/ownership proposal.
