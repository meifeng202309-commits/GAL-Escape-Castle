# Teacher V5 backup feasibility after local prerequisite check

Date: 2026-11-01
Owner: CD
Trigger: `agent-comms/CA_to_CD_20261101_backup_no_local_tools_alternative.md`

## Result

The lowest-effort no-cost path to a **verified recoverable logical database backup** is to use one trusted operator computer that already has working Docker Desktop and Supabase CLI, then run the already-reviewed `scripts/teacher-v5-verified-backup.ps1` workflow there.

Teacher's current PC has neither command on `PATH`. Installing both on that PC is technically possible, but it is not the first recommendation: it adds two installations, Docker virtualization/startup troubleshooting, CLI version validation, a large container download, and local restore support before the actual backup can begin.

## What existing authorized tools can and cannot provide

- The connected Supabase actions can perform authorized catalog/read queries, but expose no native full roles/schema/data dump plus disposable restore operation. They cannot produce a verified recoverable backup receipt.
- Teacher Console snapshot/export is an application-level game/run export. It is not a database backup and cannot restore the Supabase database.
- Repository migrations and source preserve intended schema/code history, but do not contain current production rows and are not a backup of live state.
- A table-by-table logical export through SQL or connector calls could preserve selected data, but would omit or risk incompletely reproducing roles, grants, policies, functions, triggers, extensions, sequences and restore ordering. Without a successful disposable restore, it is only a logical data export.
- Moving production credentials and sensitive dumps into GitHub Actions or another new hosted integration would broaden the trust surface and require separate authorization. It is not the minimum-effort path under the current gate.

## Path comparison

### A. Trusted already-equipped operator machine — recommended

Teacher's smallest action:

1. Identify one trusted person/computer that already has Docker Desktop and Supabase CLI working.
2. Provide that operator private local access to the repository workflow and an encrypted/trusted off-site folder.
3. During an announced no-entry window, paste the Session-pooler connection string only into the script's hidden local prompt.
4. Return only `verified-backup-receipt.json`; never transmit SQL dumps, passwords or connection strings.

This path reuses the reviewed workflow, keeps credentials local to one trusted machine, proves restore into a disposable PostgreSQL target and produces the two required booleans:

```text
verified_restorable_logical_backup = true
offsite_copy_verified = true
```

### B. Install on Teacher's current PC — fallback only

Use only if no trusted equipped operator is available and Teacher explicitly chooses local installation. Minimum prerequisites are official Docker Desktop and a current official Supabase CLI, followed by version/startup checks and the same reviewed script. Installation alone does not create or verify a backup.

## Gate disposition

- Current state: **no verified backup exists**.
- Existing exports/connectors must not be described as a verified recoverable backup.
- Migration074 and Teacher Console V5 production release remain unauthorized.
- Next owner: CA, to ask only whether Teacher can name a trusted already-equipped operator/machine. If yes, run the existing workflow once. If no, return to Teacher for the explicit choice to install prerequisites locally or keep the release blocked.
- No production, database, Storage, Pages, room or credential mutation occurred in this assessment.
