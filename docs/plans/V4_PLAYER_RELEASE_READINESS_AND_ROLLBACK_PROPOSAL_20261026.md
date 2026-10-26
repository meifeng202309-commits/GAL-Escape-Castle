# V4 Player release readiness and rollback proposal

Date: 2026-10-26  
Status: planning only; no release authority exercised  
Tested source: `d77689f5512cdc54bfe198d578aca07f6d5deb56`

## Release selection

Do not point Pages at the moving remediation branch. After separate CA authorization, create a new candidate from frozen Pages rollback `deploy/manual-acceptance-20261003@891feffe558a4683ac3da67e1e6b15e902c7e592`, root, and overlay exactly these tested blobs from `d77689f`:

| Deployable file | Target Git blob |
|---|---|
| `index.html` | `5bfe31ba505d71a850f30620e830d707375aa639` |
| `src/game/app.js` | `24278a3cb6dc93d3852b1817f303fca967a7dbb6` |
| `src/styles/app.css` | `7d33bdec2fd8186fe3bd725c46790368d97f0836` |

Suggested candidate name: `deploy/v4-player-first-20261026` (not created by this planning task). The candidate commit must be recorded after construction and must reproduce these three blobs exactly.

This excludes tests, screenshots, plans, Action Logs, pilot files, migrations, Teacher source and all other remediation-branch changes. The direct imported Player dependencies (`scenes.js`, localization, asset runtime, session, Supabase client/config and HTML helper) are byte-unchanged between `891feffe` and `d77689f`; all four tracked map/diary/watch WebPs already exist at the rollback commit. Nevertheless, the candidate is a new three-file composition and must pass the focused browser/static suite before cutover; do not claim it is already equivalent merely because its component blobs were tested.

## Current deployment and prerequisites

Last canonical repository/operator evidence identifies Pages as `deploy/manual-acceptance-20261003@891feffe558a4683ac3da67e1e6b15e902c7e592`, `/(root)`. CD did not query or change the live Pages selector in this planning task. Release preflight must confirm that exact branch/folder and current successful workflow before constructing or selecting the candidate.

Canonical media is runtime-resolved from the current asset service/Storage, not from repository staging files. Before cutover, perform read-only checks for:

- `prop_gitte_castle_map`
- `prop_anna_diary_open`
- `prop_linda_watch_face`
- `prop_linda_watch_back`

Each must resolve an ACTIVE version with the expected image MIME/path, return HTTP 200 and decode with positive natural dimensions. Any missing/ambiguous resolver result, Storage failure or unexpected MIME is a STOP; this proposal authorizes no publication, activation or Storage write.

## Minimal pre-release and post-cutover checks

1. On the clean candidate, rerun V4 static checks plus integrated local three-Player/Teacher ACT10 and ACT3 gate at 1366x768 and 1280x720, including healthy canonical media geometry.
2. Record candidate commit and exact three public SHA/blob identities; require Pages workflow success.
3. After a separately authorized switch, verify public `index.html`, `src/game/app.js` and `src/styles/app.css` are HTTP 200 and byte-identical to the candidate. Confirm root module load has no browser error, both desktop widths have no horizontal overflow, and all four canonical media resolve/decode.
4. Use only a separately authorized disposable smoke room for join/reconnect, ACT10 message/IME/Open Vote and ACT3 Pocket flip. Otherwise leave gameplay validation to Teacher's next full-game trial; do not touch an existing room.

STOP on candidate hash drift, failed workflow/public byte proof, module error, resolver/decode failure, missing primary control, horizontal overflow, or any need for SQL/Storage/Teacher changes.

## Rapid rollback

Keep `deploy/manual-acceptance-20261003@891feffe558a4683ac3da67e1e6b15e902c7e592` unchanged. On any authorized-release acceptance failure, the authenticated Pages operator selects exactly that branch and `/(root)` and saves once. Wait for the rollback workflow, then verify the rollback commit and public bytes before declaring recovery. Because this package is source-only, do not run SQL recovery or alter Storage/assets. Preserve failure evidence and stop; do not retry the candidate without a new CA gate.

