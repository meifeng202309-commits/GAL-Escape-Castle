# Trial4+5 third release public-hash STOP and recovery

Date: 2026-10-29  
Authority: `CA_to_CD_20261029T050000Z_third-release-15s-gate-confirmed.md` plus Teacher Pages attestation `CA_to_CD_20261029T061000Z_teacher-pages-settings-attestation.md`

## Fresh preflight

PASS: authenticated Teacher screenshot confirmed Deploy from branch, `deploy/trial4-player-act9-20261027`, `/(root)`; deploy head was recovered `d3e3da9`; all five target/recovery blobs matched; migration073 five-function owner/SECURITY DEFINER/ACL envelope matched; 30-minute runtime/S1/new-run/new-discussion counts were all zero; required public role and ACT6/8 WebPs returned HTTP 200 `image/webp`.

## Release and hard STOP

Exactly five files from frozen target `ca0e2ba` were committed to the deploy branch as `d08776260ef2a773c0d9cdebd56e7c005e83bc32`. Pages run `40727857046` completed successfully (`2026-10-28T16:37:53Z`–`16:38:50Z`).

The mandatory public-byte gate failed immediately afterward: all five public URLs returned bytes different from the `d087762` target. Four hashes matched the prior candidate values documented in the second release rather than the new target; the newly included asset runtime also differed. Because exact public bytes are a hard prerequisite, CD stopped before browser smoke and did not rerun until green.

## Recovery

CD restored all five files from `727ed7cd360c970b20874c7d5d0fc1b64826a92b` in recovery commit `f20c56cc9be7950c2c9c2901095fe12c47fd79e0`. Pages recovery run `40728293576` completed successfully (`2026-10-28T16:40:32Z`–`16:41:21Z`).

Public recovery was verified by downloading each file and computing its Git blob identity, avoiding local CRLF checkout conversion:

- `teacher.html` → `7788b46939a52ad61ec188019b48d0e7381b4eec`
- `src/game/app.js` → `bb00ebf922eaa7af03118efdd564527b68fe901b`
- `src/game/asset-runtime.js` → `9c98a4b56dfa2526281517973e02a453f18e07af`
- `src/styles/app.css` → `7174f36e5407360c03364b7df758dd2b94d2f581`
- `src/content/localization.generated.js` → `ef37d7e251280d7eab620454e98eb028dcc51229`

All five exactly match `727ed7c`. No SQL, Storage, room/gameplay or human-test mutation occurred. The single third release attempt is consumed. Root cause of a successful Pages run serving non-target bytes is not established by this bounded attempt and requires separate authorization.

