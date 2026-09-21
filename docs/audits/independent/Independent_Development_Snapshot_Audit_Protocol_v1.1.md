# GAL Escape Castle — Independent Development Snapshot Audit Protocol v1.1

Project: GAL Escape Castle  
Document type: Mandatory execution protocol for internal independent audits of incomplete development snapshots  
Status: ACTIVE  
Supersedes for future execution: Independent_Development_Snapshot_Audit_Protocol_v1.0.md  
Version: 1.1

---

# 0. Core execution rule

Every independent snapshot audit MUST follow this sequence:

1. Read this protocol once, in full.
2. Freeze the audit baseline.
3. Create a run-specific `RUNDOWN.md` from the canonical rundown template.
4. Expand the rundown into concrete steps tailored to the frozen baseline.
5. Before each execution step:
   - read only that step block in `RUNDOWN.md` as the procedural instruction;
   - do not re-read the whole protocol or whole rundown merely to remember what to do.
6. Execute every checklist item in the step.
7. Update the required audit artifact(s).
8. Mark the step complete only when its completion criteria are satisfied.
9. Repeat until every mandatory step is complete, explicitly N/A, or BLOCKED.
10. Run the required integration checkpoints.
11. Produce the final Master Findings List and Executive Summary.
12. Do not declare the audit complete while any mandatory rundown step remains unchecked without a documented BLOCKED/N/A reason.

The rundown is therefore the operational control surface for the audit.

---

# 1. Why the rundown is mandatory

Long audits fail in predictable ways:

- methods are started but not finished;
- outputs are described in the protocol but never created;
- findings are discovered but not entered in the Master Findings List;
- tests are run without recording what they prove;
- later methods repeat earlier work while other areas are skipped;
- the auditor rereads a large protocol repeatedly and wastes context/computation;
- scope drifts as the repository changes.

The run-specific rundown prevents this by converting the abstract protocol into a finite, auditable work queue.

---

# 2. Meaning of “read only the relevant rundown section”

Before a step, the auditor MUST read only the current step block of `RUNDOWN.md` for procedural guidance.

This restriction does NOT prohibit reading evidence required by the step.

During the step the auditor may and should read:

- frozen-baseline source files;
- canonical specifications required by that step;
- database definitions;
- tests;
- previously generated audit artifacts explicitly referenced by the current rundown step;
- deployment/runtime evidence required for verification.

The auditor SHOULD NOT reread unrelated rundown sections, unrelated historical CA reports, or unrelated prior audit discussion unless the current step explicitly requires them.

This rule is designed to reduce attentional drift, not to create artificial amnesia.

---

# 3. Mandatory audit outputs

Every audit run MUST contain the following files, even if some conclude N/A or NOT VERIFIED:

1. `BASELINE.md`
2. `RUNDOWN.md`
3. `IMPLEMENTED_SYSTEM_MODEL.md`
4. `MUTATION_AUTHORITY_REGISTRY.md`
5. `INVARIANT_MATRIX.md`
6. `DB_RPC_RLS_AUDIT.md`
7. `CROSS_LAYER_TRACES.md`
8. `TEST_BLIND_SPOTS.md`
9. `LEGACY_PATHS.md`
10. `FAILURE_MATRIX.md`
11. `DATA_FORENSICS.md`
12. `FINDINGS.md`
13. `EXECUTIVE_SUMMARY.md`

If a method cannot be executed, its artifact must still exist and state:
- why it is BLOCKED or N/A;
- what evidence was unavailable;
- what would be required to verify it later.

---

# 4. Mandatory finding format

`FINDINGS.md` MUST begin with a Master Findings List using this exact semantic schema:

| Issue ID | Severity | Status | Problem description | Evidence / reproduction | Code file(s) | Symbol / function / line range | Baseline SHA | Violated invariant / risk | Recommended fix | Audit method | Owner | Fix commit | Re-test result |
|---|---|---|---|---|---|---|---|---|---|---|---|---|

After the table, every issue MUST have a detailed section.

Rules:
- every newly confirmed issue is added to the Master table immediately;
- line numbers alone are insufficient;
- always include file + symbol/function + line range + baseline SHA;
- HIGH/CRITICAL findings require reproducible evidence or a deterministic control-flow proof;
- a finding is not closed merely because code changed;
- closure requires re-test against the original reproduction/acceptance condition.

Issue IDs:
`IDA-001`, `IDA-002`, ...

Allowed statuses:
- OPEN
- CONFIRMED
- FIX_IN_PROGRESS
- READY_FOR_RETEST
- FIXED_VERIFIED
- NOT_REPRODUCIBLE
- ACCEPTED_RISK
- SUPERSEDED
- NOT_VERIFIED

Severities:
- CRITICAL
- HIGH
- MEDIUM
- LOW
- OBSERVATION

---

# 5. Mandatory rundown status syntax

Each runnable step must use one of:

- `[ ]` NOT STARTED
- `[~]` IN PROGRESS
- `[x]` COMPLETE
- `[!]` BLOCKED
- `[N/A]` NOT APPLICABLE

A step may be marked `[x]` only after:
1. all its required checks were performed;
2. required artifact(s) were updated;
3. every finding discovered in the step was entered into `FINDINGS.md`;
4. evidence references are recorded;
5. the step completion criterion is satisfied.

---

# 6. Mandatory execution phases and methods

All methods below are mandatory to evaluate.  
A method may conclude N/A only with a written rationale in both `RUNDOWN.md` and its method artifact.

---

# Phase A — Audit setup

## A1. Freeze baseline

Required actions:
- record exact product commit SHA;
- record audit start UTC;
- record highest included migration;
- list runtime entry files;
- list tests in scope;
- record deployment/Supabase environment used for dynamic tests;
- define excluded future/incomplete features.

Output:
- `BASELINE.md`

Completion criterion:
- every finding can later be tied to one exact code snapshot.

## A2. Build run-specific rundown

Required actions:
- copy the canonical template;
- tailor every method to the frozen code;
- split large tasks into finite checkable steps;
- define per-step evidence and output requirements;
- define integration checkpoints;
- do not omit a mandatory method.

Output:
- `RUNDOWN.md`

Completion criterion:
- the entire audit can be executed from the rundown without rereading this protocol for ordinary step control.

---

# Phase B — Method 1: Code-First Reverse Audit

## Purpose

Reconstruct what the software actually does before judging whether it matches the intended model.

## Mandatory detailed checks

### B1. State authority inventory
Identify all state layers and for each:
- authoritative table/field;
- readers;
- writers;
- reconnect source;
- overlapping/duplicated state.

### B2. RPC call graph
For every public runtime RPC in scope:
- caller;
- downstream helper functions;
- tables mutated;
- transitions caused.

### B3. Implemented ACT/state transition graph
For all currently implemented gameplay:
- entry condition;
- server guard;
- mutation;
- resulting state;
- next accepted actions.

### B4. Reconnect model
For each current phase:
- what the client stores locally;
- what the server reconstructs;
- how stale tokens/state are treated.

### B5. Canonical comparison
Only after B1–B4:
- compare the derived model with current canonical specs;
- record implementation-created semantics;
- record canonical concepts lacking a clear implementation authority.

Output:
- `IMPLEMENTED_SYSTEM_MODEL.md`

Completion criterion:
- every reachable implemented transition has an identified server-side writer and guard.

---

# Phase C — Method 2: State Mutation / Authority Audit

## Purpose

Audit every path capable of changing authoritative state.

## Mandatory detailed checks

### C1. External mutation inventory
Enumerate all browser-executable player/Teacher RPCs.

### C2. Internal/helper exposure
Enumerate internal helpers, historical wrappers, overloads and audit functions.

### C3. Authentication/authorization
For every mutation:
- caller identity;
- token validation;
- room/run binding;
- role constraints;
- AUDIT/NORMAL constraints.

### C4. Phase/state guards
Confirm every mutation revalidates the authoritative current state server-side.

### C5. Replay/stale behavior
Test or prove behavior for:
- duplicate calls;
- old-phase calls;
- post-terminal calls;
- old browser/session calls.

### C6. Concurrency semantics
Identify lock/serialization/idempotency behavior for every group gate or exactly-once transition.

Output:
- `MUTATION_AUTHORITY_REGISTRY.md`

Completion criterion:
- every mutating public surface has documented auth, state guard, replay and concurrency semantics.

---

# Phase D — Method 3: Invariant Protection Matrix Audit

## Purpose

Determine what actually enforces the project's hard invariants.

## Mandatory invariants

At minimum audit:

1. First Choice LOCK
2. Missing player input is never synthesized
3. Room != Run
4. NORMAL != AUDIT
5. System/Teacher resolution != player behavior
6. Real pre-resolution evidence is preserved
7. Physical item ownership != knowledge
8. SHARE PHOTO != ownership transfer
9. One logical transition resolves once
10. Old-phase mutations are rejected
11. Formal reset/restart preserves prior run evidence
12. Private unrevealed behavior is not exposed to Teacher in NORMAL mode

For each invariant record protection at:
- DB constraint/trigger;
- RPC;
- transaction/lock;
- RLS;
- client;
- test.

Output:
- `INVARIANT_MATRIX.md`

Completion criterion:
- every invariant has a demonstrable server-side enforcement layer or a finding/NOT VERIFIED entry.

---

# Integration Checkpoint I

After Methods 1–3:

The auditor MUST explicitly read:
- `IMPLEMENTED_SYSTEM_MODEL.md`
- `MUTATION_AUTHORITY_REGISTRY.md`
- `INVARIANT_MATRIX.md`
- current `FINDINGS.md`

Tasks:
- deduplicate findings;
- identify contradictions among authority mappings;
- update severity if cross-method evidence strengthens or weakens a finding;
- add new cross-method findings.

Mark Integration Checkpoint I complete in `RUNDOWN.md`.

---

# Phase E — Method 4: Final Database / RLS / RPC Audit

## Purpose

Audit the effective database after all included migrations, not migration files in isolation.

## Mandatory detailed checks

### E1. Final function definitions
Resolve every repeated CREATE OR REPLACE function to its effective final definition.

### E2. Final privileges
For every function:
- PUBLIC;
- anon;
- authenticated;
- helper/internal;
- overloads.

### E3. RLS
Enumerate every table and verify intended direct read/write exposure.

### E4. Constraints
Audit PK/FK/UNIQUE/CHECK and business-state invariants.

### E5. SECURITY DEFINER
Inspect:
- authentication;
- search_path;
- object qualification;
- dynamic SQL;
- cross-room/run identity protection.

### E6. Duplicate truths
Identify state represented in multiple tables/fields and define authority.

### E7. Clean-schema verification
Where tooling permits:
- apply migrations to a clean database;
- inspect effective schema/privileges;
- otherwise mark deployment-effective privilege claims NOT VERIFIED.

Output:
- `DB_RPC_RLS_AUDIT.md`

Completion criterion:
- final schema, function and privilege state is explicitly reconstructed or clearly marked NOT VERIFIED.

---

# Phase F — Method 5: Cross-Layer Contract Audit

## Purpose

Trace actions across UI → JS → RPC → SQL → DB → response → polling/reconnect → other client/Teacher.

## Mandatory journeys

At minimum trace:
1. room creation/join;
2. first behavior choice;
3. discussion final vote → game-track progression;
4. route update;
5. puzzle attempt/timeout;
6. later route/group resolution;
7. reconnect;
8. Teacher observation/control.

For each layer record:
- input assumption;
- output guarantee;
- failure behavior;
- authority handoff.

Required failure questions:
- what if server commits but response is lost?
- what if the next RPC is never sent?
- what if a stale response arrives after a newer state?
- what if one layer succeeds and the next fails?

Output:
- `CROSS_LAYER_TRACES.md`

Completion criterion:
- every selected cross-layer boundary has defined success and failure semantics.

---

# Phase G — Method 6: Test-Suite Blind-Spot / Mutation-Lite Audit

## Purpose

Evaluate what the tests can actually detect.

## Mandatory detailed checks

### G1. Test inventory
List all in-scope static and live tests.

### G2. Test-to-invariant map
For each meaningful test:
- setup;
- mutation/action;
- assertion;
- invariant protected.

### G3. Static-vs-behavior distinction
Identify requirements verified only through source-string checks.

### G4. Counterfactual mutation review
For every high-value guard ask which test would fail if it were removed.

At minimum test reasoning for:
- run_id guard;
- phase guard;
- row lock;
- duplicate submit protection;
- fallback/player distinction;
- internal-helper privilege revoke;
- reconnect;
- cross-layer atomicity.

### G5. Actual mutation tests
Use an isolated branch/database for selected high-risk gaps when practical.

Output:
- `TEST_BLIND_SPOTS.md`

Completion criterion:
- every HIGH/CRITICAL invariant has at least one identified test or an explicit coverage-gap finding.

---

# Integration Checkpoint II

Read:
- `DB_RPC_RLS_AUDIT.md`
- `CROSS_LAYER_TRACES.md`
- `TEST_BLIND_SPOTS.md`
- current `FINDINGS.md`

Tasks:
- compare source-level proof with effective DB/runtime proof;
- distinguish confirmed defects from test gaps;
- promote/demote severity only with evidence;
- ensure every new issue is present in the Master Findings List.

---

# Phase H — Method 7: Dead / Legacy Path Audit

## Purpose

Find superseded implementation paths that remain executable or influential.

## Mandatory detailed checks

Enumerate and classify:
- old wrapper functions;
- old overloads;
- old client RPC calls;
- prototype controls;
- placeholder scenes/content;
- obsolete state fields;
- test-only functions.

Classification:
- ACTIVE
- INTERNAL
- TEST-ONLY
- LEGACY-BUT-REQUIRED
- DEAD
- DANGEROUSLY-REACHABLE
- UNKNOWN

Output:
- `LEGACY_PATHS.md`

Completion criterion:
- every legacy/replaced path is classified and any DANGEROUSLY-REACHABLE path becomes a finding.

---

# Phase I — Method 8: Failure / Concurrency Snapshot Audit

## Purpose

Challenge current implemented functionality under partial failures and races.

## Mandatory failure windows

For each high-value mutation consider:
1. before request;
2. during mutation;
3. after server commit but before response;
4. after response but before next client refresh.

Mandatory scenarios:
- duplicate request;
- simultaneous final submissions;
- stale tab;
- disconnect/reconnect;
- response loss;
- Teacher/player race where relevant;
- retry after uncertain result;
- terminal transition race.

Output:
- `FAILURE_MATRIX.md`

Completion criterion:
- every critical state-changing path has documented retry/reconnect/concurrency behavior or is marked NOT VERIFIED.

---

# Phase J — Method 9: Data-Forensics / Evidence Reconstruction Audit

## Purpose

Determine whether persisted data can reconstruct what actually happened without guessing.

## Mandatory histories

For each implemented behavioral segment reconstruct:
- player choice;
- messages;
- votes/revotes;
- system fallback;
- route/group decision;
- puzzle attempts/system fallback;
- provenance;
- missing data;
- run identity.

For each event determine whether it is attributable to:
- real player;
- system;
- Teacher;
- technical failure.

Output:
- `DATA_FORENSICS.md`

Completion criterion:
- representative implemented histories can be reconstructed chronologically from persisted evidence alone, or ambiguity becomes a finding.

---

# Integration Checkpoint III

Read all nine method artifacts plus current `FINDINGS.md`.

Tasks:
- remove duplicates without losing evidence;
- ensure every confirmed issue has one canonical ID;
- ensure every issue links to every audit method that found/supports it;
- identify unresolved contradictions;
- identify NOT VERIFIED boundaries;
- finalize severity.

---

# Phase K — Final reports

## K1. Finalize FINDINGS.md

Requirements:
- full Master Findings List at top;
- detailed section for every ID;
- status and evidence current;
- owner and recommended fix;
- re-test condition.

## K2. Produce EXECUTIVE_SUMMARY.md

Required format:

1. Audit identity
   - baseline SHA
   - audit type
   - included scope
   - excluded scope

2. Methods executed
   - all 9 methods
   - COMPLETE / BLOCKED / N/A status

3. Findings summary
   - count by severity
   - count by status

4. Highest-risk findings
   - short factual descriptions only

5. Systemic patterns
   - cross-layer, authority, DB, test, legacy, failure, evidence patterns

6. NOT VERIFIED boundaries

7. Development impact
   - whether any issue should block continuation;
   - whether fixes can be scheduled without invalidating current work.

8. Required next actions

Completion criterion:
- every rundown item is x, N/A or ! with explanation;
- Master Findings List and Executive Summary agree.

---

# 7. Computational discipline

The audit should minimize unnecessary context reload.

Rules:
- protocol is read once at startup;
- rundown is the operational checklist;
- before each step, read only that step block;
- read source/evidence only as needed for that step;
- do not repeatedly reread large specs if a precise canonical section is sufficient;
- integration checkpoints are the designated moments for cross-method synthesis;
- artifacts should capture durable conclusions so they do not have to be recomputed from chat history.

This structure is intended to improve both audit completeness and computational efficiency.
