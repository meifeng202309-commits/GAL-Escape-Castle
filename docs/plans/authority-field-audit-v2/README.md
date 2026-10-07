# Six-method field investigation — Evidence index V1.0

**Date:** 2026-10-07  
**Owner:** GA (same persistent role; successor chat)  
**Scope:** Investigation and literal fact recording ONLY  
**Current / target authority inference:** **NOT STARTED**  
**Semantic SAME_FACT / DIFFERENT_FACT adjudication:** **NOT PERFORMED in this phase**  
**Implementation authorization:** **NONE; CD remains HOLD**  
**Audited static-evidence baseline:** `2ef537d4fc493b296571206121d062f89478623a`  
**Pinned input-reading commit:** `cfea5155712c0ff416e40ff59e0c49c615fcb4a8`

Git comparison from the raw static-audit baseline to the pinned input commit showed **no changes to database/, src/, tests/, scripts/ or runtime HTML**. Audit files below were written after the input commit, on `remediation/sprint9-structural-v1`; their write commits are **not** new runtime baseline evidence.

## A. Primary master

- [SIX_METHOD_432_FIELD_FACTS_MASTER_V1.0.csv](SIX_METHOD_432_FIELD_FACTS_MASTER_V1.0.csv) — 432 distinct fields, 43 columns, each field connected to six method-specific evidence records. `CURRENT_AUTHORITY`, `TARGET_AUTHORITY`, and `FACT_SEMANTIC_CLASS` intentionally remain blank.
- Original Field IDs are unchanged and sourced from `docs/plans/ROUND1_UNIQUE_FIELD_INVENTORY_V1.0.csv`. This audit does not create another identifier namespace.

## B. Method-specific evidence, not inferential conclusions

| Method | Evidence file(s) | What was recorded | What was **not** proved |
|---|---|---|---|
| M1 Data lineage | [M1_DATA_LINEAGE_LITERAL_FACTS_V1.0.csv](M1_DATA_LINEAGE_LITERAL_FACTS_V1.0.csv); [literal SQL witness 1](M1_LINEAGE_WRITE_EXPRESSION_WITNESSES_PART01.csv), [witness 2](M1_LINEAGE_WRITE_EXPRESSION_WITNESSES_PART02.csv) | Original DDL creation/default/identity; **87** inline field-scoped FK references (referential edges, not data-copy edges); **30** `DERIVED_OR_COPY` raw scanner-marked write expressions across **20** fields, preserved with literal SQL lines | A schema FK is not a copied fact. `DERIVED_OR_COPY` is a *scan tag*, NOT confirmed lineage. No direct copy-source Field ID/root is asserted |
| M2 Write | [M2_WRITE_STATIC_FACTS_V1.0.csv](M2_WRITE_STATIC_FACTS_V1.0.csv) | **2,156** raw SQL write occurrences with context counts, first/last source witnesses, scan shape tags | Historical migrations/replaced function versions are included. Current deployed/effective writer not established |
| M3 Read | [M3_READ_STATIC_FACTS_V1.0.csv](M3_READ_STATIC_FACTS_V1.0.csv) | **6,755** raw SQL read occurrences; **474** non-SQL field-name references; unclassified trigger references | A textual reference is not necessarily active reader; ambiguous JavaScript ownership and indirect reads remain unresolved |
| M4 Schema | [DDL source 1](M4_SCHEMA_ORIGIN_PART01.csv), [DDL source 2](M4_SCHEMA_ORIGIN_PART02.csv), [DDL source 3](M4_SCHEMA_ORIGIN_PART03.csv) | **432/432** original column declarations; exact original SQL line and column-specific fragment, inline syntax markers; original inventory source pointer and corrected DDL pointer retained | Only original declaration; subsequent ALTER/constraints/indexes and current effective deployed schema not fully reconstructed |
| M5 Temporal | [M5_TEMPORAL_STATIC_FACTS_V1.0.csv](M5_TEMPORAL_STATIC_FACTS_V1.0.csv) | Schema-introduction migration and raw SQL-write migration first/last witness; field-scoped timestamp/default-now syntax | Migration application order is not runtime ACT event order; no actual per-run timestamps or lifecycle-change observations |
| M6 Value Comparison | [M6_VALUE_COMPARISON_AVAILABILITY_V1.0.csv](M6_VALUE_COMPARISON_AVAILABILITY_V1.0.csv) | **128** static test-code access references indexed; explicit availability/missing-data flags for every field | **0 real runtime field-value comparisons performed**; no authorized isolated DB/run snapshots available. Static test source is NOT execution evidence |

## C. Source quality and QA findings

All six method-level inventories cover the identical 432 Field IDs with no duplicate/missing keys; the master is **432 records × 43 columns**. The schema declarations span **26** unique migration SQL scripts and are sharded 192/174/66 records to preserve GitHub-friendly inspection.

A source-integrity error was found during QA: the prior raw schema event's `origin_line` pointed to the preceding line (or the CREATE TABLE header) for **314** fields. Every original SQL declaration was independently located in its source file; `origin_line` was **retained as historical scanner evidence**, with a separate verified `ddl_verified_line` and `ddl_line_resolution_delta`. Multi-column-per-line DDL was also parsed into separate field-specific literal fragments to prevent falsely associating another column's DEFAULT/NOT NULL/FK with the target field.

**Validation result:** 432 distinct original Field IDs; 432 exact column declaration fragments; source column-name/type matches 432/432; 0 missing or extra Field IDs across method inventories; 0 Authority/semantic classifications asserted. `M6` correctly records **NOT_OBSERVED** rather than a fictitious PASS.

## D. Interpretive firewall / explicit evidence gaps

The evidence tables intentionally do **not**:
- infer that a source/copy relationship makes an upstream field an Authority;
- treat a function that both reads and writes as proof of direct data transmission;
- infer a SAME_FACT relation from same-name fields, FK references, equal values, or co-timed source events;
- classify old fields as OBSOLETE or label every old-field reference a bug;
- determine `CURRENT_AUTHORITY` or `TARGET_AUTHORITY`;
- change game semantics, database objects, clients, migrations, protections, or the CD HOLD gate.

The following investigation gaps are **explicit**, not silently completed: verified direct-copy/value-transform edges; latest *effective* deployed function versions; post-introduction schema alterations and constraints; runtime ACT-specific temporal sequences; real isolated-run numerical comparisons. These require appropriately scoped further factual investigation before final confidence/Authority judgments.

## E. Relationship to earlier project records

Original evidence remains under:
- `docs/plans/ROUND1_UNIQUE_FIELD_INVENTORY_V1.0.csv`
- `docs/plans/ROUND1_FIELD_READ_WRITE_OVERVIEW_V1.0_part1.csv` and `part2.csv`
- `docs/plans/ROUND1_FIELD_AMBIGUOUS_REFERENCES_V1.0.csv`
- `docs/tmp files/authority-field-audit/schema_batch_*.json`
- `docs/tmp files/authority-field-audit/access_sql_batch_*.json`
- `docs/tmp files/authority-field-audit/access_test_sql_batch_6.json`
- `docs/tmp files/authority-field-audit/access_code_batch_*.json`

The earlier `ROUND1_SAME_NAME_FIELD_SEMANTIC_TRIAGE_V0.1_DRAFT.md` is a *prior preliminary classification exercise* and is **not imported into this facts-only master**.

**Stop point:** The evidence master and the six investigation channels are recorded with coverage and limitations; **no single-field Authority inference has begun**. Later semantics/Authority decisions require a separate user-approved review phase.
