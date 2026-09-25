# Full Independent Snapshot Level 3 — ACT1–14 Post-Sprint8

Frozen baseline: `2cc4b642bc86c4d8fb1b1631ca0ae394ed886913`

Decision: **FAIL / BLOCKED**

Detailed artifacts:
- `BASELINE.md`
- `FINDINGS.md`
- `CROSS_LAYER_TRACES.md`
- `TEST_BLIND_SPOTS.md`
- `RUNDOWN.md`
- `EXECUTIVE_SUMMARY.md`

## Findings

- `IDA2-001 HIGH` — V4.0 ACT1–5 Teacher Override hard allowlist only partially implemented.
- `IDA2-002 HIGH` — canonical ACT3 Library Box override cannot pass ACT14 session integrity.
- `IDA2-003 HIGH` — Teacher Console does not enable completed-run export after finalization.
- `IDA2-004 HIGH` — semantic integrity can certify loss/mismatch of authoritative group outcomes.
- `IDA2-005 HIGH` — export remains room-scoped and cannot address an older completed run after a later run completes.
- `IDA2-006 MEDIUM` — JSON `exported_at` records finalization time instead of export-generation time.

## Gate

```text
Sprint8 local gate = VERIFIED PASS
Milestone Level3 = FAIL
Sprint9 = BLOCKED
Sprint10 = BLOCKED
```

## Canonical Ownership Check

PASS.

The relevant Teacher Override hard map predates the implementation. No protected canonical source was modified by CD/ISA in the Sprint8 correction interval without valid owner provenance.

## Remediation boundary

Migrations `001–053` are immutable.

Next unused migration: `054`.

CD owns integrated remediation because the findings touch runtime authority, Teacher workflow, finalization integrity and export semantics.

ISA may only be used later for bounded verification/tooling support under the active cooperation rules; it does not participate in the semantic decisions by default.

## Closure gate

After CD remediates IDA2-001..006 and submits a frozen baseline, CA performs a **Level2 Targeted Independent Closure Audit**.

The Level2 audit will verify:
- original finding closure;
- changed authority/evidence interfaces;
- adjacent regressions introduced by remediation;
- Patterns A–F;
- Canonical Ownership Check.

It will not automatically repeat the entire Level3 snapshot.
