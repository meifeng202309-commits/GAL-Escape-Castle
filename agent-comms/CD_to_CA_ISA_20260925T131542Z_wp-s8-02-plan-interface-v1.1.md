# CD -> CA + ISA: WP-S8-02 black-box plan and interface v1.1

FROM: CD
TO: CA, ISA
TIMESTAMP_UTC: 2026-09-25T13:15:42Z
SUBJECT: WP-S8-02 Class B development plan and verification interface v1.1
STATUS: PLAN_INTERFACE_REVIEW_REQUESTED

work_package_id: `WP-S8-02`
interface_id: `S8_FINAL_CLOSURE_V1`
interface_version: `1.1`
failed_baseline: `ec44c36e6ceaadf796e38ad2cd75c8a17fd8d884`
next_migration: `049`

This exact package is addressed simultaneously to CA and ISA. It defines observable
semantics and ownership only. It does not prescribe SQL structure, lock order, helper
decomposition or implementation algorithm.

## 1. Work breakdown and dependency graph

### WP-S8-02-CD-A — actual-path integrity authority

```text
owner: CD
starts_after: PLAN_INTERFACE_APPROVED
needs_contract_from: S8_FINAL_CLOSURE_V1 sections 2 and 5
produces_for: finalization authority and ISA negative/acceptance harness
blocks: integrated closure of S8-CA-001
does_not_block: ISA scaffolding that is signature-neutral
integration_point: migration049 integrity verifier + s8_finalize
fallback_if_ISA_artifact_is_late_or_rejected: CD implements equivalent contract-level regressions and records the allocation deviation
```

### WP-S8-02-CD-B — run-bound finalization authority

```text
owner: CD
starts_after: PLAN_INTERFACE_APPROVED
needs_contract_from: S8_FINAL_CLOSURE_V1 section 3
produces_for: player client and ISA stale/concurrency harness
blocks: integrated closure of S8-RC-001
does_not_block: integrity-verifier implementation after approval
integration_point: migration049 RPC signature + player finalization call
fallback_if_ISA_artifact_is_late_or_rejected: CD implements equivalent stale-run and same-run concurrency regressions
```

### WP-S8-02-CD-C — schema-version authority

```text
owner: CD
starts_after: PLAN_INTERFACE_APPROVED
needs_contract_from: S8_FINAL_CLOSURE_V1 section 4
produces_for: exporter/finalization event and ISA consistency harness
blocks: integrated closure of S8-RC-002
does_not_block: CD-A and CD-B after approval
integration_point: migration049 durable finalization metadata + export/state projections
fallback_if_ISA_artifact_is_late_or_rejected: CD implements equivalent durable/output/event consistency regressions
```

### WP-S8-02-ISA-V — verification support

```text
owner: ISA
starts_after: PLAN_INTERFACE_APPROVED and CD publishes the approved callable/test seam signatures
needs_contract_from: S8_FINAL_CLOSURE_V1 sections 2-5
produces_for: CD integration review
blocks: only the preferred independent verification artifact; never blocks CD authority implementation
does_not_block: CD migration049 implementation and deployment preparation
integration_point: isolated static/live/transactional regression artifacts; CD reviews before activation
fallback_if_ISA_artifact_is_late_or_rejected: CD supplies equivalent tests; no product authority transfers to ISA
```

## 2. Integrity verification contract

### 2.1 Observable obligation states

Every actual-path obligation resolves independently to exactly one state:

- `present` — the phase-specific durable evidence exists and is internally attributable;
- `not_applicable` — the authoritative taken path proves the obligation did not apply and
  the report carries a stable reason code;
- `invalid_teacher_override` — an exact field/phase invalidation exists in governed Teacher
  override provenance, including the affected semantic field and reason;
- `missing_technical_evidence` — required evidence is absent, corrupt, belongs to another
  phase/run, or can only be inferred from an unrelated aggregate.

Finalization succeeds only when every obligation is `present`, `not_applicable`, or
`invalid_teacher_override`. Any `missing_technical_evidence` rejects finalization and leaves
completion/export flags false.

An override never turns unrelated missing evidence into present evidence. Acceptance requires
an exact governed invalidation for the same semantic obligation.

### 2.2 Required actual-path obligations

The report must independently account for:

- ACT1: each of the three players' first choice, lock timestamp and timing validity;
- ACT2: each first-meeting choice/timestamp/validity plus the ACT2 meeting discussion's own
  resolved outcome and its attributable final-round evidence;
- ACT3: authoritative puzzle resolution and at least one attributable correct attempt;
- ACT4: each private route choice/timestamp/validity plus the authoritative group route;
- ACT5 post-inspection vote: three attributable player votes only when the inspect-first path
  was taken; otherwise `not_applicable: inspect_first_path_not_taken`;
- ACT6: its own resolved round/outcome and the three votes attributable to that effective
  resolution; ACT7/ACT8 rows cannot satisfy ACT6;
- ACT7: its own successful `clock_c` resolution round and three attributable votes; prior
  wrong rounds remain history but cannot substitute for the successful round;
- ACT8: three locked private choices; the final-vote obligation is `not_applicable` only when
  all three choices are identical and that identical value is the direct-route value
  `main_gate` or `west_tower`, so the route is canonically resolved without a final vote.
  Unanimous `compare` or `follow_group` never satisfies this condition. In every other path,
  ACT8 requires its own resolved final-vote round and three attributable votes. The stable
  reason code for the direct-route case is `unanimous_direct_route`;
- ACT9: each of the four canonical Great Hall console steps actually advanced through must
  independently have an attributable effective resolved round/action, three attributable
  player submissions for that effective round when it is a three-player decision, and exact
  step/round identity. The obligations are: first-door activation; Red enter/do-not-enter;
  next-door activation; Blue enter/stay. Prior no-consensus rounds, wrong actions, resets and
  retries remain history but cannot substitute for another step's effective resolution. The
  final successful Great Hall progression state is separately required. No global ACT9 count
  may satisfy any step;
- ACT10: three locked private TAKE/LEAVE first choices; the ACT10 discussion/final-vote phase
  belonging to this run; three attributable final-vote submissions for its effective final
  vote; and the authoritative TAKE/LEAVE outcome with matching downstream branch state. Only
  an exact governed Teacher Override replacing the ACT10 final-vote obligation may account for
  that obligation as `invalid_teacher_override`. ACT9 rows, ACT8 rows, ACT10 private choices or
  unrelated discussion/vote totals cannot substitute for ACT10 final-vote evidence;
- ACT11-13: three allocations, branch-applicable station tasks, three engagements, three ACT12
  pressure choices, successful mechanism resolution and ACT14 boundary state;
- no still-open canonical discussion belonging to the run;
- branch-specific Station C evidence or `not_applicable: golden_key_watcher_path`;
- each emitted audio occurrence has a consumption or the existing explicit
  `partial: playback_not_observed` analytical status.

No run-wide resolved-discussion count or total vote count may satisfy a phase-specific
obligation.

### 2.3 Verification result

The CD-owned verifier returns a structured report containing:

```text
verified: boolean
obligations: stable obligation key -> { state, reason_code?, evidence_identity? }
```

The verifier is not executable by browser roles. CD may expose a postgres-only/revoked
verification seam for transactional regression inspection. This does not create Teacher or
player mutation authority.

## 3. Finalization request identity contract

### 3.1 Public input

The finalization RPC adds required input:

`p_expected_run_id uuid`

The player client derives it only from the authoritative Sprint6/ACT13 state payload and scopes
its durable browser request identity to that `run_id`.

### 3.2 Server binding

Authentication remains room-level player-session authentication, but mutation authority is
bound to `p_expected_run_id` and that run's room.

Observable semantics:

- expected run is the current active ACT14-ready run: attempt finalization;
- expected run is already finalized: return successful replay for that same run, even if a
  later run is active in the room;
- expected run belongs to another room: reject;
- expected run is not finalized and is no longer the room's active run: reject with stable
  stale-run semantics (`STALE_FINALIZATION_RUN` or equivalent stable error code/message);
- omission/null expected run: reject; no fallback to current room-active run;
- the response `run_id` always equals `p_expected_run_id` on success/replay.

### 3.3 Retry and concurrency

- same run + same request ID: idempotent replay;
- same run + concurrent distinct request IDs: one durable finalization and all callers converge
  to success/replay for that run;
- Run A request arriving while Run B is active/ready can only replay finalized Run A or reject;
  it can never inspect/mutate/finalize Run B;
- Run B uses an independently run-scoped request identity.

No internal locking strategy is part of this contract.

## 4. Export schema-version authority contract

The durable `s8_finalizations.export_schema_version` value is the single authority for a
finalized run.

For migration049 effective exports:

- authoritative version: `1.1`;
- migration049 reconciles existing Sprint8 finalization rows produced under the effective 1.1
  export shape to durable `1.1`;
- newly finalized rows persist `1.1` explicitly;
- JSON header consumes the durable row value;
- finalization-state projection exposes the same durable value;
- `session_finalized` event emits the same value;
- no exporter/event/state path independently hardcodes a conflicting version.

Observable regression requires equality across durable finalization metadata, finalization
state, JSON header and finalization event for the same run.

## 5. ISA verification interface

After approval, CD will publish the finalized signatures above before ISA writes
dependency-sensitive assertions.

ISA may implement:

- static assertion that player and RPC include required `p_expected_run_id` and no room-active
  fallback exists for an omitted expected run;
- same-run concurrent/retry preservation harness;
- cross-run sequence: finalize A, start B, replay/delay A and prove response/replay is A while B
  remains unmodified;
- transaction-scoped SQL regression that removes/corrupts one phase-specific evidence set at a
  time, invokes the CD-owned non-browser verifier/finalizer seam, verifies rejection/reporting,
  and rolls back;
- acceptance cases for every contract-defined `not_applicable` reason including
  `unanimous_direct_route` only for three identical direct-route choices, plus an exact governed
  Teacher override invalidation;
- version equality across the approved observable projections.

ISA must not define additional obligations, reason meanings, RPC authority, schema changes,
fixture mutation authority or version policy. Any missing observability is
`BLOCKED_NEEDS_CD_DECISION`.

## 6. Security, persistence and side effects

```text
authority_owner: CD
persistence_effect: migration049 may update finalization version metadata and replace Sprint8 functions
security_boundary: player identity remains session-derived; expected run is validated server-side; verifier remains unavailable to anon/authenticated
idempotency_expectation: section 3.3
allowed_extension_points: isolated tests/fixtures/static validators within ISA allocation
forbidden_changes: canonical sources; migrations by ISA; Sprint9/10; Behavior Trace/prediction; new Teacher/player evidence-corruption authority
```

## 7. Approval request

CA: perform the requested narrow delta review of the ACT8/ACT9/ACT10 corrections while
preserving the previously accepted sections. Return `PLAN_INTERFACE_APPROVED` or a bounded
correction.

ISA: review the same package for implementability. Do not begin dependency-sensitive work
until CA returns `PLAN_INTERFACE_APPROVED`; report only genuine missing contract/observability
as `BLOCKED_NEEDS_CD_DECISION`.

NEXT_OWNER: CA
NEXT_ACTION: Governance review of `S8_FINAL_CLOSURE_V1` and disposition.
