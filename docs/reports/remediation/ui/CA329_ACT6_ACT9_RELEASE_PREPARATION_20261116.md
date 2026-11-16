# CA-329 ACT6/ACT9 release-preparation packet

UTC checkpoint: 2026-11-16T02:42:17Z  
Disposition: READY FOR SEPARATE RELEASE DECISION; no production execution authorized

## Frozen candidate

- Accepted implementation and verification baseline: `707414bacd3298e826eb1f049bdf9eb19c9dff55`.
- CA acceptance: CA-329 / `agent-comms/CA_to_CD_20261116T023941Z_ca329-act9-browser-acceptance.md`.
- Current branch contains no later changes to any payload file.
- Backend and isolated Asset Manager evidence: Actions `43790473810` — PASS.
- Actual Player Chromium evidence: Actions `43791745213` — PASS.

The production database reported by the last accepted release is through migration 075 (`20261114060753`). The candidate database sequence is therefore **076, then 077, then 078**; none is authorized for production by this packet.

## Exact database payload

| Order | File | Git blob | SHA-256 |
|---:|---|---|---|
| 1 | `database/076_act3_library_discovery_gate.sql` | `22b4a2b82b2fbc8705f25c754caf28c304c2fb30` | `b33308e796fa6637f42cc1cc23361448f2a94083960a8130afaca841cf3ea0bb` |
| 2 | `database/077_ga147_castle_voice_and_runtime_callers.sql` | `a5b45f0c624aa14344107e06b8e960f31b896a87` | `26adb9a02d1d47c7eb21124ece4e026883a9529831e8aa77e1f635c7383fb66d` |
| 3 | `database/078_ca327_castle_voice_phase_guard.sql` | `b3afcdee0e2a8842056c2843a8d4ed3927d5119c` | `15ce241b3be2311e3bfda139b777dba22634226c8fc321c79c04b119e8bc4512` |

076 is included because production 075 is the declared live migration baseline and the accepted disposable lifecycle ran the complete 001–078 sequence. 077 adds the canonical runtime callers and Castle Voice gate; 078 is the additive phase-entry correction and must follow 077.

## Exact ACT9 asset payload

| Asset key | Source WebP | Bytes | SHA-256 |
|---|---|---:|---|
| `shared.great_hall.red_first` v001 | `assets/staging/shared.great_hall.red_first/v001/shared.great_hall.red_first__v001.webp` | 2,017,766 | `af463e9ae529d5f7de8935f7e7794b4879cd2f15635d9617139fb52fb7ac9936` |
| `shared.great_hall.both_open` v001 | `assets/staging/shared.great_hall.both_open/v001/shared.great_hall.both_open__v001.webp` | 2,030,640 | `338bbed29fd64537741615e76f5ddd52f688263ae23c734de3ffb63b42381284` |

Source-sidecar blobs are respectively `49c910a063b4a8cd6438f1450553905ab7b0f20a` and `0cfe6e34b6dba2fb241fc5795b94f0094bc0f253`. The repository registry blob is `634a4b8987bef55956d2d5b06fea2e6b3aa43b12`; both variant entries deliberately remain source-only (`active_version: null`) until a separately authorized production Asset Manager transaction.

Pending production asset steps are: register the two exact v001 candidates, independently review/approve, upload the exact bytes to unique Storage paths, mark those exact hashes published, activate each key, and read back `asset_resolve` with the expected path/hash. Do not replace or deactivate `shared.great_hall`; it is the required fallback and anchor source.

## Exact Player Pages target

Publish these three files as one coherent Player release after the database and asset gates succeed:

| File | Git blob | Expected LF bytes | Expected public LF SHA-256 |
|---|---|---:|---|
| `src/game/app.js` | `6981045d67f821ae0a3fa24a57b036dd083d5988` | 88,142 | `551c0592cca985a04566022230335ab11d6ad5354e0b1e303e778a33abd53676` |
| `src/styles/app.css` | `6aca62f4f958d9c2c4c39cb08bb627534fd992af` | 17,668 | `09b97f7242e0223f23f5b78502856c0354a9f1faea4a1aae4ead202580fd2637` |
| `src/content/localization.generated.js` | `b4af2b78b413e8bfee75c23a2aef499f08e6920e` | 80,562 | `a0c2e9ce3c22e80de8541e5377fcb30081d864a5a990ffd047a9e1e2f00589ab` |

The protected localization catalog is a read-only provenance source, not a deployment payload. Tests, workflows, evidence, staging sidecars and `assets/asset-registry.json` are verification/source-governance inputs, not Pages files.

## Required release order and closure gates

1. Obtain the separate CA/Teacher production decision naming this frozen candidate and release window.
2. Fresh read-only preflight: production migration ledger at 075, activity/room safety gate, current function definitions/owners/ACLs, existing base Great Hall resolution, and recovery baselines.
3. Apply 076 → 077 → 078 in order; record migration receipts and read back exact function definitions, owner, security-definer posture and grants. Stop/recover on any mismatch.
4. Execute the two isolated Asset Manager publication/activation transactions with exact hashes; read back resolution and decode both public objects. Preserve the base key.
5. Publish only the three frozen Player files; require successful Pages run, exact head, HTTP 200 and the LF-normalized public hashes above.
6. Run bounded public smoke for ACT6 entry/Voice acknowledgement/vote/advance and ACT9 base/red-first/both-open/retry/refresh/fallback. Confirm labels and playable controls remain available and no unexpected browser/RPC errors occur.
7. Return migration, Asset Manager, Storage, Pages and smoke receipts to CA. Human trial resumption remains a CA/Teacher disposition.

## Protected boundaries

No change is authorized here to the canonical localization catalog, narrative specifications, asset authorship sidecars, approved WebP bytes, or other-role Action Logs. No SQL, Storage, Asset Manager, Pages, room, or gameplay mutation occurred during this preparation.
