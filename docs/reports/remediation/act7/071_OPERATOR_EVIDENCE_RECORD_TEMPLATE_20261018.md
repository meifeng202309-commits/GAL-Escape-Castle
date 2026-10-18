# Migration 071 operator evidence record template

Status: blank template; not evidence until completed and independently reviewed

## A. Window identity

| Field | Required record |
|---|---|
| Project ref / PostgreSQL version | |
| Teacher authorization reference | |
| CD coordinator / operator | |
| UTC window start / end | |
| Source commit / migration SHA-256 | |
| Recovery / evidence SQL / fixture SHA-256 | |
| Frozen Pages ref / candidate ref | |
| Prechange catalog evidence path/hash | |
| Six-function ACL snapshot evidence path/hash | |
| Service-role owner attestations | |

Every row below must use one disposition: `CAPTURED_PENDING_CA`, `MISSING`, `FAILED`, or `NOT_REACHED`. Do not enter PASS; CA assigns the audit disposition.

## B. Q0 preservation records

| Boundary | UTC | Query/result file | Existing ACTIVE identity digest | Existing total / historical / retained | New synthetic identities counted separately | Disposition / failure detail |
|---|---|---|---|---|---|---|
| PRE_MAINTENANCE | | | | | n/a | |
| POST_DEPLOY_PRE_FIXTURE | | | | | 0 expected | |
| FINAL_BEFORE_CA_HANDOFF | | | | | | |

Required: exact query text, complete result, substituted parameters if any, result SHA-256 and operator identity. Any lost existing identity is `FAILED`; do not clean or repair rows to alter the evidence.

## C. NORMAL Q1 boundary records

| Boundary | UTC | Run / room / discussion / phase / round | Query/result file + SHA-256 | Key observed values | Disposition / failure detail |
|---|---|---|---|---|---|
| ROUND2_OPEN | | | | | |
| TWO_VOTES | | | | | |
| AFTER_61S | | | | | |
| THIRD_VOTE_RESOLVED | | | | | |
| BEFORE_STALE | | | | | |
| AFTER_STALE | | | | | |
| BEFORE_NORMAL_ADD | | | | | |
| AFTER_NORMAL_ADD | | | | | |
| BEFORE_INVALID_TOKEN | | | | | |
| AFTER_INVALID_TOKEN | | | | | |

For every before/after pair, retain both complete rows and explicitly record hash/event-count equality or the exact mismatch. The two 61-second waits must record start and end UTC timestamps.

## D. NORMAL Q2/Q3 records

| Boundary | UTC | Original round-2 discussion identity | Query/result file + SHA-256 | Three locked-vote rows / one resolution values | Disposition / failure detail |
|---|---|---|---|---|---|
| THIRD_VOTE_RESOLVED — Q2 | | | | | |
| THIRD_VOTE_RESOLVED — Q3 | | | | | |

## E. AUDIT Q4 boundary records

| Boundary | UTC | Run / room / discussion / phase / round | Query/result file + SHA-256 | Status / deadline / timing / event counts | Disposition / failure detail |
|---|---|---|---|---|---|
| AUDIT_VOTING | | | | | |
| AUDIT_AFTER_61S | | | | | |
| AUDIT_AFTER_ADD | | | | | |

## F. Failure or missing observation record

Complete this immediately for every `MISSING`, `FAILED` or `NOT_REACHED` row:

| Field | Required record |
|---|---|
| First failing/missing boundary | |
| UTC detected | |
| Expected observation | |
| Actual observation/error (verbatim, secrets redacted) | |
| Last verified DB/Pages/ACL state | |
| STOP invoked by | |
| Rollback steps started/completed | |
| Final Pages/SQL/ACL/Q0 evidence paths | |
| Unresolved incident item / next owner | |

Pressing Enter, fixture completion or console output is never a substitute for a saved result record. Incomplete records remain NOT VERIFIED.
