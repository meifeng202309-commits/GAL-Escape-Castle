FROM: CD
TO: CA
TIMESTAMP: 20260918T173902Z
SUBJECT: sprint3a-foundation-audit-request
STATUS: READY_FOR_AUDIT

IMPLEMENTATION COMMIT:
- 1e0dca4e7ba8e44f4819e016c735200b92ed25e3

VERIFICATION REPORT COMMIT:
- 38141146f5aa45a70e5beaac422ced097cb35f98

MIGRATION:
- database/005_sprint3a_scene_pocket_knowledge_foundation.sql

IMPLEMENTED FOUNDATION:
- run-scoped formal scene state with explicit display_mode;
- nullable current_route_target and wayfinding_target;
- physical-owner Pocket items;
- private memories/observations using canonical display_text_key;
- received photo copies with sender/recipient/item/view provenance;
- group items;
- knowledge acquisition provenance history;
- deterministic canonical CSV -> generated runtime localization module.

PRIVACY / TRUST MODEL:
- s3_record_observation and s3_record_knowledge are internal and revoked from browser roles;
- fixture initialization is teacher-authenticated and AUDIT-only;
- NORMAL fixture attempt is server-rejected;
- Teacher state exposes scene metadata and counts, not private clue content;
- all new tables use RLS with browser access through token-checked SECURITY DEFINER RPCs.

IDEMPOTENCY / PROVENANCE MODEL:
- observation uniqueness: run + player + observation_key;
- knowledge acquisition identity: run + holder + knowledge_key + source + scene + source_player + source_item;
- identical provenance is idempotent;
- the same fact learned through distinct provenance remains distinct acquisition history.

SHARE PHOTO:
- server verifies physical owner and server-known shareable item view;
- recipient receives a provenance-bearing copy;
- physical ownership is unchanged;
- recipient cannot re-share the copy as an original;
- no knowledge is silently transferred.

LOCALIZATION:
- scripts/generate-localization.js parses and validates the canonical 310-row CSV;
- src/content/localization.generated.js is deterministic derived output;
- missing text_key fails visibly;
- nl_only_artifact returns Dutch only;
- no canonical wording was edited and no second human-maintained translation source was created.

DEPLOYMENT / VALIDATION:
- User applied migration 005 to Supabase project qdcbdcjobzytzhnhfwyn: `Success. No rows returned`.
- Sprint 1 static: PASS
- Sprint 2 static: PASS
- Sprint 3A static: PASS
- Sprint 1 live: 40/40 PASS
- Sprint 2 live: 23/23 PASS
- Sprint 3A live: 10/10 PASS

SPRINT 3A LIVE COVERAGE:
- NORMAL fixture contamination rejected;
- owner-only item visibility;
- private and idempotent observation;
- distinct knowledge provenance retained;
- group item visible to all three players;
- invalid photo view rejected;
- photo copy delivery without ownership/knowledge transfer;
- recipient re-share rejected;
- reconnect restores state;
- NORMAL Teacher privacy counts;
- independent run isolation;
- nine-table anonymous direct-read protection;
- anonymous direct write rejected.

KNOWN LIMITATIONS / SPRINT 3 STILL OPEN:
- production ACT 1-5 content binding is not implemented;
- route/wayfinding behavior is not implemented beyond nullable state fields;
- soft-failure/fold-back is pending;
- Teacher override/deblock and validity provenance are pending;
- production student/teacher Pocket and scene-navigation UI is pending;
- physical multi-device classroom verification is NOT VERIFIED;
- this delivery does not claim full Sprint 3 completion.

REQUESTED ACTION:
Please audit Sprint 3A against the approved conditions, including fallback resolution semantics downstream, privacy, provenance, run isolation, localization derivation, RLS, and test adequacy.

COMMIT/WRITE STATUS: SPRINT3A_READY_FOR_AUDIT
