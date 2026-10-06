# Round-1 Canonical Authority Registry V0.1 — DRAFT

Date: 2026-10-06  
Owner: GA  
Depends on: `ROUND1_ACTIVE_DEPENDENCY_AUDIT_V1.0.md`  
Status: DRAFT FOR TEACHER/GA DISCUSSION — NOT YET SENT TO CA OR CD  
Implementation authorization: NONE

## 1. Purpose

This is the design-time "authority dictionary".

It does **not** become a runtime lookup table.

Runtime code will not first query this registry and then dynamically decide which database table to read.

Instead:

```text
Canonical Authority Registry
        ↓  design/implementation contract
Internal Core Resolver
        ↓
Player wrapper / Teacher wrapper
        ↓
UI
```

The registry fixes, in advance:

- what fact is being requested;
- which source is authoritative;
- the scope in which that authority applies;
- who is allowed to mutate it;
- what read interface new code should use;
- which duplicate/support sources must NOT be used as authority;
- what to do if authoritative sources conflict.

## 2. Status vocabulary

- `AUTHORITY` — may determine the canonical fact within its defined scope.
- `SUPPORT_ONLY` — may still be read/written for compatibility, audit, export, binding or replay, but cannot determine the current authoritative fact.
- `DEAD_CANDIDATE` — no current production dependency found; excluded from new design.
- `RETIRED` — intentionally disabled and verified. None yet.

## 3. Conflict policy vocabulary

- `FAIL_CLOSED` — do not expose a mutating control based on uncertain/conflicting state.
- `INVARIANT_BREACH` — authoritative domains disagree in a way that should not occur.
- `NO_FALLBACK` — do not silently use a legacy/support copy if the authority is absent.
- `RETRY_READ` — transient read failure; keep last confirmed passive presentation where safe and retry.
- `NOT_APPLICABLE` — the fact is not owned by that domain in the current scope.

---

# 4. Identity and formal-run registry

| fact_key | Scope | Canonical authority | Allowed writer(s) | New-code read path | Support/duplicate sources | Conflict policy |
|---|---|---|---|---|---|---|
| `room.identity` | room lifetime | `s1_rooms.room_code` | `s1_create_room` | Core Resolver / auth helpers | none | FAIL_CLOSED |
| `teacher.credential_identity` | room lifetime | `s1_rooms.teacher_token_hash` | room creation / credential management only | `s1_assert_teacher` | none | FAIL_CLOSED |
| `player.identity` | room lifetime | `s1_room_players.player_id/role_slot/display_name` | room creation | Player/Teacher wrapper | none | FAIL_CLOSED |
| `player.session` | current join session | `s1_room_players.session_token_hash/joined_at/last_seen_at` | `s1_join_player`, `s1_release_player_session` | session helper / wrapper | browser local session token is credential only | FAIL_CLOSED |
| `run.identity` | one formal run | `game_runs.run_id/room_code` | formal run start | Core Resolver | none | FAIL_CLOSED |
| `run.mode` | one formal run | `game_runs.run_mode` | formal run start | Core Resolver | none | FAIL_CLOSED |
| `run.lifecycle` | formal run | `game_runs.status/game_completed/completed_at` | formal start + `s8_finalize` | Core Resolver | `s8_finalizations` proves finalization but does not replace lifecycle flag | INVARIANT_BREACH if finalization/lifecycle contradict |
| `run.export_ready` | finalization | `game_runs.export_ready/session_integrity_verified` | `s8_finalize` | Teacher wrapper/finalization projection | `s8_finalizations.integrity_report` is evidence | FAIL_CLOSED |

### Forbidden authority reads

For new formal UI/progression logic:

- `game_runs.scene_id`
- `game_runs.phase_key`
- `game_runs.step_key`

are `SUPPORT_ONLY`.

Policy:

`authoritative_read = FORBIDDEN`

No new code may use them as fallback for current formal progression.

---

# 5. Current gameplay progression registry

| fact_key | Scope | Canonical authority | Allowed writer(s) | New-code read path | Support copies | Conflict policy |
|---|---|---|---|---|---|---|
| `progress.active_runtime` | active formal run | resolved from S3B/S5/S6/finalization using frozen resolver rules | no direct writer; derived | Core Resolver only | existence of prepared S5 row alone is not sufficient | INVARIANT_BREACH on impossible overlap |
| `progress.s3b.run` | ACT1–5 | `s3b_run_state` | authorized S3B mutations / Teacher override where explicitly supported | Core Resolver | event ledgers | NO_FALLBACK |
| `progress.s3b.player` | ACT1–5 + ACT5→6 handoff | `s3b_player_progress` | authorized S3B/player-transition functions | Core Resolver | Teacher/event projections | NO_FALLBACK |
| `progress.s5` | ACT6–8 after ACT6 entry barrier opens | `s5_run_state` | S5 transition functions | Core Resolver | `game_runs.phase_key`; `s5_rounds` | NO_FALLBACK |
| `progress.s6` | ACT9–14 | `s6_run_state` | S6 guarded/v2 mutations + cinematic tick | Core Resolver | event ledger | NO_FALLBACK |
| `progress.finalized` | completed run | `game_runs` lifecycle + `s8_finalizations` finalization record | `s8_finalize` | Core Resolver | runtime event | INVARIANT_BREACH if one says finalized and the other is missing unexpectedly |

## 5.1 Active-runtime resolution

Freeze this order:

1. completed/finalized -> `FINALIZED`;
2. active `s6_run_state` -> `S6`;
3. `s5_run_state` with ACT6 entry barrier actually opened -> `S5`;
4. S5 prepared but ACT6 barrier not opened -> `HANDOFF_5_TO_6`;
5. active `s3b_run_state` -> `S3B`;
6. otherwise -> `UNKNOWN / INVARIANT_BREACH`.

Do not infer current runtime from the newest-looking `phase_key`.

---

# 6. Presentation registry

| fact_key | Scope | Canonical authority | Allowed writer(s) | New-code read path | Support copies | Conflict policy |
|---|---|---|---|---|---|---|
| `presentation.scene` | active formal gameplay | `s3_runtime_scene_state.scene_id` | `s3b_set_scene`, `s5_set_scene`, `s6_set_scene`, explicitly authorized override path | Core Resolver -> viewer snapshot | `game_runs.scene_id` | INVARIANT_BREACH; no legacy fallback |
| `presentation.context` | current visual scene | `s3_runtime_scene_state.phase_key/step_key/display_mode/text_key` | same scene-setting functions | Core Resolver | `game_runs.phase_key/step_key` | FAIL_CLOSED if incompatible with gameplay owner |
| `presentation.share_photo_allowed` | current scene | `s3_runtime_scene_state.allow_share_photo` | approved scene/phase functions | Player/Teacher projection | Discussion allow flag is interaction-specific | FAIL_CLOSED |

Important:

For S5/S6:
- gameplay phase comes from `s5_run_state` / `s6_run_state`;
- presentation scene comes from `s3_runtime_scene_state`.

If they disagree, neither silently overrides the other.

---

# 7. Participant gate registry

`COMPLETED` is always scoped to a named `gate_key`. There is no timeless "player completed" flag.

| gate_key / interaction | Completion authority | Global/group authority | Notes |
|---|---|---|---|
| `room.ready` | `s1_room_players` join/session state | room readiness projection | pre-formal only |
| `act1.opening` | `s3b_player_progress.act1_stage` | S3B flow | scoped |
| `act1.private_choice` | `act1_choice_id + act1_locked_at` | S3B flow | per-player |
| `act2.first_meeting_choice` | `first_meeting_choice + first_meeting_locked_at` | S3B flow | per-player |
| `act2.grab_leave` | after W03: both `grab_complete` and `left_start_room` | atomic W03 mutation + group gate | one Player click, two canonical facts/events |
| `act2.route_update_ack` | `route_update_ack_at` | S3B flow | acknowledgement |
| `act3.reunion` | scoped `player_location` + `party_physically_reunited` | S3B run state | not a generic forever-location rule |
| `act3.library_puzzle` | puzzle resolution in `s3b_run_state` | S3B run state | `s3b_library_attempts` is history |
| `act4.private_route` | `act4_choice_id + act4_locked_at` | S3B flow | per-player |
| `act5.discussion` | current `discussion_sessions` + scoped decisions | DiscussionRoom | not derived from timeout alone after W01 |
| `act5.post_inspection_route` | `s3b_post_inspection_route_votes` | S3B flow | scoped |
| `handoff5to6.observed` | `act6_handoff_observed_at` | handoff projection | per-player |
| `handoff5to6.entered` | `act6_entered_at` | S5 opens only after barrier | prepared S5 row != active S5 |
| `s5.vote` | `s5_votes` scoped by phase/vote_round | `s5_run_state` + DiscussionRoom | ACT6/7/final vote |
| `act8.private_choice` | `s5_act8_private_choices` | S5 state | per-player |
| `s6.choice` | `s6_choices` scoped by phase/step/round | S6 state | ACT9/10/12 pressure |
| `act11.allocation` | `s6_allocations` | S6 state | `s6_allocation_attempts` is support/history |
| `act12.station_task` | `s6_station_tasks` | S6 state | station B subprogress separate |
| `act12.station_b_progress` | `s6_station_b_progress` | S6 state | staged local mechanism progress |
| `act12.engagement` | `s6_engagements` | S6 state | scoped |
| `act14.boundary` | `s6_run_state.act14_boundary_reached/escape_success` | S6 state | finalization follows |
| `run.finalized` | `s8_finalizations` + lifecycle flags | finalization | exactly once |

Teacher wrapper returns participant status only for the **current named gate**.

Transport/read failure is not `NOT_YET_COMPLETED`; Teacher presentation becomes `STATUS UNKNOWN`.

---

# 8. Discussion registry

| fact_key | Authority | Allowed writers | New-code read path | Support source |
|---|---|---|---|---|
| `discussion.identity_status` | `discussion_sessions` | canonical generic/S5/S6 discussion functions | viewer projection | `s5_rounds` only binds S5 round to session |
| `discussion.policy` | `discussion_sessions` | configure/open functions | viewer projection | none |
| `discussion.transcript` | `dialogue_messages` | send-message functions | viewer projection | none |
| `discussion.generic_decision` | `runtime_player_decisions` | generic/S3B submit-vote path | viewer projection | `s1_player_decisions` is legacy support |
| `discussion.s5_vote` | `s5_votes` | S5 vote function | viewer projection | none |

Forbidden:
- do not derive Discussion lifecycle from `s5_rounds`;
- do not derive current phase from latest dialogue/event.

---

# 9. Pocket / evidence / knowledge registry

| fact_key | Authority | Allowed writers | New-code read path | Support/legacy source |
|---|---|---|---|---|
| `pocket.physical_owner` | `s3_player_items` | canonical acquisition/share/override functions | Player/Teacher view projection | none |
| `pocket.inspected` | `s9_pocket_item_inspections` | `s9_inspect_pocket_item` | Player snapshot | none |
| `pocket.current_view` | `s3_player_item_view_state` | `s3_set_item_view` + initialization/acquisition | Player snapshot | none |
| `knowledge.player` | `s3_player_knowledge` | `s3_record_knowledge` | Player/Teacher projection | `s3b_player_facts` `*_knows_*` = SUPPORT_ONLY |
| `observation.player` | `s3_player_observations` | `s3_record_observation` / canonical triggers | Player/Teacher projection | duplicated legacy facts = SUPPORT_ONLY |
| `photo.received_copy` | `s3_shared_photos` | `s3_share_photo` | Player/Teacher projection | none |
| `group_item` | `s3_group_items` | canonical puzzle/choice/override functions | Player/Teacher projection | none |
| `catalog.item` | `s3_item_catalog` | migrations/catalog administration | internal renderer/projection | none |
| `catalog.knowledge` | `s3_knowledge_catalog` | migrations/catalog administration | internal validation | none |
| `catalog.observation` | `s3_observation_catalog` | migrations/catalog administration | internal validation | none |

Hard rule:

No new `*_knows_*` knowledge semantics may be added to `s3b_player_facts`.

---

# 10. Teacher override registry

| fact_key | Authority | Read path | Notes |
|---|---|---|---|
| `teacher.override_occurrence` | `teacher_overrides` | Teacher projection/export | provenance + reason |
| `teacher.override_validity` | `teacher_override_validity` | Teacher projection/export/final integrity | validity accounting |
| `teacher.current_allowed_actions` | derived server-side from current authoritative interaction, not from old override history alone | Teacher wrapper | client must not invent legality |

Override history may explain how state changed but does not replace the new current-state owner after the override is applied.

---

# 11. Asset registry

| fact_key | Authority | Support/evidence |
|---|---|---|
| `asset.canonical_identity` | design-time `assets/asset-registry.json` | runtime projection must correspond |
| `asset.runtime_projection` | `asset_registry_projection` | do not treat JSON file as live activation state |
| `asset.candidate_version` | `asset_candidates` | immutable candidate/version lifecycle |
| `asset.reviewer_config` | `asset_manager_reviewers` | authorization config |
| `asset.lifecycle_event` | `asset_events` | SUPPORT_ONLY evidence |

---

# 12. S6 idempotency / attempt / audit support registry

These facts deliberately support authority rather than replace it.

| support fact | Source | Canonical fact it protects |
|---|---|---|
| S6 mutation replay receipt | `s6_action_receipts` | S6 current gameplay state / accepted action |
| allocation attempt history | `s6_allocation_attempts` | `s6_allocations` accepted allocation |
| ACT6–13 timeline | `act6_13_event_ledger` | S5/S6 current state |
| formal event history | `runtime_events` | all current state domains |
| library attempt history | `s3b_library_attempts` | S3B puzzle resolution |
| asset lifecycle event history | `asset_events` | asset candidate/projection state |

Hard rule:

No "latest event wins" current-state algorithm.

---

# 13. Legacy production-support registry

These are still reachable today but are forbidden as new formal-game authorities.

| Source | Usage status | Allowed current use | Forbidden new use |
|---|---|---|---|
| `s1_room_state` | ACTIVE_SUPPORT | legacy Teacher maintenance/room state | formal ACT1–14 progression |
| `s1_player_decisions` | ACTIVE_SUPPORT | legacy room-state/initial-choice compatibility | formal S3B/S5/S6 decisions |
| `s1_game_events` | ACTIVE_SUPPORT | legacy room maintenance evidence | formal current phase |
| `game_runs.scene_id/phase_key/step_key` | ACTIVE_SUPPORT fields | compatibility/export where still required | current formal progression/presentation fallback |
| `s3b_player_facts` duplicated knowledge flags | ACTIVE_SUPPORT | old S3B compatibility logic | new knowledge UI/projection |
| `s5_rounds` | ACTIVE_SUPPORT | S5 round-to-Discussion binding | Discussion lifecycle |
| `runtime_events` / `act6_13_event_ledger` | ACTIVE_SUPPORT | audit/export | current phase |

---

# 14. Dead-candidate registry

| Source | Status | New design policy |
|---|---|---|
| `s1_scene_choices` | DEAD_CANDIDATE | exclude from Core Resolver / new UI; optional later CFTM test |
| `src/game/app.js::renderState` | dead-code candidate | exclude from new UI |
| `src/game/app.js::submitChoice` | dead-code candidate | exclude; only current Player caller of legacy `s1_submit_private_choice` |
| `src/game/app.js::refreshSprint3b` | dead-code candidate | exclude |

No physical deletion is authorized by this registry.

---

# 15. Core Resolver read rule

The internal resolver is **coded from this registry**.

It does not query this Markdown file or a database dictionary at runtime.

Conceptual flow:

```text
resolve run identity/lifecycle from designated authority
        ↓
resolve active runtime using frozen order
        ↓
read current gameplay authority for that runtime
        ↓
read presentation authority
        ↓
validate compatibility
        ↓
resolve named gate and participant completion sources
        ↓
return minimal canonical progress projection
```

If required authorities disagree:

`sync_state = INVARIANT_BREACH`

If transport/read fails:

- no invented state;
- viewer wrapper reports synchronization failure;
- mutation controls fail closed.

---

# 16. Viewer wrappers

## Player wrapper

Returns only Player-authorized projection:
- own identity;
- run lifecycle;
- current interaction/presentation identity;
- own gate status;
- Player-visible Discussion/Pocket/evidence references;
- allowed actions only when projected/validated server-side.

Never returns Teacher-only/private-other-player facts.

## Teacher wrapper

Returns:
- run/current interaction;
- three participants' current named-gate status;
- operational-location projection;
- Teacher-authorized Discussion/override/maintenance information.

No browser-side authority inference.

---

# 17. Registry governance

Any future architecture change that introduces a new persistent state fact must update this registry **before** implementation.

For each new fact, the proposal must specify:

1. `fact_key`;
2. scope;
3. canonical authority;
4. allowed writer(s);
5. canonical read path;
6. support/duplicate sources;
7. conflict/failure policy.

A proposal that cannot answer these seven items is not ready for implementation.

This is intended to prevent CD or any future implementation agent from inventing authority ownership ad hoc while coding.
