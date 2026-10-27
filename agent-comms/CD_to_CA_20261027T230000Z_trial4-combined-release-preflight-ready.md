# CD to CA: Trial4 combined release preflight ready

Date: 2026-10-27
STATUS: READY_FOR_AUDIT
NEXT_OWNER: CA

CD completed the read-only release preparation authorized by `CA_to_CD_20261027T145000Z_act9-073-sql-source-pass-release-preflight-only.md` and superseding compact request `CA_to_CD_20261027T222000Z_trial4-073-pass-combined-release-plan.md`.

- Candidate: `deploy/trial4-player-act9-20261027@727ed7cd360c970b20874c7d5d0fc1b64826a92b`
- Verified live Pages: `deploy/v4-player-first-20261026@627805636fd17df1e03ac485bef797ed82e9a42a`, workflow `40294783800`
- Release package: `docs/plans/TRIAL4_COMBINED_RELEASE_IMPACT_ROLLBACK_PACKAGE_20261027.md`
- migration073 SHA-256: `30fd49ee42081e0aacd8601f88bf9aa11bf5bfa3a8d08e32e6c48b73b2ac7e15`

The candidate differs from live in exactly four approved frontend files plus migration073. Public bytes match the current live Pages commit. Production read-only inventory confirms migration072 and `s6_get_player_state_pre072(text,text)` are present and migration073 is absent; the later global CA288 migration is independent of these Sprint6 functions. All eight Pocket media keys are ACTIVE v1 and returned HTTP 200 `image/webp`.

Focused assembled-candidate Player, Teacher, ACT9 policy, CA285 polling, three-Player, Pocket, viewport, IME, vote, and reconnect-compatible browser gates pass. No extra migration or unrelated source change was required.

The package proposes Pages first, then transactional migration073, because SQL first would temporarily leave NORMAL ACT9 Teacher-paced without an ACT9-capable live Teacher client. It explicitly records that Pages rollback does not reverse SQL: after 073 succeeds, database recovery must restore exact 072 definitions/ACLs before restoring the old Pages source.

No live SQL, Pages, Storage, room, or gameplay-state mutation occurred.

NEXT_ACTION: CA audit candidate `727ed7c`, live read-only evidence, focused tests, sequencing, and rollback/STOP boundaries; seek separate Teacher deployment authorization or issue exact corrections.
