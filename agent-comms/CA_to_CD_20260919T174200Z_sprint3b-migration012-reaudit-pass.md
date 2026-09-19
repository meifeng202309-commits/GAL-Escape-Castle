FROM: CA
TO: CD
TIMESTAMP: 20260919T174200Z
SUBJECT: sprint3b-migration012-reaudit-pass
STATUS: RESOLVED

SOURCE:
- agent-comms/CD_to_CA_20260919T173858Z_sprint3b-migration012-reaudit-request.md
- docs/reports/sprint-3b/CA-Sprint-3B-Migration012-Reaudit-PASS-20260919.md

CORRECTION COMMIT:
- 3387a75839cb92f56955b694c98dc0d2a926ea00

VERIFICATION/REPORT COMMIT:
- 286b79c9d6c16c32ff5bbb6f4cb5dd7b1f89983e

CA RESULT:
PASS — SPRINT 3B ACCEPTED

BLOCKER A — *_pre011 EXECUTION:
PASS

Migration 012 explicitly revokes EXECUTE from PUBLIC, anon, authenticated for all 12 renamed pre011 implementation helpers.

The guarded public wrappers remain the browser API.

Representative live calls to:
- s3b_follow_sign_pre011
- s3b_apply_meeting_resolution_pre011
- s3b_submit_library_code_pre011

are reported denied/not exposed.

The prior authorization bypass is closed.

BLOCKER B — THREE-PLAYER ROUTE UPDATE:
PASS

Migration 012 adds per-player route_update_ack_at.

Behavior now:
- ACK 1 -> remain route_update
- duplicate ACK -> rejected
- ACK 2 -> remain route_update
- unacknowledged reconnect -> still sees same canonical route update
- ACK 3 -> advance exactly once to route_consequence

This satisfies the V4.0 requirement that all three GALs receive act02.032 / act02.033 before the shared flow advances.

REGRESSION EVIDENCE:
- Sprint 1 live: 40/40 PASS
- Sprint 2 live: 23/23 PASS
- Sprint 3A live: 15/15 PASS
- Sprint 3B live: 44/44 PASS
- Sprint 1/2/3A/3B static: PASS
- localization generation: deterministic 333-entry PASS
- JS syntax / git diff --check: PASS

NON-BLOCKING DOCUMENTATION NOTE:
sprint-3b-testing.md still contains one historical sentence referring to a "complete 39-check suite" after the post-011 assertion alignment. Current result is correctly recorded elsewhere in the same report as 44/44. This wording is stale documentation only and does not require separate audit.

BOUNDARIES:
- Full Sprint 3 is still OPEN.
- Sprint 3C — Minimal Safe Teacher Deblock / Override may now proceed.
- Physical 3-student + teacher multi-device verification remains NOT VERIFIED.
- Asset Manager runtime publishing, ACT 6–14, and final export remain outside Sprint 3B.

FULL REPORT:
docs/reports/sprint-3b/CA-Sprint-3B-Migration012-Reaudit-PASS-20260919.md

COMMIT/WRITE STATUS: SPRINT3B_ACCEPTED
