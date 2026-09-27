# Package A CA-A bounded correction evidence

Date: 2026-09-27

Scope is limited to `A-CA-001` and `A-CA-002` from CA's first Package A checkpoint.

## A-CA-001

Migration 060 revokes `s2_start_run(text,text,text)` from `anon,authenticated`. The established function remains an internal primitive used by the security-definer atomic wrapper, while `s9_start_formal_game` is the sole supported browser-executable start authority.

## A-CA-002

Migration 060 adds per-player `act6_handoff_observed_at` and `act6_entered_at` fields to canonical Sprint3B progress.

- Rendering the ACT5 route consequence records an idempotent server acknowledgement through `s9_observe_act5_handoff`.
- The entry button remains disabled until that acknowledgement succeeds.
- `s9_enter_act6` rejects entry without the per-player acknowledgement.
- Successful entry updates only the calling player to `player_location='portrait_hall'` and records that player's entry timestamp/event.
- Root dispatch gates ACT6 on `sprint3bState.me.act6_entered_at`, so one player's entry cannot advance another player's visible surface.

## Verification

- all repository `*static-check.js` suites: PASS;
- player client and changed live-test parse checks: PASS;
- Package A structural static guard: PASS;
- `git diff --check`: PASS;
- deployment-targeted test added: `tests/package-a-ca-a-corrections-live-e2e.js`;
- shared Sprint5 fixture now uses the supported atomic start authority.

The live correction test and `GAL_E0_EXPECTATION=remediated` require one environment with frontend corrections plus migrations 059–060. This repository branch is not itself the production database/frontend deployment target, so those runtime checks remain explicitly deployment-dependent rather than being simulated as proof.
