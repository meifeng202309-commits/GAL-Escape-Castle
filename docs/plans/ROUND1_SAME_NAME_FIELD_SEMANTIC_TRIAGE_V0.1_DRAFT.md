# Round-1 Same-Name Field Semantic Triage V0.1 — GA preliminary review

> Date: 2026-10-07
> Owner: GA
> Status: PRELIMINARY / NOT CANONICAL / NOT ARCHITECTURE FREEZE
> CD implementation authorization: NONE — HOLD remains in force

## Scope and evidence limit

- Reviewed all **55 same-name column groups / 257 field occurrences** from `ROUND1_SAME_NAME_FIELD_REVIEW_QUEUE_V1.0.csv`, with the field-ID inventory, mechanical SQL read/write overview, gameplay V4.0, and the current authority-registry V0.2 draft as context.
- This is **group-level semantic triage**, not a final per-field source-of-truth disposition. The mechanical scan includes superseded migration/function definitions; some JavaScript references and trigger effects are unresolved. A `DIFFERENT_FACT` label means the broad group must **not** be automatically collapsed; it does not rule out a narrower same-fact pair discovered later.
- **Identifier/reference columns are not duplicate mutable facts:** a foreign key repeating `player_id`, `run_id`, `item_key`, etc. expresses a relationship and must not be deleted, redirected, or treated as an independent state authority merely because names match.
- For `UNRESOLVED`, GA must inspect **effective current writer/reader contracts**, per-entity scope, active versus historical record identity and copy/projection provenance. Teacher/GA semantic disposition and CA independent review remain necessary before authority freeze.

## Preliminary group decisions

Counts: DIFFERENT_FACT = 39; UNRESOLVED = 16; SAME_FACT = 0 (none asserted without an effective current-code copy proof).

| Group | Column | Preliminary class | Why / required follow-up |
|---|---|---|---|
| SN001 | `acquired_at` (2) | DIFFERENT_FACT | Acquisition of a shared/group item versus acquisition of one player's item; owner/scope differ. |
| SN002 | `act6_entered_at` (2) | DIFFERENT_FACT | Per-player ACT6 entry timestamp versus run-level S5 entry-barrier timestamp; cannot merge. |
| SN003 | `act_no` (4) | DIFFERENT_FACT | Current runtime ACT number, event ACT label, and clue ACT association are different record-scoped facts. |
| SN004 | `actor_player_id` (2) | DIFFERENT_FACT | Actor for distinct event records in current versus legacy ledgers; not one mutable actor slot. |
| SN005 | `allow_share_photo` (2) | UNRESOLVED | Scene-level share permission versus active DiscussionSession permission; verify effective-session synchronization and temporal scope. |
| SN006 | `asset_key` (3) | DIFFERENT_FACT | Asset identity key appears as catalog/projection identity and as candidate/event reference; references are not competing mutable facts. |
| SN007 | `asset_type` (2) | UNRESOLVED | Candidate asset type versus current registry projection type may be same versioned metadata; verify approval/activation source. |
| SN008 | `assigned_to` (2) | UNRESOLVED | Candidate assignment versus registry projected assignment; compare per-version and active-asset ownership semantics. |
| SN009 | `behavior_scoring` (3) | DIFFERENT_FACT | Behavior-scoring/eligibility is scoped separately to event, decision/vote, or override evidence. |
| SN010 | `choice_id` (7) | UNRESOLVED | Choice IDs in distinct ACT/runtime decision tables differ; legacy/current overlapping choices need field- and decision-identity comparisons. |
| SN011 | `choice_label` (3) | UNRESOLVED | Choice label in option catalog versus stored decision label and legacy shadow; determine whether label is snapshot or canonical copy. |
| SN012 | `cinematic_stage` (2) | DIFFERENT_FACT | Audio occurrence's recorded cinematic stage is historical context; s6 current stage is mutable runtime state. |
| SN013 | `client_request_id` (8) | DIFFERENT_FACT | Client request IDs identify individual command/retry domains; copies may link a command but are not a global mutable state fact. |
| SN014 | `completed_at` (3) | DIFFERENT_FACT | Run completion, S5 phase completion, and S6 station-task completion have distinct subjects. |
| SN015 | `continuity_refs` (2) | UNRESOLVED | Candidate versus active registry continuity references may be direct versioned copies; compare selected-version identity. |
| SN016 | `created_at` (11) | DIFFERENT_FACT | created_at belongs to each distinct record's creation event, not a globally shared timestamp. |
| SN017 | `decision_id` (2) | UNRESOLVED | Generic vs legacy decision IDs may refer to different decision identities or shadow records; check migration/runtime overlap. |
| SN018 | `decision_type` (3) | DIFFERENT_FACT | decision_type is an attribute of each separately scoped decision/vote record. |
| SN019 | `delivered_at` (2) | DIFFERENT_FACT | Knowledge delivery versus ACT6 private-clue delivery are different delivery events and contexts. |
| SN020 | `details` (4) | DIFFERENT_FACT | Details payload describes a particular event in its respective ledger. |
| SN021 | `discovered_at` (2) | UNRESOLVED | Observation discovery and legacy player fact discovery may represent one learned event or different evidence/provenance. |
| SN022 | `discussion_session_id` (5) | DIFFERENT_FACT | Session primary key versus relationship/reference columns on messages/events/rounds; do not collapse foreign keys. |
| SN023 | `display_name` (2) | DIFFERENT_FACT | Asset display name and room player's display name label different entities. |
| SN024 | `display_text_key` (2) | UNRESOLVED | Observation-catalog display text versus player-observation display text may be versioned label mirror or recipient-specific snapshot. |
| SN025 | `event_id` (4) | DIFFERENT_FACT | Event IDs are identities of separate ledger records; cross-ledger mirroring must be assessed on event identity, not name. |
| SN026 | `event_type` (4) | DIFFERENT_FACT | event_type describes the individual ledger event, not one shared mutable event-type fact. |
| SN027 | `item_key` (5) | DIFFERENT_FACT | Item catalog key and per-run/per-player ownership, view-state, and inspection references are separate relationships. |
| SN028 | `knowledge_key` (3) | DIFFERENT_FACT | Knowledge catalog identity, per-player learned knowledge, and private-clue association have distinct fact scopes. |
| SN029 | `label_text_key` (2) | DIFFERENT_FACT | Label of group item versus label of shared photograph pertains to different artifact instances. |
| SN030 | `locked_at` (7) | DIFFERENT_FACT | Each independently locked decision/vote/allocation has its own lock timestamp. |
| SN031 | `observation_key` (2) | DIFFERENT_FACT | Observation catalog identity versus particular player's observation association. |
| SN032 | `occurrence_id` (3) | DIFFERENT_FACT | Audio occurrence identity versus event and per-player consumption reference; one-to-many relationship is not duplicated current state. |
| SN033 | `outcome` (2) | DIFFERENT_FACT | Discussion resolution outcome and audio consumption outcome concern different operations. |
| SN034 | `override_id` (2) | DIFFERENT_FACT | Override identity versus validity record's reference to that override; referential relationship. |
| SN035 | `paired_asset_group` (2) | UNRESOLVED | Candidate paired-asset group versus active registry projection; test whether pairing is versioned and copied. |
| SN036 | `phase_key` (13) | UNRESOLVED | phase_key mixes authoritative S5/S6 phase, historic event snapshots, Discussion phase, and forbidden game_runs mirror; subdivide by owner and event identity. |
| SN037 | `player_id` (24) | DIFFERENT_FACT | player_id is a per-row player relationship across distinct domain tables, not duplicated player-progress truth. |
| SN038 | `request_id` (2) | DIFFERENT_FACT | Allocation attempt request versus action receipt request association; may share one correlation ID but represent distinct records. |
| SN039 | `required_anchors` (2) | UNRESOLVED | Candidate required anchors versus active registry projection; validate versioned provenance and activation rules. |
| SN040 | `resolution_source` (2) | DIFFERENT_FACT | Round resolution source and Teacher override resolution source describe separate resolution operations. |
| SN041 | `role_key` (4) | DIFFERENT_FACT | Role key in attempts/allocations/engagements/tasks is an association to a role, not shared mutable role state. |
| SN042 | `room_code` (7) | DIFFERENT_FACT | Room identity and per-run/event/choice room associations; preserve foreign keys and room/run distinction. |
| SN043 | `round_no` (4) | DIFFERENT_FACT | Discussion round, allocation/choice round and S6 current round are separately scoped rounds/snapshots. |
| SN044 | `run_id` (36) | DIFFERENT_FACT | run_id as run primary key versus foreign-key association for dozens of per-run records; identity references are not duplicate authority slots. |
| SN045 | `scene_id` (11) | UNRESOLVED | Current scene, asset-scene binding, event-scene snapshot and game_runs legacy mirror have different roles; split by instance and lifecycle. |
| SN046 | `silent_texting_mode` (2) | UNRESOLVED | Known support mirror game_runs.silent_texting_mode vs active discussion_sessions.silent_texting_mode; active-session equivalence only, not all-session equivalence. |
| SN047 | `source_item_key` (2) | DIFFERENT_FACT | Knowledge source-item provenance versus shared-photo source item/provenance pertain to different derived artifacts. |
| SN048 | `status` (4) | DIFFERENT_FACT | Lifecycle status is attached to candidate, DiscussionSession, run, or round independently. |
| SN049 | `step_key` (6) | UNRESOLVED | step_key covers historical event/message context, scene-state authority and game_runs forbidden mirror; separate snapshots from active step. |
| SN050 | `submitted_at` (2) | DIFFERENT_FACT | Library puzzle attempt submission versus allocation attempt submission are distinct actions. |
| SN051 | `text_key` (2) | DIFFERENT_FACT | Current scene text identity and private-clue text identity represent different content records. |
| SN052 | `updated_at` (7) | DIFFERENT_FACT | Each domain row has its own update time; not one global revision clock. |
| SN053 | `validity` (4) | DIFFERENT_FACT | Validity of event/decision/vote versus validity record for override is scoped to its own evidence identity. |
| SN054 | `version` (2) | DIFFERENT_FACT | Candidate version identifier versus asset event's recorded version context; the latter is historical evidence. |
| SN055 | `vote_round` (5) | UNRESOLVED | Vote round can be current mutable round or stored decision/message/round identity; split by discussion identity and ACT before choosing slot. |

## Closure boundary / next owner

1. **GA next**: for UNRESOLVED groups, compare current effective SQL/functions, reachable runtime consumers and any same-run copy, including key/mirror and phase-scoping differences. Create per-field fact clusters (not one cluster per column name); retain `SOURCE_RELATION=UNKNOWN` without direct evidence.
2. **Teacher/GA decision**: decide true semantic alternatives that code evidence alone cannot settle (including the five `s3b_player_facts` legacy knowledge meanings identified by Authority Registry V0.2). No guessed equivalence or canonical slot.
3. Only after same-name clusters are settled, enumerate and evaluate **different-name/same-meaning** candidates under the Teacher-approved method.
4. **CA concurrence** and freeze of a fact-by-fact authority registry remain future gates; this document does not lift CD HOLD, change database tables, or edit runtime/canonical gameplay source.

Sources: `docs/plans/ROUND1_FIELD_AUTHORITY_AUDIT_METHOD_V1.0.md`; `ROUND1_SAME_NAME_FIELD_REVIEW_QUEUE_V1.0.csv`; `ROUND1_FIELD_READ_WRITE_OVERVIEW_V1.0_part1.csv` and `part2.csv`; `ROUND1_CANONICAL_AUTHORITY_REGISTRY_V0.2_DRAFT.md`.
