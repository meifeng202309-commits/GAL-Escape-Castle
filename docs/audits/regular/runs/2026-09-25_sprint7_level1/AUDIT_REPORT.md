# Sprint 7 Teacher Console — Level 1 Audit

Baseline: `62cf2c363798462e90758aa5ba3116d435287fc2`  
Migration: `043_sprint7_teacher_console.sql`  
Scope: Sprint7 Teacher Console expansion only; Sprint8 ACT14/finalization/export excluded  
Decision: **FAIL / BLOCKED — FIVE FINDINGS**

## 1. Finding summary

| Finding | Severity | Status | Summary |
|---|---|---|---|
| S7-CA-001 | HIGH | OPEN | NORMAL/default-AUDIT privacy is bypassed through raw runtime event details even when `private_value` is hidden. |
| S7-CA-002 | MEDIUM | OPEN | Legacy AUDIT private-debug writer remains callable and can toggle the same flag without the Sprint7-required event log. |
| S7-CA-003 | MEDIUM | OPEN | Sprint7 observability contract is incomplete: behavior validity is global-only, not per-phase; intervention display is a generic last-50 event slice rather than a durable intervention log. |
| S7-CA-004 | MEDIUM | OPEN | Export filename preview violates the canonical NORMAL/AUDIT RUNID naming contract. |
| S7-CA-005 | MEDIUM | OPEN | ACT12 submitted/waiting projection checks a nonexistent `act12_stations` phase instead of the authoritative `act12_tasks` phase. |

Sprint8 remains unauthorized.

## 2. S7-CA-001 HIGH — private-choice leak through event projection

### Canonical requirement

V4.0 §32 requires:

- NORMAL: private choice content must never be visible before reveal;
- AUDIT: privileged private content is visible only after explicit `audit_private_debug_view=true`.

Sprint7 also claims default private-value suppression.

### Deterministic source proof

ACT1 private choice is durably logged as:

`event_type='act1_choice_locked'`

with:

`details = {'choice_id': <actual private choice>, ...}`.

Equivalent private-choice events exist for First Meeting and ACT4.

Migration043 correctly makes:

`players[].private_value = null`

unless:

`run_mode='audit' AND audit_private_debug_view=true`.

But the same `s7_get_teacher_console(...)` independently returns:

`events`

from the latest 50 raw `runtime_events`, including unfiltered:

`details`.

No phase privacy filter is applied to this event query.

Therefore immediately after a player locks a private choice, the Teacher can read the real choice from:

`events[].details.choice_id`

even when:
- run mode is NORMAL; or
- run mode is AUDIT but private debug has not been explicitly enabled.

The UI renders these events in the “Teacher interventions and validity” block through `JSON.stringify(...events...)`, so the leak is not merely an unused server field.

### Existing protection proves the intended rule

The effective pre-Sprint7 `s2_get_teacher_state` was hardened in migration014b to suppress runtime events whose phase is one of:

- `private_first_action`;
- `private_first_meeting`;
- `private_route_choice`;

unless the run is AUDIT and private debug is explicitly enabled.

Sprint7's new projection bypasses that existing protection by querying raw `runtime_events` again.

### Why current tests miss it

The Sprint7 live E2E checks only:

`players.every(p => p.private_value === null)`.

It does not assert that `events` is privacy-safe.

The AUDIT fixture even creates a real private ACT1 choice before reading console state, so the leak is present in the tested setup but is not inspected.

### Closure condition

Every Teacher-visible projection in NORMAL and default AUDIT must preserve the existing unrevealed-private-content boundary, including event/history/debug surfaces, not only the dedicated `private_value` field.

## 3. S7-CA-002 MEDIUM — duplicate private-debug writer bypasses logging

Sprint7 introduces:

`s7_set_audit_private_debug(...)`

which:
- requires Teacher authentication;
- rejects enabling in NORMAL;
- updates `game_runs.audit_private_debug_view`;
- appends `teacher_audit_private_debug_changed`.

However the older public RPC:

`s3b_audit_set_private_debug_view(...)`

remains executable at the final baseline.

It also:
- authenticates Teacher;
- requires AUDIT;
- mutates the same `audit_private_debug_view` flag;

but does **not** append the Sprint7 Teacher event log entry.

Thus the same privileged visibility state has two server-authoritative writers with different provenance semantics.

A direct/legacy caller can enable privileged private visibility without creating the audit event that Sprint7 and V4.0 require.

This is a Pattern E authority-accretion problem, not merely duplicate code.

### Closure condition

All effective server-authoritative paths that change privileged AUDIT private visibility must preserve the required explicit Teacher-event provenance. No alternate reachable writer may silently change the same authority state.

## 4. S7-CA-003 MEDIUM — per-phase validity / intervention log contract incomplete

Codex V2.4 Sprint7 explicitly requires:

- teacher intervention log;
- Override history;
- **per-phase behavior validity visibility**.

Migration043 returns:

`behavior_validity`

as:

`{ validity_value: total_count }`

grouped across the entire run.

It contains no scene/phase dimension, so the Teacher cannot determine which phase carries:
- valid;
- partial;
- invalid_teacher_override;
- missing_technical;
- other validity states.

This is not “per-phase behavior validity visibility.”

Separately, the operations projection calls its debug block “Teacher interventions and validity” but supplies:
- complete `override_history`;
- only the latest 50 generic `runtime_events`.

That latest-50 slice is not a durable Teacher intervention log: non-Teacher gameplay events can evict older Teacher interventions from the view.

### Closure condition

Sprint7 must expose behavior validity in a phase-identifiable form and provide a Teacher-intervention history whose semantics do not depend on an arbitrary latest-N slice of unrelated gameplay events.

## 5. S7-CA-004 MEDIUM — export filename preview is noncanonical

Sprint7 is allowed to expose export controls / filename preview while Sprint8 retains actual finalization/export authority.

Therefore the preview itself must match the canonical export identity contract.

V2.4 §15.1 requires:

NORMAL:

`YYYY-MM-DD_HH-mm-ss_RUNID.json`

AUDIT:

`YYYY-MM-DD_HH-mm-ss_RUNID_audit.json`

Migration043 currently returns:

`GAL_CASTLE_<ROOM_CODE>_<RUNID>.json`

for all modes.

It:
- uses room code as part of identity;
- omits the required timestamp;
- omits the AUDIT `_audit` suffix.

The export button being disabled does not cure an incorrect filename preview, because filename preview is itself Sprint7 scope.

### Closure condition

The displayed preview must follow the canonical NORMAL/AUDIT RUNID naming contract while remaining non-exporting until Sprint8.

## 6. S7-CA-005 MEDIUM — ACT12 submitted/waiting phase mismatch

Sprint7 builds each player's `submitted` state partly from phase-specific authoritative tables.

For Station tasks it checks:

`s6.phase_key='act12_stations'`.

The authoritative Sprint6 state machine uses:

`phase_key='act12_tasks'`.

The same `act12_tasks` value is enforced by the station-task/ENGAGE server RPCs.

Therefore during ACT12 station work, a player can complete their station task while Sprint7 continues to present them as `waiting`.

This is a direct Teacher Console state-projection error and a Pattern A cross-module naming mismatch.

### Closure condition

Submitted/waiting must derive from the actual authoritative phase/state names used by the current ACT1–13 mutation/reconnect model.

## 7. What passed

### Server authentication

Both new Sprint7 RPCs require existing Teacher token authentication through `s1_assert_teacher`.

Existing Teacher token/session recovery is not replaced.

### Sprint8 boundary

The new console does not:
- mark the run completed;
- set export ready;
- implement ACT14;
- perform JSON/CSV export.

`game_completed=false`, `export_ready=false`, `enabled=false` remain presentation-only Sprint7 values.

### Current act/scene/phase and major debug surfaces

The new projection materially adds:
- current act/scene/phase/step;
- route;
- countdown;
- presence;
- transcript;
- Pocket;
- Group Items;
- audio occurrence debug;
- Override history.

These are structurally aligned with Sprint7 scope aside from the findings above.

## 8. Canonical Ownership Check

**PASS.**

The implementation commit changes:
- migration043;
- Teacher Console JS/HTML;
- Sprint7 tests/audit request.

No protected GA/VA/Teacher canonical source is modified.

No canonical-owner violation is present.

## 9. Codex Recurring-Error Pattern Scan

| Pattern | Result | Evidence |
|---|---|---|
| A — local correctness / cross-module handoff | **FINDING** | S7-CA-005: Teacher projection uses `act12_stations` while authoritative runtime uses `act12_tasks`. |
| B — distributed failure | PASS | Sprint7 projection is primarily observational; no new retry-sensitive gameplay mutation besides debug toggle was introduced. |
| C — UI rule vs server rule | **FINDING** | S7-CA-001: UI/private field looks hidden, but server returns private choice through raw event details. |
| D — current state vs historical evidence | **FINDING** | S7-CA-003: per-phase validity and durable Teacher intervention history are not actually represented by the supplied summaries. |
| E — authority accretion | **FINDING** | S7-CA-002: old and new AUDIT private-debug writers coexist with different logging semantics. |
| F — self-confirming tests | **FINDING** | live test checks `private_value` only, not alternate event leak; static test asserts feature tokens, not per-phase validity/intervention completeness or canonical preview format. |

## 10. Evidence / verification boundary

CD reports:
- Sprint7 static PASS;
- Sprint7 live Supabase E2E PASS;
- JS syntax PASS;
- diff integrity PASS;
- desktop/mobile visual QA PASS.

CA accepts those as evidence of the paths they actually test.

They do not falsify the five findings above.

CA did not independently rerun the production live E2E or graphical visual QA in this audit; the findings are established by deterministic source/state-contract proof.

## 11. Gate disposition

**Sprint7 Level1 = FAIL / BLOCKED.**

Open findings:
- S7-CA-001 HIGH;
- S7-CA-002 MEDIUM;
- S7-CA-003 MEDIUM;
- S7-CA-004 MEDIUM;
- S7-CA-005 MEDIUM.

Migration `043` is deployed history and must remain immutable.

Next unused migration = **044**.

Next owner: **CD**.

Authorized correction scope:
- close S7-CA-001..005;
- add directly adjacent regression/live evidence;
- preserve existing Teacher token/session recovery;
- preserve all closed Level3/Level2 authority fixes;
- do not implement Sprint8/ACT14/final export.

After correction, submit a focused Sprint7 Level1 re-audit request.

Because this gate is FAIL/BLOCKED, no Sprint8 next-scope forecast is issued.
