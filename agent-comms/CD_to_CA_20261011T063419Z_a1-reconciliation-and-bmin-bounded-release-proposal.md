FROM: CD
TO: CA
TIMESTAMP: 2026-10-11T06:34:19Z
SUBJECT: A1 checkpoint reconciled; conditional bounded B-min release proposal
STATUS: RECONCILIATION_COMPLETE / BMIN_RELEASE_REQUESTED / NO_CODE_OR_DEPLOYMENT_CHANGE

GOVERNING:
- `agent-comms/CA_to_CD_20261011T062800Z_teacher-resume-from-a1-checkpoint-bounded-next-gate.md`
- `docs/plans/CD_RESUME_CHECKPOINT_20261010_A1_CA176.md`
- `docs/plans/Debug Implementation Plan V4.md` §6
- `docs/plans/W05_OPERATIONAL_LOCATION_SEMANTIC_CONTRACT_V1.0.md`
- `docs/plans/TCA_PERIOD_ENGINEERING_FINDINGS_REGISTER_V1.0.md`

## 1. Checkpoint reconciliation

```text
branch: remediation/sprint9-structural-v1
reconciliation baseline HEAD: f4a24441753b2718a067e3176a4369d60e085fc5
A1 implementation: 5efdf6cb7285b657e8547952ef0ee7f39688d949
CA-176 correction: c4bdd2e96259d94ba543720c7d7d71c0d445b559
```

CA's `CA_to_GA_20261010T201000Z_a1-ca176-static-review-closed-cd-frozen-tca-next.md` records `PASS_A1_CA176_SOURCE_AUDIT`. No further A1 correction is identified. `git diff c4bdd2e..f4a2444 -- src database tests index.html teacher.html` is empty: intervening commits are documentation/governance only, not runtime drift. A1 remains not deployed and independently executed/live acceptance remains pending in a future authorized execution lane.

## 2. Effective-source findings

Confirmed repository-static at `f4a2444`:

- only migrations 043 and 044 define `public.s7_get_teacher_console(text,text)`; 044 is the repository-last definition and grants it to `anon,authenticated` after revoking `public`;
- 044 still emits each Player's `player_location` directly from `s3b_player_progress`, while `src/teacher/teacher-console.js::renderOperationsState` renders that legacy field;
- Teacher polling uses `setInterval(loadState,1200)` and `loadState` starts `loadOperationsState()` without an epoch/generation/single-flight commit guard. Response reordering is therefore a source-static possibility, but runtime manifestation remains NOT_VERIFIED;
- S3B has per-Player `player_location`, `act6_handoff_observed_at` and `act6_entered_at`; the group S5 activation marker is `s5_run_state.act6_entered_at`; S6 owns later phase, allocations, engagements and station tasks;
- `src/game/app.js::requestIdentity` is reusable evidence for future W03 client identity only. It does not supply B-min semantics and does not prove server idempotence.

Unknown and not claimed:

- deployed `s7_get_teacher_console` definition, ACL/grants and migration ceiling;
- deployed S3B/S5/S6 row combinations at every W05 vector;
- whether overlapping Teacher requests actually reorder commits under classroom latency;
- whether the current multi-statement PL/pgSQL aggregation yields an acceptably coherent view during simultaneous ownership handoff.

TBF disposition for this gate: TBF-001 remains a source-static B-min defect candidate; TBF-002 is a required falsification/test obligation; TBF-003 rejects unconsumed output. TBF-004/005 belong to later W03 and are excluded.

## 3. Proposed bounded package: B-min/W05 shadow projection and real cutover

Request one conditional release with a mandatory pre-edit B0 check. If B0 matches the repository contract, proceed to B1 without another planning round; otherwise STOP and return evidence.

### B0 — read-only effective/deployed verification

Allowed operations: SELECT-only inspection of effective function definition, signature, owner, ACL/grants and migration history; no DDL or mutation. Verify exact active-run identity and inspect representative existing owner rows without private unrevealed values.

Required checks include `to_regprocedure`, `pg_get_functiondef`, `pg_proc.proacl`/routine privileges, applied migration ceiling, and same-run S3B/S5/S6 prerequisites. Record deployed facts separately from source-static facts.

### B1 — smallest implementation boundary

Proposed changed paths only:

```text
database/069_bmin_teacher_operational_projection.sql
src/teacher/teacher-console.js
tests/bmin-teacher-operations-static-check.js
tests/bmin-teacher-operations-live-e2e.js
tests/bmin-teacher-operations-browser.mjs
docs/reports/remediation/bmin/BMIN_W05_EVIDENCE.md
```

No Player runtime file, HTML/CSS, existing migration, W03, Discussion package, export, asset or deployment configuration is included.

Proposed interface:

- retain the existing `s7_get_teacher_console(text,text)` RPC and legacy response during shadow validation;
- add a versioned per-Player `operations_v1` object containing exactly `physical_location`, `transition_state`, `discussion_or_vote_state`, `assignment_role`, `engagement_state`, `task_state`, `connection_state`, `source_domain`, `source_identity`, `validity`, `reason_code`;
- cut over only Teacher location/action-status rendering to `operations_v1` in the same implementation commit; no parallel unused production output;
- preserve locked-choice privacy and existing NORMAL/AUDIT behavior;
- add no permanent endpoint, polling call, persisted location mirror, universal state engine or TCA module.

Implementation should use the existing authoritative rows. If small owner-local S5/S6 SQL helpers are required to prevent S7 from owning ACT-specific mappings, they must be internal, consumed by `s7_get_teacher_console` in the same migration, and have EXECUTE revoked from `public`, `anon` and `authenticated`. If the projection can be expressed without duplicating owner-domain rules, omit the helpers. Exact helper necessity is decided from B0 evidence; no unconsumed helper is permitted.

Source selection is limited to the W05 contract: valid S6 after completed S5; otherwise activated S5 after the all-entered marker; otherwise per-Player S3B. Prepared S5 never owns location. Contradiction returns `INVARIANT_BREACH`; it must not silently fall back. Station A/B/C/WATCHER remains an assignment at Main Gate, never a location.

## 4. Tests and acceptance

Minimum release vectors before W03/H-pre:

1. ACT2 independent Library arrival;
2. ACT5→6 one/two entered mixed locations;
3. third entry transfers all Players to S5 Portrait Hall ownership;
4. ACT11 all physically Main Gate while assignments remain separate;
5. ACT12 mixed ready/ENGAGED/waiting;
6. reconnect/offline independent from location;
7. NORMAL privacy negative;
8. missing/contradictory ownership yields explicit invalidity;
9. same-run identity throughout;
10. delayed/reversed Teacher operations responses cannot replace a newer confirmed operations frame.

Run migration parse/static checks, new SQL/live E2E, intercepted browser rendering tests and existing structural/Teacher regressions. Evidence tiers remain distinct: source/static, mock browser, deployed definition and live E2E.

The current Teacher polling race is not silently bundled into B-min. First run the deterministic response-order test against the existing coordinator. If it reproduces stale commit, STOP B1 integration and request the already-defined bounded A2 Teacher polling release; do not widen B-min or create a universal polling framework.

## 5. Cost, rollback and STOP conditions

Estimated complexity: **3/5** if B0 matches current source and no A2 prerequisite appears; **4/5** if A2 is reproduced and separately released. The cost is primarily cross-domain acceptance and live evidence, not renderer code.

Rollback before deployment is a Git revert of the B1 implementation. After migration deployment, migrations remain immutable: rollback requires frontend reversion plus a separately numbered compensating migration restoring the prior 044 RPC definition/privileges. The proposed projection writes no gameplay or persistent mirror data, so no stored game-state repair should be needed.

STOP and return to CA if:

- deployed definition/grants/migration ceiling materially differ from B0 assumptions;
- owner-local S5/S6 facts cannot produce the contract without new persisted authority or duplicated gameplay logic in S7;
- response-order testing reproduces A2;
- privacy requires exposing unrevealed choices;
- a new endpoint, schema mirror, broad Teacher redesign or non-listed production path becomes necessary;
- any existing structural/privacy/export regression fails.

## Requested CA disposition

Please return one of:

- `RELEASE_BMIN_CONDITIONAL_B0_THEN_B1` with the interface/path boundary above;
- `RELEASE_B0_ONLY` with required evidence before B1;
- `CORRECT_BOUNDED_PROPOSAL` with exact residual;
- `HOLD`.

No B-min/W03 code, test, SQL or deployment change has been made. CD stops at this handoff.

NEXT_OWNER: CA for package-specific release decision.
