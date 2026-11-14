# CA to CD — Teacher-approved P1 controlled production release

FROM: CA
TO: CD
TIMESTAMP: 2026-11-14T06:05:33.307Z
STATUS: PRODUCTION_GO — BOUNDED EXECUTION AUTHORIZED
NEXT_OWNER: CD

## Authority
Teacher explicitly confirmed no human gameplay was ongoing, then explicitly replied **“批准”** to the CA request to execute migration075, publish the three tested frontend files, and perform a disposable two-run smoke. This supersedes the production HOLD in `CA_to_CD_TEACHER_20261114_cd238_technical_go_production_hold.md` **for this exact release only**. CA has technically accepted CD-238. CD is execution owner; no additional Teacher approval is needed for the authorized operations unless a materially different change becomes necessary.

## Exact permitted payload (frozen candidate)
- Apply `database/075_teacher_trial_p1_room_reuse.sql`, Git blob `5cc730d6a0b63a8d3903feb7b84012463c3f0be1`, after deployed migration074.
- Deploy `src/game/app.js`, blob `198b3af8ee6b8dd8b3ce4bf4b69adb5760f9809f`.
- Deploy `src/teacher/teacher-console.js`, blob `0ea920e4f09ddacd51cb5e273b31ef8b15b28c6f`.
- Deploy `teacher.html`, blob `6429d263b9ce698dbdfcbc95732d08b0e6ec6521`.

Source baseline: `f82512acd512cd76534d17a4ddace205339a3a48`; test baseline: `1b225234ea0003fb4b420da93b4c03cb65934f66`. Follow `TEACHER_TRIAL_20261114_P1_FINAL_GO_NO_GO_PROPOSAL.md` and the existing release-readiness packet; avoid new general audit plans.

## Minimal execution gates
1. Freshly check there is no active human game at execution time (Teacher's no-active-game report is the authorization premise; stop rather than interfere if new human activity is detected). Record current Pages deployment/head/recovery ref and actual current production definition/grants of `s10_prepare_room_for_next_run`. Keep reversibility practical; no new backup infrastructure.
2. Verify production migration074 applied and the four candidate blob identities. Apply only migration075; verify function definition/grants and commit receipt.
3. Publish exactly the three tested frontend blobs together, AFTER migration075. Verify deployment success and canonical public bytes for all three.
4. Use unique disposable Teacher/Player codes and a temporary room to verify: completed Run A -> Watch/Reconnect -> Prepare -> prior tokens invalid -> Gitte, Anna, Linda rejoin -> distinct Run B, exactly one active run, Run A history retained, no Pocket/chat/vote leakage. Verify empty pre-formal Pocket, five-refresh Runtime dedupe, names and Teacher Submitted/Waiting plus actual stage; check for unexpected console/RPC errors.
5. Clean up **only the newly generated disposable fixture**, with recorded exact identifiers and a zero-residue receipt. Do not delete or alter historical user rooms/runs. If any critical step fails, STOP and follow the pre-reviewed split recovery boundary: frontend ref restoration as needed; database rollback only by reviewed 074 function restoration, never by deleting gameplay history.

## Scope exclusions and handoff
No Runtime manuscript/canonical NL-ZH changes, no slide10 share-success copy, no slides 7/19 art or UI redesign, and no additional schema changes. GA and Teacher manuscript review continues independently.

When complete or stopped, send CD -> CA formal letter and evidence with UTC timestamps, migration receipt, exact deployed Pages head, public hash verification, browser/two-run results, cleanup and whether the result is PASS or STOP. Ownership then transfers to CA for release closure and Teacher trial guidance. CD has explicit authority to execute this entire bounded release now; do not seek an extra approval for steps already approved.
