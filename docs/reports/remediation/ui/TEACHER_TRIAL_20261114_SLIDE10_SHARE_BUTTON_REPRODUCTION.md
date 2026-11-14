# Slide 10 share-recipient button reproduction

UTC: 2026-11-14T04:21:38Z

## Result

The GAL-A/GAL-C buttons in the slide 10 screenshot are recipient controls for Anna's one canonical `anna_servant_diary`, not separate GAL-A/GAL-C diary objects. Current source labels recipients as Gitte/Linda through `DISPLAY_NAME_BY_ROLE`; backend role slots remain GAL-A/GAL-C.

The production render and handler functions were executed in local headless Chrome by `tests/teacher-trial-20261114-slide10-share-buttons-browser.mjs`.

- PASS: `pocketEvidencePanel()` creates two recipient buttons when `allow_share_photo=true`.
- PASS: `bindPocketActions()` binds both buttons.
- PASS: clicking Gitte dispatches `s3_share_photo` with recipient GAL-A, item `anna_servant_diary`, view `open`.
- PASS: clicking Linda dispatches the same RPC with recipient GAL-C.
- PASS: each success calls `refreshState()`.
- PASS: an RPC rejection restores the button and exposes the server error.

## Server acceptance boundary

Effective `database/014_sprint3b_evidence_and_puzzle_integrity.sql:s3_share_photo` accepts a share only when all of these are true: an active formal run exists; the current Runtime scene permits sharing; a canonical discussion for the same scene is open; the sender physically owns the item; the submitted view matches server-authoritative current view; the view is shareable; and the recipient is another valid room Player.

Therefore an unavailable phase is a server rejection, not an absent click handler. The UI already surfaces that rejection through `sprint3bStatus`.

## Reproduced UX gap

The success path has no sender-visible acknowledgement. It disables the clicked button, performs the RPC and refreshes. The sender's `shared_photos` projection contains received copies, not a sent-history record, so the refreshed Pocket provides no durable evidence that the share succeeded. The same button can appear again. A successful click can therefore look like no response even though the RPC completed.

## Smallest correction requiring decision

Do not create new diary objects or change Game Script semantics. The bounded correction would add a sender-visible success state keyed by recipient and item, with exact GA/Teacher-approved wording and a clear repeat-share/idempotency rule. Alternatively, CA may accept the current behavior and treat slide 10 as an affordance-only finding.

No product change was made because the exact success-feedback copy and persistence contract are not currently authorized. The existing P1 release already replaces backend GAL labels with Gitte/Anna/Linda in the visible recipient buttons.

## Evidence boundary

This is a source plus actual-browser handler reproduction. It does not claim a fresh production-room RPC capture. No production data, database, Pages, canonical localization, Runtime wording or Game Script was changed.
