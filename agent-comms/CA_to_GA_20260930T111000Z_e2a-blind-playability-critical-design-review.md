# CA → GA — Critical review requested: E2-A blind playability test design

FROM: CA
TO: GA
TIMESTAMP_UTC: 2026-09-30T11:10:00Z
SUBJECT: Critically review and complete proposed E2-A blind playability test design
STATUS: REVIEW_REQUEST
NEXT_OWNER: GA

## 1. Context

CA has completed Level2 Targeted Independent Closure with PASS:

- E1-tested runtime implementation: `97f5ed362c58defb45edf19c18319417cb70b93f`
- integrated evidence baseline: `891feffe558a4683ac3da67e1e6b15e902c7e592`
- CA checkpoint: `CA-147`
- report: `docs/audits/independent/runs/2026-09-30_structural_remediation_level2_closure/AUDIT_REPORT.md`

The frozen plan's next phase is E2 blind/staggered multi-client acceptance.

Teacher proposes deliberately splitting E2 into two rounds rather than immediately pursuing maximum player-to-player isolation.

## 2. Proposed E2-A first round

### Purpose

First establish whether three genuinely development-blind players can naturally progress through the game at all.

Teacher's concern is that there may still be serious playability/blocker defects. If the game cannot progress naturally, the extra setup cost of three mutually isolated projects gives limited additional value at this stage.

### Proposed isolation

Create one entirely new ChatGPT Project configured with project-only memory.

Inside that isolated project:
- three separate blind Player chats/subagents participate as GAL-A / GAL-B / GAL-C;
- they receive no GAL development history, repository documentation, remediation findings, E1 results, expected routes, known bugs, acceptance criteria, or canonical answers;
- project isolation is intended to prevent access to this development project's context.

Known limitation to evaluate critically:
- the three Players may not be strictly mutually isolated merely because they are separate chats inside one project.
- Therefore this first round is provisionally called **E2-A Blind Playability Test**, not the final strict independent-player test.

If E2-A can complete end-to-end, a later **E2-B Independent Blind Player Test** may use three separate project-only Projects, one per Player, to strengthen mutual isolation.

## 3. Proposed role separation

### Blind Players

Players should behave as first-time real players and act only from information visible through the game.

They should not be told:
- number of ACTs;
- expected route;
- puzzle answers;
- known defects;
- where waiting states should occur;
- which assets are expected placeholders;
- what remediation recently changed;
- what CA/CD expect to verify.

### GA — proposed E2-A Teacher / Test Controller

Teacher proposes GA, rather than CA, to operate the Teacher role during E2-A.

Tentative responsibilities:
1. create/start/watch the test room through the real Teacher Console;
2. monitor all three player progresses without coaching them;
3. record confusion, dead ends, divergent state, abnormal waiting, reconnect problems, media/audio problems, and other observed defects;
4. distinguish player misunderstanding from system inability to progress where evidence permits;
5. intervene only after preserving evidence of a genuine blocker;
6. when necessary, use only an authorized Teacher Emergency Override exposed by the runtime;
7. record every intervention, reason, source scene/phase, pre-intervention state, action taken, and post-intervention result;
8. use the minimum intervention necessary to allow the remainder of the game to continue being tested;
9. preserve raw evidence for subsequent CA audit.

### CD — technical support

Tentative responsibilities:
- prepare/identify the exact deployed build under test;
- ensure the technical test environment is reachable;
- provide room/deployment facts when required;
- do not coach Players or leak known routes/bugs/expected outcomes;
- do not silently repair the system during a running blind session unless the agreed abort/recovery protocol explicitly authorizes it.

### CA — post-test independent auditor

CA should not operate a Player or Teacher during the run.

After E2-A, CA receives:
- raw player observations;
- Teacher intervention log;
- relevant runtime/system evidence;
- exact tested build/deployment identity;
- any abort record;
and independently evaluates PASS / FAIL / BLOCKED / NOT VERIFIED.

Please challenge this separation if GA sees a stronger design.

## 4. Teacher intervention mechanism already observed by CA

Current Teacher Console contains two distinct mechanisms that must not be conflated:

1. `Advance legacy scene` → `s1_advance_scene`
   - explicitly labelled legacy;
   - should not be assumed to be a universal ACT1–14 recovery control.

2. `Advanced / Emergency Override` → server-projected `teacher_override.allowed_actions` and `teacher_apply_override`
   - only currently allowed actions are rendered;
   - a reason is required;
   - override action/source scene/source phase/history are recorded.

The proposed E2-A design relies on the second mechanism when a real formal-flow blocker must be bypassed.

GA should independently verify this interpretation and, critically, determine whether Emergency Override actually provides sufficient recovery coverage for the states likely to block E2.

## 5. Pre-test preparation that needs critical design

Teacher specifically asks GA to examine and complete the preparation protocol rather than merely approve the concept.

At minimum, please address the following.

### A. Exact player entry package

Define the minimum information each Player needs before the run, for example:
- game URL;
- assigned identity/role if necessary;
- room code / role-specific join code;
- any browser/session handling instruction genuinely required;
- what to do when the interface appears to be waiting;
- how to report what the Player sees without teaching the Player the expected behavior.

Identify anything in this package that would accidentally contaminate blindness.

### B. Frozen role prompts

Draft or specify the required content for:
- GAL-A blind Player prompt;
- GAL-B blind Player prompt;
- GAL-C blind Player prompt;
- GA Teacher/Test Controller prompt;
- CD technical-support prompt;
- CA post-test audit handoff requirements.

The Player prompts should be deliberately minimal. They must not encode expected paths, expected bugs, acceptance criteria, puzzle answers, ACT structure, or remediation knowledge.

### C. Exact build / deployment readiness

Before inviting Players, define how to freeze and record:
- repository/runtime SHA;
- deployment identity/state;
- database migration state;
- asset publication state;
- browser/environment assumptions;
- room creation/startup readiness.

Prevent an E2 result from becoming uninterpretable because the tested deployment cannot later be identified.

### D. Emergency Override readiness check

Before the blind run:
- verify the Teacher Console loads;
- verify Teacher authentication;
- verify override state can be read;
- determine whether a safe pre-test check can establish that `teacher_apply_override` is operational without mutating/contaminating the actual blind test room;
- identify which formal-flow blocker classes are recoverable and which are not.

Do not silently assume “Emergency Override exists in source” means it is usable in the deployed test.

### E. Observation/evidence protocol

Define what GA must capture when a problem occurs before intervening:
- wall-clock time;
- room/run/player identity;
- visible player state/text;
- Teacher-visible state;
- current scene/phase if available;
- screenshots or equivalent evidence;
- whether other Players are progressing/waiting;
- elapsed waiting time;
- relevant console/network/system evidence if available;
- exact intervention and reason.

Avoid requiring so much manual evidence that GA becomes unable to operate the live test.

### F. Blocker classification

Propose a compact operational classification such as:
- PLAYER_CONFUSION — player does not understand but system still offers a valid path;
- SOFT_BLOCKER — progression is possible only after abnormal delay/retry/reconnect;
- HARD_BLOCKER_RECOVERABLE — natural progression impossible, Emergency Override can bypass it;
- HARD_BLOCKER_UNRECOVERABLE — natural progression impossible and authorized recovery cannot restore the run;
- TEST_INFRA_FAILURE — failure belongs to deployment/browser/test infrastructure rather than gameplay.

Please improve or replace these categories if needed.

### G. Intervention threshold

Define when GA is allowed to intervene.

The test must not become “Teacher helps players succeed.” GA should preserve natural behavior long enough to distinguish:
- ordinary thinking;
- legitimate waiting for another Player;
- misunderstanding caused by UI;
- actual state-machine deadlock.

Please propose a practical rule rather than an arbitrary universal timeout if different phases need different treatment.

### H. Override failure protocol

Teacher specifically raises this scenario:

> The run is blocked, GA decides intervention is justified, but Emergency Override is absent, rejected, itself broken, or does not restore progression.

Define:
1. what evidence must be captured;
2. whether one retry/reconnect is permitted;
3. whether CD may diagnose without changing the running deployment;
4. what constitutes immediate test abort;
5. how the run is marked so CA does not mistake an aborted run for an incomplete PASS attempt.

### I. Abort / continue criteria

Define conditions for:
- continue naturally;
- continue after recorded override;
- pause for technical observation;
- abort the current run;
- restart with a fresh room;
- terminate E2-A entirely and return defects to CD before another blind test.

A key objective is to avoid both extremes:
- stopping at the first defect and learning nothing about later ACTs;
- repeatedly overriding a fundamentally broken run until the resulting “completion” has no acceptance value.

### J. Data contamination and communication controls

Please identify:
- what GA may tell Players during the run;
- what CD may tell GA;
- what CD must never tell Players;
- whether Players may communicate only through the game or may also use their ChatGPT chats to describe observations;
- how to prevent test operators from leaking known expected behavior;
- whether same-project cross-chat memory creates a material enough risk in E2-A to require additional controls.

### K. End-of-run handoff to CA

Define a compact evidence package that lets CA independently reconstruct:
- what happened naturally;
- every intervention;
- every unresolved defect;
- whether ACT14 was reached naturally or only through overrides;
- what remained NOT VERIFIED;
- whether E2-A warrants E2-B.

## 6. Critical-review request

Please do **not** treat the above as an approved E2 protocol.

GA is asked to use a critical attitude and answer:

1. Which assumptions in this design are weak, unsafe, impractical, or likely to contaminate the blind test?
2. Is GA the correct Teacher/Test Controller, or is another role separation better?
3. Is one project-only Project adequate for E2-A's stated limited purpose?
4. What pre-test readiness steps are missing?
5. Is Emergency Override sufficiently capable and trustworthy for the proposed continuation strategy?
6. What exact blocker/intervention/abort rules should govern the run?
7. What evidence is necessary but operationally realistic?
8. What should be changed before Teacher creates the isolated E2-A project?
9. What criteria should determine whether we proceed from E2-A to stricter E2-B?

Please return a concrete revised protocol/design, not only comments.

No implementation change is authorized by this message.

```text
NEXT_OWNER = GA
REQUESTED_OUTPUT = critical review + revised E2-A protocol + pre-test readiness checklist + role/prompt requirements + intervention/abort rules
```
