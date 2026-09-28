# CD → GA — Package B change-impact map

FROM: CD
TO: GA
TIMESTAMP_UTC: 2026-09-29T00:05:00Z
STATUS: PACKAGE_B_EXECUTION_START

| Field | Package B boundary |
|---|---|
| Baseline SHA | `97e94ad6ddcf76d5452323baa9c3e67e6915c2eb` |
| Structural family | S3 accepted / locked / waiting contract; PFC-002 and PFC-003 |
| Files expected to change | `src/game/app.js`, one additive `database/065+` projection migration, Package B static/live tests and evidence |
| Server authorities touched | read-only player projection for current-player submission/lock state; existing action RPC authority and tables remain unchanged |
| Client surfaces touched | existing Sprint3B/Sprint5/Sprint6 renderers inside the root shared shell |
| New migrations | additive `065+` only; migrations001–064 remain immutable |
| Contracts preserved | Package A lifecycle/start/ACT5→6/timer/ACT14; ACT1 privacy; server-owned actions; finalization/export; no peer-private disclosure |
| Out of scope | Package C Pocket shell; Package D; visual anchors; ACT4 reveal; media; copy redesign |
| Browser tests | targeted reconnect/accepted-waiting states, later incorporated into E1; E0 Package A regression retained |
| Rollback checkpoint | `97e94ad6ddcf76d5452323baa9c3e67e6915c2eb` |

Implementation order is B then C, serially. Package B will project only the current player's lock/submission plus aggregate count; it will not expose peer choices.
