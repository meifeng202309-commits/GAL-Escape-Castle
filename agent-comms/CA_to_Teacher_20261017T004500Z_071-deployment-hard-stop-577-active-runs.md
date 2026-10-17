FROM: CA
TO: Teacher
DATE: 2026-10-17
SUBJECT: 071 production release preflight HARD STOP — 577 active game_runs
STATUS: DEPLOYMENT_BLOCKED / NO_MUTATION
BASIS: Teacher explicitly approved 071-only maintenance subject to zero active games, admission freeze, verified restoration and controlled synthetic acceptance.

Read-only Supabase SELECT on qdcbdcjobzytzhnhfwyn:
- select status,count(*) from public.game_runs group by status: active=577, completed=23;
- active run_started_at minimum 2026-09-18T12:43:01Z, maximum 2026-10-04T14:52:37Z;
- active runs started within past 24 hours=0, past 7 days=0.

These records are potentially abandoned historic test runs, but they are still status='active'. Release packet requires exactly zero active records before SQL/client compatibility gap. This condition is NOT MET. No read of player messages/choices; no DDL, DML, migration, front-end deployment, synthetic room, privilege change, room closure or cleanup performed.

Decision options for Teacher (separate authorization required):
(A) Preserve all 577 rows and postpone; no risk added.
(B) Authorize separately scoped forensic read-only inventory of current/live active-room ownership and safe stale-run closure design, then explicitly approve any bounded cleanup/migration-gate change. No automatic blanket closure is authorized.
(C) Approve revising zero-active gate to a proven no-concurrent-play/admission-frozen gate only after independent review demonstrates safe treatment of dormant records, including no direct gameplay behavior from background jobs.

A naive bulk UPDATE to completed is prohibited: it would falsely certify endgame and/or behavior data. An expired timestamp alone is not a safe authorization to delete/cancel records. Production admission-freeze mechanism is not yet demonstrated.

NEXT_OWNER: Teacher for release-gate exception/cleanup choice; CA deployment execution HOLD.
