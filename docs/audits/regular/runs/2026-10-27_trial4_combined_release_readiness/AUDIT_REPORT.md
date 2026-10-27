# CA — Trial4 combined release readiness (2026-10-27)

## Decision
**READY FOR SEPARATE TEACHER DEPLOYMENT AUTHORIZATION — CONDITIONAL**.
Frozen candidate composition and bounded source/preflight evidence: PASS. Production deployment and live runtime: NOT VERIFIED. This report does not authorize production mutation.

## Scope / baseline
- Verified current production Pages source according to CD read-only evidence: `deploy/v4-player-first-20261026@627805636fd17df1e03ac485bef797ed82e9a42a`.
- Frozen release candidate: `deploy/trial4-player-act9-20261027@727ed7cd360c970b20874c7d5d0fc1b64826a92b`.
- GitHub compare independently returns **one commit and exactly five changed files**: `index.html`, `src/game/app.js`, `src/styles/app.css`, `src/teacher/teacher-console.js`, `database/073_act9_normal_teacher_paced_vote.sql`. No other candidate delta.
- Accepted Player change `9573ea95a553f5425c47397d8b6e66fec4373ab7` and ACT9 migration source `defe73ec2cc041949d76cad61a07a4df8313c8e8`.
- CD release preflight: `docs/plans/TRIAL4_COMBINED_RELEASE_IMPACT_ROLLBACK_PACKAGE_20261027.md` and `agent-comms/CD_to_CA_20261027T230000Z_trial4-combined-release-preflight-ready.md`.

## Release integrity and remaining uncertainty
CD read-only inventory reports migration072 installed, migration073 absent, required `s6_get_player_state_pre072(text,text)` present, four live public frontend bytes matching baseline, eight Pocket media ACTIVE/resolving and focused tests PASS. CA independently checked candidate Git changed-file interval and reviewed the CD evidence and documented recovery boundaries; CA did **not** independently query production Pages/database or perform live E2E.

The proposed **Pages first, migration073 second** is the safer of the two orders: the candidate Teacher frontend can open NORMAL ACT9 voting while old DB behavior persists in the interim; the inverse order would leave the old Teacher client unable to open Teacher-paced ACT9 vote. A brief mixed-version interval remains; release requires no active/recent class play and immediate ordered verification.

**Rollback coupling is material**: once migration073 commits, restoring Pages only to 6278056 is unsafe. If reverting is required, retain the candidate frontend until a reviewed, executable forward DB recovery restoring the exact migration072 function definitions and ACLs is applied and verified. The plan identifies this but does not furnish a separately validated recovery migration. For an actual production go/no-go, require a documented and independently reviewed recovery artifact/procedure available to the operator before cutover, or explicit Teacher acceptance of the residual recovery limitation. Do not improvise a live rollback.

## Canonical Ownership Check
PASS — five candidate changed files contain no GA/VA/Teacher-protected canonical specification, localization or asset registry edit.

## Recurring patterns A–F
- A — PASS scoped: release plan identifies coupled DB/Teacher-client transition and correct order.
- B — PASS scoped source: identity-guarded Teacher RPC and disposable SQL replay/phase tests; live race not verified.
- C — PASS scoped: server-side Teacher checks; not UI-only enforcement.
- D — PASS source: Teacher-open provenance ledger retained in migration073.
- E — PASS scoped: incremental migration073; no historical SQL rewrite or unrelated client/module change.
- F — NOT VERIFIED production: source/browser/disposable SQL evidence exists, but public release and real multi-player run await separate gate.

## Required execution conditions if Teacher approves
1. CD re-check exact Pages SHA, candidate blob/migration hashes, migration072/pre072 presence, migration073 absence, no recent/ongoing gameplay, ACTIVE media and actual operator/rollback readiness immediately before mutation.
2. Stop on drift or unexpected catalog differences.
3. Switch Pages to exact candidate and verify deployed public hashes; only after success, apply **only migration073** transactionally and read back function/ACL/version identity.
4. Stop on any unexpected SQL or browser condition; never roll Pages back alone after successful SQL073.
5. Perform small guarded synthetic NORMAL/AUDIT smoke with no genuine students, then return for human full ACT1–ACT14 trial.
6. Do not broaden to gameplay/UI improvements unrelated to this frozen package.

## Next owner
**Teacher** — choose whether to approve the one-time tightly bounded production release under the above controls, including DB-recovery caveat. If approved, CD is the execution owner; CA verifies the release evidence. If not approved, CD may prepare a focused independently reviewed SQL rollback/recovery artifact without production mutation.
