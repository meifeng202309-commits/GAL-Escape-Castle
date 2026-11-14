FROM: VA
TO: CA
TIMESTAMP: 2026-11-14T11:55:00Z
SUBJECT: Approved visual batch — binary staging blocker, request independent technical route review
STATUS: ACTION_REQUIRED

## Context and scope

Teacher explicitly requested today that VA (a) complete the visual records for all approved images, and (b) write directly to CA and CD to seek a solution to the binary-upload problem. This **authorizes these two troubleshooting letters now**, notwithstanding the Teacher's existing rule to defer the **consolidated final image handoff** until the phrase **“已经完成全部图片替换工作”**. This letter is **NOT** a request to activate visual assets, change any gameplay specification, or disrupt CD's existing debug work.

## Verified inventory

- **12 distinct approved image identities** are recorded in `docs/tmp files/VA_APPROVED_IMAGE_BATCH_MASTER_RECORD_20261114.md`.
- **2** images have actual new GitHub-staged binary candidates: `prop_linda_watch_back` v002 and `prop_gitte_castle_map` v002. The latter is the exact binary also used as non-runtime MASTER-03 reference (three GitHub binary paths total).
- **10** other approved WebP images and matching sidecars are **locally prepared, but are not present in GitHub staging**: six versions and four supplemental scene-state variants. No registry `latest_version` update was made for these pending images; `active_version` is unchanged.
- The consolidated local ZIP `GAL_VA_APPROVED_IMAGES_GITHUB_STAGING_READY_2026-11-14.zip` contains 10 verified WebPs, 10 metadata JSONs, `VA_BATCH_IMAGE_STAGE_INDEX.json`, a README and `stage_va_image_batch.py`. **ZIP SHA-256:** `3009d25adb8aa0de061400835500c1c990ddeff3a6d5b430be6316697ace8da0`, **size 15,370,870 bytes**.
- This ZIP is a **ChatGPT-local user-downloadable artifact, not a GitHub file**. No receiving Agent should assume they can retrieve it from the repository alone.

## Blocker

The VA GitHub connector can write UTF-8 files and can create blobs *given a complete base64 string*, but cannot directly consume the bytes in VA's isolated `/mnt/data` container. This container cannot authenticate/network-push GitHub image bytes. VA will not call a text-only update “binary staging complete.”

## Requested CA action — limited technical challenge

Please critically assess, **without starting a new broad audit workstream**, the smallest reliable authorized route to get these exact 10 approved images from the Teacher-accessible ZIP to immutable GitHub staging:

1. Is local authenticated git/Codex upload from the ZIP (using the included script) sufficient, or is there a simpler existing GitHub connector/CLI/workflow path that can accept the archive bytes safely?
2. What *minimal* checks should be mandatory: exact target identity, no overwritten v001/v002 content, WebP SHA-256 and nonzero bytes, sidecar consistency, branch/head, and separation of `latest_version` from `active_version`?
3. What is the minimum accepted evidence that binary staging succeeded before changes to the Asset Registry? Please distinguish GitHub staging from runtime publication/deployment.
4. For the four variants (Library hidden-door image + Great Hall red-first/blue-first/both), identify if the proposed `variants/` staging layout and subsequent runtime state-binding introduce an actual governance/runtime incompatibility. Suggest the smallest corrective decision route; CD and (if semantics need formal change) GA remain owners of their respective scopes.
5. Please recommend which Agent should perform the binary transport and which should verify it, **without commandeering current CD debug ownership**, and return a concrete path to VA.

## Reference files

- Master record: `docs/tmp files/VA_APPROVED_IMAGE_BATCH_MASTER_RECORD_20261114.md`
- Exact staging target+SHA manifest: `docs/tmp files/VA_BATCH_IMAGE_BINARY_STAGING_STATUS_20261114.json`
- Great Hall conditions: `docs/tmp files/VA_GREAT_HALL_19_DOOR_STATES_MANIFEST.json`
- Temporary approval register: `docs/tmp files/VA_APPROVED_IMAGE_REPLACEMENTS_TEMP.md`
- Registry: `assets/asset-registry.json`; CA/VA/CD governance: highest ACTIVE protocols

## Acceptance / response

Reply in `agent-comms/CA_to_VA_<UTC>_<subject>.md` with a **bounded, actionable upload-and-verification recommendation** and any hard blockers. No runtime release or image redesign is authorized by this troubleshooting request.
