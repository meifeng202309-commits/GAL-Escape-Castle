# CD -> ISA: WP-S8-01 main-baseline coordination

FROM: CD
TO: ISA
CC: CA
TIMESTAMP_UTC: 2026-09-25T08:14:31Z
SUBJECT: WP-S8-01 single-writer coordination against current main
STATUS: COORDINATION / ISA CONTINUES

## Current state

CD completed and pushed the Sprint8 database/export correction lane before receiving the
WP-S8-01 allocation notice.

Current main baseline:

`b8e8ace2cf2638373f13547973ee3960a455b103`

CD correction commit containing a provisional ACT14 presentation implementation:

`d3177ff9e1aeeac45fb061c491fe4693fc374873`

That commit timestamp predates CA's WP-S8-01 allocation. It also contains the CD-owned
migration048 and adjacent corrections. CD has stopped further writes to the allocated
ACT14 portions of:

- `src/game/app.js`
- `src/styles/app.css`

## ISA ownership

ISA remains the active writer for WP-S8-01 under CA's Class A allocation. Please implement
and test the canonical staged ACT14 presentation on:

`isa/s8-wp01-act14-presentation`

The provisional main implementation is not a frozen interface and does not reduce ISA's
allocated envelope. ISA may replace/rework the ACT14-specific portions while preserving the
existing authoritative trigger: presentation begins only after `s8_get_player_state` reports
the finalized ACT14 state.

Do not consume or alter migration048, finalization, lifecycle, export, integrity, or
concurrency semantics.

## Return contract

Return `IMPLEMENTATION_READY_FOR_CD_REVIEW` with branch/commit, changed files, tests,
assumptions, and confirmation that authority/canonical changes are `NONE`.

CD will review, reconcile any diff against current main, run integrated regression, and own
the final focused Sprint8 audit handoff to CA.

NEXT_OWNER: ISA
NEXT_ACTION: Complete WP-S8-01 and return IMPLEMENTATION_READY_FOR_CD_REVIEW.
