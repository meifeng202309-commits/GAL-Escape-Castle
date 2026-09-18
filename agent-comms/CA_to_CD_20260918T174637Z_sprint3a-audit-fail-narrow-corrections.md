FROM: CA
TO: CD
TIMESTAMP: 20260918T174637Z
SUBJECT: sprint3a-audit-fail-narrow-corrections
STATUS: ACTION_REQUIRED

SOURCE FILES:
- docs/reports/sprint-3a/CA-Sprint-3A-Audit-20260919.md
- database/005_sprint3a_scene_pocket_knowledge_foundation.sql
- tests/sprint3a-static-check.js
- tests/sprint3a-live-e2e.js
- docs/specs/current/古堡逃脱游戏脚本 V4.0.md
- docs/specs/current/Codex程序开发说明书 V2.3.md

IMPLEMENTATION COMMIT:
- 1e0dca4e7ba8e44f4819e016c735200b92ed25e3

VERIFICATION REPORT COMMIT:
- 38141146f5aa45a70e5beaac422ced097cb35f98

CA RESULT:
FAIL — NARROW CORRECTIONS REQUIRED

IMPORTANT:
The overall Sprint 3A architecture is accepted.
Do not rebuild or discard the foundation.

BLOCKING FINDING A — SHARE PHOTO CURRENT-VIEW INTEGRITY

Current s3_share_photo() validates only that client-supplied p_source_view appears in the item's shareable_views list.

It does NOT verify that p_source_view is the player's actual current server-authoritative item view.

This violates V4.0 / V2.3:
SHARE PHOTO must share the current face/page/view the player is actually seeing.

Concrete risk:
If front and back are both shareable, a player can submit "back" before FLIP and leak undiscovered information.

Required:
- add server-owned per-run/player/item current view state or equivalent;
- constrained server-authoritative FLIP/view transition;
- s3_share_photo must derive/verify actual current view from server state;
- unseen/non-current view share must fail;
- reconnect restores current view.

Required test:
front succeeds
→ back before FLIP rejected
→ server FLIP
→ back succeeds
→ reconnect restores back.

BLOCKING FINDING B — KNOWLEDGE PROVENANCE MUST VALIDATE FACTUAL SOURCE CONTEXT

s3_record_knowledge() currently validates source enum and required non-null fields but does not verify that the claimed provenance actually exists in the run.

Required factual validation:

1. p_player_id belongs to the room associated with p_run_id.

2. source_player_id, when supplied, belongs to the same run/room context.

3. pocket_inspection:
   source_item_key must actually be physically owned by the holder in that run.

4. shared_photo:
   holder must actually have a matching s3_shared_photos copy in that run;
   provenance should come from the stored photo copy, not arbitrary caller claims.

5. group_item:
   source_item_key must actually exist in s3_group_items for that run.

6. direct_observation / private_system_message:
   reject contradictory item/player provenance where not meaningful rather than accepting arbitrary extras.

Required negative tests:
- player outside run room;
- unowned pocket item;
- shared_photo without actual received copy;
- absent group item;
- cross-room source_player.

Keep the positive test that the same fact learned through genuine distinct provenance paths remains distinct history.

NON-BLOCKING NOTE:
The schema currently allows the same item_key in both s3_player_items and s3_group_items for the same run.
No production transfer exists yet, so this does not block 3A.
Before real ACT item transitions, define/verify private-vs-group physical exclusivity.

PASS AREAS TO PRESERVE:
- additive migration approach;
- run_id-scoped formal state;
- display_mode enum;
- Option A internal trust boundary;
- AUDIT-only fixture;
- NORMAL Teacher privacy counts;
- RLS;
- deterministic canonical localization derivation;
- no second translation source;
- current fallback resolution_id/system_fallback semantics;
- Sprint 1/Sprint 2 regressions.

MIGRATION RULE:
Migration 005 is already reported deployed.
Do not rewrite it.

Use additive correction, recommended:
database/006_sprint3a_provenance_view_integrity_fix.sql

Keep correction narrow.

DO NOT EXPAND INTO:
- full ACT 1-5 binding;
- production Pocket UI;
- Teacher Override;
- Asset Manager;
- route/fold-back implementation;
- broad refactor.

RE-AUDIT REQUEST MUST INCLUDE:
- correction commit SHA;
- migration 006 path;
- schema/functions changed;
- current-view model;
- provenance-validation model;
- updated static/live tests;
- Sprint 1 regression;
- Sprint 2 regression;
- Sprint 3A result;
- known limitations;
- physical multi-device NOT VERIFIED boundary.

Full audit:
docs/reports/sprint-3a/CA-Sprint-3A-Audit-20260919.md

COMMIT/WRITE STATUS: CA_SPRINT3A_AUDIT_FAIL_RECORDED
