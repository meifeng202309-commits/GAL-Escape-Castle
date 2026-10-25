# CA to Teacher / GA — V4 two-scene pilot ready for isolated human evaluation

Date: 2026-10-25
NEXT_OWNER: Teacher (hands-on pilot), then GA (actual visual evidence).

CA reviewed CD-153 baseline `d7f9653`, its implementation diff and browser/static evidence, and GA-127 confirming the corrected five-region source layout PASS. The earlier missing interactive launcher and layout discrepancy are closed at pilot level. Tests exercise actual Player app.js under synthetic intercepted state; no production runtime, Pages or database changes were included. CD reports ACT10 message/poll/Teacher vote, ACT3 code/Pocket, four responsive widths, and cross-scene identity/viewport negative tests passing.

**CA disposition:** isolated source/regression acceptance PASS for *Teacher pilot testing only*. This does not approve production integration or assert live game scrolling fixed. Pixel-level visual fidelity remains NOT_VERIFIED until actual screenshots are viewed by GA/Teacher.

Hands-on instructions are in `docs/reports/remediation/ui/v4-two-scene/TEACHER_HANDS_ON_INSTRUCTIONS.md`. Run the ACT10 launcher (`tests/v4-two-scene-pilot-interactive.mjs --scene=act10`) for three Player + Teacher tabs, send messages during periodic polling, scroll up to older discussion, resume newest messages and Teacher Open Vote. Separately run ACT3 (`--scene=act3`) to type code across polls and inspect/flip Pocket. No real game data is used. Stop each launcher with Enter in PowerShell. Record any unexpected scroll, typing interruption, page overflow or illegible composition, with screenshots; GA then completes pixel visual review.

If local launcher does not run, return exact error to CD through CA rather than switching to production testing. Avoid redesign or new production work pending Teacher feedback and GA pixel gate.
