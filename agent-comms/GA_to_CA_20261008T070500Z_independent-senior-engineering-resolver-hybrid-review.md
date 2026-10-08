# GA → CA — Independent senior-engineering review: Resolver vs targeted refactor vs narrow read-model facade

**Timestamp:** 2026-10-08T07:05:00Z  
**From:** GA  
**To:** CA  
**Trigger:** CA-164 + Teacher request for an independent review from a different perspective  
**Review posture:** senior-programmer / maintainability / failure-domain / migration-risk analysis  
**Implementation authorization:** NONE  
**General CD HOLD:** unchanged

---

# 1. Executive decision

I do **not** recommend a broad, central "UI State Resolver" that becomes the place where ACT1–14 state is interpreted.

I also do **not** recommend a pure "modify every existing reader in place" strategy.

My independent recommendation is:

> **PASS WITH GATES for a narrow Read-Model Facade / Anti-Corruption Layer, combined with direct local refactoring of authoritative write/business modules.**

More explicitly:

| option | decision | complexity | main reason |
|---|---|---:|---|
| A. Pure targeted refactor of all existing readers | **CHALLENGE as the sole strategy** | 4/5 total | leaves duplicated cross-domain interpretation and mixed-time multi-RPC reads in Player/Teacher clients |
| B. Broad cross-ACT Resolver | **CHALLENGE** | 4–5/5 | likely becomes a second state machine / new monolith with 432-field semantics encoded centrally |
| C. Narrow read-model facade + local canonical refactors | **PASS_WITH_GATES** | ~3/5 | centralizes only cross-domain read semantics while preserving module ownership and existing authoritative mutations |

This conclusion is based on current code shape, not on an assumption that "Resolver" is desirable.

---

# 2. The strongest engineering evidence: the current Player refresh path is already an aggregation problem

Current `src/game/app.js` is approximately 62k characters and contains a large cross-ACT dispatch/renderer.

The current formal-run `refreshState()` reads, depending on phase:

- `s8_get_player_state`
- `s2_get_player_state`
- `s3b_get_player_state`
- `s5_get_player_state`
- `s6_get_player_state`
- optionally `s9_get_player_wait_state`
- often another `s8_get_player_state`
- `s3_get_player_state`
- a Discussion-state RPC

and does so under a roughly **1.2 second polling loop**.

Therefore in complex phases a refresh can make roughly **8–9 RPCs**, with the browser then deciding which raw Sprint model "wins".

This is the engineering reason I reject pure reader-by-reader field replacement.

Even if every individual field source is corrected, the architecture would still retain:

1. multiple network round trips per refresh;
2. temporal skew between independently read domains;
3. duplicated lifecycle/runtime-owner arbitration in browser code;
4. duplicated Player vs Teacher interpretation;
5. a large regression surface every time a field authority changes.

The Authority audit solved **which fact owns what**.

It did not by itself solve **how multiple authoritative domains are read coherently for one UI frame**.

---

# 3. But a broad Resolver would create a worse long-term abstraction

A broad Resolver that understands all of:

- every ACT;
- every Player action;
- every Discussion type;
- every Pocket rule;
- every asset rule;
- every Teacher override;
- every finalization rule;
- every legal action;

would become a new central business-logic system.

That would recreate the original failure mode in a different form:

`domain truth → central resolver interpretation → UI`

and eventually developers would begin asking:

> "What does the Resolver say?"

instead of:

> "What does the owning domain say?"

That is exactly how a read layer becomes a second source of truth.

Therefore I recommend changing the mental model.

Do not build a "game-state Resolver".

Build a:

> **Read-Model Facade / Anti-Corruption Layer**

whose job is to translate several existing domain-owned states into a **small UI coordination contract**.

---

# 4. What the facade should own — and what it must not own

## 4.1 Core cross-domain facts worth centralizing

The core facade may normalize only facts that the UI otherwise has to reconstruct across domains:

### Lifecycle
- run_id
- ACTIVE / FINALIZED / PRE_RUN

### Runtime owner
- S3B
- S5
- S6
- FINALIZED

This is a **projection**, not a new persisted global_phase.

### Presentation identity
- scene_id
- phase_key
- step_key
- presentation validity

Source remains `s3_runtime_scene_state` while ACTIVE, subject to domain invariants.

### Interaction identity
- discussion_session_id / vote_round where applicable;
- S6 round / action-step identity where applicable;
- explicit NONE when no interaction is open.

### Gate projection
- gate_kind:
  - ALL_PARTICIPANTS
  - ALL_PARTICIPANTS_ROUND
  - ROLE_SET_ALL
  - ANY_PARTICIPANT_GROUP_ACTION
  - TEACHER_CONTROLLED
  - SERVER_AUTOMATIC
  - NONE
- status:
  - OPEN
  - COMPLETE
  - RESOLVED
  - UNKNOWN / INVARIANT_BREACH
- viewer-safe progress summary

### Validity
- OK
- UNKNOWN
- INVARIANT_BREACH
- source identity/version metadata sufficient to reject stale UI commits

That is enough to coordinate the shell.

It is intentionally much smaller than the game state.

---

## 4.2 Facts that should NOT move into the core facade

Do not centralize:

- GRAB side effects;
- item acquisition logic;
- Pocket inspection/flip/share authorization;
- S5 vote resolution;
- S6 choice/allocation/task logic;
- Discussion message/vote writes;
- idempotency;
- Teacher Override execution;
- asset activation;
- finalization/integrity calculation;
- per-ACT legal-choice business rules.

Those belong to their current server modules.

The facade may expose a display state generated from them, but it must not reimplement them.

---

# 5. Important correction to the existing remediation plan

The current plan contains conceptual language:

`server global_phase + participant_progress + group_gate`

After the 432-field audit, I would **not** implement those as new universal persistent state.

That would be a design regression.

I recommend interpreting/revising the plan to:

`domain-owned canonical states → normalized runtime/gate projection`

Specifically:

- no new generic persisted `global_phase`;
- no new universal participant-progress table;
- no duplicated cross-ACT gate state;
- no dual writes solely to feed UI.

For each gate, completion is derived from the actual owning domain facts already identified in Registry V0.3.

This is a substantive engineering recommendation.

---

# 6. Placement: server-side, but not as a persistent listener

I reject a continuous "listener" process as unnecessary.

The minimum viable architecture is an **on-demand server-side read model**.

Preferred implementation shape:

1. one bounded read RPC per viewer/core refresh;
2. preferably one SQL statement / CTE-based projection for the core cross-domain context, so one server read does not simply reproduce the browser's sequential read skew;
3. separate Player and Teacher wrappers;
4. no persisted Resolver table;
5. no trigger that maintains a second normalized state;
6. no background event subscriber.

If a core projection cannot be obtained without sequentially re-running many RPCs internally, the abstraction has not solved the original problem.

---

# 7. Player and Teacher should share a core vocabulary, not a shared DTO

I agree with separate security envelopes, but from maintainability I recommend:

`CoreContextProjection`
plus
`PlayerViewAdapter`
and
`TeacherViewAdapter`

rather than two unrelated implementations of runtime-owner/gate arbitration.

Shared core vocabulary may include:

- run identity;
- runtime owner;
- interaction identity;
- presentation identity;
- gate kind/status;
- validity.

Player wrapper adds only Player-authorized state.

Teacher wrapper adds Teacher-authorized diagnostics/progress.

The wrappers must be server-side security boundaries.

Never send Teacher/private data to Player and hide it in JavaScript.

---

# 8. I would NOT put "legal actions" into the first facade version

This is one point where I deliberately choose a stricter boundary.

A field such as:

`can_submit_vote = true`

looks like harmless display metadata, but it can quickly duplicate actual server authorization rules.

For the pilot, the facade should describe:

- current interaction;
- current gate;
- current presentation;
- viewer's already-locked/completed state where directly authoritative.

The actual action RPC remains the final authority.

Action affordances can be adapted later, module by module, only where a clean server capability fact already exists.

Example of a legitimate capability fact:

`s3_runtime_scene_state.allow_share_photo`

because the server mutation itself checks it.

Do not invent dozens of Resolver-owned `can_...` rules.

---

# 9. Coherence rule

The facade is useful only if one emitted UI frame has a coherent identity.

At minimum every result should carry:

- `run_id`;
- `runtime_owner`;
- exact interaction identity when applicable;
- presentation identity;
- validity.

The browser may still maintain a local request generation counter so an older response cannot overwrite a newer one.

But the server response itself must not be assembled from unrelated stale snapshots without detecting contradiction.

Hard rule:

> **Never repair a missing modern fact by falling back to `game_runs.scene_id / phase_key / step_key`.**

CD's deployed evidence makes this especially strong:

- 577 ACTIVE runs observed;
- 208 lacked `s3_runtime_scene_state`;
- among the other 369, every run differed in at least one mirror field;
- zero matched all three mirror fields.

This is not a theoretical preference anymore.

---

# 10. W01–W13 routing recommendation

This is the practical Hybrid split I recommend.

| work package | primary implementation style | reason |
|---|---|---|
| **W05 Teacher operational location** | **Facade / projection** | cross-domain UI concept; ideal read-model boundary |
| **W03 GRAB+leave** | **direct server refactor** | authoritative mutation, idempotency and exactly-once gate; Resolver must not own it |
| **W01 Discussion lifecycle** | **direct server refactor** | mutation/lifecycle policy; read adapter may later present it |
| **W02-A Player shell / Snapshot** | **core facade + thin adapter** | lifecycle/runtime/presentation/gate coordination |
| **W10 Player header** | **facade** | pure read-model concern |
| **W02-B Discussion rendering** | **module adapter, not core facade** | Discussion already has its own semantic model |
| **W09-A/B/C local UI preservation** | **client-local refactor** | browser-local non-authoritative state |
| **W04 Pocket** | **canonical Pocket APIs + local adapter** | ownership/view/inspection/knowledge are a coherent domain |
| **W08 Library lock** | **local canonical module** | puzzle-specific domain logic |
| **W06 Teacher recomposition** | **Teacher facade + adapter** | cross-domain progress/status is exactly where aggregation helps |
| **W11 text cleanup** | **local UI** | no authority issue |
| **W12 transition overlay** | **consume facade presentation identity** | presentation-only; do not re-derive progression |
| **W13** | **integrated regression** | must test facade/local-module boundary and cutover |

This is not a 50/50 compromise.

It is a domain-boundary decision:

> cross-domain read coordination → facade  
> domain mutation/business truth → local canonical module

---

# 11. The three current Authority leftovers and their impact on the remediation/debug sequence

Teacher specifically asked how much these matter to the existing plan.

## 11.1 `s1_submit_private_choice / s1_scene_choices` quarantine

**Impact: LOW on W05/W03/W01 functional debugging, HIGH as a security/retirement hygiene requirement before final release.**

Reason:

- current formal UI path does not depend on it;
- deployed evidence confirms the legacy RPC is still browser-callable;
- six active legacy choice rows exist.

Recommendation:

- treat it as a small separate local security/quarantine package;
- do not route it through the facade;
- it should not block a read-only W05 pilot;
- it should be closed before declaring the new Player runtime/cutover fully hardened.

Complexity: **1–2/5**.

## 11.2 Three completed runs with NULL/empty `integrity_verified`

**Impact: LOW on ACTIVE-run W01–W12 debugging; MATERIAL for W13 / completed-run reconnect / export compatibility.**

Do not "repair" them merely to make a Resolver green.

Classify first:
- legacy pre-contract record;
- incomplete historical finalization;
- or actual current-contract defect.

Facade behavior for such completed runs should simply be:

`FINALIZED + integrity=UNKNOWN/UNVERIFIED`

not fabricated PASS.

This should not block W05 or active-run shell work.

## 11.3 Remaining effective-privilege probes

**Impact: LOW implementation cost, MEDIUM security significance.**

These do not justify holding all semantic architecture work.

They should be closed as a small bounded read-only security check before exposing/refactoring the corresponding browser-callable surfaces.

Complexity: **1/5**.

Therefore these three issues do **not** justify postponing the entire Round-1 debug plan.

They affect specific gates, not the whole plan.

---

# 12. Complexity comparison

## A. Pure targeted refactor

### Apparent benefit
Small individual diffs.

### Hidden cost
Every Player/Teacher reader must learn:
- runtime owner;
- Authority selection;
- interaction identity;
- missing-row behavior;
- stale-response behavior.

That duplicates the hard part.

Estimated total complexity: **4/5**.

Best use:
- authoritative writes;
- single-domain reads;
- small security/quarantine fixes.

---

## B. Broad Resolver

### Apparent benefit
One place to understand everything.

### Hidden cost
It becomes:
- a new business-logic layer;
- another state machine;
- a large regression oracle;
- a maintenance bottleneck;
- a tempting fallback point.

Estimated initial/cutover complexity: **4–5/5**.

I do not recommend it.

---

## C. Narrow read-model facade + local refactors

### Benefit
Centralizes only the part that is genuinely cross-domain:
- runtime selection;
- presentation identity;
- interaction identity;
- gate projection;
- validity.

Leaves business logic where it already belongs.

Estimated complexity: **3/5**.

This has the best long-term cost profile.

---

# 13. Pilot recommendation — I would change the pilot slightly

I do not think a W05 **operational-location-only** shadow pilot is sufficient.

Operational location is an unusually derived concept and could give a false positive:

> "we solved location, therefore the Resolver abstraction works."

The pilot should still be bounded around W05, but must include the smallest reusable core:

1. run lifecycle;
2. runtime owner;
3. presentation identity;
4. W05 operational-location projection;
5. current gate kind/status;
6. validity / UNKNOWN.

No UI cutover.

No mutation.

No persistence.

Run it in controlled E1/shadow testing, not as permanent extra production polling.

### PASS threshold

All predefined canonical test vectors across representative transitions must match the independently specified expected result:

- early divergent ACT1–5;
- ACT5→6 handoff;
- ACT6 shared phase;
- one S5 transition;
- one S6 role/station state;
- missing presentation row;
- stale/mismatched mirror;
- reconnect;
- finalized state.

**Zero semantic mismatches** for the bounded vectors.

### STOP conditions

Stop the architecture experiment if any of these is required:

1. new persistent Resolver state;
2. dual-write from gameplay mutations into Resolver storage;
3. fallback to old `game_runs` ACTIVE mirrors;
4. Resolver reimplements action authorization;
5. a broad per-ACT switch statement starts reproducing gameplay rules;
6. the facade cannot reduce/replace current multi-RPC read orchestration;
7. Player/Teacher privacy requires client-side filtering;
8. shadow result can only be validated against the old UI rather than independent expected semantics.

If a STOP condition appears, targeted local refactoring is safer.

---

# 14. Tests I consider mandatory before W02/W06 cutover

The cheapest falsification set is:

1. **Coherence race**
   - transition happens while refresh is in flight;
   - committed result is either old coherent frame or new coherent frame, never mixed.

2. **Missing canonical row**
   - no modern presentation row;
   - result = UNKNOWN / INVARIANT_BREACH;
   - never fallback to `game_runs`.

3. **Gate taxonomy**
   - one case each for ALL, ROUND, ROLE_SET, ANY, TEACHER, SERVER_AUTO.

4. **Privacy**
   - Gitte projection contains no Anna/Linda private pre-reveal choice.

5. **Reconnect**
   - reconnect reconstructs current facade result without browser history.

6. **Replay**
   - facade output cannot authorize a stale mutation; write RPC still rejects stale expected identity.

7. **Cutover ownership**
   - exactly one renderer/adapter owns each UI region.

8. **Load**
   - after cutover, the facade must replace existing reads rather than permanently add another 1.2-second RPC on top.

---

# 15. Final recommendation to CA

My independent position is:

### Broad central Resolver
**CHALLENGE**

### Pure in-place refactor of every existing reader
**CHALLENGE as the sole strategy**

### Narrow server-side Read-Model Facade + local canonical refactors
**PASS_WITH_GATES**

The most important architectural sentence is:

> **Do not centralize the game. Centralize only the cross-domain read boundary.**

This preserves the value of the 432-field Authority work without turning that registry into executable business logic.

I recommend that CA wait for CD's independent engineering-cost review, then compare it against this domain-boundary split.

If both reviews converge, a bounded W05/core-context shadow pilot is justified.

No implementation authority is implied by this review.

**NEXT_OWNER = CA (after CD's independent review is also available).**
