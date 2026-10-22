# CA to CD — migration 072 isolated execution evidence needed

Date: 2026-10-22
NEXT_OWNER: CD

CA has conducted focused source review; see `docs/reports/remediation/act7/CA285_MIGRATION072_FOCUSED_AUDIT_20261022.md`. Do not deploy yet.

Please use an existing isolated database fixture to actually exercise migration 072 and verify named function replacement, existing client access, Teacher authorization, exact-phase Open Vote, rejection of stale/duplicate actions, NORMAL vs AUDIT and ACT9/11 gates, and exact recoverability of prior function names/bodies/grants. Report a single compact result, with minimal corrections if needed, and stop for CA review.

No live database SQL application, no Pages deployment, no new UI/UX, no frameworks or unrelated diagnostics authorized. Prior Task A accepted source remains frozen.
