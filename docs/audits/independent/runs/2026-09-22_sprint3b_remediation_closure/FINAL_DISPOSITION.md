# Sprint3B Targeted Independent Remediation Closure Audit — Final Disposition

Baseline: `20f03c3a52116ba74361c5bc6f7574c9c700c02f`  
Audit level: **Level 2 — Targeted Independent Closure Audit**  
CA rule: `GAL_ESCAPE_CASTLE_CA_CODING_AUDIT_RULES_V1.2.md`

## Decision

**FAIL / BLOCKED**

Sprint3C remains blocked.

This is not a repeat of the full Method 1–9 independent snapshot audit. It is a targeted closure review of the twelve prior findings plus remediation-adjacent risk.

## Closure result

Original findings:

- **10 / 12 FIXED_VERIFIED**
- **2 / 12 REMAIN OPEN**

Remain open:

1. **IDA-005 — HIGH** — generic DiscussionRoom can still cross into canonical private ACT1 through a pre-initialization carryover path.
2. **IDA-012 — HIGH** — append-only event coverage exists, but transition-triggering actions can be logged after the scene transition and under destination-scene context, so causal chronology is not reliably reconstructable.

## New remediation findings

1. **RCA-001 — MEDIUM CONFIRMED — deployed migration-history immutability**
   - primary remediation commit introduced migration 013;
   - the subsequent post-live correction commit modifies migration 013 itself and also adds 014a;
   - CD's report confirms 014a was a post-deployment correction and migrations are manually applied;
   - repository clean-replay history therefore no longer exactly represents the deployed migration sequence.

2. **RCA-002 — HIGH CONFIRMED — Teacher NORMAL private-event exposure**
   - migration 014 adds private behavior events containing private `choice_id` / response evidence;
   - replacement `s2_get_teacher_state` returns the full runtime event ledger to the Teacher browser;
   - no NORMAL/reveal/audit-private-debug filter is applied;
   - this regresses the previously verified invariant that NORMAL Teacher state must not expose unrevealed private behavior content.

## Findings verified closed

- IDA-001 atomic DiscussionRoom → Game Track progression
- IDA-002 one-open-discussion DB invariant
- IDA-003 formal UI fail-closed
- IDA-004 Library locked-prefix TOCTOU
- IDA-006 durable response-latency evidence
- IDA-007 canonical three-player post-inspection Game-only vote
- IDA-008 server-authoritative SHARE PHOTO permission
- IDA-009 stale DiscussionRoom identity
- IDA-010 dialogue retry idempotency
- IDA-011 Library-attempt retry idempotency

See `CLOSURE_MATRIX.md` for evidence boundaries.

## Recurring-error pattern result

| Pattern | Result | Key result |
|---|---|---|
| A — cross-module handoff | FINDING | IDA-005 generic→canonical lifecycle handoff; IDA-012 action→transition/event causality |
| B — stale/retry/concurrency | PASS for original findings | IDA-009/010/011 protections materially improved; 014a closed CD-discovered reconnect conflict |
| C — UI vs server invariant | FINDING | generic discussion remains possible before canonical initialization and can survive into private ACT1 |
| D — state vs evidence | FINDING | IDA-012 remains open; RCA-002 shows richer evidence introduced a privacy regression |
| E — authority accretion | PASS for executable authority | superseded browser authority paths are revoked; no duplicate active Game Track writer found |
| F — self-confirming tests | FINDING | current suites miss all four present blockers |

## Test-evidence assessment

CD reported:
- Sprint1 40/40 PASS
- Sprint2 23/23 PASS
- Sprint3A 15/15 PASS
- Sprint3B 44/44 PASS
- remediation live 11/11 PASS
- remediation static PASS

These results support broad regression stability, but they do not cover:
- generic discussion opened before canonical initialization;
- Teacher NORMAL access to private runtime-event details;
- causal event ordering/context at transition-triggering actions;
- mutation of an already deployed migration file.

The current FAIL/BLOCKED decision is based on deterministic source/history proof, not absence of CA access to the live backend.

## Required closure properties

CA is intentionally not prescribing implementation mechanics.

Before re-test, the corrected baseline must satisfy these properties:

- no generic DiscussionRoom may remain open/usable when canonical private Sprint3B gameplay becomes active;
- formal event history must preserve correct causal order and source scene/phase/step for the action that triggers a transition;
- repository migration history must obey the immutable-deployed-migration rule and remain forensically reproducible;
- NORMAL Teacher state must not expose unrevealed private behavior content, while authorized AUDIT behavior remains available under canonical rules.

## Next audit

After CD submits a narrow correction baseline for these four blockers, CA should perform another **Level 2 targeted closure re-test**, not a new full independent snapshot audit.

No Sprint3C next-scope risk forecast is issued because the current gate is not PASS/READY.
