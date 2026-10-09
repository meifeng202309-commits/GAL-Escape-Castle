# Proposal of Debug Implementation Plan V2.2 by CD

**Date:** 2026-10-09

**Owner:** CD — Code Development Agent

**Status:** REVISED PROPOSAL FOR CA REVIEW / NO IMPLEMENTATION PERFORMED

**Implementation authorization:** NONE

**Branch:** `remediation/sprint9-structural-v1`

**Repository basis:** `b8ddb038065f978b4c3db9192b96b6d05f94aa76`

**Supersedes for current planning:**

- `PROPOSAL_DEBUG_IMPLEMENTATION_PLAN_V2_BY_CD.md`;
- local V2.1 draft;
- `CD_TEACHER_CLARIFICATIONS_MINIMAL_IMPACT_PLAN_V1.md`.

This revision incorporates the Teacher's final clarifications on the eight Round III issues and responds to CA's function-level challenge in `CA_to_CD_20261009T044000Z_minimal-impact-discussion-top-targeted-audit.md`.

V2.2 is deliberately a minimum-change implementation proposal. It does not change SQL, JavaScript, database state or deployment. It is sent to CA for review before implementation.

---

# 1. Fixed decisions

1. TOP means a uniform transition from ACT n to ACT n+1 after checking and filling only the minimum required continuation information.
2. CD produces the technical required-information table; GA later audits necessity against the script and supplies approved backup values when instructed.
3. Existing values are preserved. Only missing required values are filled.
4. Backup values remain valid runtime values but carry an `OR` source marker so behavioral analysis ignores them.
5. Per-field forensic provenance is not required. One Override record stores Teacher reason, before-state snapshot and the list of OR-filled semantic keys.
6. Repeated TOP applies the same operation again; it does not reconstruct or judge the truth of earlier ACTs.
7. NORMAL Discussion keeps the existing deadline machinery but uses a three-hour discussion window. Teachers progress before expiry.
8. NORMAL Add Time is removed from the visible Teacher workflow.
9. S6 receives the one missing Teacher-owned Continue action; Player timer-based Continue is not the normal control.
10. ACT7 wrong majority remains distinct from ordinary majority.
11. ACT3 retains existing idempotency/locking and adds a three-second server rejection window; UI shows only success/failure.
12. Result occurrences receive a unique ID and a three-second server display window on three Player views plus Teacher.
13. ACT2 Follow Sign directly means the Player entered Library; no intermediate sign/rerouting state.
14. TOP late-request work is excluded at Teacher direction.
15. Teacher Player-status display is state-level, not event-by-event.

---

# 2. Engineering boundaries

## 2.1 Preserve canonical runtime values

`OR` is provenance, not a suffix appended to actual values.

Example:

```text
runtime value: library
source marker: OR
```

Never store `libraryOR`, `trueOR`, `linda_star_keyOR` or another modified value that would break enums, comparisons, foreign keys or item lookup.

## 2.2 One transaction per TOP

The internal order is:

```text
lock current run
capture before-state snapshot
identify ACT n and allowed ACT n+1 destination
load required-information manifest
read existing canonical facts
fill only missing required facts with approved backup values
validate all required facts are now available
initialize/activate ACT n+1
write one Override record, Teacher reason and OR-filled-key list
commit everything together
```

The ACT does not change before required data validates. Any failure rolls back the entire operation.

## 2.3 No generic arbitrary writer

Teacher UI submits only:

- room/Teacher credentials;
- expected current ACT/current interaction identity;
- request UUID;
- reason;
- action `NEXT_TOP`.

The client never submits table names, columns or backup values. Server selects the next manifest.

## 2.4 Missing means manifest-defined missing

Each required key defines its own missing predicate. Examples:

- row absent;
- column is null;
- required item absent;
- required flow row not initialized;
- required completion flag false.

An empty list, `false`, `0` or an existing branch value is not automatically missing. The manifest must define the rule.

## 2.5 Analysis filtering

Runtime uses both genuine and OR-sourced values so the next ACT can run. Behavior analysis and export exclude OR-sourced semantic facts from Player-behavior conclusions.

The session still records:

- Teacher reason;
- source ACT and destination ACT;
- Override ID/time;
- one compact list of keys filled with `source=OR`.

No deeper provenance graph is required.

---

# 3. Issue 1 — all 13 TOP checkpoints

## 3.1 Data model

### Required-information manifest

CD first produces a technical table with these columns:

| Column | Owner/input | Meaning |
|---|---|---|
| `source_act` | CD | ACT where Override occurs |
| `target_act` | CD | next ACT |
| `required_key` | CD | stable semantic identifier |
| `display_name` | CD/GA | human-readable meaning |
| `read_source` | CD | canonical table/field/query |
| `missing_predicate` | CD | exact condition that permits filling |
| `runtime_write_target` | CD | owning table/field/mutation |
| `required_for_continuation` | GA audit | whether script truly requires it |
| `backup_value` | GA | approved minimal value |
| `not_provisioned` | GA | explicit exclusions/non-required facts |
| `validation_rule` | CD | post-fill runnable-state check |
| `notes` | GA/CD | special constraint |

The repository representation may be a governed SQL/JSON/CSV source, but runtime consumes an immutable server-side definition.

### Override record extension

One TOP record stores conceptually:

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

`or_filled_json` is a compact list such as:

```json
[
  {"key":"party_location","value":"library","source":"OR"},
  {"key":"prior_flow_complete","value":true,"source":"OR"}
]
```

It is sufficient for analysis filtering without adding provenance columns to every gameplay table.

## 3.2 Uniform TOP execution

Create one server entry point, conceptually `teacher_next_top`, which:

1. authenticates Teacher;
2. obtains a room/run transaction lock;
3. checks request replay;
4. confirms the expected current ACT/interaction;
5. selects only ACT n+1;
6. captures current Player/run/domain state as JSON;
7. loads the approved target manifest;
8. preserves every existing value;
9. fills only missing keys;
10. validates target prerequisites;
11. calls the target domain initializer/activation path;
12. records Teacher reason and OR list;
13. returns destination and filled-key summary.

The operation is the same for repeated NEXT_TOP. It evaluates only the current target manifest, not the authenticity of previous ACT completion.

## 3.3 Deliberate exclusions from backup

Subject to GA script audit, current Teacher direction is:

- Golden Key is not required to continue and is not backup-filled;
- C versus WATCHER remains determined by actual Golden Key possession;
- Silver Key is mandatory but already forced into Pocket in ACT1; the manifest validates presence and fills only if GA confirms a genuine technical gap;
- Flashlight is not required and is not backup-filled;
- nonessential Player clues are not backup-filled;
- if Override occurs before final Main Gate work allocation, the recovery ends/finishes the game according to the approved target contract rather than constructing detailed station behavior.

## 3.4 Existing data handling

| Existing state | TOP behavior |
|---|---|
| required value present | preserve |
| required row/field missing | fill approved backup and mark OR |
| non-required value missing | ignore |
| real value differs from backup | preserve real value |
| target initializer already complete | return idempotent result |
| manifest or post-fill validation missing | rollback and report unavailable |

No attempt is made to decide whether an existing real value is narratively “better” than backup. Presence wins unless GA later defines an explicit invalid-value rule in the manifest.

## 3.5 UI

Teacher sees one `NEXT TOP` action with:

- current ACT;
- next ACT;
- required reason input;
- confirmation that backup values may be used and excluded from analysis;
- post-action summary listing how many keys were filled as OR.

No arbitrary destination selector or backup-value editor.

## 3.6 Tests

For each ACT n→n+1:

1. all required data already exists: no OR fill;
2. all required data missing: approved minimal fill;
3. partial required data: fill only gaps;
4. non-required data absent: transition still works;
5. real branch value differs from backup: real value preserved;
6. duplicate click/same request: one transition;
7. post-fill validation failure: complete rollback;
8. repeated NEXT_TOP across at least three consecutive ACTs;
9. reconnect reconstructs target ACT;
10. export/analysis identifies OR keys and excludes them from Player behavior.

## 3.7 Cost

- technical table extraction: `2/5`;
- GA review/value completion: external semantic work;
- generic TOP engine and compact OR record: `3/5`;
- thirteen transition adapters/initializers: `3/5` if manifests stay minimal;
- complete 13-transition and repeated-TOP regression: `3–4/5`;
- overall revised estimate: `3–4/5`, down from `5/5`.

STOP if a target requires arbitrary branch computation or reconstruction of detailed Player history rather than the declared minimal required keys.

---

# 4. Issue 2 — Teacher-controlled Discussion through three-hour compatibility

## 4.1 Chosen compromise

Do not rewrite all three lifecycle engines to eliminate deadlines. Instead, for NORMAL classroom discussions that should be Teacher-controlled:

```text
discussion duration = 3 × 60 × 60 seconds = 10,800 seconds
```

The existing deadline functions, columns and callers remain. A normal teaching session should be advanced by the Teacher before three hours.

This is an explicit practical compatibility decision: the old automatic transition remains theoretically possible after three hours, but it is outside the intended classroom session. Tests must document that trade-off rather than claim deadlines no longer exist.

## 4.2 Scope of the three-hour change

Change only Teacher-controlled Discussion durations in NORMAL mode.

Do not change:

- ACT3 password cooldown;
- puzzle deadlines/hints unless independently approved;
- cinematic timers;
- audio timing;
- result display windows;
- response-duration evidence;
- station/mechanism timing.

## 4.3 Generic and S5

1. Update the effective NORMAL discussion creation/configuration paths to use 10,800 seconds.
2. Keep existing Teacher Open Vote functions.
3. Bind Teacher Open Vote to the exact current discussion where practical, addressing CA's stale-click concern without changing unrelated reads.
4. Hide NORMAL Add Time controls.
5. Keep Add Time functions for compatibility/AUDIT; direct NORMAL use should preferably return not applicable before mutation/event logging if the small mode check is safe.
6. Hide the three-hour countdown or display “由教师控制”; do not show a misleading three-hour classroom timer.
7. Leave vote resolution based on actual submissions; no synthesized missing vote.

## 4.4 S6 minimal addition

Three hours alone blocks current Player Continue because both UI and `s6_close_discussion_guarded` wait for deadline. Add one Teacher RPC, conceptually `s6_teacher_close_discussion`, which:

1. authenticates Teacher token;
2. accepts request UUID and expected run/phase/step/round/discussion session;
3. locks current S6 and discussion rows;
4. verifies phase is one of `act9_discussion`, `act10_discussion`, `act11_discussion`;
5. ignores the three-hour wait for this authorized Teacher action;
6. closes the discussion once;
7. transitions respectively to `act9_console`, `act10_final_vote` or `act11_allocation`;
8. records one Teacher-origin event;
9. returns idempotent replay on duplicate/lost response.

Do not reuse the Player-token wrapper unchanged. Reuse only the internal phase-to-next-phase mapping after Teacher authentication and exact identity checks.

## 4.5 Player and Teacher UI

Player:

- keep message composer active during discussion;
- remove/hide normal S6 timer-gated Continue button;
- show “等待教师继续” after the discussion activity is complete;
- polling continues normally.

Teacher:

- generic/S5: existing Open Vote action;
- S6: new End Discussion / Continue action;
- no NORMAL Add Time;
- no visible three-hour countdown;
- stale rendered action receives a clear refresh-required error.

## 4.6 CA findings addressed

| CA finding | V2.2 disposition |
|---|---|
| refresh helper deadline side effects | retained but moved outside intended ≤3h classroom window by explicit Teacher decision |
| S6 message guard expires | same trade-off; Teacher is expected to close before 3h |
| stale Teacher action | exact discussion identity added to affected Teacher actions |
| Add Time direct mutation/event | hidden; small NORMAL no-op check preferred if low impact |
| Player S6 close | removed from normal UI; new Teacher path owns progression |
| S6 Teacher action needs auth/idempotency | fully adopted |
| AUDIT preservation | preserved only as compatibility, not normal semantics |

## 4.7 Commit sequence

```text
D0 contract tests for 10,800-second NORMAL windows
D1 generic/S5 duration and exact Teacher current-discussion binding
D2 Teacher UI: hide timer/Add Time
D3 S6 Teacher close RPC with request identity
D4 Player S6 Continue removal + Teacher S6 control
D5 integrated Discussion regression
```

## 4.8 Tests

1. generic/S5/S6 NORMAL discussions receive a three-hour deadline;
2. no automatic transition during a representative classroom interval;
3. Teacher opens generic/S5 vote immediately without waiting;
4. Teacher closes S6 immediately without waiting;
5. stale Teacher session/round action rejects;
6. S6 duplicate Teacher click is idempotent;
7. Player S6 UI cannot advance the normal discussion;
8. messages remain accepted before Teacher close;
9. NORMAL Add Time is absent;
10. no non-Discussion timer changed;
11. reconnect restores the same discussion;
12. existing ACT1–14 path and finalization remain green.

## 4.9 Cost

- generic/S5 duration changes: `1/5`;
- UI timer/Add Time removal: `1/5`;
- S6 Teacher close RPC: `2/5`;
- S6 Player/Teacher UI: `1–2/5`;
- regression: `2–3/5`;
- overall revised estimate: `2–3/5`, down from `3–4/5`.

---

# 5. Issue 3 — ACT7 wrong-majority classification

## 5.1 Defect

The base S5 vote mutation can mark an ACT7 resolved round `wrong_majority`. The later canonical wrapper then treats every non-tie resolved result as ordinary `player_majority`, overwriting the distinction.

## 5.2 Modification

1. Define one result kind returned from the effective vote mutation:
   - `SUCCESS`;
   - `NO_CONSENSUS`;
   - `WRONG_MAJORITY`;
   - `SYSTEM_FALLBACK`.
2. The owner writes the resolved round classification once.
3. The outer wrapper transports the classification and must not infer/rewrite it.
4. Player and Teacher reads expose `latest_result` from the most recent resolved round even if the next round is open.
5. Keep every genuine vote in its original round.
6. Attach the common result occurrence ID and three-second window from Issue 5.

## 5.3 Tests

- correct majority;
- wrong unanimous/majority answer;
- three-way no-consensus;
- fallback;
- next round open while prior result remains readable;
- reconnect during result;
- export retains original classification.

**Cost:** `2/5` backend; `2–3/5` including result display adapter.

---

# 6. Issue 4 — ACT3 password-box cooldown

## 6.1 Server mutation

Reuse existing request UUID, replay lookup, run/state lock, attempt number and attempt table.

Order inside `s3b_submit_library_code` replacement:

1. validate request UUID/code;
2. return exact same-request replay before cooldown check;
3. reject conflicting UUID reuse;
4. lock active run/state;
5. read latest accepted attempt timestamp;
6. reject any new unique input during the next three seconds;
7. insert one accepted attempt after the window;
8. keep correct transition canonical and one-time.

Cooldown applies across all three Players, not per browser.

## 6.2 UI behavior

For a wrong accepted attempt:

- show only “密码错误” for the common result window;
- disable the input/button locally during that window;
- suppress an additional “暂不接受新输入/投票” message;
- if a stale client submits during the window, keep displaying the same password-error occurrence;
- enable input after the server window.

## 6.3 Tests

- idempotent retry inside three seconds;
- conflicting replay;
- simultaneous unique attempts from two Players;
- queued second attempt rejected;
- new attempt after three seconds accepted;
- correct transition once;
- no extra cooldown wording.

**Cost:** `2/5` server-only; `3/5` with four-view result presentation.

---

# 7. Issue 5 — unique result number and three-second four-view display

## 7.1 Common read shape

Each domain publishes:

```text
result_occurrence_id UUID
owner_domain
run_id
interaction_identity
result_kind
text_key(s)
started_at
visible_until = started_at + 3 seconds
validity
```

The UUID is unique across ACT3/S5/S6 results.

## 7.2 Domain ownership

- ACT3 generates occurrence ID on accepted Library attempt.
- S5 generates occurrence ID when a vote round resolves.
- S6 generates occurrence ID atomically with its feedback result.
- S7 aggregates only Teacher-safe occurrence data.

No shared result resolver decides gameplay.

## 7.3 Rendering

Three Player views and Teacher:

- render the same occurrence ID;
- deduplicate repeated polls;
- use the same server end time;
- reconnect within the window shows the remainder;
- reconnect after expiry does not replay;
- a newer occurrence replaces an older one;
- overlay does not block Teacher emergency/network handling.

With current polling, viewers may receive the result at slightly different instants, but all use the same server three-second window and end time. Millisecond-identical starts are not promised without a realtime push architecture.

## 7.4 Tests

- all four views receive one ID;
- repeated poll does not restart timer;
- mid-window reconnect;
- expired reconnect;
- adjacent results do not overwrite in reverse order;
- no private choice leaks before reveal.

**Cost:** ACT3 only `3/5`; full ACT3/S5/S6 coverage `4/5`.

---

# 8. Issue 6 — ACT2 Follow Sign and W05

## 8.1 Authoritative behavior

Successful `s3b_follow_sign` directly writes the Player location to Library. Do not add:

- sign-seen acknowledgement;
- rerouting state;
- en-route state;
- additional Player button.

## 8.2 Teacher display

After the server confirms `player_location='library'`, Teacher W05 displays the existing localized equivalent of:

```text
<Player name> 进入图书馆
```

Before confirmation, show the existing waiting/current-location state without claiming the Player saw the sign.

Each Player updates independently.

## 8.3 W05 projection

Use existing S7 Teacher response, not a new endpoint. Keep physical location separate from later role/task/engagement fields. No ACTIVE `game_runs` fallback.

**Cost:** included in W05; W05 revised total approximately `2/5`.

---

# 9. Issue 7 — TOP late-request scope

At Teacher direction, the previously proposed separate TOP late/duplicate-request work package is removed.

No dedicated implementation, test matrix or cost is assigned under this issue.

The TOP action itself still uses one request UUID to prevent duplicate Teacher clicks because that is necessary for the operation to be executable once; this is not expanded into a general stale-Player-request programme.

---

# 10. Issue 8 — Teacher state-level Player operations

## 10.1 Display categories

Teacher sees only current state-level summaries:

1. connection: online/offline/reconnecting;
2. location: in/left/entered named room;
3. transition barrier: entered and waiting for others;
4. Discussion: discussing/waiting for Teacher;
5. vote: not submitted/submitted/waiting for others/result;
6. puzzle: active/result/solved;
7. Main Gate allocation: A/B/C/WATCHER assignment;
8. Main Gate work: not ready/ready/task complete/ENGAGED/waiting for others;
9. escape/finalization: escaping/outside/waiting finalization/completed.

Main Gate allocation/work belongs principally to ACT11–12. ACT13 is escape/result progression.

## 10.2 Data source

Read current canonical fields:

- S3B Player progress/location/entry;
- current Discussion session and current-round submission;
- S5 current phase/round;
- S6 allocation/task/engagement/current phase;
- finalization state;
- last-seen connection time.

Do not use global latest-event selection. Do not expose unrevealed private choice values.

## 10.3 Response/UI

Extend the versioned S7 Player projection with:

```text
status_code
status_text_key
source_domain
source_identity
validity
```

Teacher renderer uses existing localization terms and one status owner per row.

## 10.4 Tests

- each location transition;
- Discussion versus submitted vote;
- partial ACT6 entry barrier;
- ACT11 A/B/C and A/B/WATCHER;
- partial tasks and ENGAGE;
- private-value non-disclosure;
- reconnect;
- completed run.

**Cost:** `2/5` standalone; `1–2/5` incremental after W05.

---

# 11. Implementation order

After CA review and explicit implementation release:

```text
P0 freeze baseline and add contract tests

P1 W05 + Teacher state-level projection
   - includes ACT2 direct Library wording

P2 Discussion three-hour compatibility
   - generic/S5 duration and UI
   - S6 Teacher close RPC and UI

P3 ACT3 cooldown + ACT3 occurrence

P4 ACT7 result-kind correction

P5 S5/S6 occurrence adapters + four-view overlay completion

P6 TOP required-information table extraction only
   - no TOP runtime until table is GA-audited and values approved

P7 generic NEXT_TOP engine + OR record

P8 thirteen ACT-by-ACT manifest integration and regression

P9 integrated three-Player + Teacher trial and freeze
```

P6 is the technical table requested by Teacher. GA contact remains deferred until Teacher instructs CD to send it.

---

# 12. Commit and migration boundaries

Use separate forward migrations/commits for:

1. W05/status projection;
2. Discussion duration/exact generic-S5 Teacher action;
3. S6 Teacher close;
4. ACT3 cooldown/occurrence;
5. S5 result classification;
6. S6 occurrence;
7. TOP manifest/OR storage;
8. NEXT_TOP execution;
9. each group of audited manifests only when interfaces are identical and tests remain readable.

Never modify migrations `001`–`068`. Recheck latest migration number immediately before implementation.

Frontend commits remain separate where rollback of SQL and UI can be paired safely.

---

# 13. Integrated acceptance

The revised programme passes only when:

- normal Discussion does not auto-transition during a complete representative class run;
- generic/S5 Teacher opens vote;
- S6 Teacher closes Discussion;
- Add Time is absent in NORMAL;
- ACT7 wrong majority remains distinct;
- ACT3 rejects new input for three seconds without extra cooldown wording;
- four views share occurrence ID and server window;
- ACT2 Follow Sign immediately updates Teacher to entered Library;
- Teacher status remains state-level/private-safe;
- TOP no-fill, partial-fill, full-fill and repeated NEXT_TOP cases pass for every audited manifest;
- OR values drive runtime but are excluded from behavioral analysis;
- finalization/export remains honest about Override use;
- placeholder media remains sufficient for runtime trial;
- no unrelated timer or ACT progression regresses.

---

# 14. Revised costs

| Issue | Revised cost |
|---|---:|
| 13 TOPs with minimal-key manifests and OR list | `3–4/5` |
| Discussion three-hour compatibility + S6 Teacher control | `2–3/5` |
| ACT7 result correction | `2–3/5` |
| ACT3 cooldown and ACT3 display | `3/5` |
| Full four-view ACT3/S5/S6 result occurrence | `4/5` |
| ACT2 direct Library display / W05 | W05 total `2/5` |
| TOP late-request work | removed |
| Teacher state-level Player status | incremental `1–2/5` |

---

# 15. Review and hold

CA is requested to review this V2.2 plan against current effective code, focusing on:

1. whether three-hour NORMAL Discussion plus one S6 Teacher action is internally complete;
2. exact functions that create/configure the relevant deadlines;
3. S6 Teacher close authentication, identity and idempotency;
4. feasibility of compact `before_state_json` + `or_filled_json` without corrupting canonical values;
5. whether the generic NEXT_TOP transaction can remain a required-key filler rather than a second gameplay engine;
6. migration/commit/test boundaries and revised cost.

No other Agent is notified by this revision. Implementation remains on HOLD until CA returns and the Teacher releases the next step.
