# GA → CD — Teacher trial startup/runtime defects from first manual playtest

FROM: GA  
TO: CD  
TIMESTAMP_UTC: 2026-09-27T05:45:00Z  
SUBJECT: First Teacher manual trial exposes legacy Sprint1 surface and dead ACT1–5 initialization path  
STATUS: ACTION_REQUIRED_CD / TRIAL_RUNTIME_REMEDIATION

## Context

Teacher/User began the released placeholder-first repeated trial using the current root player page and `teacher.html`.

This is **not** a wrong-URL report. The screenshots match the current root `index.html` / `teacher.html` surfaces.

The User supplied four observations in `GAL问题报告.pptx` and follow-up screenshots.

## Finding TTR-001 — legacy Sprint1 gameplay is exposed before formal run

Observed:
- one player can join and immediately see `Scene 1 — Wake Up` and choose an option before the other two players have joined;
- no opening image / placeholder is shown.

Repository trace:
- `joinRoom()` immediately calls `showGame() -> refreshState()`;
- when `s2_get_player_state.active === false`, `refreshState()` calls legacy `renderState(sprint1State)`;
- legacy `renderState()` has no image/asset rendering;
- the formal `renderSprint3b()` path, by contrast, binds role-specific opening assets through the resolver/placeholder path.

Disposition:
- the missing image in this observed state is not evidence that Sprint9 placeholder resolution failed; the User is being shown the legacy Sprint1 prototype surface instead of a pre-run lobby/formal runtime.

Expected product behavior:
- joining a room before the formal run should not expose a parallel legacy gameplay path that can be mistaken for the actual Castle Escape game;
- the player should remain in an unambiguous waiting/pre-run state until the authorized formal runtime is started.

## Finding TTR-002 — all three players receive the same wrong ACT1 choices

Observed legacy choices:
- Study the map on the wall
- Check the old keys on the desk
- Go straight to the door

Repository trace:
- these come from `src/content/scenes.js`, which is the legacy Sprint1 scene model;
- canonical formal runtime already contains role-specific ACT1 choice sets in `src/game/app.js`:
  - GAL-A: study_map / check_sound / study_number_note / search_room
  - GAL-B: read_diary / check_door / check_phone / check_vent
  - GAL-C: read_notice / study_watch / try_star_key / check_mirror

Expected product behavior:
- ACT1 must use the role-specific canonical choices.

## Finding TTR-003 — player-to-player ACT1 private choices are revealed on the legacy surface

Observed:
- after all three legacy choices are submitted, every player sees `Choices revealed` with Gitte / Anna / Linda choice values.

Canonical requirement:
- V4.0 ACT1 completion explicitly says that while waiting for the other players the GAL-facing state may show only ready/waiting status and **must not display any private first-action content**;
- Teacher visibility of LOCKED private choices is separate from player-to-player reveal authority.

Repository trace:
- legacy `s1_submit_private_choice` moves the Sprint1 state to `revealed` after three submissions;
- legacy `s1_get_player_state` then returns `revealed_decisions`;
- legacy `renderState()` renders the full `Choices revealed` block.

Disposition:
- if the legacy surface is reachable as current gameplay, this is a direct canonical/privacy violation.

## Finding TTR-004 — `Initialize ACT 1–5 flow` appears dead after formal run start

Observed Teacher state:
- Teacher Console reports `Run started: <run_id>`;
- nearby panels can still display `No active run` / `Join all three players, then start a formal run`;
- clicking `Initialize ACT 1–5 flow` produces no visible reaction and players remain on the legacy Sprint1 surface.

Static repository trace:
- current `teacher-console.js` does bind `initializeSprint3bButton`;
- `initializeSprint3b()` calls `s3b_initialize_flow` and should render either a success or an explicit failure string;
- current SQL `s3b_initialize_flow` should create the canonical ACT1 scene for an active formal run.

Therefore:
- the reported no-op is **not explained by intended static control flow**;
- it requires live reproduction against the deployed trial runtime / browser deployment state;
- the simultaneous `Run started` plus stale `No active run` presentation is useful evidence of a runtime/deployment/state-refresh inconsistency.

## Required CD action

Please reproduce from a fresh room on the currently deployed GitHub Pages + Supabase trial environment and remediate the startup path so that:

1. player join before formal run gives an unambiguous waiting/lobby state, not legacy Sprint1 gameplay;
2. formal ACT1 starts with the canonical role-specific opening, role-specific choices and opening image/placeholder;
3. ACT1 private first choices are not disclosed player-to-player;
4. Teacher startup controls produce visible, truthful state transitions and errors; `Initialize ACT 1–5 flow` must not appear to be a dead control;
5. the released placeholder/audio-fallback trial behavior remains intact.

Do not reinterpret these observations as a request to change canonical gameplay semantics.

After remediation, hand the bounded trial-startup correction to CA for focused verification if required by the normal audit rules.

NEXT_OWNER: CD  
NEXT_ACTION: reproduce and remediate the four startup/runtime defects above on the current deployed trial path.  
TEACHER_APPROVAL_REQUIRED: NO — these are defects against already-authorized trial/canonical behavior.
