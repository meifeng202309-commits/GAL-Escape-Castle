# Structural simplification rounds 1–3 — V1.0

**Date:** 2026-10-07  
**Owner:** GA  
**Primary working table:** `SIX_METHOD_432_FIELD_FACTS_MASTER_V3.0.csv`  
**Inference boundary:** structural organization and recorded lineage only. No SAME_FACT / DIFFERENT_FACT / Authority / obsolete / bug conclusion is made here.

## 1. Round 1 — structural exclusion

All 432 fields were screened by structural role.

- **47 EXCLUDE_TECHNICAL**: security credentials, request/idempotency keys, surrogate row identities, generic bookkeeping timestamps.
- **72 CONTEXT_ONLY**: run / room / player / discussion scope keys. These remain available for joins and evidence but are not treated as primary duplicate-fact candidates.
- **313 RETAIN**: business/domain fields carried into structural clustering.

This reduces the primary comparison surface from **432 to 313 fields** before semantic reasoning. “Excluded” means excluded from primary duplicate-fact clustering only; it does not mean deleted, obsolete, unimportant, or non-authoritative.

## 2. Round 2 — structural splitting

The earlier inventory contained **55 same-name groups**. Retained fields were split using:

`column name + domain + subject scope + temporal role`

Results:

- **11** same-name groups contain only Round-1 technical/context fields and disappear from the primary clustering surface.
- **44** same-name groups split into multiple structural partitions.
- **0** retained same-name groups remain one structural partition.
- The 313 retained fields form **310 structural partitions**.
- Only **3 partitions** contain more than one retained field:

- **SP0001**: `act6_13_event_ledger#03.event_type`, `runtime_events#05.event_type`
- **SP0003**: `act6_13_event_ledger#05.phase_key`, `runtime_events#10.phase_key`
- **SP0005**: `act6_13_event_ledger#08.details`, `runtime_events#07.details`

Thus, same spelling by itself creates very little residual ambiguity after scope and temporal role are separated.

## 3. Round 3 — lineage supplementation

Round 3 records two different evidence structures and deliberately does not mix them.

### 3.1 Copy-like candidate components

Only value-transfer evidence is allowed to join fields here:
- exact typed-row assignment;
- direct copy/backfill;
- trigger copy;
- COALESCE backfill.

Same-name alone does **not** create a Round-3 copy component, and JSON-container extraction is treated as dependency rather than value-equivalence.

There are **17 multi-field copy-like candidate components covering 48 retained fields**:

- **CC001 (2)**: `act6_13_event_ledger#04.act_no`, `s6_run_state#02.act_no`
- **CC002 (2)**: `act6_13_event_ledger#05.phase_key`, `s6_audio_occurrences#04.phase_key`
- **CC003 (3)**: `act6_13_event_ledger#06.occurrence_id`, `s6_audio_consumptions#01.occurrence_id`, `s6_audio_occurrences#01.occurrence_id`
- **CC004 (3)**: `asset_candidates#02.asset_key`, `asset_events#02.asset_key`, `asset_registry_projection#01.asset_key`
- **CC005 (3)**: `asset_candidates#03.version`, `asset_events#04.version`, `asset_registry_projection#08.active_version`
- **CC006 (2)**: `asset_candidates#04.asset_type`, `asset_registry_projection#04.asset_type`
- **CC007 (2)**: `asset_candidates#16.paired_asset_group`, `asset_registry_projection#10.paired_asset_group`
- **CC008 (2)**: `asset_candidates#26.continuity_refs`, `asset_registry_projection#09.continuity_refs`
- **CC009 (2)**: `asset_candidates#27.required_anchors`, `asset_registry_projection#11.required_anchors`
- **CC010 (5)**: `dialogue_messages#04.scene_id`, `discussion_sessions#03.scene_id`, `runtime_events#09.scene_id`, `runtime_player_decisions#04.scene_id`, `s3_runtime_scene_state#02.scene_id`
- **CC011 (6)**: `dialogue_messages#05.phase_key`, `discussion_sessions#04.phase_key`, `runtime_events#10.phase_key`, `runtime_player_decisions#05.phase_key`, `s3_runtime_scene_state#03.phase_key`, `s5_run_state#03.phase_key`
- **CC012 (5)**: `dialogue_messages#06.step_key`, `discussion_sessions#05.step_key`, `runtime_events#11.step_key`, `runtime_player_decisions#06.step_key`, `s3_runtime_scene_state#04.step_key`
- **CC013 (2)**: `discussion_sessions#07.vote_round`, `runtime_player_decisions#07.vote_round`
- **CC014 (2)**: `s1_player_decisions#03.scene_id`, `s1_room_state#02.current_scene`
- **CC015 (3)**: `s3b_player_progress#21.act6_handoff_observed_at`, `s3b_player_progress#22.act6_entered_at`, `s5_run_state#10.act6_entered_at`
- **CC016 (2)**: `s6_allocation_attempts#03.round_no`, `s6_run_state#05.round_no`
- **CC017 (2)**: `s6_choices#10.action_step`, `s6_run_state#04.act9_step`

A component means only “review these together”; it is not a SAME_FACT finding.

### 3.2 One-hop dependency groups

Computed, lookup, JSON-extract and other transform relations are kept as **one-hop groups** rather than transitively merged. This avoids generic fields such as `details` or `outcome` turning unrelated facts into one giant misleading cluster.

There are **15 one-hop dependency groups**:

- **DG001**: `s6_audio_occurrences#03.cue_key` + `s6_run_state#03.phase_key` → `act6_13_event_ledger#08.details` (TYPED_COMPUTED_DEPENDENCY)
- **DG002**: `asset_candidates#28.sha256` → `asset_events#05.details` (TYPED_COMPUTED_DEPENDENCY)
- **DG003**: `discussion_sessions#19.revote_window_sec` + `discussion_sessions#24.discussion_time_limit_sec` + `discussion_sessions#25.vote_time_limit_sec` → `discussion_sessions#11.phase_deadline` (TYPED_COMPUTED_DEPENDENCY|COMPUTED_FROM_CLOCK_AND_FIELD)
- **DG004**: `discussion_sessions#07.vote_round` + `discussion_sessions#21.fallback_resolution` → `discussion_sessions#13.outcome` (TYPED_COMPUTED_DEPENDENCY)
- **DG005**: `s3_runtime_scene_state#02.scene_id` + `s3_runtime_scene_state#03.phase_key` + `s3_runtime_scene_state#04.step_key` + `s5_run_state#04.vote_round` + `s8_finalizations#06.export_schema_version` → `runtime_events#07.details` (TYPED_COMPUTED_DEPENDENCY)
- **DG006**: `runtime_events#06.actor_player_id` → `runtime_events#12.event_source` (COMPUTED_FROM_FIELD_IF_TARGET_NULL)
- **DG007**: `runtime_events#07.details` → `runtime_events#14.behavior_scoring` (COMPUTED_FROM_JSON_IF_TARGET_NULL)
- **DG008**: `s1_room_players#03.role_slot` + `s1_room_state#02.current_scene` → `s1_game_events#05.details` (TYPED_COMPUTED_DEPENDENCY)
- **DG009**: `s3_group_items#02.item_key` → `s3_group_items#03.label_text_key` (LOOKUP_FROM_SAME_ROW_KEY|CONSTANT_FOR_MATCHED_KEY)
- **DG010**: `s3_item_catalog#01.item_key` → `s3_item_catalog#02.name_text_key` (LOOKUP_FROM_SAME_ROW_KEY|CONSTANT_FOR_MATCHED_KEY)
- **DG011**: `s5_run_state#03.phase_key` → `s3_runtime_scene_state#10.allow_share_photo` (TYPED_COMPUTED_DEPENDENCY|COMPUTED_BOOLEAN_FROM_FIELD)
- **DG012**: `s1_room_players#03.role_slot` → `s3b_player_progress#13.act1_text_keys` (COMPUTED_FROM_ROLE)
- **DG013**: `s5_run_state#05.act6_resolution` → `s5_rounds#07.resolution_source` (COMPUTED_FROM_STATE_AND_RESULT)
- **DG014**: `s6_action_receipts#05.payload` → `s6_choices#10.action_step` (JSON_EXTRACT_COPY)
- **DG015**: `s6_run_state#04.act9_step` → `s6_run_state#07.blue_activated` (TYPED_COMPUTED_DEPENDENCY)

## 4. Evidence QA correction

Before building Round 3, one prior evidence-row mapping was corrected:

`s6_choices.action_step` trigger-copy was previously mapped to `s6_run_state#07 = blue_activated`.  
The SQL expression is `act9_step`; the correct source is **`s6_run_state#04 = act9_step` (F0375)**.

The direct-lineage evidence table was corrected before component generation.

## 5. What has become simpler

The investigation now has three distinct layers:

1. **119 fields** are technical/context fields and no longer clutter primary duplicate-fact clustering.
2. The **55 same-name groups** are no longer treated as 55 semantic problems; after structure is applied, almost all split apart.
3. The remaining cross-field clues are concentrated into **17 copy-like components** plus **15 direct dependency groups**.

These provide the queue for the later reasoning phase. The later phase should start with the copy-like components, especially scene/phase/step, ACT6 entry, Discussion vote-round, and other gameplay-state components, before reviewing isolated retained fields.

## 6. Stop boundary and QA

- Master V3: **432/432 fields**, 84 columns.
- Unique Field IDs: **432/432**.
- Authority/semantic inference leakage: **0**.
- No runtime, database, or gameplay implementation was changed.
- CD remains HOLD.

Rounds 1–3 are complete at the structural/evidence level. The next phase is explicit Fact Cluster reasoning.
