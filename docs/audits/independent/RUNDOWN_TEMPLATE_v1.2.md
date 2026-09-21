# Independent Audit RUNDOWN Template v1.2

Audit run: <RUN_ID>  
Baseline SHA: <SHA>  
Protocol: Independent_Development_Snapshot_Audit_Protocol_v1.2.md  
Status: NOT STARTED

## Execution rule

Before each step:
1. Read only that step block in this file for procedural instructions.
2. Read the source/spec/evidence explicitly needed for the step.
3. Execute every sub-check.
4. Update the named output artifact(s).
5. Add every discovered issue immediately to FINDINGS.md.
6. Mark the step [x] only after completion criteria are met.

Do not skip a mandatory step. Use [!] BLOCKED or [N/A] with a written reason.

---

## A — Setup

### [ ] A1 Freeze baseline
Required:
- exact product SHA
- start UTC
- highest migration
- runtime files
- tests
- deployment environment
- excluded features
Output: BASELINE.md
Completion: exact reproducible snapshot recorded.

### [ ] A2 Tailor this rundown
Required:
- expand every B–K step for the actual baseline;
- name specific files/functions/flows where already known;
- retain every mandatory method.
Output: RUNDOWN.md
Completion: run can proceed from this file alone.

---

## B — Method 1: Code-First Reverse Audit

### [ ] B1 State authority inventory
Requirements: identify authoritative tables/fields, readers, writers, reconnect source, duplicate truths.
Output: IMPLEMENTED_SYSTEM_MODEL.md

### [ ] B2 RPC call graph
Requirements: public RPC → helper → tables → transition.
Output: IMPLEMENTED_SYSTEM_MODEL.md

### [ ] B3 Implemented transition graph
Requirements: entry condition, guard, mutation, result, next accepted actions.
Output: IMPLEMENTED_SYSTEM_MODEL.md

### [ ] B4 Reconnect model
Requirements: client-local state, server reconstruction, stale token/state behavior.
Output: IMPLEMENTED_SYSTEM_MODEL.md

### [ ] B5 Compare derived model to canonical specs
Requirements: implementation-created semantics, missing authority, divergence.
Output: IMPLEMENTED_SYSTEM_MODEL.md + FINDINGS.md

---

## C — Method 2: State Mutation / Authority Audit

### [ ] C1 External mutation inventory
### [ ] C2 Internal/helper exposure inventory
### [ ] C3 Authentication/authorization review
### [ ] C4 Phase/state guard review
### [ ] C5 Replay/stale review
### [ ] C6 Concurrency semantics review
Output: MUTATION_AUTHORITY_REGISTRY.md + FINDINGS.md

---

## D — Method 3: Invariant Protection Matrix

### [ ] D1 Build mandatory invariant matrix
### [ ] D2 Identify server-side protection for each invariant
### [ ] D3 Identify tests for each invariant
### [ ] D4 Record unprotected/NOT VERIFIED invariants
Output: INVARIANT_MATRIX.md + FINDINGS.md

---

## [ ] Integration Checkpoint I
Read only:
- IMPLEMENTED_SYSTEM_MODEL.md
- MUTATION_AUTHORITY_REGISTRY.md
- INVARIANT_MATRIX.md
- FINDINGS.md
Required: deduplicate, reconcile authority contradictions, update severity/evidence.

---

## E — Method 4: Final Database / RLS / RPC Audit

### [ ] E1 Resolve effective final function definitions
### [ ] E2 Resolve effective privileges
### [ ] E3 Audit RLS for every table
### [ ] E4 Audit constraints
### [ ] E5 Audit SECURITY DEFINER safety
### [ ] E6 Audit duplicate truths
### [ ] E7 Clean-schema/deployment-effective verification
Output: DB_RPC_RLS_AUDIT.md + FINDINGS.md

---

## F — Method 5: Cross-Layer Contract Audit

### [ ] F1 Room creation/join trace
### [ ] F2 First behavior choice trace
### [ ] F3 Discussion resolution → Game Track trace
### [ ] F4 Route update trace
### [ ] F5 Puzzle trace
### [ ] F6 Later group-route trace
### [ ] F7 Reconnect trace
### [ ] F8 Teacher observation/control trace
Output: CROSS_LAYER_TRACES.md + FINDINGS.md

---

## G — Method 6: Test-Suite Blind-Spot / Mutation-Lite Audit

### [ ] G1 Test inventory
### [ ] G2 Test-to-invariant mapping
### [ ] G3 Static-vs-behavior classification
### [ ] G4 Counterfactual mutation review
### [ ] G5 Selected actual mutation tests or explicit NOT VERIFIED
Output: TEST_BLIND_SPOTS.md + FINDINGS.md

---

## [ ] Integration Checkpoint II
Read only:
- DB_RPC_RLS_AUDIT.md
- CROSS_LAYER_TRACES.md
- TEST_BLIND_SPOTS.md
- FINDINGS.md
Required: reconcile static/runtime evidence, update finding status/severity.

---

## H — Method 7: Dead / Legacy Path Audit

### [ ] H1 Enumerate legacy/replaced objects
### [ ] H2 Classify each object
### [ ] H3 Trace DANGEROUSLY-REACHABLE paths
Output: LEGACY_PATHS.md + FINDINGS.md

---

## I — Method 8: Failure / Concurrency Snapshot Audit

### [ ] I1 Build high-value mutation failure list
### [ ] I2 Pre-request failure tests
### [ ] I3 During-mutation/race tests
### [ ] I4 Post-commit/pre-response failure tests
### [ ] I5 Retry/reconnect verification
Output: FAILURE_MATRIX.md + FINDINGS.md

---

## J — Method 9: Data-Forensics Audit

### [ ] J1 Define representative controlled histories
### [ ] J2 Reconstruct player behavior evidence
### [ ] J3 Reconstruct system/fallback evidence
### [ ] J4 Reconstruct run/provenance identity
### [ ] J5 Record ambiguity or NOT VERIFIED
Output: DATA_FORENSICS.md + FINDINGS.md

---

## [ ] Integration Checkpoint III
Read:
- all nine method artifacts
- FINDINGS.md
Required: one canonical ID per issue, deduplicate, finalize status/severity, define NOT VERIFIED boundaries.

---


## P — Conditional Pre-Approval Gate

### [ ] P0 Codex recurring-error pattern synthesis
Required:
- explicitly review Patterns A–F from GAL_ESCAPE_CASTLE_CA_CODING_AUDIT_RULES_V1.0.md against completed audit evidence;
- link each applicable pattern to PASS / finding / NOT VERIFIED / N/A.

### [ ] P1 Next-Scope Failure Forecast
If current disposition is PASS/READY:
- identify next authorized CD scope;
- forecast 3–8 concrete failure modes from Patterns A–F and next-scope interfaces;
- if forecast exposes a current-baseline defect, reopen current audit.
If current disposition is FAIL/BLOCKED:
- mark [N/A] with reason.

### [ ] P2 Next-Scope Prevention Guidance
If approving:
- create the required Risk ID / operation / likely failure / precaution / test-evidence table for CD handoff.
If not approving:
- mark [N/A] with reason.

---

## K — Finalization

### [ ] K1 Finalize Master Findings List
Output: FINDINGS.md
Requirement: exact full table schema from Protocol v1.1.

### [ ] K2 Verify detailed section for every finding
### [ ] K3 Produce EXECUTIVE_SUMMARY.md
### [ ] K4 Verify every rundown step is [x], [N/A], or [!] with reason
### [ ] K5 Record audit completion in CA Action Log
