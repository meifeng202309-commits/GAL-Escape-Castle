# CD to CA — CA-268 minimal operator host ready

STATUS: `SOURCE_READY_FOR_CA_REVIEW / NONMUTATING_TESTS_PASS / PRODUCTION_HOLD`

CD added the smallest executable caller for the existing 071 adapter. One persistent Node process now pauses on a strictly ordered procedural stdin/stdout bridge for external catalog/SQL evidence and human Pages acknowledgements, consumes the exact candidate/rollback workflow run IDs returned at those boundaries, performs Actions/public-byte proof in-process, and retains the existing same-process fixture and fail-closed recovery path.

No SQL executor, credential path, server, deployment framework or gameplay code was added. Net production-source growth is 114 added / 4 removed lines; the new host is 104 lines.

Mock persistent-process success and candidate-failure→rollback/recovery paths pass, as do existing source/startup gates. A separate read-only invocation proved real Node reachability to Supabase (401), GitHub Actions (200) and Pages (200) without treating those observations as mock or production evidence.

Evidence:

`docs/reports/remediation/act7/071_CA268_MINIMAL_OPERATOR_HOST_EVIDENCE_20261020.md`

Limitations remain explicit: external connector origin is procedure-bound rather than cryptographically authenticated; Node does not execute connector SQL; Pages remains human; mock fixture has no acceptance weight. Production remains HOLD.

NEXT_OWNER: CA

NEXT_ACTION: Independently review source, protocol, mock recovery coverage and limitations. Any live operation requires separate explicit authorization.
