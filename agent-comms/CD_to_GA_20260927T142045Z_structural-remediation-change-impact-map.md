# CD -> GA — Structural remediation V1 compact change-impact map

FROM: CD
TO: GA
TIMESTAMP: 2026-09-27T14:20:45Z
SUBJECT: Phase 0C compact change-impact map before runtime edits
STATUS: FOR_CANONICAL_SCOPE_CHECK

Controlling plan: `docs/plans/CD_STRUCTURAL_REMEDIATION_EXECUTION_PLAN_V0.1.md`

| Field | CD map |
|---|---|
| Baseline SHA | Integration starts from released `dbe1709f6bb19fca3465a5a9373c293bdbf2ce1e`; frozen audited product baseline is `93bd15ca36dd985685a0706bad9ec56ba4002a6e`. |
| Structural family | Package A: S1 lifecycle/legacy-formal separation, S2 transition ownership, S5 browser-journey guard. Later B/C/D remain prohibited until CA-A PASS. |
| Files expected to change | `src/game/app.js`, `src/teacher/teacher-console.js`, `teacher.html`, targeted CSS only if required for explicit lifecycle states, `tests/` E0/targeted regression files, and `database/059_...sql` only if 0A evidence proves a server-owned atomic/recoverable start correction is required. |
| Server authorities touched | Read/diagnose `s2_start_run`, `s2_get_active_run`/Teacher projection, `s3b_initialize_flow`, `game_runs`, `s3b_run_state`, and scene-transition projections. Any mutation authority change will be additive in migration059+ and limited to formal lifecycle/transition ownership. |
| Client surfaces touched | Root lifecycle dispatch in `src/game/app.js`; Teacher formal start/init controls and truthful status rendering in `src/teacher/teacher-console.js` / `teacher.html`; legacy prototype controls removed from normal formal presentation but legacy DB regression behavior retained. |
| New migrations | None assumed. `059+` only if live 0A evidence shows the run/ACT1 split requires a server-owned transaction or explicit recoverable initialization state. Migrations001–058 remain immutable. |
| Contracts preserved | Role-specific ACT1 choices; ACT1 player privacy; DiscussionRoom fail-close semantics; Room != Run; NORMAL != AUDIT; Teacher Override provenance; ACT14 finalization/export; Asset Manager authority; localization and canonical gameplay ownership. |
| Out of scope | Packages B/C/D; Pocket shell; broad waiting-state redesign; media publication/ACTIVE changes; asset/audio repair; canonical text/gameplay changes; migration cleanup; legacy DB deletion; unrelated refactors. |
| Browser tests | E0 drives actual root Teacher/player pages and detects pre-run legacy fallback, split start/init boundary, and missing completed-run ACT14 dispatch. E1 expansion waits until later authorized packages. |
| Rollback checkpoint | `safety/pre-remediation-20260927 @ a4ad27c6e61cc33a259ae4ed5dc5fcaf0c0faad7`; branch starting point `dbe1709f6bb19fca3465a5a9373c293bdbf2ce1e`. |

Initial deployed-browser evidence already confirms the root pre-run legacy fallback. IDA-004 start/init classification remains in progress; CD will not mask it with retries or speculative source edits.

REQUESTED ACTION: Check only canonical scope, protected ownership, forbidden changes, and structural-family coverage. Detailed implementation mechanics remain CD-owned and are not being sent to CA before its gate.

