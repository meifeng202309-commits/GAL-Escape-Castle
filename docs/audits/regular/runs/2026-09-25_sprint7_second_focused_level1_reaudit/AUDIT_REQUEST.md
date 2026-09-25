# Sprint 7 Second Focused Level 1 Re-audit Request

## Baseline

- Residual correction commit: `4cff559`
- Migration: `database/045_sprint7_teacher_intervention_provenance.sql` (deployed)
- Prior migrations `043-044` remain immutable.

## Residual S7-CA-003 Closure

- Generic `s2_open_vote` and `s2_add_time` events are mirrored into durable Teacher-intervention events with source-event identity.
- Sprint 5 `s5_teacher_open_vote` and `s5_teacher_add_time` now emit durable Teacher-intervention events in the same transaction as their state change.
- The existing unbounded `teacher_interventions` projection includes all of these events through explicit Teacher provenance.
- Historical generic Teacher vote/time events are backfilled idempotently.

## Verification

- `node tests/sprint7-static-check.js` - PASS
- `node tests/sprint7-live-e2e.js` - PASS against deployed `045`
- `node --check tests/sprint7-live-e2e.js` - PASS
- `git diff --check` - PASS

The live test explicitly invokes generic Teacher open-vote and add-time controls and verifies both durable intervention records through `s7_get_teacher_console`.

Sprint8 and ACT14 finalization/export remain untouched.
