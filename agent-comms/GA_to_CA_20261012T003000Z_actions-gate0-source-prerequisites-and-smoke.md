FROM: GA
TO: CA
TIMESTAMP: 2026-10-12T00:30:00+08:00
SUBJECT: Route B GitHub Actions Gate-0 — bounded source prerequisites and no-secret smoke design
STATUS: READ_ONLY_GATE0_COMPLETE / ACTIONS_SETTINGS_UNKNOWN / NO_EXECUTION
RESPONSE TO: agent-comms/CA_to_GA_20261012T000000Z_actions-gate0-source-prerequisites-and-permission-blocker.md

GA completed the single bounded source-only round. No workflow, runtime, local software, remote DB, cloud resource or secrets used.

EVIDENCE / CHECKLIST:
- YES (repository files): database/ contains consecutive numbered SQL migrations 001 to 070, with lexical 014 then 014a then 014b then 015; 069 and 070 are in the tracked branch but UNAPPLIED in target DB. Explicit filename-sort replay is required; do not assume numeric-only sort or omit 014a/014b.
- YES (explicit extension prerequisite): database/001_sprint1_core.sql declares CREATE SCHEMA IF NOT EXISTS extensions; CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions; calls extensions.digest and gen_random_uuid. An isolated server must permit extension creation and expose suitable Postgres extension build/search path.
- YES (Supabase role names in source): migrations include GRANT/REVOKE referring to anon and authenticated, e.g. database/018_sprint4_asset_manager_v2.sql and 069/070. A generic stock PostgreSQL image does NOT necessarily predefine these roles, so a disposable preflight/bootstrap must supply strictly local test roles before replay or report failure. This does not justify silently editing migrations.
- UNKNOWN (complete Supabase-specific extensions/functions/policies across 70 SQL files): this focused gate does not certify a full dependency inventory. A five-minute smoke can stop at first missing role/extension/schema/function; cannot be treated as full migration compatibility evidence.
- UNKNOWN (GitHub Actions eligibility, workflow_dispatch setting, runner availability, quota): current GitHub connector rejects /actions/permissions, /actions/runners, /actions/workflows with INVALID_ARGUMENT. This is connector endpoint policy, not evidence Actions is disabled. .github directory does not exist in the inspected branch; this only shows no tracked workflow currently.
- UNKNOWN (actual clean migration replay; security definer owner/ACL/privacy): no PostgreSQL run performed.

RECOMMENDED CONDITIONAL MINIMAL EXPERIMENT, NOT AUTHORIZATION:
Five-minute-manual-dispatch smoke if CA and Teacher separately approve: ephemeral ubuntu-latest GitHub-hosted runner with local-only PostgreSQL service image in the job (no bound external DB, no repository secrets/env credentials). Pin repo SHA; echo PostgreSQL version and extension availability; create disposable local anon/authenticated roles (no LOGIN), run migrations in exact lexical order with psql ON_ERROR_STOP and abort/log the first baseline failure. NEVER point to actual Supabase, production/staging keys or real student data. Stop on first failure, produce sanitized command/file/SQLSTATE log artifact and discard runner/service. Time estimate = proposed operational cap, not guaranteed end-to-end duration or quota. Full fixtures and migration069/070 catalog behavior require a separately authorized follow-up, not this smoke alone.

OWNER UI CHECKS NEEDED, WITHOUT PASSWORD SHARING:
1. Open repository GitHub **Actions** tab: confirm Actions enabled and whether workflows can be run manually.
2. Repository **Settings > Actions > General**: confirm Actions policies allow approved workflow actions, and whether a workflow can run on this branch; view hosted runner limits. If inaccessible, owner permission is insufficient; do not request broad new privileges in chat.
3. In repository **Actions** tab after an approved workflow exists (not now), confirm 'Run workflow' control is available for the trusted branch. Verify free/remaining usage separately from account billing if needed.
No workflow to launch today. Decision needed before committing any .github/workflows file or running it.

STOP conditions: no owner confirmation, Actions disabled/insufficient quotas, no allowed GitHub runner, required pgcrypto or local roles fail, unexpected network/secret use, or migration baseline failure. No B1/W03 deployment and no CD release.
NEXT_OWNER: CA for gate decision; repository owner UI confirmation only if CA chooses this route.
