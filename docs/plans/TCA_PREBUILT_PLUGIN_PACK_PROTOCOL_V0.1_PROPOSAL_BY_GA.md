# TCA Prebuilt Plug-in Pack Protocol V0.1 — GA Proposal

**Status:** REVISED PROPOSAL ONLY — CA REVIEW REQUESTED (P01 value failure incorporated)  
**Owner of proposal:** GA  
**Runtime authority:** NONE  
**CD state:** FROZEN at A1 checkpoint  
**Purpose:** prepare small, source-grounded, optional code Packs that future CD can integrate, adapt, or discard quickly without disturbing the current CD workstream.

---

## 1. Core rule

A TCA deliverable is not a loose snippet.

A **Plug-in Pack** must solve exactly one narrowly defined capability and may internally contain several ordered blocks.

The Pack is prepared outside the active CD runtime baseline. It becomes usable production code only after future CD integration and execution verification.

---

## 2. Non-negotiable boundaries

TCA must not:

- modify the active CD runtime branch directly;
- modify A1-owned production files during the current freeze;
- change schema, migrations, grants or deployed state;
- invent RPC/database contracts;
- create a second gameplay owner or state engine;
- redefine GA/CA/CD governance;
- claim tests passed unless they were actually executed;
- ask CD to coordinate while CD is frozen.

TCA may prepare isolated source/test/patch artifacts based on current repository evidence.

---

## 3. Pack structure

Recommended minimal structure:

```text
tca-packs/<PACK_ID>_<short-purpose>/
  PACK_MANIFEST.md
  implementation/
  tests/
  integration.patch
  INTEGRATE_OR_DISCARD.md
```

`integration.patch` is descriptive/prebuilt and is **not applied** to the active runtime branch during TCA preparation.

### PACK_MANIFEST.md must contain

- Pack ID;
- one-sentence purpose;
- related V4 package;
- exact target source SHA / stable source anchor;
- intended output files/functions;
- inputs/outputs;
- dependencies;
- allowed side effects;
- prohibited side effects;
- expected future insertion points;
- static checks available now;
- tests that exist or can be executed now;
- future CD execution checks;
- DISCARD conditions.

---

## 4. Status model

```text
DRAFT
→ TECHNICAL_INTEGRITY_PASS + PRODUCTION_VALUE_PASS
→ STATIC_READY
→ EXECUTION_VERIFIED
```

### DRAFT
TCA produced the Pack.

### STATIC_READY
CA must explicitly publish both TECHNICAL_INTEGRITY = PASS and PRODUCTION_VALUE = PASS. Source/unit correctness alone is not sufficient; a failed value gate remains DRAFT even when tests pass.

CA has independently verified:

- target source exists;
- target SHA/anchor is correct;
- declared interface is source-grounded;
- dependency and side-effect boundaries are accurate;
- no protected owner/schema/deployment mutation is hidden;
- code is syntactically/plausibly coherent at source level;
- any claimed executed test has real evidence.

STATIC_READY is **not production approval**.

### EXECUTION_VERIFIED
Future CD has integrated/adapted the Pack in an authorized package, executed the relevant tests, and CA has independently reviewed the result.

---

## 5. Integration rule for future CD

When CD reaches the related V4 package:

1. locate the Pack by V4 package/index;
2. compare current target source with the Pack's source SHA/anchor;
3. choose one:
   - **INTEGRATE**
   - **ADAPT**
   - **DISCARD**
4. do not rescue a stale Pack merely because it exists;
5. run normal CD implementation/test/fix/retest flow after integration.

TCA output is an optional accelerator, never a mandatory dependency.

---

## 6. Quick DISCARD rule

Discard the Pack if any of these is true:

- target source/interface drift is nontrivial;
- effective API differs from the Pack contract;
- integration requires undeclared schema/protected-owner changes;
- focused tests fail outside the Pack's declared surface;
- a newer implementation already solves the same capability;
- understanding/adapting the Pack costs approximately as much as rewriting the bounded unit.

Success is not "zero CD work".

Success means:

> CD can decide quickly whether to use the Pack, and successful use saves more coding/debug effort than Pack-consumption overhead.

---

## 7. Index rule

Use one repository index, not one handoff letter per block.

Suggested index columns:

```text
Pack ID
V4 package
Purpose
Status
Target source SHA
CA review
Future CD decision
```

CA/GA communicate at Pack level. Internal blocks do not create separate inter-agent handoffs.

---

# 8. Initial candidate Packs

## P01 — Library Five-Slot Input Model

**Recommended first pilot**

### Purpose
Provide one pure, testable model for the ACT3 Library five-wheel/five-slot code input, including existing locked-prefix behavior, without touching RPC or puzzle authority.

### V4 owner
F5 / F9 Library five-slot affordance.

### Source evidence

Current `src/game/app.js` SHA:

`c6d049dececb16af386418253d5dc55103f935a0`

Current source already exposes:

- `state.flow.puzzle_locked_prefix`;
- total code length = 5;
- final code is locked prefix + current Player-entered digits;
- submission RPC remains `s3b_submit_library_code`.

### Intended output

A new isolated pure helper, for example:

```text
implementation/library-code-model.js
tests/library-code-model.test.mjs
integration.patch
```

Proposed semantic interface:

```text
buildLibraryCodeModel(lockedPrefix, enteredSlots)
→ {
    lockedPrefix,
    remainingSlotCount,
    slots,
    isComplete,
    code
  }
```

The helper must not call RPC, mutate DOM, determine correctness, increment attempts, or own cooldown.

### Dependencies / side effects

Dependencies: none beyond plain JavaScript.

Side effects: none.

### Static/test feasibility now

High. Pure deterministic tests can cover:

- no prefix;
- partial prefix;
- complete prefix;
- non-digit rejection/normalization;
- incomplete slots;
- exact 5-digit composition;
- no mutation of inputs.

### Easy discard

Discard if:

- puzzle stops using 5 total digits;
- locked-prefix contract disappears;
- production UI no longer needs a slot model;
- future CD can implement the equivalent in fewer lines than adapting the Pack.

### Net value

**Moderate coding savings, very high pilot value.**

This is the preferred first workflow pilot because interface risk is low and it does not touch the current A1 runtime path during preparation.

---

## P02 — Player Local UI State Preservation Helper

### Purpose
Preserve purely local Player UI state across authoritative polling renders without making local state authoritative for gameplay.

Target local state:

- Discussion draft;
- keyboard focus;
- transcript scroll;
- Pocket selected tab/item;
- expanded item/view where locally appropriate.

### V4 owner
W09 / F9 shell acceptance.

### Source evidence

V4 explicitly requires polling not to erase draft/focus/scroll/Pocket local state.

The approved Player prototype SHA is:

`58233d4fa947bf184eb21faf8689edb7d0b45365`

The current Player runtime source SHA is:

`c6d049dececb16af386418253d5dc55103f935a0`

### Intended output

A standalone helper module with descriptor-based capture/restore, e.g.:

```text
captureLocalUiState(descriptors, root)
restoreLocalUiState(snapshot, descriptors, root)
```

Pack should avoid hard-coding gameplay state or RPC names.

### Dependencies / side effects

May read/write only browser DOM-local properties such as:

- value;
- selection/focus;
- scrollTop;
- selected local tab/expanded-item identifier.

Must not:

- persist gameplay decisions;
- submit RPC;
- fabricate server state;
- restore an action that server says is no longer legal.

### Static/test feasibility now

Medium-high.

Can be tested with a minimal DOM/browser fixture independent of live DB.

### Easy discard

Discard if:

- Phase-4 shell implementation uses stable mounts that already preserve all required local state;
- descriptors no longer match production DOM;
- integration requires changing A1 polling semantics rather than only capture/restore around renderer commits.

### Net value

**Potentially high future CD savings**, but more DOM-sensitive than P01.

Recommended second pilot, not first.

---

## P03 — Teacher Internal View Navigation Helper

### Purpose
Support the approved Teacher Console / Emergency-Recovery / Maintenance-Developer internal-view navigation while keeping one Teacher runtime/session.

### V4 owner
F9 Teacher shell.

### Frozen visual targets

- `Teacher_Console.html` SHA `58d8fc6a26881a1661c97834306a919b422b893e`
- `Teacher_Emergency_Recovery.html` SHA `d10e80a27664f982d8c3066e1519a697bea83d37`
- `Teacher_Maintenance_Developer.html` SHA `f6d3f9dfda21e86f4b174694ae3a6ac01ff78c0e`

Current `src/teacher/teacher-console.js` SHA:

`b276e049ba98718b62f7b81f48657211a02ca37e`

### Intended output

A small standalone view-navigation helper that:

- changes only internal Teacher view identity;
- preserves room code / Teacher token inputs;
- exposes back-to-Live-Operations navigation;
- does not recreate polling or event listeners;
- does not define recovery/backend semantics.

### Dependencies / side effects

DOM/navigation only.

No RPC ownership, no Teacher action semantics, no reset/override implementation.

### Static/test feasibility now

Medium.

Prototype navigation hierarchy is stable, but final production DOM IDs may still change during Phase 4.

### Easy discard

Discard if future Teacher shell implements the same internal view routing more simply as part of one stable renderer.

### Net value

**Moderate**. Useful, but should follow P01/P02.

---

## P04 — B-min / W05 Operational Status View-Model Mapper

### Purpose
Convert the future domain-published Teacher operational-state payload into a small display model for Player cards and current-operation labels.

### V4 owner
B-min / W05.

### Current evidence

Current `s7_get_teacher_console` exists in migrations 043/044, and `teacher-console.js` currently consumes fields such as:

- `current.act_no`;
- `current.scene_id`;
- `current.phase_key`;
- `players[].online`;
- `players[].submitted`;
- `players[].player_location`;
- `players[].locked_choice_state`.

However, current S7 still contains legacy/source-selection logic that V4 intends to narrow.

### Readiness

> **NOT READY FOR TCA CODING YET**

GA can define semantic display goals, but should not freeze a code interface before CA/CD establishes the effective B-min output contract.

### Static/test feasibility

Deferred until B-min release packet fixes the exact payload.

### Easy discard

If B-min changes the output shape or makes the mapping trivial, discard the candidate.

### Net value

Potentially high, but **interface stability is insufficient for first pilot**.

---

## P05 — Shared Result Presentation Pure View Helper

### Purpose
Turn a server-owned result occurrence into a purely presentational state:

```text
hidden | visible | expired
```

and expose whether next-round controls should be visually unavailable during the active result window.

### V4 owner
D2 / E2.

### Readiness

> **DEFERRED / NOT FIRST PILOT**

The semantic contract is now clear, but effective server occurrence shape and ACT7 guard implementation have not yet been frozen in an authorized package.

### Allowed scope

Pure presentation only.

No vote acceptance, no cooldown authority, no result classification.

### Easy discard

Discard if D/E implementation can express this in an existing renderer with negligible code.

### Net value

Moderate, but too close to still-evolving server contract for initial TCA validation.

---

# 9. Recommended pilot sequence

```text
Pilot 1: P01 Library Five-Slot Input Model
→ CA STATIC_READY review
→ evaluate Pack clarity/discardability

Pilot 2: P02 Player Local UI State Preservation
→ test a more integration-sensitive but still non-authoritative helper

Pilot 3: P03 Teacher Internal View Navigation
→ test a multi-view UI helper against frozen prototypes
```

Do not start P04/P05 until their effective contracts are frozen by the normal V4 package process.

---

# 10. Minimum CA STATIC_READY gate

For a Pack to become STATIC_READY, CA should verify only:

1. target/source SHA exists;
2. manifest purpose matches one V4 package;
3. interface is grounded in current source/spec;
4. side effects stay within declared boundary;
5. no protected DB/gameplay owner is touched;
6. code has no obvious syntax/import/interface contradiction;
7. available pure/static tests are real and, if claimed executed, have evidence;
8. discard conditions are actionable;
9. future integration patch is optional and not applied.

Avoid creating a new CI/governance layer.

---

# 11. Proposed decision

GA recommends adopting the TCA workflow only as a **three-Pack pilot**.

Success criteria after future CD integration trial:

- CD finds the Pack in under a few minutes;
- source drift is obvious;
- integrate/adapt/discard decision is quick;
- successful Pack saves measurable coding/debug effort;
- failed Pack is discarded cheaply.

If those conditions are not demonstrated, do not scale the workflow.

---

# 12. Proposed amendment after CA P01 audit (2026-10-10)

**Authority:** proposal for CA critical review, not ACTIVE governance or TCA coding authorization. The earlier P01 recommendation in §8–11 is superseded by this section wherever inconsistent.

## 12.1 P01 disposition and next coding candidate

P01: package mechanics PASS; CA independently executed 7/7 pure unit tests PASS; actual browser/runtime integration NOT VERIFIED; PRODUCTION_VALUE FAIL; STATIC_READY DENIED. Retain as `DRAFT_RETAINED_FOR_PILOT_LEARNING`, without runtime integration. Its `slots` output has no actual consumer in the proposed patch, and the existing one-input flow already composes the locked prefix and suffix. Candidate P02/P03 and all other Packs remain unauthorized. **GA defers further TCA coding** until an independently source-grounded candidate demonstrates actual unmet capability and favorable expected integration economics. No invented replacement candidate.

## 12.2 Three-stage screening and ownership

**GA / Pass 1 (task selection before assignment):** establish approved unmet user-visible/testable capability, actual consumer, necessity, likely existing implementation (source anchors), expected net CD effort saved, rough complexity, stable bounded interfaces and owner exposure. Classify `S` (stable, small, independently testable), `R` (needs source/interface narrowing or deferral), `X` (cross-owner state machine/schema/deployment/fundamental unstable API; not suitable). GA does not certify effective SQL/RPC authority from assumptions. Only an S candidate with specific evidence can be sent to CA for independent pre-assignment scrutiny.

**TCA / Pass 2 (before coding and on material contradiction):** inspect exact pinned target, callers, relevant existing helpers/modules and tests, not the entire repository. Assess already-present functionality, direct reuse versus adapted copies, real consumer, source drift, state/RPC/network/storage/timer authority, footprint, actual savings, testability and negative cases. Record reuse lineage in the existing Pack manifest; do not create a new report. Material existing functionality, unconsumed main output, undefined/changed contract, unapproved semantics, cross-owner writes or negative economics → STOP and report to GA/CA, without new code or self-expansion. Otherwise proceed within the specifically approved isolated task without repeated approval messages.

**CA / Pass 3 (independent audit):** verify real source reuse claims, callers and diff; distinguish direct calls from copied/modified code; assess errors/edge cases, pinned interface, protected authorities, actual test evidence and independent integration/discard; apply the production-value gate separately from correctness. Publish `TECHNICAL_INTEGRITY` and `PRODUCTION_VALUE` verdicts; both must PASS for STATIC_READY. CA identifies requirements and risks while retaining independent audit perspective, not a recipe of implementation details.

## 12.3 Existing Code Reuse & Lineage (required Pack-manifest section)

Record baseline SHA and scoped searched paths/symbols; for every *actually reused* function: exact module path + symbol, direct call/extension/adapted copy designation, new call site, material existing callers, expected contract and side effects, and upstream-change impact. List similar functions *considered but not reused* separately. Where no code is reused, describe the inspected scope and why reuse was unsuitable. Record expected new shipped modules, exported functions/imports/dependencies, net production bytes/LOC, changed consumers and deletion/replacement diff. Never imply that a planned future consumer exists today.

## 12.4 Proportional production-value and size gates

Value PASS requires source-backed evidence of at least one: (a) net-new approved capability **actually consumed** in proposed integration, (b) meaningful existing complexity/duplication removed, or (c) a realistic second consumer resulting in lower total complexity. No value proof → HOLD/REJECT even when unit tests pass.

Hard STOP: unapproved protected/schema/RPC/lifecycle owner or side effect; substantive unintended runtime behavior change; materially equivalent existing functionality without gain; unused primary output; independently undiscardable patch; unsupported test claim; or a purported one-purpose Pack hiding independent capabilities.

Soft REVIEW (requires short explanation, not an automatic cap): >1 added production module for a small Pack; >3 exports or new transitive dependency; added production LOC approximately >2× removed without a new capability; >5 KB added unminified production JS for a small UI helper; >2 unrelated production call sites. Count shipped JS separately from tests/fixtures. Legitimate complex reusable modules, safety invariants, and test-only support can justify exceeding these prompts. Consider total lifecycle maintenance and future upstream drift, not LOC alone. Multiple internal blocks are permissible for one coherent capability but do not imply separate permanent runtime modules.

Minimum footprint line in manifest: `new production files | added/removed shipped LOC and bytes | exports/imports/deps | affected call sites | existing equivalent | actual consumer | integrate/discard estimate`.

## 12.5 Closure / handoff

GA submits this revised proposal to CA for an independent accept/reject decision. Neither this revision nor the CA P01 audit releases TCA/P02/P03 or CD. New task selection resumes only on verified need and source stability; future CD, when legitimately resumed, may integrate/adapt/discard optional Pack artifacts, subject to normal execution and CA audits.
