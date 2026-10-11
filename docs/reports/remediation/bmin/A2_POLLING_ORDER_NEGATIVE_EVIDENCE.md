# A2 Teacher Polling Order Negative Evidence

Timestamp: 2026-10-11T08:40:00Z  
Baseline: `848c06c4b4327d3253ab5fcdcac9e30b32f678f9`  
Authorization: `agent-comms/CA_to_CD_20261011T083800Z_bmin-preflight-a2-ordering-test-only.md`

## Changed test surface

- `tests/bmin-teacher-polling-order-negative.mjs`

No production source, SQL, migration, RPC, grant, existing test, deployment, or live database state changed.

## Executor

The test reuses the repository's existing Playwright/browser pattern and serves the checked-out Teacher page from a local HTTP server. All RPC traffic is intercepted. It uses no real credentials and performs no gameplay or database mutation.

Command:

```powershell
$env:NODE_PATH='C:\Users\59743\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules'
& 'C:\Users\59743\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' tests/bmin-teacher-polling-order-negative.mjs
```

## Deterministic ordering

1. Trigger the first `loadOperationsState` through the existing Refresh control.
2. Hold its mocked `s7_get_teacher_console` response as the distinguishable `older` frame.
3. Trigger a second refresh and return the distinguishable `newer` frame first.
4. Assert the Teacher operations DOM contains `location-newer`.
5. Release the older response.
6. Assert the final DOM contains `location-older` and no longer contains `location-newer`.

## Result

```text
REPRODUCED: older Teacher operations response overwrote the newer confirmed frame.
exit code: 0
```

The exit code is zero because this is a negative reproducer: its passing condition is successful proof of the current stale-commit defect.

## Disposition

- A2 stale-commit race: `REPRODUCED_SOURCE_BROWSER`
- Deployed manifestation: `NOT_VERIFIED`
- B1: STOPPED before implementation as required by CA
- A2 production correction: NOT AUTHORIZED

## Narrow A2 release proposal

Proposed production path:

- `src/teacher/teacher-console.js` only
- retain the existing 1.2-second polling interval and existing RPC calls;
- add one Teacher operations request generation/epoch owned by `loadOperationsState`;
- only the latest started generation may call `renderOperationsState` or commit operations status/error UI;
- do not add cancellation infrastructure, new endpoints, extra polling, SQL, or shared state engines;
- preserve manual refresh behavior and export selection semantics.

Proposed test path:

- reuse `tests/bmin-teacher-polling-order-negative.mjs` as the regression oracle;
- after correction, invert the terminal expectation so the newer confirmed frame remains after the older response settles;
- add assertions that a stale failure cannot replace newer success and that the latest request still reports failures.

Rollback is a Git revert before deployment. No database rollback is involved.

STOP if the correction requires changing RPC behavior, polling cadence, B1 projection semantics, export selection, or any file beyond the released Teacher source and focused test/evidence surfaces.

