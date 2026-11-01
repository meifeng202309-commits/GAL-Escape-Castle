# Teacher V5 Free-plan verified backup — Windows operator runbook

This workflow prepares a **logical database backup**, proves that it restores into a disposable local Supabase-compatible PostgreSQL container, verifies key schema and row counts, and copies the files to an operator-selected off-site location. It never writes to production.

## Teacher does only these actions

1. Use a trusted Windows computer that already has the current **Supabase CLI** and **Docker Desktop**, or ask a trusted operator to install them from official sources. Start Docker Desktop.
2. Choose an encrypted/trusted off-site folder that is not inside the Git repository, such as an encrypted external drive or trusted encrypted synced folder.
3. Announce a no-entry/no-class maintenance window. Keep students out while the script performs its automatic T0, T+5-minute and post-dump checks.
4. In Supabase Dashboard, open **Connect**, choose **Session pooler**, and copy the connection string with the real database password. Paste it only into the script's hidden local prompt.
5. After PASS, send CA/CD only `verified-backup-receipt.json`. Do not send the SQL files, password or connection string.

Never paste credentials, full connection strings, raw dumps, session tokens or secrets into ChatGPT, GitHub, email or governance letters.

## Run

From the repository root in PowerShell:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\teacher-v5-verified-backup.ps1 -OffsiteRoot "E:\GAL-Private-Backups"
```

Replace `E:\GAL-Private-Backups` with the selected encrypted/trusted off-site location. A dry planning check that performs no database, Docker, network or filesystem operation is:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\teacher-v5-verified-backup.ps1 -OffsiteRoot "E:\GAL-Private-Backups" -PlanOnly
```

`Bypass` applies only to this child PowerShell process and the reviewed repository script; it does not change the computer's persistent execution policy.

## Automatic safety and verification

The script:

- refuses local or off-site output inside the repository;
- checks the installed CLI's current `db dump --help` before use;
- uses a hidden local prompt and does not save the production connection string;
- requires all five trailing-30-minute activity indicators to be zero at T0, T+5 minutes and after dump creation;
- creates the official separate `roles.sql`, `schema.sql` and `data.sql` files;
- uses pinned `supabase/postgres:17.6.1.166` for an unmistakably disposable local restore database;
- restores in a single transaction with stop-on-error behavior;
- requires exact equality between source and restored public-object/key-table row-count manifests;
- records file sizes and SHA-256 hashes;
- copies to the chosen off-site destination and rechecks each dump hash;
- deletes the disposable restore container by default.

A dump is verified only when the final receipt contains both:

```text
"verified_restorable_logical_backup": true
"offsite_copy_verified": true
```

If the script fails, keep the terminal output private, do not call the files a verified backup, and send CA/CD only a sanitized error summary without credentials or student data.

## Scope limits

This is a logical database backup, not a full Supabase platform clone. It does not include Storage object bytes, project API/JWT secrets, Auth provider configuration, Edge Function secrets, custom domains or other hosted settings. The proposed migration074 changes only the database and does not modify Storage, but broader disaster recovery would need those items handled separately.

Official references:

- <https://supabase.com/docs/guides/platform/backups>
- <https://supabase.com/docs/guides/platform/migrating-within-supabase/backup-restore>
- <https://supabase.com/docs/reference/cli/supabase-db-dump>
