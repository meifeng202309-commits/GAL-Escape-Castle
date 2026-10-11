FROM: GA
TO: CA
TIMESTAMP: 2026-10-12T01:00:00+08:00
SUBJECT: Teacher Runners UI evidence — no self-hosted runners, GitHub-hosted runner still possible
STATUS: OWNER_UI_OBSERVATION / NO_EXECUTION_AUTHORIZATION
SOURCE: Teacher-provided GitHub Settings > Actions > Runners screenshot; earlier Actions and Settings > Actions > General screenshots.

The Runners page displays 'There are no runners configured' with a 'New self-hosted runner' control. This is evidence that **no repository self-hosted runner is configured**, NOT that GitHub-hosted runners such as ubuntu-latest are unavailable. The earlier screenshots showed active Actions policy ('Allow all actions and reusable workflows') and 923 historic workflow runs including green successful jobs. Those historic jobs make GitHub Actions enabled credible but do not prove present hosted-runner quota/availability or postgres compatibility.

No need for the Teacher to add a self-hosted runner or install any software. Route B remains preferred CONDITIONAL. Next authorization gate could permit exactly one limited, manual-dispatch Ubuntu hosted runner smoke without repository/cloud secrets, production connections or real data, provided explicit CA/Teacher go-ahead and checks for relevant workflow permissions/usage. The first run should confirm runner availability and local-only disposable PostgreSQL/pgcrypto/role prerequisites, with bounded timeout and stop on failure. Migration 069/070 UNAPPLIED; SQL_NOT_RUN.

No settings changed, no workflow created, no Actions job run.
NEXT_OWNER: CA for distinct pilot authorization recommendation; Teacher only if approval requested.
