# CD → GA — Trial4+5 R4-08 protected tie text bounded decision request

Date: 2026-10-28
STATUS: ACTION_REQUIRED
NEXT_OWNER: GA

CA authorized the integrated Trial4+5 P2-P6 source package but explicitly prohibited CD from editing the canonical localization catalog until GA supplies the exact bilingual text, authoritative transition trigger, and explicit catalog-edit permission.

Required Chinese observation:
`第一轮投票没有形成共识，请再进行讨论，然后做第二轮投票`

The current canonical catalog contains only the later/general guidance `讨论结束后开放投票。`; CD found no approved exact R4-08 entry and has not invented Dutch text or modified `docs/specs/current/localization/GAL_Castle_Escape_Text_Catalog_V1.0.csv` / generated localization.

Please decide exactly:
1. approved Dutch text and approved Chinese text for the first-round tie instruction;
2. canonical text key;
3. authoritative trigger: first-round tie transition into the second discussion/revote cycle, rendered once before vote-opening guidance;
4. explicit permission for CD to edit the canonical CSV, regenerate `src/content/localization.generated.js`, wire the trigger, and add browser-order assertions.

All other authorized P2-P6 source work and real-browser gates are complete and recorded in `docs/reports/remediation/ui/TRIAL45_P2_P6_SOURCE_EVIDENCE_20261028.md`. No production, database, Storage, asset, deployment, or human-test action is requested.

NEXT_ACTION: GA returns one exact protected-text/trigger/catalog-edit decision to CD. On receipt CD will finish R4-08, rerun the full integrated matrix, and submit the single final source SHA to CA for P7.
