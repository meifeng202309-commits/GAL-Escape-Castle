# Six-method 432-field investigation — Factual closure V1.0

Date: 2026-10-07  
Owner: GA  
Stage: **INVESTIGATION + FACT RECORDING COMPLETE TO AVAILABLE EVIDENCE BOUNDARY**  
Authority inference: **NOT STARTED**  
Semantic SAME_FACT / DIFFERENT_FACT inference: **NOT STARTED in this closure phase**  
CD implementation authorization: **NONE — HOLD remains in force**

## 1. What was investigated

The investigation began from the pre-existing exhaustive persistent-field inventory:

- 50 persistent tables;
- 432 permanent field identities (`F0001`–`F0432` / `table#ordinal`);
- complete migration/source traversal baseline;
- SQL, JS/MJS and HTML reference evidence.

It then carried each of the six requested evidence methods through a second source-forensics pass and archived execution evidence, without assigning Authority.

Primary merged table:

`docs/plans/authority-field-audit-v2/SIX_METHOD_432_FIELD_FACTS_MASTER_V2.0.csv`

QA / boundaries:

- `SIX_METHOD_INVESTIGATION_QA_V1.0.md`
- `INVESTIGATION_EXCEPTION_LEDGER_V1.0.md`

## 2. M1 — Data-source / lineage investigation

Factual evidence recorded includes:

1. original field declaration/default/identity source;
2. field-scoped FK references, explicitly classified as referential edges rather than automatic copy edges;
3. all scanner-marked copy/derived write-expression candidates;
4. typed `%rowtype` field-reference and scalar-assignment witnesses;
5. positional INSERT mappings;
6. trigger `NEW` / `OLD` source witnesses;
7. function-to-function call witnesses;
8. explicitly provable direct/derived relations separated into `M1_DIRECT_LINEAGE_FACTS_V1.0.csv`.

The direct-lineage file deliberately records relation class (`DIRECT_COPY_IF_TARGET_NULL`, `COMPUTED_FROM_FIELD_IF_TARGET_NULL`, `JSON_EXTRACT_COPY`, `DIRECT_TRIGGER_COPY`, etc.) instead of collapsing all relations into a generic “copied from”.

No upstream source is labeled Authority merely because it is earlier in a lineage chain.

## 3. M2 — Write Analysis

The first pass recorded **2,156 raw SQL write occurrences** across historical migration definitions.

Phase 2 then traversed all 70 repository migrations, parsed 302 function declaration events and identified 155 last-definition candidates by exact function signature, with three last operations being drops. Field write witnesses were recomputed against these repository-latest definition candidates, while historical/migration-only writes were retained separately.

Five overloaded/multi-signature names are explicitly tracked by exact signature:
- `s2_send_message`
- `s2_submit_vote`
- `s3b_submit_library_code`
- `s8_finalize`
- `s8_export_session`

No deployed `pg_proc` inspection was available; repository-latest is therefore not mislabeled “deployed verified”.

## 4. M3 — Read Analysis

The first pass recorded **6,755 raw SQL read occurrences** and **474 non-SQL field-name references**.

Phase 2 added:
- reads in last repository function-definition candidates;
- historical/migration-only read separation;
- frontend RPC call-site facts;
- function-to-function call witnesses;
- trigger `NEW`/`OLD` field references;
- unresolved mappings retained explicitly.

A textual reference is not treated as a current business-authority read without further evidence.

## 5. M4 — Schema Analysis

For **432/432 fields**, the investigation records:
- original migration source;
- inherited scanner source pointer;
- independently verified declaration line;
- field-isolated declaration fragment;
- inline PK / FK / NOT NULL / DEFAULT / CHECK / UNIQUE markers where present.

The inherited inventory contained **314 declaration-line offsets**; these were corrected while preserving the original scanner location for traceability.

A 70-migration DDL event ledger and post-origin field-mention ledger were also produced. Because the current agent cannot query live `information_schema` / `pg_catalog`, repository schema evidence remains source-derived rather than direct deployed-catalog measurement.

## 6. M5 — Temporal Analysis

Temporal evidence now contains three distinct layers rather than treating migration order as game-time order:

1. schema/migration chronology;
2. ACT/phase source-code transition witnesses;
3. actual archived browser/RPC execution ordering.

The archived E1 run supplies real execution evidence across ACT1, ACT4, ACT5→ACT6, ACT9–ACT12 and ACT14. Its network artifact records **1,007 Supabase RPC responses, all HTTP 200**. E0 and public-smoke artifacts provide additional recorded execution evidence.

The archive does not contain a raw before/after image of all 432 database columns on each transition, so missing per-field live timestamps remain missing rather than inferred.

## 7. M6 — Value Comparison / empirical investigation

The investigation reviewed:
- 24 repository test files and their predicates;
- four archived live/browser execution artifact sets;
- Package-C live Pocket/inspection/reconnect evidence.

This establishes real observable runtime consequences for many flows, but **no archived artifact exposes raw values for all persistent database fields**.

Current audit environment facts:
- live Supabase/PostgreSQL row access available to current GA: **NO**;
- local PostgreSQL engine available: **NO**;
- raw 432-field database snapshot available: **NO**;
- paired raw before/after database snapshots available: **NO**;
- raw field-pair value comparisons performed: **0**.

Therefore M6 is complete as an **availability + existing empirical-evidence investigation**, with raw field-value comparison explicitly blocked by unavailable source data. “No comparison data” is not treated as equality, difference or Authority evidence.

## 8. Investigation completeness result

### Completed from accessible evidence

- all 432 fields linked to the six-method master;
- all repository migrations traversed;
- repository-latest function-definition candidates separated from historical definitions;
- field read/write source witnesses recorded;
- explicit data-transfer/derived relations recorded where syntax proves them;
- trigger and positional write evidence recorded;
- schema-origin and later-source evidence recorded;
- test predicates recorded without conflating them with execution;
- archived real execution evidence incorporated;
- evidence gaps and external measurement limits explicitly enumerated.

### Not observable in the current GA execution context

Only evidence that requires direct external database/catalog/raw-row access remains unobserved:
- deployed `pg_proc` / function-body verification;
- deployed `information_schema` / `pg_catalog` schema snapshot;
- raw persistent-row snapshots over game time;
- pairwise actual values for all candidate fields.

These are not repository tasks left unfinished. They require a different data-access capability or a newly authorized instrumented test that captures raw DB state.

## 9. Interpretive firewall

This closure does **not** decide:
- which field is Current Authority;
- which field should become Target Authority;
- SAME_FACT / DIFFERENT_FACT;
- legacy support / obsolete;
- bug / non-bug;
- confidence level;
- migration/retirement action.

The earlier preliminary same-name triage is historical working material and is not imported as a conclusion into this closure.

## 10. Handoff state

**Facts-only investigation is now stopped at the requested boundary.**

Next stage, when Teacher/User explicitly starts it, is row-by-row / fact-cluster reasoning over the evidence master, with conflicts handled explicitly rather than by majority vote. CA concurrence remains required before any Authority Registry freeze, and CD remains HOLD until a later authorized release.