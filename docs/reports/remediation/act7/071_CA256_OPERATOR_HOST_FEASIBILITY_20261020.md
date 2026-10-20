# CA-256 operator-host feasibility

Timestamp: 2026-10-20T04:45:00Z
Status: **READ-ONLY COMPLETE / NO END-TO-END APPROVED HOST / PRODUCTION HOLD**

## Result

No currently approved execution host can satisfy the complete CD-119 adapter contract in one Node process.

The approved external-network Node context can retain one process and reached all three public/read-only network boundaries in one invocation:

- Supabase REST root: HTTP 401 (reachable, no credential supplied);
- GitHub Actions run `39206010849`: HTTP 200, completed/success;
- public rollback `index.html`: HTTP 200, 2,574 bytes, SHA-256 `1da4904e…09c4`.

That process has Node only. `psql`, Supabase CLI and `gh` are absent, and no `SUPABASE_*`, `PG*`, `GITHUB_*` or usable `GH_*` credential environment is present (`GH_PAGER` is non-credential configuration). The connected Supabase `execute_sql` capability can run read-only SQL, but it is an external connector process and cannot be called as the adapter's in-process `operator.executeExactSql`. GitHub/Pages confirmation likewise remains a human browser step rather than an in-process programmatic selector. Durable local artifact paths are writable, and synchronous Teacher acknowledgement can conceptually be held on stdin, but neither supplies the missing exact SQL runner.

Therefore the current environment cannot truthfully demonstrate one-process wiring of all of:

```text
ACT7_071_EXECUTION_CONTEXT_ID
ACT7_071_PREFREEZE_SNAPSHOT
ACT7_071_CANDIDATE_PROOF
ACT7_071_NETWORK_PROBE_OUTPUT
operator.captureAdmissionCatalog
operator.executeExactSql
operator.awaitPagesSelection
operator.runControlledFixture
```

## ACL restoration equivalence

A fresh read-only production catalog query returned the reviewed matrix:

| Function group | PUBLIC | anon | authenticated | service_role | postgres |
|---|---:|---:|---:|---:|---:|
| create / join / formal start / reset | no | yes | yes | yes | yes |
| initialize flow | yes | yes | yes | yes | yes |
| direct start | no | no | no | yes | yes |

All six remain owner `postgres`, SECURITY DEFINER, `search_path=public`, with the previously recorded raw MD5 values. CD-119 `RESTORE_SQL` reproduces this effective matrix exactly; no ACL mismatch forces incident recovery. This was read-only and did not execute the restore SQL.

## Additional source blocker found by safe proof

The staged verifier pins rollback commit `891feffe40f3d2a1169c28d82085900c0edb72bd`. Both `git ls-remote` and live successful Actions run `39206010849` identify the rollback branch head as `891feffe558a4683ac3da67e1e6b15e902c7e592`.

Consequently the current adapter would reject the real rollback workflow identity before recovery SQL. CA-256 authorizes feasibility only and says not to expand code, so CD did not alter the constant. Production readiness is false independently of the host blocker.

## Minimum decision options

1. Authorize a narrowly provisioned operator host where the same Node process can invoke an exact SQL runner without sharing secrets in chat or repository, while the Teacher remains available for synchronous Pages confirmations.
2. Authorize a bounded architecture correction that explicitly permits the connected Supabase runner as a separate execution boundary and revises the same-process guarantee/evidence model.
3. Separately authorize the minimal rollback-commit constant correction and targeted verifier regression test; this alone does not solve host feasibility.

Until one host option and the source correction are approved, STOP. One prior production attempt remains consumed. No SQL mutation, ACL change, Pages setting change, fixture, flag, record mutation or GitHub workflow action occurred.

NEXT_OWNER: CA / Teacher — choose the minimum host architecture and authorize any source correction. Production remains HOLD.
