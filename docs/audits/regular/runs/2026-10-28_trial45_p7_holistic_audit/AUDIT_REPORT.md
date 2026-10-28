# CA — Trial Run 4+5 integrated P7 audit
Date: 2026-10-28
Disposition: **FOCUSED EVIDENCE GAP — NOT YET CLOSED** (one consolidated correction to CD).

## Sources and scope
- Integrated plan: `docs/plans/TRIAL_RUN_4_5_INTEGRATED_DEBUG_PLAN_V2_20261028.md`.
- CD formal handoff: `agent-comms/CD_to_CA_20261028T060000Z_trial45-p2p6-complete-p7-audit-request.md`.
- CD source evidence: `docs/reports/remediation/ui/TRIAL45_P2_P6_SOURCE_EVIDENCE_20261028.md`.
- Captured browser evidence: `docs/reports/remediation/ui/trial45-p2p6/P2P6_BROWSER_EVIDENCE.json`, test: `tests/trial45-p2p6-browser.mjs`.
- GA-136 protected localization authorization: `agent-comms/GA_to_CD_20261028T053000Z_r4-08-tie-bilingual-catalog-decision.md`.

## Integrated findings
1. **PASS — demonstrated browser behavior:** three Player role cases at 1366x768 and 1280x720 have decoded positive-dimension Scene visuals for `study_map`, `read_diary`, `try_star_key`; Gitte two, Anna one, Linda three Pocket media each load after delayed resolver and refresh; NL/ZH computed 11pt; tie copy exactly GA-136 and stable through reload; Gitte pregame watch not reproduced under fresh fixture; ACT9 checks reported passing. Historical Linda positive protected.
2. **OPEN R4-04:** The submitted browser test drives Gitte only with `choice:"study_map"`; `study_number_note` is asserted in mappings but has NO recorded real browser Scene-switch/decoded image check. This was explicit P6 acceptance criterion. A mapped asset or successfully loaded Pocket note is not proof that the note appears in Scene after the action.
3. **OPEN R4-05 performance acceptance:** Anna diary displays decoded dimensions but the evidence does not quantify the historically reported unreasonably slow time-to-visible under realistic delayed resolution. One bounded measured browser test should record and assess observed time-to-visible under poll/reconnect against a stated reasonable test threshold; do not invent SLA as canonical.
4. **OPEN R5-09 visual acceptance evidence:** Teacher test checks `.top`, `.main`, three collapsed groups and control IDs but does not compare approved V4 prototype's visible region order/position, collapsed-by-default behavior, and representative control placement at viewport. A browser screenshot exists, but no recorded computed visual geometry/prototype comparison. This is a direct Teacher's reported failure and must close with objective layout geometry + one screenshot evidence reference; no arbitrary pixel-perfect redesign.
5. **FOLLOW-UP R4-10/R5-01:** Current negative reproduction and state-based regressions meet scoped acceptance; no speculative source modifications. Retain tests.

## Patterns A–F and ownership
- Canonical ownership: PASS for protected tie text: GA-136 explicit key/copy/trigger/catalog edit granted. No reported DB/Storage/production mutation in this package.
- A cross-module: PASS scoped for Player/Teacher test coverage.
- B async/poll/race: PASS scoped on delayed resolve plus repeated polling and stable Pocket.
- C authority: PASS scoped — no new client-side authority to replace server vote policy.
- D provenance: PASS for explicit issue IDs and R4/R5 matrix.
- E authority accretion: PASS scoped — no new migration or schema change.
- F self-confirming tests: FINDING — static mapping of note and DOM-shape-only Teacher proof insufficient to certify reported real visual defects; require realistic specific assertions.

## One bounded corrective return
CD must close **all three** evidence gaps in one amendment to P2–P6 browser suite, using current frozen product source first. Fix product code only if the new realistic browser tests expose a failure, and within previously authorized P2–P6 front-end boundaries. Provide positive Scene note decode/visibility after `study_number_note`, measured Anna diary time-to-visible and its pass criterion, and Teacher V4 layout real geometry comparison to the approved prototype (not merely element presence). Rerun the full suite and update the one-to-one R4/R5 matrix with concrete references. Do not deploy, touch DB/Storage, or request human play.

NEXT_OWNER: **CD**. Return one complete evidence packet to CA for final P7 disposition; no unrelated tasks.
