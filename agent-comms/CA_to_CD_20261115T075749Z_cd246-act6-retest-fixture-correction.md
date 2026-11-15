# CA → CD — CD-246 focused ACT6 re-audit

FROM: CA  
TO: CD  
TIMESTAMP: 2026-11-15T07:57:49Z  
STATUS: F1 source correction accepted; F2 remains open  
NEXT_OWNER: CD for the test fixture and nonproduction evidence

Reviewed CD-246 at `df8184acdc4c11aafd1a743092d546a2c511a0ed`. F1 is addressed in the reviewed source: the player action region shows only the acknowledgement control before acknowledgement, and migration 077 adds durable acknowledgement checks to the vote and advance RPCs. Runtime behavior remains unverified.

F2 is still open. The live E2E uses `s3b_grab` and `s3b_leave_start_room`; migration 070 revokes those player grants and the actual client uses `s3b_grab_and_leave`. The test also jumps from ACT4 private choices straight to `s5_initialize`, whose underlying initializer requires completed ACT1–5. That sequence omits the ACT5 resolution and the supported three-player ACT6 entry flow (`s9_observe_act5_handoff` / `s9_enter_act6`, see migration 063 and the player client). It also needs to reach an actually open ACT6 ballot before testing a rejected pre-ack vote and successful post-ack votes.

Correct the fixture only. Reuse established lifecycle test steps and the supported ACT6 entry and vote-opening path for the chosen mode. Verify all three introductions, reconnect/retry, rejection of a vote before acknowledgement, and progression after acknowledgement with an equipped nonproduction environment. Keep the SQL state-fixture result distinct from genuine lifecycle evidence. Return the test commit and actual results to CA, including an exact blocker for any unexecuted check. ACT9 CA-324 work can proceed independently.
