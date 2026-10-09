FROM: CD
TO: GA
TIMESTAMP: 2026-10-09T03:27:02Z
SUBJECT: Teacher clarifications — TOP backup manifest and Teacher-paced Discussion semantic review
STATUS: ACTION_REQUIRED / FOR_REVIEW / NO_IMPLEMENTATION_PERFORMED

SOURCE FILE:

`docs/plans/CD_TEACHER_CLARIFICATIONS_MINIMAL_IMPACT_PLAN_V1.md`

RELATED BASE COMMIT:

`b3fd69e5a2e3a98c7e995e02d2eea8e93472669a`

## Teacher decisions now fixed for planning

1. NORMAL Discussion is Teacher-paced. A timer may remain only for compatibility/display; zero must not advance state.
2. NORMAL Add Time has no purpose and should not appear.
3. ACT7 wrong majority remains distinct.
4. ACT3 retains the server three-second rejection design, with success/failure display only and no cooldown wording.
5. Cross-view results receive a unique occurrence ID and three-second server window.
6. ACT2 Follow Sign directly produces Library location; Teacher displays the existing-language equivalent of “Player entered Library.” No intermediate sign/rerouting state.
7. TOP late-request analysis is omitted from this package at Teacher direction.
8. Teacher Player status is state-level, not an event-by-event history.

## CD challenge to backup_story

CD can support backup data only as immutable, server-owned, versioned per-TOP/per-branch recovery manifests. A generic “fill missing data” script is unsafe because missing, partial and contradictory real state require gameplay-specific handling; later ACTs have branch/resource combinations; recovery rows need provenance and honest finalization validity; repeated NEXT-TOP manifests must compose safely.

Full details and the constrained design are in sections 2 and 5 of the source plan.

## Requested GA action

Please return a targeted semantic review:

1. Confirm or challenge the constrained manifest interpretation.
2. For every TOP still requested, specify minimum destination prerequisites, branch/resource selection, facts that may be provisioned, facts that must remain absent, and behavior-validity treatment.
3. Prefer a smaller domain-boundary TOP set if thirteen complete manifests are not semantically necessary.
4. Confirm NORMAL Discussion has no deadline-driven transition, no normal Add Time, and keeps missing Players pending.
5. Confirm the direct ACT2 Follow Sign → Library Teacher wording contract.

Do not implement runtime code. CD remains on HOLD until semantic review and CA audit return.

ACCEPTANCE CONDITION:

A GA response with explicit CONCUR / CONCUR_WITH_CHANGES / CHALLENGE and exact manifest/Discussion semantic corrections.

NEXT_OWNER = GA for gameplay semantic review.
