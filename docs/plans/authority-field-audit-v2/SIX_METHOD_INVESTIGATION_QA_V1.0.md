# Six-method 432-field investigation — QA V1.0

Date: 2026-10-07  
Owner: GA  
Scope: evidence-completeness QA only  
Authority / semantic inference: **NONE**  
CD authorization: **NONE — HOLD remains in force**

## 1. Master-table identity and boundaries

Primary merged evidence table:

`docs/plans/authority-field-audit-v2/SIX_METHOD_432_FIELD_FACTS_MASTER_V2.0.csv`

The table preserves the existing permanent field identity namespace `F0001` … `F0432` / `table#ordinal`; no new field IDs were invented. The file has one header plus 432 field records. Spot/edge verification confirms the ordered sequence reaches `F0432 = teacher_overrides#12` and the sampled interior ranges preserve the same identity/order scheme.

The following inference columns remain intentionally unfilled / not-started:
- `AUTHORITY_INFERENCE_STATUS`
- `CURRENT_AUTHORITY`
- `TARGET_AUTHORITY`
- `FACT_SEMANTIC_CLASS`
- `INFERENCES_OR_AUTHORITY_DECISIONS`

The merged phase-2 investigation status is factual-source status, not a confidence score or Authority result.

## 2. Runtime-baseline isolation

Pinned investigation input commit:

`cfea5155712c0ff416e40ff59e0c49c615fcb4a8`

Git comparison from that input commit to the audit-evidence branch head immediately before this QA shows only:
- GA Action Log records; and
- new files under `docs/plans/authority-field-audit-v2/`.

There are **no changes to `database/`, `src/`, `tests/`, `scripts/`, or runtime HTML** in the audit interval. The audit therefore has not mutated the subject being investigated.

## 3. Six-method source coverage

### M1 — Data lineage / source relation

Recorded:
- original field declaration/default/identity evidence;
- field-scoped FK references (kept explicitly as referential edges, not copy claims);
- scanner candidate assignment expressions;
- typed `%rowtype` field references and exact typed scalar assignment witnesses;
- positional INSERT mapping evidence;
- trigger `NEW` / `OLD` field witnesses;
- separately curated syntactically provable direct/derived relations in `M1_DIRECT_LINEAGE_FACTS_V1.0.csv`.

Not converted into facts without syntax: “function reads X and writes Y” is not automatically `Y <- X`.

### M2 — Write analysis

Recorded:
- all raw historical SQL write witnesses from the 70-migration traversal;
- last-repository-function-definition-candidate write witnesses;
- historical/migration-only write counts separated from those candidates;
- unresolved mappings retained rather than guessed.

### M3 — Read analysis

Recorded:
- all raw historical SQL read witnesses;
- last-repository-function-definition-candidate read witnesses;
- historical/migration-only read counts separated;
- frontend RPC call sites;
- function-to-function call witnesses;
- trigger `NEW`/`OLD` references.

### M4 — Schema analysis

Recorded:
- exact original DDL declaration for 432/432 fields;
- corrected verified declaration source line alongside the inherited raw scanner line;
- field-isolated DDL fragments for multi-column single-line declarations;
- later DDL/source mentions and the 70-migration DDL event ledger.

Direct deployed `information_schema` / `pg_catalog` introspection is not available and is separately declared in the Exception Ledger.

### M5 — Temporal analysis

Recorded:
- migration introduction/change ordering;
- ACT/phase code witnesses;
- actual archived browser/RPC execution ordering, including E0/E1 evidence;
- E1 crosses ACT1, ACT4, ACT5→6, ACT9–12 and ACT14 and records 1,007 successful Supabase RPC responses.

No 432-column before/after mutation log exists in archived evidence, so no fabricated per-field live timestamp is inserted.

### M6 — Value comparison / empirical evidence

Recorded:
- predicates/expectations from 24 repository test files, explicitly marked as source expectations rather than execution proof;
- four archived browser/live execution artifacts;
- Package-C live evidence showing item-inspection/knowledge/view/reconnect consequences;
- availability status for actual raw persistent-field pair comparison.

Result: **0 raw DB field-pair comparisons**, because no authorized raw 432-field database snapshot/pair is available to the current GA environment. This is an explicit data-availability result, not an inferred equality/difference result.

## 4. Phase-2 parser / source exceptions retained

The QA does not suppress the following facts:
- repository-latest function candidate ≠ direct deployed `pg_proc` verification;
- five function names have multiple signature keys and are tracked by exact signature;
- multi-line/dynamic DDL is not claimed as a deployed catalog snapshot;
- browser-visible/RPC evidence is not raw table-row evidence;
- static test predicates are not execution results by themselves;
- direct lineage is only asserted for explicit syntax-visible relations.

See `INVESTIGATION_EXCEPTION_LEDGER_V1.0.md`.

## 5. Completeness disposition

**Repository-available investigation: COMPLETE to the evidence boundary described above.**

This means all six investigation channels have been carried through the available source migrations, current repository function-definition candidates, trigger/callsite evidence, test source, and archived execution artifacts and merged against all 432 field identities.

It does **not** mean the six channels all contain the same class of evidence. In particular, direct deployed database introspection and raw row/value snapshots are externally unavailable to the current GA context and therefore remain explicit missing-data fields rather than guessed results.

**Authority / SAME_FACT / DIFFERENT_FACT / OBSOLETE / BUG inference remains NOT STARTED in this phase.**