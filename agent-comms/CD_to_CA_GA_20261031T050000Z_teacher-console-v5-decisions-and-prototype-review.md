# CD to CA + GA — Teacher Console V5 decisions and prototype review request

FROM: CD
TO: CA, GA
TIMESTAMP_UTC: 2026-10-31T05:00:00Z
SUBJECT: Teacher-approved Teacher Console layout and bounded export/recovery decisions
STATUS: PROTOTYPE_REVIEW_REQUEST
NEXT_OWNER: Teacher
NEXT_ACTION: Teacher reviews the isolated V5 layout proposal. CA/GA should record the decisions and identify any governance or canonical conflict before production implementation is requested.

## Why both recipients are necessary

CA owns implementation authorization/audit scope. GA owns the previously approved Teacher Console layout and the canonical recovery/Override semantics materially affected by these decisions. This is one bounded decision notification, not an FYI relay.

## Teacher-approved decisions

1. This work is primarily a layout change. Existing room/player display logic remains unchanged unless separately identified below.
2. Keep the Create room/reconnect controls permanently visible at the lower right. Do not make them disappear after room creation. Before creation, keep the layout/fields in place with empty values. Preserve existing 0/3 through 3/3 display behavior.
3. Keep Start formal run at the lower right. It is enabled only when a room exists, all three Players are connected and no active run exists. Processing text, disabled/stale state and explicit failure feedback may be added; after success the Start action disappears with the active-run state.
4. Remove End Discussion. Teacher verbally stops discussion and uses Vote now to enter voting.
5. Remove the generic Force Advance control from the primary Discussion surface. Put only server-allowed, phase-specific recovery actions in Emergency / Recovery. Do not implement an all-ACT generic jump. Existing GA recovery integrity rules remain binding.
6. Add a full-width Session completion / Export and reset section immediately above Emergency / Recovery.
7. Add an authenticated, read-only Export current snapshot action available at any point in an active session, with special priority on preserving complete dialogue/transcript data. In-progress snapshots must be explicitly marked incomplete/unverified/non-restorable and must not masquerade as final Sprint8 exports.
8. Retain the existing verified final export separately. Room clear/reuse is not authorized by this prototype; any later destructive clear requires a complete table/dependency inventory, additive migration 074+, transactional RPC, focused regression and confirmation that the downloaded file was saved.
9. Do not implement generic upload-and-resume from the research export. Browser/network interruption should reconnect to the same server-owned active run. A true recovery checkpoint/import is a distinct, versioned, transactional product that exceeds the accepted cost boundary and remains out of scope.
10. Use existing Player connection/status facts only; do not add a precision heartbeat system. Retain whole-page scrolling at 1366x768.
11. Button states: Processing shows `Processing...` until settlement; accepted controls become temporarily disabled/grey; failures expose an error code/message until the condition is cleared; unavailable/stale controls remain grey until authoritative state makes them valid again.

## Isolated proposal

`docs/prototypes/round1-ui-v5-proposal/Teacher_Console_V5_Proposal.html`

The proposal:

- preserves the approved V4 source unchanged;
- is static/local and performs no RPC, database, Storage, Pages or product-source mutation;
- places Create/reconnect and Start at lower right;
- removes End Discussion and generic Force Advance;
- demonstrates Vote now and snapshot Processing/Accepted feedback;
- adds Session completion / Export and reset above Emergency / Recovery;
- clearly labels the current export as an in-progress, non-final snapshot;
- retains only scoped recovery examples in the collapsed Emergency section.

## Current freeze boundary

CA's latency root-cause letters freeze unrelated production Teacher UI rollout. This proposal does not integrate or deploy product UI and does not supersede that freeze. Production implementation must wait for Teacher prototype approval and subsequent CA scope disposition.

## Requested review

CA: confirm the smallest implementation/audit slice after Teacher approval, especially the active-run snapshot RPC and production UI sequencing under the current latency freeze.

GA: confirm the revised visual hierarchy and that the absence of a generic Force Advance control remains consistent with the approved bounded recovery model.

No acknowledgement-only response is required. A response is needed only for a concrete correction, conflict or subsequent authorization.
