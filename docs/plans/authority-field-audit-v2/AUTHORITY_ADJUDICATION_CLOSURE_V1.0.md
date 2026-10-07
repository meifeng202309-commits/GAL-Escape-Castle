# Authority Adjudication Closure V1.0

**Date:** 2026-10-07  
**Owner:** GA  
**Primary evidence + judgment table:** `SIX_METHOD_432_FIELD_FACTS_MASTER_V3.0.csv`  
**Current master commit:** `bee4a5432251a0df862659a681bd84f13da57c76`

## 1. Closure status

**432 / 432 persistent fields have an explicit Authority disposition.**

QA after the final write:

- rows: **432**
- columns: **84**
- `AUTHORITY_INFERENCE_STATUS = NOT_STARTED`: **0**
- blank `AUTHORITY_INFERENCE_STATUS`: **0**
- blank `CURRENT_AUTHORITY`: **0**
- blank `TARGET_AUTHORITY`: **0**
- blank `FACT_SEMANTIC_CLASS`: **0**
- blank `INFERENCES_OR_AUTHORITY_DECISIONS`: **0**

Inference coverage:

- 17 copy-like Fact Clusters: **48 fields**
- 15 one-hop dependency groups: **37 unique fields**
- isolated retained domain fields: completed
- technical/context fields: **119 / 119**
- total: **432 / 432**

This closes GA semantic/Authority adjudication at the repository-evidence boundary.

It does **not** prove deployed-database equality because current GA evidence still lacks direct deployed `pg_catalog / pg_proc` inspection and raw live-row pair comparisons.

## 2. Governing semantic rules established

### 2.1 Copy does not imply duplicate fact

A copied value may become a different fact because its subject or temporal role changes.

Examples:

- current gameplay state → event-time snapshot;
- current step → choice-time step;
- current round → attempt-time round;
- current scene → locked-decision scene.

Therefore copy lineage alone is never sufficient for field deletion.

### 2.2 A calculated result may itself be Authority

A derived value is authoritative when it represents a new persisted semantic fact that downstream logic must be able to identify directly.

Examples adjudicated as authorities:

- `discussion_sessions.phase_deadline` — actual absolute deadline;
- `discussion_sessions.outcome` — resolved Discussion outcome;
- `runtime_events.event_source` — normalized event provenance;
- `runtime_events.behavior_scoring` — normalized scoring eligibility;
- `s3_runtime_scene_state.allow_share_photo` — current presentation permission;
- `s6_run_state.blue_activated` — physical gameplay state distinct from workflow step.

A derived field is SUPPORT_ONLY only when it merely mirrors another canonical fact and has no distinct semantic ownership.

### 2.3 Historical evidence is not obsolete merely because it is not current-state Authority

Attempts, receipts, event logs, decision snapshots and playback records remain authoritative for their own historical facts even when they must never drive current progression.

### 2.4 Technical/context fields also have bounded Authority

- surrogate IDs own stored-record identity;
- request IDs own idempotency identity;
- credential hashes own security/session binding;
- FK/scope keys own the durable relation binding of a row to run/player/room/discussion;
- bookkeeping timestamps own their own technical provenance.

They were excluded from duplicate-domain clustering, not from Authority analysis.

## 3. Material findings requiring CA challenge

### A. Potential split-Authority / drift defects

#### A1 — Asset type
Current registry authority:
`asset_registry_projection.asset_type`

Support/version snapshot:
`asset_candidates.asset_type`

Problem:
candidate import copies/validates registry type, but `asset_resolve` emits the candidate copy. A later registry change can therefore create two values that code may treat as current.

Target:
registry projection is the sole current asset-type Authority.

#### A2 — Paired asset group
Current registry authority:
`asset_registry_projection.paired_asset_group`

Support/version snapshot:
`asset_candidates.paired_asset_group`

Problem:
group transition logic uses candidate copies for some checks and registry projection for others. This is a split-source invariant.

Target:
current group membership comes from registry projection; candidate copy is historical/version metadata only.

#### A3 — Required anchors
Current registry authority:
`asset_registry_projection.required_anchors`

Support/version snapshot:
`asset_candidates.required_anchors`

Problem:
activation validates the candidate copy even though current requirements are registry metadata.

Target:
registry projection is the sole current required-anchor Authority.

#### A4 — Group-item display label
Canonical item display metadata:
`s3_item_catalog.name_text_key`

Support copy:
`s3_group_items.label_text_key`

Problem:
the group-item row deterministically duplicates the item name mapping and current Player-state output exposes that duplicate directly. Catalog changes can drift from historical/current group-item copies.

Target:
catalog owns current display-name mapping; group-item label is at most an acquisition-time/support snapshot.

### B. Drift risks not yet established as current bugs

#### B1 — Candidate continuity refs
`asset_candidates.continuity_refs` is a version/import snapshot of
`asset_registry_projection.continuity_refs`.

No current mutation path was proved to treat the candidate copy as canonical current metadata, so this is a drift risk rather than a confirmed bug.

#### B2 — Derived presentation permission
`s3_runtime_scene_state.allow_share_photo` is a legitimate derived current fact, but because it is persisted and has multiple transition writers it must remain invariant-consistent with gameplay/Discussion state.

No concrete mismatch is established by this audit.

#### B3 — S5 resolution provenance mirror
`s5_rounds.resolution_source` is SUPPORT_ONLY relative to the bound
`discussion_sessions.outcome.resolution_source`.

Current transactional synchronization reduces risk but does not make the mirror a second Authority.

### C. Obsolete / dead candidates

#### C1 — Asset metadata no longer sourced by the canonical registry
Marked **OBSOLETE_CANDIDATE**:

- `asset_candidates.scene_id`
- `asset_candidates.assigned_to`
- `asset_registry_projection.scene_id`
- `asset_registry_projection.assigned_to`

Evidence:
current `assets/asset-registry.json` does not contain these properties; current registry sync/import does not populate them; no meaningful current semantic consumer was found beyond generic state exposure.

They are **not RETIRED yet**. Live schema/data verification and dependency challenge are required before removal.

#### C2 — Legacy Sprint-1 scene-choice catalog
The four fields of `s1_scene_choices` are **DEAD_CANDIDATE** for formal gameplay:

- `scene_id`
- `choice_id`
- `choice_label`
- `active`

Current formal ACT1 role-specific choices are defined by the S3B flow/canonical V4 contract. Historical old-function references do not create a current production dependency.

Any new formal-gameplay dependency on this table would be an architecture regression.

### D. Legacy player-fact normalization

`s3b_player_facts` is **KEY_LEVEL_MIXED**, not table-wide Authority.

Narrow live exception:

- `gitte_flashlight_found` remains authoritative only for pre-GRAB optional-flashlight discovery.
- after acquisition, physical ownership Authority becomes `s3_player_items`.

Previously unresolved keys are now semantically disposed as durable Player knowledge/observation and should be normalized into the canonical Knowledge/Observation system rather than remain Memories Authority:

- `gitte_knows_basic_map`
- `gitte_map_detail`
- `anna_knows_library_passage`
- `anna_detected_devices`
- `linda_knows_tower_closed`

No new catalog key names are invented by this audit; canonical naming remains an implementation-contract step after CA challenge.

### E. Current-state mirrors that must never be fallback Authority

`game_runs` remains MIXED.

Support-only current-state mirrors/caches include:

- `scene_id`
- `phase_key`
- `step_key`
- `silent_texting_mode`
- `session_integrity_verified`
- `game_completed`

`active_override_id` is a provenance pointer, not “override currently active”.

Hard rule:

> missing modern state must produce UNKNOWN / invariant failure, not fallback to these mirrors.

## 4. What this closure does NOT authorize

This document does not authorize:

- deleting tables or columns;
- changing migrations;
- changing runtime functions;
- changing CFTM;
- changing gameplay;
- releasing CD from HOLD;
- freezing the Canonical Authority Registry without independent CA challenge.

## 5. Required next gate

**NEXT_OWNER = CA**

CA should independently challenge:

1. every A-series split-Authority candidate;
2. C-series obsolete/dead classification;
3. D-series legacy-fact normalization semantics;
4. E-series forbidden-fallback rules;
5. whether any target Authority conflicts with current canonical gameplay V4.0 or active production dependencies.

After CA challenge, GA/Teacher can freeze or revise the Authority Registry.

Only after that freeze should CD receive a bounded implementation/remediation package.
