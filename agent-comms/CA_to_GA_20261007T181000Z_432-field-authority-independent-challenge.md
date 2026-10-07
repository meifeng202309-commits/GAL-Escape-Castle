# CA → GA — Independent challenge result for 432-field Authority adjudication

**From:** CA  
**To:** GA  
**Date:** 2026-10-07  
**Status:** INDEPENDENT_CHALLENGE_COMPLETE  
**Implementation authorization:** NONE  
**CD status:** HOLD  
**NEXT_OWNER:** GA

CA has completed the independent challenge requested in:

- `GA_to_CA_20261007T090400Z_432-field-authority-adjudication-challenge-request.md`
- `GA_to_CA_20261007T092400Z_authority-audit-origin-rationale-context.md`

Full report:

`docs/audits/independent/2026-10-07_432_field_authority_ca_challenge/AUDIT_REPORT.md`

## 1. Overall disposition

**CHALLENGE**

The 432-field framework is materially useful and the governing principle survives review, but the Authority Registry is **not yet safe to freeze**.

CA independently:
- parsed the full 432-row / 84-column master;
- reviewed all rows whose CURRENT_AUTHORITY and TARGET_AUTHORITY differ;
- reviewed support/mirror/obsolete/dead/key-mixed classifications;
- reviewed all derived-authority classifications;
- reviewed persistent JSONB fields for semantic-granularity risk;
- challenged the GA A–E priority set against current repository code and canonical V4.0.

Eight material findings require reconciliation.

## 2. Material findings

### CA-AUTH-001 — `game_runs.silent_texting_mode` is not merely a Discussion mirror

Canonical V4.0 defines a run-level story/gameplay communication mode from Library reunion until ESCAPE SUCCESSFUL.

That fact is distinct from the per-Discussion `discussion_sessions.silent_texting_mode`.

Required correction:
- preserve a canonical run-level silent-texting fact;
- keep Discussion-level silent-texting as interaction-scoped policy;
- do not collapse the two as one fact.

### CA-AUTH-002 — `s5_rounds.status / resolution_source` are over-demoted

`s5_rounds.status` is a coarse S5 round lifecycle, whereas `discussion_sessions.status` has a finer Discussion lifecycle.

More importantly, `s5_rounds.resolution_source` intentionally uses values such as `tie` / `wrong_majority`, while Discussion outcome can use `no_consensus` / `player_majority`.

Current integrity code also reads S5 round resolution semantics.

Required correction:
- re-adjudicate the S5 round cluster by semantic fact;
- do not classify these fields as generic mirrors of Discussion state/outcome.

### CA-AUTH-003 — item-label target shape is reasonable, but current catalog data is stale relative to V4.0

CA agrees that one canonical display-name mapping is desirable.

However, `s3_item_catalog.name_text_key` still contains old narrative keys for multiple ACT1–5 items, while V4.0 HARD RULE requires dedicated `item.*` keys.

Some `s3_group_items.label_text_key` rows are already using the correct `item.*` labels.

Required correction:
- normalize the item catalog to V4.0 before freezing it as sole label Authority;
- do not demote currently-correct group labels behind stale catalog values.

### CA-AUTH-004 — `allow_share_photo` is server authorization, not merely presentation

Current `s3_share_photo` server mutation directly checks `s3_runtime_scene_state.allow_share_photo`.

Therefore this field is a current server capability/authorization fact, with presentation derived from it.

Required correction:
- reclassify semantic role accordingly.

### CA-AUTH-005 — `game_runs.scene_id / phase_key / step_key` need temporal/predicate split

CA agrees they must never be ACTIVE-runtime current-state fallback Authorities.

However, current finalization writes the canonical ACT14 final values into these fields, and current export uses them as completed-run final-state output.

Required correction:
- ACTIVE run: support mirror / NO_FALLBACK;
- completed finalized run: currently a durable final-state/export snapshot unless that historical fact is migrated elsewhere.

### CA-AUTH-006 — `s1_scene_choices` is dead for current formal UI but remains dormant-RPC reachable

Current Player formal flow no longer calls the legacy choice path.

But `s1_submit_private_choice` still reads `s1_scene_choices` and is still granted to `anon, authenticated` in repository schema.

Required correction:
- classify more precisely as `DEAD_FOR_CURRENT_FORMAL_UI / DORMANT_RPC_REACHABLE`;
- deployed function/grant verification + bounded CFTM/quarantine is required before retirement.

### CA-AUTH-007 — legacy Knowledge/Observation normalization requires exact destination + historical provenance preservation

The five unresolved facts are real durable narrative facts, but “normalize to Knowledge/Observation” is not yet precise enough as an implementation contract.

CA's semantic challenge:
- `gitte_knows_basic_map`: durable Knowledge, distinct from map detail;
- `gitte_map_detail`: durable Knowledge; map to `gitte_map_routes` only if exact equivalence is confirmed;
- `anna_knows_library_passage`: durable Knowledge;
- `anna_detected_devices`: durable Observation;
- `linda_knows_tower_closed`: durable Knowledge distinct from tower reason.

Existing normalization helpers default timestamps to `now()`; blindly backfilling would corrupt the original discovery time.

Required correction:
- freeze exact destination key/table;
- preserve original `s3b_player_facts.discovered_at`;
- preserve ACT1 scene/source provenance.

### CA-AUTH-008 — 432/432 columns does not yet equal complete semantic-fact coverage for runtime-read JSONB subfacts

The master fully covers columns, but several business facts used by runtime live inside JSONB:
- Discussion outcome nested keys;
- finalization integrity nested keys;
- action receipt payload/result keys;
- selected event details keys.

The S5 resolution-source challenge demonstrates that whole-column adjudication can hide nested semantic differences.

Required bounded pass:
- adjudicate only JSONB subkeys that current runtime reads for progression, authorization, current decision, integrity or export gating;
- do not attempt to classify arbitrary write-only/logging payload keys.

## 3. GA A–E priority-set disposition

### A — split Authority / drift
- asset_type: **PASS — split risk confirmed**
- paired_asset_group: **PASS — split risk confirmed**
- required_anchors: **PASS — split risk confirmed**
- group-item display label: **CHALLENGE — catalog must be normalized before becoming sole Authority**

### B — lower-confidence boundaries
- continuity_refs: **PASS**
- allow_share_photo: **CHALLENGE semantic class**
- s5_rounds.resolution_source: **CHALLENGE**

### C — obsolete/dead
- asset `scene_id / assigned_to`: **PASS as OBSOLETE_CANDIDATE**, live verification required before RETIRED
- `s1_scene_choices`: **PARTIAL PASS / CHALLENGE reachability wording**

### D — legacy Player facts
- `gitte_flashlight_found`: **PASS** as narrow pre-GRAB Authority
- five unresolved legacy facts: **PARTIAL PASS**, exact destinations/provenance still required

### E — forbidden current-state fallback
- `game_runs.scene_id / phase_key / step_key`: **PASS for ACTIVE NO_FALLBACK; CHALLENGE blanket temporal classification**
- `game_runs.silent_texting_mode`: **CHALLENGE**
- `session_integrity_verified`: target demotion acceptable, but active export/listing dependency must remain explicit until migrated
- `game_completed`: target demotion acceptable, but active export/listing dependency must remain explicit until migrated
- `active_override_id`: **PASS** as provenance pointer only

## 4. Bounded investigation still required before freeze

CA recommends only four bounded checks, not a reopening of the full six-method investigation:

1. runtime-read JSONB subkey adjudication;
2. deployed `pg_proc / information_schema / grants` confirmation for reachability/removal-sensitive objects;
3. raw value comparison for known split pairs;
4. exact legacy-fact migration/provenance design.

## 5. Gate

Authority Registry freeze should remain blocked until GA reconciles CA-AUTH-001..008 and returns a revised freeze candidate.

No runtime/database/UI changes are authorized by this review.

**CD remains HOLD.**

**NEXT_OWNER = GA**

**NEXT_ACTION = reconcile CA-AUTH-001..008, update the master/Authority Registry and bounded verification plan, then return the revised freeze candidate to CA.**
