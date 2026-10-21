# CA-273 Trial Readiness Assessment

Date: 2026-10-21  
Scope: one bounded source/read-only assessment; no production write, deployment, Pages switch, data cleanup, or live fixture  
Recommendation: **START WITH KNOWN LIMITATIONS**

## Current route

| Item | Assessment |
|---|---|
| Public entry | Player: <https://meifeng202309-commits.github.io/GAL-Escape-Castle/>; Teacher: <https://meifeng202309-commits.github.io/GAL-Escape-Castle/teacher.html> |
| Pages baseline | `deploy/manual-acceptance-20261003` / `/(root)`, frozen commit `891feffe558a4683ac3da67e1e6b15e902c7e592` |
| Database posture | CA-272 recovery returned production to the pre-071 baseline; production remains HOLD for writes. No 071 deployment is required to start this diagnostic trial. |
| Startup evidence | Public smoke proved Teacher room creation, three isolated anonymous joins, formal start, distinct private ACT1 surfaces, reconnect, and zero material browser errors. |
| ACT1–ACT14 reachability | **Previously evidenced end to end.** Canonical E1 drove Teacher plus three isolated Player contexts through ACT1–ACT14, observed ACT14 finalization/reconnect, received 1007 Supabase RPC HTTP 200 responses, and recorded zero material browser errors. This supports starting a human diagnostic trial; it is not a claim that all natural human timing paths are defect-free. |

## Confirmed pre-trial P0 blockers (maximum three)

**None that prevents starting the trial.** One conditional P0 risk is already demonstrated:

1. **ACT7 vote timeout trap.** If an ACT6–8 vote, observed specifically at ACT7 round 2, reaches `waiting_for_missing_player`, Player pages suppress vote buttons. On the deployed pre-071 baseline, Teacher Add Time extends the deadline but does not reopen the state to `voting`, and Open Vote is not valid from that state. There is no authorized ordinary Teacher recovery. Consequence: that run cannot continue naturally and must stop. Workaround for this diagnostic trial: have all three Players ready before opening each ACT6–8 vote and require all three submissions within the current 60-second window, especially every ACT7 round.

This is a **known limitation**, rather than a reason to block trial start, because the current route has already reached ACT14 and timely coordinated voting avoids the demonstrated failure condition. If the condition occurs, it becomes the first concrete P0 for targeted repair; do not use ad hoc SQL/RPC mutation.

Non-blocking observations to record, not fix before trial: reconnect may leave the `#playerLabel` chrome blank while identity/state remain intact; final media/audio and classroom readability remain human-acceptance boundaries.

## Minimum Teacher operations

1. Confirm no other Teacher, class, automation, or Agent is using production; keep Pages on the frozen baseline above.
2. Open the Teacher URL, create one new diagnostic room, and have exactly three Players join in isolated browser profiles/windows through the Player URL. Do not clear historical records.
3. Start one formal NORMAL run and progress naturally. For ACT6–8, verbally confirm all three Players are ready **before** opening each vote; all three must submit within 60 seconds. Repeat this coordination for every ACT7 round.
4. Record every ACT as `PASS`, `BLOCKED`, `BYPASS`, or `NOT_REACHED`. For the first P0, capture time, ACT/round, role, last action, visible message, and screenshots from Teacher plus affected Players.
5. STOP immediately for wrong-player/private-data exposure, serious database/state corruption, loss of a clear stop/recovery path, or the ACT7 `waiting_for_missing_player` state with no vote buttons. Do not improvise database/RPC repair. Ordinary text, visual, or audio defects should be recorded while the trial continues.

## Evidence reused

- `agent-comms/CD_to_GA_20261003T120000Z_manual-acceptance-deployment-smoke-pass.md`
- `docs/reports/manual-acceptance/20261003_ACT7_ROUND2_NO_VOTE_RECOVERY_BLOCKER.md`
- `docs/audits/independent/runs/2026-09-30_structural_remediation_level2_closure/AUDIT_REPORT.md`
- `docs/reports/remediation/act7/071_CA272_ATTEMPT_STOP_AND_RECOVERY_20261021.md`

