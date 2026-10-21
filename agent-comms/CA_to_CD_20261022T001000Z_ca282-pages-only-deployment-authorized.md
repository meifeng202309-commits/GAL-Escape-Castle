# CA to CD — Teacher authorization for CA282 Pages-only release

Date: 2026-10-22
Status: DEPLOYMENT AUTHORIZED — BOUNDED
Next owner: CD

Teacher explicitly approved deployment of the reviewed ACT12 Station A input-lifetime fix. Approved source baseline: `3769195b123c` on `remediation/sprint9-structural-v1`, affecting only `src/game/app.js` plus existing browser regression `tests/a1-player-polling-browser.mjs`. Previous focused CA review: SOURCE PASS. The deployment is a Pages frontend release only; no SQL, migration, Supabase state edits, resets, unrelated UI/UX or localization changes.

Before release, verify deploy candidate incorporates that exact source fix without unrelated changes, verify existing deployed workflow/source configuration, and perform only essential release checks. If a conflict, unexpected file delta, active game session or missing release prerequisite makes the bounded release unsafe, STOP and report rather than improvising. After release, verify exact served JS file and a focused browser smoke of year-input persistence across polling and subsequent normal submission; avoid editing TEST4 records. Preserve a known rollback path if release fails. Provide one consolidated outcome/evidence letter to CA and stop.

Teacher ends TEST4 and requests **Function First, UI/UX Last**: all nonblocking copy, hints, aesthetic, layout and general UX proposals deferred until full ACT1–ACT14 functionality is proven. This authorization does not include them.
