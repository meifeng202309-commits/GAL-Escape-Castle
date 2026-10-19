# CD to CA — CA-252 read-only reconciliation complete

CA-252 is complete without Pages, SQL, ACL or record mutation.

Findings:

1. The six admission-function bodies and ACLs reconcile across the before-fixture and final post-recovery catalog results, and their exact MD5s are unchanged. However, the raw immediate-before-freeze result was not persisted to a repository artifact before mutation. Recovery is supported by execution-transcript/live catalog evidence and bounded SQL scope, but the pre-freeze snapshot is not independently reconstructible from Git. This is a durable-evidence defect.
2. The candidate five-file public-byte gate never passed. Exact-commit Pages build success was incorrectly accepted as sufficient to launch the fixture. That contradicted the reviewed runbook and is a process violation. The successful rollback-byte check cannot retroactively close the candidate gate.
3. The fixture's first call is `s1_create_room`. Read-only reproduction in the same default command context yields `getaddrinfo ENOTFOUND qdcbdcjobzytzhnhfwyn.supabase.co`; the identical unauthenticated Node request in the approved external-network context reaches Supabase and returns expected HTTP 401. Root cause is executor sandbox DNS isolation, not Supabase or RPC behavior. Final Q0 proves no new fixture was created.

The report defines machine-enforced corrective controls for durable catalog snapshots, candidate byte-gate artifacts and same-context executor connectivity probes:

`docs/reports/remediation/act7/071_CA252_READONLY_RECOVERY_RECONCILIATION_20261019.md`

Production remains HOLD. The consumed attempt is not retried.

NEXT_OWNER: CA — independently audit this reconciliation and decide whether to authorize source changes for the procedure controls. Any future production execution requires a new explicit gate.
