# Manual Acceptance Readiness Plan V0.2

Status: GA CORRECTED — FOR CA CONCURRENCE  
Supersedes: `docs/plans/MANUAL_ACCEPTANCE_READINESS_PLAN_V0.1.md` for current review  
Teacher objective: perform one human/manual end-to-end acceptance before blind-agent E2-A  
Runtime semantics: no gameplay change  
Placeholders: keep as-is

## 1. Objective

Prepare the already-Level2-PASS remediation frontend for one public, human-controlled ACT1→ACT14 acceptance run while preserving exact build identity and a deterministic rollback path.

This is an integration/playability acceptance run, not a timing study and not a blind-agent study.

The manual run must answer:

> Can the current remediated public frontend, connected to the already-deployed Supabase authority, be entered from the real classroom URLs and complete the formal ACT1→ACT14 flow without an unauthorized semantic bypass?

## 2. Frozen tested identity

Use the already-audited remediation line:

- remediation branch: `remediation/sprint9-structural-v1`
- E1-tested runtime implementation: `97f5ed362c58defb45edf19c18319417cb70b93f`
- integrated E1 evidence baseline: `891feffe558a4683ac3da67e1e6b15e902c7e592`
- CA Level2 result: PASS / CA-147
- Supabase project: `qdcbdcjobzytzhnhfwyn`
- highest deployed migration: `068`

GA rechecked repository history before this revision:

- current `main` and remediation branches are materially diverged;
- remediation is 60 commits ahead and 54 commits behind `main`;
- from `891feffe...` to the current remediation head, no runtime/database/asset file change is present; later commits are governance/evidence/protocol material.

Therefore broad `main` reconciliation is not part of manual-acceptance readiness.

## 3. Deployment strategy — corrected

### MA-01 — Create a frozen deployment ref

Preferred public-test source:

`deploy/manual-acceptance-20261003`

The branch should point directly to:

`891feffe558a4683ac3da67e1e6b15e902c7e592`

Do not deploy directly from the moving remediation branch unless GitHub Pages constraints make the frozen branch impossible.

Rationale:

- exact tested tree is pinned;
- later remediation documentation commits cannot change the public test unexpectedly;
- no broad merge with `main` is required;
- rollback remains independent of ongoing development history.

Creating or switching this deployment ref is implementation work and remains blocked until CA concurrence and release to CD.

### MA-02 — Record current Pages state before switching

Before changing GitHub Pages, record:

- current Pages source branch;
- current Pages source folder;
- exact current source commit;
- current public Player URL;
- current public Teacher URL;
- current served fingerprints for at least:
  - `index.html`
  - `teacher.html`
  - `src/game/app.js`
  - `src/teacher/teacher-console.js`
  - `src/styles/app.css`

Freeze the current source branch during the manual-acceptance deployment window. If it cannot be frozen, create a safety ref at the exact currently served commit before switching Pages.

### MA-03 — Switch Pages to the frozen deployment ref

Preferred source after release:

`deploy/manual-acceptance-20261003 / (root)`

The actual branch/folder must be recorded from GitHub Pages settings at execution time; do not assume the existing source configuration.

Wait for Pages deployment completion before public-entry smoke.

## 4. Deployment identity verification

### MA-04 — Verify public files match the frozen tested tree

A public smoke alone is not sufficient proof of build identity.

After Pages publishes, fetch the real public resources and compare SHA-256/content identity for the runtime-critical frontend files listed in MA-02 against the frozen deployment ref.

Acceptance condition:

- all required public files match the frozen deployment content;
- no stale cached prior runtime is being served;
- Player and Teacher public entry points resolve successfully.

If identity cannot be established, do not start the human acceptance run.

## 5. Public-entry smoke

### MA-05 — Disposable public smoke room

Use actual public URLs and a disposable room.

Verify:

1. Player page loads without material application errors.
2. Teacher page loads without material application errors.
3. Teacher can create/watch a room.
4. Three independent Player browser contexts can join.
5. Formal start works.
6. Each Player receives the correct role-private ACT1 surface.
7. Supabase is reachable through the public frontend.
8. One Player refresh/reconnect preserves the formal run.
9. No obvious recurrence of closed lifecycle/legacy-pre-run defects.

Stop before the longer manual acceptance if any smoke item fails.

## 6. Recovery readiness — narrowed

### MA-06 — Minimum non-contaminating readiness check

Do not exercise every recovery mechanism pre-emptively.

Before the real run:

- confirm normal Teacher controls render and are usable;
- confirm session/reconnect controls needed for ordinary operation;
- in a disposable formal room, optionally verify one projected ACT1 Emergency Override action if the deployed `allowed_actions` exposes it;
- do not invoke runtime-group recovery unless the corresponding automatic group initialization actually fails and its documented preconditions hold;
- never use `Advance legacy scene / s1_advance_scene` as formal ACT1–14 recovery.

This proves a bounded emergency path without manufacturing later-game failures merely to test recovery.

## 7. Manual-run topology

### MA-07 — Browser/session layout

Use:

- 1 Teacher/Test Controller context;
- 3 isolated Player browser contexts;
- 1 shared formal run;
- staggered joins.

Each Player context must preserve separate cookies/session storage.

No source, devtools, database, RPC, or direct state manipulation during natural play.

This run does not need E2 cognitive blindness.

A single human may operate multiple Player contexts for integration purposes, but if so the run must not be used to infer classroom discussion timing.

## 8. Timing treatment

### MA-08 — Timing adequacy is NOT VERIFIED by this manual integration run

Do not redesign timer semantics before the run.

If one operator is multiplexing several Player contexts, or ordinary operation simply needs more time, a valid existing Teacher `Add 30 seconds` control may be used proactively while discussion remains open.

Such an extension is classified as:

`NORMAL_TEACHER_OPERATION`

not a forced semantic bypass.

Record each extension, but it does not by itself end the natural PASS claim.

If a deadline closes a required channel and an extraordinary recovery is then needed, treat that as a blocker/intervention.

The manual run must not conclude that 15s/90s/180s is suitable for real students. Classroom timing remains separately NOT VERIFIED.

## 9. Evidence protocol

### MA-09 — Minimal but reconstructable evidence

Do not require exhaustive screenshotting during successful play.

Mandatory records:

- deployment identity sheet;
- room/run ID;
- start/end wall-clock time;
- one screenshot of:
  - pre-run joined state;
  - role-private ACT1 for at least one representative Player, with Teacher state separately captured;
  - first group discussion;
  - ACT14 final reveal;
  - completed-run reconnect;
- every material defect/confusion;
- every Teacher extension/intervention/recovery;
- pre/post screenshot for any hard blocker or forced recovery;
- final outcome classification.

For each material issue record:

- timestamp;
- Player(s) affected;
- current ACT/phase if visible;
- visible symptom;
- refresh/reconnect attempted or not;
- exact Teacher intervention and reason;
- whether all clients converged afterward.

## 10. Blocker and continuation rule

### MA-10 — Natural acceptance boundary

Natural acceptance remains valid through ordinary Player actions and ordinary Teacher controls, including legitimate proactive discussion extensions.

The natural PASS claim ends at the first **forced semantic bypass**, meaning an action used to substitute for a game transition/decision that natural runtime failed to achieve.

Recovery order:

1. ordinary refresh/reconnect;
2. valid normal Teacher control;
3. valid runtime-group recovery, only when documented preconditions hold;
4. valid projected Emergency Override.

If one authorized recovery restores one coherent formal state:

- preserve failure evidence;
- mark natural acceptance FAIL at that boundary if it was a forced semantic bypass;
- diagnostic continuation may proceed;
- label all later evidence post-intervention.

If no authorized recovery can restore one coherent state:

- stop;
- classify `ABORTED / NOT INTERPRETABLE`;
- do not improvise database/RPC mutation.

## 11. Rollback plan

### MA-11 — Deterministic rollback prepared before deployment

Before switching Pages, record the original Pages source branch/folder and exact source commit.

Rollback trigger includes:

- public fingerprint mismatch;
- smoke failure caused by deployment;
- material public-entry regression;
- completion of the bounded manual-acceptance window if the prior public deployment should be restored.

Rollback procedure:

1. switch Pages source back to the recorded original branch/folder;
2. wait for Pages publish completion;
3. verify the restored public runtime-critical file fingerprints against the recorded pre-switch identity;
4. record rollback completion.

If the original source branch cannot be guaranteed not to move during the window, create a safety deployment ref at the original served commit and use that ref for exact rollback.

No database rollback is expected because this package changes only frontend publication; migrations 059–068 are already deployed and remain untouched.

## 12. Output

### MA-12 — Acceptance package

Produce:

- exact frozen deployment ref and commit;
- original Pages source and rollback identity;
- public Player/Teacher URLs;
- Supabase identity and migration ceiling;
- public-file fingerprint verification;
- smoke result;
- ACT1→ACT14 result;
- material defects/confusions;
- all Teacher extensions/interventions;
- post-recovery completion status;
- screenshots/log references;
- explicit final class:
  - `NATURAL PASS`
  - `NATURAL FAIL + DIAGNOSTIC CONTINUATION`
  - `ABORTED / NOT INTERPRETABLE`
  - `DEPLOYMENT IDENTITY FAILURE`

## 13. Explicitly out of scope

No change to:

- four existing placeholders;
- `shared.main_gate` placeholder-first state;
- discussion timer implementation;
- ACT7 90s/15s mismatch;
- blind-agent prompts/projects/Work setup;
- Agent Concurrency Precheck;
- Visual State Timeline tooling integration;
- Teacher Console production hardening;
- broad `main` reconciliation;
- new gameplay;
- new recovery mechanisms;
- migrations.

## 14. Ownership after CA concurrence

### GA

- owns this acceptance protocol;
- can serve as Teacher/Test Controller if requested;
- records manual-run evidence and outcome.

### CD

Only after CA/GA release:

- create/prepare the frozen deployment ref;
- record current Pages configuration/identity;
- switch Pages using the agreed bounded method;
- verify public file identity and basic deployment reachability;
- assist only with deployment-specific technical faults.

CD does not own gameplay/timing redesign in this package.

### CA

- reviews this V0.2 for material disagreement;
- remains independent from deployment implementation;
- reviews manual-run evidence only when an audit trigger or material finding requires it.

## 15. Release gate

No Pages switch, CD deployment work, runtime change, database change, or gameplay change is authorized by this draft.

Release condition:

1. CA confirms no material objection to V0.2;
2. GA/Teacher release the bounded deployment package to CD;
3. deployment uses the frozen identity and rollback controls above.
