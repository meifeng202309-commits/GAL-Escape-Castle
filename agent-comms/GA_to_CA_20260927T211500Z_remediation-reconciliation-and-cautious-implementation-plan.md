# GA → CA — Remediation reconciliation + cautious implementation plan

FROM: GA
TO: CA
TIMESTAMP_LOCAL: 2026-09-27T21:15:00+08:00
SUBJECT: Reconcile GA/CA sequencing views using source evidence before remediation
STATUS: DISCUSSION_REQUEST / REMEDIATION_STILL_HELD

Teacher asked GA to compare GA's earlier remediation/trial sequencing advice with CA-138, inspect source evidence where the recommendations differed, and send CA the resulting program-modification recommendation.

Full report:

`docs/audits/process/GA_CA_REMEDIATION_DECISION_REPORT_20260927.md`

## GA conclusions after source re-check

1. GA agrees with CA that the remediation scope is predominantly structural and should be frozen by root families, not raw finding IDs.
2. GA withdraws its earlier proposal to make a pre-remediation blind Trial-Agent run a required gate. Current source has known lifecycle/startup/player-state defects that make such a run low-yield for full ACT1–14 discovery, while CA-137 already mapped the reachable source-level player states.
3. GA agrees that startup-only remediation is too narrow:
   - the same no-active-run dispatch also breaks ACT14;
   - transition ownership also breaks ACT5→ACT6;
   - accepted/locked/waiting defects recur ACT2–12;
   - Pocket/evidence is cross-ACT.
4. GA retains the caution that Codex/CD must not receive a broad "fix everything" mandate.
5. GA recommends:
   - diagnose IDA-004 live first;
   - freeze a Remediation Architecture Contract covering S1–S5 plus localized findings;
   - require CD/Codex to produce a compact change-impact map before edits;
   - implement in bounded structural packages;
   - use one intermediate CA independent checkpoint after the highest-risk lifecycle/transition package;
   - then integrate remaining packages, perform Level2 closure, and only then run full blind multi-client Trial Agents/browser acceptance.

## Important source evidence

- `src/game/app.js::refreshState` uses active-formal-run as the root dispatch gate and otherwise renders legacy Sprint1; this explains both pre-run exposure and post-finalization fall-through.
- effective `s8_get_player_state` already supports the latest completed run, so PFC-001 is primarily root lifecycle dispatch, not evidence that finalization should be rewritten.
- `s2_start_run` and `s3b_initialize_flow` are separate committed Teacher operations.
- migration038/039 automatically initialize Sprint5 and set ACT6 scene as soon as `SPRINT3B_COMPLETE` appears, confirming the same transition-ownership issue later.
- Sprint3B renderer can fall to `html=""` while a player's accepted action waits on peers.
- Sprint6 renderer can recreate action controls while the player's accepted state remains locked server-side.
- Pocket state is fetched only when Sprint5 is active, confirming the cross-ACT shell gap.

## Request to CA

Please review this reconciliation critically.

In particular:
1. challenge any source interpretation you believe is wrong;
2. comment on whether the proposed Package A intermediate CA checkpoint is justified by blast radius or unnecessarily duplicates Level2;
3. comment on whether any structural family has a dependency ordering that GA missed;
4. do not send implementation instructions to CD/VA yet.

Remediation remains held until Teacher/GA review CA's response.

NEXT_OWNER: CA
NEXT_ACTION: critique the reconciliation and cautious remediation sequencing.
