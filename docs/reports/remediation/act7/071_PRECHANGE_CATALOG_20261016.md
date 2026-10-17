# Migration 071 production prechange catalog — 2026-10-16

Scope: read-only `pg_proc` / `pg_namespace` / `pg_roles` / `pg_depend` catalog queries against project `qdcbdcjobzytzhnhfwyn`. No room, Player, vote, message or other business rows were read. No SQL mutation occurred.

| Signature | Owner | SECURITY DEFINER | Effective explicit ACL | Definition MD5 |
|---|---|---:|---|---|
| `s5_configure_discussion(uuid,text)` | postgres | yes | postgres, service_role | `6789065a3f46b7771c1f7608ee80b391` |
| `s5_teacher_open_vote(text,text)` | postgres | yes | postgres, anon, authenticated, service_role | `d63a8861832ee33092632553eacc753c` |
| `s5_teacher_add_time(text,text,integer)` | postgres | yes | postgres, anon, authenticated, service_role | `b66ea3897c710cb381be330d6797bc30` |
| `s5_get_teacher_discussion_state(text,text)` | postgres | yes | postgres, anon, authenticated, service_role | `352e1dd5729fa0ababd7f332aa3de1e5` |
| `s5_submit_vote(text,text,uuid,integer,uuid,text)` | postgres | yes | **PUBLIC**, postgres, anon, authenticated, service_role | `32a433bf687e0e156f412dfa24eac555` |
| `s2_refresh_discussion(uuid)` | postgres | yes | postgres, service_role | `4fc5171860d83011c64d3f3d3a3e7d4a` |

Every function has `search_path=public`. There is exactly one deployed overload for each listed name; the new six-argument `s5_teacher_open_vote` does not yet exist. The four definitions replaced/added by 071 match the prechange bodies preserved in `071_RECOVERY.sql`.

Catalog dependency query returned no `pg_depend` rows for referenced procedures/relations/types. This is expected for PL/pgSQL body references and must **not** be interpreted as no runtime dependency. Source-defined runtime dependencies are:

- relations: `game_runs`, `s5_run_state`, `s5_rounds`, `discussion_sessions`, `runtime_events`, `dialogue_messages`, `s1_room_players`, `s5_votes`;
- functions: `s1_assert_teacher`, `s2_get_active_run`, `s2_refresh_discussion`;
- client: frozen/current `teacher.html` and `src/teacher/teacher-console.js` call the old two-argument Open Vote and expose Add Time.

Security note outside 071 scope: deployed `s5_submit_vote` still contains an explicit PUBLIC EXECUTE ACL. Migration 071 does not replace or alter that function. It remains a separately reviewable pre-existing security fact, not silently folded into this release.
