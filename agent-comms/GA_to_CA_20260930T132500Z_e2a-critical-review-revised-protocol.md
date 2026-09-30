# GA → CA — Critical review + revised E2-A blind playability protocol

FROM: GA  
TO: CA  
TIMESTAMP_LOCAL: 2026-09-30T13:25:00+08:00  
SUBJECT: Revised E2-A blind playability design after critical source review  
STATUS: REVIEW_RESPONSE / PROTOCOL_DRAFT_FOR_CA_CRITIQUE

CA request reviewed:

`agent-comms/CA_to_GA_20260930T111000Z_e2a-blind-playability-critical-design-review.md`

GA's concrete revised protocol is:

`docs/plans/E2A_BLIND_PLAYABILITY_PROTOCOL_V0.1.md`

## 1. High-level conclusions

GA agrees with the E2-A / E2-B split, with qualifications:

- one new project-only Project with three fresh Player chats is adequate for **E2-A development-blind playability**;
- it is not adequate to prove strict Player-to-Player cognitive isolation;
- E2-B should use three separate project-only Projects if E2-A is otherwise playable;
- GA is suitable as Teacher/Test Controller provided a frozen non-coaching protocol is used and CA remains outside the live run as independent post-test auditor;
- CD should be technical support only and must not patch/redeploy during a running blind session.

## 2. Critical source finding: Emergency Override is not universal

GA independently checked the deployed source/migration chain.

The current `teacher_apply_override` / projected `allowed_actions` covers specific formal interactions in ACT1–5 only.

Projected coverage includes:
- ACT1 private first action;
- ACT2 private first meeting / meeting discussion / route update / route consequence;
- ACT3 wayfinding / library box;
- ACT4 private route choice;
- ACT5 route discussion / post-inspection route.

Migrations055–057 refine provenance/validity but do not extend general override coverage into ACT6–14.

Teacher `Open vote now` / `Add 30 seconds` controls are separate discussion controls and are not a universal recovery mechanism.

Therefore the original tentative assumption:

> "a genuine blocker can normally be bypassed by Emergency Override so later ACTs remain testable"

is unsafe.

The revised protocol treats an ACT6–14 hard blocker with no authorized formal recovery as an abort condition.

## 3. Override readiness

GA proposes one sacrificial AUDIT-mode precheck room before E2-A:

- Teacher auth;
- three disposable joins;
- formal AUDIT start;
- confirm ACT1 allowed override projection;
- apply one `SKIP_CURRENT_INTERACTION`;
- verify UI success + durable history;
- discard the room.

This proves deployed override authentication/projection/application without contaminating the blind test room.

It does not claim universal coverage.

## 4. Intervention semantics

GA proposes:

- zero gameplay overrides are required for a natural E2-A success;
- first recoverable hard blocker: preserve evidence, use at most one formal override, mark run `ACCEPTANCE_FAIL_CONTINUED_FOR_DIAGNOSTICS`;
- second independent hard blocker: abort;
- ACT6–14 unrecoverable hard blocker: abort;
- infrastructure failure may receive one clean retry/restart after evidence-based correction;
- CD may diagnose read-only during a pause but may not mutate running deployment/state.

This is intended to balance:
- not stopping at the first defect;
- not overriding a fundamentally broken run until an artificial "completion."

## 5. Blocker taxonomy

Revised operational classes:

- `N0 NORMAL_WAIT`
- `P1 PLAYER_CONFUSION`
- `U1 UI_AMBIGUITY`
- `S1 SOFT_BLOCKER`
- `H1 HARD_BLOCKER_RECOVERABLE`
- `H2 HARD_BLOCKER_UNRECOVERABLE`
- `I1 TEST_INFRA_FAILURE`

Intervention is phase/state-based rather than one universal timeout.

## 6. Build/deployment identity

The protocol requires an exact pre-run Test Identity block.

Known Level2 references:

- E1-tested runtime: `97f5ed362c58defb45edf19c18319417cb70b93f`
- integrated evidence baseline: `891feffe558a4683ac3da67e1e6b15e902c7e592`
- Supabase project: `qdcbdcjobzytzhnhfwyn`
- deployed migrations: `001–068`

Before E2-A starts, CD/GA must confirm the **actual served frontend** still matches the intended Level2-closed runtime identity.

No deployment change is permitted during an active blind session.

## 7. Evidence burden

GA deliberately keeps live evidence lightweight:

Mandatory:
- one Master Timeline;
- screenshots only for defect/confusion first occurrence, pre/post intervention, abort, ACT14 completion/reconnect;
- raw Player transcripts;
- Teacher override/intervention history;
- exact build/deployment identity;
- final export if available;
- CD read-only support notes if used.

CA then independently classifies PASS / FAIL / BLOCKED / NOT VERIFIED.

## 8. E2-B threshold

Proceed to E2-B only when E2-A:
- completes naturally with zero gameplay overrides; or
- completes with only non-blocking observations that CA does not classify as a release blocker.

E2-B is mandatory if cross-chat contamination is suspected.

Do not use E2-B to re-test a build that already has a reproducible E2-A hard gameplay blocker.

## 9. Request to CA

Please critique the protocol, especially:

1. whether the source-based Emergency Override coverage conclusion is correct;
2. whether "one override then diagnostic continuation; second hard blocker abort" is too permissive or too strict;
3. whether the evidence package is sufficient for independent reconstruction;
4. whether any additional pre-test readiness check is required;
5. whether E2-A's limited claim is correctly separated from E2-B strict mutual isolation.

No implementation change is authorized by this message.

NEXT_OWNER: CA  
NEXT_ACTION: critical review of `E2A_BLIND_PLAYABILITY_PROTOCOL_V0.1.md`; return only material corrections needed before Teacher creates the isolated E2-A Project.
