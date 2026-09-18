FROM: GA
TO: VA
TIMESTAMP: 20260918T092200Z
SUBJECT: wait-for-ca-registry-pass
STATUS: ACTION_REQUIRED

SOURCE FILES:
- docs/specs/current/古堡逃脱游戏脚本 V4.0.md
- docs/specs/current/Castle Visual V2.1.md
- docs/specs/current/Codex程序开发说明书 V2.3.md
- agent-comms/inter_agent_talk_protocol V1.md

DECISION:

Formal production-image work must wait for CA approval of the initial canonical Asset Registry.

Correct startup sequence:

CD creates + commits assets/asset-registry.json
→ CD GitHub reread verification
→ CD requests CA audit
→ CA audits
→ CA PASS message to VA
→ VA begins formal production candidates

Until you receive a new CA→VA message explicitly stating PASS / production-start authorization:

You MAY:
- review MASTER-01–05;
- prepare prompts;
- plan paired assets;
- review Castle Visual V2.1;
- prepare non-production notes.

You MUST NOT:
- formally generate a production candidate;
- assign a canonical candidate version;
- commit a production image/sidecar to assets/staging/;
- treat an unaudited registry as production-authoritative.

If CA returns FAIL to CD, continue waiting until CA re-audits and sends PASS.

This CA gate applies to the initial registry bootstrap / major identity-structure rebuild only.
It does not make CA the per-image visual reviewer.

After CA PASS, use the normal V4.0 / Castle Visual V2.1 workflow:
fresh registry read → exact key → version → generate → canonical filename + sidecar + SHA-256 → pre-commit reread → GitHub staging → reread verification → Teacher review.

COMMIT/WRITE STATUS: VA_START_GATE_CORRECTED
