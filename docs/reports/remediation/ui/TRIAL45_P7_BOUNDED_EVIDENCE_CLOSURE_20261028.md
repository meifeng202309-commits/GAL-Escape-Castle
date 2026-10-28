# Trial Run 4+5 P7 bounded evidence closure

Date: 2026-10-28  
Authority: `CA_to_CD_20261028T100000Z_trial45-p7-one-bounded-evidence-closure.md`  
Status: all three returned evidence gaps PASS; ready for CA's single P7 disposition.

## R4-04 — number note Scene proof

`tests/trial45-p2p6-browser.mjs` now drives a dedicated Gitte `study_number_note` consequence at 1366x768 with a 250 ms asset resolver delay and three successive refreshes while hydration is pending.

Observed:

- Scene asset key: `prop_gitte_number_note_front`
- connected current Scene node: yes
- `assetState`: `decoded`
- natural dimensions: 1536×1024
- visible rectangle: yes
- time from navigation to visible/decode: 560 ms
- screenshot: `docs/reports/remediation/ui/trial45-p2p6/gittenote-study_number_note-1366x768.png`

No product repair was needed for R4-04; the previously frozen semantic mapping passes its missing specific browser gate.

## R4-05 — Anna diary measured performance

Scoped evidence criterion: **≤2500 ms from navigation to connected, decoded, visible Scene image when the test intentionally adds 250 ms to every resolver call and triggers three successive polls**. This is a bounded regression threshold, not a new product SLA or canonical timing rule. It leaves ample headroom above the injected delay while detecting the prior detached-node/poll timeout behavior.

Observed:

| Viewport | Visible/decode time | Image |
|---|---:|---|
| 1366×768 | 540 ms | 2048×1282, decoded and visible |
| 1280×720 | 552 ms | 2048×1282, decoded and visible |

Both pass. Screenshots: `anna-read_diary-1366x768.png`, `anna-read_diary-1280x720.png` in the evidence directory.

## R5-09 — Teacher prototype geometry and default collapse

The browser opens both `teacher.html` and `docs/prototypes/round1-ui-v4/Teacher_Console.html` at 1366×768 and records computed rectangles.

Approved prototype:

- top `(31,31,1305,109)` before main `(31,156,1305,525)`;
- left live panel `(31,156,717,525)` and right discussion `(762,156,574,525)`;
- Recovery and Maintenance bars each 52 px high below the main grid.

Production-source Teacher:

- top `(15,15,1337,156)` before main `(15,187,1337,1880)`;
- room/live left `(15,187,794,104)` and discussion right `(822,187,529,470)`, same row;
- setup and formal controls follow operations without changing the approved left/right primary ordering;
- Recovery and Maintenance are native closed `<details>`, each 52 px high by default;
- Create, Watch, Start, Open Discussion and Open Vote controls all have visible rectangles.

The focused source repair moved room creation below the approved top host summary and converted Recovery/Maintenance to default-collapsed native details. Existing IDs and `teacher-console.js` behavior remain unchanged.

Screenshots:

- `docs/reports/remediation/ui/trial45-p2p6/teacher-v4-1366x768.png`
- `docs/reports/remediation/ui/trial45-p2p6/teacher-approved-prototype-1366x768.png`

## Consolidated regression

- `node tests/trial45-p2p6-browser.mjs` — PASS
- `node tests/v4-player-integrated-runtime-browser.mjs` — PASS
- `node tests/v4-player-integration-static-check.js` — PASS
- `node tests/act9-073-normal-teacher-paced-static-check.js` — PASS
- `node tests/act9-073-normal-teacher-paced-policy.test.js` — PASS
- localization regeneration — 340 entries, PASS
- `git diff --check` — PASS

The machine record is `docs/reports/remediation/ui/trial45-p2p6/P2P6_BROWSER_EVIDENCE.json`. The complete prior R4/R5 matrix remains PASS; only the three CA-returned evidence rows were amended. No production, Supabase, Storage, database, migration, asset, live-room or human-test mutation occurred.
