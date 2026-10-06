# Round-1 Canonical Authority Map V0.1 — DRAFT

Date: 2026-10-06  
Owner: GA  
Status: DRAFT FOR TEACHER/GA DISCUSSION — NOT YET SENT TO CA OR CD  
Implementation authorization: NONE

## 0. Purpose

This document fixes the intended architecture **before implementation** so CD does not have to invent authority rules while coding.

It addresses one central risk:

> The repository contains many runtime state structures. Multiple structures may carry similarly named fields such as `scene_id`, `phase_key`, `status`, or participant-completion signals. Those fields must not become competing truths.

The design rule is:

> **One fact → one canonical authority. Other copies are projection, context, evidence, cache/compatibility, or legacy.**

This map was built by inventorying all persistent tables created by migrations `database/001...068` on branch `remediation/sprint9-structural-v1`.

Persistent-table coverage check: **50/50 tables accounted for** in §12.

---

# 1. Architecture planes

## Plane A — Design-time canonical definitions

These define what the game is supposed to mean; they are not live session state:

- `docs/specs/current/古堡逃脱游戏脚本 V4.0.md` — gameplay/canonical semantics.
- `docs/specs/current/localization/GAL_Castle_Escape_Text_Catalog_V1.0.csv` — player-visible text keys/content.
- `assets/asset-registry.json` — canonical asset identity/version metadata.
- current development/governance specs — implementation constraints and ownership.

Runtime code must not invent semantics that contradict these sources.

## Plane B — Persisted runtime authority

Live session facts are owned by narrowly scoped runtime domains listed below.

There is **no new persisted generic `global_phase` / `participant_progress` / `group_gate` table** in Round-1.

## Plane C — Canonical read projections

New read-only server projection:

`Canonical Progress Projection`

Purpose:
- normalize existing runtime authorities;
- return one coherent core progression/presentation identity;
- derive current participant gate status;
- mutate nothing;
- persist nothing.

Then viewer-specific read-only projections:

- `PlayerViewSnapshot`
- `TeacherViewSnapshot`

## Plane D — Browser-local presentation state

Examples:
- draft;
- focus;
- scroll;
- expanded Pocket item;
- Teacher internal-view selection;
- transient cinematic/transition overlay.

This plane is never gameplay truth.

## Plane E — Audit/evidence

Append-only events, attempt histories and provenance are retained for audit/debug/export, but are never used as the primary current-state authority unless explicitly stated.

---

# 2. Top-level runtime authority domains

| Domain | Canonical owner | Exact responsibility | Explicitly NOT responsible for |
|---|---|---|---|
| Room identity / authentication | `s1_rooms` | room identity, Teacher credential hash | formal game progression |
| Player identity / session / presence | `s1_room_players` | GAL role, display name, join/session identity, join/last-seen presence | current ACT/scene |
| Formal run envelope | `game_runs` selected columns | run identity, mode, active/completed lifecycle, completion/export flags, audit mode pointers | detailed formal scene/phase progression |
| ACT1–5 gameplay | `s3b_run_state` + `s3b_player_progress` + scoped decision/attempt tables | ACT1–5 gameplay facts and participant progression | ACT6+ progression |
| ACT1–5 interaction identity / presentation | `s3_runtime_scene_state` | current formal scene/presentation identity for early runtime and current presentation across formal runtime | ACT6+ gameplay legality |
| Generic Discussion lifecycle | `discussion_sessions` | one discussion instance's status, deadlines, vote policy, interaction context | global run phase |
| Discussion transcript | `dialogue_messages` | exact message history | current phase |
| Generic/S3B group decisions | `runtime_player_decisions` | scoped canonical decision records for the generic DiscussionRoom/S3B path | S5/S6-specific decisions |
| ACT6–8 gameplay | `s5_run_state` | ACT6–8 act/phase/round-level gameplay state after ACT6 entry barrier opens | ACT1–5 / ACT9+ |
| ACT6–8 participant decisions | `s5_votes`, `s5_act8_private_choices` | scoped votes/private choices | discussion lifecycle |
| ACT6–8 discussion binding | `s5_rounds` | maps S5 phase/vote round to canonical DiscussionRoom session | discussion status/timing authority |
| ACT9–14 gameplay | `s6_run_state` | ACT9–14 act/phase/step/round/mechanism/cinematic state | earlier sprint state |
| ACT9–14 participant action state | `s6_choices`, `s6_allocations`, `s6_engagements`, `s6_station_tasks`, `s6_station_b_progress` | scoped S6 decisions/allocation/engagement/task progression | global run lifecycle |
| Pocket physical ownership | `s3_player_items` | who physically owns each carryable item | knowledge/read status |
| Pocket inspection occurrence | `s9_pocket_item_inspections` | whether player has explicitly inspected item | current item view |
| Pocket item view | `s3_player_item_view_state` | current front/back/open view | ownership / knowledge truth |
| Player knowledge provenance | `s3_player_knowledge` | what the player knows and how/when it was learned | physical ownership |
| Player observations | `s3_player_observations` | durable observation provenance | physical ownership |
| Shared photos | `s3_shared_photos` | received shared-photo copies | physical ownership |
| Group items | `s3_group_items` | group-owned found items | personal Pocket |
| Teacher override provenance | `teacher_overrides` + `teacher_override_validity` | override occurrence/reason and invalidated semantic fields | current gameplay phase after override |
| Finalization evidence | `s8_finalizations` | immutable finalization request/integrity report | ordinary active-run progression |
| Asset lifecycle | canonical `assets/asset-registry.json` + runtime Asset Manager tables | asset identity/version/review/publication/activation | gameplay progression |
| Current presentation scene | `s3_runtime_scene_state` | visual/text scene, display mode, share-photo presentation flag | active-runtime gameplay phase authority for S5/S6 |

---

# 3. Critical column-level split: game_runs

`game_runs` is a mixed historical table. Treat fields by role, not the whole row as one authority.

## 3.1 AUTHORITATIVE — formal run envelope

- `run_id`
- `room_code`
- `run_started_at`
- `run_mode`
- `behavior_dataset_eligible`
- `status` — run lifecycle only
- `audit_private_debug_view`
- `active_override_id` — pointer to current/recent override context, not phase authority
- `session_integrity_verified`
- `game_completed`
- `export_ready`
- `completed_at`

## 3.2 CONFIGURATION / compatibility

- `silent_texting_mode` — run/discussion configuration default, not phase authority.

## 3.3 LEGACY / COMPATIBILITY MIRROR — not formal progression authority

- `scene_id`
- `phase_key`
- `step_key`

New Canonical Progress Projection **MUST NOT** use these three as the current formal phase source when modern runtime state exists.

The current `s7_get_teacher_console` fallback pattern:

`coalesce(s.scene_id,g.scene_id)` / `coalesce(s.phase_key,g.phase_key)`

must not become the new architecture contract.

If modern authoritative progression/presentation state is missing, return `sync_state = UNKNOWN / INVARIANT_BREACH` rather than silently falling back to `game_runs.scene_id/phase_key/step_key`.

---

# 4. scene_id / phase_key / step_key duplication rule

These names occur in multiple tables, but their semantic ownership is different.

| Structure | Meaning of scene/phase fields | Authority class |
|---|---|---|
| `game_runs.scene_id/phase_key/step_key` | historical compatibility fields from earlier runtime | **LEGACY/MIRROR** |
| `s3_runtime_scene_state.scene_id/phase_key/step_key` | current **presentation** scene/context | **PRESENTATION AUTHORITY** |
| `s5_run_state.phase_key + act_no + vote_round` | current ACT6–8 gameplay interaction | **GAMEPLAY AUTHORITY** |
| `s6_run_state.phase_key + act_no + act9_step + round_no + cinematic_stage` | current ACT9–14 gameplay interaction | **GAMEPLAY AUTHORITY** |
| `discussion_sessions.scene_id/phase_key/step_key` | context of one DiscussionRoom instance | **INTERACTION-CONTEXT AUTHORITY only** |
| `dialogue_messages.*` | immutable context copied onto one message | **EVIDENCE/CONTEXT** |
| `runtime_player_decisions.*` | immutable context copied onto one decision | **EVIDENCE/DECISION CONTEXT** |
| `runtime_events.*` | immutable event context at event time | **AUDIT EVIDENCE** |
| `act6_13_event_ledger.*` | cross-sprint audit timeline | **AUDIT EVIDENCE/PROJECTION** |

New code must never ask "which phase_key looks newest?" across tables.

It must first identify the active runtime owner, then read the phase from that owner.

---

# 5. Exact active-runtime resolution contract

The Canonical Progress Projection resolves runtime in this order.

## 5.1 Run lifecycle

1. Find active formal run from `game_runs.status='active'`.
2. If no active run but the UI is restoring a completed formal run, use the latest completed run/finalization path.
3. No formal run -> `runtime_scope = NONE`.

## 5.2 Completed/finalized

If formal run is completed / `s8_finalizations` exists and lifecycle flags indicate completion:

`runtime_scope = FINALIZED`

Current interaction:
- `act_no = 14`
- `interaction_key = act14_complete`

`s8_finalizations` owns finalization evidence.  
`game_runs` owns current lifecycle flags.

## 5.3 ACT9–14

If `s6_run_state` exists for an active run:

`runtime_scope = S6`

Canonical current gameplay identity comes from:
- `s6_run_state.act_no`
- `s6_run_state.phase_key`
- `s6_run_state.act9_step`
- `s6_run_state.round_no`
- `s6_run_state.cinematic_stage` where relevant.

## 5.4 ACT6–8

If `s5_run_state` exists **and `s5_run_state.act6_entered_at is not null`** and S6 is not active:

`runtime_scope = S5`

Canonical gameplay identity comes from:
- `s5_run_state.act_no`
- `s5_run_state.phase_key`
- `s5_run_state.vote_round`

## 5.5 ACT5→ACT6 handoff

If:
- `s3b_run_state.terminal_state='SPRINT3B_COMPLETE'`;
- `s5_run_state` is already prepared;
- `s5_run_state.act6_entered_at is null`;

then:

`runtime_scope = HANDOFF_5_TO_6`

This is necessary because migration 061 intentionally creates/prepares the S5 row before all players have crossed the ACT6 entry barrier.

Canonical participant gate:
- `s3b_player_progress.act6_handoff_observed_at`
- `s3b_player_progress.act6_entered_at`

S5 existence alone must **not** mean ACT6 is globally active.

## 5.6 ACT1–5

Otherwise, if `s3b_run_state` exists:

`runtime_scope = S3B`

For ACT1–5 there is no single generic phase column in `s3b_run_state`; canonical current interaction identity is resolved from:
- `s3_runtime_scene_state.scene_id/phase_key/step_key`;
- current S3B run/player facts required by that interaction.

This is the one place where `s3_runtime_scene_state.phase_key` is part of early gameplay interaction identity as well as presentation, because the S3B runtime was built that way.

---

# 6. Presentation authority and validation

`s3_runtime_scene_state` is the sole current **presentation scene authority** for active formal gameplay.

It owns:
- `scene_id`
- presentation `phase_key/step_key` context
- `display_mode`
- `text_key`
- `current_route_target`
- `wayfinding_target`
- `allow_share_photo`
- `updated_at`

For S5/S6, gameplay phase comes from S5/S6 state. Therefore the Progress Projection validates that presentation context is compatible with the active gameplay interaction.

Mismatch behavior:

```text
gameplay authority says ACT7 / act7_vote
presentation authority says ACT8
→ sync_state = INVARIANT_BREACH
→ mutating controls fail closed
→ do not choose one by coalesce/fallback
```

---

# 7. Participant progress / group-gate contract

Do not persist a generic participant-progress table.

The read projection computes a **named current gate** from the current authoritative interaction.

Minimum gate output:

```text
gate_key
interaction_identity
participants:
  - player_id
  - role_slot
  - required
  - status = COMPLETED | NOT_YET_COMPLETED
```

Transport failure is outside this domain and becomes presentation `STATUS UNKNOWN`.

## 7.1 Current gate source registry

| Gate / interaction | Participant completion authority |
|---|---|
| room readiness | `s1_room_players.joined_at/session state` |
| ACT1 opening/action completion | `s3b_player_progress.act1_stage`, ACT1 choice fields |
| ACT1 private first choice | `act1_choice_id / act1_locked_at` |
| ACT2 first-meeting choice | `first_meeting_choice / first_meeting_locked_at` |
| ACT2 combined GRAB+leave after W03 | both `grab_complete` AND `left_start_room` |
| ACT2 route-update acknowledgement | `route_update_ack_at` |
| ACT3 wayfinding / physical reunion | `s3b_player_progress.player_location` + `s3b_run_state.party_physically_reunited` |
| ACT3 Library puzzle | group puzzle authority in `s3b_run_state` + attempt history `s3b_library_attempts`; not a per-player all-ready gate |
| ACT4 private route choice | `act4_choice_id / act4_locked_at` |
| ACT5 Discussion | `discussion_sessions` lifecycle + scoped `runtime_player_decisions` |
| ACT5 post-inspection route | `s3b_post_inspection_route_votes` |
| ACT5→6 observe handoff | `act6_handoff_observed_at` |
| ACT5→6 enter ACT6 | `act6_entered_at`; global S5 opens when all required players entered and `s5_run_state.act6_entered_at` is set |
| ACT6/7 group vote | `s5_votes` scoped by S5 phase/vote_round; Discussion lifecycle from `discussion_sessions` |
| ACT8 private choice | `s5_act8_private_choices` |
| ACT8 final vote | `s5_votes` scoped by S5 phase/vote_round |
| ACT9 group steps | `s6_choices` scoped by S6 phase/step/round; Discussion lifecycle where applicable |
| ACT10 private/final choice | `s6_choices` scoped by S6 phase/round |
| ACT11 allocation | `s6_allocations`; attempt history is separate |
| ACT12 station task completion | `s6_station_tasks`; `s6_station_b_progress` owns staged Station-B internal progress |
| ACT12 engagement | `s6_engagements` |
| ACT12 pressure choice | `s6_choices` scoped to `act12_pressure` |
| ACT13/14 boundary | `s6_run_state.act14_boundary_reached / escape_success` |
| finalization | `s8_finalizations` + `game_runs` lifecycle flags |

A participant may be `required=false` for a gate. "COMPLETED" is never timeless; it is always "completed for gate X".

---

# 8. Operational location authority

This domain must be explicit because current Teacher location drift came from treating an early field as universal.

## 8.1 Per-player physical location

`s3b_player_progress.player_location` is authoritative only while players may physically diverge in early flow / ACT5→6 entry.

Known uses include:
- start room;
- corridor;
- Library/wayfinding;
- portrait_hall at ACT6 entry.

## 8.2 Shared synchronized later location

After all-player ACT6 entry and later synchronized scenes, Teacher operational location should be projected from:
- active runtime;
- `s3_runtime_scene_state.scene_id`;
- specific station/allocation state where roles physically diverge within the same shared scene.

Do **not** keep writing later ACT locations back into the old `s3b_player_progress.player_location` merely to make Teacher UI convenient.

This avoids turning an early-sprint field into a second global location authority.

---

# 9. Discussion ownership

## 9.1 Canonical DiscussionRoom lifecycle

`discussion_sessions` owns:
- discussion session identity;
- status;
- timing/deadline;
- vote policy;
- options;
- outcome;
- context for that discussion instance.

## 9.2 Transcript

`dialogue_messages` owns exact messages.

## 9.3 S5 mapping

`s5_rounds` is a **binding/index**:
- S5 phase/vote_round -> `discussion_session_id`.

It does not own discussion status/timing after migration 029 established "one canonical DiscussionRoom authority".

## 9.4 Decisions

- generic/S3B discussion decisions -> `runtime_player_decisions`.
- S5 votes -> `s5_votes`.
- S6 choices -> `s6_choices`.

Do not copy all decisions into one new generic table in Round-1.

The Progress Projection selects the correct decision authority based on active runtime/interaction.

---

# 10. Pocket / knowledge ownership

## 10.1 Physical item ownership

`s3_player_items` — sole authority.

## 10.2 Item inspection

`s9_pocket_item_inspections` — sole authority for "player has explicitly inspected this item".

## 10.3 Current view

`s3_player_item_view_state` — sole authority for current front/back/open item view.

## 10.4 Knowledge

`s3_player_knowledge` — canonical knowledge/provenance authority.

## 10.5 Observations

`s3_player_observations` — canonical observation provenance.

## 10.6 Compatibility risk: s3b_player_facts

`s3b_player_facts` is mixed historical state.

Some keys represent genuine S3B gameplay/discovery flags, e.g. optional-item discovery used by old flow.

Other keys duplicate durable knowledge/observation concepts now represented in `s3_player_knowledge` / `s3_player_observations`.

Round-1 rule:

- existing S3B logic may continue reading/writing required legacy facts for compatibility;
- new View Snapshot / Progress Projection must prefer canonical `s3_player_knowledge` and `s3_player_observations` for player-visible knowledge;
- do not add new knowledge semantics to `s3b_player_facts`;
- duplicated "knows..." facts should be treated as compatibility mirrors, not a second knowledge authority.

This prevents the Pocket refactor from creating another knowledge truth.

---

# 11. Evidence, idempotency, and projections that are NOT current-state authority

These tables may intentionally repeat facts for audit/replay, but they do not compete with current gameplay state:

- `runtime_events` — canonical formal event/evidence ledger.
- `s1_game_events` — legacy Sprint1 room/prototype event ledger.
- `act6_13_event_ledger` — ACT6–13 audit/timeline projection.
- `s6_action_receipts` — idempotency/replay receipts.
- `s6_allocation_attempts` — allocation attempt history.
- `s3b_library_attempts` — puzzle attempt history; current resolved state lives in S3B run state.
- `asset_events` — asset lifecycle event history.
- `teacher_overrides` — override occurrence/provenance.
- `teacher_override_validity` — validity accounting caused by override.
- `s6_audio_occurrences` / `s6_audio_consumptions` — audio presentation occurrence/consumption facts.
- `s8_finalizations` — finalization evidence/integrity record.

Hard rule:

> Do not derive "current phase" by taking the latest event from any evidence ledger.

---

# 12. Exhaustive 50-table inventory and classification

## A. Room/session and Sprint1 legacy — 6/50

| Table | Classification |
|---|---|
| `s1_rooms` | AUTH — room/Teacher credential identity |
| `s1_room_players` | AUTH — participant/session/presence identity |
| `s1_scene_choices` | LEGACY PROTOTYPE CONFIG — not formal game authority |
| `s1_room_state` | LEGACY PROTOTYPE STATE — exclude from formal Progress Projection |
| `s1_player_decisions` | LEGACY PROTOTYPE DECISIONS — exclude from formal progression |
| `s1_game_events` | LEGACY EVIDENCE |

## B. Formal run + generic Discussion — 5/50

| Table | Classification |
|---|---|
| `game_runs` | MIXED — AUTH run envelope; legacy scene/phase mirror fields |
| `discussion_sessions` | AUTH — one DiscussionRoom interaction lifecycle |
| `dialogue_messages` | AUTH history — transcript |
| `runtime_player_decisions` | AUTH scoped decisions — generic/S3B Discussion path |
| `runtime_events` | EVIDENCE — append-only formal event ledger |

## C. Presentation / Pocket / knowledge — 10/50

| Table | Classification |
|---|---|
| `s3_runtime_scene_state` | AUTH — current presentation scene; early S3B interaction identity |
| `s3_item_catalog` | CATALOG AUTH — item definitions |
| `s3_observation_catalog` | CATALOG AUTH |
| `s3_knowledge_catalog` | CATALOG AUTH |
| `s3_player_items` | AUTH — physical ownership |
| `s3_player_observations` | AUTH — observation provenance |
| `s3_player_knowledge` | AUTH — knowledge provenance |
| `s3_shared_photos` | AUTH — received shared-photo copies |
| `s3_group_items` | AUTH — group-owned items |
| `s3_player_item_view_state` | AUTH — current item view |

## D. ACT1–5 — 5/50

| Table | Classification |
|---|---|
| `s3b_run_state` | AUTH — ACT1–5 run-level gameplay facts |
| `s3b_player_progress` | AUTH — ACT1–5 and ACT5→6 per-player progress; location only in its scoped early/handoff domain |
| `s3b_library_attempts` | ATTEMPT HISTORY + request identity; S3B run state owns puzzle resolution |
| `s3b_player_facts` | MIXED COMPATIBILITY — legacy gameplay facts; duplicated knowledge keys are mirrors |
| `s3b_post_inspection_route_votes` | AUTH — scoped ACT5 route votes |

## E. Teacher intervention — 2/50

| Table | Classification |
|---|---|
| `teacher_overrides` | AUTH PROVENANCE — override occurrence/reason |
| `teacher_override_validity` | AUTH — semantic-field validity after override |

## F. Asset Manager — 4/50

| Table | Classification |
|---|---|
| `asset_registry_projection` | RUNTIME PROJECTION of canonical asset registry + runtime active-version state |
| `asset_candidates` | AUTH — candidate lifecycle/version/review/publication state |
| `asset_events` | EVIDENCE — asset lifecycle events |
| `asset_manager_reviewers` | AUTH CONFIG — allowed reviewer identities |

Canonical design-time asset identity remains `assets/asset-registry.json`; runtime activation/resolution must follow the already-audited Asset Manager contract.

## G. ACT6–8 — 4/50

| Table | Classification |
|---|---|
| `s5_run_state` | AUTH — ACT6–8 gameplay state; prepared row is not automatically active ACT6 |
| `s5_votes` | AUTH — S5 votes |
| `s5_rounds` | BINDING/INDEX — S5 round to DiscussionRoom session |
| `s5_act8_private_choices` | AUTH — ACT8 private choices |

## H. ACT9–14 + evidence — 12/50

| Table | Classification |
|---|---|
| `s6_run_state` | AUTH — ACT9–14 gameplay/mechanism/cinematic state |
| `s6_private_clues` | AUTH delivery record — S6 private clues |
| `s6_choices` | AUTH — S6 choices |
| `s6_allocations` | AUTH — current accepted role allocation |
| `s6_engagements` | AUTH — station engagement |
| `s6_action_receipts` | IDEMPOTENCY/REPLAY — not gameplay authority |
| `s6_allocation_attempts` | ATTEMPT HISTORY — not accepted-allocation authority |
| `s6_station_tasks` | AUTH — station-task completion |
| `s6_station_b_progress` | AUTH — Station-B staged internal progress |
| `act6_13_event_ledger` | AUDIT EVIDENCE/PROJECTION |
| `s6_audio_occurrences` | AUTH — audio occurrence facts |
| `s6_audio_consumptions` | AUTH — per-player audio consumption facts |

## I. Finalization — 1/50

| Table | Classification |
|---|---|
| `s8_finalizations` | AUTH finalization evidence/integrity report; `game_runs` remains lifecycle-flag owner |

## J. Pocket inspection — 1/50

| Table | Classification |
|---|---|
| `s9_pocket_item_inspections` | AUTH — explicit Pocket inspection occurrence |

Coverage total: **6 + 5 + 10 + 5 + 2 + 4 + 4 + 12 + 1 + 1 = 50 tables.**

No persistent table created through migration 068 is unclassified.

---

# 13. Canonical Progress Projection — exact role

Round-1 should add a **read-only server projection contract**, not another persisted table.

Recommended API shape:

## 13.1 Internal core resolver

Conceptual internal function:

`s9_resolve_progress_core(run_id)`

Properties:
- server/internal only;
- no browser execute permission;
- no mutation;
- resolves active runtime per §5;
- returns canonical core progression identity and invariant status.

## 13.2 Player wrapper

Conceptual browser RPC:

`s9_get_player_progress_projection(room_code, session_token)`

Returns only Player-authorized core data:
- run_id;
- run lifecycle;
- runtime_scope;
- act_no;
- interaction_key;
- interaction identity components;
- presentation scene identity;
- current gate key;
- this player's required/status for current gate;
- sync/invariant status.

It does **not** return Teacher/private-other-player data.

## 13.3 Teacher wrapper

Conceptual browser RPC:

`s9_get_teacher_progress_projection(room_code, teacher_token)`

Returns:
- same core progression identity;
- named gate/interaction;
- all three participants' `required + COMPLETED/NOT_YET_COMPLETED`;
- operational-location projection;
- sync/invariant status.

It does not infer status client-side.

## 13.4 No new persistent revision required in Round-1

Because the core projection is read in one server call, it avoids mixed-RPC core progression.

Secondary details (Pocket, transcript, assets) may load separately, but they must be scoped to:
- same `run_id`;
- same relevant interaction/session identity where applicable.

Mismatch -> discard secondary result.

---

# 14. Projection output contract

Minimum core contract:

```text
schema_version
sync_state = FRESH | INVARIANT_BREACH

run:
  run_id
  lifecycle = ACTIVE | COMPLETED
  run_mode

progress:
  runtime_scope = S3B | HANDOFF_5_TO_6 | S5 | S6 | FINALIZED
  act_no
  interaction_key
  interaction_identity
  presentation_scene_key

gate:
  gate_key | null
  participants[]:
    player_id
    role_slot
    required
    status = COMPLETED | NOT_YET_COMPLETED

source_identity:
  active_runtime
  phase_key
  round_no / step identity where applicable
  discussion_session_id where applicable
```

`STATUS UNKNOWN` is a **viewer/read-failure presentation state**, not server gameplay status. If the projection call itself cannot be obtained, Teacher UI displays UNKNOWN and mutating controls fail closed.

---

# 15. Fail-closed invariant rules

The Progress Projection does not silently choose among conflicting current-state claims.

Examples:

1. S5 says `act7_vote` but presentation scene says ACT8:
   - `INVARIANT_BREACH`
   - passive last-confirmed UI may remain visible;
   - authoritative mutating controls disabled.

2. S5 row exists but `act6_entered_at is null`:
   - do not declare S5 active;
   - resolve `HANDOFF_5_TO_6`.

3. No active modern formal state but only legacy `game_runs.phase_key` exists:
   - do not silently treat legacy field as formal truth;
   - return invariant/unknown state for the new UI.

4. Teacher cannot fetch projection:
   - participant status = presentation UNKNOWN;
   - Emergency/Recovery mutation controls fail closed.

---

# 16. Local UI restoration boundary

Local UI state is outside the authority map.

Rule:

`Same-owner + Still-valid`

This is the CA refinement of the earlier "Same-owner + Still-exists" rule.

Restore only if:
- same authoritative owner/interaction identity;
- referenced target still exists;
- the current interaction still permits that local state.

Otherwise discard browser-local memory and render neutral/default current presentation.

Transition overlay state is never restored.

---

# 17. Architecture decisions to freeze before CD work

Before CD receives implementation authority, the following must be resolved/approved by Teacher + GA + CA:

1. 50-table authority classification in §12.
2. `game_runs.scene_id/phase_key/step_key` = legacy/mirror for new formal UI.
3. exact active-runtime resolution in §5.
4. exact S5 prepared-vs-active distinction.
5. presentation-vs-gameplay authority split in §6.
6. scoped participant gate registry in §7.
7. operational-location authority split in §8.
8. DiscussionRoom ownership in §9.
9. Pocket/knowledge/fact compatibility rule in §10.
10. evidence tables never drive current phase.
11. exact read-only Progress Projection contract in §13–14.
12. fail-closed invariants in §15.
13. local UI restoration rule in §16.
14. Player/Teacher View Snapshot schemas remain separate.
15. no new persistent generic progress state in Round-1.

Only after these are frozen should implementation details such as SQL syntax, internal helper naming, and DOM wiring be left to CD.
