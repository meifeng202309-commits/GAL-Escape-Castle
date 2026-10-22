# CA-283 Batch A cross-scene input/discussion diagnosis

Date: 2026-10-22  
Scope: read-only source and existing-test diagnosis; no implementation, SQL, Pages change, or production write  
Baseline: `508ff119ec85939c43e2a9415282e47432c2a820`

## Conclusion

The observations do not have one common functional cause. There are three confirmed client render-state defects, one intended phase gate that is easy to misread, and one related Teacher-console scroll defect:

1. **Library combination — confirmed draft/focus loss (P1 playability).** Every confirmed 1.2-second player frame calls `renderSprint3b`, and the `library_box` branch replaces `sprint3bActions.innerHTML`, including `#libraryCode`. There is no capture/restore equivalent to CA282. A partially typed suffix and its focused node are destroyed on every poll. The submit handler and server-side locked prefix remain valid; this is not evidence of an incorrect combination or rejected authoritative action.
2. **Sprint 6 discussion — confirmed draft/focus loss once discussion exists (P1 playability).** `renderSprint6` rebuilds all of `sprint3bActions` on every confirmed poll. `sprint6Discussion` puts `#s6MessageText` inside that replaced subtree, so an unfinished message and focus are lost. This affects `act9_discussion`, `act10_discussion`, and `act11_discussion`. It does not prove that a discussion form should exist during the preceding private-choice phase.
3. **ACT12 Station A page jump — confirmed residual scroll defect (P1 usability).** CA282 captures value, focus, and selection for `#s6StationValue` and restores focus with `preventScroll:true`, but `renderSprint6` still replaces both scene and action subtrees and captures neither window scroll nor a stable viewport anchor. The field is therefore editable now, but a same-identity poll can still disturb the page position. CA282 was deliberately Station-A-only and must not be described as a general polling fix.
4. **ACT10 Golden Key sequence — intended two-stage gate, with an overlapping input defect (not a vote-semantic defect on current evidence).** `act10_private` accepts one private Take/Leave choice per player and intentionally has no discussion form. Only the third accepted private choice creates the 300-second `act10_discussion`; while it is active, the message form should render, but item 2 can make typing appear unavailable. The Continue control is intentionally disabled until its deadline, and the owned-discussion refresh then advances to `act10_final_vote`. The three final group votes resolve Take/Leave and set the Golden Key branch. Thus “all chose Take, then waited” can be either the expected private-choice → timed-discussion boundary or the confirmed discussion draft-loss defect; without the screenshot's exact `phase_key` it is not evidence that committed final votes were ignored.
5. **Teacher transcript — confirmed independent scroll reset (P1 operational usability).** Teacher polling runs every 1.2 seconds and `renderDiscussionState` replaces `discussionState.innerHTML`, recreating `.teacher-transcript` without restoring its scroll position or following newly appended messages. This explains inability to remain at the newest messages; it is separate from the player-side message composer.

## Exact source paths and conditions

- Player poll coordinator: `src/game/app.js:292-337`, `343-354`; complete frames commit every 1.2 seconds without overlap.
- Frame dispatch: `src/game/app.js:229-266` calls the active renderer after every confirmed frame.
- Library replacement: `src/game/app.js:483-527`, especially the `library_box` form at line 508 and `sprint3bActions.innerHTML` at line 523.
- Sprint 6 discussion replacement: `src/game/app.js:594`, `621`; the form exists only when `payload.discussion` exists, then the containing action subtree is replaced.
- Station A limited preservation: `src/game/app.js:619-621`; identity is run/phase/step/round plus A allocation/task state, but no viewport state is preserved.
- ACT10 authoritative transition: `database/035_sprint6_focused_audit_corrections.sql:30-42,44-59`; third private choice opens a 300-second discussion, discussion completion advances to `act10_final_vote`, and three group choices resolve the branch.
- Deadline owner: `database/037_level3_independent_audit_closure.sql:141-152`; expired ACT9/10/11 discussion advances to its next canonical phase.
- Teacher polling and transcript replacement: `src/teacher/teacher-console.js:96-112,198-254`.

## Smallest repair boundary

Keep the serialized polling coordinator, phase semantics, RPC identities, vote semantics, SQL, and timers unchanged.

- In `src/game/app.js`, add narrowly keyed capture/restore for the pending Library code and Sprint 6 discussion draft/focus/selection. Restore only when the authoritative run/scene-or-phase/session/prefix identity is unchanged; discard on accepted completion or identity change.
- Extend the existing Station A same-identity preservation with viewport/anchor restoration, without carrying scroll across an authoritative phase/task change.
- In `src/teacher/teacher-console.js`, preserve transcript scroll intent: follow new messages only when the operator was already near the bottom; otherwise retain the operator's current anchored position.

These are two small client files. No broad polling rewrite, framework, prompt, vote, timer, schema, migration, or production-data change is necessary.

## Focused browser regression proposals

1. **Library draft test:** type a partial suffix, commit two identical `library_box` frames, and assert value/focus/selection survive; then change locked prefix or phase and assert stale draft is not restored; finally submit through the real handler.
2. **Sprint 6 phase-gate/message test:** assert no message form before the third `act10_private` choice; after an `act10_discussion` frame, type a draft across two same-session polls and submit through the real handler; change discussion session/phase and assert the draft is discarded and final-vote controls replace it.
3. **Scroll-intent test:** for Station A, keep a non-top viewport across same-identity polls while value/focus survive, then allow authoritative phase change to navigate normally; for Teacher transcript, verify near-bottom follows an appended message while a deliberately scrolled-up operator remains at the same content anchor.

## Limit

The Teacher PPT was not Git-reachable in this checkout. The CA-transcribed observations are sufficient to identify the deterministic render paths above, but the Golden Key screenshot cannot be assigned to `act10_private` versus `act10_discussion` without its runtime phase metadata. No stronger claim is made.
