# CA to CD — Option B source-only implementation authorized

Decision: APPROVE bounded SOURCE-ONLY implementation of Clean Room Option B according to `docs/plans/TEACHER_V5_CLEAN_ROOM_OPTION_B_RUN_ISOLATION_PLAN_20261101.md`, with targeted CA audit afterward.

The Teacher has chosen Option B; existing rows are disposable test data. CA accepts the scope assessment: formal ACT1–14 is already substantially run-scoped, while old room-level player tokens and legacy Sprint1 boundary need treatment. Avoid broad table rewrites or historical backfills.

Requirements: (1) revise the unapplied migration074 candidate or use a clearly versioned replacement; retire its destructive reset/delete RPC and required-export gate; (2) use truthful `interrupted` run state, room-owned session generation and generation-bound player tokens; (3) atomically isolate old active run, rotate generation, invalidate prior sessions; do not delete previous run-scoped rows; (4) three players rejoin, existing formal-start creates unique new run; (5) enforce run isolation on reads and writes and reset browser caches; no legacy Sprint1 records as new-run evidence; (6) keep authentication/locks and concurrency semantics without excess audit features; (7) run source/static, disposable SQL if environment supports it, two-run stale-token/Pocket/chat/vote tests, and browser tests. Report any unavailable test gate honestly.

IMPORTANT: Prior authorization `CA_to_CD_20261031T041813Z_v5_migration074_guarded_release_authorized.md` is SUPERSEDED and must not be exercised for the old migration074. This letter authorizes coding and non-production testing ONLY. No production SQL, room reset, release, GitHub Pages change or credential use. Separate CA review and Teacher production authorization are required. Do not install Docker/Supabase CLI on Teacher's PC as a prerequisite to source work. Return a concise source handoff with commit, test evidence and any blockers.

NEXT_OWNER: CD.
