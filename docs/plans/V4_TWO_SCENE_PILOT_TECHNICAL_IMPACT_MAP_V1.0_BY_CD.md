# V4 two-scene pilot — CD technical impact map V1.0

Date: 2026-10-25
Status: proposal only; no implementation or production authority
Rollback checkpoint: `5ce1339`

## 1. Pilot boundary and entry

Use an isolated local pilot, never a Pages branch or live room:

- new `pilots/v4-two-scene/player.html?case=act10|act3`: V4 shell that preserves every DOM ID required by current `src/game/app.js` and imports that real production module;
- existing `teacher.html` served locally as the companion Teacher surface for ACT10;
- new `tests/helpers/v4-two-scene-pilot-driver.js`: operator host with intercepted Supabase RPCs and deterministic synthetic authoritative projections, based on the existing operator-host pattern;
- new `tests/v4-two-scene-pilot-browser.mjs`: automated form of the same driver;
- new `src/styles/v4-two-scene-pilot.css`: scoped opt-in layout only, loaded by the pilot HTML.

The pilot must not add a production query flag, redirect `index.html`, copy gameplay logic, or call production mutations. Teacher receives local URLs from the operator host. Standalone static prototype HTML is not evidence; the pilot runs the real `app.js` polling/render/action code against an isolated state machine that validates request identities and transitions.

## 2. Exact production functions and contracts exercised

No production edit is proposed in the first pilot slice. The isolated shell exercises:

- Player lifecycle/polling: `loadPlayerFrame`, `commitPlayerFrame`, `refreshState`, `startPlayerRefresh`, `scheduleNextPlayerPoll`;
- generic/Sprint5 discussion: `renderDiscussion`, `sendMessage`, `renderVote`;
- Sprint6 ACT10 discussion: `sprint6Discussion`, `renderSprint6`, `captureSprint6DiscussionDraft`, `restoreSprint6DiscussionDraft`, `sendSprint6Message`, `runSprint6Action`;
- ACT3: `renderSprint3b`, `libraryIdentity`, `captureLibraryDraft`, `restoreLibraryDraft`, `submitLibraryCode`;
- Pocket: `pocketEvidencePanel`, `pocketItemContent`, `bindPocketActions`;
- Teacher ACT10: `loadState`, `loadDiscussionState`, `renderDiscussionState`, `openVote`, `sprint6OpenVotePayload`.

The driver supplies the existing projection/RPC shapes for `s2_get_player_state`, `s3b_get_player_state`, `s3_get_player_state`, `s5_get_player_state`, `s6_get_player_state`, `s8_get_player_state`, `s9_get_player_wait_state`, Teacher state/console reads, message RPCs, Library submission, Pocket inspection, and ACT10 Teacher Open Vote. No schema, semantics, vote, inventory, or asset contract changes.

## 3. Stable DOM contract

Preserve unchanged IDs used at module load and by existing tests: `joinPanel`, `gamePanel`, `roomCode`, `joinCode`, `joinButton`, `leaveButton`, `joinStatus`, `gameStatus`, `playerLabel`, `sceneTitle`, `sceneText`, `choiceArea`, `revealArea`, `discussionPanel`, `discussionTopic`, `discussionDeadline`, `discussionMeta`, `initialChoiceArea`, `transcript`, `messageComposer`, `messageText`, `sendMessageButton`, `voteArea`, `voteHistory`, `discussionStatus`, `sprint3bPanel`, `sprint3bText`, `sprint3bActions`, and `sprint3bStatus`.

Dynamic IDs remain unchanged: `s6MessageForm`, `s6MessageText`, `libraryCodeForm`, `libraryCode`, and all existing data attributes such as `data-s6-rpc`, `data-inspect-item`, `data-flip-item`, and `data-share-*`.

Only new wrapper classes/landmarks are allowed: `.v4-pilot-shell`, `.v4-scene-region`, `.v4-action-region`, `.v4-discussion-region`, `.v4-story-region`, and `.v4-pocket-region`. No existing JS selector needs to change for the pilot.

## 4. Discussion mapping and stability rule

There are currently two materially different paths:

- generic/S3B and Sprint5 use the persistent `#discussionPanel`; `loadPlayerFrame` chooses `s2_get_player_state` or `s5_get_discussion_state`, normalizes it as `discussionView`, then calls `renderDiscussion`. Today `renderDiscussion` replaces transcript HTML and unconditionally forces `transcript.scrollTop = transcript.scrollHeight` every poll.
- Sprint6 ACT9/10/11 uses `sprint6Discussion()` embedded inside `#sprint3bActions`; `renderSprint6` rebuilds it every poll. Draft/selection restoration exists, but transcript scroll intent is not preserved.

Both mounts map visually into `.v4-discussion-region`, but retain their existing RPC owners and dynamic IDs. Pilot acceptance requires a shared presentation policy, proven first in the harness: capture `{discussion identity, wasNearBottom, scrollTop, draft, focus, selection}` before commit; after same-owner/same-session render, restore draft/focus/selection, follow only when previously near bottom, otherwise restore the earlier-message anchor. Identity change may reset/follow once. The pilot may demonstrate this in its host adapter; any extraction into production helpers requires the later integration authorization.

## 5. Pocket mount strategy

Current Pocket markup is produced by `pocketEvidencePanel()` and injected into `#sprint3bText` from S3B, Sprint5, and Sprint6 paths; rebuilding the story region recreates `<details>` and collapses the Teacher/Player view.

The pilot shell provides stable `.v4-pocket-region` adjacent to, not inside, story/action output. The pilot driver moves the generated Pocket presentation into that region after each real render while preserving the same buttons/data attributes and immediately reusing `bindPocketActions()`. It captures open item keys and scroll position by canonical item identity and restores only items that still exist. It does not introduce a Pocket RPC or duplicate Pocket state. Production integration should later make this a first-class stable mount rather than retain post-render movement.

Watch/map/servant-diary images are explicitly not wired in the pilot. Existing canonical asset availability should be mapped separately and wired only in the first approved V4 integration batch.

## 6. ACT10 Teacher companion behavior

The pilot uses current `teacher.html`/`teacher-console.js`, not a prototype replacement. Synthetic NORMAL ACT10 projections must enable `#openVoteButton` only for the exact ACT10 discussion identity. After the authorized click, the driver returns the next canonical phase and the UI must show durable acknowledged status (button disabled plus visible `discussionTeacherStatus`/state status) through subsequent 1.2-second polls. This is presentation feedback only; `sprint6OpenVotePayload` and server semantics remain unchanged.

Teacher Pocket collapse is reproduced and measured in the pilot, but a Teacher layout refactor is outside this first Player V4 shell implementation. The same identity-based `<details>` preservation rule is the proposed later fix.

## 7. Responsive and visual constraints

- Desktop `>=1400px`: V4 two-column scene/action-discussion grid; Discussion height `clamp(320px,44vh,640px)`.
- Laptop `1000–1399px`: narrower columns with Discussion `clamp(300px,40vh,540px)`; no viewport jump at 1366×768 and 1280×720.
- `<1000px`: one-column order scene → action → discussion → story → Pocket; no horizontal overflow at 768×1024.
- Inputs remain visible under browser zoom 100% and 125%; focus restoration uses `preventScroll`.
- Full-width scene images remain `object-fit:contain`. Existing percentage anchor overlays remain relative to the image wrapper; the two pilot scenes do not alter anchor-dependent ACT6/7/9/13 rendering, which remains an integration-gate regression.

## 8. Fixtures and acceptance

ACT10 fixture: three Player contexts plus Teacher, genuine 1.2-second poll cadence, 3 messages per player, 5–10 seconds of paused typing spanning at least two polls, near-bottom follow, deliberate scroll-up anchoring, Teacher Open Vote identity check and phase change, no lost/duplicated message.

ACT3 fixture: real Library renderer with partially typed numeric code through at least two polls, exact focus/selection/draft and viewport preservation, submit once, Pocket kept open through polls, inspect/flip action binding retained.

Run at 1440×900, 1366×768, 1280×720, and 768×1024. Record DOM identity, request bodies, transcript/draft/scroll snapshots, and screenshots. No production URLs or secrets are needed.

## 9. Existing and new regression coverage

Keep selectors and expectations unchanged in `tests/a1-player-polling-browser.mjs`, `tests/a1-player-polling-static-check.js`, `tests/ca284-act10-teacher-open-vote-browser.mjs`, `tests/act7-v4-normal-timeout-browser.mjs`, `tests/bmin-teacher-operations-browser.mjs`, `tests/remediation-e1-browser.mjs`, and structural Pocket checks.

Add one dedicated pilot browser suite for the acceptance matrix above. Later production integration—not this pilot—would require updating layout-only screenshot/position expectations while preserving all functional selectors.

## 10. Rollback and effort

Pilot rollback is deletion/revert of the new isolated `pilots/v4-two-scene/*`, scoped CSS, driver, and test files; production files and database remain byte-identical to checkpoint `5ce1339`.

Bounded estimate after GA/CA approval:

- isolated V4 shell + synthetic operator driver: 1–1.5 CD days;
- ACT10/ACT3 state fixtures and hands-on controls: 0.75–1 day;
- automated four-viewport regression/evidence: 0.75–1 day;
- focused correction allowance: 0.5 day.

Total: 3–4 CD days, with a mandatory GA layout review and CA regression review before Teacher hands-on testing. Production integration is a separate estimate and authorization.

