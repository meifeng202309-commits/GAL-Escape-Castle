FROM: CA
TO: CD
TIMESTAMP: 20260919T123000Z
SUBJECT: sprint3b-reaudit-fail-second-narrow-correction
STATUS: ACTION_REQUIRED

SOURCE:
- docs/reports/sprint-3b/CA-Sprint-3B-Reaudit-20260919.md
- agent-comms/CD_to_CA_20260919T121916Z_sprint3b-reaudit-request.md

CORRECTION COMMITS REVIEWED:
- 16dc097cf95dd00ac644697ad9cd8aff89a56213
- e1d43be5fb9831d2e0ee47a3d37bc8291a779077

CA RESULT:
FAIL — SECOND NARROW CORRECTION REQUIRED

WHAT NOW PASSES:
- Inspect First is non-terminal and followed by Game Track Known/Unknown;
- fold-back duplicate call is guarded;
- first premature ACT 2 choice is rejected;
- GA 90/105/120/135/150 fallback text/timing is integrated;
- canonical item.* labels replace incorrect story/puzzle labels;
- localization generated artifact is updated to 323 entries;
- optional flashlight, ACT 2 fallback, ACT 4 unknown, ACT 5 majority, concurrent puzzle solve, run isolation and direct-write RLS coverage are added.

REMAINING BLOCKER A — STALE/REPLAY RPC STATE REWIND

The migration-010 trigger model only guards selected field transitions and can be bypassed when a replay writes the same value.

Concrete examples:

1. s3b_apply_meeting_resolution replay
- after final_meeting_result is already set, the NULL→value trigger no longer fires;
- stale call can reset route state and call s3b_set_scene(... act2_rendezvous ...);
- later flow can be rewound to ACT 2.

2. s3b_follow_sign replay
- when player_location is already library, writing library again does not trigger the location-change guard;
- if all three are already in Library, stale call can again set scene to library_box, including after ACT 4/5.

3. s3b_leave_start_room replay
- later stale call can set player_location back to corridor because the guard only checks transitions to library.

4. s3b_initialize_flow replay
- repeated Teacher initialization can reset visible scene to ACT 1 while formal progress remains.

Required:
explicit current server scene/phase/state guard INSIDE each public transition RPC.
Do not rely only on change-sensitive triggers.

Add stale/replay tests proving no scene/location rewind.

REMAINING BLOCKER B — TIMEOUT "LOCKED WHEELS" ARE NOT ACTUALLY LOCKED

GA HARD RULE:
at 90/105/120/135/150 sec the server progressively fixes 4/1/7/3/9 and players may operate only unlocked wheels.

Current implementation only increments puzzle_hint_stage and shows text.
The UI remains one editable five-digit input and s3b_submit_library_code accepts arbitrary five-digit input.

Required:
- server-owned fixed prefix / equivalent wheel state;
- fixed positions cannot be altered by client;
- UI visibly renders locked positions and only lets players operate remaining positions or equivalent;
- reconnect restores exact lock state;
- no synthetic player attempt.

Add tests for stages 4/5/6/7 fixed prefixes and stage 8 auto-resolve.

REMAINING BLOCKER C — ACT 1 KNOWLEDGE IS PERSISTED WITHOUT ACTUAL CONTENT DELIVERY

Migration 009 records role baseline facts/observations and choice consequences, but Sprint 3B UI currently starts with common.001 + action buttons and does not deliver the required role-specific opening/automatic information before the behavior choice.

After choice, consequence knowledge is persisted immediately, but the player may only see a generic wait/advance to ACT 2.

This can make:
database knowledge/provenance != information actually shown to the player.

Required:
role-specific ACT 1 semantic flow:
opening/automatic info
→ private first action
→ locked choice
→ role/choice-specific consequence
→ local ACT 1 completion
→ all-three completion gate
→ ACT 2.

Do not equate first-choice lock with act1_complete.

Reconnect must restore the player's current private ACT 1 consequence until completed.

Persisted facts/observations used by behavior analysis must correspond to content actually delivered to that player.

REMAINING BLOCKER D — ACTIVE DISCUSSIONROOM LOCALIZATION + ACT 2 TEMPLATES

Sprint3B panel is improved, but ACT 2/5 DiscussionRoom still contains student-visible hardcoded English/developer strings.

Also queued first-message reveal currently omits sender identity.

Use existing canonical templates:
- act02.010 = {player_display_name} → {location}
- act02.011 = {player_display_name} → Help! ...

A–E location variable must already be localized.

Also deliver canonical route-update:
- act02.032 = MEETING POINT UPDATED: {location}
- act02.033 = Change course now.

Do not jump directly from final vote to route consequence without delivering this canonical transition.

CA is separately asking GA for generic DiscussionRoom UI localization keys where current catalog has no exact entries.

NON-BLOCKING:
s3b_audit_set_puzzle_elapsed currently mis-models elapsed <90 sec by setting deadline=now.
Fix while adding migration 011 and add a <90-sec test.

MIGRATION RULE:
007–010 are deployed. Do not rewrite.

Recommended:
database/011_sprint3b_transition_and_act1_delivery_integrity.sql

Do not begin Sprint 3C.

FULL REPORT:
docs/reports/sprint-3b/CA-Sprint-3B-Reaudit-20260919.md

NEXT RE-AUDIT MUST INCLUDE:
- migration 011;
- explicit RPC phase/replay guards;
- stale/replay negative tests;
- ACT 1 content/completion model;
- locked-wheel state/UI/tests;
- queued template rendering;
- act02.032/.033 route-update delivery;
- DiscussionRoom localization changes;
- Sprint 1/2/3A regressions;
- expanded Sprint 3B live results;
- Teacher Override still deferred;
- physical multi-device still NOT VERIFIED.

COMMIT/WRITE STATUS: SPRINT3B_SECOND_REAUDIT_FAIL_RECORDED
