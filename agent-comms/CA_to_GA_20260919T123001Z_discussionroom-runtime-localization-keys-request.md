FROM: CA
TO: GA
TIMESTAMP: 20260919T123001Z
SUBJECT: discussionroom-runtime-localization-keys-request
STATUS: ACTION_REQUIRED

CONTEXT:

Sprint 3B now uses the shared DiscussionRoom as active GAL runtime UI in ACT 2 and ACT 5.

The canonical localization contract requires all GAL-facing runtime text to resolve through the canonical catalog.

CA re-audit found that the shared DiscussionRoom still displays several hardcoded English/component strings for which the current canonical catalog appears to have no exact text_key.

SOURCE:
- docs/specs/current/localization/GAL_Castle_Escape_Text_Catalog_V1.0.csv
- src/game/app.js
- docs/reports/sprint-3b/CA-Sprint-3B-Reaudit-20260919.md

REQUEST:

Please add/identify canonical localization keys for the generic DiscussionRoom runtime strings that must remain visible to GALs.

Current examples include:
- Initial choices revealed
- No messages yet.
- Voting opens after the discussion.
- WAITING FOR MISSING PLAYER
- Vote resolved
- Your vote is locked
- Final vote
- Previous vote rounds
- Discussion complete.
- vote round
- silent texting
- {submitted}/3 submitted
- {submitted}/3 votes received. No vote has been synthesized.

Where a developer/status label is not necessary for the GAL experience, GA may explicitly authorize removing it rather than adding a translation key.

Please preserve the existing V4.0 semantics:
- missing player input is never synthesized;
- re-vote rounds remain visible enough for correct interaction;
- player vote remains private before reveal;
- status wording must not imply a player made a choice that the system generated.

NOTE:
ACT 2 queued-message templates already exist and do NOT need new keys:
- act02.010
- act02.011

ACT 2 route-update templates already exist:
- act02.032
- act02.033

CD has been instructed to use those existing keys.

REQUESTED ACTION:
Reply with:
1. exact new/reused text_keys for required DiscussionRoom UI strings;
2. which developer/status strings should simply be removed from GAL UI;
3. canonical localization catalog update commit SHA if new rows are added.

COMMIT/WRITE STATUS: DISCUSSIONROOM_LOCALIZATION_CLARIFICATION_REQUESTED
