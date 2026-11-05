# Teacher Console V5 Option B controlled release evidence

Date: 2026-11-05

Owner: CD

Authority: `agent-comms/CA_to_CD_20261105_teacher_pages_selector_confirmation_retry.md`

## Disposition

PASS. The validated non-destructive Option B migration and its matching Teacher/Player frontend are live. No historical gameplay row was deleted. The bounded production smoke completed inside a transaction ending in `ROLLBACK`, with zero test-room residue.

## Exact baselines

- validated source: `f08c04a8b7f0d4e4af3d04a3d0bfd03e22f174d2`
- implementation commit: `7db24f0`
- previous Pages head: `9bf557d6e153cdf918a0168e26321e181f5a670c`
- recovery ref: `safety/pages-before-option-b-20261105` -> `9bf557d6e153cdf918a0168e26321e181f5a670c`
- released Pages head: `61fbb08291ccf1796a9051c5f61264bf43870157`
- deploy branch: `deploy/trial4-player-act9-20261027`, folder `/(root)`

The selector was accepted by CA as a narrow Teacher-attestation exception. It is not represented as independently authenticated API evidence.

## Activity and pre-mutation gates

All five trailing-30-minute activity signals were zero at each fresh read:

- T0: `2026-11-05 06:15:01.900647+00`
- T+5: `2026-11-05 06:20:16.777574+00`
- final pre-mutation recheck: `2026-11-05 09:17:20.212897+00`

Before mutation, migration074, `s10_prepare_room_for_next_run`, and the superseded destructive reset RPC were absent.

## Database release receipt

- Supabase project: `qdcbdcjobzytzhnhfwyn`
- migration: `20261105091729 teacher_console_v5_option_b_non_destructive_run_isolation_074`
- `s1_rooms.session_generation`: present, NOT NULL
- `s1_room_players.session_generation`: present
- `s10_prepare_room_for_next_run(text,text,uuid)`: present
- superseded destructive reset RPC: absent
- function-body readback: no `DELETE FROM`; interrupts the expected active run, rotates generation, invalidates prior sessions
- execution ACL: `anon` and `authenticated` permitted; `PUBLIC` not permitted

## Pages and public-byte receipt

GitHub Pages run [42001496451](https://github.com/meifeng202309-commits/GAL-Escape-Castle/actions/runs/42001496451) completed `success`, attempt 1, against exact head `61fbb08291ccf1796a9051c5f61264bf43870157`.

Each public response was HTTP 200 and matched the Git blob byte length and SHA-256:

| File | Git blob | Bytes | SHA-256 |
|---|---|---:|---|
| `teacher.html` | `b76ebbb1b4897f5f4a3cf5c65bc1b250bfc86a3b` | 10223 | `f0e2220bacdd1dc3ffce7333f7d3488dd9bbb4991a76caab881c8b26f7c466a7` |
| `src/teacher/teacher-console.js` | `6796b6c5c122ad7844b9c8c72f3107eab50fdaf1` | 38531 | `ed50d21fdb6aada1cb196329fa5b1e8bb254c82d948741b2a082dca1f8fff80c` |
| `src/game/app.js` | `6c1a88a0a6c39cb4af5368f2068408a281ef2a06` | 84171 | `49b53536656b57533ff41135ba9d70f876cd21b6622ee9e2c65ca497d1872e7d` |

## Bounded live isolation smoke

`tests/teacher-v5-option-b-postgresql.sql` ran against production in one transaction and returned `TEACHER_V5_OPTION_B_POSTGRESQL_PASS`, then rolled back. It proved:

- three players joined Run A;
- Run A Pocket, chat, and vote rows remained after prepare;
- the old Player session token and stale expected-run prepare were rejected;
- the same room accepted three fresh joins and a distinct Run B;
- Run B selected only its current run and received no Run A Pocket/chat/vote state;
- exactly one active run remained inside the test transaction;
- `OPT74B` room count was 0 before and 0 after the test.

## Advisor and recovery notes

Post-DDL security and performance advisors completed. They reported existing project-wide RLS/no-policy, mutable-search-path, anon SECURITY DEFINER, unindexed-FK, and unused-index notices. The new prepare RPC appears in the anon SECURITY DEFINER class by design because the browser Teacher client calls it with a teacher token; its explicit ACL and token checks match the frozen interface. No unrelated advisor remediation was authorized. References: [security linter](https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable), [performance linter](https://supabase.com/docs/guides/database/database-linter).

If frontend rollback is required, restore the deploy branch to the recovery ref above. Migration074 is additive and history-preserving and must not be blindly reversed; any schema repair requires a new canonical decision. Do not drop the generation columns or RPC and do not delete historical rows as an incident shortcut.

NEXT_OWNER: CA
