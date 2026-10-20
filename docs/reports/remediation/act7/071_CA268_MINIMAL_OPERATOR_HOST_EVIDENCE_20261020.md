# CA-268 minimal executable operator host

Status: `SOURCE_READY_FOR_CA_REVIEW / NONMUTATING_TESTS_PASS / PRODUCTION_HOLD`

Authority: CA-268. No SQL/ACL mutation, Pages Save, deployment, live fixture RPC, credential provisioning or production authorization was used.

## Runtime placement and tool boundary

The host runs as one local persistent Node process:

```text
node scripts/act7-071-operator-host.js <config.json>
```

The process calls the existing `run071ProductionAdapter()` directly. It owns candidate/rollback GitHub Actions and public-byte verification plus the eventual coordinated fixture call. Supabase connector execution and human Pages Save remain outside Node. Those boundaries use one ordered newline-delimited JSON request/response channel over stdin/stdout.

Every response must match:

- fixed procedure marker `CD_EXTERNAL_OPERATOR_V1`;
- exact operation ID;
- process-generated request ID;
- `approved: true`;
- the expected response shape.

Only one request may be pending. Stream loss rejects the pending boundary. SQL evidence then passes through the existing append-only receipt/readback validator; Pages acknowledgements must return the requested exact branch/folder and numeric workflow run ID. This is procedural binding, not cryptographic connector-origin authentication.

## Minimal implementation

New essential module:

- `scripts/act7-071-operator-host.js` — 104 source lines.

Existing-source delta:

- `act7-071-source-gates.js`: +7/-2 lines, accepting the exact candidate workflow run ID returned by the live Pages acknowledgement before in-process proof.
- `act7-071-production-adapter.js`: +3/-2 lines, using the exact rollback workflow run ID returned by rollback acknowledgement.

Net production-source growth: 114 lines added, 4 removed. Test growth: 123 lines.

Reused without duplication:

- `run071ProductionAdapter()`;
- `runGuardedAttempt()` and fail-closed recovery;
- `verifyCandidatePublicBytes()` / `verifyRollbackPublicBytes()`;
- prefreeze catalog persistence/comparison;
- external SQL receipt persistence/validation;
- existing `runCoordinatedAcceptance()` fixture export.

No new server, credential path, deployment framework, SQL executor or gameplay logic was added.

## Nonmutating persistent-process proof

`tests/act7-071-operator-host.test.js` uses one retained process and real Git blobs with simulated network/tool responses.

PASS — success path:

1. pauses for external catalog;
2. pauses for freeze and migration evidence;
3. pauses for exact candidate Pages acknowledgement;
4. consumes the acknowledgement's workflow run ID;
5. verifies candidate Actions identity and all five public bytes in-process;
6. pauses for ACL-restore evidence;
7. runs only the injected mock fixture in the same process.

PASS — fail/rollback path:

1. candidate Actions proof is deliberately failed;
2. fixture is never called;
3. process pauses for exact rollback acknowledgement;
4. validates rollback Actions identity/five Git-blob bytes in-process;
5. pauses for recovery and recovery-ACL receipts;
6. recaptures and exactly compares the six-function catalog;
7. exits fail-closed after verified simulated recovery.

Full focused tests:

```text
operator-host PASS
source-gates PASS
startup-gate PASS
3 tests / 0 failures
```

## Separate real-network evidence

A separate read-only Node invocation loaded the new host module and made no adapter/operator request:

- Node `v24.19.0`, PID `22296`;
- Supabase REST root returned HTTP 401, proving network reachability without credentials;
- GitHub Actions run `39412338627` returned HTTP 200 and exact rollback branch/commit/status;
- public Pages `index.html` returned HTTP 200 and 2574 bytes.

This proves network capability only. It is deliberately not presented as SQL receipt, candidate proof or mock-path evidence.

## Limitations / fail-closed boundaries

1. The stdin/stdout procedure does not cryptographically authenticate the external connector; retained original transcripts and separate readback remain mandatory.
2. The host cannot call the Supabase connector itself and never claims it can.
3. Human Pages selection remains manual and requires separate production authority.
4. Mock fixture success has zero product-acceptance weight.
5. No current production attempt is authorized; the host has not been used against a live mutation boundary.
6. Configuration must provide all evidence paths and receipt-plan expected digests; missing fields fail in the existing adapter/validator.

NEXT_OWNER: CA

NEXT_ACTION: Independently review the bounded host, dynamic run-identity handoff, protocol limitations and mock coverage. Production remains HOLD; any live use requires a separate explicit authorization.
