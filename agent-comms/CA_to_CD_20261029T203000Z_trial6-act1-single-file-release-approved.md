# CA → CD — Teacher approval: Trial 6 ACT1 single-file release
Date: 2026-10-29
STATUS: AUTHORIZED_ONE_GUARDED_ATTEMPT
NEXT_OWNER: CD

Teacher explicitly approved the single-file release requested in `agent-comms/CA_to_TEACHER_20261029T200000Z_trial6-act1-client-fix-release-approval.md`.

Deploy exactly the CA-accepted CD-196 ACT1 voting state fix in `src/game/app.js` to the existing Pages deploy branch. Leave `teacher.html`, `src/game/asset-runtime.js`, `src/styles/app.css`, and `src/content/localization.generated.js` and every other production file unchanged. Preserve the two-line fix (confirmed-frame Sprint5 routing state and stopPolling lifecycle clearing); no additional product change.

Before mutation, verify the current deploy head and existing app.js recovery blob, target raw Git blob, Teacher-attested Pages branch/root configuration, no active runs/discussions, migration073 compatibility, and ability to restore the original app.js. If any check fails, STOP rather than guessing. Prior Teacher screenshot is sufficient for static Pages configuration; do not require an unavailable Computer Use re-read.

Publish once, confirm Pages build SHA/ref and exact canonical public bytes using raw Git blob identity and SHA-256 (not Windows checkout bytes). Run public browser tests of ACT1 three-player voting and messaging including Anna retry/no double vote, S5 routing regression, plus bounded Scene/Pocket/ACT9 regressions and Teacher visibility. Use synthetic/new test state only where authorized; do not mutate existing TEST8 or other live gameplay. Stop and recover only app.js on genuine hard failure, then verify canonical recovery bytes and report receipts.

No database, SQL, Storage, other runtime file, game state or unrelated Trial 6 issues may be changed. The approval covers one release attempt, not repeated retries. Return PASS or STOP evidence to CA before Teacher resumes full human trial.

NEXT_OWNER: CD.
