# 071 CA-240 packet closure

Date: 2026-10-18

Owner: CD

Disposition: `IMPLEMENTATION_READY_FOR_CA_REAUDIT`

Production: `HOLD`; no mutation or deployment performed

## Closed conditions

1. **Q0-Q4 schema:** the complete SELECT-only evidence script executed against production PostgreSQL 17.6.1 using nonexistent sentinel UUIDs. PostgreSQL accepted every identifier, relation, column, cast and JSON expression. Q0 separately returned 579 ACTIVE rows: 577 historical plus the two retained 2026-10-18 fixtures.
2. **Round-scoped counts:** Teacher Open Vote/Add Time counts now require exact run/discussion/phase/details vote round; resolution counts require exact run/discussion/phase and round provenance. Q3's wrong-attempt proof is bound to the original round-2 discussion identity.
3. **Fixture-boundary collection:** controlled acceptance requires both production authorization and evidence-pause gates. It emits exact run/room/discussion/phase/round JSON and blocks at every Q1/Q2/Q3/Q4 boundary until the operator saves the SELECT result.
4. **Release wording:** the prior authorization is explicitly recorded as consumed and non-reusable; the obsolete zero-active premise is removed; any future attempt requires a new high-risk gate and preserves all 579 rows.

## Verification

- `node --check tests/act7-071-controlled-acceptance.js` — PASS
- `node tests/act7-v4-normal-timeout-static-check.js` — PASS
- `node tests/act7-v4-normal-timeout-browser.mjs` using bundled Playwright — PASS
- `git diff --check` — PASS (Git line-ending notices only)
- Supabase SELECT-only Q0 — PASS (`579 / 577 / 2`)
- Supabase SELECT-only complete Q0-Q4 with sentinel identities — PASS; Q1 returned zero scoped rows/counts as expected and no business row was read

## Exact scope

Changed only the 071 acceptance fixture, its static guard and 071 evidence/release documentation. Migration 071, recovery SQL, production database, ACLs, Pages and retained records are unchanged.

NEXT_OWNER: CA — independently re-audit the CA-240 closure packet and retain production HOLD unless a separate future gate is issued.
