# CA Independent Challenge — 432-field Authority Adjudication

**Date:** 2026-10-07  
**Reviewer:** CA  
**Scope:** Independent challenge of `SIX_METHOD_432_FIELD_FACTS_MASTER_V3.0.csv`, Authority Adjudication Closure V1.0, Active Dependency Audit V1.1, and Canonical Authority Registry V0.2 draft.  
**Implementation authorization:** NONE  
**CD status:** HOLD

## 1. Disposition

**Framework result: CHALLENGE — direction is sound, but Authority Registry freeze is not yet safe.**

CA independently parsed the complete 432-row / 84-column master and performed:
- completeness checks over all 432 fields;
- review of all 36 rows whose CURRENT_AUTHORITY and TARGET_AUTHORITY differ;
- review of all support/mirror/obsolete/dead/key-mixed classifications;
- review of all derived-authority classifications;
- review of all 20 JSONB persistent fields for semantic-granularity risk;
- repository code/spec challenge of GA's A–E priority set;
- targeted current-path review of asset runtime, S3/Pocket, S5 Discussion, S8 finalization, legacy Sprint-1 RPC, Teacher projection, and canonical V4.0 requirements.

The governing principle remains correct:

> one semantic business fact should have one explicit current Authority, while historical snapshots, provenance, caches and compatibility copies remain bounded.

However, CA found **8 material corrections / bounded verification requirements** before freeze.

---

# 2. Material findings

## CA-AUTH-001 — CHALLENGE: `game_runs.silent_texting_mode` and `discussion_sessions.silent_texting_mode` are not the same fact

GA classifies:

- `game_runs.silent_texting_mode` = SUPPORT_ONLY run-level mirror;
- `discussion_sessions.silent_texting_mode` = current interaction authority.

This collapses two different scopes.

Canonical V4.0 explicitly defines a **run-level gameplay mode**:

- after the three GALs reunite in the Library, `silent_texting_mode = true`;
- it remains true **until ESCAPE SUCCESSFUL**;
- individual DiscussionRooms operate inside that already-active global mode.

Evidence:
- `docs/specs/current/古堡逃脱游戏脚本 V4.0.md` §12 / §18.2 / multiplayer rules;
- `database/007_sprint3b_act1_5_placeholder_flow.sql` writes `game_runs.silent_texting_mode=true` at Library reunion;
- `database/054_level3_integrated_closure.sql` preserves the same run-level write;
- Discussion rows separately persist per-interaction `silent_texting_mode`.

### CA conclusion

These are **DIFFERENT_FACT_SCOPE**:

1. `game_runs.silent_texting_mode` — run-level story/gameplay communication mode;
2. `discussion_sessions.silent_texting_mode` — the mode configured for one Discussion instance.

The Discussion value may be derived from the run mode, but does not replace it.

**Required correction:** do not demote the run-level field as a mere mirror unless the product deliberately migrates the global mode to another canonical run-level owner.

---

## CA-AUTH-002 — CHALLENGE: `s5_rounds.status` and `s5_rounds.resolution_source` are over-demoted as Discussion mirrors

### A. `s5_rounds.status`

GA marks it as SUPPORT_ONLY lifecycle mirror of `discussion_sessions.status`.

But current semantics differ:

- `s5_rounds.status` is coarse **S5 round unresolved/resolved state**;
- `discussion_sessions.status` has finer states such as discussion / voting / waiting / resolved.

Current Teacher Open Vote changes `discussion_sessions.status` to `voting` without changing `s5_rounds.status`.

Evidence:
- `database/027_sprint5_act6_8_runtime.sql`;
- `database/031_sprint5_focused_reaudit_corrections.sql::s5_teacher_open_vote`.

Therefore the two statuses are not lossless copies.

### B. `s5_rounds.resolution_source`

GA classifies it as a mirror of `discussion_sessions.outcome.resolution_source`.

Repository code proves intentional semantic divergence:

- S5 round may record `tie`, while Discussion outcome records `no_consensus`;
- ACT7 can record `wrong_majority` in `s5_rounds.resolution_source`, while Discussion outcome records `player_majority` because the *method* was player majority;
- `database/053_sprint8_act6_effective_round_integrity.sql` currently reads `s5_rounds.resolution_source='player_majority'` as integrity evidence.

Thus one field can encode **S5 round result class**, while the Discussion field encodes **Discussion resolution method/provenance**.

### CA conclusion

The S5 round cluster needs re-adjudication at fact level.

At minimum:
- do not declare `s5_rounds.status` a simple mirror;
- do not declare `s5_rounds.resolution_source` globally the same fact as `discussion_sessions.outcome.resolution_source`;
- preserve the current integrity dependency until a deliberate canonical replacement exists.

`s5_rounds.resolved_at` may still be redundant with Discussion end time, but should be reviewed as a historical round-resolution timestamp rather than automatically inherited from the status conclusion.

---

## CA-AUTH-003 — CHALLENGE: chosen item-label Authority slot is structurally sensible, but current catalog values violate V4.0

GA chooses:

- `s3_item_catalog.name_text_key` as canonical current item display-name mapping;
- `s3_group_items.label_text_key` as SUPPORT_ONLY copy.

The **target shape is reasonable**, but the current catalog cannot yet be frozen as correct Authority because repository data initialization conflicts with the V4.0 HARD RULE.

Canonical V4.0 requires dedicated `item.*` display keys, including:

- `item.castle_map`
- `item.number_note`
- `item.flashlight`
- `item.servant_diary`
- `item.stopped_watch`
- `item.silver_star_key`
- `item.municipal_closure_order`
- `item.photo_1897`
- `item.torn_note`

But `database/007_sprint3b_act1_5_placeholder_flow.sql` initializes these catalog rows with older narrative keys such as:
- `act03.007`
- `act03.010`
- `act04-05.004`
- `act01-a.008`
- `act01-l.002`
- `act01-l.003`
- `act01-l.007`
- `act03.006`
- `act03.016`.

By contrast, later group-item creation in `database/014_sprint3b_evidence_and_puzzle_integrity.sql` already writes:
- `item.photo_1897`
- `item.torn_note`.

`database/035_sprint6_focused_audit_corrections.sql` normalizes `golden_key` to `item.golden_key`, but does not normalize the ACT1–5 catalog rows above.

### CA conclusion

This is not merely a hypothetical future drift risk. Static repository history shows a **current canonical-spec/catalog mismatch**.

**Required correction before Authority freeze:** either:
1. normalize the catalog rows to V4.0 dedicated `item.*` keys and keep catalog as sole current label Authority; or
2. choose another explicitly normalized canonical source.

Do not demote currently-correct group labels in favor of stale catalog values.

---

## CA-AUTH-004 — CHALLENGE: `s3_runtime_scene_state.allow_share_photo` is not merely a presentation permission

GA classifies this field as:

> DERIVED_PRESENTATION_PERMISSION_AUTHORITY

But current server mutation logic directly checks it:

`s3_share_photo` rejects sharing unless `s3_runtime_scene_state.allow_share_photo=true`.

Evidence:
- `database/014_sprint3b_evidence_and_puzzle_integrity.sql::s3_share_photo`;
- V4.0 says `allow_share_photo` is scene-controlled and governs whether SHARE PHOTO is permitted.

### CA conclusion

The field may remain authoritative, but its semantic class must be stronger:

> **CURRENT_SERVER_SHARE_AUTHORIZATION / capability authority**, with presentation derived from it.

This matters for the new Resolver/View Snapshot boundary:
- Snapshot may expose the capability;
- client UI may show/hide the button;
- server mutation remains final validator;
- the field must not be treated as merely decorative presentation state.

---

## CA-AUTH-005 — CHALLENGE: `game_runs.scene_id / phase_key / step_key` are support-only for ACTIVE current state, but have a separate completed-run historical/export role

CA agrees with GA's hard rule:

> new ACTIVE-runtime current-state logic must never fall back to `game_runs.scene_id / phase_key / step_key`.

Current Teacher projection already violates this via `coalesce(s.scene_id,g.scene_id)` etc. in:
- `database/043_sprint7_teacher_console.sql::s7_get_teacher_console`.

However, the master gives each field one blanket SUPPORT_CURRENT_STATE_MIRROR classification.

Current finalization explicitly writes:
- `scene_id='act14_final_reveal'`
- `phase_key='act14_complete'`
- `step_key='ending'`

and current export paths use those values as final-state output.

Evidence:
- `database/049_sprint8_final_closure.sql::s8_finalize`;
- `database/047_sprint8_export_completeness.sql`;
- `database/048_sprint8_focused_level1_corrections.sql`.

### CA conclusion

These fields need a **predicate/temporal split**:

- while run is ACTIVE: legacy/support mirror, forbidden as current-state fallback;
- after canonical finalization: currently serve as a durable final-state/export snapshot unless/until that historical fact is migrated to an explicit finalization authority.

This is exactly the current-vs-historical distinction the audit is intended to preserve.

---

## CA-AUTH-006 — CHALLENGE / bounded verification: `s1_scene_choices` is UI-dead but still RPC-reachable

GA marks the table as the sole clear table-level DEAD_CANDIDATE for formal gameplay.

CA confirms:
- current Player top-level/event graph does not call `renderState()`, `submitChoice()`, or `refreshSprint3b()`;
- current formal ACT1 uses S3B role-specific choices.

However, `s1_submit_private_choice`:
- still directly reads `s1_scene_choices`;
- remains granted to `anon, authenticated` in `database/001_sprint1_core.sql`.

Therefore the table is not fully unreachable from the deployed API surface even if the normal UI does not call it.

### CA conclusion

Use the more precise status:

> **DEAD_FOR_CURRENT_FORMAL_UI / DORMANT_RPC_REACHABLE**

rather than treating “dead candidate” as equivalent to unreachable runtime object.

This does not make it a current gameplay Authority, but it blocks any assumption that it is safe to retire without:
- deployed function/grant verification;
- CFTM/quarantine;
- explicit legacy RPC disposition.

---

## CA-AUTH-007 — CHALLENGE: legacy fact normalization is semantically right, but exact destination + original discovery provenance must be frozen

CA agrees with the direction that the five unresolved legacy facts should not remain a new generic Memories authority.

Canonical semantic disposition should be explicit:

- `gitte_knows_basic_map` — durable Knowledge, distinct from detailed map-route knowledge;
- `gitte_map_detail` — durable Knowledge; may map to `gitte_map_routes` only if GA confirms exact semantic equivalence;
- `anna_knows_library_passage` — durable Knowledge;
- `anna_detected_devices` — durable Observation;
- `linda_knows_tower_closed` — durable Knowledge, distinct from `linda_tower_reason`.

Evidence:
- V4.0 ACT1 explicitly records each fact at the point the Player learns/observes it;
- `database/009_sprint3b_act1_consequence_integrity.sql` records them in `s3b_player_facts`.

### Provenance problem

Current canonical helper functions:
- `s3_record_observation`
- `s3_record_knowledge`

default discovery/delivery timestamps to `now()`.

If existing legacy facts are normalized later using those helpers, the system would rewrite “when the Player learned it” to migration time.

### CA conclusion

Before W04 / Authority Registry freeze of these keys:
- assign exact Knowledge vs Observation destination and canonical key;
- preserve original `s3b_player_facts.discovered_at` into canonical `discovered_at / delivered_at` for existing runs;
- preserve correct ACT1 scene/source provenance;
- do not collapse `gitte_knows_basic_map` and `gitte_map_detail` unless exact semantic equivalence is proven.

The master V3 statement “durable Knowledge/Observation” is directionally correct but not yet precise enough to be an implementation contract.

---

## CA-AUTH-008 — CHALLENGE to completeness claim: 432/432 columns does not equal 100% semantic-fact coverage because JSONB subfacts remain

The master fully covers 432 persistent **columns**, but at least 20 persistent columns are JSONB.

Several canonical facts used by the Authority Registry live inside those JSON values, for example:
- `discussion_sessions.outcome.resolution_source`;
- `discussion_sessions.outcome.choice_id`;
- `s8_finalizations.integrity_report.verified`;
- `s8_finalizations.integrity_report.obligations.*`;
- `s6_action_receipts.payload.*`;
- event `details.*` provenance fields.

The field-level row for a JSONB column cannot by itself prove that every runtime-read nested key has one correct Authority.

This limitation is already visible in CA-AUTH-002: the whole `discussion_sessions.outcome` column is adjudicated as Authority, yet one nested key (`resolution_source`) was incorrectly equated with the S5 round field.

### CA conclusion

Do **not** discard the 432-field master. Add one bounded pre-freeze pass:

> enumerate only JSONB subkeys that current runtime code actually reads as decision/authorization/progression/integrity inputs, and adjudicate those nested facts.

Do not attempt to classify arbitrary logging payload keys that are never read.

---

# 3. GA priority-set results

## A — potential split Authority / drift

### A1 asset_type — PASS, split risk confirmed
Registry JSON declares canonical asset identity/version authority. Current import validates/copies registry `asset_type`, while current `asset_resolve` still emits candidate `asset_type`.

Target current authority: registry projection.  
Candidate field: version/import snapshot.

### A2 paired_asset_group — PASS, split risk confirmed
Latest group-transition logic reads candidate group identity for `grp/provided` while registry projection supplies expected membership.

Target current group membership should come from registry projection.

### A3 required_anchors — PASS, split risk confirmed
Latest activation path validates candidate-copied `required_anchors`, while registry sync can update current requirements.

Target current requirement source should be registry projection.

### A4 group-item display label — CHALLENGE WITH CORRECTION
Same-fact duplication risk is real, but the proposed catalog authority currently contains stale/non-V4 label values. See CA-AUTH-003.

---

## B — lower-confidence boundaries

### B1 continuity_refs — PASS
Candidate value is a version/import snapshot; registry projection is current continuity metadata. No current mutation path found that requires candidate copy as current authority.

### B2 allow_share_photo — CHALLENGE semantic class
Field is actual server authorization input, not only presentation. See CA-AUTH-004.

### B3 s5_rounds.resolution_source — CHALLENGE
Not a general mirror of Discussion outcome; current values intentionally diverge by meaning. See CA-AUTH-002.

---

## C — obsolete/dead candidates

### Asset `scene_id / assigned_to` — PASS as OBSOLETE_CANDIDATE
Current registry JSON omits them; current registry sync/import does not populate them; Teacher asset UI does not consume them semantically.

Live DB verification is still required before RETIRED/removal.

### `s1_scene_choices` — PARTIAL PASS / CHALLENGE reachability wording
Dead for current formal UI, but legacy RPC remains executable and reads it. See CA-AUTH-006.

---

## D — legacy player facts

### `gitte_flashlight_found` — PASS
Current trigger uses it as narrow pre-GRAB optional-item discovery authority. After GRAB, physical ownership authority correctly moves to `s3_player_items`.

### Five unresolved keys — PARTIAL PASS
Durable Knowledge/Observation direction is correct, but exact per-key destination and historical timestamp migration remain unresolved. See CA-AUTH-007.

---

## E — forbidden current-state fallback

### `game_runs.scene_id / phase_key / step_key`
PASS for the rule **during ACTIVE gameplay**: no current-state fallback.

CHALLENGE blanket field classification because completed-run final-state/export role is distinct. See CA-AUTH-005.

### `game_runs.silent_texting_mode`
CHALLENGE. It owns a separate run-level story/gameplay fact. See CA-AUTH-001.

### `game_runs.session_integrity_verified`
Target semantic demotion is acceptable: `s8_finalizations.integrity_report.verified` is the evidence truth.

But current production export/listing functions still use the boolean as an operational gate. Registry should explicitly record this as an active support dependency that must be migrated, not imply it is unused.

### `game_runs.game_completed`
Target semantic demotion is acceptable as a completion mirror; current export/listing still reads it and therefore requires bounded remediation before retirement.

### `game_runs.active_override_id`
PASS as provenance pointer only. It is not a reliable “override currently active” authority.

---

# 4. Additional bounded investigation required before Authority Registry freeze

CA recommends four bounded checks before freeze:

1. **JSONB runtime-read subkey adjudication**
   - only nested keys currently read for progression, authorization, current decisions, integrity, or export gating.

2. **Live/deployed schema-function confirmation**
   - deployed `pg_proc / information_schema / grants` for objects whose status depends on current function reachability or removal safety;
   - especially `s1_submit_private_choice`, asset functions, and latest S5/S8 functions.

3. **Raw pair-value comparison for known split pairs**
   - registry vs candidate: asset_type / paired_asset_group / required_anchors;
   - catalog vs group-item label;
   - current support mirrors where remediation depends on divergence.
   
   Lack of live divergence does not change target Authority, but it determines whether remediation is preventive or correcting live inconsistent data.

4. **Legacy-fact row migration design**
   - exact destination key/table;
   - copy original discovery timestamp and ACT1 provenance;
   - no `now()` substitution for existing historical facts.

These are bounded; CA does not recommend reopening the full six-method investigation.

---

# 5. Overall conclusion

The 432-field audit is valuable and the majority of its semantic framework survives challenge.

However, freeze is premature because several conclusions would currently teach the Core Resolver the wrong fact boundary:

- global silent-texting mode vs per-Discussion setting;
- S5 round lifecycle/result semantics vs Discussion lifecycle/outcome;
- stale item catalog labels vs V4.0 canonical item labels;
- server share authorization vs presentation-only permission;
- active-state mirrors vs completed-run final snapshots;
- UI-dead vs RPC-reachable legacy catalog;
- Knowledge/Observation normalization without exact provenance;
- unadjudicated runtime-read JSONB subfacts.

**CA result: CHALLENGE.**

No CD release is authorized.

**NEXT_OWNER: GA**  
**NEXT_ACTION:** reconcile CA-AUTH-001..008, update the master/Authority Registry, complete the bounded pre-freeze checks above, then return a revised freeze candidate to CA.
