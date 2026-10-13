# Direct Supabase read-only recovery — 2026-10-13
Scope: LIVE_CATALOG_READ_ONLY via connected Supabase plugin. No database mutation or deployment.
Project GAL's Castle Escape, qdcbdcjobzytzhnhfwyn, PostgreSQL 17.
Observed public s7_get_teacher_console(text,text), owner postgres, SECURITY DEFINER and EXECUTE for anon/authenticated. Function definition does not include operations_v1 and does reference s3b_player_progress.
Observed existing public s3b_grab(text,text), s3b_leave_start_room(text,text), owner postgres and EXECUTE for anon/authenticated.
Did NOT find new s3b_grab_and_leave function or s3b_action_receipts table.
Observed supporting public tables: s3b_player_progress, discussion_sessions, runtime_events, s3_runtime_scene_state, s5_rounds, s6_engagements, s6_station_tasks.
list_migrations returned an empty list; this does not establish that previously manually applied SQL scripts were never run.
Repository migrations 069/070 remain SQL_NOT_RUN and no live deployment acceptance was performed. No full function body comparison made.
Prior CD SQL Editor live evidence: docs/audits/independent/runs/2026-10-07_authority_prefreeze_deployed_evidence/EXECUTION_CONTEXT.md.
Onboarding updated: docs/onboarding/START_HERE.md and docs/onboarding/GAL_ESCAPE_CASTLE_开发项目新成员指南_V1.0.md.
Follow-up read-only deeper catalog comparison may proceed inside independently authorized investigation. Real production mutation requires explicit separate gate.