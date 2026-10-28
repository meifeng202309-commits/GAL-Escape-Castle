# CA final holistic P7 disposition — Trial Run 4+5
Date: 2026-10-28
STATUS: **P7 SOURCE AND LOCAL-BROWSER ACCEPTANCE PASS; LIVE RELEASE NOT AUTHORIZED**
NEXT_OWNER: CD (release-readiness preflight, read-only)

## Basis
Integrated plan: docs/plans/TRIAL_RUN_4_5_INTEGRATED_DEBUG_PLAN_V2_20261028.md.
CD-175 combined report: docs/reports/remediation/ui/TRIAL45_P2_P6_SOURCE_EVIDENCE_20261028.md.
CA-297 three focused gaps and CD-176 combined closure: docs/reports/remediation/ui/TRIAL45_P7_BOUNDED_EVIDENCE_CLOSURE_20261028.md, docs/reports/remediation/ui/trial45-p2p6/P2P6_BROWSER_EVIDENCE.json.
GA-136 approved text and GA-137 critical reuse guidance.

## R4/R5 closure
- Gitte note consequence: browser proof of connected, decoded visible Scene image 1536x1024 after three polls and 250ms simulated resolver delay; 560ms.
- Anna diary: 540/552ms for two viewports under same 250ms delayed resolver and three polls; meets **test-only** 2500ms bound, not production SLA.
- Teacher: approved V4 prototype/source visual geometry comparison, left live/right discussion primary arrangement, setup under host top, Recovery/Maintenance closed default, critical controls visible.
- Earlier confirmed: shared Player shell across three roles and two viewports, Scene map/diary/key media and all role Pocket media with positive dimensions, NL/ZH 11pt, correct authoritative round-2 tie text, ACT9 NORMAL/AUDIT policy model, scroll preservation and pre-game role-gate negative reproduction.
- Reported consolidated tests PASS: trial45-p2p6-browser, v4-player-integrated-runtime-browser, v4-player-integration-static-check, act9-073-normal-teacher-paced-static-check, act9-073-normal-teacher-paced-policy, localization regeneration, git diff --check.
- Audit confidence is bounded: CA has inspected submitted test source and machine evidence and reconciled all issue rows; **CA has not executed an independent live human run**. This PASS covers the frozen development-source and browser fixture matrix, not deployed production validity.

## Independent assessment and residual gates
No R4/R5 source issue remains open under the plan's test-based closure criteria. No full production deployment, production data change or human trial is authorized here. Before asking Teacher to test, CD must perform a read-only precise deploy impact/candidate-source and rollout/rollback feasibility preflight; CA must review, and existing governance must obtain release authority if required. Once the corrected source is deployed under proper approval, production browser smoke must recheck Player/Teacher visible pixels/asset dimensions; only then can a new human trial be requested.
Avoid expanding the project into broad architecture refactoring as part of this release.

## Common-mechanism governance
Separate draft V1.1 reconciles GA-137 and CD-176 and Teacher instruction that full eight-item checklist applies ONLY to shared, cross-role, cross-ACT, cross-region technical mechanism edits, not pure local text changes. No source refactor by this audit.

NEXT_OWNER: CD for read-only release readiness; Teacher not asked to test; production still old version.
