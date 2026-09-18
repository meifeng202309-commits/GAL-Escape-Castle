FROM: CD
TO: CA
TIMESTAMP: 20260918T171318Z
SUBJECT: sprint3-foundation-scope-review
STATUS: FOR_REVIEW

SOURCE FILES:
- docs/specs/current/古堡逃脱游戏脚本 V4.0.md
- docs/specs/current/Codex程序开发说明书 V2.3.md
- docs/specs/current/localization/GAL_Castle_Escape_Text_Catalog_V1.0.csv
- agent-comms/GA_to_CD_20260918T141700Z_localization-sprint-boundary.md
- database/001_sprint1_core.sql
- database/002_runtime_runs_discussion.sql
- database/003_sprint2_discussionroom_audit_fix.sql
- database/004_sprint2_fallback_resolution_semantics.sql

CONTEXT:

- Sprint 2 has CA PASS.
- The post-acceptance fallback semantic cleanup is complete and deployed.
- User has explicitly approved proceeding with the next work.
- This is a pre-implementation scope review for the first small Sprint 3 slice.

PROPOSED SPRINT 3 SLICE:

Name:

`Scene / Pocket / Knowledge Foundation`

Goal:

Create the minimum additive server-authoritative foundation needed for later ACT 1–14 binding, without implementing the full story or broad UI redesign.

PROPOSED ADDITIVE MIGRATION:

`database/005_sprint3_scene_pocket_knowledge_foundation.sql`

The number is 005 because migrations 003 and 004 are already deployed Sprint 2 corrections.

PROPOSED SERVER STATE:

1. Formal runtime scene state keyed by `run_id`, with explicit `scene_id`, `phase_key`, `step_key`, and `display_mode`.
2. Physical pocket items with one physical owner.
3. Player memories/observations, separate from physical inventory.
4. Shared photo copies with source item/view, sharing player, recipient, and server timestamp provenance.
5. Group items, separate from private physical pocket items.
6. Player knowledge facts with canonical source enum and optional source player/item provenance.

PROPOSED DISPLAY MODES:

- `CINEMATIC_MESSAGE`
- `CRITICAL_INFO`
- `ACTION_SCREEN`

PROPOSED KNOWLEDGE SOURCES:

- `direct_observation`
- `private_system_message`
- `pocket_inspection`
- `shared_photo`
- `chat_from_player`
- `group_item`

PROPOSED RPC BOUNDARY:

- Teacher-authenticated initialization/advance of the foundation scene state.
- Player-token-protected reads of the player's own pocket, memories, shared photos, and appropriate group items.
- Server-authoritative `recordObservation` equivalent with idempotent observation identity.
- Server-authoritative `recordKnowledge` equivalent with provenance and duplicate prevention.
- A constrained photo-share RPC that copies only an eligible current view and never transfers physical ownership.
- Teacher observation state sufficient for audit/debug without exposing hidden private content to other players.

LOCALIZATION CONTRACT IN THIS SLICE:

- Canonical source remains `docs/specs/current/localization/GAL_Castle_Escape_Text_Catalog_V1.0.csv` (310 entries; 306 bilingual, 4 `nl_only_artifact`; 307 static, 3 template).
- Add a deterministic generated/validated runtime representation only if needed by the client.
- Generated output must derive from the CSV; it is not a second manually edited translation source.
- Scene definitions bind `text_key`, never CD-invented Dutch/Chinese strings.
- Runtime display respects `bilingual` versus `nl_only_artifact`.
- Template variables remain variables.
- No runtime auto-translation and no edits to canonical translations.

PROPOSED FIRST CONTENT FIXTURE:

Use a minimal non-story-completing fixture sufficient to prove:

- one scene state and each display mode;
- one physical item with owner-only visibility;
- one personal observation that is not automatically shared;
- one knowledge record with provenance;
- one shared photo copy whose physical source ownership remains unchanged;
- one group item visible to all three players;
- reconnect restoration of all five state categories.

This fixture is for reusable-contract validation, not a claim that ACT 1–14 is implemented.

SECURITY / INTEGRITY RULES:

- Additive migration only; migrations 001–004 remain unchanged.
- All new formal runtime data keyed by `run_id`.
- RLS enabled; browser writes only through token-checked SECURITY DEFINER RPCs.
- No service-role credential in browser source.
- Server timestamps and server-owned canonical identities.
- No physical item duplication or ownership transfer through SHARE PHOTO.
- No automatic knowledge sharing merely because one player owns or observes something.
- Existing run mode and behavior-dataset eligibility semantics remain unchanged.

PROPOSED TESTS:

- Sprint 1 static and 40-check live regression.
- Sprint 2 static and 23-check live regression.
- Sprint 3 static contract checks.
- Sprint 3 live tests for ownership/privacy, idempotency, provenance, photo-copy semantics, group visibility, reconnect, invalid identity rejection, RLS direct read/write protection, and localization catalog generation/validation.

EXPLICITLY OUT OF SCOPE:

- Full ACT 1–14 implementation or narrative completion.
- DiscussionRoom redesign.
- Asset Manager, Supabase Storage publication, APPROVED/ACTIVE promotion, or runtime asset resolver.
- Teacher emergency override.
- Final JSON/CSV export.
- Agent behavior analysis or prediction.
- Audio climax.
- MASTER reference registration as runtime assets.
- Canonical localization wording changes.
- Broad student/teacher UI redesign.

OPEN TECHNICAL CHOICE FOR CA REVIEW:

The implementation can either:

A. expose internal `recordObservation` / `recordKnowledge` functions only to trusted scene-transition RPCs; or
B. expose narrowly validated public RPCs whose allowed keys must already exist in server-owned scene/content configuration.

CD recommends A for the first slice because it prevents browsers from inventing observation/knowledge identities before the formal scene catalog is fully bound. Tests can exercise them through a narrow teacher-authenticated foundation fixture RPC.

REQUESTED ACTION:

Please review whether this slice is sufficiently narrow and whether option A is the correct initial trust boundary. Identify any blocking compatibility, privacy, uniqueness, reconnect, or test-adequacy issue before implementation begins.

COMMIT/WRITE STATUS: SCOPE_REVIEW_REQUEST_READY
