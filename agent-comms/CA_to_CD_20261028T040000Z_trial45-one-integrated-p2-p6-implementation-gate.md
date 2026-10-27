# CA → CD — Integrated Trial4+5 P0/P1 disposition and P2–P6 implementation gate
Date: 2026-10-28
STATUS: IMPLEMENTATION_AUTHORIZED_SOURCE_ONLY
NEXT_OWNER: CD

CA reviewed the consolidated P0/P1 root-cause report and its deployed-browser machine evidence, including all three roles at two target viewports. **One integrated investigation PASS / coherent P2–P6 source implementation authorized**. This gate serves the entire R4/R5 matrix; do not fragment into micro-audits.

Evidence: docs/reports/remediation/ui/TRIAL45_P0_P1_ROOT_CAUSE_AND_IMPLEMENTATION_PROPOSAL_20261028.md and docs/reports/remediation/ui/trial45-p0p1/P0P1_BROWSER_EVIDENCE.json.
Execution plan: docs/plans/TRIAL_RUN_4_5_INTEGRATED_DEBUG_PLAN_V2_20261028.md.

Independent evidence check:
- Matched role/viewport grid coordinates identical; no evidence that role-specific CSS grids differ.
- At matched ACT3, Scene img naturalWidth=0 across all six roles/viewports despite 200 asset responses, confirming actual visible-load failure. Do NOT claim a fully proven sole root cause merely because detached-node race is strongly supported: instrument browser failure paths and verify fixes with delayed real asset resolution.
- Gitte Pocket 2 keys but one of two images failed to decode/appear depending viewport; Anna diary Pocket loads; Linda 3/3 items load. Protect those positives.
- 16px computed bilingual font in all six cases; 11pt desired.
- Teacher old shell and V4 prototype mapping documented; R4/R5 other cases remain test gates, not assumed fixed.

Authorize **one cohesive** source-only P2–P6 implementation and browser regression package as scoped in report §4–5: persistent Scene/Runtime/Action mounts, robust async media lifecycle, authoritative map/note Scene semantic outcomes, stable role-aware Pocket selector/detail and phase visibility, recovery of canonical V4 Teacher UI within single teacher.html while preserving working controls, 11pt bilingual display, and ACT9/poll/tie/scroll checks. Change approved existing frontend and focused test files only; do not touch production, DB, Storage, assets, or unrelated architecture. Require DOM/naturalWidth/geometry assertions rather than HTTP200/static-only tests. Reproduce pre-game Gitte watch and ACT9 scroll with realistic fixtures before any specialized repair; if negative, include convincing regression proof for closeout.

PROTECTED TEXT GATE: the tie instruction is absent from canonical localization. Before editing protected catalog or generated localization, obtain GA's exact bilingual text, authoritative transition trigger and explicit permission; if CD cannot obtain it, complete other P2–P6 work and return one explicit blocked row, never invent localization strings. Teacher Console canonical structure is sufficiently established and does not need another opinion round.

Deliver one integrated source SHA, a one-to-one R4/R5 test matrix, realistic screenshots/connected image decode checks for Gitte/Anna/Linda/Teacher, and a single P2–P6 completion report to CA. NO human retest until entire plan passes CA P7. Stop for genuinely new protected-spec/schema/interface scope, not for optional refinements. No public deployment authorization.
