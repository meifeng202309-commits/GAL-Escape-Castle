# CD Teacher Clarifications — Minimal-Impact Debug Plan V1

**Date:** 2026-10-09

**Owner:** CD

**Status:** PROPOSAL FOR GA SEMANTIC REVIEW AND CA TECHNICAL AUDIT

**Implementation authorization:** NONE

**Repository basis:** `b3fd69e5a2e3a98c7e995e02d2eea8e93472669a`

This plan incorporates the Teacher's decisions on the eight Round III issues. It deliberately changes no runtime code. Implementation remains held until GA and CA return targeted reviews.

---

# 1. Confirmed Teacher decisions

1. Discussion in normal classroom mode is Teacher-paced. A timer may remain for compatibility or display, but reaching zero must not change game state.
2. The normal classroom path does not need an automatic test mode. Existing audit-only automatic behavior may remain solely when retaining it reduces regression risk.
3. Add Time has no normal-mode purpose after timer-driven progression is removed; hide/remove it from the normal Teacher controls.
4. ACT7 wrong majority must remain distinct from ordinary majority.
5. ACT3 keeps the already designed server-side three-second rejection window and idempotent request behavior. The UI displays only the canonical success/failure result, not a cooldown message.
6. Every cross-view result receives a unique occurrence ID and a server-defined three-second display window.
7. ACT2 Follow Sign directly changes the Player location to Library. Teacher UI then displays the existing-program-language equivalent of “<Player> entered Library.” No intermediate “saw sign / rerouting” state is added.
8. TOP late-request analysis is removed from this work package at Teacher direction.
9. Teacher Player-status display is state-level, not an event-by-event action log.

---

# 2. TOP backup-data proposal — CD evaluation

## 2.1 The proposal can work only in a constrained form

GA's `backup_story` concept is potentially viable if it means:

> a server-owned, versioned recovery manifest for one exact destination TOP and branch, applied transactionally by the authorized Teacher Override path, while preserving real rows and separately recording every provisioned fact as recovery data.

It is not safe if it means:

- a client-submitted JSON/script payload;
- a universal “fill anything missing” routine;
- overwriting conflicting real Player facts;
- inserting fake Player votes/messages/actions;
- granting every possible item;
- setting only `act_no` and letting later code infer the rest.

## 2.2 Material risks

### Risk A — “missing data” is not a simple condition

A target ACT may have:

- an absent prerequisite;
- a partially completed prerequisite;
- a real but contradictory branch choice;
- an old open Discussion;
- a prepared but inactive later-domain row;
- a real Player action whose response was lost to the browser.

A generic filler must decide which of these to preserve, close, reject or supplement. That decision is gameplay-specific and can become the prohibited second state machine.

### Risk B — branch and resource explosion

Later TOPs depend on combinations such as:

- Golden Key TAKE/LEAVE;
- station C versus WATCHER;
- Silver Key and Flashlight obligations;
- private clues and revealed choices;
- allocation, task and engagement completion;
- route-dependent Pocket/Knowledge facts.

One backup record per ACT is insufficient. Either GA supplies exact branch-specific manifests, or the recovery code must invent a branch.

### Risk C — provenance cannot be an afterthought

Existing choice, vote, inventory and progress tables often represent Player facts. Writing recovery values into them without a durable source association makes backup facts indistinguishable from real behavior.

At minimum every provisioned semantic fact must be traceable to:

- `override_id`;
- destination TOP and manifest version;
- fact/table/key provisioned;
- value;
- reason;
- behavioral validity;
- creation time.

Where an existing canonical table cannot carry source safely, use a recovery-provision sidecar tied to the Override instead of pretending the row is Player-authored.

### Risk D — integrity/export behavior changes

Finalization currently verifies concrete domain rows. A backup-filled run must not automatically become fully verified. Export must distinguish:

- genuine Player fact;
- Teacher recovery outcome;
- missing fact acknowledged by Override;
- unresolved contradiction.

This requires verifier/export work for every fact class provisioned by a TOP.

### Risk E — repeated NEXT-TOP composition

Round III proposes repeated jumps through consecutive TOPs. Manifest N+1 must be safe whether the prior state came from:

- real gameplay;
- manifest N;
- a mix of real and recovered facts.

Every manifest therefore needs idempotency, version compatibility and explicit prerequisites. Individually plausible manifests can still compose into an invalid run.

### Risk F — migration and schema drift

A backup script written for one schema can silently become incomplete when later migrations add new required rows, columns, resources or validity rules. Each manifest must declare the code/schema version it supports and fail closed on mismatch.

### Risk G — transaction and trigger side effects

Provisioning may touch S3B, S5, S6, Discussion, Pocket/Knowledge, events and finalization dependencies. Partial success is unacceptable. All changes for one TOP must commit or roll back together, while domain triggers and unique constraints must not create duplicate side effects.

### Risk H — privacy and narrative leakage

Backup private clues or choices must be distributed with the same Player visibility rules as real gameplay. A convenient shared recovery object cannot be returned wholesale to all Players.

## 2.3 Safe constrained design

If all thirteen TOPs remain required, CD proposes:

1. GA owns one exact semantic manifest per destination TOP and branch.
2. Manifests are immutable server-side definitions, not client payloads.
3. Teacher requests only `NEXT_TOP` plus current expected source identity and reason.
4. Server selects the allowed destination and manifest; client never supplies arbitrary rows or values.
5. Real committed rows are preserved.
6. Missing facts are provisioned only when explicitly listed by the manifest.
7. Contradictory real facts cause a fail-closed result unless the manifest has an approved reconciliation rule.
8. Recovery facts use `teacher_override_recovery` provenance and do not masquerade as Player submissions.
9. One transaction closes the old interaction, applies provisioned facts, creates the destination state and records provenance.
10. Finalization reports partial/override validity honestly.
11. Repeated TOPs are tested sequentially, not assumed composable.
12. Every manifest has fresh-run, partial-run, reconnect, repeat-click and export vectors.

Even under this design, the full thirteen-TOP programme remains approximately `5/5`. Backup data reduces semantic ambiguity only after GA supplies it; it does not remove implementation, integrity and regression work.

## 2.4 Lower-cost alternative

Use the same manifest mechanism for only:

- a small number of domain-boundary TOPs; and
- concrete trial blockers.

That retains the useful part of `backup_story` without building thirteen branch-complete recovery compositions before evidence shows they are needed.

---

# 3. Discussion minimal-impact implementation plan

## 3.1 Design rule

For a normal classroom run:

> time reaching zero has no server transition effect.

The deadline may be null, or may remain informational for compatibility. The Teacher explicitly opens voting or ends the S6 discussion.

For minimal regression risk, do not delete shared functions or columns. Make normal-mode behavior inert while preserving old audit behavior only where existing automated tests genuinely require it.

## 3.2 Why not drop `s2_refresh_discussion` globally

That function is called by multiple read paths and also contains legacy vote-wait handling. Dropping it or changing its signature would widen the change surface and could break callers unrelated to the normal Teacher-paced requirement.

Preferred change:

- retain the function/signature;
- resolve the discussion's run mode;
- for NORMAL, return without changing discussion/vote state;
- for retained AUDIT compatibility, keep existing deterministic behavior;
- separately ensure normal read paths never depend on the function to progress.

This satisfies “deactivate or reduce to minimum” with smaller blast radius.

## 3.3 Generic Discussion and S5

1. Replace the repository-last effective `s2_refresh_discussion` through a new forward migration; NORMAL becomes no-op for lifecycle transitions.
2. Make newly created/configured NORMAL discussions use `phase_deadline = null`, unless keeping a display-only timestamp is demonstrably cheaper.
3. Modify `s2_open_vote` and `s5_teacher_open_vote` to remain the only normal Teacher actions that open voting.
4. Bind Teacher action to the exact current discussion identity; do not select an arbitrary stale “latest” discussion.
5. In NORMAL voting, do not auto-change state when a vote deadline expires.
6. Preserve the current “missing Player remains pending” state until the Player votes or a separately authorized recovery action is used.
7. Remove/hide Add Time from normal Teacher UI.
8. Keep `s2_add_time` deployed only for backward/audit compatibility if removal increases risk. In NORMAL it returns not applicable and cannot mutate state.

“No current discussion” means a stale browser or direct RPC calls Add Time/open vote after the discussion has already ended or changed. The normal UI should not show the button, but the server must still reject the stale call safely. No special Teacher-facing workflow is needed beyond the normal error/status message.

## 3.4 S6 Discussion

1. Replace the effective `s6_refresh_owned_discussion` behavior so NORMAL reads cannot advance ACT9/10/11.
2. Remove its state-changing effect from `s6_get_player_state` in NORMAL.
3. Add one Teacher-authorized S6 completion function bound to run, phase, step, round and discussion session.
4. Server-reject Player `s6_close_discussion_v2` in NORMAL; hiding the button alone is insufficient.
5. Remove the Player continue/close button in NORMAL and show a waiting-for-Teacher state.
6. Add the Teacher control only while an applicable S6 discussion is current.
7. Retain Teacher-token verification, fixed search path and internal-helper revocation.

## 3.5 Timer and Add Time UI

Normal classroom UI:

- no Add Time button;
- no timer is required;
- if a timer remains for compatibility, reaching zero changes only its visual state and never enables Player progression or changes server state.

Audit/test compatibility:

- keep automated deadline behavior only if it materially reduces changes to the existing automated suite;
- do not expose it as the normal classroom contract.

## 3.6 Commit sequence

```text
C0 tests describing the new NORMAL no-auto-transition contract
C1 generic/S5 mode-aware no-op + exact Teacher vote action
C2 normal Teacher UI removal of Add Time/timer dependency
C3 S6 mode-aware no-op + Teacher completion mutation
C4 Player S6 close removal/server rejection
C5 regression updates for NORMAL and retained AUDIT behavior
```

Generic/S5 and S6 remain separate migrations and commits because their progression logic differs.

## 3.7 Acceptance tests

1. NORMAL generic discussion remains open after its former deadline.
2. NORMAL S5 discussion remains open after its former deadline.
3. NORMAL S6 discussion remains open after its former deadline and repeated Player reads.
4. Teacher opens the exact generic/S5 vote.
5. Teacher ends the exact S6 discussion.
6. Player cannot end S6 NORMAL discussion through UI or direct RPC.
7. Add Time is absent from NORMAL UI and cannot mutate NORMAL through direct RPC.
8. A stale Teacher action cannot affect a newer discussion.
9. Missing Player remains visibly pending; no deadline creates a synthetic result.
10. reconnect restores the same discussion identity and transcript.
11. retained AUDIT deadline behavior passes only if intentionally preserved.
12. unrelated S3B/S5/S6 progression and finalization regression remains green.

## 3.8 Complexity

- generic/S5 database behavior: `2/5`;
- S6 database behavior: `3/5`;
- two frontends: `2/5`;
- cross-flow regression: `4/5`;
- combined package: `3–4/5` because the changes overlap but the regression matrix remains broad.

---

# 4. Other accepted implementation decisions

## ACT7

Persist one result kind without outer-wrapper reclassification. Keep wrong majority distinct, retain the previous resolved round after the next opens, and attach the common result occurrence ID/window.

## ACT3

Reuse the existing attempts table, request UUID, replay lookup and run/state locks. Reject new unique input during the server three-second window. The frontend continues showing only the current success/failure occurrence and suppresses any extra cooldown wording.

## Cross-view results

Each domain publishes a UUID occurrence ID plus server start/end time. The display window is three seconds. Three Players and Teacher deduplicate by the same ID and use the same server end time.

## ACT2 Follow Sign

No intermediate sign/rerouting state. Successful Follow Sign immediately yields Library location; Teacher UI uses existing localized room/action wording.

## Teacher Player-state display

Project only current state-level categories: location/transition, discussion/vote waiting/submitted, puzzle active/result, group barrier waiting, Main Gate assignment/task/engagement, escape/finalized and connection state. Read current domain columns, not the latest event.

---

# 5. Review requests before implementation

## GA review

1. Confirm whether `backup_story` means immutable per-TOP/per-branch recovery manifests rather than generic filler data.
2. Provide the minimum semantic manifest for each requested TOP, or reduce to domain-boundary TOPs.
3. Confirm NORMAL Discussion has no time-driven transition and no normal Add Time requirement.
4. Confirm missing Player remains pending without a deadline-driven fallback.
5. Confirm ACT2 Follow Sign directly means entered Library for Teacher display.

## CA review

1. Challenge whether the mode-aware no-op plan is the lowest-regression modification of the effective functions.
2. Verify exact repository-last functions/callers and identify hidden deadline-triggered transitions.
3. Audit privilege, stale-identity and reconnect behavior of the new Teacher S6 action.
4. Challenge the constrained TOP manifest/provenance design and whether it still creates a second state machine.
5. Approve or revise the commit/migration/test split before CD implementation.

Implementation remains on HOLD pending those responses and subsequent user/authority release.
