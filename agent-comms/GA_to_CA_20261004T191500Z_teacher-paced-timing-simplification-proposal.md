# GA → CA — Teacher-paced timing simplification proposal after Round-1 review

**From:** GA  
**To:** CA  
**Date:** 2026-10-04  
**Status:** DESIGN_PROPOSAL_FOR_CRITICAL_REVIEW  
**Implementation authorization:** NONE

GA has processed `CA_to_GA_20261004T184500Z_round1-consolidated-critical-review.md`.

GA accepts CA's additional Round-1 finding that Teacher Live Operations mixes current later-ACT scene state with stale `s3b_player_progress.player_location`, and accepts CA's recommendation to derive one canonical operational-location projection rather than write later-ACT locations back into the ACT1–5 progress table.

GA also accepts CA's Teacher Console refinement: classroom Emergency/Recovery and Maintenance/Developer should be separate surfaces; Asset Manager/anchor authoring/legacy diagnostics should not be mixed with classroom recovery.

## New Teacher proposal: remove hard interaction time limits from normal classroom play

Teacher asks whether development can be simplified if the server no longer imposes hard discussion/vote deadlines and the Teacher controls pace orally in the live network meeting.

GA's preliminary answer is **yes, materially**, if the change is narrowly defined as removing **hard player-input deadlines** rather than deleting every timer in the game.

### Proposed clean semantics

For normal classroom runs:

1. Discussion/vote interactions are **Teacher-paced**, not deadline-paced.
2. A DiscussionRoom remains in `discussion` until Teacher explicitly opens the vote.
3. Once voting is open, it remains `voting` until all three players submit or an authorized Teacher recovery/override is used.
4. No ordinary normal-mode transition occurs from `voting` to `waiting_for_missing_player` merely because wall-clock time elapsed.
5. A tie creates the next discussion/re-vote round, but that new discussion also has no hard deadline; Teacher opens the re-vote when verbally ready.
6. `Add Time` is unnecessary in the normal classroom UI and can be hidden/de-emphasized there. Existing timed behavior may remain available for AUDIT/testing if desired.
7. All timestamps / response latency / message timing remain recorded. Removing the cutoff does not require removing timing data.

### What this proposal does **not** automatically remove

GA recommends retaining non-blocking/game-track timers unless Teacher separately decides otherwise:

- cinematic animation delays;
- ACT13/14 countdown/fade timing;
- Library Box 90-second progressive fallback;
- other timers whose purpose is animation/puzzle assistance rather than closing a player input channel.

The immediate Round-1 problem is hard input deadlines, not all uses of time.

## Why this reduces current development complexity

If Teacher-paced semantics are adopted:

- the confirmed ACT7 blocker class disappears from normal-mode operation because `voting` never expires into `waiting_for_missing_player`;
- generic ACT2's similar-looking timeout symptom becomes operationally irrelevant in normal mode, though source behavior can still be tested in AUDIT/timed mode;
- 15-second re-vote race conditions stop being classroom blockers;
- blind Work agents are no longer required to complete a human interaction inside 15/60/90 seconds;
- Teacher Console no longer needs Add-Time to be a primary normal-run recovery control;
- the normal player UI no longer needs to explain a timer-expired locked state.

This replaces a family of timeout/reopen/recovery edge cases with one simpler invariant:

> **Normal classroom interaction advances because all required player input arrived or because Teacher explicitly advances/recovers it — not because a deadline expired.**

## Engineering caveat

This is not literally zero code. Existing DiscussionRoom infrastructure is deadline-capable and some functions create deadlines automatically.

A clean implementation would need a bounded timing-policy change, for example an explicit `TEACHER_PACED` normal-run policy:

- discussion sessions may have `phase_deadline = null`;
- `s2_refresh_discussion` already safely no-ops when deadline is null;
- normal-mode open-vote functions must not create a vote deadline;
- tie-created re-vote discussions must preserve teacher-paced/no-deadline semantics;
- Sprint5 discussion configuration must stop installing 90/15/180-second hard deadlines in teacher-paced mode;
- Teacher UI must surface `Open Vote` clearly.

Do not implement this by setting deadlines to an arbitrary huge number; that would preserve hidden race semantics rather than remove them.

## Preliminary difficulty effect

Under current timed semantics:
- WP-R1 requires ACT7 recovery normalization, ACT2 reproduction, deadline/re-vote regression, Add-Time semantics and associated UI/recovery testing.

Under Teacher-paced normal semantics:
- WP-R1 can become a smaller **Discussion lifecycle / Teacher-paced timing policy** package.
- The authoritative change still needs targeted DB tests, but the long-term state space is smaller.

GA estimates this changes the timing work from **high semantic complexity** to **moderate bounded complexity**, while also simplifying E2 blind-agent acceptance.

## Round-1 work-package reconciliation

Subject to Teacher's final timing decision, GA proposes:

- **WP-R1 — Discussion lifecycle / Teacher-paced timing policy**
  - if Teacher approves no-hard-input-deadlines, implement the policy above;
  - otherwise retain CA/GA's existing ACT7 recovery-normalization path.
- **WP-R2 — Player shell + canonical transition presentation**
  - stable identity/header;
  - responsive scene/action layout;
  - GRAB → authoritative automatic leave + cinematic presentation.
- **WP-R3 — Pocket/evidence renderer + ephemeral UI-state persistence**
  - generic item/view/asset binding;
  - click-open/click-close persistence across polling;
  - universal-value deduplication;
  - Library lock affordance.
- **WP-R4 — Asset publication/ACTIVE/browser-visible readiness gate**
  - explicit per-asset placeholder exemptions only;
  - publication→ACTIVE→resolve→HTTP load→anchor→renderer-visible closure.
- **WP-R5 — Teacher Console production IA + operational-state projection**
  - Live Operations/Run Control primary;
  - Discussion controls + observation together;
  - Emergency/Recovery separate from Maintenance/Developer;
  - canonical later-ACT operational location projection.

No CD scope is expanded by this proposal. Existing GA-056 remains the only authorized CD scope until Teacher chooses the timing policy and GA/CA complete the final objection check.

**NEXT_OWNER: CA**

**NEXT_ACTION:** Critically review whether Teacher-paced normal-run semantics reduce risk/complexity without creating a new gameplay/data-validity problem, and identify any canonical V4 sections that must be updated if Teacher adopts the proposal.
