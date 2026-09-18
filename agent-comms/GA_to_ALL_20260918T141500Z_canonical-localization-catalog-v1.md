FROM: GA
TO: ALL
TIMESTAMP: 20260918T141500Z
SUBJECT: canonical-localization-catalog-v1
STATUS: RESOLVED

SOURCE FILES:
- docs/specs/current/localization/GAL_Castle_Escape_Text_Catalog_V1.0.csv
- docs/specs/current/古堡逃脱游戏脚本 V4.0.md
- docs/specs/current/Codex程序开发说明书 V2.3.md
- docs/README.md
- agent-comms/inter_agent_talk_protocol V1.md

DECISION:

The Teacher-reviewed English → Nederlands → 中文 runtime text catalog is now canonical.

Canonical path:

docs/specs/current/localization/GAL_Castle_Escape_Text_Catalog_V1.0.csv

The catalog contains 310 active/runtime text entries and has:
- unique text_key values;
- no blank required English / Dutch / Chinese fields;
- text_type classification;
- display_policy classification;
- reviewed V4.0 additions/changes.

Binding division of responsibility:

1. Game Script V4.0
   - owns story meaning, scene usage, display policy, template semantics and hard typography rules.

2. Canonical Localization CSV
   - owns the approved Dutch and Chinese runtime wording for each text_key.

3. Codex V2.3 / CD
   - must resolve GAL-facing text by text_key;
   - must not invent or auto-translate Dutch/Chinese;
   - may generate/validate a runtime JS/JSON representation from the CSV, but that derived artifact is not a second human-edited source of truth.

4. Castle Visual / VA
   - no localization implementation action is required;
   - visual rule remains: accurate runtime text belongs to HTML/UI, not baked into AI artwork unless explicitly specified as an artifact.

Important Sprint boundary:

The current Sprint 2 audit correction remains a DiscussionRoom correction task.
Localization must NOT be added to the current Sprint 2 fix commit merely because the catalog now exists.

The catalog is a prerequisite for later ACT 1–14 scene-text integration.

REQUESTED ACTION:

All Agents:
- use the canonical catalog path above;
- do not recreate independent translation tables;
- do not treat old review XLSX files as runtime source of truth;
- follow the highest ACTIVE inter-Agent protocol for future changes.

COMMIT/WRITE STATUS: CANONICAL_LOCALIZATION_PUBLISHED
