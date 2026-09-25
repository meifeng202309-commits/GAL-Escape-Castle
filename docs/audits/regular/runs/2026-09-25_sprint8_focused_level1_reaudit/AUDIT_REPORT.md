# Sprint 8 Focused Level 1 Re-audit

Frozen correction baseline: `ec44c36e6ceaadf796e38ad2cd75c8a17fd8d884`  
Prior failed baseline: `5882830d343f6aba9c44a25fe66ad1fb8d245002`  
Correction migration: `048_sprint8_focused_level1_corrections.sql`  
ISA package: `WP-S8-01` / ACT14 presentation  
Decision: **FAIL / BLOCKED — FIVE ORIGINAL FINDINGS CLOSED; ONE ORIGINAL FINDING REMAINS OPEN; TWO ADJACENT REGRESSIONS OPEN**

## 1. Closure matrix

| Finding | Result |
|---|---|
| S8-CA-001 HIGH | **PARTIALLY_FIXED / OPEN** |
| S8-CA-002 HIGH | **FIXED_VERIFIED** |
| S8-CA-003 HIGH | **FIXED_VERIFIED** |
| S8-CA-004 HIGH | **FIXED_VERIFIED** |
| S8-CA-005 MEDIUM | **FIXED_VERIFIED** |
| S8-CA-006 MEDIUM | **FIXED_VERIFIED** |
| S8-RC-001 HIGH | **OPEN — stale finalization request is not run-bound** |
| S8-RC-002 MEDIUM | **OPEN — export schema version authority split (1.0 vs 1.1)** |

Sprint9/10 remain blocked.

---

## 2. S8-CA-001 HIGH — PARTIALLY_FIXED / OPEN

Migration048 substantially expands finalization integrity coverage.

It now checks:
- ACT1 progress / first choices;
- ACT2 first-meeting choices and meeting result;
- ACT3 puzzle resolution;
- ACT4 private route choices;
- conditional ACT5 post-inspection vote evidence;
- Sprint5 completion/vote/private-choice counts;
- Sprint6 allocations/tasks/engagements/pressure choices;
- open discussion absence;
- Station C applicability;
- audio observation state.

This is a material improvement.

However the gate still does not satisfy the canonical meaning:

> every required event/field on the actual path is present or explicitly accounted for.

### Residual defect: aggregate counts are accepted as phase-specific integrity

Examples:

`act2_ok` requires:

`resolved_discussions >= 1`

That is a run-wide count. It does not prove that the required ACT2 discussion/session evidence exists. Any later resolved discussion can satisfy the count.

More importantly, Sprint5 uses:

`s5_complete AND s5_vote_n >= 6 AND s5_private_n = 3`

where `s5_vote_n` is the total number of all rows in `s5_votes` for the run.

Sprint5 has distinct required vote phases:
- ACT6 vote;
- ACT7 clock vote(s);
- ACT8 final vote when that path is required.

ACT6 and ACT7 can create multiple rounds. Therefore aggregate vote count can remain >= 6 even if all durable vote evidence for another required phase is missing after the state machine has already advanced.

Concrete failure class:

1. a legitimate run reaches Sprint5 complete;
2. one required phase's vote evidence is lost/corrupted after progression;
3. extra vote/revote rows from another phase keep the total count above the threshold;
4. `s5_complete` remains true;
5. Sprint8 declares `session_integrity_verified=true`.

That is exactly the class the semantic finalization gate is meant to detect.

The same conceptual problem exists wherever a run-wide aggregate is used as a proxy for a specific actual-path evidence obligation.

### Test gap

The submitted live E2E verifies a healthy complete run.

It does not remove/corrupt one required phase-specific evidence set and prove that finalization rejects it while still accepting legitimate `not_applicable` paths.

### Closure condition

Integrity verification must be actual-path and phase/semantic-field specific.

CA is not prescribing the schema/query mechanism.

The gate must distinguish:
- required-and-present;
- legitimately not applicable;
- explicitly invalidated by Teacher override;
- missing technical evidence.

A global count that can be satisfied by unrelated phase rows is insufficient.

---

## 3. S8-CA-002 HIGH — FIXED_VERIFIED

The canonical JSON now explicitly includes:
- `early_choices[]` from `s3b_player_progress`;
- ACT1 choice/start/lock/timing validity;
- ACT2 first-meeting choice/start/lock/timing validity;
- ACT4 choice/start/lock/timing validity;
- allowlisted library attempts;
- allowlisted post-inspection route votes;
- previously existing knowledge/transcript/vote/Sprint5/Sprint6/Teacher/validity sections.

The original omission of the core early behavior evidence is closed.

Further integrity correctness still depends on S8-CA-001, but the export-shape omission itself is fixed.

---

## 4. S8-CA-003 HIGH — FIXED_VERIFIED

The effective CSV no longer exports raw:

`details::text`

from the database row.

Migration048 builds `payload_json` explicitly with `jsonb_build_object(...)` field allowlists for:
- `runtime_events`;
- `act6_13_event_ledger`.

This restores the explicit allowlist security boundary.

The static test now also asserts the raw `details::text` path is absent.

---

## 5. S8-CA-004 HIGH — FIXED_VERIFIED

Successful finalization now sets:

`game_runs.status='completed'`

in the same transaction as final state/export-ready persistence.

A helper resolves the latest completed/exportable run when no active run exists.

The live test additionally:
- creates a second run in the same room;
- verifies the completed run no longer blocks new-run creation;
- verifies the prior completed run remains directly exportable.

The original lifecycle contradiction is closed.

A new cross-run stale-finalization problem is separately recorded as S8-RC-001 below.

---

## 6. S8-CA-005 MEDIUM — FIXED_VERIFIED

The current function selects and locks the active `game_runs` row:

`... status='active' ... FOR UPDATE`

before checking/creating the finalization row.

Concurrent finalizers therefore serialize at the run authority boundary.

After the winner completes the run, a waiting caller can converge through the completed-run replay path.

The submitted live test uses three concurrent finalizers and reports successful convergence.

The original same-run unique-key race is closed.

---

## 7. S8-CA-006 MEDIUM — FIXED_VERIFIED

ISA's WP-S8-01 was integrated by CD with distinct provenance.

The final presentation:
- preserves/reconstructs `ending.castle_exterior`;
- overlays a visible fade to black;
- stages Mission → escaped → remembered → THEY/ZIJ → End;
- keeps THEY/ZIJ on a separate screen;
- preserves exact bilingual casing/bold behavior;
- explicitly protects `.s8-ending` from uppercase transformation.

The ISA package did not alter:
- DB/RPC authority;
- migration048;
- finalization;
- export;
- lifecycle;
- canonical localization.

The original collapsed all-at-once ending presentation is closed.

---

# 8. S8-RC-001 HIGH — stale finalization request is not bound to run identity

Status: **OPEN**

Sprint8 now correctly allows sequential runs in one room.

That makes an existing request-identity weakness newly dangerous.

## Current client request

The player client creates the finalization request identity using:

`requestIdentity("s8-finalize", session.room_code, {boundary:"act14"})`

There is no expected `run_id` in the RPC contract.

## Current server authority lookup

`s8_finalize(room, session_token, client_request_id)`:
1. authenticates a room-level player session;
2. selects the **current active run by room**;
3. applies the finalization request to that run.

It does not receive or verify which run the client intended to finalize.

## Cross-run stale-request failure

Run A completes.

Teacher starts Run B in the same room.

Player session tokens remain valid at room level.

A delayed/retried Run A finalization request can now arrive while Run B is active.

Consequences:
- early in Run B, the stale request fails against Run B instead of replaying Run A;
- more seriously, if sufficiently delayed until Run B reaches the ACT14 boundary, the old Run A request can satisfy Run B's finalization preconditions and finalize **Run B**.

Thus:

> a request generated in Run A can mutate Run B.

This violates the hard invariant:

`Room != Run`

and Pattern B stale-request isolation.

The existing same-run concurrency test does not test:

`finalize Run A → start Run B → retry/delay Run A finalization`.

## Closure condition

A finalization request must be unambiguously bound to the intended formal run, and stale prior-run requests must not mutate a later run in the same room.

CA does not prescribe the request/guard mechanism.

---

# 9. S8-RC-002 MEDIUM — export schema version has two durable truths

Status: **OPEN**

Migration046 created:

`s8_finalizations.export_schema_version`

with:
- default `1.0`;
- a check constraint allowing only `1.0`.

Migration048 changes the actual export structure and reports:

`export_schema_version = "1.1"`

in:
- the JSON header;
- the `session_finalized` runtime event.

But migration048 does not migrate/update the durable `s8_finalizations.export_schema_version` authority.

Therefore a finalized run now contains:
- finalization row: `1.0`;
- exported document/event: `1.1`.

This is an authority split over the schema version.

The current exporter hides it by hardcoding `1.1` rather than consuming the finalization-row value.

## Why it matters

Schema version is canonical provenance for post-game consumers.

A future query/tool reading the finalization table and a consumer reading the exported JSON can legitimately disagree about the same run.

## Closure condition

There must be one coherent durable schema-version meaning for a finalized/exported run.

---

# 10. Canonical Ownership Check

**PASS.**

Product correction surfaces:
- migration048 — CD-owned;
- game presentation/CSS/test — ISA-authored inside CA allocation and integrated by CD;
- live/static tests — CD-owned/integrated.

No protected localization, game-script or visual canonical source was modified by CD/ISA in the product correction.

ISA migration authority remained prohibited.

---

# 11. CD / ISA cooperation provenance relevant to product audit

PASS for product provenance.

CA can reconstruct:
- ISA allocation;
- ISA branch/commits;
- CD coordination;
- ISA handoff;
- CD integration commits;
- final integrated baseline.

The separate process audit records one CD Action Log compliance defect, but that does not obscure the frozen product baseline sufficiently to prevent this audit.

---

# 12. Recurring Patterns A–F

| Pattern | Result | Evidence |
|---|---|---|
| A — local correctness / cross-module handoff | FINDING | S8-RC-001: room-level active-run lookup allows a prior-run finalization request to target a later run. |
| B — distributed failure / stale request / retry | FINDING | S8-RC-001: same-run concurrency is fixed, cross-run delayed replay is not. |
| C — UI rule vs server rule | PASS | finalization/export authority remains server-side. |
| D — current state vs historical evidence | FINDING | S8-CA-001: aggregate counts can falsely certify missing phase-specific historical evidence. |
| E — authority accretion | FINDING | S8-RC-002: durable finalization metadata says schema 1.0 while output/event says 1.1. |
| F — self-confirming tests | FINDING | healthy-path live test misses phase-evidence deletion/corruption and prior-run stale finalize after next-run creation. |

---

# 13. Gate disposition

**Sprint8 focused Level1 = FAIL / BLOCKED.**

Closed:
- S8-CA-002
- S8-CA-003
- S8-CA-004
- S8-CA-005
- S8-CA-006

Open:
- S8-CA-001 HIGH — phase/actual-path integrity remains too aggregate;
- S8-RC-001 HIGH — finalization request not bound to run identity;
- S8-RC-002 MEDIUM — export schema-version authority split.

Migration048 is deployed history and immutable.

Next unused migration = **049**.

Next owner: **CD**.

Authorized correction scope:
- close the three open Sprint8 findings above;
- directly adjacent negative/stale-run/version regression evidence;
- no Sprint9/10 implementation;
- no runtime Behavior Trace/prediction;
- preserve ISA/CD governance and canonical ownership.

After correction, submit another focused Sprint8 Level1 re-audit.

Milestone independent snapshot remains scheduled after Sprint8 regular closure and before Sprint9/10 progression.
