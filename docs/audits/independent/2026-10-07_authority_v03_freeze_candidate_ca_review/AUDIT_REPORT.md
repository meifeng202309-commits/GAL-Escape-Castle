# CA Review — Authority Registry V0.3 Freeze Candidate

**Date:** 2026-10-07  
**Reviewer:** CA  
**Scope:** Independent semantic review of GA reconciliation after CA-161  
**Implementation authorization:** NONE  
**CD general status:** HOLD

## 1. Disposition

**SEMANTIC FREEZE CANDIDATE: ACCEPTABLE**

CA finds no remaining material repository-semantic contradiction in:

- `ROUND1_CANONICAL_AUTHORITY_REGISTRY_V0.3_FREEZE_CANDIDATE.md`;
- `CA161_RECONCILIATION_V1.0.md`;
- `JSONB_RUNTIME_READ_SUBFACTS_V1.0.csv`.

All eight CA-161 material findings have been substantively reconciled.

This is **not yet a final pre-freeze PASS**, because two external deployed-state evidence gates remain open:

1. deployed schema/function/grant confirmation;
2. deployed raw row-pair comparison.

## 2. CA-161 reconciliation check

### CA-AUTH-001 — PASS
Run-level `game_runs.silent_texting_mode` is restored as a distinct run-level story/gameplay Authority, separate from per-Discussion policy.

### CA-AUTH-002 — PASS
`s5_rounds.status / resolution_source / resolved_at` are now adjudicated as S5-round facts rather than generic Discussion mirrors.

### CA-AUTH-003 — PASS AS TARGET CONTRACT WITH EXPLICIT PRECONDITION
The Registry now states that `s3_item_catalog.name_text_key` becomes the sole item-label Authority **after** V4 `item.*` normalization, and explicitly records the current split/data mismatch.

This is semantically acceptable as a target Authority contract. It is not permission to read stale catalog values as canonical before normalization.

### CA-AUTH-004 — PASS
`s3_runtime_scene_state.allow_share_photo` is now server-side authorization/capability Authority; UI presentation derives from it.

### CA-AUTH-005 — PASS
`game_runs.scene_id / phase_key / step_key` are predicate-split:
- ACTIVE: SUPPORT_ONLY / NO_FALLBACK;
- canonical FINALIZED run: durable final-state/export snapshot.

### CA-AUTH-006 — PASS
`s1_scene_choices` is correctly classified as:
`DEAD_FOR_CURRENT_FORMAL_UI / DORMANT_RPC_REACHABLE`.

No retirement assumption is made before deployed function/grant verification and explicit quarantine/CFTM disposition.

### CA-AUTH-007 — PASS
The five durable legacy facts now have explicit Knowledge/Observation destinations and a hard provenance rule preserving original discovery timestamps and ACT1 source context.

### CA-AUTH-008 — PASS
The bounded JSONB semantic register covers current runtime-read nested business facts without trying to promote arbitrary event payloads into current gameplay Authority.

## 3. Core Resolver / wrapper contract

CA accepts the following as a coherent design-time contract:

- no persisted generic global-phase state machine;
- Core Resolver derives current runtime from existing authoritative objects;
- Player/Teacher wrappers are information-security boundaries;
- participant progress is projection only;
- exact interaction identity prevents stale completion carry-over;
- support/event records never become current phase by recency;
- ACTIVE missing Authority fails closed rather than falling back to `game_runs` mirrors;
- browser-local state remains non-authoritative and restores only under Same-owner + Still-valid.

## 4. External evidence gates

Both remain **OPEN** and must be observed before final freeze/retirement/remediation decisions that depend on deployed reality.

### Gate E1 — deployed definition / schema / grants
Need exact evidence of:
- deployed relevant columns/types;
- current deployed priority function identities/bodies;
- browser-role executable reachability of legacy RPCs;
- relevant effective grants.

### Gate E2 — deployed raw value pairs
Need exact evidence of:
- registry vs ACTIVE candidate copies;
- item catalog vs group-item labels;
- obsolete asset metadata empirical presence;
- ACTIVE `game_runs` mirrors vs presentation state;
- FINALIZED final-state snapshots.

## 5. Review of GA's read-only probe

The probe is safe in intent and contains SELECT/read-only statements.

CA approves its use with three evidence-quality safeguards.

### Safeguard P1 — distinguish absence from equality/difference

For LEFT JOIN comparisons, a missing joined row must be declared `ROW_ABSENT`, not `PAIR_EQUAL` or `PAIR_DIFFERENT`.

Examples:
- no ACTIVE candidate row;
- no presentation row for an ACTIVE run;
- no finalization row for a completed run.

CD must record row-presence explicitly before classifying a pair.

### Safeguard P2 — grant evidence must distinguish direct grant from effective privilege

`information_schema.routine_privileges` is useful raw evidence but absence of a direct row is not, by itself, proof that the role lacks effective EXECUTE via PUBLIC/role inheritance.

For the legacy `s1_submit_private_choice` RPC, the probe already uses `has_function_privilege`; that effective result controls the reachability declaration.

For any additional grant conclusion, CD must state whether it is:
- DIRECT_GRANT_OBSERVED;
- EFFECTIVE_PRIVILEGE_CONFIRMED;
- NO_DIRECT_GRANT_ROW;
- EFFECTIVE_PRIVILEGE_UNVERIFIED.

### Safeguard P3 — preserve evidence before interpretation

For every declaration:
1. exact query;
2. exact raw output;
3. deployed project/environment identifier;
4. execution timestamp;
5. repository branch + HEAD;
6. technical declaration;
7. interpretation.

No repair is permitted during collection.

## 6. Final CA position

V0.3 is acceptable as the **semantic freeze candidate**.

The two external deployed-state gates remain open.

CA approves a bounded CD evidence-acquisition task **with the safeguards above**.

General CD implementation remains HOLD.

After CD returns raw evidence:
- CA/GA will adjudicate its significance;
- only then may the Authority Registry become final freeze candidate / frozen contract;
- any remediation remains a later separately authorized package.
