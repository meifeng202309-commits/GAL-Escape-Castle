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

### [x] C6 Concurrency semantics review
Completed:
- traced row-lock serialization for Sprint2 discussion/vote transitions;
- verified migration-008 per-run trigger serialization for player-progress group gates;
- verified route ACK, meeting/fold-back, puzzle, ACT5 and post-inspection exactly-once mutation boundaries;
- confirmed existing B20 covers concurrent correct puzzle solve;
- retained IDA-004/009/010/011 as the material concurrency/retry defects;
- no additional production finding opened solely from C6.
Evidence: MUTATION_AUTHORITY_REGISTRY.md §C6.

**Method 2 COMPLETE.**

Output for C1–C6: MUTATION_AUTHORITY_REGISTRY.md + FINDINGS.md

---

## D — Method 3: Invariant Protection Matrix

### [x] D1 Build mandatory invariant matrix
Completed all 12 protocol-v1.1 invariants.
Evidence: INVARIANT_MATRIX.md.

### [x] D2 Identify server-side protection for each invariant
Recorded DB/trigger, RPC, transaction/lock, RLS and client layers for all 12 invariants.
### [x] D3 Identify tests for each invariant
Mapped relevant Sprint1/2/3A/3B live-test evidence; gaps explicitly retained.
### [x] D4 Record unprotected/NOT VERIFIED invariants
Invariant 10 is violated by existing IDA-003/005/008/009.
Invariant 11 is PARTIAL/NOT_VERIFIED because complete formal finalization/restart is outside current implementation.
No duplicate issue opened.

**Method 3 COMPLETE.**

Output: INVARIANT_MATRIX.md + FINDINGS.md

---

## [x] Integration Checkpoint I
Completed explicit read of:
- IMPLEMENTED_SYSTEM_MODEL.md
- MUTATION_AUTHORITY_REGISTRY.md
- INVARIANT_MATRIX.md
- FINDINGS.md

Reconciliation:
- restored missing Master-table rows IDA-005 and IDA-006; detailed sections already existed;
- 11 unique issues now tracked in sequence IDA-001…IDA-011;
- no finding pairs were merged: TOCTOU vs retry, stale-retarget vs duplicate retry, scene authorization vs discussion uniqueness, and cross-layer atomicity remain distinct failure classes;
- no severity changed at this checkpoint;
- IDA-007 remains OBSERVATION / NOT_VERIFIED pending GA canonical clarification;
- Invariant 11 remains PARTIAL / NOT_VERIFIED without current formal finalization/restart implementation.

Checkpoint evidence: all four Method 1–3 artifacts re-read after completion.

---

## E — Method 4: Final Database / RLS / RPC Audit

### [x] E1 Resolve effective final function definitions
Completed source-level effective replay of migrations 001–012, including all migration-011 renames and final migration-012 replacement.

### [x] E2 Resolve effective privileges
Completed source-level PUBLIC/anon/authenticated reconstruction. All twelve *_pre011 functions are explicitly revoked. Sprint3B default-PUBLIC hygiene is documented; deployed catalog ACL remains NOT VERIFIED.

### [x] E3 Audit RLS for every state/evidence table
All application state/evidence tables in 001–012 enable RLS; no CREATE POLICY exists in the included migrations. Representative live direct-access rejection tests exist.
### [x] E4 Audit constraints
Reviewed PK/FK/UNIQUE/CHECK/partial indexes/triggers and business-state protection. Existing gaps map to current findings; no new issue opened.
### [x] E5 Audit SECURITY DEFINER safety
All inspected definitions set search_path=public; no dynamic SQL found; cross-room/run authority helpers reviewed. public-schema CREATE privilege remains deployment-effective NOT VERIFIED.
### [x] E6 Audit duplicate truths
Defined authority for legacy vs formal scene, game_runs generic scene fields vs s3 runtime scene, discussion outcome vs Game Track result, historical vs operational route, silent mode and item labels.
### [x] E7 Clean-schema/deployment-effective verification
Evaluated available evidence. No catalog connection / isolated clean DB is available in this audit session, so deployment-effective pg_proc/pg_policies/schema ACL claims are explicitly NOT VERIFIED. Required future catalog queries are recorded.

**Method 4 COMPLETE (with deployment-effective ACL/catalog boundary NOT VERIFIED).**

Output: DB_RPC_RLS_AUDIT.md + FINDINGS.md

---

## F — Method 5: Cross-Layer Contract Audit

### [x] F1 Room creation/join trace
Completed UI→session RPC→server identity→localStorage→release/rejoin recovery trace.

### [x] F2 First behavior choice trace
Completed ACT1 opening→action→locked choice→consequence→reconnect trace; response-time evidence gap remains IDA-006.

### [x] F3 Discussion resolution → Game Track trace
Completed full UI→vote RPC→resolved outcome→second apply RPC→formal scene trace.
IDA-001 captures post-vote/pre-apply failure. Dynamic fault injection remains Method 8 work.

### [x] F4 Route update trace
Completed three-player persisted ACK barrier, response-loss/reconnect and concurrent ACK semantics.
### [x] F5 Puzzle trace
Completed UI locked-prefix→submit→timeout refresh→attempt/group-item/ACT4 trace. IDA-004 and IDA-011 retained.
### [x] F6 Later group-route trace
Completed ACT4 direct route, ACT5 discussion route and post-inspection route trace. IDA-001 and IDA-007 retained.
### [x] F7 Reconnect trace
Completed local session→Sprint1/2/3B layered refresh→formal state restoration trace. IDA-001/003 retained.
### [x] F8 Teacher observation/control trace
Completed Teacher observation/privacy and legacy/formal/generic control trace. IDA-005/002 capture unsafe canonical interaction control.

**Method 5 COMPLETE.**

Output: CROSS_LAYER_TRACES.md + FINDINGS.md

---

## G — Method 6: Test-Suite Blind-Spot / Mutation-Lite Audit

### [x] G1 Test inventory
Completed Sprint1/2/3A/3B static/live behavioral inventory and coverage classification.

### [x] G2 Test-to-invariant mapping
Mapped all mandatory invariants and current HIGH-risk findings to existing or missing test scenarios.

### [x] G3 Static-vs-behavior classification
Classified source-fragment assertions separately from live RPC behavior and browser/distributed failure semantics.

### [x] G4 Counterfactual mutation review
Answered mandatory run-id, phase, row-lock, duplicate, fallback, helper-revoke, reconnect and cross-layer atomicity counterfactuals.

### [x] G5 Selected actual mutation tests or explicit NOT VERIFIED
Actual mutation injection evaluated but NOT VERIFIED/not executed because no isolated mutable Supabase/PostgreSQL runtime is available. High-value future fault/mutation tests are specified.

**Method 6 COMPLETE (actual mutation execution boundary NOT VERIFIED).**

Output: TEST_BLIND_SPOTS.md + FINDINGS.md

---

## [x] Integration Checkpoint II
Completed explicit read of:
- DB_RPC_RLS_AUDIT.md
- CROSS_LAYER_TRACES.md
- TEST_BLIND_SPOTS.md
- FINDINGS.md

Reconciliation:
- source-level DB review, cross-layer traces and test blind-spot analysis are mutually consistent;
- no finding was duplicated or contradicted;
- no severity/status changed;
- database review strengthens IDA-002/004/008/009/010/011;
- cross-layer review strengthens IDA-001/003/005/006/007;
- test review explains why the current green regression suites do not invalidate these findings;
- deployment catalog ACL and actual mutation/fault injection remain explicit NOT_VERIFIED boundaries.

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

### [x] I1 Four failure windows
Documented before-request, during-mutation, post-commit/pre-response and post-response/pre-refresh behavior for all high-value mutation classes.

### [x] I2 Mandatory failure scenarios
Covered duplicate request, simultaneous final submissions, stale tab, disconnect/reconnect, response loss, Teacher/player race, uncertain retry and terminal transition race.

### [x] I3 Evidence classification
Separated existing LIVE-COVERED concurrency/replay tests from STATIC-PROVEN defects and dynamically unverified fault-injection cases.

### [x] I4 Dynamic injection boundary
No isolated mutable runtime is available, so packet loss, delayed-request and browser-kill injection are explicitly NOT VERIFIED DYNAMICALLY. Deterministic control-flow findings remain confirmed.

Output: FAILURE_MATRIX.md

**Method 8 COMPLETE (dynamic fault injection boundary explicitly NOT VERIFIED).**
---

## J — Method 9: Data-Forensics Audit

### [x] J1 Define representative controlled histories
Reconstructed ACT1, ACT2 discussion/route, fold-back, puzzle and ACT4/5 histories.

### [x] J2 Reconstruct player behavior evidence
Mapped choices, messages, votes/re-votes and timestamps; broadened IDA-006 for canonical latency evidence and retained IDA-009/010/011 forensic ambiguity.
### [x] J3 Reconstruct system/fallback evidence
Verified DiscussionRoom fallback, failed rendezvous and puzzle fallback attribution; puzzle fallback has strong system event evidence.
### [x] J4 Reconstruct run/provenance identity
Verified first-class run identity and Sprint3A provenance model; route/scene chronology gap confirmed as IDA-012.
### [x] J5 Record ambiguity or NOT VERIFIED
Recorded IDA-012 HIGH for missing append-only Sprint3B action/scene chronology; IDA-007 remains NOT_VERIFIED pending GA; future Teacher Override/final export validity remains outside frozen baseline.

**Method 9 COMPLETE.**

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
