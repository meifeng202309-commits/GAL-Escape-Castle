# Round-1 Hybrid Read-Model Implementation Plan V1.0

**Date:** 2026-10-08  
**Owner:** GA  
**Status:** COMPLETE IMPLEMENTATION PROPOSAL — NO IMPLEMENTATION AUTHORIZATION  
**Depends on:**
- Authority Registry V0.3 freeze candidate
- CA-161 reconciliation
- CD-073 deployed evidence
- GA-091 independent senior-engineering review
- Round-1 remediation sequence V1.1

---

# 1. Decision

Use a **hybrid architecture**:

> **cross-domain UI reads → narrow server-side Read-Model Facade**  
> **domain mutations / business truth → direct refactor in the owning canonical module**

Do **not**:

- create a new persisted global state table;
- create a generic `global_phase` row that all domains dual-write;
- create a universal participant-progress table;
- create a background listener;
- build one central ACT1–14 business-logic Resolver;
- let the browser continue probing every Sprint and deciding which state wins.

The facade is an **anti-corruption/read-model boundary**, not a second game-state engine.

---

# 2. Exact target architecture

```text
CANONICAL DOMAIN OWNERS
────────────────────────────────────────────
S3B ACT1–5
S5  ACT6–8
S6  ACT9–14
Discussion
Pocket / Knowledge / Observation
Teacher Override
Finalization
Asset Manager
        │
        │  read-only
        ▼
CORE UI CONTEXT FACADE
────────────────────────────────────────────
run lifecycle
runtime owner
presentation identity
interaction identity
gate kind / gate status
validity / inconsistency
(optional W05 operational-location projection)
        │
        ├──────────────┐
        ▼              ▼
PLAYER WRAPPER      TEACHER WRAPPER
        │              │
        ▼              ▼
Player adapters     Teacher adapters
        │              │
        └────── UI ────┘
```

The facade owns **no gameplay facts**.

It only answers:

> “Which canonical subsystem owns the current UI context, and what coherent cross-domain context should this viewer render?”

---

# 3. Concrete server API shape

Names below are proposed implementation names and may be adjusted by CD, but the responsibilities are fixed.

## 3.1 Internal core

Proposed internal function:

`ui_resolve_core_context_v1(run_id)`

Not directly executable by browser roles.

It should be implemented as one bounded server-side read operation, preferably one SQL statement / CTE chain over canonical tables.

It returns only cross-domain coordination facts.

### Required core output

```text
schema_version

run:
  run_id
  lifecycle        PRE_RUN | ACTIVE | FINALIZED
  run_mode

runtime:
  owner            S3B | S5 | S6 | FINALIZED | NONE
  act_no

presentation:
  scene_id
  phase_key
  step_key

interaction:
  kind             DISCUSSION | VOTE | PRIVATE_CHOICE | ALLOCATION | TASK | NONE
  interaction_id
  round_no

gate:
  kind             ALL_PARTICIPANTS
                   ALL_PARTICIPANTS_ROUND
                   ROLE_SET_ALL
                   ANY_PARTICIPANT_GROUP_ACTION
                   TEACHER_CONTROLLED
                   SERVER_AUTOMATIC
                   NONE
  status           OPEN | COMPLETE | RESOLVED | UNKNOWN

validity:
  status           OK | UNKNOWN | INVARIANT_BREACH
  reason_code
```

W05 may add:

```text
operational_location
```

as a derived read-model fact.

## 3.2 Player wrapper

Proposed:

`ui_get_player_context_v1(room_code, session_token)`

Responsibilities:

- authenticate Player;
- resolve run;
- call core context;
- return only Player-safe core fields;
- include at most Player-self gate/progress information needed to render waiting state;
- never include other Players' private pre-reveal decisions;
- perform no mutations.

## 3.3 Teacher wrapper

Proposed:

`ui_get_teacher_context_v1(room_code, teacher_token)`

Responsibilities:

- authenticate Teacher;
- call core context;
- add Teacher-authorized participant progress / operational-location projection;
- expose explicit UNKNOWN rather than infer false NOT_COMPLETED;
- perform no mutations.

## 3.4 What V1 must NOT return

Do not put these into the first facade version:

- all raw S3B/S5/S6 fields;
- Pocket item contents;
- full Discussion transcript;
- action-specific business payloads;
- finalization report body;
- generic `can_xxx` action booleans invented by the facade;
- HTML/DOM fragments.

The facade identifies the active domain.  
The active domain still supplies its own detail state.

---

# 4. Concrete browser read flow

Current Player logic effectively does:

```text
poll
  → S8?
  → S2?
  → S3B?
  → S5?
  → S6?
  → wait state?
  → S8 again?
  → Pocket?
  → Discussion?
  → browser decides what wins
```

This must be replaced by **context-first dispatch**.

Target:

```text
poll
  → ui_get_player_context_v1
        │
        ├─ owner=S3B → fetch S3B detail only
        ├─ owner=S5  → fetch S5 detail only
        ├─ owner=S6  → fetch S6 detail only
        └─ FINALIZED → fetch S8 detail only

  → if active Discussion: fetch Discussion detail
  → if Pocket visible/needed: fetch Pocket detail
  → commit one coherent UI generation
```

Expected steady-state peak:

- 1 core context RPC;
- 1 active-domain RPC;
- 0–1 Discussion RPC;
- 0–1 Pocket RPC.

Target: typically **2–3 RPCs**, worst normal case approximately **4**, rather than probing all Sprint families every 1.2 seconds.

The exact number must be measured in the pilot.  
The facade must **replace**, not add to, current polling.

---

# 5. Responsibility split: what is new vs what is modified

## 5.1 New code

Only:

1. internal core read-model function;
2. Player read wrapper;
3. Teacher read wrapper;
4. frontend context dispatcher/adapter;
5. shadow-mode comparison harness;
6. tests for context consistency/security.

No new persistent tables.

## 5.2 Existing server code that must still be modified directly

These are **not Resolver work**:

### W03 GRAB + leave
Direct S3B mutation refactor:
- one idempotent Player action;
- canonical GRAB effects;
- left-start-room;
- exact events;
- group gate exactly once.

### W01 Discussion lifecycle
Direct Discussion/S5/S6 lifecycle refactor:
- Teacher-paced normal classroom flow;
- vote/open/close semantics;
- no inappropriate hard timeout lock.

### Legacy RPC quarantine
Direct security/runtime change:
- `s1_submit_private_choice`;
- `s1_scene_choices` path;
- revoke/quarantine after final scope approval.

### Knowledge / Observation normalization
Direct canonical data write/backfill:
- five legacy facts;
- preserve original timestamps/provenance.

### Asset current-authority cleanup
When scheduled:
- registry owns current metadata;
- candidate copies are version/import snapshots;
- remove mixed current reads, not by facade masking.

### Finalization/integrity
Direct finalization module responsibility:
- classify/fix current-contract defects if any;
- facade only renders VERIFIED / UNKNOWN / FAILED result.

---

# 6. Exact W01–W13 routing

| Work package | Implementation route |
|---|---|
| W05 Teacher operational location | **Read-Model Facade** |
| W03 GRAB+leave | **Direct canonical server refactor** |
| W01 Discussion lifecycle | **Direct canonical server refactor** |
| W02-A Player shell/context | **Facade + context-first dispatcher** |
| W10 Player header | **Facade** |
| W02-B Discussion renderer | **Discussion adapter using existing canonical Discussion state** |
| W09-A Discussion local state | **Client-local only** |
| W04 Pocket | **Pocket/Knowledge canonical APIs + renderer adapter** |
| W09-B Pocket local state | **Client-local only** |
| W08 Library lock | **Local S3B canonical module** |
| W06 Teacher recomposition | **Teacher facade + adapters** |
| W09-C Teacher local state | **Client-local only** |
| W11 wording/layout | **Local UI only** |
| I0 checkpoint | **Integrated regression** |
| W12 2-second transition | **Consumes facade presentation identity only** |
| W13 final regression | **Full cross-boundary regression** |

---

# 7. Revised implementation sequence

## Phase 0 — freeze inputs and close cheap evidence/security items

No UI work yet.

### 0A. Authority contract
- use Registry V0.3 as semantic contract;
- incorporate final CA reconciliation.

### 0B. Effective-privilege probe
Complete remaining small read-only privilege checks.

This is cheap and should not block shadow architecture work, but should be closed before affected browser surfaces are declared hardened.

### 0C. Three historical finalization rows
Classify the three completed runs with NULL/empty `integrity_verified`.

Do not mutate them merely to make a new read model look clean.

Output classification:
- LEGACY_PRE_CONTRACT;
- HISTORICAL_INCOMPLETE;
- or CURRENT_CONTRACT_DEFECT.

This is required before W13/finalized reconnect closure, not before W05 shadow.

---

## Phase 1 — W05/core-context shadow pilot

**No production UI cutover. No writes.**

Build only:

- core context;
- Teacher wrapper;
- minimal Player wrapper if needed for cross-check;
- shadow comparison harness.

Pilot facts:

1. lifecycle;
2. runtime owner;
3. presentation identity;
4. W05 operational location;
5. gate kind/status;
6. validity.

Test representative vectors:

- ACT1 early divergent;
- ACT3 library;
- ACT5→6 handoff;
- ACT6 shared phase;
- ACT7;
- ACT8;
- ACT9;
- ACT11/12 role/station;
- missing presentation row;
- stale/mismatched `game_runs` mirror;
- reconnect;
- FINALIZED.

### Phase-1 PASS

- zero semantic mismatch against independently specified expected outcomes;
- no browser-private leakage;
- no new persistent state;
- one bounded core DB read, not a sequence of server-side RPC replays;
- no fallback to ACTIVE `game_runs.scene/phase/step`;
- measured query/request cost is not worse than current baseline.

### Phase-1 STOP

Stop the facade architecture if it requires:

- persistent Resolver storage;
- dual writes;
- generic per-ACT business rules;
- action authorization duplication;
- `game_runs` fallback;
- client-side Teacher/private filtering;
- more total refresh work than the current path.

If STOP occurs:
return to targeted local refactors.

---

## Phase 2 — W05 first cutover

If Phase 1 passes:

Teacher operational-location/status region becomes the **first and only** production consumer.

Rules:

- facade becomes sole owner of that Teacher UI region;
- old operational-location derivation is disabled for that region;
- rollback switch restores old path;
- no other UI region changes.

Hard stop after W05 evidence.

---

## Phase 3 — W03 direct authoritative mutation refactor

Implement combined:

**带上物品并离开房间 / Neem mee wat je nodig hebt en verlaat de kamer**

as one idempotent server mutation.

This is deliberately outside the facade.

Required tests:
- normal;
- retry after lost response;
- double click;
- simultaneous final participants;
- reconnect;
- optional item;
- exact events.

---

## Phase 4 — W01 direct Discussion lifecycle refactor

Modify canonical Discussion behavior directly.

Do not encode Teacher-open-vote rules into the facade.

Facade only reports:
- current Discussion identity;
- current status;
- gate/interaction context.

---

## Phase 5 — legacy RPC quarantine

Before Player context cutover is considered hardened:

- quarantine/revoke `s1_submit_private_choice`;
- decide `s1_scene_choices` retirement separately;
- preserve historical migrations;
- add negative browser privilege test.

This is a small security package, not part of facade logic.

---

## Phase 6 — W02-A + W10 Player context-first cutover

Modify Player refresh orchestration.

Old behavior:
probe many Sprint states and choose in browser.

New behavior:

```text
context → active owner → active module detail
```

Keep existing module renderer behavior initially.

No visual redesign required in this phase beyond the structural shell/header.

Add:
- refresh generation;
- stale-response discard;
- UNKNOWN handling;
- transient transport failure handling.

After successful cutover, remove dormant multi-Sprint probing from the active refresh path.

Do not maintain both indefinitely.

---

## Phase 7 — W02-B + W09-A Discussion adapter

Discussion remains its own domain.

The shell uses the context interaction identity to mount the right Discussion adapter.

Preserve:
- draft;
- focus;
- scroll;
only when owner/session identity still matches.

---

## Phase 8 — Knowledge normalization + W04 Pocket + W09-B

Before Memories becomes first-class UI:

normalize the five legacy durable facts into canonical Knowledge/Observation with original timestamps.

Then migrate Pocket renderer.

Do not let facade synthesize missing Knowledge from legacy facts.

---

## Phase 9 — W08 Library lock

Implement inside the S3B/local puzzle domain.

No facade-specific puzzle rules.

---

## Phase 10 — W06 + W09-C Teacher recomposition

Teacher UI uses:

- Teacher core context;
- participant/gate projection;
- active domain diagnostics as needed.

Teacher wrapper may include more cross-domain status than Player wrapper, but not a giant raw DTO.

---

## Phase 11 — W11 wording/layout cleanup

Low-risk UI only.

---

## Phase 12 — I0 pre-transition checkpoint

Full integrated regression before transition behavior.

Freeze rollback SHA.

---

## Phase 13 — W12 transition overlay

Consumes only:

`presentation.scene_id`

plus committed context generation.

Never drives game progression.

---

## Phase 14 — W13 final integrated regression

Must include:

- ACT1→14;
- reconnect;
- all gate types;
- replay/idempotency;
- Discussion;
- Pocket;
- Teacher views;
- missing presentation row;
- stale/out-of-order poll;
- no `game_runs` fallback;
- privilege/quarantine tests;
- FINALIZED integrity classification;
- no duplicate renderer owners;
- request-count/performance measurement.

---

# 8. UI commit model

Each Player refresh:

```text
generation N
   ↓
fetch core context
   ↓
validate run / runtime / interaction identity
   ↓
fetch only required active-domain details
   ↓
validate details belong to same context
   ↓
if generation stale → discard
if critical context UNKNOWN → render safe unknown/wait state
else → commit one UI frame
```

Transport failure is not gameplay state.

Never convert fetch failure into:
- inactive;
- not completed;
- pre-run;
- old mirror fallback.

---

# 9. Security model

- Core internal helper: no browser execute grant.
- Player wrapper: Player token validation; Player-safe result only.
- Teacher wrapper: Teacher token validation.
- Action RPCs keep their own authorization and expected-identity checks.
- No facade result is sufficient authorization for a mutation.
- No Teacher/private data is delivered to Player and hidden client-side.

---

# 10. Performance target

The facade is justified only if it reduces cross-domain polling work.

Current formal Player refresh may reach roughly 8–9 RPCs in complex states.

Initial target after context-first dispatch:

- typical 2–3 RPCs per poll;
- approximately 4 in the heaviest normal UI case.

Do not hard-code this as a forever contract; measure actual database/query load.

Acceptance criterion:

> total refresh request/query cost must be measurably lower or at minimum not worse while semantic coherence improves.

If facade merely adds one more call on top of existing polling, the implementation has failed.

---

# 11. Rollback/cutover model

Use staged ownership.

### Shadow
facade result collected/tested; old UI owns rendering.

### Single-region pilot
W05 region uses facade; old derivation disabled only there.

### Player context cutover
context-first dispatch owns runtime selection; old multi-Sprint arbitration removed from active path.

### Teacher cutover
Teacher context owns cross-domain status.

At no stage should old and new logic both actively render the same UI region.

Rollback returns one region to the previous owner.

---

# 12. What this plan changes from the prior remediation plan

The old conceptual shape:

```text
global_phase
participant_progress
group_gate
→ View Snapshot
```

must **not** be implemented as new persistent universal truth.

Replace it with:

```text
existing domain-owned canonical states
→ read-only normalized context/gate projection
→ UI adapters
```

This is the central correction created by the 432-field Authority work.

---

# 13. Exact difference from a broad Resolver

This plan is **not**:

> "one Resolver computes the whole game state."

It is:

> "one small facade answers which domain owns the present UI context; the owning domain still provides its own state and mutations."

Therefore the facade should not grow ACT-specific business code.

A good implementation should be readable as:

- select current run;
- determine active domain;
- read current presentation/interaction/gate identities;
- validate invariants;
- return normalized context.

If implementation begins accumulating:
- ACT9 door rules;
- ACT10 Golden Key rules;
- ACT11 allocation rules;
- ACT12 station rules;
- ACT7 puzzle logic;

the boundary has been violated.

---

# 14. Definition of success

The Hybrid plan succeeds only if after W02/W06 cutover:

1. Player/Teacher no longer arbitrate across every Sprint locally.
2. There is no second persistent game state.
3. Each domain still owns its own writes/business semantics.
4. Cross-domain UI context has one normalized read boundary.
5. Missing/contradictory canonical state fails closed.
6. UI refresh request count and temporal skew are materially reduced.
7. old mirror fields cannot silently regain Authority.
8. one UI region has one active renderer owner.
9. rollback remains local and bounded.
10. W13 can test the full system without a second hidden state machine.

---

# 15. Implementation authorization boundary

This document is a complete GA implementation proposal.

It does not itself authorize:
- CD coding;
- database/schema changes;
- privilege changes;
- migrations;
- UI cutover.

CA/Teacher must still reconcile this plan with CD's independent engineering-cost review before any package is released.
