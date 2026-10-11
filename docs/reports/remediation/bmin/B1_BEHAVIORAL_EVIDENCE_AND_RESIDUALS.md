# B1 Behavioral Evidence and Source-contract Residuals

Timestamp: 2026-10-11T10:16:00Z  
Baseline reviewed: `3524afa` plus test/evidence-only working delta  
Authorization: `agent-comms/CA_to_CD_20261011T101500Z_bmin-b1-source-audit-evidence-gap.md`

Production B1 files were not modified in this evidence-correction lane.

## Executed mocked Teacher-browser evidence

New test: `tests/bmin-teacher-operations-browser.mjs`

Executor: bundled Node.js + Playwright, repository Teacher page served over localhost, all RPCs intercepted, no credentials or backend mutations.

Executed cases:

- mixed ACT5-to-ACT6 state with two Players entered Portrait Hall and one observed/not-entered Player still at Library;
- activated S5 with all three Players physically in Portrait Hall;
- S6 ACT11 with all Players physically at Main Gate while A/B/WATCHER remain separate roles and engagement/task states;
- explicit `UNKNOWN · INVARIANT_BREACH` rendering;
- displaced legacy `player_location` independence using a `LEGACY_WRONG` sentinel;
- NORMAL privacy negative using an undeclared `DO_NOT_RENDER_SECRET` operations property.

Result: `B-min Teacher operations mocked browser cases passed.`

## Source-reference and cardinality review

The strengthened static test reads the actual S3B/S5/S6 producer migrations and confirms referenced tables/columns exist. It also checks room scoping, deterministic role ordering, run-scoped source identity, and one textual join per owner table.

Two material residuals remain and were not changed without a new CA correction gate:

1. `discussion_or_vote_state` is currently derived from legacy per-player `submitted`. It does not independently identify the active owner/phase/round and is therefore `INCOMPLETE`, not behaviorally verified.
2. `s6_engagements` and `s6_station_tasks` are keyed by `(run_id, role_key)`, not uniquely by `(run_id, player_id)`. Normal mutation functions bind these rows to allocation roles, but migration 069 directly joins both tables on player. Corrupt or contradictory rows could multiply a Player in the aggregate. Token/static checks cannot prove cardinality safety. A bounded correction should use cardinality-safe `exists`/lateral scalar reads or explicitly detect multiplicity without changing gameplay authority.

## W05 minimum-vector matrix

| # | Vector | Evidence tier | Result / executor |
|---|---|---|---|
| 1 | ACT1 divergent locations | SOURCE_STATIC_ONLY | S3B precedence and per-player location inspected; SQL not executed |
| 2 | ACT3 partial Library arrival | SOURCE_STATIC_ONLY | same S3B per-player path; SQL not executed |
| 3 | ACT5 resolved, none entered | SOURCE_STATIC_ONLY | S3B remains owner while S5 marker null |
| 4 | one Player entered ACT6 | PASS (browser mock) + SOURCE_STATIC_ONLY producer | mixed-entry UI rendering executed; SQL not executed |
| 5 | two entered, third not | PASS (browser mock) + SOURCE_STATIC_ONLY producer | exact two/one case executed |
| 6 | third entry activates S5 | PASS (browser mock) + SOURCE_STATIC_ONLY producer | all-S5 Portrait Hall UI executed |
| 7 | ACT7 Clock Room | SOURCE_STATIC_ONLY | S5 mapping inspected; SQL not executed |
| 8 | ACT8/foldback Great Hall | SOURCE_STATIC_ONLY | S5 mapping inspected; SQL not executed |
| 9 | S5 complete, S6 absent | SOURCE_STATIC_ONLY | S5 precedence inspected; SQL not executed |
| 10 | S6 ACT9/10 Great Hall | SOURCE_STATIC_ONLY | S6 mapping inspected; SQL not executed |
| 11 | ACT11 allocation open at Main Gate | SOURCE_STATIC_ONLY | physical mapping inspected; null-role behavioral SQL NOT_RUN |
| 12 | ACT11 valid allocations | PASS (browser mock) + SOURCE_STATIC_ONLY producer | Main Gate plus A/B/WATCHER executed |
| 13 | invalid allocation reset | NOT_RUN | requires producer/database execution; no stale-role behavior claimed |
| 14 | ACT12 partial ENGAGE | PASS (browser mock) | mixed engaged/not-engaged states rendered |
| 15 | ACT12 all engaged | SOURCE_STATIC_ONLY | owner tables inspected; SQL/browser exact all-engaged NOT_RUN |
| 16 | WATCHER is role, not location | PASS (browser mock) | WATCHER rendered with physical Main Gate |
| 17 | reconnect during partial ACT6 | SOURCE_STATIC_ONLY | connection is separate from location; database reconnect NOT_RUN |
| 18 | reconnect during ACT11/12 | SOURCE_STATIC_ONLY | same separation; database reconnect NOT_RUN |
| 19 | missing presentation row | SOURCE_STATIC_ONLY | operations projection does not use presentation row for location; SQL NOT_RUN |
| 20 | contradictory milestones | PASS (browser mock for UI) + SOURCE_STATIC_ONLY SQL | invalidity display executed; producer SQL NOT_RUN |

Additional privacy vector: PASS in browser mock for undeclared operations secret not rendered; real NORMAL database privacy remains NOT_RUN.

## Exact commands and results

```text
node tests/bmin-teacher-operations-static-check.js
PASS

node tests/bmin-teacher-operations-browser.mjs
PASS

node tests/bmin-teacher-polling-order-negative.mjs
PASS

node tests/sprint7-static-check.js
PASS

node tests/level2-export-selection-behavior-check.js
PASS

node tests/level3-remediation-static-check.js
PASS
```

Deployed catalog, SQL compilation/replay, migration execution, real producer behavior, grants and live browser behavior remain `NOT_VERIFIED` / `NOT_RUN`.

