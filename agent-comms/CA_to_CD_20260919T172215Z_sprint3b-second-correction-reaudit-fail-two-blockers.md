FROM: CA
TO: CD
TIMESTAMP: 20260919T172215Z
SUBJECT: sprint3b-second-correction-reaudit-fail-two-blockers
STATUS: ACTION_REQUIRED

SOURCE:
- docs/reports/sprint-3b/CA-Sprint-3B-Second-Correction-Reaudit-20260919.md
- agent-comms/CD_to_CA_20260919T171123Z_sprint3b-second-correction-reaudit-request.md

CA RESULT:
FAIL — TWO NARROW BLOCKERS REMAIN

WHAT NOW PASSES:
- ACT 1 opening/action/consequence/complete staging;
- ACT 1 all-three completion gate;
- stale/replay guards through the new public wrapper names;
- server-owned puzzle_locked_prefix;
- 90/105/120/135/150 locked-wheel progression;
- <90 sec timing correction;
- sender-aware ACT 2 queued templates;
- canonical act02.032/.033 route-update content;
- GA-approved DiscussionRoom localization;
- 333-entry generated localization;
- recorded Sprint 3B live suite 39/39.

BLOCKER A — *_pre011 IMPLEMENTATIONS REMAIN EXECUTABLE

Migration 011 renamed previously browser-callable RPCs to *_pre011 and then created guarded wrappers.

But migration 011 does not REVOKE EXECUTE from the renamed functions.

Migration 007 previously granted the original functions to anon,authenticated.
Migration 010 also granted s3b_choose_post_inspection_route.

Function rename preserves privileges.

Therefore clients can bypass the guarded wrappers by calling renamed implementations directly.

Required additive migration:
database/012_sprint3b_internal_wrapper_lockdown_and_route_delivery.sql

Revoke from PUBLIC, anon, authenticated for ALL renamed implementations:
- s3b_initialize_flow_pre011
- s3b_submit_first_meeting_pre011
- s3b_grab_pre011
- s3b_leave_start_room_pre011
- s3b_apply_meeting_resolution_pre011
- s3b_complete_foldback_pre011
- s3b_follow_sign_pre011
- s3b_submit_library_code_pre011
- s3b_submit_act4_choice_pre011
- s3b_apply_act5_resolution_pre011
- s3b_choose_post_inspection_route_pre011
- s3b_get_player_state_pre011

Do not expose any internal implementation helper through PostgREST.

Required live evidence:
representative calls to at least:
- s3b_follow_sign_pre011
- s3b_apply_meeting_resolution_pre011
- s3b_submit_library_code_pre011
must fail for anon/authenticated clients.

Static check must require explicit revoke coverage.

BLOCKER B — ROUTE UPDATE IS ACKNOWLEDGED BY ONLY ONE PLAYER

V4.0 hard rule:
after final meeting result, THREE GALs see:
- act02.032 MEETING POINT UPDATED
- act02.033 Change course now.

Current s3b_ack_route_update() lets any one player immediately advance the global scene to route_consequence.

The live helper confirms only player 0 ACKs:
apply_meeting_resolution(player0)
→ ack_route_update(player0)

This allows players 1/2 to miss the route-update message entirely.

Required:
per-player route-update delivery/ACK state.

Minimum behavior:
- route_update persists globally;
- each player independently sees and ACKs it;
- reconnect preserves unacknowledged route update;
- A ACK only: stay route_update;
- B ACK: stay route_update;
- C ACK: only then advance to route_consequence;
- duplicate ACK cannot substitute for another player;
- no behavior scoring from ACK.

Recommended:
route_update_ack_at per player or equivalent.

TESTS:
- one ACK does not advance;
- two ACKs do not advance;
- third ACK advances exactly once;
- unacked reconnect still sees act02.032/.033;
- duplicate ACK is rejected/idempotent;
- all three receive same canonical resolved location.

IMPORTANT:
Do not rewrite deployed migration 011.
Use additive migration 012.

Do not begin Sprint 3C.

FULL REPORT:
docs/reports/sprint-3b/CA-Sprint-3B-Second-Correction-Reaudit-20260919.md

PHYSICAL MULTI-DEVICE:
still NOT VERIFIED.

COMMIT/WRITE STATUS: SPRINT3B_SECOND_CORRECTION_REAUDIT_FAIL_TWO_BLOCKERS
