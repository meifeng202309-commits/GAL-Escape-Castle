# CD -> CA: Sprint4 adjacent blockers corrected

FROM: CD  
TO: CA  
TIMESTAMP_UTC: 2026-09-23T16:31:07Z  
SUBJECT: S4-RC-002 and S4-RC-003 closure request  
STATUS: READY_FOR_FOCUSED_LEVEL_1_REAUDIT

Correction commit:

`7ce7821f988ef33d495629508fc0d4e18ff4f527`

## S4-RC-002

Migration `026_sprint4_group_target_and_registry_lock.sql` makes exact target identity a precondition of transition:

- NULL arrays, empty arrays and NULL elements are rejected;
- duplicate candidate ids are rejected;
- resolved candidate count must exactly equal input cardinality before and after lock acquisition;
- nonexistent and partially resolved sets are rejected;
- rollback inherits the same authoritative helper checks and cannot acknowledge a zero-row transition.

## S4-RC-003

- The transition helper resolves target asset keys and locks every corresponding `asset_registry_projection` row in stable asset-key order.
- It then locks candidate rows in the same stable order.
- Registry authorization, event insertion and ACTIVE/SUPERSEDED mutation therefore occur while the canonical registry rows remain locked through commit.
- `asset_manager_sync_registry(...)` updates the same projection rows and cannot commit a conflicting active version during that boundary.

## Deployment and focused evidence

Migration 026 was applied to Supabase and returned `Success. No rows returned`.

The committed regression fixture `tests/sprint4-026-db-regression.sql` passed its seven-case rejection matrix:

- NULL array;
- empty array;
- NULL element;
- duplicate id;
- nonexistent id;
- partially resolved set;
- rollback with nonexistent id.

A two-session concurrency test was also executed:

1. session A performed a valid `shared.library` transition inside a transaction, then held it open with `pg_sleep(20)`;
2. session B set `lock_timeout='1s'` and attempted to update the same registry projection row;
3. session B failed with SQLSTATE `55P03`, `canceling statement due to lock timeout`, while updating `asset_registry_projection`;
4. session A completed with `ROLLBACK`, leaving no test mutation.

## Regression results

- all static suites: PASS
- Sprint1 live: 40/40 PASS
- Sprint2 live: 23/23 PASS
- Sprint3A live: 15/15 PASS
- Sprint3B live: 44/44 PASS
- Sprint3B remediation live: 15/15 PASS
- Sprint3C live: 15/15 PASS
- Sprint4 live: 15/15 PASS

## Boundary

- Migrations 018 through 025 were not modified.
- No Sprint5 work was started.
- CA gate disposition remains pending independent focused re-audit.

CA owns the next governed step: freeze `7ce7821f988ef33d495629508fc0d4e18ff4f527` and re-audit S4-RC-002, S4-RC-003 and directly adjacent regression risk.
