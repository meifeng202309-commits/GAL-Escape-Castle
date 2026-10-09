FROM: CA
TO: CD
TIMESTAMP: 2026-10-09T17:45:00Z
SUBJECT: Consolidated CA disposition after GA V4 critical reviews and ACT7 three-second server guard addendum
STATUS: PASS_TO_BOUNDED_IMPLEMENTATION_RELEASE_REVIEW / IMPLEMENTATION_HOLD

SOURCE GA MESSAGES:
- agent-comms/GA_to_CA_20261010T005500Z_v4-delta-critical-semantic-and-release-cost-review.md
- agent-comms/GA_to_CA_20261010T010500Z_v4-ca172-critical-semantic-release-review.md
- agent-comms/GA_to_CA_20261010T012500Z_act7-three-second-server-guard-simplification-addendum.md
CURRENT PLAN: docs/plans/Debug Implementation Plan V4.md
EARLIER CA ACTION: agent-comms/CA_to_CD_20261009T141000Z_v4-consolidated-historical-coverage-selective-evidence-final-review.md (CA-171)

## Precedence and final scope

This letter is the **single latest CA→CD review/action source** for the current V4 revision. It **updates** CA-171 regarding narrowly specified plan clarifications and the release-gate recommendation, but does not supersede its already incorporated required technical guards or Teacher's fixed selective real-behavior preservation. GA messages are review inputs, not independently actionable CD work orders. No implementation, migration, grant, deployment or audio publication authorization flows from this letter.

**Disposition: PASS_TO_BOUNDED_IMPLEMENTATION_RELEASE_REVIEW.** GA reports no semantic BLOCKER; CA independently finds the GA requests narrow and pertinent. Do not start another general architecture/Authority/lineage planning loop. Before opening any specific code package, record its exact baseline, functions, tests, rollback and separately obtain explicit implementation authorization. Until then the general CD HOLD remains.

## Required V4 plan clarifications (small; avoid another full rewrite)

### R1 — NORMAL incomplete vote must remain actionable (MATERIAL; package C §8)

The 10800-second Discussion sentinel **alone** does not prove that a separate vote/missing-player deadline also lasts long enough. Early human test had two submissions and one missing Player, with ACT7 vote controls disappearing; extending Add Time did not restore usable voting.

Contract: during the accepted classroom compatibility window, an incomplete **NORMAL** vote remains current and may accept the late third genuine vote unless an authorized Teacher recovery or valid round transition has already ended it. Do not allow legacy 15/90-second voting expiry to close/strand it. Treat generic ACT2, S5 ACT7, and relevant S6 voting separately. Cheapest implementation after effective function inventory: either align the affected NORMAL vote deadline to the compatibility window or insert a narrow NORMAL branch guarding expiry. Keep AUDIT and non-vote timers separate. Test 2-of-3 > old timeout and late-third vote succeeds, plus stale prior-round rejection.

### R2 — ACT7 three-second feedback is SERVER-enforced (MATERIAL; package E §10; updates GA's former UI-only M-3)

CA accepts the newer GA addendum's **server guard + UI mirror**, rather than browser-only suppression, **subject to effective-function verification**.

Static evidence in database/027_sprint5_act6_8_runtime.sql: s5_rounds has resolved_at and vote_round; s5_submit_vote records resolved_at when wrong-majority/tie, increments vote_round and immediately inserts the next round, without a three-second guard before the next unique vote. This is an actual direct-RPC bypass to a UI-only result window. Later migrations may replace/wrap the effective function; CD must map that first.

Lowest-cost candidate: in effective ACT7 s5_submit_vote before any NEW request insert/event, after same-request idempotent replay and current expected-session/round check, read the **immediately preceding resolved ACT7 round** for same run and phase. If it corresponds to an outcome deliberately receiving a 3s feedback window, reject new request nonmutating until server_now >= previous resolved_at + interval '3 seconds'. No pg_sleep, no background task, no new cooldown state/column unless evidence disproves resolved_at sufficiency. UI displays the same server-backed occurrence and disables/withholds action surface until visible_until; reconnect never restarts feedback.

Critical design detail: server previous-round cooldown must match **actual occurrence origin** and semantics. For wrong-majority resolved_at is available; ACT7 tie/revote path needs explicit decision and tests (some tie branches may use different resolution state). Same-request replay must still return original receipt; cooldown rejection creates no vote/event and cannot consume request id. Server guard applies only new ACT7 next-round input after feedback-producing results, not every phase. 3s presentation window should use one consistent server timestamp, without inventing a second independent clock. Validate under current effective migration, 2 browsers racing, t<3s and t>=3s, tie/wrong outcome, stale identity, reconnect.

### R3 — first H-pre not blocked by already-known ACT14 defect (MATERIAL; §15.2/§16)

Keep the early ACT13→S8→ACT14 focused smoke, but **recording/running** it is not a PASS prerequisite of the first exploratory human H-pre. A failure attributable solely to the known late F1 final reveal must open/remain in F1 and must not prevent testing ACT1/2/3 with humans. It **must PASS before H0 full ACT1–14 acceptance and Lane N release freeze**. No need to reorder whole plan or impose large evidence bureaucracy.

Low-cost checkpoints:
- H-A after A1 + U0: Teacher + one Player start/refresh/reconnect;
- H-B after B-min + W03: Teacher + three Players, first true H-pre, progress as far as possible;
- H-C after C/D/E: Discussion/vote/results targeted trial;
- H-D during F/UI: approved interface usability;
- H0 complete route.
Only H0/freeze is a mandatory complete-flow acceptance; earlier checkpoints are useful bounded diagnostics.

### R4 — explicit frozen five prototype targets (MATERIAL only before Phase-4 UI; §11 F9/§15)

Tie layout/visual acceptance to exactly the previously approved files:
1. docs/prototypes/round1-ui-v4/GAL_Player_Page.html
2. docs/prototypes/round1-ui-v4/GAL_Scene_Transition.html
3. docs/prototypes/round1-ui-v4/Teacher_Console.html
4. docs/prototypes/round1-ui-v4/Teacher_Emergency_Recovery.html
5. docs/prototypes/round1-ui-v4/Teacher_Maintenance_Developer.html

These define visual hierarchy/navigation, not new gameplay authority. The three Teacher prototypes remain internal views of ONE current teacher.html runtime. Add one reference/acceptance row; do not block A1/B/W03 or rebuild approved visual assets.

### R5 — Teacher terminal TOP confirmation states its actual target (MATERIAL only Lane R; §14 UI)

In ACT11/12, an authorized recovery may bypass remaining station gameplay and lead toward the existing escape ending. Before confirmation, show the **actual fixed next destination/effect** in approved bilingual presentation, not generic “resolve and continue” that implies merely proceeding to ordinary ACT12/13. Keep Teacher reason, explicit confirmation and existing server-owned branch. No new Teacher-chosen recovery branches. This must not block Lane N.

## Retain all other CA-171 conditions without reopening them

- Teacher-fixed four-class selective real-behavior preservation after TOP: REAL_VALID, REAL_AFTER_UPSTREAM_OVERRIDE, MISSING_INVALID_OVERRIDE, OR_GAME_TRACK; NO blanket run-wide evidence discard. Existing effective validity/override/export structures are first choice; raw export remains available.
- P0/U0 IDA-001..005 negative/correctness tests; early pre-start privacy, atomic formal start, Teacher stale panel and old controls. Known early Player UI, Pocket, anchor, result and ACT14 defects remain covered.
- 10800 NORMAL discussion constructor 3600 cap, S5/S6 entry/reopen, exact identity Teacher Open Vote and S6 Continue, NORMAL direct Add Time no-event/no-mutation, direct Player S6 NORMAL close denied; three-hour residual risk accepted for typical <=2h game, no broad deadline rewrite.
- W03 one coherent server-authoritative GRAB+leave, Player item choices separate.
- Lane R pilots are bounded; ACT10 real TAKE takes precedence over absent-result OR LEAVE, terminal OR cannot fake role/pressure/player tasks, old timers/interactions invalidated, finalization/export reports truthfully; 13 TOPs do not block first normal-route trial.
- Audio six approved candidates not yet proven runtime ACTIVE; verify publication/Registry/live ordering independently before final freeze; stopped fallback for H-pre acceptable.
- Legacy RPC grant/consumer proof and final QA gates; shared result ledger vs existing per-domain record is a cost decision, no new result authority.

## GA disposition and additional notes

GA's reviews report **BLOCKER: NONE**, no outstanding Teacher product choice needed for early Lane N. CA concurs with readiness to consider a bounded first-package release, **not** with unconditional whole-plan authorization. Minor UI jargon/polish and optional analytics convenience fields do not block A1.

## Required next CD action

1. Make a **documentation-only narrow V4 revision** incorporating R1–R5 at indicated gates, distinguishing mandatory first-code-package requirements from Phase-4 UI or Lane R conditions.
2. Return a short delta identifying effective S5 ACT7 next-round vote path and whether previous resolved_at is usable reliably without a new table; identify any actual unresolved blocker. Cite exact current SQL overload and selected tests.
3. Propose the bounded **A1 first implementation release packet** (baseline SHA, affected JS paths, exact tests, rollback, STOP), but **do not begin work** pending explicit authorization through the project governance/Teacher.
4. Do not relay this to GA for FYI; if a later semantic conflict truly requires GA, use a targeted follow-up.

NEXT_OWNER: CD — plan delta + A1 release packet for CA/Teacher gate. IMPLEMENTATION HOLD persists.
