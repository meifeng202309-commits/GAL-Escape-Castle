# Level2 Targeted Independent Closure — Structural Remediation V1

## 1. Audit identity / baseline / scope

- Audit owner: CA
- Audit level: Level 2 — Targeted Independent Closure
- Pre-remediation finding baseline: `93bd15ca36dd985685a0706bad9ec56ba4002a6e`
- E1-tested runtime implementation: `97f5ed362c58defb45edf19c18319417cb70b93f`
- Integrated evidence/baseline commit: `891feffe558a4683ac3da67e1e6b15e902c7e592`
- CD handoff: `agent-comms/CD_to_CA_20260930T035650Z_e1-complete-integrated-baseline-level2-audit.md`
- Frozen remediation plan: `docs/plans/CD_STRUCTURAL_REMEDIATION_EXECUTION_PLAN_V0.1.md`

The integrated baseline commit adds the E1 harness/evidence on top of the exact tested runtime parent and does not alter runtime/database authority after the tested parent.

## 2. Decision

**PASS — Level2 targeted independent closure complete.**

The defined remediation finding set is closed at this gate. No new HIGH/MEDIUM structural residual was found in the changed authority/evidence boundaries.

This PASS is a technical remediation closure. It does not convert the explicitly external media/audio acceptance boundaries into verified final-media claims.

## 3. Original finding closure

| Finding | Level2 disposition | Independent closure basis |
|---|---|---|
| IDA-001 | CLOSED | Root pre-run path renders formal waiting rather than legacy Sprint1 gameplay. E1 exercises staggered joins. |
| IDA-002 | CLOSED | Formal ACT1 is role-private; E1 observes three distinct player surfaces. Legacy first-choice reveal path is no longer the formal root path. |
| IDA-003 | CLOSED | `s9_start_formal_game` owns run creation + canonical initialization in one transaction; browser execute on raw `s2_start_run` is revoked. |
| IDA-004 | DISPOSITION CLOSED | Three fresh deployed NORMAL-room reproductions did not reproduce the historical run-loss contradiction; current reproducible split-start defect was classified and closed by Package A. Exact old transient cause remains unrecoverable rather than guessed. |
| IDA-005 | CLOSED | Formal Teacher/root lifecycle was separated from legacy shadow controls in Package A; E1 drives the formal Teacher path. |
| IDA-006 | CLOSED | Repository now contains deterministic browser-driving E0/E1 coverage; E1 drives Teacher + isolated player browser contexts and records browser/network evidence. |
| PFC-001 | CLOSED | Completed run is checked as a first-class lifecycle projection before active-run dispatch; E1 proves ACT14 final reveal and reconnect. |
| PFC-002 | CLOSED | Package B projects/uses accepted-waiting state for early/private barriers; E1 includes ACT4 missing-player waiting. |
| PFC-003 | CLOSED | Sprint6 wait projection is server-derived; E1 observes ACT9/10/11/12 locked/waiting states including ENGAGE. |
| PFC-004 | CLOSED | Successful Sprint6 render clears stale status; E1 sentinel is cleared by subsequent authoritative render. |
| PFC-005 | CLOSED | Pocket/evidence is fetched independently of Sprint5 and rendered across canonical later ACTs; authoritative inspect/reconnect state closes the delayed-evidence residual. |
| PFC-006 | CLOSED FOR PLACEHOLDER-FIRST TRIAL CONTRACT | ACT4 consumes `library_unknown_door`; Main Gate consumes canonical station/watcher anchor semantics when ACTIVE and preserves readable localized station legend under governed `NO_ACTIVE_ASSET` fallback. |
| PFC-007 | CLOSED | Client renders only the server-projected three-position `act4_revealed`; E1 proves no early reveal and simultaneous three-role reveal. |
| PFC-008 | CLOSED | ACT5 terminal consequence is an observable per-player handoff; ACT6 entry requires observed handoff and all-player barrier before discussion timer starts. |

## 4. Canonical Ownership Check

PASS.

Comparison of the pre-remediation baseline to the E1-tested implementation shows no changes to protected `docs/specs/current` canonical specifications, the localization catalog, Castle Visual canon, or the asset registry. Runtime changes consume existing canonical text/anchor identities rather than authoring new protected canon.

## 5. State / authority / concurrency / reconnect / privacy

### Lifecycle/startup

`s9_start_formal_game` wraps the established run start and canonical flow initialization in one server transaction. A failed initialization rolls back the run creation. Direct browser execution of the raw run-only primitive is revoked.

### ACT5 → ACT6

The transition is not client-owned. Each player's observed handoff and entry are persisted. The run row is locked during entry. The ACT6 discussion/timer begins only after the server observes all three player entries. Reconnect reads the same persisted progress used by mutation.

### Accepted/waiting

The current player's Sprint6 accepted/locked state is derived from authoritative choice/allocation/engagement tables. ACT11 allocation progress is counted from allocations rather than unrelated choice rows.

### Pocket/evidence

Inspection requires physical ownership server-side. Inspect state is keyed by run/player/item. Front inspection and FLIP remain distinct; hidden back-only knowledge is not created by carrying or front inspection. Reconnect projects authoritative inspection/current-view/knowledge state.

### Completion

Completed-run projection is queried before active-run dispatch. E1 proves successful finalization, end reveal, and completed-run reconnect.

### Privacy

E1 demonstrates distinct role-private ACT1 surfaces. ACT4 private choices are not rendered before the three-player reveal barrier.

## 6. Regression and browser evidence

E1 is materially different from the former RPC-only blind spot:

- actual Teacher page creates/starts a room;
- three isolated browser contexts join in staggered order;
- formal ACT1 rendering is observed;
- ACT4 browser comparison/wait/reveal is observed;
- ACT5 handoff and ACT6 browser barrier are observed;
- ACT9–12 browser waiting states are observed;
- Main Gate placeholder readability is observed;
- stale Sprint6 status recovery is observed;
- ACT14 finalize response and reconnect are observed.

Canonical E1 reports 1007 Supabase RPC responses, all HTTP 200, with zero material browser errors; the favicon 404 is non-application decoration.

## 7. Codex Recurring-Error Pattern Scan

### Pattern A — Local correctness / cross-module failure
PASS. Startup, ACT5→6, and completed-run transitions have explicit server ownership and reconnect behavior; E1 traverses the browser-level handoffs.

### Pattern B — Happy-path assumptions
PASS for remediation scope. Startup is transactional; ACT6 entry uses persisted per-player state and row locking; prior package audits cover idempotent/reconnect behavior. No new remediation-created stale-request authority was identified.

### Pattern C — UI rule mistaken for server rule
PASS. Raw run start browser privilege is revoked; Pocket inspection/FLIP ownership/order are server-validated; ACT6 handoff/entry preconditions are server-validated.

### Pattern D — Current state preserved / historical evidence lost
PASS. Material transition/knowledge events preserve source/provenance; Pocket knowledge records source `pocket_inspection`; ACT6 entry/start events distinguish player transition from all-player barrier.

### Pattern E — Authority accretion
PASS. The remediation adds bounded lifecycle/wait/inspection projections rather than a second gameplay truth. Mutation and reconnect projections resolve to the same underlying formal run/player state. No protected canon was modified.

### Pattern F — Self-confirming tests
PASS with explicit residual acceptance boundaries. The remediation no longer relies solely on direct RPC tests: E1 drives real browser orchestration across the previously missed lifecycle/player-facing boundaries. E1 does not claim subjective final-media/audio acceptance.

## 8. NOT VERIFIED / external acceptance boundaries

These do not reopen the defined structural remediation finding set:

1. `shared.main_gate` v002 is repository-valid and Teacher-approved but is not ACTIVE in the live Asset Manager. E1 therefore verifies the governed placeholder-first runtime, not final Main Gate publication.
2. Four opening/ending visual assets remain explicit placeholders by plan.
3. Subjective final-media quality and real classroom audible playback remain outside deterministic E1 automation.
4. E2 blind/staggered acceptance remains the next planned acceptance phase.

## 9. Next-Scope Failure Forecast

Next authorized scope is E2 blind/staggered multi-client acceptance, not new CD feature construction.

| Risk ID | Next-scope area / interface | Why high-risk | Invariant / failure class to watch |
|---|---|---|---|
| E2-R1 | Natural staggered multi-client timing | E1 is deterministic and partly fixture-assisted after startup | Players must converge on one authoritative run/phase without manual repair |
| E2-R2 | Waiting comprehension | Technically correct locks can still confuse real players | Accepted players must understand that input was accepted and peers are pending |
| E2-R3 | Real media fallback/anchors | Main Gate is intentionally placeholder-first | Missing ACTIVE media must not hide required station semantics or block progression |
| E2-R4 | Audio autoplay/retry | Browser gesture policy is environment-dependent | Blocked/delayed audio must not corrupt formal state or trap progression |
| E2-R5 | Reconnect under natural timing | E1 verifies selected reconnect boundaries, not every human timing pattern | Reconnect must converge without duplicate actions or lost evidence |
| E2-R6 | Responsive/readability | Full-page headless evidence is not equivalent to classroom devices | Required choices/clues/waits must remain readable and actionable |

## 10. Ownership / next action

```text
LEVEL2 = PASS
STRUCTURAL REMEDIATION TECHNICAL CLOSURE = PASS
NEXT_OWNER = CD
NEXT_ACTION = proceed only with the already-defined E2 blind/staggered acceptance preparation/execution path and explicit external media-state handling under existing governance
```

No new implementation defect is being returned to CD at this gate.
