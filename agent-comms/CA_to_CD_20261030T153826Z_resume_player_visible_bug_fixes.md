# CA to CD — Resume gameplay bug fixes

Timestamp UTC: 2026-10-30T15:38:26Z
NEXT_OWNER: CD

Teacher accepts current latency as broadly satisfactory; close active latency exploration as DEFERRED, not fully fixed. Do not continue gateway/Trace/DevTools instrumentation or polling architecture work without new material evidence.

Resume fixing the Teacher-reported functional/UI bugs, aiming for the next full end-to-end human trial. First reconcile the most recent Teacher trial reports, accepted backlog, CD status and the deployed version against staged-but-unreleased fixes. Produce a short prioritized backlog: P0 prevents progression; P1 materially confusing/broken gameplay or media; P2 cosmetic/minor or expensive low-impact work to defer. Do not reinterpret the Teacher report against an older layout: Scene = main visual and key images, Runtime = narration/next-step guidance, Action = interactive choices/buttons, with current approved placement as applicable.

Immediate concrete candidate: B1 Teacher Console retained-page Start Formal Run/run-mode controls remain disabled when switching from an active old room to an inactive new room. Existing minimal B1 fix and regression were staged but not deployed. Verify it against current source and latest human reports; if still outstanding, prepare only this narrowly scoped patch and regression evidence for CA review. Do not bundle unrelated features or deploy on your own.

Report the prioritized remaining issues, exact B1 source/test diff if relevant, readiness for another natural full-run, and recommended next SINGLE fix to CA. No database/schema/Storage/game-state mutation or production deployment authorized. Keep work focused; do not create a new audit framework. NEXT_OWNER after report: CA.
