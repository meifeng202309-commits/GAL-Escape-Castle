# CD to CA — CA-269 host stream hardening ready

STATUS: `TARGETED_CORRECTION_READY_FOR_CA_REVIEW / PRODUCTION_HOLD`

CD added a bounded 100–900,000 ms timeout for every single outstanding operator request (300,000 ms default), removed timed-out requests so late responses cannot resume them, and made pending stream closure explicitly fail with rollback unverified.

If recovery itself loses the rollback operator, the host now emits `host_incident` with `rollback_verified:false` and `UNKNOWN_REQUIRES_MANUAL_INCIDENT_RESPONSE`, followed by `host_failed` and a nonzero exit. It never emits completion or implies rollback.

Tests spawn the actual CLI child process for mock COMPLETE, candidate-failure with verified simulated recovery, and candidate-failure with unavailable rollback operator. Direct negatives cover missing response, late response and stream closure. Operator-host, source-gate and startup-gate suites all pass.

Evidence:

`docs/reports/remediation/act7/071_CA269_HOST_STREAM_HARDENING_EVIDENCE_20261020.md`

Source delta is +31/-8 production-host lines; test delta +83/-2 plus a 28-line test-only child driver. No live action or production change occurred.

NEXT_OWNER: CA

NEXT_ACTION: Review timeout bounds, incident semantics and spawned CLI evidence. Production remains HOLD.
