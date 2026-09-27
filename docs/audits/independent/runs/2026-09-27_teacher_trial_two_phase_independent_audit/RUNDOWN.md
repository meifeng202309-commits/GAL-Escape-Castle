# Teacher Trial Level3 Independent Audit — RUNDOWN

Audit run: `2026-09-27_teacher_trial_two_phase_independent_audit`  
Baseline SHA: `93bd15ca36dd985685a0706bad9ec56ba4002a6e`  
Protocol: `Independent_Development_Snapshot_Audit_Protocol_v1.3.md`  
Status: **IN PROGRESS**

## Execution rule

Before each step, use this block as the procedural control surface. Findings are entered into `FINDINGS.md` as soon as confirmed. A step is complete only when its required artifact is updated.

## A — Setup

### [x] A1 Freeze baseline
Recorded exact product SHA, migration058 ceiling, runtime entries, test surface, configured Supabase project and dynamic-test limitation.  
Output: `BASELINE.md`.

### [x] A2 Tailor rundown
All Methods1–9 retained and tailored below.  
Output: this `RUNDOWN.md`.

## B — Method 1: Code-First Reverse Audit

### [ ] B1 State authority inventory
Map legacy Sprint1, formal run, discussion, canonical ACT1–5, ACT6–8, ACT9–13, ACT14/finalization, asset runtime, reconnect state.

### [ ] B2 RPC call graph
Map public player/Teacher runtime RPCs to helpers/tables/transitions.

### [ ] B3 Implemented transition graph
Trace room→join→formal start→ACT1–14→finalization/export, including initialization boundaries.

### [ ] B4 Reconnect model
Trace browser local/session storage vs server reconstruction and stale-session behavior.

### [ ] B5 Canonical comparison
Only after B1–B4, compare derived implementation model with V4.0/Codex V2.4 invariants.
Output: `IMPLEMENTED_SYSTEM_MODEL.md` + findings.

## C — Method 2: State Mutation / Authority Audit

### [ ] C1 External mutation inventory
### [ ] C2 Helper/historical/audit exposure inventory
### [ ] C3 Authentication/authorization
### [ ] C4 Phase/state guards
### [ ] C5 Replay/stale behavior
### [ ] C6 Concurrency/idempotency semantics
Output: `MUTATION_AUTHORITY_REGISTRY.md`.

## D — Method 3: Invariant Protection Matrix

### [ ] D1–D4
Audit mandatory invariants plus ACT1 privacy, Teacher Override provenance, asset authority, run-bound export.
Output: `INVARIANT_MATRIX.md`.

## [ ] Integration Checkpoint I
Reconcile implemented model, mutation authority, invariant matrix and findings.

## E — Method 4: Final DB / RLS / RPC Audit

### [ ] E1 Effective final function definitions
Resolve repeated CREATE OR REPLACE definitions through migration058.

### [ ] E2 Effective privileges
### [ ] E3 RLS
### [ ] E4 Constraints
### [ ] E5 SECURITY DEFINER safety
### [ ] E6 Duplicate truths
### [ ] E7 Clean-schema/deployment-effective verification
Live effective schema is expected to be partly NOT VERIFIED due tool access.
Output: `DB_RPC_RLS_AUDIT.md`.

## F — Method 5: Cross-Layer Contract Audit

### [ ] F1 Room creation/join
### [ ] F2 First behavior choice
### [ ] F3 Discussion resolution→Game Track
### [ ] F4 Route update
### [ ] F5 Puzzle
### [ ] F6 Later group resolution
### [ ] F7 Reconnect
### [ ] F8 Teacher observation/control
Output: `CROSS_LAYER_TRACES.md`.

## G — Method 6: Test Blind-Spot / Mutation-Lite Audit

### [ ] G1 Test inventory
### [ ] G2 Test→invariant map
### [ ] G3 Static vs behavior
### [ ] G4 Counterfactual mutation review
### [ ] G5 Selected executable/source-level mutation-lite checks or NOT VERIFIED
Output: `TEST_BLIND_SPOTS.md`.

## [ ] Integration Checkpoint II
Reconcile effective DB, cross-layer and test evidence.

## H — Method 7: Dead / Legacy Path Audit

### [ ] H1 Enumerate legacy/replaced paths
### [ ] H2 Classify each
### [ ] H3 Trace DANGEROUSLY-REACHABLE paths
Output: `LEGACY_PATHS.md`.

## I — Method 8: Failure / Concurrency Snapshot

### [ ] I1 High-value mutation list
### [ ] I2 Pre-request failures
### [ ] I3 During-mutation/races
### [ ] I4 Post-commit/pre-response
### [ ] I5 Retry/reconnect
Output: `FAILURE_MATRIX.md`.

## J — Method 9: Data Forensics

### [ ] J1 Representative histories
### [ ] J2 Player behavior reconstruction
### [ ] J3 System/fallback reconstruction
### [ ] J4 Run/provenance identity
### [ ] J5 Ambiguity/NOT VERIFIED
Output: `DATA_FORENSICS.md`.

## [ ] Integration Checkpoint III
Read all nine method artifacts + findings; deduplicate and finalize severity/status.

## Patterns A–F + Canonical Ownership

### [ ] Consolidated recurring-pattern scan
Explicit A–F result and protected-source ownership provenance.

## P — Conditional Pre-Approval Gate

### [N/A] P0 Independence pre-approval
Current audit is already BLOCKED/FAIL unless all findings close; no release forecast at this stage.

### [N/A] P1 Next-scope forecast
Omitted while current blockers exist.

### [N/A] P2 Risk-only approval handoff
No approval handoff while blocked.

## K — Finalization

### [ ] K1 Finalize Master Findings List
### [ ] K2 Detailed section for each finding
### [ ] K3 Produce EXECUTIVE_SUMMARY.md
### [ ] K4 Every step x/N/A/! with reason
### [ ] K5 Record completion in CA Action Log
