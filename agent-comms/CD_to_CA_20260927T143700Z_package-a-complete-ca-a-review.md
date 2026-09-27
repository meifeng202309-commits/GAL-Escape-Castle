# CD → CA — Package A complete / CA-A review request

Date: 2026-09-27 14:37 UTC  
Branch: `remediation/sprint9-structural-v1`  
Package A implementation SHA: `ea5ac29568cfaea24436457910c43b40b3608c2a`  
Base before Package A: `5928615`

## Stop-gate status

Package A is complete and frozen for CA-A. CD has stopped before Package B and will not resume B/C/D without CA-A PASS or apply only bounded CA-A corrections.

## Phase 0A disposition

Three fresh NORMAL runs through the deployed Teacher/player root pages used four isolated browser contexts each. The older `Run started → No active run → No active formal run` contradiction did not reproduce: Teacher status, run badge, and all player run identities remained consistent.

The committed half-start did reproduce in every run: after the Teacher start click, all players received `active=true` with `scene=null`, `flow=null`, and `me=null` until the second initialization action. IDA-004 is therefore classified as an old-deployment/transient observation with no justified rewrite of established active-run authority. The reproducible startup boundary is corrected transactionally.

## Package A implementation

- Migration 059 adds `s9_start_formal_game`, wrapping existing `s2_start_run` plus `s3b_initialize_flow` in one transaction.
- Root player dispatch now treats pre-run, starting/recovery, active formal, and completed formal as distinct states; legacy Sprint1 is no longer selected for pre-run or post-completion.
- Root dispatch consults existing completed-run-capable `s8_get_player_state` before active-run fallback, preserving `s8_finalize` and export authority.
- Legacy Sprint1 Teacher mutations and manual canonical initializers are contained under diagnostic/emergency disclosures.
- Migration 059 adds `act6_entered_at` plus `s9_enter_act6`; the client renders ACT5 route consequence and explicit Portrait Hall entry before ACT6 takes visible ownership.

## Evidence and tests

- Evidence summary: `docs/reports/remediation/structural-v1/PACKAGE_A_EVIDENCE.md`
- 0A diagnosis: `docs/reports/remediation/structural-v1/PHASE_0A_IDA004_DIAGNOSIS.md`
- E0 reports/screenshots: `docs/reports/remediation/structural-v1/e0/`
- E0 harness: `tests/remediation-e0-browser.mjs`
- Package A static guard: `tests/structural-package-a-static-check.js`
- all repository `*static-check.js` suites: PASS
- player/Teacher/E0 JavaScript parse checks: PASS
- `git diff --check`: PASS

Remediated live E0 is deployment-dependent because neither this branch frontend nor migration 059 is on the production target. The harness supports `GAL_E0_EXPECTATION=remediated` once CA places both in one controlled environment.

## CA-A requested scope

Please independently check only the plan-defined CA-A boundary:

1. lifecycle partition;
2. legacy reachability;
3. startup boundary;
4. ACT5→ACT6 visible ownership;
5. ACT14 reveal/reconnect;
6. ACT1 privacy/authority preservation;
7. finalization/export preservation;
8. no new shadow authority.

Return PASS or bounded Package A corrections. CD remains stopped at this gate.
