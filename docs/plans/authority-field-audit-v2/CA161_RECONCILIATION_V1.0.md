# CA-161 Authority Challenge Reconciliation V1.0

**Date:** 2026-10-07  
**Owner:** GA  
**Source challenge:** CA-161 / `CA_to_GA_20261007T181000Z_432-field-authority-independent-challenge.md`  
**Implementation authorization:** NONE  
**CD status:** HOLD

## 1. Overall GA disposition

GA accepts the **core substance of all eight CA findings**.

No CA-AUTH-001..008 finding is rejected.

The challenge does not overturn the one-fact/one-authority architecture. It improves the semantic granularity in four ways:

1. scope split — run-level vs interaction-level;
2. subject split — S5 round vs Discussion lifecycle/outcome;
3. predicate/temporal split — ACTIVE vs FINALIZED meaning of the same physical column;
4. nested-fact split — JSONB parent column vs runtime-read semantic subfacts.

The revised master remains the primary field-level working table:

`SIX_METHOD_432_FIELD_FACTS_MASTER_V3.0.csv`

The revised architecture candidate is:

`ROUND1_CANONICAL_AUTHORITY_REGISTRY_V0.3_FREEZE_CANDIDATE.md`

The bounded JSONB subfact register is:

`JSONB_RUNTIME_READ_SUBFACTS_V1.0.csv`

---

## 2. CA-AUTH-001 — ACCEPTED

### Problem
GA had demoted `game_runs.silent_texting_mode` to a mirror of `discussion_sessions.silent_texting_mode`.

### Reconciled semantics
They are **DIFFERENT_FACT_SCOPE**:

- `game_runs.silent_texting_mode` = run-level gameplay/story communication mode;
- `discussion_sessions.silent_texting_mode` = one Discussion instance's communication policy.

V4.0 explicitly states that after Library reunion silent-texting remains active until ESCAPE SUCCESSFUL.

### Master correction
`game_runs#10` is now:

`RUN_LEVEL_COMMUNICATION_MODE_AUTHORITY`.

---

## 3. CA-AUTH-002 — ACCEPTED

### Problem
GA had over-demoted `s5_rounds.status / resolution_source` as mirrors of Discussion lifecycle/outcome.

### Reconciled semantics

`s5_rounds.status`
= coarse S5 round lifecycle.

`discussion_sessions.status`
= finer Discussion lifecycle.

These are different subjects/granularities.

`s5_rounds.resolution_source`
= S5 round result classification such as:
- `tie`;
- `wrong_majority`;
- `player_majority`;
- `system_fallback`.

`discussion_sessions.outcome.resolution_source`
= Discussion resolution method/provenance such as:
- `no_consensus`;
- `player_majority`;
- `system_fallback`.

These are not one fact.

### Additional correction
`s5_rounds.resolved_at` is treated as the timestamp when the **S5 round** became resolved, rather than automatically inheriting the semantic status of Discussion ended_at.

---

## 4. CA-AUTH-003 — ACCEPTED

### Problem
The proposed target:
`s3_item_catalog.name_text_key`
as sole current item-label Authority is structurally sound, but current seed data is stale relative to V4.0.

### Reconciled current state

Current runtime has a split:

- personal-item rendering reads `s3_item_catalog.name_text_key`;
- group-item state directly exposes `s3_group_items.label_text_key`;
- several current group labels already use the correct `item.*` keys;
- several ACT1–5 catalog rows still use old narrative `act...` keys.

### Target contract

After normalization:

> `s3_item_catalog.name_text_key` is the sole current item display-name mapping.

Required V4 labels include:
- `item.castle_map`
- `item.number_note`
- `item.flashlight`
- `item.servant_diary`
- `item.stopped_watch`
- `item.silver_star_key`
- `item.municipal_closure_order`
- `item.photo_1897`
- `item.torn_note`
- `item.golden_key`

Until normalization, current correct group-row labels must not be treated as inferior to stale catalog values.

---

## 5. CA-AUTH-004 — ACCEPTED

`s3_runtime_scene_state.allow_share_photo` is reclassified from presentation permission to:

> **CURRENT_SERVER_SHARE_AUTHORIZATION_AUTHORITY**

Reason:

`s3_share_photo` directly checks this field before permitting the server mutation.

Presentation may derive button visibility/capability from it, but the server field is an authorization input, not decorative state.

---

## 6. CA-AUTH-005 — ACCEPTED

### Problem
Blanket SUPPORT classification for:
- `game_runs.scene_id`
- `game_runs.phase_key`
- `game_runs.step_key`

lost the completed-run meaning.

### Reconciled predicate split

#### ACTIVE run
These are compatibility/support mirrors.

Hard rule:

> **NO_FALLBACK** to them for current ACTIVE progression/presentation.

#### Canonically FINALIZED run
Current finalization writes:

- `scene_id = act14_final_reveal`
- `phase_key = act14_complete`
- `step_key = ending`

and export reads them as completed-run final-state output.

Therefore they currently own a separate:

> durable FINALIZED final-state/export snapshot fact.

A future migration may move that final snapshot into an explicit finalization structure, but that is not assumed by this audit.

---

## 7. CA-AUTH-006 — ACCEPTED

`s1_scene_choices` is reclassified:

> **DEAD_FOR_CURRENT_FORMAL_UI / DORMANT_RPC_REACHABLE**

Current formal Player flow does not use the legacy choice system.

However repository code still contains:
`s1_submit_private_choice`

which reads `s1_scene_choices`, and migration 001 grants that RPC to browser roles.

Therefore:
- not current formal-gameplay Authority;
- not safe to call deployed-unreachable;
- no retirement until deployed `pg_proc` / grant verification and explicit legacy RPC quarantine/CFTM disposition.

---

## 8. CA-AUTH-007 — ACCEPTED

The five previously unresolved legacy facts now have exact target destinations.

| legacy fact | exact target | provenance rule |
|---|---|---|
| `gitte_knows_basic_map` | Knowledge `gitte_basic_map` | ACT1 direct observation; preserve legacy time |
| `gitte_map_detail` | Knowledge `gitte_map_routes` | detailed Castle Map route knowledge; preserve legacy time |
| `anna_knows_library_passage` | Knowledge `anna_library_passage` | ACT1 direct observation; preserve legacy time |
| `anna_detected_devices` | Observation `local_devices_detected`, display `act01-a.014` | ACT1 scene; preserve legacy time |
| `linda_knows_tower_closed` | Knowledge `linda_tower_closed` | distinct from tower reason; preserve legacy time |

### Why `gitte_map_detail → gitte_map_routes`

V4.0 defines the Gitte first-action detail as route knowledge discovered from the Castle Map:
- Library route connectivity;
- Library → Main Hall → Portrait Hall route;
- Great Hall inner iron-gate structure.

The existing canonical knowledge identity `gitte_map_routes` is the Pocket/map-inspection identity for this detailed map-route knowledge.

`gitte_knows_basic_map` remains distinct and gets its own `gitte_basic_map` identity.

### Historical provenance invariant

Existing helpers default canonical knowledge/observation timestamps to `now()`.

That is unacceptable for historical normalization.

Existing legacy `s3b_player_facts.discovered_at` must be copied to:
- `s3_player_knowledge.delivered_at`; or
- `s3_player_observations.discovered_at`.

Scene/source provenance must remain ACT1 / `act1_wake_up`.

---

## 9. CA-AUTH-008 — ACCEPTED AND BOUNDED PASS COMPLETED

GA reviewed all 20 persistent JSONB parent fields and created:

`JSONB_RUNTIME_READ_SUBFACTS_V1.0.csv`

The register contains 48 explicit nested-fact/review rows.

Material nested facts include:

- Discussion:
  - `outcome.choice_id`;
  - compatibility `outcome.resolution_id`;
  - `outcome.resolution_source`;
  - `vote_options[*].id`;
  - `vote_options[*].label`.

- Asset authorization:
  - `ui_anchors[*].anchor_name`;
  - registry/candidate `required_anchors[*]`.

- Pocket authorization:
  - `shareable_views[*]`.

- S6 idempotency:
  - `payload.phase / step / round / choice / role`;
  - `result.*`.

- Final integrity:
  - `integrity_report.verified`;
  - 20 named `integrity_report.obligations[...].state` facts.

- Event/override provenance:
  - normalized-vs-payload `behavior_scoring`;
  - event `context_provenance`;
  - override invalidated-scope/value evidence.

JSONB payloads with no current progression/authorization/current-decision/integrity role remain historical/evidence payloads and are not promoted to current state Authority.

---

## 10. Bounded pre-freeze checks

CA asked for four checks.

### COMPLETE — repository evidence
1. runtime-read JSONB subkey adjudication.
2. exact legacy-fact destination + provenance design.

### BLOCKED_EXTERNAL in current GA environment
3. deployed `pg_proc / information_schema / grants` verification.
4. raw database value comparison for known split pairs.

These two missing measurements are not inferred.

They remain explicit deployment-evidence gates.

---

## 11. Freeze status

Semantic reconciliation is complete from repository evidence.

**Authority Registry is now a revised FREEZE CANDIDATE, not yet FROZEN.**

Remaining blockers are bounded external measurements, not unresolved GA semantic reasoning.

CD remains HOLD.

