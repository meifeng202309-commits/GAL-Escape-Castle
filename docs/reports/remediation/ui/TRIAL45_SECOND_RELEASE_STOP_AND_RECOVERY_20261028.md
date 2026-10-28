# Trial4+5 second Pages release — tail-latency STOP and recovery

Date: 2026-10-28  
Authority: `CA_to_CD_20261028T170000Z_trial45-second-pages-only-release-approved.md`  
Browser evidence: `docs/reports/remediation/ui/trial45-second-release/PUBLIC_BROWSER_SMOKE.json`  
Anna distribution: `docs/reports/remediation/ui/trial45-second-release/ANNA_MEASUREMENTS.json`

## Preflight and release

Fresh gates passed: authenticated Pages selector `deploy/trial4-player-act9-20261027` at root; recovered head `64eefc535a16c4cc711e9d6835cb8592889c128e`; exact target blobs from `8594f2e`; migration073 receipt/five functions/pre072 dependency/owner/security/ACL; zero recent 30-minute runtime events, runs or newly open discussions; and required public map/note/diary/key media HTTP 200 `image/webp`.

Second exact four-file release commit: `fab5bc490357d367b550d606bc1e9658efc100bf`. Pages build ran 2026-10-28T03:30:53Z–03:31:58Z and finished `built`. All four public SHA-256 values matched the target:

- `teacher.html`: `cf767cdab6e32092ef60d668e0fd3530eadddac02f8113a8bb0cbb8cbff39c82`
- `src/game/app.js`: `05dc1e4d6a266bddb28c056d38979dd28a27a0b8e772e39ac63bd365fb8a9c07`
- `src/styles/app.css`: `3b0bffed34f7d20b5ec0566c3af8840ae0d931a0bf60bb4ac9c1e208aa3be42e`
- `src/content/localization.generated.js`: `9f4b4763f636a976127fd1c8a1d9946f2aa46463b5323325dbf8376d98cb63b7`

## Public browser results before final gate

The real public Pages smoke passed Gitte/Anna/Linda at 1280×720 and 1366×768, connected positive-dimension Scene/Pocket images, Gitte map/number note, Linda 3/3, pregame isolation, five-region geometry, NL/ZH 11pt, exact tie retry ordering/poll/reconnect behavior, and public Teacher V4 ordering, critical controls and default-collapsed Recovery/Maintenance. Public navigation telemetry for these role samples was 962–1323 ms; corrected post-DOM media measurements were 29–37 ms once the initial visible Scene was mounted.

The deploy branch intentionally excludes the source prototype document. Teacher public assertions therefore reused the already P7-accepted prototype baseline rather than treating the absent non-runtime prototype URL as a product failure.

## Anna distribution hard STOP

The approved clock began after DOMContentLoaded and included Scene mount, three concurrent fixture refreshes, production-media completion and the connected positive-dimension decoded endpoint. Each viewport received three cold and three warm samples.

| Candidate public group | n | min | median | p90/max | over 2500 | endpoint failures |
|---|---:|---:|---:|---:|---:|---:|
| cold, both viewports | 6 | 1455 | 1464 | 1496 | 0 | 0 |
| warm, both viewports | 6 | 892 | 1455 | 29600 | **1** | 0 |

The outlier was warm 1280×720: navigation 644 ms (reported separately), Scene mount 29543 ms, refresh 40 ms, decoded endpoint 29600 ms. It eventually produced the correct connected 2048px diary image, but exceeded the unchanged <=2500 ms gate. The local exact-candidate control with the same production media passed all 12 samples (cold max 1510 ms; warm max 1466 ms). Under the authorization, one public tail failure is still a hard STOP; it was not waived as a scheduler/network anomaly.

## Recovery

CD immediately reverted only the four frontend files. Recovery commit `d3e3da984b5a83b0d6406de723f27072834e721f` has the same four-file tree as compatible baseline `727ed7c`. Recovery Pages build ran 03:43:00Z–03:43:51Z and finished `built`.

Public recovery SHA-256 matched:

- `teacher.html`: `628bb101a23e312d5f69d992d0c1212665350a130f1c124af04460b1afdb6cf3`
- `src/game/app.js`: `06c216d1b6126d8f0795b1b17dfa7c73f5e41369a3a77f2be680db68a0795499`
- `src/styles/app.css`: `7efc01333df276c978a6a13e24aa6033060f6d4b7e1bdc2b2de1603979ec11bb`
- generated localization: `4c8a1b8b806f751827fc173fc18ffa10d3de106bf95eb6ca8987c70bbe321fd2`

No SQL, migration, Storage, asset, room or gameplay-data mutation occurred; no human trial was requested. The second authorization is exhausted. `NEXT_OWNER: CA` for audit and any separately authorized next decision.
