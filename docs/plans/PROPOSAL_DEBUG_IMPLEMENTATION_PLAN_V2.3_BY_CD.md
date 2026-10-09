# Proposal of Debug Implementation Plan V2.3 by CD

**Date:** 2026-10-09

**Owner:** CD — Code Development Agent

**Status:** COMPLETE RECONCILED IMPLEMENTATION PROPOSAL / NO IMPLEMENTATION PERFORMED

**Implementation authorization:** NONE

**Branch:** `remediation/sprint9-structural-v1`

**Repository basis:** `d4b4863bed95a9425f11dc235e7a6469416c1046`

**Supersedes for current CD planning:**

- `PROPOSAL_DEBUG_IMPLEMENTATION_PLAN_V2_BY_CD.md`;
- `PROPOSAL_DEBUG_IMPLEMENTATION_PLAN_V2.1_BY_CD.md`;
- `PROPOSAL_DEBUG_IMPLEMENTATION_PLAN_V2.2_BY_CD.md`;
- `CD_TEACHER_CLARIFICATIONS_MINIMAL_IMPACT_PLAN_V1.md`.

V2.3 is the complete implementation plan. It restores the full runtime-debug and release programme from V2/V2.1 and incorporates, without dilution, the eight Teacher decisions recorded in V2.2.

It is not a code change, migration, deployment authorization or production mutation.

---

# 0. Reconciliation audit

## 0.1 What V2 and V2.1 contained that V2.2 omitted

V2.2 correctly resolved the eight disputed technical issues, but it was not a complete implementation plan because it omitted or compressed these previously planned workstreams:

1. Player polling single-flight, stale-frame rejection and error-state handling;
2. independently gated Teacher polling safety;
3. the full W05 S7 projection, shadow comparison and single-region cutover;
4. browser-reachable legacy RPC quarantine;
5. reproduced normal-path defects outside the eight disputed items;
6. the W01–W13 placement map that prevents scope drift;
7. complete static, database, concurrency and four-browser acceptance gates;
8. frozen-candidate and rollback discipline;
9. the post-fix economic gate for any shared-context abstraction;
10. STOP conditions that prevent a local bug fix from becoming a second gameplay engine.

V2.3 restores all ten.

## 0.2 What V2.2 corrects in V2/V2.1

The following V2.2 decisions replace the corresponding older positions:

| Issue | V2/V2.1 position | V2.3 controlling decision |
|---|---|---|
| All 13 TOPs | broad TOP blocked/separate | implement only after an audited minimum-information manifest; fill missing required keys with `OR` provenance |
| Discussion | remove deadline-driven NORMAL transition | preserve machinery, set NORMAL Teacher-controlled Discussion to 10,800 seconds, and add the missing S6 Teacher Continue |
| ACT7 | preserve wrong-majority classification | unchanged, now part of the complete sequence |
| ACT3 | server cooldown plus occurrence | exactly three seconds; UI says only “密码错误” for a wrong accepted attempt |
| Four-view result | server occurrence window | unique occurrence ID and three-second server window on three Players plus Teacher |
| ACT2 sign | conservative intermediate status | successful Follow Sign directly means Library; no intermediate state |
| TOP late requests | previously considered | no separate work package; only same-request idempotency needed to execute TOP once |
| Teacher operations | exact current status, not global latest event | state-level categories only; no action-by-action surveillance |

## 0.3 V2.1 corrections that remain in force

V2.3 retains V2.1's corrections to V2:

- Player polling is the first authorization unit; Teacher polling is separately gated;
- reachable legacy RPC quarantine is its own security lane;
- ACT3 cooldown/occurrence precedes the broader S5/S6 presentation adapters;
- a W01–W13 placement map remains a scope firewall;
- a shared abstraction must delete displaced calls or branches in the same release;
- domain publication is not permission to centralize gameplay decisions.

---

# 1. CD engineering thesis

The lowest-cost safe path is:

> the smallest independently reversible change that repairs one reproduced defect at its canonical owner, exposes enough identity to prove the result, and deletes or disables the displaced behavior at cutover.

The implementation follows these principles:

1. reproduced runtime defects precede speculative architecture;
2. errors never masquerade as inactivity;
3. gameplay mutations remain in S3B/S5/S6/Discussion/Pocket/finalization owners;
4. S7 may authenticate and publish Teacher-safe derived facts, but not recreate progression rules;
5. presentation contracts may be shared while gameplay resolution remains domain-owned;
6. a response may claim coherence only through one bounded SQL statement, explicit identity revalidation, or a required domain lock;
7. recovery fills declared continuation prerequisites; it does not fabricate detailed Player behavior;
8. an abstraction earns its cost only when the same release deletes displaced requests, branches or queries;
9. every package has a test boundary, rollback boundary and STOP condition;
10. unfinished final media remains outside the runtime critical path.

---

# 2. Definition of the next trustworthy trial

The next formal trial is trustworthy only when all of the following are true on one exact code SHA and migration set:

1. Player polling cannot overlap or commit a stale frame;
2. transport failure preserves the last confirmed passive view and disables unverifiable mutations;
3. Teacher polling cannot erase valid room/Discussion state because one Operations read failed;
4. W05 truthfully shows each Player's location plus separate state-level activity/role/task facts;
5. Follow Sign changes the confirmed Player location directly to Library and Teacher shows the existing equivalent of “进入图书馆”;
6. NORMAL Teacher-controlled Discussion uses a 10,800-second window and Teachers can progress generic/S5 and S6 without waiting;
7. ACT3 accepts one serialized request and rejects new unique requests for three seconds while preserving same-request replay;
8. ACT7 wrong majority, no consensus, success and fallback remain durably distinct;
9. ACT3/S5/S6 results publish a unique occurrence and common three-second server window to three Players plus Teacher;
10. reconnect reconstructs canonical state without browser history or restarted display timers;
11. current browser roles cannot execute obsolete supported-path mutations;
12. every enabled TOP transition preserves existing values, fills only audited missing prerequisites, records `OR`, and initializes the target once;
13. behavioral analysis excludes OR-sourced facts while runtime may use them;
14. reproduced direct defects required by the normal route are closed or explicitly dispositioned;
15. placeholder media completes the route without waiting for final images;
16. static, clean-schema, live, concurrency and four-view browser gates pass;
17. the release candidate is frozen and any later fix creates a new candidate.

Cosmetic recomposition, final-image replacement and an unproven universal shared context are not prerequisites.

---

# 3. Non-negotiable boundaries

Do not build:

- persisted universal `global_phase` or `participant_progress`;
- a universal gate taxonomy as the first shared API;
- ACTIVE `game_runs.scene_id / phase_key / step_key` fallback;
- cross-ACT “latest event wins” inference;
- a new Teacher W05 endpoint beside S7;
- a second active renderer after cutover;
- browser-side privacy filtering;
- fake votes, fake Player timestamps or synthetic detailed Player history;
- a generic client-submitted table/column/value writer for TOP;
- a client clock as synchronized result authority;
- UI recomposition mixed into authority-changing SQL;
- final-media dependencies in runtime acceptance;
- edits to applied historical migrations.

`OR` is provenance, never a suffix embedded in the runtime value. Store `value=library, source=OR`, never `libraryOR`.

Before implementation, recheck the repository-last migration and effective function overloads. All changes use forward migrations.

---

# 4. Complete implementation order and dependency graph

```text
P0  Freeze baseline, reproduce defects, add contract tests
 │
 A1  Player polling safety
 ├── A2 Teacher polling safety (independent; does not block B)
 │
 B1  W05 S7 shadow projection + state-level status
 B2  W05 single-region cutover, including ACT2 direct Library
 │
 ├── Q legacy RPC quarantine (independent security lane)
 │
 C1  Generic/S5 10,800-second Discussion compatibility
 C2  S6 Teacher Continue + Player/Teacher UI cutover
 │
 D1  ACT3 serialized three-second cooldown + occurrence
 D2  ACT3 four-view presentation
 │
 E1  ACT7/S5 durable result classification
 E2  S6 occurrence + S5/S6 presentation adapters
 │
 F   Other reproduced normal-path defects
 │
 T0  TOP required-information table extraction
 ├── GA script audit and approved backup values (external prerequisite)
 T1  TOP manifest/OR storage + generic transaction
 T2  Audited transition adapters and 13-transition regression
 │
 G   Integrated regression, human trial and freeze
 │
 H   Measure whether any shared context is economically justified
```

Rules for order:

- A1 is the first code authorization unit.
- A2 is allowed to reuse the proven coordinator pattern but cannot delay B.
- Q may run after A1 or B1 and must pass before G.
- C precedes D/E so result presentation is not tested against unstable lifecycle behavior.
- E1 precedes S5 overlay cutover because a correct-looking overlay over false classification is unacceptable.
- T0 may be prepared in parallel as documentation, but no TOP runtime is built before GA audits the manifest and supplies approved values.
- H is a measurement decision, not an assumed build.

---

# 5. Package A1 — Player polling safety

**Cost:** `2/5`

**Authority change:** none

**Primary surface:** `src/game/app.js` and focused browser/static tests

Replace the interval-driven refresh orchestration with a self-scheduling single-flight coordinator:

1. only one Player refresh may be in flight;
2. each refresh captures `sessionEpoch` and a monotonic generation;
3. assemble a candidate frame before committing render state/DOM;
4. discard an old epoch or generation;
5. increment epoch on logout/rejoin;
6. preserve distinct `SUCCESS`, `NOT_APPLICABLE`, `FETCH_ERROR` and `INVARIANT_BREACH` results;
7. retain last confirmed passive content on transient failure;
8. disable identity-sensitive controls until a confirmed frame returns;
9. remove the duplicate S8 read only after equivalence is proved;
10. after a successful mutation, request one immediate refresh and resume the normal cadence.

Mutation acknowledgements:

- use one request UUID for one logical action;
- retry unknown acknowledgement with the same UUID;
- clear pending state only on canonical server acknowledgement;
- never infer completion from a browser timeout;
- reject conflicting payload reuse where domain receipts support it.

Tests include reversed response order, a timer firing during an outstanding request, logout/rejoin mid-request, partial domain-read failure, lost response after commit, reconnect during voting and ACT5→6, duplicate S8 detection and privacy checks.

**PASS:** no stale overwrite and no error-to-inactive conversion.

**STOP:** requires authority changes or renderer rewrite.

**Rollback:** one client commit, no schema state.

---

# 6. Package A2 — Teacher polling safety

**Cost:** `2/5`

**Authority change:** none

Teacher polling currently fans out room, Discussion and Operations reads around an async interval. After A1 proves the coordinator primitive, or earlier only if a Teacher race is reproduced:

1. add a Teacher single-flight coordinator;
2. use a separate epoch for room/watch-target changes;
3. discard stale generations;
4. preserve a valid room/Discussion frame if Operations fails;
5. mark only the failed panel stale;
6. do not force S1/S2/S5/S7/S8 into one facade.

A2 is independently reviewable and cannot block W05 work.

---

# 7. Package B — W05 and Teacher state-level projection

**Cost:** `2–3/5`; Issue 8 is `1–2/5` incremental

**Authority change:** Teacher-safe derived read facts only

**Primary surface:** repository-last `s7_get_teacher_console`, Teacher renderer and focused SQL/browser tests

## 7.1 Versioned response contract

Return a per-Player projection containing:

```text
physical_location
transition_state
assignment_role
engagement_state
task_state
status_code
status_text_key
source_domain
source_identity
validity
reason_code
```

W05 remains Teacher-only. Player responses never receive peers' W05 facts.

## 7.2 Canonical ownership selection

S7 may know only the ownership handoff rule:

```text
valid activated S6 after completed S5 prerequisite -> S6
else S5 after the three-Player ACT6 entry barrier -> S5
else -> S3B per Player
```

- partial ACT5→6 remains S3B per Player;
- prepared-but-inactive S5 is not ownership;
- S5 owns the shared locations after the barrier;
- valid S6 owns later shared physical location;
- ACT11–12 physical location is Main Gate;
- A/B/C/WATCHER are roles, not rooms;
- contradictions return `INVARIANT_BREACH`, never a mirror fallback.

## 7.3 Issue 6 — ACT2 Follow Sign

Successful `s3b_follow_sign` directly changes that Player's canonical location to Library.

Do not add a separate sign-seen, rerouting or en-route state. After confirmation, Teacher shows the existing localized equivalent of:

```text
<Player name> 进入图书馆
```

Before confirmation, retain the existing current/waiting state. Each Player changes independently.

## 7.4 Issue 8 — state-level Player operations

Teacher displays only these state categories:

1. online/offline/reconnecting;
2. entered/in/left a named room;
3. entered a transition barrier and waiting for others;
4. discussing or waiting for Teacher;
5. vote not submitted/submitted/waiting/result;
6. puzzle active/result/solved;
7. Main Gate A/B/C/WATCHER allocation;
8. Main Gate not ready/ready/task complete/ENGAGED/waiting for others;
9. escaping/outside/waiting finalization/completed.

Read current canonical S3B progress/location, current Discussion/round submission, S5 phase/round, S6 allocation/task/engagement, finalization and connection last-seen. Do not use a global latest event or expose unrevealed choices.

## 7.5 Shadow and cutover

1. add the versioned projection without binding it to the visible table;
2. compare it to independent expected fixtures, not the old UI;
3. cover all W05/status vectors;
4. measure latency and query work;
5. cut over only W05/status cells after zero semantic mismatch;
6. delete/disable the displaced binding in the same commit.

No new endpoint, polling call, table, dual write or Player wrapper.

**PASS:** correct vectors, no privacy leak, no extra RPC and acceptable S7 cost.

**STOP:** requires universal taxonomy, persistent projection, browser privacy filtering or material S7 regression.

**Rollback:** restore only the W05/status binding; the inert read block may remain.

---

# 8. Package Q — reachable legacy RPC quarantine

**Cost:** `1–2/5` after deployed-signature verification

Treat reachable obsolete mutations as a bounded security package:

1. re-probe exact deployed signatures and grants, including `s1_submit_private_choice`;
2. prove current frontend and supported E2E paths do not call each candidate;
3. revoke browser execution through a forward migration;
4. preserve historical rows;
5. verify anon/authenticated denial and canonical mutation success;
6. inspect other superseded overloads found by the same scan without expanding scope absent evidence.

Q must pass before the frozen trial.

---

# 9. Packages C1/C2 — Teacher-controlled Discussion with minimum impact

**Cost:** `2–3/5` total

**Authority change:** one S6 Teacher mutation; duration/configuration changes elsewhere

## 9.1 Fixed NORMAL rule

For Teacher-controlled NORMAL Discussion:

```text
duration = 3 × 60 × 60 seconds = 10,800 seconds
```

Retain the existing deadline columns, helpers and compatibility paths. The intended classroom contract is that a Teacher progresses the activity before three hours. Do not claim that automatic deadline behavior has been removed; it is deliberately pushed beyond the supported class session.

Only Discussion duration changes. Do not alter password cooldowns, puzzle/hint timing, cinematics, audio, result windows, response evidence or station timing.

The three-hour value cannot be implemented as a blind constant replacement. The generic constructor originating in `database/002_runtime_runs_discussion.sql` currently validates the discussion limit within 5–3600 seconds. Before changing it, identify the repository-last effective constructor and its callers, then allow 10,800 only for approved NORMAL Teacher-paced Discussion. Do not widen unrelated limits or AUDIT behavior.

The accepted residual risk is explicit: the existing expiry machinery may still advance/close a discussion at or after 10,800 seconds, and guarded messaging may reject later messages. The supported classroom contract is therefore “Teacher-controlled within the three-hour operating window,” not logically unlimited Teacher ownership. A paused class exceeding that horizon must be tested and reported as an accepted compatibility limit, not called a PASS for Teacher-only behavior.

## 9.2 C1 — generic and S5

1. set every effective NORMAL Discussion creation/configuration and re-entry path to 10,800 seconds;
2. audit the generic constructor/caller chain and every S5 initial, revote and reconfigure call so `phase_deadline` and `discussion_time_limit_sec` agree;
3. keep existing Teacher Open Vote behavior behind a new or narrowed identity-bound mutation;
4. require expected run, interaction/phase, round and discussion-session identity so a delayed click from discussion N cannot open N+1;
5. hide the NORMAL Add Time control;
6. make direct NORMAL `s2_add_time` and `s5_teacher_add_time` calls return not applicable after authentication and before changing deadlines or writing intervention events;
7. retain deliberately approved Add Time behavior only for compatibility/AUDIT;
8. hide the three-hour countdown or display the localized equivalent of “由教师控制”;
9. keep vote resolution based on genuine submissions.

## 9.3 C2 — S6

Three hours alone would prevent the current timer-gated Player Continue. Add one Teacher-owned `s6_teacher_close_discussion`-type mutation that:

1. authenticates the Teacher token server-side;
2. accepts a request UUID and expected run/phase/step/round/discussion identity;
3. locks current S6 and Discussion rows;
4. permits only `act9_discussion`, `act10_discussion` and `act11_discussion`;
5. bypasses the three-hour wait for this authorized Teacher action;
6. closes once and transitions to `act9_console`, `act10_final_vote` or `act11_allocation` respectively;
7. records one Teacher-origin event;
8. returns an idempotent same-request replay;
9. rejects stale identity without mutation.

Do not reuse a Player-token wrapper as the Teacher public function. Reuse only the internal phase mapping after Teacher authentication and exact identity verification.

Audit every `s6_open_discussion` call for ACT9, ACT10, ACT11, no-consensus and reopen paths; do not assume the initial caller covers later rounds. Keep discussion and vote/feedback timing distinct.

The old public Player close path must be rejected server-side for new NORMAL Player requests, not merely hidden. Existing deliberately supported AUDIT behavior may remain. Verify actual `EXECUTE` grants and restrict internal helpers. This is a narrow mode guard, not a lifecycle rewrite.

Player UI keeps message composition, removes/hides the timer-gated S6 Continue and shows “等待教师继续”. Teacher UI keeps generic/S5 Open Vote and adds S6 End Discussion/Continue. NORMAL Add Time and the misleading countdown are absent.

## 9.4 C tests

- every relevant NORMAL discussion receives a 10,800-second deadline;
- generic, S5 initial/revote/reconfigure and S6 ACT9/10/11/reopen paths use the intended duration;
- no transition occurs during a representative class interval;
- Teacher opens generic/S5 voting immediately;
- Teacher closes S6 immediately;
- stale Teacher identity rejects;
- duplicate/lost-response replay is idempotent;
- Player cannot progress NORMAL S6;
- messages remain accepted until Teacher close;
- NORMAL Add Time is absent;
- direct NORMAL Add Time performs no mutation and writes no intervention event;
- direct Player NORMAL S6 close is rejected server-side;
- no unrelated timer changes;
- reconnect restores the same discussion;
- AUDIT compatibility and the ACT1–14/finalization route remain green.

Boundary tests explicitly cover `t=3599`, `t=3601`, `t=10799` and `t>=10800`, with NORMAL versus AUDIT, delayed/stale Teacher controls, old versus updated clients, reconnect and separate vote-deadline behavior.

## 9.5 Mandatory effective-function/caller/grant inventory

Before C1/C2 SQL is authored, record the repository-last effective definition, caller set and browser-role grants for at least:

| Area | Functions/paths to resolve |
|---|---|
| generic construction/refresh | generic Discussion constructor, `s2_refresh_discussion` |
| generic Teacher actions | `s2_open_vote`, `s2_add_time` |
| S5 construction/re-entry | `s5_configure_discussion` and every initial/revote caller |
| S5 Teacher actions | `s5_teacher_open_vote`, `s5_teacher_add_time` |
| S6 construction/re-entry | `s6_open_discussion` and ACT9/10/11/no-consensus/reopen callers |
| S6 expiry/message | `s6_refresh_owned_discussion`, `s6_get_player_state`, `s6_send_message_guarded` |
| S6 close | `s6_close_discussion_v2`, guarded/internal close helpers and new Teacher close |

The inventory is an implementation input and review artifact. Function names above are search anchors, not proof that an older migration definition is effective.

**STOP:** the duration change affects non-Discussion timers, or S6 requires a second lifecycle engine rather than one authenticated owner mutation.

---

# 10. Package D — ACT3 cooldown and first common result occurrence

**Cost:** `3/5` including presentation

**Authority change:** bounded S3B guard plus read projection

## 10.1 Issue 4 — server three-second rejection window

Reuse the existing request UUID, replay lookup, run/state locks, attempt number and attempt table. In the repository-last `s3b_submit_library_code` replacement:

1. validate UUID and code;
2. return an exact same-request replay before cooldown checks;
3. reject conflicting UUID reuse;
4. lock the active run/state;
5. read the latest accepted attempt;
6. reject every new unique request before `submitted_at + 3 seconds`;
7. accept exactly one new unique request after the window;
8. keep the correct transition immediate, canonical and one-time.

The cooldown is interaction-global across all three Players, not per browser.

## 10.2 Issue 5 — occurrence contract

An accepted ACT3 attempt publishes:

```text
result_occurrence_id UUID
owner_domain = S3B
run_id
interaction_identity
attempt_number
result_kind = CORRECT | WRONG
text_key
started_at
visible_until = started_at + 3 seconds
validity
```

For a wrong attempt, all viewers display only “密码错误”. Do not display “暂不接受新输入”, “冷却中” or equivalent wording. Disable the local input/button for the remaining server window; a stale submission receives the same canonical occurrence.

Three Players and Teacher render the same occurrence ID, deduplicate polling, use the same server end time, show only the remaining interval on reconnect, and never replay an expired occurrence. Polling does not promise millisecond-identical receipt, only one authoritative window.

Tests include same-request replay inside the window, conflicting replay, simultaneous unique requests, cross-Player rejection, acceptance after three seconds, one correct transition, mid-window reconnect, expired reconnect, four-view identity equality and absence of cooldown wording.

---

# 11. Packages E1/E2 — truthful S5/S6 results and common presentation

## 11.1 Issue 3 — ACT7 wrong-majority classification

**Cost:** `2–3/5`

The base S5 mutation can record `wrong_majority`, after which the canonical wrapper may reclassify the resolved round as ordinary `player_majority`. Fix the effective owner/wrapper boundary:

1. the owner resolves one durable kind: `SUCCESS`, `NO_CONSENSUS`, `WRONG_MAJORITY` or `SYSTEM_FALLBACK`;
2. the round classification is written once;
3. the outer wrapper transports it without inference or rewrite;
4. Player and Teacher reads expose the latest resolved result even after the next round opens;
5. genuine ballots remain in their original round;
6. the result receives the common occurrence identity/window.

## 11.2 Issue 5 completion — S5/S6 adapters

S5 generates an occurrence atomically when its round resolves. S6 generates an occurrence atomically with its feedback result. Do not use generic `updated_at`, because unrelated writes can restart presentation.

All domains publish the common shape:

```text
result_occurrence_id
owner_domain
run_id
interaction_identity
result_kind
text_key(s)
started_at
visible_until
validity
```

S7 aggregates only Teacher-safe fields. The shared overlay renders; it never decides winners, advances phases or authorizes mutations.

Tests cover correct/wrong majority, no consensus, fallback, prior occurrence while a new round opens, four viewers, clock skew, polling dedupe, reconnect, unrelated S6 updates and private-choice non-disclosure.

**Cost:** full ACT3/S5/S6 four-view coverage is approximately `4/5`, inclusive of D/E work.

---

# 12. Package F — remaining reproduced normal-path defects

F is an admission-controlled queue. Every item needs reproduction, canonical owner, focused test and rollback.

## 12.1 W03 GRAB + leave

If still reproducible on the frozen baseline, implement one idempotent S3B transaction that performs canonical GRAB and leave, writes both existing events with common request provenance, respects the all-Player barrier and never advances from a read. If not reproducible, do not change it.

## 12.2 Formal start

If formal-start ambiguity reproduces, expose one idempotent normal Teacher start returning current run ID. Move legacy/developer controls out of the normal panel. Do not create a second state machine or ACK table.

## 12.3 Pocket/Knowledge/Observation

Re-read the repository-last effective schema. Normalize data only for a demonstrated reconstruction/privacy failure; use a thin adapter where canonical data already exists.

## 12.4 Exact state-level Teacher status

If a state cannot be expressed through Package B's canonical current fields, add a narrowly owned projection in the relevant domain. Absence of server evidence means `NO_CONFIRMED_SERVER_RECORD`, not “never tried”. Never fall back to a global latest event.

## 12.5 Text, layout, assets and audio

Only reproduced runtime blockers enter F. Wording/layout polish and final media remain later, local packages. Approved placeholders stay valid.

---

# 13. Package T — all 13 TOP checkpoints with audited minimum information

**Cost:** `3–4/5` after manifests remain minimal

**Authority change:** Teacher recovery transaction

**External prerequisite:** GA script audit and approved backup values

## 13.1 Required-information manifest

CD produces the technical table; GA audits whether each fact is truly required by the script and fills the approved backup value.

| Column | Owner/input | Meaning |
|---|---|---|
| `source_act` | CD | ACT where Override occurs |
| `target_act` | CD | only ACT n+1 |
| `required_key` | CD | stable semantic identifier |
| `display_name` | CD/GA | human-readable meaning |
| `read_source` | CD | canonical table/field/query |
| `missing_predicate` | CD | exact condition permitting fill |
| `runtime_write_target` | CD | owning table/field/mutation |
| `required_for_continuation` | GA audit | script necessity |
| `backup_value` | GA | approved minimum value |
| `not_provisioned` | GA | explicit exclusion |
| `validation_rule` | CD | post-fill runnable-state test |
| `notes` | GA/CD | special constraint |

Runtime consumes an immutable server-side form of the approved manifest. The Teacher client cannot submit table names, columns or backup values.

Each key defines its own missing predicate. `false`, `0`, an empty list or an existing branch value is not automatically missing.

## 13.2 OR provenance and Override record

Runtime uses a canonical value plus separate provenance. One compact Override record contains:

```text
override_id
run_id
source_act
target_act
teacher_reason
request_id
before_state_json
or_filled_json
created_at
```

`or_filled_json` entries must be uniquely addressable when the same semantic key exists for multiple Players or rounds. Each entry therefore carries the minimum stable tuple required by its domain:

```text
override_id
run_id
owner_domain
player_or_role_identity (when applicable)
interaction_identity (when applicable)
round_identity (when applicable)
semantic_key
value
source = OR
```

This remains a compact sidecar, not a per-field provenance graph.

The session records Teacher reason, transition, Override ID/time and the OR-filled-key list. Every affected behavioral analysis, scoring, finalization and export query must be inventoried and changed to exclude matching OR tuples when drawing conclusions about Player behavior. Merely writing the sidecar is not a completed filter. Runtime and non-behavioral integrity reads may continue using the canonical values.

`before_state_json` is minimized to recovery-relevant facts, Teacher-only and never exposed through Player reads or public export.

## 13.3 Uniform server transaction

Create one Teacher-only `teacher_next_top`-type entry point:

1. authenticate Teacher;
2. obtain the room/run transaction lock;
3. return exact same-request replay;
4. verify expected current ACT/interaction;
5. select only ACT n+1;
6. capture the current run/Player/domain state;
7. load the approved target manifest;
8. preserve every existing value;
9. fill only manifest-defined missing required values;
10. validate all continuation prerequisites;
11. call the target owner's initializer/activation path;
12. record Teacher reason and OR list;
13. commit atomically and return target plus fill summary.

Any failure rolls back the fill, initialization and record together. Repeated TOP runs the same operation against the current target; it does not judge whether earlier ACT facts were genuine.

Presence alone is not structural validity. Before filling anything, the target manifest must fail closed on contradictions such as an incompatible active interaction, impossible branch/resource combination, conflicting Main Gate role, or a half-initialized target. Genuine evidence is never overwritten to force progress. The returned result identifies the contradiction and leaves the run unchanged.

## 13.4 Current semantic exclusions

Subject to GA audit:

- Golden Key is not a required backup fact;
- C versus WATCHER continues to depend on actual Golden Key possession;
- Silver Key is mandatory and expected from ACT1; fill only if the audited manifest proves a technical gap;
- Flashlight is not required;
- nonessential clues are not filled;
- Override before final Main Gate work allocation follows the approved terminal recovery contract rather than inventing station behavior.

Existing real values always win over backup. Missing non-required facts are ignored. An already initialized target returns idempotently. Missing manifest or failed validation makes TOP unavailable and rolls back.

## 13.5 Teacher UI

Expose one `NEXT TOP` action showing current ACT, ACT n+1, mandatory Teacher reason, a notice that OR data may be used/excluded from analysis, and a post-action count/list of filled keys. No arbitrary destination or value editor.

## 13.6 Issue 7 — deliberately excluded scope

Do not create a separate programme for old Player requests that arrive after TOP. The user explicitly removed that work.

The TOP mutation still needs one request UUID so duplicate Teacher clicks/lost responses execute once. This narrow idempotency requirement is not authorization for a general stale-request cleanup architecture.

## 13.7 T implementation stages

```text
T0a extract ACT1→2 through ACT13→14 required-key candidates from effective code
T0b map read source, missing predicate, owner write and validation
T0c produce a 13-row boundary map naming source completion, target initializer, write owner,
    branch predicates, interactions to close, terminal/finalization effects, rollback and test class
T0d classify each boundary as simple, medium or high-coupling and revise cost from evidence
T0e send table for GA script audit and backup completion when authorized
T1a add immutable approved manifest representation
T1b add compact Override/OR record
T1c implement generic locked NEXT_TOP transaction
T2a add target-owner adapters only where the canonical initializer cannot be reused
T2b validate every transition independently
T2c run consecutive-TOP and export/analysis regression
```

## 13.8 T tests

For every ACT n→n+1:

1. all required facts exist: zero OR fill;
2. all required facts are missing: approved minimum fill;
3. partial facts: fill only gaps;
4. non-required facts missing: transition succeeds;
5. genuine value differs from backup: genuine value remains;
6. same request replays once;
7. failed post-fill validation completely rolls back;
8. target already initialized returns idempotently;
9. reconnect reconstructs ACT n+1;
10. export identifies/excludes OR behavioral evidence.

Also run at least three consecutive TOPs and the complete 13-transition matrix.

The `3–4/5` T estimate is provisional until T0 produces the full boundary map and one representative cross-domain pilot proves that the manifest stays declarative. T0 may conclude that individual high-coupling boundaries need separate approval or should remain unsupported; this does not authorize a procedural second engine.

**STOP:** a target requires arbitrary branch computation, reconstruction of detailed behavior, fake votes, client-submitted write targets, or a second universal gameplay engine.

---

# 14. W01–W13 placement map

| Work item | V2.3 placement | Boundary |
|---|---|---|
| W01 Discussion lifecycle | C1/C2 | 10,800-second compatibility plus one S6 Teacher mutation |
| W02-A Player shell/context | A1 first; H conditional | local correctness before abstraction |
| W02-B Discussion renderer | C UI adapters | one renderer owner |
| W03 GRAB+leave | F | direct S3B mutation only if reproduced |
| W04 Pocket | F | normalize or adapt only for demonstrated defect |
| W05 Teacher operations | B | existing S7 endpoint; state-level projection |
| W06 Teacher recomposition | after G or H | not mixed with W05/Discussion authority changes |
| W08 Library lock | D | existing S3B table/locks |
| W09-A/B/C local preservation | A/F | client-local unless canonical evidence is absent |
| W10 Player header | after confirmed state contract | adapter, not authority |
| W11 wording/layout | post-runtime local package | no database coupling |
| W12 transition/result overlay | D2/E2 | server occurrence identity and window |
| W13 regression | G | exact SHA and migration set |
| Legacy RPC quarantine | Q | separate security migration |
| Teacher recovery/TOP | T | audited minimum-information manifests |
| Assets/final media | post-runtime/VA path | placeholders remain valid |
| Finalization/grants | owning package if reproduced | no shared-facade ownership |

This is a scope firewall. Touching the same frontend file does not merge unrelated work packages.

---

# 15. Package G — integrated regression and trial freeze

## 15.1 Static gate

Run every affected existing suite, including:

- `tests/sprint3b-remediation-static-check.js`;
- `tests/sprint5-static-check.js`;
- `tests/sprint6-static-check.js`;
- `tests/sprint7-static-check.js`;
- `tests/level3-closure-static-check.js`;
- `tests/level3-remediation-static-check.js`;
- `tests/structural-package-b-static-check.js`;
- all new A–T package tests.

## 15.2 Database/live gate

- clean-schema migration replay in numeric order;
- exact effective signature/grant scan;
- S3B/S5/S6/S7/finalization live E2E;
- both S6 branches;
- concurrent clients and lost-response replay;
- privacy and unrevealed-choice checks;
- no obsolete browser-executable overload;
- TOP no/partial/full OR fill and consecutive TOP;
- OR-aware export/analysis verification.

## 15.3 Four-view browser gate

Use one Teacher and three isolated Player sessions:

- response delay/reordering;
- offline/reconnect during Discussion/result/TOP;
- double-click and unknown acknowledgement;
- staggered ACT5→6 entry;
- ACT2 Follow Sign per Player;
- ACT3 simultaneous attempts;
- ACT7 wrong majority/no consensus;
- ACT11 A/B/C and A/B/WATCHER;
- Teacher state-level statuses;
- finalization/export;
- placeholder-media route.

Capture console errors, failed requests, calls per refresh, p50/p95 latency, occurrence IDs and server time boundaries.

## 15.4 Integrated acceptance

The candidate passes only when:

- A1/A2 stale-response and error tests pass;
- W05/status projection is truthful and private;
- no NORMAL Discussion changes during a complete representative class unless Teacher acts;
- S6 Teacher Continue is authenticated, exact and idempotent;
- ACT3 rejects new input for three seconds with no extra cooldown wording;
- ACT7 wrong majority remains distinct;
- all four views share one occurrence and end time;
- ACT2 immediately becomes confirmed Library after Follow Sign;
- TOP preserves genuine data, fills only approved gaps and marks OR;
- analysis/export ignores OR behavioral evidence without breaking runtime;
- all normal and recovery routes reconstruct after reconnect;
- finalization and placeholders remain green.

## 15.5 Freeze

Freeze one exact code SHA and migration set. Any post-freeze fix creates a new candidate and reruns the affected package gates plus integrated smoke.

---

# 16. Package H — shared-context economic gate

H is not an assumed implementation. Measure after local/domain fixes:

- Player/Teacher calls per refresh;
- p50/p95 latency and query work;
- remaining browser owner-arbitration branches;
- identical facts required by multiple consumers;
- context/detail identity gaps;
- code or query work a shared boundary would actually delete;
- cutover and rollback burden.

A minimal context read is permitted only if:

1. at least two current consumers need the same stable contract;
2. initial output is limited to run lifecycle, runtime owner, presentation identity, exact interaction identity and validity;
3. Player and Teacher retain separate security envelopes;
4. the same release removes replaced calls/branches;
5. no universal gate taxonomy, W05 peer array, Pocket/private fact or legal-action booleans enter the core;
6. detail responses expose compatible identities;
7. measured net cost is lower.

Otherwise retain targeted domain reads. W05 success alone is insufficient evidence.

---

# 17. Commit, migration and rollback discipline

Recommended reviewable sequence:

```text
P0  baseline evidence and contract tests
A1  Player coordinator + race tests
A2  Teacher coordinator + race tests (independent)
B1  S7 W05/status projection migration + vector harness
B2  W05/status renderer cutover
Q   legacy RPC revoke migration + permission tests
C1  generic/S5 duration and exact Teacher action
C2  S6 Teacher close migration + Player/Teacher UI
D1  ACT3 cooldown/occurrence migration + concurrency tests
D2  ACT3 occurrence renderer
E1  S5 classification/read migration
E2  S6 occurrence migration + S5/S6 presentation adapters
Fx  one commit per reproduced direct defect
T0  required-information table artifact
T1  approved manifest/OR storage + NEXT_TOP transaction
T2x transition adapters in reviewable groups + matrix tests
G   evidence/freeze commit only
```

Rules:

- re-read repository-last function definitions before replacement;
- one concern per migration and commit;
- include exact signatures and explicit grants/revokes;
- never edit an applied migration;
- no asset publication mixed with gameplay SQL;
- no shadow path without cutover/removal criteria;
- no behavior PASS from code inspection alone;
- record before/after SHA, functions, authority facts, tests, failures, rollback and residuals;
- pair frontend and SQL rollback instructions;
- database or production deployment always requires separate authorization.

---

# 18. STOP conditions

Stop and return to design/audit if work requires:

- a second persisted universal state;
- unexplained dual writes;
- ACTIVE `game_runs` fallback;
- browser privacy filtering;
- fabricated votes or detailed Player behavior;
- global latest-event inference;
- S7 ACT-specific mutation/progression logic;
- a facade that adds polling instead of replacing it;
- client time as result authority;
- historical-row rewriting for UI convenience;
- TOP with arbitrary destination/value writes;
- unreviewed backup semantics;
- hidden changes to behavioral validity or export semantics;
- an unrelated timer change inside Discussion work;
- an unauthorized database or production mutation.

---

# 19. Cost and authorization table

| Package | Cost | Risk | Recommendation |
|---|---:|---:|---|
| P0 baseline/contracts | `1–2/5` | low | mandatory first |
| A1 Player polling | `2/5` | `2/5` | first code authorization |
| A2 Teacher polling | `2/5` | `2/5` | independent follow-up |
| B W05/status/ACT2 | `2–3/5` | `2/5` | shadow then one-region cutover |
| Q legacy quarantine | `1–2/5` | `2/5` | before frozen trial |
| C Discussion compatibility | `2–3/5` | `3/5` | split C1/C2 |
| D ACT3 cooldown/occurrence | `3/5` | `3/5` | reuse existing locks/table |
| E1 ACT7/S5 classification | `2–3/5` | `3/5` | before overlay adapter |
| E2 S6 occurrence/adapters | `3–4/5` | `3–4/5` | after true result contracts |
| F direct defects | variable | bounded | reproduce one by one |
| T0 TOP manifest extraction | `2/5` | `2/5` | documentation before runtime |
| T1/T2 all 13 TOPs | `3–4/5` | `4/5` | only after GA-approved manifest |
| G regression/freeze | `3/5` | test-only | mandatory |
| H shared context | unknown | high | measure; likely omit |

CD's recommended release sequence is the dependency order in Section 4, with each package independently reviewed and reversible. Do not authorize all SQL/UI changes as one batch.

---

# 20. Current status and next decision

This V2.3 is the complete CD proposal artifact.

- No implementation described here has been performed.
- No new migration or production state has changed.
- No other agent has been notified by creation of this file.
- V2.1 remains a historical local draft; V2.2 remains the eight-issue decision record.
- V2.3 is the only document to use for the complete implementation order.

Before code begins, the next decision should authorize a bounded first unit—P0 and A1—not the entire programme. T0 may be authorized as a documentation/audit artifact in parallel, but T1/T2 remain blocked on the GA-reviewed required-information table and approved backup values.
