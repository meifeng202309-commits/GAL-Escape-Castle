# CA → CD: Sprint7 Level1 Audit — FAIL / five findings

FROM: CA  
TO: CD  
TIMESTAMP_UTC: 2026-09-25T01:15:00Z  
SUBJECT: Sprint7 Teacher Console Level1 audit disposition  
STATUS: FAIL / BLOCKED

Frozen baseline:

`62cf2c363798462e90758aa5ba3116d435287fc2`

Full report:

`docs/audits/regular/runs/2026-09-25_sprint7_level1/AUDIT_REPORT.md`

## Decision

**Sprint7 Level1 = FAIL / BLOCKED.**

Open findings:

- **S7-CA-001 HIGH** — NORMAL/default-AUDIT private-choice leak through raw `runtime_events.details`.
- **S7-CA-002 MEDIUM** — legacy AUDIT private-debug writer can change the same privileged flag without Sprint7 event logging.
- **S7-CA-003 MEDIUM** — per-phase behavior-validity visibility and durable Teacher intervention log are incomplete.
- **S7-CA-004 MEDIUM** — export filename preview violates canonical NORMAL/AUDIT naming.
- **S7-CA-005 MEDIUM** — ACT12 submitted/waiting projection checks `act12_stations` instead of authoritative `act12_tasks`.

Sprint8 remains unauthorized.

## S7-CA-001

Hiding `players[].private_value` is insufficient.

ACT1 private choice events store the real `choice_id` in `runtime_events.details`.

The new Sprint7 server projection returns the latest 50 raw event details without the privacy filter already present in the effective pre-Sprint7 Teacher-state path.

The UI then renders those details.

Therefore NORMAL and default AUDIT can expose an unrevealed private choice despite `private_value=null`.

This must be closed at every Teacher-visible server projection, not just one UI field.

## S7-CA-002

`s7_set_audit_private_debug` logs the privileged debug toggle.

The older executable `s3b_audit_set_private_debug_view` still mutates the same `game_runs.audit_private_debug_view` flag without that event.

One privileged state currently has two effective writers with different provenance semantics.

All effective mutation paths for this privileged visibility must preserve the required Teacher-event trace.

## S7-CA-003

Sprint7 requires:
- teacher intervention log;
- Override history;
- per-phase behavior validity visibility.

Current `behavior_validity` is only a whole-run count grouped by validity value.

The displayed intervention block uses complete override history plus only the latest 50 generic runtime events; unrelated gameplay can evict older Teacher interventions.

Provide phase-identifiable validity and a durable intervention-history view.

## S7-CA-004

Canonical filename preview must match V2.4:

NORMAL:
`YYYY-MM-DD_HH-mm-ss_RUNID.json`

AUDIT:
`YYYY-MM-DD_HH-mm-ss_RUNID_audit.json`

Current preview:
`GAL_CASTLE_<ROOM>_<RUNID>.json`

The button may remain disabled until Sprint8, but the Sprint7 preview contract itself must be canonical.

## S7-CA-005

Authoritative Sprint6 station phase is:

`act12_tasks`

Sprint7 submitted/waiting projection checks:

`act12_stations`

so completed station tasks can still appear as waiting.

Align the projection with the authoritative runtime state.

## What passed

- existing Teacher token auth/recovery was preserved;
- Sprint8 completion/export was not implemented;
- major Sprint7 observation surfaces are present;
- Canonical Ownership Check PASS;
- no protected canonical source changed.

## Correction boundary

Authorized:
- close S7-CA-001..005;
- directly adjacent tests/live evidence;
- additive DB correction if needed.

Not authorized:
- Sprint8;
- ACT14 finalization/export;
- unrelated gameplay redesign;
- protected canonical edits without owner-first provenance.

Migration `043` is deployed history and immutable.

Next unused migration = **044**.

## Process

This handoff is the active execution trigger:

- next owner = CD;
- next action = close S7-CA-001..005;
- permitted scope = those findings + directly adjacent regressions;
- closure = submit focused Sprint7 Level1 re-audit request.

Acknowledgement alone is not completion.
