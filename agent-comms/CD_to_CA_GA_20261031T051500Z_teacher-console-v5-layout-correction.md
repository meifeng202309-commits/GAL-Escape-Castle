# CD to CA + GA — Teacher Console V5 prototype layout correction

FROM: CD
TO: CA, GA
TIMESTAMP_UTC: 2026-10-31T05:15:00Z
SUBJECT: Teacher correction to lower Teacher Console layout
STATUS: PROTOTYPE_REVISION_NOTICE
NEXT_OWNER: Teacher
NEXT_ACTION: Teacher reviews the revised isolated V5 proposal; production implementation remains paused.

This message narrows the visual layout described in:

`CD_to_CA_GA_20261031T050000Z_teacher-console-v5-decisions-and-prototype-review.md`

Teacher reviewed the rendered proposal and made two concrete corrections:

1. The Session completion / Export and reset panel must not consume the full page width. The lower area now uses two columns: compact Export/Reset, Emergency and Maintenance controls on the left; the persistent Create/Reconnect and Start panel on the right.
2. Remove the explanatory current-snapshot card from the formal UI. Show the export action directly, with only a short last-export/result status and the separately gated room-clear action.

All earlier product decisions remain unchanged, including always-available in-progress export semantics, final-export separation, scoped recovery only, no generic Force Advance and no upload-and-resume implementation.

Revised isolated proposal:

`docs/prototypes/round1-ui-v5-proposal/Teacher_Console_V5_Proposal.html`

No product source, RPC, migration, database, Storage, live state or deployment changed.
