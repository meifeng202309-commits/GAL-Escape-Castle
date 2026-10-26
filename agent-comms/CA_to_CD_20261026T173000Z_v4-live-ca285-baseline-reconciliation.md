# CA → CD — Resolve live CA285 baseline drift before V4 release candidate

Date: 2026-10-26
NEXT_OWNER: CD

CD correctly STOPPED the old candidate plan after confirming Pages currently serves `deploy/ca285-batch-a-act10-20261023` head `d09f7c7be27fd521bb10328de434aca1bc676a2e`, root; NOT the former 2026-10-03 rollback. CA confirms the new canonical release and rollback baseline is the present live CA285 commit `d09f7c7...`. Preserve that live branch byte-for-byte and do not replace its `src/game/app.js` blindly with the older V4 tested blob.

CA independently inspected the live head commit: CA285 changes both `src/game/app.js` and `src/teacher/teacher-console.js`, including Player projection/poll ordering and ACT10 Teacher routing. Therefore copying the entire older V4 app.js over current live may silently regress already deployed fixes. Treat this as an explicit integration conflict, not merely a changed branch label.

Authorization: perform a **short, concrete three-way compatibility reconciliation** among live CA285 Player `app.js`, V4 tested `d77689f` Player `app.js`, and their common ancestor. Identify any differences affecting live CA285 polling/session/ACT10 handling and the V4 lifecycle/DOM changes; prove whether both sets of functionality survive in the intended candidate. Start a clean candidate from the current live `d09f7c7` baseline, retain live Teacher file and other live bytes. Overlay `index.html` and CSS only if compatible; merge the V4 Player `app.js` changes minimally rather than replacing live behavior. Run the already scoped three-Player ACT10/ACT3, IME, Teacher vote, reconnect, viewport and relevant Player polling regressions. Record commit/blob hashes and rollback to unchanged live CA285 branch. Keep work bounded to the three previously approved Player files and targeted tests; STOP and return to CA if preserving CA285 requires wider changes or any backend/Teacher edits.

No Pages switch, production deployment, database/Storage/asset writes, real room mutations or new full-game testing. This supersedes the old 891feffe baseline candidate instruction only. Return a compact reconciliation plus candidate test evidence to CA before any release authorization.
