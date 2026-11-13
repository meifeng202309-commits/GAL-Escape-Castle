# Teacher trial 2026-11-13 — CD P1 source evidence

## Scope and baseline

- Input: original 26-slide `debug report 13 Nov.pptx`, CA assignments at `d3f5f32` and `921a5be`.
- Source-only corrections. No production SQL, Pages deployment, room mutation, or canonical source edit.
- Protected/read-only sources remained unchanged: Game Script V4.0, Codex Development Specification V2.4, localization catalog, asset registry, Castle Visual, deployed migrations 001–074.

## Corrections

1. Repeated Runtime accumulation (slides 5, 13, 16, 18): `routeFormalPresentation()` moved action/status nodes into Runtime on every poll while stable-render state retained the prior moved nodes. Routed nodes are now marked and replaced once per render.
2. Pocket before formal start (slide 2): `renderLifecycleNotice()` did not clear the previous Pocket DOM. Pre-run/starting states now reset the selection and render an empty Pocket.
3. Room reuse (slides 1, 26): the V5 UI selected a completed run, while deployed migration 074 accepted only an active run. Additive migration 075 permits the selected active or completed run, preserves completed status/history, interrupts only active runs, rotates session generation, and expires Player sessions. UI now states the existing-room sequence: Watch/Reconnect → Prepare next run → three Players rejoin → Start.
4. Teacher vote observability (slide 21): Teacher cards now show named Player `Submitted`/`Waiting` state plus the canonical raw phase, step and discussion status. No GA-owned narrative round names were invented.
5. Role labels (slide 22): visible share/reveal labels use Gitte/Anna/Linda while backend role IDs remain unchanged.
6. Slide 23: current localization source already contains A站/B站; no source change.

## Focused evidence

- PASS: JS syntax checks for Player and Teacher sources.
- PASS: `node tests/teacher-trial-20261113-p1-static-check.js`.
- PASS: `node tests/teacher-console-v5-static-check.js`.
- PASS: `node tests/teacher-console-v5-browser.mjs` outside the restricted sandbox. Assertions include stage visibility, per-player submission visibility, active-run prepare, released sessions, preserved-row warning, and responsive layout.
- NOT RUN: `tests/teacher-trial-20261113-room-reuse-postgresql.sql`; no disposable PostgreSQL/Supabase branch was available. It is supplied for CA-controlled migration validation.
- NOT RUN: integrated Playwright Player browser suite because the current environment has no `playwright` module. The focused static contract covers the two Player root-cause changes; independent browser verification remains an audit item.

## Timeout and deferred issues

- Slide 15 named `s2_get_player_state`. A read-only Supabase log query for the preceding 24 hours found sustained HTTP 200 calls around 11:11–11:15 UTC and no `statement timeout` log row. The screenshot proves a transient failure, but it was not reproducible/materially attributable from retained logs; no speculative source or database change was made.
- Slides 7, 9, 10 and 19 require a separate evidenced asset/control inventory; no clue content or canonical wording was invented in this P1 patch.
- GA-owned copy/art/ending work remains untouched.

## Teacher operator sequence after an authorized release

1. Enter the existing Room Code and Teacher token, then select **Watch / Reconnect**.
2. In the lower session tools, select **Prepare next run** and confirm.
3. Have Gitte, Anna and Linda rejoin with their original join codes.
4. Wait for `3/3 connected`, then select **Start Formal Run**.

Migration 075 and frontend changes require CA audit and a separately authorized production release before this sequence is effective publicly.
