# CA-257 rollback identity correction and host options

Timestamp: 2026-10-20T06:50:00Z
Status: **BOUNDED SOURCE FIX COMPLETE / HOST DECISION OPEN / PRODUCTION HOLD**

## Source correction

The sole rollback verifier constant now equals the independently reviewed branch and successful Actions identity:

```text
branch = deploy/manual-acceptance-20261003
commit = 891feffe558a4683ac3da67e1e6b15e902c7e592
known successful run = 39206010849
```

The shared verifier now uses a pure `assertWorkflowIdentity` check. Tests provide:

- positive acceptance of the exact branch, 40-character commit, run ID, workflow name, completed status and success conclusion;
- negative rejection of the former wrong commit `891feffe40f3d2a1169c28d82085900c0edb72bd`;
- existing wrong candidate commit/conclusion rejection remains intact.

Repository inspection found no other incorrect full rollback constant. Existing reports, runbook and public-smoke default already use the corrected identity.

## Read-only host comparison

| Concern | Minimal split-boundary operator | One credentialed Node host |
|---|---|---|
| Failure isolation | Connector SQL, external Node proof and human Pages UI fail independently. A coordinator crash does not expose database credentials, but cross-boundary partial completion must be represented explicitly. | One process has simpler stage order and can enter recovery immediately, but process/host loss interrupts SQL, proof and coordination together. |
| Irreversible/high-risk actions | SQL and Pages remain separately confirmed. Every boundary needs an idempotent checkpoint and signed/digested handoff before the next mutation; no implicit atomicity exists across tools. | Can enforce one state machine around SQL and public proof, but database commit and Pages Save are still not jointly atomic. Recovery remains mandatory. |
| Teacher Pages coordination | Chat/browser acknowledgement is naturally separate. Coordinator must stop on a durable acknowledgement artifact and never infer Save completion from a screenshot alone. | Node may block on stdin/IPC for exact Teacher tokens, but Pages Save remains human and outside the process. Timeout/disconnect must trigger STOP/recovery. |
| Durable evidence | Strong if each boundary emits digest-bound artifacts with operation ID, stage, timestamp and exact input/output identity; weaker if connector results are copied manually. | Straightforward atomic local writes and one process fingerprint, but host logs and artifact directory need independent retention if the host fails. |
| Secret handling | Preferred for least privilege: Supabase connector retains database authority; Node and chat never receive DB secrets. Requires CA approval to relax the same-process rule and formally trust connector receipts. | Requires provisioning production DB authority to a local process. Secrets must come from an approved secret store, never chat/repository/logs, with least privilege, short lifetime and revocation. Current approved host has no such runner or credentials. |
| Readiness today | Components exist, but architecture is not approved and receipt-to-artifact binding is not implemented. | Not feasible: no approved credentialed Node+SQL host exists. |

Decision observation: the split-boundary option minimizes new secret exposure and reuses approved surfaces, but it requires a new CA/Teacher execution-boundary contract and explicit durable receipts. The single-host option preserves the current source design more directly but requires new credential provisioning and creates a larger secret/failure blast radius. Neither is authorized or implemented.

## Validation

PASS:

```text
node --check scripts/act7-071-source-gates.js
node tests/act7-071-source-gates.test.js
node tests/act7-071-startup-gate.test.js
node tests/act7-v4-normal-timeout-static-check.js
git diff --check
```

No SQL, ACL, Pages setting, fixture, production flag, credential provisioning or host implementation occurred.

NEXT_OWNER: CA / Teacher — review the exact source correction and choose or reject a host architecture. Production remains HOLD.
