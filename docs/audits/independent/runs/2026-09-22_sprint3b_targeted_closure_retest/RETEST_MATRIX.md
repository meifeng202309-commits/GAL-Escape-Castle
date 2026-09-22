# Sprint3B Targeted Closure Re-test Matrix

Baseline: `7046812061de6223b5b442859920c96759b89a52`

| Finding | Severity | Re-test result | Independent CA basis |
|---|---:|---|---|
| IDA-005 | HIGH | FIXED_VERIFIED | Final `s3b_initialize_flow` locks the active run and rejects initialization while any open generic discussion exists. Final `s2_open_discussion` also locks the same active run and rejects once canonical scene state exists. The shared run lock closes the race in both orderings: generic-open first ⇒ init rejects; init first ⇒ later generic-open rejects. CD live suite also exercises pre-init carryover rejection. |
| IDA-012 | HIGH | FIXED_VERIFIED | Migration 014b captures source scene/phase/step and appends the player action event before delegating the state mutation. The action event and delegated mutation share one DB transaction, so a rejected mutation rolls back the provisional event. A successful transition therefore leaves the causal player action before `scene_transition` and preserves source context. Public wrappers acquire the active-run lock, serializing the relevant player transition boundaries. CD live suite checks ACT1 third-player causal ordering/context. |
| RCA-001 | MEDIUM | FIXED_VERIFIED | Migration 013 at correction baseline has the exact same blob SHA as the original deployed remediation commit `33e3169...`: `71e865487b02d8f24e205a9f34c5599e82217b6c`. The post-deployment reconnect fix remains additive in 014a; new closure work is additive in 014b. Repository clean replay now matches the deployment sequence. |
| RCA-002 | HIGH | FIXED_VERIFIED | Final `s2_get_teacher_state` server-filters events whose phase is private (`private_first_action`, `private_first_meeting`, `private_route_choice`). Private events are returned only when `run_mode='audit'` AND `audit_private_debug_view=true`. The only RPC that changes that flag rejects NORMAL runs. CD live suite checks NORMAL filtering and explicit AUDIT opt-in. |

## Adjacent recurring-error scan

### Pattern A — cross-module handoff
PASS for this correction slice. IDA-005 now shares the same run-row serialization boundary on both generic discussion creation and canonical initialization. IDA-012 action→transition causality is represented inside one transaction.

### Pattern B — stale/retry/concurrency
PASS for this correction slice. The critical IDA-005 race has deterministic two-order serialization. Rejected action replays do not leave provisional evidence because event insert and delegated rejection roll back together.

### Pattern C — UI rule vs server invariant
PASS. Generic-discussion carryover prevention and Teacher private-event filtering are server-side RPC rules, not Teacher UI-only behavior.

### Pattern D — current state vs historical evidence
PASS for the previously open IDA-012 boundary. Player action context is captured before transition and persisted append-only with explicit source scene/phase/step.

### Pattern E — authority accretion / legacy reachability
PASS for the four-blocker scope. Migration 013 is restored rather than silently rewritten; 014a/014b carry later authority changes additively.

### Pattern F — self-confirming tests
PASS with evidence limitation recorded. CA did not accept CD's test result alone: closure is supported by independent source/control-flow reconstruction. CD's targeted 15/15 live suite is supporting behavioral evidence. CA did not independently execute the Supabase live suite in this environment.

## Residual NOT VERIFIED boundaries

These do not block the Sprint3B remediation closure gate:
- CA did not independently execute the deployed Supabase live suite during this re-test;
- physical three-student + Teacher simultaneous browser/device UX remains NOT VERIFIED;
- final export / ACT6–14 / release-candidate behavior remains future scope.
