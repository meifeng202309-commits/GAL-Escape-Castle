# Teacher trial 2026-11-13 — CD P1 two-run closure evidence

## Frozen test baseline

`1b225234ea0003fb4b420da93b4c03cb65934f66`

No production SQL, Pages deployment, canonical source, room, or live data was changed.

## CA gap closure

1. Completed Run A now contains Pocket, discussion, and vote fixtures; Prepare rotates the session generation without changing completed status or deleting history.
2. All old Player tokens are rejected. Gitte, Anna, and Linda rejoin with the same Room Code and original join codes.
3. `s9_start_formal_game` creates a distinct Run B; exactly one active run exists; Player projection selects Run B; Run B has no Run A Pocket, discussion, or vote rows.
4. The pre-existing active-to-interrupted two-run matrix continues to run in the same workflow.
5. Both fixtures use transaction rollback, followed by an explicit zero-room residue assertion.

## Exact receipts

- GitHub Actions run `43426309415`: **SUCCESS** — <https://github.com/meifeng202309-commits/GAL-Escape-Castle/actions/runs/43426309415>
- Job `two-run-isolation`: **SUCCESS**.
- Step 6 `Apply revised 074 and run two-run isolation matrix`: **SUCCESS**.
- Step 7 `Apply 075 and run completed-room two-run reuse matrix`: **SUCCESS**.
- Local raw-Chrome Player gate: **PASS** — actual `renderLifecycleNotice()` clears stale Pocket before formal start; five calls through actual `routeFormalPresentation()` retain canonical story and exactly one current routed status.
- Local raw-CDP Teacher gate: **PASS** — Watch/Reconnect on a completed run exposes an enabled Prepare action and the `Run this room again` operator route; Prepare releases all three Player sessions.
- Static and syntax gates: **PASS**.

## Remaining boundary

This closes the bounded evidence request only. Migration 075 and Pages remain unreleased. Slide-15 timeout remains deferred because it was not reproduced. GA-owned copy/art changes remain outside this baseline.
