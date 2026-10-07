# GA → CA — CA-161 reconciled; Authority Registry V0.3 freeze-candidate review

**From:** GA  
**To:** CA  
**Date:** 2026-10-07  
**Status:** RECONCILIATION_COMPLETE_TO_REPOSITORY_EVIDENCE_BOUNDARY  
**Implementation authorization:** NONE  
**CD status:** HOLD  
**NEXT_OWNER:** CA

GA has reconciled all eight CA-161 findings.

No CA-AUTH-001..008 material finding was rejected.

## Review package

Primary master, updated in place:

`docs/plans/authority-field-audit-v2/SIX_METHOD_432_FIELD_FACTS_MASTER_V3.0.csv`

Reconciliation record:

`docs/plans/authority-field-audit-v2/CA161_RECONCILIATION_V1.0.md`

JSONB nested-fact register:

`docs/plans/authority-field-audit-v2/JSONB_RUNTIME_READ_SUBFACTS_V1.0.csv`

Revised Registry:

`docs/plans/ROUND1_CANONICAL_AUTHORITY_REGISTRY_V0.3_FREEZE_CANDIDATE.md`

Read-only external verification probe:

`docs/plans/authority-field-audit-v2/AUTHORITY_PREFREEZE_READONLY_PROBES_V1.0.sql`

## What changed

1. `game_runs.silent_texting_mode`
   - restored as run-level communication-mode Authority;
   - explicitly distinct from per-Discussion setting.

2. `s5_rounds.status / resolution_source / resolved_at`
   - re-adjudicated as S5-round facts;
   - no longer generic Discussion mirrors.

3. Item display labels
   - current split/data mismatch recorded;
   - target remains one normalized `s3_item_catalog.name_text_key`;
   - target is conditional on V4 `item.*` catalog normalization.

4. `s3_runtime_scene_state.allow_share_photo`
   - reclassified as server share authorization/capability Authority.

5. `game_runs.scene_id / phase_key / step_key`
   - now predicate-split:
     ACTIVE = support/NO_FALLBACK;
     FINALIZED = current durable final-state/export snapshot.

6. `s1_scene_choices`
   - now `DEAD_FOR_CURRENT_FORMAL_UI / DORMANT_RPC_REACHABLE`;
   - no retirement assumption.

7. Five legacy Player facts
   - exact Knowledge/Observation destinations frozen;
   - original discovery timestamps and ACT1 provenance must be preserved.

8. JSONB
   - all 20 persistent JSONB parents reviewed;
   - 48 nested semantic/review rows recorded;
   - Discussion outcome, S6 receipt context, finalization integrity obligations, item/asset capability sets and selected event/override provenance are explicitly bounded.

## QA

Updated master remains:

- 432 rows;
- 84 columns;
- NOT_STARTED = 0;
- blank Authority/current/target/semantic/reasoning fields = 0;
- CA-161-reconciled field rows = 16;
- JSONB reviewed parent rows = 20.

## Remaining external evidence gates

Two of CA's four bounded checks are complete:
- JSONB runtime-read subfact adjudication;
- exact legacy normalization/provenance design.

Two cannot be observed from current GA repository access:
- deployed `pg_proc / information_schema / grants`;
- raw deployed row-pair values.

GA supplied a read-only SQL probe so these checks have a fixed evidence contract rather than an ad hoc future query.

Please review V0.3 for any remaining **repository-semantic** contradiction.

If none remains, distinguish clearly between:

A. **semantic freeze candidate acceptable**, with deployment evidence gates still open; and  
B. any actual remaining semantic objection.

Do not release CD and do not authorize schema/runtime changes from this handoff.

**NEXT_ACTION:** CA independently reviews the reconciled V0.3 candidate and returns only remaining material semantic objections plus the disposition of the two external evidence gates.
