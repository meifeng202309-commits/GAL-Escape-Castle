# CA — ACT9 migration073 disposable PostgreSQL closure (2026-10-27)

## Decision
**SOURCE / DISPOSABLE-SQL GATE: PASS WITH PRODUCTION NOT VERIFIED.**
This is not a production deployment approval or live-E2E PASS.

## Identity and sources
- Authorized ACT9 development: `agent-comms/CA_to_CD_20261027T111000Z_trial4-player-source-accepted-act9-dev-scope-gate.md`
- GA canonical timing decision: `agent-comms/GA_to_CA_20261027T080000Z_act9-normal-teacher-paced-timing-decision.md`
- Source baseline: `2550a4c`; implementation: `defe73ec2cc041949d76cad61a07a4df8313c8e8`.
- Disposable CI harness: `63e4f80630d3b9da9403e9afaee6496f6612b7ab`.
- CD evidence: `docs/reports/remediation/act9/073_ACT9_DISPOSABLE_POSTGRESQL_EVIDENCE_20261027.md`; Actions run `40513214700` (reported success).
- Source-vs-baseline changed files: migration073, Teacher console, targeted SQL/static/browser tests. No protected canonical spec modifications.

## Independent source inspection
Migration073 defines NORMAL ACT9 no-deadline opening and non-expiry, guarded Teacher-controlled transition, Player-close rejection and authoritative group voting retained through existing RPC. For AUDIT, configured deadlines and timeout advance remain active. The Teacher transition requires valid Teacher token and matching active run, phase, step, round and discussion-session identity; it records intervention provenance. Role grant of the Teacher RPC to browser roles is paired with the in-function Teacher assertion; permission is not UI-only.

The SQL fixture directly checks expired legacy deadlines in NORMAL, rejects unauthorized/stale phase changes, validates actual Player messaging/three-player votes, checks retry and AUDIT 180/60 expiry. The CI workflow creates disposable PostgreSQL roles/database compatibility and applies 001–072 lexical history before 073; SQL is executed with ON_ERROR_STOP and fixtures rolled back. **CA inspected workflow, SQL, matrix and CD evidence but did not independently rerun Actions or perform live Supabase tests.** CI success and exact execution output are evidenced by CD report, not independently reproduced here.

## Canonical Ownership Check
PASS — baseline-to-implementation changed-file inventory shows no protected canonical content authored by CD.

## Patterns A–F
- A cross-module handoff: PASS source — ACT9 Teacher transition updates phase and emits event ledger within RPC transaction.
- B stale/replay: PASS scoped — phase/run/step/round/session checks and transaction tests cover stale Teacher call.
- C UI/server mismatch: PASS source — close and Teacher authority checks implemented in SQL rather than only disabled UI.
- D historical evidence: PASS source — Teacher intervention recorded in runtime events and act6–13 ledger.
- E authority accretion: PASS scoped — migration is additive and retains established ACT9 group-vote authority and existing ACT10 compatibility.
- F self-confirming tests: PARTIAL — disposable SQL exercises effective real functions beyond static assertions; actual public deployment and fresh human play are NOT VERIFIED.

## Remaining boundaries
No production SQL migration/Pages deployment has been authorized; no live runtime is verified by this gate. Prior Player layout/Pocket package `9573ea95...` already received bounded SOURCE PASS in `CA_to_CD_20261027T111000Z...`; do not reopen without a new regression trigger. No new defect is opened here.

## Next ownership
CD: prepare a bounded, non-mutating combined release-readiness/preflight plan showing deployed DB migration inventory, current Pages source, safe deployment/rollback sequencing and exact frozen frontend/073 identities. **Do not apply migration073 or switch Pages before a distinct CA/Teacher authorization.** Return preflight facts to CA for release decision.