# B-min B0 Read-only Evidence

Timestamp: 2026-10-11T08:31:00Z  
Branch: `remediation/sprint9-structural-v1`  
Baseline inspected: `fef20a9c7cad4e3dd146cd64580ab4df7b0559e0`  
Authorization: `agent-comms/CA_to_CD_20261011T083000Z_bmin-b0-read-only-evidence-release.md`

No database mutation, Teacher RPC call, private-state read, runtime/test edit, deployment, or credential acquisition was performed.

## Evidence tiers

### SOURCE_STATIC

- Repository migration ceiling is `068_package_c_authoritative_pocket_inspection.sql`; `069` is unused.
- `database/043_sprint7_teacher_console.sql` first defines `public.s7_get_teacher_console(text,text)` and `database/044_sprint7_focused_level1_corrections.sql` is the repository-last definition.
- The 044 function is `SECURITY DEFINER`, authenticates with `s1_assert_teacher`, selects the active run from `game_runs`, and joins every projected domain through that same `g.run_id`.
- 044 revokes EXECUTE from `public` and grants EXECUTE to `anon,authenticated`. No explicit `ALTER FUNCTION ... OWNER TO ...` appears in 043/044, so repository source does not establish the effective deployed owner.
- Each Teacher player row still emits `player_location` directly from `s3b_player_progress`. `src/teacher/teacher-console.js::renderOperationsState` renders this legacy field directly.
- S3B owns per-player `player_location`, `act6_handoff_observed_at`, and `act6_entered_at`. During the ACT5-to-ACT6 barrier, each entering player is changed to `portrait_hall`; S5 is prepared before all players enter, but its `act6_entered_at` and ACT6 discussion/scene activation occur only when the third player enters.
- S5 owns ACT6-8 phase/vote state. A prepared S5 row is therefore not sufficient to take physical-location authority from S3B.
- S6 is created only after S5 reaches `phase_key='complete'`; it owns ACT9-13 phase state, allocations, engagements, station tasks, and branch flags. Station A/B/C/WATCHER is assignment/task state, not a physical location.
- Existing data is run-scoped. The Teacher function selects one active `game_runs` row and uses the same `g.run_id` for S3B, S5, S6, choices, events, Pocket, audio, and export projections.
- The current Teacher poller uses `setInterval(loadState,1200)` and has no epoch, generation, or single-flight commit guard. `loadOperationsState` can therefore render an older response after a newer response. This is a source-static race possibility, not deployed reproduction.

### DEPLOYED_VERIFIED

- None. The available publishable client cannot read PostgreSQL catalog state.
- A read-only request to the deployed PostgREST OpenAPI endpoint returned `Secret API key required`. No secret/service-role/database credential is available in the authorized environment.
- Consequently, deployed function body, overload set, owner, effective privileges, applied-migration ceiling, and current S3B/S5/S6 rows are `NOT_VERIFIED`.

## Existing-field feasibility

The existing owner-local fields can support a bounded read projection without a new persistence mirror:

1. S3B remains authoritative through ACT5 and during partial ACT6 entry.
2. Activated S5 may own the common Portrait Hall / Clock Room / ACT8 route phase only after the all-player entry marker; prepared S5 must not own location.
3. Valid S6 after completed S5 owns ACT9-13 phase, assignment, engagement, and task status. Assignment must remain separate from physical location.
4. Missing or contradictory owner rows must produce explicit invalidity rather than silently falling back.

This supports the concept of a consumed Teacher operations projection, but B0 does not freeze the proposed `operations_v1` key set. Exact payload names and reason codes remain a B1 release-contract decision.

## A2 polling disposition

The stale-commit risk is source-static and can be falsified without database mutation by a future intercepted browser test that resolves two `s7_get_teacher_console` requests in reverse order and asserts only the newest frame commits. Existing tests do not establish that guarantee. No test was edited under B0.

## Narrowed B1 proposal

If CA releases B1 after deployed catalog access is resolved or explicitly accepts source-only implementation:

- first perform authorized deployed catalog verification; stop on any source/deployed mismatch;
- use one additive migration only, preserving `s7_get_teacher_console(text,text)` and its Teacher-token boundary;
- derive the consumed per-player operations projection from existing S3B/S5/S6 owner rows under one active `run_id`;
- do not add a state mirror, new public endpoint, extra poll, private-choice exposure, or gameplay mutation;
- update only Teacher operations rendering to consume the projection in the same implementation package;
- keep A2 separate: if a deterministic reverse-order test fails, stop B1 integration and request the bounded A2 release;
- cover ACT2, mixed ACT5-to-ACT6 entry, third-player activation, ACT11 assignment/location separation, ACT12 engagement/task states, reconnect independence, privacy, contradiction invalidity, and run identity.

Rollback before deployment is a Git revert. After an additive migration is deployed, rollback requires frontend reversion plus a separately numbered compensating migration; deployed migrations remain immutable.

## STOP conditions

- deployed definition, overloads, owner, privileges, or migration ceiling differ from the repository assumptions;
- owner-local fields cannot satisfy the projection without new persisted authority or duplicated gameplay rules;
- the polling stale-commit test reproduces A2;
- privacy requires exposing unrevealed player values;
- implementation needs a new endpoint, state mirror, broad Teacher redesign, or an unlisted production surface;
- any structural, privacy, or export regression fails.
