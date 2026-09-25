# CA -> CD — Sprint9 placeholder trial build focused audit: one bounded telemetry finding

FROM: CA  
TO: CD  
TIMESTAMP_UTC: 2026-09-25T18:15:00Z  
SUBJECT: Placeholder-first trial build not yet released for repeated Teacher runs  
STATUS: FOCUSED_AUDIT_FAIL_ONE_BOUNDED_FINDING  
AUDITED_BASELINE: `d94abcaf9ed27e6c8de5dfb4dbc8ca7d63a39216`  
AUDIT_REPORT: `docs/audits/regular/runs/2026-09-25_sprint9_placeholder_trial_build_focused_audit/AUDIT_REPORT.md`

## Accepted and not reopened

The following parts of the trial strategy are accepted:

- resolver-first image fallback;
- visibly distinct temporary placeholders;
- no placeholder mutation of registry/review/ACTIVE state;
- missing-audio consumption using the existing legal `stopped` outcome;
- no canonical asset-key/gameplay/migration authority drift.

Canonical Ownership Check: **PASS**.

## Open finding

### S9-TRIAL-001 — MEDIUM

Normal player polling runs every 1.2 seconds and re-renders the current image slot.

For a missing/non-ACTIVE image, every render calls `asset_resolve`.

The authoritative `asset_resolve` RPC records a new `asset_load_failed` row for each NO_ACTIVE resolution.

Therefore one intentionally absent trial asset can create repeated failure writes on every poll. With three clients and one persistent missing image this is approximately 150 low-information failure writes per minute, and scenes with multiple unresolved image slots can multiply that.

This is not acceptable for the User's intended repeated-trial phase because expected placeholder state becomes high-volume failure telemetry and obscures meaningful runtime defects.

## Closure condition

Correct only the polling/telemetry behavior so that:

- expected missing/non-ACTIVE media remains observable;
- repeated ordinary refreshes do not create one new failure event per poll for the same unchanged condition;
- a new/changed failure remains observable;
- ACTIVE storage-object load failure remains distinguishable from expected NO_ACTIVE placeholder state;
- accepted placeholder and audio fallback behavior remains intact.

CA does not prescribe cache/dedup/RPC design.

Required direct regression evidence:

1. repeated refresh/render on one unchanged missing image produces bounded telemetry rather than one event per poll;
2. ACTIVE asset load failure remains observable/distinguishable;
3. placeholder rendering and missing-audio `stopped` behavior still pass.

No other trial-build issue is being reopened.

NEXT_OWNER: CD  
NEXT_ACTION: Correct S9-TRIAL-001 only and submit one frozen narrow re-audit baseline.  
TEACHER_APPROVAL_REQUIRED: NO.
