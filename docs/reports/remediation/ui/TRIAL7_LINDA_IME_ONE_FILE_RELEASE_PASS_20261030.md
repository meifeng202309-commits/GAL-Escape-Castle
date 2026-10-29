# Trial 7 Linda IME one-file Pages release — PASS

Date: 2026-10-30  
Authority: `CA_to_CD_20261030T040000Z_trial7-linda-ime-one-file-release-approved.md` and `CA_to_CD_20261030T050000Z_linda-ime-release-session-release-gate-clarification.md`

## Fresh preflight

- Teacher-attested Pages source remained `deploy/trial4-player-act9-20261027`, `/(root)`.
- Deploy branch was clean and equal to origin at `e3454c58498f545ab69aa638fa09baa324f25770`.
- Recovery `src/game/app.js` blob: `c8494321754a0630fa8307621b9a699595c0c7f4`.
- Exact CA-accepted CD-200 target blob: `b49a03913af3a0dcf0db6d24edc031d9cd5cf2a4`.
- Production receipt `20261027151620_act9_normal_teacher_paced_vote_073` remained present.
- The earlier three S1 events were only `TESTB` `teacher_released_player_session` IDs 3714–3716 at `13:59:44Z–13:59:47Z`. No later join/rejoin/start/vote/chat or runtime activity existed.
- At `2026-10-29T14:29:55.870383Z`, the preceding 30 minutes had zero new runs, newly active runs, newly opened discussions, runtime events and S1 events.

## One-file release

Only `src/game/app.js` changed, with 21 insertions and 4 deletions. Before commit, `git hash-object` returned the exact authorized target blob.

- Release commit: `9bf557d6e153cdf918a0168e26321e181f5a670c`.
- Pages run: `40892207073`.
- Ref/SHA: `deploy/trial4-player-act9-20261027` / `9bf557d6e153cdf918a0168e26321e181f5a670c`.
- Result: `completed / success`, created `2026-10-29T14:30:46Z`, completed `2026-10-29T14:32:05Z`.

## Canonical public bytes

Canonical `https://meifeng202309-commits.github.io/GAL-Escape-Castle/src/game/app.js` returned the deployed 80,310-byte binary.

- Public Git blob: `b49a03913af3a0dcf0db6d24edc031d9cd5cf2a4`.
- Public SHA-256: `cbf496dec09dc5d1eea70baee3a438bf94a2a8476d5ec3c2c8729798c0089915`.
- The public blob exactly matched the authorized raw target.

## Mocked-RPC browser regressions

No real room or game-state RPC was sent.

- Trial7 permanent real-source gate: PASS. Chinese composition Enter/keyCode 229 sent zero messages; draft and exact input node survived three polls; explicit Send produced exactly one transcript acknowledgement; Dutch `lin` composition did not block Teacher voting; Linda received vote controls; GAL-A/B/C reached 3/3; refresh generation advanced; stale pre-run title cleared; leave cleared the draft.
- Canonical public ACT1/S5 gate: PASS. S5 message/vote identities remained correct; ACT1 lost-response retry remained idempotent with one Anna decision and Teacher 2/3→3/3.
- Canonical public integrated gate: PASS. Three-role ACT6 Scene stability, ACT6→ACT8 image replacement, ACT3 Pocket inspect/flip and later media, ACT9 Runtime node/scroll preservation, ACT10 messages and real Teacher Open Vote exactly once all passed.
- Trial45 wrapper passed Player/Pocket sections, then its known prototype-only Teacher comparison encountered the absent public prototype document. This remains `NOT_RUN` at the packaging boundary, not a production Teacher endpoint failure; actual canonical public Teacher behavior passed in the integrated gate. The failure was recorded and the release was not rerun.

## Post-release state

At `2026-10-29T14:34:50.378724Z`, all five preceding-30-minute activity dimensions remained zero. No database, SQL, migration, Storage, TESTB/TEST8, real room or gameplay state was changed. No rollback was required. The one authorized publish attempt is consumed with PASS.
