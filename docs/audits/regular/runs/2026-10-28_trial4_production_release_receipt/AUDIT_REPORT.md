# CA Trial4 production release evidence audit — 2026-10-28

## Disposition
**PASS — bounded release receipt/source conformance, Teacher full human run still NOT VERIFIED.** CA did not personally query production Supabase or public Pages in this audit; release live readback is CD-reported, with exact identities and checks listed in the evidence.

## Trigger and frozen scope
- Formal CD handoff: `agent-comms/CD_to_CA_20261028T013000Z_trial4-production-release-pass.md`.
- Evidence: `docs/reports/remediation/act9/TRIAL4_PRODUCTION_RELEASE_EVIDENCE_20261028.md`.
- Approved release: `deploy/trial4-player-act9-20261027@727ed7cd360c970b20874c7d5d0fc1b64826a92b`, Pages build `1319041359`, migration receipt `20261027151620_act9_normal_teacher_paced_vote_073`.
- Independent GitHub commit inspection confirms the candidate contains only `index.html`, `src/game/app.js`, `src/styles/app.css`, `src/teacher/teacher-console.js`, and `database/073_act9_normal_teacher_paced_vote.sql` changes.
- Prior source, database disposable test, recovery and conditional release authorization: CA-291 to CA-294.

## Verification and limitations
CD's submitted receipt documents live Pages selector and exact four published public byte-hashes, 073 applied transactionally after Pages, five catalog definitions/ACL/owner/security-definer read back, eight ACTIVE Pocket assets, zero recent gameplay before release, and transaction-rolled-back NORMAL/AUDIT production synthetic smoke with zero residual rooms. No contradictory evidence found in frozen candidate and receipt. Source/receipt review does not independently prove actual live deployment; **independent live production state NOT VERIFIED by CA**.

## Canonical Ownership Check
PASS — frozen code delta confined to five previously authorized files; no protected canon/visual narrative edit.

## Audit patterns A–F
A PASS source/receipt — Pages-before-SQL order and Player/Teacher/DB coordination.
B PASS receipt-scope — stale identity, three votes, replay and NORMAL/AUDIT synthetic checks recorded.
C PASS source/receipt — server-enforced Teacher transition and ACL readback recorded.
D PASS receipt-scope — migration id and release provenance, event ledger retained.
E PASS scope — additive 073 only, no legacy or unrelated schema mutation reported.
F PARTIAL — synthetic rollback on production reported by CD; CA did not independently reproduce, Teacher full human ACT1–14 run is pending.

## Conditions for Teacher trial
No further production mutation authorized. Teacher may run fresh ACT1–14 end-to-end real-play test using the now-reported live Player and Teacher pages. Verify priority Trial4 Scene upper-left/Runtime below/Action upper-right, image assets and Pocket later items, ACT9 NORMAL no auto-expiry and Teacher Open Vote, AUDIT regression only if separately testable, ACT9 Runtime scroll if reproduced. Record screenshots, actual phase, time, and role when issues arise. Escalate only material blockers; do not pre-emptively expand fixes. Database recovery remains incident-only and must precede any rollback to old Pages.

## Ownership
**NEXT_OWNER: Teacher** for full end-to-end game trial and defect report; send report to CA if actionable bug found. Otherwise handoff to GA for next product/game-design scope.
