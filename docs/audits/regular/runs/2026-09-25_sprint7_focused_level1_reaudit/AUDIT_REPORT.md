# Sprint 7 Teacher Console — Focused Level 1 Re-audit

Original Sprint7 baseline: `62cf2c363798462e90758aa5ba3116d435287fc2`  
Correction baseline: `1d95b18b244f5497ea6773d012adee34ed507c1b`  
Additive migration: `044_sprint7_focused_level1_corrections.sql`  
Decision: **FAIL / BLOCKED — FOUR FINDINGS CLOSED; ONE REMAINS OPEN**

## 1. Closure matrix

| Finding | Focused result | Disposition |
|---|---|---|
| S7-CA-001 MEDIUM | **FIXED_VERIFIED** | Structured Teacher locked-choice value/state now exists under the new GA canon. |
| S7-CA-002 MEDIUM | **FIXED_VERIFIED** | Legacy AUDIT debug writer delegates to the Sprint7 logged authority. |
| S7-CA-003 MEDIUM | **PARTIALLY_FIXED / OPEN** | Per-phase validity is fixed, but the durable Teacher intervention log still omits existing Teacher vote/time mutations, especially Sprint5 controls. |
| S7-CA-004 MEDIUM | **FIXED_VERIFIED** | NORMAL/AUDIT filename preview now matches V2.4 format. |
| S7-CA-005 MEDIUM | **FIXED_VERIFIED** | ACT12 submitted/waiting now uses authoritative `act12_tasks`. |

Sprint8 remains blocked.

## 2. S7-CA-001 — FIXED_VERIFIED

GA canonical commits now permit Teacher read-only visibility of already-submitted + LOCKED private choices in NORMAL/AUDIT, while player-to-player reveal isolation remains mandatory.

Migration044 adds an intentional structured projection:

- `locked_choice_value`
- `locked_choice_state`

For current private-choice phases it returns:
- actual submitted + LOCKED choice value;
- `LOCKED / NOT YET REVEALED TO PLAYERS`.

For unsubmitted players it returns:
- `locked_choice_value = null`;
- `locked_choice_state = WAITING`.

Teacher Console renders a dedicated “Locked choice” column.

The focused live E2E checks:
- a submitted GAL-A choice is structurally visible;
- GAL-B remains waiting/null;
- additional AUDIT debug remains a separate field.

Raw runtime-event details are therefore no longer the sole access path.

No player-facing reveal timing is changed.

**S7-CA-001 → FIXED_VERIFIED.**

## 3. S7-CA-002 — FIXED_VERIFIED

Migration044 replaces the effective legacy:

`s3b_audit_set_private_debug_view(...)`

with a delegating wrapper that calls:

`s7_set_audit_private_debug(...)`.

The legacy signature therefore no longer independently mutates:

`game_runs.audit_private_debug_view`.

It inherits:
- Teacher authentication;
- AUDIT-only enable rule;
- `teacher_audit_private_debug_changed` runtime event logging.

The focused live E2E invokes the legacy RPC and verifies the durable intervention count increases.

There is now one effective mutation authority for the AUDIT technical-debug flag.

**S7-CA-002 → FIXED_VERIFIED.**

## 4. S7-CA-003 — PARTIALLY_FIXED / OPEN

### A. Per-phase behavior validity — fixed

Migration044 replaces the whole-run validity count with:

`phase_behavior_validity`

grouped by:
- scene_id;
- phase_key;
- step_key;
- validity;
- event_count.

The focused live test verifies the current ACT1 private phase appears in the phase-identifiable validity projection.

This portion is closed.

### B. Durable Teacher intervention log — still incomplete

Migration044 creates:

`teacher_interventions`

from `runtime_events` where:

- `event_source='teacher_override'`; or
- event_type is `teacher_audit_private_debug_changed`; or
- event_type is `teacher_session_released`.

This is unbounded and therefore fixes the original arbitrary “latest 50 generic events” problem.

However it still does **not** represent all existing Teacher gameplay mutations that remain reachable from the current Teacher Console.

#### Sprint2 Teacher mutations

Current Teacher UI still invokes:

- `s2_open_vote`
- `s2_add_time`

These write events such as:

- `vote_opened_by_teacher`
- `teacher_added_time`

through `s2_log_event`.

But the effective `s2_log_event` classifies a null-actor event as:

`event_source='server'`

unless a separate Teacher override context applies.

The new `teacher_interventions` filter therefore excludes these explicit Teacher actions.

#### Sprint5 Teacher mutations

Current Teacher UI also invokes:

- `s5_teacher_open_vote`
- `s5_teacher_add_time`

when Sprint5 is active.

Their current effective definitions mutate `discussion_sessions` but do not append a runtime Teacher-intervention event at all.

Therefore these Teacher actions cannot appear in any runtime-events-based durable intervention projection.

### Why this remains a Sprint7 contract failure

Codex V2.4 Sprint7 explicitly requires a:

`teacher intervention log`.

The current implementation now has a durable projection, but not a complete intervention source.

A Teacher can change:
- voting state;
- discussion/vote deadline;

through live Teacher Console controls without those actions appearing in `teacher_interventions`.

This is not a presentation-only omission: the provenance source itself is incomplete for some current Teacher mutations.

### Why the focused tests miss it

The new focused live E2E validates:
- debug-toggle logging;
- phase-validity projection;
- filenames;
- locked-choice state.

It does not invoke and verify:
- generic Teacher Open Vote / Add Time;
- Sprint5 Teacher Open Vote / Add Time.

Thus green focused tests do not falsify this remaining gap.

### Closure condition

All effective Teacher actions that mutate canonical/runtime state through the current Teacher workflow must produce durable Teacher-intervention provenance that appears in the Sprint7 intervention history, including current vote/timing controls.

CA does not prescribe whether this is achieved by:
- making existing events explicitly Teacher-sourced;
- adding missing Teacher mutation events;
- or using an equivalent canonical provenance source.

## 5. S7-CA-004 — FIXED_VERIFIED

Migration044 now generates:

NORMAL:

`YYYY-MM-DD_HH-mm-ss_RUNID.json`

AUDIT:

`YYYY-MM-DD_HH-mm-ss_RUNID_audit.json`

using `run_started_at` and `run_id`.

The live E2E checks both NORMAL and AUDIT filename patterns.

The preview remains non-exporting:

- `game_completed=false`;
- `export_ready=false`;
- `enabled=false`.

Sprint8 finalization/export is therefore not crossed.

**S7-CA-004 → FIXED_VERIFIED.**

## 6. S7-CA-005 — FIXED_VERIFIED

Migration044 replaces the incorrect:

`act12_stations`

with authoritative:

`act12_tasks`

when deriving submitted/waiting from `s6_station_tasks`.

This now matches the Sprint6 station-task and ENGAGE authority.

**S7-CA-005 → FIXED_VERIFIED.**

## 7. Canonical Ownership Check

**PASS.**

The correction commit modifies:
- migration044;
- Teacher Console JS;
- Sprint7 tests.

It does not modify the protected canonical Game/Teacher Console semantics owned by GA.

The relevant canonical owner commits precede this consumer correction:

- `5d7d2b673140ca32ed01834145b661c9f88b0f75`
- `dd44e13ad1c0c925044ec315dc85abc69e969eb7`

The implementation consumes the new canon rather than rewriting it.

## 8. Adjacent regression review

### Teacher token/session recovery

Unchanged.

### Player-to-player unrevealed-choice isolation

No player runtime change is present in the correction interval.

### AUDIT debug semantics

Additional AUDIT debug remains:
- explicit;
- Teacher-authenticated;
- rejected in NORMAL when enabling;
- logged through the single effective writer.

### Sprint8 boundary

No:
- ACT14 finalization;
- completion flag;
- export-ready state;
- actual JSON/CSV export

is implemented.

### Closed Level3/Level2 fixes

No correction in 044 changes:
- Sprint5/Sprint6 automatic handoff;
- Sprint6 discussion ownership;
- Station B RLS;
- audio occurrence/consumption semantics;
- ACT6–13 event ledger.

## 9. Recurring Patterns A–F

| Pattern | Result | Evidence |
|---|---|---|
| A — local correctness / cross-module handoff | PASS for 001/005; one remaining cross-surface provenance gap in 003. |
| B — distributed failure | PASS for focused changes; no new retry-sensitive mutation added. |
| C — UI vs server rule | PASS for structured locked-choice view and AUDIT debug authority. |
| D — current state vs historical evidence | **FINDING** — some existing Teacher vote/timing mutations are not represented in the durable intervention history. |
| E — authority accretion | PASS for debug writer consolidation; remaining Teacher mutation surfaces need provenance convergence under 003. |
| F — self-confirming tests | **FINDING** — focused live test does not exercise existing Teacher vote/time mutation families that the intervention log claims to summarize. |

## 10. Gate disposition

**Sprint7 focused Level1 re-audit = FAIL / BLOCKED — one finding remains open.**

Closed:
- S7-CA-001
- S7-CA-002
- S7-CA-004
- S7-CA-005

Open:
- **S7-CA-003 MEDIUM — PARTIALLY_FIXED / OPEN**

Migration `044` is deployed history and must remain immutable.

Next unused migration = **045**.

Next owner: **CD**.

Authorized correction scope:
- close only the remaining Teacher-intervention provenance/log completeness portion of S7-CA-003;
- add directly adjacent regression/live evidence;
- preserve per-phase validity, all four closed Sprint7 corrections, existing Teacher auth/recovery, and closed Level3/Level2 fixes;
- no Sprint8 work.

After correction, submit another focused Sprint7 Level1 re-audit request.

Because the gate remains FAIL/BLOCKED, Sprint8 pre-approval forecast is not issued.
