# VA → CD — Four final placeholder-image replacements

Timestamp: 2026-10-04T10:36:58Z
From: VA
To: CD
Branch: `remediation/sprint9-structural-v1`

## Teacher decision processed

Teacher supplied/selected the four final artworks in the persistent VA chat and explicitly instructed VA to upload these photos through the normal asset workflow as far as VA authority permits.

VA therefore treated the current Teacher upload directive as the visual approval event, preserved the existing canonical asset identities, and created immutable v002 candidates replacing the four v001 placeholder candidates.

## APPROVED v002 candidates

| asset_key | canonical file | dimensions | SHA-256 |
|---|---|---:|---|
| `opening.gitte_room` | `assets/staging/opening.gitte_room/v002/opening.gitte_room__v002.webp` | 1024×576 | `0d3c53704bd34a333f5856fc150c19f729347f768e3ed3c65f66a171e875088b` |
| `opening.anna_room` | `assets/staging/opening.anna_room/v002/opening.anna_room__v002.webp` | 1024×576 | `625bdc565b2a88728e732916430fd9d256e7f2f02f8beb62edc79f535f25e0c2` |
| `opening.linda_study` | `assets/staging/opening.linda_study/v002/opening.linda_study__v002.webp` | 1024×678 | `456a8d3357c5bbf5109c400f1720c00b7708fe11c0f465146ad6c1d7ea6fcb56` |
| `ending.castle_exterior` | `assets/staging/ending.castle_exterior/v002/ending.castle_exterior__v002.webp` | 1024×576 | `03677f6e0fe0bebd3b91164088fbf92eec89df91566a811e32331dd56407429b` |

Matched JSON sidecars are in the same v002 directories.

Anna v002 is the Teacher-requested targeted correction: the candle is unlit and the warm candle glow is removed; the cold moonlight composition is otherwise preserved.

The user-supplied label `opening.Linda_room` was resolved to existing canonical key `opening.linda_study`; VA did not create or rename any asset identity.

## Registry state

For all four keys:
- `latest_version: 1 → 2`
- v002 sidecar status: `APPROVED`
- `teacher_review: APPROVED`
- `active_version` remains `null`

The v001 placeholder versions remain immutable historical candidates.

## CD next action / VA authority boundary

VA stops here. VA does **not** publish to live Supabase, assign runtime metadata, or promote ACTIVE.

CD / Asset Manager should:
1. re-read this handoff commit and all four v002 binary/sidecar pairs;
2. run Sprint9 integrity/readiness validation;
3. publish the approved v002 binaries to runtime storage;
4. set the unique ACTIVE versions under Asset Manager authority;
5. verify resolver/fallback/telemetry and that the four prior placeholder presentations no longer occur.

No GA/CA FYI broadcast is requested; Protocol V4 Minimum Necessary Recipient applies.
