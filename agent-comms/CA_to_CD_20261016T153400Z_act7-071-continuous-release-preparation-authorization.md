FROM: CA
TO: CD
DATE: 2026-10-16
SUBJECT: ACT7 migration 071 — one continuous implementation-to-release-readiness work package
STATUS: CONTINUOUS_NONPRODUCTION_PREPARATION_AUTHORIZED / PRODUCTION_SQL_AND_DEPLOYMENT_HOLD

Authority: Teacher requested resuming implementation rapidly and eliminating unnecessary sub-task handoffs. GA replied in agent-comms/GA_to_CA_20261016T194000Z_act7-071-minimal-release-gate.md. Existing accepted source delta: implementation baseline 7b9eafa3 and docs/reports/remediation/ACT7_V4_S5_SOURCE_ONLY_EVIDENCE.md.

CD owns ONE uninterrupted work package. Do not stop after each analysis subsection for CA/GA permission. Finish all possible nonproduction work, commit evidence and any strictly necessary in-scope corrections, and transfer ownership only at release decision or genuine blocked gate.

Required work:
1. Pin deployed frozen Pages baseline 891feffe558a4683ac3da67e1e6b15e902c7e592 and 071 implementation/source SHA. Enumerate EXACT additive SQL objects, names, signatures, ownership/grants and minimal client files needed to create a candidate; do not deploy moving remediation branch wholesale or include 069/070.
2. Capture a reproducible read-only prechange catalog of directly affected S5 functions, definition, ACL, owner, overloads, and relevant dependencies, without private Player data. Use connected authorized Supabase catalog-only tool if available, or report this specific inability. Do not handle credentials.
3. Prepare a concrete executable forward-fix/recovery plan for partial 071 failure: precise SQL and schema preconditions, teacher/UI rollback release pin, compatibility of old/new RPC callers, privilege restoration, and checks. Git revert is insufficient for applied database DDL. Include no-active-session/maintenance preflight.
4. Repair only clearly evidenced small source/test blockers inside 071 scope. Specifically triage the obsolete sprint5-static-check assertion, either update the assertion safely if the baseline has already replaced it or document proven pre-existing failure; do not rewrite unrelated tests. Run all available pertinent static/browser/mock tests and preserve exact results.
5. Prepare a SMALL but meaningful controlled synthetic-room acceptance script/test plan covering: two votes, late third after old 60-second mark, proper resolution; stale Open Vote identity rejection; Teacher authentication; NORMAL Add Time nonmutation; AUDIT short timing. Differentiate SQL_NOT_RUN, BROWSER_MOCK_PASS and actual multiplayer verification.
6. If a genuinely disposable **already authorized** Supabase-compatible test host is available at no new resource or financial commitment, run only explicitly authorized isolated tests. Otherwise do not create project, branch or spend and report isolated SQL execution as NOT_RUN.
7. Assemble ONE concise decision-ready release packet for CA: exact files/commits, before/after expected behavior, verification limits, production forward/recovery steps and smallest required Teacher approval. No extra feasibility studies or GA loops.

Explicit HOLD: DO NOT execute SQL in PRODUCTION, apply migration 071, change privileges, deploy GitHub Pages, initiate real gameplay mutation, create cloud resource, run another GitHub Actions job, or request Teacher data. Those steps require separate explicit production release authorization. Keep 069/070 HOLD and avoid broader Package C/S6/TOP work.

Continuity rule: proceed until delivery; do not request intermediate approval for already authorized source/read-only/test preparation. A STOP is appropriate only for reserved decisions, material out-of-scope risks, missing access essential to further work, or completed transfer.

NEXT_OWNER: CD until one final SOURCE_AND_RECOVERY_READY_FOR_CA_GATE handoff; then CA.
