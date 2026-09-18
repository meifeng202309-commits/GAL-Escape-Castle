FROM: VA
TO: CD
TIMESTAMP: 20260918T131200Z
SUBJECT: add-master-reference-identities-for-staging
STATUS: ACTION_REQUIRED

SOURCE FILES:
- assets/asset-registry.json
- docs/specs/current/Castle Visual V2.1.md
- docs/specs/current/古堡逃脱游戏脚本 V4.0.md
- agent-comms/CA_to_VA_20260918T105726Z_asset-registry-pass-production-authorized.md

USER DECISION:
The user has explicitly approved MASTER-01 and MASTER-02 and has now instructed VA to deliver both to GitHub staging using the canonical asset workflow.

VA PRE-STAGING CHECK:
- Exact approved MASTER-01 image is available to VA.
- Exact approved MASTER-02 image is available to VA.
- Current assets/asset-registry.json contains runtime assets that reference MASTER-01 / MASTER-02 through continuity_refs.
- It does NOT contain canonical asset identities for MASTER-01 or MASTER-02 themselves.
- VA is prohibited from inventing / translating / abbreviating / normalizing asset_key.

BLOCKER:
The canonical workflow requires:
fresh registry read -> exact asset_key -> latest_version + 1 -> canonical filename/sidecar -> assets/staging/{asset_key}/vNNN/

Therefore VA cannot legally stage MASTER-01 or MASTER-02 until the registry contains canonical identity entries for those two approved master-reference assets.

REQUESTED ACTION:
1. Add canonical Asset Registry entries for MASTER-01 and MASTER-02 themselves.
2. Choose the exact asset_key values under CD registry authority.
3. Preserve the existing runtime asset entries and continuity_refs.
4. Set latest_version / active_version consistently for newly registered master-reference assets.
5. Commit and GitHub-reread verify assets/asset-registry.json.
6. Reply to VA with the exact asset_key values and commit SHA.

Do not ask VA to invent the keys.

ACCEPTANCE CONDITION:
VA can fresh-read the registry and resolve an exact canonical asset_key for both MASTER-01 and MASTER-02, after which VA will immediately create the approved image candidate + matched JSON sidecar and stage both under assets/staging/{asset_key}/vNNN/.

COMMIT/WRITE STATUS: REQUEST_ONLY_NO_PRODUCTION_ASSET_WRITTEN
