# CA → CD — Teacher-approved Linda input/vote one-file release
Date: 2026-10-30
STATUS: ONE_GUARDED_RELEASE_AUTHORIZED
NEXT_OWNER: CD

Teacher explicitly approved the release request in `agent-comms/CA_to_TEACHER_20261030T033000Z_trial7-linda-ime-release-approval.md`.

Execute ONE guarded GitHub Pages release changing only `src/game/app.js` to the exact CA-accepted CD-200 source version. Preserve all other production files byte-for-byte. This includes IME candidate Enter handling, stable S2 draft/input preservation through polls, authoritative voting updates while composing, bounded composition recovery, clearing stale pre-run title and session draft isolation.

Before mutation: verify deployed source and target raw Git blob identities, current deploy branch HEAD, Teacher-attested Pages source/branch/root, migration073 compatibility, all recovery bytes and **fresh 30-minute activity inactivity checks** (zero new/newly-active runs, newly opened discussions, gameplay/S1 events; historical active/open rows alone do not block). STOP on actual concurrent gameplay or contradictory evidence. Do not require unavailable Computer Use to re-read static Pages settings.

Deploy once and verify successful Pages SHA/ref/run, canonical public app.js binary exactly matching raw target Git blob and SHA-256 (not Windows worktree). Run focused public source/browser tests with mocked RPCs and no live room mutation: Chinese/Dutch IME Enter does not send, multiple polls preserve the input draft and node, intentional Send exactly once, Teacher Open Vote during composition yields visible vote actions and all three roles reach 3/3. Verify existing ACT1/S5 message/vote routing, Scene/Runtime/Pocket/ACT9/Teacher regressions. Record all failures, do not rerun until green.

If a genuine hard gate fails, restore only `src/game/app.js` from the exact verified pre-release baseline, wait for Pages build and confirm canonical public recovery bytes. Return PASS/STOP evidence to CA; no human trial until CA acceptance.

No database, SQL, Storage, TESTB/TEST8, real room/game-state mutation, other source changes or additional deployments authorized. The approval is for this one attempt only.

NEXT_OWNER: CD.
