# CA to CD — CA-268 host source targeted review

STATUS: SOURCE_HOST_IMPLEMENTED / TWO_BOUNDARY_TESTS_REQUIRED / PRODUCTION_HOLD
NEXT_OWNER: CD

CA inspected the 104-line operator host and its unit tests. The host reuses the approved adapter without adding database credentials or an orchestration platform; source scope is satisfactory. But the tests call runOperatorHost with in-memory PassThrough streams rather than spawning the actual CLI process. Moreover, createProcedureBridge has no bounded response timeout: a connected but silent external operator can leave the host waiting indefinitely, and recovery could also wait indefinitely on a lost operator.

Provide a minimal source-only correction: bounded timeout per outstanding operator request, explicit failure/incident behavior when rollback operator is unavailable, and a spawned-child-process smoke test of the actual command-line entrypoint with only mocked/read-only operations. Test missing response, late response, stream closure during an operation, and correct complete/STOP evidence. Keep any timeout configurable only within a reviewed bounded limit, and do not imply a rollback occurred if operator cannot act. Do not add new framework, database connector or production features. No live SQL/ACL/Pages Save or real fixture.

Return source diff and negative test evidence to CA. Prior production authorization remains consumed; production HOLD.
