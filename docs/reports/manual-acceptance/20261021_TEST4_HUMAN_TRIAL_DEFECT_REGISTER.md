# TEST4 first post-071 human diagnostic — consolidated defect register

Date: 2026-10-21
Author: CA
Purpose: factual handoff for next bounded Debug V4 remediation under trial-first proportional process
Evidence: Teacher screenshots and statements in CA chat, repository deployment/CA logs, and **read-only** Supabase unified logs.
Scope: one Teacher manually operating Teacher Console and three Player accounts; TEST4 ran through ACT1–ACT7 and stopped at ACT7 repeat vote. No production data was changed to prepare this report.

## Test identity and environment

- Room: `TEST4`, run: `ecb50fb9-45d4-4dc0-83a2-a94103234f90` (Teacher Console screenshot).
- NORMAL mode, Teacher plus Gitte/GAL-A, Anna/GAL-B, Linda/GAL-C.
- Deployed Pages: `deploy/act7-071-20261017`, commit `6e3bbd1d2795bd4486b1437a0b9e107e2238fa28`. Revised database migration: `act7_071_teacher_paced_voting_ca278`, SHA256 `933f8e210ad0e24daf8c944f1b43c817d71fe8f28fa0ecf87461e19e285e7401`. CA-278 live smoke PASS only for a delayed ACT7 vote and successful tie-to-next-round continuation; does NOT prove majority resolution.
- Authoritative reference: `docs/plans/DEBUG_V4_TRIAL_FIRST_AUDIT_PROCESS_V1.0.md`, especially §1A Work Necessity Gate.
- Source limitations: screenshots are human observations; this report did NOT independently query `TEST4` game tables, inspect browser network requests or obtain a fresh CD root-cause packet. Do not present reported vote choices as verified committed DB rows.

## Scene-by-scene observed trial path

| ACT | Confirmed visible observations | Result |
|---|---|---|
| 1 | Teacher started NORMAL; three role sessions joined. ACT1 private content and initial actions appeared. Some Player top chrome inconsistent. | PASS for startup, presentation defects |
| 2 | All three sent group messages and Teacher saw transcript. Three distinct first location votes led to an additional round; second 1:1:1 resolved by `system_fallback` to `library`. Route-update appeared after refresh/scroll and Player `DOORGAAN` clicks. | PASS transition, unclear guidance/scroll |
| 3 | FOLLOW SIGN barrier delayed until final player acted; all reached Library. Library artwork displayed. | PASS after necessary player action |
| 4 | Known/unknown route private choices shown and submitted; moved into ACT5. | PASS for visible transition; detailed ACT4 functionality not exhaustively verified |
| 5 | Players discussed known/unknown route, votes/revotes. Final 1:1:1 round fallback `inspect_first`; inspection sequence shown. Later route choices permitted entry to ACT6. | PASS visible transition; first-round re-vote reason requires vote readback if contested |
| 6 | All entered Portrait Hall, text discussion worked; subsequent scene led to ACT7. Initial vote/reset perceived by Teacher. | PASS visible transition, vote semantics need verification if a 2:1/3:0 claim exists |
| 7 | Three Players entered Clock Room, saw A/B/C clocks, messages synchronized, Teacher opened vote. Teacher reported **three successive rounds reset**, including a round with all three Players choosing A. No ACT8 transition observed. Screenshot round3 status `voting`, deadline null, A/B submitted, C waiting was taken **before** third vote. | **P0 reported human-run blocker, unverified committed-vote details** |
| 8–14 | Not reached in TEST4. | NOT_REACHED |

## Defect register by severity

### P0-01 — ACT7 unanimous clock A reported to restart vote instead of resolve
- Evidence: Teacher confirms GAL-A/B/C all selected A during one ACT7 vote and, after final submission, it reopened another round rather than advancing. Earlier ACT7 rounds similarly restarted. Pre-final screenshot: `discussion_session_id=b02c3329-7a4b-4f19-9fc7-1d107145949e`, round 3, `status=voting`, `phase_deadline=null`, two submitted, Linda waiting. Teacher statement says after Linda's submission all three chose A and reset followed.
- Expected: REPEAT_UNTIL_MAJORITY — 2 or 3 matching clock selections terminate re-vote and move to next canonical phase.
- Actual: Teacher-observed continued/restarted voting with no ACT8.
- **Caveat**: final DB vote rows and exactly which round was reset have not been independently read back; alternative hypothesis is a failed/stale final commit. Investigation must distinguish vote submission rejection, stale/duplicate round, and incorrect majority computation. Do NOT assert these as proven causes.
- Work necessity: direct block to finishing next full human diagnostic trial. Priority 1 investigation. Preserve old messages/real votes; no speculative automatic retry and no unauthorised production mutation.
- Formal CA→CD request: `agent-comms/CA_to_CD_20261021T111500Z_act7-majority-reset-investigation.md`.

### P1-01 — persistent Player top-level “Waiting for formal run” / statement timeout
- Anna screenshots during ACT1, ACT2 and ACT7 show stale `Waiting for formal run` and red `canceling statement due to statement timeout` while canonical runtime correctly displayed later ACTs and allowed chat/progression.
- Actual live logs from Supabase `qdcbdcjobzytzhnhfwyn` (read-only log query in 2026-10-21 08:30–12:00 UTC) include Postgres error `canceling statement due to statement timeout` and PostgREST `57014` at **08:30:41–08:30:43 UTC** and again **10:44:39–10:44:47 UTC**, plus row/transaction lock wait messages at **11:10:47–11:10:49 UTC**. Logs demonstrate genuine DB timeout/lock contention signals, but causal linkage to this UI or ACT7 majority reset is unverified.
- Action: include in P0 investigation only if same SQL/locks affect vote commit. Otherwise P1 defer. Do not launch blanket database performance redesign.

### P1-02 — ambiguous player task/prompts and unclear action labels
- ACT1 Anna/Linda item pickup says `[MEENEMEN] 拿上` without clearly identifying item; other role content differs as intended but user cannot tell what to pick up.
- ACT2 DiscussionRoom only says players know different information, without clearly asking them to **decide where to meet**. Teacher had to tell students verbally.
- ACT5 route-choice appears before final group vote; players may confuse private route stance with final vote.
- ACT6 displays one-question prompt, but exact vote objective/options should be checked for clarity when following up.
- Resolution: low-risk text/UI proposal only after playable route is secured.

### P1-03 — Teacher console debug/internal IDs and layout obscuring state
- Teacher Discussion observation renders `Topic: act02.026`, `act04-05.009`, `act07.001` instead of clear Chinese/Dutch prose.
- Many unrelated Sprint2/Sprint4/Asset Manager/Recovery/Legacy panels and controls appear. Teacher may confuse `Open vote now` with correct phase and incorrectly believe a new vote is needed.
- ACT2 post-fallback Route Updated appeared at page top while Teacher/Player remained scrolled at old Discussion Room. Following manual refresh and `DOORGAAN`, ACT3 succeeded: no P0.
- Proposed remediation: small localization and current-step emphasis/auto-scroll only if truly low cost; no UI rewrite before ACT7 P0 fix.

### P1-04 — player identity header disappears intermittently
- Gitte Player header blank after reconnect/refresh, while Teacher continued to show correct GAL-A role/location. Similar issue known from Oct 3 public smoke.
- Display only, pending any evidence of true role confusion.

### P1-05 — asset reviewer authority error in Teacher-only panel
- `Assets unavailable: Invalid Asset Manager reviewer authority` shown in Sprint4 Game Assets, while game images display. Affects image/audio review interface, not observed game flow; defer.

### OBS-01 — zero-second countdown/deadline even with Teacher-paced NORMAL
- Player `0s` displayed in ACT2/ACT5/ACT6 discussions; Teacher also showed old absolute discussion deadlines, while ACT7 voting screenshot had `Deadline: none`. Does not prove actual vote timeout.
- Verify underlying policy only if related to P0. Otherwise presentation/status debt.

### OBS-02 — vote “clearing” may be intended re-vote, not necessarily data loss
- ACT2: first 1:1:1 and second 1:1:1 led expected one revote + Library fallback; separate Round IDs and `system_fallback` shown.
- ACT5: fallback at round4 to `inspect_first` after reported disagreement; displayed `resolution_source=system_fallback`.
- ACT6: Teacher reported one round restarting, yet game reached ACT7. Without vote value/round readback, do not classify as definite corruption.
- ACT7: unanimous-A report differs materially and is P0 to investigate.
- The observable "0/3" at a newly created round is not deletion of previous vote rows: DB readback required for any history-preservation claim.

## Read-only logs actually consulted

1. GitHub `docs/logs/CA_ACTION_LOG.csv` through CA-279: CA-276 Teacher-paced minimum correction, CA-277 source PASS, CA-278 controlled production authorization, CA-279 live acceptance PASS.
2. GitHub `docs/logs/CD_ACTION_LOG.csv` through CD-137: one actual deployment and smoke; no recorded subsequent TEST4 majority-fix handoff as of this report.
3. GitHub `docs/reports/remediation/act7/CA278_TEACHER_PACED_VOTING_LIVE_DEPLOYMENT_PASS_20261021.md`: ACT7 test confirmed late-vote submission, **not** unanimous majority resolution; smoke purposely resolved a tie to next round.
4. Supabase unified logs, project `qdcbdcjobzytzhnhfwyn`, bounded `2026-10-21T08:30:00Z` through `2026-10-21T12:00:00Z`: 85,139 edge, 1,365 pgbouncer, 173 postgres, 50 postgrest and 6 storage log entries in query window. Source counts only, **not** number of failures. Filter for “statement timeout”/“deadlock”/“still waiting” returned 62 postgres and 19 postgrest matching messages (mixed predicates; not 81 unique timeout failures). Actual individual timeout messages and lock waits separately observed. Connection between events and TEST4 specific vote transition not demonstrated.
5. No claim that Supabase logs alone resolve the game state: game-event/choice tables, exact RPC metadata or request IDs still require focused read-only investigation. No stored screenshots were uploaded to repository; their observations remain in Teacher–CA chat.

## Minimal next debugging scope / exit criterion

1. **CD**: bounded read-only verification of TEST4 round2/3/4 actual vote selections, accepted request/decision rows, timestamps, round status and authoritative resolution; correlate with one relevant source path. Explicitly distinguish rejected Linda vote from accepted three-A vote and logic-generated unintended round.
2. **CD**: propose smallest fix only if confirmed, with one positive 3:0 and one 2:1 majority test, plus 1:1:1 expected re-vote negative. Retain append-only existing discussion/vote history. Separate authorization before live change.
3. **CA**: one consolidated audit, no new broad architecture, SQL audit framework or speculative security task.
4. **Teacher**: resume diagnosis after confirmed P0 repair; then decide which P1 items materially harm gameplay. No additional demand to recreate this entire test.

WORK NECESSITY GATE: Everything other than ACT7 proven blockage and any SQL timeout actually contributing to it is currently deferred or observation-only.

NEXT_OWNER: CD for read-only investigation under the existing ACT7 issue handoff. Report is evidence register, not deployment authority.
