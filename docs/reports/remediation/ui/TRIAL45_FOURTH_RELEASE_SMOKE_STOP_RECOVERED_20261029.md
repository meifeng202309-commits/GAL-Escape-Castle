# Trial4+5 fourth release smoke STOP and recovery

Date: 2026-10-29  
Authority: `CA_to_CD_20261029T090000Z_fourth-five-file-release-approved.md`

## Preflight and release bytes

Fresh branch/blob, Teacher-authenticated Pages configuration, migration073 five-function owner/security/ACL, zero 30-minute gameplay/discussion activity and public-media gates passed. Exactly five frozen `ca0e2ba` files were released in commit `9834dd1245b6fff7f043faf305b2cdd90745ea39`.

Pages run `40731191161` completed successfully (`2026-10-28T16:58:27Z`–`16:59:18Z`). The corrected verifier downloaded every canonical URL as binary. All five matched both raw target Git blob identity and raw SHA-256 on the first read (`Age: 0`, `X-Cache: MISS`). Exact-byte release gate PASS.

## Public smoke hard STOP

The first browser launch was blocked by the sandbox (`ERR_NETWORK_ACCESS_DENIED`), then the same scripts ran in the authorized networked execution context.

- Public all-role/five-region fixture failed to reach its expected Pocket endpoint within 30 seconds, so it did not produce an all-role PASS.
- Anna public latency telemetry completed all 12 public samples. Initial endpoint values were 1229–2504 ms, all below the confirmed 15000 ms severe-stall threshold.
- The retained post-refresh/remount gate failed one public cold sample at **2508 ms > 2500 ms**. Other public post-refresh values were 20–2506 ms; one warm sample was also 2506 ms and failed by the harness. No detached baseline node was observed.
- The local control recorded an abnormal 25,701,926 ms warm initial sample during an execution-session suspension. It is not attributed to product network behavior, but it was retained and not rerun or suppressed.

The public post-refresh violation and incomplete all-role endpoint are hard failures under the authorization. CD stopped and did not continue ACT6/8/ACT9/Teacher public smoke to claim a partial release PASS.

Raw telemetry is preserved in `docs/reports/remediation/ui/trial45-anna-latency/MEASUREMENTS.json`.

## Recovery

All five files were restored from `727ed7cd360c970b20874c7d5d0fc1b64826a92b` in commit `aa3b095e41dea1e40e2b92776f15ad4ff1f68c69`. Pages recovery run `40792489076` completed successfully (`2026-10-29T00:12:13Z`–`00:13:10Z`). Canonical binary downloads for all five files exactly matched the five recovery Git blob identities.

No SQL, DB, Storage, room/gameplay or human-play mutation occurred. The one authorized attempt is consumed. Current public state is the verified five-file recovery baseline.

