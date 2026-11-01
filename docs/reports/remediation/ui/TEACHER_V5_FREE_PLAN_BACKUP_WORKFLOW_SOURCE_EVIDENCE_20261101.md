# Teacher V5 Free-plan verified-backup workflow — source evidence

Date: 2026-11-01
Authority:

- `agent-comms/CA_to_CD_20261031T095030Z_teacher_chooses_simple_manual_verified_backup.md`
- `agent-comms/CA_to_CD_20261031T164317Z_teacher_pages_settings_screenshot.md`

## Outcome

CD prepared the smallest practical Windows workflow for the Teacher-selected no-cost backup option:

- operator script: `scripts/teacher-v5-verified-backup.ps1`;
- Teacher runbook: `docs/runbooks/TEACHER_V5_FREE_PLAN_VERIFIED_BACKUP_WINDOWS.md`;
- source safety gate: `tests/teacher-v5-verified-backup-static-check.js`.

The workflow is source-ready but has not been called a verified backup. This environment has no Supabase CLI, Docker or `psql`, and CD neither requested nor accessed a production database credential. A real backup receipt can exist only after Teacher/trusted operator runs the script on an equipped machine and its disposable restore passes.

## Lowest-burden Teacher interaction

Teacher performs four local actions:

1. use a trusted Windows machine with Supabase CLI and Docker Desktop and start Docker;
2. choose one encrypted/trusted off-site folder outside the repository;
3. keep a no-entry/no-class window active;
4. copy the Session-pooler URL from Supabase **Connect** and paste it only into the script's hidden local prompt.

The script automates the five-minute wait, three official dump commands, source manifest, disposable restore, exact comparison, SHA-256 receipt, off-site copy verification and disposable-container cleanup. Teacher sends only `verified-backup-receipt.json`, never credentials or SQL dump files.

## Enforced boundaries

- refuses local and off-site destinations inside the repository;
- discovers the installed `supabase db dump --help` and requires current `--db-url`, `--role-only`, `--data-only` and `--use-copy` flags;
- never persists or prints the production connection string;
- requires zero trailing-30-minute activity at T0, T+5 and after dump creation;
- creates separate `roles.sql`, `schema.sql` and `data.sql` using the official CLI shape;
- pins the disposable target to `supabase/postgres:17.6.1.166`, matching the observed production Postgres build, and records the pulled image digest;
- restores with `--single-transaction` and `ON_ERROR_STOP=1`;
- exactly compares source and restored public object counts, five observed extension versions, and eight key table row counts;
- computes SHA-256 and verifies the off-site copy;
- emits `verified_restorable_logical_backup=true` only after restore comparison and `offsite_copy_verified=true` only after copied-file hashes match;
- defaults to deleting the disposable container;
- contains no migration application, reset RPC, Pages write, git push or production-data write path.

## Scope limit

The output is a logical database backup. It excludes Storage object bytes, platform/API/JWT secrets, hosted Auth provider configuration, Edge Function secrets, custom domains and other platform settings. Migration074 is database-only and does not modify Storage; broader disaster recovery remains a separate concern.

## Verification performed by CD

| Check | Result |
|---|---|
| PowerShell parser | PASS, zero syntax errors |
| `node tests/teacher-v5-verified-backup-static-check.js` | PASS |
| PlanOnly with absolute local/off-site paths | PASS; no directory, network, Docker, Supabase or database operation |
| Repository-contained off-site path negative case | PASS; refused before operation |
| `git diff --check` | PASS |

The initial PlanOnly exposed and CD corrected Windows absolute-path and execution-policy compatibility before recording PASS. Full Docker/dump/restore execution is intentionally NOT RUN here because prerequisites and production credentials are absent; this is the smallest remaining Teacher/trusted-operator action, not evidence of failure.

## Pages evidence status

Per CA's exact transcription, Teacher's fresh cropped screenshot shows:

- Source `Deploy from a branch`;
- branch `deploy/trial4-player-act9-20261027`;
- folder `/(root)`;
- Save disabled.

CD did not inspect the original image and does not upgrade this transcription into a fully compliant authenticated receipt because the crop omitted the URL bar, repository identity and clock. The backup workflow does not require another Pages screenshot. CA can decide later whether this supporting evidence plus direct release-time access is sufficient.

## Current release status

No migration074 application or release is authorized. No SQL write, production data mutation, room reset, test-room creation, Pages setting/deployment change, credential access, dump creation or off-site copy occurred. Ownership returns to CA for source review and orchestration of the one local operator run.

Official references:

- <https://supabase.com/docs/guides/platform/backups>
- <https://supabase.com/docs/guides/platform/migrating-within-supabase/backup-restore>
- <https://supabase.com/docs/reference/cli/supabase-db-dump>
- <https://supabase.com/changelog?types=breaking-change>
