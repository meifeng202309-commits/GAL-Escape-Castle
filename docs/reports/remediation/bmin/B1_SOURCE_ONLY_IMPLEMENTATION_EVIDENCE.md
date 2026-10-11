# B-min B1 Source-only Implementation Evidence

Timestamp: 2026-10-11T09:31:00Z  
Authorized baseline: `2809668`  
Authorization: `agent-comms/CA_to_CD_20261011T093000Z_bmin-b1-source-only-conditional-release.md`

## Changed implementation and test paths

- `database/069_bmin_teacher_operational_projection.sql` — additive, UNAPPLIED
- `src/teacher/teacher-console.js`
- `tests/bmin-teacher-operations-static-check.js`
- `tests/bmin-teacher-polling-order-negative.mjs`
- this evidence report

No migration was applied. No database, deployment, live gameplay, RPC call, grant, credential, W03, TCA Pack, or protected canonical source was changed.

## Implementation boundary

Migration 069 retains `public.s7_get_teacher_console(text,text)`, its Teacher authentication boundary, grants, same-run reads, and full legacy JSON response. The immutable 044 implementation is preserved as a non-executable internal helper; the public wrapper adds `operations_v1` and performs no gameplay/data writes.

Owner selection is limited to the frozen W05 precedence:

1. valid S6 only after completed S5;
2. activated S5 only after its ACT6 all-player entry marker and three entered S3B players;
3. otherwise per-player S3B.

Contradictory ownership returns `INVARIANT_BREACH`. Missing S3B player progress also returns explicit invalidity. Every `source_identity` carries the active `run_id` and source table.

The versioned per-player projection contains physical location, transition state, discussion/vote status, assignment role, engagement state, task state, connection state, source domain/identity, validity, and reason code. It contains no new private-choice value.

Teacher rendering now consumes `operations_v1` for operational status and physical location. The displaced legacy `player_location` UI binding is removed. Assignment A/B/C/WATCHER remains separate from physical `main_gate`.

## Source-backed vectors

SOURCE_STATIC coverage confirms:

- ACT1-5 and divergent/Library states remain S3B per-player locations;
- observed-not-entered and one/two-player ACT6 entry remain S3B transition states;
- third-player activation changes ownership to S5 Portrait Hall;
- S5 ACT7 maps to Clock Room and ACT8/S5-complete maps to Great Hall;
- valid S6 ACT9-10 maps to Great Hall;
- S6 ACT11-12 maps all players physically to Main Gate while allocations, tasks and engagements remain separate owner-table facts;
- S6 ACT13 maps to Castle Exterior;
- reconnect/online status is independent of physical location;
- invalid cross-domain milestones and missing S3B progress do not silently fall back;
- all domain reads and source identities use one active `run_id`;
- A2 same-run overlapping refresh protection remains active.

## Commands and results

```text
node tests/bmin-teacher-operations-static-check.js
PASS — B-min Teacher operational projection static checks passed.

node tests/bmin-teacher-polling-order-negative.mjs
PASS — stale same-run success/failure rejected; latest failure preserved.

node tests/sprint7-static-check.js
PASS

node tests/level2-export-selection-behavior-check.js
PASS

node tests/level3-remediation-static-check.js
PASS

node --check src/teacher/teacher-console.js
PASS

node --check tests/bmin-teacher-polling-order-negative.mjs
PASS

node --check tests/bmin-teacher-operations-static-check.js
PASS

git diff --check
PASS (line-ending conversion warnings only)
```

## Evidence limits and consistency

- SQL execution / clean replay: `NOT_RUN` — source-only gate forbids applying migration 069.
- Deployed function body, owner, overloads, ACL and migration ceiling: `NOT_VERIFIED`.
- Live ACT2, partial ACT6, ACT11/12, reconnect and privacy vectors: `NOT_RUN`.
- Browser rendering is mocked; it proves consumer cutover and A2 ordering, not deployed authority.
- The public wrapper reads a complete legacy frame first and then owner tables in the same function call, but PostgreSQL default statement snapshots and future deployment specifics require independent database verification before rollout.

## Rollback and required pre-rollout verification

Before deployment, rollback is a Git revert of the isolated B1 commit. After any future migration application, rollback requires a separately authorized compensating migration restoring the prior public function definition/grants; migration 069 must remain immutable.

Before rollout, independently verify deployed migration ceiling, existing function body/owner/ACL, clean migration replay, effective grants, all W05 live vectors, NORMAL privacy, same-run identity, browser cutover, and A2 ordering against the authorized environment.

