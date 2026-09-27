# FINDINGS — Master Findings List

Baseline: `93bd15ca36dd985685a0706bad9ec56ba4002a6e`

| Issue ID | Severity | Status | Problem description | Evidence / reproduction | Code file(s) | Symbol / function / line range | Baseline SHA | Violated invariant / risk | Recommended fix | Audit method | Owner | Fix commit | Re-test result |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| IDA-001 | HIGH | CONFIRMED | Root player exposes legacy Sprint1 gameplay before formal run | Teacher PPT + deterministic refresh branch | src/game/app.js; src/content/scenes.js; database/001_sprint1_core.sql | refreshState 139–171; renderState 527–560; scenes 1–21 | 93bd15ca... | formal product must not treat legacy prototype as canonical pre-run | Root pre-run surface must remain non-gameplay until canonical formal state is authoritative | M1,M3,M5,M7,M9 | CD | — | pending |
| IDA-002 | HIGH | CONFIRMED | Legacy root path reveals all three first choices player-to-player | s1 phase→revealed + player projection + renderer; Teacher PPT | database/001_sprint1_core.sql; src/game/app.js | s1_get_player_state 273–336; s1_submit_private_choice 340–406; renderState 534–560 | 93bd15ca... | player-to-player unrevealed first-choice isolation | No player-facing legacy reveal may stand in for canonical ACT1 | M1,M3,M5,M7,M9 | CD | — | pending |
| IDA-003 | HIGH | CONFIRMED | Formal startup is split into start-run then initialize-flow, exposing an invalid intermediate state and a conflicting generic-discussion window | deterministic UI/RPC trace | src/teacher/teacher-console.js; src/game/app.js; database/002_runtime_runs_discussion.sql; database/014b_sprint3b_targeted_closure_corrections.sql | startRun 116–130; initializeSprint3b 132–136; refreshState 152–166; s2_start_run 167–226; s3b_initialize_flow 10–36 | 93bd15ca... | one recoverable server-authoritative startup boundary | Formal start must not leave players/operator in a state where active run exists but canonical ACT1 is unavailable | M1,M2,M3,M5,M8 | CD | — | pending |
| IDA-004 | HIGH | NOT_VERIFIED | Teacher live session showed Run started + No active run + initialize says No active formal run, which static contract cannot produce under one consistent deployed DB | original Teacher PPT | deployed Teacher runtime vs source | live evidence; source s2_start_run/s2_get_active_run/s2_get_teacher_state | 93bd15ca... | deployed runtime must match committed authority state | Reproduce and identify deployment/state divergence before trial release | M4,M5,M8,M9 | CD | — | pending live reproduction |
| IDA-005 | MEDIUM | CONFIRMED | Production Teacher Console exposes legacy Sprint1 Advance/Reset shadow-state controls beside formal controls | root Teacher HTML/JS | teacher.html; src/teacher/teacher-console.js; database/001_sprint1_core.sql | UI legacy controls; advanceScene 339–348; resetRoom 350–360; s1_reset_room 559–580 | 93bd15ca... | operator must have one coherent formal control surface | Formal trial surface must not invite legacy state mutations that are unrelated to current run | M1,M2,M3,M5,M7 | CD | — | pending |
| IDA-006 | MEDIUM | CONFIRMED | Test suite does not exercise the actual browser startup path; direct-RPC fixtures bypass the faulty pre-run and split-start states | no browser harness; Sprint3B/Level3 fixtures call start+init directly | tests/* | sprint3b-live fixture 7; level3 closure fixture 4–18; repo has 0 browser-harness files | 93bd15ca... | tests must falsify orchestration, not only RPC internals | Add product-level browser/startup regression coverage that fails if legacy root flow is exposed or startup splits | M6 | CD / CA re-test | — | pending |
| IDA-007 | OBSERVATION | NOT_VERIFIED | Post-CA-130 media candidates are source-consistent/reachable, but final live publication/ACTIVE state cannot be independently established from this CA runtime | registry/sidecars/tree + no later CD integration evidence | assets/asset-registry.json; assets/staging/* | all 28 latest sidecars present; latest binaries non-zero; only repo registry shared.library active=1 | 93bd15ca... | final Sprint9 asset runtime readiness | Complete/verify CD runtime publication separately; this does not block placeholder-based diagnosis by itself | Phase A media audit / M4 | CD | — | live ACTIVE state not verified |

---

## IDA-001 — Legacy Sprint1 exposed before formal run

The root client deliberately executes the legacy renderer whenever `s2_get_player_state.active` is false. Room creation already creates Sprint1 Scene1 collecting state, so the first joined player receives gameplay rather than waiting.

Deterministic control-flow proof; no live database access required.

## IDA-002 — Legacy player-to-player first-choice reveal

After three legacy choices, Sprint1 sets phase to `revealed`; player state then returns all decisions; root renderer prints all three. This is exactly the behavior shown in Teacher evidence.

The formal ACT1 implementation itself does **not** have this defect.

## IDA-003 — Split formal startup

Teacher Console exposes two separate actions and server transactions. Between them:
- `game_runs.status=active`;
- canonical Sprint3B state may not exist;
- player client selects formal branch then fails missing scene;
- generic Sprint2 discussion remains server-legal because canonical state is not yet present, and if opened it explicitly blocks initialization.

This is a Pattern-A cross-module ownership failure, not just a UX issue.

## IDA-004 — Live deployment/state divergence

The source contract says a successful `s2_start_run` inserts an active row before returning. A subsequent `s2_get_teacher_state` should see it, and `s3b_initialize_flow` should find it.

Teacher evidence contradicts that expected chain.

Possible causes are deliberately **not** guessed. Live Supabase/deployment inspection is required.

## IDA-005 — Legacy Teacher shadow controls

`Advance scene` and `Reset room` remain on the production Teacher page. They mutate only legacy Sprint1 state, while formal run state is separate and preserved. That makes the controls operationally misleading and creates two visible state systems.

## IDA-006 — Browser orchestration coverage gap

The direct-RPC E2E tests are valuable for server contracts, but they cannot detect which renderer the root browser chooses or what is visible between two manual Teacher actions.

The first real Teacher browser test falsified this assumption immediately.

## IDA-007 — Media runtime readiness not independently verified

Independent source checks found:
- all 28 registry identities have latest-version sidecars;
- all latest-version binary files are Git-reachable and non-zero;
- reviewed latest candidates are internally metadata-consistent;
- Portrait pair/group/anchors are represented;
- Main Gate v002 is present;
- mechanism-clang repaired binary size is 11745 bytes matching the repair handoff context.

CA cannot independently recompute binary SHA-256 through the current GitHub text connector, nor query live Asset Manager ACTIVE rows. This is therefore NOT VERIFIED, not a confirmed integrity defect.

---

# Integration Checkpoint I

Reconciled system model + mutation registry + invariant matrix:
- no extra generic DiscussionRoom server-bypass finding; migration013 fails closed after canonical state exists;
- legacy root exposure and split startup remain independent defects;
- Teacher legacy controls are a separate operational authority-accumulation risk.

# Integration Checkpoint II

Reconciled DB/RPC source + cross-layer traces + tests:
- source-level RPC guards are stronger than the UI alone;
- the dominant gap is orchestration coverage, not missing server guards inside established canonical phases;
- IDA-004 remains deployment-effective NOT VERIFIED rather than being assigned a speculative source root cause.

# Integration Checkpoint III

All nine method artifacts reconciled:
- 3 HIGH confirmed source/product defects: IDA-001/002/003;
- 1 HIGH live inconsistency with root cause NOT VERIFIED: IDA-004;
- 2 MEDIUM confirmed operational/coverage findings: IDA-005/006;
- 1 OBSERVATION / NOT VERIFIED media-runtime status: IDA-007.

No additional ACT2–ACT14 integrity defect was confirmed.

# Recurring Patterns A–F

- **A — local correctness / cross-module failure: FINDING.** `s2_start_run` and `s3b_initialize_flow` are locally coherent but their product handoff is invalid: IDA-003.
- **B — happy-path distributed assumptions: FINDING.** startup assumes the second action follows immediately; live session also demonstrates a state divergence requiring deployed reproduction: IDA-003/004.
- **C — UI rule mistaken for server rule: PASS for generic DiscussionRoom.** Migration013 independently enforces canonical-flow exclusion server-side. Legacy Teacher controls remain real server-authorized shadow controls and are covered by IDA-005.
- **D — current state vs historical evidence: FINDING impact.** accidental legacy pre-run behavior is room-scoped, outside formal run evidence, so human-visible "first actions" can exist outside the formal behavior dataset: IDA-001/002.
- **E — authority accretion: FINDING.** legacy Sprint1 state + formal run state coexist on root player/Teacher surfaces: IDA-001/005.
- **F — self-confirming tests: FINDING.** direct-RPC fixtures skip the faulty browser orchestration: IDA-006.

# Canonical Ownership Check

**PASS** for the post-CA-130 media interval.

No evidence was found that CD invented new Teacher/VA-owned visual/audio semantics. CD's Main Gate v002 work consumed the exact approved VA handoff and mechanical parameters; VA/Teacher review ownership remained separate; CD retained publication/ACTIVE authority.
