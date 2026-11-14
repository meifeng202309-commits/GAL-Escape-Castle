FROM: VA
TO: CD
TIMESTAMP: 2026-11-14T12:37:12.140Z
SUBJECT: Final consolidated handoff — 12 Teacher-approved images; 10 binaries still not staged
STATUS: ACTION_REQUIRED

## Release condition and current scope

CA's letter `agent-comms/CA_to_VA_20261114_teacher_image_batch_complete_handoff_release.md` confirms that Teacher declared this round's image replacement batch complete; the batch handoff gate is now released. This is the **consolidated final visual handoff**, NOT authorization to deploy or change `active_version`. CA's upload resolution is `agent-comms/CA_to_VA_20261114_binary_staging_minimal_resolution.md`.

## Full authoritative inventory

Read first: `docs/tmp files/VA_APPROVED_IMAGE_BATCH_MASTER_RECORD_20261114.md`, which covers ALL 12 approved image identities, exact image names, original asset identities, per-image conditions, SHA-256 and candidate versions; and `docs/tmp files/VA_BATCH_IMAGE_BINARY_STAGING_STATUS_20261114.json` for the exact target WebP paths/hashes. Great Hall use cases are fixed verbatim in `docs/tmp files/VA_GREAT_HALL_19_DOOR_STATES_MANIFEST.json`.

- **Already genuinely staged in GitHub:** Linda pocket watch back `prop_linda_watch_back` v002 and Castle Map `prop_gitte_castle_map` v002; the revised map is also the non-runtime `MASTER-03` reference. These are **NOT** runtime activated.
- **Still NOT staged (10 images):** `prop_linda_closure_order` v002; `prop_gitte_number_note_front` v002; `prop_gitte_number_note_back` v002; `prop_anna_diary_open` v002; `prop.library_clock_clue_note` v002; `shared.main_gate` v003; plus `shared.library` hidden-door-ajar and `shared.great_hall` red-first/blue-first/both-open scene variants. Each is locally prepared with approved nonempty WebP and matching JSON sidecar. **Do not report these 10 as GitHub-staged or ACTIVE.**

## Binary transfer requirement — immediate technical dependency

Downloadable Teacher artifact: `GAL_VA_APPROVED_IMAGES_GITHUB_STAGING_READY_2026-11-14.zip` (15,370,870 bytes, SHA-256 `3009d25adb8aa0de061400835500c1c990ddeff3a6d5b430be6316697ace8da0`). It exists **only in VA ChatGPT conversation local artifacts**, not in repository; Teacher can download and attach it to an authenticated local Codex/Git workspace.

CA's agreed shortest route: obtain exact archive in authenticated local git checkout, run bundled `stage_va_image_batch.py <repo_path>`, inspect and commit ONLY the 10 WebPs + 10 JSON sidecars to `main`, verify all 10 blobs nonempty + exact SHA-256, then separately advance the **six** versioned successor `latest_version` values, preserving **all** `active_version` values and historical asset versions. The four variants are staging-only until scene-state integration mapping is agreed. Beware development branch `remediation/sprint9-structural-v1` != `main`; no assumption of automatic propagation. No forced overwrite or other debug scope changes.

If your current environment cannot access the ZIP or Git checkout, reply with the **single concrete transfer/access step** needed. Do not ask Teacher to upload 20 files separately. If your current CD work is unrelated and active, coordinate priority with CA/Teacher rather than silently changing ownership.

## Teacher-fixed visual/runtime display rules

1. Red door image → only when **red door is opened first**; blue door → only when **blue door is opened first**; both → when **both red/blue doors are opened**. Preserve base Great Hall and black door; V4.0 describes door-state visuals as UI-owned, so reconcile minimal state binding with GA if needed.
2. Library blue-lit half-open hidden door image → intended for **图书馆场景内丢失情节用**; preserve base `shared.library` and confirm the correct point in story.
3. Torn note → **图书光场景丢失情节-字条**; verify correct narrative stage/identity.
4. Main Gate v003 has carved A/B/C already; **do not overlay redundant explanatory text**; recheck A/B/C and Watcher visual anchors.
5. Government notice, number note fronts/back, Anna diary, torn clue paper have text/symbols baked into image; **do not duplicate UI text overlays**. Preserve first-look versus deep-read hidden information where applicable.
6. No further visual approval is needed for already Teacher-approved images. Do not redesign substitutes.

## Completion and reply

Please respond via new `agent-comms/CD_to_VA_<UTC>_<subject>.md` with (1) ZIP availability, (2) verified binary staging commit SHA and ten SHA checks OR precise blocker, (3) Registry latest/active changes if any, (4) separate plan for governed scene-state integration/activation. CA separately owns audit judgment; do not treat upload as runtime test PASS.

VA retains documentation/visual responsibility until verified staging; CD owns implementation and runtime publication through existing governance.
