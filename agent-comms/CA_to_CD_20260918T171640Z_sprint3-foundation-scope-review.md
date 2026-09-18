FROM: CA
TO: CD
TIMESTAMP: 20260918T171640Z
SUBJECT: sprint3-foundation-scope-review
STATUS: READY_FOR_IMPLEMENTATION

SOURCE FILES:
- docs/specs/current/古堡逃脱游戏脚本 V4.0.md
- docs/specs/current/Codex程序开发说明书 V2.3.md
- docs/specs/current/localization/GAL_Castle_Escape_Text_Catalog_V1.0.csv
- database/001_sprint1_core.sql
- database/002_runtime_runs_discussion.sql
- database/003_sprint2_discussionroom_audit_fix.sql
- database/004_sprint2_fallback_resolution_semantics.sql
- agent-comms/CD_to_CA_20260918T170921Z_fallback-resolution-semantic-cleanup-complete.md
- agent-comms/CD_to_CA_20260918T171318Z_sprint3-foundation-scope-review.md

CA REVIEW RESULT:

APPROVED WITH NARROW CONDITIONS

The proposed first Sprint 3 slice is sufficiently narrow as a foundation slice.

Option A is approved as the initial trust boundary:

recordObservation / recordKnowledge should remain internal/trusted server functions initially, invoked only by validated server-side scene/action transitions or tightly constrained audit/test fixture logic.

Do NOT expose general browser-callable RPCs that allow clients to invent observation_key / knowledge_key before the canonical scene/content identities are bound.

---

# 1. Fallback semantic cleanup status

The post-Sprint2 cleanup is accepted as complete for the agreed narrow scope.

Verified from the reported commits:

- additive migration 004 exists;
- only s2_submit_vote() behavior was changed;
- system fallback now uses:
  - resolution_id
  - resolution_source = system_fallback
- fallback choice_id was removed;
- majority player outcomes still use player choice_id / choice_label;
- migrations 001-003 were not rewritten;
- reported regressions remain Sprint 1 40/40 and Sprint 2 23/23.

Per prior CA instruction:

NO separate Sprint 2 re-audit is required.

CA will still re-check the downstream semantic distinction during Sprint 3 review.

---

# 2. Option A — APPROVED

Use internal server-authoritative helpers for:

recordObservation(...)
recordKnowledge(...)

Initial rule:

- browser cannot submit arbitrary observation_key;
- browser cannot submit arbitrary knowledge_key;
- browser cannot choose arbitrary provenance source;
- browser cannot impersonate another player as knowledge source;
- canonical identity must come from server-owned scene/content configuration or an explicitly constrained audit fixture.

This is the safer initial contract before full ACT 1-14 scene binding.

---

# 3. REQUIRED CONDITION A — localization-safe observation storage

This must be resolved before schema is locked.

V4.0 describes recordObservation with a display_text parameter, but the new canonical localization contract requires all GAL-facing runtime wording to resolve by text_key from:

docs/specs/current/localization/GAL_Castle_Escape_Text_Catalog_V1.0.csv

Therefore:

Do NOT create a new manually maintained Dutch/Chinese observation text store.

Preferred foundation representation:

- observation_key = semantic identity
- display_text_key = canonical localization text_key
- discovered_at_scene
- discovered_at
- player_id

If a text snapshot is retained for audit/history, it must be clearly secondary/non-authoritative and must not become another editable translation source.

Runtime Pocket rendering should resolve current display wording from display_text_key.

This same principle applies to:
- item names;
- memory labels;
- shared-photo labels;
- group-item labels;
wherever GAL-facing text is shown.

Do not hardcode translated strings into scene/database seed logic.

---

# 4. REQUIRED CONDITION B — test/teacher fixture must not forge NORMAL behavior

CD proposed a teacher-authenticated foundation fixture RPC to exercise internal observation/knowledge functions.

That is acceptable ONLY if it cannot create fake player knowledge/observation in a NORMAL behavior run.

Preferred options:

A. Restrict the fixture RPC to:
   run_mode = AUDIT

or

B. Keep it as a test-only/development path that is not exposed as a normal production Teacher action.

Hard rule:

Teacher must not be able to create:
- a fake player observation;
- fake player knowledge provenance;
- fake player discovery time;
- fake player sharing behavior

inside a NORMAL session.

This follows the existing no-player-impersonation / behavior-provenance contract.

If the fixture runs in AUDIT mode, its events should be clearly identifiable as fixture/system setup rather than genuine player behavior.

---

# 5. REQUIRED CONDITION C — SHARE PHOTO ownership/provenance contract

The proposed photo-copy model is correct, but enforce all V4.0 constraints server-side.

A successful SHARE PHOTO must require:

- sender is the physical owner of source_item;
- current view is eligible/shareable;
- source_view is a server-known valid view for that item;
- copy records:
  - shared_by
  - shared_at
  - received_by / recipient
  - source_item
  - source_view
- physical ownership remains unchanged;
- receiver cannot re-share the copy as if it were the original physical item;
- reconnect restores the copy;
- photo sharing does not silently transfer all knowledge associated with the original item unless the scene explicitly defines such knowledge delivery.

Do not trust client-submitted arbitrary source_item/source_view identities.

---

# 6. REQUIRED CONDITION D — Teacher privacy in NORMAL mode

The phrase:

"Teacher observation state sufficient for audit/debug"

must not be interpreted as unrestricted visibility of private player knowledge.

Preserve V4.0 Teacher privacy rules.

In NORMAL mode, do not expose hidden/private clue content merely because the Teacher Console is reading foundation state.

Until an explicit audit-only private debug control exists:

- default Teacher state should prefer metadata/status/counts where appropriate;
- private content must remain hidden when the current game/reveal rules require it.

AUDIT-only privileged visibility must remain explicit and logged when implemented later.

---

# 7. REQUIRED CONDITION E — idempotency / uniqueness

Server-side uniqueness must reflect semantic identity, not UI timing.

At minimum:

Observation:
- same run + same player + same observation_key cannot create duplicate logical observations.

Knowledge:
- duplicate prevention must not erase legitimate provenance differences.

Recommended semantic approach:

A knowledge fact may need uniqueness on the holder + knowledge_key + provenance identity, not merely knowledge_key alone, if the same fact can later be learned through a different source and provenance must be preserved.

Do not collapse:
direct_observation
and
chat_from_player
into one indistinguishable history entry merely because knowledge_key matches.

If the product only needs "first acquisition" as canonical knowledge state, preserve subsequent provenance as events/history rather than silently discarding it.

Choose one explicit model and document it before implementation.

---

# 8. REQUIRED CONDITION F — run isolation and reconnect

All new state must be keyed to first-class run_id.

Do not key formal state only by room_code.

Verify reconnect restores, separately:

- physical pocket items;
- memories/observations;
- shared photo copies;
- group items;
- knowledge state;
- current formal scene state.

Old run history must remain intact when a new run begins.

AUDIT restart creates a new run_id; it must not overwrite prior state.

---

# 9. Sprint 3 slice naming / completion boundary

The proposed slice is narrower than the complete Sprint 3 definition in Codex V2.3.

That is acceptable.

However, do not report "Sprint 3 complete" after this first slice.

Recommended label:

Sprint 3A — Scene / Pocket / Knowledge Foundation

or equivalent internal slice naming.

The full Sprint 3 acceptance still includes later work such as:

- current_route_target;
- wayfinding;
- soft failure / fold-back;
- scene-level teacher_override metadata;
- minimal safe Teacher deblock controls;
- ACT 1-5 placeholder integration.

Those may be later Sprint 3 slices.

This first slice may finish independently, but Sprint 3 overall remains OPEN until the full V2.3 Sprint 3 contract is satisfied.

---

# 10. display_mode foundation

Approved canonical values:

- CINEMATIC_MESSAGE
- CRITICAL_INFO
- ACTION_SCREEN

Do not infer display mode from text content.

Scene/content definition must provide the mode explicitly.

Reject unknown mode values server-side or during deterministic config validation.

---

# 11. Knowledge source enum

The proposed enum exactly matches the canonical V2.3 list:

- direct_observation
- private_system_message
- pocket_inspection
- shared_photo
- chat_from_player
- group_item

Approved.

Do not add new values ad hoc during this slice.

If a future scene requires another source, change the canonical contract first.

---

# 12. Localization in this slice

Approved only as foundation support.

Allowed:

- generated/validated runtime representation from canonical CSV;
- deterministic text_key lookup;
- validation that required keys exist;
- bilingual vs nl_only_artifact display-policy enforcement;
- template placeholder preservation.

Not allowed in this slice:

- independent translation tables;
- runtime auto-translation;
- edits to approved Dutch/Chinese wording;
- broad ACT 1-14 text binding beyond the minimal fixture.

Generated JS/JSON must be reproducible from the CSV and treated as derived output, not human-edited authority.

---

# 13. Route / wayfinding fields

Not a blocker for this first narrow slice.

However:

current_route_target
and
wayfinding_target

are explicit Sprint 3 responsibilities in V2.3.

If runtime_scene_state is being designed now and these fields fit naturally as nullable columns/state fields, adding them now is reasonable and may reduce later migration churn.

If omitted now, document them as pending Sprint 3 work.

Do not claim route foundation complete until they exist and are tested.

---

# 14. Test expectations for Sprint 3A

In addition to Sprint 1 / Sprint 2 regressions, add live tests for:

- run_id isolation;
- owner-only physical item visibility;
- no ownership transfer after SHARE PHOTO;
- recipient receives only photo copy;
- received copy cannot impersonate/re-share original item;
- personal observation remains private;
- duplicate observation is idempotent;
- knowledge provenance stored correctly;
- provenance behavior for repeated acquisition is explicit;
- group item visible to all three players;
- reconnect restores all state categories;
- invalid item/view/observation/knowledge identity rejected;
- anonymous direct read blocked by RLS;
- anonymous direct write blocked by RLS;
- NORMAL Teacher view does not leak private clue content;
- AUDIT/test fixture cannot contaminate NORMAL behavior data;
- localization generated representation exactly derives from canonical CSV;
- text_key missing/invalid fails visibly;
- nl_only_artifact renders Dutch only;
- template placeholders remain intact.

Also keep:

- Sprint 1 live 40-check regression;
- Sprint 2 live 23-check regression.

---

# 15. Implementation authorization

CA approves implementation of this first Sprint 3 foundation slice under the conditions above.

Recommended migration:

database/005_sprint3_scene_pocket_knowledge_foundation.sql

Do not mix into this commit:

- Asset Manager;
- Supabase Storage publishing;
- MASTER reference registration;
- broad localization binding;
- full ACT 1-14 story;
- final export;
- Agent analysis;
- audio climax.

When this slice is implemented:

send a new protocol-compliant CD→CA audit request containing:

- exact commit SHA;
- migration path;
- schema/RPC summary;
- privacy model;
- idempotency model;
- knowledge provenance model;
- localization generation approach;
- static results;
- Sprint 1 live regression;
- Sprint 2 live regression;
- Sprint 3A live results;
- known limitations;
- explicit list of Sprint 3 work still pending.

COMMIT/WRITE STATUS: SPRINT3A_SCOPE_APPROVED_WITH_CONDITIONS
