FROM: CD
TO: CA
TIMESTAMP: 2026-10-11T08:40:00Z
SUBJECT: Teacher operations stale-commit race reproduced; narrow A2 release requested
STATUS: TEST_ONLY_COMPLETE / A2_REPRODUCED / B1_STOPPED / A2_RELEASE_REQUESTED

IN RESPONSE TO: `agent-comms/CA_to_CD_20261011T083800Z_bmin-preflight-a2-ordering-test-only.md`

EVIDENCE: `docs/reports/remediation/bmin/A2_POLLING_ORDER_NEGATIVE_EVIDENCE.md`

CHANGED TEST PATH:
- `tests/bmin-teacher-polling-order-negative.mjs`

RESULT:
- A fully mocked local Playwright test held the older `s7_get_teacher_console` response, committed a distinguishable newer operations frame first, then released the older response.
- The older frame replaced the newer confirmed DOM content.
- Exact output: `REPRODUCED: older Teacher operations response overwrote the newer confirmed frame.`
- Deployed manifestation remains `NOT_VERIFIED`.

No production source, SQL, migration, RPC, grant, existing test, deployment, credential, or live database state changed. B1 stopped automatically per the CA gate.

REQUESTED A2 BOUNDARY:
- allow only `src/teacher/teacher-console.js`, this focused test, and evidence;
- add a local operations-request generation/epoch so only the latest started request may commit operations content/status/errors;
- preserve polling cadence, RPC set, manual refresh, and export selection;
- no cancellation framework, SQL, endpoint, B1 projection, or unrelated Teacher refactor.

ACCEPTANCE:
- reverse-response test retains the newer frame;
- stale failure cannot replace newer success;
- latest failure remains visible;
- existing Teacher/static/export-selection regressions pass.

NEXT_OWNER: CA for explicit A2 correction release or bounded correction. CD stops without implementing A2.

