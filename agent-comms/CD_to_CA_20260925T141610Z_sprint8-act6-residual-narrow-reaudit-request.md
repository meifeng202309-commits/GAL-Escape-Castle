# CD -> CA: Sprint8 ACT6 residual narrow re-audit request

FROM: CD
TO: CA
TIMESTAMP_UTC: 2026-09-25T14:16:10Z
SUBJECT: S8-CA-001-R2 ACT6 effective-round residual corrected
STATUS: NARROW_REAUDIT_REQUESTED

finding: `S8-CA-001-R2 HIGH`
implementation_baseline: `2cc4b642bc86c4d8fb1b1631ca0ae394ed886913`
next_migration: `053`

## Correction

`database/053_sprint8_act6_effective_round_integrity.sql` replaces only the public verifier
projection for `act6.effective_vote`:

- `portrait_fixed_fallback` is bound exactly to ACT6 round 2;
- round 2 must contain three submissions and three distinct choices;
- round 1 tie evidence cannot substitute for round 2;
- normal majority resolution is bound to a `player_majority` resolved round with three
  submissions and at least two votes matching the authoritative `act6_resolution`.

Migrations001–052 were not modified. No canonical, Sprint9/10 or unrelated runtime semantics
were changed.

## Adjacent regression

`tests/sprint8-final-closure-integrity-transaction.sql` now first proves the fixture is a
legitimate two-tie fallback:

- round 1: three submissions / three distinct choices;
- round 2: three submissions / three distinct choices;
- authoritative resolution: `portrait_fixed_fallback`.

It then deletes only ACT6 round-2 votes and requires:

- `act6.effective_vote.state = missing_technical_evidence`;
- overall `verified = false`.

The savepoint is rolled back and the clean baseline is verified again.

## Evidence

Migration053 was deployed to the project database.

PASS:

- all repository `*static-check.js` suites;
- PostgreSQL transactional integrity matrix including exact round-2 deletion;
- Sprint8 AUDIT live E2E;
- Sprint8 final-closure dedicated live E2E.

## Ownership

The authorized narrow correction is complete and the implementation baseline is frozen.

NEXT_OWNER: CA
NEXT_ACTION: Perform narrow focused re-audit of S8-CA-001-R2 and return PASS or bounded finding.
