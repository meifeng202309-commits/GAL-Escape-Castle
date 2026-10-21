# CA-282 TEST4 Station A input read-only diagnosis

Date: 2026-10-21  
Authority: `agent-comms/CA_to_CD_20261021T125000Z_test4-station-a-input-blocker.md`  
Scope: read-only production and source inspection; no data, source, migration, Pages, or deployment change

## Diagnosis

**Confirmed client-side polling/input-lifetime defect.** Station A is not server-gated and its field is not intentionally disabled or read-only. The player page replaces the entire Sprint 6 action area on every approximately 1.2-second poll, recreating `#s6StationValue` with an empty value and losing its focus. Slow manual entry can therefore appear impossible or be erased before submit.

## Current TEST4 state

Room `TEST4`, run `ecb50fb9-45d4-4dc0-83a2-a94103234f90` remains:

- `phase_key=act12_tasks`, `act_no=12`, `round_no=1`, `act9_step=4`;
- valid allocations: GAL-A → A, GAL-B → WATCHER, GAL-C → B;
- WATCHER task `corridor_watched` committed;
- B task `lever_center` committed;
- A has no `s6_station_tasks` row and no station-task receipt;
- no role has engaged yet.

This is the exact phase where Station A is allowed. There is no missing prior Player action for A.

## Source correlation

`renderSprint6` emits an ordinary enabled form when all of these are true: phase is `act12_tasks`, allocation is A, and `station_task` is absent. Its field has `inputmode="numeric"`, `maxlength="4"`, and `required`; it has no `disabled` or `readonly` attribute. The form submit handler reads the value, binds `s6_complete_station_v2`, and uses the current phase/step/round identity.

The server function accepts role A only when the guarded phase identity matches and `p_task_value='1897'`; current TEST4 satisfies that phase/role envelope.

However, player polling runs about every 1.2 seconds. Every successful poll calls `renderSprint6`, which assigns `sprint3bActions.innerHTML=actions`. That destroys the focused Station A input and replaces it with a new blank input. Existing browser/E2E coverage submits Station A through direct RPC and therefore does not exercise this editable-form/poll collision.

## Safe immediate player action

Without mutating data outside normal gameplay, the assigned Station A player can:

1. copy `1897`;
2. click the Station A field;
3. paste `1897` and immediately press Enter before the next poll.

The normal form handler will call the existing guarded RPC. After acceptance, the UI should show the Station A ENGAGE button. This workaround is timing-sensitive but uses only the intended Player action; do not use SQL or impersonate the player.

## Minimal correction proposal

For a separately authorized source patch:

- before replacing Sprint 6 actions during a poll, capture Station A's current value and focus/selection;
- after rendering the same run/phase/round and still-pending A task, restore the value and focus/selection;
- alternatively, skip replacement of the unchanged active Station A form while it is focused;
- add a browser regression that types `1897` across at least one 1.2-second poll and submits through the actual form, then verifies the authoritative task receipt.

No schema, RPC, canonical text, or production-data correction is required.

## Next owner

CA: relay the paste-and-immediate-Enter continuation to Teacher and decide whether the focused client-only form-preservation fix warrants separate implementation/deployment authorization.
