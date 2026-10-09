# Proposal of Debug Implementation Plan V1.1 by GA

**Date:** 2026-10-09  
**Owner:** GA  
**Status:** PROPOSAL FOR MULTI-AGENT REVIEW / MODIFICATION  
**Supersedes for GA planning:** `PROPOSAL_DEBUG_IMPLEMENTATION_PLAN_V1_BY_GA.md`  
**Implementation authorization:** NONE  
**Notification status:** NOT YET SENT TO OTHER AGENTS  
**Branch:** `remediation/sprint9-structural-v1`

---

# 0. Why V1.1 exists

V1 was too heavily organized around the later Authority / Observer discussion.

It did reference the pre-Authority remediation sequence, but it did not sufficiently preserve the older plan's strongest contribution:

> **start from what broke in the human trial, repair the smallest user-visible failure chain, preserve fault isolation, and migrate the UI only after the underlying behavior is stable.**

The later 432-field Authority work contributes a different and equally necessary viewpoint:

> **for every repair, identify the semantic owner, forbid stale mirrors/fallbacks, preserve provenance, and do not create a second state machine while trying to make the UI easier to read.**

V1.1 combines both.

The rule is:

> **The pre-Authority plan supplies the implementation spine.**  
> **The Authority audit supplies the correctness constraints at every spine node.**

Neither replaces the other.

---

# 1. The two viewpoints being combined

## 1.1 View A — pre-Authority debug/remediation viewpoint

Primary sources:

- first human/manual trial evidence;
- `ROUND1_REMEDIATION_WORKLOAD_ESTIMATE_V1.0 / V2.0 / V2.1`;
- `ROUND1_UI_LAYOUT_ARCHITECTURE_IMPACT_REVIEW_V1.0`;
- `ROUND1_REMEDIATION_SAFEST_SEQUENCE_V1.0 / V1.1`.

This viewpoint asks:

- What blocked Teacher/Players?
- Which defect should be fixed first so the next test can proceed farther?
- Which UI migration depends on which semantic repair?
- How do we isolate regressions?
- Which work is already finished and must not be reopened?
- What order minimizes rework?

Its established backbone was:

```text
W05 → W03 → W01
→ W02-A → W10 → W02-B → W09-A
→ W04 → W09-B → W08
→ W06 → W09-C → W11
→ I0 → W12 → W13
```

Its strongest principle was:

> **correct behavior first, preserve the old UI as a diagnostic surface, then migrate presentation incrementally.**

---

## 1.2 View B — post-Authority semantic/data-integrity viewpoint

Primary sources:

- 432-field six-method factual master;
- Authority Registry V0.3 freeze candidate;
- JSONB runtime-read subfact adjudication;
- CA-161 challenge + reconciliation;
- CD-073 deployed read-only evidence;
- GA-092 / CD counter-proposal / CA Round II;
- W05 operational-location semantic contract;
- later domain-published-state / passive-observer discussion.

This viewpoint asks:

- Which domain owns the fact?
- Is the field current Authority, support, history, provenance, or stale mirror?
- What happens if the current Authority is missing?
- Is a derived display fact legitimate, and who should publish it?
- Does a fix create duplicate truth?
- Does recovery preserve provenance and behavior validity?
- Does a read abstraction reduce ambiguity or merely hide it?

Its strongest principles are:

> **one semantic fact → one current Authority**  
> **support/history/cache never silently becomes fallback Authority**  
> **owning domain computes/publishes; UI/Observer does not invent gameplay**  
> **no persisted universal global state / no broad ACT1–14 Resolver**

---

# 2. V1.1 planning model

V1.1 uses **three layers**.

## Layer A — cross-cutting safety gates

These are new prerequisites created by later evidence and apply across multiple W packages:

- G0 — baseline/evidence freeze;
- G1 — polling/transport correctness;
- G2 — Authority compliance preflight per package;
- G3 — recovery/security/provenance guardrails;
- G4 — measurement gate for any future shared context abstraction.

## Layer B — original W01–W13 remediation backbone

The old W numbers remain the main implementation structure.

This preserves:
- workload history;
- known dependencies;
- UI migration logic;
- fault-isolation rationale;
- previously agreed "do not mix semantic repair and visual migration" rule.

## Layer C — newly discovered bounded residuals

Later work adds a few scopes that did not exist clearly in the old W table:

- formal-start / next-action clarity;
- Teacher recovery / TOP feasibility;
- legacy RPC quarantine;
- historical Knowledge/Observation normalization;
- finalization anomaly classification;
- audio/runtime residual verification.

These are inserted where they logically belong without rewriting the W01–W13 backbone.

---

# 3. Definition of success

Round-1 remediation is complete only when:

1. Teacher has one clear normal formal-start path.
2. Three Players can proceed ACT1→ACT14 without an unexplained hard blocker.
3. Polling races cannot overwrite a newer state with an older response.
4. Network/fetch failure is never reclassified as gameplay inactivity.
5. A Player action with unknown delivery status can be safely retried/recovered without duplication.
6. Discussion remains usable under Teacher-paced NORMAL classroom semantics.
7. Vote identity/round identity is exact and reconnect-safe.
8. Teacher has bounded, provenance-preserving Recovery/Override for genuine blockers.
9. Teacher operational location/status is correct across early divergent movement, ACT5→6, and ACT11–12 role/station semantics.
10. GRAB/leave is one coherent authoritative progression action from the Player perspective.
11. Pocket/Knowledge/Observation reconstruct canonically after reconnect.
12. Library puzzle interaction is clear, concurrency-safe and reconnect-safe.
13. Player/Teacher UI migration preserves one active renderer owner per region.
14. Image publication already closed under W07 is not reopened without new evidence.
15. Any residual audio/runtime publication issue is separately evidenced and closed before acceptance.
16. No Player receives another Player's unrevealed private information.
17. ACTIVE `game_runs.scene_id/phase_key/step_key` is never used as fallback current state.
18. Completed-run integrity/finalization is predictable and does not fabricate VERIFIED.
19. Full deterministic browser regression passes on a new frozen SHA.
20. A new human acceptance run can proceed significantly beyond the first-round blockers without ad hoc developer intervention.

---

# 4. Non-negotiable Authority constraints applied to every work package

Before coding any W package, CD/implementer must identify:

1. the semantic fact being read/written;
2. current Authority;
3. target Authority if migration is required;
4. support/history/cache fields that must not be used as fallback;
5. interaction/run/round identity required for a safe write;
6. what UNKNOWN means;
7. what the rollback boundary is.

Hard rules:

- no ACTIVE `game_runs.scene_id/phase_key/step_key` fallback;
- no "latest event wins";
- no new universal persisted `global_phase`;
- no universal persisted participant-progress table;
- no dual writes solely to support a new UI read model;
- no browser-side filtering as the primary privacy boundary;
- no invented Player behavior to fill missing evidence;
- no recovery action that loses override provenance;
- no migration-time `now()` replacing original discovery timestamps;
- no S7/Observer reimplementation of ACT-specific gameplay rules.

---

# 5. Cross-cutting Gate G0 — freeze baseline and implementation inputs

**Occurs before all implementation.**

## Purpose

Preserve the early debug plan's diagnostic-baseline principle while incorporating later Authority evidence.

## Tasks

- record current code/deployment rollback SHA;
- preserve current selectors and existing browser test harness;
- freeze current V4 gameplay spec and Authority Registry revision used by the package;
- retain CD-073 deployed evidence as the current deployment snapshot;
- classify remaining effective-privilege unknowns before security-sensitive cutover;
- classify the 3 historical completed runs with NULL/empty integrity marker;
- confirm residual media/audio publication issues without reopening closed image publication work.

## W07 status

The old workload plan correctly concluded:

> **W07 image publication / ACTIVE / readiness = 0/5 remaining implementation**

That remains the default.

Do not reopen W07 image production/publication simply because later architecture work discusses asset Authority.

If W13 exposes a new browser-visible image/anchor problem, route it to the relevant renderer/regression residual.

Audio residuals, if any, are a separate evidenced runtime-media closure item.

---

# 6. Cross-cutting Gate G1 — polling and transport correctness

**New prerequisite inserted before the old W05→W03→W01 spine.**

The old plan did not have enough evidence to prioritize this. Later code review did.

## Scope

Player first; Teacher equivalent where the same defect exists.

Implement:

- single-flight refresh;
- monotonic generation;
- stale same-session response discard;
- logout/rejoin generation invalidation;
- explicit SUCCESS / NOT_APPLICABLE / FETCH_ERROR;
- preserve last confirmed passive screen on transient failure;
- fail-close mutation controls when identity is stale/unknown;
- remove duplicate reads only when equivalence is proven.

## Why it comes first

This does **not** replace the old W sequence.

It stabilizes the diagnostic environment so W05/W03/W01 can be tested without polling races masquerading as semantic defects.

## PASS

- old response cannot overwrite newer state;
- fetch failure never becomes `active:false`;
- reconnect resumes from canonical server state;
- no UI redesign.

---

# 7. Early usability insert U0 — formal start / next-action clarity

This is an implementation insert derived from the first human trial, not a replacement W package.

## Teacher

Normal Teacher view must expose one canonical formal-start action.

Competing "Initialize ACT1–5", legacy scene advance, developer start helpers, etc. must not appear as equivalent normal-flow controls.

## Player

At every progression-critical point the Player must know:

> "What do I do next?"

Do not rely on an implicit assumption that "the Player saw the rendered screen".

Where gameplay truly requires an acknowledgement, use an explicit authoritative action/ACK.

Where rendering alone is sufficient, do not add an unnecessary persistent ACK fact.

## Important Authority rule

Displayed ≠ confirmed.

If Teacher operational logic needs to know a Player followed a sign or entered the next room, it must use a server-confirmed action/state, not "the sign was rendered in the browser".

---

# 8. Original early remediation spine, preserved: W05 → W03 → W01

This sequence remains valuable and should be preserved **after G1/U0**.

---

# 9. W05 — Canonical Teacher operational-location projection

**Old-plan role:** first bounded authoritative correction.  
**New Authority refinement:** domain-published semantics + thin S7 aggregation.

## Keep from old plan

W05 stays early because:

- bounded;
- mostly independent from Player shell;
- gives Teacher reliable information before Teacher UI redesign;
- easy to test separately.

## New semantic contract

Location is split into:

- physical location;
- transition state;
- assignment role;
- engagement state;
- task state;
- presentation scene.

### Ownership

- S3B: early/per-Player movement and partial ACT5→6 entry;
- S5: shared location only after ACT6 all-required-player entry barrier;
- S6: shared later scene/location;
- `s6_allocations`: A/B/C/WATCHER assignment;
- `s6_engagements`: ENGAGE;
- `s6_station_tasks` and role-specific state: task progress.

### Critical correction

ACT11/12:

> all Players are physically at **Main Gate**.

A/B/C/WATCHER are roles, not physical locations.

## S7 boundary

S7 may:
- authenticate Teacher;
- aggregate domain-published facts;
- select source using explicit activation milestones;
- expose source/validity.

S7 must not:
- create its own ACT→location state machine;
- infer group progression;
- fallback to ACTIVE `game_runs`.

## Shadow then cutover

Use existing Teacher poll; do not add a permanent extra RPC.

Cut over only the location/status region after zero material mismatch on the approved vectors.

---

# 10. W03 — GRAB → authoritative automatic leave + cinematic presentation

**This work item was underrepresented in V1. V1.1 restores it as an independent early package.**

## Why it stays before W01

This was a strong conclusion of the pre-Authority plan:

- it fixes an early ACT2 progression boundary;
- later Discussion regression depends on traversing this boundary;
- fixing it after W01 creates unnecessary re-validation.

## Player-facing intent

One clear action:

> **带上物品并离开房间**  
> **Neem mee wat je nodig hebt en verlaat de kamer**

The Player selects desired optional items separately; this action does not choose them for the Player.

## Server semantics

One idempotent authoritative request must:

- acquire required progression items;
- acquire already-discovered selected optional carryable items where allowed;
- never auto-read hidden information;
- record GRAB completion;
- record leaving start room;
- update authoritative Player location;
- evaluate the all-required-player gate;
- open the next canonical interaction exactly once.

## Authority refinement

Do not create one new "grab_and_left=true" canonical field merely for UI convenience if existing authoritative facts already own the semantics.

A combined UI/action RPC may perform multiple canonical writes atomically.

## Tests

- normal;
- lost response then same-request retry;
- double click;
- simultaneous final two/three Players;
- reconnect after server commit but before response;
- discovered optional item;
- undiscovered optional item;
- exact event/provenance output.

---

# 11. W01 — Teacher-paced Discussion lifecycle

**Old-plan role:** semantic repair before visual Discussion migration.  
**New Authority refinement:** exact interaction/round identity + no stale completion carry-over.

## Preserve old ordering

W01 remains before W02-B.

Do not visually unify Discussion while its pacing semantics are still wrong.

## NORMAL mode

- discussion is Teacher-paced;
- hard 90/180/300-second expiration does not destroy the communication channel;
- Teacher's canonical Open Vote action moves discussion into voting;
- Teacher oral pacing does not require database timer tricks;
- add-time only applies when a valid current interaction supports it.

## Vote identity

Every vote/read/write binds to:

- run_id;
- discussion_session_id;
- phase_key;
- vote_round / exact interaction identity.

Old-round completion never carries forward.

## Result semantics vs presentation

Server/domain decides:
- majority;
- tie/no consensus;
- wrong majority;
- next interaction.

UI may standardize a short result presentation, but presentation must not decide the result.

## Three-second result presentation

Where current Teacher decisions retain this requirement:

- all Player screens show the server-committed result prominently for ~3 sec;
- Teacher sees the same committed result;
- tie vs wrong action remain semantically distinct;
- refresh during feedback must not invent a new outcome or duplicate server transition.

## Tests

Generic / S5 / S6 Discussion variants, including:
- messages;
- Teacher open vote;
- 2 submitted + 1 disconnected;
- reconnecting third;
- tie/revote;
- wrong-majority path;
- stale-round submission;
- add time;
- refresh mid-result feedback.

---

# 12. New bounded server correction L3 — ACT3 Library concurrency/feedback

The old W08 focused on UI clarity. Later discussion exposed a server-concurrency requirement that should be fixed **before** treating W08 as purely visual.

## Server rule

For the five-digit Library attempt:

- one server-accepted attempt at a time;
- transaction/server acceptance defines ordering;
- idempotent resend is not a new attempt;
- later requests during the bounded feedback/cooldown window are rejected/ignored according to the finalized contract;
- a prior correct resolution cannot regress.

## Presentation

Success/failure feedback may use a reusable centered result component.

Do not rely on client-only disabled buttons for concurrency.

## Relationship to W08

L3 fixes the authoritative mutation/concurrency.

W08 later fixes the five-slot/wheel interaction and layout.

---

# 13. Recovery track R0 — Teacher Emergency / Recovery semantics

The old UI plan already required Emergency/Recovery as a Teacher subview, but the semantic behavior was not mature enough then.

V1.1 separates:

> **Recovery semantics first**  
> **Recovery UI recomposition later under W06**

## 13.1 Goals

Recovery exists for:
- software/game blocker;
- missing confirmed Player input;
- class-time need to skip/deblock;
- other explicitly allowlisted cases discovered in testing.

## 13.2 Provenance

Recovery must distinguish:

- player_real;
- no_confirmed_server_record;
- teacher_override_recovery;
- invalidated/skipped behavior feature.

Never backfill a missing real Player action with a fake real timestamp.

## 13.3 Vote/choice recovery representation — explicit review gate

There have been competing design formulations around "virtual vote" vs "override outcome".

Therefore V1.1 does **not** authorize a storage representation yet.

The invariant to preserve is:

- real Player votes remain exactly real;
- any Teacher-supplied recovery contribution/outcome is explicitly override-derived;
- behavior analysis never treats it as genuine Player behavior;
- late stale real submissions cannot overwrite the resolved recovery state.

Before implementation, GA/Teacher/CA must freeze whether the recovery is represented as:
- an explicitly marked override contribution inside the canonical decision mechanism; or
- an override outcome that bypasses the missing normal submission.

CD must not choose this representation implicitly.

## 13.4 TOP — Teacher Override Point

Later proposals introduce ACT-start TOPs.

GA V1.1 treats TOP as a **separate feasibility/design track**, not a prerequisite for fixing all current blockers.

Do not blanket-build 13 ACT-start jumps until:

- GA specifies required semantic state/resources per target;
- CD proves which transitions can be safely reused;
- CA challenges branch/history/integrity effects.

Prefer existing local allowlisted recovery where it is sufficient.

A universal arbitrary "jump to ACT N" control is not approved.

---

# 14. Cross-cutting Gate G2 — Authority compliance checkpoint after early semantic fixes

After G1 + U0 + W05 + W03 + W01 + L3/R0 bounded work, pause before frontend recomposition.

Confirm:

- current Teacher/Player state no longer needs legacy mirror fallback;
- W05 source ownership is stable;
- Discussion result/round identity is stable;
- GRAB/leave idempotency is stable;
- recovery provenance is explicit;
- Library mutation concurrency is stable.

Only then proceed to the old frontend migration sequence.

This protects the original plan's fault-isolation principle.

---

# 15. W02-A — Player structural no-op shell

Preserve the original architecture decision:

> prototypes are visual contracts, not replacement applications.

Keep one Player runtime.

Stable mounts:

- Header
- Scene
- Action
- Discussion
- Pocket
- hidden Transition Overlay

Rules:

- preserve existing DOM IDs/selectors where practical;
- do not make each mount independently poll;
- no gameplay Authority changes;
- no Pocket/Discussion business migration in this package;
- one active renderer owner per region.

---

# 16. W10 — Central Player identity/runtime header

Keep original order immediately after shell.

Header must correctly handle:

- pre-run;
- first formal render;
- in-run;
- reconnect;
- stale/connectivity warning;
- completion if applicable.

Do not infer ACT/status from ACTIVE `game_runs` mirror fallback.

---

# 17. W02-B — Discussion visual adapter

Only after W01 is stable.

Goals:

- generic/S5/S6 Discussion visually converge into one stable region;
- existing domain Discussion semantics remain authoritative;
- exactly one composer/action owner;
- short standardized committed-result presentation may live here;
- responsive shell.

No backend unification is required merely for visual convergence.

---

# 18. W09-A — Discussion local-state preservation

Preserve:

- unsent draft;
- focus;
- transcript scroll.

Restore only when:

> same discussion_session_id + current interaction still permits that local state.

Otherwise discard.

---

# 19. W04 — Pocket / evidence renderer + Knowledge/Observation normalization

The old plan correctly treated W04 as a significant renderer migration.

Later Authority work adds a precondition:

## Before trusted Memories/Pocket reconstruction

Normalize the five known legacy durable facts into their exact canonical Knowledge/Observation destinations.

Preserve original timestamps/provenance.

No generic render-time merge of old `s3b_player_facts`.

## Renderer goals

- stable Pocket mount;
- item/view → asset/text mapping;
- inspect;
- flip/open;
- share;
- reconnect reconstruction;
- remove duplicate story-flow Pocket injection.

---

# 20. W09-B — Pocket local-state preservation

Keep old placement immediately after W04.

Restore only under:

> Same run + item still exists + view still permitted.

Otherwise clear local selection/expansion.

---

# 21. W08 — Five-slot Library lock UI

Now that L3 server concurrency is fixed, W08 remains a bounded UI package:

- five clear slots/wheels;
- locked prefix visible/fixed;
- remaining digits editable;
- explicit Submit Code;
- reconnect-safe rendering;
- responsive Action region.

Do not alter server lock/fallback Authority here.

---

# 22. G4 — measured decision on any shared Player/Teacher context facility

This is the main contribution from later Observer/facade discussion, but it is **conditional**, not a new mandatory architecture project.

Run this measurement **after the early semantic fixes and before/while planning W06**, when there is enough evidence to know whether duplicated arbitration remains expensive.

Measure:

- Player RPCs/poll after G1;
- Teacher RPCs/poll after W05;
- p50/p95;
- DB work;
- remaining cross-domain owner-selection branches;
- same-frame inconsistency frequency;
- duplicate Player/Teacher runtime/presentation logic;
- detail-RPC identity contract gaps;
- implementation/cutover/rollback cost.

## Decision

### If no material benefit

Keep domain-specific read adapters.

### If material benefit for ≥2 real consumers

Allow a minimal shared context facility limited to:

- run identity/lifecycle;
- runtime owner;
- presentation identity;
- exact interaction identity;
- validity.

Generic V1 must not include:

- universal gate engine;
- legal-action booleans;
- per-Player operational location;
- Pocket details;
- Teacher-private state;
- ACT-specific gameplay rules.

Any shared facility must replace duplicate arbitration, not add a permanent extra poll.

---

# 23. W06 — Teacher Console same-runtime recomposition

Preserve the old plan's same-runtime decision.

One `teacher.html`, with internal views:

- Normal / Live Operations
- Emergency / Recovery
- Maintenance / Developer
- preserved pre-run setup

## Normal view

Show:
- canonical current interaction;
- W05 location/status;
- exact last committed Player action where approved;
- Discussion state;
- current group/participant progress only where semantically valid.

Avoid generic WAITING when a more specific server-confirmed action is available.

## Emergency / Recovery

Displays only currently authorized recovery controls from R0/TOP contracts.

No stale selected action survives interaction change.

## Maintenance / Developer

Legacy/developer/debug controls belong here if still required.

Normal classroom UI must not present them as equivalent progression tools.

## Runtime rules

- preserve Teacher token/room/run;
- one polling lifecycle;
- avoid duplicate listener binding;
- preserve existing control nodes where practical.

---

# 24. W09-C — Teacher local-state preservation

Restore only when:

> same room + same run + same interaction owner + referenced action/view still exists.

Otherwise return to Normal / Live Operations.

---

# 25. W11 — low-risk bilingual/text cleanup

Keep old late placement.

Includes:

- remove Sprint/developer jargon from normal pages;
- bilingual labels;
- Start formal run wording/location cleanup;
- deduplicate universal values;
- long Chinese/Dutch button overflow;
- local panel/table overflow.

Preserve semantic selectors/IDs where possible.

---

# 26. Security / historical residual track S0

This is a cross-cutting bounded track, not a reason to disrupt the W sequence.

## S0-A legacy RPC quarantine

`s1_submit_private_choice / s1_scene_choices`:

- current formal UI does not use them;
- deployed browser reachability exists;
- quarantine/revoke only after compatibility check;
- add negative privilege test.

## S0-B remaining effective-privilege closure

Complete bounded probes before final release.

## S0-C finalization anomaly

Classify the 3 historical NULL/empty integrity cases.

Do not rewrite history to make the UI green.

## S0-D fresh-install reproducibility

A clean migration replay must reproduce current V4 item-label/current-metadata expectations.

## S0-E media residuals

Do not reopen W07 image publication absent new evidence.

Close only actual residual audio/media runtime blockers evidenced in the current build.

---

# 27. I0 — pre-transition integrated checkpoint

Preserve this important old-plan checkpoint.

Run the full recomposed frontend **before W12**.

Purpose:

- separate shell/Discussion/Pocket/Teacher regressions from transition-overlay regressions;
- freeze a rollback SHA before the global presentation state machine.

Minimum:

- ACT1→ACT14 deterministic path;
- reconnect;
- W03 GRAB/leave;
- W05 location;
- generic/S5/S6 Discussion;
- vote/revote;
- Library;
- Pocket;
- Teacher Normal/Recovery/Maintenance;
- polling failure;
- stale response;
- privacy;
- asset anchors;
- browser/network errors.

If I0 fails, do not add W12.

---

# 28. W12 — generic two-second scene-transition presentation

Preserve the old late placement.

Use confirmed canonical presentation scene identity.

Behavior:

```text
confirmed scene change
→ overlay
→ ~2 seconds
→ reveal current scene
```

Copy:

**你正进入下一个场景**  
**Je gaat nu naar de volgende scène.**

Suppress:

- first render;
- reconnect/reload;
- same-scene poll;
- phase-only change;
- GRAB cinematic conflict;
- ACT12 cinematic/blackout conflict.

Presentation only; never progression Authority.

---

# 29. W13 — final integrated regression and new frozen baseline

Preserve W13 as the broad proof owner rather than repeating full regression inside every package.

## Functional coverage

- formal start;
- ACT1→14;
- ACT5→6 partial barrier;
- W03;
- W05;
- generic/S5/S6 Discussion;
- tie/wrong-majority/result display;
- lost response + idempotent retry;
- reconnect;
- Teacher Recovery;
- Library concurrency + UI;
- ACT11 allocation;
- ACT12 task/ENGAGE;
- Pocket inspect/flip/share;
- stale/out-of-order polling;
- intermittent fetch failure;
- privacy;
- legacy RPC negative privilege;
- finalization/export;
- scene transition;
- no duplicate renderer ownership.

## Responsive coverage

- 1920×1080
- 1366×768
- ~900px
- page + local overflow
- anchor alignment

## Performance evidence

Record:

- requests/poll;
- p95 read latency;
- major DB/query work;
- browser error count;
- failure/retry rate.

## Freeze

Freeze exact SHA only after deterministic PASS.

Then:
- CA targeted closure;
- successor human acceptance plan;
- Teacher human acceptance;
- residual-only repair;
- then E2/blind-player testing.

---

# 30. Revised implementation order

This is the central V1.1 synthesis.

```text
G0   freeze baseline / evidence / Authority inputs

G1   polling + transport correctness
U0   formal-start / next-action clarity

W05  Teacher operational-location projection
W03  GRAB authoritative automatic leave
W01  Teacher-paced Discussion / voting lifecycle
L3   ACT3 Library concurrency/feedback server rule
R0   bounded Teacher Recovery semantics / local recovery first

G2   authority + fault-isolation checkpoint

W02-A  Player structural no-op shell
W10    Player identity/runtime header
W02-B  Discussion visual adapter / result presentation
W09-A  Discussion local-state preservation

W04    Pocket renderer + Knowledge/Observation normalization
W09-B  Pocket local-state preservation
W08    Five-slot Library UI

G4      measure whether shared context facility is economically justified

W06    Teacher same-runtime recomposition
W09-C  Teacher local-state preservation
W11    low-risk text/layout cleanup

S0      bounded security/history/media closures as dependencies require

I0      pre-transition integrated checkpoint
W12     2-second scene transition
W13     final integrated regression / freeze / human acceptance
```

This keeps the pre-Authority remediation backbone visible while inserting only those new gates that later evidence genuinely justified.

---

# 31. What changed from V1

## 31.1 Restored W03 as an independent early package

This is the most important correction.

V1 underweighted the early ACT2 progression defect.

V1.1 restores the old:

`W05 → W03 → W01`

fault-isolation logic after the new G1/U0 prerequisites.

## 31.2 Restored W01–W13 as the main vocabulary

V1's P0–P14 numbering made it harder to compare against the established workload and UI plans.

V1.1 preserves W numbering and uses G/U/L/R/S only for genuinely new cross-cutting scopes.

## 31.3 Restored "UI migration after semantic stability"

Shell/Discussion/Pocket/Teacher recomposition again follows the old dependency chain.

Authority work constrains those packages but does not cause a premature UI architecture rewrite.

## 31.4 Corrected W07 handling

V1 risked making "assets/audio" look like a broad reopened package.

V1.1 keeps image W07 closed unless new evidence reopens it.

Only real residual media/audio blockers remain in S0.

## 31.5 Shared context becomes a measured decision gate

V1 still gave shared-context architecture too much structural prominence.

V1.1 makes it G4:

> build nothing unless two real consumers and measured cost justify extraction.

## 31.6 Recovery/TOP is separated from ordinary Teacher UI

The old plan had Emergency/Recovery as UI architecture.

Later work showed that recovery semantics are high-risk gameplay operations.

V1.1 designs/validates R0 first, then W06 presents it.

## 31.7 ACT3 concurrency added without bloating W08

W08 remains UI.

The authoritative server cooldown/concurrency rule is L3.

---

# 32. Workload/risk continuity with the old estimates

V1.1 retains the old planning values as a useful baseline rather than pretending the Authority audit reset engineering cost:

| Work | Prior planning value | V1.1 interpretation |
|---|---:|---|
| W01 Discussion | 3.5/5 | remains high semantic/regression work |
| W02 Player shell | 3.5/5 implementation, ~4/5 regression risk | unchanged; later Authority work adds stricter read contracts |
| W03 GRAB/leave | 3/5 | restored as early independent work |
| W04 Pocket | 3.5/5 | adds canonical Knowledge normalization precondition |
| W05 location | 2.5–3/5 | semantics now better defined; S7 must remain thin |
| W06 Teacher | 3.5/5 | recovery semantics now a prerequisite, not embedded ad hoc |
| W07 image publication | 0/5 remaining | stays closed absent new evidence |
| W08 Library UI | 2/5 | server concurrency separated into L3 |
| W09 local UI state | 2/5 | split A/B/C retained |
| W10 Player header | 1.5/5 | Authority fallback restrictions added |
| W11 text cleanup | 1/5 | unchanged |
| W12 transition | 2.5/5 | unchanged late placement |
| W13 integrated regression | 3.5/5 | broadened to include new Authority/security/recovery cases |

New cross-cutting G1/R0/L3 work is not hidden inside these old ratings; reviewers should estimate it separately.

---

# 33. First future implementation authorization

If reviewers ultimately accept this plan, GA's current first-release recommendation is:

> **G1 only — Player polling / transport correctness.**

Why:

- now directly evidenced;
- independent of gameplay Authority;
- improves the reliability of every later test;
- bounded rollback;
- useful under every architectural outcome.

After G1 PASS, the next bounded release should normally be:

> **U0 if deployed start/next-action ambiguity is still reproducible**, otherwise **W05 shadow projection**.

Then restore the old:

> **W05 → W03 → W01**

semantic sequence.

---

# 34. Review instructions for other agents

This proposal is intended to be challenged.

## CA should challenge

- whether any recovery/TOP proposal invents behavior or weakens provenance;
- whether S7 source-selection crosses into gameplay inference;
- whether package boundaries remain independently auditable;
- whether PASS/STOP criteria can actually falsify a bad implementation.

## CD should challenge

- actual function-level cost of G1/U0/W05/W03/W01/L3/R0;
- whether any planned source is not actually repository-last/deployed-last;
- whether W03/W01 sequencing creates hidden rework;
- whether G4 shared context is likely unnecessary after local fixes;
- precise migration/rollback/test costs.

## ISA should challenge

- automation coverage for polling races, lost response, reconnect, vote-round staleness, concurrent Library attempts;
- which test harnesses can be prepared without becoming an implementation authority.

## VA should challenge

- whether any image/audio item listed as residual is actually already closed;
- whether W13 asset/anchor checks accurately reflect current approved assets.

---

# 35. Status

This document is a GA proposal.

It does not:
- authorize CD coding;
- authorize migrations;
- authorize privilege changes;
- freeze Authority Registry;
- change V4 gameplay spec;
- notify another agent.

It is intended to be the consolidated V1.1 starting point for later multi-agent review.
