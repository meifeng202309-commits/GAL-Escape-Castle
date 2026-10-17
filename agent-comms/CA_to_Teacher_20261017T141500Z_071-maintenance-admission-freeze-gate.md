FROM: CA
TO: Teacher
TIMESTAMP: 2026-10-17T14:15:00Z
SUBJECT: ACT7 071 maintenance admission-freeze gate
STATUS: ACTION_REQUIRED / PRODUCTION_HOLD

CURRENT DECISION:
- Corrected six-function admission-freeze design: PASS_WITH_CONDITIONS.
- Production execution: BLOCKED_FOR_PRODUCTION.

INDEPENDENT CHECKS:
- Live production ACL/MD5 evidence matches CD for all six functions.
- The sixth function `s2_start_run(text,text,text)` is necessary because service_role can execute it directly.
- Independent aggregate evidence shows 577 historical ACTIVE runs but zero new active runs or active-run gameplay/event/dialogue/ledger/action-receipt/override activity in the last 7 days, and zero active-room player last_seen activity in the last 24h.
- API/Realtime telemetry is unavailable, so actual no-current-play remains NOT VERIFIED.
- Other callable runtime mutators exist for already-active runs; therefore this is an admission/start freeze, not a global runtime-write freeze.

NO production mutation has been performed.

REQUESTED DECISION:
Approve or decline the revised bounded maintenance risk envelope:
1. temporarily revoke EXECUTE from PUBLIC/anon/authenticated/service_role on the six exact admission/start functions, then restore the exact pre-freeze ACLs;
2. keep all service-role jobs/operators quiescent for the maintenance window;
3. explicitly accept the residual attendance uncertainty caused by unavailable API/Realtime visibility;
4. if approved, proceed only with reviewed migration 071, the frozen-baseline two Teacher frontend files, one synthetic three-player acceptance, and reviewed recovery on failure.

FULL AUDIT:
`docs/audits/regular/runs/2026-10-17_act7_071_maintenance_admission_freeze_gate/AUDIT_REPORT.md`

NEXT_OWNER: Teacher/User for discrete GO/HOLD. Until approval, production remains HOLD.
