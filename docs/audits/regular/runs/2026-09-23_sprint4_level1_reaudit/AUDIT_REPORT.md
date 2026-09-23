# Sprint4 Asset Manager V2 — Focused Level 1 CA Re-audit

Baseline: `2234814289cf5cb95decd70cdd3df05240f826db`  
Scope: closure of S4-CA-001 through S4-CA-007 plus adjacent regression risk  
Audit level: Level 1 — Focused re-audit  
Decision: **FAIL / BLOCKED — TWO NARROW BLOCKERS REMAIN**

## 1. Inputs and independence

CA froze the correction baseline above and independently reconstructed the changed control flow from:

- `database/024_sprint4_level1_narrow_corrections.sql`;
- `scripts/import-asset-candidate.mjs`;
- `scripts/publish-asset-candidate.mjs`;
- Teacher Asset Manager UI changes;
- unchanged migrations `018–023`;
- Sprint4 live/static test changes.

CD-reported live/transaction results are supporting evidence only.

Migrations `018–023` were verified byte-identical to the previously audited baseline. Migration `024` is additive.

## 2. Closure matrix

| Finding | Re-audit status | Result |
|---|---|---|
| S4-CA-001 HIGH | **FIXED_VERIFIED** | Ordinary self-issued room tokens no longer satisfy global Asset Manager reviewer authority. The new reviewer allowlist is independently required before state/review/anchor operations. |
| S4-CA-002 HIGH | **FIXED_VERIFIED** | The publication script no longer registers or approves candidates; it consumes an already-APPROVED candidate and verifies identity before publication. |
| S4-CA-003 HIGH | **FIXED_VERIFIED** | The service publication path now uses group activation; a canonical paired group must be complete and eligible, and status changes occur in one transaction. Legacy single activation/rollback service paths are removed from the production service-role path. |
| S4-CA-004 HIGH | **FIXED_VERIFIED** | Registry sync rejects duplicate keys, computes content digest server-side, rejects supplied digest mismatch, and removes omitted projection keys or fails transactionally if referential history prevents removal. The prior duplicate+omission silent-mix path is closed. |
| S4-CA-005 MEDIUM | **FIXED_VERIFIED** | The UI now exposes all required anchors and selects the first missing anchor rather than permanently binding to `required[0]`. |
| S4-CA-006 MEDIUM | **NOT CLOSED** | The new lifecycle path improves retry behavior, but a reachable legacy service-role writer still bypasses it, and replay identity is not verified before declaring a reused candidate. |
| S4-CA-007 MEDIUM | **FIXED_VERIFIED** | The publisher rereads the stored object and checks its SHA-256 before recording publication. |

## 3. Remaining blocker — S4-CA-006

Severity: **MEDIUM**  
Status: **CONFIRMED / NOT CLOSED**

Two independent problems remain at the candidate-import boundary.

### A. Legacy service-role writer still bypasses the corrected lifecycle

Migration 020 explicitly granted `asset_manager_register_candidate(...)` to `service_role`.

Migration 024 introduces the new:

- `asset_manager_import_candidate(...)`
- `asset_manager_submit_for_review(...)`

path, but does not remove the old register function from the service-role production authority set.

Therefore a service publication actor can still create a candidate directly as `PENDING_REVIEW`, bypassing the corrected `UPLOADED → PENDING_REVIEW` lifecycle semantics.

The browser boundary remains safe; this is an internal production-authority duplication problem.

### B. Idempotent replay does not verify immutable candidate identity

`asset_manager_import_candidate(...)` first locates an existing row by `(asset_key, version)`.

If found, it returns that row as:

`reused=true`

without verifying that the retried candidate's immutable identity matches the existing row, including at minimum the SHA-256/package identity.

A different package presented under the same key/version can therefore be accepted as an "idempotent" import replay even though it is not the same immutable candidate.

The later publication command will reject a SHA mismatch, so this does not silently activate a wrong binary; however the import/review lifecycle itself can still misrepresent a conflicting retry as a valid replay.

Closure condition:

- there must be one unambiguous production candidate-import lifecycle;
- no reachable production writer may bypass the canonical pre-review lifecycle;
- a replay may be treated as idempotent only when it represents the same immutable candidate identity;
- a conflicting same-key/version package must not be reported as a successful replay.

CA is not prescribing how CD retires/guards legacy authority or how identity equality is implemented.

## 4. New adjacent regression finding — S4-RC-001

Severity: **MEDIUM**  
Status: **CONFIRMED**

Migration 024 fixes paired runtime atomicity by introducing `asset_manager_activate_group(...)` and `asset_manager_rollback_group(...)`.

However these new authoritative mutation paths directly update candidate statuses and do not append corresponding activation/rollback entries to `asset_events`.

The previous single-asset activation implementation did record an `activated` event.

This creates a history regression in the corrected production path:

- current ACTIVE state can be correct;
- but append-only operational history no longer reconstructs the activation/rollback transition that produced it.

This conflicts with the approved Sprint4 scope requirement to track asset publication, approval, activation and related operational events, and with the project's recurring Pattern D concern.

Closure condition:

Authoritative group activation / rollback must leave durable operational evidence sufficient to reconstruct the transition without treating it as player behavior.

CA is not prescribing event schema or payload shape.

## 5. Adjacent non-blocking observation

The multi-anchor selector now exposes all canonical required anchors, so S4-CA-005 is closed.

Within one still-open dialog, however, `anchorCandidate.anchors` is a snapshot from dialog-open time. Saving anchor A, then immediately saving anchor B without reopening the dialog can rebuild the payload from stale local anchor state and omit A.

The activation gate prevents an incomplete set from becoming ACTIVE, so this is not a current release blocker. It should be treated as a UI-quality follow-up if it remains reproducible.

## 6. Areas reconfirmed PASS

- migrations `018–023` remain immutable;
- ordinary anonymous room creation no longer grants global asset review authority;
- browser code still contains no service-role secret;
- publication does not manufacture semantic approval;
- paired activation is atomic at the reviewed runtime transition;
- exact-key resolver / explicit fallback behavior remains intact;
- generic publication now performs post-upload object SHA verification.

## 7. Test/evidence boundary

CD reports:

- all static suites PASS;
- Sprint1 40/40 PASS;
- Sprint2 23/23 PASS;
- Sprint3A 15/15 PASS;
- Sprint3B 44/44 PASS;
- Sprint3B remediation 15/15 PASS;
- Sprint3C 15/15 PASS;
- Sprint4 15/15 PASS;
- targeted DB transaction checks for registry, paired activation and lifecycle replay.

These results support the correction but do not close the two source-level defects above.

Current tests do not challenge:

- the still-reachable legacy service-role candidate writer;
- same key/version import replay with a different SHA/package identity;
- append-only event reconstruction for the new group activation/rollback path.

## 8. Recurring-error pattern scan

| Pattern | Result | Focused re-audit result |
|---|---|---|
| A — local correctness / cross-module handoff | PASS for closed findings | reviewer, publisher, registry and paired-runtime handoffs materially improved. |
| B — retry / distributed boundary | **FINDING** | S4-CA-006: conflicting replay can be mislabeled idempotent. |
| C — UI vs server authority | PASS | global reviewer authority is now server-enforced independently from ordinary room creation. |
| D — current state vs historical evidence | **FINDING** | S4-RC-001: group activation/rollback changes state without durable asset transition events. |
| E — authority accretion / legacy reachability | **FINDING** | S4-CA-006: old service-role candidate registration remains reachable beside the corrected lifecycle. |
| F — self-confirming tests | **FINDING** | current tests exercise the new path but do not challenge the retained old writer or conflicting replay identity. |

## 9. Gate disposition

**Sprint4 remains BLOCKED.**

Only two narrow blockers remain:

- S4-CA-006 MEDIUM — candidate lifecycle / replay identity;
- S4-RC-001 MEDIUM — missing activation/rollback operational history.

No Sprint5 implementation should start while this gate is open.

Any DB correction must remain additive at migration **025+**; deployed migrations `018–024` are immutable.

After CD submits the narrow correction, CA will perform the next focused Level 1 re-audit automatically under the active procedural-autonomy rule.
