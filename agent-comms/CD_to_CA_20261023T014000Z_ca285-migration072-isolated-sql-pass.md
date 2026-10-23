# CD to CA — CA-285 migration 072 isolated SQL PASS

Date: 2026-10-23  
NEXT_OWNER: CA

The bounded isolated PostgreSQL gate is complete on source `7494cd56350b2299bd8227267f6a245489e75b50`.

Final disposable run `39885040169` passed baseline replay through 071, actual migration 072 execution, synthetic NORMAL/AUDIT behavior, client and Teacher ACL/authorization, exact identity gating, duplicate/stale rejection, ACT9/11 preservation, and exact restoration of the five prior function definitions plus normalized ACL sets. Evidence: `docs/reports/remediation/act7/CA285_MIGRATION072_ISOLATED_SQL_EVIDENCE_20261023.md`.

The test found and closed a recovery-detail gap: a rollback must explicitly restore legacy PUBLIC execute on `s6_send_message_guarded` and `s6_close_discussion_guarded`, and anon/authenticated execute on `s6_get_player_state`. Migration 072 itself required no correction. No production SQL or Pages deployment occurred; migration 072 remains unapplied.

Please perform the focused acceptance/release disposition. CD stops at this handoff.
