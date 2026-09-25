# VA -> CD — Sprint9 legacy visual binary-ingestion handoff

FROM: VA
TO: CD
TIMESTAMP_UTC: 2026-09-25T17:52:07Z
SUBJECT: Legacy visual source recovery complete; mechanical binary ingestion requires CD-side execution/routing
STATUS: BLOCKED_NEEDS_CD_ACTION

## Why this handoff is necessary

VA completed the legacy-source reconciliation requested for Sprint9 and recovered the original Project Library bytes for the old visual candidates below.

The current VA execution surface can materialize the recovered raw files locally, but the local-file -> Library/GitHub binary bridge is currently failing with:

`container_session_expired`

GitHub text writes and reuse of existing Git blobs remain functional. VA therefore completed all repo-side repairs that do not require new binary transport and is transferring only the remaining mechanical binary-ingestion step to CD, the Sprint9 final integration owner. CD may execute it directly or route it to an authorized bounded support lane if appropriate.

This handoff does **not** transfer visual semantics, Teacher approval authority, asset identity authority, or ACTIVE/publication authority.

## Already closed by VA

Commit:

`d0f41ca094bbcd1d97c49bfd536f51641cc471a6`

VA created immutable v002 successors for:

- `shared.library`
- `shared.clock_room`
- `shared.great_hall`

The exact already-approved v001 WebP blobs were reused unchanged; validator-required `ui_anchors` were added; Registry `latest_version` advanced 1 -> 2; existing `active_version` values were preserved.

## Recovered legacy sources — approval state is already resolved

These must **not** be sent back for duplicate Teacher approval:

| asset_key | Library source | recovered source SHA-256 | Teacher state |
|---|---|---|---|
| `prop_linda_watch_face` | `08 怀表正面(2).png` | `b34d3a95a2596d02b12de22d054d141d90d49c05956bd3d49f52d8833dc78ff8` | APPROVED / user explicitly requested 入库 |
| `prop_linda_watch_back` | `09 怀表背面.png` | `0bde446decbd5cdd4db12088723af1d616a2139cb2bf119b2d21c3b6e2b8d290` | APPROVED / user explicitly said No.8+No.9 可以入库 |
| `prop_linda_closure_order` | `10 政府公告纸.png` | `938f58e751c4680bc0582f0c7a991cc4a60240a3b2ecf8a2cc424eae049b153c` | APPROVED / user explicitly accepted staging |
| `prop_linda_star_key` | `11 钥匙.png` | `aa7d04f41bca8f8d031304a11091c79941356af5d22ca0938762531b56be38a2` | APPROVED / user explicitly accepted pending staging |
| `prop.golden_key` | `20 金钥匙.png` | `ff53c291ab8c99b715a69cba5423e493a0eaf8a8b2a6aa94e0a43b4eca57e73e` | APPROVED / current VA Action Log VA-008 |

Required mechanical operation for each:
1. convert the recovered source to a valid WebP without semantic/content redesign;
2. create canonical v001 filename + sidecar;
3. preserve exact asset_key;
4. set `status=APPROVED`, `teacher_review=APPROVED`;
5. advance Registry `latest_version 0 -> 1`;
6. leave `active_version` unchanged;
7. verify dimensions/SHA/path/blob/non-zero bytes.

## Recovered legacy sources — Teacher review still genuinely required

These old files exist, but no explicit Teacher approval was recovered:

| asset_key | Library source | recovered source SHA-256 | required state |
|---|---|---|---|
| `prop.photo_1897` | `13 1897年老照片.png` | `7648fbfb088da6523e55b7223ce6e02c85c258ee4da38eeb84aa5d7300b6b3ce` | stage as PENDING_REVIEW only; paired review with `shared.west_tower_payoff` |
| `prop.library_clock_clue_note` | `14 碎纸片.png` | `fe3c3c0927c2e9973bde312c5e15d601f7ebac06d9356103225c394d0ffcf82e` | stage as PENDING_REVIEW only |

Do not self-promote either to APPROVED.

## Main Gate integrity repair

The exact Teacher-approved source has been recovered:

`21 大门.png`

Recovered source SHA-256:

`ddc02862a0bbd9427ce5c1a050f55a429d27cd481ba9ce7a48fe726cc1d015bf`

This exactly matches `shared.main_gate/v001` sidecar `source_png_sha256`, proving source identity.

Create an immutable **v002** repair successor; do not overwrite corrupt v001.

Required `ui_anchors` for v002 candidate:

```json
[
  {"anchor_name":"main_gate_station_A","x_percent":3.0,"y_percent":49.0,"width_percent":27.0,"height_percent":31.0},
  {"anchor_name":"main_gate_station_B","x_percent":68.0,"y_percent":52.0,"width_percent":20.0,"height_percent":25.0},
  {"anchor_name":"main_gate_station_C","x_percent":79.0,"y_percent":54.0,"width_percent":20.0,"height_percent":28.0},
  {"anchor_name":"main_gate_watcher_corridor","x_percent":37.0,"y_percent":46.0,"width_percent":31.0,"height_percent":48.0}
]
```

Preserve APPROVED / Teacher-approved semantics; advance Registry `shared.main_gate.latest_version 1 -> 2`; do not promote ACTIVE.

## Portrait Hall reconciliation result

`shared.portrait_hall` + `overlay.portrait_eyes_open` are **not legacy-approved debt**.

Old generation attempts did not establish a compliant approved base/overlay pair. They remain genuine unfinished production work and must not be silently migrated as approved.

## Requested CD action

Perform or route the **mechanical binary-ingestion/staging step only** for the recovered sources above, then:

1. run `node tools/sprint9-asset-readiness-validator.mjs --mode integrity`;
2. run readiness mode;
3. return the staged commit/baseline to VA if the two PENDING_REVIEW candidates require Teacher review, or continue normal CD publication/integration for already-approved coherent candidates under existing authority.

No new product decision and no duplicate Teacher approval is required for the five already-approved legacy assets or the Main Gate transport repair.
