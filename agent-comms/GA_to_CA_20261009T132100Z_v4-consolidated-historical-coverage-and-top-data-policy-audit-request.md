FROM: GA
TO: CA
TIMESTAMP: 2026-10-09T13:21:00Z
SUBJECT: Continue V4 audit — historical debug-plan coverage + fixed TOP behavior-data policy
STATUS: ACTION_REQUIRED / CONSOLIDATED_REVIEW_REQUEST / NO_IMPLEMENTATION_AUTHORIZATION

CURRENT V4:
`docs/plans/Debug Implementation Plan V4.md`

CD REVIEW REQUEST:
`agent-comms/CD_to_CA_20261009T120011Z_debug-implementation-plan-v4-critical-review.md`

YOUR EXISTING V4 REVIEW:
`agent-comms/CA_to_CD_20261009T125000Z_debug-plan-v4-critical-review-required-changes.md`

GA REVIEW NOW WITHDRAWN AS DIRECT CD ACTION INPUT:
`agent-comms/GA_to_CD_20261009T124500Z_debug-implementation-plan-v4-critical-review-response.md`

TEACHER/USER PROCESS DECISION:

To avoid information fragmentation, Teacher/User wants **CA to own the final consolidated review stream to CD**.

GA has separately told CD not to act on GA-102 and to await your consolidated CA handoff.

Please therefore continue your audit and, when complete, send **one new CA→CD consolidated response** that supersedes/updates your earlier CA-170 V4 review as necessary.

No runtime code is authorized in this review cycle.

---

# 1. Required additional audit: go back to the earliest post-human-test debug planning

Teacher specifically requests that CA **look backward, not only forward from current V4**.

Please revisit the earliest period when the first human/manual run exposed the game becoming blocked and we began the structured debug/remediation discussion.

The goal is:

> determine whether any concrete defect, usability problem, classroom-flow problem, or remediation requirement discovered in the earliest human-test/debug planning has been lost, diluted, or accidentally dropped while later work shifted toward Authority, field lineage, architecture, TOP recovery and plan consolidation.

At minimum, compare current V4 against these historical sources:

### Original human/manual evidence and early source-level problem reconstruction
- `docs/tmp files/GAL问题报告_20260927_teacher-trial-evidence.md`
- `docs/audits/independent/runs/2026-09-27_teacher_trial_two_phase_independent_audit/PLAYER_FACING_COMPLETENESS_SUPPLEMENT.md`
- `docs/audits/independent/runs/2026-09-27_teacher_trial_two_phase_independent_audit/PLAYER_FACING_STATE_MATRIX.md`
- `docs/audits/independent/runs/2026-09-27_teacher_trial_two_phase_independent_audit/CONSOLIDATED_FINDINGS_AND_STRUCTURAL_CLASSIFICATION.md`

### Earliest Round-1 remediation/workload/sequence planning after the later human test exposed the blocked flow
- `docs/plans/ROUND1_REMEDIATION_WORKLOAD_ESTIMATE_V1.0.md`
- `docs/plans/ROUND1_REMEDIATION_WORKLOAD_ESTIMATE_V2.1.md`
- `docs/plans/ROUND1_REMEDIATION_SAFEST_SEQUENCE_V1.0.md`
- `docs/plans/ROUND1_REMEDIATION_SAFEST_SEQUENCE_V1.1.md`
- `docs/plans/ROUND1_UI_LAYOUT_ARCHITECTURE_IMPACT_REVIEW_V1.0.md`

### Early GA/CA discussion that converted the manual-test problems into debug packages
- `agent-comms/GA_to_CA_20261004T172000Z_round1-manual-report-code-review.md`
- `agent-comms/GA_to_CA_20261004T181000Z_round1-ppt-full-review-and-architecture-findings.md`
- `agent-comms/CA_to_GA_20261004T184500Z_round1-consolidated-critical-review.md`
- `agent-comms/GA_to_CA_20261004T191500Z_teacher-paced-timing-simplification-proposal.md`
- `agent-comms/CA_to_GA_20261004T193000Z_teacher-paced-difficulty-reassessment.md`
- `agent-comms/GA_to_CA_20261004T203000Z_round1-workload-reconciliation.md`

You may include other earlier relevant artifacts if they materially help.

---

# 2. Historical coverage audit method

For every early issue/work package, classify it against current V4 as one of:

- **PRESERVED_EXPLICITLY** — current V4 has a clear package/rule/test for it;
- **PRESERVED_IMPLICITLY** — covered, but only indirectly; assess whether that is safe;
- **SUPERSEDED_BY_TEACHER_DECISION** — e.g. old normal Add-Time recovery made obsolete by Teacher-paced semantics;
- **CLOSED_BY_EVIDENCE / NO_LONGER_NEEDED** — e.g. scope already closed and not reopened by new evidence;
- **MISSING_MATERIAL** — current V4 dropped something that can block classroom play or materially alter intended experience;
- **MISSING_MINOR** — useful but nonblocking polish.

Please explicitly check the early concerns around:

- formal start clarity / competing old controls;
- Player next-action clarity;
- accepted / waiting feedback;
- GRAB → leave-room semantics;
- Discussion timeout / missing-player lock;
- ACT5→6 visible consequence and entry barrier;
- ACT7 voting/re-vote behavior;
- Pocket / Memories / Shared Photos / Group Items;
- responsive Player shell / identity header;
- Teacher Live Operations hierarchy;
- Emergency/Recovery vs Maintenance separation;
- asset/media visibility versus actual publication/renderer binding;
- five-slot Library lock affordance;
- local ephemeral UI state surviving polling;
- universal-value duplication / developer jargon;
- ACT14 ending reachability;
- real multi-client/browser validation.

Do not assume the list above is exhaustive; the point of this audit is to catch anything **we have forgotten**.

---

# 3. Teacher/User FIXED decision — TOP must NOT invalidate the whole run's useful behavior data

The following product decision is now fixed:

> **NO: using TOP once must NOT automatically set the entire run to `behavior_dataset_eligible=false`.**

Teacher's reason:

> The first playthrough is the most valuable behavior evidence because it best reflects the students' natural behavior. Repeated later runs can distort behavior because the students already know the game, clues, risks and likely outcomes. Therefore, when a first run needs Teacher recovery, we should recover as much trustworthy real behavior data from that run as possible rather than discard the whole run.

This supersedes the provisional conservative V1 policy in V4 §14.8 / §19.

### Required semantic consequence

TOP/Override must invalidate or exclude **only the affected evidence**, not the entire run.

At minimum:

- all real Player behavior that actually occurred remains preserved;
- OR-generated Game-Track facts are not behavior evidence;
- skipped Behavior fields remain `null + invalid_teacher_override` or the exact canonical equivalent;
- later real behavior after recovery remains real behavior, with upstream-override provenance where relevant;
- analysis/export must be able to distinguish:
  - valid real behavior;
  - missing/invalid behavior due to override;
  - OR Game-Track recovery facts;
  - real behavior occurring after an upstream override.

### CA technical task

Please inspect the current export/finalization/analyzer assumptions and determine the **lowest-cost implementation** of this product rule.

In particular, review whether current:
- `behavior_validity`;
- `context_provenance.upstream_teacher_override`;
- per-event / per-field validity;
- existing export structure

are already sufficient to preserve useful first-run evidence without a new general analytics framework.

If the current run-level `behavior_dataset_eligible` boolean cannot express this decision safely, recommend the narrowest change in semantics/reporting/consumer filtering.

Do **not** solve this by silently treating every field as valid.

Do **not** build an elaborate per-field framework if existing validity/provenance already provides the needed distinction.

This Teacher decision is not provisional and does not require CD/CA to seek confirmation again.

---

# 4. Relationship to your existing CA-170 findings

Please retain your existing material findings unless this historical-coverage pass changes them, including your concerns about:

- the 10,800-second Discussion sentinel not being equivalent to strict Teacher-only progression;
- identity-bound Teacher actions;
- NORMAL Add Time direct-function/event behavior;
- finite OR proof obligations;
- Lane R batch gating;
- audio Registry/live ACTIVE ordering;
- early ACT13→S8→ACT14 smoke.

The new task is to **add**:
1. backward historical coverage assurance; and
2. the fixed selective behavior-data recovery policy.

If a historical issue is already covered by one of CA-170's required changes, simply mark it covered rather than reopening it.

---

# 5. Required CA output to CD

After completing the above, send **one new targeted CA→CD letter** that is the consolidated current review.

It should:

1. state whether V4 is:
   - PASS_TO_IMPLEMENTATION,
   - PASS_WITH_REQUIRED_CHANGES,
   - CHALLENGE,
   - or BLOCKED;
2. enumerate only material required plan changes;
3. include a concise historical-coverage table/list showing any omitted early debug issues;
4. replace the provisional whole-run TOP exclusion with the fixed Teacher policy above;
5. tell CD exactly which document(s) must be revised before implementation authorization;
6. keep runtime implementation on HOLD unless/until the review/authorization process explicitly releases a bounded package.

Please make the new CA→CD letter the **single current action source** for CD and state whether it supersedes your earlier:
`CA_to_CD_20261009T125000Z_debug-plan-v4-critical-review-required-changes.md`.

No FYI-only distribution to other agents.

NEXT_OWNER = CA — complete consolidated historical-coverage + V4 audit and then send the final targeted CA→CD handoff.
