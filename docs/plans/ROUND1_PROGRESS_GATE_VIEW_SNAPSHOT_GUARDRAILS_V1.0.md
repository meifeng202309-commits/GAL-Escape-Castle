# Round-1 Progress Gate + View Snapshot Guardrails V1.0

Date: 2026-10-06  
Owner: GA  
Status: Teacher-approved technical refinement for CA critical review  
Implementation authorization: NONE

## 1. Executive architecture

The refined architecture is:

```text
AUTHORITATIVE SERVER STATE
│
├─ global_phase
├─ Gitte participant_progress
├─ Anna participant_progress
├─ Linda participant_progress
└─ group_gate
        │
        ↓
viewer-specific read-only View Snapshot
        │
        ├─ PlayerViewSnapshot
        └─ TeacherViewSnapshot
                │
                ↓
fixed UI
```

Core rule:

> **Server decides where the game is. View Snapshot decides how that already-decided state is presented.**

Do not create a second persistent "Latest Status" truth store.  
Do not let Player/Teacher browsers maintain authoritative progress.  
Do not let View Snapshot infer or advance progression.

Each participant has an authoritative server-side progress record. The server evaluates progression gates. A global phase advances only when the gate condition is satisfied.

Player/Teacher pages read the server result and render it.

---

## 2. Participant progress + group gate

For any synchronized progression barrier, server-side state should conceptually expose:

```text
global_phase = X

Gitte.progress = COMPLETE / NOT_COMPLETE
Anna.progress  = COMPLETE / NOT_COMPLETE
Linda.progress = COMPLETE / NOT_COMPLETE
```

The group transition is:

```text
if all required participants satisfy the current gate
and global_phase == expected_phase:
    advance global_phase exactly once
else:
    remain in current global_phase
```

This does **not** require all GALs to display an identical local screen before the gate.

Example:

```text
global_phase = ACT1_PRIVATE_CHOICE

Gitte local presentation = COMPLETED_WAITING
Anna  local presentation = CHOOSING
Linda local presentation = COMPLETED_WAITING
```

Only when the required gate is complete does the server change the global phase.

Teacher does not infer progress from scene/location/waiting heuristics. Teacher reads the authoritative participant progress projection.

---

## 3. Teacher participant-status rule

For Teacher-facing participant completion:

- server explicitly reports completed -> display **COMPLETED**;
- server explicitly reports not completed -> display **NOT YET COMPLETED**;
- Teacher cannot obtain authoritative state -> display **STATUS UNKNOWN / temporarily unavailable**.

Hard rule:

> **absence of a successful response must never be converted into NOT_COMPLETED or INACTIVE.**

This closes the transport-failure/domain-state ambiguity.

---

## 4. Player View Snapshot role

Player View Snapshot is a viewer-specific, read-only semantic projection of authoritative state.

Minimum intended regions:

- identity;
- lifecycle;
- scene;
- action;
- discussion;
- pocket;
- transition presentation identity.

It is not:
- a second database;
- a gameplay state machine;
- an authorization engine;
- a complete copy of Sprint3b/Sprint5/Sprint6;
- a DOM/HTML cache.

The snapshot should contain only semantic data required by the current Player UI.

---

## 5. Teacher View Snapshot role

Teacher View Snapshot is a separate viewer-specific, read-only semantic projection.

It may include Teacher-authorized information such as:
- room/run identity;
- current ACT/scene/phase;
- three participant progress/presence/location projections;
- discussion status/transcript;
- currently server-authorized operational/recovery actions;
- Maintenance/Developer diagnostics as already authorized.

Player and Teacher Snapshot schemas must remain separate.

They may share naming conventions such as:
- run identity;
- presentation scene key;
- status enum conventions.

They must not share one large DTO that is later filtered for Player use.

---

# 6. Fifteen implementation guardrails

## Issue 1 — Mixed multi-RPC state

Problem:
multiple RPCs can return data from different authoritative moments.

Refinement:
core progression is not inferred by Snapshot. Server-side `global_phase + participant_progress + group_gate` is the progression spine.

Any remaining multi-RPC projection data must still be consistency-checked before committing a new Snapshot.

A "single refresh call" is not automatically a coherent database snapshot.

## Issue 2 — Overlapping polling / stale commit

Current ~1.2s polling can overlap.

Hard rules:
- use single-flight refresh where practical;
- assign a monotonic client refresh generation;
- an older generation must never overwrite a newer committed generation.

## Issue 3 — FETCH_ERROR != INACTIVE

Read result categories must distinguish:
- authoritative success;
- not-applicable/inactive as explicitly reported;
- fetch/transport failure.

On transient failure:
- do not reinterpret gameplay state;
- retain the last confirmed presentation where safe;
- show a synchronization/connectivity warning;
- retry.

## Issue 4 — Snapshot must not become business authority

Snapshot performs normalization/projection only.

It must not independently decide:
- whether a vote is legal;
- whether a Teacher override is legal;
- whether a Pocket action is legal;
- whether progression may advance.

Where capability is displayed, it should derive from authoritative runtime projection. Server RPCs remain final validators.

## Issue 5 — Prevent Snapshot God Object growth

Inclusion rule:

> A field belongs in View Snapshot only if the current approved UI needs it to present or bind a current interaction.

Do not copy entire raw Sprint/runtime models into Snapshot.

## Issue 6 — Separate Player and Teacher schemas

Use:
- `PlayerViewSnapshot`
- `TeacherViewSnapshot`

Do not implement one all-information GameViewSnapshot and filter fields client-side.

This is both an architecture and information-boundary rule.

## Issue 7 — Snapshot contains semantic data, not HTML/DOM

Snapshot may carry:
- text keys;
- interpolation values;
- asset keys;
- semantic control/action identity;
- message data;
- status values.

Renderer owns:
- localization;
- escaping;
- HTML/DOM creation;
- responsive presentation.

## Issue 8 — One presentation owner per region

During incremental migration, each region has one presentation owner at any moment:

- Scene;
- Action;
- Discussion;
- Pocket.

When a new renderer takes ownership, the old renderer path must be disabled/removed for that region.

Do not leave duplicate Pocket/composer/action renderers active.

## Issue 9 — Safe diagnostic observability

Development/AUDIT diagnostics should make Snapshot behavior traceable using non-sensitive metadata such as:
- refresh_generation;
- run_id where appropriate;
- global phase;
- presentation scene key;
- selected source runtime;
- snapshot build result;
- discard/retain reason.

Do not log:
- session tokens;
- Teacher tokens;
- unauthorized private Player data;
- private/AUDIT data into ordinary Player diagnostics.

## Issue 10 — Snapshot must not multiply polling RPCs

W02-A first implementation uses existing runtime reads.

Do not create extra polling RPCs merely to mirror UI regions.

If a future server-side aggregate projection is justified, treat that as a separate architecture decision with its own review.

## Issue 11 — One GRAB button must preserve two canonical events

Player-facing control:

**带上物品并离开房间**  
**Neem je spullen mee en verlaat de kamer**

One Player action may execute one atomic server transaction, but internal canonical evidence remains distinct:

- `grab_completed`
- `start_room_left`

UI simplification must not erase provenance.

## Issue 12 — GRAB+leave must be idempotent

The combined authoritative action must be replay-safe.

A lost response followed by retry must not:
- duplicate item effects;
- duplicate formal events;
- duplicate discussion creation;
- repeat global progression.

Use a request identity/idempotency mechanism at the mutation boundary.

## Issue 13 — Group gate must be concurrency-safe and exactly-once

Near-simultaneous participant completion must not advance the global phase twice.

Gate transition must use an authoritative concurrency mechanism such as:
- run-row locking;
- expected-phase compare-and-set;
- uniqueness/idempotent transition protection.

Exact mechanism is implementation-owned, but the required invariant is fixed:

> many participants may reach the gate concurrently; the global transition occurs exactly once.

## Issue 14 — Authoritative transition and cinematic are separate

Combined GRAB+leave makes authoritative state correct in one server transaction.

The short "take items and leave" cinematic is client presentation only.

Do not add a persistent half-transition server state merely to hold the cinematic.

The client may temporarily hold presentation while the server has already advanced.

## Issue 15 — Local UI restoration uses Same-owner + Still-exists

Local UI state may be restored only if:

1. authoritative owner identity is unchanged; AND
2. referenced target still exists in the current View Snapshot.

Otherwise discard the local UI memory and render the neutral/default presentation of the current authoritative Snapshot.

Fixed examples:

| Local UI state | Owner check | Still-exists check | If invalid |
|---|---|---|---|
| Discussion draft/focus/scroll | same `discussion_session_id` | same discussion still exists | empty draft, no forced focus, standard transcript position |
| Pocket selected/expanded item | same `run_id` | `item_key` still in Pocket | show Pocket list with no auto-expanded item |
| Pocket local detail view | same `run_id + item_key` | current item still permits that view | use authoritative/canonical current/default view |
| Teacher internal view | same room/run context | view remains available | return to Normal / Live Operations |
| Teacher selected recovery action | same interaction identity | action still in authoritative allowed actions | no action selected |
| Transition presentation state | never restorable | N/A | always hidden |

Hard rule:

> **DISCARD means discard browser-local memory, not delete authoritative game content.**

---

## 7. Transition Overlay Mount at W02-A

W02-A should reserve a hidden `Transition Overlay Mount` in the Player shell.

This is a negligible structural addition, not early implementation of W12.

At W02-A:
- mount exists;
- mount is hidden;
- it can cover the gameplay shell later;
- no 2-second timer;
- no scene-change detection;
- no transition state machine.

At W12:
- the existing mount receives the actual behavior.

Transition presentation state is never restored across reload/reconnect/navigation.

This avoids later restructuring of Scene / Action / Discussion / Pocket solely to introduce the transition.

---

## 8. Polling and Snapshot commit model

Recommended client presentation discipline:

```text
request refresh generation N
        ↓
collect currently required authoritative reads
        ↓
validate result category / identity consistency
        ↓
build minimal viewer-specific Snapshot
        ↓
if N is stale: discard
if critical read is transport-unknown: do not convert to gameplay state
else: commit Snapshot
```

Where possible, only one refresh should be in flight.

The server progression spine remains authoritative regardless of client refresh timing.

---

## 9. GRAB+leave authoritative contract

Recommended semantic contract:

```text
ONE PLAYER CLICK
        ↓
ONE IDEMPOTENT SERVER MUTATION
        ↓
canonical GRAB effects
optional discovered carryables
grab_completed event
left_start_room = true
player_location = corridor
start_room_left event
evaluate group gate
advance next global phase exactly once if gate satisfied
        ↓
return authoritative result
        ↓
client short cinematic
        ↓
render latest authoritative Snapshot
```

Do not:
- add an item-selection checklist;
- change first-action semantics;
- auto-read hidden information;
- fabricate undiscovered optional clues;
- replace the two canonical internal events with one coarse event.

---

## 10. Effect on safest sequence

The existing authority-first sequence remains valid, with these refinements:

```text
0   Freeze known baseline / old-layout smoke

1   W05  Teacher operational-location projection
2   W03  Combined authoritative GRAB+leave
          - one bilingual Player action
          - idempotent mutation
          - preserve grab_completed + start_room_left
          - concurrency-safe group gate
3   W01  Teacher-paced Discussion lifecycle

4   W02-A Player structural no-op shell
          - stable Header / Scene / Action / Discussion / Pocket mounts
          - hidden Transition Overlay Mount
          - thin read-only Player View Snapshot
          - server progression spine consumed, not re-derived
          - no extra polling RPCs by default
          - generation / stale-commit guard
5   W10   Player identity/runtime header
6   W02-B Discussion visual adapter + responsive shell
7   W09-A Discussion local-state preservation

8   W04   Pocket renderer migration
9   W09-B Pocket local-state preservation
10  W08   Five-slot Library lock

11  W06   Teacher same-runtime recomposition
          - thin separate Teacher View Snapshot
          - server participant progress / group phase projection
12  W09-C Teacher local-state preservation
13  W11   low-risk bilingual/text cleanup

14  I0    pre-transition integrated regression
15  W12   2-second scene-transition behavior
          - uses normalized presentation scene identity
          - activates existing hidden Transition Overlay Mount
16  W13   final integrated regression + new frozen baseline
```

---

## 11. New/strengthened regression gates

### W03
Add:
- lost-response + retry;
- rapid double-click/replay;
- 2–3 near-simultaneous participant completions;
- exactly-one next-phase/discussion creation;
- both canonical events preserved;
- optional discovered item behavior preserved.

### W02-A
Add:
- stale refresh cannot overwrite newer generation;
- transport failure cannot become inactive/not-completed;
- no additional polling RPC count without explicit approval;
- View Snapshot contains no HTML/DOM;
- Player Snapshot contains no Teacher/private-only fields;
- one coherent committed presentation generation;
- hidden Transition Overlay Mount has no behavior yet.

### W09
Add Same-owner + Still-exists tests and explicit default presentation after discard.

### W06
Add:
- Player/Teacher Snapshot schema separation;
- Teacher view navigation does not destroy bound event-handler nodes;
- status UNKNOWN is possible when Teacher cannot obtain authoritative state.

### W13
Add:
- intermittent fetch failure;
- delayed/out-of-order response;
- retry/idempotency;
- concurrent gate completion;
- duplicate-renderer absence;
- diagnostics contain no tokens/private leakage.

---

## 12. Workload implication

This refinement is intended to reduce secondary-debug risk rather than dramatically reduce total work.

Current planning view:

- W02 remains approximately **3.5/5**, with regression risk near 4/5;
- W03 remains approximately **3/5**, but its acceptance gate becomes more production-realistic;
- W04 remains **3.5/5**;
- W06 remains **3.5/5**;
- W09 remains **2/5**, split by actual mount/view;
- W12 may become closer to **2/5** rather than 2.5 if normalized presentation scene identity is successfully supplied by W02-A;
- W13 remains **3.5/5** and absorbs the new race/retry/partial-failure proof.

No numerical workload change is finalized until CA independently reviews this refinement.

---

## 13. Final design principles

1. **Progression authority lives on the server.**
2. **Participant progress is server-owned, not browser-owned.**
3. **Group gates advance global phase exactly once.**
4. **View Snapshot is minimal, read-only, semantic, and viewer-specific.**
5. **Local UI state is never game truth.**
6. **Transport failure is not domain state.**
7. **Older refreshes cannot overwrite newer presentation.**
8. **One UI region has one presentation owner.**
9. **One Player action may preserve multiple canonical internal events.**
10. **Local UI memory is restored only under Same-owner + Still-exists.**
