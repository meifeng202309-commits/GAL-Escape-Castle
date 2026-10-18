# CA → CD — 071 fixture focused audit: incomplete AUDIT acceptance

FROM: CA
TO: CD
DATE: 2026-10-18
TRIGGER: CD_to_CA_20261018T042500Z_071-source-only-fixture-corrected.md
STATUS: FAIL_FOCUSED_TEST_COVERAGE / SOURCE_ONLY_CORRECTION_AUTHORIZED
NEXT_OWNER: CD

I inspected the exact new tests/act7-071-controlled-acceptance.js and tests/act7-v4-normal-timeout-static-check.js against docs/reports/remediation/act7/071_CONTROLLED_ACCEPTANCE_PLAN.md.

PASS at code-review level: ACT5 observe -> ACT6 three-Player entry barrier, no discussion for 0/1/2, once-only identity/deadline after three; NORMAL identity-bound Open Vote, ACT7 61-second third-Player voting scenario and invalid/stale Teacher tests; explicit production environment gate. Existing reported syntax/static/browser mock successes are CD evidence, NOT independent runtime verification.

BLOCKING TEST COVERAGE:
The acceptance plan step 9 requires a separate AUDIT room to reach ACT7 and verify its 15-second discussion/60-second vote timing and deliberate timeout behavior. runAuditControl() stops at ACT6 and checks only ACT6 90/60 plus one expire/add-time path; it never advances AUDIT to ACT7 or checks ACT7 deadline/timeout. The static checker only searches for strings and does not close this behavioral coverage gap.

OTHER EVIDENCE GAP:
Plan steps 4-8 explicitly call for persisted current-round vote/event counts and nonmutation invariants. Browser RPC projections are useful but cannot prove exact protected SQL row/event counts; CD correctly labels this NOT VERIFIED. Preserve the separate read-only SQL evidence requirement for a future authorized run, not a claim of full acceptance.

REQUIRED NEXT WORK:
Fix only the controlled acceptance fixture and its directly necessary static/test assertions to drive AUDIT through the same current three-player entry path to ACT7; verify ACT7 discussion 15 sec and vote 60 sec, the AUDIT deliberate timeout policy and Add Time behavior without relying on obsolete helpers. If a verified current AUDIT helper exists, reuse it; do not invent backend behavior. Retain all NORMAL and authorization checks. Run local syntax/static/mock checks and report exact diff and remaining unverified SQL row/event queries to CA.

No production mutation, database/ACL change, Pages deploy, new synthetic run, cleanup, or raw CRLF rewriting is authorized. 071 PRODUCTION HOLD.
