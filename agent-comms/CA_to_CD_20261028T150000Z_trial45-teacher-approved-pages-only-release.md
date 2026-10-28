# CA → CD — Teacher-approved Trial4+5 frontend-only production release
Date: 2026-10-28
STATUS: AUTHORIZED_BOUNDED_PRODUCTION_RELEASE
NEXT_OWNER: CD

Teacher has explicitly approved publishing the four P7-accepted frontend files to the official game site. The approval is **only** for:
- `teacher.html`
- `src/game/app.js`
- `src/styles/app.css`
- `src/content/localization.generated.js`

Use accepted product target `8594f2e` and file blob hashes in `docs/plans/TRIAL45_FRONTEND_RELEASE_READINESS_PREFLIGHT_20261028.md`. Current production recovery baseline is `deploy/trial4-player-act9-20261027@727ed7cd360c970b20874c7d5d0fc1b64826a92b`. Source/local browser P7 PASS: `docs/audits/regular/runs/2026-10-28_trial45_p7_holistic_audit/FINAL_DISPOSITION.md`. CA technical release review: `docs/audits/regular/runs/2026-10-28_trial45_frontend_release_preflight/AUDIT_REPORT.md`.

Execute the **single guarded Pages-only release** within this scope:
1. Fresh readback of authenticated Pages deployment selector/head, accepted target blob hashes, active migration073 receipt and function/ACL compatibility, public media accessibility, and zero current/recent classroom gameplay or active discussions. If any prerequisite fails, STOP and report CA. Do not modify or terminate human rooms.
2. Prepare/publish exact candidate to the Pages branch/root, with four changed frontend files only. Keep compatible recovery ref `727ed7c` available; do not revert to pre073 `6278056`.
3. Verify successful Pages build and compare exact four live public file byte hashes to authorized target; guard against partial or cached/mixed deployments.
4. Run real **public-site** browser smoke, including Gitte/Anna/Linda in both 1280×720 and 1366×768; five-region geometry; visible connected decoded Scene/Pocket images including map, note, diary, key and Linda 3/3; pregame role isolation; 11pt bilingual formatting; Teacher V4 layout/controls/default collapsed sections; ACT9 NORMAL Teacher-paced and AUDIT timing; tie retry bilingual instruction and scroll stability.
5. If public smoke fails or release drift occurs, STOP and perform only the already reviewed compatible Pages recovery when safe; no SQL/Storage/database/room modifications. Return exact build, hashes, smoke results, any rollback and STOP rationale to CA.
6. If all pass, return one documented production release and smoke-evidence package to CA for final confirmation, **before requesting any human game test**.

No migration, schema, RLS, Storage objects, assets, new dependencies, unrelated code refactoring, or gameplay data operations are authorized. Display Mechanism Governance V1.1 is separately approved for future work, not part of this release payload.

NEXT_OWNER: CD. Continue work through production evidence handoff to CA; escalate only authorization-bound scope changes or critical STOP conditions.
