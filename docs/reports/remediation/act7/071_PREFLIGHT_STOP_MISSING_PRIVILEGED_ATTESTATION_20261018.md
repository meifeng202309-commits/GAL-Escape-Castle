# Migration 071 mandatory preflight STOP — privileged attestation absent

Status: `STOP_BEFORE_MUTATION / PRODUCTION_UNCHANGED`

Owner: CD

Date: 2026-10-18

Authority reviewed: CA-245 and `CA_to_CD_20261018T150000Z_071-teacher-conditional-approval-preflight.md`.

## Decision

CD stopped at the first mandatory operational gate. No ACL freeze, SQL/071 execution, Pages switch, fixture/RPC execution, environment authorization flag, synthetic creation, cleanup or record mutation occurred.

The Teacher response recorded by CA was: `批准，please proceed`. It approves the one-attempt scope conditionally, but it does not supply the separate evidence CA-244/245 requires before any write.

## Missing required evidence

1. No positive statement identifies every known external Supabase service-role key holder, job and privileged operator and confirms each is paused for the full maintenance interval.
2. No statement identifies unknown holders or unpausable automation, or positively states that none exist.
3. No exclusive maintenance interval with UTC start/end (or an equivalent bounded live window) is recorded.
4. No new explicit disposition accepts the residual absence of direct API gateway/Realtime observation for this attempt.
5. This active CD can serve as the technical coordinator, but uninterrupted coordinator availability cannot establish an exclusive window while external privileged actors/jobs remain unverified.

The clean technical snapshots from CD-108 cannot close these gaps. CA-245 explicitly prohibits inferring quiescence from idle sessions, absent Edge Functions/cron/Actions or repository-local script inactivity.

## Gates intentionally not advanced

Because the attestation gate failed first, CD did not begin a write-capable immediate preflight sequence, did not revoke any privilege and did not use the controlled fixture flags. The prior CD-108 catalog/Pages/Q0/activity data remains historical read-only preparation, not a current production-start PASS.

No production attempt commenced. CA must disposition the conditional authorization after the missing evidence is supplied; CD does not infer whether or how long it remains usable.

## Exact closure required before a new CD execution handoff

CA must record trusted Teacher/account-owner evidence that:

- lists every known service-role holder/job/operator and confirms all are paused for the whole exclusive window;
- identifies unknown/unpausable privileged activity or states none is known;
- defines the exclusive window and confirms no class/rehearsal or privileged parallel action;
- explicitly dispositions the API/Realtime visibility residual;
- names CD as uninterrupted coordinator through ACL restoration or complete rollback.

After that canonical evidence, CD must rerun every time-sensitive source/hash, catalog/ACL, Q0/activity, session/automation, Pages and rollback-readiness check immediately before any mutation. Any failure remains STOP.

NEXT_OWNER: CA — obtain and record the exact privileged-operator/exclusive-window evidence or retain production HOLD.
