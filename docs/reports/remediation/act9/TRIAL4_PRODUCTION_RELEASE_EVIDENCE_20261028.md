# Trial4 Player / ACT9 production release evidence

Date: 2026-10-28
Owner: CD
Authorization: `agent-comms/CA_to_CD_20261028T003000Z_trial4-recovery-pass-conditional-production-release.md`

## Frozen identities

- Candidate: `deploy/trial4-player-act9-20261027@727ed7cd360c970b20874c7d5d0fc1b64826a92b`, `/(root)`.
- Previous Pages recovery: `deploy/v4-player-first-20261026@627805636fd17df1e03ac485bef797ed82e9a42a`, `/(root)`.
- Migration source SHA-256: `30fd49ee42081e0aacd8601f88bf9aa11bf5bfa3a8d08e32e6c48b73b2ac7e15`.
- Reviewed incident recovery SHA-256: `5092ec2aa110cc4424456f7a21a945bf9380b51a15779cb30e0328c46def4970` (not executed).

## Production preflight

The authenticated GitHub Pages API read back the previous branch/root exactly. Both remote branch heads matched their frozen SHAs. Production read-only checks confirmed migration072 and `s6_get_player_state_pre072(text,text)`, migration073 absence, the expected function owner/security-definer/ACL envelope, zero runtime events, S1 events, new runs, and newly open discussions in the preceding 30 minutes. All eight Pocket assets resolved ACTIVE v1 and returned HTTP 200 `image/webp`.

## Pages-first release

The Pages selector was changed only to the frozen candidate branch/root. GitHub Pages build `1319041359` completed `built` for exact commit `727ed7cd360c970b20874c7d5d0fc1b64826a92b` (created `2026-10-27T15:13:06Z`, completed `2026-10-27T15:14:01Z`).

Public byte SHA-256 readback:

| File | SHA-256 |
| --- | --- |
| `index.html` | `be7a24b5e1459348f1a7b10b4be7bbf9beb918d7b09e4facf4107c4d3cfe3c53` |
| `src/game/app.js` | `06c216d1b6126d8f0795b1b17dfa7c73f5e41369a3a77f2be680db68a0795499` |
| `src/styles/app.css` | `7efc01333df276c978a6a13e24aa6033060f6d4b7e1bdc2b2de1603979ec11bb` |
| `src/teacher/teacher-console.js` | `3944528efe4f08bcbe027725eac2dbc2646cfa0e0bd7feac766de215494b3790` |

Every public value matched the corresponding Git object byte-for-byte. The public Player page rendered the Scene, Action, Discussion, and Pocket regions; the public Teacher page rendered the Teacher Console and formal-run controls.

## Transactional migration073 and readback

After a second zero-activity check, the exact audited migration073 was applied through Supabase migration execution. Receipt: `20261027151620_act9_normal_teacher_paced_vote_073`.

Readback confirmed all five changed signatures have the migration073 policy fragments, remain owned by `postgres`, remain `SECURITY DEFINER`, and retain the intended ACLs: internal open/refresh/close functions are executable only by `postgres` and `service_role`; Player state and Teacher Open Vote additionally allow `anon` and `authenticated`.

## Guarded production smoke

A single transaction created synthetic rooms `T473N1` and `T473A1`, exercised NORMAL ACT9 Teacher-paced behavior, stale identity rejection, Teacher transition, legitimate Player vote resolution, retry behavior, and AUDIT timed progression, then rolled back. Result: `ACT9_073_PRODUCTION_SYNTHETIC_ROLLBACK_PASS`; cleanup readback found zero synthetic rooms. Final production readback still showed zero recent gameplay signals and zero newly open discussions.

Post-change Supabase security/performance advisors reported the project's established broad advisory set; migration073 created no table/policy/index and the five-function ACL readback matched the frozen contract. No recovery, Pages rollback, Storage mutation, live classroom room, or ad hoc repair was used.

## Disposition

The bounded Trial4 release is deployed and verified. The previous frontend branch remains preserved, but must not be selected alone while migration073 is active. Any future incident rollback must restore migration072 database behavior using the separately reviewed recovery procedure before restoring the previous frontend.
