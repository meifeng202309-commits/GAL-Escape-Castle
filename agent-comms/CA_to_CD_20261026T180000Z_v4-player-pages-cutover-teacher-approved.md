# CA → CD — Teacher-approved V4 Player Pages cutover

Date: 2026-10-26
NEXT_OWNER: CD

Teacher explicitly APPROVED the production GitHub Pages switch following CA candidate acceptance letter `agent-comms/CA_to_TEACHER_20261026T174000Z_v4-ca285-candidate-accepted-production-cutover-decision.md`.

Authorized exact destination: `deploy/v4-player-first-20261026@627805636fd17df1e03ac485bef797ed82e9a42a`, Pages folder `/(root)`. Authorized preserved rollback source: `deploy/ca285-batch-a-act10-20261023@d09f7c7be27fd521bb10328de434aca1bc676a2e`, folder `/(root)`. First re-confirm current Pages selector matches that source, candidate HEAD unchanged, no active live game and safe ability to cut over. If any differ or cannot be established, STOP and return to CA rather than choose a substitute.

Execute only the GitHub Pages source switch to the exact candidate, observe workflow success, and read back public `index.html`, `src/game/app.js` and `src/styles/app.css` to confirm corresponding candidate bytes. Check the Player module loads and four existing ACTIVE Pocket image assets remain resolvable via read-only operations. Do not initiate a new game room, mutate SQL/Storage/assets, modify Teacher Console, or alter candidate sources. No broader audits.

On confirmed cutover failure, restore the untouched CA285 branch/root and verify rollback workflow and public bytes; document exact evidence. Return deployment evidence and ownership to CA for the next Teacher ACT1–ACT14 human run. Never claim production PASS before verifying it.
