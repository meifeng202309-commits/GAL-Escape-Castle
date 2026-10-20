# ACT7-071 CA-271 read-only drill evidence

## Result

PASS. The bounded `readOnlyDrill` source path and one genuine connected-tool run completed without production authorization or mutation. Production remains HOLD.

## Implementation boundary

- `scripts/act7-071-operator-host.js`: added a production-disabled read-only branch before the production adapter, four required evidence paths, two ordered/distinct catalog transcript checks, exact catalog comparison, existing Supabase network probe, existing rollback Actions/five-byte verification, and a digest-bound completion receipt.
- Read-only mode rejects either production/evidence authorization flag, never calls the production adapter, SQL mutation, Pages selection/Save, or live fixture.
- Operator response timeout remains bounded at 100–900000 ms; pending stream closure and late/unmatched responses fail closed.
- Source delta for implementation/test helpers: 130 insertions and 4 deletions across three files (`66/2`, `60/0`, `4/2`).

## Automated validation (mocked boundaries)

Command:

`node --test tests/act7-071-operator-host.test.js tests/act7-071-source-gates.test.js tests/act7-071-startup-gate.test.js`

Result: 3 test files passed, 0 failed. The spawned CLI matrix covers success, timeout, late response, stream closure, duplicate transcript, catalog mismatch, wrong Actions identity, wrong public bytes, and production-flag rejection. Network/GitHub responses in this matrix are mocks; they are not claimed as live evidence.

## Genuine connected-tool evidence

- Operation: `ca271-readonly-drill-r3-20261020T144300Z`; one live Node PID: `4012`; production authorized: `false`.
- Primary Supabase transcript: `untrusted-data-c84a9890-6065-4cd9-97a5-16501dd41c4b`, captured `2026-10-20T14:32:38.367Z`.
- Independent readback transcript: `untrusted-data-50bef7d4-6df1-4bf5-a658-47a2ed1cec10`, captured `2026-10-20T14:34:51.973Z`.
- Both actual read-only SQL results contained the six required admission functions and matched exactly after normalization. Snapshot SHA-256: `2b1ba4b18f806f9f965bf49b529d9f1d61e593e5e3f6730240d062fd5a267363`.
- The same Node received HTTP `401` from the Supabase REST root, proving network reachability without credentials or mutation. Network proof SHA-256: `add5c743f42c27ff1b3508850f107330df0584744e2302da96ba07a27f5ee411`.
- The same Node verified successful Actions run `39412338627`, rollback branch `deploy/manual-acceptance-20261003`, commit `891feffe558a4683ac3da67e1e6b15e902c7e592`, and all five expected public byte hashes. Rollback proof SHA-256: `9443e3915d96cc7a18f5a18a09f6e1a3c93b3f5f636970f0032813533401fc8f`.
- Completion receipt SHA-256: `150eb71a3529da3a7281de4ade21dd770d2482e6e13a1ebb849d7777b0d60327`.

Canonical artifacts:

- `071_CA271_LIVE_CATALOG_SNAPSHOT_R3_20261020.json`
- `071_CA271_LIVE_NETWORK_PROOF_R3_20261020.json`
- `071_CA271_LIVE_ROLLBACK_PROOF_R3_20261020.json`
- `071_CA271_LIVE_READONLY_DRILL_RECEIPT_R3_20261020.json`

## Transport retries

R1 failed closed because a long second JSON response was echoed by the Windows PTY but not accepted before timeout. R2 intentionally proved a plain-pipe stdin closure also fails closed. Neither run reached Pages proof, called the production adapter, or performed mutation. R3 used chunked PTY input and completed; no failed artifact is represented as success.

## Closure

CA-271's implementation, spawned-CLI negative matrix, and genuine same-process connected-tool drill are complete. No SQL write, Pages Save, fixture, credential change, or production authorization occurred. Next owner is CA for independent review; production remains HOLD.
