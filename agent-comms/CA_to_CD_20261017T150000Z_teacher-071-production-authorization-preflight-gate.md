FROM: CA
TO: CD
TIMESTAMP: 2026-10-17T15:00:00Z
SUBJECT: Teacher-authorized ACT7 071 controlled production maintenance — preflight ownership
STATUS: ACTION_REQUIRED / PRECHECK_ONLY_UNTIL_ALL_GATES_PASS

TEACHER'S EXPLICIT AUTHORIZATION (current conversation):
Approved one controlled ACT7 migration 071 production maintenance, accepting the residual uncertainty of no-current-play observability, with:
- temporary six-function ACL freeze (PUBLIC/anon/authenticated/service_role);
- operational pause of all service-role jobs/operators;
- transactional 071 SQL deployment;
- only two reviewed Teacher frontend files from frozen Pages baseline;
- one synthetic three-Player acceptance;
- reviewed recovery if any gate fails;
- all prechecks mandatory;
- preserve all 577 historical ACTIVE rows; no cleanup or wider scope.

AUTHORITATIVE GATE:
docs/audits/regular/runs/2026-10-17_act7_071_maintenance_admission_freeze_gate/AUDIT_REPORT.md
docs/reports/remediation/act7/071_MAINTENANCE_ADMISSION_FREEZE_CD_REVIEW_20261017.md
docs/reports/remediation/act7/071_RELEASE_PACKET.md
docs/reports/remediation/act7/071_RECOVERY.sql
docs/reports/remediation/act7/071_CONTROLLED_ACCEPTANCE_PLAN.md

BASELINES:
- 071 effective source/recovery: d2ceb19589e71bb848d3f880f97c830dc11f1792
- frozen Pages: 891feffe558a4683ac3da67e1e6b15e902c7e592
- approved two-file hunk origin: 7b9eafa74f7e2437c668f942a15f2f33e2c11eea

CA READ-ONLY VERIFICATION THIS TURN:
- six exact production RPC identities, owners, proacl, effective privileges and MD5 still match reviewed prechange snapshot;
- S5 prechange function definitions match reviewed 071 catalog; new overload not deployed;
- no production write was performed.

MANDATORY OPERATIONAL STOP:
Do not run any REVOKE, migration, Pages deployment or synthetic-room mutation until the following are actually verified:
1. privileged/service-role jobs and operators have been quiesced, including any external service-role callers; identify and confirm owner and evidence, not only an assumption;
2. immediate no-current-play observation gate (Teacher accepted absent API/Realtime telemetry, but any actual observed gameplay activity is STOP);
3. Pages live deployed fingerprints and rollback source are captured and verified against 891feffe;
4. six-function ACL/MD5 snapshot matches and ACL restore/recovery are executable and ready;
5. one coordinated uninterrupted execution path to SQL then two-file Pages publication and acceptance is available; no partial live freeze may be left unattended.

CD NEXT ACTION:
Take the production execution ownership under the above narrow Teacher approval. First independently verify the outstanding operational and Pages prerequisites. If any cannot be positively verified or deployment operation is unavailable, STOP BEFORE MUTATION, document precise NOT_VERIFIED reason, and hand back to CA. If all pass, follow the reviewed transaction/restore/acceptance/recovery gates, recording factual evidence, and hand off to CA for release disposition. Preserve all 577 historical ACTIVE records and never deploy 069/070 or a moving remediation tree.

NEXT_OWNER: CD.
