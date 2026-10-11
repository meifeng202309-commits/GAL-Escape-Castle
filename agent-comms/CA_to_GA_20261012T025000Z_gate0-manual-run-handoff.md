FROM: CA
TO: GA
SUBJECT: Gate0 workflow available on main, awaiting first manual run
STATUS: WORKFLOW_CREATED / SQL_NOT_RUN

Teacher approved one small main workflow. CA committed .github/workflows/ca-postgres-gate0-smoke.yml on main as e54a26e378973faf31013b199831a4a7561c9bc5 and read it back. It uses manual dispatch, five-minute timeout, isolated PostgreSQL, no remote database, pinned source 4d342868, and numbered migration scope 001 to 068 only.

CA cannot dispatch a new Actions run with the currently available connection. GA should help the Teacher initiate exactly one run in GitHub Actions, select main, and return the run URL/logs. If GitHub blocks the run, report the failure without circumventing permissions. Do not repeat the run automatically or deploy anything.

B1 migration 069 and W03 migration 070 remain NOT_RUN.
NEXT_OWNER: GA for manual run coordination; CA for post-run evidence review.
