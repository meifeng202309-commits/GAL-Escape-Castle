# CA-330 ACT3/ACT6/ACT9 corrected release-preparation packet

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

The supported `asset_manager_sync_registry` helper does not accept a two-row partial projection: after upserting its input it requires the input count to equal the entire projection count. The release payload therefore uses the complete 30-entry `assets[]` from `assets/asset-registry.json` while changing exactly these two canonical fields:

```diff
 shared.great_hall.red_first: active_version null -> 1
 shared.great_hall.both_open: active_version null -> 1
```

- Pre-authorization registry blob/hash: `634a4b8987bef55956d2d5b06fea2e6b3aa43b12` / `edd598c8f586baf3fd1c28d811421be1414b401f3011ed24ad224a3fdbf4a170`.
- Planned registry blob/hash: `b2e55afecfb34692d4bb2167fe84c59295a29c7e` / `dd8c4a692bea7c6575b4bd76865e5a4cf336f45786fbd78e2fe9c2fc8dc20ee2`.
- Exact semantic diff: two deletions and two insertions; every non-variant asset field and the base `shared.great_hall` row are unchanged.

Before sync, capture an ordered JSON snapshot of every live `asset_registry_projection` row, both variant candidate histories, both variant events, and the base Great Hall resolver result. The accepted starting state is either (a) both variant projection rows absent, or (b) both rows exactly match the pre-authorization registry with `latest_version=1`, `active_version=null` and no conflicting v001 candidate. All existing unrelated keys and semantic fields must exactly match the pre-authorization complete registry. Require one current registry hash across the existing projection, the expected key count for the observed starting state, base resolution unchanged, and no existing `(variant key, version 1)` candidate. Any extra/missing unrelated key, field drift, mixed registry hash, candidate conflict, or base-resolution mismatch is a hard STOP for CA review.

Call `asset_manager_sync_registry` once with the full planned 30-entry `assets[]` and registry SHA-256 `dd8c4a...20ee2`. Read back all 30 rows and compare every semantic field to the full planned payload. The helper necessarily refreshes `registry_sha256` and `projected_at` on all rows; the separate production decision must explicitly accept this metadata-only full-projection refresh. No unrelated semantic field may change.

Then register the two exact v001 candidates, independently review/approve, upload the exact bytes to unique Storage paths, mark those exact hashes published, and activate each key. Verify `asset_resolve` returns the requested key, version `1`, and exact unique path. Because the resolver does not return a digest, download/read back each published object from its resolved path and require the exact SHA-256 above before Player publication. Re-resolve `shared.great_hall` and require its key/version/path and object bytes to remain unchanged.

Scoped recovery uses the same supported helper with a complete 30-row recovery payload whose only difference is both variant `active_version:null`. This immediately makes both variant resolvers return no active asset while preserving the live base hall and every unrelated semantic row. Candidate/event records and uploaded objects remain as audit evidence; they are not deleted. Read back both disabled resolvers, the unchanged base resolver, and all unrelated semantic rows. If the helper cannot restore this state exactly, stop for CA rather than using direct table edits.

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
6. Run bounded public smoke for ACT6 entry/Voice acknowledgement/vote/advance and ACT9 base/red-first/both-open/retry/refresh/fallback. Confirm labels and playable controls remain available and no unexpected browser/RPC errors occur.
7. Return migration, Asset Manager, Storage, Pages and smoke receipts to CA. Human trial resumption remains a CA/Teacher disposition.

## Protected boundaries

No change is authorized here to the canonical localization catalog, narrative specifications, asset authorship sidecars, approved WebP bytes, gameplay code, or other-role Action Logs. The only source authorization delta is the two-field registry change above. No SQL, Storage, Asset Manager, Pages, room, or gameplay mutation occurred during this preparation.
