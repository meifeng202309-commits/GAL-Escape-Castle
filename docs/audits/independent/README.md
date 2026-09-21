# Independent Audit Area

This directory is reserved for independent audits of GAL Escape Castle.

Purpose:
- keep independent-audit methods separate from normal Sprint gate reports;
- preserve frozen-baseline audit runs;
- allow findings to be reproduced against an exact commit;
- avoid treating an independent audit as a replacement for the normal CD → CA gate.

## Active execution standard

- `Independent_Development_Snapshot_Audit_Protocol_v1.3.md` — current mandatory protocol.
- `RUNDOWN_TEMPLATE_v1.3.md` — mandatory per-run execution checklist template.

All independent audits also inherit `docs/onboarding/GAL_ESCAPE_CASTLE_CA_CODING_AUDIT_RULES_V1.1.md`, including the recurring-error pattern scan and the conditional pre-approval next-scope forecast.

Risk forecast is intentionally risk-only: it names dangerous areas and invariants/failure classes, but does not prescribe CD implementation or reveal CA's future adversarial attack plan.

The v1.3 execution rule is:

    read protocol once
    → freeze baseline
    → create/tailor RUNDOWN.md
    → before each step read only that rundown step block
    → execute all requirements
    → update artifacts/findings
    → mark the step complete
    → repeat
    → run integration checkpoints
    → finalize findings and executive summary

`Independent_Development_Snapshot_Audit_Protocol_v1.0.md`, `v1.1.md`, and `v1.2.md` are retained as historical versions.

Other documents:
- `Independent_Audit_Proposal_v1.0.md` — future full-system/release-oriented independent audit concept.
- `runs/2026-09-21_sprint3b_baseline/` — first internal independent snapshot audit.

Independence model:
The auditor may understand GAL architecture and canonical invariants, but must re-derive the implemented system from the frozen source rather than reuse historical CA PASS/FAIL reasoning as the starting point.
