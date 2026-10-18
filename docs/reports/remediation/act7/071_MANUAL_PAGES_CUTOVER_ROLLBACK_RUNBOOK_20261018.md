# Migration 071 manual GitHub Pages cutover and rollback runbook

Status: `SOURCE_ONLY / READY_FOR_CA_REVIEW / PRODUCTION_HOLD`

Roles:

- CD — uninterrupted maintenance coordinator; owns when to issue switch/rollback instructions and verifies refs, build identity and public hashes.
- Teacher — authenticated repository-admin Pages operator; changes only the branch selector/path and presses Save exactly once per CD instruction.
- CA — reviews this protocol and later independently dispositions execution evidence.

Teacher's screenshot proves the current UI is visible with `Deploy from a branch`, `deploy/manual-acceptance-20261003`, `/(root)` and Save. It is not a successful cutover/rollback rehearsal. This runbook does not authorize a Pages change; CA approval and a completely fresh maintenance preflight remain mandatory.

## 1. Immutable identities

- Candidate branch: `deploy/act7-071-20261017`
- Candidate commit: `6e3bbd1d2795bd4486b1437a0b9e107e2238fa28`
- Rollback branch: `deploy/manual-acceptance-20261003`
- Rollback commit: `891feffe558a4683ac3da67e1e6b15e902c7e592`
- Folder for both: `/(root)`
- Never select `main`, `remediation/sprint9-structural-v1`, another folder or another ref.

Candidate public SHA-256:

| Path | Candidate |
|---|---|
| `index.html` | `1da4904ed40496b3ade206893969ce46278cf1d50debcac41ca96fac476609c4` |
| `teacher.html` | `628bb101a23e312d5f69d992d0c1212665350a130f1c124af04460b1afdb6cf3` |
| `src/game/app.js` | `9f19c27f92be9835ea5d9b48e196803dcee85eae032feb0f9e65fe3e97b323fa` |
| `src/teacher/teacher-console.js` | `4dd355ede45e5e29619da93becb5c0e47d2e9f93c9cf544edc20e876181df1ad` |
| `src/styles/app.css` | `3a375c87aeec797e2b32f8ba383d91af9ef6f9e9d01bb40cf0e3faa0f04ead7c` |

Rollback public SHA-256:

| Path | Rollback |
|---|---|
| `index.html` | `1da4904ed40496b3ade206893969ce46278cf1d50debcac41ca96fac476609c4` |
| `teacher.html` | `d2f7b8f0bfc07912fb484004d2aff8a87a20d3e8d99b0f98e25fd5a28b72950f` |
| `src/game/app.js` | `9f19c27f92be9835ea5d9b48e196803dcee85eae032feb0f9e65fe3e97b323fa` |
| `src/teacher/teacher-console.js` | `ce8fb816caf2c362311772a6eb70944b1c645eff18a64aad8b221aaa2dce474d` |
| `src/styles/app.css` | `3a375c87aeec797e2b32f8ba383d91af9ef6f9e9d01bb40cf0e3faa0f04ead7c` |

## 2. Operator readiness handshake — before SQL or ACL writes

1. Teacher opens repository `Settings > Pages`, remains signed in and confirms the source is still rollback branch + `/(root)` without changing it.
2. Teacher keeps that tab available for the full bounded window and replies exactly: `PAGES_OPERATOR_READY: rollback=deploy/manual-acceptance-20261003 candidate=deploy/act7-071-20261017 root=/(root)`.
3. CD independently verifies both remote refs, current frozen public hashes, build-status read access and the fresh SQL/ACL recovery route.
4. If Teacher cannot remain available through candidate verification or rollback completion, or the selector/Save control differs, CD records STOP before any database write.

Readiness acknowledgment is not an instruction to Save.

## 3. Candidate switch — only after reviewed SQL poststate passes

CD sends exactly: `SWITCH_PAGES_CANDIDATE_NOW: deploy/act7-071-20261017 /(root)`.

Teacher performs one atomic UI operation:

1. In `Settings > Pages > Build and deployment`, leave source as `Deploy from a branch`.
2. Open the branch selector and choose exactly `deploy/act7-071-20261017`.
3. Confirm folder remains exactly `/(root)`.
4. Before Save, read the selected branch and folder back to CD. If either differs, do not Save.
5. Press Save exactly once. Do not refresh, repeat Save, switch another branch or trigger another deployment.
6. Reply: `PAGES_CANDIDATE_SAVED` plus UTC time and a screenshot showing the selected branch/folder and GitHub's resulting status/build indication.

CD verifies:

- a Pages build/deployment starts for exact commit `6e3bbd1…`;
- it completes successfully;
- all five public URLs return HTTP 200 and exact candidate hashes above, using cache-busting query parameters;
- no acceptance fixture starts until all five match in one verification pass.

If no exact candidate build is observable within 2 minutes, if it does not complete within 10 minutes, or if any ref/hash/status differs, CD issues rollback immediately. Do not press Save again as a retry.

## 4. Rollback command — on any deployment or acceptance failure

Rollback is already within the reviewed one-attempt authority; do not wait for a second approval. CD sends exactly: `ROLLBACK_PAGES_NOW: deploy/manual-acceptance-20261003 /(root)`.

Teacher performs one atomic UI operation:

1. Select exactly `deploy/manual-acceptance-20261003`.
2. Confirm folder is `/(root)` and read both values back to CD before Save.
3. Press Save exactly once.
4. Reply: `PAGES_ROLLBACK_SAVED` plus UTC time and a screenshot of the resulting setting/status.

CD verifies:

- a Pages build/deployment starts for exact commit `891feffe…`;
- it completes successfully;
- all five public URLs return HTTP 200 and exact rollback hashes above in one cache-busted pass.

The same 2-minute build-start and 10-minute completion limits apply. Do not issue a second Save retry inside this attempt.

## 5. STOP and incident rules

STOP and keep general admission closed when:

- Teacher becomes unavailable or cannot confirm the exact selected values;
- branch/folder options differ from this runbook;
- Save produces an unexpected branch, commit, workflow or error;
- build status is unavailable, timed out or not tied to the exact expected commit;
- any public hash differs or HTTP status is not 200;
- CD/Teacher communication is interrupted or instruction order is ambiguous.

If candidate publication fails, rollback immediately before further acceptance. If rollback cannot be started or verified, declare `PAGES_ROLLBACK_INCIDENT`, keep database admission closed, preserve all evidence and escalate to CA/Teacher; do not improvise another branch, merge, force-push or repeated Save.

## 6. Evidence record

For readiness, candidate and rollback phases, retain:

- CD instruction and Teacher acknowledgment text with UTC times;
- before/after Pages settings screenshots;
- selected branch and folder;
- build/deployment run identifier, expected commit, start/completion UTC and conclusion;
- HTTP status, byte length and SHA-256 for all five public files;
- timeout, mismatch or UI error verbatim if any;
- final verified Pages source and whether general admission stayed closed.

Teacher screenshots, Save acknowledgment or a green UI alone do not prove correct public bytes. Only exact commit/build plus five-file public verification closes a switch or rollback step.

## 7. Next gate

NEXT_OWNER: CA — review this source-only manual operator protocol. After CA approval, CD must open a new bounded UTC window and repeat every fresh preflight gate before any ACL, SQL or Pages mutation.
