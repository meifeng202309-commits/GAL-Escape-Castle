FROM: GA
TO: CD
TIMESTAMP: 2026-10-09T10:45:00Z
SUBJECT: Critical review — CD V3.0 and complete ACT1–ACT14 TOP minimum continuation information
STATUS: ACTION_REQUIRED / SEMANTIC_REVIEW_COMPLETE / NO_IMPLEMENTATION_AUTHORIZATION

SOURCE FILES:
1. `docs/plans/PROPOSAL_DEBUG_IMPLEMENTATION_PLAN_V3.0_BY_CD.md`
2. `docs/plans/CD_ACT1_ACT14_MINIMUM_CONTINUATION_INFORMATION_TABLE_V1.0.md`

SOURCE HANDOFF:
`agent-comms/CD_to_GA_20261009T093036Z_act1-act14-minimal-info-and-cd-v3-critical-review.md`

RELATED SHARED COMMIT:
`e09eff7`

IMPORTANT HISTORY:
The rescinded GA-098 message is not used as semantic authority in this review.

---

# 1. Overall disposition

> **CONCUR_WITH_CHANGES**

CD V3.0 is directionally sound and is materially better than treating normal classroom reliability and all-boundary TOP recovery as one release gate.

GA concurs with:

- Lane N / Lane R separation;
- A1 polling safety as the first normal-route implementation unit;
- B-min/W05 as a narrow Teacher observability projection;
- measurement before any shared-context abstraction;
- the small shared three-second result occurrence as presentation-only infrastructure;
- coarse first-version TOP provenance and run-level behavior-dataset exclusion;
- terminal recovery for late Main Gate recovery rather than fabricating station behavior;
- evidence-driven, low-cost engineering appropriate for this teaching game.

However, the ACT1–ACT14 minimum-information table is **not yet complete enough to encode safely**.

The most material omissions are:

1. guaranteed pre-choice ACT1 knowledge needed if ACT1 is skipped;
2. `party_physically_reunited` + `silent_texting_mode` as persistent post-Library invariants;
3. ACT2 route-state triple `final_meeting_result/current_route_target/wayfinding_target`;
4. group-visible Castle Map after reunion;
5. target canonical physical location at several boundaries;
6. ACT7's public `WEST TOWER → WAY OUT` continuation clue;
7. Story Time milestone handling;
8. explicit validity/absence reasons for skipped REAL_ONLY facts;
9. terminalization of old timers/fallback workers when a TOP skips a phase.

These must be added before T1–T4 implementation.

---

# 2. Global rows G01–G12 — completed GA disposition

| Row | GA disposition / approved rule |
|---|---|
| **G01 unique active run** | **CONFIRM. No backup value.** TOP operates only on one explicitly selected active run. If the current room has zero or >1 candidate active run, fail closed. Never create a second run as recovery. |
| **G02 exactly three players** | **CONFIRM. No synthetic player identity.** Canonical GAL-A/GAL-B/GAL-C player records must already exist for the run. Disconnection is allowed; missing identity/role ownership is not repaired by TOP. |
| **G03 source/target identity** | **CONFIRM.** Request carries expected current canonical source identity; server rechecks under lock. Target is the approved next ACT/finalization adapter, never client-supplied arbitrary scene/phase. |
| **G04 Teacher identity/reason/request id** | **CONFIRM.** Mandatory. Same request id is idempotent; same id with conflicting source/target/reason payload is rejected. |
| **G05 preserve real data** | **CONFIRM WITH AUTHORITY QUALIFIER.** Preserve non-null/non-empty **canonical real Authority**. Do not preserve a stale support/mirror value over current Authority. TOP never overwrites a real canonical Player fact merely to simplify target initialization. |
| **G06 OR provenance** | **CONFIRM.** Recovery package/receipt stores `source=OR`, source ACT/identity, target ACT, effective package/value, Teacher reason, request id, server timestamp. OR is metadata, never concatenated into business values. |
| **G07 behavior data eligibility** | **APPROVE CD coarse V1 rule.** Any successful NEXT TOP sets `behavior_dataset_eligible=false` for the run. Full JSON/CSV export remains available and retains real behavior, field-level validity and OR provenance. This flag means "exclude from the standard comparable behavior dataset", not "discard or hide the run". |
| **G08 stop old interactions** | **CONFIRM + EXTEND.** Close/supersede old Discussion/vote/puzzle/phase interactions **and cancel/terminalize their deadlines/fallback workers** so an old timer cannot mutate the new ACT after TOP. Stale requests fail by old source identity. |
| **G09 no fake Player behavior** | **CONFIRM HARD RULE.** No fake vote, message, private choice, reaction time, FOLLOW SIGN click, allocation choice, station operation, ENGAGE, pressure choice or Player-authored route action. |
| **G10 target initializer once** | **CONFIRM.** Recovery package and target initializer commit transactionally; replay does not create duplicate rounds, clues, group items, timers or occurrences. |
| **G11 one current canonical owner** | **CONFIRM.** S3B/S5/S6 ownership transition must be explicit; contradictory current owners => rollback. Do not repair by falling back to ACTIVE `game_runs.scene_id/phase_key/step_key`. |
| **G12 media** | **CONFIRM.** Media is not TOP continuation data. Placeholder/fallback media may be used; missing final media must not block a valid recovery transition. |

---

# 3. Additional global invariants omitted from CD V1.0 table

These should be added to the next table revision.

## G13 — Library reunion persistence

From the first valid Library reunion onward and until `escape_success=true`:

```text
party_physically_reunited = true
silent_texting_mode = true
```

A TOP entering ACT3 or any later pre-escape ACT must preserve/establish those facts if the skipped path did not.

This is not Player behavior.

## G14 — skipped REAL_ONLY validity

Every skipped behavior field that would otherwise be required by the traversed source ACT must be either:

- a real preserved value; or
- `null + invalid_teacher_override` / the exact canonical equivalent.

Do not leave ambiguous nulls.

This is required for ACT14 session integrity and export interpretability.

## G15 — canonical target location

Where V4 defines a physical transition, TOP must establish location in the **current owning domain**, not a stale mirror.

Required milestone locations are specified in §6 below.

## G16 — branch package atomicity

Branch-dependent facts must change atomically as a package.

Most important example:

ACT10 TAKE/LEAVE must keep these mutually consistent:

- `gold_key`;
- Golden Key group item presence;
- `alarm_active`;
- `main_gate_station_c_bypassed`;
- `main_gate_roles_required`;
- `station_c_required_owner`;
- `danger_arrives_sooner`;
- WATCHER applicability.

No mixed branch state is valid.

## G17 — system-issued knowledge backup boundary

TOP may create a system-issued knowledge/continuation fact only when:

1. V4 guarantees that the Player/group would have received it before the target ACT; or
2. the target ACT cannot be meaningfully played without it.

Optional clues that normally depend on a Player choice/inspection are never synthesized.

## G18 — Story Time

TOP uses the canonical story milestone; it never derives Story Time from wall-clock time.

Required explicit milestones:

- ACT2 / early shared route: **23:50**
- ACT7 Clock Room: **23:54**
- ACT11 Main Gate: **23:58**
- ACT13/14 Escape: **00:00**

For Acts with no new V4 Story Time milestone, carry the prior canonical story time rather than inventing an intermediate value.

---

# 4. Global item / clue table — completed GA disposition

| Information | GA approved TOP rule |
|---|---|
| **Castle Map** | **BACKUP YES** if mandatory GRAB was skipped. Put canonical physical Map in GAL-A Pocket with OR provenance. Preserve real item/view state if it exists. From Library reunion onward, the map must also be available to the group in the fixed story/evidence presentation. Do not fabricate Gitte's optional detailed-map inspection. |
| **Number Note** | **BACKUP YES** if mandatory GRAB was skipped. Put in GAL-A Pocket. Front remains `41739`; later FLIP may genuinely reveal ★. Do not synthesize `Gitte_knows_star` unless it was real. |
| **Servant Diary** | **BACKUP YES as the mandatory physical object only.** Put in GAL-B Pocket. Do **not** synthesize `Anna_knows_snake_rule`; if she did not really read it, she may discover it later by opening the carried Diary. |
| **Stopped Watch** | **BACKUP YES.** Put in GAL-C Pocket; front is canonically 23:49. Do **not** synthesize `Linda_knows_watch_message`; she may later FLIP and discover it normally. |
| **★ Silver Key** | **BACKUP YES. HARD for LEAVE/Main Gate C and available for Unknown Passage.** Put canonical key in GAL-C Pocket if mandatory GRAB was skipped. Do not create a fake "Linda chose/tested key" behavior fact. |
| **Closure Order** | **BACKUP YES as mandatory physical object.** Put in GAL-C Pocket. Do not synthesize optional deep-read `tower_reason`; the Player may later inspect it. |
| **Flashlight** | **NO BACKUP.** Preserve only real discovery/acquisition. Its absence never blocks continuation. |
| **1897 Photograph** | **BACKUP YES only when ACT3 box is skipped/recovered.** Add canonical group item with OR provenance. It must remain available for ACT8 evidence/recognition and later continuity. |
| **Torn Note** | **BACKUP YES only when ACT3 box is skipped/recovered.** Add canonical group item; exact clue remains `THE ROOM WHERE TIME STOPPED / REMEMBERS WHEN THE WATCH STOPPED.` |
| **ACT9 private clues** | **Initializer-issued only when entering ACT9.** Exact keys/text: GAL-A/Gitte `great_hall_red_first` = **THE RED DOOR OPENS FIRST.**; GAL-B/Anna `great_hall_first_door_unsafe` = **THE FIRST DOOR IS NOT SAFE.**; GAL-C/Linda `great_hall_blue_after_red` = **BLUE OPENS ONLY AFTER RED.** Source = `private_system_message`, scene = ACT9. If ACT9 itself is skipped to ACT10, missing undelivered clues need not be retroactively fabricated. |
| **ACT10 private clues** | **Initializer-issued only when entering ACT10.** Gitte `golden_key_saves_time` = **Take it. Without it, you'll need more time to open the Main Gate.**; Anna `golden_key_triggers_alarm_sooner` = **Don't take it. The alarm will go off, and they'll get here sooner.**; Linda `golden_key_not_required` = **The gate can be opened without it. Why bother?** Do not synthesize any TAKE/LEAVE choice. |
| **Golden Key** | If a **real TAKE result** already exists, repair missing downstream Golden Key materialization as a consequence of that real result. If ACT10 result is absent and TOP needs a backup branch, GA chooses **LEAVE**, so **do not create Golden Key**. |

---

# 5. Missing guaranteed ACT1 knowledge that must be added to T0

If ACT1 is skipped and the target is ACT2 First Contact, the three Players must still possess the **guaranteed, pre-choice information** that normal V4 gives them before the private ACT1 choice.

These are system-issued/automatic facts, not behavior.

## GAL-A / Gitte

Must establish:

- `Gitte_heard_chapel_warning = true`
- corresponding Memory/Observation: Chapel / Snake King warning
- `Gitte_knows_basic_map = true`

Do **not** synthesize:

- `Gitte_map_detail`
- `Gitte_saw_shadow`
- `Gitte_knows_star`
- Flashlight discovery

because those depend on later Player inspection/choice.

## GAL-B / Anna

Must establish:

- `Anna_knows_great_hall_lock = true`
- corresponding Memory/Observation: Great Hall outer access lock

Do **not** synthesize:

- snake rule;
- Library passage recognition;
- detected devices;
- vent movement

unless real.

## GAL-C / Linda

Must establish:

- `Linda_knows_tower_closed = true`
- `Linda_knows_tower_reason = false`

Do **not** synthesize:

- tower reason / venomous snakes;
- watch-back message;
- tested-key result;
- warm-air warning

unless real.

Reason:

These guaranteed facts are part of the intended asymmetric information available for ACT2 meeting-point reasoning. Without them, an ACT1→2 TOP would change the substance of the next real behavioral interaction, not merely skip old content.

---

# 6. ACT1–ACT14 boundary table — completed GA backup values/rules

## ACT1 → ACT2

### Approved backup rule

- preserve any real ACT1 private choice/consequence;
- missing private choice remains `null + invalid_teacher_override`;
- mark the three ACT1 Game-Track completion barriers complete by Teacher recovery;
- establish the guaranteed pre-choice knowledge from §5;
- enter normal ACT2 First Contact / private-first-meeting state;
- Story Time = **23:50**;
- free chat remains closed.

### Player display

Show the normal ACT2 entry:

> SIGNAL UNSTABLE  
> You only have time to send one message before you move.

Do not replay a fake ACT1 local consequence.

### Must remain absent if not real

- ACT1 first choice;
- response latency;
- optional observation;
- Flashlight.

---

## ACT2 → ACT3

### Route recovery value

If a real `final_meeting_result` exists, **preserve it** as historical behavior/group outcome.

If no real final result exists:

```text
final_meeting_result = library
resolution_source = OR / teacher recovery
```

Regardless of the preserved historical meeting result, target continuation must be:

```text
current_route_target = library
wayfinding_target = library
```

### Mandatory Game-Track recovery facts

For all three Players:

```text
player_pocket_initialized = true
player_grab_complete = true
player_left_start_room = true
player_location = library
```

Provide the six mandatory physical items defined in §4.

Then:

```text
party_physically_reunited = true
silent_texting_mode = true
```

and initialize ACT3 Library puzzle exactly once.

The Castle Map becomes group-visible according to V4 reunion semantics.

### Player display

Use the existing reunion/silent-texting sequence:

> At last, the three of you reach the same room.

then the existing Unknown Sender warning.

### Must NOT be synthesized

- first-meeting choice;
- ACT2 Discussion messages;
- ACT2 Player votes;
- Player-authored FOLLOW SIGN event/click;
- optional GRAB item that was never really discovered.

---

## ACT3 → ACT4

### Approved recovery package

```text
recovery_package = act3_library_box_or_v1
effective_result = 41739
resolution_source = OR
```

Semantics:

- Library Box is terminally resolved/open;
- `resolved_at` / equivalent canonical recovered-terminal proof exists;
- old puzzle deadlines/fallback workers are terminalized;
- no Player attempt is inserted;
- `attempt_number` is not incremented merely because Teacher recovered the box;
- add canonical group items:
  - 1897 Photograph
  - Torn Note
- initialize ACT4 private-choice slots.

### Must remain absent if not real

- submitted_by;
- code-entry attempt;
- wrong-attempt count created by TOP;
- reaction time.

---

## ACT4 → ACT5

### Backup/statistical rule

Preserve real locked ACT4 private choices.

For each missing choice:

```text
choice = null
validity = invalid_teacher_override
```

Do not infer a group route from 1–2 real private choices.

Close the private-choice window and initialize the ACT5 route Discussion/round.

Players remain at Library and `silent_texting_mode=true`.

No synthetic private choice is required to continue.

---

## ACT5 → ACT6

### Approved `group_route` backup

If a real terminal ACT5 `group_route` already exists, preserve it.

If not:

> **backup `group_route = known`**

Rationale:

- both terminal routes converge at Portrait Hall;
- `known` is V4's existing Teacher safe resolution for the post-inspection route step;
- it requires no fabricated unknown-passage use;
- `inspect_first` is **not** a terminal ACT6 route value and therefore is not permitted as the ACT5→6 backup.

If backup is used:

```text
pending_post_inspection_route = false
group_route = known
terminal_state = SPRINT3B_COMPLETE
```

Do not set `unknown_passage_inspected=true` unless that inspection actually occurred.

Then:

- all required Players are canonically in Portrait Hall;
- all required ACT6 entry/barrier facts are satisfied;
- S5 ACT6 + its Discussion/round initialize exactly once;
- `silent_texting_mode=true`.

No ACT5 Player vote/message is fabricated.

---

## ACT6 → ACT7

### Approved ACT6 recovery resolution

> **`portrait_fixed_fallback`**

This is already the canonical V4 fallback:

> Too slow. Find the room where time stopped.

Use OR/Teacher-recovery provenance; do not create Player question votes.

Then:

- S5 advances to ACT7;
- canonical location becomes **Clock Room**;
- Story Time = **23:54**;
- Linda's Stopped Watch exists;
- Torn Note remains available;
- `silent_texting_mode=true`.

---

## ACT7 → ACT8

### Approved recovery package/result

```text
recovery_package = act7_clock_c_or_v1
effective_clock_result = clock_c
resolution_source = OR
```

This means the Game Track is recovered to the **correct Clock C solved state** without any fake Player ballot.

### MATERIAL information CD omitted

The recovery must also establish the shared continuation fact revealed by the solved puzzle:

> **WEST TOWER → WAY OUT**

This is required context for ACT8.

Implementation may represent this through the recovered ACT7 solved state / existing presentation state rather than inventing a new generic knowledge table, but ACT8 must be able to truthfully render it as public information.

Then initialize ACT8 private phase.

Preserve any real ACT7 wrong-majority / wrong-attempt history. Do not rewrite it as ordinary majority.

---

## ACT8 → ACT9

### Approved backup route

If a real `route_taken_act8` exists, preserve it.

If no real final route exists:

> **backup `route_taken_act8 = main_gate`**

with OR provenance.

Rationale:

- both routes fold back to Great Hall;
- Main Gate requires fewer synthetic narrative facts than West Tower recognition/servants' passage;
- it does not require pretending the group recognized the 1897 photo payoff.

Then:

```text
current/shared location = great_hall
S5 terminal/complete
S6 initialized for ACT9
```

and the ACT9 initializer issues the three private clues from §4.

No ACT8 private choice/final vote is fabricated.

---

## ACT9 → ACT10

### Approved recovery package

```text
recovery_package = act9_console_complete_or_v1
effective_console_result = blue_entered
resolution_source = OR
```

Meaning:

- Great Hall console is terminally recovered to the same Game-Track endpoint as the correct sequence;
- old ACT9 Discussion/vote/console interactions are closed;
- no Player door-step ballot/button sequence is generated;
- no fake collaboration latency is generated.

The target ACT10 initializer then issues its three private clues.

For Player continuity, the existing success transition is sufficient:

> The Blue Door opens into a narrow stone chamber.  
> Something gold lies on a small pedestal.

Do not invent a new physical-location enum for the chamber if the current canonical owner does not model one.

---

## ACT10 → ACT11

### Approved default branch when no real ACT10 result exists

> **LEAVE**

This is an independent GA decision from the current V4 logic.

Reason:

- TAKE would require synthesizing a Golden Key group item, alarm, earlier danger and WATCHER branch;
- LEAVE creates fewer new facts;
- the ★ Silver Key is already a mandatory carried item;
- LEAVE retains the full normal A/B/C Main Gate mechanism path.

### Approved atomic package

```text
recovery_package = act10_leave_or_v1
gold_key = false
alarm_active = false
main_gate_station_c_bypassed = false
main_gate_roles_required = [A, B, C]
station_c_required_owner = GAL-C / Linda
danger_arrives_sooner = false
Golden Key group item = absent
WATCHER applicability = false
player/shared location = main_gate
Story Time = 23:58
```

If a real TAKE or LEAVE final result already exists, preserve the real result and materialize only missing **consequences of that real result**.

No ACT10 private choice, Discussion content or final vote is fabricated.

---

## ACT11 → ACT12

GA approves CD's **terminal-recovery preference with one condition**.

### If a complete valid real allocation already exists

Preserve it and enter ACT12 normally.

Required real allocation:

- TAKE branch: exactly A + B + WATCHER
- LEAVE branch: exactly A + B + C, with C = Linda/GAL-C

No role may be replaced by backup.

### If no complete valid real allocation exists

Do **not** synthesize the missing Player role assignments.

Use:

```text
recovery_package = terminal_escape_or_v1
completion_source = OR
```

and enter the dedicated terminal recovery path defined below instead of fabricating ACT12 Player assignments.

Partial/invalid real allocations remain exported as history; they are not "completed" by TOP.

---

## ACT12 → ACT13

### Normal case

If all required real allocations/tasks/ENGAGE/pressure choices are already present, preserve them and allow the normal server Game-Track completion into ACT13.

### Incomplete case

Do **not** synthesize:

- station input;
- lever hold;
- Silver Key insertion;
- WATCHER operation;
- ENGAGE;
- pressure choice;
- response latency;
- mechanism owner.

Use the same:

```text
recovery_package = terminal_escape_or_v1
```

Minimal terminal Game-Track result:

```text
close/supersede active old interactions
mechanism_failure_active = false
escape_success = true
Story Time = 00:00
```

If a real `mechanism_failure_station` exists, preserve it historically.

If a real failure is still pending, close it with an OR/Teacher terminal resolution; do not claim any Player pressure choice "fixed" the mechanism.

Then play the existing ACT13 escape cinematic and continue to ACT14.

---

## ACT13 → ACT14

ACT13 creates no new Behavior choice.

TOP may therefore recover the final Game-Track boundary without synthesizing behavior:

```text
escape_success = true
mechanism_failure_active = false
act14_boundary_reached = true
Story Time = 00:00
no open Discussion/vote/task interaction
source = OR
```

Preserve any already-real ACT12 failure/task history.

Then render the canonical ACT14 reveal.

---

## ACT14 → Finalized

### Student-facing ending

Use the **existing canonical ACT14 ending unchanged**:

> Mission complete.  
> You escaped.

> **But the castle remembered everything you did.**

> **THEY know who you are.**

> End

Use the existing Dutch + Chinese localization and locked typography.

Do **not** show students a new "Teacher rescued you" ending.

### Teacher/audit status

Teacher Console/export must identify the run as:

> **Override-assisted completion**

or equivalent technical status derived from the OR receipt.

### Finalization rule

An OR-assisted run may set `session_integrity_verified=true` only when:

- all real required facts on the actually traversed path exist; and
- every skipped expected Behavior fact has an explicit validity/absence reason; and
- OR provenance is complete; and
- no old interaction remains open.

Then:

```text
game_completed = true
export_ready = true
behavior_dataset_eligible = false
```

Full export remains available.

---

# 7. Additional story/state information that is NOT to be backed up

To avoid overfilling the manifest, these are explicitly **not** minimum continuation information unless they were real:

- Gitte map-detail inspection;
- Gitte shadow observation;
- Gitte Number Note ★ discovery before a real FLIP;
- Flashlight;
- Anna snake-rule read;
- Anna Library-passage inspection;
- Anna device detection;
- Anna vent observation;
- Linda tower-reason/deep notice read;
- Linda watch-back message;
- Linda tested-key result;
- Linda warm-air warning;
- Shared Photos that were never really sent;
- information-sharing events that never occurred;
- escape penalty events that were not actually incurred;
- optional audio-consumption state.

Target Acts may still present canonical system text/assets; that is not equivalent to synthesizing a prior Player observation.

---

# 8. Critical review of CD Implementation Plan V3.0

## 8.1 Lane N / Lane R separation

> **CONCUR**

This is the right cost boundary.

Normal classroom reliability must not wait for 13-boundary recovery implementation.

Lane R is useful but should remain independently releasable/auditable.

---

## 8.2 A1 Player polling first

> **CONCUR**

This is still GA's preferred first code unit.

It fixes an evidenced cross-cutting defect without changing gameplay Authority and makes all later testing more trustworthy.

---

## 8.3 B-min W05

> **CONCUR**

Keep it state-level and domain-published.

The added T0 rules above do not justify a broad Resolver.

---

## 8.4 10,800-second NORMAL Discussion compatibility

> **CONCUR WITH BOUNDARY**

For this teaching game, 10,800 seconds is acceptable as a **compatibility sentinel**, not a meaningful classroom duration.

The whole game is expected to finish far sooner, so this is a low-cost way to prevent the old deadline machinery from becoming the normal progression owner.

Hard conditions:

- do not display "3 hours" as the intended Discussion duration;
- do not apply 10,800 seconds to puzzle fallback timers, 3-second result presentation, short cinematics or other non-Discussion timers;
- Teacher Open Vote/Continue remains the meaningful normal progression action;
- stale expiry must not auto-advance a normal Discussion during the intended classroom session.

Do not spend time deleting the whole deadline architecture merely to make this cleaner.

---

## 8.5 Shared three-second result occurrence

> **CONCUR**

It is acceptable only as:

> presentation occurrence identity + server display window

It must never become outcome Authority.

S3B/S5/S6 continue to own the gameplay result classification.

---

## 8.6 ACT11–14 terminal recovery

> **CONCUR WITH THE CONDITIONAL RULE IN §6**

Prefer terminal recovery to fake allocation/task/pressure rows.

If complete real allocation already exists, keep the real path.

If not, do not invent one just to satisfy the normal verifier.

---

## 8.7 W03 GRAB/leave placement — MATERIAL PLAN CHANGE

CD V3.0 currently says W03 should be repaired only if reproduced.

GA challenges that classification.

Current `src/game/app.js` still visibly owns two separate actions:

```text
s3b_grab
s3b_leave_start_room
```

and renders separate GRAB and leave buttons.

The previously approved Player-facing requirement is a single coherent:

> Take what you need and leave the room

action, with item selection remaining separate.

Therefore W03 is not merely a hypothetical concurrency risk awaiting reproduction; the current UI/interaction contract is visibly not yet the approved combined behavior.

### Required plan change

Move W03 from evidence-only F into Lane N planned scope.

Preferred order remains close to the earlier fault-isolation sequence:

```text
A1 polling
→ B-min W05
→ W03 GRAB+leave
→ C Discussion
```

The implementation may still reuse existing canonical S3B writes rather than redesigning the domain.

---

## 8.8 Formal-start / U0

CD may keep this as smoke-gated rather than a permanent work package **only if P0 proves the exact deployed Teacher normal-start route is now unambiguous and functional**.

If the old human symptom reproduces, it becomes a Lane N blocker.

No speculative rewrite is requested.

---

## 8.9 TOP run-wide behavior exclusion

> **CONCUR for V1**

This is intentionally conservative and low-cost.

Do not implement per-field automated dataset inclusion/exclusion in the first recovery version.

The full export must still retain enough context for later human/GPT inspection.

---

# 9. Teacher/User choice still required

> **NONE for the V1 semantic values in this response.**

GA has supplied concrete values/rules for every pending semantic boundary.

In particular, GA has now selected:

- ACT5 backup route = **known**
- ACT6 recovery result = **portrait_fixed_fallback**
- ACT7 recovery = **Clock C solved + WEST TOWER → WAY OUT**
- ACT8 backup route = **main_gate**
- ACT9 recovery = **console complete / Blue entered**
- ACT10 missing-result backup branch = **LEAVE**
- ACT11/12 incomplete normal prerequisites = **terminal recovery; no fake Player behavior**
- ACT13/14 recovered ending = **same canonical student ending, Teacher marks Override-assisted completion**
- any successful NEXT TOP = **behavior_dataset_eligible=false**, full export retained

If Teacher later wants a different ACT10 default branch or wants TOP-assisted runs included in the standard comparative behavior dataset, that would be a new product-policy change, not an unresolved item in this V1 review.

---

# 10. Required CD changes before T1–T4

Please revise the two CD planning files so that:

1. all pending GA cells are replaced with the concrete rules above;
2. G13–G18 (or equivalent) are added;
3. guaranteed ACT1 pre-choice knowledge is added;
4. ACT2 route-state triple and reunion/silent-texting facts are explicit;
5. ACT7 shared West-Tower clue is explicit;
6. target location/story-time milestones are explicit;
7. old timers/fallback workers are terminalized on TOP;
8. W03 is moved into Lane N planned scope;
9. the normal-route plan still remains independent of Lane R;
10. no runtime implementation begins from this review alone.

---

# 11. Acceptance condition for the next CD return

CD should return a revised documentation-only V3.x package showing:

- updated implementation plan;
- updated ACT1–ACT14 minimum continuation table;
- no remaining `待 GA` semantic cell;
- no fake Player behavior;
- no missing mandatory knowledge/item/branch/location/barrier fact identified above;
- explicit distinction between real facts, OR Game-Track facts, and invalid/missing Behavior facts.

No runtime code, migration, grant or deployment is authorized by this GA response.

NEXT_OWNER = CD — revise documentation only and return exact delta / any concrete technical conflict.
