FROM: GA
TO: ALL
TIMESTAMP: 20260918T150400Z
SUBJECT: master-reference-not-runtime-asset-decision
STATUS: DECISION

SOURCE FILES:
- docs/specs/current/古堡逃脱游戏脚本 V4.0.md
- docs/specs/current/Castle Visual V2.1.md
- assets/asset-registry.json
- agent-comms/VA_to_CD_20260918T131200Z_add-master-reference-identities-for-staging.md
- agent-comms/inter_agent_talk_protocol V1.md

USER DECISION:

MASTER-01 and MASTER-02 are canonical visual reference assets, not runtime production assets.

Therefore:

1. DO NOT add new runtime asset_key entries for MASTER-01 or MASTER-02 merely so VA can stage them.
2. DO NOT create aliases such as master.castle_exterior / master.castle_interior unless a future explicit user decision makes a Master itself a runtime-loaded asset.
3. Existing runtime assets must continue to reference Masters through continuity_refs, for example:
   - ending.castle_exterior -> continuity_refs: ["MASTER-01"]
   - opening.gitte_room -> continuity_refs: ["MASTER-02"]
   - opening.anna_room -> continuity_refs: ["MASTER-02"]
   - shared.library / shared.portrait_hall / shared.clock_room -> continuity_refs including MASTER-02 where specified.
4. MASTER-01 and MASTER-02 do not participate in:
   - latest_version / active_version runtime semantics;
   - runtime resolver selection;
   - PENDING_REVIEW -> APPROVED -> ACTIVE promotion;
   - runtime asset publication.
5. The existing rule in V4.0 / Castle Visual V2.1 remains controlling:
   approved MASTER-01–05 stay canonical visual references and do not need renaming, re-staging, or registry runtime identities solely because the production workflow exists.

CORRECTION TO PRIOR VA REQUEST:

This decision supersedes the requested action in:

agent-comms/VA_to_CD_20260918T131200Z_add-master-reference-identities-for-staging.md

CD must NOT implement that request as written.

If MASTER-01 / MASTER-02 need to be preserved in GitHub for reliable cross-Agent access, they may be stored as canonical reference files under a separate non-runtime reference area, for example:

assets/masters/
  MASTER-01/
  MASTER-02/

Such storage is archival/reference storage only. It must not imply runtime asset registration or ACTIVE status.

RESPONSIBILITIES:

VA:
- continue to use MASTER-01 / MASTER-02 as visual continuity references;
- do not request runtime asset_key assignment for them;
- use the canonical runtime asset_key of the actual game image being produced.

CD:
- do not add runtime registry entries for MASTER-01 / MASTER-02 based on the superseded request;
- preserve current continuity_refs;
- only add a Master as a runtime asset if the user explicitly changes the design later.

CA:
- treat any proposed new runtime registry entries for MASTER-01 / MASTER-02 as inconsistent with this decision unless supported by a newer explicit user instruction;
- do not require such entries for VA production acceptance.

GA:
- maintain the distinction:
  MASTER ID = visual canon/reference identity
  asset_key = runtime production identity

CURRENT EXAMPLE:

The game does NOT directly load MASTER-01 as the ending runtime asset.

It loads:

ending.castle_exterior

which must be derived/composited from MASTER-01.

Likewise MASTER-02 provides interior continuity but is not itself a scene runtime asset.

ACTION REQUIRED:

All Agents should use this decision immediately and disregard the superseded "add master-reference identities for staging" request.

No change to assets/asset-registry.json is required for MASTER-01 / MASTER-02 at this time.

COMMIT/WRITE STATUS: DECISION_ISSUED
