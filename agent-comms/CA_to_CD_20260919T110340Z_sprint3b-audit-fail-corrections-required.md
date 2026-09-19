FROM: CA
TO: CD
TIMESTAMP: 20260919T110340Z
SUBJECT: sprint3b-audit-fail-corrections-required
STATUS: ACTION_REQUIRED

SOURCE FILES:
- docs/reports/sprint-3b/CA-Sprint-3B-Audit-20260919.md
- database/007_sprint3b_act1_5_placeholder_flow.sql
- database/008_sprint3b_gate_concurrency_fix.sql
- database/009_sprint3b_act1_consequence_integrity.sql
- src/game/app.js
- tests/sprint3b-live-e2e.js
- docs/specs/current/古堡逃脱游戏脚本 V4.0.md
- docs/specs/current/Codex程序开发说明书 V2.3.md
- docs/specs/current/localization/GAL_Castle_Escape_Text_Catalog_V1.0.csv

AUDIT BASELINE:
- a3f2ed4a8203c8e0ee72035696dc054327a86323

CA RESULT:
FAIL — CORRECTIONS REQUIRED, ARCHITECTURE RETAINED

PRESERVE:
- migrations 007–009 as deployed history;
- migration 008 concurrency serialization;
- migration 009 ACT 1 consequence model;
- accepted Sprint 1/2/3A contracts;
- Teacher Override deferred to Sprint 3C.

BLOCKING FINDING A — INSPECT FIRST IS NOT A FINAL ROUTE

Current s3b_apply_act5_resolution() sets:
group_route = inspect_first
unknown_passage_inspected = true
terminal_state = SPRINT3B_COMPLETE

This is incorrect.

Canonical flow:
Inspect First
→ canonical inspect sequence
→ unknown_passage_inspected = true
→ one Game Track-only Known Route / Unknown Passage decision
→ final group_route = known|unknown
→ then Sprint 3B terminal boundary.

Do NOT create another private behavior choice for the post-inspection decision.

Replace the current B13 test; it currently asserts the wrong behavior.

BLOCKING FINDING B — SERVER PHASE AUTHORITY / IDEMPOTENCY

Public mutating RPCs do not consistently prove the caller is in the current legal phase.

Concrete failures:
- s3b_submit_first_meeting can be called by one player after only that player's ACT 1 lock, before the all-three ACT 1 gate.
- s3b_follow_sign can be called before canonical wayfinding, allowing premature player_location=library and potentially early reunion/puzzle.
- s3b_complete_foldback can be called repeatedly and can log duplicate failed_rendezvous events.

Required:
Add server-owned scene/phase/state guards to all public state-mutating Sprint 3B RPCs.
UI hiding is not authorization.

At minimum protect:
ACT 2 first-meeting
GRAB/leave
meeting resolution
fold-back
FOLLOW SIGN
Library code
ACT 4 private route
ACT 5 resolution
post-inspection route.

Repeated transitions must be idempotent or rejected without duplicate history.

BLOCKING FINDING C — LIBRARY BOX FALLBACK INCOMPLETE

Current deadline refresh only raises puzzle_hint_stage to 4.

V4.0 requires:
90 sec unresolved
→ act03.014
→ continue progressive minimum fallback until advancement is possible.

Current code can remain stuck indefinitely after stage 4.

Also:
- timeout/system hint steps need explicit non-behavior Game Track event provenance;
- student UI must render canonical hint texts, not only numeric hint_stage.

CA has sent GA a clarification request for the exact post-act03.014 progression because current V4.0/catalog do not fully enumerate it.
Do not invent narrative wording/rules while waiting for GA.

BLOCKING FINDING D — LOCALIZATION / ITEM LABEL CONTRACT

Student UI currently contains GAL-facing hardcoded English and internal identifiers, including examples:
- Waiting for the other players…
- Continue toward Library
- Submit
- Attempt ... hint stage ... deadline ...
- Sprint 3B flow complete. ACT 6 is not active.
- raw scene_id displayed as heading.

These must use canonical runtime localization or be removed from GAL-facing UI.

Library hints must render:
- act03.011
- act03.012
- act03.013
- act03.014
as appropriate.

Queued ACT 2 reveal must render canonical localized message/location content, not raw:
GAL-A: library
GAL-C: help

Item name_text_key mappings are also semantically wrong.

Examples:
gitte_castle_map -> act03.007
but act03.007 = "Gitte spreads the Castle Map across the table."

gitte_number_note -> act03.010
but act03.010 = "41739"

Do not repurpose unrelated canonical strings as item labels.

CA has sent GA a clarification request for missing canonical item-label keys.

TEST ADEQUACY:

Current Sprint 3B live 15/15 is not enough for the approved acceptance contract.

Add coverage for at least:
- ACT 2 1:1:1 re-vote + library system fallback;
- unanimous ACT 4 unknown route;
- ACT 5 majority known;
- ACT 5 majority unknown;
- Inspect First intermediate flow + post-inspection route;
- out-of-phase RPC rejection;
- duplicate fold-back;
- concurrent correct puzzle submissions / group-item idempotency;
- complete timeout fallback;
- queued-message localization;
- actual puzzle hint display mapping;
- optional Gitte flashlight inclusion/exclusion;
- Sprint 3B independent-run isolation;
- anonymous direct-write RLS rejection.

MIGRATION RULE:
007–009 are deployed; do not rewrite.

Recommended additive correction:
database/010_sprint3b_flow_integrity_and_inspect_fix.sql

Do not begin Sprint 3C until Sprint 3B passes re-audit.

FULL REPORT:
docs/reports/sprint-3b/CA-Sprint-3B-Audit-20260919.md

RE-AUDIT REQUEST MUST INCLUDE:
- correction commit SHA;
- migration 010 path;
- phase-guard model;
- fold-back idempotency model;
- Inspect First model;
- GA-approved puzzle fallback clarification;
- canonical localization/item-label mapping;
- updated test evidence;
- Sprint 1/2/3A regressions;
- Sprint 3B expanded live result;
- Teacher Override still deferred;
- physical multi-device still NOT VERIFIED.

COMMIT/WRITE STATUS: CA_SPRINT3B_AUDIT_FAIL_RECORDED
