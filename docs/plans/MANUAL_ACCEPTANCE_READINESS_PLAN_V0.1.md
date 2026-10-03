# Manual Acceptance Readiness Plan V0.1

Status: DRAFT FOR GA CRITICAL REVIEW
Owner of review: GA
Implementation owner after review: CD
Teacher objective: perform human/manual acceptance before blind-agent E2
Placeholders: KEEP AS-IS
Runtime semantics: NO CHANGE unless separately approved

## 1. Objective

Prepare the currently Level2-PASS remediation build for a human/manual end-to-end acceptance run using the public classroom entry points.

This is intentionally narrower than E2-A:
- no blind-agent setup;
- no three-project isolation;
- no Agent Concurrency Precheck required for the human run itself;
- no placeholder completion;
- no Teacher Console production-hardening cleanup;
- no discussion-timer redesign;
- no opportunistic product changes.

The purpose is to answer first:

> Can a Teacher and three human-controlled Player sessions enter, start, progress, recover when necessary, and reach the end of the current game through the public deployment?

## 2. Frozen tested runtime identity

Use the already-audited remediation line:

- branch: `remediation/sprint9-structural-v1`
- E1-tested runtime implementation: `97f5ed362c58defb45edf19c18319417cb70b93f`
- integrated evidence baseline: `891feffe558a4683ac3da67e1e6b15e902c7e592`
- CA Level2 closure: PASS at CA-147

Current remediation commits after the E1-tested implementation do not modify runtime files. Before deployment, CD must reconfirm that no runtime/database authority delta has appeared since that evidence.

## 3. Work required before manual acceptance

### MA-01 — Public frontend deployment

Deploy the remediation frontend to the public GitHub Pages classroom entry.

Preferred deployment objective:

- public Player page serves the remediation runtime;
- public Teacher page serves the remediation Teacher Console;
- keep the current Supabase backend;
- do not merge/reconcile unrelated `main` history merely to enable this manual test.

Because `main` and remediation have diverged, deployment should minimize repository-history risk.

CD/GA should critically determine the safest publish mechanism:
- temporarily publish Pages from `remediation/sprint9-structural-v1`, or
- another equally bounded mechanism that serves the exact tested frontend without broad main reconciliation.

No unrelated merge is part of this work package.

### MA-02 — Deployment identity record

Before the human test, record:

- exact Git commit/runtime content being served;
- Pages source branch/folder;
- public Player URL;
- public Teacher URL;
- Supabase project identity;
- highest deployed migration = 068;
- known media state.

The record must be sufficient to identify exactly what build the human test exercised.

### MA-03 — Public-entry smoke verification

After public deployment, verify through the actual public URLs, not local hosting:

1. Player page loads without material application errors.
2. Teacher page loads without material application errors.
3. Teacher can create/watch a disposable room.
4. Three distinct Player browser contexts can join the same room.
5. Formal game start works from the real Teacher page.
6. Each Player receives the correct role-private ACT1 surface.
7. Public browser can reach Supabase.
8. Refresh/reconnect of one Player does not destroy the room/run.
9. No legacy pre-run surface or previously closed Level2 defect obviously reappears.

If any of these fail, do not begin the longer human acceptance run.

### MA-04 — Teacher recovery readiness check

Use a disposable room before the real human acceptance run.

Verify only that the deployed Teacher Console can access the recovery mechanisms already allowed by the current implementation:

- normal Teacher controls;
- runtime-group recovery where valid;
- projected Emergency Override where valid.

Do not use `Advance legacy scene` as formal ACT1–14 recovery.

This check is not authorization to broaden recovery authority.

### MA-05 — Manual test topology

Human/manual acceptance should use:

- one Teacher/Test Controller;
- three independent Player browser contexts;
- one shared formal run.

Recommended:
- stagger Player joins rather than opening all three at exactly the same instant;
- preserve distinct sessions/cookies;
- avoid devtools/state manipulation during normal play;
- players act only from information visible in the game.

This is not required to be cognitively blind in the E2 sense; it is a playability/integration run.

### MA-06 — Minimal evidence protocol

Teacher records only evidence needed to reconstruct meaningful failures:

For each material issue:
- wall-clock time;
- room/run identity;
- Player(s) affected;
- current ACT/phase if visible;
- visible symptom;
- screenshot when practical;
- whether refresh/reconnect was attempted;
- whether Teacher intervention was used;
- exact intervention and reason;
- whether all clients converged afterward.

Do not overload the Teacher with exhaustive logging during normal successful play.

### MA-07 — Manual-run blocker/recovery rule

Natural manual acceptance succeeds only if the game can complete without forced semantic bypass.

If a hard blocker occurs:

1. preserve the failure evidence;
2. try the least-invasive existing recovery:
   - ordinary refresh/reconnect;
   - valid normal Teacher control;
   - valid runtime-group recovery;
   - valid projected Emergency Override;
3. if recovery succeeds and all clients converge coherently:
   - mark natural acceptance as failed at that point;
   - optionally continue the same run for diagnostic discovery;
4. if no existing authorized recovery can restore one coherent formal state:
   - stop that run;
   - do not invent live DB/RPC mutations during the human acceptance test.

Any post-forced observations must be labelled diagnostic, not natural acceptance evidence.

### MA-08 — Acceptance output

At the end of the human run, produce one concise package:

- exact deployed-build record;
- whether ACT1→ACT14 was reached naturally;
- all material defects/confusions;
- all Teacher interventions;
- whether the run completed after intervention;
- unresolved blockers;
- relevant screenshots/log references;
- explicit distinction:
  - NATURAL PASS
  - NATURAL FAIL + DIAGNOSTIC CONTINUATION
  - ABORTED / NOT INTERPRETABLE

This package becomes the basis for:
- bounded CD fixes, if needed;
- later blind-agent E2-A;
- later E2-B;
- later Teacher Console production hardening.

## 4. Explicitly out of scope

Do not change before this human acceptance unless Teacher separately authorizes it:

- four current opening/ending placeholders;
- `shared.main_gate` placeholder-first behavior / ACTIVE publication state;
- discussion timeout semantics;
- ACT7 timing mismatch;
- blind-agent prompts/projects;
- Agent Concurrency Precheck for E2;
- Teacher Console cleanup;
- main/remediation broad history reconciliation;
- new gameplay content;
- new recovery mechanisms.

## 5. Proposed implementation ownership

After GA/CA agreement:

### GA
- final critical review of this readiness plan;
- confirm the manual acceptance evidence/blocker protocol;
- serve as Teacher/Test Controller if Teacher requests it.

### CD
Only after explicit release:
- perform the bounded public-frontend deployment;
- record deployment identity;
- assist only with deployment/smoke technical work required to make the tested remediation frontend publicly accessible.

### CA
- remain independent from implementation;
- review the resulting human acceptance evidence if a new audit trigger arises.

## 6. Release gate to CD

Do not notify CD to implement until GA returns critical review and CA/GA have no material disagreement.

No implementation is authorized by this draft.
