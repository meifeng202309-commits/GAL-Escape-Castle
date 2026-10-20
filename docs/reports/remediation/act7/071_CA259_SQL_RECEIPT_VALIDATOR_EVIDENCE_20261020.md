# CA-259 SQL receipt validator evidence

Timestamp: 2026-10-20T09:55:00Z
Status: **BOUNDED SOURCE PACKET COMPLETE / PRODUCTION HOLD**

## Implementation

The existing `scripts/act7-071-source-gates.js` now provides two bounded functions:

- `persistSqlStageReceipt` atomically writes and re-reads one digest-protected `sql-stage-receipt`;
- `validateSqlReceiptChain` validates an exact expected receipt sequence before the persistent Node process may resume.

Each receipt requires the operation ID, exact stage and positive sequence; previous receipt SHA-256; pinned statement and independent corroboration-query SHA-256; a nonempty copied connector response and its digest; nonempty read-only corroboration rows and their digest; ordered UTC response/readback times; operator confirmation; and the explicit marker `NOT_PROVIDED_COPY_INTEGRITY_ONLY`.

The chain validator additionally requires an exact expected stage list, expected SQL/query hashes, optional expected-state digest, continuous previous-receipt linkage, the original visible Node fingerprint and current operator availability. It fails closed on missing receipts, order or digest drift, stale timestamps, absent readback, unexpected corroborated state, process/context loss or unavailable operator.

## Trust limit

The receipt SHA-256 detects alteration after the copied connector response was captured. It does **not** authenticate Supabase as the response origin, and the code refuses any receipt that asserts otherwise. Trust still requires the approved connected tool transcript plus an independent deterministic read-only query whose rows must match the pinned expected-state digest. A malicious author able to replace and re-digest both copied output and corroboration is outside this mechanism; CA/Teacher must retain the connector transcript and review the readback evidence.

## Focused negative evidence

Tests cover:

- a valid freeze → recovery receipt chain;
- interruption after freeze with the recovery receipt missing;
- visible Node fingerprint loss;
- operator unavailable;
- copied connector response modified after atomic capture;
- read-only corroboration that does not match the expected state;
- existing seven mutation-boundary and double-failure recovery tests.

Validation PASS:

```text
node --check scripts/act7-071-source-gates.js
node tests/act7-071-source-gates.test.js
node tests/act7-071-startup-gate.test.js
node tests/act7-v4-normal-timeout-static-check.js
git diff --check
```

No production SQL, ACL, Pages action, fixture, credential, flag or new coordinator/framework was created or executed.

NEXT_OWNER: CA — audit the bounded receipt schema/validator and its explicit non-authentication limit. Production remains HOLD.
