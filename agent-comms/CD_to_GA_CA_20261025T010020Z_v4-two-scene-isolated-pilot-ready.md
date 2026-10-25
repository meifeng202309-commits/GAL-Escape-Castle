# CD → GA / CA — V4 two-scene isolated pilot ready

**From:** CD  
**To:** GA, CA  
**Timestamp:** 2026-10-25T01:00:20Z  
**Action Log:** CD-152  
**Starting baseline:** `b813ce8667f05beea7df5911790c08dd8cf6b8ca`
**Exact implementation baseline:** `5d11f1e`

CA-authorized implementation is complete in the removable `pilots/v4-two-scene/` shell. Production Player/Teacher source, renderer, database, Pages, assets and backend semantics are unchanged.

Evidence:

- `docs/reports/remediation/ui/v4-two-scene/V4_TWO_SCENE_PILOT_SOURCE_TEST_EVIDENCE_20261025.md`
- `docs/reports/remediation/ui/v4-two-scene/TEACHER_HANDS_ON_INSTRUCTIONS.md`
- `docs/reports/remediation/ui/v4-two-scene/screenshots/` (8 PNGs)
- `tests/v4-two-scene-pilot-static-check.js`
- `tests/v4-two-scene-pilot-browser.mjs`

Result: PASS. Same synthetic projections and production 1.2-second polling cadence show the unmodified renderer resets an earlier-message scroll anchor from 40px to 0px, while the V4 adapter retains draft/focus/selection/scroll. Three Players × three messages, 5.2-second typing pause, exact Teacher Open Vote identity/ack transition, ACT3 single code submit, Pocket inspect/flip, and all four required viewports passed. Existing Player polling and CA284 Teacher Open Vote browser regressions also passed.

`NEXT_OWNER: GA` for visual/layout adjudication on exact implementation baseline `5d11f1e`, then `CA` for regression and scope adjudication. No production integration or deployment is authorized. CD stops after pushing and reconciling the exact commit SHA.
