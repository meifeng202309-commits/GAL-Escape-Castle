# Sprint 8 ACT14 Finalization / Export — Regular Level 1 Audit

Frozen baseline: `5882830d343f6aba9c44a25fe66ad1fb8d245002`  
Implementation commits:
- `2b18cde6bc21be3517f6cd38900df8f043095624`
- `5882830d343f6aba9c44a25fe66ad1fb8d245002`

Deployed migrations:
- `046_sprint8_act14_finalization_export.sql`
- `047_sprint8_export_completeness.sql`

Decision: **FAIL / BLOCKED — SIX FINDINGS**

## 1. Finding summary

| Finding | Severity | Status | Summary |
|---|---|---|---|
| S8-CA-001 | HIGH | OPEN | `session_integrity_verified=true` is granted after checking only a narrow late-Sprint subset, not all required data on the actual ACT1–13 path. |
| S8-CA-002 | HIGH | OPEN | Canonical JSON export omits core early behavior evidence, including ACT1 / ACT2 first-meeting / ACT4 locked choices and timestamps. |
| S8-CA-003 | HIGH | OPEN | CSV export violates the explicit allowlist-only security rule by serializing raw ledger `details` directly. |
| S8-CA-004 | HIGH | OPEN | Finalization sets `game_completed=true` but leaves `game_runs.status='active'`, blocking future runs in the same room and keeping the completed run as the active run. |
| S8-CA-005 | MEDIUM | OPEN | Concurrent finalization is not truly idempotent; two near-simultaneous finalizers can race into a unique-key error. |
| S8-CA-006 | MEDIUM | OPEN | ACT14 reveal does not implement the canonical fade / staged pauses / separate-screen ending sequence; all lines appear simultaneously. |

Sprint9/10 remain unauthorized.

## 2. S8-CA-001 HIGH — semantic session-integrity gate is incomplete

### Canonical requirement

V4.0 §24.2 and V2.4 §15.5 define:

`session_integrity_verified=true`

to mean that for the **actual path taken**, every required event/field either:
- has a real value; or
- has an explicit absence / validity reason.

This is a semantic whole-run assertion, not merely a late-game readiness check.

### Current implementation

`s8_finalize(...)` verifies only:

- 3 room players;
- 3 Sprint6 allocations;
- 3 station tasks;
- 3 engagements;
- 3 ACT12 pressure choices;
- no open discussion;
- Station C branch applicability;
- aggregate audio consumption status.

It does **not** verify required earlier-path evidence such as:

- ACT1 locked first choices + timestamps/validity;
- ACT2 first-meeting private choices;
- ACT2/5 actual discussion/vote evidence;
- ACT3 puzzle/route evidence where required;
- ACT4 locked choices;
- ACT5 post-inspection route vote where applicable;
- Sprint5 ACT6/7/8 choices/votes;
- branch-specific evidence completeness;
- knowledge/provenance records required by the path;
- Teacher override validity/absence semantics for skipped fields.

Yet after the narrow checks pass it unconditionally writes:

`session_integrity_verified=true`

and enables final export.

### Why reaching ACT14 is not equivalent to integrity verification

State-machine progression proves that enough state existed to advance at the time.

It does not prove that the durable evidence required for post-game analysis still exists, is complete, or has an explicit validity/absence reason.

The integrity gate exists precisely to verify the persisted analytical record before declaring it final.

### Why current tests miss it

The live E2E runs a healthy happy-path fixture and checks that finalization succeeds.

It does not corrupt/remove one required early behavior field or create a legitimate missing/override case and verify that integrity semantics respond correctly.

### Closure condition

The finalization gate must semantically cover all required fields/events on the actual path and only set `session_integrity_verified=true` when each is either present or explicitly accounted for by canonical validity/absence semantics.

CA does not prescribe one monolithic query or schema.

## 3. S8-CA-002 HIGH — canonical JSON omits core early behavior evidence

V4.0 defines the exported JSON as the primary post-game GPT-analysis input.

Core behavior evidence explicitly includes:
- ACT1 first private action;
- ACT2 first-meeting choice;
- ACT4 known/unknown-style first choice;
- associated timestamps / validity;
- route/game-only decisions where analytically relevant.

These are durably stored in:

`s3b_player_progress`

including:
- `act1_choice_id`
- `act1_locked_at`
- `first_meeting_choice`
- `first_meeting_locked_at`
- `act4_choice_id`
- `act4_locked_at`
- timing validity fields.

The final effective export function in migration047 does **not** read `s3b_player_progress` at all.

It also does not read:
- `s3b_library_attempts`;
- `s3b_post_inspection_route_votes`.

The JSON contains later discussion votes, Sprint5 choices and Sprint6 evidence, but the early private choices that directly feed Planning vs spontaneity / Novelty vs familiarity / group-role analysis are absent from the canonical JSON.

The flat CSV event ledger is not a substitute because:
- JSON is the canonical post-game analysis format;
- the early fields must not require inference from incidental event text;
- some early evidence is stored in dedicated tables, not fully represented by the exported JSON sections.

### Closure condition

The canonical JSON must include the actual early behavior/game evidence required by V4.0 post-game analysis, with timestamps, validity and provenance as applicable, through explicit allowlisted fields.

## 4. S8-CA-003 HIGH — CSV violates the allowlist-only security hard rule

### Canonical hard rule

V4.0 §24.4 / V2.4 §15.2:

> Export must be generated from an explicit analysis allowlist / DTO.

and:

> Do not directly serialize database rows.

### Current CSV path

Migration047 builds the CSV ledger by unioning:

- `runtime_events`;
- `act6_13_event_ledger`.

For both sources it carries the database `details` JSON object into the ledger and emits:

`details::text`

directly as `payload_json`.

This is not an explicit payload allowlist. It exports whatever fields happen to exist inside each event row.

### Why the current static secret test is insufficient

The static test checks for secret-like field names inside explicit `jsonb_build_object(...)` export construction.

That cannot protect the CSV raw-`details` path because arbitrary future/current event keys bypass that construction entirely.

Even if no current event happens to contain a token, the implementation violates the security architecture and makes future event-schema growth capable of silently entering export.

### Closure condition

CSV `payload_json` must be produced through an explicit export-safe event mapping/allowlist. No raw row JSON/details blob may bypass that boundary.

## 5. S8-CA-004 HIGH — completed formal run remains active

### Canonical run lifecycle

V4.0 §24.3:

- Room = multiplayer access container;
- Run = one concrete playthrough;
- the same room may have sequential runs;
- restart creates a new run_id;
- old run remains preserved.

### Database lifecycle

`game_runs.status` is defined as:

`active | completed`

with a unique partial index allowing only one:

`status='active'`

run per room.

`s2_get_active_run(...)` returns only `status='active'`.

`s2_start_run(...)` rejects a room if any active formal run exists.

### Sprint8 finalization defect

`s8_finalize(...)` sets:

- `session_integrity_verified=true`;
- `game_completed=true`;
- `export_ready=true`;
- `completed_at`;

but never changes:

`game_runs.status`

from `active` to `completed`.

Consequences:

1. a completed game remains the room's active formal run;
2. `s2_start_run` cannot create the next run in that room;
3. all generic “active run” helpers continue to target an already completed playthrough;
4. the persisted run lifecycle contradicts `game_completed=true`.

This is a finalization defect, not future restart functionality.

### Closure condition

A finalized formal run must reach a coherent completed lifecycle state while preserving reconnect/export access to the completed run and permitting the canonical future creation of a new run_id in the same room.

CA does not prescribe the completed-run lookup/export mechanism.

## 6. S8-CA-005 MEDIUM — concurrent finalization race

### Current idempotency flow

`s8_finalize(...)` first queries:

`s8_finalizations`

and returns replay success if a row already exists.

Only **after that check** does it lock:

`s6_run_state ... FOR UPDATE`.

### Race

Two players/tabs can call finalization almost simultaneously:

1. transaction A checks finalization row: absent;
2. transaction B checks finalization row: absent;
3. A acquires Sprint6 row lock;
4. B waits;
5. A inserts `s8_finalizations(run_id ...)` and commits;
6. B acquires the Sprint6 lock;
7. B does not re-check `s8_finalizations`;
8. B attempts the same run_id insert and hits the primary-key/unique constraint.

The final database state remains single-copy, but the second caller receives an avoidable error rather than the promised idempotent completion result.

This is particularly relevant because all three player clients can reach the ACT13 boundary and expose the finalize button.

The current E2E tests only sequential same-request replay, not concurrent callers.

### Closure condition

Concurrent/retried finalization must converge to one final state and successful idempotent/recoverable responses without a losing caller failing on uniqueness.

## 7. S8-CA-006 MEDIUM — ACT14 canonical reveal sequence is collapsed

V4.0 ACT14 requires:

- castle exterior slowly fades to black;
- Mission complete;
- You escaped;
- pause;
- bold “But the castle remembered...”;
- pause;
- “THEY know who you are.” on a separate screen;
- End.

The exact typography itself is correctly preserved.

However `renderSprint8(...)` renders all five localization keys at once in a single `.s8-ending` section.

There is no ACT14:
- fade-to-black transition;
- timed staged reveal;
- pause;
- separate-screen transition for the THEY/ZIJ line.

The CSS adds only static grid styling.

This changes the canonical ending presentation and timing.

### Closure condition

ACT14 must preserve the specified staged reveal/fade/pause semantics while keeping the already-correct bilingual text and exact typography.

## 8. What passed

### ACT14 text / typography source

The canonical localization keys are consumed without modifying the protected catalog.

The locked lines remain whole-sentence bold.

There is no `.s8-ending` uppercase transform.

The English/NL/ZH canonical wording is preserved.

### Pending audio ordering

Client finalization calls:

`flushSprint6AudioConsumptions()`

before `s8_finalize(...)`.

### Export gating

Teacher export RPC requires:
- Teacher authentication;
- `export_ready`;
- `session_integrity_verified`;
- finalization row.

### JSON allowlisting

Most JSON sections are explicitly built field-by-field rather than serializing table rows.

The secret-exclusion concern in this audit is specifically the CSV raw event-details path, not the explicit JSON object sections.

### NORMAL/AUDIT source contract

Filename suffix and behavior-dataset eligibility logic are source-correct.

CD successfully live-tested AUDIT export.

NORMAL finalization/export live E2E remains **NOT VERIFIED** in the submitted evidence.

The cited missing `s5_verify_expire_discussion` helper is not unexpected deployment drift: migration042 intentionally revoked/dropped that temporary verification helper.

This evidence limitation does not create a separate product finding in this audit because the mode branch is straightforward and other blocking defects already prevent release.

### No future-scope leakage

No ACT15/16, runtime Behavior Trace, prediction module or Sprint9 asset work was added.

## 9. Canonical Ownership Check

**PASS.**

Sprint8 implementation changes:
- migrations046–047;
- player/Teacher runtime;
- CSS;
- tests.

No protected GA/Teacher/VA canonical source is modified.

ACT14 localization is consumed from the existing canonical catalog.

## 10. Recurring Patterns A–F

| Pattern | Result | Evidence |
|---|---|---|
| A — local correctness / cross-module handoff | **FAIL** | S8-CA-004: local completion flags conflict with formal Run lifecycle authority. |
| B — happy path / distributed failure | **FAIL** | S8-CA-005: sequential replay passes, concurrent finalizers can race. |
| C — UI rule vs server rule | PASS | completion/export authority is server-side; no UI-only gate is relied upon. |
| D — current state vs historical evidence | **FAIL** | S8-CA-001/002: whole-run integrity and canonical JSON do not cover all actual-path evidence. |
| E — authority accretion | PASS | no new ungoverned Teacher/game authority was found. |
| F — self-confirming tests | **FAIL** | healthy-path integrity test cannot detect omitted early evidence; secret scan cannot detect raw CSV `details` serialization; concurrent finalization and staged ending are not tested. |

## 11. Gate disposition

**Sprint8 regular Level1 = FAIL / BLOCKED.**

Open:
- S8-CA-001 HIGH
- S8-CA-002 HIGH
- S8-CA-003 HIGH
- S8-CA-004 HIGH
- S8-CA-005 MEDIUM
- S8-CA-006 MEDIUM

Migrations `046–047` are deployed history and must remain immutable.

Next unused migration = **048**.

Next owner: **CD**.

Authorized correction scope:
- close S8-CA-001..006;
- add directly adjacent static/live/concurrency evidence;
- preserve Sprint1–7 verified behavior and all closed Level3 findings;
- preserve owner-first canonical governance;
- no Sprint9/10 implementation.

After correction, submit a focused Sprint8 Level1 re-audit request.

The planned milestone independent snapshot remains scheduled **after Sprint8 reaches regular closure and before Sprint9/10 progression**. It is not run yet because Sprint8 is still blocked.
