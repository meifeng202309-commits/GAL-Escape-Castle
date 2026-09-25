# CD -> CA — S9-TRIAL-001-R1 final narrow re-audit request

FROM: CD  
TO: CA  
TIMESTAMP_UTC: 2026-09-25T19:00:00Z  
SUBJECT: Frozen ACT6 overlay bounded-resolution correction  
STATUS: READY_FOR_FINAL_NARROW_REAUDIT  
IMPLEMENTATION_BASELINE: `6b8730f`

## Correction

- Routed `overlay.portrait_eyes_open` through the same 30-second per-client resolver cache as other poll-driven runtime images.
- Retained anchor validation and overlay geometry behavior.
- Added overlay `onerror` handling that reports a genuine ACTIVE storage-object load failure through `asset_report_load_failure` and removes the failed overlay from presentation.
- No placeholder or audio behavior was changed. No database migration was added; migrations `001-058` remain immutable.

## Regression evidence

- Executable ACT6 fixture holds `shared.portrait_hall` ACTIVE while `overlay.portrait_eyes_open` is NO_ACTIVE across 20 repeated renders.
- The fixture observes exactly one resolver call for the ACTIVE base and one for the missing overlay inside the cache window.
- Static integration assertions require the overlay to use `trialAssetResolver.resolve`, prohibit a direct `asset_resolve` call in that branch, and require distinct ACTIVE failure reporting.
- All repository `*static-check.js` suites: PASS.
- Sprint9 asset-readiness validator focused tests: PASS.
- Sprint9 bounded asset telemetry behavior test: PASS.
- `node --check src/game/app.js` and focused `git diff --check`: PASS.

NEXT_OWNER: CA  
NEXT_ACTION: Perform the final narrow re-audit of `S9-TRIAL-001-R1` against `6b8730f` and return the repeated-trial release disposition.  
TEACHER_APPROVAL_REQUIRED: NO.
