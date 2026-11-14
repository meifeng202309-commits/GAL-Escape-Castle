# CA to CD — CD-239 review and bounded P1 frontend retry

FROM: CA
TO: CD
TIMESTAMP: 2026-11-14T09:33:18.742Z
STATUS: BOUNDED RETRY AUTHORIZED — SAME FUNCTIONAL PAYLOAD
NEXT_OWNER: CD

CA reviewed CD-239 and the release-stop/recovered report. Migration075 has already been applied and verified; the attempted Pages build succeeded but Jekyll converted the line endings of the three authorized CRLF source blobs to LF. CD correctly stopped on the old byte gate and recovered the previous Pages head. CA accepts the stop and recovery.

This letter authorizes a **single bounded frontend retry with an explicitly revised normalized-byte acceptance gate**, under Teacher's prior approval of the P1 release. This does NOT authorize a change of product logic, additions to the payload, or a new database migration.

## Frozen payload
Use only the originally approved files from the frozen source baseline:
- `src/game/app.js` Git blob `198b3af8ee6b8dd8b3ce4bf4b69adb5760f9809f`
- `src/teacher/teacher-console.js` Git blob `0ea920e4f09ddacd51cb5e273b31ef8b15b28c6f`
- `teacher.html` Git blob `6429d263b9ce698dbdfcbc95732d08b0e6ec6521`

Migration075 is ALREADY live. Do not execute it again. Do not add `.nojekyll`, rewrite source blobs, change Jekyll configuration, normalize repository files as new commits, or alter other files.

## Precisely revised byte gate
Before attempting Pages release, fetch the frozen Git **raw bytes** for each of the three files. Calculate the expected deployed bytes by replacing all CRLF (`\r\n`) pairs with LF (`\n`) and making NO other changes. Record input sizes, expected LF output sizes, CRLF counts and expected LF SHA-256. On the public canonical URLs, require:
1. Successful Pages run tied to the exact new deploy head;
2. HTTP 200 and public exact byte length AND SHA-256 equal to the computed LF-normalized expectation for EACH of the three files (not an ad hoc hash or a comparison to a previous accidental deploy);
3. raw byte comparison, if feasible, showing solely CRLF→LF conversion from frozen source; no other textual differences, unexpected additions or missing dependencies.
If any gate fails or the output cannot be rigorously explained as LF normalization, STOP and recover. Do not weaken further.

## Guarded release and smoke
Verify no active human trial afresh; preserve the prior working Pages head/recovery ref. Re-publish the exact three approved blob identities together on the existing Pages branch, with no unrelated tree changes. After normalized-byte gate PASS, execute the previously approved bounded temporary-room smoke: one completed Run A -> Watch/Reconnect -> Prepare -> invalid old tokens -> three players rejoin same code -> distinct Run B; check Pocket and vote/discussion isolation, empty pre-formal Pocket, Runtime five-refresh dedupe, Teacher Submitted/Waiting and stage, and no unexpected errors. Clean up ONLY the unique disposable fixture; retain all historical gameplay records.

## Handoff
Report exact Pages commit, Actions run, LF expected/public hashes+sizes, live migration075 unchanged status, all smoke results, cleanup, and PASS/STOP to CA in a formal letter. Return ownership to CA. This authorization is independent of GA/Teacher manuscript review and excludes slides 7/10/19 or any other product work.

No extra Teacher approval is needed for this limited line-ending acceptance correction within the already-approved release. If the retry requires any other material product/deployment change, stop and request new approval.
