# Migration073 ACT9 NORMAL Teacher-Paced Source Evidence

Date: 2026-10-27

## Identity and scope

- Authorization: `CA_to_CD_20261027T111000Z_trial4-player-source-accepted-act9-dev-scope-gate.md`
- Baseline: `2550a4c`
- Frozen source: `defe73e`
- Migration: `database/073_act9_normal_teacher_paced_vote.sql`
- No live database invocation, real-room mutation, Pages deployment, or Storage change.

## Source behavior

- NORMAL ACT9 discussion creation now produces a null deadline for initial, retry, tie, and wrong-step openings because every path uses the effective `s6_open_discussion` function.
- `s6_refresh_owned_discussion` never deadline-advances NORMAL ACT9 or ACT10. AUDIT retains its configured 180/60-second expiry behavior.
- Guarded Player message submission continues to accept null deadlines. Guarded Player close rejects NORMAL ACT9/10.
- Player projection marks NORMAL ACT9/10 as `teacher_open_required`; the existing Player close control remains disabled and no countdown is rendered for null deadlines.
- The existing Teacher RPC now accepts NORMAL ACT9 and ACT10 with unchanged run, phase, step, round, and discussion-session identity guards. ACT9 advances to `act9_console`; legitimate Player group-choice submissions continue through the existing guarded RPC.
- Teacher UI exposes Open Vote only for NORMAL ACT9/10 open discussions and sends all required identities.

## Executed verification

Passed:

- `node --check src/game/app.js`
- `node --check src/teacher/teacher-console.js`
- `node tests/act9-073-normal-teacher-paced-static-check.js`
- `node tests/act9-073-normal-teacher-paced-policy.test.js`
- `node tests/ca284-act10-teacher-open-vote-static-check.js`
- `node tests/v4-player-integration-static-check.js`
- `node tests/ca284-act10-teacher-open-vote-browser.mjs` with bundled Playwright
- `node tests/v4-player-integrated-runtime-browser.mjs` with bundled Playwright

The browser regressions cover ACT9 and ACT10 Teacher routing with complete identities, three Player projections, NORMAL ACT9 disabled Player close, ACT10 discussion/vote, IME-safe input, Pocket behavior, both required desktop viewports, and retained ACT9 Runtime scroll.

## PostgreSQL transaction gate

`tests/act9-073-postgresql-transaction.sql` covers NORMAL beyond old deadlines, valid/stale Teacher triggers, null-deadline messaging, rejected Player close, legitimate three-Player voting, NORMAL retry, and AUDIT 180/60 transitions. It has not been executed because this host has no `psql`, `postgres`, `pg_ctl`, Docker, Podman, or Supabase CLI. The only connected database is the live project, and CA explicitly prohibited live database invocation or real-room mutation.

Result: source and non-database regressions are frozen and passing; PostgreSQL certification remains `NOT_RUN` pending a CA-authorized disposable PostgreSQL route. Production application and deployment remain prohibited.
