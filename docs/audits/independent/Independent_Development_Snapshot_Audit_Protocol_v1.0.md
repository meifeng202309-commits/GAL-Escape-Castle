# GAL Escape Castle — Independent Development Snapshot Audit Protocol v1.0

Project: GAL Escape Castle
Status: ACTIVE FOR THE CURRENT INDEPENDENT SNAPSHOT AUDIT
Version: 1.0

## 0. Baseline and independence

This protocol audits what is already implemented without claiming that the unfinished game as a whole is verified.

Mandatory baseline record:
- exact Git commit SHA;
- highest migration included;
- runtime entry files;
- test files;
- Supabase/deployment environment used for dynamic tests.

If development continues during the audit, later commits do not silently enter the same audit baseline.

Current independence model:
- this is an internal independent audit, not an uninformed external audit;
- the auditor may understand GAL objectives and canonical invariants;
- the auditor must re-derive the current implementation from code and final database state;
- historical CA PASS/FAIL reasoning is not the starting model.

## 1. Method One — Code-First Reverse Audit

### 1.1 Method

Derive the actual operational system from migrations, RPCs and runtime code before comparing it to V4.0/V2.3.

### 1.2 GAL audit points and objectives

Reconstruct:
- authority relationship among Sprint 1 room state, formal game_runs, DiscussionRoom, Sprint 3A state and Sprint 3B state;
- complete implemented ACT 1–5 transition path;
- reconnect source of truth;
- DiscussionRoom resolution → Sprint 3B progression boundary;
- legacy Sprint 1 Teacher controls while a formal run exists.

Objective:
Find implementation-created semantics, dual authorities and hidden sequencing assumptions.

### 1.3 Steps

Build:
- state-authority map;
- RPC call graph;
- ACT 1–5 transition graph;
- implementation-vs-canonical discrepancy table.

Do not treat disabled UI as server authority.

### 1.4 Completion

Every currently reachable state transition has an identified server-side writer and guard.

## 2. Method Two — State Mutation / Authority Audit

### 2.1 Method

Enumerate every externally reachable function capable of changing authoritative state.

For each ask:
1. who may call it;
2. how identity is verified;
3. what current state is re-read;
4. what it mutates;
5. how replay/stale calls are handled;
6. what happens under concurrency.

### 2.2 GAL audit points and objectives

Audit:
- all player RPCs;
- all Teacher RPCs;
- AUDIT-only functions;
- internal helpers and historical wrappers such as pre011 functions;
- stale ACT 1 / route / puzzle / ACT 4 / terminal calls;
- concurrency at all all-player gates and group resolutions.

Objective:
No browser-executable mutation may bypass server authority or an active-phase guard.

### 2.3 Steps

Create a mutation registry containing caller role, auth, required state, locks, writes, events, replay protection and concurrency protection.

Attack high-value mutations with duplicate, parallel, stale, cross-room and wrong-role requests.

### 2.4 Completion

Every state-mutating public function has explicit caller identity, phase guard, replay semantics and concurrency behavior.

## 3. Method Three — Invariant Protection Matrix

### 3.1 Method

For each hard invariant, identify the actual protection layer:
DB constraint / trigger / transaction lock / RPC predicate / RLS / client / test.

### 3.2 GAL audit points and objectives

At minimum:
- First Choice LOCK;
- missing input never synthesized;
- Room != Run;
- NORMAL != AUDIT;
- system fallback != player behavior;
- real evidence preserved;
- item ownership != knowledge;
- shared photo != ownership;
- group transition occurs once;
- old-phase writes rejected.

Objective:
Every hard invariant has server-side protection, not only UI protection.

### 3.3 Steps

Use an invariant matrix and ask:
- if the client check disappears, does the server still protect it?
- if two calls race, does it still hold?
- if an old tab replays, does it still hold?

### 3.4 Completion

Any invariant without demonstrable server-side protection is recorded as a finding or NOT VERIFIED.

## 4. Method Four — Final Database / RLS / RPC Audit

### 4.1 Method

Audit the effective PostgreSQL state after all migrations, not migrations in isolation.

### 4.2 GAL audit points and objectives

Reconstruct after migrations 001–012:
- final function definitions after CREATE OR REPLACE;
- final EXECUTE privileges for PUBLIC / anon / authenticated;
- RLS on all state/evidence tables;
- PK/FK/UNIQUE/CHECK protection;
- SECURITY DEFINER safety and authentication;
- duplicated truths across Sprint generations.

Objective:
Detect privilege drift, obsolete callable wrappers, weak DB invariants and ambiguous authorities.

### 4.3 Steps

Prefer a clean database:
1. apply 001–012;
2. inspect final schema/functions/privileges;
3. test direct REST reads/writes;
4. test cross-room/run identity attacks.

Static source-string tests are not sufficient evidence of effective final privileges.

### 4.4 Completion

Produce final schema map, RPC/privilege inventory, RLS matrix and duplicated-truth inventory.

## 5. Method Five — Cross-Layer Contract Audit

### 5.1 Method

Trace selected actions end-to-end:

    UI
    → JS
    → RPC
    → SQL
    → DB state/event
    → response
    → polling/reconnect
    → other player
    → Teacher

### 5.2 GAL audit points and objectives

Trace:
- room/join;
- ACT 1 first choice;
- DiscussionRoom final vote → Sprint 3B route application;
- route update ACK;
- Library puzzle;
- ACT 4/5 route resolution;
- reconnect;
- Teacher observation.

Specific risk questions:
- what if final vote commits but the client closes before s3b_apply_meeting_resolution or s3b_apply_act5_resolution?
- can sequential polling return mixed-generation snapshots?
- can overlapping refreshState calls render an older response after a newer response?
- can legacy scenes.js fallback hide an illegal scene id?
- what happens to a localStorage session after Teacher release?

### 5.3 Steps

For each journey record each layer's input assumption, output guarantee and failure behavior.

### 5.4 Completion

Every selected boundary has explicit failure semantics.

## 6. Method Six — Test-Suite Blind-Spot / Mutation-Lite Audit

### 6.1 Method

Ask not only whether tests pass, but which concrete defect each test would detect.

### 6.2 GAL audit points and objectives

Separate:
- static source-string checks;
- real behavioral assertions.

Map live tests to invariants.

Ask counterfactually:
- remove run_id guard — which test fails?
- remove a row lock — which test fails?
- expose an old helper — which test fails?
- allow duplicate choice/vote — which test fails?
- turn fallback into a player choice — which test fails?
- remove active-phase check — which test fails?

Objective:
Interpret PASS counts in terms of actual fault-detection power.

### 6.3 Steps

Create:
Test ID | invariant | mutation | assertion | defects caught | important defects missed.

Use an isolated branch/database for actual mutation tests.

### 6.4 Completion

Produce coverage-gap list and recommended new tests.

## 7. Method Seven — Dead / Legacy Path Audit

### 7.1 Method

Determine whether superseded implementation paths remain executable.

### 7.2 GAL audit points and objectives

Search for:
- pre011 wrappers;
- old overloads;
- old client RPC calls;
- Sprint 1 controls during Sprint 3B;
- placeholder scenes/content;
- obsolete state fields.

Classify each object:
ACTIVE / INTERNAL / TEST-ONLY / LEGACY-BUT-REQUIRED / DEAD / DANGEROUSLY-REACHABLE / UNKNOWN.

### 7.3 Steps

Compare:
- all functions executable in final DB;
- all functions referenced by current clients;
- functions referenced only by tests/legacy code.

### 7.4 Completion

Any DANGEROUSLY-REACHABLE legacy path becomes a finding.

## 8. Method Eight — Failure / Concurrency Snapshot Audit

### 8.1 Method

Challenge the current vertical slice under failure without waiting for ACT 6–14.

### 8.2 GAL audit points and objectives

Test:
- browser closes after server commit but before refresh;
- final voter disconnects immediately after resolution;
- reconnect during route-update barrier;
- stale player remains on old phase;
- Teacher action races with player action;
- duplicate Teacher command;
- lost HTTP response after successful server commit;
- reconnect after puzzle fallback stage;
- reconnect at terminal transition.

Objective:
Retries must not duplicate authoritative state, and reconnect must recover from server truth.

### 8.3 Steps

For each state change test:
- before request;
- during mutation;
- after commit / before response;
- after response / before next refresh.

### 8.4 Completion

Produce failure matrix with server state, retry behavior and reconnect result.

## 9. Method Nine — Data-Forensics Audit

### 9.1 Method

Ignore UI and reconstruct what happened from persisted data alone.

### 9.2 GAL audit points and objectives

Reconstruct:
- ACT 1 real choice and consequence;
- ACT 2 messages/vote rounds/fallback/final meeting result;
- failed rendezvous plus fold-back while preserving original group result;
- Library attempts, hint/fallback stages and resolution provenance;
- ACT 4 private stance;
- ACT 5 discussion and final route;
- which persistence generation is authoritative for future export.

Objective:
No behavior evidence should require guessing whether it came from player, system, Teacher or technical failure.

### 9.3 Steps

Run controlled scenarios, record ground truth externally, then reconstruct using database evidence only.

### 9.4 Completion

Representative ACT 1–5 histories can be reconstructed chronologically without inference gaps.

## 10. Required execution order

    0 Freeze baseline
    1 Reverse Audit
    2 State Mutation / Authority
    3 Invariant Matrix
    4 Final DB / RLS / RPC
    5 Cross-Layer
    6 Test Blind Spots
    7 Dead / Legacy Paths
    8 Failure / Concurrency
    9 Data Forensics

## 11. Finding severity

CRITICAL:
unauthorized mutation, cross-run corruption, fabricated/overwritten real evidence, security bypass, destructive data corruption.

HIGH:
reachable invalid state, duplicate resolution, stale write to later phase, system result recorded as player behavior, serious reconnect inconsistency, AUDIT path affects NORMAL evidence.

MEDIUM:
recoverable desync, important test gap, ambiguous provenance, risky but guarded legacy path.

LOW:
maintainability, diagnostics, unreachable dead code.

OBSERVATION:
not yet demonstrated as a defect but relevant to later Sprints.

## 12. Master finding format

Use:

Issue ID | Severity | Status | Problem description | Evidence/reproduction | Code files | Symbol/function + line range | Baseline SHA | Violated invariant/risk | Recommended fix | Audit method | Owner | Fix commit | Re-test result

Issue IDs:
IDA-001, IDA-002, ...

Status:
OPEN / CONFIRMED / FIX_IN_PROGRESS / READY_FOR_RETEST / FIXED_VERIFIED / NOT_REPRODUCIBLE / ACCEPTED_RISK / SUPERSEDED.

Line numbers alone are not stable. Always retain function/symbol and baseline SHA.

## 13. Resolution loop

    independent finding
    → record IDA-nnn
    → owner fixes or GA clarifies semantics
    → normal CA reviews gate-relevant fix
    → independent audit repeats original reproduction
    → relevant regressions
    → FIXED_VERIFIED

A code change alone does not close a finding.

## 14. Current audit boundary

Include:
- Sprint 1;
- Sprint 2;
- Sprint 3A;
- Sprint 3B;
- migrations 001–012;
- current player runtime;
- current Teacher Console;
- current static/live tests;
- current Supabase RPC/security surface.

Exclude from correctness claims:
- Sprint 3C implementation;
- ACT 6–14;
- Asset Manager V2 runtime;
- final export;
- release candidate.

## 15. Core question

> What can the code already do under abnormal, concurrent, stale, adversarial or partially failed conditions that the project team may not realize it can do?
