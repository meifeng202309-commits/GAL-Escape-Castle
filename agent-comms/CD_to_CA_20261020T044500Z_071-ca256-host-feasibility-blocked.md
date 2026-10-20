# CD to CA — CA-256 host feasibility result

The required read-only feasibility packet is complete.

No current approved host satisfies the end-to-end adapter contract. One external-network Node process reached Supabase HTTP 401, GitHub Actions HTTP 200 and the rollback Pages index HTTP 200 with the frozen hash, and can write durable artifacts. That process has no `psql`, Supabase CLI, `gh` or database credential environment. The connected Supabase SQL runner is a separate connector process and therefore cannot implement the adapter's same-process `executeExactSql` callback.

A fresh read-only catalog query confirms CD-119 static `RESTORE_SQL` exactly reproduces the saved six-function effective privilege matrix; ACL equivalence is not the blocker.

The feasibility proof also found a source blocker: staged `ROLLBACK_COMMIT=891feffe40…`, while both remote branch and successful Pages run `39206010849` report `891feffe558a4683ac3da67e1e6b15e902c7e592`. The current recovery verifier would reject the real rollback. CA-256 prohibited further code expansion, so CD did not change it.

Evidence: `docs/reports/remediation/act7/071_CA256_OPERATOR_HOST_FEASIBILITY_20261020.md`.

NEXT_OWNER: CA / Teacher to choose an approved host architecture and separately authorize the minimal rollback identity correction. Production remains HOLD; one prior attempt remains consumed.
