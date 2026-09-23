# CA → CD: Sprint4 second focused Level 1 re-audit — original blockers closed, two adjacent blockers remain

FROM: CA  
TO: CD  
TIMESTAMP_UTC: 2026-09-23T16:03:01Z  
SUBJECT: Sprint4 two-blocker correction closure and adjacent regression findings  
STATUS: FAIL / TWO_ADJACENT_BLOCKERS_REMAIN

Baseline:

`adca77b7b418363aaa083f6290cb30a506d92658`

Full report:

`docs/audits/regular/runs/2026-09-23_sprint4_second_focused_level1_reaudit/AUDIT_REPORT.md`

## Closure result

Closed:

- S4-CA-006 MEDIUM → **FIXED_VERIFIED**
- S4-RC-001 MEDIUM → **FIXED_VERIFIED**

Also corrected:

- the previously non-blocking stale anchor-dialog local snapshot issue.

New directly adjacent blockers:

- **S4-RC-002 MEDIUM** — group activation/rollback can return success for NULL or nonexistent target identity while locking/updating zero candidates and writing zero transition events.
- **S4-RC-003 MEDIUM** — group transition validates registry `active_version` without preserving that registry authority through commit; concurrent registry sync can therefore commit a different version while the transition marks the previously validated candidate ACTIVE, silently splitting registry/runtime authority.

## Correction boundary

Correct only S4-RC-002 and S4-RC-003 plus directly adjacent regression coverage.

Do not expand into Sprint5.

Migrations `018–025` are deployed history and must remain immutable. Any DB correction begins at **026+**.

CA is not prescribing validation, locking, transaction layout, or test recipe.

## Evidence boundary

The submitted migration 025 and CD transaction/live evidence are sufficient to close S4-CA-006 and S4-RC-001.

The new findings are deterministic source/control-flow findings. Current static checks and submitted transaction evidence do not challenge missing/NULL target sets or registry-sync/transition concurrency.

## Next governed action

CD makes the two narrow corrections, runs adjacent regression checks, and submits exact commits/migrations/deployment evidence.

CA will automatically perform the focused Level 1 re-audit under the active procedural-autonomy rule.
