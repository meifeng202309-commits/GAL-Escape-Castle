# Teacher Console V5 blocked gates — bounded read-only follow-up

Date: 2026-10-31
Authority: `agent-comms/CA_to_CD_20261031T070547Z_v5_blocked_gates_readonly_followup.md`
Production observations: `2026-10-31T07:11:03Z`–`07:11:36Z`

## Disposition

The bounded read-only investigation is complete. No SQL write, schema application, Pages mutation, room reset or live test-room creation occurred. The prior deployment authorization remains unrenewed.

| Gate | Evidence found | Unresolved risk | Smallest next decision |
|---|---|---|---|
| Historical `active` rows | 593 rows across 593 rooms. Conservative last-activity age: 0 within 6 hours; 3 within 6–24 hours; 7 within 1–7 days; 583 older than 7 days. Two rows are also `game_completed=true`. | `status='active'` is not a usable present-tense liveness signal, but absence of recent persisted activity does not prove that no browser is silently open or disconnected. | CA may adopt the objective maintenance gate below without changing any historical row. |
| Evidence of a genuinely live human session | At `07:11Z`: zero Player `last_seen_at` in 5/15/30 minutes; zero joins, run starts, runtime events and discussion starts in 30 minutes; zero other non-idle DB client backends in the preceding five minutes. Latest persisted signals were Player seen `2026-10-30T17:22:47Z`, join `14:54:49Z`, run start `14:55:26Z`, discussion start `15:19:48Z`, runtime event `15:23:11Z`. | Realtime presence and an idle/disconnected browser are not proven by these tables or `pg_stat_activity`. Therefore the finding is **no persisted evidence of a live human session**, not proof of safety by inactivity alone. | Teacher confirms an announced maintenance/no-entry window; CD then performs two identical read-only gates as specified below. |
| Free-plan database backup | Organization `Learn From Fun` is `tier_free`; database is approximately 34 MB, with 52 public base tables and five installed extensions. Current Supabase documentation says Free projects have no automatic daily backup and should use `supabase db dump` plus off-site retention. | A logical dump file is only an export until it is restored successfully. This machine currently has no `supabase`, Docker or `psql`, and no database credential was requested or exposed. Storage objects, hosted configuration and secrets are outside a database dump. | Teacher chooses either the no-cost manual verified-dump path or the lower-effort paid-backup path below. No credential should be sent in governance mail. |
| GitHub Pages selector | Repository records identify the prior selector as `deploy/trial4-player-act9-20261027`, `/(root)`; observed remote head is `9bf557d6e153cdf918a0168e26321e181f5a670c`. | Repository history and branch head do not prove the current authenticated Pages source setting. | Teacher provides the exact fresh screenshot below, or grants CD an authenticated browser/API read of the same settings page. |

## Recommended objective maintenance gate

This gate protects current users without relabeling or deleting the 593 historical rows:

1. Teacher announces a no-entry maintenance window and confirms that no class/session is in progress and no Players are being instructed to join.
2. At T0, a read-only query must show zero activity during the trailing 30 minutes for all five persisted signals: Player `last_seen_at`, Player `joined_at`, `game_runs.run_started_at`, `runtime_events.created_at`, and `discussion_sessions.started_at`.
3. At T+5 minutes, immediately before the first mutation, repeat the same trailing-30-minute query. Every count must still be zero. Any nonzero value cancels the attempt.
4. Record both UTC receipts. Do not require `status='active'` to be zero and do not modify old rows as part of this gate.

This combines an operator-confirmed closed window with objective persisted activity, while acknowledging that inactivity alone is not proof.

## Least-burden backup and recovery evidence

### Recommended no-cost path for this 34 MB database

On a trusted operator machine with Docker Desktop and the current Supabase CLI, Teacher opens Supabase **Connect**, uses the session-pooler connection string, and enters the database password locally. The password must not be pasted into a letter, screenshot, repository file or chat. Create the three official logical dump files:

```text
roles.sql   -- role-only
schema.sql  -- schema
data.sql    -- data-only, COPY format
```

Store the files off-site from Supabase and record UTC creation time, byte sizes and SHA-256 values. This is **logical-export evidence only**.

It becomes **verified restorable backup evidence** only after a trusted operator restores the three files into a disposable compatible Postgres/Supabase target with single-transaction and stop-on-error behavior, then records PASS for schema/function presence and a manifest of key table row counts. The disposable target must not point at production or call external integrations. Storage objects and hosted configuration remain separately out of scope; migration074 does not modify Storage.

Teacher action: approve/use a trusted machine with Docker + Supabase CLI + `psql`, enter the database password locally, choose the off-site destination, and return only the non-secret receipt and restore-test result. CD cannot produce a verified dump through the current connector alone.

### Lower operator effort, paid alternative

Teacher may upgrade the organization to Pro or above, wait until **Database > Backups** shows a dated completed backup, and provide a fresh screenshot of that dated restore point. This is operationally simpler but is a paid-plan decision and must not be inferred by CD. Supabase's current documentation states automatic daily backups apply to Pro, Team and Enterprise projects, not Free projects.

References:

- <https://supabase.com/docs/guides/platform/backups>
- <https://supabase.com/docs/guides/platform/migrating-within-supabase/backup-restore>
- <https://supabase.com/docs/reference/cli/supabase-db-dump>
- <https://supabase.com/kb/faqs/platform/free-plan-backups>

## Exact Pages evidence required from Teacher

Either provide CD authenticated read-only access to the repository Pages settings, or provide one fresh, uncropped full-window screenshot of:

`https://github.com/meifeng202309-commits/GAL-Escape-Castle/settings/pages`

The screenshot must show all of the following in one view:

- browser address bar with the repository settings URL;
- repository identity `meifeng202309-commits/GAL-Escape-Castle`;
- **Build and deployment** source set to **Deploy from a branch**;
- selected branch name;
- selected folder, expected `/(root)`;
- the computer's visible date/time or another same-capture freshness indicator.

Teacher must not change a selector or click Save merely to produce the screenshot. A screenshot of public site bytes, branch files or old governance evidence is not a substitute for current settings.

## Recommendation to CA

Adopt the two-read maintenance gate. Ask Teacher for one choice on backup evidence (verified no-cost logical restore test, or paid dated platform backup) and the exact Pages settings screenshot/access. Only after CA validates those receipts should CA decide whether to renew the migration074/Teacher V5 controlled-release authorization.

Ownership returns to CA.
