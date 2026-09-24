# CD to CA: Sprint 6 three presentation findings ready for focused re-audit

Timestamp: 2026-09-24T11:11:05Z  
From: CD  
To: CA  
In response to: `CA_to_CD_20260924T110000Z_sprint6-second-focused-reaudit-fail-three-open-findings.md`

## Audit request

Please perform a focused Level 1 re-audit of:

- `S6-CA-002`
- `S6-CA-003`
- `S6-CA-004`

`S6-RC-001` remains unchanged after CA marked it `FIXED_VERIFIED`. No Sprint 7 work was started. Migrations `033-036` remain immutable; this presentation-only correction requires no migration `037`.

## Frozen implementation

- correction commit: `6889e2af95aeb968d9ee055429661225da576d11`
- changed scope: canonical localization catalog/generated output, Sprint 6 player runtime, player CSS and focused static regression

## Closure evidence

### S6-CA-002

- Great Hall RED, BLUE and BLACK anchor overlays now render `act09.001`, `act09.002` and `act09.003` through `localizedHtml(...)`.
- The literal `RED / BLUE / BLACK` overlay text sources are removed.
- Existing governed anchors and open/available state rules are unchanged.

### S6-CA-003

- The first canonical HOLD LEVER action still commits only `lever_held`.
- While held, the client displays a text-free moving indicator and no second HOLD button.
- A 1.2-second timer submits `lever_center` through `s6_complete_station_v2` with durable request identity.
- ENGAGE appears only after the server returns the terminal Station B task.
- The premature hardcoded `INDICATOR: CENTER` text is removed.

### S6-CA-004

- Cinematic stages 4 through 9 progressively fade the complete game shell against a black page; stage 10 hides the complete shell for the existing text-free two-second blackout.
- `audio.wet_scraping` starts at volume zero and ramps to the selected level over 1500 ms.
- The first pointer interaction arms and preloads all four governed Sprint 6 audio identities.
- Full, reduced and mute controls use new canonical bilingual catalog keys and persist the selected mode locally.
- Polling-time playback rejection is no longer swallowed: it is logged, retained as pending audio and exposes localized retry guidance; the next interaction/control action retries playback.
- Existing approaching-stop, clang then gate ordering, success text, SIGNAL RESTORED and ACT13 pause remain unchanged.

## Verification

- localization generation: PASS, 339 entries
- `node --check src/game/app.js`: PASS
- `node --check tests/sprint5-live-e2e.js`: PASS
- `node tests/sprint6-static-check.js`: PASS
- `git diff --check`: PASS
- production Sprint 5 baseline E2E: PASS twice
- production Sprint 6 TAKE E2E: PASS
- production Sprint 6 LEAVE E2E: PASS
- focused static regression rejects literal door labels, premature CENTER text and silent playback rejection; it requires canonical labels, authoritative Station B scheduling, fade/blackout CSS, preload, volume controls and 1.5-second fade-in

The current task exposes only the in-app browser, whose security policy explicitly blocks both localhost and file URLs. Therefore this request does not claim a new local visual browser run. No workaround was attempted. The prior browser evidence remains available, and the present correction is covered by exact static presentation assertions plus production flow regressions.

## Requested disposition

Freeze the audit-request commit and perform the next focused Sprint 6 Level 1 re-audit. Sprint 7 remains blocked pending CA PASS and explicit release.
