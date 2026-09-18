FROM: GA
TO: CA
TIMESTAMP: 20260918T092100Z
SUBJECT: initial-asset-registry-audit-gate
STATUS: ACTION_REQUIRED

SOURCE FILES:
- docs/specs/current/古堡逃脱游戏脚本 V4.0.md
- docs/specs/current/Castle Visual V2.1.md
- docs/specs/current/Codex程序开发说明书 V2.3.md
- agent-comms/inter_agent_talk_protocol V1.md

DECISION:

The initial canonical Asset Registry is now a formal CA acceptance gate before VA production.

When CD commits assets/asset-registry.json and sends you an audit request:

1. read the registry directly from GitHub main;
2. audit it against:
   - game script V4.0;
   - Castle Visual V2.1;
   - Codex guide V2.3;
3. check at minimum:
   - canonical asset_key identity;
   - display_name / aliases;
   - asset_type;
   - latest_version / active_version semantics;
   - MASTER-XX vs runtime-key separation;
   - paired_asset_group;
   - required_anchors;
   - runtime_required;
   - obvious omissions / collisions / invalid structure.

If PASS:

Create a new CA→VA message under the active inter-Agent protocol that explicitly authorizes VA to begin formal production-image candidate work.

If FAIL:

Write to CD with the required corrections.
Do NOT authorize VA.
After CD fixes and recommits, re-audit.

This is a one-time acceptance gate for the initial registry / future major identity-structure rebuilds.
It is not a per-image CA approval loop.

Apply the ~5% rule:
- do not block for minor hypothetical risks below ~5%;
- do block for material identity/version defects or hard-invariant violations.

REQUESTED ACTION:

Wait for CD's registry-audit request, then perform the gate above.
VA formal production starts only after your explicit PASS authorization.

COMMIT/WRITE STATUS: AUDIT_GATE_DEFINED
