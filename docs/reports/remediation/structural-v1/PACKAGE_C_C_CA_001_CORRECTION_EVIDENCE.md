# Package C C-CA-001 bounded correction evidence

Timestamp (UTC): `2026-09-29T04:23:10Z`

Branch: `remediation/sprint9-structural-v1`

## Corrected contract

- Pocket item inspection is now an explicit server-authoritative action.
- Inspection state is persisted per run/player/item and returned by `s3_get_player_state`, so reconnect restores opened items.
- Carrying an item alone does not unlock its internal knowledge.
- Flip is rejected until the holder has explicitly inspected the item.
- Item ownership is verified server-side before inspection.
- New knowledge uses existing provenance authority with `source = pocket_inspection` and the physically owned source item.

Migration `068_package_c_authoritative_pocket_inspection.sql` was deployed successfully through the Supabase SQL editor. Execution returned `Success. No rows returned`.

## Canonical inspect content

- Gitte Castle Map: canonical route information.
- Gitte Number Note front: exact `4 – 1 – 7 – 3 – 9` (`41739`).
- Gitte Number Note back: `★`, revealed only after an actual FLIP.
- Anna Servant Diary: canonical heating-passage/snake rule.
- Linda Stopped Watch: `23:49`; back reminder appears only after inspection and FLIP.
- Linda Municipal Closure Order: canonical title/date and full unsafe-masonry/venomous-snakes reason.
- Silver Key and discovered Flashlight retain their canonical inspect text.

All displayed content uses existing canonical localization keys. No new canonical prose was invented.

## Live evidence

`node tests/structural-package-c-live-e2e.js`: PASS

- room: `PBMUM5UNGA3QRB`
- Number Note was carried but initially absent from `inspected_item_keys`.
- Carrying it did not create `gitte_number_code` or `gitte_star_symbol` knowledge.
- inspecting another player's Diary was rejected.
- FLIP before inspect was rejected.
- Number Note inspect persisted and created only `gitte_number_code`.
- its front inspect did not unlock the back `★`.
- actual FLIP persisted the back view and created `gitte_star_symbol`.
- Diary inspect persisted and recorded `anna_snake_rule`.
- Closure Order inspect persisted and recorded `linda_tower_reason`.
- Watch inspect/FLIP persisted and recorded `linda_watch_reminder`.
- Linda inspect/view state survived transition and reconnect at ACT9.

## Required regressions

- Package A bounded live regression: PASS.
- Package B live regression: PASS, room `PBMUM5VDJ2IQ3U`.
- Sprint3A authority/provenance live regression: PASS, 15 checks.
- Package A/B/C static checks: PASS.
- Sprint3A, Sprint3B remediation, Sprint5, and Sprint6 static checks: PASS.
- JavaScript parse and `git diff --check`: PASS.

## Scope boundary

Only Package C C-CA-001 and directly affected tests were corrected. Package B behavior was preserved. Package D was not started.
