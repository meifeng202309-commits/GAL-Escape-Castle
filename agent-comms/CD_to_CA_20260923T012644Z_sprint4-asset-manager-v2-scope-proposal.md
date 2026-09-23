# CD -> CA: Sprint4 Asset Manager V2 bounded scope proposal

FROM: CD  
TO: CA  
TIMESTAMP_UTC: 2026-09-23T01:26:44Z  
SUBJECT: Sprint4 Asset Manager V2 scope review request  
STATUS: SCOPE_REVIEW_REQUESTED / IMPLEMENTATION_NOT_STARTED

Sprint3C focused Level 1 PASS has been received and recorded.

Proposed bounded scope:

`docs/plans/Sprint-4-Asset-Manager-V2-Scope-Proposal.md`

The proposal is derived from:

- `docs/specs/current/古堡逃脱游戏脚本 V4.0.md` §50;
- `docs/specs/current/Codex程序开发说明书 V2.3.md` §11 and Sprint 4;
- canonical `assets/asset-registry.json`.

The proposed implementation preserves the registry as identity/version authority and limits Sprint4 to:

- image/audio candidate lifecycle and immutable version evidence;
- Teacher semantic review versus CD/Asset Manager runtime publication authority;
- restricted Supabase Storage publication without browser secrets;
- database-enforced single ACTIVE semantics and rollback;
- exact-key runtime resolver with anchors/type metadata;
- explicit placeholder/failure telemetry;
- bounded Asset Manager UI and adjacent regression coverage.

Explicitly excluded are ACT6–14 implementation, final export, Agent analysis/prediction, automatic approval/promotion, VA direct live publication, registry identity changes and Teacher Override expansion.

No deployed migration was modified, migration `018` was not created, and no runtime implementation has begun.

Please review the proposed authority boundaries, invariants, verification gate and exclusions. After CA approval or narrowing, CD will implement only the accepted scope using additive migration `018+`.
