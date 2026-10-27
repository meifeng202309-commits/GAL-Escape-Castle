# Migration073 forward recovery disposable evidence

- Recovery source commit: `c8f2eaf8d75f43f1db3601cd54ca19aeddc13778`
- Recovery procedure: `docs/reports/remediation/act9/073_RECOVERY_TO_072.sql`
- Recovery SHA-256: `5092ec2aa110cc4424456f7a21a945bf9380b51a15779cb30e0328c46def4970`
- GitHub Actions run: `40523151514`
- Disposable PostgreSQL job: `122255407775` (`success`)

## Verified sequence

The isolated PostgreSQL 16 job applied immutable migrations 001–072, captured the exact catalog identity of the five functions changed by migration073 (definition, sorted ACL, owner, and security-definer flag), created preserved-data fixtures, applied migration073, and proved its NORMAL ACT9 Teacher-paced behavior. It then applied the incident-only forward recovery and passed the exact catalog comparison and behavioral matrix.

The recovery restored migration072 behavior and identity for:

- `s6_open_discussion(uuid,text,text,integer,text)`
- `s6_refresh_owned_discussion(uuid)`
- `s6_close_discussion_guarded(text,text,text,integer,integer,uuid)`
- `s6_get_player_state(text,text)`
- `s6_teacher_open_vote(text,text,uuid,text,integer,integer,uuid)`

The matrix proved NORMAL ACT9 returned to timed Player-close progression, NORMAL ACT10 remained Teacher-paced, stale Teacher identity was rejected, valid ACT10 Teacher progression worked, AUDIT ACT9 remained timed/refreshable, fixture room data survived, and an unrelated later function remained present. The service health step and container teardown both passed.

## Execution boundary and dependencies

This is an incident-only forward recovery procedure, deliberately outside the normal `database/NNN_*.sql` replay chain. It must never be applied as migration074 during normal rollout. It depends on the migration072 schema and is valid only after migration073 has been applied. It changes only the five functions above with `create or replace`; it does not delete or rewrite game data or unrelated later migrations.

Before any production use, stop unless all of the following are true: migration073 is present; the exact recovery SHA-256 matches; all five target signatures exist; the production ACL/owner/security-definer baseline has been captured; no newer migration has intentionally replaced a target function; and CA/Teacher has explicitly authorized the production recovery action. Any mismatch, partial SQL failure, new migration, active release ambiguity, or unexpected game activity is a STOP condition requiring CA review.

No production database, room, Pages selector, Storage object, or asset was mutated during this validation.
