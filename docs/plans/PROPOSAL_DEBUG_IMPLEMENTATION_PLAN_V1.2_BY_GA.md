# Proposal of Debug Implementation Plan V1.2 by GA

**Date:** 2026-10-09  
**Owner:** GA  
**Status:** PROPOSAL FOR MULTI-AGENT REVIEW / MODIFICATION  
**Supersedes for GA planning:** `PROPOSAL_DEBUG_IMPLEMENTATION_PLAN_V1.1_BY_GA.md`  
**Implementation authorization:** NONE  
**Notification status:** NOT YET SENT TO OTHER AGENTS  
**Branch:** `remediation/sprint9-structural-v1`

---

# PART I — Consolidated Debug Implementation Plan

Part I preserves the V1.1 synthesis of the pre-Authority remediation plan and the later Authority/data-integrity findings.

**V1.2 control rule:** Part II below re-evaluates the historical W01–W13 work-package model. Where Part II changes the necessity, boundary, complexity, grouping, or sequence of a W package, **Part II controls future GA planning**. Part I remains the detailed semantic/implementation reference for the affected scope.

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

---

# PART II — Re-evaluation of the W01–W13 Work-Package Skeleton

## 36. Why the old W01–W13 skeleton must now be re-evaluated

The W01–W13 structure was created before the project had:

- a 432-field field-level Authority adjudication;
- a bounded JSONB semantic-subfact register;
- deployed evidence proving the unreliability of ACTIVE `game_runs.scene_id / phase_key / step_key` mirrors;
- exact ACT5→6 ownership semantics;
- exact distinction between physical location, assignment role, engagement and task state;
- clearer gate/round/interaction identity semantics;
- a mature separation between domain-published facts, Teacher aggregation and UI presentation;
- a concrete understanding of Teacher Recovery provenance risk.

Therefore the old work estimates mixed together several different kinds of difficulty:

1. **semantic uncertainty** — not knowing which field/function really owned a fact;
2. **actual server implementation difficulty** — concurrency, idempotency, lifecycle mutation;
3. **data normalization difficulty** — migrating old facts without losing provenance;
4. **frontend composition difficulty** — DOM ownership, responsive layout, local UI state;
5. **verification difficulty** — proving the integrated system is correct;
6. **architecture uncertainty** — whether a shared ViewModel/Resolver was even needed.

The Authority work has reduced category 1 substantially.

As a result:

> some UI/state work is now simpler than previously estimated, while some domain/recovery/concurrency work is clearly harder than the old W labels suggested.

The purpose of Part II is therefore not merely to change numeric scores. It is to decide:

- which W packages remain valid standalone units;
- which should be split;
- which should be merged into another package;
- which should leave the critical implementation path;
- which newly discovered scopes deserve their own package/gate.

---

# 37. Re-evaluation of each original W package

## 37.1 Summary table

| Work | V2.1 planning value | Current necessity | Updated technical difficulty | V1.2 structural decision |
|---|---:|---|---:|---|
| **W01 Teacher-paced Discussion lifecycle** | 3.5/5 | **CRITICAL** | **4/5** | retain as independent core gameplay package |
| **W02 Responsive Player shell / stable regions** | 3.5/5 | **HIGH** | **2.5–3/5 implementation** | retain, but remove server Snapshot/state-engine responsibility |
| **W03 GRAB authoritative automatic leave** | 3/5 | **CRITICAL** | **3/5** | retain as independent early gameplay package |
| **W04 Generic Pocket/evidence renderer** | 3.5/5 | **HIGH** | **~4/5 if bundled** | split canonical data normalization from renderer migration |
| **W05 Teacher operational-location projection** | 2.5–3/5 | **CRITICAL FOR DEBUGGING** | **~2.5/5** | retain; redefine as domain-published observability, not progression logic |
| **W06 Teacher Console recomposition** | 3.5/5 | **HIGH** | **2.5–3/5 UI-only** | split UI recomposition from Recovery/TOP semantics |
| **W07 Asset publication / ACTIVE / readiness** | 0/5 remaining | **NO CURRENT IMPLEMENTATION NEED** | **0/5** | retire from active skeleton; retain historical traceability |
| **W08 Five-slot Library lock UI** | 2/5 | **MEDIUM–HIGH** | **1.5–2/5 UI-only** | keep UI-only; split server concurrency/feedback into L3 |
| **W09 Ephemeral UI-state preservation** | 2/5 | **NECESSARY** | **1–2/5 distributed** | retire as standalone package; fold A/B/C into owning UI packages |
| **W10 Player identity/runtime header** | 1.5/5 | **MEDIUM** | **1–1.5/5** | merge into W02-A |
| **W11 Low-risk UI/text cleanup** | 1/5 | **LOW / POLISH** | **1/5** | retain late, off critical gameplay path |
| **W12 Generic 2-second Scene Transition** | 2.5/5 | **NON-CRITICAL PRESENTATION** | **2–2.5/5** | move after functional acceptance, before final visual acceptance |
| **W13 Integrated frontend regression / baseline** | 3.5/5 | **CRITICAL** | **~4.5/5 verification effort** | retain but split functional vs final presentation acceptance stages |

---

# 38. W01 — Discussion lifecycle: difficulty increases

## Old mental model

The old planning description emphasized:

> remove normal-mode hard deadline; Teacher opens vote; reconnect and vote/tie/revote work.

That was correct but incomplete.

## What the Authority/progression work revealed

The actual current contract spans:

- `run_id`;
- `discussion_session_id`;
- `phase_key`;
- exact `vote_round`;
- server-committed result;
- reconnect identity;
- stale submission rejection;
- Teacher Open Vote transition;
- tie vs wrong-majority semantics;
- generic/S5/S6 implementation differences.

We now know examples where semantic distinctions matter:

- ACT7 tie means **no clock action** and a fresh Teacher-paced round;
- ACT9 1:1:1 means **no consensus / no door action**;
- ACT9 majority choosing a wrong action means **the door/action fails**, which is a different server outcome;
- old-round completion cannot carry into the next vote round;
- three-second result display is presentation, not a second source of server timing truth.

## Updated evaluation

**Necessity:** CRITICAL  
**Implementation complexity:** **4/5**  
**Regression risk:** **4–4.5/5**

W01 remains independent and should stay early.

The increase is not because Authority work made the system more complicated. It is because the work exposed the real interaction identity and lifecycle surface that the old 3.5/5 estimate partially hid.

---

# 39. W02 — Player shell: implementation becomes narrower and easier

## Old mental model

W02 gradually accumulated:

- responsive shell;
- stable regions;
- Player View Snapshot;
- global phase/progress normalization;
- polling consistency;
- cross-runtime arbitration.

## What changed

The Authority audit now forbids implementing the old conceptual:

```text
global_phase
+ universal participant_progress
+ universal group_gate
→ PlayerViewSnapshot
```

as a second persisted or generic gameplay state.

A shared context facility is now optional and measurement-gated.

Therefore W02 should be reduced to what it actually owns:

- stable Player DOM regions;
- renderer ownership;
- adapter placement;
- responsive behavior;
- structural Transition mount;
- local rendering lifecycle.

Cross-cutting polling correctness is G1.

Any later shared runtime/presentation identity facility is G4, not W02.

## Updated evaluation

**Necessity:** HIGH  
**Implementation complexity:** **2.5–3/5**  
**Frontend regression risk:** still **~4/5**

This distinction matters:

> W02 is not technically trivial, but much of the old state-model complexity no longer belongs inside it.

---

# 40. W03 — GRAB + authoritative leave: old estimate remains sound

Authority analysis validates the original design direction.

The Player sees one coherent action, but server semantics remain multiple canonical facts:

- GRAB completion;
- item acquisition;
- left-start-room;
- physical location;
- formal events;
- group-gate evaluation.

These should not be collapsed into one convenience Authority field.

The hard parts remain:

- idempotency;
- lost-response retry;
- near-simultaneous participant completion;
- exactly-once next-interaction creation;
- optional discovered-item semantics.

## Updated evaluation

**Necessity:** CRITICAL  
**Implementation complexity:** **3/5**  
**Semantic/regression risk:** **3–3.5/5**

W03 remains a good independent package and should remain early.

---

# 41. W04 — Pocket must be split into canonicalization and rendering

The old W04 combined too much.

## Newly clear precondition

Before the Pocket/Memories renderer can be trusted, durable historical facts must be normalized into canonical Knowledge/Observation.

Known requirements include:

- exact destination for the five legacy durable facts;
- preservation of original timestamp;
- preservation of ACT/source provenance;
- no migration-time `now()` substitution;
- no generic render-time union of old `s3b_player_facts` and new canonical tables.

We also now know that fields such as `allow_share_photo` can be server authorization facts rather than mere presentation flags.

## V1.2 split

### W04-D — canonical Pocket/Knowledge/Observation data contract

Scope:

- legacy-fact normalization;
- provenance/timestamp preservation;
- item/knowledge/observation canonical source cleanup;
- security/capability source verification.

Estimated difficulty:

> **2.5–3/5**

### W04-R — Pocket/evidence renderer migration

Scope:

- stable Pocket mount;
- item/view → asset/text;
- inspect;
- flip/open;
- share;
- reconnect;
- one renderer owner.

Estimated difficulty:

> **3/5**

Bundled together, the old W04 is approximately:

> **4/5**

Therefore the correct action is not simply to raise the old number. It is to split the package.

---

# 42. W05 — more important for debugging, but semantically simpler

The old description treated W05 as a problem of finding one "operational location".

We now know that was too coarse.

The Teacher-facing model may need separate facts:

- physical location;
- handoff/transition state;
- station/role assignment;
- engagement;
- task progress;
- presentation scene.

ACT11/12 is the clearest example:

```text
physical location = Main Gate
assignment = B
engagement = ENGAGED
task = lever centered
```

Station B is not a physical room.

## Why complexity decreases

We no longer need a generic inference engine.

The correct design is:

- S3B publishes early per-Player movement/handoff;
- S5 publishes shared later location after activation;
- S6 publishes shared location and owns role/task state;
- S7 aggregates for Teacher.

## Why importance increases

W05 is now clearly a **debug observability dependency**.

Reliable Teacher visibility makes later testing of:

- W03;
- W01;
- ACT5→6;
- ACT11/12;
- recovery;

substantially easier.

## Updated evaluation

**Necessity:** CRITICAL FOR DEBUGGING  
**Implementation complexity:** **~2.5/5**  
**Semantic risk after contract freeze:** LOW–MEDIUM

W05 stays early, but not because it owns progression.

---

# 43. W06 — must be split: Teacher UI is not Teacher Recovery

This is one of the largest structural corrections.

## W06-UI — Teacher Console recomposition

The visual/runtime task is:

- one `teacher.html`;
- Normal / Live Operations;
- Emergency / Recovery view;
- Maintenance / Developer view;
- preserved pre-run setup;
- stable token/room/run;
- one polling lifecycle;
- no duplicate event listeners.

With semantics already defined elsewhere, this is approximately:

> **2.5–3/5**

## R0 — Teacher Recovery / TOP semantics

This is not a UI problem.

It may involve:

- no-confirmed-server-record cases;
- override provenance;
- partial real votes;
- stale late submissions;
- skipped ACT prerequisites;
- resource/item/knowledge provisioning;
- behavior validity;
- branch compatibility;
- finalization integrity;
- idempotent recovery.

A full ACT-start TOP system covering many/13 checkpoints could be:

> **4.5–5/5**

and may not be justified.

Therefore:

> Recovery semantics must be designed/authorized separately; W06 merely presents the currently allowed Recovery actions.

Bundling R0 into W06 would make the old 3.5/5 estimate seriously misleading.

---

# 44. W07 — remove from active implementation skeleton

The historic image-publication package reached runtime closure.

Current planning value is already:

> **0/5 remaining implementation**

Authority work does not justify reopening it.

Therefore V1.2 classifies W07 as:

> **HISTORICALLY CLOSED / REGRESSION-ONLY**

If later W13 detects:

- anchor misalignment;
- responsive image geometry;
- browser loading failure;

that is a renderer/regression residual unless new evidence proves publication itself regressed.

Residual audio/media problems are separate bounded media work, not a reason to resurrect the whole W07 pipeline.

---

# 45. W08 — split server concurrency from UI

The old W08 was correctly scoped as a 2/5 five-slot Library UI.

Later Teacher decisions added a separate server requirement:

- only one server-accepted code attempt at a time;
- acceptance order is server/transaction order;
- same-request retry is idempotent;
- later attempts during the feedback window do not become competing accepted attempts;
- correct resolution cannot regress;
- feedback/cooldown and existing fallback/hint behavior must coexist.

That is not W08 UI work.

## V1.2 split

### L3 — Library mutation concurrency / feedback semantics

Estimated:

> **~3/5**

### W08 — five-slot/wheel UI

Estimated:

> **1.5–2/5**

If kept bundled:

> **3–3.5/5**

V1.2 prefers the split.

---

# 46. W09 — no longer a standalone implementation package

W09-A/B/C are all browser-local state:

- Discussion draft/focus/scroll;
- Pocket selection/expanded state;
- Teacher selected internal view/details.

They are only meaningful after the corresponding stable mount exists.

Therefore the most efficient implementation is:

- W09-A becomes a Definition-of-Done requirement of W02-B Discussion adapter;
- W09-B becomes a Definition-of-Done requirement of W04-R;
- W09-C becomes a Definition-of-Done requirement of W06-UI.

## Updated evaluation

**Necessity:** necessary  
**Standalone package necessity:** **NO**  
**Distributed complexity:** roughly **1–2/5** across the owning packages

W09 numbering remains for historical traceability but should be retired from the active release skeleton.

---

# 47. W10 — merge into W02-A

The difficult historical question was:

> where does current identity/ACT/status come from?

That ambiguity is now materially reduced by the Authority work.

W10 itself is:

- Player identity;
- current confirmed ACT/status;
- reconnect;
- connectivity/stale indicator.

It should not use ACTIVE `game_runs` mirror fallback.

Once W02-A owns the stable Header mount, a separate W10 release creates little fault-isolation benefit.

## Updated evaluation

**Necessity:** MEDIUM  
**Complexity:** **1–1.5/5**  
**Structural decision:** merge into W02-A

Retain W10 as a requirements tag, not as an independent implementation checkpoint.

---

# 48. W11 — unchanged, but explicitly off the critical gameplay path

W11 remains:

- bilingual terminology cleanup;
- remove developer/Sprint jargon from normal surfaces;
- dedupe repeated values;
- local overflow;
- button/table/panel text fit.

## Updated evaluation

**Necessity:** LOW for gameplay; HIGHER for final usability  
**Complexity:** **1/5**

Keep late.

Do not let W11 wording changes delay core functional acceptance unless text ambiguity itself blocks Player/Teacher action.

---

# 49. W12 — downgrade from debug-critical path to presentation polish

W12 is the 2-second scene transition.

It has non-trivial edge cases:

- scene identity;
- first-render suppression;
- reconnect suppression;
- same-scene polling;
- GRAB cinematic;
- ACT12 cinematic/blackout.

But none of these fixes the main current gameplay blockers.

## V1.2 sequencing change

Do **not** require W12 before the first new functional human trial.

Preferred sequence:

```text
functional integrated regression
→ bounded human functional acceptance
→ W12 presentation layer
→ final presentation/regression acceptance
```

Reason:

> if the game still blocks, the test should fail without a global presentation state machine introducing another variable.

## Updated evaluation

**Necessity for gameplay debugging:** LOW  
**Necessity for final intended UX:** MEDIUM  
**Complexity:** **2–2.5/5**

W12 remains late presentation work.

---

# 50. W13 — more important and more expensive than the old score implies

The old 3.5/5 estimate was largely a frontend integration estimate.

Current W13 must verify:

- Authority no-fallback rules;
- polling generations;
- transport failure;
- idempotent retry;
- exact vote round;
- Discussion semantics;
- ACT5→6 ownership;
- ACT11/12 assignment/engagement;
- Recovery provenance;
- legacy RPC privilege closure;
- Knowledge normalization;
- finalization;
- media;
- privacy;
- reconnect;
- responsive UI;
- one renderer owner.

Therefore W13 is better treated as a **verification program**, not compared directly with an implementation package.

## Updated evaluation

**Necessity:** CRITICAL  
**Verification complexity:** **~4.5/5**

V1.2 recommends splitting it into:

### F0 — Functional integrated regression + functional human acceptance

Before W12.

Goal:

> prove the game works and can be debugged end-to-end without presentation polish.

### F1 — Final presentation/regression acceptance

After W12 and final low-risk UI work.

Goal:

> prove intended final UX without reopening gameplay semantics.

---

# 51. Structural disposition of the original W skeleton

The original W01–W13 packages now fall into five categories.

| Category | Work |
|---|---|
| **Retain as standalone core implementation packages** | W01, W03, W05 |
| **Retain but split internally** | W04 → W04-D + W04-R; W06 → R0 + W06-UI; W08 → L3 + W08-UI |
| **Merge into another work package** | W09-A/B/C → W02-B/W04-R/W06-UI; W10 → W02-A |
| **Leave critical implementation path** | W07 closed; W11 late polish; W12 late presentation |
| **Retain as validation program** | W13 → F0 functional proof + F1 final presentation proof |

This means:

> W01–W13 should remain a historical traceability vocabulary, but no longer be treated as thirteen peer implementation packages.

---

# 52. Newly recognized work not represented cleanly by the original W01–W13

The old skeleton also omitted several now-proven scopes.

## G0 — baseline / evidence / Authority freeze inputs

No implementation, but required before bounded releases.

## G1 — polling / transport correctness

Independent cross-cutting client correctness.

Estimated difficulty:

> **2–2.5/5**

High leverage; first implementation candidate.

## U0 — formal start / next-action clarity

Bounded runtime/UI contract repair.

Estimated:

> **1.5–2.5/5 depending on deployed start-path defect**

## L3 — ACT3 Library concurrency / feedback server rule

Estimated:

> **~3/5**

## R0 — Recovery semantics

### R0-A — local/current-interaction recovery

Use existing allowlisted recovery where possible.

Estimated:

> **3–4/5**, depending on actual active functions.

### R0-B — full ACT-start TOP framework

Conditional future scope.

Estimated:

> **4.5–5/5**

Do not assume it must be implemented in Round 1.

## S0 — bounded security/history closure

Includes:

- legacy RPC quarantine;
- remaining effective privilege verification;
- finalization anomaly classification/fix if current defect;
- fresh-install reproducibility;
- real residual media closure.

Each sub-item should be independently scoped.

---

# 53. Updated implementation skeleton

The new skeleton is no longer "execute W01 through W13".

It is organized by engineering purpose.

## Phase A — Stability and observability foundation

```text
G0  freeze baseline / evidence / Authority inputs
 ↓
G1  polling + transport correctness
 ↓
U0  formal-start / next-action clarity, if still reproducible
 ↓
W05 Teacher operational-location / committed-action observability
```

Purpose:

> make the system trustworthy enough to debug before changing major gameplay or UI structure.

---

## Phase B — Core gameplay semantics

```text
W03  GRAB + authoritative leave
 ↓
W01  Teacher-paced Discussion / vote lifecycle
 ↓
L3   ACT3 Library concurrency / feedback
 ↓
R0-A minimum local Recovery needed for hard blockers
```

Purpose:

> fix the progression and interaction semantics that directly blocked the first human run.

R0-B full TOP is not automatically included.

---

## Phase C — Authority / fault-isolation checkpoint

Reconfirm:

- no stale mirror fallback;
- exact interaction identities;
- W05 ownership;
- W03 idempotency;
- W01 round semantics;
- L3 concurrency;
- Recovery provenance.

No major frontend recomposition before this checkpoint passes.

---

## Phase D — Player UI migration

```text
W02-A + W10  stable shell + header
 ↓
W02-B + W09-A  Discussion adapter + local Discussion state
 ↓
W04-D  Knowledge/Observation normalization
 ↓
W04-R + W09-B  Pocket renderer + local Pocket state
 ↓
W08-UI  five-slot Library presentation
```

The UI consumes already-correct domain facts.

It does not repair them.

---

## Phase E — Architecture measurement, not assumption

```text
G4  measure remaining Player/Teacher cross-domain arbitration
```

Only if measured benefit exists for at least two consumers:

> introduce a minimal shared runtime/presentation/interaction identity facility.

Otherwise do nothing.

---

## Phase F — Teacher UI and bounded closure

```text
W06-UI + W09-C  Teacher Normal / Recovery / Maintenance views
 ↓
S0  security / legacy / finalization / reproducibility / media residuals
 ↓
W11  low-risk wording/layout cleanup where useful for functional trial
```

W06 displays approved R0 recovery semantics; it does not invent them.

---

## Phase G — Functional proof before presentation polish

### F0 deterministic functional regression

Run without W12.

Then:

### H0 bounded human functional acceptance

Goal:

- determine whether ACT1→14 now works in real use;
- exercise Teacher observability/recovery;
- find genuine remaining blockers without transition-overlay noise.

If H0 finds material gameplay defects:

> return only to the owning domain package.

Do not proceed to presentation polish merely to keep schedule.

---

## Phase H — Presentation polish

After F0/H0 functional confidence:

```text
W12  generic scene transition
+ remaining W11 visual/text polish
```

---

## Phase I — Final acceptance

### F1 final deterministic regression

Includes presentation behavior and full responsive matrix.

Then:

- freeze exact final SHA;
- CA targeted closure;
- final Teacher human acceptance;
- then E2/blind-player testing.

---

# 54. Updated skeleton in compact form

```text
A. STABILITY / OBSERVABILITY
   G0 → G1 → U0 → W05

B. CORE GAMEPLAY SEMANTICS
   W03 → W01 → L3 → R0-A

C. AUTHORITY / FAULT-ISOLATION CHECKPOINT

D. PLAYER UI MIGRATION
   (W02-A + W10)
   → (W02-B + W09-A)
   → W04-D
   → (W04-R + W09-B)
   → W08-UI

E. ARCHITECTURE MEASUREMENT
   G4 → [shared context only if measured worthwhile]

F. TEACHER / SECURITY CLOSURE
   (W06-UI + W09-C)
   → S0
   → W11 as needed

G. FUNCTIONAL ACCEPTANCE
   F0 deterministic functional regression
   → H0 human functional trial

H. PRESENTATION POLISH
   W12 + remaining W11

I. FINAL ACCEPTANCE
   F1 final regression
   → freeze
   → final human acceptance
   → E2
```

This is the V1.2 active skeleton.

---

# 55. Why the updated skeleton differs from the old one

## 55.1 Polling correctness moves before W05/W03/W01

The old plan did not yet have enough code evidence to know that overlapping/stale/error-as-inactive refresh behavior was itself contaminating debugging.

G1 now stabilizes the test instrument.

## 55.2 W05 remains early, but as observability

W05 is not an architecture engine.

It is early because later semantic debugging is cheaper when Teacher can see what each Player actually committed/did.

## 55.3 W03/W01 remain the first true gameplay repairs

This preserves the strongest part of the old fault-isolation plan.

## 55.4 Recovery is no longer hidden in Teacher UI

Semantic recovery risk is too high to treat it as panel composition.

## 55.5 UI migration remains downstream of semantic stabilization

This preserves the old plan's key safety principle.

## 55.6 Shared context is no longer assumed

Authority work showed that a new read abstraction can become a second state machine if introduced prematurely.

Measurement now controls that decision.

## 55.7 Functional human acceptance moves before W12

This is a major sequence improvement.

Core gameplay should be human-tested before adding a global scene-transition presentation state machine.

---

# 56. Updated technical difficulty assessment

## 56.1 Important distinction

The scale below measures **technical implementation difficulty** unless explicitly labeled verification.

It should not be interpreted as one additive project estimate.

A 4.5/5 verification program and a 4.5/5 implementation package are different types of work.

---

## 56.2 Implementation difficulty ranking

| Rank | Scope | Difficulty | Why |
|---:|---|---:|---|
| 1 | **R0-B full ACT-start TOP / branch-complete Recovery framework** | **4.5–5/5** | cross-ACT invariants, resources, provenance, stale requests, behavior validity, finalization; may be unnecessary |
| 2 | **W01 Discussion/voting lifecycle** | **4/5** | generic/S5/S6, exact sessions/rounds, Teacher pacing, reconnect, tie/wrong-result semantics |
| 3 | **W04 combined if not split** | **~4/5** | canonical data/provenance + renderer/share/reconnect; reason to split |
| 4 | **R0-A bounded current-interaction Recovery** | **3–4/5** | server-authorized deblock + provenance + stale-request control |
| 5 | **W03 GRAB/leave** | **~3/5** | atomic multi-fact effect, idempotency, group concurrency |
| 6 | **L3 Library concurrency/feedback** | **~3/5** | server serialization, retry identity, cooldown/result interaction |
| 7 | **W04-R Pocket renderer** | **~3/5** | stable renderer, view/inspect/share/reconnect |
| 8 | **W06-UI Teacher recomposition only** | **2.5–3/5** | same-runtime views, listener/poll continuity, no semantic recovery logic |
| 9 | **W02 Player shell only** | **2.5–3/5** | DOM ownership/responsive migration; semantics removed |
| 10 | **W04-D canonical Knowledge/Observation normalization** | **2.5–3/5** | historical provenance/timestamp correctness |
| 11 | **W05 Teacher operational-location projection** | **~2.5/5** | semantics now explicit; thin S7 aggregation |
| 12 | **G1 polling/transport correctness** | **2–2.5/5** | concurrency/error lifecycle in client, but bounded |
| 13 | **W12 scene transition** | **2–2.5/5** | exactly-once presentation + reconnect/cinematic suppression |
| 14 | **U0 formal start / next-action clarity** | **1.5–2.5/5** | cost depends on whether deployed defect is UI-only or runtime path |
| 15 | **W08-UI Library five-slot presentation** | **1.5–2/5** | mostly bounded UI after L3 |
| 16 | **W10 requirement if implemented separately** | **1–1.5/5** | should be merged into W02 |
| 17 | **W11 text/layout cleanup** | **1/5** | local presentation |
| 18 | **W07 image publication** | **0/5 remaining** | already closed absent new evidence |

---

## 56.3 Verification difficulty ranking

| Rank | Verification scope | Difficulty |
|---:|---|---:|
| 1 | **F1/W13 final integrated proof** | **~4.5/5** |
| 2 | **F0 functional integrated proof** | **~4/5** |
| 3 | **W01 multi-runtime Discussion regression** | **~4/5** |
| 4 | **R0 recovery provenance / stale-request / branch regression** | **~4/5** |
| 5 | **W02/W04/W06 renderer ownership + reconnect regression** | **3.5–4/5** |
| 6 | **W03 concurrency/idempotency regression** | **~3.5/5** |
| 7 | **W05 ACT5→6 / ACT11–12 vector proof** | **~3/5** |
| 8 | **L3 concurrent Library attempt proof** | **~3/5** |
| 9 | **W12 transition timing/suppression proof** | **~2.5–3/5** |

This separate table avoids the misleading conclusion that W13 "implementation" is harder than a server mutation package. W13 is difficult because the proof surface is broad.

---

# 57. Updated priority assessment

Technical difficulty is not the same as implementation priority.

V1.2 priority is:

## Priority 0 — make debugging trustworthy

- G0
- G1

## Priority 1 — unblock real gameplay / improve visibility

- U0 if reproduced;
- W05;
- W03;
- W01;
- L3;
- minimum R0-A required for real blockers.

## Priority 2 — migrate UI without changing truth

- W02/W10;
- W02-B/W09-A;
- W04-D/R;
- W09-B;
- W08;
- W06/W09-C.

## Priority 3 — close security/history residuals

- S0.

## Priority 4 — prove function

- F0;
- H0.

## Priority 5 — polish

- W11 residual;
- W12.

## Priority 6 — final proof

- F1;
- final acceptance;
- E2.

This explains why the most technically difficult possible scope, R0-B full TOP, is **not** automatically the first or even mandatory implementation package.

---

# 58. Consequence for workload planning

The old workload table should no longer be used as:

> "13 work packages, each with one fixed 1–5 score."

Instead use:

### Core implementation estimates

- semantic mutation packages;
- data normalization packages;
- UI migration packages;
- recovery packages.

### Separate verification estimates

- targeted gate tests;
- F0 functional integrated proof;
- F1 final presentation proof.

### Separate conditional architecture estimate

- G4 shared context only if measurement triggers it.

### Retired/merged historic W labels

- W07 closed;
- W09 distributed;
- W10 merged;
- W12 late;
- W13 validation program.

This produces a more realistic project picture than simply adding the old W01–W13 scores.

---

# 59. V1.2 planning conclusion

The 432-field Authority and progression-logic work does not invalidate the original debug plan.

It does something more useful:

> it reveals which parts of the original plan were genuine hard engineering problems and which parts looked hard mainly because the semantic ownership was unclear.

The largest current risk center is no longer:

> "build a universal UI state model."

It is:

> **Discussion lifecycle + bounded Recovery + idempotent/concurrent gameplay mutations + canonical historical data + integrated proof.**

Conversely, several previously intimidating UI scopes are now easier to bound because their data ownership is clearer.

Therefore V1.2 adopts the following high-level strategy:

> **Stabilize the test instrument → expose trustworthy state → fix core gameplay semantics → migrate UI over already-correct facts → close recovery/security → prove the game functionally → add non-critical presentation polish → perform final acceptance.**

This is the controlling GA planning model for future review of this proposal.

