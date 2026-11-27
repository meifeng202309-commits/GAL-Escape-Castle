# GA → CA — 27 Nov live trial Runtime semantic review / 222-row draft CSV

FROM: GA
TO: CA
DATE: 2026-11-27 14:35 UTC+08
STATUS: **GA INVESTIGATION + PROPOSAL COMPLETE; TEACHER COPY REVIEW PENDING**
NEXT_OWNER: CA for non-Runtime defects and integrated implementation coordination; Teacher/GA for exact copy approval before protected keys change

Source: actual Teacher-uploaded `debug report 27 Nov(1).pptx` (21 slides) directly inspected by GA, plus existing 72×3 approved NL/ZH Runtime manuscripts and CA's page division `CA_to_GA_20261127T135000Z_teacher-trial-27nov-runtime-ownership-and-page-split.md`.

## Delivered

1. `docs/reports/remediation/ui/GA_RUNTIME_ACTION_INDICATION_RULE_PROPOSAL_20261127.md`: **every interactive/waiting Runtime message should explain what the Player can or must do next and where**. Preserve storytelling and character voice; do not add bogus instructions to cinematic beats, counting-down, locked ACT14 or states without live controls.
2. `docs/reports/remediation/ui/GA_RUNTIME_ACTION_INDICATION_AUDIT_20261127.csv`: **222 audited records** = every previously approved 216 role page appearance + six other exact Runtime events observed in this live trial, **108 proposed CN/NL changes**, one row per Page ID/live event, with source slides, existing approved copy, draft, status and causal guard. It is a **proposal**, not yet an owner-approved catalog change nor a CD authorization.
3. GA distinguished actual Runtime faults from display duplication and functional state errors; no SQL/JS/asset/production edits were made.

## Direct screenshot findings & text disposition

| Slide | Runtime observation | GA draft/decision | Next owner |
|---|---|---|---|
| 1 | Gitte weak signal message points toward Action, technical English ack shown in same panel | Keep weak-signal phase distinct from restored-signal chat; ask CD to place system ACK separately/clearly | GA text, CA UI |
| 4 | `SIGNAAL HERSTELD` insufficient | Add Teacher's complete received-messages / right-side Discussion Room instruction with NL; only if server actually delivered messages and chat is open | GA after Teacher |
| 6 | screenshot shows a lock opens, Teacher doubts prior password-entry guidance | Approved page 017 already instructs opening; verify it **appears before** box unlock. CSV adds precise Action five-digit instruction as conditional enhancement | GA text; CA actual timing |
| 7, 12 | Scene caption duplicates same narrative in Runtime | **KEEP Runtime**; remove only duplicate Scene caption | CA/CD renderer |
| 8, 10 | Discussion panel duplicates same approved Runtime narration | **KEEP Runtime**; remove only extra Discussion heading/story | CA/CD renderer |
| 9 | Teacher notes 2:1 inspection-first result erroneously goes to revote | **2:1 is not a tie**. CA must verify actual script-vote acceptance, do not label it as a tie. Separate true tie can display `投票出现平局，本轮没有形成决定。请先在 Discussion 区讨论，等待重新投票。` | CA vote; GA true-tie text |
| 13 | ACT6 portrait `一个问题。只能问一个。` has no action location | Add "请先在 Discussion 区讨论你们最想问的问题，然后在投票开放后到 Action 区选择问题。" NL drafted | GA text; CA ACK |
| 14 | ACT6 response `De poort is niet het begin...` has no explicit speaker | Prefix "画像回答：" / "Het portret antwoordt:" to the triggered reply, not generic scene narration | GA |
| 20 | ACT11 wrong-key `错的人。错的钥匙。真厉害。` | Add a distinct low/cold sarcastic Castle Voice beat and context-sensitive next action. Proposed taunt is **new draft dialogue, not Teacher-approved** | GA wording; CA source trigger |
| 21 | TAKE/LEAVE decision versus actual A/B/C station controls | **No gameplay decision by GA**. CA checks A/B/C vs WATCHER availability; the Runtime page 056 candidate is conditional on actual branch | CA |

## Binding source conditions

- Do not turn truly automated scary moments / numeric countdown / locked ACT14 into click instructions. A status update like `Refresh failed; showing last confirmed state` is a technical error, not story copy; CA investigates actual timed-out RPC (slide 11).
- Avoid double embedding answers/speakers; preserve 1897 clue secrecy and the prior approved Castle Voice first/returning introductions.
- Existing `runtime_message_*_NL.md` contain certain approved guidance absent from displayed screenshot; if a message is already approved but **not rendered at the right phase**, first fix source presentation, not rewrite 216 catalog entries indiscriminately.
- Explicit Teacher approval of the new action-clarity principle/selected drafts is needed prior to GA altering protected canonical words. Reuse current Lean V0.2 single batch, not one approval per row. No production permission implied.
- CD may continue unrelated CA-owned bugs and existing assigned work; **do not wait for GA on functional source diagnosis**.

NEXT_OWNER: **CA** for screenshot functional investigation and one eventual coordinated CD patch; GA available for Teacher discussion on this single proposed wording CSV, no additional audit rounds.
