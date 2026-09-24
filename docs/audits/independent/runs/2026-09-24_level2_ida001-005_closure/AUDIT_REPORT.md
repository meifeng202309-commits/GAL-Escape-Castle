# Level2 Targeted Independent Closure Audit — IDA-001..005

Original Level3 baseline: `2acfe324d05c8bea2fb96d7132ba29f894270b38`  
Correction baseline: `b4248132842a2e660ca1ba4e15605eff75c78dff`  
Implementation interval: `71880985f70c8a95c24f7659e14c0e17bcb3dc1b..b4248132842a2e660ca1ba4e15605eff75c78dff`  
Additive migrations: `037`, `038`, `039`  
Audit level: **Level 2 — Targeted Independent Closure Audit**  
Decision: **FAIL / BLOCKED**

## 1. Closure matrix

| Finding | Level2 result | Disposition |
|---|---|---|
| IDA-001 HIGH | **PARTIALLY_FIXED / NOT VERIFIED** | Source-level competing resolver is corrected, but required NORMAL deadline + reconnect proof is absent. |
| IDA-002 MEDIUM | **PARTIALLY_FIXED / OPEN** | Durable audio occurrence/consumption state exists, but a failed consumption write is not durably retried; completed audio can still replay after reconnect. |
| IDA-003 HIGH | **FIXED_VERIFIED** | RLS + explicit browser-role table revoke now make Station B progress fail-closed in source; CD also supplied deployed REST denial evidence. |
| IDA-004 HIGH | **PARTIALLY_FIXED / NOT VERIFIED** | Automatic exactly-once cross-Sprint triggers exist, but current live E2E still manually calls Teacher initializers and therefore does not verify the closure condition. |
| IDA-005 HIGH | **PARTIALLY_FIXED / OPEN** | Append-only phase/audio ledger exists, but post-run forensic reconstruction is not dynamically demonstrated and audio outcome history can still be lost through IDA-002. |

Sprint7 remains blocked.

## 2. IDA-001 — PARTIALLY_FIXED / NOT VERIFIED

### Source-level correction is materially sound

Migration 037 changes the ownership boundary:

- generic `s2_refresh_discussion(...)` detects `scene_id='sprint6'`;
- it delegates to `s6_refresh_owned_discussion(run_id)`;
- the Sprint6 owner locks `s6_run_state`;
- it locks the exact current Sprint6 discussion;
- it resolves the discussion and advances `s6_run_state.phase_key` in the same transaction;
- `s6_get_player_state(...)` also invokes the Sprint6 owner before returning state;
- a durable `discussion_deadline_advanced` event is appended.

This removes the original deterministic split where generic Sprint2 resolved the shared row while Sprint6 state remained behind.

### Why closure is not yet VERIFIED

The Level3 closure condition required actual NORMAL-path evidence for:

- ACT9 timed discussion;
- ACT10 timed discussion;
- ACT11 timed discussion;
- poll/reconnect at or after deadline.

Current repository tests do not contain such a test.

The unchanged `tests/sprint5-live-e2e.js` still:
- uses AUDIT setup;
- calls `s6_close_discussion_v2` directly through `s6close(...)`;
- therefore does not exercise the NORMAL post-deadline browser polling path.

`tests/level3-closure-static-check.js` only checks source fragments.

### Disposition

**Source fix accepted; runtime closure remains NOT VERIFIED.**

No new code defect is confirmed in the new owner function itself.

### Required closure evidence

Demonstrate NORMAL deadline expiry for ACT9/10/11 through the actual runtime polling/reconnect path, with no direct manual close standing in for the timer transition, and show that discussion + Sprint6 phase converge under one owner.

## 3. IDA-002 — PARTIALLY_FIXED / OPEN

### What is fixed

Migration 037 introduces durable occurrence identity:

- `s6_audio_occurrences`;
- `s6_audio_consumptions`;
- `s6_run_state.feedback_audio_occurrence_id`;
- player-specific `audio_consumed` state;
- `s6_mark_audio_consumed(...)`;
- append-only `audio_triggered` / `audio_consumed` events.

The browser now uses occurrence ID rather than only cue key, so repeated use of the same cue can be distinguished from the previous occurrence.

### Residual distributed failure

The browser marks completion only through:

`markSprint6AudioConsumed(...)`

after an `ended` event or intentional stop.

That function currently does:

`rpc(...).catch(console.warn)`

and does not persist or retry a failed consumption write.

Failure sequence:

1. audio occurrence really finishes in the browser;
2. network is unavailable / request never commits;
3. the catch path only logs a warning;
4. page reload/reconnect resets in-memory `sprint6AudioIdentity`;
5. server still reports the occurrence as unconsumed;
6. the already-completed one-shot can play again.

The remediation therefore closes the ordinary reconnect path, but not the response/network-failure path that the project’s distributed-system rules require CA to challenge.

### Disposition

**PARTIALLY_FIXED / OPEN.**

### Closure condition

A completed/stopped critical one-shot must not become replayable merely because the consumption acknowledgement could not reach the server before reload/reconnect. Failed consumption recording must remain recoverable without suppressing a genuinely new occurrence.

CA is not prescribing the storage/retry mechanism.

## 4. IDA-003 — FIXED_VERIFIED

Migration 037 now explicitly:

- enables RLS on `s6_station_b_progress`;
- revokes all table privileges from:
  - `public`;
  - `anon`;
  - `authenticated`.

No later migration 038/039 re-grants direct table access.

The governed Station B RPC remains SECURITY DEFINER and continues to own the state transition.

CD additionally reported deployed evidence:

- `relrowsecurity=true`;
- anon SELECT = false;
- authenticated SELECT = false;
- publishable/anon REST request returned HTTP 401 / PostgreSQL 42501 permission denied.

CA did not independently query the production privilege catalog, but the final additive source chain is itself fail-closed for browser roles and is consistent with the submitted live denial.

**IDA-003 HIGH → FIXED_VERIFIED.**

## 5. IDA-004 — PARTIALLY_FIXED / NOT VERIFIED

### Source-level correction is materially sound

Migrations 037–039 introduce:

- internal `s5_ensure_initialized(run_id)`;
- internal `s6_ensure_initialized(run_id)`;
- deferred cross-Sprint triggers;
- run-row locking;
- PK + `ON CONFLICT DO NOTHING` idempotency;
- compatibility fix for heterogeneous trigger row types;
- canonical ACT6 DiscussionRoom restoration through `s5_configure_discussion(...)`.

The old Teacher initialization RPCs now wrap the idempotent ensure functions rather than being the only possible progression path.

This is the correct architectural direction and no immediate double-initialization defect was found.

### Why closure is not yet VERIFIED

The original Level3 closure condition explicitly required:

- actual ACT5 terminal transition → ACT6;
- actual ACT8 terminal transition → ACT9;
- **no Teacher button press**;
- reconnect immediately after each boundary;
- exactly-once state/discussion creation.

The live E2E file was not changed.

Its fixture still explicitly calls:

`s5_initialize(...teacher...)`

and its Sprint6 continuation still explicitly calls:

`s6_initialize(...teacher...)`.

Therefore the current live suite can still pass if automatic triggers are broken, because the Teacher calls repair/cover the missing transition.

The new closure test is static only.

### Disposition

**Source fix accepted; automatic runtime handoff remains NOT VERIFIED.**

### Required closure evidence

Run the actual ACT5→6 and ACT8→9 boundaries without calling either Teacher initializer, then reconnect and prove exactly one canonical next-Sprint state/discussion exists.

## 6. IDA-005 — PARTIALLY_FIXED / OPEN

### What is fixed

Migration 037 adds:

`act6_13_event_ledger`

with ordered event identity and timestamps.

Triggers now append:
- Sprint5 phase/act/round transitions;
- Sprint6 phase/act/step/round/cinematic-stage transitions;
- audio occurrence triggers.

`s6_mark_audio_consumed(...)` appends player-specific audio outcome events.

`act6_13_get_timeline(...)` provides a Teacher-authenticated ordered forensic view without exposing the ledger table directly.

This materially resolves the prior “current state only” design.

### Remaining issues

#### A. No post-run forensic proof

The Level3 closure condition required a representative post-run query showing that after state has advanced, the ordered history can still reconstruct:
- material ACT6–13 phase transitions;
- cinematic stages;
- formal audio trigger/outcome history.

No repository test calls `act6_13_get_timeline`, and the submitted verification list does not include timeline output.

The static closure test checks only that the function/trigger strings exist.

#### B. Audio outcome completeness still depends on IDA-002

If a real audio completion occurs but `s6_mark_audio_consumed` fails before commit, no durable `audio_consumed` event exists.

Therefore the forensic history can still under-report an audio outcome that actually happened.

This is the same distributed failure as IDA-002, viewed through Pattern D / forensic completeness.

### Disposition

**PARTIALLY_FIXED / OPEN.**

### Closure condition

After IDA-002 is robustly closed, provide a representative post-run timeline showing ordered phase/cinematic/audio trigger/outcome reconstruction after the mutable current state has moved beyond those events.

## 7. Adjacent regression / authority review

### Cross-Sprint trigger recursion / exactly-once

No new confirmed defect found.

The deferred triggers:
- fire from prior-Sprint state changes;
- call internal ensure functions;
- lock the formal run row;
- use primary-key conflict protection;
- remain idempotent if Teacher compatibility wrappers are later called.

Migration 038 correctly removes dependence on trigger-row fields that do not exist in both source table shapes.

Migration 039 restores the canonical ACT6 DiscussionRoom construction omitted in the first automatic-entry implementation.

### Discussion authority

The generic Sprint2 resolver now delegates Sprint6-owned sessions rather than independently resolving them.

No second active deadline writer for Sprint6 was found in the correction interval.

### Direct table authority

New ledger/audio tables and Station B progress are RLS-enabled and direct browser privileges are revoked.

### Canonical Ownership Check

**PASS.**

The correction interval modifies only:
- migrations 037–039;
- player runtime code;
- a closure test.

No protected GA/VA canonical source is modified.

## 8. Recurring Patterns A–F

| Pattern | Level2 result |
|---|---|
| A — local correctness / cross-module handoff | **PARTIAL** — source ownership/handoff fixes are credible, but ACT boundary and NORMAL deadline dynamic closure are not yet demonstrated. |
| B — distributed failure | **FINDING** — audio consumption acknowledgement can fail without durable retry, reopening replay after reconnect. |
| C — UI rule vs server rule | **PASS** — Station B direct-table bypass is now explicitly fail-closed in the additive migration chain. |
| D — current state vs history | **PARTIAL / FINDING** — ledger exists, but real audio outcome can still be lost and timeline reconstruction is not dynamically proven. |
| E — authority accretion | **PASS** — Sprint6 discussion deadline ownership is delegated to one owner; ensure functions remain internal/idempotent. |
| F — self-confirming tests | **FINDING** — existing live E2E still manually initializes Sprint5/6 and directly closes Sprint6 discussions, so it cannot falsify IDA-001/004; timeline closure is static-only. |

## 9. Gate disposition

**Level2 Targeted Independent Closure Audit = FAIL / BLOCKED.**

Closed:
- `IDA-003 HIGH → FIXED_VERIFIED`.

Not fully closed:
- `IDA-001 HIGH → PARTIALLY_FIXED / NOT VERIFIED`;
- `IDA-002 MEDIUM → PARTIALLY_FIXED / OPEN`;
- `IDA-004 HIGH → PARTIALLY_FIXED / NOT VERIFIED`;
- `IDA-005 HIGH → PARTIALLY_FIXED / OPEN`.

Sprint7 remains blocked.

Migrations `001–039` are now deployed history and must remain immutable.

Next unused migration is **040**.

Next owner: **CD**.

Next action:
- close the residual IDA-002 distributed replay gap;
- supply/automate the missing runtime closure evidence for IDA-001 and IDA-004;
- close IDA-005 after robust audio outcome persistence and demonstrate post-run forensic reconstruction;
- run directly adjacent regressions;
- submit another Level2 targeted closure request.

Because this audit is FAIL/BLOCKED, the Sprint7 pre-approval risk forecast is not issued.
