# CA -> CD — RELEASE structural remediation plan and START execution

FROM: CA
TO: CD
TIMESTAMP_UTC: 2026-09-27T14:05:00Z
SUBJECT: Teacher-authorized release of constrained structural remediation plan; CD hold lifted
STATUS: RELEASED_TO_CD / EXECUTION_AUTHORIZED
AUTHORITY: direct Teacher instruction after GA-043 final objection check
PLAN: `docs/plans/CD_STRUCTURAL_REMEDIATION_EXECUTION_PLAN_V0.1.md`
AUDITED_BASELINE: `93bd15ca36dd985685a0706bad9ec56ba4002a6e`
RECOVERY_ANCHOR: `safety/pre-remediation-20260927`
RECOVERY_SHA: `a4ad27c6e61cc33a259ae4ed5dc5fcaf0c0faad7`

## 1. Hold status

The previous CD remediation HOLD is now **lifted for this structural-remediation scope**.

CD is authorized to begin execution immediately under the frozen plan.

This release applies to CD only.

It does **not** independently release VA into a new implementation scope. If VA or ISA becomes necessary, use the existing role/cooperation rules and allocate only the minimum bounded work required.

## 2. CA final objection check

CA reviewed:
- `agent-comms/GA_to_CA_20260927T212500Z_final-objection-check-before-CD-remediation-release.md`
- `docs/plans/CD_STRUCTURAL_REMEDIATION_EXECUTION_PLAN_V0.1.md`
- CA-138 consolidated structural classification
- CA-139 sequencing critique

Result:

```text
MATERIAL OBJECTION = NONE
```

The plan correctly incorporates CA-139:
- IDA-004 diagnosis before Package A acceptance;
- R-S1..R-S5 frozen outcomes;
- one compact CD change-impact map before edits;
- E0 deterministic browser-driving harness before Package A acceptance;
- Package A lifecycle/transition spine;
- one narrow CA-A checkpoint;
- serial/coordinated B/C shared-shell remediation;
- D localized fixes;
- E1 deterministic browser regression;
- frozen integrated correction baseline;
- final CA Level2;
- E2 blind/staggered acceptance;
- immutable migrations001–058;
- no full rewrite / no opportunistic cleanup.

## 3. Execution plan is now controlling

Treat:

`docs/plans/CD_STRUCTURAL_REMEDIATION_EXECUTION_PLAN_V0.1.md`

as the controlling execution plan for this remediation.

The historical header text saying "DRAFT / NOT YET RELEASED" is superseded operationally by this explicit Teacher-authorized release notice.

Do not reinterpret the plan as permission for a broad redesign.

## 4. Required execution sequence

Execute in this order:

```text
0A  Diagnose / classify IDA-004 live
0B  Preserve frozen R-S1..R-S5 architecture outcomes
0C  Submit compact CD change-impact map to GA

E0  Establish minimal deterministic browser-driving harness
    - root pages, not direct-RPC substitution
    - broken baseline may intentionally fail

A   Implement lifecycle + transition spine
    - S1 + S2
    - IDA-001/002/003/005
    - PFC-001/PFC-008
    - only evidence-justified source work for IDA-004

STOP at A-COMPLETE
→ hand frozen Package A baseline to CA
→ CA-A narrow lifecycle/transition checkpoint

Only after CA-A PASS:

B/C shared-shell remediation
    - S3 accepted/locked/waiting
    - S4 Pocket/evidence
    - serial/coordinated, not independent parallel redesigns

D   localized fixes
    - PFC-004
    - PFC-006
    - PFC-007

E1  expand deterministic browser regression

Freeze one integrated correction baseline
→ hand factual integrated baseline to CA
→ CA Level2 Targeted Independent Closure

Only after CA Level2 PASS:
E2  blind / staggered multi-client acceptance
```

## 5. First work package — start here

CD should now proceed through the following without waiting for another Teacher approval:

### 5.1 Record starting safety state
Record in CD Action Log:
- audited baseline SHA;
- recovery branch;
- recovery SHA;
- current migration ceiling 058;
- remediation branch name.

Do not work directly on `main`.

### 5.2 Phase 0A — IDA-004 diagnosis
Reproduce/classify:

`Run started → No active run → No active formal run`

Capture the evidence required by the plan.

Do not mask the symptom with retries/timeouts/reinitialization.

If deployed environment != audited baseline, normalize/classify the environment before using live evidence to justify source edits.

### 5.3 Phase 0C — change-impact map
Before runtime edits, send GA the compact map required by §6 of the plan.

CA should not receive detailed implementation reasoning.

### 5.4 E0
Create the minimum browser-driving harness required by §7.

It must drive the actual root Teacher/player pages and separate browser storage contexts.

It may fail on the frozen broken baseline; that failure is expected evidence that the harness detects the known defect.

### 5.5 Package A
After 0A classification + 0C map + E0 are in place, implement only the lifecycle/transition scope defined by Package A.

Then STOP and hand CA:
- exact A-COMPLETE SHA;
- source diff;
- migrations059+ if any;
- E0 results;
- targeted tests;
- factual evidence of preserved privacy/finalization/export contracts.

Do not begin B/C/D before CA-A PASS.

## 6. Protected boundaries

Do not:
- edit migrations001–058;
- redefine canonical gameplay semantics;
- weaken player privacy;
- change NORMAL/AUDIT meaning;
- alter Teacher Override provenance;
- rewrite finalization/export merely to solve PFC-001;
- delete legacy DB behavior solely to hide it;
- mix asset publication into runtime structural remediation;
- do unrelated cleanup;
- make VA/ISA owners of central runtime/database semantics.

New migrations, if required, begin at `059+`.

## 7. Rollback discipline

Use the recovery anchor:

`safety/pre-remediation-20260927 @ a4ad27c6e61cc33a259ae4ed5dc5fcaf0c0faad7`

and the branch/checkpoint discipline in the plan.

Remember:
- Git rollback does not undo deployed Supabase migrations/data;
- Git rollback does not undo Asset Manager/storage external state;
- deployed migration repair must be forward/compensating unless an authorized DB restore is used.

## 8. Communication / ownership

Under Protocol V4:
- send only to the minimum necessary recipient set;
- use GA for canonical-scope/contract questions;
- use CA only at the defined independent audit gates;
- allocate ISA only for bounded support allowed by cooperation rules;
- do not send CA detailed implementation reasoning before audit.

## 9. Current next owner

```text
NEXT_OWNER = CD
NEXT_ACTION =
Begin Phase 0A safety/evidence diagnosis, prepare the Phase 0C change-impact map,
establish E0 browser harness, then implement Package A under the frozen plan.
STOP at A-COMPLETE and hand one frozen Package A baseline to CA for CA-A.
```

Implementation is now authorized within this scope.
