# CA → CD — Bounded deployed Authority evidence acquisition

**From:** CA
**To:** CD
**Date:** 2026-10-07
**Status:** AUTHORIZED_BOUNDED_EVIDENCE_COLLECTION_ONLY
**General implementation authorization:** NONE
**Database mutation authorization:** NONE
**CD general remediation status:** HOLD
**NEXT_OWNER after completion:** CA + GA

CA authorizes one narrowly bounded deployed-state evidence task to close the two remaining Authority pre-freeze external gates.

This is **not** authorization to fix, migrate, normalize, delete, retire, grant/revoke, or otherwise modify deployed state.

## 1. Primary probe

Use:

`docs/plans/authority-field-audit-v2/AUTHORITY_PREFREEZE_READONLY_PROBES_V1.0.sql`

as the fixed primary query source.

The database task is SELECT/read-only only.

Forbidden:
- INSERT
- UPDATE
- DELETE
- ALTER
- CREATE / CREATE OR REPLACE
- DROP
- GRANT / REVOKE
- migration execution
- RPC mutation calls
- normalization
- cleanup
- repair

Repository writes are allowed **only** for evidence files, CD Action Log, and the final handoff.

## 2. Evidence order

For every probe/result preserve this order:

1. exact query;
2. exact raw output;
3. deployed project/environment identifier;
4. execution timestamp;
5. repository branch + HEAD used for comparison;
6. technical declaration;
7. technical interpretation.

Raw evidence must precede interpretation.

If a mismatch is found, **do not repair it**.

## 3. Allowed technical declarations

Use only objective declarations such as:

- `DEPLOYED_FUNCTION_PRESENT`
- `DEPLOYED_FUNCTION_ABSENT`
- `BODY_MATCH`
- `BODY_MISMATCH`
- `DIRECT_GRANT_OBSERVED`
- `NO_DIRECT_GRANT_ROW`
- `EFFECTIVE_PRIVILEGE_CONFIRMED`
- `EFFECTIVE_PRIVILEGE_DENIED`
- `EFFECTIVE_PRIVILEGE_UNVERIFIED`
- `PAIR_EQUAL`
- `PAIR_DIFFERENT`
- `ROW_ABSENT`
- `VALUE_PRESENT`
- `VALUE_ABSENT`
- `UNVERIFIED`

Do **not** declare:
- final canonical Authority;
- Authority Registry PASS/FAIL;
- retirement approval;
- migration approval;
- deletion approval;
- remediation scope.

Those remain GA/CA/Teacher decisions.

## 4. CA safeguards required on top of probe V1.0

### 4.1 LEFT JOIN absence must not be misclassified

For B1/B2/B3, explicitly determine whether the ACTIVE candidate row exists.

A missing candidate row must be:

> `ROW_ABSENT`

and must not be declared `PAIR_EQUAL` or `PAIR_DIFFERENT`.

You may use this bounded supplemental SELECT if needed:

```sql
select r.asset_key, r.active_version,
       (c.asset_id is not null) as candidate_present,
       c.asset_id, c.status
from public.asset_registry_projection r
left join public.asset_candidates c
  on c.asset_key=r.asset_key
 and c.version=r.active_version
 and c.status='ACTIVE'
order by r.asset_key;
```

For B7, distinguish a missing presentation row:

```sql
select g.run_id, g.status,
       (s.run_id is not null) as presentation_row_present
from public.game_runs g
left join public.s3_runtime_scene_state s using(run_id)
where g.status='active'
order by g.run_started_at desc;
```

For B8, distinguish a missing finalization row:

```sql
select g.run_id, g.status,
       (f.run_id is not null) as finalization_row_present
from public.game_runs g
left join public.s8_finalizations f using(run_id)
where g.status='completed'
order by g.completed_at desc;
```

These are the only pre-authorized supplemental queries.

If another query is genuinely required to interpret an ambiguity:
- keep it SELECT-only;
- record the exact reason;
- keep it minimal;
- do not broaden into another 432-field investigation.

### 4.2 Grant evidence: direct vs effective

For `s1_submit_private_choice(text,text,text,text)`, the effective result from `has_function_privilege` controls the reachability declaration.

Do not infer effective denial merely because `information_schema.routine_privileges` lacks a direct row.

For other priority routines:
- report direct grant rows as direct-grant evidence;
- if effective privilege is not explicitly checked, declare it `EFFECTIVE_PRIVILEGE_UNVERIFIED`.

### 4.3 Read-only execution safety

If the execution environment supports it cleanly, run the probes inside a read-only transaction/session.

If not, execute the provided SELECT-only statements exactly and do not issue any mutating SQL.

## 5. Required evidence package

Create:

`docs/audits/independent/runs/2026-10-07_authority_prefreeze_deployed_evidence/`

with at least:

1. `EXECUTION_CONTEXT.md`
   - environment/project identifier
   - timestamp
   - repository branch + HEAD
   - who executed
   - statement that no DB mutations were performed

2. `RAW_QUERY_OUTPUT.md`
   - each probe ID
   - exact query
   - exact raw output
   - any authorized supplemental query immediately after the probe it clarifies

3. `TECHNICAL_DECLARATIONS.csv`
   - probe_id
   - subject
   - declaration
   - evidence_reference
   - technical_interpretation
   - confidence / verification state

Do not edit the Authority Registry or 432-field master as part of this task.

## 6. Required final handoff

After evidence collection, write one handoff to **CA + GA** containing:
- evidence package path;
- branch + evidence commit SHA;
- summary of objective mismatches/absences;
- list of any `UNVERIFIED` items;
- explicit confirmation: **NO DATABASE MUTATION PERFORMED**;
- explicit confirmation: **NO REMEDIATION PERFORMED**.

Then:

> **STOP.**

Do not continue into repair or implementation.

## 7. Current semantic baseline

For comparison only, the accepted semantic freeze candidate is:

`docs/plans/ROUND1_CANONICAL_AUTHORITY_REGISTRY_V0.3_FREEZE_CANDIDATE.md`

CA review:

`docs/audits/independent/2026-10-07_authority_v03_freeze_candidate_ca_review/AUDIT_REPORT.md`

The purpose of your task is to observe deployed technical reality, not to re-adjudicate that semantic contract.

**NEXT_ACTION:** collect only the bounded deployed evidence above, commit the evidence package and handoff, then STOP.
