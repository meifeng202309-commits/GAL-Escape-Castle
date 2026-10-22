# CA-284 ACT10 Teacher Open Vote narrow proposal

Date: 2026-10-22  
Status: proposal only — requires CA review and Teacher approval before SQL/source implementation or release

## Current gap

The Teacher console Open Vote path supports only Sprint 2 and Sprint 5. `openVote()` chooses `s5_teacher_open_vote` when `sprint5TeacherActive`, otherwise `s2_open_vote`; it has no Sprint 6 state projection or RPC. ACT10 is owned by `s6_run_state` and `discussion_sessions`:

- three accepted `act10_private` choices create a 300-second `act10_discussion`;
- `s6_refresh_owned_discussion` automatically converts an expired discussion to `act10_final_vote`;
- the player final-vote UI and `s6_submit_group_choice_v2` already enforce `act10_final_vote` and preserve Golden Key branching.

Calling the existing Sprint2/Sprint5 endpoint cannot safely authorize ACT10 and must not be reused by name alone.

## Proposed minimal contract

One additive migration plus the smallest Teacher-console routing change:

1. Add `s6_get_teacher_discussion_state(room, teacher_token)` returning the current active run identity, run mode, exact S6 phase/step/round, and the current Sprint6 discussion identity/status/messages. It is a projection only.
2. Add `s6_teacher_open_vote(room, teacher_token, expected_run_id, expected_phase, expected_step, expected_round, expected_discussion_session_id)` restricted to `act10_discussion`. Lock and verify the active run, S6 state, and exact open discussion. Resolve that discussion with an explicit Teacher-open outcome, clear its deadline, atomically set `s6_run_state.phase_key='act10_final_vote'`, and append a non-behavior-scoring Teacher intervention/event. Stale or repeated identities reject without changing state.
3. For NORMAL ACT10 only, create the discussion with `phase_deadline=null` and prevent `s6_refresh_owned_discussion` from automatically advancing it. Keep ACT9/ACT11 and AUDIT behavior unchanged. `s6_send_message_guarded` must treat a null deadline as open rather than expired.
4. Teach `teacher-console.js` to prefer the active S6 projection when its phase is `act10_discussion`, render that exact discussion, and route Open Vote to the new guarded RPC with the rendered identities. Do not expose Open Vote for `act10_private`, other S6 phases, a closed discussion, or stale state.
5. Preserve the existing `act10_final_vote` player UI/RPC and Golden Key result logic unchanged. No private-choice, final-vote, choice-history, or export rewrite is needed.

If a deployment ever finds an already-open NORMAL ACT10 discussion, the migration/release procedure must first read it and, only under separately approved live scope, reconcile that exact session to `phase_deadline=null`; do not bulk-update historical discussions.

## Meaningful tests

1. **No premature vote:** after one or two private choices, no ACT10 discussion or final-vote controls exist. After the third, NORMAL remains in `act10_discussion` with no deadline; repeated player/Teacher reads and elapsed wall time do not advance it. A direct player final-vote RPC is rejected.
2. **Guarded Teacher transition:** a stale run/phase/step/round/session request is rejected with no row changes. The exact current Teacher request resolves one discussion, logs one intervention, and exposes `act10_final_vote`; a repeat request cannot create a second transition.
3. **Preserved outcome/history:** three final votes still resolve Take and Leave through the existing handler, set the four Golden Key branch flags correctly, retain all three private choices/messages/final votes, and preserve integrity/export obligations. AUDIT retains its bounded automatic timing as the negative control.
4. **Teacher browser routing:** ACT10 discussion selects only `s6_teacher_open_vote` with all rendered identities; ACT10 private and non-S6 states cannot send it; existing Sprint2/Sprint5 Open Vote tests remain green.

## Recovery and release boundary

The eventual migration should include exact prior S6 function bodies and grants for recovery. Any production application, live session reconciliation, or Pages deployment requires a separate authorization after source/SQL audit. This proposal performs none of them.
