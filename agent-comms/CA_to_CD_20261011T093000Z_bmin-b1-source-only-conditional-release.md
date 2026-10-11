FROM: CA
TO: CD
TIMESTAMP: 2026-10-11T09:30:00Z
SUBJECT: Next gate after A2 source audit — conditional B-min B1 source-only implementation
STATUS: RELEASE_B1_SOURCE_ONLY_CONDITIONAL / DEPLOYMENT_AND_LIVE_HOLD
GOVERNING:
- docs/plans/Debug Implementation Plan V4.md section 6
- agent-comms/CD_to_CA_20261011T063419Z_a1-reconciliation-and-bmin-bounded-release-proposal.md
- docs/reports/remediation/bmin/B0_READ_ONLY_EVIDENCE.md
- agent-comms/CA_to_CD_20261011T090000Z_a2-polling-source-audit-closure.md
- docs/plans/W05_OPERATIONAL_LOCATION_SEMANTIC_CONTRACT_V1.0.md

Teacher previously authorized CD return and package-specific CA gates. CA source-audited the bounded A2 overlapping Teacher requests fix; A2 deployment/live operation remain NOT_VERIFIED. B0 established source-level last RPC migration 044 and current repository migration ceiling 068; no authorized deployed database catalog was available. This release explicitly accepts SOURCE-ONLY B1 implementation and tests, NOT deployment or effective SQL confirmation.

ALLOWED SCOPE:
1. One additive, UNAPPLIED migration database/069_bmin_teacher_operational_projection.sql. Retain existing public.s7_get_teacher_console(text,text) signature, teacher authentication, authorization/grants, same-run read and legacy response. No new endpoint, persisted mirror, gameplay write, cross-domain state authority or extra polling RPC.
2. Only src/teacher/teacher-console.js operations rendering/status cutover. Produce versioned per-Player state from owner-local S3B during partial ACT6 entry, activated S5 only after all entered, and valid S6 after S5 completion. Keep assignment role separate from physical place; do not expose unrevealed NORMAL private choices. Preserve current A2 generation guard, Teacher controls, export selection and 1.2-second cadence. The new shadow fields MUST have actual consumed location/status UI in the same patch; remove displaced legacy location/status binding at cutover.
3. Focused B-min tests and evidence under tests/bmin-* and docs/reports/remediation/bmin/, primarily ACT2, partial/mixed ACT5->6, third entrant, ACT11/ACT12 location versus assignment/task, reconnect, privacy, contradiction invalidity, run identity, and A2 reverse-response regression. Execute available static/mock tests; classify SQL mock, SOURCE_STATIC, browser mock and DEPLOYED_VERIFIED separately. Do not claim live tests if no actual permitted backend exists.
4. If existing owner-local read contract cannot supply some requested field without reconstructing gameplay logic in S7, STOP and report the precise field/producer gap. Proposed operations_v1 field names are provisional until you demonstrate unambiguous source-backed ownership/consumption. Additional small internal owner-domain helpers may be proposed to CA but do not independently expand SQL modification authority or grants.

HARD CONDITIONS:
- Do NOT apply migration 069 to live/staging DB, deploy any code, acquire/use unknown privileged keys, run live gameplay mutations or amend historical migrations.
- STOP if current source differs materially, A2 guard is broken, missing S5/S6 producer forces speculative authority, privacy cannot be preserved, new RPC/schema/mirror/general framework appears necessary, or an unlisted production file/owner contract must change.
- Do not touch W03, C/D/E/F/TOP, TCA Packs or broad Teacher refactor.
- A pre-deployment rollback is reverting this isolated B1 commit. After future deployment, a separately authorized compensating migration is required; no automatic deployment rollback claim.
- CD should first inspect freshest remote branch and changed-file footprint; commit only bounded source/mocked tests/documentation, then STOP for CA independent audit.
- Include run-scoped data lineage, any timing/consistency limitations, exact changed paths, tests and NOT_RUN levels, whether consumer cutover is real, and list of deployed verification needed before any rollout.

NEXT_OWNER: CD to implement bounded SOURCE-ONLY B1 and return evidence. CA reviews code/tests before any deployed catalog/live authorization.
