# CA Sprint 3A Re-audit — Scene / Pocket / Knowledge Foundation

Date: 2026-09-19  
Auditor: CA — Coding Audit Agent  
Correction commit: `d0d7a4d6440d3da562f9a45a9606521011486ae0`  
Updated report commit: `3d6168723d876734cc9574fd290c033f9f8285cb`  
Result: **PASS — SPRINT 3A ACCEPTED**

## 1. Re-audit scope

This re-audit is limited to the two blocking findings from:

`docs/reports/sprint-3a/CA-Sprint-3A-Audit-20260919.md`

Required corrections were:

1. enforce server-authoritative current item view for SHARE PHOTO;
2. validate knowledge provenance against real run facts rather than field shape alone.

The overall Sprint 3A architecture was already accepted and is not re-litigated here.

---

# 2. Finding A — server-authoritative item view

**PASS**

Migration:

`database/006_sprint3a_provenance_view_integrity_fix.sql`

adds:

`s3_player_item_view_state`

keyed by:

- run_id;
- player_id;
- item_key.

The fixture initializes the physical item at:

`current_view = front`.

A new constrained RPC:

`s3_set_item_view(...)`

updates the current server-owned view.

Current implementation permits the defined front/back transition for the fixture and requires physical ownership before a view change.

`s3_share_photo(...)` now:

- reads server-side current_view;
- rejects a submitted source_view that does not equal current_view;
- rechecks that current_view is shareable;
- stores the actual current view in the photo-copy provenance.

The live test source explicitly verifies:

- front share succeeds;
- back share before FLIP is rejected;
- server-side FLIP to back succeeds;
- back share then succeeds;
- reconnect state returns current_view = back;
- physical ownership remains unchanged.

This resolves the original premature-back-view information leak.

---

# 3. Finding B — factual knowledge provenance

**PASS**

`s3_record_knowledge(...)` now validates the asserted source against current run facts.

Verified rules include:

## Holder/run identity

The knowledge holder must belong to the room associated with p_run_id.

## source_player

When supplied, source_player must belong to the same run room.

## direct_observation / private_system_message

Rejects irrelevant source_player/source_item provenance.

## chat_from_player

Requires a valid source player and rejects source_item.

## pocket_inspection

Requires the source item to be physically owned by the holder in that run.

## shared_photo

Requires an actual received photo copy for the holder in the run.

The stored sender from that photo copy becomes the authoritative source player.

Contradictory caller-supplied source_player is rejected.

## group_item

Requires the item to exist in s3_group_items for the run.

The expanded live suite includes negative cases for:

- holder outside run room;
- unowned pocket item;
- missing shared-photo copy;
- absent group item;
- cross-room source player.

The prior positive provenance test remains in place and preserves distinct acquisition paths for the same knowledge fact.

This resolves the original shape-only provenance defect.

---

# 4. Additive migration discipline

**PASS**

Migration 005 remains historical/deployed foundation.

The integrity corrections are additive in:

`database/006_sprint3a_provenance_view_integrity_fix.sql`.

Migrations 001–005 were not rewritten as deployment history.

---

# 5. RLS / trust boundary

**PASS**

The new item-view table has RLS enabled.

The browser-callable view-change and photo-share RPCs remain token-checked server-authoritative functions.

The core knowledge writer remains an internal trusted helper.

The audit provenance probe is teacher-authenticated and AUDIT-only.

No service-role credential was introduced.

---

# 6. Reported validation evidence

CD reports after deployment of migration 006:

- Sprint 1 live: **40/40 PASS**
- Sprint 2 live: **23/23 PASS**
- Sprint 3A live: **15/15 PASS**
- Sprint 1 static: PASS
- Sprint 2 static: PASS
- Sprint 3A static: PASS
- localization generation: 310 deterministic entries PASS
- JS syntax: PASS
- git diff --check: PASS

The correction commit and updated report commit are valid and traceable.

CA did not independently execute the external Supabase live suite in this review session; the live results above remain repository-recorded deployment evidence supported by the inspected test source.

---

# 7. Localization / privacy / fallback checkpoints

**PASS**

No regression was found in:

- canonical CSV-derived localization;
- NORMAL Teacher privacy boundary;
- AUDIT-only fixture restriction;
- system fallback:
  - resolution_id;
  - resolution_source = system_fallback;
- player majority:
  - choice_id / choice_label.

Sprint 3A does not re-conflate those semantics.

---

# 8. Non-blocking notes for later Sprint 3 binding

These do not block Sprint 3A acceptance.

## 8.1 Valid view versus shareable view

The current fixture's allowed view transition checks the target against `shareable_views`.

For the fixture, both front and back are intentionally shareable, so the current implementation is correct.

Before production ACT item binding, do not assume every valid inspectable view is necessarily shareable.

If production items have valid but non-shareable views, separate:

- valid/inspectable view identity;
- shareable flag.

CA will check this when real ACT item/view definitions are bound.

## 8.2 chat_from_player self-source

The current factual validation confirms the source player belongs to the run room.

Before production behavior-analysis binding, consider explicitly rejecting:

`source_player_id = knowledge_holder`

for `chat_from_player`, because the canonical meaning is information learned from another player's chat.

This is not currently reachable through a generic browser knowledge-write RPC and does not invalidate the Sprint 3A fixture.

## 8.3 Private physical item versus group item exclusivity

The prior non-blocking note remains:

the same item_key could theoretically exist in both private physical and group-item tables.

No production transfer exists yet.

Define atomic ownership/group transition semantics before real ACT item movement is implemented.

---

# 9. Boundaries still open

Sprint 3A PASS does not mean full Sprint 3 is complete.

Still pending:

- production ACT 1–5 scene/content binding;
- production Pocket/scene UI;
- route/wayfinding behavior;
- soft-failure/fold-back;
- Teacher override/deblock;
- behavior validity/context provenance;
- later Sprint 3 integration tests.

Physical multi-device classroom verification remains:

**NOT VERIFIED**

including:

- three student devices + teacher device;
- classroom latency/packet loss;
- long-duration classroom behavior.

---

# 10. Final result

**PASS — SPRINT 3A ACCEPTED**

The two blocking integrity defects from the original Sprint 3A audit are resolved.

Sprint 3A may now be treated as accepted foundation work.

Full Sprint 3 remains OPEN and must proceed through later slices before any Sprint 3 completion claim.
