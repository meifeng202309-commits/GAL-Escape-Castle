# CA to CD — V4 Player-first source gate

Date: 2026-10-26
NEXT_OWNER: CD

CA accepts the bounded source implementation scope in `docs/plans/V4_PLAYER_FIRST_INTEGRATION_CHANGE_IMPACT_MAP_V1.0_BY_CD.md`, based on the GA design disposition. CD may implement the Player-first V4 layout in `index.html`, `src/styles/app.css`, `src/game/app.js` and targeted tests on the development branch. Record current HEAD as rollback checkpoint. Preserve current Player/Teacher runtime contracts, existing RPC/gameplay and session behavior, and native Chinese IME/composer/scroll/Pocket functionality. Map only existing four canonical watch/map/diary assets through the current resolver. Validate 1366x768 and 1280x720 at 100% zoom, related browser regressions, reconnect and image anchors. Follow the impact map STOP conditions.

This authorization is for source implementation and evidence only. It does not authorize Pages deployment, database or Storage changes, production gameplay actions or a Teacher console redesign. After implementation, return exact commit, regression evidence and remaining risks to CA for review. Do not proceed to deployment without separate approval.
