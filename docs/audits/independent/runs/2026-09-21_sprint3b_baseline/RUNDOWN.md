# Independent Audit RUNDOWN — 2026-09-21 Sprint 3B Baseline

Audit run: 2026-09-21_sprint3b_baseline  
Baseline SHA: 3be0e6ad8395f05bbab13ca41e6b91dac57eb4fe  
Protocol: Independent_Development_Snapshot_Audit_Protocol_v1.1.md  
Status: IN PROGRESS

This rundown was retrofitted after the audit had already begun under protocol v1.0.
Previously performed work is marked complete only where existing repository artifacts provide evidence.
No incomplete method is treated as complete merely because it was partially discussed.

## Execution rule

Before each remaining step:
1. Read only that step block in this file for procedural instructions.
2. Read the frozen-baseline code/spec/evidence needed for that step.
3. Execute every sub-check.
4. Update the named artifact.
5. Add/update every finding immediately in FINDINGS.md.
6. Mark [x] only after the completion condition is met.

---

## A — Setup

### [x] A1 Freeze baseline
Evidence:
- BASELINE.md
- product baseline 3be0e6ad8395f05bbab13ca41e6b91dac57eb4fe
Included: Sprints 1/2/3A/3B, migrations 001–012, current player/Teacher runtime and tests.
Excluded: Sprint 3C+, ACT6–14, Asset Manager runtime, final export, release candidate.

### [x] A2 Tailor this rundown
This file is the run-specific executable checklist under protocol v1.1.

---

## B — Method 1: Code-First Reverse Audit

### [x] B1 State authority inventory
Existing evidence in IMPLEMENTED_SYSTEM_MODEL.md:
- Sprint1 legacy room state
- game_runs / DiscussionRoom
- Sprint3 runtime scene state
- Sprint3B flow/progress state
- current client refresh composition

### [x] B2 RPC call graph
Completed:
- enumerated all public in-scope Sprint1/Sprint2/Sprint3A/Sprint3B RPC families;
- mapped helper delegation and principal writes;
- mapped player/Teacher frontend callers, including dynamic Sprint3B dispatch;
- identified migration-011 wrapper → pre011 topology and migration-012 final route-ACK wrapper.
Evidence: IMPLEMENTED_SYSTEM_MODEL.md §7.
Output: IMPLEMENTED_SYSTEM_MODEL.md

### [x] B3 Implemented transition graph
Completed:
- mapped every implemented ACT1–5 gate with exact effective server predicate;
- documented mutations, resulting state and next accepted actions;
- documented normal duplicate/stale/replay outcomes;
- identified timeout-boundary locked-prefix TOCTOU as IDA-004.
Evidence: IMPLEMENTED_SYSTEM_MODEL.md §8; FINDINGS.md IDA-004.
Output: IMPLEMENTED_SYSTEM_MODEL.md

### [x] B4 Reconnect model
Completed:
- traced localStorage session lifecycle;
- traced Teacher release and rejoin under the same player_id;
- verified stale-token server rejection;
- traced reconnect through DiscussionRoom, route update, wayfinding/puzzle, ACT4/5 and terminal;
- documented the non-atomic reconnect exceptions already tracked as IDA-001/003/004.
Evidence: IMPLEMENTED_SYSTEM_MODEL.md §9.
Output: IMPLEMENTED_SYSTEM_MODEL.md

### [x] B5 Compare complete derived model to canonical specs
Completed after B2–B4:
- compared derived authority/transition/reconnect model to V2.3 and V4.0;
- distinguished intentional legacy/formal coexistence from reachable cross-boundary defects;
- recorded IDA-005 for unrestricted generic DiscussionRoom in canonical private phases;
- recorded IDA-006 for unreconstructable ACT1 response time.
Evidence: IMPLEMENTED_SYSTEM_MODEL.md §10; FINDINGS.md IDA-005/006.
Output: IMPLEMENTED_SYSTEM_MODEL.md + FINDINGS.md

---

## C — Method 2: State Mutation / Authority Audit

### [x] C1 External mutation inventory
Completed:
- enumerated all browser-executable gameplay/evidence/session mutations across Sprint1/2/3A/3B;
- included read APIs with authoritative timeout/heartbeat side effects;
- classified player, Teacher and AUDIT-only mutation classes.
Evidence: MUTATION_AUTHORITY_REGISTRY.md §C1.
No new issue opened solely by enumeration.

### [x] C2 Internal/helper exposure inventory
Completed:
- enumerated Sprint1/2/3A/3B internal helpers and trigger functions;
- verified source-level explicit revokes;
- traced all twelve migration-011 *_pre011 renamed implementations and migration-012 lockdown;
- separated intentionally browser-executable AUDIT helpers from internal helpers;
- deferred deployed ACL introspection to Method 4.
Evidence: MUTATION_AUTHORITY_REGISTRY.md §C2.
No new source-level exposure defect opened.

### [x] C3 Authentication/authorization review
Completed:
- reviewed token type, room/run binding and role/mode restrictions for all mutation classes;
- confirmed player identity and active run are server-derived rather than client-supplied;
- confirmed Teacher mutation identity is room-token bound;
- confirmed Sprint3A/3B audit helpers reject NORMAL runs;
- retained IDA-005 as a scene-authorization defect, not an authentication failure;
- recorded IDA-007 OBSERVATION/NOT_VERIFIED because canonical authority for the post-inspection group route is unspecified and requested GA clarification.
Evidence: MUTATION_AUTHORITY_REGISTRY.md §C3; FINDINGS.md IDA-007; agent-comms/CA_to_GA_20260921T065435Z_post-inspection-route-authority-clarification.md.

### [x] C4 Phase/state guard review
Completed:
- reviewed exact authoritative state/phase preconditions for every mutation class;
- confirmed Sprint2 DiscussionRoom internal status guards but lack of Sprint3B scene binding (IDA-005);
- confirmed guarded Sprint3B transition wrappers/triggers;
- distinguished allowed object inspection from scene-controlled information sharing;
- recorded IDA-008 HIGH because s3_share_photo has no server-side allow_share_photo/scene guard;
- noted an AUDIT-only puzzle timing helper phase-scope weakness for later Method6/8, not promoted to a production finding.
Evidence: MUTATION_AUTHORITY_REGISTRY.md §C4; FINDINGS.md IDA-008.

### [x] C5 Replay/stale review
Completed:
- reviewed duplicate, old-phase, post-terminal and cross-session behavior;
- confirmed locked Sprint3B choices/progression reject ordinary replay;
- recorded IDA-009 HIGH: stale DiscussionRoom message/vote requests can be retargeted to the latest session/round because requests carry no expected discussion identity;
- recorded IDA-010 HIGH: response-loss retry can duplicate dialogue behavior evidence;
- recorded IDA-011 MEDIUM: response-loss retry can double-count wrong Library attempts and advance hint state;
- noted non-idempotent Teacher Add Time for later failure testing without a separate player-evidence finding.
Evidence: MUTATION_AUTHORITY_REGISTRY.md §C5; FINDINGS.md IDA-009/010/011.

### [ ] C6 Concurrency semantics review
Required: row locks/idempotency for each group gate/resolution.

Output for C1–C6: MUTATION_AUTHORITY_REGISTRY.md + FINDINGS.md

---

## D — Method 3: Invariant Protection Matrix

### [ ] D1 Build mandatory invariant matrix
Include all 12 invariants from protocol v1.1.

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
Target: migrations 001–012.

### [ ] E2 Resolve effective privileges
Include PUBLIC, anon, authenticated, old wrappers and overloads.

### [ ] E3 Audit RLS for every state/evidence table
### [ ] E4 Audit constraints
### [ ] E5 Audit SECURITY DEFINER safety
### [ ] E6 Audit duplicate truths
### [ ] E7 Clean-schema/deployment-effective verification
If a clean DB cannot be built with available tooling, record deployment-effective privilege claims as NOT VERIFIED.

Output: DB_RPC_RLS_AUDIT.md + FINDINGS.md

---

## F — Method 5: Cross-Layer Contract Audit

### [ ] F1 Room creation/join trace

### [ ] F2 First behavior choice trace

### [x] F3 Discussion resolution → Game Track trace
Existing evidence:
- IDA-001
- app.js submitVote()
- s2_submit_vote
- s3b_apply_meeting_resolution / s3b_apply_act5_resolution
Still requires dynamic failure-injection later under Method 8, but cross-layer static trace itself is complete.

### [ ] F4 Route update trace
### [ ] F5 Puzzle trace
### [ ] F6 Later group-route trace
### [ ] F7 Reconnect trace
### [~] F8 Teacher observation/control trace
Initial legacy/formal coexistence examined; complete trace still required.

Output: CROSS_LAYER_TRACES.md + FINDINGS.md

---

## G — Method 6: Test-Suite Blind-Spot / Mutation-Lite Audit

### [~] G1 Test inventory
Sprint1/2/3A/3B static/live files identified; full per-test inventory still required.

### [~] G2 Test-to-invariant mapping
Initial IDA-001/002/003 blind spots recorded; full map pending.

### [~] G3 Static-vs-behavior classification
Initial distinction documented in TEST_BLIND_SPOTS.md; complete classification pending.

### [~] G4 Counterfactual mutation review
Initial questions recorded; all mandatory guards still need answers.

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
Targets include pre011 wrappers, Sprint1 prototype controls, placeholder scenes and obsolete fields.

### [ ] H2 Classify each object
ACTIVE / INTERNAL / TEST-ONLY / LEGACY-BUT-REQUIRED / DEAD / DANGEROUSLY-REACHABLE / UNKNOWN

### [ ] H3 Trace DANGEROUSLY-REACHABLE paths

Output: LEGACY_PATHS.md + FINDINGS.md

---

## I — Method 8: Failure / Concurrency Snapshot Audit

### [ ] I1 Build high-value mutation failure list
Must include IDA-001 loss window and all group gates.

### [ ] I2 Pre-request failure tests
### [ ] I3 During-mutation/race tests
### [ ] I4 Post-commit/pre-response failure tests
### [ ] I5 Retry/reconnect verification

Output: FAILURE_MATRIX.md + FINDINGS.md

---

## J — Method 9: Data-Forensics Audit

### [ ] J1 Define representative controlled histories
ACT1, ACT2 discussion, fold-back, puzzle, ACT4/5.

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
Required:
- one canonical ID per issue;
- deduplicate;
- finalize severity/status;
- define NOT VERIFIED boundaries.

---

## K — Finalization

### [ ] K1 Finalize Master Findings List
FINDINGS.md must start with the complete 14-column schema required by protocol v1.1.

### [ ] K2 Verify detailed section for every finding
### [ ] K3 Produce EXECUTIVE_SUMMARY.md
### [ ] K4 Verify every rundown step is [x], [N/A], or [!] with reason
### [ ] K5 Record audit completion in CA Action Log
