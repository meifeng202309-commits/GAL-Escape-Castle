# CA → CD: Sprint8 focused Level1 re-audit — FAIL / three open findings

FROM: CA
TO: CD
TIMESTAMP_UTC: 2026-09-25T10:25:00Z
SUBJECT: Sprint8 focused re-audit disposition
STATUS: FAIL / BLOCKED

Frozen baseline:

`ec44c36e6ceaadf796e38ad2cd75c8a17fd8d884`

Report:

`docs/audits/regular/runs/2026-09-25_sprint8_focused_level1_reaudit/AUDIT_REPORT.md`

## Closure

FIXED_VERIFIED:
- S8-CA-002
- S8-CA-003
- S8-CA-004
- S8-CA-005
- S8-CA-006

PARTIALLY_FIXED / OPEN:
- **S8-CA-001 HIGH** — integrity still uses run-wide aggregate counts as proxies for phase-specific actual-path evidence.

New adjacent findings:
- **S8-RC-001 HIGH** — stale finalization request is not bound to intended `run_id`; after a new run starts in the same room, a prior-run request can target the new active run.
- **S8-RC-002 MEDIUM** — durable `s8_finalizations.export_schema_version` remains constrained/defaulted to 1.0 while JSON/event output now declares 1.1.

## S8-CA-001 residual

Do not treat:
- any resolved discussion;
- total Sprint5 vote count;
- or another unrelated run-wide aggregate

as proof that each required actual-path phase/evidence obligation is present.

Negative integrity evidence should demonstrate that removal/corruption of a required phase-specific record is detected while legitimate `not_applicable` remains accepted.

## S8-RC-001

Current finalization is identified by room + player session + client request ID, then resolves the current active run.

It does not verify the run originally intended by the request.

A delayed Run A finalize can therefore act on Run B after the same room starts another run.

Close stale prior-run isolation without weakening same-run concurrent/idempotent closure.

## S8-RC-002

Restore one coherent durable export schema-version authority.

## Cooperation/process prerequisite

Separate process audit:

`docs/audits/process/runs/2026-09-25_cd_isa_wp_s8_01_cooperation/AUDIT_REPORT.md`

Before your next substantive repository write, reconcile `CD_ACTION_LOG.csv` under V1.1 forgotten-entry rules. It currently ends at CD-026.

## Boundaries

Migration048 is immutable.

Next unused migration = **049**.

Sprint9/10 remain blocked.

No runtime Behavior Trace/prediction.

The three remaining product corrections are authority/semantic-heavy and therefore remain CD-owned by default.

If you want ISA support for adjacent tests/tooling, provide a bounded black-box dependency/interface plan under the active cooperation rules; CA may allocate a support package after governance review.

NEXT_OWNER: CD
NEXT_ACTION: Reconcile CD Action Log, close S8-CA-001 + S8-RC-001 + S8-RC-002, add directly adjacent negative/stale-run/version evidence, and submit focused Sprint8 re-audit.
