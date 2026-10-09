# Proposal of Debug Implementation Plan V2 by CD

**Date:** 2026-10-09

**Owner:** CD — Code Development Agent

**Status:** CD INTERNAL PROPOSAL / LOCAL COMMIT ONLY

**Implementation authorization:** NONE

**Notification status:** NOT SHARED WITH OTHER AGENTS

**Branch:** `remediation/sprint9-structural-v1`

**Repository basis:** `bd5cc0318a6d16d074291d73806b0097b0c7381b`

**Supersedes:** no canonical plan; this is CD's implementation counter-proposal to GA V1

This document proposes the lowest-cost implementation route from the current repository to a reliable three-Player plus Teacher trial. It is deliberately written from the builder's perspective: minimize new runtime surface, fix proved defects at their owner, keep every change independently testable, and avoid architecture work whose benefit has not been measured.

It does not authorize a database deployment, production publication, Teacher Recovery expansion, or communication to another agent.

---

# 1. CD decision

Use a **defect-first, domain-local, forward-only** implementation sequence:

1. make Player and Teacher polling safe;
2. publish W05 from existing domain facts through S7;
3. remove automatic NORMAL-mode Discussion transitions;
4. add the missing ACT3 cooldown and canonical result occurrence;
5. correct S5 result classification and retain the resolved occurrence;
6. render domain result occurrences through one small reusable overlay;
7. fix remaining trial blockers directly at their canonical mutation/read owner;
8. run an integrated three-Player trial before considering a shared context service or broad UI recomposition.

The core implementation rule is:

> Owning domains mutate and publish semantic facts. Read adapters transport or aggregate those facts. Clients render them and never reconstruct authority from timing, browser history, stale mirrors, or whichever RPC happened to return last.

This proposal agrees with GA V1 on Authority boundaries and polling-first risk reduction, but changes the implementation shape materially:

- fifteen broad packages become six release trains with small commits;
- Teacher Recovery/TOP is separated from the normal-path debug critical path;
- the three-second result presentation moves earlier because it is required to observe and debug real outcomes;
- ACT3 cooldown and S5 wrong-result classification are explicit concrete fixes, not hidden inside large UI packages;
- formal-start/ACK work is evidence-gated instead of assumed as a full package;
- shared context remains deferred unless post-fix measurements prove two real consumers benefit;
- final images remain optional for runtime testing; approved placeholders stay valid.

---

# 2. Success boundary

The first debug implementation release is successful when:

1. no overlapping refresh can commit stale Player or Teacher state;
2. a fetch failure is visibly stale/unknown and never becomes `active:false`;
3. mutating controls fail closed while current interaction identity is unknown;
4. Teacher W05 shows physical location separately from transition, role, engagement, and task state;
5. NORMAL Discussion advances only by an authorized Teacher action or canonical completed vote, not a read-side timeout;
6. ACT3 rejects a second unique attempt inside the three-second cooldown while replaying the same request idempotently;
7. wrong, tie, success, and fallback results remain distinguishable after the next round opens;
8. the current result occurrence is shown consistently for the server-defined interval and survives polling/reconnect;
9. three Players can complete the current normal route without TOP and without final media;
10. all existing static checks plus new race, identity, and live E2E vectors pass.

This is not a claim that every cosmetic defect is fixed. It is the boundary for a trustworthy next human trial.

---

# 3. Non-goals and hard prohibitions

The following are outside the first implementation release:

- a persisted universal `global_phase` or participant-progress table;
- a broad ACT1–14 Resolver;
- browser fallback to ACTIVE `game_runs.scene_id`, `phase_key`, or `step_key`;
- a second generic gate state or dual writes solely for UI convenience;
- all thirteen Teacher Override/TOP controls in one batch;
- fake Player submissions or backdated behavioral evidence;
- full Player/Teacher UI rewrite;
- making final student images a runtime prerequisite;
- a generic shared context RPC before measurements show a net reduction;
- editing historical migration files to change deployed behavior.

Every database change is a new forward-only migration beginning after current repository migration `068`. The exact next number must be rechecked immediately before implementation.

---

# 4. Implementation invariants

## 4.1 Read result classes

Every polled domain read is represented internally as one of:

- `SUCCESS(payload, identity)`;
- `NOT_APPLICABLE(reason)`;
- `FETCH_ERROR(error, observed_at)`;
- `INVARIANT_BREACH(reason, source_identity)`.

Only a successful server response may say a domain is inactive. A rejected promise may not be converted to `{active:false}`.

## 4.2 Identity and stale-response rule

Every refresh frame binds to:

- session epoch;
- monotonic refresh generation;
- room and Player/Teacher identity;
- the returned run/domain interaction identities.

A frame may commit only if its epoch is current and no newer generation has committed. Logout, rejoin, room switch, and watch-room switch increment the epoch.

## 4.3 Mutation rule

Where the server supports idempotency:

- create one request UUID for a logical user action;
- reuse it after timeout/unknown acknowledgement;
- clear it only after a canonical server acknowledgement;
- bind it to expected run/session/phase/step/round identity;
- reject a replay whose payload conflicts with the original.

Where a legacy mutation lacks identity, add identity at the domain owner rather than pretending the browser can infer success.

## 4.4 Presentation occurrence rule

A result that must be visible for a synchronized interval is a server occurrence, not a browser timeout. Minimum shape:

```text
occurrence_id
owner_domain
run_id
interaction_identity
result_kind
text_key / safe presentation payload
started_at
visible_until
validity
```

Clients may calculate remaining display time from `visible_until`, but may not invent the occurrence or extend it independently.

## 4.5 UI ownership rule

One DOM region has one active renderer. The first release should preserve current HTML/CSS structure and replace only ownership/race behavior required by a defect. Recomposition comes after runtime correctness.

---

# 5. Release Train R1 — transport correctness

**Priority:** first

**Authority change:** none

**Expected risk:** low-to-medium

**Primary files:** `src/game/app.js`, `src/teacher/teacher-console.js`, targeted browser/static tests

## R1.1 Player refresh coordinator

Replace `setInterval(refreshState, 1200)` with a self-scheduling coordinator:

1. schedule the next refresh only after the prior refresh settles;
2. maintain `sessionEpoch`, `requestedGeneration`, and `committedGeneration`;
3. collect a complete candidate frame without mutating DOM/global render state;
4. validate epoch/generation before commit;
5. preserve the last confirmed passive frame on transport failure;
6. display a stale/connectivity banner and disable identity-sensitive mutations;
7. trigger one immediate refresh after a successful mutation, then resume cadence;
8. remove the duplicate S8 read in the same frame;
9. stop `.catch(() => ({active:false}))`; retain failure classification per domain.

Do not combine this commit with renderer redesign. The first patch should be mechanical and reviewable.

## R1.2 Teacher refresh coordinator

Apply the same single-flight and epoch rules to `loadState()` / `loadDiscussionState()` / `loadOperationsState()`.

`loadState()` currently fans out additional reads while a 1200 ms interval can start another load. The replacement must build one Teacher frame and commit it once. A failed S7 read may mark Operations unavailable but must not erase a valid room/Discussion frame.

## R1.3 R1 tests

- delayed generation N returns after N+1;
- polling tick occurs while a refresh is in flight;
- logout/rejoin while old requests are in flight;
- room/watch target changes while old Teacher requests are in flight;
- one sub-read fails while others succeed;
- response is lost after a successful idempotent mutation;
- reconnect during vote and ACT5→6 entry barrier;
- no duplicate S8 request per Player frame;
- no private field crosses Player boundaries.

**R1 PASS:** old frames cannot overwrite new state; connectivity failure is explicit; controls with unverifiable identity are disabled.

**R1 rollback:** revert the two coordinator commits; no schema rollback.

---

# 6. Release Train R2 — W05 operational projection

**Priority:** second

**Authority change:** new derived read facts only

**Expected risk:** medium

**Primary files:** new migration, `src/teacher/teacher-console.js`, W05 static/live tests

Use `docs/plans/W05_OPERATIONAL_LOCATION_SEMANTIC_CONTRACT_V1.0.md` as the semantic input, with one implementation clarification: domain facts should be exposed by small domain-owned helper functions or direct canonical selections; S7 must not gain a large ACT switch.

## R2.1 Versioned S7 output

Extend the repository-last `s7_get_teacher_console` definition through a new migration. Return, per Player:

```text
physical_location
transition_state
assignment_role
engagement_state
task_state
source_domain
source_identity
validity
reason_code
```

Keep `player_location` temporarily as a compatibility field during shadow comparison, but do not continue deriving the new fields from it once S5 or S6 owns the current state.

## R2.2 Owner selection

The only cross-domain selection S7 may perform is:

```text
valid activated S6 after completed S5 prerequisite -> S6
else S5 after the ACT6 three-Player entry barrier -> S5
else -> S3B per-Player state
```

Contradiction returns `INVARIANT_BREACH`; it never falls back to ACTIVE `game_runs` mirrors.

Semantics:

- ACT1–5 and partial ACT5→6: S3B owns per-Player physical location and transition;
- third `act6_entered_at` / activated S5 barrier: S5 owns shared Portrait Hall, Clock Room, or Great Hall location;
- valid S6 activation: S6 owns shared Great Hall/Main Gate/castle-exterior location;
- ACT11–12: all Players remain physically at Main Gate while allocation, engagement, and task fields are separate;
- `A`, `B`, `C`, and `WATCHER` are never physical locations.

## R2.3 Shadow and cutover

1. add versioned fields without changing the visible Teacher table;
2. run all 20 W05 contract vectors against independently declared expected results;
3. compare old/new output only as diagnostic evidence, never as truth;
4. cut over only the Teacher operational-location cells;
5. remove the legacy `player_location` display dependency in a separate commit.

No new polling RPC is added.

**R2 PASS:** all vectors pass, including partial ACT6 entry, prepared-but-inactive S5, ACT11 roles, WATCHER, reconnect, missing presentation, and contradiction.

**R2 rollback:** revert the Teacher display commit; added read fields remain inert and backward-compatible.

---

# 7. Release Train R3 — NORMAL Discussion and result correctness

**Priority:** third

**Authority change:** owning-domain lifecycle correction

**Expected risk:** medium-to-high

**Primary files:** new migrations replacing repository-last functions, Player/Teacher renderers, Discussion/S5/S6 tests

This train is split into independently deployable migrations. It must not be shipped as one opaque SQL file.

## R3.1 Generic and S5 Teacher-paced Discussion

For NORMAL mode:

- reading state never advances `discussion -> voting` because a deadline elapsed;
- Discussion remains usable until Teacher opens voting;
- Teacher `s2_open_vote` binds to the exact current discussion session;
- `s2_add_time` acts only on an applicable bound session and returns explicit `NOT_APPLICABLE` otherwise;
- AUDIT mode may retain deterministic time-driven behavior where tests require it;
- the UI may show an informational timer, but zero does not close communication.

Any repository-last read path that calls `s2_refresh_discussion` must be replaced so NORMAL reads are side-effect free.

## R3.2 S6 Teacher-paced Discussion

The current repository-last S6 Player read calls `s6_refresh_owned_discussion`, and the Player can call `s6_close_discussion_v2`. For NORMAL mode:

- remove read-triggered lifecycle mutation;
- expose a Teacher-owned close/advance action bound to run, phase, step, round, and discussion session;
- remove or reject the Player close path in NORMAL;
- retain deterministic AUDIT support as a separate branch, not an implicit NORMAL timer;
- preserve transcript and current interaction across reconnect.

## R3.3 S5 result classification defect

The existing S5 resolution flow first writes `player_majority` and then overwrites ACT7 wrong outcomes with `wrong_majority`; the wrapper can subsequently write `player_majority` again. Replace the repository-last wrapper so the final classification is derived once and cannot be overwritten.

Required `result_kind` values:

- `SUCCESS`;
- `WRONG_MAJORITY`;
- `TIE_REOPENED`;
- `SYSTEM_FALLBACK`.

The resolved round occurrence must remain readable after the next round opens. Do not make the client reconstruct the previous result from the new round or from event order.

## R3.4 R3 tests

- NORMAL message after nominal deadline;
- Teacher open vote on exact session;
- Add Time on current, stale, and absent session;
- two votes plus reconnecting third Player;
- stale vote-round submission;
- idempotent same-request replay and conflicting replay rejection;
- tie then new round without losing tie result;
- ACT7 wrong majority remains `WRONG_MAJORITY`;
- correct result remains success;
- fallback remains system fallback;
- S6 NORMAL cannot be closed by a Player or a read;
- AUDIT deterministic flow still completes.

**R3 PASS:** no NORMAL read mutates the lifecycle, Teacher owns pacing, and result kinds remain stable.

**R3 rollback:** each migration can be replaced by a forward migration restoring the previous function definition; do not edit applied files.

---

# 8. Release Train R4 — ACT3 cooldown and reusable result occurrence

**Priority:** fourth, but may be developed after R1 while R2/R3 semantics are under review

**Authority change:** S3B mutation guard plus domain-published occurrence

**Expected risk:** medium

## R4.1 ACT3 server cooldown

Modify the repository-last `s3b_submit_library_code` through a new migration:

1. authenticate and lock the current run/state as it already does;
2. check exact `client_request_id` replay before cooldown rejection;
3. reject conflicting reuse of an existing request UUID;
4. find the latest accepted library attempt for the run;
5. reject a new unique request while `submitted_at + interval '3 seconds' > now()`;
6. return the authoritative remaining interval/reason code;
7. accept the next unique request after cooldown;
8. allow a correct accepted attempt to transition canonically without a client-created delay.

The cooldown is global to the active puzzle interaction, not merely per browser. This prevents three clients from bypassing it concurrently.

## R4.2 Occurrence projection

Publish the accepted attempt as a result occurrence with `occurrence_id`, attempt number, `CORRECT`/`WRONG`, `started_at`, and `visible_until`. Project it through the S3B Player state and the existing Teacher/S7 read surface.

The visible interval is independent from scene navigation: if a correct attempt changes the scene immediately, the occurrence still remains renderable until `visible_until`.

## R4.3 Small reusable overlay

Create one renderer for server occurrences in the existing Player and Teacher shells. It must:

- key by `occurrence_id`;
- use server time bounds;
- deduplicate polling frames;
- show the remainder after reconnect, not restart three seconds;
- dismiss expired occurrences;
- avoid blocking unrelated polling or navigation;
- accept only safe text keys/presentation payloads.

After ACT3 proves the contract, adapt S5 result occurrences and S6 feedback/audio occurrences to the same presentation shape without moving their business rules into a generic resolver.

## R4.4 R4 tests

- same UUID replay inside three seconds succeeds idempotently;
- same UUID with different code rejects;
- two unique requests concurrently: one accepted, one cooldown-rejected;
- different Players cannot bypass global cooldown;
- unique request after three seconds accepted;
- correct attempt transitions once;
- reconnect at 1.5 seconds shows only the remaining interval;
- stale occurrence never replaces a newer occurrence;
- Player and Teacher receive the same public result identity without private leakage.

**R4 PASS:** the database, not a browser timer, enforces cooldown and defines presentation time.

**R4 rollback:** hide overlay and replace the mutation/read functions with forward definitions; retained attempt rows remain valid evidence.

---

# 9. Release Train R5 — remaining concrete normal-path blockers

**Priority:** only after R1–R4 evidence

**Authority change:** defect-specific

**Expected risk:** bounded per item

R5 is not a backlog bucket for speculative redesign. An item enters R5 only with a reproducible trial defect, exact owner, and acceptance test.

## R5.1 Formal start

First reproduce the reported start ambiguity on the frozen build. If confirmed, expose one canonical Teacher normal-flow start action that is idempotent and returns the current `run_id`. Move legacy/developer initialization controls out of the normal panel. Do not add an acknowledgement table merely because the UI rendered.

## R5.2 Explicit ACK only when progression needs it

Use existing authoritative actions (`route_update_ack_at`, `s3b_follow_sign`, `act6_entered_at`) where they already express real behavior. Add a new ACK only if a canonical gate truly requires proof that cannot be represented by an existing action.

The ACT2 label “saw sign; changed destination; en route to Library” must not be fabricated from a single fact: current `s3b_follow_sign` moves directly to `player_location='library'`, while `route_update_ack_at` is an earlier acknowledgement. W05 should present conservative states until a new canonical transition exists.

## R5.3 W03 atomic GRAB + leave, if still reproducible

If a fresh trial still exposes the two-step GRAB/leave defect, add one idempotent owner-domain mutation that:

- performs the canonical GRAB and leave transition atomically;
- writes the two existing canonical events with the same request provenance;
- respects the all-Player barrier;
- never advances because a read occurred.

If the defect is not reproducible against the frozen SHA, do not change the mutation.

## R5.4 Pocket/Knowledge/Observation

Keep migration `068` as the current authoritative inspection basis. Normalize additional data only when a trial shows a reconstruction or privacy defect. Prefer a thin client adapter over schema expansion when the canonical facts already exist.

## R5.5 Text, layout, assets, audio

- fix labels/layout locally after runtime ownership is stable;
- keep placeholder-first rendering;
- use only ACTIVE registry assets at runtime;
- missing final student images do not block a trial;
- asset publication and runtime migrations stay in separate commits;
- audio is a blocker only when the approved game contract requires it for an action/result and no safe visual fallback exists.

Each R5 defect receives its own reproduction, commit, regression test, and rollback point.

---

# 10. Release Train R6 — integrated trial and freeze

## R6.1 Static gate

Run at minimum:

- `tests/sprint3b-remediation-static-check.js`;
- `tests/sprint5-static-check.js`;
- `tests/sprint6-static-check.js`;
- `tests/sprint7-static-check.js`;
- `tests/level3-closure-static-check.js`;
- `tests/level3-remediation-static-check.js`;
- `tests/structural-package-b-static-check.js`;
- all new package-specific static/browser tests.

## R6.2 Live/database gate

Against a clean authorized test environment:

- apply every migration in numeric order from a fresh schema;
- run targeted live E2E for S3B, S5, S6, S7, finalization, and each new package;
- exercise both S6 branch variants;
- run concurrency tests with independent clients;
- verify grants/revokes and Player privacy;
- confirm old deployed function overloads are not still browser-executable.

## R6.3 Browser gate

Run one Teacher plus three isolated Player sessions with:

- latency/reordering injection;
- offline/reconnect during Discussion and result overlay;
- double-click and lost-response replay;
- ACT5→6 staggered entry;
- ACT11 allocation including WATCHER;
- finalization/export;
- placeholders in place of unfinished final media.

Capture console errors, failed requests, request counts, and p50/p95 refresh latency.

## R6.4 Freeze rule

Freeze one exact SHA only after the deterministic and browser gates pass. Human acceptance runs only on that SHA and matching database migration set. A defect fix after freeze creates a new candidate SHA and reruns the affected gate plus integrated smoke.

---

# 11. Shared-context decision gate

Do not implement a shared Player/Teacher context facility during R1–R4.

After R4, measure:

- Player and Teacher RPC count per refresh;
- p50/p95 latency and database query work;
- remaining duplicated runtime-owner arbitration branches;
- number of identical facts consumed by both Player and Teacher;
- regression/rollback cost of extraction.

Create a minimal shared read adapter only if:

1. at least two real consumers need the identical semantic fact;
2. it replaces existing reads/branches in the same release;
3. it has one source identity and explicit error classes;
4. it contains no ACT-specific mutation logic, W05 per-Player details, private Pocket data, or legal-action booleans.

Otherwise keep targeted domain adapters. “Cleaner architecture” without deleted complexity is not sufficient benefit.

---

# 12. Teacher Recovery / TOP is a separate program

The current narrow ACT1–5 recovery allowlist is not authorization for thirteen start-of-ACT TOP controls.

Do not put broad TOP work on the normal-path critical path. Before implementing even one new recovery checkpoint, require:

- an exact approved checkpoint manifest;
- current interaction identity and prerequisite predicate;
- server-chosen target state;
- request UUID and idempotent replay behavior;
- explicit rows preserved versus synthesized;
- override provenance and behavioral validity treatment;
- downstream verifier/export behavior;
- fresh-run and mid-run test vectors;
- a local rollback boundary.

No TOP action may create fake ballots, fake Player timestamps, or arbitrary client-supplied destinations. Implement one specifically authorized checkpoint first; review evidence before the next. The thirteen-control batch remains blocked.

---

# 13. Commit and migration discipline

Use one concern per commit. Recommended sequence:

```text
R1a Player polling coordinator + tests
R1b Teacher polling coordinator + tests
R2a W05 read projection migration + live vectors
R2b W05 Teacher shadow/cutover
R3a generic/S5 NORMAL Discussion migration + tests
R3b S6 NORMAL Discussion migration + tests
R3c S5 result-kind/occurrence correction + tests
R4a ACT3 cooldown/occurrence migration + tests
R4b reusable result overlay + ACT3 adapter
R4c S5/S6 result adapters
R5x one commit per reproduced defect
R6 test/freeze evidence only
```

Rules:

- never modify an already-deployed migration;
- re-read repository-last definitions immediately before writing replacements;
- migrations include explicit grants/revokes and function signatures;
- no package claims PASS from static inspection alone when behavior is database/live;
- no mixed asset publication and gameplay migration commit;
- branch/commit evidence records before SHA, after SHA, changed functions, tests, raw failures, rollback, and residuals;
- production/database deployment requires separate authorization.

---

# 14. Stop conditions

Stop implementation and return to design/audit if a change requires:

- a second persisted universal gameplay state;
- unexplained dual writes;
- ACTIVE `game_runs` fallback;
- browser-only privacy enforcement;
- invented Player behavior;
- “latest event wins” inference;
- S7 owning ACT-specific progression rules;
- a shared adapter that adds polling rather than replacing it;
- historical-row rewriting to make current UI look consistent;
- normal-flow fixes that depend on broad TOP;
- a client timer as authority for a synchronized gameplay result;
- a database deployment without explicit authorization.

---

# 15. Cost and authorization recommendation

| Train | Relative cost | Regression risk | Immediate value | Recommendation |
|---|---:|---:|---:|---|
| R1 transport | 2/5 | 2/5 | 5/5 | authorize first |
| R2 W05 | 2–3/5 | 2/5 | 4/5 | authorize after R1 evidence |
| R3 Discussion/results | 4/5 | 4/5 | 5/5 | split into three approvals/deployments |
| R4 ACT3/overlay | 3/5 | 3/5 | 4/5 | implement domain first, UI second |
| R5 reproduced blockers | variable | bounded per item | variable | authorize individually |
| R6 integrated freeze | 3/5 | test-only | 5/5 | mandatory before human trial claim |
| shared context | unknown | high | unproved | measure, probably omit |
| broad TOP | 5/5 | 5/5 | not needed for normal trial | keep separate and blocked |

CD's recommended first authorization is **R1a Player polling coordinator only**, followed by R1b. This is the smallest fix with system-wide trial value and no Authority redesign.

If implementation authority is later granted for a larger normal-path tranche, the lowest-rework tranche is:

> R1 → R2 shadow → R3.1/R3.2 → R3.3 → R4 domain → R4 UI → integrated trial.

Final images are not a dependency for that tranche.

---

# 16. Proposal status

This file is CD's V2 proposal, not a released work order and not a message to another agent.

At the time of this local commit:

- no implementation described here has been authorized by this document;
- no database or production state has been changed;
- no `agent-comms` handoff has been created;
- no other agent has been notified;
- the commit is intended to remain local until the user explicitly authorizes sharing or pushing it.
