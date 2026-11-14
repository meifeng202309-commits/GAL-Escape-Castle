# VA — Teacher-approved image batch: master record and binary-staging blocker

**Status as of:** 2026-11-14T11:52:00Z  
**Role:** VA (persistent)  
**Scope:** all visual images approved/processed in the current replacement batch; **not** a runtime release or CD implementation handoff.  
**Source precedence:** Asset Registry `assets/asset-registry.json`; actual Git blobs and approved sidecars; current Teacher directions; other records below.  
**Teacher approval:** all listed visual content is approved. No second artistic review is requested.

## A. Accounting and lifecycle definitions

- **12 distinct approved visual images**, including the revised MASTER-03 image that is reused *byte-for-byte* for both the non-runtime master reference and the runtime Castle Map candidate.
- **2 image identities have successfully staged new binary candidates on GitHub:** Linda watch back v002 and Castle Map v002. The latter additionally updates one non-runtime MASTER-03 reference file, so **3 GitHub binary paths** are involved in those 2 image identities.
- **10 other approved images are locally prepared only**, comprising **6 immutable replacement candidates** and **4 supplemental scene-state images**; their WebP binaries and sidecars have **not** reached GitHub.
- `Teacher APPROVED` ≠ GitHub `STAGED` ≠ runtime `ACTIVE`. Preserve every previous version, current `active_version`, and currently used scene. Do not imply successful deployment.
- Legacy temporary table's "Unresolved mappings: none" is **not accurate for new variants**: base scene identities are identified, but new full-frame variant selection contracts and UI anchors require authorized CD/GA resolution.

### A1. Already GitHub-staged (2 image identities; 3 binary paths)

| # | Approved source / purpose | Canonical reference and staged asset | Evidence/status | Next action |
|---|---|---|---|---|
| 1 | `五角星雕刻复古怀表.png`, replacing `09 怀表背面.png` | `prop_linda_watch_back` **v002**, `assets/staging/prop_linda_watch_back/v002/prop_linda_watch_back__v002.webp` | GitHub staged; sidecar `APPROVED`; SHA-256 `8e37cff45a269c87577ab339bb95d177b68c84a20c846617b8ab9370506ebab5`; Registry `latest_version=2`, `active_version=null`. Old v001 retained. | CD publication/resolution/activation only upon authorized runtime workflow; prior handoff `VA_to_CD_20261113T132900Z_prop-linda-watch-back-v002-approved-replacement-handoff.md` exists. |
| 2 | `MASTER-03 revised.png`, revised Castle Map | Non-runtime `assets/masters/MASTER-03/MASTER-03-reference.webp` **and** runtime `prop_gitte_castle_map` **v002** at `assets/staging/prop_gitte_castle_map/v002/prop_gitte_castle_map__v002.webp` | GitHub staged; both are byte-identical WebP, SHA-256 `428ec257d67493b30f5821ae3b56e3b63840b587a1242f0eb9c07248a8623f83`. Registry `latest_version=2`, `active_version=null`; old candidate/history preserved. | CD publishes runtime v002 and checks map overlay/highlight; non-runtime master is already updated. |

### A2. Approved but NOT uploaded as GitHub image blobs (10 images)

For the exact WebP staging paths and binary SHA-256, consult `docs/tmp files/VA_BATCH_IMAGE_BINARY_STAGING_STATUS_20261114.json`. All paths below are **intended destinations**, NOT existing GitHub files.

| # | Teacher-approved image / source | Canonical identity or intended variant | Candidate status | Required meaning and precautions |
|---|---|---|---|---|
| 3 | `10 政府公告纸 revised.png` | `prop_linda_closure_order` v002 | local WebP + JSON only; Registry latest 1 / active null | Teacher chose option B: readable complete Dutch notice printed on image. **No duplicate text overlay**; preserve summary-before-deep-read timing. |
| 4 | `写着密码的纸-擦除了数字 正面 revised.png` | `prop_gitte_number_note_front` v002 | local only; Registry latest 1 / active null | `41739` is already printed in image. **No duplicate UI digits**; pair with back. |
| 5 | `写着密码的纸-擦除了数字 背面 revised.png` | `prop_gitte_number_note_back` v002 | local only; Registry latest 1 / active null | `★` is already printed; **no duplicate UI symbol**; preserve front/back flip logic. |
| 6 | `19世纪末风格日记本生成 俯视图 revised.png` | `prop_anna_diary_open` v002 | local only; Registry latest 1 / active null | Dutch diary text embedded in image; **no duplicate UI text overlay**. |
| 7 | `12 图书馆-2nd scene.png` | supplemental variant under `shared.library` (proposed `hidden_door_ajar`) | local only; base Registry latest 2 / active **1**, unchanged | Teacher use: **图书馆场景内丢失情节用**. Hidden back-wall small door half-open with blue light; **keep base library image unchanged**. Runtime identity/selection mapping must be confirmed, not assumed. |
| 8 | `密码箱中的碎纸条 revised.png` | candidate `prop.library_clock_clue_note` v002 | local only; Registry latest 1 / active null | Teacher use verbatim: **图书光场景丢失情节-字条**. Dutch clock clue is printed on paper; **no duplicate overlay**; verify game narrative placement before displaying. |
| 9 | `21 大门 revised.png`, replacing `21 大门.png` | `shared.main_gate` v003 | local only; Registry latest 2 / active null | Stone-engraved A, B, C integrated in artwork; **CD 不需要再叠加说明文字**. Recheck A/B/C station and watcher corridor anchors due to changed composition. |
| 10 | `19 三扇门-red door opened.png` | supplemental `shared.great_hall` state `red_first` | local only; base Registry latest 2 / active null | Exact Teacher condition: **to be used when red door is opened first**. Preserve base, blue/black-door behavior. |
| 11 | `19 三扇门-blue door opened.png` | supplemental `shared.great_hall` state `blue_first` | local only; base unchanged | Exact Teacher condition: **to be used when blue door is opened first**. Preserve base, red/black-door behavior. |
| 12 | `19 三扇门-both doors opened.png` | supplemental `shared.great_hall` state `both_open` | local only; base unchanged | Exact Teacher condition: **to be used when both red/blue doors are opened**. Black door unchanged. |

**Important:** Great Hall V4.0 currently describes door-state visual control as UI-owned. These new, Teacher-approved full-frame variants may require reconciliation with the existing state/overlay mechanism. Approval of the images does **not** unilaterally authorize changing the gameplay or asset contract.

## B. Complete pending GitHub binary staging index

| Key / variant | Target path (not yet pushed) | WebP SHA-256 |
|---|---|---|
| `prop_linda_closure_order` v002 | `assets/staging/prop_linda_closure_order/v002/prop_linda_closure_order__v002.webp` | `c1b3b9dc7f8b3d39f18de0e5306fd42be592b2aed7efae5484a2a2788b9a06fd` |
| `prop_gitte_number_note_front` v002 | `assets/staging/prop_gitte_number_note_front/v002/prop_gitte_number_note_front__v002.webp` | `4ce14eff58783665f6fcbe5626fc8afe62b87b1a1a1d8a38f261161b2be88402` |
| `prop_gitte_number_note_back` v002 | `assets/staging/prop_gitte_number_note_back/v002/prop_gitte_number_note_back__v002.webp` | `61a57c7937444bca85c2a1a0e3def5213f480c612dbd9214553322a3402e7fd0` |
| `prop_anna_diary_open` v002 | `assets/staging/prop_anna_diary_open/v002/prop_anna_diary_open__v002.webp` | `c4373391c48cadce8cb1baca1019466e603618a3d0c76bd2558629ce39f2cc37` |
| `prop.library_clock_clue_note` v002 | `assets/staging/prop.library_clock_clue_note/v002/prop.library_clock_clue_note__v002.webp` | `5f4998c57e51a147b414714860307785230276bae41c49e951c2a42c581f8f93` |
| `shared.main_gate` v003 | `assets/staging/shared.main_gate/v003/shared.main_gate__v003.webp` | `f68ea8c1f86a1fa3345fbb2e7842fd34e8e66c1256d71030c993366ea5068de4` |
| `shared.library` hidden-door variant | `assets/staging/shared.library/variants/hidden_door_ajar/shared.library__hidden_door_ajar.webp` | `44592196fbc7462b9d00345262b44e7316cde88334ec29af0c6d906a828e419a` |
| `shared.great_hall` red-first variant | `assets/staging/shared.great_hall/variants/red_first/shared.great_hall__red_first.webp` | `af463e9ae529d5f7de8935f7e7794b4879cd2f15635d9617139fb52fb7ac9936` |
| `shared.great_hall` blue-first variant | `assets/staging/shared.great_hall/variants/blue_first/shared.great_hall__blue_first.webp` | `429a9369c7cfa7146230c7bc3557aeaa12c20d385382b484ebe6f1826e7bc4d8` |
| `shared.great_hall` both-open variant | `assets/staging/shared.great_hall/variants/both_open/shared.great_hall__both_open.webp` | `338bbed29fd64537741615e76f5ddd52f688263ae23c734de3ffb63b42381284` |

Each target must also receive the matching JSON sidecar from the ZIP, beside the WebP. The ZIP contains **10 WebPs + 10 JSON sidecars**, SHA index, README and `stage_va_image_batch.py`. All local ZIP contents and image SHA-256 were checked. **ZIP SHA-256:** `3009d25adb8aa0de061400835500c1c990ddeff3a6d5b430be6316697ace8da0`; **size:** 15,370,870 bytes. **The ZIP itself is not a GitHub asset or accessible to other agents through a GitHub URL**; the Teacher can supply the local downloaded ZIP to a connected Codex/local git workspace.

### B1. Source integrity and dimensions for every locally prepared file

These are **source PNG** SHA-256 values, separate from the WebP SHA-256 values in table B.

| Approved image | Source PNG SHA-256 | WebP dimensions |
|---|---|---|
| `10 政府公告纸 revised.png` | `2d9ad7c3c6a182e7e216a674013c2ddc40024fc4f57e323dd6d7637b4a9ee9c6` | 1575 × 1577 |
| `写着密码的纸-擦除了数字 正面 revised.png` | `5faae0e78699ab1a907eac30e36796fecaa78c46af3ae18a70664d784ddff704` | 2048 × 1536 |
| `写着密码的纸-擦除了数字 背面 revised.png` | `2fb6aa57503a08b7f1c2e34474a8a766a0ba5a4ff9cabf0bbdffa6c5f16b82b9` | 2048 × 1536 |
| `19世纪末风格日记本生成 俯视图 revised.png` | `2c3bb8f17f3f15964f6dab8fd970048190e90ba81eeede6735e649dfb007d3e9` | 2048 × 1282 |
| `密码箱中的碎纸条 revised.png` | `18e4386620332a55e5d743285d399597d81cf8576aa7629b03341009f80b0518` | 1536 × 1024 |
| `21 大门 revised.png` | `fecffed3249471f76a2d271ecc7f6830cb22c19078d3ac5289bfaae958cba2b5` | 1448 × 1086 |
| `12 图书馆-2nd scene.png` | `df25f4f10df2ef8d5265e3d5f5f00bc23528940632cd145325844685da91fc64` | 1448 × 1086 |
| `19 三扇门-red door opened.png` | `f2bd6748f412743c1bde020708565438ef79619329791ca0930904f9f2cea510` | 1448 × 1086 |
| `19 三扇门-blue door opened.png` | `cbf2c010e4fcde95b8ff132a6c5a0237aba71489e4a1975cd399bd620c3caff2` | 1448 × 1086 |
| `19 三扇门-both doors opened.png` | `756bd07470a69b74615530e4b91c8635db09c106ee610d2b17bb5be10c123fe2` | 1448 × 1086 |

## C. Blocker and proposed path to unblock

**Confirmed blocker:** GitHub connector can write UTF-8 records and create Git blobs from explicit base64 strings. The local image bytes are present in the isolated conversation container, but cannot be handed as an authorized local-file stream to that connector; no authenticated direct push from this container was available. Thus no pending image binary staging claim is made.

**Practical proposed solution:** Authorized local-git/Codex route with checkout access and the exact downloaded ZIP:
1. Extract ZIP; inspect `VA_BATCH_IMAGE_STAGE_INDEX.json` and all JSON sidecars.
2. Execute `python stage_va_image_batch.py <path-to-repo>` from the extracted folder. Script refuses missing/different existing targets and validates each WebP SHA.
3. Verify target branch/scope and `git status`; add only approved `assets/staging/**` paths; commit/push using already-authorized GitHub credentials. **Do not upload credentials or credentials-bearing files to ChatGPT.**
4. Independently read/fetch each new GitHub file and verify **nonzero binary size + exact SHA-256**. Only after that, update `assets/asset-registry.json` `latest_version` to 2 for the five v002 successors and 3 for `shared.main_gate` (six replacements total); `active_version` must stay unchanged; never modify legacy version directories.
5. For the four variants, verify whether registry schema supports variant records; CD/GA should resolve scene state binding without inventing independent canonical asset keys or overwriting base image.
6. Record evidence commit SHA, exact paths, hashes, sidecar status, result, and owner in this record/Action Log. Runtime publication/activation and game E2E verification are **separate CD-governed stages**.

**Scope/authority:** Teacher on 2026-11-14 explicitly authorized VA to write *problem-solving letters* to CA and CD asking for a technical solution **before** saying the ordinary completion phrase. This is a narrowly scoped exception for diagnosis/unblocking, **not** the consolidated image handoff, and does not authorize immediate activation.

## D. Canonical index and related evidence

- Existing temporary table: `docs/tmp files/VA_APPROVED_IMAGE_REPLACEMENTS_TEMP.md`
- Exact pending binary manifest: `docs/tmp files/VA_BATCH_IMAGE_BINARY_STAGING_STATUS_20261114.json`
- Great Hall state manifest: `docs/tmp files/VA_GREAT_HALL_19_DOOR_STATES_MANIFEST.json`
- VA Action Log: `docs/logs/VA_ACTION_LOG.csv`, last recorded checkpoint `VA-040` before this document
- CURRENT STATUS: `docs/onboarding/GAL_ESCAPE_CASTLE_CURRENT_STATUS.md`
- Approved binary assets already stored in `assets/staging/prop_linda_watch_back/v002/`, `assets/staging/prop_gitte_castle_map/v002/` and `assets/masters/MASTER-03/`

**Open status:** 10 images still **NOT GitHub-staged**, 0 of those runtime-activated. The earlier summary “9 pending” was a counting error; the correct count is **10**.

### Troubleshooting communications (Teacher-authorized before final handoff)

- `agent-comms/VA_to_CA_20261114T115500Z_approved-visual-batch-binary-staging-blocker-review.md` — asks CA for minimal independent technical review/owner recommendation.
- `agent-comms/VA_to_CD_20261114T115500Z_approved-visual-batch-binary-upload-solution-request.md` — asks CD for a feasible exact-byte upload method without assigning premature integration or release.

These are **technical-unblocking requests**, not the deferred completed-batch CD handoff.
