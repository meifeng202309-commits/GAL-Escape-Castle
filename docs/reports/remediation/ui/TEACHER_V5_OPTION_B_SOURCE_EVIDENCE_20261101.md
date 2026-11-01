# Teacher Console V5 Option B source evidence

Timestamp: 2026-11-01T15:11:58Z  
Implementation baseline: `7db24f0c89e69f2d6290bb928870f8217e419b66`  
Validated head: `f08c04a8b7f0d4e4af3d04a3d0bfd03e22f174d2`

## Scope and result

CD implemented the CA-authorized source-only Clean Room Option B contract. The unapplied migration074 now preserves all gameplay rows, truthfully marks the exact expected active run `interrupted`, rotates a room-owned session generation, expires all Player sessions and requires fresh joins before the existing formal-start boundary creates a distinct run.

The Player session lookup rejects a token whose generation no longer matches its room. Client state clears stale sessions and run-scoped caches on expiration or run identity change. Teacher Console no longer exposes the destructive export-gated reset contract; it calls the expected-run-bound non-destructive prepare RPC. Legacy room history is labelled as history rather than current-run evidence.

No production SQL, migration, deployment, Pages change, credential access, room mutation or row deletion occurred. Migration074 remains unapplied and production release remains outside this handoff.

## Validation

- JavaScript syntax: `src/game/app.js` and `src/teacher/teacher-console.js` — PASS.
- `tests/teacher-v5-option-b-static-check.js` — PASS.
- `tests/teacher-console-v5-static-check.js` — PASS.
- `tests/v4-player-integration-static-check.js` — PASS.
- `tests/teacher-console-v5-browser.mjs` — PASS; prepare RPC observed, released-player projection rendered, responsive evidence refreshed.
- `tests/v4-player-integrated-browser.mjs` — PASS.
- GitHub Actions `Teacher V5 Option B disposable PostgreSQL gate`, run 41319920798 — PASS: migrations 001–073 replayed, revised 074 applied in PostgreSQL 16, then two distinct runs verified interruption semantics, generation rotation, stale-token rejection, stale expected-run rejection, one-active-run invariant, historical-row retention and no Pocket/chat/vote leakage into Run B.

CI evidence: https://github.com/meifeng202309-commits/GAL-Escape-Castle/actions/runs/41319920798

## Ownership boundary

Protected canonical requirements and role-owned specifications were not edited. The implementation is ready for CA focused audit against the authorized Option B envelope. CA remains responsible for any audit disposition and for any later production-release workflow.
