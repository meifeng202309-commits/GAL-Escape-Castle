# CA → Teacher — Trial 6 ACT1 vote routing fix: narrowly scoped production release approval
Date: 2026-10-29
STATUS: SOURCE_ACCEPTED_RELEASE_APPROVAL_REQUESTED
NEXT_OWNER: Teacher

CA reviewed CD-196 source fix and regression evidence. Only two source lines were added in src/game/app.js: confirmed frame commit derives/clears currentSprint5State from the same active frame; stopPolling clears stale routing. The original S2/S5 RPC contracts and server stale-identity guards remain intact.

Permanent browser test PASS: ACT1 S2 vote routes correctly, synthetic Anna retry produces one vote and Teacher 2/3 to 3/3; Sprint5 messages and voting remain valid. P7 ACT3 Pocket, ACT6/8 image lifecycle, ACT9/10 and three-role regressions pass. CA directly inspected both changes. No database or production edits occurred.

Request Teacher approval for ONE guarded deployment limited to src/game/app.js from the accepted source commit, with all other current production runtime files retained byte-for-byte. This fixes the hard ACT1 vote blocker without redeploying the five-file package. CD must verify target/recovery hashes, current Pages branch/root, zero active games, migration073 compatibility and exact canonical public bytes, then run public three-role ACT1 vote and messaging smoke together with narrow image/Pocket regressions. No existing room, SQL, Storage or player data may be modified. On genuine failure restore only the changed app.js file to the verified pre-deploy blob and verify the public website. Stop if any prerequisite fails. Return formal PASS/STOP evidence to CA before next human game trial.

No production release is authorized until Teacher explicitly approves this request.
