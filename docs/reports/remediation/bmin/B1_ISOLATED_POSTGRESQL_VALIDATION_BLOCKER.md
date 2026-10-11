# B1 Isolated PostgreSQL Validation Blocker

Timestamp: 2026-10-11T11:40:00Z
Baseline: `f55ae62`
Authorization: `agent-comms/CA_to_CD_20261011T113000Z_bmin-isolated-postgresql-validation-gate.md`

## Result

`NOT_RUN — LOCAL_POSTGRESQL_RUNTIME_UNAVAILABLE`

No database was created, no migration was applied, and no local or remote PostgreSQL connection was attempted.

## Tool discovery evidence

The following read-only discovery was run from the repository root:

```powershell
Get-Command psql,postgres,pg_ctl,docker,podman -ErrorAction SilentlyContinue
Get-Service | Where-Object { $_.Name -match 'postgres|docker' -or $_.DisplayName -match 'PostgreSQL|Docker' }
rg -n "postgres|psql|supabase start|docker compose|testcontainers" package.json README.md docs tests scripts .github
```

Observed:

- `psql`: `NOT_FOUND`
- `postgres`: `NOT_FOUND`
- `pg_ctl`: `NOT_FOUND`
- `docker`: `NOT_FOUND`
- `podman`: `NOT_FOUND`
- Windows service inventory was unavailable under the sandbox, but no corresponding executable was resolvable.
- Repository search found standalone SQL regressions that require an already-running PostgreSQL instance; it found no local database bootstrap/test harness.

Installing PostgreSQL, Docker or another external runtime would exceed the gate's non-invasive-tooling boundary. Remote Supabase/PostgreSQL use is explicitly prohibited. The required SQL execution therefore cannot be performed in this environment.

## Exact reproducible SQL-test plan for an authorized PostgreSQL host

Prerequisites: disposable PostgreSQL database, `psql`, `pgcrypto` support as required by the repository migrations, and no network path or credentials for production/staging.

1. Create a throwaway database owned by a disposable test role; record `select version()` and installed extensions.
2. Apply every file in `database/` in lexical migration order from `001_sprint1_core.sql` through `068_package_c_authoritative_pocket_inspection.sql` with `psql -X -v ON_ERROR_STOP=1`. Stop on the first baseline error and report its file/line without editing history.
3. Capture the pre-069 identity, arguments, owner, `prosecdef`, ACL and definition of `public.s7_get_teacher_console(text,text)` from `pg_proc`, `pg_namespace`, `pg_roles` and `pg_get_functiondef`.
4. Apply `database/069_bmin_teacher_operational_projection.sql` with `ON_ERROR_STOP=1`. Verify:
   - the public two-text-argument signature remains;
   - `s7_get_teacher_console_pre069(text,text)` exists but has no `PUBLIC`, `anon` or `authenticated` execute grant;
   - the public wrapper is `SECURITY DEFINER`, has `search_path=public`, preserves expected owner, and grants execute only as declared;
   - a wrong Teacher token fails and a correct synthetic Teacher token succeeds.
5. Begin one fixture transaction. Insert only fictional room/run/Teacher/three-Player records through the repository's required parent tables. Never use real room codes, tokens, identifiers or copied data.
6. Exercise and assert JSON `operations_v1` for:
   - S3B: none/one/two Players entered ACT6; per-Player locations and transition states; current Discussion session and Player decision bound to the current phase/session; stale phase/session rows ignored.
   - S5: third entrant activation; ACT6/7/8 physical location; current `phase_key + vote_round` submission state; stale round ignored; missing current round yields `UNKNOWN_UNAVAILABLE_S5_ROUND`.
   - S6: ACT9/10 Great Hall and ACT11/12 Main Gate; assignment role remains distinct from physical location; current `phase_key + round_no` choice state; allocation/task/engagement state.
7. Within savepoints, construct each negative relationship shape and assert one output item per room Player plus the exact invalidity:
   - two allocations sharing one role → `DUPLICATE_S6_ROLE_ALLOCATION`;
   - same Player engagement under wrong role and allocated role engaged by wrong Player → `CONTRADICTORY_S6_ENGAGEMENT_RELATIONSHIP`;
   - same Player task under wrong role and allocated role task owned by wrong Player → `CONTRADICTORY_S6_TASK_RELATIONSHIP`;
   - S6 without completed S5, S5 activated before all entered, and missing S3B progress.
8. In NORMAL mode, seed distinctive private choice strings in S3B/S5/S6 owner tables and assert none appears anywhere in the returned Teacher JSON; assert only activity/submission state is exposed.
9. Assert same-run isolation by adding a second fictional run with conflicting markers and verifying it does not affect the active run result. Snapshot gameplay tables before/after repeated wrapper calls and assert no mutations.
10. In one statement, verify output cardinality and document PostgreSQL statement-snapshot semantics: the wrapper's reads share the statement snapshot, while this does not claim cross-request atomicity.
11. Roll back the fixture transaction. Restore/drop by discarding the entire database; do not reverse 069 inside any persistent environment.
12. Run the existing B-min static/browser/A2 regressions and report SQL, source-static and browser-mock evidence tiers separately.

## Available regression results

Executed PASS on this baseline:

- `node tests/bmin-teacher-operations-static-check.js`
- bundled Node + Playwright `tests/bmin-teacher-operations-browser.mjs`
- bundled Node + Playwright `tests/bmin-teacher-polling-order-negative.mjs`
- `node tests/sprint7-static-check.js`
- `node tests/level2-export-selection-behavior-check.js`
- `node tests/level3-remediation-static-check.js`

These results do not upgrade SQL compilation, database execution, migration replay, ACL inspection, fixture behavior or deployed behavior beyond `NOT_RUN` / `NOT_VERIFIED`.

## Changed paths

Evidence/reporting only. No production source, migration, schema, runtime or test implementation was changed.

