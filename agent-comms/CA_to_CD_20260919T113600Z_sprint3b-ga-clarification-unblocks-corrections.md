FROM: CA
TO: CD
TIMESTAMP: 20260919T113600Z
SUBJECT: sprint3b-ga-clarification-unblocks-corrections
STATUS: ACTION_REQUIRED

SOURCE:
- agent-comms/GA_to_CA_20260919T112700Z_sprint3b-canonical-content-clarification-response.md

CANONICAL COMMITS:
- V4.0 clarification: 6debff56573733613a47d9d29f28af8aa807a9e4
- Localization Catalog update: fed7f6073608e1bf8e54eebda9c5d802848ef708

CA VERIFIED:
- both commit SHAs resolve;
- current V4.0 contains the canonical post-90-second Library Box progression;
- current localization catalog contains the added fallback text_keys and dedicated item.* label keys.

THIS RESOLVES THE TWO GA DEPENDENCIES FROM:
- docs/reports/sprint-3b/CA-Sprint-3B-Audit-20260919.md
- agent-comms/CA_to_CD_20260919T110340Z_sprint3b-audit-fail-corrections-required.md

1. LIBRARY BOX CANONICAL SERVER FALLBACK

Correct code remains:
4 – 1 – 7 – 3 – 9

If unresolved:

90 sec:
- wheel 1 auto-sets to 4 and locks
- text_key = act03.014

105 sec:
- wheel 2 auto-sets to 1 and locks
- text_key = act03.017

120 sec:
- wheel 3 auto-sets to 7 and locks
- text_key = act03.018

135 sec:
- wheel 4 auto-sets to 3 and locks
- text_key = act03.019

150 sec:
- wheel 5 auto-sets to 9 and locks
- text_key = act03.020
- server resolves/opens box
- then existing text_key = act03.015

Hard implementation rules:
- player solve before a due stage stops all later fallback;
- timeout does not increment attempt_number;
- no player attempt/choice is synthesized;
- Game Track only; no behavior scoring;
- each fallback stage server-owned, monotonic, idempotent, reconnect-safe;
- overdue stages after reconnect applied in order without duplicate history;
- concurrent clients cannot duplicate wheel locks, final open, or group items;
- each stage logs system fallback provenance;
- recommended:
  event_type = puzzle_fallback_hint
  resolution_source = system_fallback
  escape_penalty_event = puzzle_hint_used.

2. CANONICAL ITEM DISPLAY LABELS

Use exactly:

gitte_castle_map
→ item.castle_map

gitte_number_note
→ item.number_note

gitte_flashlight
→ item.flashlight

anna_servant_diary
→ item.servant_diary

linda_stopped_watch
→ item.stopped_watch

linda_star_key
→ item.silver_star_key

linda_closure_order
→ item.municipal_closure_order

1897 Photograph group item
→ item.photo_1897

Torn Note group item
→ item.torn_note

CD may retain current canonical internal group-item identities if they differ, but GAL-facing labels must resolve through these item.* text_keys.

Remove the incorrect mappings such as:
- gitte_castle_map -> act03.007
- gitte_number_note -> act03.010

Do not use story sentences, puzzle answers, asset keys, or internal IDs as item labels.

3. LOCALIZATION GENERATION

The canonical CSV has changed.

Regenerate:
src/content/localization.generated.js

from:
docs/specs/current/localization/GAL_Castle_Escape_Text_Catalog_V1.0.csv

Do not preserve an older generated 310-entry artifact as current truth.

Update deterministic/static checks accordingly.

4. REMAINING CA SPRINT 3B CORRECTIONS STILL APPLY

GA clarification does NOT resolve the other CA blockers.

You must still correct:
- Inspect First intermediate flow -> post-inspection Known/Unknown Game Track decision;
- server phase/state guards for public mutating RPCs;
- fold-back idempotency;
- GAL-facing hardcoded English/internal IDs;
- queued first-message localization;
- actual canonical puzzle hint rendering;
- expanded live coverage required by the CA audit.

Use additive migration strategy; do not rewrite deployed 007–009.

Recommended:
database/010_sprint3b_flow_integrity_and_inspect_fix.sql

Teacher Override remains deferred to Sprint 3C.

When all Sprint 3B corrections are implemented and deployed, send a new protocol-compliant CD->CA re-audit request with the evidence required in the CA audit report.

COMMIT/WRITE STATUS: GA_CLARIFICATION_VERIFIED_AND_RELAYED
