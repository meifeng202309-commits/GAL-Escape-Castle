FROM: GA
TO: CA
TIMESTAMP: 2026-10-12T03:15:00+08:00
SUBJECT: Gate-0 first manual run evidence — PostgreSQL host PASS, baseline stopped at 020 missing storage.buckets
STATUS: REAL_SQL_EXECUTION_PARTIAL / BASELINE_FAIL_ENVIRONMENT_DEPENDENCY / NO_RERUN_AUTHORIZATION

RUN: https://github.com/meifeng202309-commits/GAL-Escape-Castle/actions/runs/38158942746
RUN_ID: 38158942746
JOB_ID: 114527619867
TRIGGER: workflow_dispatch on main
HEAD_SHA: e54a26e378973faf31013b199831a4a7561c9bc5
PINNED_TEST_SOURCE: 4d342868bf85103740d8255f0c1407e76c79f596
GITHUB STATUS: completed / failure / attempt 1

GA read GitHub API run metadata, actual steps and decoded job logs. Runner setup PASS, PostgreSQL:16 service container initialization PASS, psql version PostgreSQL 16.15 PASS, pgcrypto in extensions schema PASS, local test anon/authenticated role setup PASS. SQL migration replay attempted and completed 001–019 in lexical order (including 014a, 014b). First failure:
MIGRATION_ATTEMPT: 020_sprint4_controlled_storage_publication.sql
psql:database/020_sprint4_controlled_storage_publication.sql:5: ERROR: relation "storage.buckets" does not exist
This is a plain PostgreSQL environment missing a Supabase Storage-managed relation, NOT proof migration020 is defective in Supabase. The prior migrations 001–019 passed execution in this disposable generic instance only. Migrations 021–068 NOT_RUN; 069 and 070 explicitly NOT_RUN; no functional B1/W03 SQL acceptance, ACL/privacy or Supabase runtime equivalence claimed. The job stopped on first error, service container was removed. No production/staging access or deployment observed in logs.

ENGINEERING DECISION REQUESTED:
Evaluate smallest safe Supabase compatibility path for migration020 and any subsequent platform-owned relations. Do not paper over dependencies with invented stub schemas without proof they preserve semantics; an actual Supabase-local service/test project might be necessary for full integration. Consider whether an isolated targeted 069/070 SQL compile/catalog test on generic PostgreSQL with expressly documented stubs can yield LIMITED evidence (never integration PASS) versus a genuine disposable Supabase stack. Avoid building a generalized platform to cure one error. Teacher's existing approval was for ONE five-minute Gate0 attempt, now consumed. Do NOT rerun or alter workflow or main without new explicit gate. Preserve original logs and evidence.

NEXT_OWNER: CA for failure classification, bounded next-route decision and user authorization if needed. CD not released.
