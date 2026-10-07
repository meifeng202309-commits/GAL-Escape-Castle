-- GAL Escape Castle
-- Authority pre-freeze bounded verification probes V1.0
-- READ-ONLY ONLY. No INSERT/UPDATE/DELETE/DDL.
-- Purpose: close CA-161 external evidence gates without changing runtime state.

-- ============================================================
-- A. DEPLOYED SCHEMA / FUNCTION / GRANT CONFIRMATION
-- ============================================================

-- A1. Confirm relevant deployed columns and types.
select table_schema, table_name, ordinal_position, column_name, data_type, udt_name,
       is_nullable, column_default
from information_schema.columns
where table_schema='public'
  and table_name in (
    'game_runs','discussion_sessions','s5_rounds',
    's1_scene_choices','s3b_player_facts',
    's3_item_catalog','s3_group_items',
    's3_runtime_scene_state',
    'asset_registry_projection','asset_candidates',
    's8_finalizations','s6_action_receipts'
  )
order by table_name, ordinal_position;

-- A2. Confirm repository-sensitive functions actually deployed and inspect exact identity.
select n.nspname as schema_name,
       p.proname,
       pg_get_function_identity_arguments(p.oid) as identity_args,
       pg_get_function_result(p.oid) as result_type,
       p.prosecdef as security_definer,
       pg_get_userbyid(p.proowner) as owner
from pg_proc p
join pg_namespace n on n.oid=p.pronamespace
where n.nspname='public'
  and p.proname in (
    's1_submit_private_choice',
    's5_submit_vote',
    's5_teacher_open_vote',
    's5_get_teacher_discussion_state',
    's8_finalize',
    's8_export_session',
    'asset_manager_sync_registry',
    'asset_manager_import_candidate',
    'asset_manager_activate_group',
    'asset_resolve'
  )
order by p.proname, identity_args;

-- A3. Retrieve deployed bodies for exact current-definition comparison.
select p.proname,
       pg_get_function_identity_arguments(p.oid) as identity_args,
       pg_get_functiondef(p.oid) as function_definition
from pg_proc p
join pg_namespace n on n.oid=p.pronamespace
where n.nspname='public'
  and p.proname in (
    's1_submit_private_choice',
    's5_submit_vote',
    's5_teacher_open_vote',
    's8_finalize',
    's8_export_session',
    'asset_manager_sync_registry',
    'asset_manager_import_candidate',
    'asset_manager_activate_group',
    'asset_resolve'
  )
order by p.proname, identity_args;

-- A4. Explicit browser-role execute privilege check for dormant legacy RPC.
select
  has_function_privilege('anon',
    'public.s1_submit_private_choice(text,text,text,text)','EXECUTE') as anon_can_execute,
  has_function_privilege('authenticated',
    'public.s1_submit_private_choice(text,text,text,text)','EXECUTE') as authenticated_can_execute;

-- A5. List routine grants for all priority functions.
select routine_schema, routine_name, grantee, privilege_type
from information_schema.routine_privileges
where routine_schema='public'
  and routine_name in (
    's1_submit_private_choice',
    's5_submit_vote',
    's5_teacher_open_vote',
    's8_finalize',
    's8_export_session',
    'asset_manager_sync_registry',
    'asset_manager_import_candidate',
    'asset_manager_activate_group',
    'asset_resolve'
  )
order by routine_name, grantee, privilege_type;

-- ============================================================
-- B. RAW VALUE COMPARISON FOR KNOWN SPLIT PAIRS
-- ============================================================

-- B1. Registry vs candidate current active-version asset_type.
select r.asset_key, r.active_version,
       r.asset_type as registry_asset_type,
       c.asset_type as candidate_asset_type,
       (r.asset_type is not distinct from c.asset_type) as equal_now
from public.asset_registry_projection r
left join public.asset_candidates c
  on c.asset_key=r.asset_key
 and c.version=r.active_version
 and c.status='ACTIVE'
order by r.asset_key;

-- B2. Registry vs candidate paired_asset_group.
select r.asset_key, r.active_version,
       r.paired_asset_group as registry_group,
       c.paired_asset_group as candidate_group,
       (r.paired_asset_group is not distinct from c.paired_asset_group) as equal_now
from public.asset_registry_projection r
left join public.asset_candidates c
  on c.asset_key=r.asset_key
 and c.version=r.active_version
 and c.status='ACTIVE'
order by r.asset_key;

-- B3. Registry vs candidate required_anchors.
select r.asset_key, r.active_version,
       r.required_anchors as registry_required_anchors,
       c.required_anchors as candidate_required_anchors,
       (r.required_anchors is not distinct from c.required_anchors) as equal_now
from public.asset_registry_projection r
left join public.asset_candidates c
  on c.asset_key=r.asset_key
 and c.version=r.active_version
 and c.status='ACTIVE'
order by r.asset_key;

-- B4. Catalog label vs group-item stored label.
select gi.run_id, gi.item_key,
       c.name_text_key as catalog_label,
       gi.label_text_key as group_item_label,
       (c.name_text_key is not distinct from gi.label_text_key) as equal_now
from public.s3_group_items gi
left join public.s3_item_catalog c using(item_key)
order by gi.run_id, gi.item_key;

-- B5. V4 canonical item-label normalization target check.
with expected(item_key, expected_text_key) as (
  values
    ('gitte_castle_map','item.castle_map'),
    ('gitte_number_note','item.number_note'),
    ('gitte_flashlight','item.flashlight'),
    ('anna_servant_diary','item.servant_diary'),
    ('linda_stopped_watch','item.stopped_watch'),
    ('linda_star_key','item.silver_star_key'),
    ('linda_closure_order','item.municipal_closure_order'),
    ('library_photo_1897','item.photo_1897'),
    ('library_torn_note','item.torn_note'),
    ('golden_key','item.golden_key')
)
select e.item_key, e.expected_text_key,
       c.name_text_key as deployed_text_key,
       (c.name_text_key is not distinct from e.expected_text_key) as matches_v4
from expected e
left join public.s3_item_catalog c using(item_key)
order by e.item_key;

-- B6. Asset metadata obsolete-candidate empirical presence.
select
  count(*) filter(where scene_id is not null) as registry_scene_nonnull,
  count(*) filter(where assigned_to is not null) as registry_assigned_nonnull
from public.asset_registry_projection;

select
  count(*) filter(where scene_id is not null) as candidate_scene_nonnull,
  count(*) filter(where assigned_to is not null) as candidate_assigned_nonnull
from public.asset_candidates;

-- B7. ACTIVE-run game_runs mirror vs current presentation values.
-- Differences here are evidence of why NO_FALLBACK is required; equality does not make game_runs Authority.
select g.run_id, g.status,
       g.scene_id as game_runs_scene,
       s.scene_id as presentation_scene,
       g.phase_key as game_runs_phase,
       s.phase_key as presentation_phase,
       g.step_key as game_runs_step,
       s.step_key as presentation_step
from public.game_runs g
left join public.s3_runtime_scene_state s using(run_id)
where g.status='active'
order by g.run_started_at desc;

-- B8. FINALIZED-run final snapshot confirmation.
select g.run_id, g.status,
       g.scene_id, g.phase_key, g.step_key,
       g.completed_at,
       f.finalized_at,
       f.integrity_report->>'verified' as integrity_verified
from public.game_runs g
left join public.s8_finalizations f using(run_id)
where g.status='completed'
order by g.completed_at desc;

-- ============================================================
-- C. DORMANT LEGACY REACHABILITY
-- ============================================================

-- C1. Confirm whether legacy choice catalog has deployed rows.
select count(*) as s1_scene_choices_row_count
from public.s1_scene_choices;

-- C2. Evidence-only listing; no mutation.
select scene_id, choice_id, choice_label, active
from public.s1_scene_choices
order by scene_id, choice_id;

-- End of read-only probes.
