# Independent Audit Area

This directory is reserved for independent audits of GAL Escape Castle.

Purpose:
- keep independent-audit methods separate from normal Sprint gate reports;
- preserve frozen-baseline audit runs;
- allow findings to be reproduced against an exact commit;
- avoid treating an independent audit as a replacement for the normal CD → CA gate.

## Active execution standard

- `Independent_Development_Snapshot_Audit_Protocol_v1.3.md` — current mandatory protocol when a **Level 3 Full Independent Snapshot Audit** is invoked.
- `RUNDOWN_TEMPLATE_v1.3.md` — mandatory per-run execution checklist template for Level 3.

All CA audits inherit `docs/onboarding/GAL_ESCAPE_CASTLE_CA_CODING_AUDIT_RULES_V1.2.md`.

## Audit levels / cadence

### Level 1 — Regular CA Audit

Normal Sprint / substantive implementation gate.

Use continuously during development.

### Level 2 — Targeted Independent Closure Audit

Use after remediation of a defined set of confirmed findings.

Focus on:
- original finding closure conditions;
- changed code/migrations/interfaces;
- adjacent failure surfaces created by the remediation;
- recurring Codex/CD Patterns A–F;
- relevant regressions.

Do not automatically repeat every full-snapshot Method 1–9 artifact unless the closure audit discovers evidence requiring broader reconstruction.

### Level 3 — Full Independent Snapshot Audit

Use periodically, not after every regular gate.

Recommended triggers:
- about 2–3 substantive Sprints since the last full independent audit;
- a new authority domain such as Teacher Override / Agent intervention / automatic resolution;
- about 2–4 substantive new migrations that materially expand state/authority/evidence architecture;
- major cross-layer expansion;
- before a high-cost real multi-user classroom test;
- before a release candidate / near-complete ACT1–14 runtime.

The policy is:

    regular audit continuously
    → targeted independent closure after major remediation
    → full independent audit periodically / at architectural milestones

This avoids duplicating a full independent audit after every CD step while preserving periodic system-level falsification.

## Independence model

Risk forecast is intentionally risk-only: it names dangerous areas and invariants/failure classes, but does not prescribe CD implementation or reveal CA's future adversarial attack plan.

The auditor may understand GAL architecture and canonical invariants, but must re-derive the implemented system from the frozen source rather than reuse historical CA PASS/FAIL reasoning as the starting point.

## Full Level 3 execution rule

When Level 3 is invoked:

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
