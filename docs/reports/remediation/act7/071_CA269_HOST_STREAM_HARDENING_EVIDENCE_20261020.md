# CA-269 operator-host stream hardening

Status: `TARGETED_CORRECTION_READY_FOR_CA_REVIEW / PRODUCTION_HOLD`

Authority: CA-269 source-only/mock-only correction. No live SQL/ACL, Pages Save, deployment or fixture RPC occurred.

## Corrections

### Bounded request timeout

Every outstanding external operator request now has one timer. The configured value must be an integer from 100 ms through 900,000 ms; the production default is 300,000 ms. Values outside the reviewed bound fail during host startup.

On timeout the request is removed and rejects with the exact boundary kind plus `rollback is not verified`. A late response cannot resume the removed request. Only one ordered request remains permitted.

### Stream closure

If stdin closes while a request is pending, its timer is cleared and the request rejects with `rollback is not verified`. No following adapter boundary runs.

### Rollback-operator incident

If a primary failure enters recovery and the rollback operator times out or the stream closes, the adapter produces an `AggregateError`. The host now emits:

```json
{
  "type": "host_incident",
  "rollback_verified": false,
  "production_state": "UNKNOWN_REQUIRES_MANUAL_INCIDENT_RESPONSE"
}
```

It then emits `host_failed` and exits nonzero. It never emits `host_complete` or represents rollback as completed.

## Actual CLI child-process tests

The test now spawns the real command:

```text
node scripts/act7-071-operator-host.js <config.json>
```

The child retains its own stdin/stdout protocol and process identity. Test-only fetch/fixture dependencies are injected only when `NODE_ENV=test` and an explicit test-driver module is named. The helper uses Git blobs and mock results; it cannot activate in ordinary production mode.

Spawned scenarios:

1. **COMPLETE:** external catalog and SQL responses, candidate Pages acknowledgement, in-child candidate Actions/five-byte proof, ACL receipt and mock fixture; child emits `host_complete` and exits 0.
2. **STOP + verified simulated recovery:** candidate Actions conclusion fails; fixture is not reached; child requests rollback, performs in-child rollback proof, accepts recovery receipts/catalog comparison, emits only `host_failed` and exits nonzero.
3. **STOP + rollback operator unavailable:** candidate fails, rollback request receives no response, bounded timeout fires; child emits `host_incident` with `rollback_verified:false`, emits `host_failed`, never emits `host_complete`, and exits nonzero.

Direct bridge negatives additionally cover:

- missing response timeout;
- late response after timeout (cannot resume);
- input stream closure during an outstanding operation.

Focused suite result:

```text
operator-host PASS
source-gates PASS
startup-gate PASS
3 tests / 0 failures
```

## Diff

- production host: +31 / -8 lines;
- test file: +83 / -2 lines;
- test-only spawned-process driver: 28 lines;
- no adapter, database, gameplay or deployment source change.

## Remaining limitations

- A timeout proves operator unavailability, not production recovery.
- Procedure/request/operation binding is not cryptographic connector authentication.
- Human/connector operation still requires original transcripts and independent readback.
- No live use is authorized; CA-265 remains consumed and production remains HOLD.

NEXT_OWNER: CA

NEXT_ACTION: Independently review bounded timeout, unavailable-rollback incident semantics and spawned CLI evidence. Do not infer production authorization.
