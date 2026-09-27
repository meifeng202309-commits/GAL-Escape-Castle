# Package A evidence — lifecycle + transition spine

Date: 2026-09-27

## Implemented boundary

- Root lifecycle dispatch now distinguishes pre-run waiting, recoverable starting, active formal play, and completed ACT14 reveal. Legacy Sprint1 remains available for regression testing but is no longer a normal root dispatch target.
- Migration 059 adds `s9_start_formal_game`, which executes established `s2_start_run` and `s3b_initialize_flow` authorities inside one transaction.
- Legacy Sprint1 Teacher mutations and manual flow initializers are contained inside clearly labelled diagnostic/recovery disclosures.
- Migration 059 adds a server-authoritative `act6_entered_at` boundary and `s9_enter_act6`; the root client renders the ACT5 route consequence and explicit Portrait Hall entry before giving ACT6 ownership.
- Root refresh queries the existing completed-run-capable `s8_get_player_state` projection before deciding that no active run means pre-run, making ACT14 reveal and reconnect dispatchable without changing finalization/export authority.

## Preserved contracts

- Existing migrations 001–058 are unchanged.
- ACT1 role-specific choice definitions and server privacy authority are unchanged.
- `s2_start_run`, `s3b_initialize_flow`, Sprint5 vote/discussion authorities, `s8_finalize`, and export projections are not rewritten.
- NORMAL/AUDIT, override provenance, evidence ledgers, asset authority, and localization registry authority are unchanged.

## Verification

- Three E0 baseline runs passed with four isolated browser contexts each; reports/screenshots are in `e0/`.
- Phase 0A classification is recorded in `PHASE_0A_IDA004_DIAGNOSIS.md`.
- All repository `*static-check.js` suites pass.
- `structural-package-a-static-check.js` asserts lifecycle ordering, atomic-start wiring, legacy containment, ACT5 handoff authority, and migration grants.
- JavaScript parse checks pass for the player client, Teacher client, and E0 harness.
- `git diff --check` passes.

## Deployment-dependent follow-up

The remediation branch is not the deployed GitHub Pages/production database target. A remediated E0 run therefore remains a CA/deployment checkpoint item after migration 059 and the branch frontend are placed in one controlled environment. The baseline harness is parameterized with `GAL_E0_EXPECTATION=remediated` for that run.
