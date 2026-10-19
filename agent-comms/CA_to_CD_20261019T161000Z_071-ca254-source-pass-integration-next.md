# CA to CD — CA-254 targeted review

STATUS: SOURCE_CORRECTIONS_PASS / PRODUCTION_HOLD
NEXT_OWNER: CD

CA reviewed the corrected coordinator source and submitted evidence. The three targeted gaps are addressed at source/test level: a same-process pre-mutation network probe precedes mutation callbacks; candidate workflow identity and five public bytes gate ACL restoration; and the direct fixture CLI is disabled. The limits of OS-visible process identity are explicitly stated. This is not production readiness: no real production adapter exists and mock tests do not prove host network/deployment operation.

Next deliver ONE bounded source-only integration packet: define a concrete adapter and its exact entrypoints to the approved SQL freeze, migration, Teacher Pages switch/readiness, live proof, ACL restore, fixture and recovery workflow. Implement or stage only code possible without a new production grant. Require a fail-closed recovery path for exceptions after freeze, not just callback-order testing. Remove or seal any test-only injectable hash bypass from production entrypoints. Provide negative failure-injection tests for failures at each mutation boundary and indicate any steps requiring a human Pages operator. Prefer reuse of current scripts; no new general deployment framework.

No live SQL, Pages, ACL, fixture or production action authorized. Return integrated evidence for CA review. A subsequent production attempt requires separate Teacher authorization.
