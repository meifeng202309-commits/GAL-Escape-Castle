# Teacher Trial Two-Phase Independent Audit — FINAL PROTOCOL-COMPLETE REPORT

## Audit identity

- **Audit owner:** CA
- **Audit level:** Level3 Full Independent Snapshot Audit
- **Protocol:** `Independent_Development_Snapshot_Audit_Protocol_v1.3.md`
- **Frozen product baseline:** `93bd15ca36dd985685a0706bad9ec56ba4002a6e`
- **Previous CA trial-release baseline:** `6b8730f999a7de4aa58f0444d9a2f75f76377302`
- **Decision:** **FAIL / BLOCKED**
- **Teacher repeated trials:** **PAUSED**
- **Remediation:** **HOLD pending Teacher/GA discussion**
- **Canonical Ownership Check:** **PASS**

This report supersedes the preliminary CA-133 interpretation. The full protocol run is controlled by `RUNDOWN.md` and its 13 mandatory artifacts.

## Phase A — recent media work

Source-level audit result:

- candidate ownership/provenance: PASS;
- Teacher review separation: PASS;
- immutable version succession: PASS;
- paired Portrait Hall metadata/anchor representation: PASS;
- Main Gate v002 mechanical recovery provenance: PASS;
- latest-version sidecars: present for all 28 registry identities;
- latest-version binaries: Git-reachable and non-zero at the frozen baseline;
- exact independent binary SHA-256 recomputation: NOT VERIFIED through the current connector;
- live Asset Manager ACTIVE publication state: NOT VERIFIED.

No protected canonical-source authority violation was found.

Media readiness is therefore **not the current Teacher-trial blocker**. Final live publication/ACTIVE completion remains a separate Sprint9 readiness item.

## Phase B — protocol-complete current-product audit

### IDA-001 — HIGH — CONFIRMED
Root player exposes legacy Sprint1 gameplay before formal run.

The current root client falls back to legacy `renderState(sprint1State)` whenever no formal run exists. Room creation already initializes legacy Scene1, so the first joined player sees playable legacy content rather than waiting.

### IDA-002 — HIGH — CONFIRMED
Legacy root path reveals all three first choices player-to-player.

After three legacy submissions, Sprint1 changes to `revealed`; player state returns all decisions; root renderer prints all choices. This violates current player-to-player first-choice isolation.

The formal canonical ACT1 itself does **not** have this defect.

### IDA-003 — HIGH — CONFIRMED
Formal startup is split into two user-visible operations:

```text
s2_start_run
→ separate Teacher action
→ s3b_initialize_flow
```

Between them, formal run is active but canonical ACT1 state may not exist. Player polling then selects the formal branch but cannot render canonical state.

In the same gap, generic Sprint2 DiscussionRoom is still legally openable because canonical state is absent; if opened, canonical initialization intentionally refuses to proceed until that discussion is resolved.

This is a cross-module startup ownership failure.

### IDA-004 — HIGH — NOT_VERIFIED root cause
Teacher live evidence showed:

```text
Run started: <run_id>
No active run
Sprint 3B initialization failed: No active formal run.
```

That contradicts the frozen static contract under one consistent deployed database. The live inconsistency is real, but its root cause cannot be assigned from source alone.

Live deployed-state reproduction is required.

### IDA-005 — MEDIUM — CONFIRMED
Production Teacher Console still exposes legacy Sprint1 `Advance scene` and `Reset room` controls beside formal controls.

These mutate only shadow legacy state, not the formal run, producing an operator split-state hazard.

### IDA-006 — MEDIUM — CONFIRMED
Existing regression coverage does not exercise the real browser startup journey.

Live E2E fixtures primarily issue direct RPCs and call `s2_start_run` then `s3b_initialize_flow` back-to-back. Repository contains no browser-driving harness.

Thus prior tests could verify canonical internals while never detecting the root legacy renderer or user-visible startup gap.

### IDA-007 — OBSERVATION — NOT VERIFIED
Recent media candidate source state is coherent, but final live runtime ACTIVE publication state is not independently verifiable from the current CA environment.

This is not the current gameplay blocker.

## Methods executed

- Method1 Code-First Reverse Audit — COMPLETE
- Method2 State Mutation / Authority — COMPLETE
- Method3 Invariant Protection Matrix — COMPLETE
- Integration Checkpoint I — COMPLETE
- Method4 Final DB/RPC/RLS — COMPLETE source-level; live clean-schema/effective deployment verification BLOCKED
- Method5 Cross-Layer Contract — COMPLETE
- Method6 Test Blind-Spot / Mutation-Lite — COMPLETE
- Integration Checkpoint II — COMPLETE
- Method7 Dead / Legacy Path — COMPLETE
- Method8 Failure / Concurrency Snapshot — COMPLETE source-level
- Method9 Data Forensics — COMPLETE source-level
- Integration Checkpoint III — COMPLETE
- Patterns A–F — COMPLETE
- Canonical Ownership Check — COMPLETE / PASS

## Patterns A–F

- **A FINDING:** split formal startup, IDA-003.
- **B FINDING:** startup happy-path assumption + live divergence, IDA-003/004.
- **C PASS for generic DiscussionRoom:** server-side canonical-flow guard exists in migration013.
- **D FINDING impact:** legacy pre-run choices exist outside formal run evidence, IDA-001/002.
- **E FINDING:** legacy/new authority accretion on root player/Teacher surfaces, IDA-001/005.
- **F FINDING:** direct-RPC tests bypass faulty browser orchestration, IDA-006.

## Positive findings

The formal canonical path still contains:

- correct GAL-A/GAL-B/GAL-C role-specific ACT1 choices;
- server-side role validation;
- formal opening image keys and placeholder fallback;
- canonical private-choice isolation;
- server-side generic DiscussionRoom fail-close after canonical flow exists;
- previously closed ACT2–ACT14 integrity/Override/finalization protections.

No new ACT2–ACT14 integrity defect was confirmed in this run.

## Trial disposition

```text
Repeated Teacher trials = PAUSED
Current blocker = startup / legacy authority exposure
Media placeholders = not the blocker
Remediation routing = HOLD pending Teacher/GA discussion
```

## Mandatory artifacts

- `BASELINE.md`
- `RUNDOWN.md`
- `IMPLEMENTED_SYSTEM_MODEL.md`
- `MUTATION_AUTHORITY_REGISTRY.md`
- `INVARIANT_MATRIX.md`
- `DB_RPC_RLS_AUDIT.md`
- `CROSS_LAYER_TRACES.md`
- `TEST_BLIND_SPOTS.md`
- `LEGACY_PATHS.md`
- `FAILURE_MATRIX.md`
- `DATA_FORENSICS.md`
- `FINDINGS.md`
- `EXECUTIVE_SUMMARY.md`

## Next owner

**GA + Teacher**

Discuss remediation scope and priority. Do not route implementation before that decision.

After bounded remediation, return one frozen baseline to CA for a **Level2 Targeted Independent Closure Audit**, beginning again with code-first reconstruction rather than validating the implementer's explanation.
