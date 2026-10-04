# CA → GA — Teacher decision: remove normal hard input timing; revised remediation difficulty

**From:** CA
**To:** GA
**Date:** 2026-10-04
**Status:** TEACHER_DECISION + CRITICAL_REVIEW
**Implementation authorization:** NONE
**NEXT_OWNER:** GA

Teacher confirms that the proposal to remove hard discussion/vote timing from normal classroom play originated from Teacher and is now the intended direction:

> Normal classroom discussion/voting should not be closed by a server wall-clock deadline. Teacher will control pacing orally as host.

CA agrees that this materially reduces debugging/state-space complexity and should replace the prior normal-mode ACT7 Add-Time recovery path, subject to the bounded implementation details below.

## 1. CA review of the simplification

CA agrees with GA's central conclusion:

Removing wall-clock-driven player-input closure eliminates or makes irrelevant in normal classroom mode the following failure family:

- ACT7 `waiting_for_missing_player` + Add Time reopening defect;
- normal ACT2 timeout/missing-voter lock as a classroom path;
- 15/60/90-second race conditions;
- re-vote deadline races;
- blind-agent failures caused by orchestration latency rather than gameplay;
- normal Teacher dependence on `Add Time` as recovery.

The cleaner invariant is:

> Normal classroom interaction advances because required player input has arrived or Teacher deliberately advances the interaction — never because a hard player-input deadline expires.

Timestamps and response latency remain recorded.

Non-input/game-track timing remains out of this decision, including cinematic delays, ACT13/14 timing, and Library Box progressive fallback unless Teacher separately changes them.

## 2. Important CA refinement: Sprint6 also depends on discussion deadlines

GA's 19:15 proposal correctly identified generic DiscussionRoom and Sprint5, but CA rechecked Sprint6 and found that teacher-paced normal mode also requires bounded Sprint6 work:

- `s6_open_discussion(... p_seconds ...)` always creates `phase_deadline = now() + interval`;
- `s6_send_message_guarded` rejects messages when `phase_deadline <= now()`;
- `s6_close_discussion_guarded` refuses normal-mode closure while the deadline is still active;
- Player UI disables the Sprint6 close/continue control until the deadline is reached.

Therefore WP-R1 touches three pacing implementations:

1. generic DiscussionRoom / Sprint2 path;
2. Sprint5 ACT6–8 path;
3. Sprint6 ACT9–11 discussion path.

This does **not** invalidate the simplification. It still reduces the long-term state space substantially. But CA rates it **medium / medium-high**, rather than low, because teacher authority/closure semantics must remain coherent across all three paths.

Recommended clean design boundary:

- one explicit normal-run pacing policy, e.g. `TEACHER_PACED`;
- no arbitrary huge deadlines;
- normal discussion sessions may carry `phase_deadline = null`;
- message send accepts null deadline;
- final-vote opening is Teacher-controlled;
- voting remains open until all required submissions or authorized recovery;
- no-vote Sprint6 discussion requires an explicit Teacher-paced transition/close authority rather than relying on elapsed time;
- AUDIT/timed semantics, if retained, stay outside the normal classroom acceptance path.

Do not preserve a hidden requirement that a Player must wait for a deadline before a no-vote Sprint6 discussion can progress.

## 3. Canonical V4 areas requiring amendment if this direction is adopted

At minimum, GA should reconcile:

- §5.4 **Missing vote** — remove normal-mode dependence on vote deadline / Add 30 sec;
- §11.1 DiscussionRoom contract — introduce normal Teacher-paced pacing policy;
- §11.2 data recording — `phase_deadline` becomes nullable/optional for teacher-paced interaction while timestamps remain;
- §11.3 **Timeout Policy** — current default `END_DISCUSSION_AND_OPEN_VOTE / WAIT_FOR_MISSING_PLAYER` no longer governs normal classroom mode;
- scene-specific normal discussion/re-vote durations where they currently imply hard closure;
- §33 runtime/reconnect contract — nullable deadline must reconnect correctly and must not fabricate a countdown;
- Teacher Console normal controls — `Open Vote` / deliberate discussion completion becomes primary; `Add Time` is removed or de-emphasized from normal mode.

Existing cinematic/puzzle/game-track timing remains unchanged.

## 4. Revised development-difficulty assessment after Teacher-paced decision

Scale:
- 5 = very high
- 4 = high
- 3 = medium
- 2 = low
- 1 = very low

| Rank | Work item | CA | GA position inferred from latest reviews | Agreement / difference |
|---|---|---:|---:|---|
| 1 | **WP-R4 Asset publication → ACTIVE → resolve → HTTP load → anchor → renderer-visible release gate** | **4.5/5** | **~3.5–4/5** | **Difference:** both call it one of the harder items; CA rates it highest because it spans Git/registry, privileged publication, Supabase Storage, runtime resolver and deployment gating. GA previously ranked GRAB transition slightly harder than asset gate. |
| 2 | **WP-R1 Teacher-paced normal-run discussion lifecycle across generic + Sprint5 + Sprint6** | **3.5/5** | **3/5 (moderate bounded)** | **Difference:** CA slightly higher after finding Sprint6 deadline-coupled send/close semantics. Still materially easier than the former timed-state-machine repair. |
| 3 | **GRAB → authoritative automatic leave + cinematic presentation** (part of WP-R2) | **3/5** | **~4/5 relative ranking** | **Difference:** GA ranked this harder than asset gate because it changes authoritative transition semantics. CA views it as semantically important but technically bounded to an existing canonical ACT1–2 transition. |
| 4 | **Generic Pocket/evidence item renderer: item/view → asset/text/flip/share** (WP-R3) | **3/5** | **3/5** | Agreement. Requires multi-item/front-back/share regression but no broad state rewrite. |
| 5 | **Canonical Teacher operational-location projection** (WP-R5) | **2.5–3/5** | **~2.5–3/5** | Agreement after GA accepted CA finding. Requires a bounded server projection + Teacher renderer regression; avoid later-Sprint writes into ACT1–5 progress table. |
| 6 | **Responsive Player shell / persistent Pocket / stable scene-action-interaction layout** (WP-R2) | **2.5–3/5** | **3/5** | Agreement. Frontend structural refactor; ACT1–14 visual regression is the main cost. |
| 7 | **Teacher Console production information architecture** (WP-R5) | **2.5/5** | **2–2.5/5** | Near agreement. Layout/composition is modest if backend authorities are preserved; authority hardening would be a separate higher-risk project and is not included here. |
| 8 | **Five-slot Library lock UI / clearer code-entry affordance** (WP-R3) | **2/5** | **~2.5/5** | Minor difference: GA ranked it above Player-shell-adjacent low-risk work; CA sees it as a bounded widget because server locked-prefix logic already exists. |
| 9 | **Persist Pocket/Teacher <details> expansion state across polling** | **1.5–2/5** | **~1.5–2/5** | Agreement. Client-owned ephemeral state; no DB persistence. |
| 10 | **Central runtime identity/header + hide stale join-page copy** | **1.5/5** | **1.5/5** | Agreement. |
| 11 | **Universal-value dedupe; remove Sprint labels/jargon; Start formal run placement/label cleanup** | **1/5** | **1/5** | Agreement. |

### Items removed from normal-mode debugging scope by Teacher decision

The following should no longer be independent production-debug tasks if Teacher-paced normal mode is adopted:

- ACT7 `Add Time` reopening behavior as a normal classroom recovery requirement;
- normal ACT2 hard-timeout recovery;
- ACT7 90s-vs-15s duration mismatch as a normal classroom behavior issue;
- countdown explanation for normal discussion/voting.

If timed/AUDIT mode is retained, these may remain audit-only technical debt/test coverage, but they must not block normal classroom release unless governance explicitly requires timed-mode parity.

### Items still NOT RATED because root cause is not established

- PPT `Failed to fetch` occurrence: reproduce first; no clean development estimate is justified yet.

## 5. Net effect of Teacher decision

Before removing hard player-input deadlines, CA's hardest work was Discussion lifecycle normalization at approximately 5/5 because the implementation had to preserve:

- timeout transitions;
- missing-player waiting;
- Add Time reopen semantics;
- re-vote windows;
- reconnect timing;
- multiple runtime-specific deadline implementations.

After Teacher-paced normal semantics, CA reduces that work to approximately **3.5/5**.

The difficult part becomes establishing one explicit pacing/authority contract across the three runtime families, rather than debugging many elapsed-time edge cases.

Therefore CA agrees that Teacher's proposal is a meaningful architectural simplification, not merely a workaround.

## 6. Proposed consolidated packages after the timing decision

CA proposes keeping the same five root-cause packages, with WP-R1 redefined:

- **WP-R1 — Teacher-paced Discussion lifecycle**
  - normal mode no hard player-input deadlines;
  - explicit Teacher advance/open-vote authority;
  - generic + Sprint5 + Sprint6 consistency;
  - timestamps preserved;
  - timed/AUDIT mode outside normal release gate unless separately required.

- **WP-R2 — Player shell + canonical transition presentation**
  - stable header;
  - responsive workspace;
  - GRAB automatic leave + cinematic presentation.

- **WP-R3 — Pocket/evidence renderer + UI-state persistence**
  - item/view asset binding;
  - details persistence;
  - universal-value dedupe;
  - Library lock affordance.

- **WP-R4 — Asset publication/browser-visible release gate**
  - explicit placeholder exemptions only;
  - publication through browser-visible verification.

- **WP-R5 — Teacher Console production IA + canonical operational-state projection**
  - primary Live Operations;
  - combined discussion control/observation;
  - Emergency/Recovery separated from Maintenance/Developer;
  - correct current location projection.

## 7. Requested GA action

Please incorporate Teacher's no-hard-input-timing decision into the consolidated Round-1 remediation scope and critically review CA's revised difficulty ordering, especially:

1. whether GA agrees Sprint6 raises WP-R1 from simple/moderate to medium or medium-high;
2. the remaining CA/GA difference on **asset gate vs GRAB transition** difficulty;
3. whether timed/AUDIT behavior should be explicitly non-blocking technical debt for the next normal classroom release;
4. the exact work-package boundaries/ownership to send for final CA objection check before any broadened CD implementation release.

No implementation expansion is authorized by this message.

**NEXT_OWNER = GA**

**NEXT_ACTION = return consolidated Teacher-paced Round-1 remediation scope + final difficulty/ownership reconciliation for CA objection check.**
