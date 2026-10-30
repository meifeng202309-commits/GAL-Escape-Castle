# Trial Run 6a primary bug triage and prototype retrieval

Authority: `CA_to_CD_20261030T153826Z_resume_player_visible_bug_fixes.md` and `CA_to_CD_20261030T160209Z_trial_run_report_6a_prioritize.md`  
Baseline reviewed: `b1476a4` on `remediation/sprint9-structural-v1`  
Scope: read-only source/deployment reconciliation plus one disposable local overlay feasibility fixture. No product source, canonical text, migration, database/game state, Storage or deployment changed.

## Design and evidence retrieval

The original approved Teacher Console reference is present at:

- repository path: `docs/prototypes/round1-ui-v4/Teacher_Console.html`
- GitHub URL: `https://github.com/meifeng202309-commits/GAL-Escape-Castle/blob/remediation/sprint9-structural-v1/docs/prototypes/round1-ui-v4/Teacher_Console.html`
- provenance: commit `5f70ebe049411f5948343c1c68417b4be2ae9d59`, subject `GA: add Teacher_Console.html Round-1 UI prototype V4`
- approval chain: `GA_to_CD_20261004T234500Z_release-approved-three-page-ui-layout.md`, superseded/expanded by `GA_to_CD_20261004T235500Z_supersede-ui-release-with-five-approved-pages.md`, with runtime guardrails in `GA_to_CD_20261005T005500Z_ui-layout-architecture-guardrails-and-change-impact-map.md`

The repository also contains `docs/reports/remediation/ui/trial45-p2p6/teacher-approved-prototype-1366x768.png`, which renders that reference, and `teacher-v4-1366x768.png`, which records the materially different runtime composition. Teacher explicitly approved using the repository-located GA prototype in the current instruction. This report sends the exact reference to CA; no layout implementation was performed under the current findings-only gate.

`trial run report 6a.pptx` is absent from the current worktree, the wider shared workspace and all Git path history. Only the eight-slide text mirror is available. Screenshot-dependent details below remain `SCREENSHOT_NEEDED`; the report does not claim to have seen those images.

## Current source versus deployed B1

B1 remains source-ready and production-outstanding. Commit `c4acc262` adds exactly these two resets to the `!state.active` branch of `renderDiscussionState`:

```js
runModeInput.disabled = false;
startRunButton.disabled = false;
```

`tests/trial8-teacher-retained-room-start-browser.mjs` drives one retained page from an active OLD room to an inactive NEW room, asserts both controls re-enable, then asserts one `s9_start_formal_game` dispatch for NEW. The prior evidence report records this test and `ca284-act10-teacher-open-vote-browser.mjs` passing. This executor could not rerun the browser test because the local `playwright` package is absent; the failure occurred before browser launch. Static syntax remains runnable and the source/test diff is unchanged.

The canonical GitHub Pages `src/teacher/teacher-console.js` returned HTTP 200 with `Last-Modified: Thu, 29 Oct 2026 14:32:01 GMT`, SHA-256 `3944528efe4f08bcbe027725eac2dbc2646cfa0e0bd7feac766de215494b3790`, and neither reset line. The branch source SHA-256 is `98a183ca94fdfce1e0d8ba7a6b87a543ea03b6fdac520e0313c0c2a8ceefd546`. B1 therefore needs a separate release decision, not more source implementation.

## Eight-slide triage

| Slide | Affected surface | Evidence classification | Priority and independent disposition |
|---|---|---|---|
| 1 | Teacher room creation; `s1_create_room`; room lifecycle | **CONFIRMED** | **P0/P1 boundary.** Migration 001 permanently rejects any existing room code. Existing `s1_reset_room` only deletes legacy decisions and resets legacy scene state; it does not safely retire formal runs, Pocket, discussions, votes, receipts or exports. A “Clean room” action is destructive lifecycle work and requires a separately designed teacher-authenticated RPC plus migration 074+, retention/audit policy and live-data authorization. Do not bind the current legacy Reset button as a substitute. New unique room codes remain the safe workaround. |
| 2 | `teacher.html` versus approved Teacher Console V4 | **CONFIRMED** | **P1.** The approved reference and screenshot are available and the current runtime remains a long operational page rather than the prototype's host-summary plus Live Operations/Discussion composition. Implement only after CA records the exact-reference confirmation, preserving the one-page runtime and existing IDs per GA guardrails. |
| 3 | Player pre-formal lifecycle; `renderLifecycleNotice`; title/topline | **CONFIRMED for stale Pocket; CLARIFICATION_NEEDED for exact header placement** | **P0 for cross-session contamination.** A pre-run frame clears Scene/Action/Discussion but never clears `pocketMount` or `selectedPocketItem`; after Switch Session, an inactive new room can expose the prior room's rendered Pocket DOM even though no new-room Pocket projection was committed. Fix at the client lifecycle boundary, not by deleting database rows. The requested left/right header copy maps plausibly to `index.html` title/topline, but the missing slide image is required for exact placement. |
| 4 | Player Scene key-image text overlays and likely `Castle Escape Runtime` label | **SCREENSHOT_NEEDED; technique confirmed** | **P1 where canonical text is absent.** The mirror does not identify the ACT, asset or deletion target, so no page-specific source edit is safe. Current source renders several exact clues as text siblings rather than image overlays. The disposable experiment below proves responsive overlay mechanics; the original screenshot must identify the actual asset and text. |
| 5 | Unknown progression/render loop | **SCREENSHOT_NEEDED** | **Potential P0, unclassified.** “Endless repeating” does not identify ACT, control, vote round, message, animation or audio. Prior ACT7 repeat-vote defects have separate migration071 evidence, but assigning this slide to ACT7 without its screenshot would be speculation. Request slide image plus ACT/last action. |
| 6 | Gitte Number Note back; ACT1-only title/text | **ASSET CONFIRMED; screenshot needed for runtime failure** | **P1.** `prop_gitte_number_note_back__v001.webp` visibly contains a hand-drawn star, and `pocketItemContent` selects that asset for `current_view === "back"`. Canonical `act01-g.029` also supplies ★. If the trial lacked the star, the screenshot is needed to distinguish failed back-view transition, stale/failed asset hydration or off-image sibling text. The known pre-run `sceneTitle` persistence was fixed by `f954222` and released; the screenshot must show whether Slide 6 refers to that same node or different ACT1 text. |
| 7 | Unknown Scene/prop text overlay | **SCREENSHOT_NEEDED** | **P1 pending identification.** No ACT, asset key or missing text key can be derived safely from “没有文字”. Use the PPT screenshot to bind it to one canonical asset/text key before editing. |
| 8 | Gitte Number Note front/back exact number/symbol display | **CONFIRMED source mechanism; screenshot needed for exact trial state** | **P1.** Canonical assets intentionally omit readable numbers; exact `4 – 1 – 7 – 3 – 9` must be HTML. Current `pocketItemContent` renders the image and then `localizedHtml("act01-g.007")` as a sibling. Because NL and ZH values are identical, `localizedHtml` emits the number twice, explaining the duplicate source behavior, while placement below the image can make the intended overlay appear absent. Use one deduplicated symbolic/numeric overlay keyed to the media container; preserve ordinary bilingual prose elsewhere. |

## Bounded overlay feasibility result

`tests/fixtures/trial6a-overlay-feasibility.html` uses the canonical Number Note front/back images and exact catalog values. The first 1366-wide trial exposed number overflow; the corrected fixture reduced responsive type size/spacing. Final screenshots at 1366×768 and 900×1200 show one centered number string and one star layer contained by the responsive media surface:

- `docs/reports/remediation/ui/trial6a-overlay/overlay-1366x768.png`
- `docs/reports/remediation/ui/trial6a-overlay/overlay-900x1200.png`

This proves the CSS technique only. It does not approve exact visual placement for Slides 4 or 7, replace the missing PPT screenshots, or authorize product integration.

## Prioritized implementation-ready backlog

1. **P0, next single release:** release the already isolated B1 two-line Teacher retained-page fix and its existing regression only. It blocks formal-run start in the confirmed retained-page workflow and is absent from production.
2. **P0, next source fix after separate CA gate:** clear Pocket DOM and selected Pocket identity whenever a confirmed `pre-run`/starting/session-invalidated lifecycle frame is rendered; add an old-active-room → Switch Session → new-pre-run browser regression. No DB cleanup.
3. **P1, independent Player media fix:** implement one media-container overlay helper with exact identity and numeric/symbol deduplication for Number Note front/back; verify FLIP, poll, reconnect and both viewports. Do not bundle unknown Slides 4/7.
4. **P1, independent Teacher layout package:** recompose the existing single Teacher runtime to the approved V4 reference while preserving IDs/RPCs and keeping Recovery/Maintenance internal. This is broader than B1 and must not share its release.
5. **P0/P1 gated design:** specify Clean Room lifecycle semantics before migration074/RPC work. Require explicit confirmation of what history must survive and separate authorization for destructive live-data behavior.
6. **Blocked on screenshot evidence:** Slides 4, 5 and 7, plus the exact Slide 3/6 annotations. Retrieve the original PPTX or individual images; do not infer ACT/asset from slide order.

Readiness for another natural full run: **not yet recommended on the current deployment** because B1 remains undeployed and retained-session pre-run Pocket contamination is source-confirmed. A new unique room code and fresh browser sessions mitigate both for a diagnostic run, but they do not close the defects.
