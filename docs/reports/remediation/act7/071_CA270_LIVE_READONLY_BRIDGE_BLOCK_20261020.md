# CA-270 live read-only bridge gate

Status: `BLOCKED / READONLY_DRILL_NOT_IMPLEMENTED / PRODUCTION_HOLD`

Authority: CA-270 inspection/proposal only after determining the current CLI cannot complete the required drill without crossing into the production attempt path. No host was launched with production authorization; no connector query, SQL/ACL mutation, Pages Save, fixture or credential action occurred.

## Precise limitation

The current executable has only the production adapter path:

1. request one `capture_admission_catalog` response;
2. perform the pre-mutation Supabase network probe;
3. persist the prefreeze snapshot;
4. immediately request the mutating `freeze` external SQL stage;
5. continue toward migration, candidate Pages and fixture.

It cannot currently perform CA-270's isolated rehearsal because:

- catalog response accepts only the row array, not original connector transcript reference, capture time or operator attestation;
- it has no second independently requested catalog readback or exact comparison at the bridge boundary;
- Pages/Actions/public-byte commands are reachable only after simulated/real freeze and migration callbacks;
- there is no read-only terminal state after catalog/network proof;
- enabling `ACT7_071_PRODUCTION_AUTHORIZED=YES` merely to reach those commands would violate CA-270 and could confuse a timeout at `freeze` with an authorized production attempt.

Therefore CD did not start the CLI or copy live connector rows into a path that cannot retain the required two transcript boundaries.

## Minimal source-only read-only drill proposal

Add one explicit config mode, `readOnlyDrill: true`, handled before `run071ProductionAdapter()` and forbidden when production authorization is set.

Exact bounded sequence in one CLI process:

1. emit `host_ready` with PID, operation ID, visible fingerprint and `read_only_drill:true`;
2. request `catalog_read_primary`; require rows, original Supabase transcript boundary, capture time and procedure attestation;
3. request `catalog_readback`; require a different transcript boundary and later capture time;
4. normalize/compare the two six-function catalogs using the existing catalog logic; persist one digest-bound read-only receipt;
5. run the existing Supabase HTTP 401 network probe in-process;
6. request a read-only Pages proof target containing exact rollback workflow run ID (no selection/Save acknowledgement);
7. call existing `verifyRollbackPublicBytes()` in-process for exact Actions identity and five public hashes;
8. emit `readonly_drill_complete` with PID, request IDs, transcript refs and artifact hashes, then exit 0.

Fail closed:

- any timeout, late response, stream closure, duplicate transcript ref, catalog mismatch, GitHub identity mismatch or byte mismatch emits `readonly_drill_failed` and exits nonzero;
- no rollback language is emitted because the drill performs no mutation;
- production adapter, SQL receipt stages, Pages-selection requests and fixture runner are unreachable in this mode.

Tests should spawn the real CLI for successful read-only drill plus missing response, late response, stream closure, duplicate transcript and catalog/hash mismatch. A final live run would use two genuine Supabase connected-tool reads and real read-only GitHub/Pages requests, with no Teacher action.

This is the smallest safe path; reusing the production adapter and stopping at `freeze` is not equivalent evidence.

NEXT_OWNER: CA

NEXT_ACTION: Approve, revise or reject the minimal source-only `readOnlyDrill` mode. Production remains HOLD and no attempt is authorized.
