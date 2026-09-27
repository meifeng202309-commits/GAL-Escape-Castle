# GA–CA Remediation Decision Report — 2026-09-27

Status: **DISCUSSION INPUT — NO IMPLEMENTATION AUTHORIZATION**  
Frozen product baseline used by CA: `93bd15ca36dd985a0706bad9ec56ba4002a6e`  
Current gate: remediation hold

## 0. Purpose

Teacher asked GA to reconcile:

1. GA's earlier recommendation about when to use blind player trials and how cautiously to let Codex/CD modify the product;
2. CA-135/136/137/138, especially CA's final structural classification;
3. direct source evidence from the current implementation.

This report distinguishes:
- genuine GA/CA consensus;
- real differences in prior recommendations;
- source evidence that resolves those differences;
- a cautious remediation strategy that addresses structural causes without turning Codex into an unconstrained redesign authority.

This report is intentionally about **scope architecture and sequencing**, not exact implementation mechanics.

---

# 1. GA–CA consensus

## C1 — The current problem set is predominantly structural, not fourteen unrelated small bugs

GA and CA now agree.

CA's consolidated set contains:
- 14 material findings: `IDA-001..006 + PFC-001..008`;
- 10/14 belong to structural runtime/product/QA families;
- 3 are localized;
- 1, IDA-004, remains pending live diagnosis.

GA agrees with CA's five structural families:

- **S1** legacy/formal lifecycle separation;
- **S2** fragmented transition ownership;
- **S3** missing submitted/locked/waiting player contract;
- **S4** Pocket/evidence not first-class across ACTs;
- **S5** RPC-centric rather than browser-journey-centric validation.

## C2 — Symptom-by-symptom patching is high risk

GA and CA agree that fixing raw issue IDs independently is unsafe.

Examples:
- hiding the pre-run legacy choices alone would not fix post-ACT14 legacy fallback;
- adding one waiting sentence would not fix the repeated waiting/lock contract failure across ACT2–12;
- inserting one ACT3 clue button would not implement the persistent Pocket/evidence model;
- delaying one ACT5 screen would not by itself repair fragmented transition ownership.

This is exactly the "local correctness, cross-module failure" class already recognized in CA rules.

## C3 — A full rewrite is not supported by evidence

GA agrees with CA.

Large backend contracts remain reusable:
- formal ACT1 role-specific validation;
- canonical discussion/vote authority;
- player privacy on the formal path;
- later mutation identity/guards;
- Teacher Override provenance;
- finalization/export server integrity;
- asset resolver/anchor framework.

The appropriate target is **bounded structural refactor + localized corrections**, not restart-from-zero.

## C4 — IDA-004 must be diagnosed, not guessed

Both GA and CA agree.

The live symptom:

`Run started → No active run → No active formal run`

cannot be produced by the frozen static contract under one consistent deployment.

No architecture should be redesigned around an assumed cause until the deployed mismatch/state is reproduced and identified.

## C5 — Real browser/multi-client acceptance remains necessary

Both agree that source and direct-RPC correctness are insufficient.

Remaining acceptance gaps include:
- real staggered three-client behavior;
- rendered placeholder/anchor usability;
- actual audio perception/autoplay/retry;
- browser journey continuity through completion.

---

# 2. Prior differences in recommendation

## D1 — When to run blind Trial Agents

### GA's earlier view

GA previously proposed:

`CA supplemental review → short pre-remediation blind trial → freeze scope → repair → CA closure → full blind trial`

The rationale was to discover additional player-facing symptoms before Codex changes the baseline.

### CA's later view

After CA-136/137/138, CA concluded:
- the pre-remediation **source-level** problem map is sufficiently complete;
- additional source-only review is not recommended;
- freeze the bounded structural remediation scope now;
- after correction and CA closure, perform real multi-client/browser acceptance.

### Source evidence resolving the difference

The current root code makes a full blind pre-remediation run intrinsically low-yield:

1. `refreshState()` dispatches to legacy Sprint1 whenever `s2_get_player_state.active` is false.
2. After `s2_start_run` succeeds but before `s3b_initialize_flow`, the client enters the formal branch but throws if Sprint3B scene state is absent.
3. The existing Teacher startup is itself split into two user-visible calls.
4. Even after startup is manually shepherded, later known player-facing defects repeatedly contaminate the experience:
   - barrier states can go blank;
   - accepted Sprint6 actions can look unsubmitted;
   - Pocket/evidence is absent ACT1–5;
   - ACT5 transition content is overwritten;
   - ACT14 reveal falls through to legacy.

A blind agent can certainly rediscover symptoms, but the current build contains enough known structural interference that a "full trial" cannot cleanly test the later product.

Meanwhile CA-137 has already performed an exhaustive source-level player-state matrix and found PFC-005..008 in addition to PFC-001..004.

### GA conclusion

**CA's sequencing is now the stronger recommendation.**

A pre-remediation Trial-Agent run is no longer necessary as a gating step.

At most, a very short baseline recording could be retained for UX comparison, but it should not delay remediation and should not be expected to map ACT1–14.

The first meaningful full Blind Trial should occur **after the structural remediation has passed independent CA closure**.

---

## D2 — How narrow the first remediation should be

### GA's earlier view

GA initially favored fixing only:
- startup authority;
- root player/Teacher legacy exposure;

before touching later ACTs.

### CA's later view

CA-138 argues that the remediation scope must be frozen across all structural families before coding begins, because later defects share the same architectural causes.

### Source evidence resolving the difference

CA is correct that startup-only scope is too narrow.

#### S1 spans both beginning and ending

Current `refreshState()` uses:

`formal active ? formal renderers : renderState(legacy Sprint1)`

This causes:
- IDA-001/002 pre-run legacy exposure;
- PFC-001 after finalization, because finalization makes the run completed and therefore no longer "active".

The effective `s8_get_player_state` can already retrieve the latest completed run, but the client never calls it once `discussionState.active` is false.

Therefore startup and ending are one lifecycle-dispatch problem.

#### S2 spans startup and ACT5→ACT6

Startup is split:
- `s2_start_run`;
- separate `s3b_initialize_flow`.

Separately, migration038's deferred cross-Sprint trigger reacts to `SPRINT3B_COMPLETE` and calls `s5_ensure_initialized`; migration039 immediately sets the ACT6 scene.

Thus the same transition-ownership problem exists at two different lifecycle boundaries.

#### S3 spans many ACTs

In `renderSprint3b`, after several accepted per-player actions while peers are pending, no branch matches and the fallback is literally:

`else html=""`.

In `renderSprint6`, phase-based action buttons are recreated without consistently checking whether the current player already submitted/locked.

This is not a startup-only problem.

#### S4 is explicitly cross-ACT

`refreshState()` currently fetches Pocket state only when:

`sprint5State.active ? s3_get_player_state(...) : null`

and `renderSprint3b` does not render Pocket/evidence.

Therefore the ACT1–5 evidence gap is produced by root orchestration, not one missing ACT3 button.

### GA conclusion

**CA is correct that the remediation scope must include all structural families before Codex starts.**

However, "freeze the whole structural scope" does **not** mean "make one giant code change".

The safer implementation is staged structural packages under one frozen architecture contract.

---

## D3 — How dangerous is it to let Codex/CD start now?

There is no substantive disagreement.

CA explicitly warns that patching findings individually can accumulate fixes without a coherent model.

GA's earlier risk assessment remains:

- **unbounded "fix the game" instruction:** high risk;
- **bounded structural remediation under explicit invariants and forbidden-change boundaries:** manageable;
- **full rewrite:** unjustified and higher risk.

The source evidence above strengthens, rather than weakens, this concern.

---

# 3. Direct code evidence and implications

## E1 — Root lifecycle dispatch is too coarse

Current client behavior:

```text
s1_get_player_state
s2_get_player_state

if formal run active:
    get formal projections
    render formal product
else:
    render legacy Sprint1
```

The boolean "active formal run" is being used as a proxy for product lifecycle.

But the real lifecycle has at least:
- joined / pre-run waiting;
- starting;
- formal active;
- formal completed / final reveal;
- recovery/error;
- legacy prototype, which should not be the root product fallback.

### Implication

Do not fix IDA-001 and PFC-001 separately.

Remediation needs one coherent **root lifecycle-dispatch contract**.

Legacy Sprint1 code may remain for regression/prototype purposes, but current root player/Teacher surfaces should not reach it as a default formal-product state.

---

## E2 — Formal startup lacks a single authoritative completion boundary

`s2_start_run` commits an active run.

`s3b_initialize_flow` is a separate Teacher-triggered RPC that requires that active run.

The gap is a valid committed DB state but an invalid product state.

### Implication

The browser-authoritative startup path should have one recoverable boundary.

A safe design family is:
- one server-owned operation that creates the formal run and initializes canonical ACT1 in one transaction; or
- an explicit server-authoritative `initializing` lifecycle state that is valid, reconnectable and non-actionable until canonical ACT1 is ready.

The current implicit gap should not remain.

A wrapper/new migration can preserve immutable 001–058 history; do not rewrite historical migrations.

---

## E3 — ACT5→ACT6 has the same handoff problem

Migration038:
- on `s3b_run_state.terminal_state='SPRINT3B_COMPLETE'`
- calls `s5_ensure_initialized`.

Migration039:
- creates Sprint5 state/discussion;
- immediately calls `s5_set_scene(... 'act6_portrait' ...)`.

This can overwrite the ACT5 terminal presentation before the browser observes it.

### Implication

Cross-Sprint initialization and **player-visible transition completion** must be treated as separate concerns.

The next subsystem may be prepared in advance, but ownership of the visible scene should not move until the canonical outgoing transition has been acknowledged/completed.

Exact mechanism remains CD's design responsibility.

---

## E4 — Waiting/lock acknowledgement needs a product contract, not screen patches

Sprint3B current pattern:
- player's accepted action updates per-player state;
- global scene remains while peers are pending;
- renderer may match no action branch and emit empty actions.

Sprint6 current pattern:
- player's accepted action is stored;
- global phase remains;
- renderer often recreates the same action buttons.

### Implication

Define one invariant:

> Once a player's action is accepted/locked, that player must not be presented as unsubmitted. Until the global barrier advances, the UI must display an explicit accepted/locked/waiting state and, where meaningful, peer progress without private content.

This contract should apply across runtime generations.

Do not implement PFC-002 and PFC-003 as unrelated strings.

---

## E5 — Pocket/evidence is a shell capability

Current code fetches `s3_get_player_state` only when Sprint5 is active.

The existing evidence renderer is attached to Sprint5 rendering.

### Implication

Pocket/evidence should become a formal-player-shell capability available whenever canonical permissions say it is available, independent of which Sprint renderer currently owns the scene.

Do not solve PFC-005 by injecting one-off clue buttons into individual scenes.

---

## E6 — ACT14 backend is more correct than root dispatch

Effective migration048 `s8_get_player_state` already falls back to `s8_latest_completed_run(room)` when there is no active run.

Therefore the server has a completed-run projection.

The failure is primarily that root `refreshState()` only asks for Sprint8 state inside the active-formal-run branch.

### Implication

This strongly supports **bounded client/lifecycle refactor rather than rewriting finalization logic**.

Preserve the server finalization/export contracts unless independent evidence identifies a separate defect.

---

# 4. Recommended cautious remediation strategy

## Phase 0 — Diagnose IDA-004 before architecture edits

Before Codex changes startup/runtime code:

1. reproduce the current deployed `Run started → No active run` contradiction;
2. capture:
   - exact frontend commit/deployment version;
   - configured Supabase project;
   - active `game_runs` row immediately after start;
   - effective migration/schema version if available;
   - Teacher/client RPC responses;
3. classify the cause:
   - stale frontend;
   - wrong project/config;
   - incomplete deployment;
   - source/runtime mismatch;
   - actual state bug.

**No speculative retry/setTimeout workaround.**

If IDA-004 is a deployment mismatch, fix that environment problem before judging source changes.

---

## Phase 1 — Freeze a Remediation Architecture Contract

Before implementation, GA/Teacher should freeze **outcome contracts**, not algorithms.

Required structural outcomes:

### R-S1 Lifecycle
- current root formal product never defaults to legacy Sprint1 gameplay;
- pre-run player state is explicit waiting/lobby;
- completed run reaches canonical ACT14 reveal/reconnect;
- legacy Teacher shadow controls are removed from or clearly isolated from the formal operator surface;
- legacy regression code may remain, but not as root formal authority.

### R-S2 Transition ownership
- startup has one valid authoritative completion boundary;
- no committed player-visible "active but uninitialized" gap;
- ACT5 canonical terminal consequence/transition is observable before ACT6 takes visible ownership;
- later cross-Sprint handoffs follow the same ownership rule.

### R-S3 Per-player accepted/locked/waiting
- successful action cannot look unsubmitted;
- waiting cannot look stuck;
- controls cannot disappear without a waiting explanation;
- controls cannot reappear as actionable after the player's action is locked;
- no private peer content is leaked.

### R-S4 Pocket/evidence
- persistent evidence capability is available across the ACTs where canon requires it;
- object/knowledge/share semantics remain server-authoritative;
- client uses one shared capability rather than scene-specific ad hoc substitutes.

### R-S5 Product journey validation
- browser-driven regression covers the composed root journey, not only RPCs;
- at minimum:
  `create/join → pre-run waiting → formal start → ACT1 → representative barriers → cross-Sprint handoff → ACT14 completed reveal → reconnect`.

Forbidden scope:
- no rewrite of canonical gameplay;
- no redefinition of behavior semantics;
- no mutation of migrations001–058;
- no broad cleanup unrelated to these structural families;
- no deletion of legacy DB behavior merely to make tests pass;
- no asset ownership/governance change;
- no guessed fix for IDA-004.

---

## Phase 2 — Codex/CD produces a change-impact map before editing

Codex should not begin with code.

First deliver a compact implementation impact map:
- authoritative state/functions it intends to touch;
- UI/root dispatch surfaces it intends to touch;
- new migration number(s), if any, starting at 059+;
- preserved functions/contracts;
- structural family addressed by each change;
- explicit out-of-scope areas.

This is not a repeated approval loop.

It is a one-time protection against Codex beginning implementation from an incomplete model.

GA should review only:
- scope;
- canonical semantics;
- forbidden-change boundaries.

CA should **not** be given CD's detailed implementation reasoning before its later independent audit, preserving audit independence.

---

## Phase 3 — Implement in bounded structural packages

Do not implement by raw finding order.

Recommended dependency grouping:

### Package A — Lifecycle and transition spine
Covers:
- S1;
- S2;
- IDA-001/002/003/005;
- PFC-001;
- PFC-008;
- the source-side part of IDA-004 only after live diagnosis.

This is the highest-risk package.

### Package B — Player action acknowledgement contract
Covers:
- S3;
- PFC-002;
- PFC-003;
- reconnect behavior for those states.

### Package C — Persistent Pocket/evidence capability
Covers:
- S4;
- PFC-005.

### Package D — Localized player/UI integration
Covers:
- PFC-004;
- PFC-006;
- PFC-007.

### Package E — Browser journey regression
Covers:
- S5 / IDA-006;
- regression cases for Packages A–D.

Each package should preserve the same frozen remediation contract.

No package may opportunistically redesign unrelated systems.

---

## Phase 4 — Independent audit gates

Because Package A changes the product lifecycle spine, GA recommends an **intermediate independent CA checkpoint after Package A** before later packages are allowed to rely on the new lifecycle model.

This checkpoint should answer only:
- did the structural lifecycle/transition contract close the intended defects;
- did it preserve formal backend authority/privacy/finalization;
- did it introduce new shadow/reachability paths?

After Packages B–E are integrated, submit one frozen complete correction baseline for the normal Level2 Targeted Independent Closure.

This adds one deliberate high-risk checkpoint without turning every coding step into an approval loop.

---

## Phase 5 — Blind Trial Agents after structural closure

GA withdraws the earlier recommendation that a pre-remediation blind trial be a prerequisite.

After:
1. Package A structural checkpoint;
2. full remediation baseline;
3. CA Level2 closure;

run the first meaningful blind multi-client Trial-G/A/L acceptance.

That trial should then be able to explore actual ACT1–14 behavior rather than repeatedly rediscover known structural blockers.

Browser-only NOT VERIFIED items should be included:
- anchor/placeholder readability;
- audio perception/retry;
- asynchronous three-player waiting;
- responsive layout;
- reconnect;
- full completion.

---

# 5. Risk assessment for Codex/CD

## If Codex is told "fix all audit findings"

**Risk: HIGH**

Reasons:
- ten findings are structural;
- several symptoms share the same root;
- some backend contracts are already correct and easy to accidentally disturb;
- direct-RPC tests can remain green while root UI is wrong;
- IDA-004 still has unknown deployed cause.

## If Codex works under the frozen architecture contract and bounded packages above

**Risk: materially lower and acceptable for controlled remediation**

The key governance change is not "more approvals".

It is reducing Codex's authority from:

`diagnose + redesign + implement + self-verify`

to:

`implement within frozen structural outcomes + supply evidence`.

Independent diagnosis/closure remains with CA; canonical product intent remains with GA/Teacher.

---

# 6. Final recommendation

1. **Do not run a full Trial-Agent audit before remediation as a gate.** CA's later analysis is stronger on sequencing.
2. **Do not start Codex with raw bug tickets.**
3. **First diagnose IDA-004 live.**
4. **Freeze all five structural families plus localized corrections as one remediation architecture contract.**
5. **Implement in bounded packages, not one mega-refactor.**
6. **Use an intermediate CA checkpoint after the lifecycle/transition spine because that package has the largest blast radius.**
7. **Run full blind multi-client Trial Agents only after structural correction and independent closure, when they can inspect the whole product rather than known blockers.**
8. **Do not rewrite the project from zero. Preserve already-correct server contracts and immutable migration history.**

The substantive reconciliation is therefore:

> CA is correct that the current problem map is sufficient to start a bounded structural remediation and that a pre-remediation full blind trial has low marginal value. GA's caution about Codex remains correct, but the right response is not to delay indefinitely; it is to freeze structural outcome contracts, stage implementation, preserve independent audit, and prevent symptom-level patching.
