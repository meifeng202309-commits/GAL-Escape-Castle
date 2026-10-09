# Debug Implementation Plan V4

**Date:** 2026-10-09

**Status:** `FOR_CA_AND_GA_CRITICAL_REVIEW / NO_RUNTIME_IMPLEMENTATION_AUTHORIZATION`

**Branch basis:** `remediation/sprint9-structural-v1` at or after `c114780`

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

PASS:

- exact code/database/assets under test are identifiable;
- no package starts from a stale function body or old branch.

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
5. Teacher Open Vote carries expected run/phase/round/discussion identity;
6. stale click cannot advance a newer discussion;
7. hide NORMAL Add Time;
8. direct NORMAL add-time mutation returns not applicable before writing anything;
9. votes remain genuine Player submissions.

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

### 10.2 Shared presentation occurrence

Use one small presentation ledger for ACT3/S5/S6:

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

### F9 — other UI work

- stable Player mounts/header/local draft/focus handling belong to their owning UI package;
- five-slot Library UI remains presentation-only; server cooldown stays in D;
- Teacher page recomposition occurs only after B/C authority contracts stabilize;
- generic two-second transitions and cosmetic wording remain after functional acceptance.

---

## 12. Package M — publish and activate all six audio assets

### 12.1 Scope and priority

Audio is not a blocker for early debugging because stopped fallback is legal. It **is** required for the frozen final-media/audio acceptance candidate.

All six selected candidates are already Teacher APPROVED. Do not send them for repeat Teacher review.

### 12.2 Publication/ACTIVE workflow

1. run integrity validator and record exact candidate version/SHA;
2. query live Asset Manager for matching candidate IDs/status/storage paths;
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
10. record receipt + validity + behavior-dataset policy;
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

### 14.7 Terminal integrity

Do not weaken the normal verifier.

Conceptually distinguish:

```text
completion_mode = normal | override_assisted
technical_integrity_verified
normal_gameplay_evidence_complete
behavior_dataset_eligible
```

Use the fewest backward-compatible fields/report keys after tracing every consumer. Override-assisted completion is technically valid only when:

- exact Teacher receipt exists;
- every skipped obligation has explicit absence/validity reason;
- all actually traversed real facts are consistent;
- no old interaction is open;
- terminal state is coherent;
- no fake normal evidence row exists.

Finalization invoker must be explicit:

- preferred first path: Teacher creates terminal proof/boundary and Players can finish through the current finalization experience;
- if Teacher must end the game even when Players are disconnected, factor one internal finalization core with separate Player/Teacher authenticated wrappers;
- never pass Teacher credentials through the Player function or duplicate finalization logic.

### 14.8 Behavior dataset policy

GA/CA propose the conservative low-cost V1 rule:

```text
any successful NEXT TOP
=> behavior_dataset_eligible=false
=> full export remains available
```

This is safe but broader than the user's original “ignore OR data” wording because it excludes genuine behavior from the standard comparable dataset. Keep it as the planned V1 default, but mark it for explicit product acceptance before Lane R release freeze. Do not build selective filtering until requested.

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

Start as soon as these minimums pass:

- P0 exact baseline;
- A1 polling;
- formal-start smoke;
- B-min core location/waiting vectors;
- W03 combined action;
- fresh room/three Players/Teacher;
- console/network evidence capture.

H-pre finds the first real blocker. It is not final acceptance and does not wait for full Lane R or ACTIVE audio.

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

All enabled boundaries later need blank/partial/full-real/replay/stale/reconnect tests.

### 15.4 Lane N functional acceptance F0/H0

Three real Player contexts + Teacher:

- formal start through ACT14;
- staggered actions and reconnect;
- peer waiting acknowledgements;
- Discussion/Teacher Continue;
- ACT3 cooldown;
- ACT7 tie/wrong/correct;
- four-view result windows;
- Pocket/evidence/privacy;
- ACT5→6 barrier;
- Main Gate roles/tasks;
- final reveal/export;
- placeholder media path;
- audio fallback and, once M completes, ACTIVE playback.

### 15.5 Final presentation acceptance F1

After functionality:

- responsive layout;
- anchors/readability;
- final images/placeholders as applicable;
- ACTIVE audio perceptual acceptance;
- normal/reduced/mute;
- localized text;
- Teacher page clarity;
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
```

### Phase 2 — expose and remove first human blockers

```text
B-min core vectors
→ W03 combined GRAB+leave
→ early H-pre
```

B-min need not finish every edge vector before W03.

### Phase 3 — stabilize lifecycle and domain truth

```text
C Discussion
→ D1 ACT3 truth/cooldown
→ E1 ACT7 durable classification
→ D2/E2 shared occurrence presentation
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
- per-field analytics filtering in Lane R V1;
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
- final media does not block early trials;
- six audio candidates do not require repeat Teacher review.

### Still provisional before implementation/release

- exact package authorization/order after CA/GA review;
- final OR receipt/report schema;
- finalization invoker design;
- whether whole-run dataset exclusion is accepted for Lane R V1;
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

## 20. Requested reviews

### CA review

Audit:

- actual function/owner mapping;
- workload ranking;
- package independence;
- migration/grant risk;
- finalization integrity distinction;
- audio publication/rollback workflow;
- tests and STOP conditions;
- lowest-cost alternatives.

Return `PASS_TO_IMPLEMENTATION / PASS_WITH_CHANGES / CHALLENGE / BLOCKED`, while keeping implementation on HOLD.

### GA review

Audit:

- V4 gameplay and behavior semantics;
- Discussion and result presentation;
- W03 interaction;
- Pocket/knowledge/privacy;
- TOP backup values and ending;
- whether any solution changes intended Player experience;
- audio cue/version plan against current canonical meanings.

Return `CONCUR / CONCUR_WITH_CHANGES / CHALLENGE`, while keeping implementation on HOLD.

Only material disagreements should generate another planning round.
