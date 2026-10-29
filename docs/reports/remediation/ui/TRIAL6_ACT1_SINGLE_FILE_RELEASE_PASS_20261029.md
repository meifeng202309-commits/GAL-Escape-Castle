# Trial 6 ACT1 single-file Pages release — PASS

Date: 2026-10-29  
Authority: `CA_to_CD_20261029T203000Z_trial6-act1-single-file-release-approved.md` plus the two `20261029T213000Z` recent-activity clarifications

## Fresh preflight

- Teacher-attested Pages source remained `deploy/trial4-player-act9-20261027`, `/(root)`.
- Existing deploy head was `1d7384d4c7ce0bca2340fce972edd403b615d3e4`.
- Recovery `src/game/app.js` blob: `c8d3ba2ea071d2783e221cc43bdf962a01955a46`.
- Target `src/game/app.js` blob: `c8494321754a0630fa8307621b9a699595c0c7f4`.
- Migration receipt `20261027151620_act9_normal_teacher_paced_vote_073` was present. Relevant functions remained `SECURITY DEFINER`, owned by `postgres`, with the accepted ACL split.
- At `2026-10-29 12:45:39–12:45:52+00`, the immediately preceding 30 minutes had: new runs 0, newly active runs 0, newly opened discussions 0, runtime events 0, S1 events 0. Latest runtime/S1 events remained at `02:33:12+00` and `02:10:15+00`; no concrete ongoing human-play evidence existed.
- Historical active/open rows were recorded as context and not mutated, exactly as clarified by CA.

## One-file release

Only `src/game/app.js` changed, with exactly two insertions and zero deletions. Its staged blob was verified as the authorized `c8494321754a0630fa8307621b9a699595c0c7f4` before commit.

- Release commit: `e3454c58498f545ab69aa638fa09baa324f25770`.
- Pages run: `40876038977`.
- Workflow: `pages build and deployment`.
- Head ref/SHA: `deploy/trial4-player-act9-20261027` / `e3454c58498f545ab69aa638fa09baa324f25770`.
- Result: `completed / success`, `2026-10-29T12:46:23Z–12:47:22Z`.

## Canonical public bytes

The first canonical read of `https://meifeng202309-commits.github.io/GAL-Escape-Castle/src/game/app.js` returned HTTP 200, `Cache-Control: max-age=600`, `Age: 0`, `X-Cache: MISS`.

- Public raw SHA-256: `22622697d463888daf498cef28eb36eb9329bdb65565efc8ff6956c30944566b`.
- Public Git blob identity: `c8494321754a0630fa8307621b9a699595c0c7f4`.
- Both exactly matched the authorized target; no query URL or cache waiver was used.

## Public mocked-browser regressions

All RPC routes were intercepted; no real room or game state was created or changed.

- Trial 6 ACT1/S5 permanent regression: PASS on the canonical public site. Sprint5 message/vote retained S5 identities and request UUIDs. ACT1 used S2 identity; a synthetic lost response followed by retry produced one unique Anna decision and Teacher 2/3→3/3.
- Integrated public Player/Teacher gate: PASS. Three roles; ACT6 unchanged Scene node; ACT6→ACT8 decoded replacement; ACT3 Pocket inspect/flip and five later-item media; ACT9 Runtime scroll/node stability; ACT10 messages and actual Teacher Open Vote exactly once.
- Trial45 all-P7 wrapper completed its Player sections, then hit the known absent public prototype document during prototype-only Teacher comparison. As in the accepted fifth release, this comparison is `NOT_RUN` packaging boundary, not a production endpoint failure. Actual public Teacher behavior passed in the integrated gate.

Evidence: `docs/reports/remediation/ui/trial6-act1-vote/TRIAL6_ACT1_VOTE_BROWSER_EVIDENCE.json`.

## Post-release state

At `2026-10-29 12:50:15–12:50:27+00`, new runs, newly active runs, newly opened discussions, runtime events and S1 events in the preceding 30 minutes all remained 0.

No database, SQL, migration, Storage, TEST8, live room, gameplay state or other Trial 6 issue was changed. No rollback was required. The one authorized release attempt is consumed with PASS.

