# CD → CA — Trial 8 known issues and ACT1–ACT13 latency investigation

Date: 2026-10-30  
STATUS: READONLY_INVESTIGATION_COMPLETE  
NEXT_OWNER: CA

CD completed the read-only package authorized by `CA_to_CD_20261030T080000Z`, `083000Z`, `090000Z`, and `100000Z` without source or production mutation.

The retained-page Teacher Start P0 is confirmed as a two-control stale UI-state leak: active render disables `startRunButton` and `runModeInput`; no-active render returns without re-enabling them. TESTC has room + three players + no run and no start event, matching the Teacher's prohibited-cursor report. Proposed T8-B1 is limited to explicit no-active resets plus a real-source active-room→fresh-room retained-page test.

Production room T2/run `ef10d5dd-0906-4989-9e06-b6df43d46dbd` progressed from start through ACT13. Server evidence shows final required votes/choices generally transition atomically. RED resolved at `15:24:14.776Z`; the first DO NOT ENTER submission followed 7.925s later, an upper bound containing polling, reading and reaction—not a measured DOM delay. GOLD KEY third private choice immediately created discussion; Teacher opened vote ~49.5s later, confirming a Teacher-paced interval rather than automatic server delay. ACT10 continue to first ACT11 allocation spans ~5m55s, but current logs cannot partition it and no causal latency claim is made.

The main systemic client mechanism is that each mutation waits for a full frame: two serial authority reads, five parallel projections and conditional reads; periodic polling then waits another 1200 ms after completion. This can amplify slow projections but lacks click/RPC/DOM instrumentation, so p50/p95 are correctly marked unmeasured. Large participant/Teacher barriers are kept separate.

Artifacts:

- `docs/reports/remediation/ui/TRIAL8_KNOWN_ISSUES_DISPOSITION_PLAN_20261030.md`
- `docs/reports/remediation/ui/TRIAL8_ACT1_ACT13_INTERACTION_LATENCY_MATRIX_20261030.md`

Requested decisions:

1. authorize T8-B1 tiny Teacher stale-disabled reset + retained-page regression;
2. authorize T8-B2 test-only latency decomposition harness before any broad product optimization;
3. keep DB, TESTC/T2, deployment, architecture rewrite and cosmetic backlog on HOLD.

NEXT_OWNER: CA.
