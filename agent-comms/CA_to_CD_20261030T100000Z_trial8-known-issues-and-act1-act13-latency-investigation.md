# CA → CD — Human Trial T2 passed, fix outstanding blockers then ACT1–ACT13 latency audit
Date: 2026-10-30
STATUS: ACTION_REQUIRED
NEXT_OWNER: CD

## New Teacher evidence and priority
Teacher reports: refreshing retained Teacher Console restored Start Formal Run and the new human test progressed successfully. Prior TESTC disabled Start button reproduces stale `startRunButton.disabled` across old active room -> new room on the same Teacher page. Make its permanent tiny UI-state reset the FIRST fix, with retained-page transition test. Do not misclassify this as an RPC failure.

In T2 screenshots: Gitte chooses RED DOOR; after vote, next DO NOT ENTER action took many seconds to appear, subsequent voting normal. Linda declines the GOLD KEY; after the choice, STATION A/B/C actions took >60 seconds to appear. Other reported interaction/Send delays are seconds or worse. Both screenshots demonstrate eventual progression, not a specific server failure. Test outcome: game progressed, but responsiveness unacceptable.

Teacher's ordering:
A. Resolve previously discovered but unresolved issues first, prioritizing actual blocking/reproducible issues. Use existing Trial6/Trial7 report list as backlog: old-room -> new-room Start disabled (P0); repeated Runtime / stale opening info; mixed/misplaced Scene/Action content; watch reverse/star and asset/Pocket access; other reported visual/layout issues. Classify by practical user impact and cost. Avoid costly minor cosmetic work if it delays functional repair; document explicit deferrals. No architecture rewrite, security overengineering, or mass asset rework.
B. Thoroughly investigate *every player/Teacher interaction point* in ACT1 through ACT13 for systematic slow response mechanisms, and repair confirmed high-impact causes after CA authorization.

## Required latency investigation method
First build a complete ACT1–ACT13 interaction inventory grounded in code and game specs, including: actor, ACT/stage, button/message/vote/input, triggering client handler, RPC(s), write/transition owner, subsequent reads/polling dependencies, expected visible response, and any timers/gates. Mark every step with observed T2 evidence, instrumented result, or untested (never claim universal PASS from partial mocks).

Collect read-only server/client evidence where available from real T2 (identify T2 room vs person session, timestamps, vote-to-next-choice intervals) and relevant Supabase events. Decompose duration: click -> request start -> RPC finish -> server authoritative transition/event -> player projection fetch -> confirmed frame commit -> DOM visible. Probe sequential RPC fanout, overlapping polling coalescing/queued refresh, constant 1200ms poll delay, stale response discarding, last-confirmed-frame invariants, IME deferral, JS rendering, image loads, timers/deadlines and Teacher-paced gates. Evaluate whether the 60s wait is expected timed behavior, missing event, a retry, or actual bug. No fabricated timing values.

Use reproducible low-cost tests with latency injection and, where safe, isolated DB-backed synthetic integration to distinguish UI-only mock PASS from actual game advancement. Capture per-interaction p50/p95 and worst cases only if measured. Preserve valid timer semantics, role privacy, request identities and existing regressions.

Deliver two artifacts: (1) short known-issues disposition/repair plan with impact×effort priorities and minimal fix diffs/tests; (2) exhaustive ACT1–ACT13 interaction matrix and latency root-cause report with a ranked small-batch fix proposal. Complete easy authorized local fix of stale disabled Start only after CA authorizes source modification. Work read-only initially and return diagnosis quickly; no deployment, live room mutations, broad rewrite, DB changes, or further release without approval.

No need to request Teacher to play another full game solely to obtain diagnostics until code/log investigation is exhausted. Teacher wishes to finish game testing, not perpetuate endless audit. Ownership CD for investigation, CA receives findings.
