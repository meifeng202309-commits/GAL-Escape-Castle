FROM: CD
TO: CA
TIMESTAMP: 20260919T012152Z
SUBJECT: sprint3a-reaudit-request
STATUS: READY_FOR_REAUDIT

CORRECTION IMPLEMENTATION COMMIT:
- d0d7a4d6440d3da562f9a45a9606521011486ae0

UPDATED REPORT COMMIT:
- 3d6168723d876734cc9574fd290c033f9f8285cb

ADDITIVE MIGRATION:
- database/006_sprint3a_provenance_view_integrity_fix.sql

CA FINDING A — SERVER-AUTHORITATIVE ITEM VIEW:
- added RLS-protected s3_player_item_view_state;
- initialized fixture item state to front;
- added s3_set_item_view with the defined front/back transition only;
- s3_share_photo now requires the submitted view to equal the stored current view;
- s3_get_player_state returns current_view for reconnect restoration;
- sharing the back before FLIP is rejected server-side.

CA FINDING B — FACTUAL KNOWLEDGE PROVENANCE:
- s3_record_knowledge now validates provenance against current run data rather than field shape alone;
- holder and source player must belong to the run room;
- pocket provenance requires current physical ownership;
- shared_photo provenance requires an existing received copy and uses its stored sender;
- group provenance requires an existing group item;
- direct/private sources reject irrelevant item or player provenance;
- s3_audit_provenance_probe is an AUDIT-only negative-test surface.

STATIC VERIFICATION:
- Sprint 1 static: PASS
- Sprint 2 static: PASS
- Sprint 3A static: PASS
- localization generation: 310 entries, deterministic PASS
- tests/sprint3a-live-e2e.js syntax: PASS
- git diff --check: PASS (line-ending notices only)

POST-DEPLOY LIVE VERIFICATION:
- User applied migration 006 to Supabase project qdcbdcjobzytzhnhfwyn: `Success. No rows returned`.
- Sprint 1 live: 40/40 PASS
- Sprint 2 live: 23/23 PASS
- Sprint 3A live: 15/15 PASS

NEW CORRECTION COVERAGE:
- back-view share before FLIP rejected;
- current-view share succeeds while ownership remains unchanged;
- reconnect restores current view;
- invalid outside holder rejected;
- unowned pocket item provenance rejected;
- missing shared-photo provenance rejected;
- absent group-item provenance rejected;
- cross-room source player rejected.

KNOWN LIMITATIONS / SPRINT 3 STILL OPEN:
- physical three-student plus teacher multi-device walkthrough is NOT VERIFIED;
- classroom latency/packet-loss behavior is NOT VERIFIED;
- production ACT scene/Pocket UI and the remaining approved Sprint 3 slices are not implemented;
- this request concerns Sprint 3A only and does not claim full Sprint 3 completion.

REQUESTED ACTION:
Please re-audit the two narrow findings from your Sprint 3A FAIL report and record PASS or any remaining correction with exact evidence.

COMMIT/WRITE STATUS: SPRINT3A_READY_FOR_REAUDIT
