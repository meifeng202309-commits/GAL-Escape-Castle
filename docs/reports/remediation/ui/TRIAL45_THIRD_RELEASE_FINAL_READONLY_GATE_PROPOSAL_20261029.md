# Trial4+5 third release final read-only gate proposal

Date: 2026-10-29  
Authority: `CA_to_CD_20261029T040000Z_five-file-release-and-initial-load-policy-approved.md`

## Current read-only preflight

- Frozen runtime target remains `ca0e2ba`; all five target and `727ed7c` recovery blobs exactly match CD-185.
- Remote deployment branch `deploy/trial4-player-act9-20261027` is still at recovered head `d3e3da984b5a83b0d6406de723f27072834e721f`.
- Supabase read-only observation at `2026-10-28T15:56:54Z`: runtime events 30m `0`; S1 events 30m `0`; new runs 30m `0`; newly open discussions 30m `0`. Latest runtime event `2026-10-27T15:52:31Z`; latest S1 event `2026-10-27T15:29:29Z`.
- Migration receipt `20261027151620 act9_normal_teacher_paced_vote_073` remains latest, followed by the expected 070 and 072 receipts.
- The source/test closure gates from CD-186 pass. No write or deployment occurred.

The authenticated Pages settings API is unavailable in this execution environment (`gh` absent; connector rejects the Pages settings endpoint). The last canonical authenticated evidence says selector `deploy/trial4-player-act9-20261027`, root `/(root)`, legacy build. This is **not promoted to a fresh PASS**: exact selector/root/build status must be re-read through an authenticated channel immediately before any release mutation. Public media HTTP and full function/ACL checks must likewise be refreshed in that immediate gate.

## Proposed objective severe-stall rule — requires CA acceptance

This is an implementation proposal, not a Teacher-approved numeric SLA:

1. For every required cold/warm sample, start the initial-media clock at `DOMContentLoaded` and stop only when the expected Scene image is connected, visible, decoded, has positive natural/client dimensions and the correct asset key.
2. **Hard STOP at 15,000 ms** if that endpoint has not been reached. This is six times the retained 2,500 ms post-refresh regression limit, more than twice the prior recovered-old 5.8-second observation, and still decisively catches the prior 29.6-second visible stall.
3. Independently hard STOP at any time for wrong-role/wrong-scene asset, missing/disconnected image, decode failure, indefinite loading, endpoint/network failure, or a resource/decode trace showing no forward progress through the bounded observation.
4. Initial samples below 15 seconds are not automatic release failures, but every value, p90/max, resource/decode timing, timer-gap/Long-Task trace and player-visible blank duration must be disclosed without rerunning or suppressing slow samples.
5. Keep the existing post-refresh/remount endpoint at `<=2500 ms` and all correctness gates unchanged.

The 15-second cutoff is proposed as a conservative classroom-usable upper bound between observed 5–6 second degraded old-client loads and the known unacceptable 29.6-second stall. CA must accept, replace or reject it before live mutation.

## Execution readiness after confirmation

After CA confirms the rule, CD must repeat the time-sensitive Pages selector/root/build, five public recovery hashes, five target blobs, migration073 function/dependency/owner/security/ACL, 30-minute activity and required media HTTP checks. Only if all pass may the single authorized five-file attempt proceed. Any hard failure restores all five files to `727ed7c`, waits for a completed Pages build and verifies exact public recovery hashes.

STATUS: WAITING_CA_SEVERE_STALL_RULE_CONFIRMATION. No live release has begun.

