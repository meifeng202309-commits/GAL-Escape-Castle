# Trial 8 known-issues disposition and minimum repair plan

Date: 2026-10-30  
Authority: `CA_to_CD_20261030T080000Z`, `083000Z`, `090000Z`, and `100000Z` CA letters  
Mode: read-only investigation; no source or production mutation

## Priority disposition

| Priority | Issue | Evidence / current disposition | Minimum proposed change | Verification | Decision |
|---|---|---|---|---|---|
| P0 | Retained Teacher page leaves Start Formal Run disabled after active room → fresh no-run room | Confirmed source defect. `renderDiscussionState` sets `runModeInput.disabled=true` and `startRunButton.disabled=true` for an active run; its `!state.active` branch returns without resetting either. Teacher confirmed the exact retained-page sequence; refresh restores controls. TESTC has room + 3 players + no run and no failed start RPC, consistent with a disabled button. | In the `!state.active` branch set both controls to enabled before returning. No RPC/DB change. | Permanent real-source Teacher browser: render active room, create/load fresh no-run room on same page, assert both controls enabled and one click dispatches `s9_start_formal_game`; retain active-run disabled assertion. | **Authorize first.** Tiny, high-impact, one source file plus one test. |
| P0/P1 | Interaction feedback often seconds or worse | T2 proves eventual server transitions but does not contain browser request-start/finish or DOM-visible timestamps. Player mutations await a full multi-projection refresh; periodic refresh waits 1200 ms *after* each frame completes. This structurally adds full projection latency and prevents a fixed 1200 ms visibility bound. | First add bounded test instrumentation and latency-injected regressions. Then consider immediate minimal authoritative projection/optimistic acknowledgement only per confirmed slow path; do not globally weaken frame invariants. | Measure click→RPC start→RPC finish→authoritative event→projection finish→frame commit→DOM visible for each interaction family. | **Investigate/test authorization next; no broad optimization yet.** |
| P1 | Repeated Runtime/stale opening information | Trial7 stale pre-run title was fixed and released (`9bf557d`); T2 progressed through ACT13. Remaining “repeated Runtime” is not tied to a precise T2 event/node. | Add phase-identity assertions to latency harness; fix only a reproduced stale identity. | Same node/identity across same phase, replacement on authoritative phase change. | Monitor; no speculative source change. |
| P1 | Mixed/misplaced Scene/Action content | Trial45 persistent-region and public integrated gates passed after release; T2 reports eventual actions but not a fresh geometry failure. | Preserve existing keyed mounts; add interaction-matrix owner assertions. | Scene/Runtime/Action/Pocket selectors per phase at two viewports. | Regression coverage, no new product diff now. |
| P1 | Watch reverse/star and Pocket access | Public ACT3/Pocket regression passed all later media and Trial45 prior evidence confirmed Linda watch/key/order access. T2 contains repeated `photo_shared` calls but no access failure detail. | Add exactly-once share feedback and retained item selection only if T2-specific reproduction exists. | Every owned item selectable; front/back where allowed; no duplicate share on one click. | Monitor; duplicate share burst is a separate medium-risk lead. |
| P2 | Trial45 prototype-only Teacher comparison | Known harness packaging boundary: public prototype document absent; actual public Teacher Open Vote passed. | Point comparison at an explicit fixture or classify NOT_RUN before dereference. | No null dereference; real Teacher runtime remains independently tested. | Test-harness cleanup, not release blocker. |
| P2 | Visual/layout/cosmetic backlog | Teacher shell/layout and minor copy/spacing remain broader than current blockers. | Defer costly cosmetic work until functional P0 and measured latency causes close. | Visual review after functional batches. | Explicitly deferred. |

## Requested small-batch order

1. **T8-B1 — Teacher stale disabled reset:** `src/teacher/teacher-console.js` plus one retained-page regression. No database or Player changes.
2. **T8-B2 — latency observation harness:** test-only browser timing hooks/fixtures for all interaction families; no production telemetry or real-room mutation.
3. **T8-B3 — confirmed latency fixes only:** separate narrowly reviewed diffs for paths whose decomposition proves client-controlled delay. Candidate mechanisms are full-frame post-mutation refresh fanout and completion-relative 1200 ms polling; neither should be changed globally without B2 evidence.

No migration074+, schema, Storage, TESTC/T2 mutation, deployment, architecture rewrite, mass asset work or security redesign is proposed.
