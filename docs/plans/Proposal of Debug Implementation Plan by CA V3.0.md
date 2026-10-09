# Proposal of Debug Implementation Plan by CA V3.0

**Date:** 2026-10-09  
**Author:** CA — Coding Audit Agent  
**Status:** PROPOSAL FOR INDEPENDENT GA/CD CRITICAL REVIEW; NO IMPLEMENTATION AUTHORIZATION  
**Branch:** `remediation/sprint9-structural-v1`

## 0. Purpose, authority and sources

This proposal consolidates two independent CA review notes:

1. `docs/plans/TEMP_CA_CD_V2_3_COST_REVIEW_20261009.md`;
2. `docs/plans/TEMP_CA_GA_V1_2_CRITICAL_REVIEW_20261009.md`.

It critically builds on:
- CD: `docs/plans/PROPOSAL_DEBUG_IMPLEMENTATION_PLAN_V2.3_BY_CD.md`;
- GA: `docs/plans/PROPOSAL_DEBUG_IMPLEMENTATION_PLAN_V1.2_BY_GA.md` (Part II controls GA's classification);
- current V4 game script, Authority Registry V0.3 semantic freeze candidate, and first human/manual acceptance failures;
- Teacher decisions: gameplay is expected to last no longer than roughly **two hours**; NORMAL discussion uses a **10,800-second compatibility window** rather than a costly full timer rewrite; Teacher controls vote opening and S6 discussion progression; use direct ACT2 FOLLOW SIGN → Library; override recovers minimal necessary state with compact `OR` provenance, not fake real Player ballots; all learned clues persist once acquired.

**Scope limits:** this is not a replacement canonical game script, migration approval, CD authorization, or proof of deployed SQL behavior. Do not treat the rescinded GA-098 thread, older no-deadline proposal, or CD V2.2 eight-issue subplan as controlling current implementation instructions. Keep previous plans for traceability; V3.0 proposes corrections, not silent supersession by authority.

## 1. Executive recommendation

**Cost-effective hybrid remediation:**
- fix a *reproduced defect* at its owning existing domain/function;
- let the game engine/domain **publish confirmed facts**; an Observer/UI adapter transports them and validates identity/security without reconstructing gameplay;
- never introduce a second mutable global state, broad resolver or duplicate active renderer;
- apply Authority Registry as targeted correctness constraints, not a new blanket 432-field re-investigation;
- prioritize a playable Teacher + three-Player route, not hypothetical path perfection;
- use a lightweight early human/real-browser **H-pre** trial to uncover the next blocker, followed by full deterministic F0 and final F1 acceptance;
- recover through bounded Teacher-authorized TOP manifests but do not make completion of all thirteen TOPs an automatic prerequisite for the *normal-route* functional trial.

**Two independent review axes:** (1) Does it faithfully implement Teacher/V4 gameplay and learning-evidence semantics? (GA) (2) Is it the smallest safe code/migration change and can it be verified with acceptable cost? (CD). CA independently tests both.

## 2. Two-hour operating-risk rule

Rank each proposed task by: probability in a normal ≤2h session × impact on ability to continue/privacy/data integrity × realistic repair+regression cost. Security and irreversible corrupt writes cannot be disregarded solely because low frequency. Purely hypothetical states outside classroom operating bounds should be recorded as accepted limitations unless they affect the supported path.

**Concrete application:** 3h Discussion expiry after a single discussion is not a reason to remove all historic automatic deadline machinery. Conversely, a 3600-second creation limit that prevents configuring 10800 is a direct defect and requires repair. The two-hour limit is a Teacher operating assumption, not a mathematical guarantee about browser/network pause across separate days; test and document that distinct unsupported case, without expanding this package automatically.

Use independent 1–5 **implementation**, **regression difficulty**, and **real-world priority** ratings. None is a measured engineering-hour estimate.

## 3. Revised dependency skeleton (default order, not rigid serial execution)

```text
P0  Freeze reproducible baseline, deployment contracts, core failure list
 ↓
A1  Player single-flight polling / stale reply / failure-as-inactive (first code candidate)
 ├── A2  Teacher polling safety (only when evidenced; separately gated)
 ├── Q   Browser-callable obsolete RPC quarantine (bounded security lane)
 ├── U0  Formal start / obvious next action — fix reproduced blocker immediately
 ├── W03 GRAB + authoritative leave — fix reproduced blocker immediately
 └── B1  W05 Teacher minimum trustworthy location/activity projection (shadow)
       → B2 one-region cutover
 ↓  (minimal diagnostic and progress readiness; don't require all B vectors before U0/W03)
C1  Generic/S5 NORMAL Discussion 10800s / Open Vote
C2  S6 Teacher Continue and old NORMAL UI control retirement
D1  ACT3 serialized first attempt / 3s cooldown + durable result
E1  ACT7 wrong-majority/tie/round classification
 ↓
H-pre   Early Teacher + three Player real-browser functional trial
        (old UI acceptable; run as far as possible; log every hard blocker)
 ↓  (only material unresolved dependencies re-enter owning package)
D2/E2  Shared 3s presentation contract with domain-owned occurrence + adapters
W02   Player stable shell/header, Discussion renderer + local draft
W04   Pocket/Knowledge data normalization **only as needed** + renderer/local view
W08   Five-slot Library UI
W06   Teacher same-runtime Normal/Recovery/Maintenance UI + local view
 ↓
F0     Deterministic ACT1–14 normal functional regression
H0     New UI human functional acceptance, no global W12 cinematic yet
 ↓
W11 (needed wording) + W12 (presentation-only 2s scene overlay)
F1     Full UI / browser / security / finalization regression, freeze SHA
        → final human acceptance → E2

Parallel bounded recovery lane:
T0  Read-only 13 ACT boundary/required-fact/initializer/cost map
    → GA script necessity + role/branch backup approval
    → Teacher explicit release selection
T1/T2 approved TOPs only: manifest, authorized NEXT TOP, OR provenance,
      domain initializers + specific tests; attach into G/H0/F1 only if
      those TOPs are enabled for that candidate.

Conditional economics lane:
G4/H  Measure two real consumer needs, removed code/RPC work, latency and
      rollout cost; optional tiny runtime identity helper only if net savings.
```

**Important:** U0 and W03 are not required to wait for the entirety of W05; Q must be complete before an externally exposed frozen candidate. Keep formal package-level authorizations, commits, rollbacks and tests independent. H-pre is a diagnostic exercise, not a substitute for F0/F1.

## 4. Package contracts and acceptance

### P0 / A1 / A2 — make evidence trustworthy

P0: pin baseline code SHA, effective deployed DB migration/overloads, relevant V4/Authority versions, reproducible first-manual-run blockers and rollback ref. Avoid reopening settled W07 images.

A1: `src/game/app.js` single-flight polling, epoch on logout/rejoin, monotonic response generation, candidate frame before DOM commit, distinguish SUCCESS/NOT_APPLICABLE/FETCH_ERROR/INVARIANT_BREACH, passive stale view with disabled unverified mutations, same request UUID retry after unknown acknowledgement. Remove duplicate S8 read only with equivalence proof.

A2: fix Teacher overlapping/partial panel poll only if reproducible or required by W05; independent release; failure of Operations read must not overwrite valid Discussion/room frame.

**PASS:** forced race/order reversal, session switch, network interruption, reconnect, unknown acknowledgement; no old frame wins and no error-to-inactive. **STOP:** demands domain authority rewrite or broad UI shell refactor.

### U0 / W03 — directly remove first human blockers

U0: one obvious formal Teacher Start action, separate dev/legacy controls, clear Player next action; add server ACK only if the game truly needs player acknowledgement, not merely because a label rendered.

W03: selected items remain Player choices; one idempotent server action obtains required/eligible selected discovered items, records GRAB and leave canonically, updates location/gate, never reveals unseen private facts, and does not double-create next interaction. Preserve Chinese/Dutch user-approved button content.

**PASS:** normal, double-click, two simultaneous final Players, lost reply, reconnect and first valid subsequent action; do not mix with W02 shell redesign.

### B1/B2 — W05 Teacher trustworthy observability

Use existing Teacher `s7_get_teacher_console` contract; S3B early per-Player location, S5 shared location only after third-Player ACT6 entry barrier, S6 after valid takeover. Distinguish physical location, transition, role A/B/C/WATCHER, engagement, task and scene. S7 authenticates and aggregates; **does not** independently compute puzzle/gate/vote semantics. Avoid ACTIVE `game_runs` mirror fallback.

ACT1 shows in/left room; ACT2 successful existing FOLLOW SIGN immediately means entered Library (no extra acknowledgment button or reroute state); ACT5→6 shows individual entered/not entered Portrait Hall; ACT11–12 shows Main Gate and separate stations. Teacher uses bounded state categories not global latest event or private-unrevealed choices.

Shadow against independent approved fixtures; cut over only region and remove displaced binding, no extra permanent RPC. Prioritize the minimum fields that expose immediate blockers, not 20-vector completion as a prerequisite for fixing unrelated U0/W03.

### C1/C2 — Discussion at minimal actual cost

**Accepted classroom contract:** NORMAL Teacher may open voting/progress within 10,800 seconds; old expiry behavior after 3h is documented compatible limit, not an unconditional Teacher-only guarantee. Do not rewrite all deadline-tick functions just to cover the >3h hypothetical.

C1:
- modify latest effective generic Discussion constructor's `p_discussion_time_limit_sec` validation currently 5–3600 so approved NORMAL 10800 creates successfully, without broadening vote/puzzle/AUDIT bounds;
- verify all S5 initial/revote/reconfigure and generic NORMAL creation paths set proper `discussion_time_limit_sec` and `phase_deadline`;
- ensure Open Vote targets current canonical run/session/round, so delayed Teacher click cannot open a different round;
- remove normal Add Time and countdown from UI; where cheap, guard direct RPC against NORMAL changing deadline/events. Preserve AUDIT only where actually required.

C2:
- check every S6 `s6_open_discussion` initial/reopened ACT9/10/11 path uses 10800;
- add narrow Teacher-token `s6_teacher_close_discussion` (or equivalent), exact run/phase/step/round/session ID, lock and request UUID, idempotent replay, valid ACT9→console / ACT10→vote / ACT11→allocation, Teacher-origin event; integrate Teacher button, retire NORMAL Player timer-gated Continue (server mode guard preferred);
- actual messages continue before the 3h window; no unintended early auto-advance.
- **Do not** conflate *discussion duration* with vote deadline, ACT3 cooldown or 3s overlay.

**PASS:** NORMAL session created; Teacher can end at minute 1/10/100; 2 ballots + 1 missing remain pending; same/stale request; all S2/S5/S6 contexts; AUDIT regression and clear 3h boundary disclosure. **STOP:** implementing this requires wholesale generic/S5/S6 lifecycle rewrite; return concrete evidence/cheaper alternative.

### D1/D2/E1/E2 — ACT3, ACT7, short committed-result view

D1: preserve existing run lock and request UUID/attempt records; first **server accepted** ACT3 5-digit submission gets evaluated; a different request within 3 seconds rejected; same-request replay returns same outcome; wrong display says only “密码错误” in localized Player version, no extra punitive UI. Existing ACT3 fallback/hints unaffected without explicit requirement.

E1: wrong-majority is distinct from valid majority, no-consensus/tie and success; do not let wrapper overwrite a resolved wrong classification. Keep previous-round result readable upon reopening discussion.

D2/E2: domain produces one result occurrence ID and a 3-second server exposure window; three Players + Teacher render same committed result, including tie, wrong majority, success. A shared **presentation component** is permitted but must never compute winner/advance game. With ~1.2s polling, identical first-display millisecond cannot be guaranteed; same occurrence and end timestamp suffice, reconnect does not restart 3 seconds. Explicit current round/identity and privacy checks.

### F — current gameplay defects

Use one independently documented and testable correction per reproduced bug from the first manual trial and H-pre. Examples: formal run cannot start, missing next-action direction, GRAB progression, round waiting lockup, Clock Hall no vote, Teacher powerless after a hard blocker, visual action mount detached. Do not hold known blockers until after D/E purely to follow numbering. The defect's owning domain dictates release order.

### W02/W04/W06/W08/W09/W10/W11/W12 — UI migration

W02 no-op stable scene/action/discussion/pocket mounts; merge identity Header (W10), keep one renderer owner. W09 local draft/focus/Pocket/Teacher view behavior belongs to owning UI package, not separate releases. W04 split minimum necessary canonical Knowledge/Observation corrections from Pocket presentation; genuine acquired clues persist and are repeatable, no implicit legacy read fallback. W08 five clear slots; do not move ACT3 server cooldown into UI. W06 one Teacher runtime with Normal / Emergency / Developer panes; normal view has only approved controls, no competing formal Start. W11 polish when wording causes confusion; W12 2s bilingual presentation only, no advancement.

### Q / S0 — safety and deployed residuals

Verify effective signatures and grants of reachable `s1_submit_private_choice` and any truly obsolete exposed mutation, then revoke via forward migration only after confirming supported clients do not depend on it. Clean migration replay, active/prod comparison, finalization integrity and historical anomalies are independent evidence gates; no speculative historical rewriting. Do not reopen image publication W07 absent new failure; audio/browser publication must pass as appropriate for frozen normal trial.

### T0/T1/T2 — TOP & OR without shadow game engine

Teacher's desired default is NEXT TOP from ACT n to ACT n+1, repeatable; reason may be bug or time. T0 enumerates all thirteen ACT boundaries: source/target, canonical completion condition, target initializer, needed resource and memory keys per role/branch, missing predicate (false/0 not automatically missing), valid existing state, valid absence, required continuation outcome, incompatibility, late interaction closure, scope of behavior validity, audit/export source, complexity and test case. GA independently checks necessity against V4 and supplies approved minimum backup values.

**Option B controls:** do not forge Player votes/messages as if genuine. Existing real facts prevail if consistent; missing prerequisites may be filled only through authorized domain-owned runtime mutations/initializers; one compact `Override` record lists OR-filled uniquely addressable facts, Teacher reason, source/target, before-state minimization and request UUID. Runtime may use the supplemented canonical value, while behavioral scoring and export must distinguish and exclude override-sourced behavior. Do not build per-field provenance graph or arbitrary Teacher-entered database writes.

Pilot one representative domain boundary before funding generic T1/T2. Within each enabled TOP, transaction/replay guarantee, closing old interaction, canonical next initialization, no incompatible branches, first Player action works, evidence remains distinguishable. Consecutive TOPs need distinct tests. “One skip” does not require reconstructing earlier ACT, but skipping with missing/contradictory mandatory state must fail safely and show a Teacher-useful explanation.

**Delivery gate:** Normal-route F0/H0 may pass independently of all thirteen TOPs; each TOP actually enabled must pass its own recovery + OR analytics gate. Teacher, not GA/CA/CD alone, decides which subset is mandatory for a given release after T0 cost findings. Do not promise 3–4/5 for all thirteen until full boundary map and pilot evidence; avoid allowing a speculative 5/5 fear to suppress Teacher's recovery goal.

### G / H-pre / F0 / H0 / F1 / G4

- **H-pre:** with old UI after critical fixes, run controlled Teacher + 3 Players as far as possible; record hard blocker #1/#2, exact input, server result and frame, and determine actual next scope. May need special test room; does not replace formal E1.
- **F0:** full deterministic ACT1→14 normal route with required baseline gameplay and newly migrated UI; security/privacy/identity/round/polling/reconnect.
- **H0:** human functional trial of new UI prior to W12; capture whether players understand next action and Teacher can operate without developer support.
- **F1:** post-W12 full browser responsive, cinematic suppression, Pocket/media, Teacher recovery, data integrity/export and final SHA freeze. Functional regression across 3 isolated Player browsers + Teacher; measure actual errors and p95; targeted CA Level2-style closure and final human acceptance before E2.
- **G4/H:** after local fixes measure RPCs and implementation branches; only introduce shared runtime identity interface if ≥2 consumers and actual removed queries/branches yield net savings. No new central game-rule engine.

## 5. Work packages: estimated difficulty vs priority (provisional)

| Package | Implementation | Verification | Real-run priority | Key release rule |
|---|---:|---:|---|---|
| P0 baseline | 1–2/5 | 1/5 | Critical | first |
| A1 Player poll | 2–2.5/5 | 2–3/5 | Critical | first code candidate |
| A2 Teacher poll | ~2/5 | 2–3/5 | conditional | only evidenced |
| U0 formal start | 1.5–2.5/5 | 2/5 | Critical when reproduced | early independent |
| W03 GRAB/leave | ~3/5 | 3.5/5 | Critical | early independent |
| W05 Teacher observation | ~2.5/5 | 3/5 | High | shadow then cutover |
| Discussion C1/C2 | 2–3/5 hypothesis | 3–4/5 | High | 10800 + Teacher S6 |
| ACT3 D1 | ~3/5 | 3/5 | High | serialized server attempts |
| ACT7 E1 | 2–3/5 | 3/5 | High | correct durable result |
| Four-view D2/E2 | 3–4/5 | 3–4/5 | Medium–High | committed occurrence |
| Player/Teacher/Pocket UI | 2–4/5 per unit | 3–4/5 | High after core | one renderer owner |
| Q old RPC | 1–2/5 | 2/5 | High before public trial | privilege negative test |
| TOP T0 | ~2/5 | ~2/5 | High as investigation | no code |
| TOP T1/T2 | UNVERIFIED (3–5/5) | High | conditional release | actual mapped costs |
| W12 overlay | 2–2.5/5 | 2–3/5 | Low until final polish | after H0 |
| F0/H0/F1 proof | not code work | ~4–4.5/5 | Critical | split actual trials |
| G4 optional context | unknown | unknown | default no build | measured benefit |

The values are relative **hypotheses**, not additive person-days. CD must challenge differences with actual function/call-site surfaces and rollback/test budgets.

## 6. Explicit open decision ledger

1. Do generic/S5/S6 effective deployed functions really accept 10800 in *all* round/reopen paths after a bounded migration? CD to demonstrate.
2. Is Teacher S6 continuation sufficient without a new central lifecycle engine? CD to identify exact functions/permissions; GA confirms ACT9/10/11 semantics.
3. How many of the thirteen TOPs are cheap using canonical initializers? CD T0 map; GA per-role/branch requirements; Teacher determines mandatory subset for first release.
4. Which recovery-supplemented canonical facts feed actual behavior analysis/export? CD traces consumers; CA tests exclusion, GA validates evidence semantics.
5. Which U0/W03/F defects remain reproducible on newest deployed candidate? Verify with baseline rather than restoring old defects from memory.
6. Can W05 give minimum useful Teacher visibility before full multi-ACT vectors complete? CD estimates; GA checks exact scene/role meaning.
7. Are there any overlapping domains/versions that prevent combined Context+Detail display during handoff? If evidenced, use targeted version match; no speculative Resolver.
8. Can a human H-pre start safely before new UI migration; what minimal test room/data isolation is needed? Require exact baseline before use.

**Governance:** No blanket code authorization, no migration or deployment authorization, and no independent GA script rewrite implied here. Reviewers should materially challenge this plan rather than merely concur.

## 7. Adversarial review questions for GA and CD

**GA:** What V4 gameplay semantics have been lost by the Teacher's cost reductions? Does the 3h Discussion compromise respect actual ACT7/ACT9/ACT10/ACT11 gating? Are TOP prerequisites and OR behaviors semantically sufficient? Is normal-route H-pre/H0 feasible without full TOP? Where does the reordered U0/W03/W05 path violate script? Which package claims low complexity by shifting an unowned semantic decision to UI/Observer? Produce exact ACT examples and cheaper alternatives.

**CD:** Are A1, U0, W03 and W05 truly independently deployable? Which active SQL functions/overloads enforce 3600 max, S5/S6 10800 reopen, stale teacher input and S6 Teacher Close? Can C1/C2 be implemented in 2–3/5 without rewriting S5/S6? Does each TOP map to existing init/lock/identity-protected RPCs, or require custom transfer code? Does OR sidecar actually reach behavior/export consumers? What code can be removed during new UI cutover, and how much does H-pre add to tests? Provide function-by-function delta, STOP cases, costs and evidence; challenge release ordering.

**Review response requested:** independent reviews, ranked BLOCKER/MATERIAL/MINOR, with factual counterexamples, lower-cost changes, implementation vs verification cost and effect on H-pre/H0/G; no implementation. GA and CD should **not** simply adopt this CA plan because it is already written.
