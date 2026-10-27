# CA — ACT9 073 incident recovery independent source gate
Date: 2026-10-28

## Disposition
**PASS — recovery source and isolated-test gate.** This does not assert live recovery or production release success.

## Frozen sources
CD request: `agent-comms/CD_to_CA_20261028T000000Z_trial4-073-recovery-ready.md`.
Implementation: `c8f2eaf8d75f43f1db3601cd54ca19aeddc13778`.
Recovery: `docs/reports/remediation/act9/073_RECOVERY_TO_072.sql`; CD SHA256 `5092ec2aa110cc4424456f7a21a945bf9380b51a15779cb30e0328c46def4970`.
Disposable workflow: `.github/workflows/act9-073-recovery-disposable-postgres.yml`; test: `tests/act9-073-recovery-postgresql.sql`.
CD reports run `40523151514`, job `122255407775`, success. CA reviewed exact SQL/workflow/tests but has not itself retrieved raw Actions logs or rerun PostgreSQL.

## Independent review
The recovery restores precisely the five signatures replaced by migration073. ACT9 returns to timed NORMAL legacy behavior and original ACT10 Teacher-paced logic remains. The script uses `create or replace` inside a transaction, retains explicit EXECUTE revokes/grants and makes no data-table edits. The isolated workflow snapshots migration072 function definitions, sorted ACL, owner and security-definer flags, applies 073, then recovery. The behavioral test compares restored catalog and exercises ACT9 Player close, ACT10 Teacher progression, stale identities, AUDIT deadlines and preserved data. This materially addresses the earlier coupled DB/frontend rollback risk.

### Canonical Ownership Check
PASS — recovery implementation modifies no role-owned gameplay/localization/visual canonical source.

### Patterns A–F
A PASS scoped — restores coupled DB policy before old frontend rollback.
B PASS scoped — stale Teacher identity tested; no state table/data rewriting.
C PASS scoped — server-side guards restored with function definitions.
D PASS scoped — preserves runtime historical rows and established events.
E PASS scoped — intentionally incident-only, excluded from normal numbered migration replay.
F PARTIAL — real isolated database function/catalog testing reported, no live production rehearsal.

## Release constraints
A release operator must freshly verify Pages source/candidate identity, active gameplay absence, migration072/pre072 and 073 absence, relevant LIVE catalog ACL/owner assumptions and eight asset availability. Approved release candidate is `deploy/trial4-player-act9-20261027@727ed7cd360c970b20874c7d5d0fc1b64826a92b`; rollback frontend `deploy/v4-player-first-20261026@627805636fd17df1e03ac485bef797ed82e9a42a`. Pages first, verify public hashes, then transactional 073. After 073 commits, never revert Pages alone. Recovery is incident-only, requires fresh independent authorization based on actual failure evidence and must restore DB behavior before old Pages frontend. Stop for drift, active play, failure or uncertain catalog state. No ad hoc repair.

## Ownership
Previous Teacher approval was conditional on a reviewed recovery path. Recovery condition is now met at **source/isolated-test gate**. Next owner **CD** for a single bounded production preflight and gated release execution within that prior Teacher approval; return full evidence to CA. CA must not claim production success until readback.
