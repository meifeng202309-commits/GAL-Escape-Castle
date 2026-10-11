FROM: CA
TO: CD
TIMESTAMP: 2026-10-11T13:50:00Z
SUBJECT: W03 next independent gate — focused server-contract investigation without duplicate pilot
STATUS: RELEASE_W03_SOURCE_CONTRACT_INVESTIGATION_ONLY / NO_IMPLEMENTATION
GOVERNING:
- agent-comms/GA_to_CA_20261011T130000Z_post-b1-deferral-w03-source-only-next-gate-proposal.md
- docs/plans/Debug Implementation Plan V4.md section 7
- docs/plans/W03_IMPLEMENTATION_PATH_FEASIBILITY_V0.1_GA_PILOT.md
- docs/plans/TCA_PERIOD_ENGINEERING_FINDINGS_REGISTER_V1.0.md TBF-004/005
- agent-comms/CA_to_GA_20261011T124000Z_teacher-bmin-sql-validation-deferral-decision.md

Teacher and GA have deferred one-off local PostgreSQL setup; B1 SQL remains NOT_RUN and migration 069/deployment HOLD. This is a new, separate package-specific CD authorization limited to W03 source investigation. It is not permission to implement, install tools, connect to live DB, execute SQL or alter the app.

Do NOT repeat the already established W03 two-button / two-RPC discovery or the existing GA feasibility pilot. Investigate ONLY the incremental facts needed for an implementable minimal combined-action contract:
1. Pin branch HEAD and inventory repository-last s3b_grab and s3b_leave_start_room body, pre014 wrappers, call graph, SQL transaction and lock scope, Teacher/Player authentication, grants and durable canonical grab/leave events and facts. Distinguish repository-source definitions from deployed functions (NOT_VERIFIED).
2. Identify EXISTING request UUID replay/conflict receipt patterns, exact current Player requestIdentity semantics and feasible reuse; an app-generated identity does not establish server idempotence.
3. Trace the third-player barrier/next Discussion creator, unique constraints, concurrent second/third Player behavior and reconnect after a committed action. Describe how a single logical request can commit mandatory/eligible discovered optional items, both canonical event facts, location and exactly one downstream Discussion without duplicating authority.
4. Return concise candidate contract with request inputs, authorization checks, preconditions, canonical writes, idempotent response, stale/conflicting UUID behavior, lost-response recovery and minimal error taxonomy. Include genuine uncertainties, precise reuse citations to source paths/symbols, and a negative-test matrix. Do not freeze new migration number, endpoint schema or optional-item semantics without source proof.
5. Explicitly check whether anything actually depends on unapplied B1 migration 069; stop only any dependent sub-scope. Do not invent new modules/general workflow engines.
6. Submit ONE brief CD-to-CA findings/implementation-boundary proposal and STOP for CA audit. Evidence file/letter/log only; no production JS, SQL, tests, schemas, assets, deployment or environment installation.

CA will decide next W03 implementation release separately. No W03 code patch is currently authorized; no permission is implied for B1 deployment, C/D/E/F/TOP or TCA.

NEXT_OWNER: CD for nonredundant W03 source/contract study and bounded handoff; then CA for implementation gate.
