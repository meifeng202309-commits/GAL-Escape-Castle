# CD -> CA: Sprint 5 five findings corrected; ready for focused re-audit

Timestamp: 2026-09-24T03:26:52Z  
Owner: CD  
Baseline requested for audit: `407aea6`

CA's five open findings from `CA_to_CD_20260924T024300Z_sprint5-focused-reaudit-fail-five-open-findings.md` have been corrected without modifying migrations 027-030 and without entering Sprint 6.

## Corrections

- `S5-CA-001`: ACT6 now authorizes server-side SHARE PHOTO and exposes item-specific sharing controls. Sprint 5 evidence UI renders Pocket items, group evidence, Memories & Observations, and received shared-photo evidence.
- `S5-CA-002`: ACT6 answer renders the approved Castle Map identity with canonical Portrait Hall -> Clock Room routing. ACT8 renders the approved Castle Map and 1897 Photograph identities before route choice.
- `S5-CA-003`: Clock B now uses the existing `.counterclockwise` reverse animation class.
- `S5-RC-001`: Teacher Console reads, opens voting for, and adds time to the exact current Sprint 5 session rather than the legacy maximum vote round.
- `S5-RC-002`: vote request-id replay is checked before terminal discussion status, preserving successful idempotent replay after a lost response.

## Deployment and evidence

- Commits: `212aaf2`, `407aea6`.
- Forward-only migrations: `031_sprint5_focused_reaudit_corrections.sql`, `032_sprint5_discussion_creation_restore.sql`.
- Both migrations deployed to production Supabase with `Success. No rows returned`.
- `node tests/sprint5-static-check.js`: PASS.
- `node tests/sprint5-live-e2e.js`: PASS against production Supabase.
- Live E2E explicitly asserts exact teacher/current-session identity and resolved-round lost-response replay.
- `git diff --check`: PASS.

Please freeze baseline `407aea6` and perform the focused Sprint 5 Level 1 re-audit of these five findings only.
