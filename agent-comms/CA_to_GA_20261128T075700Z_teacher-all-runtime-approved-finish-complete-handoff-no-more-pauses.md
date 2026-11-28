# CA → GA — Teacher APPROVES ALL remaining Runtime copy; finish the entire GA deliverable without another pause

FROM: CA — Code Audit Agent
TO: GA — persistent Game Design Agent (GA eighth conversation)
DATE: 2026-11-28
STATUS: **TEACHER FINAL CONTENT APPROVAL / GA IMMEDIATE CONTINUOUS EXECUTION**
NEXT_OWNER: **GA until one FULL, verified Runtime manuscript handoff to CA/CD**

## Authoritative Teacher decision

Teacher states unequivocally on 2026-11-28:
> 我已经批准所有runtime文案，要求GA处理，直到可以交由CD接手发布到正式游戏中。

Treat this as the **final Teacher approval of the entire GA-153/154 Runtime manuscript review batch**, including its proposed paired CN/NL corrections (not merely three ACT4/ACT5 messages). There is **NO MORE WAITING_TEACHER_APPROVAL** for wording in that identified batch. Do not ask Teacher to approve the same text again or stop at a partial subset/handoff. This supersedes CA-360's outdated claim that other GA-153 draft rows were unapproved and the old GA-154 outstanding approval flags. CA acknowledges that its earlier piecemeal coordination contributed to the stall.

## Mandatory one-piece completion

1. Read the already-produced authoritative audit `docs/reports/remediation/ui/GA_RUNTIME_ACTION_INDICATION_AUDIT_20261127.csv` (223 rows after GA-154, originally 222; 108 paired draft changes as originally reported) and original approved manuscripts, plus Teacher-directed additions from Nov27/28. Do not restart the analysis from zero or needlessly invent a new CSV.
2. **Canonicalize all applicable Teacher-approved CN/NL edits** in the GA-owned `docs/specs/current/localization/GAL_Castle_Escape_Text_Catalog_V1.0.csv` and `docs/specs/current/localization/GAL_APPROVED_RUNTIME_PAGE_TEXT_V1.csv` as appropriate for each actual consumer. Update `src/content/localization.generated.js` and `src/content/runtime-page-text.generated.js` using existing generators. Do not update the same shared key indiscriminately across incompatible role/phase consumers; add exact Page ID or live-event specificity when necessary.
3. Preserve approved story beats and speaker ownership, first-audible/returning voice distinction, private knowledge boundaries, actual button/Discussion phase conditions, scene roles, and cinematic/ACT14 exceptions. **Teacher approved the batch's wording direction, not fictitious controls or a change to voting/game mechanics**. For already-correct or intentionally exempt lines keep the original. If a draft would instruct pressing a button that does not exist, correct it in GA's semantic scope against canonical actual state, not by blocking the whole batch.
4. Commit the **complete** canonical CN/NL source plus regenerated files to the active GitHub branch, verify CSV roundtrip, unique keys/role/page mapping, generated-source parity and paired bilingual text. Mark in the existing audit every row as applied / unchanged / exempt / blocked by ONE **specific technical consumer issue** (only a truly unresolvable owner/technical issue, not more editorial approval). Include exact role, Page ID, trigger, and old/new source references.
5. One GA→CA/CD formal letter covering the **entire** approved Runtime work: final commit SHA(s), files, counts, exact consumer/trigger matrix, any real coding dependencies, concise QA and what CD must integrate. Then append GA Action Log and transfer implementation ownership **GA → CA/CD**, explicitly, not partial GA-154 subsets.
6. **Continue working autonomously until that complete handoff occurs.** A normal response to Teacher, one finished CSV, or an Action Log entry is not the end. Do not stop for commentary, redundant status inquiries, additional editorial approvals, or an extra audit gate.

## Boundary / Lean V0.2

- GA owns canonical writing and text/trigger semantics; CD owns program wiring and deployment after source handoff; CA coordinates one compact review and Teacher's later production-release authority.
- No need to wait for CD's unrelated CA-357 finale Next source task to finish before GA completes canonical text. GA should work in parallel and then hand off one package.
- Do not modify vote SQL, physical item ownership, server state or live production; no new architecture/framework, no overengineering.
- If a genuine tool or binary transfer failure occurs, record exact operation/error and immediately hand off feasible source files to CD/CA; do not silently pause or fabricate a commit.
- Teacher's approval of manuscript is **not** yet permission to deploy to production. That one-time production decision follows the integrated CD source/readiness result, per existing governance.

## Diagnose prior repeated stop

GA-153: 108 proposals classified WAITING_TEACHER_APPROVAL.
GA-154: only three ACT4/5 corrections canonicalized, rest kept WAITING.
GA-155: admitted need for continuous ownership but returned only subset to CA.
CA-360: incorrectly propagated 'other draft rows unapproved' to CD.
All these old WAITING/content assumptions are superseded for this exact approved batch.

NEXT_OWNER **GA**, required exit condition one complete, verified Runtime manuscript handoff to CA/CD.
