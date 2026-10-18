# 071 controlled acceptance fixture — source-only correction evidence

Timestamp: 2026-10-18T04:25:00Z  
Authority: CA-236  
Disposition: `SOURCE_FIXTURE_READY_FOR_CA_REVIEW / PRODUCTION_NOT_RUN`

## Exact modified implementation files

1. `tests/act7-071-controlled-acceptance.js` — new future-gated controlled acceptance executable.
2. `tests/act7-v4-normal-timeout-static-check.js` — directly necessary source assertions for the corrected fixture.

No database migration, runtime source, UI, Pages source, ACL, canonical specification or production row changed.

## Corrected fixture contract

The acceptance executable now:

- starts from the existing Sprint5 fixture's intentional ACT6 prepared state;
- asserts no canonical discussion before entry;
- calls `s9_observe_act5_handoff` then `s9_enter_act6` for Players 1, 2 and 3 using each current run identity;
- asserts 0-entry prepared state and no discussion after entrant 1 or 2;
- asserts entrant 3 creates ACT6 round 1;
- replays the third entry and asserts the canonical discussion identity/deadline are unchanged, proving no second creation/timer restart;
- verifies the Player projection retains exact ACT6 phase and discussion identity;
- retains identity-bound Teacher Open Vote, ACT7 round-2 two-vote state, 61-second wait, third genuine vote, stale payload rejection, NORMAL Add Time nonmutation, invalid-token rejection and ACT8 timing checks;
- retains a separate AUDIT timing/timeout/Add Time control;
- refuses execution unless a future gate explicitly sets `ACT7_071_PRODUCTION_AUTHORIZED=YES`.

The shared `tests/sprint5-live-e2e.js` fixture was deliberately not changed because current Package A tests use its prepared state to verify the barrier itself.

## Verification

- `node --check tests/act7-071-controlled-acceptance.js` — PASS.
- `node tests/act7-v4-normal-timeout-static-check.js` — PASS.
- `node tests/act7-v4-normal-timeout-browser.mjs` using bundled Playwright and local loopback — PASS.
- No live acceptance script or Supabase mutation was run.

## Residual assumptions / NOT VERIFIED

- The future production runner must use a separately authorized maintenance gate and the explicit environment flag.
- The 61-second scenario necessarily takes real elapsed time and remains NOT RUN.
- SQL row counts and event-count invariants in `071_CONTROLLED_ACCEPTANCE_PLAN.md` still require authorized read-only SQL evidence around the future run; the browser RPC script validates identities and projections but cannot independently count protected tables.
- 071 production behavior remains NOT VERIFIED. This source correction is not a release result.
- The two retained synthetic ACTIVE runs remain untouched.
