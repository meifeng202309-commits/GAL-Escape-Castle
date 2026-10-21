# CA-282 Pages-only deployment PASS

Date: 2026-10-22 (Asia/Shanghai)  
Authority: `agent-comms/CA_to_CD_20261022T001000Z_ca282-pages-only-deployment-authorized.md`  
Outcome: **PASS — Station A client fix is live**

## Exact release

- Previous Pages branch: `deploy/act7-071-20261017`
- Previous Pages commit / rollback: `6e3bbd1d2795bd4486b1437a0b9e107e2238fa28`
- Released Pages branch: `deploy/ca282-station-a-20261022`
- Released commit: `0a5dd20ed90cee44f7bab9be4d4a2f822b4b5297`
- Pages folder: `/(root)`
- GitHub Pages workflow: `39638434841`
- Workflow conclusion: `success`
- Workflow created: `2026-10-21T16:50:49Z`
- Workflow completed: `2026-10-21T16:51:45Z`

The deployment branch was created from the exact prior live commit. Its complete delta is one file only:

- `src/game/app.js`: 3 insertions, 1 deletion

The changed lines match the reviewed Station A patch from `3769195` exactly. No test, documentation, SQL, migration, localization, unrelated UI, or data change entered the Pages candidate.

## Safety preflight

Read-only production preflight at `2026-10-21T16:46:55Z` found:

- players seen within 15 minutes: 0;
- rooms with player activity within 15 minutes: 0;
- latest player activity: `2026-10-21T13:10:02.277970Z`;
- TEST4 latest activity: the same timestamp.

TEST4 remained historically active but was not touched. No Supabase write, reset, RPC mutation, SQL, or migration occurred.

## Served-byte verification

The public served file and the raw file at release commit `0a5dd20` were fetched independently after the successful Pages workflow:

- path: `/src/game/app.js`
- byte length: `63011`
- candidate SHA-256: `08fe252c114dd8c52b0eb933c945f1b60318b834cbd2c690c78dd7b9bf18ac8e`
- served SHA-256: `08fe252c114dd8c52b0eb933c945f1b60318b834cbd2c690c78dd7b9bf18ac8e`
- exact match: PASS

## Focused public-page smoke

A headless Chrome loaded the real public Pages URL and the real served JavaScript. Every Supabase RPC request was intercepted and answered by an isolated in-memory ACT12 Station A model, so the smoke neither read nor mutated production data.

PASS sequence:

1. pending Station A form rendered;
2. entered `18` and waited 3.2 seconds, spanning multiple normal 1.2-second polling cycles;
3. value `18` and input focus remained intact;
4. entered `97` and pressed Enter;
5. real form handler emitted guarded `s6_complete_station_v2` with value `1897` to the intercepted mock;
6. authoritative completed-task projection replaced the field with the ENGAGE control.

Result: `CA282 public Pages Station A smoke passed.`

## Closure

The bounded Pages-only release succeeded. Rollback was not required. Production Pages now uses `deploy/ca282-station-a-20261022` at `0a5dd20`; the database remains unchanged. Next owner is CA for the single focused deployment disposition and Teacher continuation decision.
