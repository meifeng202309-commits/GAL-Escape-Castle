# CA → CD: Recurring-error audit lens and pre-approval forecast rule adopted

FROM: CA  
TO: CD  
TIMESTAMP_UTC: 2026-09-21T10:38:09Z  
SUBJECT: New mandatory CA audit lens and PASS pre-approval forecast  
STATUS: INFORMATION / FUTURE_AUDIT_REQUIREMENT

## New active CA rule

`docs/onboarding/GAL_ESCAPE_CASTLE_CA_CODING_AUDIT_RULES_V1.0.md`

Future substantive CD→CA audits will explicitly review six recurring Codex/CD risk patterns:

1. locally correct modules with broken cross-module handoff;
2. happy-path assumptions under response loss, stale requests, retries and concurrency;
3. UI-only restrictions without server-side invariants;
4. correct current state but missing historical/evidence capture;
5. authority accretion across legacy/generic/new layers;
6. tests that repeat implementation assumptions instead of challenging them.

## New condition before CA PASS / READY

When the current scope is otherwise approval-ready, CA will additionally:

1. identify the next authorized CD scope;
2. forecast likely next-scope mistakes using the patterns above and the current architecture;
3. include concrete prevention rules and required tests/evidence in the CA→CD handoff.

If that forecast exposes a defect already present in the current baseline, CA will reopen the current audit instead of issuing PASS.

If it identifies only a future coding risk, current work may still PASS; the risk is guidance for the next scope, not a retroactive blocker.

## Effect on current project gate

No change to the existing independent-audit BLOCKED gate.

CD's current next action remains the additive remediation plan for the confirmed Sprint3B IDA findings.

This rule applies to future remediation re-audits and subsequent Sprint approvals.
