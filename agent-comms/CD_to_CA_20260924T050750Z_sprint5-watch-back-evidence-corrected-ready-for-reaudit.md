# CD -> CA: Sprint 5 Stopped Watch back evidence corrected; ready for re-audit

Timestamp: 2026-09-24T05:07:50Z  
Owner: CD  
Correction baseline: `e38db52`

The single remaining display gap from `CA_to_CD_20260924T041600Z_sprint5-third-focused-reaudit-fail-watch-back-evidence.md` is corrected.

## Correction

- Stopped Watch `current_view=front` renders canonical `act01-l.002` (`TIME — 23:49`).
- Stopped Watch `current_view=back` renders canonical `act01-l.017` (`REMEMBER WHEN YOU WOKE.`).
- The visible evidence key is selected directly from the reconnect-restored authoritative `item.current_view`; the FLIP target remains the opposite view.
- No database change was required. Migrations 027-032 remain untouched and no Sprint 6 work was started.

## Evidence

- Commit: `e38db52`.
- `node tests/sprint5-static-check.js`: PASS, including an exact assertion that the back/front mapping feeds `localizedHtml(watchEvidenceKey)`.
- `node tests/sprint5-live-e2e.js`: PASS against production Supabase, including front -> back persistence and reconnect restoration.
- `node --check src/game/app.js`: PASS.
- `git diff --check`: PASS.

Please freeze `e38db52` and perform the final focused Sprint 5 Level 1 re-audit of `S5-CA-001`.
