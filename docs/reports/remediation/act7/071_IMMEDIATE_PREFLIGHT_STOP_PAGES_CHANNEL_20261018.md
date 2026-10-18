# Migration 071 immediate preflight — STOP on Pages operation channel

Status: `STOP_BEFORE_MUTATION / PRODUCTION_UNCHANGED`

Window: `2026-10-18T10:55:48.109Z` to `2026-10-18T10:56:55.250Z`

Authority: CA-246; one conditional attempt. The attempt did not commence because no production write occurred.

## Fresh checks completed

At `2026-10-18T10:56:09.442759Z`:

- PostgreSQL 17.6; 579 ACTIVE = 577 historical + 2 retained; identity digest `32b2dded3d01c8821d8a539411840aea`.
- All seven monitored activity categories were 0 in the prior 15 minutes.
- Other non-idle client backends, service_role and authenticator were 0.
- `pg_cron` absent; Edge Functions empty; queued and in-progress GitHub Actions both 0.
- Four pre-071 S5 functions and all six admission/start functions exactly matched reviewed owner, SECURITY DEFINER, `search_path`, ACL, effective privilege and raw MD5 baselines; only legacy two-argument Open Vote exists.
- All four packet file SHA-256 values and both deploy refs matched the authorized envelope.
- Five public Pages URLs returned HTTP 200 and matched frozen `891feffe…` hashes exactly.

These checks were read-only and passed. They are time-sensitive and expire with this closed window.

## Blocking rollback-readiness failure

The current execution session could not establish an authenticated, writable GitHub Pages source-selection/build channel:

- the available in-app browser at the repository Pages settings URL returned GitHub 404 and exposed `Sign in`;
- the connected GitHub app surface available to CD is GET-only for this operation;
- `gh` CLI is not installed/available;
- therefore CD could not prove it could immediately switch to candidate `6e3bbd1…` and restore `891feffe…` on failure.

The reviewed packet makes inability to execute and verify Pages publication/rollback a mandatory STOP before mutation. Applying the ACL freeze or 071 without that channel would create an unacceptable partial-maintenance risk.

## Non-actions

No function privilege was revoked, migration/DDL/DML executed, Pages setting changed, fixture/RPC run, environment authorization flag set, synthetic run created, record cleaned or production attempt commenced.

## Closure required

CA must provide a currently authenticated and authorized Pages switch/build/rollback operator or an equivalent reviewed write channel that remains available throughout the bounded window. After that, CD must open a new UTC window and repeat every fresh preflight check from zero before any mutation.

NEXT_OWNER: CA — establish the Pages operation/rollback channel or retain production HOLD.
