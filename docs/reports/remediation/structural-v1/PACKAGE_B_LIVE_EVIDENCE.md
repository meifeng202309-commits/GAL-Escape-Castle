# Package B accepted / locked / waiting evidence

Timestamp (UTC): `2026-09-29T02:15:37Z`

Branch: `remediation/sprint9-structural-v1`

## Implemented contract

- Player actions accepted by the server render an explicit locked/waiting state while peers remain pending.
- Reconnect derives the current player's locked state from server authority.
- Peer progress exposes counts only; private peer choice content is not projected.
- Covered barriers: ACT2 leave and route acknowledgement, ACT3 reunion, ACT4 private choice, ACT8 private choice, ACT9 group choice, ACT10 private/final choice, ACT11 allocation, ACT12 pressure projection, and ACT12 ENGAGE.

## Forward migrations

- `065_package_b_player_wait_projection.sql` introduced the player wait-state projection.
- `066_package_b_wait_projection_locked_at_fix.sql` corrected the acceptance timestamp column to the canonical `s6_choices.locked_at`.
- `067_package_b_allocation_progress_fix.sql` made ACT11 progress count the authoritative `s6_allocations` rows.

Migrations 066 and 067 were deployed successfully through the Supabase SQL editor. Both executions returned `Success. No rows returned`.

## Concrete runtime defects found and fixed

1. The ACT2 leave barrier remains in server phase `private_first_meeting`; the client checked the nonexistent `first_meeting` phase and could render a blank action area after acceptance. The renderer now uses the authoritative phase name.
2. The initial wait projection ordered Sprint6 choices by nonexistent `submitted_at`; migration 066 uses `locked_at`.
3. ACT11 progress initially counted `s6_choices`; migration 067 counts the authoritative `s6_allocations` rows for that phase.

## Verification

- `node tests/structural-package-b-live-e2e.js`: PASS
  - canonical live room: `PBMUM1NAAWW1EG`
  - output: `Structural Package B live E2E passed.`
- `node tests/structural-package-b-static-check.js`: PASS
- `node tests/structural-package-a-static-check.js`: PASS
- JavaScript parse checks for runtime and live test: PASS
- `git diff --check`: PASS

## Scope boundary

This closes Package B implementation evidence for CD's serial workflow. It is not a CA audit handoff. Package C remains next under the released plan, and Package D remains blocked until the shared-shell sequence is complete.
