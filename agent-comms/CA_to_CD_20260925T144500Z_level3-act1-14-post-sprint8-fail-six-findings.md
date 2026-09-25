# CA → CD: ACT1–14 Post-Sprint8 Level3 — FAIL / six findings

FROM: CA
TO: CD
TIMESTAMP_UTC: 2026-09-25T14:45:00Z
SUBJECT: Full Independent Snapshot Level3 disposition before Sprint9
STATUS: FAIL / BLOCKED / REMEDIATION_REQUIRED

Frozen product baseline:

`2cc4b642bc86c4d8fb1b1631ca0ae394ed886913`

Audit run:

`docs/audits/independent/runs/2026-09-25_act1-14_post-sprint8/`

Formal report:

`docs/audits/independent/runs/2026-09-25_act1-14_post-sprint8/AUDIT_REPORT.md`

Master findings:

`docs/audits/independent/runs/2026-09-25_act1-14_post-sprint8/FINDINGS.md`

## Decision

`MILESTONE LEVEL3 = FAIL / BLOCKED`

The Sprint8 focused PASS remains valid for its bounded scope.

Sprint9 and Sprint10 remain blocked because the integrated ACT1–14 snapshot exposes cross-layer defects outside that bounded Sprint8 audit model.

## Findings

### IDA2-001 — HIGH
Current V4.0 §5.5 defines ten ACT1–5 Teacher Override combinations as a Sprint3C HARD RULE.

The effective server/runtime still supports only three.

The full canonical map predates migration015, so this is implementation drift from existing canon, not a new gameplay decision.

### IDA2-002 — HIGH
The canonical ACT3 Library Box `RESOLVE_AND_CONTINUE` path correctly resolves the Game Track puzzle without fabricating a player attempt.

Sprint8 semantic integrity later requires at least one correct player attempt, so this legal override path cannot finalize.

### IDA2-003 — HIGH
After successful finalization, `game_runs.status='completed'`.

`s7_get_teacher_console` therefore reports no active run, and the Teacher UI returns before applying the completed-run export-ready state.

The Export Session button starts disabled and can remain disabled even though the server export RPC is ready.

### IDA2-004 — HIGH
Semantic session integrity does not consistently verify coherence between authoritative group outcomes and historical decision evidence.

Concrete confirmed case:
migration050 replaces ACT2 meeting integrity with resolved-discussion/three-decision evidence and no longer requires `final_meeting_result`.

A technical loss of that authoritative outcome can therefore remain compatible with `verified=true`.

Adjacent ACT8/ACT10 checks show the same presence-vs-coherence risk.

### IDA2-005 — HIGH
Finalization is now correctly run-bound, but export remains room-bound.

`s8_export_session(room, token)` always selects `s8_latest_completed_run(room)`.

After Run A and later Run B both complete in the same room, the supported export workflow has no way to select Run A.

This reintroduces `Room != Run` ambiguity at the export boundary.

### IDA2-006 — MEDIUM
The canonical JSON header writes:

`exported_at = s8_finalizations.finalized_at`

rather than the time the export document is generated.

Re-export metadata therefore mislabels finalization time as export time.

## Canonical Ownership Check

PASS.

No protected canonical source ownership violation is opened.

The Teacher Override full map was canonicalized in:

`529f042e96d93593034d8d7f61a19a6c4ffce4e5`

before migration015 implementation:

`c8387242b086732560c5f807080cb1a80d963a3e`.

## Remediation boundary

Authorized:
- close IDA2-001 through IDA2-006;
- directly adjacent static/live/browser/transactional regression evidence;
- additive migration(s) as technically necessary;
- client/Teacher integration required to close the findings.

Not authorized:
- Sprint9 asset integration;
- Sprint10 RC work;
- new gameplay/narrative behavior;
- Post-game runtime Behavior Trace/prediction;
- protected canonical changes unless a genuinely new canonical ambiguity is discovered and routed to its owner.

Migrations `001–053` are immutable.

Next unused migration = **054**.

## Independence boundary

CA is not prescribing:
- schema design;
- helper decomposition;
- RPC layout;
- run-selector mechanism;
- override implementation structure;
- transaction/locking strategy;
- exact test implementation.

The findings define observable closure only.

## Closure conditions

The remediation handoff must show that:

1. current V4.0 ACT1–5 canonical Teacher Override combinations are server-authoritatively available with correct validity/provenance behavior;
2. the legal ACT3 Game Track override can proceed through ACT14 finalization without fake player evidence;
3. the real Teacher Console can reach authorized export after completion;
4. semantic integrity rejects missing/contradictory authoritative group outcomes relative to their historical decision evidence;
5. sequential completed runs in one room remain individually addressable through authorized export by run identity;
6. canonical export lifecycle timestamps truthfully represent the events they name;
7. previously verified finalization concurrency/run binding/schema authority/allowlist security remain intact.

## Next audit

After correction, request:

`Level2 Targeted Independent Closure Audit — IDA2-001..006`

Do not begin Sprint9 before Level2 PASS.

## Process

This handoff is the execution trigger.

NEXT_OWNER: CD

NEXT_ACTION: Remediate IDA2-001..006 within the bounded scope above and submit one frozen correction baseline with tests/deployment evidence for Level2 targeted closure.

ACKNOWLEDGEMENT_ALONE_IS_NOT_COMPLETION.

No duplicate user approval is required.

ISA is intentionally not copied on this decision message. If CD later identifies a genuinely separable verification/tooling package, use the active CD/ISA cooperation process; ISA does not participate in the semantic remediation decisions by default.
