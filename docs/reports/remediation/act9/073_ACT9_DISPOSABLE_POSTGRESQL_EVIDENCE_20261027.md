# Migration073 ACT9 Disposable PostgreSQL Evidence

Date: 2026-10-27

## Authorization and identity

- CA gate: `CA_to_CD_20261027T131500Z_act9-073-source-review-disposable-sql-gate.md`
- Frozen ACT9 source: `defe73e`
- CI harness commit: `63e4f80630d3b9da9403e9afaee6496f6612b7ab`
- GitHub Actions run: `40513214700`
- Run URL: `https://github.com/meifeng202309-commits/GAL-Escape-Castle/actions/runs/40513214700`
- Result: `completed / success`, attempt 1

## Isolated environment

- GitHub-hosted `ubuntu-latest` runner
- Disposable `postgres:16` service; reported PostgreSQL `16.15`
- Ephemeral database and local-only credentials declared in the workflow
- No Supabase production credentials, endpoint, rooms, or data
- Service container removed by GitHub Actions teardown

## Executed sequence

1. Created only the Supabase-compatible `anon`, `authenticated`, and `service_role` roles plus the minimal `storage.buckets` compatibility table.
2. Applied every immutable migration file whose numeric prefix is 001 through 072 in lexical order. The run reported `BASELINE_MIGRATIONS_APPLIED=74`; the count includes the letter-suffixed `014a` and `014b` history files.
3. Confirmed `to_regprocedure('public.s6_get_player_state_pre072(text,text)')` returned `s6_get_player_state_pre072(text,text)` after migration072.
4. Applied `database/073_act9_normal_teacher_paced_vote.sql`; all five replacement functions compiled and the transaction committed.
5. Executed `tests/act9-073-postgresql-transaction.sql` with `ON_ERROR_STOP=1`.
6. The matrix returned `ACT9_073_POSTGRESQL_TRANSACTION_PASS`, then issued `ROLLBACK`.
7. The teardown query confirmed both fixture rooms were absent and emitted `ACT9_073_FIXTURE_TEARDOWN_PASS`.

## Covered behavior

- NORMAL ACT9 initial and retry discussions have no deadline and do not auto-advance after a forced old deadline.
- NORMAL guarded messaging remains valid; Player close is rejected.
- Stale Teacher identity is rejected; valid Teacher identity advances ACT9 to `act9_console`; replay against the stale phase is rejected.
- Three legitimate Player group choices remain valid and resolve normally.
- AUDIT ACT9 initial 180-second and retry 60-second deadlines still advance when expired.
- Teacher progression is rejected in AUDIT.

## Result

The previously `NOT_RUN` PostgreSQL gate is now PASS on the exact frozen migration073 source. No live database, real room, deployment, Pages, Storage, or production gameplay state was touched. Migration073 remains development-only pending independent CA review and separate deployment authorization.
