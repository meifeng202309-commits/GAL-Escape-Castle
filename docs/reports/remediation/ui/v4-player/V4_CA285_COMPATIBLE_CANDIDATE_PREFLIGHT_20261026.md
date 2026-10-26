# V4 Player candidate — live CA285 compatibility reconciliation

Date: 2026-10-26
Owner: CD
Authorization: `agent-comms/CA_to_CD_20261026T173000Z_v4-live-ca285-baseline-reconciliation.md`

## Candidate identity

- immutable live/rollback branch: `deploy/ca285-batch-a-act10-20261023`
- immutable live/rollback SHA: `d09f7c7be27fd521bb10328de434aca1bc676a2e`
- candidate branch: `deploy/v4-player-first-20261026`
- candidate SHA: `627805636fd17df1e03ac485bef797ed82e9a42a`
- common ancestor used for reconciliation: `891feffe558a4683ac3da67e1e6b15e902c7e592`

No Pages source was switched. No production deployment, database/Storage write, asset mutation, Teacher edit, or real-room action occurred.

## Three-way compatibility result

The candidate starts at the exact live CA285 SHA. Git object-level three-way comparison of `src/game/app.js` used live blob `05735b4fd16f5f8c5045995fc485930a95d68bd9`, common-ancestor blob `cedfa672057324c31e90a045db49c7b79a5742da`, and tested V4 blob `24278a3cb6dc93d3852b1817f303fca967a7dbb6`.

Six localized conflicts were reviewed. They were all V4 presentation/lifecycle additions layered on CA285 behavior: composition deferral; Discussion/Pocket mount relocation; transcript viewport and acknowledged-send preservation; and the corresponding send-clear path. The resulting candidate retains CA285's serialized polling coordinator, session epoch/generation invalidation, projection order, all-or-nothing frame commit, mutation disabling on refresh failure, `teacher_open_required` vote gate, and the live Teacher file byte-for-byte.

Only the approved three files differ from live CA285:

| File | Candidate blob | Tested V4 blob | Delta from live |
| --- | --- | --- | --- |
| `index.html` | `5bfe31ba505d71a850f30620e830d707375aa639` | same | 9 insertions / 10 deletions |
| `src/game/app.js` | `24278a3cb6dc93d3852b1817f303fca967a7dbb6` | same | 40 insertions / 14 deletions |
| `src/styles/app.css` | `7d33bdec2fd8186fe3bd725c46790368d97f0836` | same | 5 insertions |

`src/teacher/teacher-console.js` has no delta from live CA285. Candidate worktree was clean after commit.

## Validation

Candidate-root checks:

- PASS — V4 Player integration static
- PASS — A1 Player polling static
- PASS — Sprint 5 static
- PASS — Structural Package D static
- PASS — A1 Player polling browser
- PASS — CA284 ACT10 Teacher Open Vote browser routing
- PASS — integrated real-runtime browser gate: three Players, ACT10 messages and exactly one Teacher Open Vote, ACT3 single submit/inspect/flip, IME/draft/reconnect behavior, 1366×768 and 1280×720 layouts, six screenshots, no horizontal overflow

Canonical-policy checks from the coordination branch:

- PASS — CA284 ACT10 Teacher Open Vote static
- PASS — CA284 ACT10 Teacher Open Vote policy

The CA284 static script could not run from the sparse live-derived candidate tree because that published branch does not contain `database/072_ca284_act10_teacher_open_vote.sql`; the actual candidate browser routing passed, and the same static/policy checks passed against the canonical coordination sources. This is recorded as a packaging-boundary NOT_RUN, not a product failure.

## Four canonical media keys — read-only online check

Supabase `asset_resolve` was queried read-only, then each public object was loaded directly in a browser and decoded:

| Key | Resolution | Storage object | Decoded dimensions |
| --- | --- | --- | --- |
| `prop_gitte_castle_map` | ok, v1 | `game-assets/prop_gitte_castle_map/v001/prop_gitte_castle_map__v001.webp` | 1447×1087 |
| `prop_anna_diary_open` | ok, v1 | `game-assets/prop_anna_diary_open/v001/prop_anna_diary_open__v001.webp` | 2048×1282 |
| `prop_linda_watch_face` | ok, v1 | `game-assets/prop_linda_watch_face/v001/prop_linda_watch_face__v001.webp` | 448×613 |
| `prop_linda_watch_back` | ok, v1 | `game-assets/prop_linda_watch_back/v001/prop_linda_watch_back__v001.webp` | 792×1024 |

No database or Storage write was made.

## Release boundary

Candidate construction and non-mutating preflight are complete. Exact rollback remains the unchanged live branch `deploy/ca285-batch-a-act10-20261023@d09f7c7be27fd521bb10328de434aca1bc676a2e`. Pages cutover remains forbidden until separate CA authorization.

