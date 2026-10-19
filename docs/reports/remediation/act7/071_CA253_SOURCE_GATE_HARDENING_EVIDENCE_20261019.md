# CA-253 071 source-gate hardening evidence

Timestamp: 2026-10-19T12:45:00Z  
Status: **SOURCE-ONLY READY FOR CA REVIEW / PRODUCTION HOLD**

## Implemented scope

Added `scripts/act7-071-source-gates.js` as the shared fail-closed gate implementation.

### Durable catalog snapshot and recovery comparison

- Accepts exactly the frozen six admission signatures.
- Requires owner, SECURITY DEFINER, search path, raw and normalized MD5, raw ACL and effective privilege matrix for PUBLIC/anon/authenticated/service_role/postgres.
- Canonically sorts and hashes the evidence, writes it atomically, then re-reads and verifies the artifact digest before returning success.
- Binds the artifact to `ACT7_071_EXECUTION_CONTEXT_ID`.
- `compare-recovery` requires the complete post-recovery row set to equal the persisted pre-freeze artifact exactly.

### Candidate five-file public-byte prerequisite

- Binds proof to candidate commit `6e3bbd1d2795bd4486b1437a0b9e107e2238fa28`, workflow run ID and the pinned operation context.
- Performs cache-busted HTTPS GETs for the exact five public paths.
- Requires HTTP 200, nonzero bytes and the frozen SHA-256 value for every path.
- Persists and digest-verifies the complete proof artifact.
- `assert-acl-restore` refuses to authorize admission ACL restoration unless both the catalog and candidate artifacts are valid, ordered and bound to the same operation context.
- `tests/act7-071-controlled-acceptance.js` independently revalidates the same artifacts before any fixture work.

### Exact-executor Supabase network probe

- The controlled acceptance now performs an unauthenticated Supabase `/rest/v1/` GET in the same Node process immediately before `fixture("normal")`.
- Any HTTP response proves network reachability; no RPC or record mutation occurs during the probe.
- Failures preserve nested cause fields (`code`, `syscall`, `hostname`) in the thrown diagnostic.
- The probe artifact records `process.execPath`, `execArgv`, platform, architecture, cwd and the pinned execution-context ID.
- Only after artifact validation and the same-process network probe can the first mutating `s1_create_room` RPC run.

The operator checklist now points to the shared script and states that missing/mismatched proof is a mandatory STOP. No migration or unrelated module changed.

## Negative and regression tests

PASS:

```text
node --check scripts/act7-071-source-gates.js
node --check tests/act7-071-controlled-acceptance.js
node --check tests/act7-071-source-gates.test.js
node tests/act7-071-startup-gate.test.js
node tests/act7-071-source-gates.test.js
node tests/act7-v4-normal-timeout-static-check.js
bundled Node/Playwright tests/act7-v4-normal-timeout-browser.mjs
```

Negative coverage proves refusal for:

- either original authorization flag missing;
- snapshot, candidate proof, network output or context ID missing;
- fewer than six snapshot rows or any recovery row drift;
- candidate HTTP non-200 or candidate hash mismatch;
- missing candidate artifact or mismatched operation context;
- missing context ID for the network probe;
- network failure with exact `ENOTFOUND/getaddrinfo/hostname` cause propagation.

Positive reuse/rollback coverage proves:

- the same persisted snapshot is re-read by both ACL-restore/fixture prerequisite checks;
- the same normalizer compares post-recovery rows exactly;
- candidate proof is re-read and digest-checked rather than trusted in memory;
- existing ACT7 static and Teacher browser mock behavior remains PASS.

The first browser-mock invocation could not resolve the uninstalled local `playwright`; using the existing bundled workspace dependency then exposed default-sandbox loopback denial. The identical local mock was rerun in the permitted execution context and passed. No dependency was installed or modified.

## Production boundary

No Supabase query, SQL, ACL, record, Pages setting, deployment or real fixture was executed. These changes do not authorize production. All artifacts produced by tests were synthetic and removed.

NEXT_OWNER: CA — independently audit the source-only packet. Any additional correction or future production gate requires a separate release.
