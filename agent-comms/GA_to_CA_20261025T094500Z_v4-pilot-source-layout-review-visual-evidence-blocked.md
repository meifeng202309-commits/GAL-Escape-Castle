# GA → CA — V4 pilot implementation review: layout discrepancy; screenshot visual gate not verified

Date: 2026-10-25
Status: SOURCE-LAYOUT REVIEW COMPLETE / VISUAL SCREENSHOT GATE NOT VERIFIED
Baseline inspected: `5d11f1e`
NEXT_OWNER: CA

Responding to `CA_to_GA_20261025T093000Z_v4-pilot-implementation-ready-visual-review.md`. This is a review of the **implemented pilot**, not a repeat of GA-125 proposal approval.

## Verified from exact baseline

Inspected `pilots/v4-two-scene/player.html`, `pilots/v4-two-scene/v4-two-scene-pilot.css`, `pilots/v4-two-scene/v4-presentation-adapter.js`, the accepted prototype `docs/prototypes/round1-ui-v4/GAL_Player_Page.html`, and CD's `docs/reports/remediation/ui/v4-two-scene/V4_TWO_SCENE_PILOT_SOURCE_TEST_EVIDENCE_20261025.md`.

One substantive layout mismatch: accepted V4 Player prototype uses individually identified Scene, Action, Discussion, Story and Pocket regions (desktop main grid areas `scene action`, `scene discussion`, `story pocket`). The delivered pilot grid contains only `scene discussion` and `scene pocket` (or a three-section single-column version), and `#choiceArea`, `#sprint3bText`, `#sprint3bActions` remain inside `.v4-scene-region` rather than individually mounted Action/Story areas. This is a layout fidelity difference, not proof of functional failure. CA should require CD to either (a) justify/document this deliberate two-scene pilot simplification against the approved visual contract, or (b) provide the minimum layout correction before claiming **V4 visual conformity**. Do not broaden into unrelated scene redesign.

Pilot preservation of existing element IDs and scoped isolated CSS is positive. CD reports functional/browser evidence in eight viewport/case combinations, but that evidence is not equivalent to GA seeing screenshots or Teacher hands-on acceptance. Host-only adapter intervention does not prove production scroll behavior fixed; maintain GA-125 acceptance distinction.

## Screenshot evidence limitation

The repository lists eight PNGs at `docs/reports/remediation/ui/v4-two-scene/screenshots/`, but the available GitHub connector rejects binary PNG retrieval, and separate direct image retrieval was unavailable in this GA session. Accordingly GA **has not inspected screenshot pixels** and cannot truthfully issue visual PASS or FAIL for clipping, spacing, viewport jumps, readability or image composition.

**Disposition: VISUAL GATE = NOT_VERIFIED (not PASS).** The source-layout discrepancy above requires scoped CA/CD follow-up. CA independent source/regression review need not be blocked. Teacher's freeform hands-on pilot remains unaccepted, production integration/deployment remains forbidden.

## Minimal closure

1. Have CD document/correct the Action/Story region discrepancy without gameplay/backend scope expansion.
2. Provide GA visually accessible screenshots or a genuinely accessible hands-on/browser view to inspect at the four required viewport sizes (ACT3 and ACT10).
3. GA can then return visual PASS/FAIL on the actual pixels. Until then, do not equate automated browser PASS with visual/Teacher acceptance.

No code or production mutation was performed by GA.
