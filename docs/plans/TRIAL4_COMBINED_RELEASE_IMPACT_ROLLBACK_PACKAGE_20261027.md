# Trial4 Combined Release Impact and Rollback Package

Date: 2026-10-27
Status: release preparation only; no production mutation authorized

## Frozen identities

- Current verified Pages source: `deploy/v4-player-first-20261026@627805636fd17df1e03ac485bef797ed82e9a42a`, `/(root)`.
- Latest successful Pages workflow: `40294783800`, completed/success.
- Preserved Pages rollback: `deploy/v4-player-first-20261026@627805636fd17df1e03ac485bef797ed82e9a42a`, `/(root)`.
- Earlier CA285 fallback: `deploy/ca285-batch-a-act10-20261023@d09f7c7be27fd521bb10328de434aca1bc676a2e`, `/(root)`.
- Combined candidate: `deploy/trial4-player-act9-20261027@727ed7cd360c970b20874c7d5d0fc1b64826a92b`.
- Accepted Player source: `9573ea95a553f5425c47397d8b6e66fec4373ab7`.
- Accepted ACT9 source: `defe73ec2cc041949d76cad61a07a4df8313c8e8`.

Public `index.html`, `src/game/app.js`, `src/styles/app.css`, and `src/teacher/teacher-console.js` returned HTTP 200 and their SHA-256 values exactly matched the current Pages source commit. The latest successful Pages deployment run also identifies the same branch and SHA.

## Exact candidate delta

Relative to the verified live Pages commit, the candidate changes exactly:

| File | Candidate Git blob | Purpose |
| --- | --- | --- |
| `index.html` | `d6c99e4c5b9c292db71b1cb8799dc9d99c96571f` | Stable formal Scene mount |
| `src/game/app.js` | `bb00ebf922eaa7af03118efdd564527b68fe901b` | Player Scene/Runtime/Action routing, Pocket mappings, existing Teacher-required projection behavior |
| `src/styles/app.css` | `7174f36e5407360c03364b7df758dd2b94d2f581` | Approved desktop/mobile region layout |
| `src/teacher/teacher-console.js` | `3523f929e2840076eed22bb9651fcc12d4f0c28a` | Allow identity-guarded NORMAL ACT9 Teacher Open Vote |
| `database/073_act9_normal_teacher_paced_vote.sql` | `cff2ef537a71071482cf472af36e0b9779a2179a` | NORMAL ACT9 Teacher-paced server policy; AUDIT unchanged |

The committed migration073 byte SHA-256 is `30fd49ee42081e0aacd8601f88bf9aa11bf5bfa3a8d08e32e6c48b73b2ac7e15`.

## Live database inventory

Read-only production catalog evidence shows:

- `ca284_act10_teacher_open_vote` (migration072) is recorded at version `20261023023426`.
- migration073 is absent.
- The globally newest migration record is the independent `ca288_w03_combined_grab_leave`; this does not supersede the Sprint6 ACT9/10 functions.
- `s6_get_player_state_pre072(text,text)` exists, satisfying migration073's explicit dependency.
- Effective identities exist for `s6_open_discussion`, `s6_refresh_owned_discussion`, `s6_send_message_guarded`, `s6_close_discussion_guarded`, `s6_get_player_state`, the pre072 function, and `s6_teacher_open_vote`.

Migration073 replaces the same five effective signatures established by migration072: open, refresh, close, Player projection, and Teacher progression. It does not replace message submission, CA285 polling/session ownership, group-choice voting, or unrelated acts.

## ACTIVE media

All eight candidate Pocket keys are ACTIVE v1 with non-null published storage paths and dimensions: castle map, number-note front/back, diary, watch face/back, closure order, and star key. Read-only public HEAD checks returned HTTP 200 and `image/webp` for all eight objects.

At `2026-10-27 14:18:11+00`, read-only activity checks found zero runtime events and zero newly created runs in the prior 30 minutes. The database contains 588 historical rows still marked `active`, so status count alone is not a reliable exclusivity signal and must not replace a fresh event/session check immediately before any authorized release.

## Focused candidate verification

Passed against the assembled candidate:

- Player integration static check
- migration073 NORMAL/AUDIT static and policy checks
- A1 CA285 Player polling static and browser checks
- ACT9/10 Teacher Open Vote browser routing with complete identities
- Three-Player ACT10/ACT3/ACT9 integrated browser gate, including IME-safe messaging, vote, reconnect-compatible polling, Pocket inspection/flip/later items, 1366x768 and 1280x720, disabled NORMAL ACT9 Player close, and retained Runtime scroll

The older CA284 static test could not run inside the minimal Pages candidate because that branch intentionally does not carry historical migration072 source files; the same test passed on the remediation source, and migration073's own static gate passed on the candidate. This is a packaging difference, not a runtime dependency gap: production catalog evidence confirms pre072 and migration072 are deployed.

## Proposed separately authorized order

1. Reconfirm exact Pages selector, candidate SHA, migration073 SHA-256, current database inventory, zero recent gameplay activity, and a live Teacher/operator recovery path. STOP on any mismatch.
2. Switch Pages to `deploy/trial4-player-act9-20261027@727ed7c`, `/(root)` and verify workflow success plus exact public bytes for the four frontend files. This frontend is backward-compatible with live migration072; ACT9 remains on its old timed behavior until SQL changes.
3. Apply only migration073 as one transaction. Verify the migration record, five function definitions/ACLs, pre072 dependency, and absence of SQL errors. If SQL application fails, migration rollback leaves 072 intact; restore Pages to `6278056`.
4. Run the smallest guarded synthetic NORMAL/AUDIT validation and public browser smoke approved by CA/Teacher. Do not use an actual class room.
5. Release for the Teacher's next human full run only after all readbacks pass.

Pages-first avoids the unsafe opposite window: applying 073 first would make NORMAL ACT9 Teacher-paced while the old Teacher frontend still cannot open ACT9 voting.

## Rollback and STOP conditions

- Before SQL success, a Pages failure rolls back by restoring `deploy/v4-player-first-20261026@6278056`, `/(root)`, then verifying the rollback workflow and four public hashes.
- Migration073 is not undone by switching Pages. After SQL success, do not independently roll Pages back to `6278056`: its Teacher client cannot open NORMAL ACT9 under 073.
- Database recovery requires a separately reviewed forward recovery migration restoring the exact migration072 definitions and ACLs for the five replaced functions. Keep the Trial4 frontend active until that database recovery is verified; only then restore Pages if still required.
- Because migration application is wrapped in one transaction, a statement failure must leave the prior 072 definitions intact. STOP if catalog readback is mixed or uncertain rather than attempting ad hoc repair.
- STOP on active/recent gameplay, Pages source drift, candidate/hash drift, missing ACTIVE media, missing pre072 dependency, additional migration need, unexpected function/ACL delta, operator/recovery unavailability, or any requirement to alter another act.

No live SQL, Pages Save, Storage mutation, or gameplay-state mutation was performed during this preflight.
