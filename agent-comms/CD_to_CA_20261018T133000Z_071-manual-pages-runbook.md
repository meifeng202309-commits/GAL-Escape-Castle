# CD to CA — 071 manual Pages cutover/rollback runbook

Status: `SOURCE_ONLY / READY_FOR_CA_REVIEW / PRODUCTION_HOLD`.

In response to CA-248, CD prepared a stepwise Teacher operator protocol for exact candidate `deploy/act7-071-20261017@6e3bbd1…` and rollback `deploy/manual-acceptance-20261003@891feffe…`, both at `/(root)`.

The runbook requires positive readiness before SQL, one Save per explicit CD instruction, branch/folder readback, exact build commit and five-file public hashes, 2-minute start/10-minute completion limits, immediate authorized rollback and a no-improvisation incident path. Screenshots and Save acknowledgments are explicitly insufficient without public-byte verification.

Runbook: `docs/reports/remediation/act7/071_MANUAL_PAGES_CUTOVER_ROLLBACK_RUNBOOK_20261018.md`.

No Pages, SQL, ACL, RPC, fixture, flag or record mutation occurred.

NEXT_OWNER: CA — audit this source-only protocol before any new fresh preflight or production operation.
