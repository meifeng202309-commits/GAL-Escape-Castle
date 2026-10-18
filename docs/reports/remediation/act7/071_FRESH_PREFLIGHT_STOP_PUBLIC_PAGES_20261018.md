# Migration 071 fresh preflight — STOP on public Pages availability

Status: `STOP_BEFORE_MUTATION / PRODUCTION_UNCHANGED`

Window: `2026-10-18T16:20:15.404Z` to `2026-10-18T16:22:38.938Z`

Authority: CA review in `agent-comms/CA_to_CD_20261018T143100Z_pages-review.md`; Teacher supplied the exact live readiness token and a screenshot showing `deploy/manual-acceptance-20261003` at `/(root)`.

## Fresh checks completed

- PostgreSQL 17.6; 579 ACTIVE = 577 historical + 2 retained; ordered identity digest `32b2dded3d01c8821d8a539411840aea`.
- All seven monitored activity categories were 0 in the prior 15 minutes.
- Other non-idle client backends, `service_role`, and `authenticator` were 0.
- `pg_cron` was absent; Supabase Edge Functions were empty; queued and in-progress GitHub Actions were both 0.
- The four pre-071 S5 functions and all six admission/start functions matched the reviewed owner, SECURITY DEFINER, `search_path`, ACL, effective privilege, and raw MD5 baselines. The legacy two-argument Open Vote exists and the 071 six-argument overload does not.
- All four packet file SHA-256 values matched the authorized envelope.
- GitHub independently resolved candidate `deploy/act7-071-20261017@6e3bbd1d2795bd4486b1437a0b9e107e2238fa28` and rollback `deploy/manual-acceptance-20261003@891feffe558a4683ac3da67e1e6b15e902c7e592`. Local Git object hashes for all five files matched both reviewed manifests.

## Mandatory STOP

A cache-busted public verification pass returned HTTP 404 with the same 9,379-byte GitHub Pages error body for all five required paths:

- `index.html`
- `teacher.html`
- `src/game/app.js`
- `src/teacher/teacher-console.js`
- `src/styles/app.css`

The reviewed runbook requires HTTP 200 and exact frozen hashes before any write. A second independent read-only HTTP status pass reproduced all five 404 responses. GitHub's Pages administration UI may label the site live, but that does not override the public-byte gate.

## Non-actions and disposition

CD did not revoke any ACL, apply migration 071, instruct a Pages branch change, press Save, call a fixture RPC, set an authorization flag, create a synthetic run, or clean any record. The conditional attempt did not commence because no production mutation occurred.

Teacher must leave the current rollback selection unchanged and must not press Save under this closed window. Production remains HOLD.

NEXT_OWNER: CA — independently disposition the fresh public Pages 404 blocker and define whether the existing Pages deployment must be repaired or otherwise canonicalized before another newly authorized bounded preflight. No retry or practice deployment is authorized.

