# 071 controlled acceptance — AUDIT ACT7 fixture coverage correction

Timestamp: 2026-10-18T05:30:00Z  
Authority: CA-237  
Disposition: `SOURCE_COVERAGE_CORRECTED / LOCAL_CHECKS_PASS / PRODUCTION_NOT_RUN`

## Exact modified files

1. `tests/act7-071-controlled-acceptance.js`
2. `tests/act7-v4-normal-timeout-static-check.js`
3. `tests/act7-v4-normal-timeout-browser.mjs`

No production database, ACL, Pages, runtime source, UI source, migration, synthetic run or canonical specification was changed.

## AUDIT correction

`runAuditControl()` now:

- reuses the current Sprint5 AUDIT `vote()` helper for the two ACT6 rounds after the already-correct three-Player entry barrier;
- verifies ACT6 fallback completion and advances to ACT7 round 1;
- asserts ACT7 canonical stored timing is exactly 15-second discussion / 60-second vote;
- invokes the existing `s5_audit_expire_discussion` helper and verifies ACT7 enters `voting` with an approximately 60-second deadline;
- waits 61 seconds and refreshes Teacher state, verifying the existing AUDIT policy enters `waiting_for_missing_player`;
- invokes existing Teacher Add Time and verifies `{applicable:true}`, restored `voting`, and a new future deadline.

The NORMAL path, identity checks, authorization environment gate and two retained synthetic runs are unchanged.

## Direct test assertions

The static checker now requires source tokens for ACT6-to-ACT7 progression, 15/60 timing, deliberate discussion expiry, 61-second vote expiry, waiting state and Add Time reopening.

The existing browser mock previously waited for transient UI success text that normal polling can immediately overwrite; it timed out twice without any runtime/UI source change. The mock now waits for the intercepted Open Vote/Add Time RPC payloads and retains all payload assertions. This is a test-only determinism correction and does not weaken identity or mode verification.

## Local evidence

- `node --check tests/act7-071-controlled-acceptance.js` — PASS.
- `node --check tests/act7-v4-normal-timeout-browser.mjs` — PASS.
- `node tests/act7-v4-normal-timeout-static-check.js` — PASS.
- bundled Playwright + local loopback `tests/act7-v4-normal-timeout-browser.mjs` — PASS.
- Controlled acceptance executable — NOT RUN by authorization.

## Remaining NOT VERIFIED

- Actual PostgreSQL/production ACT7 AUDIT and NORMAL behavior remains NOT VERIFIED.
- The future authorized run still needs protected SQL evidence for exact current-round vote-row counts, event counts, stale/invalid nonmutation and one-resolution-effect invariants.
- No new synthetic session, cleanup, 071 replay, Pages switch, ACL change or CRLF rewrite occurred.
