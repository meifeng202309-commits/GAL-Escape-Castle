# CA → CD — CA-357: one independent, Teacher-requested finale Next fix; all other residual bugs await live trial

FROM: CA — Code Audit Agent
TO: CD — Coding Agent
TIMESTAMP: 2026-11-26T03:40:00Z
STATUS: ACTION REQUIRED — SOURCE ONLY, ONE BOUNDED CHANGE
NEXT_OWNER: CD
SOURCE REVIEW: `docs/reports/remediation/ui/CA357_TEACHER_20261113_26_SLIDE_RESIDUAL_BUG_DEPENDENCY_TRIAGE_20261126.md`
SOURCE: Teacher's 26-slide `debug report 13 Nov(1).pptx`, **Slide 25**
PRODUCTION BASE: Pages `d530f830186572e1cc623ce3ac71f8e5bc53af00`, CA-355

Teacher approved the following *efficient decision rule* on 2026-11-26: fix now only independently rooted, high-confidence, low-blast-radius issues; defer potentially coupled symptoms until actual human trial of the newly released version. CA reviewed **all 26 slides** and Nov17 supplemental issues. Only Slide 25 currently meets all criteria for a CD-now change.

## Bounded action

**Fix current public release `src/game/app.js` `renderSprint8(payload)`:** final sequence still uses timer-only `delays=[900,1100,1400,1800,1800]` for automated story captions. Teacher explicitly requested each final narrative slide stay visible until the player presses **Next**. Implement a simple accessible (Chinese/Dutch appropriate) Next action for the final narrative screens, while retaining the existing approved captions and sequence, opening visual fade, the visible **Switch session** control, and the completed-run no-replay/reconnect fix from CA338. Each Player advances their own narrative locally; do **not** add shared server state, migration, new narrative prose, refactoring, or a new test system.

Bounded acceptance:
- The final text after the opening fade does **not** advance on any fixed timer, even after a long pause.
- One Next click advances one frame, no double-advance; no Next after the end screen.
- Switch session stays available throughout, clears obsolete session and permits Join, with pending effects cancelled.
- Refresh does not replay a completed run from its beginning; normal in-progress reconnect remains unaffected.
- Use an existing browser test with a few focused assertions; run only relevant syntax/targeted checks.

This is a source-only instruction, **not** permission to deploy the Pages or alter live DB/Storage/registry. Return one compact CD→CA handoff with change and tests; CA will review only this exact source delta and request explicit Teacher deployment authorization if a release is desired.

**DO NOT implement the other November 13/17 report issues now.** Slide 10 sharing success feedback might depend on actual RPC phase acceptance; Teacher vote progress (slide21) and console information hierarchy (slide19) should be observed jointly; Runtime/paper/images/door scene and existing replay/join/copy fixes just changed in the current production package; the red intermittent error is not reproducible. Slide24 atmospheric illustration additionally lacks an approved artwork source. No additional micro-gates or catch-all bugfix batch.

Ownership CA → CD at 2026-11-26T03:40:00Z.
