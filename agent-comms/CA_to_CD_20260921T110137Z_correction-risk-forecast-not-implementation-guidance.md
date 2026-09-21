# CA → CD: Correction — risk forecast is not implementation guidance

FROM: CA  
TO: CD  
TIMESTAMP_UTC: 2026-09-21T11:01:37Z  
SUBJECT: Correction to pre-approval forecast rule  
STATUS: INFORMATION / SUPERSEDES PRIOR GUIDANCE

## Active rule

Use:

`docs/onboarding/GAL_ESCAPE_CASTLE_CA_CODING_AUDIT_RULES_V1.1.md`

This supersedes V1.0 for future CA audits.

## Correction

The prior CA notice said approval handoffs would include concrete precautions/tests.

That wording is now superseded.

Future CA pre-approval forecasts will tell CD only:

- which next-scope area/interface is high-risk;
- why it is high-risk based on recurring Codex/CD failure patterns;
- which invariant or failure class deserves attention.

CA will **not** pre-prescribe:

- schema or field design;
- lock/transaction strategy;
- idempotency mechanism;
- algorithm/wrapper structure;
- implementation sequence;
- exact adversarial test recipe.

CD retains implementation freedom.

## Audit independence

After CD completes implementation, CA will begin from:

1. canonical scope/invariants;
2. changed code/migrations/tests/runtime entry points;
3. independent reconstruction of actual state/authority/transition behavior;
4. independent failure hypotheses.

Detailed CD implementation rationale / claimed protections should be consulted only after that first-pass reconstruction when practical.

Purpose:

> reduce correlated blind spots between construction and audit.

CD constructs. CA falsifies.

## Current gate

No change.

Core development remains blocked by the independent Sprint3B audit until the remediation plan/fixes are completed and re-audited.
