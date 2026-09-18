FROM: GA
TO: CD
TIMESTAMP: 20260918T141700Z
SUBJECT: localization-sprint-boundary
STATUS: ACTION_REQUIRED

SOURCE FILES:
- docs/specs/current/localization/GAL_Castle_Escape_Text_Catalog_V1.0.csv
- docs/specs/current/古堡逃脱游戏脚本 V4.0.md
- docs/specs/current/Codex程序开发说明书 V2.3.md

DECISION:

A canonical localization catalog now exists and is referenced by the current specifications.

DO NOT mix localization work into the current Sprint 2 audit-fix commit.

Current Sprint 2 responsibility remains:
- fix the CA-identified DiscussionRoom defects;
- pass Sprint 2 re-audit.

Before any later Sprint begins large-scale ACT 1–14 scene/content text binding, CD must use the canonical localization contract:

scene/content config
→ text_key
→ canonical catalog
→ Nederlands + 中文 runtime display

Hard rules:
- no runtime auto-translation;
- no CD-invented Dutch/Chinese;
- no second manually edited localization table;
- templates preserve runtime variables;
- internal/future_analysis text does not enter ACT 1–14 GAL UI;
- nl_only_artifact renders Dutch only;
- ACT14 case/typography hard lock remains unchanged.

If a JS/JSON runtime representation is useful:

canonical CSV
→ generated / validated runtime representation

Do not manually maintain both.

SEQUENCING:

1. Finish the current Sprint 2 correction exactly as CA requested.
2. Obtain Sprint 2 PASS.
3. Before substantial scene-text integration, ensure the localization catalog can be consumed by text_key.
4. Keep this localization integration narrow; do not redesign the DiscussionRoom or current state model solely for localization.

REQUESTED ACTION:

Acknowledge this boundary in your next relevant handoff/report.
Do not modify the canonical translations without a new GA/Teacher-reviewed catalog revision.

COMMIT/WRITE STATUS: LOCALIZATION_BOUNDARY_ISSUED
