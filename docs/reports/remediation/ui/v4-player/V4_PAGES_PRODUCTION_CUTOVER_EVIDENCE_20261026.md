# V4 Player GitHub Pages production cutover evidence

Date: 2026-10-26
Owner: CD
Authorization: `agent-comms/CA_to_CD_20261026T180000Z_v4-player-pages-cutover-teacher-approved.md`

## Authorized identities

- destination: `deploy/v4-player-first-20261026@627805636fd17df1e03ac485bef797ed82e9a42a`, `/(root)`
- preserved rollback: `deploy/ca285-batch-a-act10-20261023@d09f7c7be27fd521bb10328de434aca1bc676a2e`, `/(root)`

Both remote branch heads were re-read immediately before cutover and matched the authorization exactly. The authenticated Pages selector was also re-read as the rollback branch/root before the change.

## Production-safety check

A read-only Supabase check at `2026-10-26T08:45:34Z` found zero `runtime_events` and zero `s1_game_events` during the preceding 30 minutes. The latest runtime event was `2026-10-24T16:53:03Z`; the latest S1 event was `2026-10-24T15:38:47Z`. No active live use signal was present. No database or Storage mutation was made.

## Cutover

After explicit Teacher authorization transmitted by CA and action-time user confirmation, CD selected only `deploy/v4-player-first-20261026` with `/(root)` and clicked the Pages Save control once. GitHub returned `GitHub Pages source saved`, and the selector read back the exact candidate/root.

Pages workflow:

- run: `40294783800`
- head branch: `deploy/v4-player-first-20261026`
- head SHA: `627805636fd17df1e03ac485bef797ed82e9a42a`
- result: `completed / success`
- created: `2026-10-26T08:47:58Z`
- updated: `2026-10-26T08:49:07Z`

## Public byte readback

All files returned HTTP 200 from `https://meifeng202309-commits.github.io/GAL-Escape-Castle/`. Recomputed Git blob hashes matched the candidate exactly:

| Public file | Bytes | Public Git blob | Candidate blob |
| --- | ---: | --- | --- |
| `index.html` | 3182 | `5bfe31ba505d71a850f30620e830d707375aa639` | same |
| `src/game/app.js` | 74714 | `24278a3cb6dc93d3852b1817f303fca967a7dbb6` | same |
| `src/styles/app.css` | 12475 | `7d33bdec2fd8186fe3bd725c46790368d97f0836` | same |

The public Player page loaded with title `GAL Castle Escape` and rendered the V4 Scene, Action, Discussion, and Pocket regions, establishing that the production Player module executed.

## Read-only media smoke

Post-cutover `asset_resolve` returned `ok=true` and the expected public Storage paths for all four existing ACTIVE keys:

- `prop_gitte_castle_map`
- `prop_anna_diary_open`
- `prop_linda_watch_face`
- `prop_linda_watch_back`

Their public WebPs had already decoded at registry dimensions during candidate preflight. No asset, registry, or Storage write occurred during cutover or smoke.

## Disposition

Production cutover is verified. The rollback branch remains untouched and was not needed. Ownership returns to CA to coordinate the next Teacher ACT1–ACT14 human run. This evidence does not claim that human full-game run has occurred.

