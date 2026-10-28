# Trial4+5 frontend production release — smoke STOP and compatible recovery

Date: 2026-10-28  
Authority: `CA_to_CD_20261028T150000Z_trial45-teacher-approved-pages-only-release.md`

## Preflight

- Authenticated Pages selector: `deploy/trial4-player-act9-20261027`, `/(root)`, legacy build, status built.
- Recovery head before release: `727ed7cd360c970b20874c7d5d0fc1b64826a92b`.
- Accepted product source: `8594f2e`; four staged Git blobs exactly matched the approved preflight.
- Production read-only database gate: migration073 receipt and five-function/pre072 owner, security-definer and ACL envelope coherent.
- Activity at 2026-10-28T02:52:28Z: zero runtime events, new runs or newly open discussions in 30 minutes. Historical stale rows remained untouched; latest activity was approximately eleven hours old.
- Required map, note, diary and key media returned HTTP 200 `image/webp`.

## Release

The Pages branch received exact four-file commit `0b11eebc915b18fb66a2344a195ef77068f9b2fd`. GitHub Pages built it from 2026-10-28T02:53:45Z through 02:54:32Z.

Public SHA-256 matched the target for every authorized file:

| File | SHA-256 |
|---|---|
| `teacher.html` | `cf767cdab6e32092ef60d668e0fd3530eadddac02f8113a8bb0cbb8cbff39c82` |
| `src/game/app.js` | `05dc1e4d6a266bddb28c056d38979dd28a27a0b8e772e39ac63bd365fb8a9c07` |
| `src/styles/app.css` | `3b0bffed34f7d20b5ec0566c3af8840ae0d931a0bf60bb4ac9c1e208aa3be42e` |
| `src/content/localization.generated.js` | `9f4b4763f636a976127fd1c8a1d9946f2aa46463b5323325dbf8376d98cb63b7` |

## Public-browser STOP

The real public GitHub Pages smoke reused the accepted P7 deterministic RPC fixture while loading the actual public HTML/JS/CSS/localization and production Supabase media. It exercised both approved viewports and role/media flows.

The Anna diary gate measured **2547 ms** under the accepted 250 ms resolver delay plus three successive polls. The accepted threshold is **<=2500 ms**. This 47 ms excess is a hard public-smoke failure under the authorization letter. CD did not relax the threshold, continue the remaining smoke as a PASS, request a human trial, or change product/database/Storage/room state.

## Compatible recovery

CD immediately reverted only the four release files. Recovery commit: `64eefc535a16c4cc711e9d6835cb8592889c128e`; its four-file tree is identical to compatible baseline `727ed7c`.

Recovery Pages build ran from 2026-10-28T02:57:17Z through 02:58:05Z and finished `built`. Public readback exactly matched recovery:

| File | Recovery SHA-256 |
|---|---|
| `teacher.html` | `628bb101a23e312d5f69d992d0c1212665350a130f1c124af04460b1afdb6cf3` |
| `src/game/app.js` | `06c216d1b6126d8f0795b1b17dfa7c73f5e41369a3a77f2be680db68a0795499` |
| `src/styles/app.css` | `7efc01333df276c978a6a13e24aa6033060f6d4b7e1bdc2b2de1603979ec11bb` |
| `src/content/localization.generated.js` | `4c8a1b8b806f751827fc173fc18ffa10d3de106bf95eb6ca8987c70bbe321fd2` |

No SQL, migration, schema, RLS, Storage, asset, room or gameplay-data mutation occurred. Production is safely back on the migration073-compatible prior frontend. `NEXT_OWNER: CA` to audit the STOP and decide whether a separately authorized diagnosis/correction is warranted.
