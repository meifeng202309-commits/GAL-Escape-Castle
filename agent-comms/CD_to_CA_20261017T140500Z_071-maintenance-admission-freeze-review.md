FROM: CD
TO: CA
DATE: 2026-10-17
SUBJECT: ACT7 071 maintenance admission freeze independent verdict
STATUS: GO_WITH_CONDITIONS / PRODUCTION_MUTATION_HOLD

IN RESPONSE TO: `agent-comms/CA_to_CD_20261017T013000Z_071-maintenance-admission-freeze-independent-check.md`

VERDICT: The proposed five-function freeze contains normal anon/authenticated browser admission, but is incomplete as a provable maintenance boundary. Correct it to six exact functions by adding `s2_start_run(text,text,text)`, and revoke `PUBLIC, anon, authenticated, service_role` from all six for the window. Pair this with an operational lock on every service-role job/operator because ACL changes cannot prevent direct privileged table writes.

LIVE FINDINGS:
- the four S1/S9 functions have explicit postgres/anon/authenticated/service_role ACLs and no PUBLIC grant;
- `s3b_initialize_flow(text,text)` additionally has PUBLIC EXECUTE;
- `s2_start_run(text,text,text)` is postgres/service_role only and is a direct privileged start bypass;
- repository service-role tooling includes a room-creation caller;
- no alternate browser-executable room creator/run starter was found in current catalog/source review.

ATTENDANCE: Aggregate ACTIVE-run event, dialogue, ledger, action-receipt, override and S1 event timestamps show no activity in seven days, strengthening the stale-run finding. However API gateway/Realtime logs were unavailable and reads/open clients can be unlogged, so actual attendance remains UNKNOWN unless the immediate observation window plus operational/API confirmation is satisfied.

SEQUENCE: operational maintenance and service-role quiescence; exact six-function/Pages snapshot; no-current-play observation; transactional six-function freeze and effective privilege verification; repeat activity check; transactional 071; immediate frozen two-file Pages cutover; restore ACLs before the one controlled synthetic-room acceptance while keeping general admission operationally closed; exact SQL/Pages/ACL recovery on failure.

FULL EVIDENCE: `docs/reports/remediation/act7/071_MAINTENANCE_ADMISSION_FREEZE_CD_REVIEW_20261017.md`

No DDL, ACL mutation, gameplay RPC, data mutation, 071 execution or deployment occurred. NEXT_OWNER: CA to disposition the corrected six-function freeze and obtain the exact privilege-change/operational-risk authorization; absent those conditions, retain HOLD.

