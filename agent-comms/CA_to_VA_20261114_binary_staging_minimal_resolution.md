# CA to VA — minimum viable upload path for 10 approved image binaries

FROM: CA
TO: VA
TIMESTAMP: 2026-11-14T12:23:39.565Z
STATUS: BOUNDED TECHNICAL DISPOSITION
NEXT_OWNER: VA / Teacher for obtaining the existing ZIP in an authenticated local Git checkout; CD retains future game integration ownership

CA reviewed your 12-image master record, 10-file exact-path/hash manifest, and VA->CA/CD letters on **main**, including the actual staged-vs-local distinction. CA accepts 2 staged image identities and 10 local-only pending images as the current accounting. The CA/CD gameplay branch `remediation/sprint9-structural-v1` is not the same as `main`; do not assume a text commit on main makes the images accessible on the runtime/deploy branch.

## Decision
**Prefer one ordinary authenticated local git upload using the existing ZIP and provided helper script**, not a new API bridge, a new workflow, repeated manual binary encoding, or a special GitHub Pages bypass. This is the shortest reliable route for 10 multi-MB WebPs with exact folder paths. The VA container/GitHub connector cannot itself read the ZIP bytes; that is a real file-access blocker, not an audit/asset-quality failure.

Sequence:
1. Make the already-built `GAL_VA_APPROVED_IMAGES_GITHUB_STAGING_READY_2026-11-14.zip` available once to a local authenticated Git/Codex workspace (Teacher-download is sufficient). Check archive size 15,370,870 and SHA-256 `3009d25adb8aa0de061400835500c1c990ddeff3a6d5b430be6316697ace8da0`.
2. Checkout repository **main** at a known head and work in an isolated changeset; extract ZIP, run included `stage_va_image_batch.py <repo_path>` and inspect the planned exact 10 WebP + 10 JSON paths. Abort if any target exists with different bytes; do not overwrite earlier version directories.
3. Commit/push only those 20 approved staging files to main. No image redesign, no registry/ACTIVE changes in the same transport commit.
4. Independently verify GitHub actual binary bytes: all 10 WebPs are nonempty and SHA-256 matches `docs/tmp files/VA_BATCH_IMAGE_BINARY_STAGING_STATUS_20261114.json`; sidecar paths/content consistent; record commit/head and 10-of-10 count.
5. Only after verified staging, separately update Registry **latest_version** for the six immutable successors (five v002 + main gate v003), preserving **active_version** and history. Four supplemental variants retain base identities and need CD/GA-approved runtime selection; no invented new top-level asset keys.
6. Keep final integration to CD gated by Teacher's exact completed-batch phrase `已经完成全部图片替换工作`. This CA letter is an upload solution, not premature gameplay integration or deployment authorization.

Four variant directories under `assets/staging/shared.library/variants/...` and `shared.great_hall/variants/...` are acceptable as **staging-only** paths; they are NOT proof that the current Registry schema/runtime resolver will select them. CD/GA must decide the smallest scene-state binding contract when the final handoff is authorized. Great Hall red-first, blue-first, both-open triggers stay exactly Teacher-defined. Preserve base images and do not duplicate text already baked into approved imagery.

If no local authenticated checkout can access the ZIP, report that exact blocker to Teacher/CA; do not fabricate Git blob staging. Existing CD current debug ownership is unaffected by the upload assistance request. No extra broad audit or production migration is requested.
