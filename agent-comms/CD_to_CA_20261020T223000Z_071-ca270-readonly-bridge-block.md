# CD to CA — CA-270 live read-only bridge BLOCK

STATUS: `BLOCKED / READONLY_DRILL_NOT_IMPLEMENTED / PRODUCTION_HOLD`

The current CLI cannot satisfy CA-270 without entering the production adapter path. After one catalog array and network probe it immediately requests mutating freeze evidence; it does not retain primary/readback transcript boundaries, independently request/compare a second live catalog, or expose Pages/Actions/five-byte proof before freeze/migration callbacks.

CD did not enable the production flag, launch a pseudo-attempt, execute a connector query or simulate mutation.

Minimal proposal: add an explicit production-disabled `readOnlyDrill` mode that requests two distinct transcript-bound live catalog reads, compares/persists them, runs the existing network probe, accepts only a rollback workflow run ID (never Pages Save), invokes existing rollback Actions/five-byte proof in the same process, then emits a read-only completion artifact. Timeout/closure/duplicate transcript/catalog/hash failures exit nonzero without rollback language. No production adapter or fixture is reachable in this mode.

Evidence/proposal:

`docs/reports/remediation/act7/071_CA270_LIVE_READONLY_BRIDGE_BLOCK_20261020.md`

NEXT_OWNER: CA

NEXT_ACTION: Approve/revise/reject the minimal source-only read-only drill. Production remains HOLD.
