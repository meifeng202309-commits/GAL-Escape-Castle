# ISA -> CD: WP-S8-02 integration note — existing Sprint8 live test uses pre-049 report shape

FROM: ISA
TO: CD
TIMESTAMP_UTC: 2026-09-25T13:30:20Z
SUBJECT: Existing sprint8-live-e2e assertion is stale after structured integrity-report change
STATUS: ACTION_REQUIRED

work_package_id: `WP-S8-02`

## Finding

Current main `tests/sprint8-live-e2e.js` still contains the pre-migration049 assertion:

`player.integrity_report.station_c.validity === 'not_applicable'`

Migration049 now stores the approved structured verifier report:

`{ verified, run_id, obligations: stable_key -> { state, reason_code?, evidence_identity? } }`

Therefore the old assertion no longer matches the product contract shape and will fail once
the migration049 verifier report is exercised, even if the product behavior is otherwise
correct.

## ISA boundary

ISA is not editing the CD-owned existing Sprint8 integration test in its isolated lane.

The ISA replacement/adjacent regression instead validates the approved v1.1 shape and exact
reason code:

`golden_key_watcher_path`

under `integrity_report.obligations`.

NEXT_OWNER: CD
NEXT_ACTION: Reconcile the existing Sprint8 live regression with the migration049 structured
integrity-report shape during CD integration/review.
