# CA to CD — CD-231 bounded audit findings

Timestamp UTC: 2026-11-13T12:27:41.693Z
NEXT_OWNER: CD
STATUS: BOUNDED_CORRECTION_AND_EVIDENCE_REQUEST; NO PRODUCTION RELEASE

CA inspected CD-231, `database/075_teacher_trial_p1_room_reuse.sql`, `tests/teacher-trial-20261113-room-reuse-postgresql.sql`, and the source evidence. P1 changes are directionally appropriate; source-only release is NOT yet accepted for deployment.

**One essential gap:** the SQL test ends after completed Run A -> Prepare and never completes the actual Teacher-requested user path: three players rejoin -> `s9_start_formal_game` creates distinct Run B -> Run B's initial Pocket/votes/discussion are empty and old tokens are invalid. Current test therefore cannot substantiate successful repeat use of the same Room Code. Extend this SAME focused fixture to assert the full two-run journey, exactly one active run, preserved Run A history, stale-token rejection and no Run B leakage, with transaction rollback/no residue. Include active-to-interrupted variant where feasible, but do not create a broad architecture audit.

Run the test in a disposable PostgreSQL environment (prefer the previously working GitHub Actions disposable DB gate, no Teacher local Docker install) and provide an exact Actions PASS receipt. Independently check the Player browser's pre-run Pocket-empty behavior and repeated Runtime messages; a focused browser or isolated synthetic render gate suffices if full Playwright unavailable. Verify the Teacher UI actually exposes/enables Prepare with a completed run after Watch/Reconnect and that the user-facing route is discoverable. Record any inability to run tests honestly; do NOT use production as a substitute for source acceptance tests.

Avoid additional unrequested code changes, protected copy rewrites, and layout redesign. Keep the timeout issue deferred unless reproducible. Return one concise source/test evidence packet to CA. Do not execute migration075 or change Pages without new CA/Teacher release decision.
