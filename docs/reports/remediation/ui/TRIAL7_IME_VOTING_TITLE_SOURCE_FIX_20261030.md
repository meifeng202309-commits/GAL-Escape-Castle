# Trial 7 IME/voting/title source fix

Date: 2026-10-30  
Authority: CA letters at `20261030T013000Z` and `CA_to_CD_20261030T020000Z_linda-input-failure-new-evidence-and-ime-scope.md`  
Disposition: source/test package only; no production release

## Scope and uncertainty

The production evidence proves Linda sent no vote RPC and that server voting was authoritative. It does not log browser composition events or keystrokes. The fix addresses two directly demonstrated client defects and one source-level input hazard that exactly reproduces the clarified symptom; it does not claim that production Linda's every failed keystroke is retrospectively observable.

## Product source delta

Only `src/game/app.js` changed.

1. Track the actual composing element and centralize composition completion.
2. `compositionend`, focus loss and window blur finish composition and commit the latest deferred frame; stop/session invalidation clears a deferred frame without committing stale ownership.
3. Ignore Enter while `event.isComposing`, legacy key code 229 or tracked composition is active. IME candidate confirmation can no longer invoke Send.
4. Stable S2 `#messageText` composition no longer defers the entire confirmed frame. The node is not remounted by `renderDiscussion()`, so its DOM identity, value, focus and selection survive polling while authoritative voting controls update.
5. Remounted `#libraryCode` and Sprint6 inputs retain frame deferral. Focus/blur recovery prevents indefinite lost-composition freeze while their existing draft restoration remains intact.
6. Confirmed active frames clear the pre-run-only `sceneTitle`.
7. Leave/join clears `#messageText` and pending acknowledgements so drafts cannot cross sessions.

S2/S5 RPC selection, request identities, vote/message contracts, server guards, refresh generation and prior ACT1 routing correction are unchanged.

## Permanent real-source regression

`tests/trial7-mixed-lifecycle-discussion-browser.mjs` no longer transforms the served source. It verifies:

- pre-run → active discussion removes `Waiting for formal run`;
- Chinese IME candidate-confirmation Enter sends zero messages;
- the draft and exact `#messageText` DOM node survive three polls;
- explicit Send creates exactly one RPC/transcript acknowledgement and clears only the acknowledged draft;
- a new ongoing composition does not block Teacher discussion→voting transition;
- Linda sees the vote button while composition is active;
- refresh generation advances;
- GAL-A/B/C each submit one accepted vote, reaching 3/3;
- leave/session switching clears the local draft and returns to Join.

Evidence: `docs/reports/remediation/ui/trial7-mixed-lifecycle/TRIAL7_MIXED_LIFECYCLE_BROWSER_EVIDENCE.json`.

## Regression results

- Trial 7 permanent real-source IME/lifecycle/three-role gate — PASS.
- A1 Player polling static — PASS.
- Sprint2 static — PASS.
- V4 Player integration static — PASS.
- Trial6 ACT1/S5 routing, retry and unique vote — PASS.
- Integrated ACT6/8 Scene, ACT9 Runtime, ACT10/Teacher and ACT3 Pocket — PASS.
- Trial45 P7 three roles/two viewports, Pocket media, pre-run, tie lifecycle and Teacher layout — PASS.
- `git diff --check` — PASS.

Generated unrelated timestamp/screenshot churn was restored after testing.

## Mutation boundary

No production deployment, database, migration, Storage, TESTB/TEST8, room, message, vote or gameplay mutation occurred. Production release requires separate authorization.

