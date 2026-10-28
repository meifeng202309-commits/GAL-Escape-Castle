# CA → CD — Teacher approval: five-file release and initial network-load gate adjustment
Date: 2026-10-29
STATUS: AUTHORIZED_BOUNDED_THIRD_ATTEMPT
NEXT_OWNER: CD

Teacher expressly approved BOTH decisions posed in CA's letter `agent-comms/CA_to_TEACHER_20261029T034000Z_release-review.md`: (1) one more controlled Pages-only release of the five P7/image-fix runtime files; and (2) changing the cold-network initial-image timing from an automatic 2500ms hard failure into monitored performance evidence with a separate severe-stall STOP criterion.

**Frozen source target:** `ca0e2ba` subject to fresh hash check against `docs/reports/remediation/ui/TRIAL45_IMAGE_FIX_READ_ONLY_RELEASE_PREFLIGHT_20261029.md`. Atomic five-file payload:
- `teacher.html`
- `src/game/app.js`
- `src/game/asset-runtime.js`
- `src/styles/app.css`
- `src/content/localization.generated.js`

Recovery must restore ALL five to the verified migration073-compatible `727ed7c` content, then verify a completed Pages build and exact public hashes.

**Performance policy clarification:** Do not treat initial loading from external public media after DOMContentLoaded exceeding 2500ms alone as a release hard failure. Record cold and warm initial latency individually (including maximum/p90), network resource/decode traces and whether an actual player-facing stall occurred. The numerical severe-stall cutoff was NOT specified by Teacher; do not invent or silently adopt an 8000ms SLA. A ~29-second visible Scene stall, indefinite image loading or missing connected/decoded image is a severe hard STOP. Before publishing, define and document an evidence-backed, measurable severe-stall criterion and get CA confirmation if its precise cutoff is not already canonically approved. Until that confirmation, proceed with read-only preflight and test planning, not live mutation. Keep the separately agreed <=2500ms post-refresh/remount regression gate and all wrong-role/missing-image hard correctness checks. Do not suppress slow samples or rerun until green.

CD action:
1. Read CD-186 and both source/test closure packets. Verify exact target five blobs, public Pages selector/head/root, no current/recent game or discussion activity, migration073 signature/ACL/dependency compatibility, public media, and complete five-file rollback.
2. Propose a concise objective severe-stall gate grounded in prior 29.6s case, resource/decode trace capability and classroom usability, clearly stating that it is an **implementation proposal requiring CA acceptance**, not a Teacher-approved numeric standard.
3. Once CA confirms the concrete stop rule, execute exactly one five-file Pages-only release; verify successful build and public hashes.
4. Run public browser smoke: GAL-A/B/C, both viewports, Scene/Pocket content and stable image identity on unchanged ACT6/8 polls, changed-scene replacement, ACT9 NORMAL/AUDIT, Teacher V4, 11pt NL/ZH tie, scroll preservation; at least 3 cold and 3 warm initial-media readings per viewport, report all slow times; post-refresh <=2500ms.
5. STOP and safely restore all five files on any hard correctness/stall gate failure. Return production receipts and full results to CA before any Teacher human trial.

No SQL, DB migration, Storage, assets, active-room/gameplay mutation, unrelated architecture work or human trial authorized. No additional deployment attempt may occur without new approval.

NEXT_OWNER: CD for read-only final gate definition/preflight, then bounded execution after CA gate confirmation.
