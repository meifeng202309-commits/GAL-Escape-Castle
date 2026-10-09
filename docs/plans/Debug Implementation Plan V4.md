# Debug Implementation Plan V4

**Date:** 2026-10-09

**Status:** `REVISED_FOR_CA_173_RELEASE_GATE_REVIEW / IMPLEMENTATION_HOLD / NO_RUNTIME_IMPLEMENTATION_AUTHORIZATION`

**Branch basis:** `remediation/sprint9-structural-v1` at or after `63f8443`

**Current review authority:**

- `CA_to_CD_20261009T174500Z_ga-v4-final-consolidated-review-release-gates.md` (CA-173)
- `CA_to_CD_20261009T141000Z_v4-consolidated-historical-coverage-selective-evidence-final-review.md` (CA-171)
- CA-173 is the single latest CA→CD action source. It updates CA-171 only for R1–R5 and bounded release-gate sequencing while retaining CA-171's incorporated technical guards.
- GA-102 was rescinded and is not an independent action source.

**Supersedes as the current unified implementation proposal:**

- `PROPOSAL_DEBUG_IMPLEMENTATION_PLAN_V3.0_BY_CD.md`
- `PROPOSAL_DEBUG_IMPLEMENTATION_PLAN_V2.3_BY_CD.md`
- `CD_CRITICAL_REVIEW_OF_CA_DEBUG_IMPLEMENTATION_PLAN_V3.0.md`
- `TEMP_CD_CRITICAL_REVIEW_OF_GA101.md` as a temporary review artifact

**Semantic companion to revise before Lane R implementation:**

- `CD_ACT1_ACT14_MINIMUM_CONTINUATION_INFORMATION_TABLE_V1.0.md`

This V4 combines:

- the Teacher/User's decisions on the eight debated issues;
- the Teacher/User's detailed TOP backup-information model;
- GA-101's ACT1–ACT14 semantic values;
- CA-169's engineering and cost conditions;
- CD's function/schema/read-path review;
- the current player-facing defect inventory;
- the current visual/audio asset state.

The 2026-10-09 CA-171 revision also fixes the Teacher's selective TOP behavior-data policy and promotes the historically confirmed early-trial/UI issues into explicit acceptance tests. It does not add a second gameplay engine, a general analytics warehouse or a new UI rewrite package.

This is a plan, not a migration, deployment instruction or release authorization.

---

## 0. Decision standard

> 我们的目标是事先充分评估开发中可能遇到的困难和风险，但是不纠结过于细微末节的小问题。由于这个游戏仅为教学用小游戏，并非公开发行的大众游戏。因此很多低概率风险值得列出来，最多用简单“粗糙”的方法解决，不值得如临大敌地耗费时间精细打磨。

Engineering consequences:

1. fix reproduced classroom blockers before speculative architecture;
2. prefer narrow domain-owned changes with independent rollback;
3. record low-probability risk, but do not automatically build a general framework for it;
4. keep normal-route reliability independent from all-boundary recovery;
5. preserve placeholder-first media fallback for early trials;
6. require complete evidence only for a frozen candidate, not before the first diagnostic trial;
7. never make fake Player behavior merely to satisfy an old verifier.

---

## 1. Executive implementation strategy

The work is split into two releasable lanes.

### Lane N — normal classroom game

Goal: three Players and one Teacher can run ACT1–ACT14 without TOP, with truthful state, clear waiting feedback, stable reconnect and final reveal.

Lane N includes:

- trustworthy Player polling;
- minimum Teacher observability;
- one coherent GRAB+leave action;
- Teacher-controlled Discussion;
- ACT3 cooldown and ACT7 result correctness;
- synchronized result presentation;
- player-facing completeness fixes;
- Pocket/memory/evidence access;
- audio ACTIVE publication;
- legacy RPC quarantine;
- four-client functional acceptance and release freeze.

### Lane R — Teacher Override / TOP recovery

Goal: Teacher can move from any ACT1–ACT13 boundary to the next playable state, and can recover ACT14/finalization, while preserving all real evidence and filling only GA-approved Game-Track prerequisites with OR provenance.

Lane R includes:

- ACT1–ACT14 stored/derived/presentation map;
- one trusted recovery receipt contract;
- explicit adapters per boundary;
- invalid/missing Behavior accounting;
- terminal recovery without fake Main Gate behavior;
- Override-assisted integrity/export distinction;
- all-boundary recovery regression.

Lane N must not wait for the full Lane R release. Lane R may be implemented and audited in batches after one simple and one cross-owner pilot establish the real cost.

---

## 2. Verified baseline and current facts

### 2.1 Already implemented; smoke or preserve

- atomic formal start exists through the current `s9_start_formal_game` route;
- S3B/S5/S6 normal gameplay and ACT14 finalization exist;
- placeholder-first image resolution is released for repeated Teacher trials;
- all 22 runtime-required images have non-null ACTIVE versions in the repository Registry;
- final images do not block debugging trials;
- six Sprint6 audio cues are already wired to resolver-first playback, normal/reduced/mute, blocked-playback retry and consumption tracking;
- current audio absence safely degrades to a legal stopped outcome;
- the Sprint9 asset validator reports all 28 latest candidates valid/approved and candidate-ready.

### 2.2 Important distinction: audio candidates are ready, runtime audio is not ACTIVE

Repository Registry audit on 2026-10-09:

| Audio key | Approved version | Binary/sidecar integrity | Registry `active_version` | Runtime result now |
|---|---:|---|---:|---|
| `audio.wet_scraping` | v001 | PASS | `null` | `NO_ACTIVE_ASSET` → stopped fallback |
| `audio.snakes_approaching` | v002 | PASS | `null` | `NO_ACTIVE_ASSET` → stopped fallback |
| `audio.old_alarm_bell` | v002 | PASS | `null` | `NO_ACTIVE_ASSET` → stopped fallback |
| `audio.snake_hiss_short` | v001 | PASS | `null` | `NO_ACTIVE_ASSET` → stopped fallback |
| `audio.mechanism_clang` | v002 | PASS | `null` | `NO_ACTIVE_ASSET` → stopped fallback |
| `audio.gate_opening` | v002 | PASS | `null` | `NO_ACTIVE_ASSET` → stopped fallback |

The deployed-evidence snapshot from 2026-10-07 also observed null audio ACTIVE versions. Candidate `readiness_ok=true` does **not** prove runtime publication/ACTIVE.

### 2.3 Confirmed player-facing defects that remain in scope

- final ACT14 reveal can fall through to inactive/legacy rendering after finalization;
- several peer-wait barriers lack accepted/waiting guidance;
- several ACT9–12 submitted/locked actions remain visibly actionable;
- stale Sprint6 status/error text can survive a successful transition;
- ACT1–5 lacks an integrated Pocket/Memories/Shared Photos/Group Items view;
- ACT4/Main Gate anchor integrations are incomplete;
- ACT4 simultaneous reveal data is returned but not rendered;
- ACT5 terminal consequence/Enter Portrait Hall can be overwritten before the browser sees it;
- W03 currently presents GRAB and leave as two Player actions instead of one approved coherent action.

### 2.4 Evidence quality problem

Current Player refresh uses interval-driven asynchronous reads that can overlap and allow an older response to overwrite a newer frame. Several read errors are converted to `active:false`. This can make a runtime defect look like inactivity and is why Player polling is the first new code package.

---

## 3. Workload assessment — highest to lowest

The ratings combine implementation breadth, regression risk, live-environment dependence and verification work. A high rating does not automatically mean “implement first.”

| Rank | Work package | Implementation | Verification/risk | Combined assessment | Release role |
|---:|---|---:|---:|---:|---|
| 1 | **R — all 13 TOP boundaries + Override-assisted finalization** | 4/5 provisional | 5/5 | **5/5** | Separate Lane R release |
| 2 | **G — integrated 3-Player + Teacher functional/final acceptance** | little new code | 4.5/5 | **4.5/5** | Critical evidence gate |
| 3 | **C — Teacher-controlled Discussion across generic/S5/S6** | 3/5 | 4–4.5/5 | **4/5** | Lane N critical |
| 4 | **W04/W02 player shell + Pocket/knowledge/evidence completeness** | 3–4/5 if bundled | 4/5 | **4/5** | Split into bounded units |
| 5 | **E2/D2 shared 3-second result occurrence across four views** | 3–3.5/5 | 3.5–4/5 | **3.5–4/5** | Lane N after result truth |
| 6 | **W03 one coherent GRAB+leave** | 2–2.5/5 | 3–3.5/5 | **3–3.5/5** | Early Lane N |
| 7 | **A1 Player polling correctness** | 2–2.5/5 | 3/5 | **3/5** | First new code package |
| 8 | **B W05 Teacher observability** | 2–2.5/5 | 3/5 | **3/5** | Early diagnostic dependency |
| 9 | **D ACT3 serialized cooldown/result truth** | 2–3/5 | 3/5 | **3/5** | Lane N core |
| 10 | **E1 ACT7 durable wrong-majority classification** | 2–3/5 | 3/5 | **3/5** | Lane N core |
| 11 | **M audio publication/ACTIVE + live playback acceptance** | 1.5–2/5 code/ops | 3/5 external/live | **2.5–3/5** | Parallel; required before frozen final candidate |
| 12 | **F focused player-facing defects outside packages above** | 1–3/5 each | 2–3/5 | **2–3/5 each** | Evidence-prioritized |
| 13 | **A2 Teacher polling** | ~2/5 | 2–3/5 | **2–3/5 conditional** | Only if reproduced/needed by B |
| 14 | **Q reachable legacy RPC quarantine** | 1–2/5 | 2/5 | **2/5** | Before exposed freeze |
| 15 | **P0 baseline/effective-overload map** | 1/5 | 1–2/5 | **1–2/5** | First planning gate |
| 16 | **U0 formal-start validation** | 0 new code if smoke passes | 1/5 | **1/5** | Early smoke gate |
| 17 | **late polish: W11 wording/W12 transition** | 1–2.5/5 | 1–2/5 | **1–2.5/5** | After functional acceptance |

Cost warnings:

- TOP cost is dominated by ownership transfer and regression combinations, not by the number of SQL lines.
- Discussion cost is dominated by three implementations and stale round/session identity, not the `10800` constant.
- Audio publication is operationally small but requires live credentials, exact candidate IDs, storage reread, Registry synchronization and perceptual browser acceptance.
- UI packages become 4/5 only if bundled; they should be split.

---

## 4. Package P0 — freeze the evidence baseline

**Goal:** prevent work against the wrong branch, overload or deployed state.

Actions:

1. record exact source SHA, migration set and Pages build;
2. query effective deployed overloads/grants for functions being changed;
3. preserve a clean-schema apply baseline and current-live baseline;
4. record current asset Registry SHA and live Asset Manager state;
5. reproduce or disposition the first normal-route blockers;
6. assign one commit/test/rollback boundary per package;
7. keep the W01–W13 placement map as a scope firewall.

### 4.1 U0 early-trial coverage matrix

These are acceptance cells inside P0/U0/Q/F; they are not new architecture packages.

| Historical finding | Required browser/authority test | PASS condition | Owning package |
|---|---|---|---|
| IDA-001 pre-start legacy root | Join all three Players before formal Start | Players see a waiting shell only; no legacy Sprint1 gameplay is interactive | P0/U0/F1 |
| IDA-002 pre-start private leakage | Give each Player a distinct first private choice and inspect the other two contexts | No Player can read/render a peer's unrevealed private value | P0/U0/Q |
| IDA-003 non-atomic start | Double-click Start and simulate an unknown acknowledgement/interruption | One active run and one fully initialized ACT1 exist; replay is idempotent | U0 |
| IDA-004 contradictory Teacher panels | Fail one Teacher read while retaining the last confirmed run frame | Operations may show stale/error locally, but the page does not claim both “Run started” and “No active run” | A2/B |
| IDA-005 competing legacy controls | Inspect NORMAL, Recovery and Maintenance views | NORMAL has no legacy Advance/Reset; privileged recovery/maintenance actions are separated and guarded | Q/F9 |

U0 additionally verifies preserved room setup/token semantics, exact current run identity and duplicate/interruption safety against the deployed formal-start route. A failure in only the Teacher refresh test opens A2; it does not automatically authorize a universal Teacher polling rewrite.

PASS:

- exact code/database/assets under test are identifiable;
- no package starts from a stale function body or old branch.
- all five early-trial cells have a named result or a reproduced owner-specific defect.

STOP:

- deployed authority materially differs from repository-last;
- two functions appear to own the same current mutation.

---

## 5. Package A1/A2 — polling and transport correctness

### A1 Player polling — first code package

Replace overlapping interval refresh with a self-scheduling single-flight coordinator:

1. only one Player refresh in flight;
2. every refresh captures session epoch + monotonic generation;
3. assemble a candidate frame before any DOM/state commit;
4. discard stale epoch/generation results;
5. increment epoch on logout/rejoin/room switch;
6. distinguish `SUCCESS`, `NOT_APPLICABLE`, `FETCH_ERROR`, `INVARIANT_BREACH`;
7. preserve last confirmed passive view during transient failure;
8. disable only mutations whose identity cannot be verified;
9. mutation retries reuse the same request UUID after unknown acknowledgement;
10. successful mutation requests one immediate refresh, then resumes cadence;
11. remove duplicate reads only after equivalence evidence.

Tests:

- reverse response order;
- timer fires while request outstanding;
- logout/rejoin mid-read;
- one domain read fails;
- commit succeeds but response is lost;
- reconnect during vote and ACT5→6;
- finalization frame versus inactive legacy frame.

### A2 Teacher polling — conditional

Implement only if reproduced or required by B:

- separate Teacher single-flight generation;
- room/watch-target epoch;
- Operations failure marks only that panel stale;
- valid room/Discussion frame remains visible;
- do not force S1/S2/S5/S7/S8 into one universal facade.

---

## 6. Package B — W05 Teacher trustworthy observability

**Goal:** Teacher sees current state-level activity without inferring from the latest event.

Minimum per-Player projection:

```text
physical_location
transition_state
discussion_or_vote_state
assignment_role
task_state
connection_state
source_domain
source_identity
validity / reason_code
```

State categories:

1. online/offline/reconnecting;
2. entered/in/left a named room;
3. entered a transition barrier / waiting for others;
4. discussing / waiting for Teacher;
5. vote not submitted / submitted / waiting / result;
6. puzzle active / failed / solved;
7. Main Gate A/B/C/WATCHER assignment;
8. station not ready / ready / complete / ENGAGED;
9. escaping / outside / waiting finalization / completed.

Authority rules:

- S3B owns per-Player location through the ACT6 entry barrier;
- S5 phase + canonical scene derive Portrait Hall/Clock Room/ACT8 location;
- S6 phase + canonical scene derive Great Hall/Golden Key chamber/Main Gate/exterior;
- roles are not locations;
- contradictory owners return invariant failure;
- no private unrevealed values in NORMAL Teacher view.

ACT2 Follow Sign rule:

- successful server action directly sets that Player to Library;
- Teacher displays the current-language equivalent of “XXX进入图书馆”;
- no intermediate sign-seen/rerouting state.

Delivery:

1. add a versioned shadow projection to the existing Teacher read;
2. validate minimum vectors first;
3. cut over only location/status cells;
4. delete/disable the displaced binding in the same commit;
5. no new permanent endpoint/polling call.

Minimum vectors before W03/H-pre:

- ACT2 independent Library arrival;
- ACT5→6 partial barrier;
- ACT6 all-entered;
- ACT11 allocation;
- ACT12 ready/ENGAGED/waiting;
- reconnect/offline;
- privacy negative test.

Full edge vectors are required before freeze, not before W03 starts.

---

## 7. Package W03 — one coherent GRAB+leave action

**Problem:** current Player UI renders `s3b_grab` and `s3b_leave_start_room` as two actions. The approved interaction is one coherent “take what you need and leave” action, while canonical GRAB and leave facts remain distinct.

Solution:

1. keep Player item selection separate;
2. expose one final action/button using approved bilingual wording;
3. implement one idempotent server wrapper/internal transaction that:
   - acquires mandatory items;
   - includes only genuinely discovered eligible optional items;
   - sets `grab_complete`;
   - sets `left_start_room` and physical location;
   - records both canonical events/facts;
   - evaluates the all-Player barrier once;
   - creates the next Discussion once;
4. one request UUID covers the logical action;
5. same request replay returns the committed outcome;
6. conflicting reuse fails;
7. lost response and reconnect recover from canonical state;
8. do not expose unobserved Flashlight/knowledge.

Tests:

- normal action;
- double click;
- lost response/retry;
- two simultaneous final Players;
- optional Flashlight real/not-real;
- reconnect after commit;
- first ACT2 action works;
- exactly one next Discussion.

Do not merge W03 with the Player shell redesign.

---

## 8. Package C — Teacher-controlled Discussion

### 8.1 User-visible rule

NORMAL Discussion is controlled by the Teacher. Players may message, but time reaching zero must not be the meaningful progression action. NORMAL Add Time is not shown.

### 8.2 Lowest-impact compatibility design

Use:

```text
NORMAL Teacher-paced Discussion sentinel = 10,800 seconds
```

This is a compatibility sentinel for a game expected to finish within two hours. Do not display “3 hours” as the intended duration.

Do not apply 10,800 seconds to:

- Library/puzzle fallback;
- ACT3 three-second cooldown;
- result occurrence windows;
- cinematics;
- audio timing;
- station timing;
- AUDIT behavior unless explicitly retained.

### 8.3 Generic/S5

1. find repository-last constructor/helper and current 3600-second validator;
2. permit 10,800 only for approved NORMAL Teacher-paced Discussion;
3. audit initial/revote/reopen/reconfigure calls;
4. keep `phase_deadline` and `discussion_time_limit_sec` consistent;
5. effective `s2_open_vote` / `s5_teacher_open_vote` (or their repository-last overloads) carry expected run/phase/round/discussion identity and current Teacher session identity;
6. stale click cannot advance a newer discussion;
7. hide NORMAL Add Time;
8. direct NORMAL `s2_add_time` / `s5_teacher_add_time` (or effective overloads) return not applicable before writing an event or changing a deadline;
9. votes remain genuine Player submissions;
10. a 2-of-3 incomplete NORMAL vote remains current and accepts the late third genuine vote throughout the supported 10,800-second classroom window unless an authenticated Teacher recovery or valid round transition already ended it;
11. inventory Discussion and vote deadlines separately for generic ACT2, S5 ACT7 and relevant S6 vote phases—changing only the Discussion deadline is insufficient;
12. use the cheaper proven correction per owner: align its NORMAL vote deadline to the compatibility window or add a narrow NORMAL expiry guard; do not change AUDIT or unrelated timers.

Required tests per affected owner:

- submit two genuine votes, pass the former 15/90-second expiry, then accept the third;
- reject a vote carrying the prior discussion/round identity after a valid transition;
- direct NORMAL Add Time remains nonmutating;
- AUDIT timing behavior remains deliberate and separately covered.

### 8.4 S6

Add a Teacher-authenticated narrow Continue/Close mutation for:

```text
act9_discussion  → act9_console
act10_discussion → act10_final_vote
act11_discussion → act11_allocation
```

It must:

- authenticate Teacher separately from Player functions;
- accept request UUID and expected identities;
- lock current S6 + Discussion rows;
- close once, null deadline and record one Teacher-origin event;
- return idempotent replay;
- reject stale identity;
- leave Player NORMAL close path rejected server-side;
- preserve deliberate AUDIT behavior if still supported.

UI:

- Player sees “等待教师继续”;
- Teacher sees one context-correct Continue/Open Vote control;
- no normal countdown pedagogy.

Accepted residual:

- a class paused beyond three hours may encounter old compatibility expiry. Document it; do not rebuild the whole deadline system for this low-probability case.

---

## 9. Package D — ACT3 password-box cooldown

User rule:

- accepted wrong code displays only “密码错误” for three seconds;
- during those three seconds, the server rejects new different inputs;
- no “temporarily not accepting votes” message is required.

Server solution:

1. lock puzzle/run row;
2. replay same request id first;
3. reject different request while `server_now < cooldown_until`;
4. rejected cooldown request does not increment attempt or create a second result;
5. one accepted wrong attempt sets `cooldown_until=now()+3s`;
6. correct, fallback and Teacher recovery retain distinct result codes;
7. result writes one presentation occurrence with server start/end;
8. reconnect within window restores remaining display; after window it does not replay.

Tests:

- two Players submit nearly simultaneously;
- same-request replay during cooldown;
- wrong then correct before/after window;
- reconnect at 1.5s and after 3s;
- Teacher TOP during cooldown terminalizes puzzle identity;
- no duplicate attempt/result.

---

## 10. Package E — ACT7 result truth and four-view presentation

### 10.1 ACT7 wrong-majority

Preserve these distinct durable outcomes:

```text
no_consensus
wrong_majority
correct_clock_c
fallback_or_teacher_recovery
```

The first round's wrong majority remains attached to that round. Reopening creates a new round and cannot reclassify the earlier result as ordinary majority.

Implementation:

1. commit immutable round result classification at settlement;
2. occurrence references that classification;
3. reopen increments round and creates a fresh identity;
4. export preserves each real round;
5. TOP Clock C recovery adds OR result without rewriting real wrong rounds.

### 10.1.1 ACT7 server-enforced three-second next-round guard

Current repository-effective call chain at baseline `6e86dad`:

```text
public.s5_submit_vote              -- database/031 public replay-first wrapper
→ public.s5_submit_vote_pre031    -- database/029 canonical Discussion wrapper
→ public.s5_submit_vote_pre029    -- database/027 domain mutation
```

The 027 mutation writes `s5_rounds.resolved_at`, increments `s5_run_state.vote_round`, and immediately inserts the next ACT7 round for both a three-way tie and a wrong majority. The 029 wrapper writes `resolved_at` again and currently can overwrite ACT7 `wrong_majority` with `player_majority`; E1 must correct that classification separately.

For the guard, a new current ACT7 round proves that the immediately preceding ACT7 round ended in a feedback-producing tie or wrong-majority path; a correct Clock C result does not create another ACT7 vote round. Therefore the cheapest candidate needs no new table/column:

1. same-request replay remains first and returns its original receipt;
2. validate exact active run, ACT7 phase, current discussion session and expected vote round;
3. lock/read the immediately preceding `s5_rounds` row for the same run/`act7_vote` with `vote_round=current-1`;
4. if that resolved row exists, reject a **new** request without writes while `server_now < resolved_at + interval '3 seconds'`;
5. use that same `resolved_at` as the presentation occurrence origin; reconnect never restarts it;
6. after the window, call the existing effective chain;
7. cooldown rejection creates no vote/event and does not consume the request UUID.

Tie and wrong-majority both receive the three-second feedback/guard because both create a new ACT7 round. Correct Clock C has no next-round input to guard. Static clean-schema and deployed-overload checks must confirm the chain before implementation; a different deployed body is a STOP.

Tests: same-request replay during window, two browsers racing new requests, `t<3s`, `t>=3s`, tie, wrong-majority, stale session/round, reconnect, no event/vote on rejection, and durable wrong-majority classification after E1.

### 10.2 Shared presentation occurrence

First trace the durable ACT3/S5/S6 result records and every current renderer/read call. Prefer a versioned read projection over those existing facts when it can supply a stable occurrence identity and server window without ambiguous reconstruction. Add one small presentation ledger only if the existing domain records cannot satisfy the four-view contract without duplicate timing logic.

If a ledger is necessary, its minimum shape is:

```text
occurrence_id
run_id
domain
source_identity
result_code
visible_from
visible_until
audience
```

Rules:

- server owns the three-second window;
- 3 Players + Teacher see the same occurrence ID/window;
- gameplay result remains owned by S3B/S5/S6;
- reconnect reconstructs an active occurrence;
- renderer uses canonical localized text;
- occurrence is never a second voting/result engine.

Decision evidence before schema work:

- list existing durable result owner and identity for ACT3, S5 and S6;
- compare changed SQL/functions/readers for projection reuse versus a ledger;
- select the smaller auditable option;
- document why the rejected option would duplicate timing or writes.

Implement truth first (D1/E1), then presentation adapters (D2/E2).

---

## 11. Package F — player-facing completeness

Split into bounded fixes; do not make one giant UI rewrite.

### F1 — ACT14 final reveal reachability

Problem: finalization marks the run completed, normal active-run lookup becomes inactive, and root refresh can fall to legacy Sprint1 before reading/rendering S8.

Solution:

- finalization response/current session remembers exact completed run identity;
- refresh checks finalization state before inactive legacy fallback;
- render canonical S8 reveal from server state;
- reconnect to a just-completed run uses an explicit completed-run read, not an arbitrary latest run;
- clear only after logout/new run.

### F2 — accepted/waiting acknowledgement

For ACT2–4 and ACT8 private barriers:

- after server acknowledgement, disable/remove the action;
- show accepted + waiting-for-teammates state;
- on reconnect derive it from canonical locked/submitted state;
- never infer completion from button disappearance alone.

### F3 — ACT9–12 submitted/locked acknowledgement

- submitted votes/tasks/ENGAGE remain visibly locked and non-actionable;
- show state-level waiting text;
- ACT12 already-ENGAGED Players explicitly see waiting for others;
- request retry remains possible only for unknown acknowledgement with same UUID.

### F4 — clear stale status/errors

- successful confirmed state progression clears stale Sprint6 error/action/audio status;
- panel-local errors do not overwrite current scene state;
- do not hide a still-relevant blocked-audio accessibility message until resolved/consumed.

### F5 — Pocket/Memories/Shared Photos/Group Items

Build a minimum integrated Player evidence area for ACT1–5 first:

- physical Pocket items;
- current item view/flip/inspect;
- canonical Observations/Memories;
- private/system knowledge only for its owner;
- group items;
- Shared Photos only when allowed;
- current authorization for share/inspect.

Browser acceptance must prove behavior, not merely row existence:

- load the exact canonical ACTIVE item image through the resolver;
- inspect front/back and flip where the asset contract supports it;
- share only an eligible item and verify Shared Photos in the intended audience;
- keep private Memories/Observations invisible to other Players before the approved reveal;
- restore Pocket tab/expanded item after reconnect or polling refresh where locally appropriate;
- expose group items and reunion access without transferring ownership of a physical item;
- exercise the Library five-slot fixed-prefix input and submit affordance from the same stable Player shell.

Data rules:

- use canonical tables and provenance;
- do not render-time union legacy and canonical facts indefinitely;
- normalize only known durable legacy facts that are required;
- preserve original timestamp/source, never substitute migration `now()`;
- Map group visibility after reunion does not duplicate/transfer the physical Map.

### F6 — anchor integrations

- ACT4 Library unknown-door marker uses `library_unknown_door`;
- Main Gate uses station A/B/C and Watcher corridor anchors;
- missing anchors hide the control and use safe fallback; they do not guess coordinates;
- test responsive scaling.

### F7 — ACT4 simultaneous reveal

- render server-returned `act4_revealed` only after all required real/valid submissions or approved transition;
- reveal all Players together;
- preserve privacy before reveal;
- missing TOP-skipped choices remain null/invalid, not invented.

### F8 — ACT5 consequence and Enter Portrait Hall

- do not let deferred S5 preparation overwrite the observable ACT5 consequence;
- separate “S5 prepared” from “ACT6 entered”;
- each Player observes consequence then performs/receives the approved entry transition;
- ACT6 timer/Discussion starts only at the all-three barrier;
- no duplicate S5 round.

### F9 — explicit shell and historical UI acceptance

This remains a set of bounded acceptance/fix cells, not a new shell rewrite.

Player shell:

- desktop renders the intended two-column arrangement; mobile uses an intentional readable collapse;
- reconnect restores current Player identity and ACT header and never leaves stale “Waiting for formal run” text during an active run;
- scene, actions, Discussion and Pocket use stable mounts rather than competing full-root replacement;
- approximately 1.2-second polling does not erase Discussion draft, keyboard focus, transcript scroll, Pocket tab or expanded item;
- Library shows its fixed prefix, five input slots and submit affordance; cooldown/result truth remains owned by D;
- ACT4 and Main Gate anchors scale responsively and fall back safely when unavailable;
- ACT4 reveal remains private until the canonical simultaneous-reveal condition;
- ACT5 consequence remains visible before the per-Player ACT6 entry barrier;
- a bilingual two-second scene transition is presentation-only and is suppressed on first render/reconnect when no real transition just occurred.

Frozen Phase-4 visual targets:

| Runtime surface | Approved prototype |
|---|---|
| Player main page | `docs/prototypes/round1-ui-v4/GAL_Player_Page.html` |
| Scene transition | `docs/prototypes/round1-ui-v4/GAL_Scene_Transition.html` |
| Teacher NORMAL console | `docs/prototypes/round1-ui-v4/Teacher_Console.html` |
| Teacher Emergency Recovery | `docs/prototypes/round1-ui-v4/Teacher_Emergency_Recovery.html` |
| Teacher Maintenance/Developer | `docs/prototypes/round1-ui-v4/Teacher_Maintenance_Developer.html` |

These prototypes define visual hierarchy/navigation only. They do not create gameplay authority, do not require rebuilding approved assets, and do not block A1/B/W03. The three Teacher targets remain internal views of one current `teacher.html` runtime.

Teacher shell:

- NORMAL Run, Recovery and Maintenance are separate internal views within the same current `teacher.html` runtime;
- the room token/setup persists when navigating those views;
- event listeners remain live after navigation and polling;
- Emergency and Maintenance remain distinct;
- NORMAL Run exposes no competing legacy Advance/Reset and no Add Time control;
- Teacher's currently expanded panel/page is not reset by routine polling.

Low-priority wording pass after functional acceptance:

- avoid duplicated bilingual constants such as repeated `41739` or `★`;
- replace visible Sprint/developer jargon only where it causes classroom comprehension failure;
- do not delay H-pre or H0 for decorative wording.

---

## 12. Package M — publish and activate all six audio assets

### 12.1 Scope and priority

Audio is not a blocker for early debugging because stopped fallback is legal. It **is** required for the frozen final-media/audio acceptance candidate.

All six selected candidates are already Teacher APPROVED. Do not send them for repeat Teacher review.

### 12.2 Publication/ACTIVE workflow

1. run integrity validator and record exact candidate version/SHA;
2. query the actual live Asset Manager and effective publish/mark-published/Registry-sync/activation functions and grants; do not assume repository ordering is deployed ordering;
3. if candidates are not registered, import them through the existing service-role-only import workflow;
4. verify live candidates exactly match key/version/type/SHA/metadata;
5. publish each binary to canonical `game-assets/<key>/vNNN/<filename>` path;
6. reread stored bytes and verify SHA before mark-published;
7. update repository Registry `active_version` for the exact approved versions in one canonical commit;
8. sync the exact Registry SHA to live Asset Manager;
9. activate each unpaired audio candidate through the existing authorized activation function; do not fake one multi-asset paired group;
10. query `asset_resolve` for all six and require exact ACTIVE version/storage metadata;
11. verify old candidates are not incorrectly ACTIVE;
12. run browser playback acceptance with normal/reduced/mute, autoplay blocked/retry, reconnect, duplicate-consumption protection and late/delayed asset;
13. verify ACT9 hiss, ACT10 alarm and ACT12/13 sequence timing/perceptual suitability;
14. run asset integrity/readiness tests again and record live evidence.

### 12.3 Exact intended versions

```text
audio.wet_scraping       v001
audio.snakes_approaching v002
audio.old_alarm_bell     v002
audio.snake_hiss_short   v001
audio.mechanism_clang    v002
audio.gate_opening       v002
```

### 12.4 Rollback

- preserve previous candidates and events;
- Registry rollback selects a known previous ACTIVE version only if one exists;
- current audio keys have no previous ACTIVE version, so failure rollback is Registry `active_version=null` + no ACTIVE candidate + legal stopped fallback;
- never delete published binaries during rollback.

### 12.5 STOP conditions

- live candidate SHA/version/status differs from sidecar;
- Registry sync target is not exact;
- storage reread hash differs;
- activation function/grant differs from deployed evidence;
- browser resolves wrong version;
- audio is audible despite mute/reduced contract failure.

---

## 13. Package Q — reachable legacy RPC quarantine

1. re-probe exact deployed signatures/grants, including legacy `s1_submit_private_choice`;
2. prove supported current clients/E2E do not call the candidate RPC;
3. revoke browser execution through a forward migration;
4. preserve historical rows/functions needed for audit;
5. verify anon/authenticated denial and canonical mutation success;
6. do not broaden into speculative cleanup of every historical function.

Q must pass before an externally exposed frozen candidate.

---

## 14. Lane R — TOP/Override recovery contract

### 14.1 Hard rules

- exactly one selected active run and three real GAL identities;
- Teacher identity, reason, expected source identity and request UUID required;
- preserve non-null canonical real facts;
- contradictory current owner fails and rolls back;
- no arbitrary browser field/value writer;
- no fake votes/messages/choices/latencies/acknowledgements/roles/tasks/ENGAGE/pressure;
- OR is metadata, never appended to a business value;
- target initializer executes once;
- old interaction/timer/fallback is terminalized within the same transaction;
- missing expected Behavior is explicit `null + invalid_teacher_override`;
- optional facts remain absent;
- media is not continuation data.

### 14.2 Data classifications

The revised ACT table must label every requirement:

```text
STORED
DERIVED
PRESENTATION
REAL_ONLY
OR_RECEIPT
OPTIONAL
```

Examples:

- Story Time is PRESENTATION derived from ACT/phase;
- S5/S6 location is DERIVED from current owner/scene;
- Main Gate required role set is DERIVED from real branch flags;
- Castle Map remains STORED as GAL-A's physical item while group visibility is PRESENTATION;
- recovery package identity is OR_RECEIPT;
- Player ballot is REAL_ONLY.

### 14.3 Global continuation facts

Include GA G13–G18:

- Library onward `party_physically_reunited=true` and run/discussion silent-texting consistency;
- explicit skipped-Behavior validity;
- canonical target location published by current owner;
- branch-package atomicity;
- only guaranteed/necessary system knowledge may be supplied;
- Story Time milestones 23:50 / 23:54 / 23:58 / 00:00 as story presentation, not wall clock.

### 14.4 Approved semantic values

```text
ACT5 missing group route       = known
ACT6 recovery                  = portrait_fixed_fallback
ACT7 recovery                  = Clock C solved + WEST TOWER → WAY OUT
ACT8 missing final route       = main_gate
ACT9 recovery                  = correct console endpoint / Blue entered
ACT10 missing result           = LEAVE
ACT11/12 incomplete real proof = terminal_escape_or_v1
student ending                 = existing canonical ending
Teacher/export status          = Override-assisted completion
```

Real TAKE/LEAVE and other real results always win over the default. Backup fills only absence.

These are semantic requirements, not ready-to-write database column/value instructions. Before coding each adapter, map every requirement to:

- the effective canonical owner/function;
- the actual stored or derived representation;
- the target initializer and first legal action;
- the existing validity/provenance fields that can be reused;
- a fail-closed rule when the live branch is incomplete or contradictory.

No adapter may invent a similarly named field merely because the semantic table uses that label.

### 14.5 Minimum transaction skeleton

For each explicit adapter:

1. authenticate Teacher;
2. lock run/current domain;
3. verify exact source identity;
4. replay same request or reject conflicting reuse;
5. preserve real data and choose real-versus-OR fork;
6. terminalize current owned interaction/deadline/fallback;
7. apply fixed server-owned recovery package;
8. invoke target initializer once;
9. verify target owner/scene/branch/location/first legal action;
10. record receipt + interaction validity + selective evidence/provenance policy;
11. commit once or fully roll back.

No universal transaction coordinator or second gameplay engine.

### 14.6 Boundary implementation map

| Boundary | Reuse | Minimum new contract | Target proof |
|---|---|---|---|
| ACT1→2 | current S3B ACT1 override/progress | guaranteed pre-choice facts/Observations, invalid missing choice | first real ACT2 choice works |
| ACT2→3 | current GRAB/route/foldback/wayfinding owners | whole-ACT composition, six items, Library route triple/reunion | puzzle accepts input |
| ACT3→4 | existing 41739 safe resolution | receipt + deadline retirement, no attempt row | ACT4 choice works |
| ACT4→5 | existing ACT4 skip/validity | exact invalid fields + Discussion init | message/vote works |
| ACT5→6 | known safe route + S5 prepare/barrier | terminal known + all-entry once, no fake Player event | ACT6 vote works |
| ACT6→7 | S5 state/advance endpoint | fallback result + close round + Clock Room | ACT7 vote works |
| ACT7→8 | S5 solved/ACT8 init | OR Clock C + public clue, preserve wrong rounds | ACT8 private choice works |
| ACT8→9 | S5 complete + S6 initializer | main_gate only if absent; close S5 once | ACT9 Discussion/Continue works |
| ACT9→10 | S6 endpoint + ACT10 clue delivery | endpoint flags/phase + receipt, no fake `s6_choices` | ACT10 private choice works |
| ACT10→11 | S6 branch flags/items | preserve real result else atomic LEAVE | ACT11 Continue works |
| ACT11→12/terminal | allocation validator | complete real allocation continues; otherwise terminal receipt | task or escape path works |
| ACT12→13/terminal | task/engage/cinematic | incomplete uses terminal receipt; no fake rows | escape presentation works |
| ACT13→14 | escape/boundary state | OR boundary only if needed | ACT14 reveal visible |
| ACT14→Final | S8 verifier/export | normal vs trusted-OR obligation mode + invoker | export truthful |

Teacher terminal confirmation for ACT11/12 recovery:

- before the Teacher confirms, show the fixed actual destination/effect in the approved bilingual presentation;
- state explicitly when recovery bypasses remaining station gameplay and leads toward the existing escape ending;
- do not use a generic “resolve and continue” label that implies ordinary ACT12/13 progression;
- preserve Teacher reason and explicit confirmation;
- offer no Teacher-selected alternate recovery branch;
- server-owned terminal semantics remain authoritative.

This is a Lane R UI/contract condition and does not block Lane N.

### 14.7 Terminal integrity

Do not weaken the normal verifier.

Conceptually distinguish:

```text
completion_mode = normal | override_assisted
technical_integrity_verified
normal_gameplay_evidence_complete
fully_unassisted_comparable_run
```

`fully_unassisted_comparable_run` is run-level metadata only. It must not be the sole export filter and must not discard genuine observations from an Override-assisted run.

Use the fewest backward-compatible fields/report keys after tracing every consumer. Override-assisted completion is technically valid only when:

- exact Teacher receipt exists;
- every skipped obligation has explicit absence/validity reason;
- all actually traversed real facts are consistent;
- no old interaction is open;
- terminal state is coherent;
- no fake normal evidence row exists.

Before modifying finalization or export, trace the effective `s8_export_session`/equivalent exporter, S8 finalizer/verifier, every `session_integrity_verified` consumer, and any analyzer/query that filters behavior. Reuse existing `teacher_overrides`, `teacher_override_validity`, `runtime_events.event_source`, `validity`, `behavior_scoring` and interaction timing validity where they are actually effective. Add fields only when the effective reader/export path cannot represent a required distinction.

`technical_integrity_verified` means the recovery transaction and terminal state are internally coherent and auditable. It does not assert that every expected Student action occurred.

Finalization invoker must be explicit:

- preferred first path: Teacher creates terminal proof/boundary and Players can finish through the current finalization experience;
- if Teacher must end the game even when Players are disconnected, factor one internal finalization core with separate Player/Teacher authenticated wrappers;
- never pass Teacher credentials through the Player function or duplicate finalization logic.

### 14.8 Behavior dataset policy

The Teacher's fixed rule is selective preservation. Do not ask for this decision again and do not exclude an entire run merely because NEXT TOP occurred.

Required semantic classes:

| Class | Meaning | Export/analysis rule |
|---|---|---|
| `REAL_VALID` | A genuine server-confirmed Player behavior not invalidated by the relevant recovery | Preserve and allow normal feature-level use |
| `REAL_AFTER_UPSTREAM_OVERRIDE` | A genuine later Player behavior whose context was influenced by an earlier TOP | Preserve with upstream Override context; analysts decide comparability for the affected feature/cohort |
| `MISSING_INVALID_OVERRIDE` | Expected behavior was skipped or never server-confirmed | Export `null` plus `invalid_teacher_override` or the canonical equivalent; never fabricate |
| `OR_GAME_TRACK` | System/Teacher recovery state, clue, item or branch prerequisite | Preserve with OR provenance; never treat as Player behavior |

These four names define required meanings for readers, exports and tests; they are not assumed to be literal columns or enum values in every domain.

Lowest-cost implementation:

1. trace actual current schema and exporter/consumer SQL before adding fields;
2. create/reuse one Override receipt containing run, source ACT/identity, target ACT, affected interaction/obligation and OR-filled facts;
3. keep all pre-existing real rows unchanged;
4. mark only the skipped expected interaction/field invalid and absent;
5. link later genuine actions to the upstream Override context at the narrowest existing interaction/event level;
6. keep a run-level fully-unassisted flag only as convenience metadata;
7. remove/avoid any analyzer clause equivalent to `WHERE run_id NOT IN (runs_with_override)` when extracting genuine behavior;
8. preserve raw/full JSON or CSV export of real events, missing-invalid obligations, OR facts and source/time context;
9. do not construct a general analytics warehouse or universal per-field lineage framework when existing validity/event/receipt fields suffice.

An unacknowledged client attempt is not server-confirmed real behavior and must not be upgraded to `REAL_VALID`. It may remain separate diagnostic evidence if already logged.

Mandatory acceptance sequence in one run:

```text
one genuine PRE-TOP behavior
→ one skipped expected behavior recorded null/invalid
→ one OR_GAME_TRACK recovery fact
→ one genuine POST-TOP behavior with upstream context
```

Export must recover all four distinctions. Repeat with two successive TOPs and prove that each receipt/affected scope remains separable.

### 14.9 Cost pilot

Before committing to the whole Lane R estimate, implement/test only after authorization:

- one simple same-owner pilot: ACT3→4;
- one cross-owner/branch pilot: ACT8→9 or ACT10→11.

Use the measured changed functions/writes/tests to confirm or revise the remaining cost.

---

## 15. Integrated validation strategy

### 15.1 Fast static/contract gates per package

- syntax/lint/static checks;
- exact effective overload and privilege checks;
- clean migration replay;
- current schema forward apply;
- focused SQL contract tests;
- browser renderer tests;
- no protected canonical-owner edits.

### 15.2 Early H-pre diagnostic trial

Use bounded diagnostic checkpoints:

- **H-A after A1 + U0:** Teacher + one Player start/refresh/reconnect;
- **H-B after B-min + W03:** Teacher + three Players; first true H-pre, progressing as far as the current build safely permits;
- **H-C after C/D/E:** targeted Discussion/vote/result trial;
- **H-D during F/UI:** approved interface-usability trial;
- **H0:** complete ACT1–14 route and final release acceptance.

H-B starts as soon as these minimums pass:

- P0 exact baseline;
- A1 polling;
- formal-start smoke;
- U0 IDA-001–005 negative/consistency cells;
- B-min core location/waiting vectors;
- W03 combined action;
- fresh room/three Players/Teacher;
- console/network evidence capture.

Record/run the focused ACT13→S8→ACT14 final-reveal/reconnect smoke early, but it is not a PASS prerequisite for H-A/H-B. A failure attributable only to the already-known F1 final-reveal defect stays in F1 and must not block ACT1/2/3 human diagnostics. The smoke must PASS before H0 and Lane N freeze.

H-pre finds the first real blocker. It is not final acceptance and does not wait for full Lane R or ACTIVE audio. Only H0/freeze requires the complete route.

### 15.3 Risk-selected TOP tests

First eight falsification cases:

1. blank ACT1→2;
2. ACT2→3 without GRAB;
3. ACT5→6 with third entry missing;
4. ACT7→8 after real wrong-majority;
5. ACT10→11 real TAKE versus absent result;
6. ACT11→terminal with partial allocation;
7. repeated/late request across TOP;
8. normal versus Override-assisted verifier/export.

Selective-evidence falsification additionally requires:

- PRE-TOP `REAL_VALID` remains queryable;
- skipped Behavior is null/invalid rather than synthesized;
- OR Game-Track fact is excluded from Player behavior;
- POST-TOP genuine behavior is preserved with upstream context;
- two successive TOP receipts do not overwrite one another;
- `technical_integrity_verified` is not interpreted as complete real Student evidence.

All enabled boundaries later need blank/partial/full-real/replay/stale/reconnect tests.

### 15.4 Lane N functional acceptance F0/H0

Three real Player contexts + Teacher:

- formal start through ACT14;
- pre-start waiting-only root and three-Player privacy negative;
- duplicate/interrupted formal Start remains one atomic ACT1 initialization;
- staggered actions and reconnect;
- peer waiting acknowledgements;
- Discussion/Teacher Continue;
- ACT3 cooldown;
- ACT7 tie/wrong/correct;
- four-view result windows;
- Pocket/evidence/privacy;
- canonical Pocket image load, inspect/flip/share/Shared Photos, group/reunion visibility and reconnect;
- stable Player identity/ACT header, draft/focus/transcript scroll and expanded Pocket state through polling;
- Library fixed-prefix five-slot input and submit affordance;
- ACT5→6 barrier;
- Main Gate roles/tasks;
- final reveal/export;
- Teacher NORMAL/Recovery/Maintenance navigation, preserved token/listeners and no legacy Advance/Reset/Add Time in NORMAL;
- placeholder media path;
- audio fallback and, once M completes, ACTIVE playback.

### 15.5 Final presentation acceptance F1

After functionality:

- responsive layout;
- desktop two-column and intentional mobile collapse;
- anchors/readability;
- bilingual two-second transitions only on real scene change, not first render/reconnect;
- final images/placeholders as applicable;
- ACTIVE audio perceptual acceptance;
- normal/reduced/mute;
- localized text;
- Teacher page clarity;
- no duplicated constants/developer jargon where it impairs classroom comprehension;
- final Pages/Supabase exact release candidate.

Freeze exact SHA/migrations/Registry SHA/live evidence. Any later fix creates a new candidate.

---

## 16. Recommended implementation sequence

The sequence is dependency-aware, not a rigid rule that blocks independent work.

### Phase 0 — review and freeze the plan

1. CA audits technical completeness/cost/rollback/testability;
2. GA audits script/behavior/privacy/presentation semantics;
3. resolve only material conflicts;
4. publish V4.x if needed;
5. obtain bounded implementation authorization.

### Phase 1 — make observations trustworthy

```text
P0-lite
→ A1 Player polling
→ U0 formal-start smoke
→ H-A one-Player diagnostic
```

### Phase 2 — expose and remove first human blockers

```text
B-min core vectors
→ W03 combined GRAB+leave
→ H-B first three-Player H-pre
```

B-min need not finish every edge vector before W03.

### Phase 3 — stabilize lifecycle and domain truth

```text
C Discussion
→ D1 ACT3 truth/cooldown
→ E1 ACT7 durable classification
→ D2/E2 shared occurrence presentation
→ H-C targeted Discussion/vote/result trial
```

If H-pre exposes a more immediate reproduced blocker, fix it first within its owner.

### Phase 4 — player-facing completeness

Priority:

```text
F1 ACT14 reachability
→ F2/F3 accepted/waiting states
→ F8 ACT5 consequence/ACT6 entry
→ F5 Pocket/evidence minimum
→ F7 ACT4 reveal
→ F6 anchors
→ F4 stale status
→ remaining shell/polish
→ H-D interface-usability trial
```

### Phase 5 — audio publication in parallel

After V4 review and availability of live Asset Manager credentials:

```text
M integrity
→ candidate/live identity check
→ publish
→ Registry sync
→ ACTIVE
→ resolver/live browser evidence
```

This does not block H-pre, but it must finish before the final frozen presentation candidate.

### Phase 6 — exposure safety and Lane N acceptance

```text
Q legacy RPC quarantine
→ full B vectors
→ Lane N automated regression
→ 3P+Teacher H0
→ F1 presentation acceptance
→ frozen Lane N candidate
```

### Phase 7 — Lane R cost pilots

```text
revise ACT table V1.1
→ T1 receipt/transaction skeleton
→ ACT3→4 pilot
→ ACT8→9 or ACT10→11 pilot
→ CA cost/audit checkpoint
```

### Phase 8 — Lane R batches

```text
ACT1–5 adapters
→ ACT6–10 adapters
→ ACT11–14 terminal/integrity
→ 13-boundary regression
→ CA audit
→ separate Lane R freeze
```

---

## 17. Rollback and change discipline

Every package must provide:

- one semantic owner;
- changed files/functions;
- forward migration only;
- focused tests;
- rollback behavior;
- STOP condition;
- evidence note.

Rules:

- never edit applied historical migrations;
- do not mix UI recomposition with authority-changing SQL;
- do not create two active renderers or two gameplay owners;
- shared abstraction must delete displaced calls/branches in the same release;
- deployment mutation occurs only after local/static/clean-schema evidence;
- preserve user changes and unrelated untracked files;
- candidate freeze is immutable.

---

## 18. Explicit non-goals

Do not build:

- universal persisted `global_phase` or `participant_progress`;
- a second gameplay engine;
- a generic client-submitted recovery writer;
- a global latest-event state inference;
- a universal Story Time database;
- duplicate location columns in S5/S6 merely for W05;
- a universal knowledge engine;
- fake behavior rows for terminal verification;
- a general analytics warehouse or universal per-field lineage framework for Lane R V1;
- a worker-cancellation framework when terminal status/deadline/identity guards suffice;
- final-image dependencies for early debugging;
- cosmetic transitions before functional acceptance.

---

## 19. Decisions and authorization ledger

### Fixed planning decisions

- Teacher controls NORMAL Discussion within the 10,800-second compatibility window;
- no NORMAL Add Time;
- ACT3 wrong display is three seconds; server rejects new different input during that window;
- four views share occurrence ID/window;
- ACT7 wrong-majority remains distinct;
- Follow Sign directly reaches Library;
- Teacher shows state-level activity, not every action;
- no separate global late-request package;
- Main Gate incomplete TOP may end via terminal recovery;
- no fake Player behavior;
- TOP data uses selective evidence preservation: real observations remain, missing behavior stays null/invalid, OR facts never become behavior, and later genuine actions retain upstream context;
- a run-level unassisted-comparability flag is metadata, not a whole-run export exclusion;
- final media does not block early trials;
- six audio candidates do not require repeat Teacher review.

### Still provisional before implementation/release

- exact package authorization/order after the consolidated CA delta review;
- final OR receipt/report schema;
- finalization invoker design;
- exact mapping of selective evidence classes to the effective existing schema/export/analyzer paths;
- exact live Audio Asset Manager candidate IDs/state;
- exact H-pre/H0 deployment candidate;
- any shared context abstraction after measurement.

### No authorization inferred

This plan does not authorize:

- runtime/schema/grant changes;
- Supabase mutation;
- asset publication/ACTIVE;
- GitHub Pages deployment;
- release freeze.

---

## 20. CA-173 narrow delta and release-gate request

This revision adds only CA-173 R1–R5:

1. incomplete NORMAL votes remain actionable during the classroom window, with per-owner expiry tests;
2. ACT7 next-round feedback is server-enforced from the preceding round's `resolved_at`, while E1 separately fixes wrong-majority classification;
3. H-A/H-B/H-C/H-D/H0 checkpoints prevent the known late ACT14 defect from blocking early human diagnostics;
4. Phase-4 visual acceptance names the five frozen prototype files;
5. terminal ACT11/12 TOP confirmation states the actual fixed escape-directed effect.

The accompanying A1 release packet provides the requested code baseline, affected path, exact tests, rollback and STOP conditions. CA/Teacher must explicitly authorize A1 before any runtime edit begins.

No GA FYI or separate GA review is requested for this CA-173 delta. All implementation, migration, publication and deployment remain on HOLD.
