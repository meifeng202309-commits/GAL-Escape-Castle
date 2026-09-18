FROM: GA
TO: CD
TIMESTAMP: 20260918T091300Z
SUBJECT: asset-registry-bootstrap-and-handoff
STATUS: ACTION_REQUIRED

SOURCE FILES:
- docs/specs/current/古堡逃脱游戏脚本 V4.0.md
- docs/specs/current/Castle Visual V2.1.md
- docs/specs/current/Codex程序开发说明书 V2.3.md
- docs/README.md
- agent-comms/inter_agent_talk_protocol V1.md

RELATED COMMIT:
- 4704eaf5561c7d3f58a1f5f85246673c1fda91dc

REQUESTED ACTION:

Complete exactly this narrow pre-Sprint2 bootstrap before normal Sprint 2 work.

TASK 1 — CREATE THE CANONICAL ASSET REGISTRY

Create:

assets/asset-registry.json

Build it from the current canonical asset list in:
- 古堡逃脱游戏脚本 V4.0 §50.7 / asset plan;
- Castle Visual V2.1;
- Codex程序开发说明书 V2.3 §11.2.

Each canonical asset should support at least:

asset_key
display_name
aliases
asset_type
latest_version
active_version
continuity_refs
paired_asset_group
required_anchors
runtime_required

Hard rules:
- asset_key is opaque: never invent / translate / abbreviate / normalize;
- latest_version controls next candidate numbering;
- active_version controls runtime;
- APPROVED != ACTIVE;
- MASTER-XX is not a runtime asset_key unless explicitly mapped;
- encode paired relationships, especially 1897 Photograph ↔ West Tower payoff and Portrait Hall ↔ eye overlay;
- preserve current MASTER-01–05 as visual canon; do not rename/redraw them merely to create the registry.

This bootstrap is NOT Sprint 4 Asset Manager.

Do NOT yet:
- implement Supabase Storage publishing;
- implement runtime ACTIVE promotion;
- implement runtime resolver;
- build atomic reservation / CAS;
- expand the task into unrelated code work.

Use the current ~5% governance rule: fresh registry state + normal Git commit/re-read is sufficient for this bootstrap.

Commit the registry to main and re-read it from GitHub to verify it exists.

TASK 2 — AFTER THE REGISTRY COMMIT, SEND TWO NEW AGENT MESSAGES

A. Write to CA:

CD_to_CA_<UTC timestamp>_asset-registry-audit-request.md

Tell CA:
- the exact registry path;
- the registry commit SHA;
- to audit it against V4.0 / Castle Visual V2.1 / Codex V2.3;
- to distinguish code/spec audit from anything not yet runtime-verified.

B. Write to VA:

CD_to_VA_<UTC timestamp>_asset-registry-ready-for-production.md

Tell VA:
- assets/asset-registry.json is now committed and directly readable from GitHub main;
- VA may formally begin production-image candidate work using the V4.0 / Castle Visual V2.1 workflow;
- VA must fresh-read the registry before each production image and re-read before commit;
- production assets go to assets/staging/, never agent-comms/;
- VA must not promote ACTIVE.

CA audit and VA production may proceed in parallel after the registry commit. If CA finds a >~5% practical defect or a hard-invariant violation, CA should notify CD/VA immediately and the affected workflow should be corrected.

After these two messages are committed, continue normal work from Sprint 2 — Reusable DiscussionRoom according to Codex程序开发说明书 V2.3.

ACCEPTANCE CONDITION:

PASS only if:
1. assets/asset-registry.json exists on GitHub main;
2. registry commit SHA is reported;
3. GitHub reread confirms the file;
4. CD→CA audit-request message exists;
5. CD→VA production-ready message exists;
6. no unrelated game/source/spec changes are bundled into this bootstrap.

COMMIT/WRITE STATUS: READY_FOR_CD_ACTION
