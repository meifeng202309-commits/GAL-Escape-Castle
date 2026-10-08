# CA Round III — Domain-Published State / Passive Observer: Concrete Solutions & TOP Recovery V1.0

**Date:** 2026-10-09  
**Owner:** CA, incorporating explicit Teacher decisions  
**Status:** DRAFT FOR INDEPENDENT GA AND CD RED-TEAM REVIEW — NOT IMPLEMENTATION AUTHORIZATION  
**Upgrades:** `docs/plans/CA_ROUND_II_DOMAIN_PUBLISHED_STATE_OBSERVER_COST_GATED_PLAN_V1.0.md`  
**Supersession rule:** Round II's cost-gated hybrid sequencing and narrow-domain ownership remain unless specifically revised below. Round III adds concrete Teacher decisions for state publication, transitions, UI responses and overrides. This does not purport to amend canonical V4 script, freeze database authority, release CD HOLD, or verify deployed SQL.

## 1. Nonnegotiable intended boundary

- **Owning game-domain code determines and publishes gameplay facts.** Where an existing display field is ambiguous, CD identifies actual responsible production code and whether an existing owned fact is already available. If necessary, GA specifies gameplay meaning from canonical V4; CD adds a narrow *read output* in the owning module, avoiding a new persistently dual-written field unless semantics require a genuinely new fact.
- **Observer is passive:** no gameplay state inference, phase arbitration by guessing, vote resolution, next-ACT decisions, or command authorization. It may authenticate, route according to a server-published owner identity, validate response identity, reject stale responses and restrict data to the viewer.
- **Minimal runtime coordinator**, if needed for coexistence of S3B/S5/S6 prepared/current rows, is server-owned and approved by GA; not an Observer heuristic. No broad Resolver, second persistence truth or universal gate table.
- **Cost-first debugging:** retain Round II Gate A local polling correctness, Gate B scoped S7 W05 location publication, Gate C domain mutations/recovery, Gate D *measured* decision whether a shared context API is cheaper; no blanket prerequisite architectural rewrite.

## 2. Confirmed Teacher semantic decisions

### 2.1 ACT transitions and progress facts

- Teacher approved the **intended gameplay semantics** of the ACT1→2, ACT2→3, ACT4→5, ACT8→9, ACT10→11, ACT11→12, ACT12→13 conditions in the annotated transition table, **not** their as-implemented SQL. Every current effective function and its concurrency/round/commit condition remains CD verification work.
- ACT5→6: different route branches may converge in Portrait Hall; report each player's **entered / not entered**; ACT6 opens under existing server-owned all-required-player barrier, not mere S5 row existence; do not add per-ACT persistent ready flags by default.
- ACT6→7: four preapproved multiple-choice questions with fixed corresponding responses, not unrestricted gameplay question submission. Verify server allowlist.
- ACT7→8: Teacher opens voting when pedagogically ready; no automatic Discussion expiration in NORMAL.
- ACT13→14: Teacher did not object to proposed automatic post-cinematic transition and server-owned finalization, but **confirm the finalization and reconnect semantics against V4 and running engine before treating as authorized implementation**. Avoid falsely marking integrity VERIFIED.
- ACT3→4: one server-accepted puzzle attempt at a time; reject/ignore concurrent requests during a three-second feedback window. Define ordering by server acceptance/transaction serialization (do not trust client timestamp), ensure idempotent resend doesn't count as a new attempt and correct prior resolution does not regress.

### 2.2 Teacher operational-location display (W05)

Publisher, not Observer, exposes player-specific observable facts:
- ACT1: **in start room / left start room**.
- ACT2: **en route to selected destination**; after actual server-confirmed sign/route acknowledgment: **saw Library sign; changed destination; en route to Library**.
- ACT3–5: **at Library**, subject to genuine scene/role consistency.
- ACT5→6: **entered Portrait Hall / not yet entered** per player.
- ACT6–10: shared current scene.
- ACT11–12: per-player station assignment and current station progress (same Main Gate area).
- ACT13–14: shared escape/ending scene.
Prefer reuse of existing `FOLLOW SIGN` action / its authoritative acknowledgement; no second equivalent button unless current contract truly lacks a server-confirmed fact. *Displayed* sign and *confirmed* sign are not identical evidence.

### 2.3 Display concrete actions rather than generic WAITING

Teacher sees exact last committed action and its current interaction identity/round, such as `Linda submitted ACT7 round-2 vote`, `Gitte entered Portrait Hall`, `Anna followed Library sign`, `Gitte engaged station A`. Do not infer from a stale client button. A passive old frame may remain with explicit STALE/UNKNOWN, but no stale enabling of mutating controls.

### 2.4 Teacher-paced discussion and the unified result presentation

- In NORMAL mode, **Teacher's existing Open Vote control** is the explicit transition from free discussion to voting. No auto-close after 90/180/300-second discussion timers; Teacher may issue oral pacing instructions off-platform. Voting validity and player-submission rules remain server-owned.
- Three submitted votes → server calculates a round result; **all Player screens show one prominent three-second result presentation, Teacher screen also shows result**. Applies equally to majority, tie/no consensus, and majority-but-wrong puzzle action. The **presentation** is standardized; the **server action semantics are ACT-specific**.
- Tie is not a wrong attempt. For ACT7: no clock touched, discussion reopens until next Teacher-initiated vote; repeat until majority or authorized Teacher recovery. For ACT9, majority selecting wrong door order receives a three-second `door did not open` message and returns to fresh action/round; a 1:1:1 tie is `no consensus, no door action` and is distinct from wrong door. In each case preserve round identity and real submissions.
- Three-second display is **not blanket prohibition on unrelated message/connection/Teacher emergency processing**. Where Teacher specified a cooldown for group-action input (ACT3 password), enforce it on server; elsewhere presentation delay alone must not accidentally create a second unsynchronized server timer. Decide and document what happens on refresh mid-feedback.

### 2.5 ACT3 Library five-digit code: concurrency

Teacher specifically requires: only first server-accepted attempt is evaluated; reject/ignore later attempts for three seconds; center-screen success/failure for Players and Teacher (Teacher may use same centered overlay to avoid layout work); Teacher orally coordinates one responsible player. Use transaction/serialization/idempotency, not browser clock or client-only `disabled`. Investigate existing puzzle fallback and whether 90-second auto hint clashes with feedback/cooldown. This is a **new behavior requirement**, not proof the old code supports it.

## 3. TOP — Teacher Override Point, per-ACT start, and backup_story

### 3.1 Teacher's goals

- Primary triggers: bug blocks gameplay; class time requires skip. Additional causes may be added after testing.
- Design **ACT-start TOP checkpoints** as primary recovery destinations; repeated Override can advance to next TOP, applying each skipped ACT's minimal recovery contract in sequence. Each transition records Teacher actor, source and destination TOP/ACT, time/reason, and provisioned resources/decisions.
- GA designs `items_must_obtain_of_ACT_n` **per role and conditional branch**, with required physical items and all story-required durable clues/memories available at that target ACT; do not blindly grant mutually exclusive branch effects. Teacher states **all acquired clues remain permanent/reusable**, but previously undiscovered clues remain hidden absent legitimate progression or explicit recovery grant.
- GA designs `backup_story_for_Gitte/Anna/Linda` per ACT where necessary: minimal continuation **outcomes** for missing choices/votes/scene prerequisites; preserve every available real server-committed input as primary evidence. For missing speech use `no_record_before_override` as absence annotation, not invented dialogue. Because a player may have clicked but the server did not record (network loss), label `no confirmed server record` rather than falsely `never acted`; if a client-side unconfirmed attempt is available distinguish it, but it cannot count as authoritative accepted submission.

### 3.2 Teacher's explicit decision: **Option B**, no synthetic player votes in canonical voting tables

Teacher considered inserting explicitly marked virtual ballots but **chose Option B** to reduce uncertainty:
- Reuse/extensively constrain the **existing server-authorized Teacher Override recovery** path.
- Publish a **system/Teacher-authorized recovery outcome** for gameplay continuity rather than inserting fabricated normal Player votes.
- Real votes/choices/messages remain exactly as recorded, including partial valid input before Override. Missing speech records an explicit absence/uncertainty reason; no invented player content.
- Recovery must preserve proper canonical state, avoid duplicate event emission, initialize next stage, close/cancel incompatible discussions/timers and remain idempotent/replay-safe.
- Evidence provenance and behavior analysis distinguish `player_real` from `teacher_override_recovery` and identify the bypassed interaction/ACT; do not silently mark skipped Behavior features complete.
- The proposed TOPs are **design checkpoints**, not merely changing `act_no` or blindly invoking next ACT initializer. CD evaluates complexity and which already-existing safe override allowlist actions can be used. If an ACT-start TOP is unsafe without excessive fabricated history, return a precise exception to GA/Teacher for approval rather than inventing implementation.
- Do **not** create a second unguarded override mechanism or universal automatic `all possible items` grant.

### 3.3 Explicitly unresolved details for adversarial review

- Whether a **single** existing Override operation may jump to next ACT start while maintaining transactional invariants, or whether only existing allowlisted local interaction deblocks are safe; quantify the implementation/test costs for 13 start checkpoints.
- Resource grant conflicts: optional flashlight, Silver Key owned by Linda, Golden Key TAKE/LEAVE, shared vs personal items, branch-linked knowledge. GA must specify minimal target-necessary facts, not all possibilities.
- Replay and history consistency when a late real vote arrives after Override, or a client reconnects from a skipped interaction; protect against fake player activity, duplicated events or retargeted stale requests.
- Whether repeated jumps must advance through each checkpoint one at a time or can compute a composition; Teacher currently requests consecutive next-TOP, not an untested arbitrary target jump.
- Integrity/export semantics: preserve verified evidence where present, annotate skipped ranges and `invalid_teacher_override` / appropriate reason, do not force false `session_integrity_verified=true`.

## 4. Ambiguous game semantics — uniquely labeled Teacher adjudication worksheet

Teacher asks CD to collect unresolved *game-semantics* cases in a single Markdown or CSV table with **exact four columns**:
1. `序号`
2. `唯一占位标识`
3. `前后场景及状态不清楚的具体原因`
4. `教师回复（待填写）`

For each actual ambiguous case, CD writes a stable, unique identifier such as `UNRESOLVED_ACT05_06_ENTRY_001`, cites its code source/function and the competing possible behaviors **inside column 3**, and leaves Teacher reply blank. No invented filler cases as confirmed bugs. Duplicate questions should be merged; engineering bug/traceable Authority facts are CD/CA work, not sent to Teacher to decide. **Placeholder is a documentation locator only**, never a server field, a deployed magic value, or a UI fallback. GA validates Teacher answer against V4, updates approved gameplay requirements, CD implements after scope authorization, CA tests.

## 5. Revised cost / responsibility matrix

| Scope | Default lowest-cost choice | Hard boundary |
|---|---|---|
| Existing Player polling overlaps/error-as-inactive | targeted `app.js` correction | no engine rule reinterpretation |
| W05 operational location | domain-owned S7 Teacher read projection using existing confirmed facts | no giant central resolver / stale S3B location for later ACTs |
| Current state label/last completed action | owning-domain read output where needed | Observer does not infer game rules |
| ACT3 single-attempt cooldown | bounded authoritative puzzle mutation + response projection | DB/server owns concurrency, not client timers |
| Teacher-controlled Discussion opening votes | scoped existing Discussion/S5/S6 server refactor | no TIMER auto-close in NORMAL |
| Three-second group-result display | reusable UI presentation component consuming server-committed result/interaction ID | no UI-decided winner/tie/wrong |
| TOP + backup_story | design first; controlled extension of authorized Teacher Override | no fake ballots, no invented Behavior |
| Legacy RPC/Knowledge/history/integrity/assets | owning domain direct fixes | Observer does not fix source data |
| Shared UI Context Facade | **optional** only after measured >1 consumer need | runtime owner/identity only; no universal gate engine |

**Implementation sequencing suggestion (not authorization):**
1. CD/GA do read-only feasibility and script/owner mapping; independently challenge this proposal.
2. After bounded approval: client polling safety; S7 W05 shadow/location; scoped Teacher-paced Discussion and ACT3 result feedback; minimal reusable result presenter; existing direct W03.
3. GA specifies all 13 ACT-entry contracts and backup_story; CD independently costs the reuse of current Teacher Override without blanket coding.
4. Before new Player/Teacher UI cutover, gate on exact source outputs, same-frame validity, Teacher/Player privacy, rollback and E1-equivalent tests.
5. Only if remaining cross-domain runtime arbitration demonstrably costs more than a small shared identity facility, approve that facility.

## 6. What this does not solve (must remain visible)

- Wrong or undefined canonical state and incomplete deployed schema/functions/grants/Authority discrepancies.
- Real gameplay write defects, concurrency/idempotency, stale cross-RPC context/detail reads, unavailable presentation row.
- Legacy executable `s1_submit_private_choice`; required security quarantine.
- Historic Knowledge/Observation provenance and missing confirmed data after network failure.
- Finalization/export proof and partial-invalid behavior evidence under Override.
- Media/asset activation and real browser loading, responsive UI, anchors, audio autoplay restrictions.
- Perf/load of new Teacher read projections and result overlays.
- Cost of building every ACT TOP and branch-complete backup_story; cannot promise low complexity without CD function-level estimate.

## 7. Independent critical-review instructions (no consensus bias)

**GA** — Start from canonical V4 and the Teacher's annotated 13-transition replies, **not** this solution as a presumed good design. Find contradictions in ACT entry/exit semantics, branch and role resource requirements, per-ACT Teacher-paced Vote exceptions, timeline of three-second feedback, TOP positions, behavior validity, privacy and script compatibility. Propose a **cheaper counter-design** if possible. Label each finding BLOCKER / MATERIAL / MINOR and give exact ACT, expected gameplay, and evidence. Challenge simplistic `items_must_obtain_of_ACT_n`, any invented backup_story choice and the assumption that all 13 ACT starts are safe TOPs.

**CD** — Start from the currently active DB functions + JS callers and deployed evidence, **not** the conceptual flow. For each demanded change, identify reused vs altered active functions, trigger/permission/idempotency/transaction impact, old response contracts, frontend changes, required tests and rollback costs. Independently challenge whether proposed cooldown/result synchronization across all viewers is inexpensive or whether the existing Teacher override can support NEXT-TOP. Seek concrete lower-cost alternatives. Do not implement. Rank BLOCKER / MATERIAL / MINOR and quantify rough cost without concealing safety gates.

**CA** — Independently reconcile discrepancies and recommend only **small bounded implementation packages**, not a combined full rewrite. General CD HOLD remains in force; all releases require distinct authorization. GA and CD should return independent responses rather than mutual affirmation.
