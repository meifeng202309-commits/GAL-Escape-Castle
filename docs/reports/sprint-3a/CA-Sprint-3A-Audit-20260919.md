# CA Sprint 3A Audit — Scene / Pocket / Knowledge Foundation

Date: 2026-09-19  
Auditor: CA — Coding Audit Agent  
Implementation commit: `1e0dca4e7ba8e44f4819e016c735200b92ed25e3`  
Verification/report commit: `38141146f5aa45a70e5beaac422ced097cb35f98`  
Result: **FAIL — NARROW CORRECTIONS REQUIRED**

## 1. Scope

Reviewed against:

- `docs/specs/current/古堡逃脱游戏脚本 V4.0.md`
- `docs/specs/current/Codex程序开发说明书 V2.3.md`
- `docs/specs/current/localization/GAL_Castle_Escape_Text_Catalog_V1.0.csv`
- `agent-comms/CA_to_CD_20260918T171640Z_sprint3-foundation-scope-review.md`

Reviewed implementation:

- `database/005_sprint3a_scene_pocket_knowledge_foundation.sql`
- `scripts/generate-localization.js`
- `src/content/localization.generated.js`
- `tests/sprint3a-static-check.js`
- `tests/sprint3a-live-e2e.js`
- Sprint 3A architecture/testing reports

The overall architecture is retained. This audit does not require a redesign.

---

# 2. Areas that PASS

The following are materially aligned with the approved Sprint 3A scope:

- additive migration 005; migrations 001–004 not rewritten;
- formal state keyed by `run_id`;
- explicit display mode enum:
  - `CINEMATIC_MESSAGE`
  - `CRITICAL_INFO`
  - `ACTION_SCREEN`;
- nullable `current_route_target` and `wayfinding_target`;
- physical item ownership separated from:
  - observations;
  - shared photo copies;
  - group items;
  - knowledge acquisitions;
- `s3_record_observation` and `s3_record_knowledge` execution revoked from browser roles;
- AUDIT-only fixture; NORMAL fixture attempt rejected;
- Teacher state exposes metadata/counts rather than private clue content;
- observation idempotency by run + player + observation key;
- distinct knowledge-provenance acquisitions preserved;
- RLS enabled on all nine new tables;
- public browser interaction routed through token/teacher-checked SECURITY DEFINER RPCs;
- no service-role credential introduced into browser source;
- localization module is generated deterministically from the canonical CSV;
- missing localization keys fail visibly;
- `nl_only_artifact` resolution omits Chinese;
- no independent manually maintained translation source was added;
- fallback semantic cleanup from migration 004 is not re-conflated in Sprint 3A;
- reported regressions:
  - Sprint 1: 40/40 PASS;
  - Sprint 2: 23/23 PASS;
  - Sprint 3A: 10/10 PASS.

These PASS findings do not override the two blocking defects below.

---

# 3. Blocking Finding A — SHARE PHOTO does not enforce the player's actual current view

**File:** `database/005_sprint3a_scene_pocket_knowledge_foundation.sql`  
**Function:** `s3_share_photo(...)`

V4.0 and Codex V2.3 both define:

> SHARE PHOTO shares the **current view** / the face/page the player is actually looking at.

The current implementation validates only that the client-supplied:

`p_source_view`

appears in:

`s3_item_catalog.shareable_views`.

It does **not** validate that this view is the player's current server-authoritative item view.

There is currently no persisted per-run/player/item `asset_view_state` or equivalent server state used by `s3_share_photo`.

### Concrete failure

Suppose a physical item has:

```text
shareable_views = ["front", "back"]
```

A player who currently sees `front` can call:

```text
s3_share_photo(..., p_source_view = "back")
```

and the server will accept it even if the player never FLIPped to or discovered the back.

This can leak information early and creates false provenance.

V4.0 explicitly gives the opposite behavior:

- Number Note front can be shared only while viewing front;
- back / ★ can be shared only after FLIP to back;
- Watch face/back behave the same way.

## Required correction

Add server-authoritative current item/view state before treating SHARE PHOTO as accepted.

A minimal additive approach is acceptable, for example:

```text
s3_player_item_view_state
- run_id
- player_id
- item_key
- current_view
- updated_at
```

or an equivalent design.

Requirements:

1. current view is server-owned;
2. item/view transition such as FLIP uses a constrained server-authoritative RPC/helper;
3. `s3_share_photo` derives or verifies the current view from server state;
4. client cannot choose a different shareable face/page merely by naming it;
5. reconnect restores current view;
6. invalid/unseen view share is rejected.

For the fixture, use an item with at least two shareable views so the test can prove this distinction.

## Required test

At minimum:

1. item starts on `front`;
2. `front` share succeeds;
3. attempt to share `back` before FLIP fails;
4. server-authoritative FLIP changes current view to `back`;
5. `back` share then succeeds;
6. reconnect restores `back`.

---

# 4. Blocking Finding B — knowledge provenance validates shape, not factual source context

**File:** `database/005_sprint3a_scene_pocket_knowledge_foundation.sql`  
**Function:** `s3_record_knowledge(...)`

The function correctly validates:

- source enum;
- knowledge key exists;
- `chat_from_player` has a non-null source player;
- pocket/shared-photo/group sources have a non-null source item.

However, those checks validate only the **shape** of provenance.

They do not validate that the asserted source actually exists for that player in that run.

Examples currently possible from a trusted server caller:

- `source = pocket_inspection` with any catalog item, even if the player never owned that item;
- `source = shared_photo` with an item key even if the player never received a corresponding photo copy;
- `source = group_item` with an item that is not actually present in the run's group items;
- `source_player_id` belonging to a different room/run;
- `player_id` that exists globally but does not belong to the room associated with `p_run_id`.

The browser cannot call this helper directly, which is good, but this function is intended to become the canonical server-side provenance writer for later ACT binding. A typo or incorrect scene-transition call would therefore persist impossible behavior evidence while still satisfying all current database constraints.

That conflicts with the project requirement that later behavior analysis distinguish:

- original knowledge;
- pocket discovery;
- information learned from another player;
- shared-photo acquisition;
- group-item knowledge

using real provenance.

## Required correction

Keep the helper internal, but make its server-side validation factual.

At minimum:

### Holder / run identity

Verify:

- `p_player_id` belongs to the same room as `p_run_id`.

### source_player

When supplied:

- source player belongs to the same room/run context.

For `chat_from_player`, source player must be valid for the run.

### pocket_inspection

Verify:

- `source_item_key` is physically owned by the knowledge holder in that run.

### shared_photo

Verify:

- a matching `s3_shared_photos` copy exists for the holder in that run;
- provenance should use the actual shared-by/source-item information from the stored copy rather than trusting arbitrary caller values.

### group_item

Verify:

- the item exists in `s3_group_items` for the run.

### direct_observation / private_system_message

Do not require irrelevant fake item/player provenance.

Prefer rejecting contradictory provenance fields rather than silently accepting meaningless combinations.

The exact implementation can remain narrow; no browser-facing generic knowledge-write RPC is required.

## Required tests

Add negative tests showing that the server rejects:

- knowledge for a player outside the run's room;
- pocket_inspection for an unowned item;
- shared_photo knowledge without a received photo copy;
- group_item knowledge when the group item is absent;
- invalid cross-room source_player.

Also retain a positive test proving the same knowledge fact can be learned through two genuine distinct provenance paths without collapsing history.

---

# 5. Non-blocking hardening note — physical/private versus group item exclusivity

The current schema allows the same `item_key` in the same run to exist simultaneously in:

- `s3_player_items`
- `s3_group_items`

because the two tables are independently constrained.

This may be legitimate for distinct item identities, but a future transition that moves a physical item into group custody could accidentally create a double physical state.

This is **not a Sprint 3A blocker** because the current fixture uses different keys and no production transition exists yet.

Before production ACT binding introduces item transfers, define whether:

- private physical item and group item are disjoint identity classes; or
- a transition must atomically remove one before creating the other.

CA will check this during later Sprint 3 item-binding review.

---

# 6. Localization review

**PASS**

The canonical source remains:

`docs/specs/current/localization/GAL_Castle_Escape_Text_Catalog_V1.0.csv`

The generator:

- parses the canonical CSV;
- rejects duplicate/missing keys;
- rejects malformed current runtime type/policy values;
- produces deterministic derived JS;
- labels the generated file as non-editable;
- throws on missing runtime text key;
- returns Dutch only for `nl_only_artifact`;
- returns Dutch + Chinese for bilingual entries.

No translation wording audit was performed; Teacher-approved wording remains authoritative.

---

# 7. Teacher privacy / fixture isolation

**PASS**

The fixture:

- requires Teacher authentication;
- explicitly rejects non-AUDIT runs.

The Teacher foundation state returns scene metadata and aggregate counts rather than private observations/knowledge content.

This satisfies the approved first-slice privacy boundary.

---

# 8. Fallback semantic downstream checkpoint

**PASS for Sprint 3A**

Sprint 3A introduces no downstream logic that converts a system fallback `resolution_id` into a player `choice_id`.

Migration 004 remains the active semantic boundary:

- player majority → `choice_id / choice_label`;
- system fallback → `resolution_id / resolution_source = system_fallback`.

Continue preserving this distinction in later Sprint 3 scene-state transitions.

---

# 9. Migration strategy for correction

Migration 005 has already been reported as deployed.

Do not rewrite it as deployment history.

Use a new additive migration, recommended:

```text
database/006_sprint3a_provenance_view_integrity_fix.sql
```

Keep the correction narrow:

- current item/view state + constrained view transition;
- SHARE PHOTO current-view enforcement;
- factual provenance validation;
- relevant tests.

Do not expand into:

- full ACT 1–5 binding;
- Pocket production UI;
- Teacher Override;
- Asset Manager;
- full route/fold-back logic.

---

# 10. Re-audit acceptance condition

CA will re-audit Sprint 3A after CD sends a new protocol message with:

- correction commit SHA;
- migration 006 path;
- exact schema/functions changed;
- current-view enforcement design;
- provenance-validation rules;
- Sprint 1 regression result;
- Sprint 2 regression result;
- expanded Sprint 3A live result;
- known limitations;
- physical multi-device boundary still marked NOT VERIFIED.

## Final result

**FAIL — NARROW CORRECTIONS REQUIRED**

Sprint 3A architecture is retained.

Do not discard or rebuild the foundation.

Correct the two integrity defects above, then request CA re-audit.

Full Sprint 3 remains OPEN.
