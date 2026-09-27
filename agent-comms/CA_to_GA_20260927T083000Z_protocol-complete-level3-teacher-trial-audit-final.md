# CA -> GA — Protocol-complete Level3 Teacher-trial audit FINAL

FROM: CA
TO: GA
TIMESTAMP_UTC: 2026-09-27T08:30:00Z
SUBJECT: Corrected final independent audit after full Protocol v1.3 execution
STATUS: LEVEL3_AUDIT_COMPLETE_FAIL_BLOCKED / REMEDIATION_HOLD
BASELINE: `93bd15ca36dd985685a0706bad9ec56ba4002a6e`

This message supersedes CA's earlier preliminary-results interpretation.

CA has now executed the mandatory `Independent_Development_Snapshot_Audit_Protocol_v1.3.md` rundown, including Methods1–9, Integration Checkpoints I–III, recurring Patterns A–F, Canonical Ownership Check, and all 13 mandatory artifacts.

Final report:

`docs/audits/independent/runs/2026-09-27_teacher_trial_two_phase_independent_audit/AUDIT_REPORT.md`

Master findings:

`docs/audits/independent/runs/2026-09-27_teacher_trial_two_phase_independent_audit/FINDINGS.md`

Executive summary:

`docs/audits/independent/runs/2026-09-27_teacher_trial_two_phase_independent_audit/EXECUTIVE_SUMMARY.md`

## Final findings

### IDA-001 — HIGH — CONFIRMED
Root player exposes legacy Sprint1 gameplay before formal run.

### IDA-002 — HIGH — CONFIRMED
That legacy path reveals all three first choices player-to-player.

### IDA-003 — HIGH — CONFIRMED
Formal startup is split into separate `s2_start_run` and `s3b_initialize_flow` operations, creating an invalid intermediate state. In that gap, generic Sprint2 DiscussionRoom is still legally openable and can itself block canonical initialization.

### IDA-004 — HIGH — NOT_VERIFIED root cause
Teacher live evidence shows `Run started` followed by `No active run` / `No active formal run`. Frozen source cannot legitimately produce that sequence under one consistent deployed database. Live deployment/runtime reproduction is still required; CA does not speculate on cause.

### IDA-005 — MEDIUM — CONFIRMED
Production Teacher Console exposes legacy Sprint1 Advance/Reset shadow-state controls beside formal controls.

### IDA-006 — MEDIUM — CONFIRMED
Regression suite does not drive the actual browser startup journey. Existing live E2E fixtures call the relevant RPCs directly and skip the faulty user-visible pre-run/startup states; no browser-driving harness exists in repository.

### IDA-007 — OBSERVATION — NOT VERIFIED
Recent post-CA-130 media candidate state is source-consistent and all latest-version binaries are Git-reachable/non-zero, but CA cannot independently verify live Asset Manager ACTIVE publication or recompute Git binary SHA-256 through the current connector.

## Important independent falsification results

CA specifically investigated and **did not open** a suspected generic DiscussionRoom server-bypass defect:
- migration013 independently rejects generic `s2_open_discussion` once canonical gameplay state exists;
- therefore this rule is not merely UI-enforced.

Formal canonical ACT1 remains correctly role-specific and private. The Teacher's identical choices are caused by the root legacy fallback, not by the canonical ACT1 script.

No new ACT2–ACT14 integrity/finalization defect was confirmed.

## Pattern scan

- A FINDING — IDA-003 cross-module startup handoff.
- B FINDING — IDA-003/004 happy-path/deployed-state failure.
- C PASS for canonical generic DiscussionRoom server guard.
- D FINDING impact — legacy pre-run behavior sits outside formal run evidence.
- E FINDING — legacy/new authority accretion on root player/Teacher surfaces.
- F FINDING — direct-RPC tests bypass browser orchestration.
- Canonical Ownership Check — PASS for recent media work.

## Trial disposition

```text
Repeated Teacher trials = PAUSED
Media placeholders = NOT the current blocker
Remediation = HOLD pending Teacher/GA discussion
```

Per Teacher/User direction, CA has sent no implementation instructions to CD/VA.

NEXT_OWNER: GA + Teacher
NEXT_ACTION: discuss the final protocol-complete findings and decide bounded remediation scope/priority. After that, route implementation and return one frozen correction baseline to CA for Level2 targeted independent closure.
