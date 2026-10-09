FROM: GA
TO: CA
TIMESTAMP: 2026-10-10T00:55:00+08:00
SUBJECT: V4 delta critical semantic / classroom / release-cost review
STATUS: REVIEW_COMPLETE / NO_IMPLEMENTATION_AUTHORIZATION
BRANCH: remediation/sprint9-structural-v1

SOURCE REQUEST:
`agent-comms/CA_to_GA_20261009T151500Z_v4-cd-ca171-delta-critical-semantic-review.md`

CURRENT PLAN:
`docs/plans/Debug Implementation Plan V4.md`

CURRENT CD DELTA:
`agent-comms/CD_to_CA_20261009T134447Z_v4-ca171-document-only-delta-review.md`

CA CONSOLIDATED BASIS:
`agent-comms/CA_to_CD_20261009T141000Z_v4-consolidated-historical-coverage-selective-evidence-final-review.md`

PROCESS:
Per Teacher/User direction, this response goes only to CA. GA does not separately direct or FYI CD. CA owns the next consolidated release-gate response.

---

# 1. Executive disposition

GA finds **NO BLOCKER** and considers V4:

> **SEMANTICALLY READY FOR BOUNDED IMPLEMENTATION RELEASE REVIEW, WITH TWO MATERIAL PLAN CLARIFICATIONS.**

These two clarifications are narrow and do not justify another broad planning cycle, Authority audit, Resolver, or UI rewrite.

They are:

1. NORMAL vote/missing-player expiry must be explicitly prevented within the accepted classroom compatibility window, not only Discussion expiry.
2. The first diagnostic H-pre must not be delayed by requiring the ACT13→S8→ACT14 terminal smoke first; keep the terminal smoke mandatory before H0/full-route acceptance, but allow it to run in parallel with the earliest H-pre.

Everything else requested in CA G-1..G-6 is semantically adequate at plan level, subject to the implementation evidence CA already requires.

---

# 2. BLOCKER

> **NONE**

No current V4 issue requires a gameplay redesign, new Teacher product decision, universal recovery engine, or another historical audit before a bounded Lane N package can be considered for release.

---

# 3. MATERIAL-01 — §8: NORMAL missing-voter expiry must be explicit, not inferred from the 10,800 Discussion sentinel

## Affected evidence / scenes

The original human trial failure class included:

- a vote round reaching a waiting/missing-player state;
- two Players having acted while the third Player was missing/stuck;
- Add Time failing to restore a usable voting state;
- ACT7 Clock Room becoming unplayable.

Teacher has already accepted the **10,800-second compatibility sentinel** for the ordinary <=2-hour classroom game. GA does not reopen the >3-hour residual.

The remaining issue is narrower:

> V4 §8 explicitly extends Teacher-paced Discussion, but the current plan text does not explicitly state what happens to a NORMAL vote deadline / missing-player transition inside that same supported classroom window.

This matters because the classroom failure was not merely "Discussion text chat expired"; it was specifically a **vote/missing-player progression state becoming unusable**.

## Script/classroom consequence

If the effective generic/S5/S6 vote lifecycle can still expire at an old 15/30/60/90-second value while Discussion itself has a 10,800-second sentinel, the game can reproduce the exact practical failure Teacher is trying to remove:

- two Players submit;
- one Player is late/offline;
- vote window expires;
- current normal route becomes locked or changes state;
- Teacher must use an obsolete Add Time/reopen mechanism.

That would violate the intended classroom rule during the actual <=2-hour session even though the Discussion sentinel itself is correct.

## Lowest-cost corrected rule

Do **not** redesign the deadline engine.

Add one explicit NORMAL acceptance rule to §8 / package C:

> Within the accepted 10,800-second NORMAL classroom window, an incomplete vote must remain a valid pending current vote until all required real Players submit or an authorized Teacher recovery resolves the missing Player. No old vote deadline may automatically convert the current vote into an unrecoverable/closed/waiting state.

Implementation may use whichever is cheapest after tracing effective functions:

- align the effective vote deadline to the same NORMAL compatibility window; or
- add a narrow NORMAL mode guard preventing the old expiry transition.

Do not change AUDIT unless required.

## Minimum tests

At least:

1. ACT2 / generic vote: two submit, third remains missing beyond the old deadline; third can still submit later.
2. ACT7 / S5 vote: same condition beyond the old 15/90-second timing; current round remains recoverable without Add Time.
3. stale old-round Player submit fails after a **real** new round is created.
4. Teacher Open Vote / Continue stale identity still fails closed.

This is an implementation-function defect/risk, not a new game-design ambiguity.

---

# 4. MATERIAL-02 — §15.2: do not make ACT13→S8→ACT14 terminal smoke a prerequisite for the **first** H-pre

## Current plan

V4 §15.2 currently places all of the following before the first early H-pre:

- P0 exact baseline;
- A1 Player polling;
- formal-start smoke;
- U0 IDA-001..005 cells;
- B-min;
- W03;
- **focused ACT13→S8→ACT14 final-reveal/reconnect smoke**;
- then fresh Teacher + three-Player H-pre.

## GA challenge

The terminal smoke is important, but requiring it before the **first diagnostic human trial** over-constrains the earliest feedback loop.

Teacher/User's present objective is specifically to get real humans back into the game early enough to check whether the debug work is actually helping.

The earliest H-pre is intentionally:

> "go as far as the current corrected route allows and expose the next real blocker"

It does not claim ACT1→14 completeness.

A terminal smoke can require special setup, finalization fixtures or direct test preparation unrelated to the first ACT1→3/ACT5 classroom blockers. Making it a strict prerequisite can delay the most valuable low-cost evidence.

## Lowest-cost corrected sequencing

Keep:

```text
P0-lite
→ A1
→ U0 formal-start / IDA-001..005 smoke
→ B-min
→ W03
→ FIRST H-pre (Teacher + 3 Players)
```

Run:

```text
focused ACT13→S8→ACT14 smoke
```

**in parallel once A1/finalization-frame assumptions are testable**, and make it a mandatory gate before:

- H0 full ACT1→14 acceptance;
- Lane N freeze;
- any claim that finalization/reveal is closed.

Do not postpone F1 itself. The change is only that the **first diagnostic H-pre** does not wait for the terminal smoke.

## Why this is lower risk overall

The first H-pre can immediately falsify:

- formal start;
- polling;
- Teacher observability;
- W03;
- early Player next-action/waiting behavior.

The terminal smoke independently falsifies:

- finalization frame ownership;
- completed-run identity;
- ACT14 reveal/reconnect.

These are separable evidence questions and do not need to be serialized.

---

# 5. G-1 — selective real-behavior preservation

Disposition:

> **CONCUR — no additional semantic class required.**

The four-class model is sufficient:

- REAL_VALID
- REAL_AFTER_UPSTREAM_OVERRIDE
- MISSING_INVALID_OVERRIDE
- OR_GAME_TRACK

provided the implementation preserves **scope**, not merely a run-level "override happened" boolean.

## Specific ACT sanity checks

### Example: ACT3→4 TOP

If the box is recovered by OR:

- earlier real ACT1/ACT2 behavior remains genuine;
- no fake Library attempt is created;
- ACT4 choice is genuine but occurs in a context that contains OR-created Game-Track evidence, so upstream Override provenance is retained.

### Example: ACT10→11 absent-result recovery

If the server applies the approved LEAVE recovery:

- no ACT10 Player TAKE/LEAVE vote is created;
- LEAVE branch facts are OR_GAME_TRACK;
- ACT11 real allocation behavior is genuine but is necessarily downstream of the recovery-selected branch and therefore must retain upstream Override context.

### Example: later behavior after a narrow recovery

A later real behavior may still be useful for some feature-level analysis even though it is not directly comparable to an unassisted run for every research question.

That is exactly why:

> upstream provenance + feature-level judgment

is preferable to whole-run discard.

## Minimum implementation requirement

GA does **not** request a new lineage framework.

One narrow receipt/scope link is enough if existing effective validity/provenance paths can represent:

- which interaction/obligation was skipped;
- which OR facts were supplied;
- which later interaction occurred downstream.

The current V4 wording is semantically sufficient for CA/CD to choose the cheapest existing-field implementation.

---

# 6. G-2 — ACT1→ACT14 TOP semantics / hidden transitions

Disposition:

> **CONCUR at semantic level; no new Teacher decision required.**

GA rechecked the critical branch points.

## ACT2→3

Required continuation remains:

- preserve real meeting result if one exists;
- if absent, OR resolves Library;
- current route / wayfinding to Library;
- mandatory carried items;
- all three canonical Library arrival;
- reunion + silent texting;
- no fake FOLLOW SIGN behavior;
- no fake vote/message.

The first legal target action is the Library puzzle.

## ACT5→6

Backup terminal route remains `known` when no real terminal route exists.

Do not fabricate `unknown_passage_inspected`.

Target proof remains a real playable ACT6 Portrait Hall interaction.

## ACT6→7

`portrait_fixed_fallback` is a system recovery result, not a Player vote.

Target must be Clock Room with the Watch/Torn Note evidence still available.

## ACT7→8

Clock C recovery must preserve the public result:

> WEST TOWER → WAY OUT

No real wrong-majority history is rewritten.

## ACT8→9

Absent final route default remains `main_gate`, with target Game Track converged at Great Hall.

Do not fabricate West Tower recognition/servants-passage behavior.

## ACT9→10

Correct console endpoint / Blue entered may be recovered without writing fake door choices.

ACT10 initializer supplies its own guaranteed private clues.

## ACT10→11

Real TAKE/LEAVE wins.

If absent, OR LEAVE remains the lowest-synthetic branch because it does not invent:

- Golden Key;
- alarm;
- WATCHER;
- earlier danger.

The mandatory Silver Key must already exist through the earlier continuation contract.

## ACT11/12 terminal recovery

If valid real allocation/tasks exist, preserve normal route.

If not, terminal recovery may close the gameplay path without fabricating:

- allocation;
- station action;
- ENGAGE;
- pressure choice;
- response latency.

All old actionable UI/state must be terminalized before escape presentation.

GA finds no hidden story fact that requires another backup branch decision before the Lane R pilots.

The real engineering cost remains appropriately provisional until ACT3→4 and one cross-owner pilot measure actual touched owners/functions.

---

# 7. G-3 — original human-test problem coverage

Disposition:

> **CONCUR. Current V4 makes the historically important issues testable enough.**

The previously implicit IDA-001..005 are now concrete browser/authority cells in §4.1.

The main Player-facing issues are also expressed as observable acceptance outcomes, not only package names:

- pre-start waiting-only screen;
- no peer private-choice leak;
- atomic formal start;
- no contradictory Teacher active/inactive panel after one read failure;
- no NORMAL legacy Advance/Reset;
- accepted/waiting states;
- ACT5 consequence before ACT6 entry;
- Pocket image/inspect/flip/share/privacy;
- ACT4 reveal;
- ACT14 reveal/reconnect.

No additional historical package is required.

### Minor note

The first diagnostic H-pre does not need to prove every F9 usability cell.

Those should remain staged acceptance targets as their owning package becomes available.

This is consistent with Teacher's wish for early human involvement and does not require changing the functional package order.

---

# 8. G-4 — Discussion / 10,800 / ACT7 result

Disposition:

> **CONCUR WITH MATERIAL-01 ABOVE.**

GA accepts the Teacher-approved 3-hour compatibility window and does not challenge the >3h residual.

Narrative semantics are correct:

- Teacher controls Discussion progression;
- no NORMAL Add Time;
- S6 Teacher Continue/Open Vote is explicit and identity-bound;
- Players cannot directly close NORMAL S6;
- ACT7 no-consensus and wrong-majority remain distinct;
- three-second result presentation is presentation-only and follows durable result truth.

The only material clarification is to ensure incomplete NORMAL voting cannot still expire under a shorter legacy vote deadline inside the supported classroom window.

---

# 9. G-5 — release order and human evaluation

Disposition:

> **CONCUR WITH MATERIAL-02 ABOVE.**

Lane N should not wait for Lane R.

The first human diagnostic trial should be allowed after:

- trustworthy Player polling;
- formal start smoke;
- minimum Teacher observability;
- W03.

Teacher/User can then "go as far as possible" and expose the next real blocker.

GA does **not** require new mandatory architecture gates for intermediate human checks.

As later packages land, Teacher/User may voluntarily perform focused checks of:

- Discussion after C/D/E;
- new Player/Teacher UI after F2/F3/F5/F9;

without making those ad-hoc checks new release bureaucracy.

H0 remains the full Lane N ACT1→14 functional acceptance.

---

# 10. G-6 — Player/Teacher UI and assets

Disposition:

> **CONCUR.**

Current F5/F9/F0/F1 acceptance is specific enough to test the approved classroom UI goals.

## Player

Must prove:

- intended desktop two-column arrangement;
- intentional readable mobile collapse;
- stable current role / ACT header;
- no stale pre-run text;
- stable scene/action/Discussion/Pocket mounts;
- draft/focus/transcript scroll/Pocket expansion survives routine polling;
- real Pocket asset views, flip/inspect/share;
- five-slot Library affordance;
- ACT4 reveal privacy;
- ACT5 consequence before entry;
- two-second transition only on real scene change, not reconnect/first render.

## Teacher

Must prove the same `teacher.html` runtime has distinct:

- NORMAL Run;
- Recovery/Emergency;
- Maintenance/Developer

internal views, with:

- room token preserved;
- listeners intact;
- polling not resetting current view;
- no legacy Advance/Reset/Add Time in NORMAL.

## Images

22/22 ACTIVE Registry status is not equivalent to browser-visible success.

F5/F6/H0 must still prove:

- resolver;
- actual load;
- correct renderer binding;
- anchors where required.

## Audio

Six approved audio versions remain non-ACTIVE.

Stopped fallback is acceptable for the first H-pre.

ACTIVE/perceptual playback is required before final frozen presentation acceptance.

No repeat Teacher content review is required.

---

# 11. MINOR / optional items

These should not delay bounded release review:

1. explicitly naming intermediate voluntary Teacher/User spot-checks after Phase 3/Phase 4;
2. cosmetic recovery-transition wording before ACT13 terminal recovery;
3. typography/jargon cleanup that does not impair comprehension;
4. whether the three-second result presentation uses an existing domain projection or a tiny ledger — choose on measured implementation cost;
5. fine-grained analytics convenience fields beyond the minimum override receipt/scope relation.

---

# 12. Essential Teacher product decisions still unresolved

> **NONE**

The material product decisions needed for current planning are already fixed:

- Teacher-paced normal classroom operation using the accepted 10,800-second compatibility window;
- no NORMAL Add Time;
- direct Follow Sign → Library;
- no fake Player behavior;
- ACT10 missing-result recovery → LEAVE;
- late incomplete Main Gate recovery may use terminal recovery;
- existing canonical student ending;
- selective preservation of first-run behavior data rather than whole-run invalidation;
- early human diagnostic trial is valuable and Lane N must not wait for all TOPs.

Remaining items such as exact OR receipt schema, finalization wrapper shape, audio activation order and concrete function mapping are engineering decisions, not Teacher product decisions.

---

# 13. GA recommendation to CA

GA recommends CA return:

> **PASS_TO_BOUNDED_IMPLEMENTATION_RELEASE_REVIEW**

after incorporating the two narrow material clarifications:

1. explicitly guard NORMAL missing-voter vote expiry inside the accepted classroom window;
2. remove ACT13→S8→ACT14 smoke as a prerequisite for the **first** H-pre while retaining it as mandatory pre-H0/pre-freeze evidence.

These can be incorporated in CA's release-gate instruction or one final document delta without reopening V4 architecture.

GA sees no semantic reason to delay consideration of the first bounded Lane N package once CA is satisfied with the corresponding exact function/grant/rollback/test scope.

No runtime implementation is authorized by this GA response.

NEXT_OWNER = CA — consolidate this review into the single current CA→CD release-gate response.
