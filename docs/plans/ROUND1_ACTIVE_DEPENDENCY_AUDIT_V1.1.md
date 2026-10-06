# Round-1 Active Dependency Audit V1.1

Date: 2026-10-06  
Owner: GA  
Status: REVISED STATIC DEPENDENCY AUDIT — architecture planning only  
Supersedes: `ROUND1_ACTIVE_DEPENDENCY_AUDIT_V1.0.md`  
Implementation authorization: NONE

## 1. Why V1.1 exists

V1.0 correctly established that the current repository does **not** contain dozens of obviously dead persistent tables: 49/50 are reachable from current product, operational, export/integrity, trigger, idempotency or asset paths, and only `s1_scene_choices` is a clear table-level dead candidate.

However, the labels `ACTIVE_AUTHORITY` / `ACTIVE_SUPPORT` were still too coarse at whole-table level.

Two tables are materially mixed:

- `game_runs` contains both canonical run-lifecycle facts and support-only historical/mirror fields.
- `s3b_player_facts` contains mostly compatibility/history facts, but **`gitte_flashlight_found` is still a live gameplay-authoritative pre-GRAB discovery fact** because the active `s3b_optional_grab_item` trigger reads it to decide whether the flashlight enters the Pocket.

Therefore V1.1 separates:

> **production reachability** from **fact-level authority**.

Authority is frozen only in the Canonical Authority Registry, not inferred from the fact that a table is active.

---

## 2. Production-reachability result

Persistent tables created through migration 068:

- **49 ACTIVE / production-reachable**
- **1 DEAD_CANDIDATE**
- **0 RETIRED**

The single table-level `DEAD_CANDIDATE` remains:

- `s1_scene_choices`

Current Player source still contains the old `submitChoice()` → `s1_submit_private_choice` path, but static named-function reachability shows `submitChoice()`, `renderState()`, and `refreshSprint3b()` are unreachable from the current production entry/event graph.

No CFTM runtime/database mutation has been performed.

---

## 3. Authority-shape result inside the 49 active tables

For architecture planning only:

- **37 predominantly/current-authority tables**
- **10 support-only tables**
- **2 MIXED tables requiring field/key-level rules**
- **1 dead candidate**

The two MIXED tables are:

1. `game_runs`
2. `s3b_player_facts`

This 37/10/2/1 split replaces the misleading V1.0 implication that every active table could be assigned one authority label as a whole.

---

## 4. MIXED table #1 — game_runs

### Current-authority fields

These own distinct run-envelope facts:

- `run_id`
- `room_code`
- `run_started_at`
- `run_mode`
- `behavior_dataset_eligible`
- `status` — run lifecycle state
- `completed_at` — lifecycle completion timestamp
- `audit_private_debug_view` — run-level Teacher audit-display setting
- `export_ready` — current operational export-eligibility flag

### Support-only / non-authoritative-for-new-progress fields

- `scene_id`
- `phase_key`
- `step_key`

Policy:

> New formal progression/presentation code MUST NOT use these fields as fallback authority.

They may remain for compatibility/export until separately retired.

### Derived/cache/support fields

- `silent_texting_mode`
  - currently mirrors Discussion configuration at run level;
  - canonical per-interaction value is `discussion_sessions.silent_texting_mode`.
- `game_completed`
  - mirrors completed lifecycle/finalization;
  - new code should use canonical lifecycle + finalization identity, not this boolean as an independent truth.
- `session_integrity_verified`
  - cached/operational projection of final integrity verification;
  - final verification evidence lives in `s8_finalizations.integrity_report`.

### Provenance pointer, not current gameplay authority

- `active_override_id`
  - current code sets it when Teacher Override occurs and uses it to propagate provenance;
  - it is not reliably cleared as gameplay progresses;
  - therefore its name MUST NOT cause new code to interpret it as "an override is currently active";
  - allowed meaning: upstream/latest override context pointer for provenance only.

---

## 5. MIXED table #2 — s3b_player_facts

Current writers establish the following observed fact keys.

### Gitte

- `gitte_heard_chapel_warning`
- `gitte_knows_basic_map`
- `gitte_number_note_visible`
- `gitte_map_detail`
- `gitte_saw_shadow`
- `gitte_knows_star`
- `gitte_flashlight_found`

### Anna

- `anna_knows_great_hall_lock`
- `anna_diary_visible`
- `anna_knows_snake_rule`
- `anna_knows_library_passage`
- `anna_detected_devices`
- `anna_heard_vent_movement`

### Linda

- `linda_watch_visible`
- `linda_star_key_visible`
- `linda_knows_tower_closed`
- `linda_closure_notice_visible`
- `linda_knows_tower_reason`
- `linda_knows_watch_message`
- `linda_tested_star_key`
- `linda_knows_warm_air_warning`
- `linda_watch_reminder`

### 5.1 One currently authoritative key

`gitte_flashlight_found`

Current active trigger:

`s3b_optional_grab_item`

checks this fact when GRAB completes and conditionally adds `gitte_flashlight` to `s3_player_items`.

Therefore this fact is:

> **AUTHORITY within the narrow pre-GRAB optional-item-discovery scope.**

After acquisition, physical ownership authority becomes `s3_player_items`.

### 5.2 Facts already duplicated by canonical observations

These are support-only for new UI because the trigger already writes canonical observation evidence:

- `gitte_heard_chapel_warning` → `s3_player_observations: chapel_warning`
- `gitte_saw_shadow` → `corridor_shadow`
- `anna_knows_great_hall_lock` → `great_hall_outer_lock`
- `anna_heard_vent_movement` → `warm_vent_movement`
- `linda_knows_warm_air_warning` → `warm_air_warning`

### 5.3 Facts with an existing canonical Knowledge destination

New UI must use the Knowledge record, not the legacy fact:

- `gitte_knows_star` → `s3_player_knowledge: gitte_star_symbol`
- `anna_knows_snake_rule` → `anna_snake_rule`
- `linda_knows_tower_reason` → `linda_tower_reason`
- `linda_knows_watch_message` / `linda_watch_reminder` → `linda_watch_reminder`

Current migration 068 writes these canonical Knowledge rows during Pocket inspection/flip.  
But V4 also allows some of the same knowledge to be learned earlier through ACT1 first actions.

Therefore before W04/Memories becomes a first-class UI source, the architecture requires:

> **ACT1 consequence → canonical Knowledge normalization**

so a player who already learned the information in ACT1 does not have to re-inspect the Pocket object merely to make the new Knowledge authority agree with the narrative.

This is a design requirement, not a CD-discretion item.

### 5.4 Visibility/history facts not to be read as new authority

Examples:

- `gitte_number_note_visible`
- `anna_diary_visible`
- `linda_watch_visible`
- `linda_star_key_visible`
- `linda_closure_notice_visible`
- `linda_tested_star_key`

New UI should obtain:
- current object ownership from `s3_player_items`;
- current view from `s3_player_item_view_state`;
- explicit inspection from `s9_pocket_item_inspections`;
- behavior first-choice history from `s3b_player_progress.act1_choice_id`;
- observations/knowledge from their canonical tables.

### 5.5 Facts requiring an explicit keep-or-normalize decision before W04

These do not yet have an unambiguous canonical Knowledge/Observation destination in the current schema:

- `gitte_knows_basic_map`
- `gitte_map_detail`
- `anna_knows_library_passage`
- `anna_detected_devices`
- `linda_knows_tower_closed`

Policy:

- CD may not invent a destination.
- Before W04 implementation, GA/Teacher must decide for each whether it is:
  1. player-visible durable knowledge/observation → add a canonical catalog identity and normalize it; or
  2. derivable/transient narrative state → do not expose it through the new Memories authority.

---

## 6. Support-only tables remain active

The following current support objects remain reachable but do not own current progression:

- `s1_room_state`
- `s1_player_decisions`
- `s1_game_events`
- `runtime_events`
- `s3b_library_attempts`
- `asset_events`
- `s5_rounds`
- `s6_action_receipts`
- `s6_allocation_attempts`
- `act6_13_event_ledger`

`s3b_player_facts` is removed from this pure-support list because it is MIXED.

---

## 7. CFTM result remains unchanged

No runtime/database object is disabled now.

If Teacher/GA/CA later choose to validate the one clear dead table path:

`s1_scene_choices ← s1_submit_private_choice ← unreachable Player submitChoice()`

use a new additive quarantine change; never comment/deform historical deployed migrations.

---

## 8. Consequence for architecture freeze

The next architecture artifact must be fact-level, not table-level.

Required ordering:

```text
Active Dependency Audit
    ↓
field/key-level Canonical Authority Registry
    ↓
gate model
    ↓
internal Core Resolver
    ↓
Player / Teacher wrappers
    ↓
UI
```

The runtime must never decide authority by asking "which table has a value?".
