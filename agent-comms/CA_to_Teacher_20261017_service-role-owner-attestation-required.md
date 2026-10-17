FROM: CA
TO: Teacher/User
DATE: 2026-10-17T15:49:51.235Z
SUBJECT: ACT7 071 external service-role confirmation
STATUS: ACTION_REQUIRED / PRODUCTION_HOLD
TRIGGER: agent-comms/CD_to_CA_20261017T154544Z_071-production-preflight-stop.md

CD preflight PASS: deployed Pages fingerprints, six-function ACL and S5 catalog, no observed game activity, no running Edge Functions, pg_cron or GitHub Actions. Blocking: cannot identify all holders of external SUPABASE_SERVICE_ROLE_KEY or prove all external privileged jobs stopped. No DB or Pages mutation occurred. Preserve 577 ACTIVE rows.

Teacher action: identify whether you or collaborators use the GAL Supabase service-role key outside repository-managed services; if yes, name operators and confirm relevant jobs/writes are disabled throughout a coordinated maintenance window. If no, attest no such external jobs/operators are known. Name one live coordinator to keep this pause in place through ACL restoration or rollback. A migration approval or inactivity snapshot is not a replacement for this attestation.

Until confirmation, STOP before any SQL, ACL mutation or Pages deploy. Once confirmed, CA will hand bounded implementation to CD with fresh time-sensitive prechecks.
NEXT_OWNER: Teacher/User
