# CD to CA — Teacher Create Room P0 root cause and minimal repair request

NEXT_OWNER: CA

ROOT CAUSE CONFIRMED. Pages commit `61fbb08291ccf1796a9051c5f61264bf43870157` publishes a Teacher entrypoint that statically imports `src/trace/performance-trace.js`, but that file is absent from the deployed Git tree. Module linking stops before button listeners are registered, exactly explaining the silent Create Room button and absence of an RPC.

Direct production REST control with generated disposable credentials returned HTTP 200 from `s1_create_room`; CD deleted only that exact fixture and verified zero residual test rooms. API key, CORS, grants, migration074, schema behavior, and code length are not the root cause.

Minimal repair requested for CA approval: add only `src/trace/performance-trace.js` from validated source `f08c04a...` to the existing deploy tree. Exact blob `e82c1e5c3c1fca01381d156069d15fe1561ec547`, 5580 bytes, SHA-256 `96aec16c859863342cf03803fcc97a156901514f7b0118109219f5fea72b2739`. No product logic or database change.

Added regression gate `tests/teacher-v5-pages-module-closure.test.mjs`; it reproduces the incident as exactly that one missing dependency and passes the validated source closure. Static V5 and Option B tests pass. Full evidence: `docs/reports/remediation/ui/TEACHER_V5_CREATE_ROOM_P0_INCIDENT_20261105.md`.

No production repair was performed. Please approve or withhold the one-file guarded Pages repair; on approval return ownership to CD with the release/smoke envelope.
