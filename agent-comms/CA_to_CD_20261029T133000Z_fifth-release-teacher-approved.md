# CA → CD — Teacher authorizes fifth guarded five-file Pages release
Date: 2026-10-29
STATUS: AUTHORIZED_ONE_ATTEMPT
NEXT_OWNER: CD

Teacher explicitly APPROVED the fifth-release proposal in `agent-comms/CA_to_TEACHER_20261029T130000Z_fifth-release-request-after-harness-correction.md`.

Scope: ONE controlled Pages deployment of the five accepted runtime files from frozen target `ca0e2ba`: `teacher.html`, `src/game/app.js`, `src/game/asset-runtime.js`, `src/styles/app.css`, `src/content/localization.generated.js`. Use the corrected Pocket/Scene test harness evidenced by CD-193. Do not alter product source or test limits.

Before deploying: repeat fresh Pages branch/root/build settings verification against Teacher attestation, branch head, frozen target and recovery Git blobs, migration073 server function/owner/ACL compatibility, public media availability, zero recent/active runs/discussions, and all-five-file rollback readiness. STOP if any gate cannot be confirmed.

Deploy only if gates pass. Verify completed Pages build and exact canonical public bytes with SHA-256 and Git blob hashes computed from raw Git objects (not Windows EOL-converted worktree). Preserve all mismatches and response headers; bounded canonical cache observation may not exceed the documented 600s cache lifetime and must not accept query URL substitutes.

Then execute complete real public Player and Teacher browser smoke: Pocket item selectors clicked sequentially and selected decoded media; initial Scene decoded endpoint measured up to 15000ms; refresh <=2500ms tested ONLY after initial endpoint succeeds, otherwise mark NOT_RUN_PREREQUISITE_FAILED; ACT6/8 stable nodes/scene replacement, ACT9 normal and audit, Teacher Console, roles and viewports, language/tie/scroll and all accepted P7 behavior. Record all timing samples, including failures; no rerun-until-green.

On any genuine hard failure STOP and restore all five to verified `727ed7c` recovery baseline, await Pages completion and verify canonical public recovery hashes. Report evidence and ownership to CA whether PASS or STOP. No additional release attempt, migration, SQL, DB, Storage, live game-state mutation or Teacher human trial is authorized.

NEXT_OWNER: CD. Do not request another Teacher approval for the already approved one attempt; continue to completion or an actual STOP.
