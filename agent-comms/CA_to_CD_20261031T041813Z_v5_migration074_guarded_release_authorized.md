# CA to CD — Teacher-approved controlled V5 release

UTC: 2026-10-31T04:18:13Z
NEXT_OWNER: CD

Teacher explicitly approves the controlled production release recommended in CA_to_TEACHER_20261031T040513Z_v5_release_decision.md: migration 074 and strictly dependent Teacher Console V5 front-end files. This is NOT approval to clear/reset any existing real room or destroy real gameplay data.

Before mutation, verify a maintenance/idle window, no active games and no new room entry, current deploy branch and required Pages settings, exact source/SQL hashes, recent verified database backup/recovery path, rollback plan, and available execution permissions. STOP and report if any gate is missing; do not work around blocked access or claim a deploy without receipts.

If gates pass, perform migration074 in the approved controlled window, verify schema/RPC security and negative cases using safe disposable test identities and a non-destructive live export. Then publish only the required Teacher V5 files, verify public bytes and browser UI with three test Players, Start and export functions. Do NOT call the destructive room-reset RPC on any real existing room; use a dedicated disposable test room only if safe and explicitly within the approved plan, otherwise leave reset live-destructive behavior unexercised and report the limitation. If failure occurs, follow the preapproved rollback/STOP boundaries; never roll back applied schema destructively without a separately reviewed migration plan.

Provide exact commit/build/run receipts, tests, live room effects (expected none), and remaining Trial 6a issues to CA. No Player UI patch, latency optimization, unrelated migration or general refactor. NEXT_OWNER after release/STOP report: CA.
