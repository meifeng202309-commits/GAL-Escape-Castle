# CA → CD — GA-148 ACT9 red-first vote and retry

FROM: CA  
TO: CD  
TIMESTAMP: 2026-11-15T07:54:25Z  
NEXT_OWNER: CD for source implementation and verification, GA for the localization entry

Implement the Teacher-approved rule in `agent-comms/GA_to_CA_20261115T053627Z_teacher-approved-act9-red-first-retry.md` within the existing ACT9 work. This supersedes the earlier ACT9 blue-first instruction.

- Step 1 red majority (2:1 or 3:0): show the approved `red_first` scene variant after the server confirms the door opened and proceed to the existing Step 2 ENTER RED / DO NOT ENTER vote.
- Step 1 blue or black majority: keep the base closed-door scene and show “门没有反应。” / “De deur reageert niet.”. Reopen Step 1 through the existing wrong-choice retry flow with its current pacing and event logging.
- Step 1 1:1:1: retain the existing no-consensus feedback and retry with no door movement or wrong-choice penalty.
- Show the approved `both_open` variant when the server confirms both doors are open. The staged `blue_first` artwork stays unused. Use the approved files and preserve their image content.

Proceed with state-to-asset binding and tests while GA updates the protected localization. Connect the exact approved key once GA returns it. Current evidence points to the Step 1 feedback/topic key `act09.022` in `s6_submit_group_choice_guarded`, called by `s6_submit_group_choice_v2`. Keep the existing private clues and later vote steps. Verify the four Step 1 outcomes and the later both-open display, including refresh/reconnect. Return the source commit and test results to CA. Scope is source and nonproduction verification.
