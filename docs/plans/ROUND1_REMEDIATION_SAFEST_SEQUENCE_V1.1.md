# Round-1 Remediation Safest Implementation Sequence V1.1

Date: 2026-10-06  
Owner: GA  
Status: Revised after Teacher/GA technical review; submitted to CA for concurrence  
Supersedes: `ROUND1_REMEDIATION_SAFEST_SEQUENCE_V1.0.md` for current planning  
Implementation authorization: NONE

Reference guardrails:

`docs/plans/ROUND1_PROGRESS_GATE_VIEW_SNAPSHOT_GUARDRAILS_V1.0.md`

## Governing principle

Correct authoritative facts first while the old UI remains a known diagnostic surface.  
Then establish a thin server-owned progression spine and read-only viewer-specific projections.  
Then create stable frontend mounts without changing gameplay authority.  
Then migrate renderers one by one.  
Add global presentation behavior late.  
Finish with integrated regression and a new frozen baseline.

Core architecture:

```text
server global_phase
+ server participant_progress
+ concurrency-safe group_gate
        ↓
read-only Player / Teacher View Snapshot
        ↓
fixed UI
```

The browser does not own progression.

## Step 0 — Freeze known baseline

- retain current checkpoint SHA;
- old-layout smoke remains diagnostic reference;
- preserve existing browser selectors/harness.

Gate: known baseline passes before new work begins.

## Step 1 — W05 Teacher operational-location projection

Correct Teacher-facing authoritative operational-location projection first.

Gate:
- targeted ACT6/7/9/11 projection tests;
- reconnect projection;
- no Teacher UI redesign yet.

## Step 2 — W03 Combined authoritative GRAB+leave

Player-facing button:

**带上物品并离开房间**  
**Neem je spullen mee en verlaat de kamer**

One click performs one idempotent authoritative mutation while preserving canonical semantics:

- progression-critical GRAB;
- already-discovered carryable optional items;
- no hidden-information auto-read;
- `grab_completed` formal event;
- `left_start_room = true`;
- `player_location = corridor`;
- `start_room_left` formal event;
- evaluate server group gate;
- advance the next global phase exactly once when required participants are complete.

Required properties:
- replay/idempotency safety;
- near-simultaneous participant completion safety;
- no duplicate discussion/transition creation;
- presentation cinematic remains client-side/transient.

Gate:
- normal path;
- lost-response + retry;
- rapid replay/double click;
- concurrent final participants;
- reconnect;
- optional discovered-item behavior;
- both canonical events present.

## Step 3 — W01 Teacher-paced Discussion lifecycle

Implement normal classroom no-hard-input-deadline semantics across generic/Sprint2, Sprint5 and Sprint6 while the old Discussion presentation remains intact.

Gate:
- send messages;
- Teacher deliberate open/close/vote controls;
- vote completion/tie/revote;
- reconnect;
- no normal deadline-driven lock.

## Step 4 — W02-A Player structural no-op shell + thin Player View Snapshot

Create stable mounts for:
- Header;
- Scene;
- Action;
- Discussion;
- Pocket;
- hidden Transition Overlay Mount.

The Transition Overlay Mount is only structural at this step:
- present;
- hidden;
- capable of covering gameplay shell later;
- no timer;
- no scene-change detection;
- no W12 state machine.

Add a thin read-only `PlayerViewSnapshot` that:
- consumes server-owned global phase / participant progress rather than re-deriving progression;
- normalizes existing read results only;
- does not add polling RPCs by default;
- contains semantic data, not HTML/DOM;
- contains only Player-authorized information;
- does not implement authorization/business rules;
- is minimal rather than a copy of raw Sprint models.

Polling/commit guard:
- single-flight refresh where practical;
- monotonic refresh generation;
- stale generation cannot overwrite newer presentation;
- transport failure != inactive;
- mixed/inconsistent read results are not silently committed;
- one committed Snapshot generation feeds all stable Player regions.

Gate:
- current gameplay behavior unchanged;
- old selectors remain where practical;
- stale response test;
- transient fetch-failure test;
- no extra RPC-count growth without explicit approval;
- no Teacher/private-only data in Player Snapshot;
- hidden transition mount has no behavior.

## Step 5 — W10 Player identity/runtime header

Populate the stable header for:
- pre-run;
- first formal render;
- in-run;
- reconnect;
- completion where applicable.

Gate: identity / ACT / status correctness across lifecycle.

## Step 6 — W02-B Discussion visual adapter + responsive shell

Project generic/Sprint5/Sprint6 Discussion presentation into one stable Discussion region.

Do not change Discussion authority here.

One-presentation-owner rule:
- when the stable Discussion region owns presentation, legacy duplicate composer/renderer paths must not remain active.

Gate:
- transcript/action rendering across all three Discussion implementations;
- exactly one composer/action owner;
- responsive smoke.

## Step 7 — W09-A Discussion local-state preservation

Protect:
- unsent draft;
- focus;
- transcript scroll;
- unnecessary composer destruction under polling.

Restore rule:
- same `discussion_session_id`;
- discussion still exists in current Snapshot.

Otherwise discard local memory and render neutral current presentation.

## Step 8 — W04 Pocket renderer migration

W02 owns the empty stable Pocket mount.  
W04 owns actual Pocket content migration.

Implement:
- item/view -> asset/text;
- inspect;
- flip;
- share;
- reconnect reconstruction;
- removal of duplicate story-flow Pocket injection.

One-presentation-owner rule applies.

Gate:
- real images/text;
- front/back/open;
- inspect/share;
- reconnect;
- no duplicate Pocket.

## Step 9 — W09-B Pocket local-state preservation

Restore selected/expanded Pocket state only under:

`Same-owner + Still-exists`

Specifically:
- same run identity;
- referenced item still exists;
- requested local view is still permitted.

Otherwise:
- discard browser-local selection;
- show current Pocket list with no auto-expanded item;
- use authoritative/canonical current/default view.

## Step 10 — W08 Five-slot Library lock UI

Implement the five-slot/wheel presentation in stable Action region.

Preserve server locked-prefix/fallback authority.

Gate:
- locked prefix;
- hint progression;
- submit;
- reconnect;
- responsive clarity.

## Step 11 — W06 Teacher same-runtime recomposition + thin Teacher View Snapshot

Keep one `teacher.html` runtime.

Views:
- Normal / Live Operations;
- Emergency / Recovery;
- Maintenance / Developer;
- preserved pre-run setup.

Add a separate `TeacherViewSnapshot`.

Rules:
- separate schema from Player Snapshot;
- server-owned participant progress/global phase used directly;
- Teacher does not infer completion from waiting/location heuristics;
- explicit Teacher status categories: COMPLETED / NOT YET COMPLETED / STATUS UNKNOWN;
- Teacher Snapshot is read-only projection, not business authority;
- no one-large-DTO filtered down for Player;
- preserve existing bound control nodes where practical;
- no duplicate listeners/RPC firing.

Gate:
- room/token/run identity survives navigation;
- polling continues once;
- supported controls still work;
- back navigation restores same run;
- transport failure can display UNKNOWN without falsely changing participant completion.

## Step 12 — W09-C Teacher local-state preservation

Restore local Teacher state only when:
- same room/run/interaction owner;
- referenced view/action still exists in current Teacher Snapshot.

Otherwise:
- default to Normal / Live Operations;
- no stale Emergency action remains selected.

## Step 13 — W11 low-risk bilingual/text cleanup

Perform terminology/jargon removal and bilingual presentation cleanup after structure settles.

Add local-overflow checks:
- 1366px;
- ~900px;
- long paired Chinese/Dutch buttons;
- tables/panels;
- not only page-level overflow.

## Step 14 — I0 pre-transition integrated checkpoint

Broad deterministic regression before W12.

Purpose:
- prove W05/W03/W01 + Player shell + Pocket + Library + Teacher views work together;
- freeze rollback SHA;
- separate frontend-recomposition defects from W12 transition-state defects.

Minimum:
- ACT1→ACT14;
- reconnect;
- generic/S5/S6 Discussion;
- Pocket inspect/flip/share;
- Teacher internal views;
- participant gate behavior;
- anchor-bearing scenes;
- intermittent fetch failure;
- stale/out-of-order refresh behavior;
- console/network errors.

## Step 15 — W12 2-second Scene Transition behavior

Activate the Transition Overlay Mount already reserved in W02-A.

Use normalized presentation scene identity supplied by the Player projection rather than re-deriving progression.

Behavior:

```text
real authoritative scene change
→ show bilingual transition overlay
→ 2 seconds
→ hide overlay
→ reveal current authoritative scene
```

Visible copy only:

**你正进入下一个场景**  
**Je gaat nu naar de volgende scène.**

Rules:
- presentation-only;
- never persisted;
- never restored after reload/reconnect/navigation;
- suppress first-render/reconnect false positives;
- suppress same-scene polling;
- distinguish phase refresh from real scene change;
- avoid collision with GRAB-specific cinematic and ACT12 cinematic/blackout.

Gate:
- exactly once;
- ~2 seconds;
- no polling repetition;
- no reconnect false positive;
- no session/input-state loss.

## Step 16 — W13 final integrated regression + new frozen baseline

Run:
- full E1-equivalent deterministic browser regression;
- 1920×1080 / 1366×768 / ~900px;
- page and local overflow;
- stale/late refresh;
- intermittent fetch failure;
- retry/idempotency;
- concurrent group-gate completion;
- no duplicate render owners;
- Discussion local-state behavior;
- Pocket local-state behavior;
- Library;
- Teacher views;
- anchor/overlay geometry;
- scene transition;
- ACT14 completion/reconnect;
- safe diagnostics with no token/private leakage.

Then:
- freeze new integrated SHA;
- CA targeted closure;
- successor Manual Acceptance plan;
- human acceptance;
- E2.

## Parallelism

For maximum fault isolation:
- no concurrent high-coupling runtime implementation;
- test/evidence preparation may proceed separately;
- do not concurrently edit `src/game/app.js` across packages;
- do not restructure Teacher runtime while W01/W05 authority contracts are unsettled;
- do not migrate Pocket while shared shell ownership is simultaneously changing.

## First future CD authorization

This plan itself authorizes nothing.

If Teacher/GA/CA later lift HOLD, the first recommended bounded CD package remains:

> **W05 only**

Hard stop after:
- W05 implementation;
- targeted projection tests;
- reconnect pass;
- exact checkpoint SHA/evidence returned.

No W03/W01/UI work begins without a new release.
