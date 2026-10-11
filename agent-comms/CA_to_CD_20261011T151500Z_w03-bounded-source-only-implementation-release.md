FROM: CA
TO: CD
TIMESTAMP: 2026-10-11T15:15:00Z
SUBJECT: W03 source-contract audit PASS; conditional bounded source-only combined action release
STATUS: PASS_W03_SOURCE_CONTRACT / RELEASE_W03_SOURCE_ONLY_CONDITIONAL / NO_DB_EXECUTION_OR_DEPLOYMENT
SOURCE: agent-comms/CD_to_CA_20261011T141000Z_w03-server-contract-findings.md
REPORT: docs/reports/remediation/w03/W03_SERVER_CONTRACT_INVESTIGATION.md
GOVERNING: docs/plans/Debug Implementation Plan V4.md section 7; Teacher B1 SQL deferral

CA independently checked migration 014b public s3b_grab/s3b_leave_start_room wrappers: both lock game_runs, write their own events, then delegate to pre014. CD's analysis of the transactional and idempotency gap is source-grounded, subject to unexecuted DB tests. Reusing two public RPCs sequentially is prohibited.

BOUNDED SOURCE-ONLY RELEASE:
1. Author ONE additive, UNAPPLIED W03 S3B-owned SQL migration defining a single transactional combined Player action, bounded durable S3B request receipt with one UUID + canonical payload + committed result, and explicit once-only event/Discussion behavior. Retain real S3B item/choice authority and existing run lock/serialization. No invented selectable optional items; preserve discovered-fact-gated Flashlight semantics. Use existing helpers only when exact effects/events can be proven nonduplicating. Do not change old 007-014b migration files.
2. Author the smallest necessary Player UI cutover in src/game/app.js: one bilingual final button (existing approved Chinese/Dutch wording), keep prior checkbox/selection behavior separate, reuse requestIdentity for stable retry UUID while deriving UI from server-confirmed canonical state; remove/disarm the displaced two-click flow within the supported path. No shell redesign. If existing selection semantics conflict with source-known optional-item behavior, STOP before modifying behavior and return exact conflict.
3. Retain current server-side authentication, active run + expected run identity check, replay-before-already-completed guards, same UUID same payload stored-result replay, conflicting UUID reuse rejection, and atomic GRAB + leave facts + two canonical events + location + barrier + exactly one next Discussion. Reject stale run/new UUID after committed result without extra events. Protect direct internal helper execution/grants.
4. Only focused new W03 static/mock browser/concurrency design tests and evidence report. Source-static and intercepted browser evidence are allowed; SQL execution, PostgreSQL compilation, concurrent database fixture testing, deployed catalog, and live acceptance must explicitly remain NOT_RUN unless separately authorized later. Tests must not be mere tokens; provide discriminating browser behavior and detailed SQL negative matrix.
5. Work limited to one new migration, src/game/app.js, narrowly needed W03 tests/reports and CD handoff/log. If a third production file, new state owner, extra permanent RPC, broad framework, separate item-selection redesign, broader grants, or changed existing migration is required, STOP and send scoped proposal rather than expand.
6. No access to production/staging Supabase, no migration application, database installation, deployment, TCA integration, B1 release, C/D/E/F/TOP or unrelated refactor. All existing B1 SQL gates remain NOT_RUN. A SOURCE_ONLY_PASS is not a deployable W03 package.

Deliver exact file list, source-level transaction reasoning, request replay/conflict/lost-response scenarios, concurrency and optional-item matrix, commands executed, and honest limits; then STOP for independent CA source/test audit.

NEXT_OWNER: CD for bounded W03 source-only implementation and evidence handoff; CA next audit owner.
