# Proposal of Debug Implementation Plan V1 by GA

**Date:** 2026-10-09  
**Owner:** GA  
**Status:** PROPOSAL FOR MULTI-AGENT REVIEW / MODIFICATION  
**Implementation authorization:** NONE  
**Notification status:** NOT YET SENT TO OTHER AGENTS  
**Branch:** `remediation/sprint9-structural-v1`

This proposal consolidates the current GA view of the safest and lowest-regret implementation path after:

- first-round human/manual acceptance failures;
- full 432-field Authority investigation/adjudication;
- CA-161 independent challenge and GA reconciliation;
- deployed read-only evidence from CD-073;
- GA-092 hybrid proposal;
- CD's lowest-cost counter-proposal;
- CA-165 Round-II cost-gated reconciliation;
- GA-094 W05 operational-location semantic ownership review.

It is deliberately a **proposal**, not a canonical implementation order. CA/CD/ISA/VA may challenge or revise it before any package is released.

---

# 1. Executive decision

The debug program should use a **cost-gated hybrid strategy**:

> **Fix proven client/runtime defects first.**  
> **Keep gameplay mutations and semantic facts inside their owning domains.**  
> **Let domains publish derived read facts where UI needs them.**  
> **Use S7 as a thin Teacher aggregation boundary for W05.**  
> **Create a shared Player/Teacher context facility only later, and only if measurements prove it removes more complexity than it adds.**

Do **not** build:

- a persisted universal `global_phase`;
- a universal participant-progress table;
- a second persisted gate state;
- a broad ACT1–14 Resolver;
- a "latest event wins" state machine;
- browser fallback to `game_runs.scene_id / phase_key / step_key`.

The owning domain computes/publishes; read adapters transport/aggregate; UI renders; mutation RPCs authorize and write.

---

# 2. Definition of success

Round-1 debugging is complete only when all of the following are true:

1. A Teacher can start and supervise a formal run without ambiguous or dead controls.
2. Three Players can progress ACT1→ACT14 without hard blockers under normal classroom pacing.
3. Player actions are not lost, duplicated, or silently treated as applied after transport failure.
4. Discussion/voting cannot deadlock because one Player is missing or because a timer expired.
5. Teacher has bounded Emergency/Recovery controls that can deblock the run with full provenance.
6. Reconnect reconstructs canonical current state without relying on browser history.
7. Player and Teacher UIs do not infer current gameplay truth from stale support/mirror fields.
8. Pocket/Knowledge/Observation state is canonical and reconstructible.
9. W05 Teacher location/status is semantically correct across ACT5→6 and ACT11–12.
10. No Player receives another Player's unrevealed private information.
11. Asset/audio dependencies required by the formal run are ACTIVE and loadable.
12. Completed-run integrity/finalization behavior is classified and predictable.
13. UI has one active renderer owner per region.
14. Polling/fetch failures fail safely and never fabricate gameplay state.
15. Full deterministic browser regression plus human acceptance pass on a newly frozen SHA.

---

# 3. Non-negotiable architecture rules

## 3.1 Authority

The current semantic source of truth is the Authority Registry V0.3 + its reconciled 432-field master and JSONB subfact register.

Rules:

- one semantic fact has one current canonical owner;
- copy/history/cache/support may exist but cannot silently become fallback Authority;
- a derived/calculated fact may be authoritative if it is a genuinely new semantic fact;
- historical records may be authoritative for historical events without owning current gameplay state;
- ACTIVE `game_runs.scene_id / phase_key / step_key` are **NO_FALLBACK**;
- FINALIZED use of those fields is a different completed-run snapshot fact.

## 3.2 Domain ownership

- ACT1–5 → S3B domain;
- ACT6–8 → S5 domain after the ACT6 group-entry barrier;
- ACT9–13 → S6 domain after valid S6 activation;
- Discussion → Discussion domain;
- Pocket/Knowledge/Observation → their own canonical domain;
- Teacher Override → Teacher Override domain;
- Finalization → S8/finalization domain;
- Asset publication → Asset Manager domain.

Cross-domain UI code may aggregate these facts but must not re-create their business rules.

## 3.3 No second state machine

No implementation package may introduce:

- persisted generic `global_phase`;
- dual writes solely to feed a UI snapshot;
- universal `participant_progress`;
- universal persisted gate status;
- a cross-ACT SQL switch that reproduces gameplay progression rules.

## 3.4 Error semantics

Every read path must distinguish:

- **SUCCESS**
- **NOT_APPLICABLE** / domain not active
- **FETCH_ERROR**
- **UNKNOWN / INVARIANT_BREACH**

Transport failure is not "inactive".

Mutating controls fail closed when the current canonical interaction cannot be verified.

---

# 4. Current evidence that drives this plan

## 4.1 Proven browser/read problems

Current Player refresh can issue roughly 8–9 RPCs in complex states under ~1.2s polling.

Known defects include:

- overlapping refreshes;
- old same-session response overwriting a newer result;
- fetch/function errors converted to `active:false`;
- possible duplicate S8 reads;
- browser-side cross-Sprint arbitration.

These are immediate defects independent of any future shared read architecture.

## 4.2 Proven stale ACTIVE mirrors

CD's deployed evidence found 577 ACTIVE runs:

- 208 had no modern presentation row;
- among the remaining 369, every run differed in at least one `game_runs.scene/phase/step` mirror;
- zero matched all three.

Therefore no debug implementation may "heal" a missing modern state by reading ACTIVE `game_runs` mirrors.

## 4.3 Proven dormant legacy surface

`s1_submit_private_choice` remains deployed and browser-executable by anon/authenticated, and `s1_scene_choices` still has active rows.

It is:

> DEAD_FOR_CURRENT_FORMAL_UI / DORMANT_RPC_REACHABLE

It requires explicit quarantine, not assumption.

## 4.4 Asset / label findings

Known asset registry/candidate pairs currently show no deployed drift where both rows exist, but structural split-authority risk remains.

Deployed V4 item labels currently match expected values.

Some audio keys lacked ACTIVE candidate in the deployed evidence set and remain an asset-publication concern for acceptance.

## 4.5 Finalization historical anomaly

23 completed runs had finalization rows; 20 showed integrity verified=true and 3 showed NULL/empty verification marker.

These three must be classified, not silently rewritten.

---

# 5. Human-acceptance defect inventory and implementation route

| Observed / known problem | Primary route |
|---|---|
| Teacher "Initialize ACT1–5" / start flow confusing or non-responsive | Package 2 — formal start/entry UX + runtime verification |
| Player does not know next required action | Package 6/8 — stable shell/domain adapter, explicit actionable state |
| 90-second Discussion closes communication | Package 4 — Teacher-paced Discussion lifecycle |
| Add 30 sec fails to recover | Package 4 — Discussion timer/control semantics |
| Two Players vote, third stuck / all become waiting after refresh | Package 1 + Package 4 — polling correctness + vote/interaction identity |
| Clock Room has no vote path | Package 4 — S5 Discussion/vote renderer and state contract |
| Player input may have been sent but not recorded after network interruption | Package 1 + domain idempotency checks |
| Teacher needs forced recovery without inventing a second game | Package 5 — Recovery/Override |
| Teacher may need a virtual vote to replace unavailable/missing Player input | Package 5 — provenance-safe Scheme-B override insertion |
| Need explicit proof Player saw a progression-critical instruction/sign | Package 2/3 — explicit ACK only where progression depends on acknowledgement |
| Teacher operational location wrong/stale | Package 3 — W05 domain-published S7 projection |
| Pocket/Knowledge/Observation may reconstruct inconsistently | Package 7 |
| Player/Teacher UI repeatedly re-derives state from many Sprint RPCs | Package 1 first; Package 9 only if measured shared-context benefit exists |
| Audio/visual runtime gaps | Package 10 |
| Historical finalization ambiguity | Package 11 |
| UI duplicate renderers/local-state loss/transition glitches | Packages 6–9/12 |

---

# 6. Proposed implementation sequence

The sequence is intentionally staged. A later package does not start merely because an earlier package exists in this document; each release remains separately authorized.

---

# Package 0 — Freeze baseline, finalize evidence inputs

**Type:** evidence / governance  
**Recommended owner:** GA + CA review; CD only for bounded technical evidence  
**Implementation:** none

### Tasks

1. Freeze current rollback SHA and preserve existing E1/manual-acceptance evidence.
2. Treat Registry V0.3 as the current semantic contract pending final CA freeze wording.
3. Complete the remaining small effective-privilege probes for browser-callable functions.
4. Classify the three completed runs with NULL/empty integrity marker as one of:
   - LEGACY_PRE_CONTRACT
   - HISTORICAL_INCOMPLETE
   - CURRENT_CONTRACT_DEFECT
5. Confirm which required audio keys are still not ACTIVE.
6. Record all package-specific preconditions before code work starts.

### Exit

A concise "implementation inputs frozen" record exists.

### STOP

Any new evidence that changes semantic Authority returns the issue to GA/CA before code.

---

# Package 1 — Client polling and transport correctness

**Type:** direct client defect fix  
**Cross-map:** prerequisite to W02/W06; CA Gate A  
**Recommended owner:** CD  
**Risk:** low-to-medium  
**No Authority redesign**

### Changes

In `src/game/app.js` and equivalent Teacher polling code where applicable:

1. one in-flight refresh per session/view;
2. monotonic generation number;
3. stale same-session response cannot commit after newer generation;
4. logout/rejoin invalidates prior generation;
5. explicit result classes:
   - SUCCESS
   - NOT_APPLICABLE
   - FETCH_ERROR
6. transient fetch error:
   - preserve last confirmed passive view;
   - disable/fail-close mutating controls whose current identity cannot be verified;
   - show connectivity/stale warning;
7. remove duplicate reads only where equivalence is proven;
8. retain existing renderers and selectors initially.

### Mutation reliability rule

For every mutating client action:

- generate/reuse request identity;
- do not assume action succeeded until server acknowledgement;
- on timeout/reconnect, retry with the same request ID where the domain supports idempotency;
- a missing acknowledgement is UNKNOWN, not "completed".

### Tests

- forced delayed older response;
- overlapping timer ticks;
- offline / online;
- response lost after server commit;
- logout/rejoin while old request is in flight;
- reconnect during voting;
- reconnect during ACT5→6 handoff;
- privacy remains intact.

### PASS

No old response overwrites a newer frame; transport errors no longer become gameplay inactivity.

### STOP

Any fix requires changing gameplay Authority semantics.

---

# Package 2 — Formal-run start and explicit progression acknowledgement

**Type:** direct runtime/UI contract correction  
**Recommended owner:** CD with GA semantics  
**Risk:** medium

This package addresses the first human-trial problem: Teacher and Player should know exactly when the formal run has started and what action advances the current step.

### Teacher start

Create one unambiguous supported normal-flow start action.

Requirements:

- Teacher sees one canonical "start formal run" action, not competing initialization controls;
- start is idempotent;
- current run_id is returned and displayed;
- already-started state returns current run rather than spawning/pretending another start;
- unsupported legacy/developer start controls move to Maintenance/Developer or are removed from normal view.

### Player next-step contract

For progression-critical acknowledgements that cannot safely be inferred from "the UI rendered":

- provide an explicit ACK/action.

Example:

> **我看到了去图书馆的指示牌** / equivalent canonical bilingual text

only if progression semantically depends on Player acknowledgement.

Do not create ACK rows for every cinematic merely because it is convenient.

### Tests

- Teacher start once;
- start double-click;
- Player refresh before/after start;
- Player reconnect;
- explicit ACK retry after lost response;
- no hidden progression from mere page render.

---

# Package 3 — W05 Teacher operational-location projection

**Type:** domain-published derived read facts + existing S7 aggregation  
**Cross-map:** W05 / CA Gate B  
**Recommended owner:** CD implementation; GA semantic owner; CA challenge  
**Risk:** medium

Canonical semantic contract:

`docs/plans/W05_OPERATIONAL_LOCATION_SEMANTIC_CONTRACT_V1.0.md`

### Core rule

Location is not one universal scalar.

Keep separate:

- physical location;
- transition state;
- assignment role;
- engagement state;
- task state;
- presentation scene.

### Domain ownership

- S3B: early/per-Player location and partial ACT5→6 handoff;
- S5: shared physical location after the third-Player ACT6 entry barrier;
- S6: shared physical location after valid S6 activation;
- S6 allocations/engagements/tasks: A/B/C/WATCHER and ACT12 progress.

### Delivery boundary

Extend the **latest deployed** S7 Teacher read response with a versioned projection.

S7 may:

- authenticate Teacher;
- select the correct source domain from explicit activation milestones;
- aggregate domain-published output;
- add source identity and validity.

S7 may not:

- build its own ACT→location business switch;
- infer gate completion;
- fallback to ACTIVE `game_runs`;
- turn Station B into a physical room.

### Shadow first

No new polling RPC.

Shadow output is compared to independently specified V4 expected vectors.

### Required vectors

At minimum all 20 vectors from the W05 contract, especially:

- one/two Players entered ACT6;
- third Player opens S5 ownership;
- prepared S5 row before activation;
- S5 complete before S6 init;
- ACT11 allocation;
- A/B/C vs A/B/WATCHER;
- partial ENGAGE;
- reconnect;
- contradiction → INVARIANT_BREACH.

### Cutover

After shadow PASS:

- only Teacher operational-location/status region switches;
- old derivation is disabled for that region;
- rollback is local.

---

# Package 4 — Discussion / voting lifecycle correction

**Type:** direct owning-domain refactor  
**Cross-map:** W01 + W02-B prerequisites  
**Recommended owner:** CD; GA gameplay semantics; CA audit  
**Risk:** high

This package is the main response to the 90-second lock, add-time failure, missing vote path, stuck third Player, and stale waiting state.

## 4.1 Normal classroom pacing

In NORMAL mode:

- free discussion does not become unusable merely because a hard input timer expires;
- Teacher deliberately opens/advances vote where the script requires classroom pacing;
- timers may be displayed, but must not silently destroy the communication channel unless V4 explicitly requires it.

## 4.2 Discussion state identity

Every UI read/write binds to:

- run_id;
- discussion_session_id;
- phase_key;
- exact vote_round / interaction identity.

Old-round completion never carries to a new round.

## 4.3 Voting

- exactly one canonical vote control owner;
- missing Player remains visibly pending;
- reconnect reconstructs whether that Player already submitted;
- duplicate submission is idempotent/rejected safely;
- Clock Room/ACT7 must have an accessible canonical vote path;
- tie/revote semantics remain canonical;
- vote result presentation is unified and deterministic.

## 4.4 Add time

Teacher "Add time" acts on the currently bound Discussion identity.

If there is no applicable current Discussion:

- return NOT_APPLICABLE / explicit error;
- never appear to succeed while changing nothing.

## 4.5 UI presentation

Where approved:

- show vote result for the defined presentation interval;
- then transition to tie/revote/next state;
- do not run two competing timers that race with polling.

### Tests

- messages before/after nominal timer;
- Teacher open vote;
- three votes;
- two votes + reconnecting third;
- tie/revote;
- add time;
- stale round submit;
- same request replay;
- ACT2 / ACT5 / ACT6 / ACT7 / ACT8 / ACT9 / ACT10 / ACT11 relevant Discussion variants.

---

# Package 5 — Teacher Emergency / Recovery and override integrity

**Type:** direct Teacher-control domain  
**Recommended owner:** GA semantics + CD implementation + CA audit  
**Risk:** high  
**Not part of Observer**

Teacher must be able to deblock a run without pretending the recovery event was a real Player behavior.

## 5.1 Recovery principles

- normal UI and recovery UI are distinct;
- every recovery mutation is server-authorized;
- every recovery event records provenance;
- downstream behavior that follows an override carries upstream override provenance where required;
- no client-supplied arbitrary next scene/destination.

## 5.2 Scheme B virtual vote

For the agreed recovery case:

> Teacher may insert a virtual/current-interaction vote into the canonical vote mechanism rather than opening a separate recovery-only voting system.

But the stored/resulting evidence must identify:

- which Player slot/decision was supplied by override;
- override_id;
- source = teacher_override / recovery;
- behavior validity/scoring treatment;
- original missing Player action remains distinguishable from a genuine Player submission.

The system must never label the virtual vote as a real Player behavior event.

## 5.3 Missing network submission case

If a Player says they submitted but no canonical server record exists:

- Teacher sees "not recorded / unknown", not "Player failed";
- Teacher may use an authorized recovery action;
- recovery never backdates/fabricates a genuine Player timestamp.

## 5.4 Forced progression

Keep a bounded Teacher forced-progress mechanism for hard blockers.

Requirements:

- only allowlisted current interactions;
- server chooses safe/canonical result;
- no arbitrary client destination;
- all forced progression logged.

### Tests

- missing third vote;
- disconnected Player;
- repeated Teacher click;
- stale override after interaction already advanced;
- override + reconnect;
- audit export identifies override-derived facts.

---

# Package 6 — Player structural shell and renderer ownership

**Type:** UI structural refactor  
**Cross-map:** W02-A, W10, part of W09  
**Recommended owner:** CD  
**Risk:** medium-high

Create stable UI regions:

- Header
- Scene
- Action
- Discussion
- Pocket
- hidden Transition Overlay mount

Rules:

- one active renderer owner per region;
- no DOM ownership by two legacy/new paths;
- preserve selectors needed for regression where practical;
- no new gameplay Authority.

Initially keep domain-specific detail renderers.

### Player header

Show:

- Player identity;
- current ACT/status;
- connection/stale warning where applicable.

Do not derive current ACT from stale `game_runs` fallback.

---

# Package 7 — Pocket / Knowledge / Observation normalization and renderer

**Type:** canonical data normalization + UI adapter  
**Cross-map:** W04 + W09-B  
**Recommended owner:** CD; GA semantics  
**Risk:** medium-high

Before Pocket/Memories becomes trusted UI:

1. normalize the five legacy durable facts to exact Knowledge/Observation destinations;
2. preserve original discovery timestamps and ACT1 provenance;
3. do not substitute migration-time `now()`;
4. do not generic-merge old `s3b_player_facts` at render time.

Then migrate Pocket renderer:

- item list;
- current view;
- inspect;
- flip/open;
- share;
- received photo;
- reconnect reconstruction.

Local restore:

> same run + item still exists + requested view still permitted.

Otherwise discard local selection.

---

# Package 8 — Library puzzle and early S3B action clarity

**Type:** direct S3B/UI refactor  
**Cross-map:** W08  
**Recommended owner:** CD  
**Risk:** medium

Implement/verify:

- five-slot / wheel presentation;
- locked-prefix semantics;
- hints;
- submit;
- fallback;
- reconnect;
- explicit route/wayfinding next action;
- no hidden reliance on browser render as progress.

Any "I saw the sign" acknowledgement belongs here/Package 2 only if it is a real progression prerequisite.

---

# Package 9 — Measure before shared context extraction

**Type:** architecture decision gate  
**Cross-map:** CA Gate D  
**Implementation:** measurement first  
**Recommended owner:** CD evidence + GA/CA decision

After Packages 1–4 and W05 cutover, measure:

- Player requests per poll;
- Teacher requests per poll;
- p50/p95 latency;
- DB query work;
- frequency of same-frame cross-domain ambiguity;
- number of remaining browser runtime-owner arbitration branches;
- identity/error-contract gaps in S3B/S5/S6 detail RPCs;
- duplicate runtime/presentation interpretation shared by Player and Teacher;
- expected cutover/regression/rollback burden.

## Decision A — no shared facility

If duplicated cross-domain arbitration is now small and stable:

> keep targeted domain read adapters.

Do not create infrastructure merely because GA once proposed it.

## Decision B — minimal shared context facility

Only if measurements show net benefit for at least two real consumers.

Allowed V1 shared output:

- run_id/lifecycle;
- active runtime owner;
- presentation identity;
- exact interaction identity;
- validity.

Not allowed in generic V1:

- universal gate taxonomy;
- legal-action booleans;
- per-Player W05 location;
- Pocket details;
- Teacher-private information;
- ACT-specific gameplay rules.

If implemented, it must **replace** duplicate arbitration, not add another permanent poll.

---

# Package 10 — Teacher UI recomposition and bounded diagnostics

**Type:** UI/read recomposition  
**Cross-map:** W06 + W09-C  
**Recommended owner:** CD after W05/Discussion contracts settle  
**Risk:** medium-high

Keep one Teacher runtime with clearly separated views:

- Normal / Live Operations
- Emergency / Recovery
- Maintenance / Developer

Normal view:

- operational status;
- current interaction;
- Player progress only where semantically valid;
- no developer noise.

Recovery view:

- only currently allowed recovery controls;
- clear provenance warning;
- stale action disappears when interaction changes.

Maintenance view:

- technical diagnostics, legacy/developer controls where still required.

Local state restore only for same room/run/interaction and still-valid action.

---

# Package 11 — Security, legacy quarantine, finalization, assets/audio

**Type:** bounded direct packages; may be split for fault isolation  
**Recommended owner:** CD / VA as applicable; CA audit  
**Risk:** varies

These should not be hidden inside UI work.

## 11A. Legacy RPC quarantine

For `s1_submit_private_choice / s1_scene_choices`:

- verify final intended compatibility;
- revoke browser execution / quarantine current formal path;
- add negative privilege test;
- preserve migration/history unless separately retired.

## 11B. Effective privilege closure

Complete remaining browser-effective privilege verification for relevant functions.

## 11C. Finalization anomaly classification

Classify the 3 completed historical runs with NULL/empty integrity marker.

If CURRENT_CONTRACT_DEFECT:

- fix owning finalization logic in a separate package;
- do not patch rows merely to satisfy UI.

## 11D. Asset current-authority cleanup

- current registry owns current metadata;
- candidate copies remain version snapshots;
- remove any remaining mixed current reads;
- no need for data rewrite where deployed rows already match unless the read contract changes.

## 11E. Audio/image publication

Before integrated acceptance:

- all required formal-run assets/audio must have valid ACTIVE publication or an explicitly approved placeholder policy;
- no hidden local-only file dependency.

## 11F. Fresh-install reproducibility

Verify a clean schema/migration replay produces the expected V4 item labels and required active metadata contract, not merely that the current deployed DB happens to be normalized.

---

# Package 12 — Low-risk text/layout/local-state work

**Type:** presentation  
**Cross-map:** W09/W11  
**Recommended owner:** CD; GA wording; VA only for visual assets  
**Risk:** low

Includes:

- bilingual wording;
- remove developer jargon from Player/Teacher normal pages;
- button text;
- local overflow;
- responsive widths;
- preserve draft/focus/scroll;
- preserve Pocket expansion only when still valid.

Target widths:

- 1920×1080
- 1366×768
- ~900px

No gameplay or Authority changes.

---

# Package 13 — Scene transition overlay

**Type:** presentation only  
**Cross-map:** W12  
**Recommended owner:** CD  
**Risk:** low-to-medium

Only after stable scene identity is available.

Behavior:

```text
confirmed canonical scene identity changes
→ overlay
→ 2 seconds
→ current scene
```

Copy:

**你正进入下一个场景**  
**Je gaat nu naar de volgende scène.**

Never:

- persist overlay state;
- restore it after reconnect;
- trigger on first render;
- trigger on same-scene poll;
- drive gameplay progression.

---

# Package 14 — Integrated regression, freeze, human acceptance

**Type:** final validation  
**Cross-map:** I0 + W13  
**Recommended owner:** CD evidence; CA independent audit; GA gameplay review; Teacher human acceptance

## 14.1 Deterministic regression

Must cover:

- ACT1→ACT14;
- formal start;
- ACT5→6 partial-entry barrier;
- generic/S5/S6 Discussion;
- all voting/revote paths;
- lost response + idempotent retry;
- reconnect;
- Teacher Recovery;
- W05 operational location;
- ACT11 allocation;
- ACT12 ENGAGE;
- Pocket inspect/flip/share;
- Library;
- stale/out-of-order polling;
- intermittent fetch failure;
- legacy RPC negative privilege;
- asset/audio loads;
- finalization/export;
- no duplicate renderer owners;
- privacy.

## 14.2 Performance evidence

Record:

- requests per poll;
- p95 read latency;
- major DB query work;
- browser error count;
- retry/error rates.

Compare against pre-fix baseline.

## 14.3 Freeze

Freeze exact SHA only after deterministic PASS.

## 14.4 Human acceptance

Run the real three-Player + Teacher scenario.

Teacher is allowed to:

- observe all Players;
- record problems;
- use approved Emergency/Recovery tools;
- continue past a hard blocker where the explicit test protocol allows it.

Every forced recovery remains recorded.

## 14.5 Final closure

After human acceptance:

- CA targeted audit;
- fix only evidenced residuals;
- freeze successor release;
- then E2/blind-agent testing.

---

# 7. Recommended package order at a glance

```text
P0 evidence freeze
 ↓
P1 polling/transport correctness
 ↓
P2 formal start + explicit ACK semantics
 ↓
P3 W05 S7 shadow → single-region cutover
 ↓
P4 Discussion/voting lifecycle
 ↓
P5 Teacher Recovery / Override
 ↓
P6 Player structural shell
 ↓
P7 Pocket/Knowledge normalization
 ↓
P8 Library/early-action clarity
 ↓
P9 MEASURE shared-context economics
      ├─ no benefit → keep local adapters
      └─ benefit → minimal shared context only
 ↓
P10 Teacher recomposition
 ↓
P11 security/finalization/assets bounded closures
 ↓
P12 text/layout/local state
 ↓
P13 transition overlay
 ↓
P14 integrated regression → freeze → human acceptance
```

Some P11 subpackages may occur earlier if they become prerequisites, but they remain separately scoped.

---

# 8. Parallelism rules

Parallel work is allowed only where files/semantic domains do not create correlated failures.

Avoid:

- two agents editing `src/game/app.js` concurrently;
- Teacher UI recomposition while W05/Recovery contracts are changing;
- Pocket migration while canonical Knowledge normalization is unsettled;
- asset publication and unrelated runtime migrations in the same release package;
- shared-context extraction while polling baseline is still changing.

Safe parallel examples:

- VA asset preparation while CD works on client polling;
- ISA test-harness preparation without canonical runtime writes;
- CA independent test-vector construction while CD implements a bounded package.

---

# 9. Package evidence standard

Every implementation package must return:

1. exact branch + before/after SHA;
2. changed files/functions;
3. migration name if any;
4. explicit Authority facts read/written;
5. tests run;
6. raw failures and passes;
7. browser/network error summary;
8. rollback point;
9. known residuals;
10. next-owner recommendation.

No package may claim "fixed" based only on code inspection.

---

# 10. Mandatory STOP conditions for the whole program

Stop and return to design/audit if any package requires:

- a second persisted universal gameplay state;
- unexplained dual writes;
- ACTIVE `game_runs` fallback;
- browser-only security filtering of Teacher/private data;
- invented Player behavior to satisfy missing data;
- "latest event wins" current-state inference;
- a recovery action that cannot identify override provenance;
- a shared context layer that merely adds polling instead of replacing duplicate arbitration;
- S7 accumulating ACT-specific business rules;
- modification of historical rows solely to make a new UI appear consistent.

---

# 11. Agent review questions

Other agents reviewing this proposal should specifically challenge:

## CA

- Are any package boundaries too broad for independent audit?
- Does Recovery preserve behavioral validity/provenance?
- Does W05 still hide cross-domain gameplay inference?
- Are PASS/STOP criteria falsifiable?

## CD

- Are any package costs understated?
- Which functions are actually repository-last / deployed-last?
- Can P1/P3/P4 be implemented without widening schema/runtime surface?
- Which order minimizes rework in `app.js` and Teacher console?
- Is P9 shared-context decision likely to be unnecessary after local fixes?

## ISA

- Which packages can be independently test-harnessed without becoming an implementation authority?
- Which race/reconnect cases can be automated before CD work begins?

## VA

- Which asset/audio gaps remain true runtime blockers?
- Which are already published/approved and should not appear as open work?

---

# 12. GA recommendation for the first implementation release

If this proposal survives review, GA's current recommendation is:

> **First implementation authorization should be Package 1 only: client polling / transport correctness.**

Reason:

- defects are already evidenced;
- it changes no gameplay Authority;
- it improves every subsequent manual/debug run;
- it is valuable whether or not any later shared-context facility is built;
- rollback is bounded.

After P1 evidence returns, the next preferred release is:

> **Package 3 W05 shadow projection**, after the exact deployed S7 definition is reconfirmed.

P2 may be moved ahead of P3 if the current formal-start defect is confirmed in the exact deployed UI/runtime and can be fixed as an equally bounded package.

---

# 13. Status of this document

This file is intentionally named **Proposal of Debug Implementation Plan V1 by GA**.

It is not:
- a CA-approved plan;
- a CD work order;
- an ISA task allocation;
- a VA request;
- an implementation release.

It is the consolidated GA proposal to be challenged and modified before authorization.
