# CD to CA: Sprint 6 six findings ready for focused re-audit

Timestamp: 2026-09-24T08:56:31Z

## Request

Please perform the focused Sprint 6 Level 1 re-audit for `S6-CA-001` through `S6-RC-002` and the adjacent Golden Key identity correction. Sprint 7 and ACT 14 finalization/export remain excluded.

## Correction baseline

- Failed audit baseline: `605c2fc277bfa9933cc8124b3eacafc6887b2020`.
- Correction commits: `d889302`, `dca4dac`, `81bebf0`.
- Deployed append-only migration: `035_sprint6_focused_audit_corrections.sql`.
- Migrations `033` and `034` remain unchanged.
- Handoff commit: the commit containing this letter.

## Finding closure

- `S6-CA-001`: ACT 9, ACT 10 reveal, and ACT 11 allocation now create exact-session silent-texting DiscussionRooms with canonical 180/300 and branch-specific 90/45 second windows. Messages bind to `discussion_session_id`; no Sprint 5 discussion authority is reused. No-consensus and soft failure reopen a fresh step-bound discussion.
- `S6-CA-002`: Great Hall feedback is stored in player-visible `feedback_text_keys`; wrong STEP1 uses `act09.022`, STEP2 uses `act09.023/.024/.006`, and STEP3 uses `act09.007`. Success transitions and no-consensus are visible. `shared.great_hall` and `audio.snake_hiss_short` are explicitly resolved with governed unavailable fallback.
- `S6-CA-003`: ACT 11 presents `shared.main_gate`, time and station labels. ACT 12 requires Station A `1897`, Station B `lever_center`, Station C Linda-owned `linda_star_key`, or WATCHER corridor completion before guarded ENGAGE. Failure still waits for all three roles and never selects WATCHER.
- `S6-CA-004`: server polling advances the ordered ACT 12 pressure/corridor/warning/breath/countdown/blackout/resolution stages, including the required two-second blackout and audio identities. ACT 13 requests `ending.castle_exterior` and exposes a real browser Continue action to the ACT 14 boundary.
- `S6-RC-001`: all browser-executable Sprint 6 choices, advances, allocation, station tasks and ENGAGE actions bind to expected phase, Great Hall step and round. Discussion transitions additionally bind exact session identity. Durable action receipts distinguish identical replay from stale or conflicting content. Legacy unguarded write RPC execution is revoked from `anon` and `authenticated`.
- `S6-RC-002`: `s6_allocation_attempts` preserves every locked allocation across rework; a player cannot overwrite a choice in the same round; private-choice conflicting request reuse is rejected; Great Hall group penalties record `actor_player_id=null` with `resolution_source=group_majority`.
- Adjacent identity: Golden Key item/group label now uses canonical `item.golden_key`, not TAKE action text.

## Verification

- Production live E2E PASS: Golden Key TAKE.
- Production live E2E PASS: Golden Key LEAVE, including Linda physical Silver Key precondition.
- Both paths assert exact DiscussionRoom state, stale Great Hall rejection, conflicting private-choice replay rejection, station task gates, all-role ENGAGE gate, WATCHER exclusion, ordered cinematic completion and non-final ACT 13 boundary.
- Browser smoke PASS: ACT 9 renders Sprint 6 DiscussionRoom, countdown, transcript/composer and timed gate; absent `shared.great_hall` degrades as `ASSET_UNAVAILABLE` without state mutation.
- Browser boundary PASS: ACT 13 rendered escape content and `ending.castle_exterior` governed fallback; clicking the real Continue button produced `phase_key=act13_boundary`, `act14_boundary_reached=true`, `escape_success=true`, `game_completed=false`, `export_ready=false`.
- Static PASS: Sprint 1, Sprint 2, Sprint 3B remediation, Sprint 4, Sprint 5 and Sprint 6 suites.
- Syntax PASS: `src/game/app.js` and the live E2E suite.

## Known presentation condition

The canonical scene/audio asset identities are requested through `asset_resolve`. Assets without an ACTIVE approved version currently use the established typed `ASSET_UNAVAILABLE` fallback; this does not mutate or block gameplay state.

Please freeze the handoff commit and perform the focused re-audit only. No Sprint 7 implementation has begun.
