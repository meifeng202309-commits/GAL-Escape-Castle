# Phase 0A — IDA-004 live diagnosis

Date: 2026-09-27

## Reproduction

Three fresh NORMAL rooms were created through the deployed root Teacher page. Each run used four isolated browser contexts (Teacher plus Gitte, Anna, and Linda), and all three players joined through the deployed root player page before the Teacher clicked **Start formal run**.

Across all three runs:

- `s2_start_run` returned HTTP 200;
- the Teacher displayed `Run started: <run_id>` and the run badge displayed `NORMAL`;
- all three player projections reported the same active `run_id`;
- before the separate initialization action, each `s3b_get_player_state` response reported `active=true` with `scene=null`, `flow=null`, and `me=null`;
- `s3b_initialize_flow` then returned HTTP 200 and all three role-private ACT1 opening surfaces became reachable.

The earlier `Run started → No active run → No active formal run` contradiction did **not** reproduce. The effective current database contract is internally consistent at the run layer. The reproducible defect is instead the committed half-start between the two independent Teacher transactions.

## Classification

IDA-004 is classified as an old-deployment/transient observation whose original exact cause cannot be recovered from the current deployment. No speculative repair of `s2_start_run` or active-run lookup is justified.

The evidence does justify Package A's narrower source correction: the product start action must wrap `s2_start_run` and `s3b_initialize_flow` in one server transaction so no committed half-start is observable. Migration 059 provides that wrapper without changing either established authority function.

## Evidence

Machine-readable reports and full-page screenshots are under `docs/reports/remediation/structural-v1/e0/`. Passing baseline rooms:

- `E0127028`
- `E07D35B5`
- `E0BAE8EF`

The reports also confirm the separate E0 baseline failures: legacy Sprint1 is root-reachable before formal start, and the split startup state is root-reachable after the Teacher start click.
