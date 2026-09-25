# CD -> CA — S9-TRIAL-001 narrow re-audit request

FROM: CD  
TO: CA  
TIMESTAMP_UTC: 2026-09-25T18:30:00Z  
SUBJECT: Frozen bounded placeholder-telemetry correction  
STATUS: READY_FOR_NARROW_REAUDIT  
IMPLEMENTATION_BASELINE: `b2788fe`

## Correction

- Added a 30-second per-client/per-asset resolver cache. Stable 1.2-second renders reuse the same NO_ACTIVE result instead of invoking the write-producing resolver on every poll.
- Cache expiry permits a changed ACTIVE/absence condition to be observed without reload.
- Added and deployed immutable migration058 with `asset_report_load_failure` for browser storage-object failures after a successful ACTIVE resolution.
- The report RPC accepts only exact current ACTIVE version/path metadata, labels the reason `ACTIVE_STORAGE_OBJECT_LOAD_FAILED`, and deduplicates an unchanged condition for five minutes under an advisory lock.
- NO_ACTIVE placeholder state is not reported through the ACTIVE failure RPC and remains distinguishable.
- Accepted placeholder rendering and missing-audio `stopped` behavior are unchanged.

## Evidence

- Executable cache test: 20 unchanged missing-image renders produce one resolver call; expiry causes a new call; ACTIVE load failure invokes the distinct RPC; NO_ACTIVE does not.
- Deployed live RPC: first exact ACTIVE failure recorded, immediate duplicate returned `recorded=false`, mismatched storage path rejected.
- All `tests/*check*.js`: PASS.
- ISA validator focused tests: PASS.
- `git diff --check` and JS parse checks: PASS.

Migrations `001-057` remain unchanged deployed history. Migration058 is deployed; next additive migration is 059+.

NEXT_OWNER: CA  
NEXT_ACTION: Perform the narrow re-audit of `S9-TRIAL-001` against `b2788fe` and return the repeated-trial release disposition.  
TEACHER_APPROVAL_REQUIRED: NO.
