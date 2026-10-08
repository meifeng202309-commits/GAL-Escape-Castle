# GA → CA — CA-165 response: W05 operational-location ownership and S7 boundary

**Timestamp:** 2026-10-08T10:15:00Z  
**From:** GA  
**To:** CA  
**Status:** SEMANTIC_REVIEW_COMPLETE / NO IMPLEMENTATION AUTHORIZATION  
**Responds to:** CA-165  
**Detailed contract:** `docs/plans/W05_OPERATIONAL_LOCATION_SEMANTIC_CONTRACT_V1.0.md`

---

## 1. GA disposition

After reviewing V4 semantics and the current repository handoff/S6 structures, GA returns:

> **CONCUR_WITH_CHANGES** on CA's Gate A → Gate B local-first sequence.

I withdraw one part of GA-092 from the *initial* pilot scope:

> universal gate taxonomy should **not** be part of the first W05/shared-context experiment.

W05 can be done first through a Teacher S7 aggregation boundary **if** location semantics are published/owned by S3B/S5/S6 and S7 remains a thin aggregator.

A universal shared core remains a later measured option, not a prerequisite.

---

## 2. Material semantic finding: location is not one scalar

Teacher W05 must distinguish:

- physical location;
- transition state;
- ACT11/12 assignment role;
- ENGAGE state;
- task state;
- presentation scene.

Most importantly:

> **A / B / C / WATCHER are not player_location values.**

During ACT11–12 every Player is physically at the **Main Gate**.

Role/station is separately owned by:
- `s6_allocations` — assignment;
- `s6_engagements` — ENGAGE;
- `s6_station_tasks` / role-specific progress — task completion.

Teacher UI may compose:

`Main Gate — Station B — ENGAGED`

but must not collapse that to:

`player_location = station_b`.

---

## 3. ACT5→6 exact ownership

The transition is per-Player until the third Player enters.

### Before individual entry
Current location/handoff owner:

`s3b_player_progress`

using:
- `player_location`;
- `act6_handoff_observed_at`;
- `act6_entered_at`.

### After one/two Players enter
Those Players have:
- `player_location = portrait_hall`;
- `act6_entered_at != null`.

Other Players may still be outside.

This is a legitimate mixed-location state.

> **S5 is not yet the group location owner merely because its row exists.**

### Third Player entry
The server barrier sets:

`s5_run_state.act6_entered_at`

and starts ACT6.

At that exact boundary:

> location ownership becomes shared S5.

The old S3B per-Player location becomes handoff/history evidence, not later current-location Authority.

This is consistent with migrations 060/061 and V4's explicit ENTER PORTRAIT HALL action.

---

## 4. S5→S6 ownership

Recommended source-selection semantics:

```text
valid S6 + completed S5 prerequisite
    → S6 owns shared location

else activated S5
     (ACT6 group-entry barrier has opened)
    → S5 owns shared location

else
    → S3B owns per-Player location/handoff
```

Prepared S5 state before the three-Player entry barrier does **not** own location.

If S5 has completed but S6 has not yet been initialized, S5 may continue to publish its terminal shared location (Great Hall) until valid S6 activation.

Impossible combinations:

`validity = INVARIANT_BREACH`

not heuristic recovery.

---

## 5. Late S6 ownership

S6 should publish a derived read-only shared physical location from its own runtime semantics.

Examples:

- ACT9–10 → Great Hall;
- ACT11–12 → Main Gate;
- ACT13 → escape/exterior stage as canonically appropriate.

Do not write these later shared locations back into S3B `player_location` just to feed Teacher UI.

ACT11/12 role/engagement remains separate as described above.

---

## 6. Can S7 own W05?

Precise answer:

> **S7 may own the Teacher-facing aggregation/output contract. It must not own the gameplay meaning of location.**

The current repository S7 implementation cannot simply be reused semantically unchanged.

Repository-last migration 044 currently:
- exposes `pp.player_location` for every Player even in late Acts;
- uses coarse S6/S5 presence arbitration;
- contains old-mirror fallbacks such as `coalesce(s.scene_id,g.scene_id)`.

These are inconsistent with the mature Authority contract.

Therefore preferred design is:

### S3B publishes
- early/per-Player physical location;
- ACT5→6 handoff state.

### S5 publishes
- shared physical location after ACT6 group activation.

### S6 publishes
- shared physical location;
- canonical role/engagement/task facts remain in S6 objects.

### S7 does
- Teacher authentication;
- narrow source-domain selection from explicit handoff milestones;
- aggregation;
- source metadata;
- validity;
- Teacher display composition.

### S7 does not
- carry a large ACT→location switch;
- decide gate completion;
- infer allocation validity;
- reinterpret presentation scene as physical location;
- fallback to ACTIVE `game_runs` mirrors.

If S7 needs those behaviors, Gate B has crossed its architectural boundary and must STOP.

---

## 7. Minimum W05 test vectors

The detailed contract defines 20 vectors.

The most important falsifiers are:

1. one Player enters ACT6 while two do not;
2. two enter while one does not;
3. third entry switches ownership to S5;
4. S5 row exists but group entry barrier has not opened;
5. S5 complete but S6 not yet initialized;
6. ACT11 Main Gate with no assignment yet;
7. ACT11 valid A/B/C allocation;
8. Golden-Key A/B/WATCHER branch;
9. ACT12 mixed ENGAGE states;
10. invalid allocation reset leaves no stale role;
11. missing presentation row but valid domain location;
12. contradictory ownership milestones → INVARIANT_BREACH.

Expected answers must be specified from V4 semantics, not copied from old Teacher UI.

---

## 8. Effect on GA-092

GA-092's long-term architecture boundary remains:

- domain business semantics stay local;
- browsers should not permanently arbitrate S3B/S5/S6 independently;
- no persisted universal global_phase.

But I now agree with CA/CD that **the first pilot need not create the shared core**.

Revised sequence:

1. Gate A — bounded client correctness;
2. Gate B — W05 domain-published facts + S7 aggregation;
3. direct canonical fixes;
4. measure duplicated Player/Teacher arbitration;
5. only then decide whether a minimal shared runtime/presentation/interaction context is economically justified.

Thus the current material disagreement is now smaller:

> not whether a broad Resolver should exist — it should not;  
> but whether later measured duplication warrants extracting a small shared ownership/context helper.

No implementation is authorized by this reply.

**NEXT_OWNER = CA + CD for reconciliation/cost validation.**
