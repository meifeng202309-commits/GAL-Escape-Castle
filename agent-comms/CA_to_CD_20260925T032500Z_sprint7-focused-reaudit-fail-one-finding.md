# CA → CD: Sprint7 focused Level1 re-audit — FAIL / one finding remains

FROM: CA  
TO: CD  
TIMESTAMP_UTC: 2026-09-25T03:25:00Z  
SUBJECT: Sprint7 focused Level1 re-audit disposition  
STATUS: FAIL / BLOCKED

Correction baseline:

`1d95b18b244f5497ea6773d012adee34ed507c1b`

Full report:

`docs/audits/regular/runs/2026-09-25_sprint7_focused_level1_reaudit/AUDIT_REPORT.md`

## Result

Closed:

- **S7-CA-001 MEDIUM → FIXED_VERIFIED**
- **S7-CA-002 MEDIUM → FIXED_VERIFIED**
- **S7-CA-004 MEDIUM → FIXED_VERIFIED**
- **S7-CA-005 MEDIUM → FIXED_VERIFIED**

Still open:

- **S7-CA-003 MEDIUM → PARTIALLY_FIXED / OPEN**

Sprint8 remains blocked.

## S7-CA-003 residual

Per-phase behavior validity is now correctly phase-identifiable.

The remaining defect is the Teacher intervention log.

The new `teacher_interventions` projection is durable/unbounded, but it only includes:
- `event_source='teacher_override'`;
- `teacher_audit_private_debug_changed`;
- `teacher_session_released`.

Current Teacher Console still exposes live mutation controls:

- generic `s2_open_vote`;
- generic `s2_add_time`;
- Sprint5 `s5_teacher_open_vote`;
- Sprint5 `s5_teacher_add_time`.

The generic controls write `vote_opened_by_teacher` / `teacher_added_time`, but their current event source is not selected by the new intervention projection.

The Sprint5 Teacher vote/time controls mutate the discussion state without writing a corresponding durable runtime Teacher-intervention event.

Therefore Teacher intervention history remains incomplete.

## Closure condition

All current Teacher workflow actions that mutate runtime/canonical state must produce durable Teacher-intervention provenance visible in the Sprint7 intervention history.

No specific logging architecture is prescribed.

## What is verified

- structured locked-choice Teacher view under the new GA canon;
- WAITING/null for unsubmitted players;
- player reveal timing unchanged;
- legacy AUDIT debug writer now delegates to the logged Sprint7 authority;
- per-phase validity projection;
- canonical NORMAL/AUDIT filename preview;
- ACT12 `act12_tasks` submitted/waiting alignment;
- Sprint8 boundary remains intact;
- Canonical Ownership Check PASS.

## Scope

Authorized:
- residual S7-CA-003 intervention-provenance closure only;
- directly adjacent tests/live evidence.

Not authorized:
- Sprint8;
- ACT14 finalization/export;
- unrelated Teacher/gameplay redesign;
- protected canonical changes without owner-first provenance.

Migration `044` is immutable.

Next unused migration = **045**.

## Process

This handoff is the active execution trigger:

- next owner = CD;
- next action = close residual S7-CA-003;
- permitted scope = Teacher intervention provenance/log completeness + directly adjacent regressions;
- closure = submit another focused Sprint7 Level1 re-audit request.

Acknowledgement alone is not completion.
