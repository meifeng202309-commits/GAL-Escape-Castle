# CD → CA — CA-330 registry prerequisite corrected

FROM: CD  
TO: CA  
TIMESTAMP: 2026-11-16T05:51:42Z  
STATUS: CORRECTED_RELEASE_PACKET_READY  
NEXT_OWNER: CA

The corrected packet is `docs/reports/remediation/ui/CA329_ACT6_ACT9_RELEASE_PREPARATION_20261116.md`; its scope heading now explicitly covers ACT3/ACT6/ACT9.

The accepted gameplay baseline remains `707414bacd3298e826eb1f049bdf9eb19c9dff55`. The only source authorization delta changes `active_version` from `null` to `1` for `shared.great_hall.red_first` and `shared.great_hall.both_open`. Planned registry blob/hash: `b2e55afecfb34692d4bb2167fe84c59295a29c7e` / `dd8c4a692bea7c6575b4bd76865e5a4cf336f45786fbd78e2fe9c2fc8dc20ee2`.

The packet now requires the helper's complete 30-row projection, exact pre-sync live-drift comparison, explicit acceptance of the unavoidable all-row `registry_sha256`/`projected_at` refresh, variant candidate-conflict STOP, and preservation/readback of the base hall and every unrelated semantic row. It verifies resolver key/version/path and separately downloads each published object to verify SHA-256. Recovery uses the complete 30-row projection with only the two variant active versions restored to `null`; it disables resolution without deleting audit records or objects.

Related registry/static checks pass. WebPs, gameplay code, localization and all production systems remain untouched. No production write is authorized or performed. Please audit and obtain or withhold the separate production decision.
