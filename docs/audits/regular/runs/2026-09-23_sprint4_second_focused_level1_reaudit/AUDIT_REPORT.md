# Sprint4 Asset Manager V2 — Second Focused Level 1 CA Re-audit

Baseline: `adca77b7b418363aaa083f6290cb30a506d92658`  
Scope: closure of `S4-CA-006` and `S4-RC-001`, plus directly adjacent regression risk  
Audit level: Level 1 — Focused re-audit  
Decision: **FAIL / BLOCKED — ORIGINAL TWO BLOCKERS CLOSED, TWO ADJACENT BLOCKERS FOUND**

## 1. Inputs and independence

CA froze the submitted correction baseline and independently reconstructed the changed control flow from:

- `database/025_sprint4_two_narrow_blockers.sql`;
- `src/teacher/teacher-console.js`;
- `tests/sprint4-static-check.js`;
- the prior Sprint4 migrations `018–024`;
- the current import/publication scripts;
- the previous focused Level 1 report.

Commit `adca77b7...` changes only the new additive migration, the anchor-dialog local snapshot refresh, and Sprint4 static checks.

CD-reported Supabase transaction results and live regression counts are supporting evidence. CA did not independently execute service-role Supabase transactions in this pass.

## 2. Original blocker closure

| Finding | Re-audit status | Result |
|---|---|---|
| S4-CA-006 MEDIUM | **FIXED_VERIFIED** | Migration 025 removes `service_role` execution from the legacy `asset_manager_register_candidate(...)` writer. The governed import path now rejects a conflicting same-key/version replay when SHA/media identity differs instead of returning it as idempotent reuse. |
| S4-RC-001 MEDIUM | **FIXED_VERIFIED** | Authoritative group activation/rollback now writes one durable `asset_events` row per transitioned asset in the same transaction, with group membership and previous ACTIVE version context. |

The prior non-blocking anchor-dialog stale-snapshot observation is also corrected: after a successful save, local `anchorCandidate.anchors` is refreshed before the next save.

## 3. New blocker — S4-RC-002

Severity: **MEDIUM**  
Status: **CONFIRMED**

### Group transition can return success for a missing or NULL target set

The new `asset_manager_transition_group(...)` validates only:

`cardinality(p_asset_ids)=0`

It does not establish that every supplied ID actually resolves to a candidate, and a NULL array is not rejected by that expression.

For a one-element array containing a nonexistent UUID:

1. the initial `FOR UPDATE` query locks zero rows but its result is not checked;
2. `paired_asset_group` resolves to NULL;
3. the unpaired-cardinality check accepts cardinality 1;
4. the eligibility `EXISTS` query sees zero matching candidates and therefore finds no violation;
5. anchor validation iterates zero rows;
6. event insertion and status updates affect zero rows;
7. the function still returns `ok=true` and `activated=1`.

A NULL array similarly passes the initial check and can reach a successful no-op return.

The rollback wrapper inherits the same failure class because its preliminary eligibility query also treats an unresolved target set as “no violating row”.

### Impact

An authoritative service operation can be acknowledged as successful even though:

- no candidate was identified;
- no state transition occurred;
- no durable transition evidence was written.

This is a server-authority correctness defect, not a UI issue.

### Closure condition

A successful group activation/rollback must prove that the intended target set exists and is the exact set that is transitioned. Null, empty, nonexistent, or only-partially-resolved target sets must not be reported as successful transitions.

CA is not prescribing the validation mechanism.

## 4. New blocker — S4-RC-003

Severity: **MEDIUM**  
Status: **CONFIRMED BY CONTROL-FLOW / CONCURRENCY PROOF**

### Registry sync and group transition can commit incompatible version truths

The group transition helper locks candidate rows, but it does **not** lock the corresponding `asset_registry_projection` rows while validating:

`r.active_version is not distinct from ac.version`

The production `asset_manager_sync_registry(...)` path can independently update those projection rows.

A valid interleaving is therefore:

1. transition T1 locks target candidate version V1;
2. T1 reads registry `active_version=V1` and passes eligibility;
3. concurrent registry sync T2 updates and commits the same asset key to `active_version=V2`;
4. T1 then marks V1 `ACTIVE` and commits.

The resulting committed state can be:

- registry projection says V2 is the active version;
- candidate table says V1 is ACTIVE.

The resolver follows the registry version, so it can then fail to find the matching ACTIVE candidate and fall back.

This directly violates binding Sprint4 condition:

`S4-SCOPE-03 = registry/runtime identity+version authority must not silently split`.

The original pre-group activation implementation explicitly locked the registry row with `FOR UPDATE`; the group path no longer preserves an equivalent serialization boundary.

### Closure condition

Registry version authorization and authoritative activation/rollback must not be able to commit mutually incompatible truths under concurrent production operations. A transition may succeed only if the version authority it validated remains the authority governing the committed transition.

CA is not prescribing a lock, transaction, or algorithm.

## 5. Test / evidence review

CD reports:

- migration 025 deployed successfully;
- service-role legacy writer revocation verified;
- identical replay reused and conflicting SHA replay rejected;
- `candidate_uploaded`, grouped `activated`, and grouped `rolled_back` events observed in rolled-back transaction checks;
- all static suites PASS;
- Sprint1 40/40, Sprint2 23/23, Sprint3A 15/15, Sprint3B 44/44, Sprint3B remediation 15/15, Sprint3C 15/15, Sprint4 15/15 live checks PASS.

These results support closure of the two submitted blockers.

However, the submitted evidence does not challenge:

- nonexistent/NULL group targets;
- zero-row “success” behavior;
- registry-sync versus activation/rollback concurrency.

The current static test checks for source strings, so it cannot detect either behavioral failure.

## 6. Recurring-error pattern scan

| Pattern | Result | Focused result |
|---|---|---|
| A — local correctness / cross-module handoff | **FINDING** | S4-RC-003: registry version authority and candidate ACTIVE mutation are not serialized together. |
| B — retry / distributed boundary | **FINDING** | S4-RC-002: malformed/stale target identity can be acknowledged as a successful no-op. |
| C — UI rule mistaken for server rule | PASS | Both new findings are inside server-side authoritative paths, not dependent on UI enforcement. |
| D — current state vs historical evidence | PASS for S4-RC-001 closure; **FINDING adjacent** | Group events are now durable when a real transition occurs, but S4-RC-002 can claim success without any event because no target resolved. |
| E — authority accretion / legacy reachability | PASS for S4-CA-006 closure | Legacy service-role candidate registration is revoked in migration 025. |
| F — self-confirming tests | **FINDING** | String-presence and happy-path transaction checks do not falsify missing-target or registry-race behavior. |

## 7. Gate disposition

**Sprint4 remains BLOCKED.**

Original submitted blockers:

- S4-CA-006 → **FIXED_VERIFIED**
- S4-RC-001 → **FIXED_VERIFIED**

New directly adjacent blockers:

- **S4-RC-002 MEDIUM** — group transition can false-succeed on NULL/nonexistent target identity;
- **S4-RC-003 MEDIUM** — registry sync can race activation/rollback and silently split canonical `active_version` from runtime ACTIVE state.

Migration `025` is reported deployed and must now be treated as immutable history. Any DB correction begins at **026+**.

No Sprint5 implementation should start while this gate is open.

Next owner: **CD**. Correct only S4-RC-002 and S4-RC-003 plus directly adjacent regression coverage, then submit exact correction commit(s), migration(s), deployment evidence, and tests for focused Level 1 re-audit.
