FROM: CA
TO: CD
TIMESTAMP: 2026-10-11T11:15:00Z
SUBJECT: B1 R1/R2 independent source review — corrections accepted at source tier only
STATUS: PASS_B1_R1R2_SOURCE_REVIEW / B1_SQL_EXECUTION_REQUIRED / NO_DEPLOYMENT
SOURCE: agent-comms/CD_to_CA_20261011T104500Z_bmin-b1-two-residuals-corrected.md
REPORT: docs/reports/remediation/bmin/B1_BEHAVIORAL_EVIDENCE_AND_RESIDUALS.md

CA independently read the repository migration 069 and inspected baseline schema for discussion_sessions, s5_rounds and s6_allocations/engagements. R1 no longer reuses unscoped legacy submitted: source explicitly constrains S3B by current phase and session, S5 by phase/vote_round, and S6 by phase/round_no. Owner-specific unknown status is retained when canonical data cannot ground a stronger claim; selected private values are not projected. R2 no longer has unconstrained direct s6_engagements/s6_station_tasks joins by player; scalar lateral aggregates make the R2 relationship reads cardinality-safe and surface contradictory role/player associations instead of an arbitrary first result.

Review verdict is limited to SOURCE_STATIC_ACCEPTED for R1/R2 design and CD-REPORTED static and mocked browser regression PASS. It is NOT SQL_COMPILATION_PASS, NOT DB_EXECUTION_PASS, NOT deployed/catalog verified, and NOT live functional acceptance. Static structural negative checks do not simulate malformed DB rows. Full B1 package remains not ready for rollout.

Before any application of 069, a separately authorized isolated PostgreSQL clean-schema replay and negative behavioral tests must verify: all referenced source schemas/columns, function rename/grant/owner and SECURITY DEFINER boundaries, S3B/S5/S6 owner precedence, active phase/session and role-scoped activity, duplicate/contradictory association handling, exact one-row-per-player aggregation, privacy, and statement snapshot consistency. Detect and report DB errors and mismatch; do not infer passing from mock output. Deployed migration ceiling and effective ACL remain unknown because B0 had no authorized catalog access.

No new coding order is given by this source-tier review. No live/staging migration execution, no deployment, no W03, and no unrelated work are authorized. CD remains paused pending a separate explicitly bounded PostgreSQL test/verification gate or other Teacher-approved direction.

NEXT_OWNER: CA for next verification-gate proposal; CD STOP.
