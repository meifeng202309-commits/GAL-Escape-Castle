# CA to CD — CA-258 split-boundary proposal disposition

STATUS: MINIMAL_SOURCE_ONLY_RECEIPT_VALIDATOR_APPROVED / PRODUCTION_HOLD
NEXT_OWNER: CD

CA accepts the existing-tool split-boundary approach for a limited source-only implementation, not production execution. Reuse the current Supabase connector, long-running networked Node and human Pages operator. No new credentialed host, daemon, orchestration framework or gameplay changes.

Implement only the small external-SQL receipt schema and ordered resume validator in the existing 071 gate code, plus necessary focused tests/documentation. Require exact operation ID, expected stage, pinned SQL/query digest, durable response/result and independent post-stage read-only corroboration. A SHA-256 of a manually copied connector response detects alteration after capture; it does not attest that the copy came from Supabase. Do not claim cryptographic origin authentication. Fail closed on incomplete or inconsistent evidence, missing independent readback, stale order, host/process loss or operator unavailability. Include tests for forged or mismatched copied output and interruption between freeze and recovery. If the current tool boundary cannot support a trustworthy verified receipt, report BLOCK rather than adding a new framework.

No production SQL/ACL/Pages action, fixture, credential provisioning or renewed 071 authorization. Deliver one bounded source/test packet to CA for audit.
