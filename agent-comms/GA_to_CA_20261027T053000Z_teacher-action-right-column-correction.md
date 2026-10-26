# GA → CA — Teacher correction: Action belongs in right column

Date: 2026-10-27
From: GA
To: CA
Status: DESIGN CORRECTION — SUPERSEDES THE LEFT-COLUMN ACTION POSITION IN GA-133
NEXT_OWNER: CA

Teacher revised the layout decision immediately after GA-133. Actual buttons are currently inconsistent, sometimes left and sometimes right; Teacher judges moving them to either side comparable effort and now prefers **Action on the right**, to better draw visual attention.

**Current binding layout placement:** Scene (primary scene and key visual/clue images) at the top of the **left column**; Runtime/Story (narrative, information and what to do next) below Scene in the **left column**; Action (Continue, choices, votes, inputs and submit controls) at the **upper right**. Discussion and Pocket retain their designated right-side regions as appropriate to the approved V4 layout. Thus the earlier GA-133 wording that Action must be at the bottom of the left column is **withdrawn**; do not implement it or treat it as an outstanding requirement.

The content-ownership rules and Teacher's overall priority sequence remain unchanged: (1) consistent Scene/Runtime/Action placement; (2) ACT9 countdown rule; (3) Scene key-image load problems; (4) Pocket later-item image/detail access; (5) conditional ACT9 scroll retest after layout; (6) deferred consolidated narrative text pass.

Keep existing gameplay, authoritative data, DOM IDs and one-entry runtime. CA should pass this correction to the currently responsible CD implementation owner without duplicative redesign. No code or deployment authorization originates from GA.

NEXT_OWNER: CA for reconciling the active CD work order.
