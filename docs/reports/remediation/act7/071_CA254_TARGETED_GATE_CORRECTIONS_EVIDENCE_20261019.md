# CA-254 targeted 071 gate corrections

Timestamp: 2026-10-19T15:30:00Z  
Status: **SOURCE-ONLY READY FOR TARGETED CA REASSESSMENT / PRODUCTION HOLD**

## 1. Execution order and network identity

`runGuardedAttempt` is now the only approved source-level execution order:

1. same-process unauthenticated Supabase reachability probe;
2. atomic durable pre-freeze catalog capture and re-read;
3. freeze callback;
4. migration callback;
5. live GitHub deployment identity plus exact public-byte verification;
6. guarded admission ACL restoration callback;
7. second same-process Supabase reachability probe;
8. fixture callback.

The direct controlled-acceptance CLI now always refuses. A future production adapter must import `runCoordinatedAcceptance` and pass it as the fixture callback inside the same long-running coordinator process. No production adapter is included, so the current code is intentionally non-executable against production.

The coordinator pins an OS-visible execution fingerprint containing the operator context ID, `process.execPath`, `execArgv`, platform, architecture and cwd, and verifies it before ACL restoration and fixture execution. Both network probes execute inside that same Node process.

Limit: Node cannot observe an external host/tool sandbox's hidden routing or privilege label. An OS-visible fingerprint alone cannot prove that two separately launched processes receive identical network policy. The correction therefore does not claim that it can. It removes the cross-process claim by requiring one long-running process and probing twice within it. Any future adapter or host that cannot preserve this process must STOP.

## 2. ACL restoration enforcement

The voluntary `assert-acl-restore` CLI was removed. `restoreAdmissionAcl` is now invoked only by `runGuardedAttempt` after:

- the pre-mutation probe;
- persisted catalog snapshot;
- freeze and migration callbacks;
- live candidate deployment verification;
- five-file public proof persistence and re-read;
- operation-context equality and timestamp ordering.

The checklist now explicitly prohibits direct/manual ACL restoration and direct fixture CLI use. Because no reviewed production adapter exists, the only valid operational state is HOLD.

Fail-closed order tests prove:

- a pre-mutation DNS failure invokes none of freeze, migration, ACL restore or fixture;
- a candidate deployment identity failure after freeze/migration invokes neither ACL restore nor fixture;
- a valid synthetic chain invokes exactly `freeze → migration → restore → fixture`.

## 3. Candidate trust boundary

The verifier no longer accepts a configurable public base URL or a caller-asserted deployment object.

- Public origin is fixed to `https://meifeng202309-commits.github.io`.
- Repository path is fixed to `/GAL-Escape-Castle` plus the five reviewed file paths.
- A numeric workflow run ID is resolved live through the fixed GitHub repository Actions API.
- The API response must match run ID, workflow name `pages build and deployment`, branch `deploy/act7-071-20261017`, commit `6e3bbd1…`, `completed` and `success`.
- Every public fetch follows redirects but validates the final origin and pathname against the reviewed URL before accepting status/bytes.
- Every path still requires HTTP 200, nonzero length and exact frozen SHA-256.

Negative tests cover a bad live workflow SHA/conclusion, off-origin redirect, HTTP 503 and byte-hash mismatch.

## Validation

PASS:

```text
node --check scripts/act7-071-source-gates.js
node --check tests/act7-071-controlled-acceptance.js
node tests/act7-071-startup-gate.test.js
node tests/act7-071-source-gates.test.js
node tests/act7-v4-normal-timeout-static-check.js
bundled Node/Playwright tests/act7-v4-normal-timeout-browser.mjs
git diff --check
```

No production database, ACL, Pages, GitHub workflow or real fixture operation occurred.

NEXT_OWNER: CA — targeted reassessment of the corrected ordering, actual caller boundary and deployment/origin binding. Production remains HOLD.
