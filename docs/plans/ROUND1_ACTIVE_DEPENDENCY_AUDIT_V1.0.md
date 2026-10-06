# Round-1 Active Dependency Audit V1.0

Date: 2026-10-06  
Owner: GA  
Basis commit before this audit: `a18fa99e8ac4c122787efdcabf835c52b3a56783`  
Status: STATIC DEPENDENCY AUDIT — architecture planning only  
Implementation authorization: NONE

## 1. Question

The repository contains 50 persistent tables created by migrations `database/001...068`.

The previous authority-map draft classified all 50 by intended meaning, but that did **not** prove all 50 are still used by the current product.

This audit asks:

> Which tables are actually reachable from the current production Player/Teacher code, current SQL call graph, triggers, export/integrity paths, or current operational support paths?

The goal is to separate:

- `ACTIVE_AUTHORITY` — currently used and owns a current fact;
- `ACTIVE_SUPPORT` — currently used, but only for compatibility/audit/export/idempotency/binding/history;
- `DEAD_CANDIDATE` — no current production dependency found by this audit;
- `RETIRED` — intentionally disabled and verified absent from current production. None are declared RETIRED by this audit.

## 2. Method

### 2.1 Production browser entry points

Current HTML entry files load:

- `index.html -> src/game/app.js`
- `teacher.html -> src/teacher/teacher-console.js`

The audit treated these as the production browser roots.

### 2.2 JS reachability, not simple text search

A simple search for `rpc(...)` over-counts dead code.

A named-function call-graph check found these Player functions currently unreachable from production top-level/event paths:

- `refreshSprint3b`
- `renderState`
- `submitChoice`

This matters because `submitChoice` contains the current repo's only Player-side call to `s1_submit_private_choice`, but `submitChoice` itself is not reachable.

Teacher named functions were all reachable from current page/event wiring.

### 2.3 Dynamic RPC calls included

The audit also included RPC names passed through `data-s3b-rpc`, `data-s5-rpc`, `data-s6-rpc`, and Teacher conditional RPC selection rather than only literal RPC calls.

Examples include:

- S3B actions: `s3b_ack_act1_opening`, `s3b_submit_act1_choice`, `s3b_grab`, `s3b_leave_start_room`, `s3b_follow_sign`, `s3b_submit_act4_choice`, etc.
- S5 actions: `s5_submit_vote`, `s5_submit_private_choice`, `s5_send_message`, `s5_advance`.
- S6 actions: `s6_submit_group_choice_v2`, `s6_submit_private_choice_v2`, `s6_submit_allocation_v2`, `s6_close_discussion_v2`, `s6_complete_station_v2`, `s6_engage_v2`, `s6_advance_v2`.
- Teacher conditional actions: `s2_open_vote` / `s5_teacher_open_vote`, `s2_add_time` / `s5_teacher_add_time`.

### 2.4 SQL dependencies included

For current production RPCs, the audit traced:

- latest wrapper definitions across migration order;
- called internal functions;
- tables read/written by those functions;
- trigger-owned side effects where relevant;
- finalization/export/integrity paths;
- asset-management runtime paths.

Tests were **not** treated as proof that a table is production-active. Tests are evidence/coverage, not product entry points.

### 2.5 Static-audit limitation

This is a static dependency audit. It is strong evidence of current reachability but not a mathematical proof that no external legacy client can call a still-granted old RPC directly.

Therefore `DEAD_CANDIDATE` means:

> no current production dependency found in this repository's active product path.

It does not yet mean the object may be physically dropped.

---

## 3. Headline result

Persistent tables created through migration 068:

- **38 ACTIVE_AUTHORITY**
- **11 ACTIVE_SUPPORT**
- **1 DEAD_CANDIDATE**
- **0 RETIRED**

Total: **50 / 50 classified**

The major finding is therefore:

> The database is not carrying dozens of obviously dead tables. Most of the 50 tables are still connected to current gameplay, Teacher operations, export/integrity, idempotency, asset runtime, or audit paths.

However, a substantial subset is **support-only** and must not be mistaken for current-state authority.

The one clear table-level dead candidate is:

> `s1_scene_choices`

Its only identified product path is the legacy Sprint1 choice path through `s1_submit_private_choice`; the current Player function `submitChoice` that calls that RPC is itself unreachable.

---

# 4. ACTIVE_AUTHORITY — 38 tables

These tables are currently reachable and own a current fact in their scoped domain.

| Table | Current authority |
|---|---|
| `s1_rooms` | room identity / Teacher credential identity |
| `s1_room_players` | Player role/session/presence identity |
| `game_runs` | formal-run identity and lifecycle **only for the designated lifecycle columns** |
| `discussion_sessions` | canonical DiscussionRoom lifecycle/status/policy |
| `dialogue_messages` | canonical transcript history |
| `runtime_player_decisions` | generic/S3B Discussion decisions |
| `s3_runtime_scene_state` | current presentation scene/context |
| `s3_item_catalog` | item definitions |
| `s3_observation_catalog` | observation definitions |
| `s3_knowledge_catalog` | knowledge definitions |
| `s3_player_items` | physical item ownership |
| `s3_player_observations` | observation provenance |
| `s3_player_knowledge` | knowledge provenance |
| `s3_shared_photos` | received shared-photo copies |
| `s3_group_items` | group-owned items |
| `s3_player_item_view_state` | current front/back/open item view |
| `s3b_run_state` | ACT1–5 run-level gameplay state |
| `s3b_player_progress` | ACT1–5 and ACT5→6 per-player progress |
| `s3b_post_inspection_route_votes` | scoped ACT5 post-inspection route votes |
| `teacher_overrides` | override occurrence/reason/provenance |
| `teacher_override_validity` | semantic validity caused by Teacher override |
| `asset_registry_projection` | runtime asset registry/active-version projection used by resolver |
| `asset_candidates` | asset candidate/version/review/publication state |
| `asset_manager_reviewers` | Asset Manager reviewer authorization config |
| `s5_run_state` | ACT6–8 gameplay state |
| `s5_votes` | S5 votes |
| `s5_act8_private_choices` | ACT8 private choices |
| `s6_run_state` | ACT9–14 gameplay/mechanism/cinematic state |
| `s6_private_clues` | S6 private-clue delivery state |
| `s6_choices` | S6 choices |
| `s6_allocations` | accepted role allocation |
| `s6_engagements` | station engagement |
| `s6_station_tasks` | station-task completion |
| `s6_station_b_progress` | Station-B staged progress |
| `s6_audio_occurrences` | audio occurrence identity/state |
| `s6_audio_consumptions` | per-player audio consumption |
| `s8_finalizations` | finalization/integrity record |
| `s9_pocket_item_inspections` | explicit Pocket inspection |

Important: `ACTIVE_AUTHORITY` is scoped. It does **not** mean every column in a table is authoritative for every purpose. `game_runs` remains the clearest mixed example.

---

# 5. ACTIVE_SUPPORT — 11 tables

These remain reachable or required, but they must not be used as competing current-state authorities.

| Table | Why it is still active | Authority restriction |
|---|---|---|
| `s1_room_state` | current Teacher legacy room-state load/advance/reset path; generic legacy context | not formal ACT1–14 progression authority |
| `s1_player_decisions` | current Teacher legacy state and generic initial-choice projection still read it | not formal S3B/S5/S6 decision authority |
| `s1_game_events` | current room create/join/release/legacy maintenance actions still write it | legacy evidence only |
| `runtime_events` | Teacher console, finalization/export, formal-event provenance | audit/evidence; never derive current phase from latest event |
| `s3b_library_attempts` | request identity, attempt history, final integrity/export | attempt history; S3B run state owns resolved puzzle state |
| `s3b_player_facts` | current S3B compatibility triggers/logic and Pocket inspection still touch legacy flags | compatibility facts; new knowledge UI must prefer canonical knowledge/observation tables |
| `asset_events` | current Asset Manager/resolver/load-failure telemetry | lifecycle evidence only |
| `s5_rounds` | current S5 phase/vote-round → canonical DiscussionRoom binding | binding/index only; `discussion_sessions` owns discussion lifecycle |
| `s6_action_receipts` | current S6 v2 mutation idempotency/replay protection | replay support, not gameplay phase |
| `s6_allocation_attempts` | current S6 allocation attempt history/idempotency analysis | attempt history; `s6_allocations` owns accepted allocation |
| `act6_13_event_ledger` | trigger/audit/export timeline for ACT6–13 | audit projection/evidence only |

---

# 6. DEAD_CANDIDATE — 1 table

## `s1_scene_choices`

Evidence:

1. It is read by the legacy RPC `s1_submit_private_choice`.
2. Current Player file still contains `submitChoice()`, which calls `s1_submit_private_choice`.
3. Static JS call-graph analysis found `submitChoice()` unreachable from the current production top-level/event paths.
4. Current Player `refreshState()` no longer calls `renderState()`; pre-run presentation uses `renderLifecycleNotice(...)`.
5. No current Teacher/product path identified in this audit requires `s1_scene_choices`.

Related dead-code candidates in `src/game/app.js`:

- `renderState`
- `submitChoice`
- `refreshSprint3b`

Related dormant RPC path:

- `s1_submit_private_choice`

### Recommendation

Do **not** drop the table yet.

First mark this path as a small **CFTM candidate** for a later quarantine test:

`CFTM = Closed For The Moment`

Preferred quarantine mechanism:
- do not edit/comment historical migration files;
- use a new additive migration to revoke the dormant public RPC if Teacher/GA/CA later approve;
- remove/disable the unreachable current JS dead code in the same bounded cleanup;
- run the integrated regression;
- only after proven absence consider RETIRED/drop work in a later cleanup.

Because there is only one clear table-level dead candidate, a scoped CFTM test is feasible, but it should not interrupt the current architecture discussion.

---

# 7. Important code-level finding: text occurrence != active dependency

The audit found these named Player functions unreachable:

- `refreshSprint3b`
- `renderState`
- `submitChoice`

This demonstrates why repository-wide grep alone is insufficient.

For future authority/dependency audits:

> dependency must be reachable from a current product entry point, trigger, export/integrity path, or authorized operational tool — not merely present in source text.

---

# 8. Current legacy/support paths that are still genuinely active

Several old-looking Sprint1 structures are **not** dead today because Teacher UI still exposes/uses legacy maintenance operations:

- `s1_get_teacher_state`
- `s1_advance_scene`
- `s1_reset_room`
- `s1_release_player_session`

Therefore:

- `s1_room_state`
- `s1_player_decisions`
- `s1_game_events`

cannot yet be labeled dead.

They may become retirement candidates only after the redesigned Teacher Maintenance/Developer UI and its actual runtime dependencies are finalized.

---

# 9. Consequence for the Canonical Authority Map

The previous `ROUND1_CANONICAL_AUTHORITY_MAP_V0.1_DRAFT.md` made one conceptual mistake:

> it assigned an architectural role to every existing table before checking whether the table was still live.

Corrected workflow:

```text
50 persistent tables
      ↓
Active Dependency Audit
      ↓
38 ACTIVE_AUTHORITY
11 ACTIVE_SUPPORT
1 DEAD_CANDIDATE
      ↓
Canonical Authority Registry
      ↓
Core Resolver / viewer projections
```

The new Authority Registry must therefore:

- include ACTIVE_AUTHORITY facts as canonical owners;
- record ACTIVE_SUPPORT sources explicitly as `DO_NOT_USE_FOR_CURRENT_AUTHORITY`;
- exclude DEAD_CANDIDATE from new runtime design;
- keep CFTM/retirement decisions separate from authority design.

---

# 10. CFTM decision

No CFTM code/database change is performed by this audit.

Reason:

- static audit already reduced the candidate set to one clear table-level candidate;
- changing live database grants before Authority Registry/CA review would create unnecessary parallel change;
- the current project gate explicitly holds CD/runtime implementation.

Recommended later scoped experiment, if desired:

1. baseline integrated test;
2. additive migration revokes `s1_submit_private_choice`;
3. remove/disable unreachable `submitChoice/renderState` legacy path with explicit `CFTM` marker in the bounded cleanup branch;
4. full relevant regression;
5. if no dependency appears, classify `s1_scene_choices` as RETIREMENT_CANDIDATE;
6. physical drop remains a separate later decision.

---

# 11. Confidence and remaining audit questions

High confidence:
- all 50 persistent tables are classified;
- current Player/Teacher production entry files are known;
- current dynamic RPC selection is included;
- the one obvious dormant Sprint1 choice path is isolated.

Still worth independent CA challenge:
- whether any external/legacy client outside current repository entry pages is contractually supported;
- whether any SUPPORT_ONLY object should instead be retired after Teacher UI recomposition;
- whether current SQL trigger chains contain an indirect dependency not visible in the current migration definitions inspected here.

Until that review, no table should be physically dropped.
