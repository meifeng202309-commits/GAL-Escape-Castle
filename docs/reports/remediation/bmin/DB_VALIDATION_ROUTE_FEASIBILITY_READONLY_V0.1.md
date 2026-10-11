# Database validation routes — read-only feasibility V0.1
Date: 2026-10-11; author CA. Evidence: repository inspection only. No SQL execution, database access, installation or cloud project creation.

## Shared boundary
B1 migration 069 and W03 migration 070 remain unapplied, SQL_NOT_RUN. Do not access current production Supabase with privileged credentials or perform remote migrations. User does not want Windows software installation and has limited token budget.

## Route A: first-round Supabase reuse
README.md and docs/setup/README_GITHUB_PAGES.txt establish earlier GitHub Pages and Supabase browser connectivity. tests/sprint1-live-e2e.js and later sprint live E2E scripts show historical direct RPC test patterns.
These facts do NOT establish a disposable current database, safe reset permissions, effective deployed migration ceiling or authorization to reuse a live project. B0's deployed catalog attempt was blocked by API authentication.
Read-only next check: discover whether an already existing, explicitly disposable project is available, and who owns permissions; no connection/queries to the active game DB without approval.
Feasibility: historical RPC harness reusable; database validation host UNVERIFIED.

## Route B: GitHub Actions ephemeral PostgreSQL
Root GitHub contents inspection shows no .github directory or existing workflow. No package.json exists at repo root. database/ migrations reach 070, with suffix variants including 014a/014b. Tests include SQL and JS checks, but no owned temporary PostgreSQL bootstrap was identified.
Potential minimal manual-dispatch workflow: hosted runner with disposable PostgreSQL service; no production secrets; contents:read, short timeout; record server/client/extension versions; replay 001-068 in correct order with ON_ERROR_STOP; apply 069/070 conditionally; synthetic fixture negative SQL tests, grants, transaction and concurrency evidence; sanitized artifact; automatic runner teardown.
Need verify actions enablement, repository quotas/runner policies, PostgreSQL version/extensions and Supabase role differences before implementation. A standard PostgreSQL PASS is not a Supabase integration PASS.
Feasibility: promising repeatable no-local-install SQL path; availability NOT_VERIFIED and workflow creation NOT_AUTHORIZED.

## Route C: isolated Supabase project
An entirely separate Supabase project provides strongest Supabase RPC/RLS/API parity and four-browser acceptance, without local installation. But user account project-creation rights, quota/cost, migration application path and cleanup have not been verified. Needs explicit user/cloud owner approval; do not request credentials in chat or create resources now.
Feasibility: potentially strong final integration lane; availability and cost NOT_VERIFIED.

## First-round elimination recommendation
1. Non-mutating repository Actions capability/policy inspection; if feasible, request a narrow approval for one manual, no-secret 5-minute service-container smoke pilot before designing full SQL fixtures.
2. Reuse first-round tests only as existing HTTP contract patterns; establish any truly disposable pre-existing Supabase project independently.
3. Hold independent Supabase project provisioning for the eventual isolated integration/four-browser gate or if Actions proves unsuitable.

## Evidence and Stop
All three routes remain OPTIONS rather than deployed environments. Preserve B1/W03 SQL_NOT_RUN and deployment HOLD. Stop on any request for production secrets, real player data, paid cloud resources, remote DB mutation or new installation. Route owner must report prerequisites, costs, exact artifacts and bounded next authorization.