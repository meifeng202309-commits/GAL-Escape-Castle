# B1 Behavioral Evidence and Source-contract Residuals

Timestamp: 2026-10-11T10:30:00Z
Baseline reviewed: `42ee9c4` plus bounded R1/R2 correction delta
Authorization: `agent-comms/CA_to_CD_20261011T103000Z_bmin-b1-two-residuals-bounded-correction.md`

Only the authorized unapplied `database/069_bmin_teacher_operational_projection.sql`, the two existing B-min tests, and this report were modified. Teacher production JS, historical migrations, producer schemas and grants were unchanged.

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

The two source-contract residuals are corrected at source-static level:

1. `discussion_or_vote_state` no longer consumes legacy `submitted`. S3B binds to the newest canonical `discussion_sessions` row for the active `current.phase_key` and to that session's `runtime_player_decisions`; S5 binds to `s5_run_state.phase_key/vote_round`, `s5_rounds`, and the Player's matching `s5_votes`; S6 binds to `s6_run_state.phase_key/round_no` and matching `s6_choices`. The projection exposes only activity/submission state, never choice values. Missing or unrecognized owner records map to explicit `UNKNOWN_UNAVAILABLE_*` states; non-discussion/non-vote S6 phases map to `NOT_APPLICABLE`.
2. Direct Player joins to role-keyed `s6_engagements` and `s6_station_tasks` were removed. Scalar lateral aggregates match both the Player and allocated role, detect the inverse contradictions (same Player/wrong role and same role/wrong Player), and detect duplicate allocation of one role across Players. Contradictions yield `INVARIANT_BREACH`, `UNKNOWN` task/engagement state and a specific reason code. Every lateral aggregate returns at most one row, so the room-player aggregate remains exactly one item per Player under malformed relationship rows.

These claims are `SOURCE_STATIC_ONLY`: PostgreSQL compilation and execution against constructed corrupt rows remain `NOT_RUN`. The browser mock executes rendering of the resulting S6 `INVARIANT_BREACH` plus `UNKNOWN` operational states, not the SQL producer logic.

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

Additional privacy vector: PASS in browser mock for undeclared operations secret not rendered; source review confirms R1 reads only row existence/status and not choice values. Real NORMAL database privacy remains NOT_RUN.

## R1/R2 bounded correction verification

- R1 provenance: `discussion_sessions` + `runtime_player_decisions` (S3B), `s5_run_state` + `s5_rounds` + `s5_votes` (S5), and `s6_run_state` + `s6_choices` (S6). All reads are constrained by `active_run_id` and current owner phase/round/session identity.
- R2 provenance: unique per-Player `s6_allocations` plus scalar counts over role-keyed `s6_engagements` and `s6_station_tasks`. Duplicate-role allocation and bidirectional role/Player disagreement are explicit invalidity paths.
- Negative source-contract cases: duplicate allocation role, engagement Player/wrong-role, engagement role/wrong-Player, task Player/wrong-role, and task role/wrong-Player are asserted structurally by the static test and mapped to explicit SQL reason codes. This does not claim SQL execution.
- Authentication and authorization boundary is unchanged: the preserved pre-069 Teacher function still authenticates and supplies the legacy response; the wrapper retains `security definer`, `search_path=public`, revokes public execution, and grants only `anon,authenticated` as before.

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
