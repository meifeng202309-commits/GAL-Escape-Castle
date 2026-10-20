# CA-260 receipt execution bridge evidence

Timestamp: 2026-10-20T12:05:00Z
Status: **SOURCE-ONLY BRIDGE COMPLETE / PRODUCTION HOLD**

## Enforced bridge

The existing production adapter no longer expects an in-process SQL executor. Its narrow operator contract now requires `awaitExternalSqlEvidence`. For every external SQL stage, the persistent Node process:

1. supplies the exact stage name, operation ID, SQL text and computed statement SHA-256 to the operator boundary;
2. waits for copied mutation response plus a separately executed read-only corroboration result;
3. atomically persists the new receipt without allowing overwrite;
4. validates the complete current chain against the adapter's expected stage order, exact internal SQL hash, pinned corroboration-query hash and expected-state digest;
5. returns the callback only after validation succeeds, allowing `runGuardedAttempt` to advance.

This bridge is used by attempt stages `freeze`, `migration` and `acl-restore`, and recovery stages `recovery` and `recovery-acl-restore`. Attempt and recovery receipts are separate ordered chains under the same operation ID. Missing or rejected evidence causes the callback to throw and no stage is appended to the completed chain.

## Independent corroboration and trust limit

Each receipt now requires two different retained connector transcript references: one for the mutation response and one for the later read-only corroboration. Matching copied JSON without distinct executions is rejected. The readback rows must hash to the expected state defined by the reviewed receipt plan.

These references, hashes and readback checks make alteration and unsupported stage progression detectable. They do not cryptographically authenticate Supabase or prove that a human-entered transcript reference corresponds to the connected service. The actual connector transcript must be retained for CA review. The adapter continues to label origin attestation as `NOT_PROVIDED_COPY_INTEGRITY_ONLY`.

## Negative evidence

Focused tests prove:

- absent external stage evidence is rejected before persistence;
- wrong independent readback is persisted as rejected evidence but is not appended to the completed chain;
- an incomplete freeze → recovery chain cannot resume;
- operator absence prevents validation;
- persistent Node fingerprint loss prevents validation;
- modified copied output and mismatched expected readback are rejected;
- all prior mutation-boundary/recovery tests remain PASS.

Validation PASS:

```text
node --check scripts/act7-071-source-gates.js
node --check scripts/act7-071-production-adapter.js
node tests/act7-071-source-gates.test.js
node tests/act7-071-startup-gate.test.js
node tests/act7-v4-normal-timeout-static-check.js
git diff --check
```

No production SQL, ACL, Pages action, fixture, credential or new authorization occurred.

NEXT_OWNER: CA — audit the minimal bridge, expected receipt-plan boundary and retained-transcript limitation. Production remains HOLD.
