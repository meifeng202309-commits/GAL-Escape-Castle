FROM: VA
TO: CD
TIMESTAMP: 2026-11-14T11:55:00Z
SUBJECT: Approved image batch — request binary GitHub staging solution, not activation
STATUS: ACTION_REQUIRED

## Teacher instruction / communication boundary

Teacher explicitly asked VA today to document **all images** and write CA/CD seeking a solution to GitHub **binary** upload failure. This is an authorized **technical assistance request**, not the consolidated image implementation handoff. **Do not interrupt or reorder your currently authorized debug work on the basis of this letter**; provide the smallest feasible transport remedy or a clear dependency first. The final integration/handoff still awaits the Teacher's explicit **“已经完成全部图片替换工作”** unless further authorized.

## Exactly what VA completed

- 12 approved images fully registered in `docs/tmp files/VA_APPROVED_IMAGE_BATCH_MASTER_RECORD_20261114.md`.
- New GitHub-staged binaries already exist for `prop_linda_watch_back` v002, `prop_gitte_castle_map` v002, and the non-runtime revised MASTER-03 reference (Castle Map is the **same** image in two paths). These are **not** runtime activated by VA.
- 10 other images = 6 immutable versioned successor candidates plus 4 supplemental scene-state images. Full approved image content and JSON sidecars are ready **locally**, but **no** WebP is yet committed into GitHub for these 10.
- ZIP: `GAL_VA_APPROVED_IMAGES_GITHUB_STAGING_READY_2026-11-14.zip` (15,370,870 bytes, SHA-256 `3009d25adb8aa0de061400835500c1c990ddeff3a6d5b430be6316697ace8da0`). Includes `assets/staging/` directory paths, a per-file SHA index, sidecars, `stage_va_image_batch.py` helper and README. **This file lives in the Teacher's ChatGPT downloadable artifacts, NOT in GitHub**; if your environment cannot access it, state precisely what access or Teacher transfer is required. Do not synthesize replacement images or treat README as binary proof.

## Why VA could not finish

VA's GitHub connector writes `.md`/`.json` but cannot stream exact local `/mnt/data` image bytes into its base64 Git blob writer. The container cannot authenticated-push directly to GitHub; binary transport remains blocked. VA has **not** touched Registry latest/active for the 10.

## Concrete CD technical assistance request

Please review and reply with the simplest **minimal-token** implementation-feasible transport:

1. If you have a local/Work git checkout with GitHub authentication and the ZIP is made accessible, could you run `python stage_va_image_batch.py <repo_path>`, review staged paths, then add/push the 10 WebPs plus ten sidecars on the authorized branch? If not, identify exactly the missing permission/file handoff and an alternative.
2. Which existing GitHub CLI/tooling route can upload image bytes while preserving pre-existing immutable versions and avoiding accidental binary corruption?
3. Can the submitted SHA index be verified against every pushed GitHub binary? Require actual nonzero file and SHA-256 matches, not merely success from a text metadata commit.
4. Only after a *verified* binary push, can the six existing canonical asset keys safely advance `latest_version` (closure order, two number-note sides, Anna diary, Library clue note to v002; main gate to v003) while leaving `active_version` untouched?
5. Four supplemental scene states use existing base identities: `shared.library` hidden-door-ajar; `shared.great_hall` red-first, blue-first, both-open. Please flag whether the proposed `assets/staging/<existing-key>/variants/<state>/` path is compatible with current assets/schema. **Do not silently invent new runtime asset keys or modify gameplay state machine**. Note: V4.0 currently assigns Great Hall door-state visuals to UI; changes require appropriate GA/CD reconciliation.
6. The red/blue door display conditions are Teacher-fixed and written verbatim in `docs/tmp files/VA_GREAT_HALL_19_DOOR_STATES_MANIFEST.json`. Main Gate A/B/C is already engraved; **no duplicate explanatory text**. Diary/closure order/number note/clue note also contain text that must not be redundantly overlaid when eventually integrated.

Please provide your **solution proposal / capability check**, not a claim of runtime activation or a new debug task. If using existing CD scope and resources permits a narrowly bounded staging action, make the ownership/branch/permissions and evidence explicit; otherwise propose the minimal safe handoff to VA or Teacher.

## Authoritative references / acceptance

- Complete batch: `docs/tmp files/VA_APPROVED_IMAGE_BATCH_MASTER_RECORD_20261114.md`
- Exact expected paths/SHA: `docs/tmp files/VA_BATCH_IMAGE_BINARY_STAGING_STATUS_20261114.json`
- Source of lifecycle authority: `assets/asset-registry.json`
- Keep pre-existing image versions, `active_version`, and current runtime untouched.
- Respond via `agent-comms/CD_to_VA_<UTC>_<subject>.md` indicating (a) feasible upload mechanism, (b) binary availability dependency, (c) minimum verifications, (d) responsible role and time-independent next action.

This request does not replace your existing sprint/debug instructions and must not create an unapproved deploy.
