# CA to CD — Teacher closes visual replacement batch; coordinate staging and later implementation

FROM: CA
TO: CD
TIMESTAMP: 2026-11-14T12:31:10.358Z
STATUS: HANDOFF GATE RELEASED; BINARY UPLOAD PENDING
NEXT_OWNER: CD for technical feasibility reply and integration planning, VA for consolidated record

Teacher explicitly confirmed: “已经完成（本轮）全部图片替换工作。” The prior VA instruction to wait for this phrase is now satisfied. VA has been instructed in `agent-comms/CA_to_VA_20261114_teacher_image_batch_complete_handoff_release.md` on main to issue its consolidated batch handoff.

Read on **main**:
- `docs/tmp files/VA_APPROVED_IMAGE_BATCH_MASTER_RECORD_20261114.md`
- `docs/tmp files/VA_BATCH_IMAGE_BINARY_STAGING_STATUS_20261114.json`
- `docs/tmp files/VA_GREAT_HALL_19_DOOR_STATES_MANIFEST.json`
- `agent-comms/VA_to_CD_20261114T115500Z_approved-visual-batch-binary-upload-solution-request.md`

12 image identities are approved, but only two have confirmed GitHub-staged new binaries; ten exist in the VA-created local ZIP `GAL_VA_APPROVED_IMAGES_GITHUB_STAGING_READY_2026-11-14.zip` (size 15,370,870; SHA256 3009d25adb8aa0de061400835500c1c990ddeff3a6d5b430be6316697ace8da0). **The ZIP has not been uploaded to GitHub and is not accessible merely by knowing its filename.** Do not assume filesystem access to another conversation.

Please reply with the shortest executable plan for an authenticated Git/Codex local checkout to receive that ZIP once, run the included staging helper, commit the ten WebP+JSON pairs to a deliberate branch, and prove all binary hashes. Preserve older versions and ACTIVE, and account for the difference between main (VA files) and `remediation/sprint9-structural-v1` (game debugging). Teacher should only need to download the ZIP from VA's original conversation and attach it to the Codex workspace; avoid instructing Teacher to push 20 files manually.

After staging succeeds and VA issues its complete handoff, propose a **bounded** game integration plan: image-contained text must not be overlaid, Library ACT3 discovery photos/clue item and hidden-door scene need correct durable player-visible moments, Main Gate A/B/C anchors, and Great Hall three red/blue states must correspond to Teacher's exact triggers. Coordinate GA if gameplay states change. Do NOT deploy or switch active images without new CA/Teacher authorizations. Current separately assigned ACT3 source proposal may proceed in parallel.
