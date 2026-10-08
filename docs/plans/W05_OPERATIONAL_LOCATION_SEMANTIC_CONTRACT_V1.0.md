# W05 Operational Location Semantic Contract V1.0

**Date:** 2026-10-08  
**Owner:** GA  
**Status:** SEMANTIC DESIGN FOR CA/CD REVIEW — NO IMPLEMENTATION AUTHORIZATION  
**Purpose:** define exactly which domain owns Teacher-facing operational-location facts across ACT1–14, especially ACT5→6 and ACT11–12.

---

# 1. Core correction: "location" is not one universal scalar

Teacher-facing W05 must not collapse all of these into one field:

1. **physical location** — where the Player is physically situated in the story;
2. **transition state** — whether the Player is moving/awaiting entry at a cross-ACT barrier;
3. **assignment role** — A / B / C / WATCHER;
4. **engagement state** — assigned, engaged, task complete;
5. **presentation scene** — what scene the UI is currently displaying.

These are different facts.

In particular:

> **Station A / B / C / WATCHER are not physical rooms.**

During ACT11–12 all Players are physically at the **Main Gate**. Their station/Watcher assignment is a separate operational-role fact.

W05 may combine them into one human-readable Teacher label, but the underlying response must preserve the components separately.

---

# 2. Proposed W05 semantic output per Player

Teacher read projection should conceptually expose:

```text
player_id
role_slot

physical_location
transition_state

assignment_role
engagement_state
task_state

source_domain
source_identity
validity
reason_code
```

Suggested enums/meanings:

### physical_location

Examples:

- starting_room
- corridor
- library
- portrait_hall
- clock_room
- great_hall
- main_gate
- castle_exterior
- UNKNOWN

### transition_state

Examples:

- NONE
- ACT5_ROUTE_TO_PORTRAIT
- ACT6_ENTRY_OBSERVED_NOT_ENTERED
- ENTERED_PORTRAIT_WAITING_FOR_GROUP
- UNKNOWN

### assignment_role

- A
- B
- C
- WATCHER
- null

### engagement_state

- NOT_APPLICABLE
- ALLOCATION_OPEN
- ASSIGNED_NOT_ENGAGED
- ENGAGED
- UNKNOWN

### task_state

- NOT_APPLICABLE
- PENDING
- COMPLETE
- UNKNOWN

The exact API names may change. The semantic separation may not.

---

# 3. ACT1–5 ownership

While participants may genuinely occupy different locations:

> **S3B owns per-Player physical location.**

Current persisted source:

`s3b_player_progress.player_location`

This remains the current physical-location Authority through the ACT5 terminal/handoff boundary until each Player individually enters ACT6.

S7/Teacher must not infer early location from:
- shared presentation scene;
- `game_runs.scene_id`;
- latest event;
- another Player's state.

---

# 4. ACT5→6 handoff — exact ownership

This boundary is intentionally per-Player before becoming shared.

Current handoff evidence includes:

- `s3b_player_progress.act6_handoff_observed_at`
- `s3b_player_progress.act6_entered_at`
- `s3b_player_progress.player_location`
- group barrier marker `s5_run_state.act6_entered_at`

## 4.1 Before a Player observes the ACT5 handoff

Owner:

> S3B per-Player progress.

Use current S3B location.

## 4.2 Player has observed the handoff but has not entered ACT6

Owner remains:

> S3B per-Player progress / handoff state.

Do not fabricate an exact new room.

Recommended Teacher presentation:

`transition_state = ACT6_ENTRY_OBSERVED_NOT_ENTERED`

The last exact physical location may remain separately visible if useful.

## 4.3 Player presses ENTER PORTRAIT HALL

The authoritative server mutation writes:

- `player_location = portrait_hall`;
- `act6_entered_at != null`.

For that Player:

> S3B still owns the per-Player physical location during the partial-entry barrier.

Teacher may show:

- `physical_location = portrait_hall`;
- `transition_state = ENTERED_PORTRAIT_WAITING_FOR_GROUP`

if fewer than all required Players have entered.

## 4.4 Only some Players entered

This is a legitimate mixed-location state.

Example:

```text
Gitte  portrait_hall  ENTERED / WAITING
Anna   portrait_hall  ENTERED / WAITING
Linda  prior/handoff  NOT ENTERED
```

S5 must **not** claim group physical-location ownership yet merely because an S5 row has been prepared.

Prepared S5 state is not active S5 ownership.

## 4.5 Third Player enters

The server barrier then sets:

`s5_run_state.act6_entered_at`

and starts the ACT6 S5 flow.

At that moment:

> physical-location ownership changes from per-Player S3B to shared S5.

All required Players are now physically in:

`portrait_hall`.

The historical S3B `player_location` rows remain valid evidence of handoff completion, but are no longer the current location source for later ACTs.

---

# 5. S5 ownership — ACT6 through ACT8

After the ACT6 entry barrier opens and until S6 becomes active:

> **S5 owns shared physical-location semantics.**

The Teacher projection should not keep reading `s3b_player_progress.player_location` as if it were current.

Preferred architecture:

> S5 read logic publishes a derived, read-only `shared_physical_location` from S5-owned game state.

This need not be a new persisted column.

Examples from V4 semantics:

- ACT6 → portrait_hall
- ACT7 → clock_room
- ACT8 route/foldback → route-specific intermediate state where materially exposed, then great_hall

The exact mapping belongs in the S5 owning domain, not in S7.

`s3_runtime_scene_state` may be used as a consistency/presentation check but should not be silently redefined as physical-location Authority.

---

# 6. S5→S6 ownership

S6 initialization requires completed S5 semantics.

Ownership rule for W05 should be:

1. valid active S6 row + completed S5 prerequisite → **S6**
2. otherwise, activated S5 (`s5_run_state.act6_entered_at != null`) → **S5**
3. otherwise → **S3B**

Important:

> Do not choose S5 merely because an S5 row exists.

The current remediation intentionally allows S5 preparation before the three-Player ACT6 entry barrier.

Likewise, if S5 is complete but S6 has not yet been initialized, S5 may still publish the terminal shared location (Great Hall) until the valid S6 owner appears.

If impossible ownership combinations occur, return:

`validity = INVARIANT_BREACH`

rather than guess.

---

# 7. S6 physical location

Once S6 is validly active:

> **S6 owns shared physical-location semantics.**

Preferred derived read facts:

- ACT9–10 → great_hall
- ACT11–12 → main_gate
- ACT13 escape/final cinematic → canonical escape/exterior location according to current S6 stage

Again, this can be computed by the S6 read domain without creating a persistent `player_location` mirror.

Do not continuously write these shared locations back into old S3B Player rows.

---

# 8. ACT11–12 assignment and station semantics

This is the most important semantic split.

All Players are physically at:

`main_gate`.

The separate authoritative facts are:

### Role assignment

Authority:

`s6_allocations.role_key`

Per Player:

- A
- B
- C
- WATCHER

### ENGAGE completion

Authority:

`s6_engagements`

This says whether the allocated role has entered the ACT12 engaged state.

### Station task completion

Authority:

`s6_station_tasks`

plus role-specific progress such as Station B staged progress where applicable.

Therefore the Teacher UI may render:

```text
Anna
Main Gate
Station B
ENGAGED
Lever centered
```

but must not store or declare:

`player_location = station_b`

as if Station B were the same semantic fact as physical location.

WATCHER is especially clear: it is an operational role at the Main Gate, not another room.

---

# 9. Can W05 live in S7?

## Decision

> **YES, as a Teacher aggregation/read surface — but NO, as the semantic owner or cross-ACT game engine.**

S7 is a suitable delivery boundary because:
- W05 is Teacher-facing;
- S7 already authenticates Teacher and aggregates multi-domain Teacher information;
- adding another Teacher-specific RPC would be hard to justify if S7 can expose the result safely.

However, current repository S7 semantics are not sufficient as-is.

Repository-last migration 044 currently:
- exposes every Player's `player_location` directly from S3B;
- chooses S6/S5 in a coarse way;
- uses `coalesce(s.scene_id,g.scene_id)` / equivalent old-mirror fallback patterns.

Those patterns are not valid for the new W05 Authority contract.

Therefore W05 is safe in S7 only under the following boundary:

### Owning domains publish semantics

- S3B publishes early/per-Player location + handoff state;
- S5 publishes shared location after ACT6 group entry;
- S6 publishes shared location and retains canonical allocation/engagement/task facts.

### S7 aggregates

S7:
- authenticates Teacher;
- determines the current source domain using explicit handoff milestones;
- selects the domain-published output;
- attaches source/validity metadata;
- combines physical location with role/engagement for Teacher display.

### S7 must NOT

- infer location by a large ACT/phase switch of its own;
- decide group gates;
- recalculate allocation validity;
- infer Player completion from waiting UI;
- fallback to ACTIVE `game_runs.scene/phase/step`;
- turn presentation scene into physical location without domain contract;
- repair missing/contradictory sources.

If S7 requires substantial ACT-specific business rules to produce W05, STOP and move that derivation back to the owning domain.

---

# 10. Minimal cross-domain rule that S7 is allowed to know

Some cross-domain selection is unavoidable for a Teacher aggregator.

The permitted rule is limited to **source ownership**, not gameplay progression:

```text
if valid S6 exists and S5 prerequisite is complete:
    source_domain = S6
else if S5 has passed the ACT6 group-entry activation barrier:
    source_domain = S5
else:
    source_domain = S3B
```

This does not advance the game.

It only decides which already-authoritative domain to ask for the display fact.

Contradictory combinations return INVARIANT_BREACH.

If Player and Teacher later both need this identical rule and duplication becomes material, it is a candidate for the small shared context facility discussed in Gate D. W05 alone does not justify a universal core.

---

# 11. Required W05 acceptance vectors

A W05 shadow test is not sufficient unless it covers at least:

1. ACT1 early divergent locations.
2. ACT3 one/two Players at Library, remaining Player elsewhere.
3. ACT5 route resolved, no Player entered ACT6.
4. ACT5→6: one Player entered Portrait Hall.
5. ACT5→6: two entered, third not entered.
6. Third entry opens ACT6 group barrier; all three become S5-owned Portrait Hall.
7. ACT7: all Players shared Clock Room location.
8. ACT8 route/foldback into Great Hall.
9. S5 complete but S6 not yet initialized.
10. S6 ACT9/10: Great Hall.
11. ACT11 allocation open: all physical Main Gate, role may be null.
12. ACT11 valid allocations: Main Gate + distinct A/B/C or A/B/WATCHER.
13. Invalid allocation reset: no stale role survives.
14. ACT12 partial ENGAGE: Main Gate + assigned role + mixed engagement states.
15. ACT12 all engaged.
16. WATCHER branch: WATCHER is role, not physical location.
17. reconnect during ACT5→6 partial barrier.
18. reconnect during ACT11/12.
19. missing presentation row while domain-owned location remains available.
20. contradictory owner milestones → INVARIANT_BREACH, no fallback.

Expected results must be specified independently from the existing Teacher UI.

---

# 12. Effect on CA Round II sequence

GA's current semantic recommendation is:

> **CONCUR_WITH_CHANGES with CA Gate A→B ordering.**

Specifically:

- Gate A client polling correctness may proceed as an independent bounded defect fix when authorized.
- Gate B W05 may precede a universal shared core.
- W05 should use domain-published semantic facts + S7 aggregation as defined here.
- GA's earlier proposal to put universal gate taxonomy into the first shared core should be deferred.
- A shared context facility remains justified only later if measured reuse by Player + Teacher makes it cheaper than duplicated source-selection logic.

This is a sequencing refinement of GA-092, not a change to the underlying principle that cross-domain UI arbitration must eventually stop being duplicated in browsers.
