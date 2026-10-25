# V4 Player-first integration change-impact map V1.0

Date: 2026-10-26  
Author: CD  
Inspection baseline: `4f1bb92beeb56bc4fb986974a41031b748476c2c`  
Disposition: read-only impact analysis; no production implementation authority exercised

## 1. Smallest production edit boundary

The bounded package should change only:

- `index.html`: recompose the existing Player nodes into stable Scene, Action, Discussion, Story and Pocket mounts. Keep the one Player entry point and every currently bound ID. In particular, retain `#gamePanel`, `#sceneTitle`, `#sceneText`, `#choiceArea`, `#revealArea`, `#discussionPanel`, `#transcript`, `#messageText`, `#sprint3bPanel`, `#sprint3bText`, `#sprint3bActions` and `#sprint3bStatus`.
- `src/styles/app.css`: add Player-only five-region grid, panel sizing and responsive/internal-scroll rules. Do not restyle `teacher.html` or the Teacher console.
- `src/game/app.js`: add stable presentation mounts and lifecycle-state capture/restore around existing render commits; add Pocket asset rendering through the existing asset resolver. The exact production touchpoints are `commitPlayerFrame` (line 230), `renderSprint3b` (484), `pocketItemContent` / `pocketEvidencePanel` / `bindPocketActions` (540-590), `renderSprint5` (563), `sprint6Discussion` (604), `captureSprint6DiscussionDraft` / `restoreSprint6DiscussionDraft` / `renderSprint6` (632-635), `renderDiscussion` (697), `sendMessage` (784), and `sendSprint6Message` (671).
- targeted tests only, listed in section 6.

Explicitly unchanged: `src/state/session.js`, `src/supabase/client.js`, all RPC names and payloads, database/migrations, authentication/session storage, request-id replay handling, game/vote/story authority, `teacher.html`, `src/teacher/teacher-console.js`, Pages, Storage, assets and real rooms. `loadPlayerFrame` and its projection ordering remain semantically unchanged; it continues to select generic/Sprint5 versus Sprint6 authoritative projections.

## 2. Real-render lifecycle adaptation

The pilot adapter is evidence for behavior, not production code to copy wholesale. Production should implement small state helpers inside `app.js`, keyed by canonical runtime identity, and capture immediately before the renderer's existing `innerHTML` commit:

- generic/Sprint5 discussion identity: authoritative discussion session when present, otherwise the current run/topic/status tuple already projected to `renderDiscussion`;
- Sprint6 identity: existing `sprint6DiscussionIdentity(payload)` (`run_id.phase_key.discussion_session_id`);
- Library identity: retain the existing `libraryIdentity` locked-prefix boundary;
- Pocket identity: `item_key`, not translated label text.

For generic/Sprint5 `renderDiscussion` and Sprint6 `renderSprint6`, capture `{draft, focused, selectionStart, selectionEnd, composing, scrollTop, wasNearBottom}` before replacement. On a same-identity commit:

1. If an input has active native composition, do not replace its owning composer/discussion subtree. Continue reading projections, but defer that subtree's DOM commit until `compositionend`; then perform one current-state refresh. This preserves the real IME node and does not stop global polling or install a host shim.
2. Otherwise restore draft/focus/selection with `focus({preventScroll:true})` and restore the browser viewport. A new identity receives no old draft.
3. A newly entered discussion starts at the bottom once. On later same-identity commits, follow the bottom only if the reader was within 24px of it; otherwise restore the prior reading anchor.
4. Generic `sendMessage` and Sprint6 `sendSprint6Message` keep their existing RPCs. Do not clear optimistically. Mark the identity/text as pending and clear only after the refreshed authoritative transcript contains the current Player's display name plus exact message text. RPC failure retains the draft. Existing idempotent request identity remains the only retry mechanism.
5. Render Pocket in a stable dedicated mount. Capture `details[open]` by `item_key` before render and restore only items still present. Keep `data-inspect-item`, `data-flip-item`, `data-target-view`, `data-share-*` and `bindPocketActions`; do not create a Pocket RPC or duplicate authoritative state.

This applies to both the persistent generic/Sprint5 `#discussionPanel` and the Sprint6 discussion currently rebuilt under `#sprint3bActions`. The integration should place either active discussion presentation in the stable Discussion region without changing which renderer/RPC owns it. No `MutationObserver`, synthetic route interception, test hook or pilot polling suspension belongs in production.

## 3. Canonical asset inventory and exact gap

Read-only source inventory from `assets/asset-registry.json` and tracked staging manifests/binaries:

| Pocket item identity | Canonical asset key(s) | Source status | Current runtime wiring |
|---|---|---|---|
| `gitte_castle_map` | `prop_gitte_castle_map` | latest 1, active 1; `assets/staging/prop_gitte_castle_map/v001/*` exists | Asset resolver wiring exists for Sprint5 `#s5MapImage`; `pocketItemContent` is text-only. Mapping mismatch in Pocket, not missing art. |
| `anna_servant_diary` | `prop_anna_diary_open` | latest 1, active 1; `assets/staging/prop_anna_diary_open/v001/*` exists | No Pocket image mapping; text-only. Mapping mismatch, not missing art. |
| `linda_stopped_watch` front | `prop_linda_watch_face` | latest 1, active 1; tracked v001 manifest/WebP exists | Authoritative `current_view` and flip RPC exist, but Pocket renders text. Mapping mismatch, not missing art. |
| `linda_stopped_watch` back | `prop_linda_watch_back` | latest 1, active 1; tracked v001 manifest/WebP exists | Same as front. Mapping mismatch, not missing art. |

The runtime mapping should be a fixed local table from authoritative item/view to these canonical asset keys and should call the existing `trialAssetResolver`/`setS5Asset` failure path. It must not infer names, regenerate art, write the registry, or treat local `active_version` as proof that a deployment environment resolver is healthy. `NO_ACTIVE_ASSET`, unavailable storage object or ambiguous item/view must show the existing visible placeholder/status and trigger STOP/escalation rather than fallback to guessed media.

## 4. Player-first five-region layout at 100% zoom

Use one semantic shell inside `#gamePanel`: Scene and Action in the first row, Discussion beside/below them as space permits, Story and Pocket in the final row. Existing nodes are moved into these mounts once; renderers update their content without navigation or duplicate IDs.

- At 1366x768: two-column grid, approximately `minmax(0,1.35fr) minmax(360px,.85fr)`. Scene/Action share the left flow; Discussion is a bounded right panel; Story/Pocket occupy the lower row. Header and status remain visible. Discussion, Story and Pocket each use `min-height:0` and internal `overflow:auto`; scene media uses `object-fit:contain`.
- At 1280x720: same two-column model with tighter 12px gaps/padding and a 320px right minimum. Region heights use viewport-aware `clamp`, with internal scrolling. No fixed minimum width may force horizontal overflow.
- Below 1000px: one-column source order Scene -> Action -> Discussion -> Story -> Pocket, preserving keyboard order.

Acceptance at both named desktop sizes is 100% browser zoom, no horizontal document overflow, no required whole-browser zoom, composer/action controls reachable, and intentional window scroll not reset by polling. Internal panel scrollbars are permitted and preferred to shrinking text or media beyond usability. Teacher layout is outside scope.

## 5. Phased implementation and rollback

Estimated effort after authorization: 2.5-3.5 CD days including regression evidence.

1. **Structure/CSS (0.5-1 day):** checkpoint from authorization baseline; add mounts and responsive Player CSS without renderer/RPC changes. Static ID and no-overflow tests first.
2. **Lifecycle (1-1.5 days):** implement shared identity-bound input/composition/scroll/Pocket state helpers and apply them to generic/Sprint5 and Sprint6 commit points. Preserve current send functions and authority.
3. **Canonical media (0.5 day):** add the four explicit item/view mappings through existing resolver behavior; no registry or asset mutation.
4. **Regression/evidence (0.5 day):** run focused browser/static suites and inspect screenshots at 1366x768 and 1280x720, 100% zoom.

Rollback checkpoint is the exact CA-authorized pre-edit SHA (currently inspected baseline `4f1bb92beeb56bc4fb986974a41031b748476c2c`). Keep the integration as one revertible source commit followed by evidence/reconciliation. No Pages deployment is part of this package.

## 6. Precise targeted validation

- Extend `tests/a1-player-polling-browser.mjs`: three Player contexts, generic/Sprint5 and Sprint6; real composition events held across at least three 1.2s polls; same input node/value while composing; focus/selection/draft after commit; successful authoritative send clears once; failed send preserves; new identity discards; fresh discussion starts at bottom; near-bottom follows; scrolled-up anchor remains.
- Preserve `tests/a1-player-polling-static-check.js` and add single-runtime/stable-ID/no pilot hook assertions.
- Re-run `tests/ca284-act10-teacher-open-vote-browser.mjs`: exact run/phase/step/round/discussion identity, one Open Vote, Player transition and disabled discussion submission.
- ACT3 real renderer: locked prefix plus numeric suffix across polls, exact combined submission, Pocket inspect/flip, open state through refresh and reconnect, and the four mapped media keys/views.
- Reconnect: saved Player session returns to the same authoritative phase with no stale draft/scroll/Pocket identity leakage.
- Responsive browser screenshots and assertions at 1366x768 and 1280x720, zoom 100%, three Players where relevant; no document horizontal overflow and no polling viewport jump.
- Re-run affected image-anchor suites: existing ACT4 comparison/map, ACT6 portrait overlay, ACT7 clocks, ACT9 Great Hall doors and ACT11/12 Main Gate station anchors. The layout may resize containers but must not change anchor coordinates or asset identities.
- Re-run existing Player/Teacher polling and bounded W03/ACT13 navigation tests to demonstrate no RPC/game semantic change.

## 7. STOP conditions

Stop and return to CA before implementation or release if: authorization names a broader/different baseline; any required stable DOM ID or RPC payload must change; an authoritative discussion/item/view identity is absent; production IME preservation would require stopping all polling rather than deferring only the conflicting subtree; any canonical asset key is missing/ambiguous or resolver reports unavailable; an image requires new art/registry/Storage work; responsive fit requires Teacher redesign or browser zoom; tests expose backend/session/vote/story changes; a migration, Pages switch, real-room action or production state mutation becomes necessary. Deployment and a full-game run require separate gates.
