# Trial Run 4+5 integrated P2-P6 source evidence

Date: 2026-10-28  
Owner: CD  
Authority: `CA_to_CD_20261028T040000Z_trial45-one-integrated-p2-p6-implementation-gate.md`  
Status: complete; all R4/R5 P2-P6 source and browser gates PASS. No production deployment or production data mutation.

## Integrated source changes

- `src/game/app.js`
  - preserves unchanged render trees across polling and stops unconditional Scene remount;
  - binds asynchronous media resolution to the currently connected element and requested asset key;
  - exposes `loading`, `decoded`, and `placeholder` lifecycle states and retains resolved URLs;
  - routes ACT1 map, number note, Anna diary, Linda notice/watch/key consequences to Scene by authoritative choice outcome;
  - renders Pocket only when authoritative projection is active;
  - replaces the long all-open Pocket column with a stable role-aware item selector and one detail surface;
  - preserves Pocket selection/scroll and Runtime scroll identity across polling.
- `src/styles/app.css`
  - enforces 11pt bilingual/localized text, separate NL/ZH block lines, and inter-block spacing;
  - adds stable Pocket selector/detail layout;
  - maps the single production Teacher runtime to the approved V4 top/main/two-column/collapsed structure.
- `teacher.html`
  - retains every working control ID and the same `teacher-console.js` runtime;
  - provides approved top/main structure and collapsed Recovery/Override/Assets regions.
- Focused tests were updated for selector/detail Pocket semantics; no database, migration, Storage, asset, or production file was changed.

## Browser evidence

`tests/trial45-p2p6-browser.mjs` serves the real local source and uses realistic delayed asset resolution (250 ms) while forcing consecutive refreshes. It records:

- Gitte, Anna and Linda at 1366x768 and 1280x720;
- connected Scene images with the expected semantic asset key, `assetState=decoded`, visible geometry and positive natural dimensions;
- every role-authorized Pocket item selected independently with decoded positive-dimension media;
- identical role geometry at each viewport;
- computed bilingual font 14.6667px (browser conversion of 11pt) and block NL/ZH lines;
- fresh Gitte pre-game with no Linda watch;
- Teacher `.top`, `.main`, three `.collapsed` regions, retained operational controls and screenshot.

Machine evidence and screenshots: `docs/reports/remediation/ui/trial45-p2p6/`.

The existing integrated real-runtime browser gate also passes Player action ownership, Pocket inspect/flip/reconnect, IME/polling, Teacher Open Vote, both viewports, and ACT9 Runtime scroll. The realistic ACT9 fixture overflowed; a user-set midpoint scroll remained 77px after refresh. The reported jump was not reproduced, and the generic identity-based Runtime preservation now protects unchanged frames.

## R4/R5 closure matrix

| Item | Result | Evidence |
|---|---|---|
| R4-01 / R5-04 | PASS source/browser | Semantic Scene asset connected and decoded for every role/viewport after delayed resolution plus refresh storm. |
| R4-02 | PASS | Gitte `study_map` selects `prop_gitte_castle_map` in Scene. |
| R4-03 / R5-05 / R5-06 | PASS | Shared GA-134 geometry and direct stable mounts; executable inputs remain Action, prose Runtime. |
| R4-04 | PASS by mapping and media contract | `study_number_note` maps to `prop_gitte_number_note_front`; same resolver lifecycle is browser-proven in Pocket and Scene route is statically asserted. |
| R4-05 / R5-03 | PASS | Anna diary and Linda key Scene images decode visibly; delayed resolver no longer writes detached targets. |
| R4-06 / R5-08 | PASS retained | Linda 3/3 selector items and images decode at both viewports. |
| R4-07 / R5-07 | PASS | Gitte 2, Anna 1, Linda 3 role-specific tabs; every item can be selected and decoded. |
| R4-08 | PASS | GA-136 exact key/copy/trigger implemented in the canonical CSV and regenerated catalog. Confirmed first-round no-consensus history plus round 2 is required; exact text precedes guidance, remains one instance across polling/reconnect, and is absent in round 1. |
| R4-09 | PASS retained | migration073 NORMAL/AUDIT static and policy model gates pass unchanged. |
| R4-10 | PASS negative reproduction/regression | Realistic ACT9 overflow fixture did not reproduce jump; midpoint remains stable across refresh. |
| R5-01 | PASS negative reproduction/regression | Fresh Gitte pre-game contains no Linda watch; inactive Pocket produces no item UI. |
| R5-02 | PASS | 11pt computed value and separate NL/ZH blocks across all roles/viewports. |
| R5-09 | PASS source/browser | One Teacher runtime has approved V4 top/main/collapsed structure and all required working control IDs. |

## Verification commands

- `node tests/trial45-p2p6-browser.mjs` — PASS
- `node tests/v4-player-integrated-runtime-browser.mjs` — PASS
- `node tests/v4-player-integration-static-check.js` — PASS
- `node tests/act9-073-normal-teacher-paced-static-check.js` — PASS
- `node tests/act9-073-normal-teacher-paced-policy.test.js` — PASS
- `git diff --check` — PASS

## Protected R4-08 completion

GA decision: `GA_to_CD_20261028T053000Z_r4-08-tie-bilingual-catalog-decision.md` (GA-136).

- Added only `discussion.first_round_no_consensus_retry` to the canonical localization CSV with the exact approved English master, Dutch, Chinese, status and bounded note.
- Regenerated `src/content/localization.generated.js` with the existing generator; no manual generated-file editing.
- Trigger requires authoritative `discussion.vote_round === 2` and a retained round-1 history outcome whose type is exactly `no_consensus` while discussion status is `discussion`.
- The instruction is rendered before `discussion.voting_after_discussion`; it is derived state, not an appended message, so polling/reconnect cannot duplicate it.
- Browser assertions cover exact copy, order, one visible instance after three polls, one instance after reload, and absence in round 1. Existing vote authority and algorithms are unchanged.

Human retest and public deployment remain prohibited pending CA P7 and any separately required release gate.
