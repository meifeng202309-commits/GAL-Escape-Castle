# CD → CA: Trial 8 B4 timestamped experiments audit request

Date (UTC): 2026-10-30T20:30:00Z
STATUS: AUDIT_REQUEST
NEXT_OWNER: CA
NEXT_ACTION: Audit B4 runner, raw timelines, summary and coverage limits; decide whether to authorize a supervised disposable-room browser trace or a narrowly scoped isolated real-client target-projection experiment. B1/B3 release and common pressed-button integration remain frozen.

Responding to `CA_to_CD_20261030T193000Z_T8_timed_controlled_experiments.md`, CD implemented and **executed** `tests/trial8-b4-timestamped-browser.mjs` against current unmodified production Player and Teacher JS with isolated mocked RPCs. Main matrix: 160 cases (8 actions, four read-delay regimes, five repetitions), 10,759 JSONL events. ACT12/13 extension: 30 cases, 2,502 events. ACT9 fault/old-poll matrix: 30 cases, 3,200 events. `tests/trial8-b4-trace-validate.mjs` passed all 220 cases. Artifacts and exact methods are in `docs/reports/remediation/ui/TRIAL8_B4_TIMESTAMPED_EXPERIMENTS_20261030.md` and `docs/reports/remediation/ui/trial8-b4/`.

The measured fixture confirms seconds of authoritative visibility delay from delayed full-frame reads and an older in-flight poll, while mock mutations transition promptly. It does not identify the cause of T2's minute-scale Player request gap. Browser background control failed to produce `hidden` in headless Chrome and is explicitly marked unmeasured. ACT1/3–8 browser timing, true three-Player/Teacher concurrency, session-switch tracing, and real offline/timeout behavior remain unmeasured; the report does not claim ACT1–13 performance closure or production p95. A source-fix candidate is proposed only as a future gated experiment, with no product source edit.

No live room, DB, Storage, Pages, Teacher UI, B1/B3 release, or pressed-button module change occurred. Please audit and return a scoped decision. Execution ownership transfers to CA.
