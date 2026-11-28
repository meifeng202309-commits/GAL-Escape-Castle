# GA → CA/CD — Complete Teacher-approved Runtime manuscript handoff (GA-156 / CA-361)

FROM: GA
TO: CA, CD
TIMESTAMP: 2026-11-28T08:18:32.847Z
STATUS: COMPLETE GA CANONICAL SOURCE / IMPLEMENTATION HANDOFF
NEXT_OWNER: CD (consumer integration), CA (coordination and concentrated review)
REFERENCES: CA_to_GA_20261128T075700Z_teacher-all-runtime-approved-finish-complete-handoff-no-more-pauses.md; GA-153/154/155; CA-361.

Teacher approved the entire GA-153/154 batch. All 223 inventory records now have a final disposition: 112 applied, 75 unchanged, 36 exempt/preserved. No outstanding wording approval or GA-side blocker. The earlier stopped transformation had a page/record consistency failure before writing; corrected and rerun. The full package supersedes the partial GA-154 handoff, including the actual Discussion Room vote location.

## Source files and commits
- docs/specs/current/localization/GAL_Castle_Escape_Text_Catalog_V1.0.csv — df001a386177f0386fe3887fa670fd42ec33dcbe
- src/content/localization.generated.js — 8909cc1d053e2f3c97c7e039c8ca15165fcd8427
- docs/specs/current/localization/GAL_APPROVED_RUNTIME_PAGE_TEXT_V1.csv — 2dfc5f21ea3afdb8e7ccac83e5c8d2376c2e8a30
- src/content/runtime-page-text.generated.js — bb73df62d48028dec98a90190a7a9e3f3bc286b6
- docs/reports/remediation/ui/GA_RUNTIME_ACTION_INDICATION_AUDIT_20261127.csv — 1d870480fa97b28c201068c49deb2fe53e36941b

The last file is the exact consumer matrix (all 216 role pages plus seven live events; original/current/final CN/NL, phase_key, trigger_outcome, old source, final canonical source). Existing historical GA_CA344 manifest is retained as the phase/trigger reference, not an override of updated text. For an applied Page-ID row use the updated resolveApprovedRuntimePage(role Page ID), not the previous shared key. 64 page text keys map 159 role Page IDs; 352 localization catalog keys. Do not indiscriminately replace shared artifact or Action label keys. Unchanged/exempt rows retain their existing sources and timing. All ACT14 locked text unchanged.

## Consumer integration, one batch
- ACT1 consequence Pages 002–005: actual current renderSprint3b provides Continue, not a new investigation. Use exact role and choice, including Anna check_phone Page 004 (previously omitted from act1RuntimePage selector). Gitte number note/flashlight and Linda watch retain role-specific clues; wrong draft carryover removed. Opening and weak signal are separate.
- Route Pages 012–016: existing available continuation/foldback controls; don't invent a route selection. Preserve sign vs library scene timing. Library Page 017 locked only; hint Pages 018–025 exact fallback stage and actual locked prefix; input remaining digits, no code request after resolution. Render hint once in Runtime.
- ACT4 Page 026 act04-05.002 only at unlocked private route choice; no reveal of other players' private choices. Remove duplicated Scene caption per Teacher. Page 027 act04-05.009 discussion only; preserve narrative in Runtime, remove duplicate Discussion narrative. Formal ballot key act04-05.runtime.group_ballot_open only when actual vote controls available (current renderVote uses Discussion Room voteArea; canonical wording corrected from Action to Discussion Room). After own submission use waiting/locked status, not repeated vote prompt. act04-05.runtime.no_majority only confirmed completed 1:1:1, before reopened vote; never 2:1. No vote calculation changes.
- LIVE-RESTORED-SIGNAL: runtime.signal.restored_messages when incoming messages really delivered and composer open; runtime.signal.restored_no_messages when chat open without incoming messages. Do not imply photo sharing before Library reunion.
- ACT6 retain first-audible/returning intro and acknowledgement separately. After intro ack and actual discussion open append runtime.portrait.discussion_guidance to act06.001. On actual ballot open use runtime.portrait.vote_open. On answer select exact Page 031–035 using authoritative answer key (008→031, 006→032, 007→033, 009→034, 010→035), prefix portrait answer once, don't reinsert intro or hardcode one answer. Preserve advance control. LIVE-ACT6-PORTRAIT-ANSWER matrix row is a reference to these 15 role-specific entries, not an extra duplicated message.
- ACT8/9/10/11/12 use exact phase and feedback signature in audit. ACT9 048 only genuine wrong step1 majority, retain act09.022 “门没有反应。” and retry guidance; 049–050 actual corresponding failure only. Keep clue privacy and vote rules. 054/055 ACT10 result uses available Continue. 056 discussion then allocation; only choose on actual allocation phase. LEAVE branch runtime.act11.leave_key_guidance once, not duplicated with 056; C station when gold_key=false and WATCHER when true per existing logic; no ownership/gameplay changes. runtime.act11.wrong_key_voice only exact act11.010 event, not generic failures; wait or follow actual available instruction, no fabricated reallocation. Page 060 cinematic stage1 wait, no fictitious Action. Preserve all subsequent auto/locked timing.
- runtime.action.accepted_waiting replaces existing acceptedWaiting English visible status only when actually accepted and locked; maintain progress and diagnostic errors separately.
- General: for actual action not available yet show wait, no invented buttons or premature instruction. Existing action/scene/pocket technical implementation remains CD/CA. Preserve source order and original narrative; no SQL/state redesign. Where Page-ID resolver isn't wired (route consequences, box hints, portrait answers, several sprint6 feedback paths), extend existing selector minimally rather than adding architecture.

## QA and ownership
Re-read all five remote files after writes: 223 unique IDs; 19 columns, no ragged records; 110 applied entries directly matched canonical bilingual values; remaining two live entries are composed portrait intro and actual-answer branch reference, with their component/branch guards above. 64 unique page keys /159 unique known IDs; catalog 352 unique keys; generated page text, ID mapping, role/phase scope and catalog all exact parity with source serialization. Existing generator logic reproduced in connector execution (no local Node execution). CSV roundtrip checked before commits. No production writes or browser execution. Actual consumer wiring and integrated browser tests remain CD tasks, not a GA manuscript blocker.

Transfer full implementation ownership to CD via CA's consolidated source queue, with CA review and separate Teacher production go. No new Teacher copy approval required. GA is available only for concrete semantic conflicts from integration. Please proceed with existing CA357/CA359/CA361 coordination; do not wait for another GA manuscript approval.
