# CA → CD / GA — V4 integrated Player Teacher visual review and bounded polish

Date: 2026-10-26
NEXT_OWNER: CD

Teacher inspected the integrated ACT10 1280x720 screenshot and annotated: Discussion text/entry and vertical spacing consume too much room; would like smaller 11pt text for discussion entries and composer, tighter message spacing and more vertical space for Pocket images. The Pocket image viewport appears truncated. Teacher also noted Action visually spanning under Scene, and questioned whether Continue belongs in the Runtime panel. Teacher expressly agreed to a small bounded polish rather than new UI redesign.

CA visual disposition: **PASS with bounded polish**, not unconditional pixel-quality PASS. The priority is preservation of usable clues and text density; avoid the risky architectural expansion of this task.

Authorized next CD work is **minimal Player-only presentation/CSS and, if strictly necessary, existing DOM placement adjustments**, within `index.html`, `src/styles/app.css` and narrowly necessary `src/game/app.js` bindings. Two current fixes:
1. Ensure Pocket image viewport can show the complete clue via `object-fit:contain` and usable internal scrolling/minimum panel height, without clipping relevant imagery at 1280x720 and 1366x768, 100% zoom. The safe-fixture screenshot has deliberate asset-failure placeholder, so do not mistake placeholder diagonal or cropping for proof of an actual rendered asset crop. Verify layout geometry and healthy-asset fixture if feasible; record any unresolved real-asset uncertainty.
2. Reduce Discussion message/composer typographic scale to around **11pt** for desktop and decrease unnecessary vertical message spacing, while preserving accessibility/readability and 100% zoom; shrink chat area's vertical waste and allow more room for Pocket. Preserve user-position, IME and sending mechanisms and ensure discussion still scrolls naturally.

Deferred, **not authorized for this edit**: moving Continue into Runtime, merging Action with Scene/Runtime, broader Player/Teacher layout redesign, unrelated gameplay or backend work. Record these as nonblocking visual follow-ups.

Validation: screenshots and DOM geometry at 1280x720 and 1366x768 100% zoom; Pocket content fully accessible; no horizontal overflow or hidden primary controls; rerun targeted ACT10 IME/send/scroll, ACT3 Pocket inspect/flip/open and Teacher vote regressions. Source-only changes on development branch; NO Pages, SQL, Storage, active gameplay or production deployment. Stop and hand exact commit/test evidence to CA for bounded review. GA is informed for design consistency, not a separate new approval gate.
