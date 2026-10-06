# Round-1 Canonical Authority Registry V0.2 — DRAFT FOR CA CHALLENGE

Date: 2026-10-06  
Owner: GA  
Depends on:
- `ROUND1_ACTIVE_DEPENDENCY_AUDIT_V1.1.md`
- `ROUND1_PROGRESS_GATE_VIEW_SNAPSHOT_GUARDRAILS_V1.0.md`
- canonical gameplay `古堡逃脱游戏脚本 V4.0.md`

Status: ARCHITECTURE DRAFT — no implementation authorization  
Supersedes: `ROUND1_CANONICAL_AUTHORITY_REGISTRY_V0.1_DRAFT.md`

---

# 1. Governing rule

> **One fact → one canonical authority.**

A database table, migration file, event log, compatibility field, browser cache, or old API is not authoritative merely because it contains a value.

Authority is defined at the **fact / field / key / interaction** level.

The registry is a design-time contract.

It is **not** a runtime database dictionary.

Runtime shape:

```text
Canonical Authority Registry
        ↓ implementation contract
Internal Core Resolver
        ↓
Player wrapper / Teacher wrapper
        ↓
View Snapshot
        ↓
UI
```

No request performs:

```text
lookup authority dictionary
→ dynamically choose a table
→ query that table
```

The Core Resolver is coded against this frozen contract.

---

# 2. Why authority points to runtime objects, not migration files

A migration file is historical deployment code. It is not queried while the game runs, and a function may be redefined by later migrations.

Therefore every registry row identifies:

- the canonical runtime table/column/predicate or canonical server function;
- scope;
- allowed writers;
- canonical read path;
- support/duplicate sources;
- conflict policy.

A migration filename may be retained only as traceability metadata, never as the runtime source of truth.

---

# 3. Authority statuses

- **AUTHORITY** — determines the fact within its stated scope.
- **SUPPORT_ONLY** — may remain active for compatibility/audit/export/idempotency/binding/history; never determines the current canonical fact.
- **MIXED** — object contains both AUTHORITY and SUPPORT_ONLY facts; must use a field/key-level rule.
- **DEAD_CANDIDATE** — no current production dependency found.
- **RETIRED** — intentionally disabled and verified absent. None yet.

Failure policies:

- **FAIL_CLOSED** — mutating controls unavailable until state is trustworthy.
- **INVARIANT_BREACH** — canonical authorities contradict each other.
- **NO_FALLBACK** — never substitute a support/legacy value.
- **RETRY_READ** — transient synchronization/read failure; retain prior passive display only where safe.

---

# 4. game_runs — exact field-level contract

`game_runs` is MIXED.

| field | status | exact meaning in new architecture |
|---|---|---|
| `run_id` | AUTHORITY | formal run identity |
| `room_code` | AUTHORITY | room owning the run |
| `run_started_at` | AUTHORITY | formal run start timestamp |
| `run_mode` | AUTHORITY | NORMAL / AUDIT mode |
| `behavior_dataset_eligible` | AUTHORITY | behavior-dataset eligibility policy |
| `status` | AUTHORITY | run lifecycle: active/completed |
| `completed_at` | AUTHORITY | lifecycle completion timestamp |
| `audit_private_debug_view` | AUTHORITY | Teacher audit-display preference within AUDIT mode |
| `export_ready` | AUTHORITY | current export-eligibility flag |
| `scene_id` | SUPPORT_ONLY | historical/compatibility scene mirror; authoritative read FORBIDDEN |
| `phase_key` | SUPPORT_ONLY | historical/compatibility phase mirror; authoritative read FORBIDDEN |
| `step_key` | SUPPORT_ONLY | historical/compatibility step mirror; authoritative read FORBIDDEN |
| `silent_texting_mode` | SUPPORT_ONLY | run-level mirror; current Discussion authority is `discussion_sessions.silent_texting_mode` |
| `game_completed` | SUPPORT_ONLY | compatibility/cache mirror of completed lifecycle/finalization |
| `session_integrity_verified` | SUPPORT_ONLY | operational cache of final integrity result; evidence authority is `s8_finalizations.integrity_report` |
| `active_override_id` | SUPPORT_ONLY provenance pointer | latest/upstream Teacher-override context; MUST NOT mean "an override is currently active" |
| `created_at` | SUPPORT_ONLY metadata | creation metadata; not gameplay/lifecycle authority |

Hard rule:

> `game_runs.scene_id / phase_key / step_key` must disappear from all new current-state fallback logic.

If modern authority is missing, return UNKNOWN / INVARIANT_BREACH; do not coalesce back to these fields.

---

# 5. Run / finalization facts

| fact_key | Canonical authority | Support/validation source | conflict policy |
|---|---|---|---|
| `run.lifecycle` | `game_runs.status` | finalization record | INVARIANT_BREACH if completed lifecycle and finalization contract contradict |
| `run.completed_at` | `game_runs.completed_at` | `s8_finalizations.finalized_at` is evidence timestamp, not the same fact | FAIL_CLOSED on impossible completion state |
| `run.finalization_record` | `s8_finalizations(run_id)` | runtime event is evidence only | NO_FALLBACK |
| `run.integrity_verified` | `s8_finalizations.integrity_report.verified` | `game_runs.session_integrity_verified` SUPPORT_ONLY cache | FAIL_CLOSED |
| `run.export_ready` | `game_runs.export_ready` | requires valid finalization/integrity | FAIL_CLOSED |

New UI should not require agreement among several booleans by guessing. The Core Resolver validates the designated authority + required invariant and returns one result.

---

# 6. Current gameplay owner

The Core Resolver derives `active_runtime`; there is no persisted generic global-phase table.

Resolution order:

1. completed lifecycle + valid finalization → `FINALIZED`
2. active `s6_run_state` → `S6`
3. `s5_run_state` with ACT6 entry barrier actually opened → `S5`
4. prepared S5 row but ACT6 barrier not opened → `HANDOFF_5_TO_6`
5. active `s3b_run_state` → `S3B`
6. otherwise → `UNKNOWN / INVARIANT_BREACH`

A prepared `s5_run_state` row is not sufficient to declare S5 active.

---

# 7. Gameplay versus presentation

## 7.1 Gameplay authority

- ACT1–5: `s3b_run_state` + `s3b_player_progress` + scoped decision tables
- ACT6–8: `s5_run_state` + scoped S5 vote/private-choice tables
- ACT9–14: `s6_run_state` + scoped S6 action tables

## 7.2 Presentation authority

`s3_runtime_scene_state` owns:

- current presentation `scene_id`;
- presentation `phase_key/step_key` context;
- `display_mode`;
- `text_key`;
- route/wayfinding presentation fields;
- current share-photo allowance.

For S5/S6, presentation is validated against gameplay authority.

Example:

```text
s5_run_state = ACT7 / act7_vote
s3_runtime_scene_state = ACT8
→ INVARIANT_BREACH
→ passive last-confirmed display may remain
→ mutation controls FAIL_CLOSED
```

No `coalesce(new_state, game_runs.old_state)`.

---

# 8. Discussion authority

| fact | authority | SUPPORT_ONLY |
|---|---|---|
| Discussion instance identity/status/policy/deadline/outcome | `discussion_sessions` | `s5_rounds.status` |
| transcript | `dialogue_messages` | event logs |
| generic/S3B group vote | `runtime_player_decisions` scoped to current discussion+round | `s1_player_decisions` |
| S5 vote | `s5_votes` scoped to current phase+vote_round | event logs |
| S5 round→Discussion binding | `s5_rounds` | — |
| S6 choices/votes | `s6_choices` scoped to current phase+round and state interaction identity | receipts/ledger |

Normal classroom mode after W01:

> Discussion timing does not own progression.

Discussion opening/closing is Teacher-paced where the target design says Teacher controls pacing. Final vote/submission gates remain participant-authored.

AUDIT/timed compatibility does not redefine the NORMAL authority contract.

---

# 9. s3b_player_facts — key-level contract

`s3b_player_facts` is MIXED and is **not** a generic Knowledge authority.

## 9.1 Narrow live gameplay authority

`gitte_flashlight_found`

Authority meaning:

> Gitte discovered the optional flashlight before the Mandatory GRAB.

Current active trigger reads this key to decide whether the flashlight is added to `s3_player_items`.

After acquisition:
- ownership authority = `s3_player_items`.

New UI never reads this legacy fact directly.

## 9.2 Already-normalized observation mirrors — SUPPORT_ONLY

- `gitte_heard_chapel_warning` → `chapel_warning`
- `gitte_saw_shadow` → `corridor_shadow`
- `anna_knows_great_hall_lock` → `great_hall_outer_lock`
- `anna_heard_vent_movement` → `warm_vent_movement`
- `linda_knows_warm_air_warning` → `warm_air_warning`

New Memories/Observation UI reads `s3_player_observations`.

## 9.3 Existing canonical Knowledge destinations

Legacy facts must not be the new read source:

- `gitte_knows_star` → `s3_player_knowledge: gitte_star_symbol`
- `anna_knows_snake_rule` → `anna_snake_rule`
- `linda_knows_tower_reason` → `linda_tower_reason`
- `linda_knows_watch_message` / `linda_watch_reminder` → `linda_watch_reminder`

Architecture requirement before W04:

> ACT1 consequences that already teach these facts must write/normalize the canonical Knowledge row immediately.

A Player must not have to re-inspect an item in a later scene merely to make the new Knowledge authority agree with what the story already taught.

## 9.4 Visibility / behavior-history facts — no new authority read

- `gitte_number_note_visible`
- `anna_diary_visible`
- `linda_watch_visible`
- `linda_star_key_visible`
- `linda_closure_notice_visible`
- `linda_tested_star_key`

Use:
- item ownership/view/inspection tables for Pocket state;
- `s3b_player_progress.act1_choice_id` for first-action history;
- observations/knowledge tables for durable information.

## 9.5 Facts needing GA/Teacher semantic disposition before W04

No CD invention:

- `gitte_knows_basic_map`
- `gitte_map_detail`
- `anna_knows_library_passage`
- `anna_detected_devices`
- `linda_knows_tower_closed`

For each, GA/Teacher must decide:

A. durable Player memory → define canonical Observation/Knowledge identity and normalize; or  
B. transient/derivable presentation → exclude from the new Memories authority.

Until then, W04 cannot treat `s3b_player_facts` as the fallback Memory source.

---

# 10. Pocket / knowledge authorities

| fact | authority |
|---|---|
| physical ownership | `s3_player_items` |
| explicit inspection | `s9_pocket_item_inspections` |
| current front/back/open view | `s3_player_item_view_state` |
| durable knowledge/provenance | `s3_player_knowledge` |
| durable observation/provenance | `s3_player_observations` |
| received shared-photo copy | `s3_shared_photos` |
| group-found item | `s3_group_items` |
| item definition | `s3_item_catalog` |
| knowledge identity | `s3_knowledge_catalog` |
| observation identity/text | `s3_observation_catalog` |

No generic merge with legacy facts at render time.

---

# 11. Gate model — critical refinement

A single "three players completed / not completed" model is **not valid for every scene**.

Some interactions require all three participants. Others are:

- one group action by any participant;
- Teacher-controlled;
- server-automatic;
- role-dependent.

Therefore every progress gate has a `gate_kind`.

Allowed kinds:

1. **ALL_PARTICIPANTS**
   - every required GAL must complete;
   - Teacher may show Gitte/Anna/Linda COMPLETED or NOT YET COMPLETED.

2. **ALL_PARTICIPANTS_ROUND**
   - same as above, but completion is bound to an exact interaction/round identity;
   - old round completion never carries forward.

3. **ROLE_SET_ALL**
   - required participants derive from the current accepted role allocation/branch;
   - used for role-based task/ENGAGE phases.

4. **ANY_PARTICIPANT_GROUP_ACTION**
   - one valid participant action can resolve/advance a shared interaction;
   - Teacher should show GROUP OPEN / RESOLVED, not three misleading "not completed" labels.

5. **TEACHER_CONTROLLED**
   - Teacher determines normal classroom pacing;
   - participant completion is not the progression criterion.

6. **SERVER_AUTOMATIC**
   - timers/cinematic/fallback/server state advance automatically;
   - no participant completion status.

7. **NONE**
   - pure display state / no progression gate.

The gate model answers:

> "What must become true before authoritative global progression?"

It does **not** replace each Player's local next-action sequence.

---

# 12. Exhaustive current ACT1–14 gate registry

## Pre-run

### `room.ready`
- kind: `ALL_PARTICIPANTS`
- authority: `s1_room_players`
- complete: all assigned GAL sessions joined/ready for formal start
- Teacher display: three statuses

---

## ACT1

### `act1.complete`
- kind: `ALL_PARTICIPANTS`
- participant authority: `s3b_player_progress.act1_stage='complete'`
- interaction prerequisites include first choice/consequence
- global transition: all 3 complete → ACT2

Do not create separate global authorities for opening ACK and first-choice submission; those are Player-local substates feeding this gate.

---

## ACT2

### `act2.pre_discussion_ready`
- kind: `ALL_PARTICIPANTS`
- participant completion predicate:
  - `first_meeting_locked_at is not null`
  - AND `grab_complete`
  - AND `left_start_room`
- after W03 the Player's GRAB+leave is one idempotent UI action, but the two canonical facts/events remain distinct.

Global result:
- 3/3 complete → canonical ACT2 Discussion opens exactly once.

### `act2.final_meeting_vote:<discussion_session_id>:<vote_round>`
- kind: `ALL_PARTICIPANTS_ROUND`
- authority:
  - Discussion identity/status: `discussion_sessions`
  - Player votes: `runtime_player_decisions`
- Teacher-paced discussion phase itself is `TEACHER_CONTROLLED` in NORMAL mode.
- tie/revote creates a new exact round identity.

### `act2.route_consequence_continue`
- current implementation kind: `ANY_PARTICIPANT_GROUP_ACTION`
- current mutation: `s3b_complete_foldback`
- applies only on the failed-rendezvous branch.
- It must **not** be projected as three independent participant completions because current persisted state has no per-player foldback-complete fact.

This is a current-implementation fact, not permission for CD to invent new per-player state.

---

## ACT3

### `act3.reunion`
- kind: `ALL_PARTICIPANTS`
- participant completion: `s3b_player_progress.player_location='library'`
- group authority: `s3b_run_state.party_physically_reunited`
- global transition only when all 3 have arrived.

### `act3.library_puzzle`
- kind: `ANY_PARTICIPANT_GROUP_ACTION` + server fallback
- group resolution authority: `s3b_run_state.puzzle_resolved_at / puzzle_locked_prefix`
- `s3b_library_attempts` = SUPPORT_ONLY attempt history/idempotency evidence.
- any Player may submit a group attempt.
- server fallback may resolve without a Player submission.
- Teacher UI must show group puzzle state, not 3 participant-completion boxes.

---

## ACT4 / ACT5

### `act4.private_route_choice`
- kind: `ALL_PARTICIPANTS`
- authority: `s3b_player_progress.act4_choice_id / act4_locked_at`
- 3/3 triggers direct resolution or Discussion branch.

### `act5.final_route_vote:<discussion_session_id>:<vote_round>`
- kind: `ALL_PARTICIPANTS_ROUND`
- Discussion authority: `discussion_sessions`
- vote authority: `runtime_player_decisions`
- only applicable when ACT4 private choices require Discussion.

### `act5.post_inspection_route_vote`
- kind: `ALL_PARTICIPANTS`
- authority: `s3b_post_inspection_route_votes`
- applicable only on inspect-first fallback path.

### `handoff5to6.entered`
- kind: `ALL_PARTICIPANTS`
- participant authority: `s3b_player_progress.act6_entered_at`
- observation readiness may use `act6_handoff_observed_at`
- prepared `s5_run_state` is SUPPORT context only until the barrier opens.
- 3/3 entered → `s5_run_state.act6_entered_at` / canonical S5 activation.

---

## ACT6

### Discussion phase
- kind: `TEACHER_CONTROLLED` in NORMAL classroom mode after W01.

### `act6.vote:<vote_round>`
- kind: `ALL_PARTICIPANTS_ROUND`
- authority: `s5_votes` scoped by `phase_key='act6_vote'` + current `vote_round`
- S5 run state owns the round/current outcome.

### `act6.follow_map_continue`
- current implementation kind: `ANY_PARTICIPANT_GROUP_ACTION`
- authority/mutation: current `s5_advance` transition after ACT6 answer
- no invented three-player completion state.

---

## ACT7

### Discussion/revote pacing
- kind: `TEACHER_CONTROLLED` in NORMAL mode under W01.

### `act7.vote:<vote_round>`
- kind: `ALL_PARTICIPANTS_ROUND`
- authority: `s5_votes`
- tie creates next vote round; old vote completion does not carry forward.
- no automatic fallback.

### `act7.advance`
- current implementation kind: `ANY_PARTICIPANT_GROUP_ACTION`
- mutation: current `s5_advance`.

---

## ACT8

### `act8.private_choice`
- kind: `ALL_PARTICIPANTS`
- authority: `s5_act8_private_choices`

If unanimous route:
- no final-vote gate.

If not unanimous:

### Discussion
- kind: `TEACHER_CONTROLLED` in NORMAL mode.

### `act8.final_vote:<vote_round>`
- kind: `ALL_PARTICIPANTS_ROUND`
- authority: `s5_votes` scoped to `act8_final_vote`.

### `act8.route_continue`
- current implementation kind: `ANY_PARTICIPANT_GROUP_ACTION`
- mutation: current S5 advance transition.

---

## ACT9

### Discussion phases
- kind: `TEACHER_CONTROLLED` in NORMAL mode after W01.

For each Great Hall step:

### `act9.console:<act9_step>:<round_no>`
- kind: `ALL_PARTICIPANTS_ROUND`
- current interaction identity:
  - `s6_run_state.phase_key='act9_console'`
  - `act9_step`
  - `round_no`
- Player choice authority: `s6_choices` for current phase+round.
- exact step belongs in the resolver's interaction identity even though current choice rows are primarily keyed by phase+round.

Tie/wrong-step Discussion produces a new current interaction; no old completion carry-over.

---

## ACT10

### `act10.private_choice`
- kind: `ALL_PARTICIPANTS`
- authority: `s6_choices` scoped to `act10_private`.

### Discussion
- kind: `TEACHER_CONTROLLED` in NORMAL mode.

### `act10.final_vote:<round_no>`
- kind: `ALL_PARTICIPANTS_ROUND`
- authority: `s6_choices` scoped to `act10_final_vote`.

### `act10.result_continue`
- current implementation kind: `ANY_PARTICIPANT_GROUP_ACTION`
- mutation: `s6_advance_v2` / guarded authority.

---

## ACT11

### Allocation Discussion
- kind: `TEACHER_CONTROLLED` in NORMAL mode.

### `act11.allocation:<round_no>`
- kind: `ALL_PARTICIPANTS_ROUND`
- current-submission authority: `s6_allocations`
- round identity: `s6_run_state.round_no`
- invalid allocation:
  - current `s6_allocations` rows are deleted;
  - round increments;
  - Player status returns to NOT YET COMPLETED for the new round.
- `s6_allocation_attempts` = SUPPORT_ONLY history; never used as current completion authority.

---

## ACT12

### `act12.role_engage`
- kind: `ROLE_SET_ALL`
- current required role set derives from accepted allocation/branch:
  - Leave key branch: A / B / C
  - Take key branch: A / B / WATCHER
- task precondition authority: `s6_station_tasks`
- progression-completion authority: `s6_engagements`
- a participant is COMPLETED for this gate when the engagement row for their accepted role exists.
- all required roles engaged → server begins pressure event.

This deliberately avoids making "task completed" and "ENGAGE completed" two competing group gates. Task completion is a prerequisite/local substate; ENGAGE is the authoritative group barrier.

### `act12.pressure_choice:<round_no>`
- kind: `ALL_PARTICIPANTS_ROUND`
- authority: `s6_choices` scoped to `act12_pressure`.

### `act12.cinematic`
- kind: `SERVER_AUTOMATIC`
- authority: `s6_run_state.cinematic_stage / stage_started_at`
- no participant completion boxes.

---

## ACT13

### escape presentation
- kind: `SERVER_AUTOMATIC` until the existing continue boundary becomes available.

### `act13.continue_to_boundary`
- current implementation kind: `ANY_PARTICIPANT_GROUP_ACTION`
- mutation: `s6_advance_v2`
- result: `act14_boundary_reached=true`.

---

## ACT14

### `act14.finalize`
- kind: `ANY_PARTICIPANT_GROUP_ACTION`
- mutation: `s8_finalize`
- server integrity gate must pass.
- finalization record authority: `s8_finalizations`.
- run lifecycle then becomes completed.

After finalization:
- gate kind = `NONE`;
- final reveal is presentation.

---

# 13. Teacher status projection rule

Teacher participant rows are only shown as:

- COMPLETED
- NOT YET COMPLETED
- STATUS UNKNOWN

when `gate_kind` is:

- `ALL_PARTICIPANTS`
- `ALL_PARTICIPANTS_ROUND`
- `ROLE_SET_ALL`

For `ANY_PARTICIPANT_GROUP_ACTION`, Teacher sees:

- GROUP ACTION OPEN
- GROUP ACTION RESOLVED
- STATUS UNKNOWN

For `TEACHER_CONTROLLED`:

- Teacher sees the current control state; Player completion is not invented.

For `SERVER_AUTOMATIC`:

- Teacher sees automatic-transition status; no Player is labeled incomplete.

This preserves the Teacher/User simplification without misrepresenting interactions where three separate reports are not required.

---

# 14. Operational location authority

## Early divergent movement

`s3b_player_progress.player_location` is authoritative only while participants can genuinely be in different early locations / ACT5→6 handoff.

## Later synchronized scenes

After the ACT6 entry barrier opens:

- current shared scene comes from presentation authority;
- role/station assignment comes from S6 allocation/engagement state when participants occupy different stations.

Do not continuously write later ACT locations back into the old S3B Player field merely to satisfy Teacher UI.

---

# 15. Evidence/support objects that never own current phase

- `runtime_events`
- `s1_game_events`
- `act6_13_event_ledger`
- `s6_action_receipts`
- `s6_allocation_attempts`
- `s3b_library_attempts`
- `asset_events`

Rule:

> No "latest event wins" algorithm.

---

# 16. Dead-candidate exclusion

The new Core Resolver / wrappers MUST NOT depend on:

- `s1_scene_choices`
- unreachable `renderState()`
- unreachable `submitChoice()`
- unreachable `refreshSprint3b()`

No physical deletion is authorized yet.

---

# 17. Core Resolver output contract

Minimum canonical core result:

```text
schema_version

run:
  run_id
  lifecycle
  run_mode

progress:
  active_runtime
  act_no
  interaction_key
  interaction_identity

presentation:
  scene_key
  display_mode

gate:
  gate_key
  gate_kind
  interaction_identity
  group_status
  required_participants[]
  participant_status[]   # only where gate_kind supports it

sync:
  state = FRESH | INVARIANT_BREACH
```

Viewer transport/read failure is represented outside this authoritative domain as synchronization unavailable / STATUS UNKNOWN.

---

# 18. Player wrapper

Player wrapper may expose only Player-authorized information:

- own identity;
- current canonical interaction;
- current scene;
- own local substate / legal Player action;
- own completion status for current gate;
- Player-visible Pocket/Knowledge/Observation references;
- Discussion transcript/options allowed for that Player.

It must never receive other Players' private choices merely to hide them in browser code.

---

# 19. Teacher wrapper

Teacher wrapper may expose:

- current run/interaction;
- current `gate_kind`;
- participant completion only where semantically valid;
- operational location projection;
- Discussion control/observation;
- allowed Teacher recovery/override controls derived server-side;
- maintenance diagnostics permitted to Teacher.

Teacher browser does not infer completion from:
- waiting text;
- stale location;
- presence of a button;
- old event logs.

---

# 20. Local browser state

Browser-local state remains non-authoritative.

Restore rule:

> **Same-owner + Still-valid**

Examples:

- Discussion draft → same discussion session and still open for messaging.
- Pocket expanded item → same run, item still owned/visible, view still legal.
- Teacher internal recovery selection → same run/interaction and action still authorized.
- transition overlay → never restored.

---

# 21. Architecture decisions now fixed by GA draft

Subject to Teacher/CA review, CD should not decide these during coding:

1. Authority points to runtime facts, not migration files.
2. No runtime dynamic authority-dictionary lookup.
3. `game_runs.scene_id/phase_key/step_key` are forbidden as new authority reads.
4. `game_runs.game_completed` and `session_integrity_verified` are support/cache, not independent truths.
5. `active_override_id` is provenance context, not current override-state authority.
6. `discussion_sessions` owns Discussion lifecycle.
7. `s5_rounds` is binding support only.
8. `s3b_player_facts` is mixed; only explicitly registered keys may remain authoritative.
9. `gitte_flashlight_found` remains narrow pre-GRAB authority unless separately migrated.
10. canonical Memories use Knowledge/Observation tables; ACT1 learning must normalize there before W04.
11. participant progress is a projection, not a new persistent table.
12. every gate has a `gate_kind`.
13. three Player completion statuses are used only when all/role-set participants are actually required.
14. group-single-action, Teacher-controlled and server-auto states do not fabricate Player incompletion.
15. exact round/interaction identity prevents stale completion carry-over.
16. operational location has early-divergent and later-synchronized authority domains.
17. support/evidence tables never determine current phase.
18. Player/Teacher wrappers are separate information-security boundaries.
19. conflicts fail closed; support values never silently heal missing authority.
20. CFTM/retirement is a later bounded cleanup, not part of authority resolution.

---

# 22. Remaining GA/Teacher semantic decisions before W04

The following five legacy facts still need explicit semantic disposition:

- `gitte_knows_basic_map`
- `gitte_map_detail`
- `anna_knows_library_passage`
- `anna_detected_devices`
- `linda_knows_tower_closed`

This does not block CA review of the architecture itself, but W04/Memories implementation must not begin until these five are classified as either durable canonical memory or transient/derivable state.

---

# 23. Requested review posture

This document should be challenged for:

- missing live authority;
- duplicate truth;
- a gate misclassified as participant/group/Teacher/server owned;
- information leakage across Player/Teacher wrappers;
- hidden fallback to support-only state;
- impossible or ambiguous interaction identity;
- any current code path that invalidates the stated authority boundary.

Implementation convenience is not sufficient reason to weaken the registry.
