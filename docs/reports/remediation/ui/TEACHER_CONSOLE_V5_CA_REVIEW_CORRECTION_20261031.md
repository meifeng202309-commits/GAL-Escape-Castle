# Teacher Console V5 CA review correction

## Trigger

CA letter `CA_to_CD_20261031_v5_review_request.md` returned CD-218 for three checks: durable export-audit retention, accurate saved-file semantics, and browser evidence before deployment. The finding about retention was valid.

## Minimal retention correction

The initial migration074 source declared `s10_teacher_exports.run_id` as an FK with `ON DELETE CASCADE`. Guarded room reuse deletes an interrupted active `game_runs` row, so PostgreSQL would also delete the export audit row that authorized the cleanup.

Migration074 is unapplied and therefore remains editable source. The correction keeps `run_id uuid not null` as the durable source-run identifier but deliberately removes its FK. This is constrained by:

- all inserts are inside the authenticated SECURITY DEFINER export RPC;
- the audit table has RLS and no anon/authenticated table grants;
- the room FK remains, with a supporting room/export-time index;
- reset still requires an existing exact `(export_id, run_id)` pair before deleting the active run;
- reset never deletes from `s10_teacher_exports`;
- the post-reset room event retains `confirmed_export_id`, deleted run ID, Teacher attestation, and `backup_validated: false`.

This preserves the export audit after intentional active-run deletion without altering migrations 001–073 or introducing a second migration for an unapplied schema.

## Saved-file boundary

Saving two downloads is only a Teacher attestation. It does not prove that either file is complete, readable, safely stored, or restorable. The boundary is now explicit in four places:

- snapshot header: `local_file_confirmation_scope = teacher_attestation_only_not_backup_validation`;
- confirmation checkbox: saved both files, not verified complete/readable;
- destructive confirmation dialog;
- reset audit event and success status: `backup_validated = false`.

Snapshots remain `restorable: false`. Upload-and-resume remains out of scope.

## Browser and regression evidence

`tests/teacher-console-v5-browser.mjs` drives installed Chrome through raw DevTools Protocol and requires no Playwright dependency. It serves production source, mocks only RPC boundaries, injects one coded Start failure, and executes the V5 workflow.

Passed assertions:

- 3/3 joined enables Start; failed Start shows `[START_FAIL]` and recovers availability;
- successful Start shows Processing, then hides while active;
- current snapshot shows Processing and returns an exact export ID;
- saved-file attestation enables Clear only for that exact export/run pair;
- Clear releases Players to 0/3 and restores Start's normal disabled label;
- the UI states that saving does not verify completeness/readability;
- desktop upper and lower two-column geometry passes at 1366×768;
- whole-page responsive order and no horizontal overflow pass at 900×768.

Evidence:

- `docs/reports/remediation/ui/teacher-console-v5-browser/TEACHER_V5_BROWSER_EVIDENCE.json`
- `docs/reports/remediation/ui/teacher-console-v5-browser/teacher-v5-cdp-900x768.png`

The browser failure-path test exposed that the shared Supabase client discarded PostgREST `body.code`. `src/supabase/client.js` now attaches the service code, or `HTTP_<status>` when absent, to the thrown Error. Teacher Failed states can therefore display an actual code.

Static V5, Sprint1, Sprint2, Sprint3C, Package A, Sprint7, Sprint8, migration073 policy, Teacher-paced voting, JavaScript syntax, and diff checks pass. No migration, live RPC, database data, Storage, deployment, or real room changed.

## Release boundary

This remains source-only. CA must audit migration074 and the evidence before authorizing controlled apply, deployment, and live E2E.
