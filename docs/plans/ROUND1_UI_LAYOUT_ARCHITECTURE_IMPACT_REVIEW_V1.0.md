# Round-1 UI Layout Architecture Impact Review V1.0

Date: 2026-10-05  
Owner: GA  
Status: Architecture consequence review after Teacher approval of V4 UI layouts

## Executive conclusion

The approved V4 layouts are **safe to pursue**, but they must **not** be implemented by replacing the current runtime entry HTML files with the prototype markup.

The layout change is visually broad but can remain architecturally bounded if CD preserves the existing runtime contracts:

- one Player entry surface: `index.html`;
- one Teacher entry surface: `teacher.html`;
- existing DOM IDs used by `src/game/app.js` and `src/teacher/teacher-console.js`;
- existing RPC/database/game-state authority;
- existing session/localStorage behavior;
- existing asset/anchor authority.

The safest implementation is therefore:

> **keep the runtime architecture; recompose the existing DOM into the approved V4 visual regions.**

The prototypes are visual contracts, not replacement application documents.

## 1. Why a literal HTML replacement would be unsafe

### Player runtime

`src/game/app.js` binds the current DOM immediately at module load, including:

- `#joinPanel`
- `#gamePanel`
- `#roomCode`
- `#joinCode`
- `#joinButton`
- `#playerLabel`
- `#sceneTitle`
- `#choiceArea`
- `#revealArea`
- `#discussionPanel`
- `#transcript`
- `#messageComposer`
- `#voteArea`
- `#sprint3bPanel`
- `#sprint3bText`
- `#sprint3bActions`
- `#sprint3bStatus`

The V4 prototype intentionally does not contain these runtime IDs. Replacing `index.html` literally would therefore break the runtime.

### Teacher runtime

`src/teacher/teacher-console.js` likewise binds many nodes at module load and attaches listeners without optional-null guards, including room creation/watch controls, discussion configuration, recovery, operations, export and Asset Manager controls.

A literal replacement of `teacher.html` with the visual prototype would leave many bindings null and can fail immediately.

## 2. Correct interpretation of the five approved prototype pages

The five approved prototype files represent **views / layout targets**, not five new runtime routes.

### Player

- `GAL_Player_Page.html` = the **in-run visual state** of the existing `index.html`.
- The existing pre-run Join surface must remain available before formal play.

### Scene transition

- `GAL_Scene_Transition.html` = a **2-second overlay/view state inside the existing Player runtime**.
- It should not be implemented as browser navigation to a new page.
- Browser navigation would unnecessarily recreate JS state, polling, DOM bindings and presentation state.

### Teacher

- `Teacher_Console.html` = the normal connected/in-run Teacher view inside `teacher.html`.
- Existing room creation/reconnect inputs still need to exist before a room is ready and can collapse/hide afterward.
- `Teacher_Emergency_Recovery.html` and `Teacher_Maintenance_Developer.html` should be internal Teacher views/sections reachable from the same Teacher runtime, not separate runtime applications.

## 3. Main architecture consequences

| Area | Impact if done safely | Main risk |
|---|---|---|
| CSS / responsive layout | LOW–MEDIUM | visual overflow / small-screen breakage |
| DOM composition | MEDIUM | breaking JS/test selectors if IDs are renamed or removed |
| Player discussion placement | MEDIUM | generic/Sprint5 and Sprint6 currently render discussion through different paths |
| Persistent Pocket placement | MEDIUM–HIGH | Pocket is currently rendered inside dynamic story HTML, not a dedicated stable mount |
| Teacher panel regrouping | MEDIUM | current Teacher JS assumes many controls exist simultaneously |
| Scene-transition screen | MEDIUM | must be presentation-only and must not disturb authoritative state/polling |
| Asset anchor overlays | MEDIUM | full-width image sizing can expose overlay/letterbox alignment problems |
| Database/RPC/game authority | LOW if preserved | becomes HIGH only if layout work changes server semantics |
| Existing browser debug harness | MEDIUM | selectors and timing assumptions can be invalidated by DOM changes |
| Manual acceptance plan | HIGH procedural impact | old frozen commit/fingerprints no longer represent the new frontend |

## 4. Player shell consequences

### 4.1 Stable DOM contract must be preserved

The approved shell should be implemented using wrappers/slots around the existing runtime nodes rather than replacing their IDs.

A suitable structure is conceptually:

- Player header slot;
- Scene/Story slot around existing runtime presentation mount;
- Action slot around existing action mount;
- Discussion slot using the existing discussion controls/transcript;
- Pocket slot fed by the existing Pocket data;
- transition overlay above the shell.

### 4.2 Discussion is not currently one implementation path

Generic/Sprint5 discussions use the existing `#discussionPanel` / `#transcript` path.

Sprint6 creates its own `.discussion-room` inside dynamic Sprint6 action HTML.

Therefore the approved “one large Discussion region” requires either:

1. a small adapter that projects both discussion implementations into one stable visual slot; or
2. careful CSS/DOM placement while preserving both renderers.

Do **not** rewrite discussion backend semantics merely to unify the visual region.

### 4.3 Pocket is the largest layout-to-structure overlap

Pocket is currently generated by `pocketEvidencePanel(...)` and inserted into dynamic `#sprint3bText` content in multiple render paths.

Moving Pocket into a stable lower-right region is therefore not pure CSS. It requires a bounded frontend renderer change.

Recommended implementation:

- introduce one stable Pocket mount in the Player shell;
- reuse the existing Pocket state, markup semantics and action RPCs;
- stop appending duplicate Pocket HTML into story content;
- preserve existing inspect/share/flip authority and reconnect behavior.

This should be treated as a **frontend shell refactor**, not a backend redesign.

## 5. Teacher layout consequences

### 5.1 Do not remove pre-run room setup

The approved Teacher prototype depicts a room-ready/in-run state.

The production page still needs:

- room code;
- Teacher token;
- three join codes;
- Create room;
- Watch/reconnect.

Recommended behavior:

- before room connection: show setup inside Live Operations / Run Control;
- once connected: collapse/hide setup and show the approved monitoring surface.

### 5.2 Emergency and Maintenance should remain within one Teacher runtime

The safest implementation is one `teacher.html` with internal views/sections:

- normal Teacher Console;
- Emergency / Recovery;
- Maintenance / Developer.

This preserves:

- Teacher token/room state;
- polling;
- event handlers;
- current DOM IDs;
- browser-test entry point.

Creating separate standalone runtime pages would require new session/bootstrap/navigation architecture and is unnecessary.

### 5.3 Existing controls may move, but IDs/contracts should remain stable

Controls currently consumed by `teacher-console.js` should be moved into the appropriate approved region without renaming/removing them unless code and tests are deliberately migrated together.

## 6. Scene-transition consequences

The 2-second screen should be **presentation-only**.

Recommended state flow:

`authoritative current scene → detect real scene identity change → show transition overlay for 2s → reveal already-authoritative next scene`

Important constraints:

- do not delay or synthesize server state transitions;
- do not navigate/reload the browser;
- do not show the transition for every minor phase/status refresh;
- key it to actual scene/location identity change;
- polling may continue, but visible next-scene rendering should be gated until the 2-second presentation completes;
- avoid repeated transition overlays if multiple refreshes report the same next scene.

## 7. Asset / anchor consequence

Several gameplay overlays are positioned using percentage anchors relative to scene/image wrappers:

- ACT4 library/map markers;
- ACT6 portrait eye overlay;
- ACT7 clock anchors;
- ACT9 door overlays;
- ACT11/12 Main Gate station overlays.

The old CSS uses image `width:100%`, `max-height:420px`, and `object-fit:contain` in some paths.

A much wider shell can change letterboxing and wrapper dimensions.

Therefore responsive acceptance must explicitly visually verify anchor alignment at representative widths. If needed, anchor overlays should be relative to the actual rendered image box rather than unused wrapper space.

## 8. Consequence for the existing debug/test plan

### 8.1 E0/E1 browser harness is coupled to stable DOM selectors

Existing browser automation directly locates IDs/classes including:

- Teacher: `#roomCode`, `#teacherToken`, `#createRoomButton`, `#startRunButton`;
- Player: `#joinButton`, `#gamePanel`, `#sprint3bPanel`, `#discussionPanel`;
- later ACT markers such as `.act4-comparison`, `#s6SceneImage`, `#s8Finalize`.

If IDs are preserved, most harness logic remains reusable.

If IDs are renamed/removed, tests will fail because the harness lost its contract, even when gameplay is correct.

Therefore:

> **preserve stable IDs wherever possible; update tests only when a deliberate interface contract change requires it.**

### 8.2 E1 must be rerun after the layout implementation

The old E1/Level2 evidence validates the old frontend structure.

The new layout changes root Player/Teacher DOM composition, discussion presentation, Pocket placement and visual scene dimensions.

Therefore at minimum rerun:

- full deterministic browser regression;
- public Player + Teacher smoke;
- reconnect;
- discussion send/receive;
- Pocket inspect/share/flip;
- ACT4/6/7/9/11-12 anchored visuals;
- ACT14 completion/reconnect.

### 8.3 Add a UI-responsive regression layer

New checks should include at least:

- 1920×1080;
- 1366×768;
- ~900px browser width;
- no horizontal overflow;
- readable multi-round Discussion transcript;
- Scene remains dominant;
- Pocket remains accessible;
- Teacher main / Emergency / Maintenance internal navigation works;
- back navigation restores the same room/run state;
- transition overlay appears once and lasts approximately 2 seconds.

## 9. Consequence for Manual Acceptance V0.2

Manual Acceptance Readiness V0.2 is explicitly tied to the frozen frontend:

`891feffe558a4683ac3da67e1e6b15e902c7e592`

and public-file fingerprint verification of that build.

Once the layout implementation changes `index.html`, `teacher.html`, `app.js`, `teacher-console.js` or `app.css`, that frozen identity is no longer the current product.

Therefore:

- V0.2 remains valid **historical evidence** for the old baseline;
- it must not be reused as current-build acceptance;
- after the new UI plus the remaining intended Round-1 semantic fixes are integrated, create a new frozen baseline and a revised manual-acceptance plan (V0.3 or successor);
- public fingerprints and screenshots must be regenerated.

## 10. Consequence for prior CA Level2 closure

The prior CA Level2 PASS remains valuable evidence for backend/runtime contracts that are not changed.

However, it no longer independently proves the newly changed frontend surfaces.

After the UI package and remaining Round-1 semantic packages settle, the changed frontend requires a **targeted independent closure/regression review** rather than assuming the old browser-visible PASS automatically carries forward.

A full backend re-audit is not automatically necessary if server contracts remain unchanged.

## 11. Recommended revised sequence

1. **Freeze the five V4 layouts** — already done.
2. **Before CD edits, require a UI change-impact map**:
   - DOM IDs preserved;
   - exact files/functions touched;
   - discussion adapter strategy;
   - Pocket mount strategy;
   - Teacher internal-view strategy;
   - transition-overlay strategy;
   - tests to rerun.
3. Implement the UI package while preserving RPC/database semantics.
4. Run responsive smoke + targeted browser tests.
5. Continue remaining Round-1 semantic work:
   - Teacher-paced timing;
   - GRAB transition;
   - Pocket image binding/detail persistence;
   - Library lock;
   - operational-location projection.
6. Run full E1-equivalent deterministic browser regression on one integrated commit.
7. Freeze a new integrated correction baseline.
8. CA targeted independent closure for changed surfaces.
9. Revised human/manual acceptance on the new frozen build.
10. E2 blind/staggered multi-client acceptance.

## 12. Final assessment

Changing the layout does **not** require rewriting the database or game engine.

But it does reopen the frontend/shared-shell integration surface and invalidates the assumption that old browser-level acceptance evidence automatically covers the new build.

Risk classification:

- **backend/game authority:** LOW if DOM/layout only;
- **frontend structural regression:** MEDIUM–HIGH;
- **existing browser test impact:** MEDIUM;
- **manual acceptance/deployment plan impact:** HIGH procedurally;
- **overall project impact:** MANAGEABLE, provided the implementation preserves runtime IDs/contracts and the debug sequence is updated.

The most important architecture rule is:

> **The V4 HTML files are visual prototypes. They define what users should see, not a new five-page application architecture.**
