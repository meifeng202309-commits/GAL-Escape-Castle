# GAL Escape Castle — Trial Run 4 + Trial Run 5 Integrated Debug Plan V2.0
Date: 2026-10-28
Authority: Teacher Trial Run 4 & Trial Run 5 observed evidence; GA-134 approved Player region positions.
Status: EXECUTION PLAN — no human rerun until every listed mandatory item passes automated/independent verification.

## Objective and scope
Restore consistent Gitte/Anna/Linda Player layouts, correct Scene/Runtime/Action/Pocket content ownership, full image and Pocket access, properly updated Teacher Console, consistent bilingual 11pt formatting, and stable ACT9/retry/map/note behavior. Prior CD source/SQL/deployment PASS does not close observed runtime bugs. Keep one issue matrix and one closure report. No incidental architecture overhauls, micro-audit loops or new unnecessary security hardening.

## Trial Run 4 reconciliation
- R4-01 Scene main visual misplaced vs prototype: OPEN, persists in Gitte R5-04.
- R4-02 Gitte Research Map must display map in Scene: VERIFY with real browser.
- R4-03 explanatory words in Runtime and Doorgaan in Action, all roles: OPEN, R5-05.
- R4-04 note image must appear: VERIFY.
- R4-05 Anna diary image unreasonably slow: OPEN/VERIFY; R5-03 reports missing images.
- R4-06 Linda Pocket only watch: CLOSED by Teacher R5 observation that Linda Pocket images load; preserve regression.
- R4-07 only first Pocket item accessible: OPEN in Gitte, test all three roles.
- R4-08 tied first vote must display '第一轮投票没有形成共识，请再进行讨论，然后做第二轮投票' before the vote-opening guidance: VERIFY correct bilingual key/trigger.
- R4-09 ACT9 timed in NORMAL: VERIFY independently against deployed 073 (no auto expiry NORMAL; AUDIT retains 180/60).
- R4-10 ACT9 Runtime scroll auto jumps to top after about 1s: VERIFY under real polling/refresh, repair if reproduced.

## Trial Run 5 observed
- R5-01 Gitte watch appears before starting game: OPEN; correct visibility by authoritative role/phase/item state.
- R5-02 ALL Players text layout differs: OPEN; one Chinese line, one Dutch line, blank line between bilingual blocks, 11pt consistent; computed layout.
- R5-03 Anna and Linda missing appropriate Scene images: OPEN.
- R5-04 Gitte main visual remains in Runtime: OPEN.
- R5-05 Gitte Action mislocated: OPEN.
- R5-06 Gitte region placements mixed: OPEN.
- R5-07 Gitte Pocket only first media item: OPEN.
- R5-08 Linda region positions and Pocket images correct: KEEP regression baseline.
- R5-09 Teacher Console still old layout, Teacher supplementary observation: OPEN; recover latest approved Teacher specification from canon/approvals rather than invent layout.

## Approved Player ownership
Scene: upper left, main visual/map/current key visuals.
Runtime: under Scene at left, narrative, explanations and next-step guidance.
Action: upper right, real buttons, choices, vote, submit, continue.
Pocket: approved right-hand region, all authorized item/media views.
Teacher Console: separate authoritative approved specification must be recovered and pinned before implementation.

## Unified mandatory phases with measurable gates
**P0 production baseline:** record live Pages branch/SHA/public script hashes and browser viewports; three roles and Teacher screenshots / actual DOM+CSS computed boxes / image network status, role and exact game phase; distinguish source branch from deployed bytes. Open one R4/R5 issue-trace matrix with role, phase, actual/expected, test ID and evidence. No production mutation.

**P1 holistic causal investigation:** trace effective HTML, CSS grid, JS render pipelines and role-specific/phase-specific branches, duplicate region mounts, render-after-move overwrites and reflows. Compare Linda PASS to Gitte/Anna failures at matched phase; do not infer role bug from differing phases. Resolve Teacher current approved UI specification and deployed source; inspect state→asset key→registry→URL→load→visible DOM/geometry for every critical asset. Produce one root-cause map and cohesive design.

**P2 Player structural+ownership implementation:** one shared 4-region layout and deterministic content routing in all three roles across affected acts; Scene main images/map, Runtime only narrative, Action buttons. Fix Gitte pre-start watch authority/visibility. Preserve Linda successful behavior.

**P3 all visual/Pocket implementation:** fix missing Anna/Linda images, Gitte map/note/scene switch, Anna diary slow load (capture network/decode/render timings), Pocket enumeration/access/front-back after first item for all roles; asset checks include visible natural dimensions, not HTTP200 alone.

**P4 Teacher and bilingual UI:** map approved Teacher console region/control/state design to deployed HTML/CSS/JS; eliminate old layout while retaining controls. Apply Chinese/Dutch line separation, blank lines, 11pt with CSS computed evidence across all Players and relevant dynamic text.

**P5 ACT/gameplay legacy closure:** NORMAL ACT9 initial/retry discussion/voting Teacher-controlled with no 180/60 hard cutoff; AUDIT time rules retained. Correct tied-round instructional notice before Teacher vote-opening message. Verify and fix only if reproduced the ~1s ACT9 Runtime scroll-to-top; map/note/diary interaction in actual phases.

**P6 real-browser automated regression:** browser-based coverage with independent Gitte/Anna/Linda/Teacher fixtures including pre-game, ACT1 items, map/note/diary, ACT9 discussion/tie/retry, Pocket multi-items/front-back, live poll/reconnect, both target viewports. Assert computed DOM positions and real visible image naturalWidth/Height, multiaction events, CSS computed 11pt and bilingual break structure. Include screenshots and differential role checks. Server ACT9 authority/timing tests remain. Do not claim visual PASS from static string assertions.

**P7 single holistic closure:** matrix contains explicit PASS per R4/R5 item (including 'verify' cases with reproduced positive browser evidence) and no deferred/open items. CA independently reviews source, browser evidence and release readiness only as directly relevant to the matrix; no new diffuse audit scope. If any failure, return to its repair phase. Only after 100% test gates and independent closure may CA request Teacher human play.

## Ownership, sequencing and prohibitions
CD owns P0→P6 investigation, cohesive implementation and tests, plus final evidence package. GA only decides genuine outstanding canonical Teacher Console or textual specification ambiguity; do not reflexively redesign. CA owns P7 independent holistic acceptance and checkpoints. Teacher re-tests only after all listed gates close, except explicit new authority decisions required by governance. All production code/database/assets/deployment changes remain subject to existing separate approval gates. Do not silently deploy, do not mark deployed code as visual acceptance, and do not reopen unrelated audits.

## Closeout checklist
- [ ] R4-01/R5-04 Scene placement
- [ ] R4-02 research-map Scene switch
- [ ] R4-03/R5-05 Runtime prose vs Action buttons
- [ ] R4-04 note image
- [ ] R4-05/R5-03 Anna/Linda scene and diary images/load performance
- [x] R4-06 Linda Pocket watch-only observation superseded by R5 positive; regression still required
- [ ] R4-07/R5-07 all Pocket items
- [ ] R4-08 tie instruction bilingual
- [ ] R4-09 ACT9 NORMAL/AUDIT timing
- [ ] R4-10 ACT9 scroll stability
- [ ] R5-01 Gitte premature watch
- [ ] R5-02 bilingual style across all roles
- [ ] R5-06 all three layouts
- [ ] R5-08 Linda positive behavior retained
- [ ] R5-09 Teacher approved layout
- [ ] P6 all real-browser regressions
- [ ] P7 single independent closure report

Source files: Teacher-provided `GAL trial run report 4(2).pptx` and `trial run report 5.pptx`; this plan is the execution-port of `GAL_Escape_Castle_Trial_Run_5_Integrated_Debug_Plan_v2.md`.
