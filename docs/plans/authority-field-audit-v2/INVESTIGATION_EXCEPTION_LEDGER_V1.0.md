# Six-method field investigation — Exception / limitation ledger V1.0

Date: 2026-10-07  
Owner: GA  
Scope: investigation and evidence recording only  
Authority / semantic inference: **NONE**  
CD authorization: **NONE — HOLD remains in force**

## Purpose

This ledger records places where the six-method investigation can distinguish what was directly observed from what remains unobservable with the repository and execution evidence currently available. An exception below is **not** an Authority decision, a bug finding, an OBSOLETE classification, or evidence that two fields are semantically identical/different.

## E-01 — Repository-latest SQL definition is not direct deployed-database introspection

**Observed:** all 70 repository migrations were traversed. Phase-2 extraction recorded 302 function create/replace/drop declaration events, 158 signature keys, 155 last-definition candidates and three last operations that are drops. Five function names have more than one signature key: `s2_send_message`, `s2_submit_vote`, `s3b_submit_library_code`, `s8_finalize`, and `s8_export_session`.

**Recorded evidence:**
- `phase2/SQL_LAST_DECLARATION_SNAPSHOT_V1.0.json`
- `phase2/LAST_FUNCTION_SOURCE_BATCH_01.json` … `05.json`
- `phase2/FIELD_READ_WRITE_BY_LAST_FUNCTION_DEFINITION_V1.0.csv`

**Boundary:** the phrase *latest/effective static function* in this audit means the last repository definition candidate by exact signature in migration order. The current agent has no PostgreSQL catalog / `pg_proc` inspection of the deployed Supabase database, so it does not claim that every repository-latest candidate equals the deployed object byte-for-byte.

## E-02 — Schema source chain is observable; live deployed catalog is not directly introspected

**Observed:** all 432 original column declarations were re-located to exact source lines and per-column fragments. Post-origin DDL mentions were scanned across the 70 migrations, and a source DDL event ledger was produced.

**Recorded evidence:**
- `M4_SCHEMA_ORIGIN_PART01.csv` … `PART03.csv`
- `phase2/FIELD_POST_ORIGIN_DDL_MENTIONS_V1.0.csv`
- `phase2/SCHEMA_DDL_SOURCE_EVENT_LEDGER_V1.0.json`

**Boundary:** multi-line/dynamic DDL effects are not reconstructed into a live `information_schema`/`pg_catalog` snapshot. The source ledger is therefore repository-source evidence, not a direct assertion of the deployed catalog. RLS/GRANT/TRIGGER lines are also DDL/runtime-governance evidence and are not automatically field-authority facts.

## E-03 — Static field read/write evidence does not prove runtime reachability by itself

**Observed:** the original scan recorded 2,156 raw SQL write occurrences and 6,755 raw SQL read occurrences across historical migrations. Phase 2 reclassified field witnesses against the last repository function-definition candidates, and separately recorded historical/migration-only evidence.

**Recorded evidence:**
- `M2_WRITE_STATIC_FACTS_V1.0.csv`
- `M3_READ_STATIC_FACTS_V1.0.csv`
- `phase2/FIELD_READ_WRITE_BY_LAST_FUNCTION_DEFINITION_V1.0.csv`
- `phase2/FRONTEND_RPC_CALLSITE_FACTS_V1.0.json`
- `phase2/FUNCTION_TO_FUNCTION_CALL_WITNESSES_V1.0.json`

**Boundary:** a repository-latest function body can exist but be unreachable from the current browser; conversely, an internal server function can be reachable only through another function. The current audit records call-site/call-chain witnesses but does not convert reachability into Authority.

## E-04 — Direct lineage is recorded only when syntax exposes the relation

**Observed:** exact field-to-field, JSON-extract, CASE/boolean, timestamp and migration-backfill relations that are visible in SQL have been recorded separately. Examples include `runtime_events.scene_id <- discussion_sessions.scene_id` for null legacy backfill, `s6_choices.action_step <- s6_action_receipts.payload.step` for historical rows, and trigger-time `s6_choices.action_step <- s6_run_state.act9_step` for new ACT9 console choices.

**Recorded evidence:**
- `M1_DIRECT_LINEAGE_FACTS_V1.0.csv`
- `phase2/M1_TYPED_ROW_FIELD_ASSIGNMENT_WITNESSES_V1.0.json`
- `phase2/ACTIVE_FUNCTION_ASSIGNMENT_EXPRESSIONS_PART_1.json` and `PART_2.json`
- `phase2/POSITIONAL_INSERT_LITERAL_MAPPING_V1.0.json`
- `phase2/TRIGGER_NEW_OLD_FIELD_SOURCE_WITNESSES_V1.0.json`

**Boundary:** function A reading Field X and later writing Field Y is not by itself recorded as `Y <- X`. Where an input travels through an untyped local variable, JSON transformation, dynamic expression, external client, or nested function without a syntactically provable field edge, lineage remains unproven rather than guessed.

## E-05 — Runtime temporal evidence exists at RPC / presentation level, not as a 432-column change log

**Observed:** archived deterministic browser evidence supplies real timestamped execution and RPC-order evidence. The E1 run reached ACT1, ACT4, ACT5→6, ACT9–12 and ACT14 and recorded 1,007 Supabase RPC responses, all HTTP 200. Phase 2 also indexed E0 and public-smoke execution evidence and ACT/phase source witnesses.

**Recorded evidence:**
- `phase2/M5_RECORDED_RUNTIME_RPC_TIMELINE_V1.0.json`
- `phase2/TEMPORAL_ACT_PHASE_CODE_WITNESSES_V1.0.json`
- `docs/reports/remediation/structural-v1/e1/20260930035214_E1.json`

**Boundary:** these artifacts do not contain a before/after raw database row image for all 432 columns on every transition. Therefore the audit can record real operation ordering and visible outputs, but not fabricate an exact per-field live mutation timestamp when no row snapshot was captured.

## E-06 — Value-comparison investigation is externally blocked at raw-field level

**Observed:** 24 test files and their predicates were indexed. Four archived live/browser execution artifacts were reviewed. Package-C live evidence demonstrates specific output consequences (Number Note inspection, FLIP, Diary, Closure Order, Watch, reconnect), and E1/public-smoke evidence demonstrates real successful runs.

**Recorded evidence:**
- `M6_VALUE_COMPARISON_AVAILABILITY_V1.0.csv`
- `phase2/M6_TEST_PREDICATES_BATCH_1.json` … `BATCH_3.json`
- `phase2/M6_EXISTING_RUN_ARTIFACT_EVIDENCE_AND_MISSING_SAMPLES_V1.0.json`
- `docs/reports/remediation/structural-v1/PACKAGE_C_C_CA_001_CORRECTION_EVIDENCE.md`

**Boundary:** no authorized raw Supabase/PostgreSQL table snapshot or paired before/after snapshot exposing the 432 persistent fields is available to the current GA execution context; no local PostgreSQL engine is available. Archived screenshots and HTTP/RPC status do not expose raw column values. Consequently **field-pair value comparison count remains 0**. This is an unavailable-data result, not an omitted static-analysis task.

## E-07 — Existing tests are evidence only when execution artifacts exist

Test source predicates are recorded as expectations. A predicate alone is not converted into a passed factual observation. When an archived run/report identifies an exact tested implementation and result, that execution evidence is recorded separately. This prevents source assertions from being double-counted as actual measurements.

## Investigation stop condition for this phase

Repository-source investigation has been carried through all available migration/function/test/browser artifacts and field-level source maps. The remaining unobserved items in E-01, E-02, E-05 and E-06 require direct deployed-database catalog/row access or new instrumented execution that is not available to this GA context. They are preserved as explicit evidence gaps.

No inference step is authorized by this ledger.