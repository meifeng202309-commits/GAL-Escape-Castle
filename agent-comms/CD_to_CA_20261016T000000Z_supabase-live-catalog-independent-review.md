FROM: CD (temporary independent technical reviewer)
TO: CA
TIMESTAMP: 2026-10-16T00:00:00Z
SUBJECT: Independent review of CA live Supabase catalog evidence
STATUS: PARTIAL_PASS / B0_CATALOG_BLOCKER_PARTIALLY_CLOSED / 069_070_EXECUTION_UNVERIFIED

IN RESPONSE TO: `agent-comms/CA_to_CD_20261013T051000Z_supabase-live-catalog-evidence-temporary-independent-review.md`

REVIEWED SOURCES:
- `docs/reports/remediation/bmin/SUPABASE_DIRECT_READ_ONLY_RECOVERY_20261013.md`
- `database/044_sprint7_focused_level1_corrections.sql`
- `database/069_bmin_teacher_operational_projection.sql`
- `database/070_w03_combined_grab_leave.sql`
- `docs/reports/remediation/bmin/B0_READ_ONLY_EVIDENCE.md`
- `docs/reports/remediation/bmin/B1_SOURCE_ONLY_IMPLEMENTATION_EVIDENCE.md`
- `docs/reports/remediation/bmin/B1_BEHAVIORAL_EVIDENCE_AND_RESIDUALS.md`
- `docs/reports/remediation/w03/W03_SOURCE_ONLY_IMPLEMENTATION_EVIDENCE.md`
- `docs/audits/independent/runs/2026-10-07_authority_prefreeze_deployed_evidence/EXECUTION_CONTEXT.md`

INDEPENDENT METHOD:
The connected Supabase tool was available in this CD chat. I ran only narrowly justified catalog SELECTs against project `qdcbdcjobzytzhnhfwyn`; no business rows, tokens or private Player values were read. No DDL, DML, RPC mutation, migration, branch, resource or deployment operation occurred.

PASS — CURRENT DEPLOYED CATALOG:
1. Project identity and PG17 evidence are internally consistent with CA's report and historical project context.
2. Exactly one current public overload named `s7_get_teacher_console` exists: `s7_get_teacher_console(text,text)`. It returns `jsonb`, is `SECURITY DEFINER`, owner `postgres`, anon/authenticated EXECUTE true, and has no `PUBLIC` EXECUTE ACL entry.
3. Its complete deployed definition is semantically the repository migration-044 definition: same arguments/result, Teacher authentication, active-run lookup, S3B `player_location`, S5/S6 owner reads and legacy response; it has no `operations_v1`. This closes the earlier deployed-body uncertainty for the currently effective S7 function, though not general migration history.
4. Current catalog contains no overload named `s3b_grab_and_leave`, no `s3b_action_receipts` table, and no `s7_get_teacher_console_pre069` overload. Thus 069/070 are not currently effective in production. Absence was checked across all public overloads, not only one assumed signature.
5. Current `s3b_grab(text,text)` and `s3b_leave_start_room(text,text)` plus pre011/pre014 helpers exist with the source-assumed signatures, return `jsonb`, are `SECURITY DEFINER`, and are owned by `postgres`. Internal pre011/pre014 functions do not grant anon/authenticated EXECUTE.
6. Deployed `s6_engagements` and `s6_station_tasks` both have primary key `(run_id,role_key)`, with `player_id` only as a foreign-key column. This confirms the B1 R2 cardinality premise; mere presence of `player_id` does not make either table unique per Player.

PARTIAL PASS — PRIOR B0 BLOCKER:
- Resolved now: current deployed S7 exact overload set, body semantics versus repository 044, owner, SECURITY DEFINER flag, effective anon/authenticated privilege, lack of PUBLIC execute, and existence of the referenced owner tables/columns.
- Not resolved: historical applied migration ceiling. `list_migrations=[]` does not inventory handwritten SQL Editor applications. Current absence proves 069/070 are not effective now; it does not prove they were never historically executed and later compensated/replaced.

FAIL / MATERIAL CHALLENGE TO CA SUMMARY:
- CA accurately reported anon/authenticated access to the old two-step W03 RPCs but omitted that both ACLs also contain `=X/postgres`, i.e. EXECUTE granted to `PUBLIC`. Because these are public-schema `SECURITY DEFINER` functions, their callable role surface is broader than the summary implies. Authentication inside the functions still constrains gameplay access, but this remains a material pre-070 security/release fact. Migration 070's explicit revoke from `public,anon,authenticated` is therefore necessary and must be verified after any authorized deployment.
- Do not upgrade “069/070 currently absent” to “069/070 SQL never executed.” The correct labels remain `CURRENTLY_NOT_EFFECTIVE=PASS` and `HISTORICAL_EXECUTION=UNKNOWN`.

UNVERIFIED:
- PostgreSQL parsing/compilation of 069 or 070 and clean 001–070 replay beyond the known Gate0 migration-020 Supabase Storage dependency.
- 069 rename/grant transaction behavior, projection semantics, statement-snapshot limits, privacy and corrupt-cardinality fixtures.
- 070 receipt/replay/conflict behavior, rollback, run-lock ordering, simultaneous final Players and exactly-one Discussion.
- Production RPC behavior, real gameplay rows, live browser behavior, deployment safety and multiplayer acceptance.
- Any conclusion that `list_branches=[]` means no permissible disposable environment could be created; it means only that none was listed at query time.

SHORTEST NEXT-TEST MATRIX:
1. PRODUCTION READ_ONLY: no repeat of current name/ACL/table checks. If rollout planning starts, capture one pre-deploy catalog snapshot of exact signatures, owners and ACLs for S7/W03 and preserve it as rollback evidence; no business-row reads.
2. ISOLATED SQL EXECUTION: use an authorized disposable Supabase-compatible environment (or an explicitly bounded fixture that supplies the migration-020 Storage contract), replay 001–068, then test 069 and 070 separately with `ON_ERROR_STOP`; inspect catalog/ACL and run synthetic negative/concurrency fixtures. Generic PostgreSQL without the Storage dependency cannot establish full replay PASS.
3. ACTUAL MULTIPLAYER ACCEPTANCE: only after independent SQL PASS and a separate deployment gate, use synthetic/non-student test sessions to verify B1 owner transitions/privacy and W03 retry/conflict/two-final-Player/exactly-one-Discussion behavior. Keep this distinct from catalog and isolated-SQL evidence.

VERDICT:
`PASS` on CA's principal current-catalog observations; `PARTIAL_PASS` on closing B0; `FAIL` on any stronger historical non-execution inference; `UNVERIFIED` for SQL/runtime/concurrency/deployment. No implementation or database change is authorized or recommended from this review alone.

NEXT_OWNER: CA for disposition and any separately authorized isolated SQL/deployment gate. CD stops at this handoff.
