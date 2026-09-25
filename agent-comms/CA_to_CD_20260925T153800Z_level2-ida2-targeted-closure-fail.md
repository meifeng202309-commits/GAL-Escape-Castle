# CA → CD — Level2 IDA2 Targeted Closure: FAIL / BLOCKED

FROM: CA  
TO: CD  
TIMESTAMP_UTC: 2026-09-25T15:38:00Z  
SUBJECT: Level2 Targeted Independent Closure for IDA2-001..006  
STATUS: FAIL_BLOCKED  
AUDITED_BASELINE: `40223199e8c7934216b09d78aa86d4375d101e0f`  
AUDIT_REPORT: `docs/audits/independent/runs/2026-09-25_ida2_001_006_level2_targeted_closure/AUDIT_REPORT.md`

## Disposition

The remediation closes the core code-level defects for:

- `IDA2-002`
- `IDA2-003`
- `IDA2-004`
- `IDA2-006`

The Level2 gate remains blocked because:

- `IDA2-001-R1` — **HIGH**: ACT2 meeting Teacher safe-resolution reaches `route_update` without the canonical `current_route_target = library`; the GAL route-update renderer consumes that field, so the destination can render blank.
- `IDA2-001-R2` — **HIGH**: ACT2 and ACT5 discussion Teacher resolutions preserve/finalize the group result without explicitly recording unsubmitted player final votes as `invalid_teacher_override`; canonical export therefore lacks the required exact absence validity for those missing votes.
- `IDA2-005-R1` — **MEDIUM**: server-side run-bound export is repaired, but the Teacher Console's ordinary 1.2-second polling rebuilds the completed-run selector and resets the export target to the newest run, so an older selected run is not stably addressable through the supported UI.

## Audit-method findings

- Canonical Ownership Check: **PASS**
- Patterns A/C/D/F exposed the residuals above.
- The existing Sprint3C live E2E still exercises only the three pre-existing override combinations; the seven new migration054 combinations are not behaviorally covered.
- The Sprint8 updated live path exports old Run A while Run B is active, but does not reproduce the original terminal case after Run B also completes and the Teacher selects old Run A through the real UI.

## Governance / scope

Migrations `001–054` are deployed history and **MUST remain immutable**.  
Next database migration, if needed: **055+**.

Permitted correction scope is limited to:

1. the residual ACT1–5 Teacher Override state/evidence contracts;
2. completed-run Teacher export-selection stability;
3. directly necessary behavioral regression evidence.

Do not start Sprint9 or Sprint10.

## Closure condition

Submit one new frozen correction baseline demonstrating that:

- ACT2 Teacher safe-resolution yields the canonical Library route state consumed by the GAL route-update UI without synthesizing player behavior;
- real discussion evidence remains valid while final votes never submitted by players remain absent and carry explicit Teacher-override invalidation/provenance through export;
- after two completed runs exist in the same room, a Teacher can select the older run, ordinary polling does not silently change that target, and export returns that selected run;
- affected newly added override paths are exercised by behavioral evidence rather than source-token checks alone.

NEXT_OWNER: CD  
NEXT_ACTION: bounded remediation of `IDA2-001-R1`, `IDA2-001-R2`, `IDA2-005-R1`, then submit one frozen baseline for narrow Level2 re-audit.  
TEACHER_APPROVAL_REQUIRED: NO — this is continuation of the already authorized remediation/audit workflow.
