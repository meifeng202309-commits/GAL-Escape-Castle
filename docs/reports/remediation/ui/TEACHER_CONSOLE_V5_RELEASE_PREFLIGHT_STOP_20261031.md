# Teacher Console V5 controlled-release preflight — STOP

Date: 2026-10-31  
Authority: `agent-comms/CA_to_CD_20261031T041813Z_v5_migration074_guarded_release_authorized.md`  
Candidate branch/head: `remediation/sprint9-structural-v1@52021c29e2179e6fabf3ae898b1eb5a1f2afd6dc`

## Disposition

STOP before every production mutation. The authorization requires a maintenance/idle window with no active games, current authenticated Pages settings, and a recent verified database backup/recovery path. Those mandatory gates were not all available. Migration074 was not applied, no Pages selector or deploy branch was changed, no RPC was called, and no room or gameplay data was mutated.

## Read-only production observations

At `2026-10-31 04:48:32.439119+00`, Supabase reported:

- project `qdcbdcjobzytzhnhfwyn` was `ACTIVE_HEALTHY`, PostgreSQL `17.6.1.166`;
- latest recorded migration remained `20261027151620_act9_normal_teacher_paced_vote_073`;
- migration074 table and both migration074 RPCs were absent;
- no Player join, Player heartbeat, runtime event, or newly opened discussion activity was observed in the preceding 30 minutes;
- nevertheless, `game_runs` contained 593 rows still marked `status='active'`: 591 were not completed and two were completed;
- none of those active-status rows had activity in the preceding 30 minutes; the newest recorded activity among them was `2026-10-30 17:22:47.270187+00`.

The inactivity evidence does not authorize CD to reinterpret the letter's separate `no active games` requirement. CD did not terminate, repair, relabel, reset, or otherwise mutate any of those rows.

## Failed mandatory gates

1. **Recent verified backup/recovery path — missing.** The connected Supabase organization `Learn From Fun` reports `plan=free`, `tier=tier_free`. The available management connector exposes no dated backup receipt. A direct read-only visit to the project's Database Backups page redirected to Supabase sign-in, so no authenticated backup record or tested recovery point could be verified. General documentation or the existence of a restore operation is not a backup receipt.
2. **No active games — not established.** There were 593 active-status rows. Although all were inactive for more than 30 minutes, CA did not authorize CD to substitute an inactivity heuristic for the explicit gate.
3. **Fresh authenticated Pages settings — not established.** Repository evidence identifies the previously accepted selector as `deploy/trial4-player-act9-20261027`, `/(root)`, and the observed remote ref is `9bf557d6e153cdf918a0168e26321e181f5a670c`; however, no fresh authenticated Pages selector/settings read was available in this preflight. Stale evidence was not treated as a current receipt.

Any one item is sufficient to stop. CD therefore did not consume the migration/deployment authorization.

## Frozen candidate identities

| File | SHA-256 | Git blob |
|---|---|---|
| `database/074_teacher_console_v5_snapshot_and_room_reuse.sql` | `4cc946af25e22bbf7260ea00bcc9f134802d5b4ad15d0a6fe0c0a39929a956ab` | `de679a28cbfb8b879fc9989f545532cbad51dfb9` |
| `teacher.html` | `bbdce5b70dcc98d1a258c2facb76a254e06052c58512c5caa02b4604b9aad26c` | `d749ef7fd7cc4c875d7794761822435264bb2e2d` |
| `src/styles/app.css` | `844e0ec4c8bdf9f7dc1b52499f5d74ef324dd4f3167e154383703a23c4db09c5` | `cc715307e07cdbe6f4abc4e90630bce04ae0f8a3` |
| `src/teacher/teacher-console.js` | `3ccee7bd5d8b0b692d2237210aaa35353cf244c10d9640d1253121ab87510574` | `1c7a12c40bece4f2d2123f2eec6de10f0bc4f5a0` |
| `src/supabase/client.js` | `5fc7f294a2154003d2a9794ab401544ae406ee100d2934cb00fccf9c55d38437` | `e5363c96c598e7e7c94cdac3ec9c73ef01e01968` |

## Verification retained

- `node tests/teacher-console-v5-static-check.js` — PASS
- `node tests/sprint3c-static-check.js` — PASS
- `node tests/structural-package-a-static-check.js` — PASS

No live write regression was permissible after the failed pre-mutation gate.

## Preapproved rollback boundary

Because no mutation occurred, rollback is unnecessary. If a later independently authorized attempt applies migration074, its SQL transaction provides failure atomicity. After a successful schema apply, CD must not destructively remove schema without a separately reviewed forward migration; a frontend-only failure may restore the exact prior deploy bytes while leaving the additive schema in place.

## Required next decision

CA must review the active-status semantics and obtain or explicitly adjudicate a recent verifiable backup/recovery path plus fresh authenticated Pages settings before issuing any renewed release instruction. Ownership returns to CA.
