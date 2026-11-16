# CA-334 ACT3/ACT6/ACT9 reconciled release-preparation packet

UTC checkpoint: 2026-11-16T02:42:17Z  
Disposition: READY FOR SEPARATE RELEASE DECISION; no production execution authorized

## Frozen candidate

- Accepted gameplay implementation and verification baseline: `707414bacd3298e826eb1f049bdf9eb19c9dff55`.
- CA-330 registry authorization delta: only the two ACT9 variant `active_version` values change from `null` to `1`; accepted WebPs and gameplay code are byte-identical.
- CA acceptance: CA-329 / `agent-comms/CA_to_CD_20261116T023941Z_ca329-act9-browser-acceptance.md`.
- Current branch contains no later changes to the accepted SQL, Player, localization or WebP payloads; the separately identified CA-330 registry authorization delta is the only new payload change.
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

Source-sidecar blobs are respectively `49c910a063b4a8cd6438f1450553905ab7b0f20a` and `0cfe6e34b6dba2fb241fc5795b94f0094bc0f253`.

## Exact registry authorization and full-projection sync

The effective helper is the 024 definition of `asset_manager_sync_registry`. It verifies the SHA-256 of UTF-8 PostgreSQL `p_assets::text` and deletes every projection row omitted from the input. A two-row call would therefore delete all unrelated registry authority. The release payload uses the complete 30-entry `assets[]` from `assets/asset-registry.json`. CA-334 reconciles the six previously approved CA-287 audio activations into canonical source; relative to the live 28-row projection, the only planned production activation changes remain these two fields:

```diff
 shared.great_hall.red_first: active_version null -> 1
 shared.great_hall.both_open: active_version null -> 1
```

- Planned registry blob/source-file SHA-256: `f30cca9376ac5764543e5da3e27ef4cfef0f6d1c` / `de2a2fc0583bbb668c596cf83a97abd69256b54ea70481b31071cfd2eba31bf9`.
- Apply RPC digest over exact PostgreSQL JSONB `p_assets::text`: `e6377e86a2c17bca5b8c6ed1df419f66180709cff3ae910599b6ff3e68f7a5bc`.
- Recovery RPC digest over the same complete array with only the two variant active versions set to JSON null: `f0af1f8828947a240bbdc6424ca902855eb85d7c9122b1792c7f907ac8eab853`.
- Exact semantic diff: two deletions and two insertions; every non-variant asset field and the base `shared.great_hall` row are unchanged.

Before sync, capture an ordered JSON snapshot of every live `asset_registry_projection` row, both variant candidate histories, both variant events, the base Great Hall resolver and all six approved audio resolvers. The accepted starting state is the observed 28-row/single-digest projection with both variant rows absent, the base at v002, and audio versions gate-opening 2, mechanism-clang 2, old-alarm-bell 2, snake-hiss-short 1, snakes-approaching 2 and wet-scraping 1. All existing 28 semantic rows must match the reconciled source. Require no existing `(variant key, version 1)` candidate. Any extra/missing key, field drift, mixed registry hash, candidate conflict, base mismatch or audio key/version/path mismatch is a hard STOP for CA review.

Call `asset_manager_sync_registry` as `service_role`, passing the enabled independent reviewer token, the full planned 30-entry `assets[]`, and RPC digest `e6377e86...f7a5bc`. Do **not** pass source-file digest `de2a2fc0...31bf9`; the disposable rehearsal proves the current helper rejects it with `Registry content hash mismatch`. Read back all 30 rows and compare every semantic field to the full planned payload. The helper necessarily refreshes `registry_sha256` and `projected_at` on all rows; the separate production decision must explicitly accept this metadata-only full-projection refresh. No unrelated semantic field, including the six audio versions, may change.

The supported lifecycle sequence is exact: `service_role` calls `asset_manager_import_candidate` separately for each key (025 revoked old `asset_manager_register_candidate`), then `asset_manager_submit_for_review`; an enabled independent reviewer calls `asset_manager_review(...,'APPROVED',...)`; after exact-byte Storage upload, `service_role` calls `asset_manager_mark_published`; finally `service_role` calls `asset_manager_activate_group(reviewer_token, ARRAY[asset_id])` once per key. Both variants are unpaired, so each activation array must contain exactly one candidate. Verify candidate status `ACTIVE`, projection `active_version=1`, and `asset_resolve` requested key/version `1`/exact unique path. Because the resolver does not return a digest, download/read back each published object from its resolved path and require the exact SHA-256 above before Player publication. Re-resolve `shared.great_hall` and require its key/version/path and object bytes to remain unchanged.

Scoped recovery uses the same supported 024 helper as `service_role`, the complete 30-row recovery payload, and RPC digest `f0af1f88...eab853`; its only semantic difference is both variant `active_version:null`. This immediately makes both variant resolvers return no active asset while preserving the live base hall, all six active audio resolutions and every unrelated semantic row. Candidate/event records and uploaded objects remain as audit evidence; they are not deleted. Read back both disabled resolvers, the unchanged base/audio resolvers, and all unrelated semantic rows. If the helper cannot restore this state exactly, stop for CA rather than using direct table edits.

Disposable Actions run `43867292133`, job `133298999040`, applied migrations 001–078 and passed the reconciled complete 30-row apply/recovery transaction. It seeded an ACTIVE base Great Hall, all six approved audio candidates with their production key/version/path/hash identities, and an unrelated projection row; rejected the revised Git source-file digest; exercised the effective lifecycle for both variants; preserved every base/audio resolution through apply and recovery; disabled both variants on recovery and preserved the unrelated semantic row. The whole rehearsal rolled back.

## Exact Player Pages target

Publish these three files as one coherent Player release after the database and asset gates succeed:

| File | Git blob | Expected LF bytes | Expected public LF SHA-256 |
|---|---|---:|---|
| `src/game/app.js` | `6981045d67f821ae0a3fa24a57b036dd083d5988` | 88,142 | `551c0592cca985a04566022230335ab11d6ad5354e0b1e303e778a33abd53676` |
| `src/styles/app.css` | `6aca62f4f958d9c2c4c39cb08bb627534fd992af` | 17,668 | `09b97f7242e0223f23f5b78502856c0354a9f1faea4a1aae4ead202580fd2637` |
| `src/content/localization.generated.js` | `b4af2b78b413e8bfee75c23a2aef499f08e6920e` | 80,562 | `a0c2e9ce3c22e80de8541e5377fcb30081d864a5a990ffd047a9e1e2f00589ab` |

The protected localization catalog is a read-only provenance source, not a deployment payload. Tests, workflows, evidence, staging sidecars and `assets/asset-registry.json` are verification/source-governance inputs, not Pages files.

## Required release order and closure gates

1. Obtain the separate CA/Teacher production decision naming the ACT3/ACT6/ACT9 frozen payload, complete-registry metadata refresh and release window.
2. Fresh read-only preflight: production migration ledger at 075, activity/room safety gate, current function definitions/owners/ACLs, full registry/candidate/event snapshot, existing base Great Hall resolution, and recovery baselines.
3. Apply 076 → 077 → 078 in order; record migration receipts and read back exact function definitions, owner, security-definer posture and grants. Stop/recover on any mismatch. Migration 076 is the ACT3 Library Box discovery change.
4. Sync the full 30-row authorized registry projection, then execute the two Asset Manager publication/activation transactions; verify key/version/path plus downloaded object SHA-256 and preserve the base key.
5. Publish only the three frozen Player files; require successful Pages run, exact head, HTTP 200 and the LF-normalized public hashes above.
6. Run bounded public smoke for ACT3 Library Box code `41739`, the `library_discovery/box_opened` scene, all three discovery acknowledgements and the supported next transition; ACT6 entry/Voice acknowledgement/vote/advance; and ACT9 base/red-first/both-open/retry/refresh/fallback. Confirm labels and playable controls remain available and no unexpected browser/RPC errors occur.
7. Return migration, Asset Manager, Storage, Pages and smoke receipts to CA. Human trial resumption remains a CA/Teacher disposition.

## Protected boundaries

No change is authorized here to the canonical localization catalog, narrative specifications, asset authorship sidecars, approved WebP bytes, gameplay code, or other-role Action Logs. The only source authorization delta is the two-field registry change above. No SQL, Storage, Asset Manager, Pages, room, or gameplay mutation occurred during this preparation.
