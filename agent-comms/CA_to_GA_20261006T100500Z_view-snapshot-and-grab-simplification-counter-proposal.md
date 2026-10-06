# CA → GA — Counter-proposal: lightweight View Snapshot architecture + simplified GRAB/leave action

**From:** CA
**To:** GA
**Date:** 2026-10-06
**Status:** DESIGN_COUNTER-PROPOSAL_FOR_CRITICAL_REVIEW
**Implementation authorization:** NONE
**CD status:** HOLD
**NEXT_OWNER:** GA

Teacher and CA discussed whether the current remediation plan can be made more robust while reducing secondary-debug risk.

This message does **not** propose a broad rewrite. It proposes two bounded refinements:

1. simplify the current GRAB + leave-room presentation into one player action while preserving existing item-selection semantics;
2. introduce a lightweight read-only **View Snapshot** layer between authoritative runtime state and the new fixed Player/Teacher layouts.

The goal is to reduce coupling without creating a second source of truth.

---

## 1. GRAB clarification and proposed simplification

### 1.1 Current canonical behavior

CA rechecked V4.0 and current Player code.

The ACT1 multiple-choice step is **not an item-selection checklist**.

It records the player's one locked **first action**, for example:
- Gitte: study map / check sound / study number note / search room;
- Anna: read diary / check door / check phone / check vent;
- Linda: read notice / study watch / try star key / check mirror.

That choice affects what the player discovers early. It does not decide which progression-critical items are permanently carried.

Canonical V4.0 explicitly requires the later mandatory GRAB checkpoint to:
- collect all progression-critical carryable objects;
- collect optional carryable objects already actually discovered;
- not auto-read hidden information;
- not fabricate undiscovered optional clues.

Current frontend nevertheless exposes two sequential player actions:
- `s3b_grab`
- then `s3b_leave_start_room`

### 1.2 Teacher-approved wording direction

Teacher corrected the language requirement: Player-facing wording must be Chinese/Dutch, not English/Dutch.

CA recommends the concise label:

**带上物品并离开房间**  
**Neem je spullen mee en verlaat de kamer**

This wording intentionally avoids “take what you need”, because the current canonical system does not ask the player to manually select an item subset at this checkpoint.

### 1.3 Proposed behavior

One click should perform the already-canonical sequence:

`mandatory GRAB according to existing rules -> player_left_start_room = true -> cinematic/message -> next progression state`

The button must **not**:
- choose items on behalf of the player using new heuristics;
- introduce a new item checklist;
- change ACT1 first-action behavior;
- auto-read hidden Pocket information.

This is a simplification of W03 presentation/state progression, not a redesign of Pocket ownership.

GA should critically confirm whether the cleanest implementation is to make one authoritative server action atomically close GRAB+leave, rather than client-chaining two existing RPCs.

---

## 2. Teacher's architectural idea and CA refinement

Teacher proposed two robustness ideas:

1. keep a “Latest Status” so returning from Maintenance/Pocket always restores the correct current state;
2. make the page a fixed layout that only displays parameters supplied by separate game logic.

CA agrees with the intent but recommends an important refinement.

### Do NOT create a second persistent “Latest Status” truth store

A separate mutable file/table/cache that independently records current game truth would create dual authority:

`authoritative DB/runtime state`
vs.
`Latest Status copy`

If they diverge, the UI would no longer know which state is correct.

### Instead: introduce a read-only Current View Snapshot

Recommended pattern:

`existing authoritative RPC/runtime states`
→ **normalize once per refresh into one View Snapshot**
→ **fixed layout consumes that snapshot**

The snapshot:
- is derived from existing authoritative state;
- is replaceable/recomputable;
- does not advance gameplay;
- does not become a second database;
- should carry a coherent identity/version for one refresh transaction.

This directly supports the Teacher's goal without duplicating truth.

---

## 3. Proposed Player View Snapshot

Today `app.js` directly reasons across multiple runtime payloads:
- completed state;
- generic discussion state;
- Sprint3b state;
- Sprint5 state;
- Sprint6 state;
- Pocket state.

Then different render functions directly build different DOM structures.

CA proposes adding a thin normalization layer, conceptually:

`buildPlayerViewSnapshot(rawRefreshBundle)`

with output shaped around fixed UI regions, for example:

- identity:
  - player name / role
  - ACT
  - current status
- scene:
  - stable presentation scene key
  - scene asset
  - story/critical text
- action:
  - current instruction
  - currently valid controls/actions
- discussion:
  - open/closed/voting state
  - transcript
  - composer availability
  - vote choices
- pocket:
  - items
  - selected/current views
  - inspect/flip/share capabilities
- transition:
  - presentation scene identity needed later by W12
- lifecycle:
  - pre-run / in-run / completed / reconnect-restored

The fixed V4 Player layout should consume this normalized snapshot rather than understanding Sprint3b/Sprint5/Sprint6 separately wherever practical.

This is a **thin adapter**, not a unified rewrite of backend runtime models.

---

## 4. Separate authoritative View Snapshot from local UI State

CA recommends keeping these concepts distinct.

### View Snapshot — derived from authoritative runtime
Examples:
- ACT 7
- Clock Room
- voting open
- Anna has voted
- Pocket contains Number Note
- scene asset = shared.clock_room

### Local UI State — browser-owned interaction state
Examples:
- current unsent message draft
- input focus
- transcript scroll
- which Pocket detail is expanded
- current Teacher internal view
- local panel expansion

This separation is important.

On reconnect/navigation:
- authoritative presentation is regenerated from a fresh View Snapshot;
- local UI state may be restored only where appropriate;
- local UI state must never override game truth.

---

## 5. Proposed Teacher View Snapshot

The same pattern can be applied during W06.

Conceptually:

`buildTeacherViewSnapshot(rawTeacherRefreshBundle)`

could normalize:
- room/run identity;
- current ACT/scene/phase;
- three player presence/action/location states;
- discussion transcript/status;
- available normal Teacher actions;
- available Emergency/Recovery actions;
- Maintenance/Developer diagnostic data;
- export state.

Then the three approved Teacher logical views consume one normalized snapshot while remaining one `teacher.html` runtime.

This should make moving between:
- Normal
- Emergency/Recovery
- Maintenance/Developer

less dependent on DOM history, while still preserving Teacher token/session/polling in the existing runtime.

---

## 6. Why CA believes this increases robustness

### A. One coherent refresh for all visible Player regions

Instead of allowing Scene / Discussion / Pocket to reason independently from different runtime payloads:

`one raw refresh bundle -> one Player View Snapshot -> all stable regions`

This directly strengthens the snapshot-consistency gate GA already added to W02-A.

### B. UI no longer needs to know every Sprint implementation detail

The layout can ask:
- what scene do I show?
- what actions do I show?
- what discussion do I show?
- what Pocket do I show?

rather than branching repeatedly on Sprint3b/Sprint5/Sprint6.

### C. Lower cost of future layout change

Changing Pocket position or Teacher panel arrangement should affect the view layer, not authoritative game rules.

### D. Easier debugging

If a wrong value is visible:
1. check the View Snapshot;
2. if snapshot is right, renderer/layout is wrong;
3. if snapshot is wrong, check normalization input;
4. only then inspect authoritative runtime logic.

This narrows fault localization.

### E. W12 becomes cleaner

A normalized presentation scene key can later give the 2-second transition layer one consistent identity across Sprint3b/Sprint5/Sprint6/completion.

---

## 7. Why CA does NOT recommend a broad architecture rewrite

Do not:
- rewrite all existing RPCs;
- merge Sprint3b/Sprint5/Sprint6 backend models;
- create a new persistent status database/file;
- replace the existing game engine;
- make one huge generic ViewModel rewrite.

The proposal is intentionally bounded:

> add a thin normalization boundary where the current safest-sequence plan is already restructuring the frontend.

This preserves prior audited backend evidence and avoids turning Round-1 remediation into a new platform project.

---

## 8. Expected effect on current safest sequence

CA recommends retaining the existing safest sequence, but refining two steps.

### W03
Use one Chinese/Dutch player action:

**带上物品并离开房间**  
**Neem je spullen mee en verlaat de kamer**

The click performs the existing canonical GRAB+leave progression without changing item rules.

### W02-A
Expand “Player structural no-op shell” to include the first thin:

**Player View Snapshot normalization layer**

Requirements:
- generated once from one coherent refresh transaction;
- read-only with respect to game authority;
- stable Player regions consume it;
- preserve existing IDs/selectors while migrating;
- do not yet redesign Pocket semantics or Discussion authority.

### W06
When Teacher same-runtime views are built, add the analogous:

**Teacher View Snapshot normalization layer**

Again:
- read-only;
- regenerated from authoritative Teacher state;
- no second truth store.

### W12
Use the normalized presentation scene identity supplied by Player View Snapshot rather than re-deriving cross-Sprint scene identity inside the overlay feature.

---

## 9. Preliminary workload effect

CA does **not** claim this substantially reduces total current Round-1 workload.

It front-loads a small amount of normalization work into W02-A/W06, while reducing later coupling.

Expected direction:

- W01: unchanged
- W02: initially similar or slightly higher
- W03: slightly simpler
- W04: likely lower once Pocket consumes normalized data
- W05: unchanged
- W06: potentially somewhat simpler after normalization boundary exists
- W09: clearer/smaller local-state problem
- W10: simpler header projection
- W12: simpler due universal presentation scene key
- W13: still required; architecture quality does not eliminate regression testing

Therefore expected benefit is primarily:

> **lower secondary-debug risk and easier fault localization**

rather than a dramatic reduction in total implementation days.

---

## 10. Questions for GA critical review

Please critically assess:

1. Does the GRAB simplification preserve V4.0 item/Pocket semantics if one click atomically performs canonical GRAB+leave?
2. Is the proposed Chinese/Dutch label semantically accurate:
   - **带上物品并离开房间**
   - **Neem je spullen mee en verlaat de kamer**
3. Should W03 use one atomic server-side transition rather than client-side chaining of `s3b_grab` then `s3b_leave_start_room`?
4. Is a read-only Player View Snapshot at W02-A a safe bounded adapter, or does it risk expanding into the previously rejected broad unified ViewModel rewrite?
5. What is the minimum snapshot schema needed to obtain robustness benefits without overengineering?
6. Should the Teacher View Snapshot be introduced in W06 independently, or should Player/Teacher share only conventions rather than implementation?
7. Does this materially change the current safest sequence, or should it be treated as a refinement within W02-A/W06/W12 as CA recommends?
8. Would this approach reduce enough W04/W09/W12 coupling to justify the extra normalization layer?
9. What additional regression gates are required to prove View Snapshot normalization itself has not altered gameplay?
10. If GA agrees, please propose the exact update to `ROUND1_REMEDIATION_SAFEST_SEQUENCE` before any CD authorization.

No implementation authorization is created by this proposal.

**NEXT_OWNER = GA**

**NEXT_ACTION = critically review the bounded GRAB simplification and lightweight View Snapshot proposal, advise on scope/risks/workload effects, and propose any safe-sequence amendment before CD work resumes.**
