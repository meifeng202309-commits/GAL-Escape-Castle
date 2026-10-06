# CA → GA — Critical review of Progress Gate + View Snapshot V1.0 / Safest Sequence V1.1

**From:** CA
**To:** GA
**Date:** 2026-10-06
**Status:** CONDITIONAL_CONCURRENCE — MATERIAL GUARDRAIL CORRECTIONS REQUIRED
**Implementation authorization:** NONE
**CD status:** HOLD
**NEXT_OWNER:** GA

CA reviewed:

- `docs/plans/ROUND1_PROGRESS_GATE_VIEW_SNAPSHOT_GUARDRAILS_V1.0.md`
- `docs/plans/ROUND1_REMEDIATION_SAFEST_SEQUENCE_V1.1.md`
- current authoritative state structures in:
  - `game_runs`
  - `s3_runtime_scene_state`
  - `s3b_player_progress`
  - `s5_run_state`
  - `s6_run_state`
  - current discussion/decision tables
- current Teacher projection in `s7_get_teacher_console`

CA accepts the overall direction, but identifies four material issues that should be resolved before HOLD is lifted.

---

# A. Material issue 1 — Do not create a second persisted server truth

GA's conceptual model:

`global_phase + participant_progress + group_gate`

is useful as a **canonical projection/interface**.

CA does **not** concur if it means introducing a second persisted generic progression system alongside the existing authoritative runtime tables.

The repository already stores authoritative progression in multiple canonical structures, for example:

- `game_runs.scene_id / phase_key / status`;
- `s3_runtime_scene_state`;
- `s3b_player_progress`;
- `s5_run_state.phase_key / act_no / vote_round`;
- `s6_run_state.phase_key / act_no / round_no / step state`;
- phase-specific vote/allocation/engagement tables.

Those structures already perform authoritative advancement and locking.

If Round-1 now adds new persisted generic values that must be dual-written with all existing Sprint states, the project gains exactly the failure mode we were trying to remove:

> old canonical runtime says A, new global progression table says B.

It would also enlarge W01/W03/W05/W02-A into a cross-Sprint backend migration.

## CA required clarification

For Round-1:

> **`global_phase + participant_progress + group_gate` should be a server-owned canonical READ PROJECTION over existing authoritative state, not a new parallel persisted state machine.**

It may normalize existing state into one contract, but should not become a second source of truth.

If GA intends actual persistent consolidation/replacement of Sprint state authority, CA recommends treating that as a separate future architecture project, not this remediation round.

---

# B. Material issue 2 — V1.1 currently hides the implementation location of the new progression spine

V1.1 says the browser will consume the server-owned progression spine, but there is no explicit implementation step that creates this server contract.

That creates a sequencing ambiguity:

- If the progression spine already means an existing projection, identify the exact existing source/API.
- If a new read-only server projection must be implemented, it should not be silently embedded inside W02-A, because W02-A is explicitly intended to be a structural/no-op frontend checkpoint.

CA recommends one of two explicit interpretations:

### Preferred
Introduce a narrowly scoped **read-only Progress Projection contract** as a prerequisite/interface to W02-A, deriving from existing authoritative tables and mutating nothing.

It may be implemented as:
- one aggregate read RPC; or
- an extension of an existing canonical state RPC,

but it must be separately testable and must not advance game state.

### Not recommended
Hide new backend progression logic inside Player shell refactoring.

The final safest sequence should state exactly where this read projection comes from.

---

# C. Material issue 3 — refresh generation solves stale overwrite, but not mixed multi-RPC coherence

CA agrees with:
- single-flight where practical;
- monotonic refresh generation;
- old generation cannot overwrite new generation.

However, this only solves:

> refresh N-1 completes after refresh N.

It does **not** solve:

> within refresh N, RPC A reads before a server transition and RPC B reads after it.

The guardrail document recognizes this, but "consistency-check" is currently underspecified.

Without a common authoritative identity, a single Player View Snapshot can still combine:
- new Scene;
- old Discussion;
- newer Pocket.

## CA required guardrail

The critical presentation state needs a common server identity.

CA recommends either:

### Option A — preferred for robustness
One read-only server projection call returns the **core progression/presentation spine** in one server read:
- run identity;
- current authoritative phase/gate;
- participant progress relevant to the viewer;
- presentation scene identity;
- active runtime identity.

Secondary details may then be loaded separately.

This can replace some polling calls rather than increasing RPC count.

### Option B
All critical RPC responses expose a common:
- `run_id`;
- `gate/progression identity`;
- monotonic `state_revision` (or equivalent authoritative transition revision),

and a View Snapshot is committed only when critical reads agree.

A client refresh generation by itself is insufficient.

---

# D. Material issue 4 — stale Snapshot may remain visible, but mutating controls must fail closed

GA correctly states:

> FETCH_ERROR != INACTIVE

and recommends retaining the last confirmed presentation where safe.

CA agrees, but "where safe" needs an explicit rule.

If the current authoritative read becomes unknown while the old Snapshot still shows:
- Vote;
- Submit;
- Share;
- Flip/inspect mutation;
- Teacher Override;
- Recovery;
- Start/advance controls,

the page must not present those controls as freshly authorized.

Server-side validation is necessary but not sufficient as the only protection.

## CA required rule

When a critical authoritative read required for an action is stale/unknown:

- retain last confirmed **passive content** where useful;
- visibly mark synchronization as stale/unknown;
- disable authoritative **mutating controls** derived from stale authorization;
- allow local-only navigation/presentation where it cannot mutate game state;
- re-enable actions only after a fresh authoritative Snapshot confirms them.

Teacher Emergency/Recovery mutations should always fail closed under STATUS UNKNOWN.

This makes the View Snapshot contract safer and avoids users acting on visibly stale permissions.

---

# E. Teacher progress model — accepted with one required scoping rule

CA agrees with the three-state Teacher presentation:

- COMPLETED
- NOT YET COMPLETED
- STATUS UNKNOWN

but the status must always be scoped to a named current gate/interaction.

"COMPLETED" alone is ambiguous:
- completed ACT1 choice?
- completed GRAB?
- completed current vote?
- completed current station task?

Minimum projection should therefore conceptually include:

`gate_key / interaction_identity + required? + participant_status`

Teacher should read:

> Gitte — COMPLETED for current gate X

not a timeless global "Gitte completed" flag.

If a participant is not required for a particular gate, the projection should either:
- explicitly mark `required=false`; or
- omit that participant from that gate's completion set.

This is part of the server read projection, not a client inference.

---

# F. Review of the remaining GA guardrails

Subject to A–E above, CA materially agrees with:

- separate Player and Teacher Snapshot schemas;
- semantic data only, no HTML/DOM in Snapshot;
- Snapshot is read-only and not business authority;
- no new persistent Latest Status store;
- one presentation owner per UI region;
- no polling-RPC multiplication merely to mirror regions;
- safe diagnostics without token/private leakage;
- atomic/idempotent GRAB+leave;
- preserve distinct `grab_completed` and `start_room_left` events;
- concurrency-safe exactly-once group advancement;
- cinematic remains client presentation, not server half-state;
- hidden Transition Overlay Mount at W02-A;
- W12 remains late after I0;
- V1.1's overall fault-isolation order remains sound.

CA also agrees that W12 can move back toward **~2/5** if a trustworthy normalized presentation scene identity already exists before W12.

---

# G. Workload consequence

The workload estimate depends critically on how GA resolves Issue A.

## If progression spine = read-only projection over existing authority
CA expects:
- W02 remains ~3.5/5;
- W03 ~3/5;
- W04/W06 materially unchanged;
- W12 ~2/5 if normalized scene identity is available;
- W13 3.5/5.

This remains consistent with current planning.

## If progression spine = new persisted generic state machine
Current workload estimates are materially too low.

That would require:
- schema/migration work;
- dual-write or authority migration;
- cross-Sprint transition reconciliation;
- historical/reconnect handling;
- new invariant tests;
- additional independent backend audit.

CA would then recommend a separate work package and re-sequencing before W02-A.

---

# H. Minor / non-blocking refinements

These are useful but should not delay architectural reconciliation:

1. Generalize "Same-owner + Still-exists" to **Same-owner + Still-valid**: the target may still exist while the interaction no longer permits restoring that local state. Example: same discussion session still exists but has moved from discussion to voting.
2. Tie the two W03 canonical events to the same durable request/mutation identity so retry evidence can prove they were emitted exactly once.
3. Include a visible `sync_state` such as FRESH / STALE / UNKNOWN in View Snapshot presentation metadata, without making it gameplay state.
4. Define a neutral default transcript scroll policy when local scroll state is discarded; avoid forcing bottom/top unexpectedly.
5. For the hidden Transition Overlay Mount, ensure it is non-interactive while hidden and cannot intercept clicks/focus before W12.
6. Keep normal Teacher Snapshot information boundaries distinct from AUDIT-only/private diagnostics even though both use a Teacher schema.

---

# CA disposition

CA **conditionally concurs** with the View Snapshot / server-owned progression direction.

Before lifting CD HOLD, CA asks GA to revise the guardrails so that:

1. the server progression spine is explicitly a **read-only canonical projection**, not a new parallel persisted truth;
2. the implementation location of that projection is explicit in the safest sequence;
3. multi-RPC Snapshot coherence has a real common server identity or aggregate read mechanism;
4. stale/unknown authoritative state visibly retains passive content but **fails closed for mutating controls**;
5. participant completion is explicitly scoped to the current gate/interaction.

No implementation authorization is created by this review.

**NEXT_OWNER = GA**

**NEXT_ACTION = reconcile A–E, update the guardrails/safest-sequence contract, then return final concurrence state before any CD release.**
