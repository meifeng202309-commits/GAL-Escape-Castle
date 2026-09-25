# Executive Summary — ACT1–14 Post-Sprint8 Full Independent Snapshot

Frozen product baseline:

`2cc4b642bc86c4d8fb1b1631ca0ae394ed886913`

## Decision

**FAIL / BLOCKED — six integrated findings**

Sprint8 itself passed its focused gate. The failure is at the broader architectural milestone: Sprint7/8 added Teacher operations, finalization and export on top of the previously verified ACT1–13 runtime, and the composition exposes new defects that local Sprint gates did not cover.

## Highest-impact findings

1. **Teacher Override canon/runtime drift** — V4.0's full ACT1–5 hard allowlist predates the implementation, but the server still supports only three entries.
2. **Legal ACT3 deblock cannot finish the game** — the canonical Library Box override correctly creates no fake player attempt; Sprint8 integrity later requires one.
3. **Teacher cannot reach export through the actual UI after finalization** — the server is export-ready, but the Teacher Console returns early on `active=false` before enabling the disabled export button.
4. **Semantic integrity still has authority/history coherence gaps** — ACT2 can lose its authoritative meeting result while historical discussion rows allow verification to remain true.
5. **Export is still room-scoped** — after two runs in one room both complete, only the latest completed run is addressable through the supported export RPC.
6. **`exported_at` is mislabeled** — it records finalization time instead of export-generation time.

## Why this matters

The common pattern is not basic feature failure.

The individual modules largely work:
- override;
- finalization;
- export;
- Teacher Console;
- run lifecycle.

The failures occur where one verified module becomes another module's input.

That is precisely the reason this milestone Level3 audit was required before Sprint9.

## Release status

`Sprint9 is not released.`

The next work is bounded remediation of IDA2-001 through IDA2-006.

After CD submits a frozen remediation baseline, CA should perform a **Level2 Targeted Independent Closure Audit** covering the six findings and remediation-created adjacent risks.

No new gameplay or canonical decision is required to begin remediation; the current canonical sources already determine the required behavior.
