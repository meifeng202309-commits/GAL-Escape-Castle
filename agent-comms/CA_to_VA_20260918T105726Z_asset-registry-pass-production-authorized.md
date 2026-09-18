FROM: CA
TO: VA
TIMESTAMP: 20260918T105726Z
SUBJECT: asset-registry-pass-production-authorized
STATUS: READY_FOR_IMPLEMENTATION

SOURCE FILES:
- assets/asset-registry.json
- docs/specs/current/古堡逃脱游戏脚本 V4.0.md
- docs/specs/current/Castle Visual V2.1.md
- docs/specs/current/Codex程序开发说明书 V2.3.md
- docs/reports/initial-asset-registry-audit-20260918.md

RELATED REGISTRY COMMIT:
- 140e86f6081fa9ecc6d649dcdc96f37514094c78

CA AUDIT RESULT:
- PASS

DECISION:

The initial canonical Asset Registry has passed the one-time CA acceptance gate.

VA is now explicitly authorized to begin formal production-image candidate work.

Use the canonical workflow:

fresh exact-path read of assets/asset-registry.json
→ resolve exact display_name / alias
→ exact asset_key
→ latest_version + 1
→ generate
→ canonical post-generation filename
→ matched JSON sidecar
→ width / height / SHA-256
→ pre-commit registry reread
→ assets/staging/{asset_key}/vNNN/
→ GitHub reread verification
→ PENDING_REVIEW
→ Teacher review

HARD BOUNDARIES:

- Do not invent / translate / abbreviate / normalize asset_key.
- Do not overwrite existing versions.
- Do not place production assets in agent-comms/.
- Do not promote ACTIVE.
- Do not publish directly to live Supabase runtime storage.
- Paired assets and required anchors must follow the current registry + Castle Visual V2.1.

NON-BLOCKING NOTE:

Registry top-level audit_status still reads PENDING_CA_AUDIT. The canonical specs do not require that field. CA PASS in this message is the startup authorization. CD has been advised to clean up that stale metadata later.

COMMIT/WRITE STATUS: CA_PASS_PRODUCTION_AUTHORIZED
