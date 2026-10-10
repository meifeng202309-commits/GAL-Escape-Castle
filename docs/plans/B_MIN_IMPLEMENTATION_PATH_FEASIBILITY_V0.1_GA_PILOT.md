# B-min Implementation-Path Feasibility V0.1 — GA method pilot
**Status:** PROPOSED / SOURCE_STATIC investigation only; **RECOMMENDED_ADVISORY, not approved route**  
**Branch:** `remediation/sprint9-structural-v1` | **No CD/TCA coding authorization** | **No live/deployed verification**

## 1. Boundary, evidence and authorization
- CD freeze checkpoint: `docs/plans/CD_RESUME_CHECKPOINT_20261010_A1_CA176.md`; code/test SHA `c4bdd2e96259d94ba543720c7d7d71c0d445b559`, NO DEPLOYMENT, CD FROZEN. The current working branch may contain documentation after this checkpoint.
- Required planning scope: `docs/plans/Debug Implementation Plan V4.md` §6 Package B W05, early B-min before W03/H-B; V4 already selects **versioned shadow projection on existing Teacher read**, minimum vectors, location/status cutover + removal of displaced binding in same commit, no new permanent polling endpoint.
- GA domain semantics (not implementation authorization): `docs/plans/W05_OPERATIONAL_LOCATION_SEMANTIC_CONTRACT_V1.0.md` — status **SEMANTIC DESIGN FOR CA/CD REVIEW**, S3B per-player until third ACT6 entry, S5 group ownership after activation, S6 after valid activation, S7 thin read aggregator; distinguish role vs physical place.
- Current Teacher consumer: `src/teacher/teacher-console.js` blob `b276e049ba98718b62f7b81f48657211a02ca37e`, functions `loadOperationsState`, `renderOperationsState`, RPC call `s7_get_teacher_console`; current table renderer uses `p.player_location`, `p.submitted`, `p.locked_choice_state`.
- Inspected source DB: `database/043_sprint7_teacher_console.sql` blob `56a077b53d162372671472ac3f83a964a8f6f76f`. Function `public.s7_get_teacher_console(p_room_code,p_teacher_token)` authenticates Teacher, selects current active run, joins `s1_room_players` with `s3b_player_progress`, emits `player_location: pp.player_location`, and aggregates `s5/s6` reads. Granted to anon/authenticated subject to Teacher token assert *in this source migration*. **This file alone does not establish repository-last effective overload, grants or deployed DB state.**
- SOURCE_STATIC mismatch: late-stage Player location shown from early S3B `pp.player_location` may be stale once S5/S6 owns location. Also code reads `state.current` and `state.players`; new W05 read must preserve compatibility/locked privacy.

## 2. IC definition and maturity
**IC-B0 entry (SOURCE_STATIC subset):** Teacher supplies current room + teacher token to existing `s7_get_teacher_console`; active run must be selected by run identity, phase owners evaluated from authoritative domain data. Confirm *effective* source version and run/permissions with CA; deployed state NOT_VERIFIED.
**Semantic consumer obligation (DECLARED_CANONICAL/V4):** Teacher NORMAL needs reliable per-Player physical location + transition, discussion/vote, role, task, connection and source validity. Existing operations table is a REAL physical consumer but does not prove the complete future UI/output contract.
**IC-B1 exit (PROPOSED/ACCEPTED_FOR_PLANNING only after CA review):** Existing read returns versioned, explicit per-Player projection `physical_location,transition_state,discussion_or_vote_state,assignment_role,task_state,connection_state,source_domain,source_identity,validity,reason_code`. Actual key names not frozen. S3B early, S5 activated shared, S6 valid active; contradictory owners => INVARIANT_BREACH; no private unrevealed choices; no new polling endpoint; old binding disabled at location/status cutover.
**Invariants:** station allocation != physical room; S5 prepared row != S5 activated owner; a Player-entered ACT6 while peers not entered remains a mixed location; no source-domain guessing from latest event/presentation mirror; no unauthorized write or new proxy Authority.
**Maturity:** Proposed semantic exit + verified old consumer; `SOURCE_VERIFIED` only for specific inspected SQL/JS facts, NOT operational IC; planning status pending CA. No TCA Pack released.

## 3. Candidate routes and comparison
**Route A — preferred conditional bounded domain-published values + S7 aggregator:** Reuse Teacher read RPC, project owner-derived S3B/S5/S6 facts from owner-local read semantics, narrowly choose source by explicit milestone, attach provenance and safety status. Add versioned shadow fields, test vectors, switch status/location output in same code cutover, delete displaced early-S3B renderer binding. No generic phase resolver, new persisted universal location, or additional polling RPC. Strengths: matches §6 V4 delivery and W05 authority segmentation; few new public surfaces. Risks: actual S5/S6 domain read contracts and effective grants remain unverified; multi-domain read consistency and runtime effort might exceed anticipated savings. **RECOMMENDED_ADVISORY / not authorized architecture.**
**Route B — in-place S7 all-ACT mapping from existing scene/phase/last event:** Could be shorter initial code but duplicates S5/S6 semantics into S7, leaves ambiguous ACT5→6 boundary, encourages fallback to stale S3B and breaks privacy/authority. **Rejected on V4 + W05 semantic grounds**, not a viable equivalent; included explicitly as a falsification comparator rather than a candidate to approve.
**Route C — shared generic context/read-model engine + new RPC:** May consolidate later Player and Teacher consumers, but entails additional endpoint/dependency/scope, unresolved read-authority implications, unproven reuse, and violates V4's B-min no new permanent polling read. **Rejected for current bounded B-min**; could be revisited only by separate change-owner review if measured duplication later warrants it.
**Economic result:** Route A is currently the only plausible candidate under existing V4 constraints. Thus no ranking based on invented labor/LOC savings; actual total effort remains NOT_VERIFIED. Scope should STOP if S5/S6 publisher changes or integration/test costs plausibly exceed an in-place bounded fix. Do not expand study to other V4 packages.

## 4. Required falsification and minimum vectors
Before accepting IC, CA independently trace effective `s7_get_teacher_console` overload/function and grants, correct run selection, payload use, S3B/S5/S6 producer reads and explicit ACT6 handoff; check latest migrations (e.g., post-043 overrides), canonical field authority, and whether versioned shadow can be built without backend business-logic duplication.
Minimum V4 vectors with EXPECTED owner/output:
1. ACT2 independent arrival → only acting Player now Library, other early S3B locations unchanged;
2. ACT5→6 one and two entered → mixed S3B per-player, `transition_state` explicit; prepared S5 must NOT claim ownership;
3. third entered → group S5 Portrait Hall owner;
4. ACT11 role A/B/C or WATCHER => all Main Gate physical location; role separate;
5. ACT12 mixed ready/engaged/waiting => same physical location; genuine task state from S6;
6. reconnect/offline => presence state not confused with location;
7. privacy negative => no unrevealed choice in NORMAL Teacher read;
8. missing/contradictory owner prerequisites => explicit validity/error instead of silent fallback.
Tests currently **NOT_RUN** for these V4 vectors; repository source inspection is not test PASS. Unit/static/mock/integrated/live tiers must be recorded separately.

## 5. TCA Block assessment
**NO WORTHWHILE TCA PRODUCTION PACK YET.** A real Teacher UI consumer exists, but no *stable future shadow payload signature*, domain-publication interface or approved adapter contract has been evidenced, and no deletion/falsification case for a new independent helper is established. Simply creating a location label formatter or a universal resolver risks the P01 empty-consumer failure and extra code proliferation.
Potential future bounded work *after* CA source contract review: pure projection contract-test fixtures capturing the eight vectors; or a source-grounded display adapter only after a frozen actual payload and consumer are approved. Fixtures alone may be useful **non-production test assets**, but no assignment authorized now. Do not invent SQL/RPC, new module or two-Pack quota.

## 6. Unresolved assumptions / owner / impact
| Assumption to resolve | Responsible owner | Decision impact |
|---|---|---|
| Exact repository-last and deployed effective `s7_get_teacher_console` definition, overload, grants and Teacher auth | CA technical review; later CD under authorized runtime gate | Blocks implementation signature and authority claims |
| S5/S6 effective domain-published read interface and handoff owner milestones | CA technical review / CD implementation | Determines whether Route A can be cheap and stable |
| Concurrency and single coherent per-run view across S3B/S5/S6 reads | CA / later CD | Can invalidate naive projection |
| Exact versioned shadow response and normal Teacher UI adapter seam | Existing interface owner / later CD | Blocks any TCA production Pack |
| Deployed RPC/live behavior and regression vectors | authorized future runtime owner | No current live verification |

## 7. Method-pilot scorecard (not a numeric route rating)
- **Actual CD boundary:** found; freeze and no-deploy pinned.
- **Approved unmet acceptance:** found V4 §6; semantic obligation exists.
- **Existing actual consumer:** found Teacher JS call, but final payload seam not frozen.
- **Potential integration checkpoint:** found, only partially source-verified; not operationally verified.
- **Competing feasible implementation routes:** current V4 constraints leave one plausible bounded route, two rejected counterexamples.
- **Real S-grade production Pack:** none evidenced.
- **Study economics:** limited inspection to active JS, V4, migration043, existing semantic contract and checkpoint. No architecture or coding commitment.
- **CA next action:** independent check source/effective producer and route assumptions; decide whether accept planning IC and whether further work is economically justified.
