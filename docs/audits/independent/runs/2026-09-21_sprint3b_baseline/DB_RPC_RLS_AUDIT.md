# Final Database / RLS / RPC Audit

Audit run: `2026-09-21_sprint3b_baseline`  
Frozen product baseline: `3be0e6ad8395f05bbab13ca41e6b91dac57eb4fe`  
Included migrations: `001` through `012`  
Method: source-level effective-state reconstruction, not migration-by-migration acceptance.

# E1 — Effective final function definitions

The audit replayed CREATE / CREATE OR REPLACE / ALTER FUNCTION RENAME semantics through migrations 001–012.

## E1.1 Final architecture

Final function identities fall into these groups:

### Sprint 1 — legacy prototype surface
Browser-facing:
- `s1_create_room(text,text,text,text,text)`
- `s1_join_player(text,text)`
- `s1_get_player_state(text,text)`
- `s1_submit_private_choice(text,text,text,text)`
- `s1_get_teacher_state(text,text)`
- `s1_advance_scene(text,text)`
- `s1_release_player_session(text,text,text)`
- `s1_reset_room(text,text)`

Internal:
- `s1_hash_token(text)`
- `s1_touch_room(text)`
- `s1_assert_teacher(text,text)`
- `s1_get_player_by_session(text,text)`

### Sprint 2 — formal run / DiscussionRoom
Browser-facing:
- `s2_start_run(text,text,text)`
- `s2_open_discussion(...)`
- `s2_open_vote(text,text)`
- `s2_add_time(text,text,integer)`
- `s2_send_message(text,text,text)`
- `s2_submit_vote(text,text,text)`
- `s2_get_player_state(text,text)`
- `s2_get_teacher_state(text,text)`

Internal:
- `s2_protect_run_identity()`
- `s2_get_active_run(text)`
- `s2_log_event(uuid,text,uuid,text,uuid,jsonb)`
- `s2_refresh_discussion(uuid)`

Effective final definitions:
- `s2_open_discussion`: migration 003
- `s2_submit_vote`: migration 004
- `s2_get_player_state`: migration 003
- `s2_get_teacher_state`: migration 003
- unchanged Sprint2 helpers / start / open-vote / add-time / send-message remain migration 002 definitions.

### Sprint 3A — scene / Pocket / provenance
Browser-facing:
- `s3_initialize_audit_fixture(text,text)`
- `s3_audit_provenance_probe(text,text,text)`
- `s3_set_item_view(text,text,text,text)`
- `s3_share_photo(text,text,text,text,text)`
- `s3_get_player_state(text,text)`
- `s3_get_teacher_state(text,text)`

Internal:
- `s3_record_observation(uuid,uuid,text,text)`
- `s3_record_knowledge(uuid,uuid,text,text,text,uuid,text)`

Effective replacements:
- `s3_record_knowledge`, `s3_share_photo`, `s3_initialize_audit_fixture`, `s3_get_player_state`: migration 006 where redefined.
- `s3_get_teacher_state`: migration 005 remains final.

### Sprint 3B — final public wrappers
Final public/runtime identities:
- `s3b_initialize_flow(text,text)`
- `s3b_ack_act1_opening(text,text)`
- `s3b_submit_act1_choice(text,text,text)`
- `s3b_complete_act1(text,text)`
- `s3b_submit_first_meeting(text,text,text)`
- `s3b_grab(text,text)`
- `s3b_leave_start_room(text,text)`
- `s3b_apply_meeting_resolution(text,text)`
- `s3b_ack_route_update(text,text)` — final migration 012 body
- `s3b_complete_foldback(text,text)`
- `s3b_follow_sign(text,text)`
- `s3b_submit_library_code(text,text,text)`
- `s3b_submit_act4_choice(text,text,text)`
- `s3b_apply_act5_resolution(text,text)`
- `s3b_choose_post_inspection_route(text,text,text)`
- `s3b_get_player_state(text,text)`
- `s3b_get_my_facts(text,text)`
- `s3b_audit_expire_puzzle(text,text)`
- `s3b_audit_set_puzzle_elapsed(text,text,integer)`

Final internal helpers include:
- `s3b_set_scene`
- `s3b_refresh_puzzle`
- `s3b_lock_run_for_player_progress`
- ACT1 consequence / optional item triggers
- phase-guard triggers
- group-item label canonicalizer.

Migration 011 renamed twelve historical implementations to `*_pre011`; final public wrappers call those internal bodies after new guards. Migration 012 revokes browser execution on all twelve renamed historical identities.

## E1.2 Historical `*_pre011` identities retained internally

Retained but browser-locked:
- `s3b_initialize_flow_pre011`
- `s3b_submit_first_meeting_pre011`
- `s3b_grab_pre011`
- `s3b_leave_start_room_pre011`
- `s3b_apply_meeting_resolution_pre011`
- `s3b_complete_foldback_pre011`
- `s3b_follow_sign_pre011`
- `s3b_submit_library_code_pre011`
- `s3b_submit_act4_choice_pre011`
- `s3b_apply_act5_resolution_pre011`
- `s3b_choose_post_inspection_route_pre011`
- `s3b_get_player_state_pre011`

Result: E1 COMPLETE.

# E2 — Effective source-level EXECUTE privileges

## E2.1 Explicitly locked internal functions

Source reconstruction shows `PUBLIC`, `anon`, and `authenticated` EXECUTE removed from:
- Sprint1 authentication/hash helpers;
- Sprint2 active-run/event/refresh helpers;
- Sprint3A observation/knowledge writers;
- Sprint3B scene/refresh/serialization/phase-guard helpers;
- all twelve `*_pre011` functions after migration 012.

This matches the Sprint3B live B0p test that browser calls to sampled `*_pre011` functions are denied/not exposed.

## E2.2 Intended browser surface

Sprint1 and Sprint2 migrations follow the safer pattern:
1. REVOKE EXECUTE FROM PUBLIC;
2. GRANT EXECUTE TO anon, authenticated.

Sprint3A does the same for most public RPC identities.

## E2.3 Sprint3B default-PUBLIC privilege hygiene

Source-level PostgreSQL semantics imply that a newly created function begins with EXECUTE granted to `PUBLIC` unless default privileges have been changed externally.

A set of Sprint3B public/runtime functions are created and then granted to `anon,authenticated` without an accompanying explicit `REVOKE ... FROM PUBLIC`.

Source-level potentially-PUBLIC identities include:
- `s3b_ack_act1_opening`
- `s3b_ack_route_update`
- `s3b_apply_act5_resolution`
- `s3b_apply_meeting_resolution`
- `s3b_audit_expire_puzzle`
- `s3b_audit_set_puzzle_elapsed`
- `s3b_choose_post_inspection_route`
- `s3b_complete_act1`
- `s3b_complete_foldback`
- `s3b_follow_sign`
- `s3b_get_my_facts`
- `s3b_get_player_state`
- `s3b_grab`
- `s3b_initialize_flow`
- `s3b_leave_start_room`
- `s3b_submit_act1_choice`
- `s3b_submit_act4_choice`
- `s3b_submit_first_meeting`
- `s3b_submit_library_code`

This is a **privilege-hygiene observation**, not a confirmed gameplay bypass:
- player RPCs still require a valid room/session token;
- Teacher/AUDIT RPCs still require Teacher token and, where relevant, AUDIT mode;
- public availability does not remove in-function authorization.

Exact deployed `proacl` state could differ if project-level ALTER DEFAULT PRIVILEGES exists outside these migrations.

No new IDA finding is opened solely from this observation.

Recommended hardening:
- explicitly `REVOKE EXECUTE ... FROM PUBLIC` for every browser RPC before granting intended API roles;
- verify actual deployed `proacl` in PostgreSQL catalog.

Result: E2 source-level reconstruction COMPLETE; deployed catalog ACL = NOT VERIFIED.

# E3 — RLS audit

## E3.1 Tables with RLS enabled

Sprint1:
- `s1_rooms`
- `s1_room_players`
- `s1_scene_choices`
- `s1_room_state`
- `s1_player_decisions`
- `s1_game_events`

Sprint2:
- `game_runs`
- `discussion_sessions`
- `dialogue_messages`
- `runtime_player_decisions`
- `runtime_events`

Sprint3A:
- `s3_runtime_scene_state`
- `s3_item_catalog`
- `s3_observation_catalog`
- `s3_knowledge_catalog`
- `s3_player_items`
- `s3_player_item_view_state`
- `s3_player_observations`
- `s3_player_knowledge`
- `s3_shared_photos`
- `s3_group_items`

Sprint3B:
- `s3b_run_state`
- `s3b_player_progress`
- `s3b_library_attempts`
- `s3b_player_facts`

## E3.2 Policies

No `CREATE POLICY` statement exists in migrations 001–012.

Under standard PostgreSQL RLS semantics, enabled RLS with no applicable policy is default-deny for non-owner direct table access.

This is intentional in the current architecture:
- browser API uses SECURITY DEFINER RPCs;
- direct anon/authenticated table access is not the application contract.

Live suites independently verify rejection of direct anonymous reads/writes for representative Sprint1/2/3A/3B state tables.

RLS owner-bypass / FORCE ROW LEVEL SECURITY behavior is not relied upon for browser isolation because the browser does not own the tables; SECURITY DEFINER functions intentionally operate with owner authority after explicit authentication.

Result: E3 COMPLETE at source level.

# E4 — Constraint and business-integrity audit

Strong DB-level constraints include:
- one role slot per room;
- unique room join-code hashes;
- one legacy private choice per room/scene/player/decision type;
- one active formal run per room;
- immutable formal run identity/mode trigger;
- enumerated run mode/status;
- DiscussionRoom status/tie-policy checks;
- unique formal vote identity;
- knowledge provenance uniqueness;
- shared-photo provenance-copy uniqueness;
- one physical owner row per run/item;
- one player-progress row per run/player;
- ordered Library attempt PK per run;
- one Sprint3B fact per run/player/fact key;
- final puzzle hint range corrected from 0–4 to 0–8 in migration 010.

Important integrity is intentionally RPC/trigger-enforced rather than encoded only in FK/CHECK:
- player must belong to same room as run;
- discussion row must semantically match active runtime scene;
- route-state transitions;
- knowledge provenance semantics;
- phase validity for Sprint3B mutations.

The lack of a DB-wide one-open-discussion constraint is already captured as IDA-002.

The lack of scene permission for SHARE PHOTO is already captured as IDA-008.

The lack of request identity/idempotency is already captured as IDA-009/010/011.

No additional constraint-level defect is opened.

Result: E4 COMPLETE.

# E5 — SECURITY DEFINER safety

All inspected SECURITY DEFINER definitions in migrations 001–012 explicitly set:

`SET search_path = public`

No dynamic SQL / EXECUTE construction was found.

Application table/function references are overwhelmingly schema-qualified `public.*`; inspected apparent unqualified regex hits were aliases, trigger pseudo-records, or built-in set-returning functions rather than attacker-controlled identifiers.

Cross-room/run protections are implemented in the important authority helpers:
- player identity derives from session token + normalized room;
- Teacher identity derives from room + Teacher token;
- active formal run derives server-side from room;
- final `s3_record_knowledge` validates holder/source-player membership in the run's room and validates provenance source objects.

Residual deployment assumption:
- safe `search_path=public` also assumes untrusted roles cannot create/replace arbitrary objects in schema `public`.
- schema CREATE privileges are not defined by migrations 001–012 and are therefore deployment-effective NOT VERIFIED.

No dynamic-SQL or search-path exploit is confirmed.

Result: E5 source-level COMPLETE.

# E6 — Duplicate truths / authority map

The final schema intentionally contains several overlapping representations. They are safe only when one authority is named explicitly.

## E6.1 Legacy scene vs formal scene

`s1_room_state.current_scene/phase`
- authority: Sprint1 legacy prototype only.

`s3_runtime_scene_state.scene_id/phase_key/step_key`
- authority: current Sprint3B formal gameplay.

The coexistence itself is allowed by “extend, do not replace.”
Reachable UI fallback between them is IDA-003.

## E6.2 `game_runs.scene_id/phase_key/step_key` vs runtime scene

`game_runs` retains Sprint2 generic defaults:
- `generic-discussion`
- `discussion`
- `generic-vote`

Sprint3B does not mirror its current scene into those fields.

Therefore:
- do **not** use `game_runs.scene_id/phase_key/step_key` as Sprint3B gameplay authority;
- use `s3_runtime_scene_state`.

Generic `s2_open_discussion` still uses the run-level generic identifiers, which contributes to IDA-005/IDA-002.

## E6.3 Discussion outcome vs applied Game Track result

`discussion_sessions.outcome`
- authority for resolved vote/fallback evidence.

`s3b_run_state.final_meeting_result` / `group_route`
- authority for applied Game Track result.

The authority handoff is not atomic/recoverable in the current client-driven bridge: IDA-001.

## E6.4 Original meeting result vs operational route

`s3b_run_state.final_meeting_result`
- immutable historical group decision evidence once resolved.

`s3_runtime_scene_state.current_route_target`
- currently executed route target.

`wayfinding_target`
- active wayfinding destination.

Canonical fold-back intentionally preserves `final_meeting_result` while changing the operational route fields to Library.

## E6.5 Silent texting mode

`game_runs.silent_texting_mode`
- run-level current flag.

`discussion_sessions.silent_texting_mode`
- snapshot/configuration for a specific discussion session.

They are related but not interchangeable. A discussion's historical mode should be read from its session row.

## E6.6 Item labels

`s3_item_catalog.name_text_key`
- canonical item name.

`s3_group_items.label_text_key`
- persisted group-item presentation label.

Migration 010 adds a trigger to canonicalize the Library photo/torn-note group labels and reduce drift.

Result: E6 COMPLETE.

# E7 — Clean-schema / deployment-effective verification

## E7.1 What was verified

The audit reconstructed migration order 001–012 and effective source-level:
- tables;
- function identities;
- replacements/renames;
- explicit grants/revokes;
- RLS enablement;
- constraints/triggers.

Existing live tests provide runtime evidence that:
- direct anonymous formal-table reads/writes are blocked;
- sampled `*_pre011` functions are not browser executable;
- intended public RPCs are callable in the deployed test environment.

## E7.2 What was not directly available

This audit session does not have:
- PostgreSQL/Supabase catalog connection for `pg_proc.proacl`, `pg_policies`, role memberships or schema ACL inspection;
- a clean isolated PostgreSQL/Supabase instance onto which 001–012 can be reapplied and catalog-diffed;
- authoritative deployment metadata proving no external ALTER DEFAULT PRIVILEGES / schema privilege changes.

Therefore these claims remain **NOT VERIFIED at deployment-effective catalog level**:
- exact `PUBLIC` EXECUTE state for every function;
- actual `anon/authenticated` role inheritance/membership details;
- public-schema CREATE privilege;
- absence of out-of-band policies or privilege changes.

This is an evidence boundary, not a product failure.

## E7.3 Verification query set for later deployment introspection

A future live catalog audit should query at minimum:
- `pg_proc.proacl` for all `public.s1_% / s2_% / s3_% / s3b_%`;
- `information_schema.role_routine_grants`;
- `pg_policies` for all application tables;
- `information_schema.role_table_grants`;
- schema ACL / CREATE privilege for `public`;
- function overload inventory;
- trigger inventory and enabled status.

Result: E7 evaluation COMPLETE with deployment-effective ACL/catalog result = **NOT VERIFIED**.

# Method 4 conclusion

Source-level final database reconstruction is complete.

Positive conclusions:
- all gameplay/evidence tables are RLS-enabled;
- no allow policies are introduced by migrations 001–012;
- internal helpers and all `*_pre011` historical implementations are explicitly browser-locked;
- SECURITY DEFINER functions consistently set search_path and use no dynamic SQL;
- major run/provenance/decision identities have meaningful uniqueness and trigger protection.

Existing findings strengthened by DB review:
- IDA-002 — open-discussion uniqueness is not a DB-wide invariant;
- IDA-004 — puzzle prefix check occurs before authoritative refresh/lock;
- IDA-008 — no persisted/server-derived `allow_share_photo` permission exists;
- IDA-009/010/011 — request identity/idempotency is absent from relevant schemas.

No new confirmed product finding is created by Method 4.

Deployment-effective PostgreSQL catalog state remains explicitly NOT VERIFIED.
