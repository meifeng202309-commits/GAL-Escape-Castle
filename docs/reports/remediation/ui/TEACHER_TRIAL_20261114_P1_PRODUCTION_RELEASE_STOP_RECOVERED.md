# P1 production release — STOP with frontend recovered

UTC completion: 2026-11-14T08:48:56Z

Authority: `agent-comms/CA_to_CD_20261114T0605Z_p1_production_release_teacher_approved.md`

## Disposition

**STOP.** Migration 075 deployed and verified. The three-file Pages candidate was built and deployed, but the mandatory canonical public-byte gate failed because the Pages/Jekyll artifact normalized the authorized CRLF Git blobs to LF bytes. CD stopped before live fixture smoke and restored the Pages branch to its recorded pre-release head. Recovery workflow succeeded.

## Preflight

- Supabase project: `qdcbdcjobzytzhnhfwyn`, healthy.
- No activity in the trailing 20 minutes at the execution check: zero recently updated rooms, zero Player `last_seen_at`, zero new game events.
- Production function readback matched migration 074 active-only behavior before mutation.
- Pages branch: `deploy/trial4-player-act9-20261027`.
- Previous Pages head: `a2e54cabcaf43f588d83069ecb736fe1138753d6`.
- Recovery ref created: `safety/pages-before-p1-release-20261114` -> `a2e54cabcaf43f588d83069ecb736fe1138753d6`.

## Database receipt

- Applied migration: `20261114060753 teacher_trial_p1_room_reuse_075`.
- Candidate blob: `5cc730d6a0b63a8d3903feb7b84012463c3f0be1`.
- Function readback contains active-or-completed selection, completed-run active-conflict guard, active-run interruption only, generation rotation, Player session invalidation, and history-preserving event data.
- ACL readback: `anon=true`, `authenticated=true`, `PUBLIC=false`.
- Migration 075 remains deployed under the pre-reviewed split recovery boundary. It is backward compatible with the restored frontend and does not delete or alter historical runs by itself.

## Pages attempt and hard-gate failure

- Candidate Pages head: `6e08aeacef397ea2b6c5020f8c594c5181a2d854`.
- Tree delta was exactly `src/game/app.js`, `src/teacher/teacher-console.js`, `teacher.html` with the authorized blob IDs.
- Candidate Pages workflow: [43564850218](https://github.com/meifeng202309-commits/GAL-Escape-Castle/actions/runs/43564850218), build/deploy SUCCESS.
- Canonical URLs returned updated semantic content, including routed-action dedupe, Gitte/Anna/Linda labels, completed-room Prepare guidance and Teacher Submitted/Waiting state.
- Exact public hashes did not equal the frozen Git blob hashes after canonical cache expiry and an Age 0 origin refill:

| File | Authorized blob-byte SHA-256 | Canonical public SHA-256 |
| --- | --- | --- |
| `src/game/app.js` | `0a9943ce51f0d02a49c575fd4b78090abe9435f4b3da7418eaff671ae6624d4d` | `7bfeed92c448db31d6ac0276366856ba3dc6f439f7fa6bc5a618b750148b7634` |
| `src/teacher/teacher-console.js` | `8a721a67e813f2357ad9617b9000bb0d0633f81ef9b9c3ee84a1fea3f3af06fe` | `ee1f93813c19693b0529111ff3898fabc2c615fbb94a949d6927dc47bd8dffac` |
| `teacher.html` | `11db558036015530542bc1709ee791c4788a16f3a4e800a9b25b09a6e9e0559d` | `23bcc790fe5b37d3badfc69bbf849c0d31e3dbd2646eac55a9f7fe86eaee3997` |

Read-only diff showed no textual delta; the mismatch is line-ending normalization. Changing the frozen blobs to LF or adding `.nojekyll` would be a materially different payload and was not authorized.

## Recovery

- Forced update used an exact `--force-with-lease` against candidate head `6e08aea`.
- Pages branch restored to `a2e54cabcaf43f588d83069ecb736fe1138753d6`.
- Recovery ref and deploy branch now point to the same recorded head.
- Recovery Pages workflow: [43577502142](https://github.com/meifeng202309-commits/GAL-Escape-Castle/actions/runs/43577502142), SUCCESS.

## Smoke and cleanup

No production disposable room was created because the public-byte prerequisite failed first. Therefore no fixture rows existed to clean up, and no historical room/run/player row was changed by the smoke path. The same-room two-run live smoke was not executed.

## Required next decision

CA must choose and authorize one bounded frontend route:

1. approve LF-normalized versions of the same three textual files as new exact blobs; or
2. approve an explicit Pages/Jekyll bypass such as an already-reviewed `.nojekyll` deployment change; or
3. replace the exact-byte acceptance rule with a precisely defined normalized-byte rule.

CD must not retry Pages or run the live fixture without that new decision. Migration 075 may remain live because the approved split boundary anticipated a frontend recovery after successful database deployment.
