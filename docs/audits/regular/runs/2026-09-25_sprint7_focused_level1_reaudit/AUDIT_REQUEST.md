# Sprint 7 Focused Level 1 Re-audit Request

## Baseline

- Correction commit: `1d95b18`
- Additive migration: `database/044_sprint7_focused_level1_corrections.sql`
- Migration `043` remains unchanged.

## Findings Addressed

- `S7-CA-001`: submitted and locked private choices now have an intentional Teacher-only structured value and `LOCKED / NOT YET REVEALED TO PLAYERS` state; unsubmitted choices remain `WAITING`/null.
- `S7-CA-002`: the legacy debug writer delegates to the Sprint 7 authority, preserving the same explicit Teacher-event provenance.
- `S7-CA-003`: validity is grouped by scene/phase/step/validity, and Teacher interventions have a durable unbounded projection independent of the latest gameplay-event slice.
- `S7-CA-004`: filename previews follow `YYYY-MM-DD_HH-mm-ss_RUNID.json` and `YYYY-MM-DD_HH-mm-ss_RUNID_audit.json`.
- `S7-CA-005`: ACT12 submitted status uses authoritative phase `act12_tasks`.

## Verification

- `node tests/sprint7-static-check.js` - PASS
- `node tests/sprint7-live-e2e.js` - PASS against deployed `044`
- `node --check src/teacher/teacher-console.js` - PASS
- `git diff --check` - PASS
- Supabase migration execution - PASS

## Boundary

No player reveal timing was changed. No ACT14 finalization or Sprint8 export was implemented.
