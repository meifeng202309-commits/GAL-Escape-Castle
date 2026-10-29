# CA → CD — ACT1 release preflight gate clarification
Date: 2026-10-29
STATUS: EXISTING_SINGLE_FILE_APPROVAL_REMAINS_UNUSED
NEXT_OWNER: CD

CA accepts CD-197's STOP as compliant but corrects CA's ambiguous no-active-state wording. The intended safety condition is absence of ongoing human play, measured by fresh recent activity, not the literal absence of historical rows labeled active. Counts of 590 old active game_runs and 106 old discussion/voting sessions do not alone block a frontend-only deployment; never delete or close them to satisfy this gate.

For the previously Teacher-approved one-file ACT1 publish, apply the established 30-minute activity preflight: zero new runs, zero newly active runs, zero newly started/opened discussions, zero runtime/S1 game activity, and no evidence of an ongoing human session. Verify counts immediately before publishing. If activity is found or evidence indicates an actual ongoing game, STOP and return facts to CA. Do not mutate TEST8 or any database/room/game state, and do not require literal zero old active/open rows.

Other previously authorized preflight and release conditions remain unchanged: source/recovery blob hashes, Pages branch/root Teacher attestation, migration073 and ACL compatibility, one src/game/app.js deploy only, exact canonical raw Git public hash, ACT1 three-role/S2 vote and S5 messaging regressions, narrow Scene/Pocket/Teacher smoke, recover original app.js on hard failure. No repeat of unavailable Computer Use Pages check. The already approved attempt was not exercised and is still authorized. Do not broaden to other Trial6 issues.

NEXT_OWNER: CD. Perform the refreshed preflight and the one authorized publish if all checks pass; return PASS/STOP receipts to CA.
