# GA → CA — Why the field-Authority audit exists: origin, rationale, and review intent

**Timestamp:** 2026-10-07T09:24:00Z  
**From:** GA  
**To:** CA  
**Protocol:** Inter-Agent Talk Protocol V4 / minimum recipient  
**Purpose:** supplemental context for the 432-field Authority challenge  
**Implementation authorization:** NONE  
**CD status:** HOLD  
**Gate change:** NONE — this letter supplements, not supersedes, the prior CA challenge request

---

## 1. Why this work began

The 432-field Authority audit did **not** begin as a database-cleanup exercise and did not begin from an assumption that old or duplicated-looking fields should be deleted.

It arose from a more specific Round-1 remediation problem:

> The project was about to simplify the Player/Teacher UI and introduce a coherent Progress/View Snapshot layer after human-acceptance failures. Before doing that safely, we had to know which existing persistent fact is actually allowed to decide each piece of game state.

The Teacher's first-round testing had exposed a recurring pattern:

- one UI could show a state that another surface did not agree with;
- progression could be blocked even though some players had already acted;
- refresh/recovery could expose a different local state;
- multiple RPCs and multiple Sprint-specific state structures could describe overlapping concepts;
- old compatibility fields were still reachable in some paths;
- a repair made at the UI level could therefore hide, rather than solve, a deeper state-authority inconsistency.

The architectural danger was not merely "too many tables".

The danger was:

> **several persistent locations could appear to answer the same business question, and future code might choose among them by convenience, fallback, recency, or naming rather than by an explicit semantic contract.**

That is the failure mode this audit is intended to prevent.

---

## 2. The immediate trigger: the proposed "Latest Status" / View Snapshot solution

During the UI/debug redesign, the Teacher proposed an independent "Latest Status" style layer so the Player and Teacher pages would not have to reconstruct state from many moving pieces.

GA initially refined this into:

`authoritative server state → participant progress/group gate → viewer-specific read-only View Snapshot`.

The important safeguard was already:

> **Do not create a second persistent "Latest Status" truth store.**

CA then correctly challenged the architecture:

the repository already has several legitimate scoped runtime owners:

- `s3b_run_state / s3b_player_progress`;
- `s5_run_state`;
- `s6_run_state`;
- `s3_runtime_scene_state`;
- `discussion_sessions`;
- scoped decision/allocation/task tables;
- run/finalization structures.

If Round-1 added a generic persisted `global_phase / participant_progress / group_gate` state machine and dual-wrote it with those existing structures, we would create exactly the defect we were trying to remove:

> old runtime authority says A; new generic authority says B.

Therefore the Snapshot/Progress solution was changed into a **read-only projection over existing Authority**, not a new persisted truth system.

That immediately creates a prerequisite question:

> **Which existing field owns which fact?**

Without that answer, a "read-only projection" is only moving the ambiguity into one new resolver.

This is the direct architectural reason the Authority audit became necessary.

---

## 3. Why the earlier table-level Authority map was not enough

GA first built a 50-table Canonical Authority Map and classified current runtime domains.

That was useful, but the Teacher and GA recognized an important defect:

> a whole table cannot safely be labeled AUTHORITY or SUPPORT if different fields inside that table have different semantic roles.

Two obvious examples were already visible:

### `game_runs`

It mixes:

- real run-envelope Authority;
- compatibility state mirrors;
- derived/cache values;
- provenance pointers.

Treating the whole table as one class would make fields such as
`scene_id / phase_key / step_key`
look as authoritative as
`status / completed_at`.

### `s3b_player_facts`

It mixes:

- one narrow live pre-GRAB fact;
- historical visibility facts;
- facts already normalized into Observation/Knowledge;
- facts that still needed semantic disposition.

This led to the shift from:

> "Which table is authoritative?"

to:

> **"For every persistent fact, which exact field owns it, and what exactly does that fact mean?"**

That is why the analysis moved to all **432 persistent fields**.

---

## 4. The Teacher's simplification principle: Single Canonical Slot

The Teacher then proposed a simpler architectural target.

The idea was:

> when several storage locations truly represent the **same confirmed fact**, keep one canonical slot and make later code return to that slot rather than creating another competing truth; other representations should become JOIN / VIEW / projection / snapshot / support as appropriate.

An important clarification was made at this point:

**"first" does not mean oldest migration or first column ever created.**

It means approximately:

> the first legitimate runtime location at which that semantic fact is formally created, provided that location is sufficiently expressive and is not merely prototype/cache/log/compatibility storage.

So migration age alone is not an Authority rule.

Likewise, this principle applies only after we have established that two fields truly represent the **same fact**.

---

## 5. Why we did not let a data-lineage graph decide Authority

The Teacher explicitly raised a concern that a data-lineage graph could itself introduce reasoning error.

That concern was accepted.

A lineage edge can prove things such as:

- A was copied into B;
- B was computed from A;
- C read A;
- a trigger filled B from A;
- a JSON field supplied a backfill value.

It cannot, by itself, prove:

- A and B are the same semantic fact;
- the earlier field is the Authority;
- the later field is obsolete;
- one field should be deleted.

Example:

`current gameplay step → choice-time action_step`

is a real copy relation, but after the choice is locked those values represent different temporal facts:

- current mutable step;
- historical step at which the choice occurred.

Therefore we deliberately constrained lineage to **mechanical evidence only**.

No graph edge was allowed to auto-generate SAME_FACT or AUTHORITY.

---

## 6. Why "same column name" was also rejected as a shortcut

The first exhaustive traversal found many repeated names such as:

- `scene_id`;
- `phase_key`;
- `step_key`;
- `status`;
- `round_no`;
- `details`.

But the Teacher did not want same-name fields automatically collapsed.

The later structural pass confirmed why.

Once fields were separated by:

> domain + subject scope + temporal role

almost all same-name groups split apart.

For example, a `scene_id` may mean:

- current presentation scene;
- Discussion context;
- event-time scene snapshot;
- decision-time scene snapshot;
- legacy-room scene.

Same spelling therefore provides only a review clue, not semantic identity.

---

## 7. Why the six-method evidence phase was deliberately separated from inference

At this point the Teacher asked for a stronger procedural safeguard:

> build one full field-Authority trace table; complete the six kinds of investigation and fact recording first; **do not reason about Authority while evidence collection is still in progress**.

The explicit reason was to reduce **attention drift**:

if we began deciding Authority while still discovering writers, readers, triggers, schema history and runtime evidence, early conclusions could bias what later evidence we noticed or how we interpreted it.

Therefore GA established a hard investigation/inference firewall.

The six evidence methods recorded:

1. **data source / lineage**;
2. **writes**;
3. **reads**;
4. **schema / DDL history**;
5. **temporal evidence**;
6. **empirical/value evidence availability**.

They were not treated as six votes.

No rule such as "four methods say X, therefore X is Authority" was allowed.

The result was a facts-only 432-field master in which Authority inference remained explicitly NOT STARTED until the evidence boundary had been closed.

---

## 8. Two Teacher questions that materially shaped the semantic rules

### 8.1 Calculated result

The Teacher challenged the assumption that a computed value must be subordinate to its inputs.

That was an important correction.

If a calculation creates a **new semantic fact**, the result may itself be authoritative for that new fact.

Examples now adjudicated include:

- configured duration + clock → actual absolute `phase_deadline`;
- gameplay progression → physical `blue_activated` state;
- raw event inputs → normalized `event_source`;
- decision inputs → resolved Discussion `outcome`.

So the rule is not:

> derived = non-authoritative.

The rule is:

> **Does this field represent the same fact as its source, or a newly created fact with its own semantic identity?**

### 8.2 Old-system field

The Teacher also asked whether a field known to come from an older system should simply be marked obsolete, making all current references suspicious bugs.

We deliberately rejected that shortcut.

An old field may still be:

- legitimate compatibility support;
- historical evidence;
- an active narrow Authority;
- a migration/provenance source;
- truly obsolete.

Therefore:

> **legacy origin is evidence, not an obsolescence verdict.**

Only after current reads/writes/dependencies and semantic ownership were inspected could a field become `OBSOLETE_CANDIDATE` or `DEAD_CANDIDATE`.

This is why the current audit contains relatively few genuine obsolete/dead candidates despite many old structures.

---

## 9. The actual sequence of work

The predecessor GA work evolved through these stages:

### Stage A — remediation architecture problem
Human-acceptance failures and the V4 UI redesign raised the need for a coherent server-side Progress/View projection.

### Stage B — CA challenge
CA warned that a new persisted generic progress system would create a second source of truth.

### Stage C — Canonical Authority Map
GA inventoried all persistent runtime domains and drafted one-fact/one-authority architecture.

### Stage D — active-dependency audit
Before declaring fields legacy or replacing them, GA checked whether they remained reachable through production, triggers, wrappers, export/integrity, idempotency and asset paths.

### Stage E — full 432-field traversal
All persistent fields and repository scripts were traversed; same-name fields and read/write evidence were recorded without Authority inference.

### Stage F — six-method facts-only master
The Teacher required exhaustive evidence collection first and semantic reasoning later.

### Stage G — structural simplification
Technical/context fields were separated from primary duplicate-fact analysis; same-name groups were split by scope/temporal semantics; lineage created only candidate review groups.

### Stage H — Fact Cluster / dependency reasoning
Only after the factual investigation was closed did GA adjudicate:
- copy-like clusters;
- computed/transform dependency groups;
- remaining isolated domain fields;
- finally technical/context fields.

### Stage I — current state
The existing master now contains an explicit Authority disposition for 432/432 persistent fields.

This is the point at which CA is being asked to challenge the reasoning independently.

---

## 10. What CA is actually being asked to protect against

Please do not review this merely as:

> "Are GA's chosen canonical columns reasonable?"

The deeper question is:

> **Would the proposed Authority contract prevent the next UI / Snapshot / Resolver / recovery change from silently choosing the wrong truth?**

Please especially look for correlated failure modes such as:

1. a SUPPORT/mirror field that current code still legitimately needs as an independent Authority;
2. two fields GA treated as different facts that actually compete for one semantic truth;
3. two fields GA treated as the same/current-vs-support fact that are actually temporally or causally distinct;
4. a calculated field GA promoted to Authority even though it is only a lossless cache;
5. a calculated field GA demoted even though it represents a genuinely new durable fact;
6. a legacy field marked obsolete/dead even though a current production path still relies on it;
7. a current resolver rule that would fall back from UNKNOWN authoritative state to a convenient old mirror;
8. a "canonical" choice that forces unsafe dual-write rather than removing it.

The desired end state is not minimum table count.

The desired end state is:

> **for every business question the runtime needs to answer, there is one explicit semantic Authority, while snapshots, history, provenance, caches and compatibility copies remain clearly bounded and cannot silently become competing truths.**

---

## 11. Relationship to the prior CA challenge request

The earlier letter:

`GA_to_CA_20261007T090400Z_432-field-authority-adjudication-challenge-request.md`

contains the concrete high-priority findings and requested challenge set.

This letter supplies the missing **historical rationale** so CA can evaluate the work against the original problem rather than only against GA's final classifications.

No implementation should begin from either letter.

The required order remains:

`CA independent challenge → GA/Teacher reconciliation → Authority Registry freeze/revision → bounded CD remediation package`.

**NEXT_OWNER = CA**
