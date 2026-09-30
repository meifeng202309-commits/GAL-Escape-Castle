# GAL Escape Castle — E2-A Blind Playability Test Protocol V0.2

Status: **DRAFT FOR CA CRITICAL REVIEW — NOT YET EXECUTED**  
Supersedes: V0.1  
Owner: GA / Teacher for test control  
Independent audit owner: CA  
Technical support: CD  
Purpose: first-round development-blind playability acceptance before stricter E2-B mutual-isolation testing

## 0. Scope and current technical baseline

Structural remediation debugging is technically closed at Level2:

- Level2: **PASS**
- E1-tested runtime implementation: `97f5ed362c58defb45edf19c18319417cb70b93f`
- integrated evidence baseline: `891feffe558a4683ac3da67e1e6b15e902c7e592`
- deployed Supabase project: `qdcbdcjobzytzhnhfwyn`
- deployed migrations: `001–068`
- deterministic E1: PASS
- structural findings `IDA-001..006` and `PFC-001..008`: CLOSED at Level2
- remaining acceptance boundaries include blind/staggered human-like playability, media/audio perception, responsive/readability behavior, and explicit external media state.

E2-A is therefore an **acceptance/discovery test**, not a continuation of the structural debugging package.

A new defect found in E2-A may reopen a bounded CD debugging task, but CD must not modify the running deployment during the E2-A session.

---

# 1. Critical conclusions about the proposed design

## 1.1 One new project-only Project is adequate for E2-A's limited purpose, but not for strict player-to-player independence

E2-A's primary question is:

> Can three development-blind first-time players, using only the rendered product, naturally progress through the game?

For this limited question, one entirely new Project with project-only memory and three Player chats is acceptable **provided the limitations are explicit**.

It does NOT prove strict mutual cognitive isolation because chats inside one Project may share project-level context/memory behavior. Therefore:

- E2-A may support a **development-blind playability** claim;
- E2-A must not support a **strict independent-player** claim;
- any suspected cross-chat contamination automatically triggers E2-B if the product is otherwise playable;
- E2-B should use three separate project-only Projects, one per Player.

## 1.2 GA is an appropriate Teacher/Test Controller, with a frozen non-coaching protocol

GA is preferable to CA as the live Teacher because:
- CA must preserve post-test audit independence;
- GA understands the Teacher Console and canonical product intent;
- GA can distinguish normal Teacher operations from prohibited ad hoc manipulation.

Risk:
- GA knows the intended game and can accidentally coach or over-interpret.

Control:
- GA may operate the Teacher UI and record evidence;
- GA may not give route, puzzle, waiting, vote, or expected-state hints to Players;
- GA's interpretations are provisional only;
- CA independently classifies evidence after the run.

## 1.3 Formal recovery tools have different scopes; none is a universal force-advance

Source review shows three distinct recovery/control families in the current Teacher surface. They must not be conflated.

### A. Legacy prototype advance

`Advance legacy scene` → `s1_advance_scene`

The Teacher page explicitly labels this as regression support only and states that it does **not** operate the formal ACT1–14 run. It is prohibited as an E2 formal-game recovery mechanism.

### B. Emergency canonical-flow recovery

The Teacher page also exposes:
- `Recover ACT 1–5 flow` → `s3b_initialize_flow`
- `Recover ACT 6–8 flow` → `s5_initialize`
- `Recover ACT 9–13 flow` → `s6_initialize`

These are valid formal recovery tools, but they are **runtime-group initializers**, not arbitrary scene-skipping controls.

Current server preconditions confirm this:
- `s5_initialize` requires completed ACT1–5 and refuses an already-initialized Sprint5 runtime;
- `s6_initialize` requires verified ACT6–8 completion before creating ACT9 state.

Therefore these buttons may recover a failed automatic cross-runtime initialization/handoff, but they cannot generally force a blocked interaction inside ACT6, ACT7, ACT9, ACT10, ACT11, ACT12, etc.

### C. Advanced / Emergency Override

The current `teacher_apply_override` / projected `allowed_actions` covers specific formal-flow interactions only in ACT1–5.

Current projected coverage includes:

`SKIP_CURRENT_INTERACTION`
- ACT1 `act1_wake_up / private_first_action`
- ACT2 `act2_first_contact / private_first_meeting`
- ACT2 `act2_route_update / route_update`
- ACT2 `act2_rendezvous / route_consequence`
- ACT3 `act3_library / wayfinding`
- ACT4 `act4_known_unknown / private_route_choice`

`RESOLVE_AND_CONTINUE`
- ACT2 `act2_first_contact / meeting_discussion`
- ACT3 `act3_library / library_box`
- ACT5 `act5_route_discussion / discussion`
- ACT5 `act5_inspect_first / post_inspection_route`

Later migrations 055–057 refine provenance/validity but do not extend the override surface to ACT6–14.

Teacher discussion controls such as `Open vote now` or `Add 30 seconds` are separate controls. They are not a general substitute for Emergency Override.

**Consequence:** an ACT6–14 hard blocker may still be unrecoverable if it is not a failed runtime-group initialization and no normal Teacher discussion control can resolve it. E2-A must therefore distinguish **acceptance status** from **diagnostic continuation** rather than assuming either universal recoverability or immediate abort.

---

# 2. E2-A test architecture

## 2.1 Roles

- **Trial-G** → Gitte / GAL-A
- **Trial-A** → Anna / GAL-B
- **Trial-L** → Linda / GAL-C
- **GA** → Teacher / Test Controller
- **CD** → technical support, read-only during active run
- **CA** → post-test independent auditor, not present as Player/Teacher

## 2.2 Required browser/session isolation

Each role must use a distinct browser storage context/profile:

- Teacher Context
- Gitte Context
- Anna Context
- Linda Context

The three Players must not share:
- cookies;
- localStorage;
- sessionStorage;
- browser profile state.

If the ChatGPT/browser tooling cannot guarantee separate storage contexts, the test must use separate browser profiles or an external browser runner that can.

## 2.3 Chat/project isolation

E2-A Project:
- brand new;
- project-only memory;
- no development files;
- no repository connector content exposed to Player chats;
- no prior GAL conversation copied into the Project;
- no project instructions containing routes, bugs, ACT structure, expected states, or acceptance criteria.

Three Player chats are created fresh.

GA Teacher control remains outside the Player chats.

---

# 3. Exact Player entry package

Each Player receives only:

1. game URL;
2. assigned display identity: Gitte / Anna / Linda;
3. room code;
4. role-specific join code;
5. one browser/session rule: use only the assigned browser context and do not open another Player's session;
6. one behavioral instruction: use only information visible in the game and try to play naturally;
7. one reporting instruction: if the interface is unclear or appears stuck, report exactly what is visible and what you already tried.

Do NOT tell Players:
- number of ACTs;
- intended route;
- puzzle answers;
- what should happen next;
- known defects;
- known waiting points;
- expected media/placeholders;
- remediation history;
- test acceptance criteria;
- availability/coverage of Emergency Override;
- other Players' progress unless the game itself reveals it.

Players may communicate with each other only through communication mechanisms exposed by the game.

---

# 4. Frozen Player prompts

## 4.1 Trial-G prompt

You are playing a multiplayer web game for the first time as **Gitte**.

Use only what the game page itself shows you. Do not inspect source code, Developer Tools, network requests, databases, repository files, test documents, or outside instructions. Do not search for answers.

Act as a normal first-time player. Read the page, make choices that seem reasonable to you, and use only controls that are visible to you.

Do not ask the Teacher or another Player what is "supposed" to happen. Communicate with other Players only through communication features provided by the game.

If you are uncertain, choose naturally. If you cannot determine a reasonable next action, or an action appears to do nothing, report:
- what you currently see;
- what you last did;
- why you are unsure or think you may be stuck.

Do not infer hidden expected behavior.

Your room code and Gitte join code will be supplied separately.

## 4.2 Trial-A prompt

Same as Trial-G, with identity **Anna** and Anna's join code.

## 4.3 Trial-L prompt

Same as Trial-G, with identity **Linda** and Linda's join code.

---

# 5. Frozen GA Teacher/Test Controller prompt

You are the E2-A Teacher/Test Controller.

Your job is to operate the real Teacher Console, preserve blindness, and collect evidence. You are not a game coach.

You may:
- create/start/watch the room;
- observe Teacher-visible runtime state;
- record timestamps and screenshots;
- refresh Teacher state;
- use normal Teacher controls that are part of the canonical runtime;
- apply an Emergency Override only when this protocol's intervention threshold is met and the current Teacher Console explicitly offers an allowed action.

You must not:
- tell a Player what choice to make;
- explain the intended route/puzzle;
- tell a Player that a wait/transition "should" happen;
- reveal another Player's private state;
- use legacy controls as a substitute for formal gameplay;
- use Developer/DB actions to mutate the live run;
- ask CD to silently patch/redeploy during the running session.

When a problem occurs, preserve evidence first. Classify provisionally using the E2-A blocker taxonomy. CA makes the final audit classification.

---

# 6. Frozen CD technical-support prompt

You are technical support for E2-A, not a Player and not a live debugger with mutation authority during the session.

Before the run:
- identify the exact deployed frontend/runtime build;
- confirm database migration state;
- confirm Supabase project identity;
- confirm Player and Teacher URLs are reachable;
- report current asset publication/placeholder state;
- help establish separate browser contexts.

During the run:
- do not communicate with Players;
- do not reveal expected routes, expected states, known defects, or puzzle answers to GA unless needed to answer a narrowly technical environment question;
- do not patch code, deploy migrations, alter assets, or mutate game state;
- read-only diagnosis is permitted if GA pauses for technical observation.

After a blocker:
- provide factual environment/runtime evidence to GA;
- wait for GA/CA disposition before any code change.

---

# 7. Pre-test build/deployment freeze

Before inviting Players, GA records one E2-A Test Identity block:

- E2-A test ID;
- wall-clock start time/timezone;
- repository branch;
- exact served frontend/runtime SHA;
- expected E1-tested runtime reference `97f5ed362c58defb45edf19c18319417cb70b93f`;
- integrated evidence reference `891feffe558a4683ac3da67e1e6b15e902c7e592`;
- Supabase project `qdcbdcjobzytzhnhfwyn`;
- deployed migration maximum, expected `068`;
- current asset publication snapshot;
- browser family/version;
- device/viewport assumptions;
- Teacher URL and Player URL;
- confirmation that no deployment change is permitted until the E2-A run ends/aborts.

If the actual served frontend differs from the intended Level2-closed runtime, stop before blind Players join and resolve the identity mismatch.

---

# 8. Media state declaration before test

E2-A must not misclassify intentional placeholder-first behavior as an unknown defect.

GA records, for post-test CA only—not in Player prompts:

- repository validator: 24 approved + 4 explicit placeholders at frozen E1 evidence;
- explicit placeholders: `opening.gitte_room`, `opening.anna_room`, `opening.linda_study`, `ending.castle_exterior`;
- `shared.main_gate` Teacher-approved v002 but live ACTIVE publication was NOT VERIFIED at Level2; E1 validated governed placeholder-first Main Gate presentation.

Players are not told which assets are placeholders. Their spontaneous reactions are evidence.

---

# 9. Emergency Override readiness precheck

Do not test override mutability in the actual blind room.

Create one sacrificial **AUDIT-mode** precheck room.

Minimum precheck:

1. Teacher Console loads.
2. Teacher authentication succeeds.
3. three disposable player sessions join;
4. formal AUDIT run starts;
5. Teacher state projects an ACT1 allowed override;
6. apply exactly one `SKIP_CURRENT_INTERACTION` with reason:
   `E2-A PRECHECK — sacrificial room only`;
7. verify:
   - UI reports success;
   - override history records action/source/reason;
   - run advances consistently;
8. discard the room.

This proves deployed authentication/projection/application/logging for at least one covered override path.

It does NOT prove universal recovery coverage. Source review already establishes that ACT6–14 has no general `teacher_apply_override` path.

---

# 10. Operational blocker taxonomy

Use six categories.

## N0 — NORMAL_WAIT

The game clearly indicates waiting/countdown/peer dependency and state is progressing normally.

No defect.

## P1 — PLAYER_CONFUSION

A valid visible path exists, but the Player does not understand it.

GA does not coach. Record the confusion and allow the Player to continue reasoning.

## U1 — UI_AMBIGUITY

A valid system path probably exists, but the rendered UI does not clearly communicate the next action/waiting condition.

This is evidence even if the Player eventually recovers.

## S1 — SOFT_BLOCKER

Progression resumes only after an abnormal but non-authoritative recovery such as one normal refresh/reconnect or unexpected extended delay.

Record as a defect candidate.

## H1 — HARD_BLOCKER_RECOVERABLE

Natural progression is impossible, but the current formal Teacher Console explicitly offers an authorized recovery action.

Natural-playability acceptance has already failed for that run. The run may continue diagnostically after one recorded intervention.

## H2 — HARD_BLOCKER_UNRECOVERABLE

Natural progression is impossible and no authorized Teacher recovery can restore the formal run.

Abort the run after evidence capture.

## I1 — TEST_INFRA_FAILURE

The failure is attributable to browser/network/deployment/test infrastructure rather than gameplay, with evidence.

May justify one clean restart after infrastructure is corrected.

---

# 11. Intervention threshold

Intervention is state-based, not one universal timeout.

## 11.1 If UI shows a countdown

Wait through the displayed countdown plus a short synchronization grace period.

Do not intervene merely because one Player is slower.

## 11.2 If UI explicitly says waiting for peers

Do not intervene while any peer is still legitimately incomplete.

After the last required peer completes, allow at least two normal polling cycles plus a short grace period. If the waiting state persists with all prerequisites visibly satisfied, investigate.

## 11.3 Ordinary click/submit action

If the action produces no visible acknowledgement:
- wait at least two normal poll cycles;
- Player may make one ordinary UI-level retry only if the control remains visibly actionable and the retry cannot create a duplicate semantic action;
- otherwise record the state and treat as possible U1/S1.

## 11.4 Confusion without technical deadlock

GA does not coach.

A Player may continue reading/scrolling/using visible controls for as long as they are actively making reasonable progress.

Confusion itself is data.

## 11.5 Hard-blocker determination

A hard blocker requires all of:
- no reasonable visible player action can advance;
- required peers are not legitimately pending;
- expected countdown/deadline has expired if applicable;
- one normal refresh/reconnect, when safe and relevant, does not restore the authoritative state;
- Teacher state confirms no normal progression is occurring.

Only then may GA consider an override.

---

# 12. Recovery / override policy

## 12.1 Acceptance semantics

A naturally successful E2-A run requires **zero gameplay overrides**.

If an override is used:
- natural playability for that run is FAIL;
- the run may continue only to obtain additional diagnostic coverage.

## 12.2 First hard blocker — acceptance stops, diagnostic discovery may continue

At the first genuine hard blocker:

1. capture evidence;
2. mark natural E2-A playability for this run as **FAIL**;
3. change the run's purpose from acceptance to **DIAGNOSTIC CONTINUATION**;
4. use the minimum valid recovery mechanism available;
5. capture the exact post-intervention state.

Mark the timeline boundary:

`NATURAL_ACCEPTANCE_ENDED — DIAGNOSTIC_CONTINUATION_BEGAN`

All later observations remain useful defect-discovery evidence, but they no longer prove natural end-to-end playability.

## 12.3 No fixed "second blocker = abort" rule

The previous V0.1 two-blocker abort rule is removed.

Multiple forced continuations may be worthwhile because repeated failures can reveal:
- the same lifecycle/transition pattern in different ACTs;
- recurrent waiting/lock defects;
- systematic renderer/state divergence;
- common recovery failures.

Continuation is governed by **evidence interpretability**, not by a fixed blocker count.

Continue diagnostically while each intervention lands the run in a coherent, canonical-valid state whose subsequent observations remain interpretable.

Abort only when the interpretability conditions in §14 are no longer satisfied.

## 12.4 Recovery ladder

Use the least invasive available mechanism, in this order:

### R0 — natural progression
Visible Player actions / legitimate waiting.

### R1 — ordinary non-mutating recovery
One normal refresh/reconnect where relevant.

### R2 — normal Teacher control
For example an already-authorized discussion control such as add-time/open-vote, only when appropriate for the current formal discussion state.

### R3 — canonical-flow recovery
Use `Recover ACT 1–5 / ACT 6–8 / ACT 9–13 flow` only when evidence shows a failed automatic runtime-group initialization and the server preconditions are genuinely satisfied.

Do not use these initializers as arbitrary scene skips.

### R4 — Emergency Override
Use only an action projected by `allowed_actions`; preserve the reason/history/invalidated scope.

### R5 — controlled technical diagnostic continuation
If no existing formal Teacher recovery applies, E2-A may continue only through a **predefined, evidence-preserving technical continuation procedure** approved for diagnostic use.

This must not be an ad hoc database edit.

At minimum it must:
- identify the exact canonical target state;
- record the full pre-state;
- record the exact RPC/tool and synthetic values used;
- preserve the intervention as non-player / non-behavior evidence;
- mark downstream observations as post-forced-continuation;
- verify all three clients converge on one authoritative state before play resumes.

If no such controlled procedure exists for the blocker, the current run cannot be safely forced past it.


---

# 13. Override failure protocol

If GA decides a forced continuation is justified but:
- no applicable formal recovery is available;
- a recovery action is rejected;
- Teacher Console is broken;
- recovery succeeds syntactically but progression remains blocked;
- clients do not converge on one authoritative post-recovery state;

then:

1. capture Player and Teacher screenshots/state;
2. record room/run/scene/phase/action/reason/error;
3. one Teacher Console refresh is permitted;
4. one Player reconnect is permitted only if relevant and does not destroy evidence;
5. CD may perform **read-only** diagnosis;
6. no deployment/source/DB mutation during the run;
7. if an approved controlled technical continuation exists, GA may invoke it and explicitly switch to post-forced diagnostic evidence;
8. otherwise classify H2 and stop this run at that point.

The run record must distinguish:

- `ACCEPTANCE_FAIL_CONTINUED_FOR_DIAGNOSTICS`
- `ABORTED — NO INTERPRETABLE RECOVERY PATH`

Neither may ever be counted as an incomplete PASS attempt.

---

# 14. Continue / pause / abort / restart rules

## Continue naturally

When:
- players have a valid visible path;
- waiting is legitimate;
- non-blocking media issue does not prevent action.

## Continue after recorded override

Only after the first H1 blocker, for diagnostic coverage.

The run is no longer eligible for natural E2-A PASS.

## Pause for observation

Allowed briefly when:
- GA must capture evidence;
- CD needs read-only environment diagnosis;
- no state mutation is performed.

## Abort current run

Required when:
- no available recovery can land the run in a known coherent canonical state;
- the next proposed intervention would require ad hoc/unknown database mutation;
- a recovery itself corrupts/strands the state;
- Players no longer share one coherent authoritative run;
- intervention side effects make later observations causally uninterpretable;
- deployment identity changes during the session;
- evidence integrity is lost.

The number of prior blockers alone is **not** an abort criterion.

## Restart with fresh room

Allowed when:
- failure is I1 infrastructure;
- or a fixed deployment is later released through normal governance after an aborted run.

Do not restart repeatedly on the same unchanged build merely to seek a lucky pass.

## Terminate E2-A and return defects to CD

Required when:
- reproducible gameplay hard blocker exists;
- early blocker prevents meaningful later coverage and cannot be safely bypassed;
- repeated UI ambiguity makes the session non-actionable;
- browser/runtime state divergence cannot be recovered.

---

# 15. Data-contamination / communication controls

## Players

May:
- interact with the game;
- describe their own visible screen in their own chat.

May not:
- read another Player chat;
- read Teacher/CD/CA materials;
- search the repository/web for answers;
- receive direct hints from GA/CD.

## GA

May tell a Player only:
- logistics such as "use the assigned browser";
- "continue using the game page";
- "please describe what you currently see" when evidence is needed.

GA may not tell:
- what to click;
- what answer is correct;
- whether a wait is expected;
- where the group should go;
- what another Player privately did.

## CD

Communicates only with GA during the run.

No Player contact.

## Same-project risk

Because E2-A Players share one project-only Project, any sign that one Player possesses information not obtained from its own game UI or in-game communication must be recorded as:

`POSSIBLE_CROSS_CHAT_CONTAMINATION`

Such a run cannot support strict independence and strengthens the need for E2-B.

---

# 16. Evidence protocol

GA maintains one lightweight Master Timeline.

Minimum issue/event fields:

- timestamp;
- test ID;
- room code;
- run ID;
- role;
- visible page/state;
- last player action;
- observed result;
- other-player wait/progress summary if Teacher-visible;
- provisional blocker class;
- screenshot/evidence reference if issue;
- intervention, if any;
- post-intervention result.

Do not screenshot every click.

Mandatory screenshots/evidence:
- test start identity;
- first occurrence of each defect/confusion class;
- pre-override state;
- override result/failure;
- abort state;
- ACT14 completion if reached;
- completed-run reconnect if reached.

Preserve:
- raw Player chat transcripts;
- Teacher intervention/override history;
- final session export if available;
- browser console/network evidence only when relevant;
- CD read-only diagnosis notes if used.

---

# 17. End-of-run evidence package to CA

GA sends CA:

1. E2-A Test Identity block;
2. three raw Player transcripts;
3. Master Timeline;
4. issue screenshots;
5. Teacher intervention log;
6. override history;
7. exact tested deployment/runtime identity;
8. asset-state snapshot;
9. final session export, if available;
10. abort record, if applicable;
11. CD read-only support notes, if any;
12. explicit list of:
    - naturally completed behaviors;
    - overridden behaviors;
    - unresolved defects;
    - NOT VERIFIED areas;
    - possible contamination.

CA independently determines PASS / FAIL / BLOCKED / NOT VERIFIED.

GA does not issue the final audit verdict.

---

# 18. E2-A → E2-B decision

Proceed to E2-B when either:

## Case A — E2-A naturally completes

All three Players reach ACT14 with:
- zero gameplay overrides;
- no hard blockers;
- no CD mutation/intervention;
- acceptable evidence integrity.

Then E2-B tests strict player-to-player isolation and natural asynchronous behavior using three separate project-only Projects.

## Case B — E2-A completes but contamination is suspected

E2-B is mandatory.

## Case C — E2-A has only non-blocking UX/media observations

E2-B may proceed while findings are carried forward, unless CA classifies one as a release blocker.

Do NOT proceed to E2-B when:
- E2-A natural acceptance hits a reproducible hard gameplay blocker, even if the same run is later forced forward for diagnostic discovery;
- the run requires any forced progression to reach later ACTs;
- deployment identity is invalid;
- infrastructure failure prevents meaningful play.

In those cases return the bounded defect to CD first.

---

# 19. E2-A natural-success criterion

For the limited E2-A playability claim, the desired outcome is:

> Three development-blind Players can enter, understand enough from the product UI to act without coaching, remain synchronized under natural timing, and reach the canonical ending with no gameplay override or live technical mutation.

This is deliberately stronger than deterministic E1 but weaker than E2-B's strict mutual-isolation claim.

