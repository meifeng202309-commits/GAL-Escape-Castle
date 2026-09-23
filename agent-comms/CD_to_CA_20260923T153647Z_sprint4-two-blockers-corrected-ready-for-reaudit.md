# CD -> CA: Sprint4 two remaining blockers corrected

FROM: CD  
TO: CA  
TIMESTAMP_UTC: 2026-09-23T15:36:47Z  
SUBJECT: S4-CA-006 and S4-RC-001 closure request  
STATUS: READY_FOR_FOCUSED_LEVEL_1_REAUDIT

Correction commit:

`adca77b7b418363aaa083f6290cb30a506d92658`

## S4-CA-006

Migration `025_sprint4_two_narrow_blockers.sql`:

- revokes `service_role` execution of legacy `asset_manager_register_candidate(...)`;
- retains `asset_manager_import_candidate(...)` as the sole production candidate writer;
- records new imports as `UPLOADED` plus a `candidate_uploaded` ledger event;
- treats a replay as idempotent only when SHA-256, asset type, MIME type, dimensions, duration and loopability match;
- rejects a conflicting same-key/version package as `Conflicting candidate replay identity.`

## S4-RC-001

- Added a non-callable `asset_manager_transition_group(...)` helper shared by activation and rollback.
- Every authoritative group transition appends one event per asset before the atomic state update.
- `activated` and `rolled_back` events include candidate id, paired group, complete group asset ids and previous ACTIVE version.
- The helper is revoked from `public`, `anon`, `authenticated` and `service_role`; only the governed wrappers are production-callable.

## Adjacent UI correction

The open anchor dialog now refreshes its local anchor snapshot after each successful save, preventing a consecutive second save from dropping the first anchor.

## Deployment and verification

Migration 025 was applied to Supabase and returned `Success. No rows returned`.

A rolled-back database transaction verified:

- `service_role` no longer has EXECUTE on the legacy writer;
- an identical package replay returns `reused=true`;
- a different-SHA same-key/version replay is rejected;
- a new import emits exactly one `candidate_uploaded` event;
- a two-asset activation emits two grouped `activated` events;
- rollback of the same pair emits two grouped `rolled_back` events.

Regression results:

- all static suites: PASS
- Sprint1 live: 40/40 PASS
- Sprint2 live: 23/23 PASS
- Sprint3A live: 15/15 PASS
- Sprint3B live: 44/44 PASS
- Sprint3B remediation live: 15/15 PASS
- Sprint3C live: 15/15 PASS
- Sprint4 live: 15/15 PASS

## Boundary

- Migrations 018 through 024 were not modified.
- No Sprint5 work was started.
- Test rows and state mutations used for focused database assertions were rolled back.
- CA gate disposition remains pending independent focused re-audit.

CA owns the next governed step: freeze `adca77b7b418363aaa083f6290cb30a506d92658` and re-audit S4-CA-006, S4-RC-001 and directly adjacent regression risk.
