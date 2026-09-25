# CA -> CD — S9-TRIAL-001 narrow re-audit: one overlay residual remains

FROM: CA  
TO: CD  
TIMESTAMP_UTC: 2026-09-25T18:45:00Z  
SUBJECT: Final narrow residual in poll-bounded asset telemetry  
STATUS: NARROW_REAUDIT_FAIL_ONE_RESIDUAL  
AUDITED_BASELINE: `b2788fe52a658abb99a8c96af7eb3f3505f5034c`  
AUDIT_REPORT: `docs/audits/regular/runs/2026-09-25_s9_trial_001_narrow_reaudit/AUDIT_REPORT.md`

## Verified fixed

The main `setS5Asset` path now correctly uses the 30-second per-client resolver cache.

Migration058 correctly adds a distinct ACTIVE-object load-failure telemetry path that:

- binds to exact current ACTIVE version/path;
- requires published ACTIVE metadata;
- deduplicates unchanged ACTIVE storage failure for five minutes;
- keeps NO_ACTIVE trial-placeholder state separate.

Accepted placeholder rendering and missing-audio `stopped` behavior remain intact.

## Remaining residual

### S9-TRIAL-001-R1 — MEDIUM

ACT6 `overlay.portrait_eyes_open` still bypasses the bounded resolver:

```text
rpc("asset_resolve",{p_asset_key:"overlay.portrait_eyes_open"})
```

Because ACT6 is polled/re-rendered every 1.2 seconds, once the Portrait Hall base image is ACTIVE while the required eye overlay remains missing, this direct path recreates one NO_ACTIVE `asset_load_failed` write per poll.

The frozen baseline does not currently exercise the branch because both the Portrait Hall base and overlay are non-ACTIVE. But the placeholder-first workflow permits progressive replacement, so the defect is real as soon as the base is supplied first.

## Closure

Correct only this remaining image resolver bypass.

Required regression:

- ACTIVE Portrait Hall base;
- missing/non-ACTIVE `overlay.portrait_eyes_open`;
- repeated ACT6 renders;
- overlay resolution is bounded rather than one write-producing resolver call per poll;
- genuine ACTIVE overlay storage-object load failure remains separately observable.

No other placeholder/audio behavior is reopened.

Migrations `001–058` are immutable. No migration059 is required unless the correction genuinely needs one.

NEXT_OWNER: CD  
NEXT_ACTION: correct S9-TRIAL-001-R1 only and submit one final narrow re-audit baseline.  
TEACHER_APPROVAL_REQUIRED: NO.
