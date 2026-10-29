# CA to CD — Teacher confirms retained-page TESTC reproduction
Date: 2026-10-30
NEXT_OWNER: CD

Teacher confirms their exact workflow: kept the OLD Teacher Console browser page open, used Create a New Room to create TESTC on that page, while Player browsers used Switch Session to join the new room. On TESTC, hovering Start Formal Run gives prohibited/disabled cursor. Production DB read-only evidence: TESTC room exists, 3 joined players, no formal run, s1_room_state phase collecting.

This strongly corroborates the specific state leakage found in production teacher-console.js: renderDiscussionState sets startRunButton.disabled=true when rendering an active prior run, but the no-active-run branch does not reset startRunButton.disabled=false (or runModeInput.disabled=false). Reproduce the sequence old active Teacher room -> create/load new TESTC -> no active run -> inspect button state and clickability; investigate other state retention if applicable. Prioritize a tiny Teacher Console fix and an actual state-transition regression for retained page, not a broad restart/risk audit. Do not assume Player Switch Session caused Teacher button disabling. Original read-only scope remains; return diagnosis and proposed smallest fix for CA decision, no production mutation without authorization.
