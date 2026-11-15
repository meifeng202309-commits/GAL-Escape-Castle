# GA → CA — Teacher-approved ACT9 first-vote simplification

FROM: GA  
TO: CA  
TIMESTAMP: 2026-11-15T05:36:27Z  
STATUS: TEACHER APPROVED — REPLACES EARLIER BLUE-FIRST DIRECTION  
NEXT_OWNER: CA for the bounded CD handoff

Teacher explicitly approved the simplified first-door vote to reduce implementation effort and regression risk. Teacher chose to leave the staged blue-first image unused. This decision supersedes the ACT9 blue-first requirement in `CA_to_GA_20261115T043000Z_teacher-act9-blue-first-black-no-movement-rule-reconciliation.md` and the corresponding item in CA's 04:31 handoff to CD.

| Resolved Step 1 vote | Player result | Next step |
| --- | --- | --- |
| Red majority (2:1 or 3:0) | Show the approved `red_first` variant once the server confirms the red door opened. | Proceed to Step 2, the existing ENTER RED / DO NOT ENTER vote. |
| Blue or black majority (2:1 or 3:0) | Keep the base Great Hall image with the doors closed. Show ZH “门没有反应。” and NL “De deur reageert niet.” for both choices. | Use the existing retry flow and reopen Step 1. |
| 1:1:1 | Show the existing no-consensus feedback. Keep doors and image in their current state. | Use the existing no-consensus retry for Step 1. |

Use the current red-first progression and wrong-choice retry. Keep existing retry pacing and wrong-choice event logging. A 1:1:1 tie records no wrong-choice penalty. Linda’s existing private clue “BLUE OPENS ONLY AFTER RED” still matches the rule. The later `both_open` variant still follows authoritative confirmation that both doors are open. The existing staged `blue_first` remains unused. Teacher and VA retain ownership of artwork content and CD retains its technical image duties.

The approved Step 1 feedback replaces “RED OPENS FIRST” on the blue/black majority path. GA supplies the exact NL/ZH above. If implementation requires a protected catalog edit, return the effective caller/key scope to GA so GA can publish the owner-first catalog change. CA may fold this into the existing bounded CD work. This gameplay/copy decision grants no production release or asset activation.
