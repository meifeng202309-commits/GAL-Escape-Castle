# CD -> CA: WP-S8-02 focused Level 1 re-audit request

FROM: CD
TO: CA
TIMESTAMP_UTC: 2026-09-25T13:58:19Z
SUBJECT: Sprint8 final-closure integrated baseline ready for focused Level 1 re-audit
STATUS: FOCUSED_LEVEL1_REAUDIT_REQUESTED

work_package_id: `WP-S8-02`
interface_id: `S8_FINAL_CLOSURE_V1`
interface_version: `1.1`
implementation_baseline: `3d357ddc42e8232246bf649b5cb63a3e7ecea1fc`

## Requested disposition

Please re-audit only the three findings left open by the prior focused audit:

- `S8-CA-001` — actual-path integrity authority;
- `S8-RC-001` — run-bound finalization authority;
- `S8-RC-002` — durable export-schema-version authority.

No Sprint9/10 or canonical content change is included.

## Integrated implementation

- `database/049_sprint8_final_closure.sql`
  - structured phase-specific verifier;
  - required `p_expected_run_id uuid` finalization input;
  - same-run replay/concurrency and stale-run isolation;
  - durable schema version `1.1` projected to state, export and event;
- `database/050_sprint8_act2_verifier_projection_fix.sql`
  - exact ACT2 meeting discussion/final-round identity;
- `database/051_sprint8_station_c_obligation_projection.sql`
  - independent Station C / `golden_key_watcher_path` obligation;
- `database/052_sprint8_exact_player_override_accounting.sql`
  - per-player override attribution for ACT1/ACT2/ACT4;
  - an override cannot mask another player's missing evidence;
- `src/game/app.js`
  - ACT13/14 authoritative run ID supplied to finalization;
  - request identity scoped to that run;
- ISA verification artifacts integrated and reviewed:
  - `tests/sprint8-final-closure-contract-static-check.js`;
  - `tests/sprint8-final-closure-live-e2e.js`;
  - `tests/sprint8-final-closure-integrity-transaction.sql`.

## Deployment and evidence

Deployed to the project database in order: `049`, `050`, `051`, `052`.

PASS:

- all repository `*static-check.js` suites;
- existing Sprint8 AUDIT live E2E;
- existing Sprint8 NORMAL live E2E;
- ISA final-closure live E2E;
- ISA PostgreSQL transactional integrity matrix, fully rolled back.

The dedicated live harness proves exact override reporting, all three applicable
`not_applicable` reason codes, omitted/null run rejection, same-run convergence, Run A replay
after Run B starts, and version equality across durable state / JSON / finalization event.

The transactional matrix removes each targeted phase's evidence independently and requires
`missing_technical_evidence`; it also proves that one player's exact ACT1 override cannot hide
another player's evidence loss.

## Ownership

CD implementation and integration work for WP-S8-02 is complete. The baseline is frozen for
this audit request.

NEXT_OWNER: CA
NEXT_ACTION: Perform focused Level 1 re-audit of S8-CA-001, S8-RC-001 and S8-RC-002 and return PASS or bounded findings.
