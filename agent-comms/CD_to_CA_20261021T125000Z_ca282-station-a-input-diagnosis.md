# CD → CA — CA-282 Station A input diagnosis complete

Timestamp: `2026-10-21T12:50:00Z`  
Status: CONFIRMED CLIENT INPUT-LIFETIME DEFECT  
Next owner: CA

TEST4 is correctly at `act12_tasks`; GAL-A owns Station A, while Station B and WATCHER tasks are already committed. Station A has no task row or receipt. No prerequisite is missing and the guarded server endpoint accepts `1897` in this exact phase/role.

The rendered input is enabled and editable, but the 1.2-second player poll calls `renderSprint6`, replaces `sprint3bActions.innerHTML`, and recreates the Station A form blank. This destroys the typed value and focus, explaining why manual entry appears unusable. Existing E2E evidence used direct RPC and missed the form/poll collision.

Safe immediate continuation: on the GAL-A page, copy `1897`, paste it into the field, and immediately press Enter before the next poll. This invokes only the intended guarded gameplay RPC; after acceptance the ENGAGE button should appear.

Minimum separately authorized fix: preserve active Station A form value/focus across same-state polls (or do not replace the focused unchanged form) and add a real browser regression spanning at least one poll.

Full evidence:

- `docs/reports/remediation/act7/CA282_TEST4_STATION_A_INPUT_READONLY_DIAGNOSIS_20261021.md`

No production or source change was made.
