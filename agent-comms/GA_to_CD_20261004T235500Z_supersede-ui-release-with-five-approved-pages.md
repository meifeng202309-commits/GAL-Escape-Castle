# GA → CD — Superseding UI release: five Teacher-approved pages

**From:** GA  
**To:** CD  
**Date:** 2026-10-04  
**Status:** IMPLEMENTATION_AUTHORIZED — BOUNDED UI PRESENTATION PACKAGE  
**Branch:** `remediation/sprint9-structural-v1`

This message supersedes the earlier three-page UI release instruction.

## Authoritative UI target set

Use **only these five files** as the implementation targets for this package:

1. `docs/prototypes/round1-ui-v4/GAL_Player_Page.html`
   - normal GAL / Player gameplay page.

2. `docs/prototypes/round1-ui-v4/GAL_Scene_Transition.html`
   - fixed bilingual scene-transition page;
   - display for 2 seconds, then render the next authoritative scene.

3. `docs/prototypes/round1-ui-v4/Teacher_Console.html`
   - normal Teacher hosting / monitoring page.

4. `docs/prototypes/round1-ui-v4/Teacher_Emergency_Recovery.html`
   - Teacher Emergency / Recovery page opened from the main Teacher Console.

5. `docs/prototypes/round1-ui-v4/Teacher_Maintenance_Developer.html`
   - Teacher Maintenance / Developer page opened from the main Teacher Console.

## Teacher approval

Teacher has approved the layouts represented by all five files above.

The main Teacher Console should use its two bottom entries as navigation to:

- `紧急 / 恢复 · NOOD / HERSTEL`
- `维护 / 开发者 · ONDERHOUD / ONTWIKKELAAR`

Each subpage should provide its displayed back navigation to the normal Teacher Console.

## Binding rule for the two Teacher subpages

These two approved layouts authorize **presentation and navigation of existing capabilities only**.

Do not invent new recovery, override, maintenance, asset, export, reset, or diagnostic semantics solely because a prototype label exists.

Where the current product already exposes a corresponding authorized capability, bind the approved layout to that capability.

If a displayed control has no valid existing backend/action contract, leave that specific control unimplemented and report the exact missing contract to GA rather than creating new gameplay/backend behavior.

## Existing UI requirements remain binding

- dark navy/black + white-text visual atmosphere;
- Chinese / Dutch bilingual visible interface;
- Player and Teacher main pages use nearly the full browser viewport;
- responsive layout across representative desktop/laptop widths;
- Player Discussion shows a large scrollable multi-round transcript;
- Teacher Discussion Room shows a large scrollable transcript;
- Scene Transition shows only:
  - `你正进入下一个场景`
  - `Je gaat nu naar de volgende scène.`
  for 2 seconds before the next authoritative scene;
- no prototype explanation text should appear in the production UI.

## Scope boundary

This remains a bounded UI/presentation package.

Do not expand into:

- Teacher-paced backend/timing semantics;
- new hard-timeout/Add-Time behavior;
- GRAB state-transition semantics;
- new Pocket/evidence backend contracts;
- Library lock gameplay redesign;
- new Teacher operational-location backend projection;
- broad database/RPC refactor;
- visual asset redesign.

## Acceptance evidence

Return browser evidence covering the five approved pages and representative responsive widths.

For the two Teacher subpages, prove:

- main Teacher Console can enter the page;
- existing supported controls remain usable;
- back navigation returns to the main Teacher Console;
- no new unauthorized backend behavior was introduced.

## Stop condition

After the five approved UI targets are implemented and verified, **STOP and return evidence to GA**.

**NEXT_OWNER:** CD  
**NEXT_ACTION:** implement the five approved UI target pages only and return visual/regression evidence.
