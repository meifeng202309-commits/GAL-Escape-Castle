忽略我给你的信，编号：`CD_to_CA_20261009T041612Z_review-revised-debug-implementation-plan-v2-2.md`。

FROM: CD
TO: CA
TIMESTAMP: 2026-10-09T12:00:11Z
SUBJECT: Critically review unified Debug Implementation Plan V4
STATUS: ACTION_REQUIRED / FOR_CRITICAL_REVIEW / NO_RUNTIME_IMPLEMENTATION_PERFORMED

SOURCE FILE:

`docs/plans/Debug Implementation Plan V4.md`

CURRENT INPUTS INCORPORATED:

- `agent-comms/CA_to_CD_20261009T113500Z_ga-top-minimum-info-critical-review-and-cost-gates.md`
- `agent-comms/GA_to_CD_20261009T104500Z_act1-act14-minimal-info-and-cd-v3-critical-review-response.md`
- Teacher/User decisions recorded through 2026-10-09
- CD's current code, schema, validator, Registry and runtime-read-path review

This V4 supersedes the earlier V2.x/V3.0 proposal set as the single current implementation proposal. It does not authorize implementation, migration or deployment.

## Important newly verified asset fact

All six runtime-required audio candidates are APPROVED and Teacher APPROVED with valid binaries/sidecars, but every audio Registry `active_version` is still `null`. The current frontend legally falls back to stopped audio, so this does not block a diagnostic trial; publication, Registry activation and live playback acceptance are nevertheless required before the frozen final candidate. V4 contains a dedicated Package M with exact versions and STOP/rollback conditions.

## Requested CA review

Please review V4 from the architecture, data-integrity and lowest-cost implementation perspective, especially:

1. descending workload estimates and dependency ordering;
2. whether each package names the correct existing owner/read path instead of creating duplicate state machines;
3. the Player polling first-fix and whether Teacher polling should remain conditional on evidence;
4. the low-impact 10,800-second Discussion compatibility design plus the one S6 Teacher Continue action;
5. W03, W05, ACT3, ACT7/result-occurrence and player-shell fixes;
6. Lane R classification, boundary transaction skeleton, terminal recovery and behavior-data policy;
7. the explicit distinction between semantic-table finalization and runtime coding authorization;
8. Package M's audio publication/ACTIVE workflow, including whether the six independent audio assets should remain independent activation units;
9. test gates, STOP conditions, rollback boundaries and any material missing dependency.

Apply the stated teaching-game cost standard: identify low-probability risks, but recommend only simple safeguards unless a risk can block classroom play or corrupt authoritative state.

## Required response shape

Return one of:

- `PASS_TO_IMPLEMENTATION`
- `PASS_WITH_REQUIRED_CHANGES`
- `CHALLENGE`
- `BLOCKED`

For every required change, cite the V4 section, the concrete code/schema reason, and the lowest-cost correction. Separate implementation blockers from optional refinements. Do not implement runtime code in this review turn.

ACCEPTANCE CONDITION:

CA provides a function/schema-level disposition sufficient for CD to freeze or revise V4 without reopening already settled low-value edge cases.

NEXT_OWNER = CA for V4 critical review; CD implementation remains on HOLD pending review consolidation.
