# GA → CD — Release Teacher-approved three-page UI layout implementation

**From:** GA  
**To:** CD  
**Date:** 2026-10-04  
**Status:** IMPLEMENTATION_AUTHORIZED — BOUNDED UI PRESENTATION PACKAGE ONLY  
**Branch:** `remediation/sprint9-structural-v1`

## 1. Prior package status

GA has reviewed:

`agent-comms/CD_to_GA_20261004T145436Z_wpr4a-image-runtime-closure-pass.md`

WP-R4A is accepted as factually closed for its authorized infrastructure/runtime scope:

- 22/22 image identities have the approved latest version ACTIVE;
- 22/22 `asset_resolve()` pass;
- 22/22 public HTTP + SHA-256 pass;
- all required anchors pass;
- residual image-runtime issues = 0;
- normal public smoke = PASS.

WP-R4B browser-visible renderer closure is still separate and is **not** implied by this acceptance.

## 2. Teacher-approved UI target

Teacher has completed direct review of the Round-1 interface prototype and approved the current V4 layout.

CD is authorized to implement **only these three prototype pages as the visual/layout target**:

1. `docs/prototypes/round1-ui-v4/GAL_Player_Page.html`
   - use: normal GAL/Player gameplay page.

2. `docs/prototypes/round1-ui-v4/GAL_Scene_Transition.html`
   - use: fixed transition screen between scenes;
   - display the bilingual message for **2 seconds**;
   - then render the next authoritative scene.

3. `docs/prototypes/round1-ui-v4/Teacher_Console.html`
   - use: normal Teacher hosting/monitoring page.

These three files are the **only prototype files authorized for this package**.

## 3. Explicit supersession / ambiguity prevention

Do **not** use as implementation targets:

- `docs/prototypes/round1-ui-v2/**`
- `docs/prototypes/round1-ui-v3/**`
- `docs/prototypes/round1-ui-v3/review-only/**`
- any earlier combined prototype.

Those files are historical/review material only.

In particular, the review-only expanded pages for:

- Emergency / Recovery;
- Maintenance / Developer;

are **not** authorized as implementation targets in this package.

The V4 Teacher page should show only the approved collapsed category entries currently visible in the prototype.

## 4. Presentation requirements frozen by Teacher

### GAL Player page

- preserve the dark navy/black + white-text game atmosphere;
- all visible interface copy is Chinese / Dutch bilingual;
- `GAL Escape Castle` is the largest header text;
- current identity/status remains clearly visible;
- use nearly the full browser viewport instead of a narrow fixed max-width shell;
- responsive desktop/laptop layout:
  - wide desktop: approximately 65/35 scene-to-right-column balance;
  - medium laptop: approximately 60/40;
  - narrow viewport: collapse to one column without horizontal overflow;
- Scene/Image remains the dominant visual region;
- Discussion is a major persistent panel, not a tiny composer:
  - visible incoming transcript;
  - scrollable multi-round history;
  - input + Send below transcript;
  - transcript grows responsively with viewport height;
- Story/Key Information remains separate from controls;
- Pocket remains available but must not crowd out Discussion.

### GAL scene transition

Use the exact player-visible copy:

**你正进入下一个场景**  
**Je gaat nu naar de volgende scène.**

Behavior:

`current authoritative scene → transition screen (2 seconds) → next authoritative scene`

Do not add extra player-visible prototype notes or developer wording.

### Teacher Console

- dark navy/black + white text;
- Chinese / Dutch bilingual visible interface;
- use nearly the full browser viewport;
- Live Operations / Run Control remains the primary hosting panel;
- Discussion Room is visible beside it and has a large scrollable transcript;
- the bottom normal page contains only the two approved category entries:
  - `紧急 / 恢复 · NOOD / HERSTEL`
  - `维护 / 开发者 · ONDERHOUD / ONTWIKKELAAR`
- no prototype explanatory sentences should appear in the production UI.

## 5. Scope boundary

This package authorizes **presentation/layout integration**, not broad gameplay work.

### In scope

- HTML/CSS/DOM composition needed to match the three approved V4 targets;
- move/recompose existing Player/Teacher controls into the approved visual regions;
- responsive layout behavior;
- visible discussion transcript placement/scrolling;
- preserve existing Player Pocket surface in the approved location;
- bilingual labels/presentation cleanup required by the approved layout;
- 2-second scene-transition presentation layer between authoritative scene changes.

### Not authorized in this package

- WP-R1 Teacher-paced backend/timing implementation;
- hard-timeout/Add-Time logic changes;
- GRAB → automatic-leave semantic/state transition changes;
- new Pocket/evidence backend data contracts or generic image-binding architecture;
- Library lock logic/widget redesign unless separately released;
- new Emergency/Recovery semantics;
- new Maintenance/Developer functions;
- Teacher operational-location backend projection changes;
- broad database/RPC/gameplay refactor;
- visual asset redesign;
- opportunistic cleanup outside the approved three-page target.

If matching the approved layout exposes a missing backend/data contract, stop that specific subpart and report the exact blocker rather than expanding scope.

## 6. Responsive acceptance evidence

Before handoff, provide screenshots or equivalent browser evidence at representative desktop/laptop widths showing:

- no large artificial side gutters caused by fixed max-width;
- no horizontal overflow;
- Discussion transcript remains practically readable for multiple rounds;
- Player Scene remains dominant;
- Player Pocket remains accessible;
- Teacher Live Operations and Discussion Room remain readable side-by-side where viewport permits;
- sub-1000px layout collapses cleanly.

Suggested representative viewports:

- 1920×1080;
- 1366×768;
- ~900px wide narrow/laptop-browser case.

Exact device models are not authoritative; responsive behavior is.

## 7. Stop condition

After implementing and verifying these three pages, **STOP and hand factual evidence back to GA**.

Do not self-expand into WP-R1, Pocket backend/image-renderer work, GRAB semantics, Library lock, operational-location projection, or review-only Teacher subpages.

**NEXT_OWNER:** CD  
**NEXT_ACTION:** implement the Teacher-approved three-page V4 UI target only and return visual/regression evidence to GA.
