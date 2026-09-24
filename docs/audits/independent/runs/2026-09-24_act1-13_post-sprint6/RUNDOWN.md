# Independent Audit RUNDOWN — ACT1–13 post-Sprint6

Audit run: `2026-09-24_act1-13_post-sprint6`  
Baseline SHA: `2acfe324d05c8bea2fb96d7132ba29f894270b38`  
Protocol: `Independent_Development_Snapshot_Audit_Protocol_v1.3.md`  
Status: COMPLETE — FAIL / BLOCKED

## Execution rule

Before each step, use only that step block as procedural instruction; read the source/spec/evidence needed by that step; update named artifacts and FINDINGS immediately; mark complete only after its completion criteria are met.

---

## A — Setup

### [x] A1 Freeze baseline
Required/evidence:
- exact product SHA = `2acfe324d05c8bea2fb96d7132ba29f894270b38`;
- highest migration = 036;
- ACT1–13 included;
- Sprint7–10 / ACT14 finalization excluded;
- runtime/test/deployment boundaries recorded.
Output: `BASELINE.md`.
Completion: reproducible snapshot recorded.

### [x] A2 Tailor rundown
This rundown expands all mandatory Methods 1–9, three integration checkpoints, recurring-pattern review, conditional pre-approval gate and finalization for the completed ACT1–13 architecture.
Output: `RUNDOWN.md`.
Completion: remaining run can proceed from this checklist.

---

## B — Method 1: Code-First Reverse Audit

### [x] B1 State authority inventory
Inspect migrations 001–036 plus player/Teacher state readers. Map Room, Run, current scene, discussion, pocket/knowledge, routes, item view, ACT6–13 state, override, asset lifecycle and completion boundary. Identify duplicate truths/reconnect authorities.
Output: `IMPLEMENTED_SYSTEM_MODEL.md`.

### [x] B2 RPC call graph
Enumerate effective browser-callable player/Teacher/runtime RPCs and their helper/table/transition effects. Include Sprint1 legacy, generic DiscussionRoom, Sprint3B/3C, Asset Manager, Sprint5, Sprint6 and Teacher surfaces.
Output: `IMPLEMENTED_SYSTEM_MODEL.md`.

### [x] B3 Implemented ACT1–13 transition graph
For each implemented act/phase/step, record entry guard, mutation, resulting authoritative state and next accepted actions. Explicitly trace branch/fold-back and ACT13→ACT14 boundary.
Output: `IMPLEMENTED_SYSTEM_MODEL.md`.

### [x] B4 Reconnect model
Trace localStorage/sessionStorage vs server reconstruction for player, Teacher, discussions, evidence, vote/choice locks, assets, Sprint5/6 state and pending request identities.
Output: `IMPLEMENTED_SYSTEM_MODEL.md`.

### [x] B5 Canonical comparison
Compare derived model only after B1–B4 against V4.0 + Codex V2.4 + current localization/asset governance. Record divergence/missing authority in `FINDINGS.md`.
Output: `IMPLEMENTED_SYSTEM_MODEL.md` + `FINDINGS.md`.

---

## C — Method 2: State Mutation / Authority Audit

### [x] C1 External mutation inventory
Enumerate every browser-executable player/Teacher/asset mutation RPC in effective migration state.

### [x] C2 Internal/helper exposure inventory
Resolve wrappers, pre011/pre-hardening functions, SECURITY DEFINER helpers, audit-only surfaces and revoked historical endpoints.

### [x] C3 Authentication/authorization review
Verify token/session, room/run, player/Teacher role, NORMAL/AUDIT and asset-publisher authority boundaries.

### [x] C4 Phase/state guard review
Verify each mutation revalidates authoritative current act/phase/step/discussion/round/role/asset state server-side.

### [x] C5 Replay/stale review
Analyze duplicate IDs, response-loss replay, old discussion/round/step, post-terminal actions, stale tabs and derived client request identity.

### [x] C6 Concurrency semantics review
Analyze locks/serialization/idempotency for joins, votes, group resolution, puzzle, override, asset activation, Sprint5/6 transitions and terminal boundary.
Output: `MUTATION_AUTHORITY_REGISTRY.md` + `FINDINGS.md`.

---

## D — Method 3: Invariant Protection Matrix

### [x] D1 Build invariant matrix
At minimum evaluate the 12 protocol invariants plus project additions: SHARE PHOTO permission, physical item/knowledge separation, ACT14 non-finalization, canonical ownership boundary.

### [x] D2 Server-side protection
Record DB/RPC/lock/RLS protection for every invariant.

### [x] D3 Test protection
Map tests that would expose violation.

### [x] D4 Gaps / NOT VERIFIED
Any invariant without demonstrable server enforcement becomes finding or NOT VERIFIED.
Output: `INVARIANT_MATRIX.md` + `FINDINGS.md`.

---

## [x] Integration Checkpoint I
Read only `IMPLEMENTED_SYSTEM_MODEL.md`, `MUTATION_AUTHORITY_REGISTRY.md`, `INVARIANT_MATRIX.md`, `FINDINGS.md`; deduplicate, reconcile authority contradictions, adjust evidence/severity.

---

## E — Method 4: Final Database / RLS / RPC Audit

### [x] E1 Effective function definitions
Resolve final CREATE/REPLACE definitions across migrations 001–036, including overloads/wrappers.

### [x] E2 Effective privileges
Reconstruct source-level GRANT/REVOKE for PUBLIC/anon/authenticated/internal/audit/asset/Teacher functions; deployment catalog privilege claims separately marked.

### [x] E3 RLS
Enumerate all formal tables and effective RLS/direct-access policy.

### [x] E4 Constraints
Audit PK/FK/UNIQUE/CHECK/business invariants and evidence/history tables.

### [x] E5 SECURITY DEFINER
Check auth, search_path, qualification/dynamic SQL, room/run crossing, caller-supplied provenance.

### [x] E6 Duplicate truths
Identify concepts represented in multiple legacy/new tables and which authority actually drives mutation/reconnect.

### [x] E7 Clean-schema/deployment verification
Use available evidence; if production catalog/clean DB cannot be independently inspected, mark deployment-effective portions NOT VERIFIED.
Output: `DB_RPC_RLS_AUDIT.md` + `FINDINGS.md`.

---

## F — Method 5: Cross-Layer Contract Audit

### [x] F1 Room creation/join
Trace UI→RPC→DB→response→reconnect including double join/session recovery.

### [x] F2 First behavior choice
Trace ACT1 private first choice, one-time lock, timing/evidence and reveal boundary.

### [x] F3 Discussion resolution→Game Track
Trace at least ACT2 plus ACT6/7/9 repeat/tie variants and missing input.

### [x] F4 Route update
Trace ACT2/5/8 route authority, location/fold-back and evidence.

### [x] F5 Puzzle/soft-failure
Trace Library puzzle plus Clock/Great Hall failure and retry semantics.

### [x] F6 Later group/role resolution
Trace ACT10 key branch, ACT11 allocation, ACT12 role engagement/failure/pressure/cinematic.

### [x] F7 Reconnect
Trace representative early/mid/late phase reconnect and pending request identity.

### [x] F8 Teacher observation/control
Trace Teacher token/session, safe override, private visibility, intervention provenance and asset/diagnostic observation currently implemented.
Output: `CROSS_LAYER_TRACES.md` + `FINDINGS.md`.

---

## G — Method 6: Test-Suite Blind-Spot / Mutation-Lite Audit

### [x] G1 Test inventory
List all tests at baseline and classify static/live/browser/manual.

### [x] G2 Test-to-invariant mapping
Map setup/action/assertion to project invariants.

### [x] G3 Static-vs-behavior classification
Identify source-string assertions standing in for browser/runtime proof.

### [x] G4 Counterfactual mutation review
For high-value guards (run/phase/round/request/ownership/privacy/override/activation/finalization), identify whether an existing test necessarily fails if the guard disappears.

### [x] G5 Actual mutation tests / limitation
Use isolated execution only if available; otherwise state NOT VERIFIED and rely on deterministic source proof without pretending dynamic verification.
Output: `TEST_BLIND_SPOTS.md` + `FINDINGS.md`.

---

## [x] Integration Checkpoint II
Read only `DB_RPC_RLS_AUDIT.md`, `CROSS_LAYER_TRACES.md`, `TEST_BLIND_SPOTS.md`, `FINDINGS.md`; reconcile source/runtime claims, tests vs protections, status/severity.

---

## H — Method 7: Dead / Legacy Path Audit

### [x] H1 Enumerate legacy/replaced objects
Include Sprint1 prototype, generic Sprint2, Sprint3 wrappers/pre011, historical Teacher override endpoints, Sprint5/6 superseded RPCs, old asset lifecycle paths.

### [x] H2 Classify
ACTIVE / INTERNAL / TEST-ONLY / LEGACY-BUT-REQUIRED / DEAD / DANGEROUSLY-REACHABLE / UNKNOWN.

### [x] H3 Trace dangerous reachability
Any old path able to mutate current formal state, bypass current authority or influence reconnect becomes finding.
Output: `LEGACY_PATHS.md` + `FINDINGS.md`.

---

## I — Method 8: Failure / Concurrency Snapshot Audit

### [x] I1 High-value mutation failure list
Include join/session, message/vote, route, puzzle, share-photo/item view, override, asset activation/rollback, Sprint5 terminal votes, Sprint6 group/private/allocation/station/engage/advance.

### [x] I2 Pre-request failure
Client/local state before network call.

### [x] I3 During-mutation/races
Simultaneous/group/Teacher/player/asset-transition races.

### [x] I4 Post-commit/pre-response
Lost response, browser kill, retry identity and exactly-once evidence.

### [x] I5 Retry/reconnect
Convergence after stale/uncertain result and terminal transitions.
Output: `FAILURE_MATRIX.md` + `FINDINGS.md`.

---

## J — Method 9: Data-Forensics Audit

### [x] J1 Representative controlled histories
Define ACT1 choice, ACT2 discussion/vote, route/fold-back, puzzle, share/knowledge, ACT6/7, ACT8 route, ACT9 repeated vote/failure, ACT10 branch, ACT11 allocation, ACT12 pressure/auto-resolution/override.

### [x] J2 Player behavior evidence
Determine whether choices/messages/votes/latencies/roles can be reconstructed without mutable-state guessing.

### [x] J3 System/fallback evidence
Distinguish system fallback, group resolution, cinematic resolution, technical absence and Teacher override.

### [x] J4 Run/provenance identity
Verify run_id, scene/phase/step/session/round/actor/context provenance across event history.

### [x] J5 Ambiguity / NOT VERIFIED
Record irreconstructable chronology/provenance as finding or explicit boundary.
Output: `DATA_FORENSICS.md` + `FINDINGS.md`.

---

## [x] Consolidated recurring-pattern review
Apply current CA Rules V1.4 Patterns A–F plus Mandatory Canonical Ownership Check to the frozen baseline and all implementation intervals material to current authority.

---

## [x] Integration Checkpoint III
Read all nine method artifacts + `FINDINGS.md`; canonicalize issue IDs, deduplicate, finalize severity/status and NOT VERIFIED boundaries.

---

## P — Conditional Pre-Approval Gate

### [N/A] P0 Independence check
If PASS/READY, confirm forecast is risk-only and future Sprint7 audit remains code-first. If FAIL/BLOCKED, [N/A].

### [N/A] P1 Next-scope failure forecast
If PASS/READY, forecast 3–8 Sprint7 Teacher Console risks from current architecture/Patterns A–F without implementation prescription. If forecast reveals current defect, reopen audit.

### [N/A] P2 Risk-only CD handoff
If approving, include four-column risk-only forecast. If not approving, [N/A].

---

## K — Finalization

### [x] K1 Finalize Master Findings List
Exact protocol table schema.

### [x] K2 Verify detailed section per finding

### [x] K3 Produce EXECUTIVE_SUMMARY.md

### [x] K4 Verify all steps resolved

### [x] K5 Record completion in CA Action Log


---

## Final gate

`FAIL / BLOCKED`

Findings:
- IDA-001 HIGH CONFIRMED
- IDA-002 MEDIUM CONFIRMED
- IDA-003 HIGH NOT_VERIFIED
- IDA-004 HIGH CONFIRMED
- IDA-005 HIGH CONFIRMED

Completion log: `CA-086`.

Next governed audit after remediation: Level2 Targeted Independent Closure Audit.
