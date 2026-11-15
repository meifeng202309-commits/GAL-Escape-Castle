# GA147 ACT6 Voice gate focused correction

## Result

CA-321 findings F1 and the source/test portion of F2 are corrected at implementation commit `df8184acdc4c11aafd1a743092d546a2c511a0ed`.

- Production/database deployment: **NOT PERFORMED / NOT AUTHORIZED**
- Nonproduction database execution: **BLOCKED — no authorized nonproduction endpoint or credentials are present**
- Browser execution: **BLOCKED — Playwright is unavailable and no deployed nonproduction build contains this source baseline**
- Image bytes/content: **UNCHANGED**, consistent with CA-323's corrected Teacher boundary

## F1 correction

The ACT6 first-encounter step is no longer bypassable:

1. Before the current Player acknowledges the Voice introduction, `renderSprint5` renders only the acknowledgement control; vote/advance controls are not composed into the DOM.
2. `s5_submit_vote` is wrapped server-side and rejects an ACT6 vote unless that Player has durable `act6_voice_intro_ack_at` authority.
3. `s5_advance` is wrapped server-side and rejects leaving `act6_answer` while any Player progress row remains unacknowledged. This also protects legacy/in-flight ACT6 states.
4. Existing vote replay, discussion, majority/tie, and later ACT7/8 behavior remain delegated to the prior active functions.

## F2 correction

- The SQL fixture no longer inserts directly into `s5_run_state`; it reaches ACT6 through `s5_initialize` after the ACT1–5 terminal authority is established.
- Added `tests/ga147-canonical-copy-integration-live-e2e.js`, which orchestrates the actual three-Player ACT1→ACT5 server lifecycle, including migration076's Library discovery acknowledgements, then enters ACT6 through the authoritative lifecycle.
- The live test covers Gitte returning Voice, Anna/Linda first Voice, pre-ack vote rejection, stale-run rejection, all three acknowledgements, double acknowledgement, reconnect projections, and successful three-Player post-ack ACT6 resolution.
- The test requires explicit `GAL_NONPROD_SUPABASE_URL` and `GAL_NONPROD_SUPABASE_ANON_KEY` and refuses the known production project hostname.

## Executed validation

PASS:

- `node --check src/game/app.js`
- `node --check tests/ga147-canonical-copy-integration-live-e2e.js`
- `node tests/ga147-canonical-copy-integration-static-check.js`
- `node tests/teacher-trial-20261113-p1-static-check.js`
- `node tests/v4-player-integration-static-check.js`
- `node tests/v4-two-scene-pilot-static-check.js`
- `git diff --check`

NOT RUN / NOT VERIFIED:

- `tests/ga147-canonical-copy-integration-transaction.sql`
- `tests/ga147-canonical-copy-integration-live-e2e.js`
- focused browser acceptance

These require CA or another authorized owner to supply an equipped disposable nonproduction target. The source-only correction does not claim runtime PASS.

## Ownership and remaining gate

CD's bounded correction is complete. Next owner is CA for independent audit and equipped nonproduction transaction/live/browser execution. Migration077 and migration076 remain undeployed. ACT9 remains GA-owned pending the separate canonical gameplay/copy adjudication; slide15 remains deferred.
