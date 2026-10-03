# CA → GA — Critical review requested: manual acceptance readiness before blind-agent E2

FROM: CA
TO: GA
TIMESTAMP_UTC: 2026-10-03T10:34:00Z
SUBJECT: Critically review manual-acceptance readiness plan before CD deployment work
STATUS: REVIEW_REQUEST
NEXT_OWNER: GA

## 1. Teacher decision

Teacher wants to perform **human/manual acceptance first**, before the blind-agent E2-A exercise.

Teacher also explicitly directs:

- current placeholders remain untouched;
- do not redesign discussion timing now;
- do not start blind-agent project setup yet;
- do not notify CD to implement until GA and CA agree on the minimum manual-acceptance work package.

CA has drafted:

`docs/plans/MANUAL_ACCEPTANCE_READINESS_PLAN_V0.1.md`

## 2. Core proposal

The manual-acceptance preparation is intentionally narrow.

Primary objective:

> Put the already-Level2-PASS remediation frontend behind the real public classroom URLs, verify the public deployment, and run one Teacher + three human-controlled Player sessions end-to-end.

Key constraints:

- use the existing Level2/E1 remediation runtime;
- Supabase 059–068 is already deployed;
- avoid broad `main` / remediation reconciliation just to run the test;
- placeholders stay as-is;
- no new recovery mechanism;
- no Teacher Console cleanup;
- no E2 blind-agent mechanics in this work package.

## 3. Proposed work package

Please critically review these proposed steps:

1. **Public frontend deployment**
   - serve the remediation frontend through the public GitHub Pages classroom entry;
   - prefer the smallest-risk publish method;
   - CA currently prefers temporarily publishing Pages from `remediation/sprint9-structural-v1` rather than merging the diverged branch into `main`.

2. **Deployment identity freeze**
   - exact served commit/content;
   - Pages branch/folder;
   - Player/Teacher URLs;
   - Supabase identity;
   - migration ceiling 068;
   - known media state.

3. **Public-entry smoke test**
   - actual public Player/Teacher URLs;
   - disposable room;
   - 3 separate Player contexts;
   - formal start;
   - correct role-private ACT1;
   - Supabase reachability;
   - basic reconnect;
   - no obvious recurrence of closed lifecycle defects.

4. **Teacher recovery readiness**
   - verify existing deployed normal controls / runtime-group recovery / Emergency Override where applicable;
   - do not treat legacy `s1_advance_scene` as formal ACT recovery.

5. **Manual test topology**
   - 1 Teacher/Test Controller;
   - 3 independent Player browser contexts;
   - one shared formal run;
   - staggered joins;
   - no source/devtools/state manipulation during natural play.

6. **Minimal evidence protocol**
   - capture only material failures/confusions and Teacher interventions;
   - avoid burdening the live Teacher with exhaustive logging.

7. **Blocker rule**
   - first genuine forced semantic bypass ends the natural PASS claim;
   - if an existing authorized recovery restores a coherent state, the same run may continue diagnostically;
   - if no existing authorized recovery restores a coherent state, stop the run;
   - no live improvised DB/RPC mutation.

8. **Output**
   - exact build;
   - natural ACT1→ACT14 result;
   - defects/confusions;
   - interventions;
   - natural PASS / natural FAIL + diagnostic continuation / aborted-not-interpretable.

## 4. Explicit out-of-scope items

For this human acceptance preparation, CA proposes no change to:

- four current opening/ending placeholders;
- `shared.main_gate` placeholder-first state;
- discussion timeout semantics;
- ACT7 90s/15s mismatch;
- blind-agent prompts/projects;
- Agent Concurrency Precheck;
- Teacher Console production hardening;
- broad `main` reconciliation;
- new gameplay or recovery mechanisms.

## 5. CD scope if/when released

Teacher wants to conserve CD's remaining context budget.

Therefore, after GA/CA agreement, CD should receive only the bounded implementation task that genuinely requires CD:

- publish the tested remediation frontend to the public entry using the agreed low-risk method;
- record exact deployment identity;
- perform only deployment/smoke technical work needed to make the tested frontend publicly accessible.

GA should own the protocol/readiness review and can perform ordinary smoke/checklist operations that do not require CD implementation work.

## 6. Critical-review questions

Please review with a critical attitude and answer:

1. Is any step above unnecessary for the stated goal of **human/manual acceptance first**?
2. Is any essential precondition missing?
3. Is temporarily switching GitHub Pages source to the remediation branch actually the safest deployment method, or is there a safer bounded alternative?
4. Does the current branch divergence create any hidden deployment or rollback risk not captured here?
5. Is the smoke test sufficient to establish that the public deployment matches the Level2-tested runtime?
6. Should Teacher recovery readiness be checked before the real run, and if so what is the minimum non-contaminating check?
7. Are the proposed blocker/diagnostic-continuation rules appropriate for a human acceptance run?
8. Is any CD work listed above unnecessary and better handled by GA?
9. What exact rollback step should be prepared before switching the public frontend?
10. After review, please return a concrete corrected work package suitable for CA/GA agreement and subsequent CD release.

No implementation is authorized by this letter.

NEXT_OWNER = GA
NEXT_ACTION = critically review MANUAL_ACCEPTANCE_READINESS_PLAN_V0.1.md and return a corrected execution-ready work package; do not notify CD yet.
