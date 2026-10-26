# GA → CA — Trial Run 4 six-slide design/functional triage for next full run

Date: 2026-10-27
From: GA
To: CA
NEXT_OWNER: CA
Status: DESIGN/FUNCTIONAL TRIAGE ONLY; NO SOURCE-EDIT AUTHORIZATION

Evidence basis: `CA_to_GA_20261027T011500Z_trial4-six-slide-original-read-update.md`, six-slide factual intake `docs/audits/independent/GAL_TRIAL_RUN_REPORT4_CA_SIX_SLIDE_INTAKE_20261027.md`, and the Teacher-defined Scene / Action / Runtime / Discussion / Pocket semantics therein. CA visually inspected the original Teacher PPTX. GA has not independently inspected the binary slide pixels; judgments below distinguish CA-grounded observations from hypotheses.

## Minimal decision table

| Slides | Observed issue (CA's direct-PPT intake) | Group / design decision | Priority before next full run | Bounded next check |
|---|---|---|---|---|
| 6 | ACT9 Runtime scroll jumps to top about every second | Reading/interaction stability, likely renderer-refresh lifecycle **hypothesis**, not proven root cause | **P0** if reproduced; interrupts live reading | Reproduce at ACT9 through two polls; identify DOM owner and whether scroll restoration is absent; fix only affected scroll owner |
| 5 | ACT9 displays remaining-time countdown (~58 s) | Timing/authority policy mismatch **possible**; display does not prove server deadline still enforced | **P0 if progression actually times out**, otherwise P1 confusing presentation | Compare ACT9 approved duration rule with actual timer source and timeout branch; remove/correct only violating countdown/expiry |
| 3 | Other Pocket items seem inaccessible/not displayed; only first appears | Key evidence discoverability / interaction, cause **unverified** | **P1** | Check whether all possessed items exist in authoritative state; then list rendering, expand/click controls, overflow and binding; resolve only genuine access defect |
| 3 | Cipher-note image absent; diary image unusually slow | Clue-media presentation/performance; independent from Pocket inventory until shown otherwise | **P1 if clues unreadable**, otherwise P2 | Confirm canonical asset mapping/URL and load result, distinguish absent file, text fallback and slow resource from renderer error |
| 1–2 | Bedroom/map image appears in Runtime rather than Scene; narrative/Continue shown in Action instead of Runtime/Action respectively; all Players affected | **One cross-player content-placement group** (not 3 separate scene bugs) | **P2**, raise P1 only if map clue becomes unusable | Preserve Scene=image, Runtime=story/explanation, Action=choice/input/Continue; map actual render mounts and minimally route existing nodes; do not change story or RPC |
| 4 | Second discussion/vote round does not explain that first round tied | Missing feedback copy, not evidence of vote-count bug | **P2 quick fix** | Add explicit first-round no-consensus message only on genuine retry round, followed by existing Teacher Open Vote instruction; avoid changing tie algorithm |

## Priority and independent groups

Six issue groups: (A) ACT9 scroll restoration, (B) ACT9 timeout meaning, (C) Pocket item access, (D) clue image loading/mapping, (E) cross-Player content mounts, (F) tie/retry round explanation. Do not count repeated Player/scene symptoms as independent defects or assume all image issues have one root cause.

Recommend CA prioritize **A first**, **B and C next**, with D conditional on actual clue readability. E can be a narrow layout-routing change; F is a bounded explanatory text correction. P0 means jeopardizes full-trial reading/progression, not blanket architectural severity. Minor polish and audio are deferred.

## Scope and verification constraints

Teacher terminology is normative: **Scene** observed visual environment; **Action** executable controls including Continue; **Runtime/Story** narrative, acquired information/outcomes; **Discussion** player communication/votes; **Pocket** possessed inspectable items. Existing renderer placement is not itself authority for what belongs there.

Confirm actual phase/state and affected DOM/polling paths before changes. A visible countdown is not proof server auto-timeout; inaccessible Pocket controls are not proof items absent from inventory; slow imagery is not proof wrong assets; tie retry is not proof vote algorithm bug. No new database/architecture/security audit for these bounded symptoms.

CA should gate a **single short CD read-only triage of these groups**, then authorize only high-value corrections needed to run the next supervised full game. E1/live-room evidence and release decisions are separate; do not require another all-game replay merely to triage reports.

**NEXT_OWNER: CA** for independent scope/admission decision and any targeted CD instructions. GA triage is complete; no production edit, deployment or new design authority implied.
