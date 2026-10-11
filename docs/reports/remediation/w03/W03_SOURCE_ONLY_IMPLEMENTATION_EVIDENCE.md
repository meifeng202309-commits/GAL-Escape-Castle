# W03 source-only implementation evidence

Timestamp: 2026-10-11T15:45:00Z
Baseline: `cf6cf03` plus bounded implementation delta
Authorization: `agent-comms/CA_to_CD_20261011T151500Z_w03-bounded-source-only-implementation-release.md`

## Result

The authorized W03 source package is implemented. `database/070_w03_combined_grab_leave.sql` is additive and **UNAPPLIED**. PostgreSQL compilation/execution, concurrent fixture behavior, deployed catalog and live acceptance remain `NOT_RUN` / `NOT_VERIFIED`.

## Exact changed paths

- `database/070_w03_combined_grab_leave.sql`
- `src/game/app.js`
- `tests/w03-combined-action-static-check.js`
- `tests/w03-combined-action-browser.mjs`
- this report, one CD-to-CA handoff, and `docs/logs/CD_ACTION_LOG.csv`

No existing migration, localization source, schema owner outside S3B, asset, Teacher UI or unrelated package was changed.

## Source-level transaction and authority reasoning

The new `s3b_grab_and_leave(text,text,uuid,uuid)` is one `SECURITY DEFINER` statement transaction. It authenticates with `s1_get_player_by_session`, locks the expected active `game_runs` row, and checks a S3B-owned receipt before phase/already-complete guards. The receipt primary key is `(run_id,player_id,client_request_id)` and a unique `(run_id,player_id,action_key)` prevents a second logical combined action under another UUID.

The function does not duplicate item or progress ownership. It invokes the repository-established internal `s3b_grab_pre014` and `s3b_leave_start_room_pre014` mutations inside its transaction. Those retain:

- mandatory role-item writes;
- migration-009's false-to-true `grab_complete` trigger, which adds the Flashlight only when `gitte_flashlight_found` exists;
- first-meeting and phase guards;
- the migration-008 run serialization trigger;
- leave location/progress mutation and the existing third-Player Discussion barrier.

The combined wrapper itself writes exactly the two canonical context-bound events with the same request UUID as interaction/client identity. Any delegated exception rolls back events, item/progress changes, Discussion and receipt together. It stores the complete committed response only after both delegated mutations succeed.

The new public RPC is granted only to `anon,authenticated`; its receipt table is inaccessible to client roles. Existing public two-step RPCs and all relevant pre014/pre011 helpers are explicitly revoked from `public`, `anon`, and `authenticated` after cutover.

## Replay, conflict and recovery scenarios

- Same UUID/canonical payload: returns stored result plus `idempotent_replay=true` before checking already-complete state.
- Reused UUID with different action/payload: explicit conflict; no mutation.
- New UUID after a committed combined action: explicit already-committed rejection; unique action receipt also prevents a second commit.
- Stale expected run: rejected after active-run lock and before receipt/mutation.
- Lost response: `requestIdentity` retains the same UUID in `sessionStorage`; the browser mock proves a failed response followed by click retry sends the identical UUID.
- Confirmed success: UUID is cleared only after RPC success; refreshed canonical state removes the button.
- Reconnect/new tab: `s3b_get_player_state` canonical `grab_complete/left_start_room/location` suppresses the action independently of client storage.
- Legacy partial state (`grab_complete` XOR `left_start_room`): rejected rather than fabricating a combined receipt or duplicating one canonical event. Deployment must occur with no in-flight partial W03 action; this remains an explicit rollout condition.

## UI cutover

`renderSprint3b` now renders one `s3b_grab_and_leave` button only when both canonical flags are false. It uses approved existing localization key `act02.022` (Dutch and Chinese included), carries the server-projected run ID, and reuses `requestIdentity`. The displaced GRAB/leave button markup is absent. No optional-item choice or shell behavior was invented.

## SQL negative/concurrency matrix

| Vector | Expected result | Evidence tier |
|---|---|---|
| Normal GAL-A/B/C | mandatory items; both flags/events; corridor; receipt | SOURCE_STATIC_ONLY |
| Discovered Flashlight | included only through existing fact-gated trigger | SOURCE_STATIC_ONLY |
| Undiscovered Flashlight | absent; client sends no item selection | SOURCE_STATIC_ONLY + browser payload PASS |
| Same UUID retry | stored result; no new events/Discussion | SOURCE_STATIC_ONLY |
| Same UUID conflict | rejected before mutation | SOURCE_STATIC_ONLY |
| New UUID after commit | already-committed rejection | SOURCE_STATIC_ONLY |
| Missing UUID/run UUID | rejected before mutation | SOURCE_STATIC_ONLY |
| Wrong/stale run | rejected under locked active-run identity | SOURCE_STATIC_ONLY |
| Wrong phase / unlocked first meeting | rejected; transaction rolls back provisional effects | SOURCE_STATIC_ONLY |
| Failure in GRAB or leave | both events, mutations and receipt roll back | PostgreSQL execution NOT_RUN |
| Concurrent second/third Players | existing game/run locks serialize barrier | design/source review only; DB concurrency NOT_RUN |
| Two simultaneous final calls | existing `NOT EXISTS` barrier under run serialization yields one Discussion | design/source review only; DB concurrency NOT_RUN |
| Direct old/public/internal RPC | revoked for client roles | SOURCE_STATIC_ONLY; effective ACL NOT_RUN |
| Lost response retry | same request UUID resent | PASS, intercepted browser |
| Reconnect after commit | canonical state removes button | PASS, intercepted browser confirmed-success refresh |
| Legacy partial state | no button after refresh and server rejects direct combined call | SOURCE_STATIC_ONLY; rollout condition |

## Commands and results

```text
node --check src/game/app.js
PASS

node tests/w03-combined-action-static-check.js
W03 combined action static checks passed.

bundled Node + Playwright tests/w03-combined-action-browser.mjs
W03 combined action mocked browser behavior passed.

node tests/sprint3b-remediation-static-check.js
Sprint 3B remediation static checks passed.

node tests/sprint7-static-check.js
Sprint 7 static contract checks passed.

node tests/level3-remediation-static-check.js
Level3 remediation static checks passed.

node --check tests/w03-combined-action-browser.mjs
PASS

git diff --check
PASS
```

## Honest limits and next gate

Migration 070 has not been parsed or executed by PostgreSQL. Function ownership, effective ACL, transaction rollback, lock ordering, real duplicate calls, corrupt rows, Discussion cardinality and live UI behavior are not database/live verified. B1 migration 069 remains separately unapplied and `NOT_RUN`; W03 does not depend on it.

Required next owner is CA for independent source/test audit. Any SQL execution, deployment, migration application or correction requires a separate gate.

