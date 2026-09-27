# GAL Escape Castle — CD Structural Remediation Execution Plan V0.1

Status: **DRAFT FOR TEACHER / GA REVIEW — NOT YET RELEASED TO CD**  
Owner of plan: GA / Teacher  
Implementation owner when released: CD  
Independent audit owner: CA  
Frozen audited product baseline: `93bd15ca36dd985a0706bad9ec56ba4002a6e`  
Current runtime migrations: `001–058` immutable; next deployable migration number begins at `059+`

## 1. Objective

This plan constrains CD/Codex so that remediation can correct the known structural defects without turning debugging into an uncontrolled redesign.

The plan is built around the agreed CA/GA sequence:

```text
0A  IDA-004 live diagnosis
0B  freeze architecture outcomes
0C  CD change-impact map
E0  deterministic browser-driving harness
A   lifecycle + transition spine
CA-A narrow independent architecture checkpoint
B/C shared player-shell remediation, serial/coordinated
D   localized fixes
E1  full deterministic browser regression
freeze one integrated correction baseline
CA Level2 targeted independent closure
E2  blind / staggered multi-client acceptance
```

The plan deliberately separates:
- **problem definition / canonical intent** → GA + Teacher;
- **implementation** → CD;
- **bounded support** → ISA only inside existing cooperation rules;
- **independent verification** → CA.

CD must not combine diagnosis, product redesign, implementation, and self-approval into one uncontrolled activity.

---

# 2. Non-negotiable global constraints

## 2.1 Preserve known-correct contracts

Unless a newly verified defect requires otherwise, CD must preserve:

- canonical ACT1 role-specific choices;
- formal player-to-player privacy;
- canonical DiscussionRoom authority and server fail-close behavior;
- Room != Run identity;
- NORMAL != AUDIT semantics;
- Teacher Override provenance and invalidation semantics;
- ACT14 finalization/export integrity;
- Asset Manager authority separation;
- current canonical game script semantics;
- current localization authority boundaries.

## 2.2 Migration immutability

- Migrations `001–058` are immutable.
- CD alone allocates/deploys migration numbers.
- Any new migration begins at `059+`.
- A faulty new migration must be corrected by a later compensating migration; do not rewrite an already-deployed migration file.
- ISA may not reserve, create, integrate, or deploy migrations.

## 2.3 No opportunistic cleanup

During remediation CD must not:
- redesign unrelated modules;
- rename broad APIs for style;
- delete legacy DB behavior merely because it looks obsolete;
- change gameplay/canonical semantics to simplify implementation;
- change asset ownership/governance;
- refactor unrelated tests;
- combine media publication work with structural runtime remediation unless the plan explicitly requires it.

If a useful cleanup is discovered, record it as deferred work rather than folding it into the active package.

## 2.4 No speculative fix for IDA-004

Until the live contradiction is classified, CD must not mask it with:
- retries;
- duplicate refreshes;
- `setTimeout` workarounds;
- repeated RPC calls;
- "just reinitialize" logic;
- silent fallback.

The first requirement is reproduction and state evidence.

---

# 3. Source-control safety model

## 3.1 Preserve an immutable recovery anchor

Before runtime edits begin, establish a named recovery branch from the exact pre-remediation repository state.

Recommended name:

`safety/pre-remediation-20260927`

This branch is **read-only by process** after creation.

The exact commit SHA must also be written into:
- the CD Action Log;
- the first remediation handoff;
- the remediation integration branch README / plan note.

A commit SHA is the true immutable recovery identity; the named branch is only a convenient human pointer.

## 3.2 CD must not develop directly on `main`

Create one integration branch:

`remediation/sprint9-structural-v1`

All runtime remediation lands there first.

Package-specific work may use child branches if helpful, for example:

- `remediation/A-lifecycle-transition`
- `remediation/B-waiting-contract`
- `remediation/C-pocket-shell`
- `remediation/D-localized-ui`
- `remediation/E-browser-regression`

The integration branch is the only branch submitted as the final remediation baseline.

## 3.3 Main merge discipline

No structural package is merged to `main` merely because CD tests pass.

Required minimum:

- E0 exists before Package A is accepted;
- Package A receives CA-A narrow checkpoint before later shared-shell packages rely on it;
- final integrated baseline receives CA Level2 closure before normal trial release.

If repository/deployment constraints later require a different branch flow, CD must document the reason before changing this rule.

## 3.4 Atomic commits

Every remediation commit must be narrow enough to answer:

- which structural family does this change belong to;
- which files/surfaces changed;
- what invariant does it preserve;
- what test proves the intended effect.

Do not mix:
- schema + unrelated UI;
- lifecycle + media publishing;
- Pocket + unrelated audio;
- test refactors + behavior changes

in the same commit unless they are inseparable for one defined contract.

## 3.5 Rollback checkpoints

Record exact SHAs at:
- PRE-REMEDIATION;
- E0;
- A-COMPLETE;
- CA-A-PASS;
- B-COMPLETE;
- C-COMPLETE;
- D-COMPLETE;
- E1-COMPLETE;
- FINAL-CORRECTION-BASELINE.

If a later package creates regressions, restore the integration branch to the last known-good checkpoint and rework from there rather than layering compensating patches blindly.

---

# 4. Phase 0A — IDA-004 live diagnosis

## Goal

Classify the live sequence:

`Run started → No active run → No active formal run`

before Package A source edits are merged.

## Required evidence

CD records:

1. exact frontend/deployment commit actually served;
2. configured Supabase URL/project;
3. room code used for reproduction;
4. response from `s2_start_run`;
5. immediate response from `s2_get_active_run` / Teacher projection;
6. immediate relevant `game_runs` state if CD has authorized DB inspection;
7. effective deployed migration/schema level;
8. whether browser cache/service-worker/CDN/stale deployment contributes;
9. timestamps sufficient to order the observations.

## Allowed conclusions

Classify as one of:

- deployment/frontend version skew;
- wrong Supabase project/config;
- incomplete migration deployment;
- runtime state defect;
- other evidence-backed cause;
- NOT REPRODUCED, with evidence.

## Stop rule

If evidence shows the deployed environment does not correspond to the audited repository baseline, correct/normalize the environment before using live results to justify source changes.

Package A edits may be designed in parallel, but **must not be merged/accepted until IDA-004 classification is known**.

---

# 5. Phase 0B — Remediation Architecture Contract

The following outcomes are fixed. CD chooses implementation mechanics within them.

## R-S1 — lifecycle / legacy-formal separation

Required outcomes:

- root formal product does not default to legacy Sprint1 gameplay;
- joined pre-run players see an explicit waiting/lobby state;
- canonical formal start reaches ACT1 without a user-visible invalid intermediate state;
- completed formal runs reach canonical ACT14 reveal;
- reconnect after completion returns to the canonical completed-run surface;
- legacy Sprint1 regression/prototype code may remain but is not current formal-product fallback;
- Teacher formal surface does not expose legacy Advance/Reset as normal current controls.

## R-S2 — transition ownership

Required outcomes:

- formal startup has one coherent recoverable completion boundary;
- no "active run but canonical ACT1 unavailable" normal product state;
- ACT5 route consequence / explicit transition is actually observable before ACT6 visibly takes ownership;
- cross-Sprint preparation may occur internally but must not overwrite an outgoing canonical player-visible boundary prematurely.

## R-S3 — per-player accepted / locked / waiting contract

Required outcomes:

- once the server accepts/locks a player's action, that player must never look unsubmitted;
- an accepted control must not simply reappear as actionable while peers are pending;
- a completed control must not disappear into an unexplained blank state;
- waiting states clearly say the action was accepted and that the player is waiting;
- peer progress may be shown only without exposing private content.

## R-S4 — Pocket/evidence as cross-ACT shell capability

Required outcomes:

- Pocket / Memories / Shared Photos / Group Items are available wherever canon permits, independent of Sprint5 activation;
- backend item/knowledge/share authority remains server-owned;
- evidence is not recreated as per-scene ad hoc UI;
- reconnect reconstructs the same evidence state.

## R-S5 — browser journey validation

Required outcomes:

- root product journey is tested through browser automation, not only RPCs;
- separate browser storage contexts are used for the three players;
- tests cover lifecycle boundaries and representative peer barriers;
- tests fail when legacy fallback, missing completion reveal, or false/unexplained waiting reappears.

---

# 6. Phase 0C — mandatory CD change-impact map before edits

Before changing runtime code, CD submits one compact map to GA.

It must include:

| Field | Required content |
|---|---|
| Baseline SHA | exact integration starting point |
| Structural family | S1/S2/S3/S4/S5 |
| Files expected to change | explicit paths |
| Server authorities touched | RPCs/tables/triggers/functions |
| Client surfaces touched | root dispatch/renderers/Teacher UI |
| New migrations | planned `059+`, if any |
| Contracts preserved | explicit list |
| Out of scope | explicit list |
| Browser tests | which E0/E1 scenario protects the change |
| Rollback checkpoint | exact prior SHA |

GA checks only:
- canonical scope;
- protected ownership;
- forbidden changes;
- whether the map covers the intended structural family.

This is **not** a request for CD to disclose detailed implementation reasoning to CA.

CA should later reconstruct the implementation independently.

---

# 7. E0 — minimal deterministic browser harness BEFORE Package A acceptance

## Purpose

Prevent Package A from being validated using the same RPC-only blind spot that caused IDA-006.

E0 is technical deterministic automation, **not** a blind Trial-Agent test.

## Minimum architecture

Use three isolated browser storage contexts for G/A/L plus a Teacher context where needed.

The harness must drive visible root pages/controls.

## Baseline-defect assertions

On the frozen broken baseline, E0 should be capable of detecting at least:

- pre-run root player enters legacy gameplay instead of formal waiting;
- split startup creates an invalid user-visible boundary;
- completed-run root dispatch cannot reach canonical ACT14 reveal.

The test may intentionally fail on the broken baseline.

That is evidence the harness can detect the defect.

## E0 must not

- call the formal RPC sequence directly as a substitute for clicking the product UI;
- bypass the root pages;
- silently seed later phases and claim startup coverage.

---

# 8. Package A — lifecycle + transition spine

Scope:
- S1 + S2;
- IDA-001 / IDA-002 / IDA-003 / IDA-005;
- PFC-001 / PFC-008;
- only source-side IDA-004 work justified by Phase 0A evidence.

## A1 — lifecycle dispatcher

CD must establish an explicit current-product lifecycle model sufficient to distinguish at least:

- joined / pre-run;
- starting/initializing if such a state remains;
- formal active;
- formal completed;
- recovery/error;
- legacy prototype outside normal formal dispatch.

Do not continue using `active formal run = false` as a blanket instruction to render legacy Sprint1.

## A2 — formal start boundary

CD must remove the normal user-visible split between "run exists" and "ACT1 exists".

Permitted design families include:
- one server-owned transactional start operation; or
- an explicit valid/recoverable initialization state.

The plan does not choose the algorithm.

## A3 — Teacher legacy controls

Legacy Sprint1 controls must not be presented as normal controls for the formal runtime.

Do not delete regression functionality solely to hide the UI.

## A4 — ACT5→ACT6 ownership

Internal Sprint5 preparation must not erase the required ACT5 terminal player experience.

The visible handoff must have an explicit completion boundary.

## A5 — ACT14 completed-run dispatch

Preserve current server finalization/export behavior unless separate evidence proves it defective.

The root client must actually consume the existing completed-run projection.

## Package A exit evidence

CD supplies:
- source diff;
- new migrations if any;
- E0 results;
- targeted source/unit/RPC tests;
- proof legacy root path is not formally reachable in pre-run/completed normal states;
- proof ACT1 privacy remains intact;
- proof finalization/export server contracts remain intact;
- exact A-COMPLETE SHA.

---

# 9. CA-A — narrow independent lifecycle checkpoint

Package A stops here.

CA-A scope only:

1. lifecycle partition;
2. legacy reachability;
3. startup boundary;
4. ACT5→ACT6 visible ownership;
5. ACT14 reveal/reconnect;
6. ACT1 privacy/authority preservation;
7. finalization/export preservation;
8. no new shadow authority.

CA-A is not the final Level2 audit.

If CA-A fails:
- later Packages B/C/D do not build on Package A;
- CD corrects Package A only;
- E0 remains the regression guard.

---

# 10. Packages B and C — shared player shell, serial/coordinated

B and C may be ordered by CD after the change-impact map, but they must not be implemented in parallel as independent redesigns of `refreshState` / shared page shell.

## Package B — accepted/locked/waiting contract

Scope:
- S3;
- PFC-002;
- PFC-003;
- related reconnect behavior.

Required implementation behavior:
- current player's submitted/locked state is projected or derivable reliably;
- renderer presents explicit accepted/waiting state;
- duplicate clicks are not encouraged by apparently unchanged controls;
- no private peer behavior is disclosed.

Required regression families:
- ACT2 leave / route ack;
- ACT3 reunion;
- ACT4 private choice;
- ACT8 private choice;
- ACT9 group choice;
- ACT10 private/final vote;
- ACT11 allocation;
- ACT12 pressure;
- ACT12 ENGAGE.

## Package C — Pocket/evidence shell

Scope:
- S4;
- PFC-005.

Required implementation behavior:
- evidence shell is available across canonical ACTs where permitted;
- Pocket state is not conditional on Sprint5 being active;
- item/observation/knowledge/share authority remains server-side;
- early-game evidence can be revisited later as canon requires;
- reconnect restores evidence consistently.

Do not implement one-off ACT3 or Library-only substitutes for the persistent evidence subsystem.

---

# 11. Package D — localized corrections

Only after shared shell stabilizes.

## D1 — PFC-004

Clear stale Sprint6 status/error when later state is successfully rendered/recovered.

## D2 — PFC-006

Consume the existing canonical ACT4 / Main Gate visual anchors and composite requirements using the existing asset/anchor architecture.

Do not invent new asset semantics.

## D3 — PFC-007

Render the already projected `act4_revealed` state.

No new reveal authority is created by the client.

---

# 12. E1 — full deterministic browser regression

Expand E0 after B/C/D.

Required coverage includes:

- Teacher create room;
- staggered G/A/L join;
- pre-run waiting;
- formal start;
- role-specific ACT1;
- ACT1 privacy;
- representative accepted/waiting barriers;
- DiscussionRoom normal/missing-player behavior;
- early Pocket/evidence access;
- ACT4 reveal;
- ACT5 terminal handoff;
- ACT6 entry;
- representative ACT9–12 locked/waiting states;
- ACT14 finalization/reveal;
- completed-run reconnect.

E1 must preserve browser-level evidence:
- screenshots or equivalent failure artifacts;
- visible text/state;
- console/network error evidence when relevant;
- exact tested commit SHA.

Direct-RPC tests remain useful but cannot substitute for E1.

---

# 13. Final integrated correction baseline

After A/B/C/D/E1:

CD creates one frozen integration commit and records:

- exact SHA;
- migrations added;
- deployment state;
- E1 results;
- all package checkpoint SHAs;
- ISA artifacts consumed, if any;
- known remaining NOT VERIFIED browser/media/audio items.

CD sends only the integrated factual handoff required for CA audit.

Avoid teaching CA the internal implementation rationale; preserve independent reconstruction.

---

# 14. CA Level2 targeted independent closure

CA independently reconstructs the integrated correction.

Required closure includes:
- original IDA/PFC findings in scope;
- Patterns A–F;
- Canonical Ownership Check;
- cross-module regressions;
- browser journey evidence;
- no new authority accretion.

Only after Level2 PASS should the product return to broad Teacher/trial use.

---

# 15. E2 — blind / staggered multi-client acceptance

After CA closure:

- fresh independent player contexts;
- staggered natural timing;
- no source/spec knowledge for player agents/testers;
- real rendered media;
- audio perception/retry;
- placeholder/anchor readability;
- waiting comprehension;
- responsive layout;
- reconnect;
- full ACT1–ACT14 completion.

E2 discovers player symptoms; it does not replace CA technical audit authority.

---

# 16. Stop conditions — CD must pause rather than improvise

CD must stop the affected package and escalate only the necessary decision if:

- a required fix changes canonical gameplay meaning;
- a fix requires editing protected canonical content owned by another role;
- the package requires modifying migrations001–058;
- IDA-004 remains unclassified but the proposed edit depends on guessing its cause;
- a new structural defect outside the frozen contract is discovered;
- two packages cannot remain separated without changing the architecture contract;
- a migration would require unsafe live deployment with no recoverable database plan;
- an asset/visual fix requires new visual semantics rather than consuming approved canonical assets;
- browser harness results contradict direct-RPC assumptions in a way not explained by the package scope.

"Pause" means stop only the affected package. Unrelated authorized work need not stall.

---

# 17. ISA use

Existing cooperation rules remain authoritative.

- CD owns architecture, database semantics, runtime authority, final integration.
- ISA may perform only bounded support work inside an allocated/frozen contract.
- ISA must not own migrations or central runtime authority.
- If CA's standing Sprint9 envelope permits an isolated validator/harness/support subtask, CD may use it according to the cooperation rules.
- If a unit becomes tightly coupled or semantically ambiguous, default the coupled implementation back to CD ownership.

CD remains accountable for every ISA artifact integrated into the final baseline.

---

# 18. Deployment and rollback rules

## 18.1 Frontend / repository rollback

Git can restore repository/frontend code to any committed checkpoint.

Preferred recovery methods:
- on a remediation branch: reset the branch to the last known-good checkpoint before it is shared/merged;
- after a merge to shared `main`: prefer explicit revert commits rather than silently rewriting shared history;
- compare the repaired head against the saved recovery SHA before re-release.

## 18.2 Database is NOT automatically rolled back by Git

A Git rollback does **not** undo:
- migrations already deployed to Supabase;
- data mutations already performed;
- Asset Manager live ACTIVE rows;
- external/storage-side effects.

Therefore before any new migration is deployed:
- record exact pre-deploy DB/runtime state;
- use a non-production/staging path if one exists;
- if live deployment is unavoidable, ensure a provider backup/export or an explicit forward compensating migration plan exists;
- do not deploy an irreversible schema/data mutation merely to test a hypothesis.

If migration059 is wrong after deployment, the normal repair is migration060+ (or an authorized database restore), **not editing migration059 and pretending it never ran**.

## 18.3 Asset/media state

Git can restore registry/source files, but it does not automatically roll back:
- storage objects;
- runtime publication records;
- ACTIVE Asset Manager state.

Treat those as external state and record them separately before activation changes.

---

# 19. Definition of successful remediation

The remediation is not complete when "all tests pass".

It is complete only when:

1. all frozen structural outcome contracts R-S1..R-S5 are satisfied;
2. localized PFC-004/006/007 are closed;
3. IDA-004 has an evidence-backed disposition;
4. E0/E1 browser regressions pass on the frozen integrated SHA;
5. CA Level2 independently closes the finding set;
6. E2 blind/staggered acceptance does not expose a new blocker;
7. any remaining media/audio uncertainty is explicitly recorded rather than silently treated as PASS.

---

# 20. CD working principle

For this remediation:

> **Understand the authority boundary first; change the smallest coherent structural unit second; prove the browser-visible result third; only then continue to the next package.**

CD is authorized to make implementation decisions inside the frozen structural outcomes.

CD is **not** authorized to make the problem easier by changing the intended game.
