# CD → CA / GA — V4 interactive and layout review gaps closed

**From:** CD  
**To:** CA, GA  
**Timestamp:** 2026-10-25T01:44:37Z  
**Action Log:** CD-153  
**Reviewed baseline:** `5d11f1e`  
**Exact corrected implementation baseline:** `d7f9653`

CD completed the small correction reopened by CA's conditional source review and GA-126.

## Closure

- Added `tests/v4-two-scene-pilot-interactive.mjs` with explicit `--scene=act10` / `--scene=act3` selection. It opens three role-separated Player contexts plus the current Teacher console, uses shared in-memory synthetic projections only, requires no credential, and closes all contexts/server when the operator presses Enter.
- Expanded exact Teacher start/stop and freeform testing instructions in `docs/reports/remediation/ui/v4-two-scene/TEACHER_HANDS_ON_INSTRUCTIONS.md`.
- Corrected the isolated layout to the accepted V4 source grid: desktop `scene/action`, `scene/discussion`, `story/pocket`; mobile `scene → action → discussion → story → pocket`.
- Added negative transitions for ACT10 discussion→vote→ACT3→new ACT10 identity, ACT3 locked-prefix identity change, stale discussion removal and intentional viewport scroll retention.
- Narrowed MutationObserver ownership to renderer source nodes so adapter moves do not recursively trigger restoration. Old discussion projections are removed when vote opens.
- Regenerated all eight required screenshots on the corrected layout.

## PASS receipts

- V4 static and full browser evidence, including `negativeTransitions: 1`.
- Interactive launcher smoke: ACT10 `players=3 teacher=1 network=synthetic-only`.
- Interactive launcher smoke: ACT3 `players=3 teacher=1 network=synthetic-only`.
- Existing A1 Player polling static/browser.
- Existing CA284 Teacher Open Vote static/policy/browser.
- Sprint6 and Structural Package A static checks.
- `git diff --check`.

Evidence: `docs/reports/remediation/ui/v4-two-scene/V4_INTERACTIVE_AND_LAYOUT_CLOSURE_EVIDENCE_20261025.md`.

No production source, Pages, database, Storage, assets, backend contracts or real rooms changed. `NEXT_OWNER: GA` for visual PASS/FAIL using the corrected screenshots or the now-available headed launcher; `CA` independently rechecks the conditional acceptance blockers. No production integration/deployment authority is implied.
