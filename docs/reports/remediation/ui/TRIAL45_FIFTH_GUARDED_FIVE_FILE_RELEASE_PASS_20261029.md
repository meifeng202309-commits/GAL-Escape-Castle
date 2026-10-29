# Trial4+5 fifth guarded five-file Pages release — PASS

Date: 2026-10-29  
Authority: `CA_to_CD_20261029T133000Z_fifth-release-teacher-approved.md` and `CA_to_CD_20261029T140000Z_teacher-screenshot-satisfies-pages-gate.md`

## Preflight

- CA accepted the new authenticated Teacher screenshot: Pages source `Deploy from a branch`, branch `deploy/trial4-player-act9-20261027`, folder `/(root)`.
- Fresh deploy head was recovery commit `aa3b095e41dea1e40e2b92776f15ad4ff1f68c69`.
- Frozen target `ca0e2baac8962401bf3fea51948cd5bc090d0309` and recovery `727ed7cd360c970b20874c7d5d0fc1b64826a92b` resolved all five files. Raw Git blob IDs and SHA-256 values were recomputed without worktree EOL conversion.
- Production migration receipt `20261027151620_act9_normal_teacher_paced_vote_073` was present. The five migration073 functions plus `s6_get_player_state_pre072(text,text)` remained owned by `postgres`, `SECURITY DEFINER`, with the expected internal versus anon/authenticated ACL split.
- At `2026-10-29T01:44:35Z`, runtime events, S1 events, new runs, newly active runs and newly open discussions were all zero for the previous 30 minutes.
- Required public map, note, diary, watch and star-key media returned HTTP 200 `image/webp`.
- All five recovery blobs were available before deployment.

## Release and exact public bytes

Exactly five target blobs were applied to the recovery tree. Release commit: `1d7384d4c7ce0bca2340fce972edd403b615d3e4`.

Pages run `40802343620` completed successfully (`2026-10-29T01:45:37Z`–`01:46:37Z`) for the exact release SHA/ref.

| File | Git blob | SHA-256 |
|---|---|---|
| `teacher.html` | `d07667b2fa3eac5d8d168d52136fa7db647ec697` | `cf767cdab6e32092ef60d668e0fd3530eadddac02f8113a8bb0cbb8cbff39c82` |
| `src/game/app.js` | `c8d3ba2ea071d2783e221cc43bdf962a01955a46` | `8e03dbbde6c974291e8bc4360cac3559f46ef5d800653df4fdd51a397bbc88be` |
| `src/game/asset-runtime.js` | `608063351c4d10eac800f52ec14e673747e9cf2e` | `49085c0f7b7ea1a2079a8c8d8acdea7ae062929b395767c4f1369fb9cbab0d61` |
| `src/styles/app.css` | `5b0a0fa18042b469084a59397088927fe259d65f` | `3b0bffed34f7d20b5ec0566c3af8840ae0d931a0bf60bb4ac9c1e208aa3be42e` |
| `src/content/localization.generated.js` | `dc644f4a8fba6e583d4764f38f0cba44a55b575e` | `9f4b4763f636a976127fd1c8a1d9946f2aa46463b5323325dbf8376d98cb63b7` |

Every first canonical read was HTTP 200 with `Cache-Control: max-age=600`, `Age: 0`, `X-Cache: MISS`, and matched both target raw SHA-256 and Git blob identity. No query URL substitute or cache waiver was used.

## Public browser smoke

- Corrected Pocket harness: 6/6 role/viewport cases PASS. Every role-specific selector tab was clicked sequentially; all 12 selected item endpoints used the expected visible decoded media.
- Teacher public page: V4 top/main structure present, three collapsed sections present, shell width 1366 and required production panels/controls rendered.
- Scene public samples: 12/12 initial PASS and 12/12 three-refresh PASS. Initial cold 1269–2599 ms, warm 604–1305 ms; refresh cold 38–116 ms, warm 45–69 ms. No detached baseline nodes.
- Candidate control: 12/12 initial and 12/12 refresh PASS.
- Public-source integrated fixture: ACT6 node survived three unchanged polls; ACT6→ACT8 replaced it with the decoded west-tower scene; ACT9 Runtime scroll remained 77 and the unchanged scene node remained stable; state change replaced the node; ACT10 Teacher Open Vote fired exactly once; three roles, two viewports, bilingual display, Pocket inspect/flip/later-item access and transcript anchoring passed.
- The final all-P7 wrapper reached its Teacher prototype comparison after Player gates, then found the prototype document absent from the deploy branch and threw on a null `.main`. This is recorded as packaging-boundary `NOT_RUN`, not rerun. The actual public `teacher.html` was independently tested successfully above; no product endpoint failed.

Raw evidence:

- `docs/reports/remediation/ui/trial45-p0p1/P0P1_BROWSER_EVIDENCE.json`
- `docs/reports/remediation/ui/trial45-anna-latency/MEASUREMENTS.json`
- public-source integrated browser terminal receipt and refreshed screenshots under `docs/reports/remediation/ui/v4-player/screenshots/`

## Final state

At `2026-10-29T01:51:07Z`, post-release runtime events, S1 events, new runs and newly open discussions were all zero for 30 minutes. Deploy branch remained exactly `1d7384d4c7ce0bca2340fce972edd403b615d3e4`.

No SQL, database, Storage, live room/game-state or human-trial mutation occurred. No rollback was required. The one fifth-release attempt is consumed and PASS evidence is returned to CA.
