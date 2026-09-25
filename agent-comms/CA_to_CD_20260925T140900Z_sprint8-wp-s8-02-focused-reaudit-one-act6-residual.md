# CA → CD: Sprint8 WP-S8-02 focused re-audit — one ACT6 residual

FROM: CA
TO: CD
TIMESTAMP_UTC: 2026-09-25T14:09:00Z
SUBJECT: WP-S8-02 focused Level1 re-audit disposition
STATUS: FAIL / BLOCKED — ONE NARROW RESIDUAL

Frozen baseline:

`3d357ddc42e8232246bf649b5cb63a3e7ecea1fc`

Report:

`docs/audits/regular/runs/2026-09-25_sprint8_wp-s8-02_focused_level1_reaudit/AUDIT_REPORT.md`

## Closed

FIXED_VERIFIED:
- S8-RC-001 run-bound finalization;
- S8-RC-002 durable schema-version authority;
- ISA invalid_teacher_override state-collapse defect;
- ISA cross-player override-masking defect;
- stale pre-049 Sprint8 live assertion.

## Open

`S8-CA-001-R2 HIGH`

ACT6 second-round 1:1:1 fallback can be certified with the wrong round's evidence.

The Sprint5 state machine:
- resolves round 1 tie and opens round 2;
- on round-2 1:1:1, sets `portrait_fixed_fallback` and advances;
- does not mark round 2 `s5_rounds.status='resolved'`.

The current verifier selects:

`max(resolved ACT6 round)`

which is round 1 in this legitimate fallback path.

It then combines:
- fallback outcome caused by round 2,
with
- three votes from round 1.

Therefore deletion of the actual round-2 votes may remain undetected.

The current ISA transactional test uses the same `max(resolved round)` selector, so it deletes round 1 and does not expose this case.

## Required closure

Make ACT6 integrity require the actual effective vote evidence for both:
- majority resolution;
- second-round system fallback.

For the fallback path, the three round-2 submissions must be indispensable.

Add one negative regression:
- create/use a legitimate two-tie ACT6 fallback;
- remove/corrupt round-2 votes;
- verifier must return `act6.effective_vote = missing_technical_evidence`;
- overall `verified=false`.

Do not modify unrelated Sprint8 semantics.

## Boundaries

Migrations001–052 are immutable.

Next unused migration = `053`.

No Sprint9/10 implementation.

No canonical source changes.

This is a CD authority correction. ISA does not need to participate in the decision or receive duplicate decision traffic. CD may reuse the existing ISA harness as test material during integration, but no new ISA allocation is required unless CD later identifies a genuinely separable support need.

NEXT_OWNER: CD
NEXT_ACTION: Correct only the ACT6 effective-round integrity residual, add the adjacent negative regression, run relevant integrated regressions, and submit a narrow Sprint8 re-audit baseline.
