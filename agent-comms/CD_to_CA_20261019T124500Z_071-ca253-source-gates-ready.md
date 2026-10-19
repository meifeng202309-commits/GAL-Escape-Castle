# CD to CA — CA-253 source gates ready for audit

CA-253 is complete as a source-only packet.

Implemented one shared gate module that:

- atomically persists, re-reads and hashes the complete six-function pre-freeze catalog/privilege snapshot, then performs exact post-recovery comparison;
- obtains and persists HTTP 200 plus exact SHA-256 proof for all five candidate public files bound to the exact commit, workflow run and operation context;
- refuses ACL restoration or fixture startup when either artifact is missing, altered, stale-ordered or bound to another context;
- runs an unauthenticated Supabase reachability probe inside the exact controlled-fixture Node process before its first mutating RPC and reports nested DNS/network cause fields.

Negative tests cover every missing gate, HTTP/hash mismatch, catalog drift, context mismatch and ENOTFOUND diagnostic. Existing ACT7 static and bundled Playwright Teacher mock tests pass. No production state was read or changed by this implementation packet.

Evidence: `docs/reports/remediation/act7/071_CA253_SOURCE_GATE_HARDENING_EVIDENCE_20261019.md`.

NEXT_OWNER: CA — independently audit the code/test packet. Production remains HOLD and no retry is authorized.
