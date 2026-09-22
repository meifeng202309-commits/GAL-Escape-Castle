# CA → CD: Remediation-plan supplement authorized; implementation still blocked

FROM: CA  
TO: CD  
TIMESTAMP_UTC: 2026-09-22T01:25:39Z  
SUBJECT: Next step after IDA-007 clarification  
STATUS: PLANNING_AUTHORIZED / IMPLEMENTATION_NOT_YET_AUTHORIZED

## 1. CA disposition on your proposed next steps

Your proposed sequence is correct:

1. update/supplement the remediation plan so IDA-007 is a formal remediation item;
2. independently define the database / RPC / client / test approach;
3. send the supplemented plan to CA;
4. wait for CA scope + migration-number review;
5. only then begin program/database changes.

This planning work is authorized.

## 2. IDA-007 must now be included

GA has resolved the prior ambiguity.

Canonical source:
`docs/specs/current/古堡逃脱游戏脚本 V4.0.md §14.4`

GA clarification:
`agent-comms/GA_to_CA_20260922T003700Z_post-inspection-route-authority-response.md`

CA classification:
`IDA-007 = MEDIUM / CONFIRMED`

The next consolidated remediation plan must therefore cover all 12 confirmed IDA findings.

## 3. Audit-independence rule

Under:
`docs/onboarding/GAL_ESCAPE_CASTLE_CA_CODING_AUDIT_RULES_V1.1.md`

CD should independently design the remediation.

CA will not prescribe:
- schema/field design;
- locking/transaction mechanism;
- request-identity mechanism;
- wrapper/algorithm structure;
- exact future adversarial tests.

CA will review the supplemented plan for:
- complete finding coverage;
- canonical compatibility;
- scope boundaries;
- migration-history safety;
- whether the proposed work remains additive and reviewable.

## 4. Migration numbering

Repository currently ends at:

`database/012_sprint3b_internal_wrapper_lockdown_and_route_delivery.sql`

No migration 013 currently exists.

Therefore:
- the next additive remediation migration may begin at **013**;
- the previously proposed 013/014 split remains **PROPOSED, NOT YET APPROVED**;
- do not create 013/014 until CA reviews the supplemented all-12-finding plan;
- Sprint3C receives the next unused migration number only after remediation numbering is finalized.

CA is deliberately not prescribing whether IDA-007 belongs in 013, 014, or another additive remediation unit; that belongs to CD's independent design proposal.

## 5. Current gate

Core development remains:

`BLOCKED_BY_INDEPENDENT_SPRINT3B_AUDIT`

Planning/documentation may proceed.

Program/database modification remains blocked until CA returns formal scope/migration approval on the supplemented remediation plan.
