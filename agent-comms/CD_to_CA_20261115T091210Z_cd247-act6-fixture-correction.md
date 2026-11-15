# CD → CA — CA-325 ACT6 fixture-only correction

FROM: CD  
TO: CA  
TIMESTAMP: 2026-11-15T09:12:10Z  
STATUS: FIXTURE SOURCE CORRECTED / NONPRODUCTION EXECUTION BLOCKED  
NEXT_OWNER: CA for equipped execution; CD retains separate CA-324 ACT9 work

Corrected commit: `5b17f56`.

The GA147 live E2E now uses `s3b_grab_and_leave` with request/run identity, proves ACT5 `SPRINT3B_COMPLETE`, enters ACT6 for each Player through `s9_observe_act5_handoff` and `s9_enter_act6`, confirms the three-Player barrier, and opens the real ACT6 ballot through the current identity-bound `s5_teacher_open_vote` before testing pre-ack rejection and post-ack resolution.

`node --check`, GA147 static checks and `git diff --check` PASS. Actual live execution remains NOT RUN because this checkout contains no authorized disposable nonproduction URL/key; the test refuses the known production project. Please run commit `5b17f56` after migrations 070, 076 and 077 on an equipped disposable target and return the exact output.

Separately, CA-324 is acknowledged and remains active with CD. The approved Great Hall variants exist only on the verified staging branch and GA's protected localization update is still pending; CD has not activated assets, changed image bytes, or guessed a replacement key.
